/**
 * Standalone Map with UI Redesign (Green/Gold Theme)
 * Configured via mini-map.json
 */

(function () {
  console.log("Standalone Map Script Loaded");

  // --- Configuration & State ---
  let mapContainer = null;
  let openButton = null;
  let radarElement = null;
  let currentMapData = null; // The full map object
  let currentPointData = null; // The active point object
  let krpano = null;
  let mapDataList = null; // Array from JSON
  let isDropdownOpen = false;
  let isMapVisible = true; // State to track visibility
  let isZoomed = false; // State to track zoom level

  function getLocale() {
    return localStorage.getItem("locale") || "en";
  }

  function getLocalizedName(map) {
    return getLocale() === "en" && map.name_en ? map.name_en : map.name;
  }

  // Label diện tích đọc từ mini-map.json (areaInfo / areaInfo_en)
  function getLocalizedAreaInfo(map) {
    if (!map) return "";
    return getLocale() === "en" && map.areaInfo_en
      ? map.areaInfo_en
      : map.areaInfo || "";
  }

  // Title scene cho point trên minimap (title / title_en)
  function getLocalizedPointTitle(point) {
    if (!point) return "";
    return getLocale() === "en" && point.title_en
      ? point.title_en
      : point.title || "";
  }

  // Tìm point theo sceneName, dùng để lookup title cho relevance hotspot
  function findPointBySceneName(sceneName) {
    if (!mapDataList) return null;
    for (const map of mapDataList) {
      if (!map.points) continue;
      const p = map.points.find((pt) => pt.sceneName === sceneName);
      if (p) return p;
    }
    return null;
  }

  // Track mouse cho relevance tooltip (position = cursor)
  let lastMouseX = 0;
  let lastMouseY = 0;
  document.addEventListener("mousemove", (e) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    const t = document.getElementById("sa-relevance-tooltip");
    if (t && t.classList.contains("visible")) {
      t.style.left = e.clientX + 12 + "px";
      t.style.top = e.clientY - 12 + "px";
    }
  });

  // Callbacks gọi từ krpano onhover/onout (qua js() expression)
  window.saShowRelevanceTooltip = function (sceneName) {
    const tooltip = document.getElementById("sa-relevance-tooltip");
    if (!tooltip) return;
    const point = findPointBySceneName(sceneName);
    const title = getLocalizedPointTitle(point);
    if (!title) return;
    tooltip.textContent = title;
    tooltip.style.left = lastMouseX + 12 + "px";
    tooltip.style.top = lastMouseY - 12 + "px";
    tooltip.classList.add("visible");
  };
  window.saHideRelevanceTooltip = function () {
    const tooltip = document.getElementById("sa-relevance-tooltip");
    if (tooltip) tooltip.classList.remove("visible");
  };

  // Distance threshold (krpano world units) để xem cursor "trên" relevance
  // Tinh chỉnh nếu tooltip hiện quá rộng/hẹp
  const RELEVANCE_HOVER_THRESHOLD = 120;

  // Setup hook vào Panorama.mouse_pos để show tooltip khi cursor gần relevance
  // Dùng cùng infrastructure với cursor-arrow.js (đã chứng minh hoạt động)
  function setupRelevanceTooltipMouseHook(retries) {
    retries = retries || 0;
    if (
      !window.Panorama ||
      typeof window.cursorArrowFindNearestScene !== "function"
    ) {
      if (retries < 30) {
        setTimeout(() => setupRelevanceTooltipMouseHook(retries + 1), 500);
      } else {
        console.warn(
          "[standalone_map] Panorama / cursorArrowFindNearestScene unavailable; relevance tooltip disabled",
        );
      }
      return;
    }
    window.Panorama.on("mouse_pos", relevanceTooltipMouseHandler);
    console.log("[standalone_map] Relevance tooltip mouse hook attached");
  }

  function relevanceTooltipMouseHandler(event) {
    if (!window.krpano || !window.krpano.actions) return;
    const hit = window.krpano.actions.screentodepth(
      event.offsetX,
      event.offsetY,
    );
    if (!hit) {
      window.saHideRelevanceTooltip();
      return;
    }
    const nearestName = window.cursorArrowFindNearestScene(
      hit.x,
      hit.y,
      hit.z,
    );
    if (!nearestName || !window.jydata || !window.jydata.scenes) {
      window.saHideRelevanceTooltip();
      return;
    }
    const currentSceneName = window.krpano.get("xml.scene");
    const currentScene = window.jydata.scenes.find(
      (s) => s.name === currentSceneName,
    );
    const targetScene = window.jydata.scenes.find(
      (s) => s.name === nearestName,
    );
    if (!currentScene || !targetScene) {
      window.saHideRelevanceTooltip();
      return;
    }
    const overrides = currentScene.relevanceOverride || {};
    const pos = overrides[nearestName] || targetScene.position;
    if (!pos || pos.tx == null || pos.tz == null) {
      window.saHideRelevanceTooltip();
      return;
    }
    const dx = pos.tx - hit.x;
    const dy = (pos.ty || 0) - hit.y;
    const dz = pos.tz - hit.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (dist < RELEVANCE_HOVER_THRESHOLD) {
      window.saShowRelevanceTooltip(nearestName);
    } else {
      window.saHideRelevanceTooltip();
    }
  }

  // --- Initialization ---

  function start() {
    // Fetch Data
    fetch("mini-map.json")
      .then((response) => response.json())
      .then((data) => {
        console.log("Mini Map Data Loaded", data);
        mapDataList = data;
        checkReady();
      })
      .catch((err) => console.error("Failed to load mini-map.json", err));

    // Check for Krpano
    const checkTimer = setInterval(() => {
      if (window.krpano) {
        krpano = window.krpano;
        checkReady();
      }
    }, 500);

    let isReady = false;
    function checkReady() {
      if (!isReady && krpano && mapDataList) {
        isReady = true;
        clearInterval(checkTimer);
        // Inject styles once we have data (optional if we want global styles, but we do dynamic now)
        injectGlobalStyles();
        init();
      }
    }
  }

  start();

  function init() {
    console.log("Standalone Map Init");
    createUI();

    // Scene Change Polling
    let lastScene = "";
    setInterval(() => {
      if (!krpano) return;
      const currentScene = krpano.get("xml.scene");
      if (currentScene && currentScene !== lastScene) {
        lastScene = currentScene;
        onSceneChange(currentScene);
      }

      // Radar Rotation (60fps)
      if (radarElement && currentPointData) {
        updateRadarRotation();
      }
    }, 1000 / 60);

    // Setup tooltip cho relevance qua Panorama.mouse_pos (giống cursor-arrow)
    setupRelevanceTooltipMouseHook();
  }

  // --- UI Construction ---

  function injectGlobalStyles() {
    const style = document.createElement("style");
    style.innerHTML = `
            .sa-ui-element {
                position: absolute;
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                box-sizing: border-box;
                transition: opacity 0.3s, transform 0.3s;
            }
            .sa-map-container {
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                display: flex;
                flex-direction: column;
                opacity: 0;
                pointer-events: none;
                transform: scale(0.95);
                border: 1px solid #fff;
            }
            .sa-map-container.visible {
                opacity: 1;
                pointer-events: auto;
                transform: scale(1);
            }
            .sa-map-header {
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-shrink: 0;
                position: relative;
                z-index: 20;
                margin-bottom: -1px;
            }
            .sa-header-btn {
                width: 50px;
                height: 50px;
                border-top-right-radius: 20px;
                background: transparent;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 16px;
                color: #fff;
                transition: background 0.2s;
            }
            .sa-header-btn.close-btn {
            background: rgba(0,0,0,0);
            }
            .sa-header-btn.close-btn img {
                transform: scale(0.9);
            }
            .sa-header-btn img{
              opacity: 0.8;
            }
            .sa-header-btn img:hover{
              opacity: 1;
            }
            .sa-header-title {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                font-weight: 600;
                font-size: 14px;
                cursor: default;
                user-select: none;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                pointer-events: none;
                white-space: nowrap;
            }
            .sa-dropdown-icon {
                font-size: 8px;
                transition: transform 0.3s;
            }
            .sa-header-title.open .sa-dropdown-icon {
                transform: rotate(180deg);
            }
            .sa-map-content {
                flex: 1;
                position: relative;
                overflow: hidden;
                background: rgba(56, 56, 56, 0.4);
                backdrop-filter: blur(1px);
                -webkit-backdrop-filter: blur(1px);
            }
            .sa-map-image {
                width: 100%;
                height: 100%;
                object-fit: fill;
                pointer-events: none;
                display: block;
            }
            
            .sa-dropdown-menu {
                position: absolute;
                top: 50px;
                left: 50%;
                width: 50%;
                z-index: 15;
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease-out;
                transform: translateX(-50%);
            }
            .sa-open-img {
              width: 100%;
              height: 100%;
              pointer-events: none;
          }
            .sa-dropdown-menu.open {
                max-height: 200px;
                overflow-y: auto;
            }
            .sa-dropdown-item {
                padding: 10px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                cursor: pointer;
                text-align: center;
                transition: background 0.2s;
                font-size: 13px;
                text-transform: uppercase;
            }
            .sa-dropdown-item:hover, .sa-dropdown-item.active {
                background: rgba(255, 255, 255, 0.1);
            }
            .sa-point {
                position: absolute;
                width: 12px;
                height: 12px;
                border: 2px solid white;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                cursor: pointer;
                box-shadow: 0 0 4px rgba(0,0,0,0.5);
                z-index: 5;
            }
            .sa-area-info {
                position: absolute;
                bottom: 14px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 10px;
                font-weight: 600;
                color: #fff;
                background: transparent;
                padding: 0;
                white-space: nowrap;
                text-align: left;
                line-height: 1.7;
                letter-spacing: 0.3px;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
                pointer-events: none;
                z-index: 4;
            }
            .sa-point-tooltip {
                position: absolute;
                pointer-events: none;
                background: rgba(0, 0, 0, 0.85);
                color: #fff;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: 600;
                white-space: nowrap;
                opacity: 0;
                transform: translate(-50%, -100%);
                transition: opacity 0.15s ease;
                z-index: 30;
                text-transform: uppercase;
                letter-spacing: 0.3px;
                margin-top: -8px;
            }
            .sa-point-tooltip.visible {
                opacity: 1;
            }
            .sa-relevance-tooltip {
                position: fixed;
                pointer-events: none;
                background: rgba(0, 0, 0, 0.85);
                color: #fff;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 600;
                white-space: nowrap;
                opacity: 0;
                transition: opacity 0.15s ease;
                z-index: 10001;
                text-transform: uppercase;
                letter-spacing: 0.3px;
                transform: translate(0, -100%);
            }
            .sa-relevance-tooltip.visible {
                opacity: 1;
            }
            /* SVG Icons */
            .sa-icon {
                width: 26px;
                height: 26px;
                fill: currentColor;
            }
            /* Open Button */
            .sa-open-btn {
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                opacity: 0;
                pointer-events: none;
                transform: scale(0.8);
            }
            .sa-open-btn.visible {
                opacity: 1;
                pointer-events: auto;
                transform: scale(1);
            }
                .sa-header-img {
                background-color: rgba(255, 255, 255, 0.0);}

            /* ---- Responsive: mobile ---- */
            @media (max-width: 768px) {
                .sa-map-header {
                    height: 40px !important;
                    border-radius: 12px 12px 0 0 !important;
                }
                .sa-map-content {
                    border-radius: 0 0 12px 12px !important;
                }
                .sa-header-btn {
                    width: 40px !important;
                    height: 40px !important;
                    font-size: 13px !important;
                }
                .sa-header-title span {
                    font-size: 8px !important;
                    letter-spacing: 0.3px !important;
                }
                .sa-dropdown-item {
                    padding: 8px 6px !important;
                    font-size: 11px !important;
                }
                #sa-zoom-btn img {
                  width: 20px !important;
                  height: 20px !important;
                }
                .sa-dropdown-menu {
                  top: 40px !important;
                }
                .sa-area-info {
                    font-size: 6px !important;
                    padding: 3px 6px !important;
                    bottom: 4px !important;
                    line-height: 1.5 !important;
                }
                .sa-point-tooltip {
                    font-size: 7px !important;
                }
                .sa-relevance-tooltip {
                    font-size: 8px !important;
                }
            }
        `;
    document.head.appendChild(style);
  }

  function createUI() {
    // --- Map Container ---
    const existingMap = document.getElementById("standalone-map-container");
    if (existingMap) existingMap.remove();

    const container = document.createElement("div");
    container.id = "standalone-map-container";
    container.className = "sa-ui-element sa-map-container";

    // Header
    const header = document.createElement("div");
    header.className = "sa-map-header";

    // Close Button
    const closeBtn = document.createElement("div");
    closeBtn.className = "sa-header-btn close-btn";
    closeBtn.innerHTML = `<img src="plugins/jy-ui/img/close.svg" class="sa-header-img" alt="Close">`;
    closeBtn.onclick = () => setMapVisibility(false);

    // Title (display-only, không click mở dropdown)
    const titleContainer = document.createElement("div");
    titleContainer.className = "sa-header-title";
    titleContainer.id = "sa-map-title";
    titleContainer.innerHTML = `<span>MAP</span>`;

    // Zoom Placeholders (hidden or functional?)
    // User asked for "compact", maybe no zoom button for now or just placeholder
    // Zoom Button
    const zoomBtn = document.createElement("div");
    zoomBtn.className = "sa-header-btn";
    zoomBtn.id = "sa-zoom-btn";
    zoomBtn.innerHTML = `<img src="plugins/jy-ui/img/zoom-in.svg" class="sa-header-img" alt="Zoom">`;
    zoomBtn.onclick = toggleZoom;

    header.appendChild(closeBtn);
    header.appendChild(titleContainer);
    header.appendChild(zoomBtn);

    // Dropdown
    const dropdown = document.createElement("div");
    dropdown.id = "sa-dropdown-menu";
    dropdown.className = "sa-dropdown-menu";

    // Content
    const content = document.createElement("div");
    content.className = "sa-map-content";

    const img = document.createElement("img");
    img.className = "sa-map-image";
    img.id = "sa-map-image";

    const pointsLayer = document.createElement("div");
    pointsLayer.style.cssText =
      "position:absolute;top:0;left:0;width:100%;height:100%;";
    pointsLayer.id = "sa-points-layer";

    // Label diện tích bottom-center (text được set trong updateMap theo locale)
    const areaInfo = document.createElement("div");
    areaInfo.id = "sa-area-info";
    areaInfo.className = "sa-area-info";

    // Tooltip hiện title scene khi hover vào point
    const pointTooltip = document.createElement("div");
    pointTooltip.id = "sa-point-tooltip";
    pointTooltip.className = "sa-point-tooltip";

    content.appendChild(img);
    content.appendChild(pointsLayer);
    content.appendChild(areaInfo);
    content.appendChild(pointTooltip);

    container.appendChild(header);
    container.appendChild(dropdown);
    container.appendChild(content);

    document.body.appendChild(container);
    mapContainer = container;

    // --- Open Button ---
    const existingBtn = document.getElementById("standalone-open-btn");
    if (existingBtn) existingBtn.remove();

    const btn = document.createElement("div");
    btn.id = "standalone-open-btn";
    btn.className = "sa-ui-element sa-open-btn";
    // Simple map icon
    btn.innerHTML = `
      <img src="plugins/jy-ui/img/open-map.png" class="sa-open-img" />
    `;
    btn.onclick = () => setMapVisibility(true);

    document.body.appendChild(btn);
    openButton = btn;

    // Tooltip cho relevance hotspot (DOM overlay, fixed position theo cursor)
    const existingRelTooltip = document.getElementById("sa-relevance-tooltip");
    if (existingRelTooltip) existingRelTooltip.remove();
    const relTooltip = document.createElement("div");
    relTooltip.id = "sa-relevance-tooltip";
    relTooltip.className = "sa-relevance-tooltip";
    document.body.appendChild(relTooltip);
  }

  // --- Logic ---

  function setMapVisibility(visible) {
    if (!mapContainer || !openButton) return;
    isMapVisible = visible;

    if (visible) {
      mapContainer.classList.add("visible");
      openButton.classList.remove("visible");
    } else {
      mapContainer.classList.remove("visible");
      openButton.classList.add("visible");
      // Reset zoom
      if (isZoomed) toggleZoom();
    }
  }

  function toggleZoom() {
    if (!mapContainer) return;
    isZoomed = !isZoomed;
    const zoomBtn = document.getElementById("sa-zoom-btn");

    mapContainer.style.transition =
      "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)";

    if (isZoomed) {
      mapContainer.classList.add("zoomed");
      if (zoomBtn) {
        zoomBtn.innerHTML = `<img src="plugins/jy-ui/img/zoom-out.svg" class="sa-header-img" alt="Zoom Out">`;
      }

      const rawTheme = (currentMapData && currentMapData.theme) || {};
      const mobileTheme =
        (isMobile() &&
          currentMapData &&
          currentMapData.mobile &&
          currentMapData.mobile.theme) ||
        {};
      const theme = { ...rawTheme, ...mobileTheme };
      const maxScale = isMobile() ? 1.6 : 4;
      const scale = Math.min(theme.scaleZoom || 1.7, maxScale);

      // Anchor scale tại góc bottom-left → map giữ nguyên góc dưới trái,
      // phóng to mở rộng sang phải và lên trên. Áp dụng cho cả mobile
      // và desktop (initial position của map là bottom-left).
      mapContainer.style.transformOrigin = "bottom left";
      mapContainer.style.transform = `scale(${scale})`;
      mapContainer.style.zIndex = "10000";
    } else {
      mapContainer.classList.remove("zoomed");
      if (zoomBtn) {
        zoomBtn.innerHTML = `<img src="plugins/jy-ui/img/zoom-in.svg" class="sa-header-img" alt="Zoom In">`;
      }

      mapContainer.style.transform = "scale(1)";
      setTimeout(() => {
        if (!isZoomed) mapContainer.style.zIndex = "";
      }, 500);
    }
  }

  function toggleDropdown() {
    const menu = document.getElementById("sa-dropdown-menu");
    const title = document.getElementById("sa-map-title");
    isDropdownOpen = !isDropdownOpen;

    if (isDropdownOpen) {
      menu.classList.add("open");
      title.classList.add("open");
    } else {
      menu.classList.remove("open");
      title.classList.remove("open");
    }
  }

  function populateDropdown(activeMapId) {
    const menu = document.getElementById("sa-dropdown-menu");
    menu.innerHTML = "";

    mapDataList.forEach((map) => {
      const item = document.createElement("div");
      item.className = "sa-dropdown-item";
      if (map.id === activeMapId) item.classList.add("active");
      item.textContent = getLocalizedName(map);
      item.onclick = () => {
        switchMap(map);
        toggleDropdown();
      };
      menu.appendChild(item);
    });
  }

  function switchMap(map) {
    if (map.points && map.points.length > 0) {
      const firstScene = map.points[0].sceneName;
      console.log("Flying to scene:", firstScene);
      if (krpano) {
        // Use flytopano as requested
        krpano.call(`flytopano(${firstScene})`);
      }
    }
  }

  function onSceneChange(sceneName) {
    let foundMap = null;
    let foundPoint = null;

    for (const map of mapDataList) {
      if (map.points) {
        const point = map.points.find((p) => p.sceneName === sceneName);
        if (point) {
          foundMap = map;
          foundPoint = point;
          break;
        }
      }
    }

    if (foundMap) {
      updateMap(foundMap, foundPoint);
    } else {
      // Hide map if scene not found? Or just let it stay?
      // Usually we hide it if we are 'off the map'.
      // But let's check current visibility state.
      // If user explicitly opened it, we might keep it?
      // For now, if no map data, hide.
      setMapVisibility(false);
    }
  }

  // --- Responsive Helpers ---
  function isMobile() {
    return window.innerWidth <= 768;
  }

  // Giới hạn kích thước map không vượt quá viewport
  function getClampedDimensions(baseWidth, baseHeight) {
    if (!isMobile()) return { width: baseWidth, height: baseHeight };
    const margin = 16;
    const headerH = 40;
    const maxW = Math.floor(window.innerWidth * 0.48) - margin;
    const maxH = Math.floor(window.innerHeight * 0.52) - headerH;
    return {
      width: Math.max(110, Math.min(baseWidth, maxW)),
      height: Math.max(160, Math.min(baseHeight, maxH)),
    };
  }

  // Giữ cho map/button không bị ra ngoài viewport
  function clampToViewport(rawPos, elWidth, elHeight) {
    const m = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const bVal =
      rawPos.bottom && rawPos.bottom !== "auto"
        ? parseFloat(rawPos.bottom)
        : null;
    const tVal =
      rawPos.top && rawPos.top !== "auto" ? parseFloat(rawPos.top) : null;
    const rVal =
      rawPos.right && rawPos.right !== "auto" ? parseFloat(rawPos.right) : null;
    const lVal =
      rawPos.left && rawPos.left !== "auto" ? parseFloat(rawPos.left) : null;

    let top = bVal !== null ? vh - elHeight - bVal : tVal !== null ? tVal : m;
    let left = rVal !== null ? vw - elWidth - rVal : lVal !== null ? lVal : m;

    top = Math.max(m, Math.min(vh - elHeight - m, top));
    left = Math.max(m, Math.min(vw - elWidth - m, left));

    return {
      top: top + "px",
      left: left + "px",
      right: "auto",
      bottom: "auto",
    };
  }

  // Handle Resize
  window.addEventListener("resize", () => {
    if (currentMapData) updateMap(currentMapData, currentPointData);
  });

  // Handle locale change from localStorage
  window.addEventListener("storage", (e) => {
    if (e.key === "locale" && currentMapData) {
      updateMap(currentMapData, currentPointData);
      if (typeof window.applyLocaleGroups === "function") {
        window.applyLocaleGroups();
      }
      if (typeof window.applyLocaleHotspots === "function") {
        window.applyLocaleHotspots();
      }
    }
  });

  // Handle xoay màn hình (mobile)
  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      if (currentMapData) updateMap(currentMapData, currentPointData);
    }, 350);
  });

  // --- Update Logic ---

  function updateMap(mapData, pointData) {
    currentMapData = mapData;
    currentPointData = pointData;

    if (!mapContainer || !openButton) return;

    // --- Resolve Config based on Device ---
    const mobileConfig = isMobile() && mapData.mobile ? mapData.mobile : {};

    // Merge helper: Base + Mobile Override
    // Note: For simple objects like position, we just take the override if exists,
    const theme = { ...(mapData.theme || {}), ...(mobileConfig.theme || {}) };
    const position = mobileConfig.position || mapData.position || {};
    const openButtonConfig = {
      ...(mapData.openButton || {}),
      ...(mobileConfig.openButton || {}),
    };

    // Dimensions
    const mapWidth = mobileConfig.mapWidth || mapData.mapWidth;
    const mapHeight = mobileConfig.mapHeight || mapData.mapHeight;

    // Point & Radar
    const pointSize = mobileConfig.pointSize || mapData.pointSize || 12;
    const radarConfig = {
      ...(mapData.radar || {}),
      ...(mobileConfig.radar || {}),
    };

    // --- Apply Config ---

    const bg = theme.backgroundColor || "#34513C";
    const text = theme.textColor || "#F5DEA4";
    const radius = theme.borderRadius || "20px";

    mapContainer.style.borderRadius = radius;

    // Header Styling
    const header = mapContainer.querySelector(".sa-map-header");
    header.style.backgroundColor = bg;
    header.style.color = text;
    header.style.height = isMobile() ? "40px" : "50px";

    // Mobile Font Override
    const titleEl = document.querySelector("#sa-map-title span:first-child");

    if (isMobile()) {
      if (titleEl) titleEl.style.fontSize = "10px";
    } else {
      if (titleEl) titleEl.style.fontSize = ""; // Reset
    }

    // Dropdown Styling
    const dropdown = document.getElementById("sa-dropdown-menu");
    dropdown.style.backgroundColor = bg;
    dropdown.style.color = text;
    // Dropdown position update? Usually fine.

    // --- Open Button ---
    // const btnBg = openButtonConfig.backgroundColor || bg;
    const btnIconColor = openButtonConfig.iconColor || text;
    const btnSize = openButtonConfig.size || "40px";

    openButton.style.width = btnSize;
    openButton.style.height = btnSize;
    // openButton.style.backgroundColor = btnBg;
    openButton.style.color = btnIconColor;

    // Reset previous position styles
    openButton.style.top = "";
    openButton.style.right = "";
    openButton.style.bottom = "";
    openButton.style.left = "";

    const btnPxSize = parseFloat(btnSize) || 40;
    if (openButtonConfig.position) {
      if (isMobile()) {
        const btnClamped = clampToViewport(
          openButtonConfig.position,
          btnPxSize,
          btnPxSize,
        );
        Object.assign(openButton.style, btnClamped);
      } else {
        Object.assign(openButton.style, {
          top: openButtonConfig.position.top || "auto",
          right: openButtonConfig.position.right || "auto",
          bottom: openButtonConfig.position.bottom || "auto",
          left: openButtonConfig.position.left || "auto",
        });
      }
    } else {
      openButton.style.top = "60px";
      openButton.style.right = "20px";
    }

    // --- Map Layout ---

    // Reset previous styles
    mapContainer.style.width = "";
    mapContainer.style.height = "";
    mapContainer.style.top = "";
    mapContainer.style.right = "";
    mapContainer.style.bottom = "";
    mapContainer.style.left = "";

    const headerH = isMobile() ? 40 : 50;
    const dims = getClampedDimensions((mapWidth || 230) * 1.08, mapHeight || 350);
    mapContainer.style.width = dims.width + "px";
    mapContainer.style.height = dims.height + headerH + "px";

    const rawPos =
      position.top || position.right || position.bottom || position.left
        ? position
        : { top: "60px", right: "20px" };

    if (isMobile()) {
      const clamped = clampToViewport(
        rawPos,
        dims.width,
        dims.height + headerH,
      );
      Object.assign(mapContainer.style, clamped);
    } else {
      Object.assign(mapContainer.style, {
        top: rawPos.top || "auto",
        right: rawPos.right || "auto",
        bottom: rawPos.bottom || "auto",
        left: rawPos.left || "auto",
      });
    }

    // Update Text
    if (titleEl) titleEl.textContent = getLocalizedName(mapData);

    // Update area info label theo locale + config trong mini-map.json
    const areaInfoEl = document.getElementById("sa-area-info");
    if (areaInfoEl) areaInfoEl.innerHTML = getLocalizedAreaInfo(mapData);

    populateDropdown(mapData.id);

    const img = document.getElementById("sa-map-image");
    if (img.src !== mapData.url) img.src = mapData.url;

    // Render Points
    const pointsLayer = document.getElementById("sa-points-layer");
    pointsLayer.innerHTML = "";

    mapData.points.forEach((p) => {
      const isActive = p.sceneName === pointData.sceneName;
      const pointEl = document.createElement("div");
      pointEl.className = "sa-point";
      pointEl.style.left = p.left + "%";
      pointEl.style.top = p.top + "%";
      // Configurable Point Size
      pointEl.style.width = pointSize + "px";
      pointEl.style.height = pointSize + "px";

      pointEl.style.background = isActive ? "#F16A24" : "#E4AA9E";
      pointEl.style.zIndex = isActive ? 10 : 5;

      pointEl.onclick = (e) => {
        e.stopPropagation();
        if (p.sceneName !== krpano.get("xml.scene")) {
          console.log("Fly to", p.sceneName);
          krpano.call(`flytopano(${p.sceneName})`);
        }
      };

      // Hover → hiện tooltip với title scene (vi/en theo locale)
      pointEl.onmouseenter = () => {
        const tooltipEl = document.getElementById("sa-point-tooltip");
        const title = getLocalizedPointTitle(p);
        if (!tooltipEl || !title) return;
        tooltipEl.textContent = title;
        tooltipEl.style.left = p.left + "%";
        tooltipEl.style.top = p.top + "%";
        tooltipEl.classList.add("visible");
      };
      pointEl.onmouseleave = () => {
        const tooltipEl = document.getElementById("sa-point-tooltip");
        if (tooltipEl) tooltipEl.classList.remove("visible");
      };

      if (isActive) {
        radarElement = createRadar(radarConfig);
        pointEl.appendChild(radarElement);
        updateRadarRotation();
      }

      pointsLayer.appendChild(pointEl);
    });

    // Map Visibility state check
    if (isMapVisible) {
      mapContainer.classList.add("visible");
      openButton.classList.remove("visible");
    } else {
      mapContainer.classList.remove("visible");
      openButton.classList.add("visible");
    }

    // Update Zoom state if active
    if (isZoomed) {
      // We need to re-apply transform with new scale
      // toggleZoom logic uses currentMapData which is now updated with merged theme?
      // Wait, currentMapData is raw mapData. toggleZoom logic needs to use merged theming too.
      // Accessing it from inside toggleZoom is tricky if we don't store "computedConfig".
      // For now, let's just re-run toggleZoom to refresh?
      // Or update the transform directly.
      const scale = theme.scaleZoom || 2.5;
      // We need to recalculate center if size changed...
      // Best to just reset zoom on resize/update or handle complex logic.
      // Resetting zoom on heavy layout change is safer.
      if (isMobile()) {
        // Maybe auto-close zoom on mobile transition?
      }
    }
  }

  // --- Radar Logic ---
  function createRadar(config) {
    const size = config.size || 80;
    const color = config.color || "rgba(130, 194, 64, 0.6)";
    const fov = config.fov || 90;

    const wrapper = document.createElement("div");
    wrapper.style.cssText = `
            position: absolute; top: 50%; left: 50%;
            width: ${size}px; height: ${size}px;
            pointer-events: none; z-index: 1; opacity: 0.8;
            transform: translate(-50%, -50%);
        `;

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("fill", color);

    const r = size / 2;
    const pathD = describeSector(r, r, r, -90 - fov / 2, -90 + fov / 2);
    path.setAttribute("d", pathD);

    svg.appendChild(path);
    wrapper.appendChild(svg);
    return wrapper;
  }

  function describeSector(x, y, r, startAngle, endAngle) {
    const start = polarToCartesian(x, y, r, endAngle);
    const end = polarToCartesian(x, y, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M",
      x,
      y,
      "L",
      start.x,
      start.y,
      "A",
      r,
      r,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "L",
      x,
      y,
      "Z",
    ].join(" ");
  }

  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  function updateRadarRotation() {
    if (!radarElement || !krpano) return;
    const viewHLookAt = krpano.get("view.hlookat");
    let mapOffset =
      currentPointData && currentPointData.rotate
        ? Number(currentPointData.rotate)
        : 0;
    const rotation = viewHLookAt + mapOffset;
    radarElement.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
  }
})();
