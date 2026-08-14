// Cursor arrow: shows a directional arrow above the floor cursor
// (hotspot_mouse), rotating to point in the camera's forward looking
// direction (view.hlookat). The nearest-relevance cache is still kept
// so empty-space clicks navigate to the nearest reachable scene.
//
// Wiring:
// - config.xml registers `hotspot_mouse_arrow_style` and the
//   `add_mouse_arrow` action.
// - index.html calls `add_mouse_arrow()` alongside `add_mouse_pos()`
//   (desktop only).
// - This file extends existing Panorama events (mouse_pos, setviewstate,
//   showFlootHotspot, krpanoChangeCursor) without modifying their
//   handlers in krpanoAPI.js. EventDispatcher.on supports multiple
//   listeners per event.

(function () {
  if (!window.Panorama) return;

  // Chevron (V-shape) — two open strokes meeting at the apex pointing
  // up in the SVG viewBox. Aligned with rz=0 to face north (camera
  // hlookat=0). Flip via CURSOR_ARROW_HEADING_OFFSET=180 if rendered
  // backwards (avoids re-encoding the SVG).
  // Cross-browser notes:
  // - Explicit width/height required: some browsers (Safari, krpano's
  //   image loader) render 0×0 without them and fall back to a black box.
  // - stroke uses hex + stroke-opacity (SVG 1.1) instead of rgba(): older
  //   renderers and krpano's texture loader fail on rgba() inside SVG.
  // - base64-encoded data URL is more reliable than utf8/encodeURIComponent
  //   across krpano + Safari/Firefox combinations.
  var CURSOR_ARROW_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">' +
    '<polyline points="42,54 50,41 58,54" ' +
    'fill="none" ' +
    'stroke="#F16A24" stroke-opacity="0.95" stroke-width="5" ' +
    'stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg>';
  // btoa is safe here because the SVG is pure ASCII (no unicode chars).
  var CURSOR_ARROW_URL =
    'data:image/svg+xml;base64,' + btoa(CURSOR_ARROW_SVG);

  // Multiplier on cursorSize so the arrow's overall size tracks the
  // configured cursor size; 1.0 keeps the SVG (30px style width) at
  // ~2× the cursor disc (15px style width).
  var CURSOR_ARROW_SCALE_FACTOR = 1.0;
  // Flip to 180 if the arrow visually points opposite of the camera
  // forward direction. Depends on how the SVG chevron renders after
  // krpano's rotationorder=zxy + rx-from-hit flatten step.
  var CURSOR_ARROW_HEADING_OFFSET = 0;

  var HS = "hotspot[hotspot_mouse_arrow]";

  // Positions (in current scene's world frame) of all reachable
  // relevance anchors. Rebuilt on every scene change.
  var _relevances = [];
  // Name of the relevance scene nearest to the cursor's current 3D
  // position. Cached on each mouse_pos so the click handler in
  // krpanoAPI.js navigates without recomputing the hit.
  var _lastNearestName = null;

  function arrowExists() {
    return !!(window.krpano && window.krpano.get(HS));
  }

  function rebuildRelevances() {
    _relevances = [];
    if (!window.jydata || !window.krpano || !window.krpano.xml) return;
    var sceneName = window.krpano.xml.scene;
    if (!sceneName) return;
    var scene = window.jydata.scenes.find(function (s) {
      return s.name === sceneName;
    });
    if (!scene || !scene.model || !Array.isArray(scene.relevance)) return;
    var overrides = scene.relevanceOverride || {};
    scene.relevance.forEach(function (link) {
      var target = window.jydata.scenes.find(function (s) {
        return s.name === link;
      });
      if (!target || !target.model) return;
      var pos = overrides[link] || target.position;
      if (!pos || pos.tx == null || pos.tz == null) return;
      _relevances.push({
        name: link,
        tx: pos.tx,
        ty: pos.ty || 0,
        tz: pos.tz,
      });
    });
  }

  function syncVisibility() {
    if (!arrowExists()) return;
    var cursorVisible = !!window.krpano.get("hotspot[hotspot_mouse].visible");
    window.krpano.set(HS + ".visible", cursorVisible && _relevances.length > 0);
  }

  function syncStyle() {
    if (!arrowExists() || !window.jydata || !window.jydata.base) return;
    var baseSize =
      (window.jydata.base.cursor && window.jydata.base.cursor.cursorSize) || 1;
    window.krpano.set(HS + ".url", CURSOR_ARROW_URL);
    window.krpano.set(HS + ".scale", baseSize * CURSOR_ARROW_SCALE_FACTOR);
  }

  // Full 3D Euclidean distance: keeping Y in the metric prevents picking
  // a relevance on a different floor whose XZ projection happens to be
  // close to the cursor.
  function findNearest(x, y, z) {
    var best = null;
    var bestD = Infinity;
    for (var i = 0; i < _relevances.length; i++) {
      var r = _relevances[i];
      var dx = r.tx - x;
      var dy = r.ty - y;
      var dz = r.tz - z;
      var d = dx * dx + dy * dy + dz * dz;
      if (d < bestD) {
        bestD = d;
        best = r;
      }
    }
    return best;
  }

  // Snap arrow rz to current camera hlookat so it always points in the
  // direction the user is looking. Called on mouse_pos, setviewstate
  // and showFlootHotspot. Uses set() rather than tween() because the
  // camera motion itself is already smooth — tweening would lag it.
  function syncHeadingToView() {
    if (!arrowExists() || !window.krpano) return;
    var hlookat = parseFloat(window.krpano.get("view.hlookat"));
    if (isNaN(hlookat)) hlookat = 0;
    window.krpano.set(HS + ".rz", hlookat + CURSOR_ARROW_HEADING_OFFSET);
  }

  function updateOnHit(hit) {
    if (!arrowExists()) return;
    // Sync arrow position with the cursor; copy the floor-surface tilt
    // from the depthmap hit so the arrow lays flat on the floor.
    window.krpano.set(HS + ".tx", hit.x);
    window.krpano.set(HS + ".ty", hit.y);
    window.krpano.set(HS + ".tz", hit.z);
    window.krpano.set(HS + ".rx", hit.rx);
    window.krpano.set(HS + ".ry", hit.ry);
    syncHeadingToView();
    // Maintain nearest-scene cache for the click handler (empty-space
    // clicks navigate to this scene). Independent from arrow rotation.
    if (_relevances.length === 0) {
      _lastNearestName = null;
      return;
    }
    var target = findNearest(hit.x, hit.y, hit.z);
    _lastNearestName = target ? target.name : null;
  }

  // mouse_pos fires after the existing cursor handler in krpanoAPI.js
  // (it registered earlier). Re-running screentodepth keeps coupling
  // minimal and matches the other handler's hit semantics.
  window.Panorama.on("mouse_pos", function (event) {
    if (!window.krpano || !window.krpano.actions) return;
    if (window.krpano.get("measure3d_loop") == true || window.krpano.get("measure3d_loop") === "true" || window.krpano.measure3d_loop === true || window.krpano.overMeasureUI === true) {
      window.krpano.set(HS + ".visible", false);
      return;
    }
    var hit = window.krpano.actions.screentodepth(event.offsetX, event.offsetY);
    if (!hit) return;
    updateOnHit(hit);
  });

  // setviewstate fires on every krpano onviewchanged (config.xml events).
  // Keep the arrow pointing along the camera's current forward direction
  // even when the mouse is idle (drag/pan/keyboard rotation).
  window.Panorama.on("setviewstate", function () {
    syncHeadingToView();
  });

  // showFlootHotspot fires on every scene start (tour.xml/config.xml
  // onstart=showFlootHotspot). Use it as the per-scene refresh signal.
  window.Panorama.on("showFlootHotspot", function () {
    rebuildRelevances();
    _lastNearestName = null;
    syncStyle();
    syncVisibility();
    syncHeadingToView();
  });

  // krpanoChangeCursor fires when the cursor hotspot loads and when the
  // studio editor changes cursor settings — keep the arrow's url/scale
  // in sync with the cursor's.
  window.Panorama.on("krpanoChangeCursor", function () {
    syncStyle();
  });

  // Public API for the click handler in krpanoAPI.js (navigatorNormal).
  // Returns the relevance scene nearest to the cursor's last 3D hit.
  // Prefer this over recomputing in the click handler to avoid drift
  // between the last mouse_pos and click-time screentodepth.
  window.cursorArrowGetLastNearestScene = function () {
    return _lastNearestName;
  };

  // Same nearest-relevance logic used by the arrow, exposed for callers
  // that have a hit point but no live cursor (e.g. mobile touch). Uses
  // 3D distance with relevanceOverride applied, excludes current scene.
  // Returns null if the current scene has no relevance entries.
  window.cursorArrowFindNearestScene = function (x, y, z) {
    if (typeof x !== "number" || typeof y !== "number" || typeof z !== "number")
      return null;
    var t = findNearest(x, y, z);
    return t ? t.name : null;
  };
})();
