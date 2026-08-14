window.readyAddScene = function () {
  window.Panorama.emit("readyAddScene");
  window.Panorama.emit("relevance_update");
};
window.mouse_pos = function (e) {
  window.Panorama.emit("mouse_pos", e);
};
window.sceneLoad = function () {
  window.Panorama.emit("sceneLoad");
  window.Panorama.emit("showFlootHotspot");
};
window.setviewstate = function () {
  window.Panorama.emit("setviewstate");
};
window.startdragpoint = function (name) {
  window.pointname = name;
  window.isDragPoint = true;
};
window.enddragpoint = function (name) {
  window.isDragPoint = false;
  window.Panorama.emit("pointUpdata", name);
  window.Panorama.emit("pointClick", parseInt(name.substring(10)) - 1);
};
window.hotclick = function (id, keep) {
  window.Panorama.emit("hotspotClick", id, keep);
};
window.startdraghotspot = function () {
  window.isDragHots = true;
};
window.enddraghotspot = function () {
  window.isDragHots = false;
  window.Panorama.emit("hotspot_move_end");
};
window.startdragimplant = function (name) {
  window.isDragImpl = true;
  window.Panorama.emit("implantClick", parseInt(name.substring(12)));
};
window.enddragimplant = function () {
  window.isDragImpl = false;
  window.Panorama.emit("implant_move_end");
};
window.move_implant = function (event) {
  var hit = window.krpano.actions.screentodepth(event.offsetX, event.offsetY);
  var hit2d = window.krpano.actions.screentosphere(
    event.offsetX,
    event.offsetY
  );
  window.Panorama.emit("implant_move", [hit, hit2d]);
};
window.move_hotspot = function (event) {
  var hit = window.krpano.actions.screentodepth(event.offsetX, event.offsetY);
  if (!hit) return;
  window.Panorama.emit("hotspot_move", hit);
};
window.move_point_hotspot = function (event) {
  var hit = window.krpano.actions.screentosphere(event.pageX - 60, event.pageY);
  if (hit) {
    console.log(hit.x.toFixed(3), hit.y.toFixed(3));
    window.krpano.set(
      "hotspot[" + window.pointname + "].ath",
      hit.x.toFixed(3)
    );
    window.krpano.set(
      "hotspot[" + window.pointname + "].atv",
      hit.y.toFixed(3)
    );
  }
};
window.clear_screen = function (isShowBtn = true) {
  console.log("1111  clear_screen", isShowBtn);
  window.Panorama.emit("clear_screen", isShowBtn);
};
window.exit_clear_screen = function () {
  window.Panorama.emit("exit_clear_screen");
};
window.krLoadscene = function (scene) {
  window.Panorama.emit("loadscene", [scene, true, 0]);
};

window.krTweenUpdate = function () {
  window.Panorama.emit("krTweenUpdate");
};
window.shade_change = function () {
  window.Panorama.emit("shade_change");
};
window.play_music = function () {
  window.Panorama.emit("play_music");
};
window.pause_music = function () {
  window.Panorama.emit("pause_music");
};
window.play_voice = function () {
  window.Panorama.emit("play_voice");
};
window.pause_voice = function () {
  window.Panorama.emit("pause_voice");
};
window.delete_hotspots = function () {
  window.hideHotspot = true;
  window.Panorama.emit("delete_hotspots");
};
window.show_hotspots = function () {
  window.hideHotspot = false;
};
window.hotspots_change = function () {
  window.Panorama.emit("hotspots_change");
};
window.autorotatestart = function () {
  window.Panorama.emit("auto_rotate_start");
};
window.autorotatestop = function () {
  window.Panorama.emit("auto_rotate_stop");
};
window.autorotatenextscene = function () {
  window.Panorama.emit("autorotatenextscene");
};
window.enterVR = function () {
  window.Panorama.emit("enterVR");
};
window.exitVR = function () {
  window.Panorama.emit("exitVR");
};
window.navigatorNormal = function () {
  window.Panorama.emit("navigatorNormal");
};
window.pano_video_complete = function () {
  window.Panorama.emit("pano_video_complete");
};
window.pano_video_play = function () {
  window.Panorama.emit("pano_video_play");
};
window.pano_video_paused = function () {
  window.Panorama.emit("pano_video_paused");
};
window.pano_video_ready = function () {
  window.Panorama.emit("pano_video_ready");
};
window.krpanoClick = function () {
  window.Panorama.emit("krpanoClick");
};
window.krpanoDClick = function () {
  window.Panorama.emit("krpanoDClick");
};

window.videoPluginLoad = function () {
  window.Panorama.emit("videoPluginLoad");
};
window.krpanoChangeCursor = function () {
  window.Panorama.emit("krpanoChangeCursor");
};
