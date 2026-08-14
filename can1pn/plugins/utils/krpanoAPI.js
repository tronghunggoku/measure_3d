String.prototype.replaceAll = function (s1, s2) {
  return this.replace(new RegExp(s1, "gm"), s2);
};
window.Panorama.on("shade_change", () => {
  let scene = window.jydata.scenes.find(
    (item) => item.name === window.krpano.xml.scene,
  );
  let data = {
    skyShade: {},
    floorShade: {},
  };
  if (scene.shade) {
    data = scene.shade;
  }
  window.krpano.set("hotspot[sky_shade].url", data.skyShade.imgUrl);
  window.krpano.set("hotspot[sky_shade].scale", data.skyShade.zoom / 50);
  window.krpano.set(
    "hotspot[sky_shade].ry1",
    (data.skyShade.revolve / 100) * 360,
  );
  window.krpano.set("hotspot[floor_shade].url", data.floorShade.imgUrl);
  window.krpano.set("hotspot[floor_shade].scale", data.floorShade.zoom / 50);
  window.krpano.set(
    "hotspot[floor_shade].ry1",
    (data.floorShade.revolve / 100) * 360,
  );
  if (!data.skyShade.isFollow) {
    window.krpano.set(
      "hotspot[sky_shade].ry",
      (data.skyShade.revolve / 100) * 360,
    );
  }
  if (!data.floorShade.isFollow) {
    window.krpano.set(
      "hotspot[floor_shade].ry",
      (data.floorShade.revolve / 100) * 360,
    );
  }
  window.krpano.set("hotspot[sky_shade].isfollow", data.skyShade.isFollow);
  window.krpano.set("hotspot[floor_shade].isfollow", data.floorShade.isFollow);
  window.krpano.call("onviewchange()");
});
window.Panorama.on("mouse_pos", (event) => {
  if (window.krpano && (window.krpano.get("measure3d_loop") == true || window.krpano.get("measure3d_loop") === "true" || window.krpano.measure3d_loop === true || window.krpano.overMeasureUI === true)) {
    window.krpano.set("hotspot[hotspot_mouse].visible", false);
    return;
  }
  var hit = window.krpano.actions.screentodepth(event.offsetX, event.offsetY);
  if (!hit) {
    window.krpano.set("hotspot[hotspot_mouse].visible", false);
    return;
  }
  window.krpano.set("hotspot[hotspot_mouse].visible", true);
  window.krpano.set("hotspot[hotspot_mouse].tx", hit.x);
  window.krpano.set("hotspot[hotspot_mouse].ty", hit.y);
  window.krpano.set("hotspot[hotspot_mouse].tz", hit.z);
  window.krpano.set("hotspot[hotspot_mouse].rx", hit.rx);
  window.krpano.set("hotspot[hotspot_mouse].ry", hit.ry);
  window.krpano.set("hotspot[hotspot_mouse].rz", hit.rz);
  window.krpano.set("hotspot[hotspot_mouse].nx", hit.nx);
  window.krpano.set("hotspot[hotspot_mouse].ny", hit.ny);
  window.krpano.set("hotspot[hotspot_mouse].nz", hit.nz);
});

window.Panorama.on("hotspots_change", (names = [], subgroup) => {
  if (window.hideHotspot) {
    return;
  }
  window.jydata.hotSpotList.map((val) => {
    if (
      val.scenes.findIndex((item) => item == window.krpano.xml.scene) != -1 &&
      !val.isApplyToImplant
    ) {
      if (!val.isShow) return;
      if (
        window.krpano.webvr &&
        window.krpano.webvr.isenabled &&
        !(val.hotSpotType == 1 || val.hotSpotType == 2)
      ) {
        return;
      }
      let hotname = "hot_hotspot_" + val.id;
      let nameIndex = names.findIndex((name) => name == hotname);
      if (nameIndex > -1) {
        names.splice(nameIndex, 1);
        nameIndex = names.findIndex((name) => name == "vrtooltip_" + hotname);
        if (nameIndex > -1) {
          names.splice(nameIndex, 1);
        }
        nameIndex = names.findIndex(
          (name) => name == "hotspot_line_" + hotname,
        );
        if (nameIndex > -1) {
          names.splice(nameIndex, 1);
        }
        return;
      }
      if (!subgroup && window.currentSubgroup) {
        subgroup = window.currentSubgroup;
      }
      if (subgroup) {
        if (val.subgroup.findIndex((item) => item == subgroup) == -1) return;
      }

      window.krpano.call("addhotspot(" + hotname + ", h)");
      window.krpano.call("h.loadstyle(imghotspot)");
      window.krpano.set(
        "h.width",
        val.icon.iconWidth == 0 ? 120 : val.icon.iconWidth,
      );
      window.krpano.set(
        "h.height",
        val.icon.iconHeight == 0 ? 120 : val.icon.iconHeight,
      );
      window.krpano.set("h.scale", val.icon.iconSize);
      window.krpano.set("h.scalevr", val.icon.iconSize * 0.2);
      window.krpano.set(
        "h.text",
        val.showName ? val.name.replaceAll("\n", "<br/>") : "",
      );
      window.krpano.set("h.url", val.icon.iconPath);
      window.krpano.set(
        "h.onclick",
        "js(hotclick(" + val.id + "," + val.keep + "))",
      );
      window.krpano.set(
        "h.css1",
        "white-space:pre;text-align:center; color:" +
          val.nameColor.fontColor +
          "; font-size:" +
          (12 + val.nameColor.size * 4) +
          "px;opacity:" +
          val.nameColor.fontColorOpacity * 0.01,
      );
      window.krpano.set(
        "h.padding1",
        2 + 2 * val.nameColor.size + " " + (4 + 4 * val.nameColor.size),
      );
      window.krpano.set(
        "h.bgcolor1",
        "0x" + val.nameColor.bgColor.substring(1),
      );
      window.krpano.set("h.bgalpha1", +val.nameColor.bgColorOpacity * 0.01);
      if (val.hotSpotType == 2) {
        window.krpano.set("h.enabled", false);
      }
      if (val.icon.iconType == 1 && val.icon.customType == 1) {
        window.krpano.set("h.width", val.icon.iconOriginalWidth);
        window.krpano.set(
          "h.height",
          val.icon.iconOriginalHeight / val.icon.gifFrameNum,
        );
        window.krpano.set(
          "h.onloaded",
          "add_all_the_time_tooltip_for_VR();do_crop_animation(" +
            val.icon.iconOriginalWidth +
            "," +
            val.icon.iconOriginalHeight / val.icon.gifFrameNum +
            "," +
            60 / val.icon.gifTime +
            ");",
        );
        window.krpano.set(
          "h.oy1",
          ((-val.icon.iconOriginalHeight / val.icon.gifFrameNum) *
            val.icon.iconSize) /
            2 -
            10,
        );
      } else if (val.icon.iconType == 0 && val.icon.customType == 1) {
        window.krpano.set("h.width", val.icon.iconOriginalWidth);
        window.krpano.set(
          "h.height",
          val.icon.iconOriginalHeight / val.icon.gifFrameNum,
        );
        window.krpano.set(
          "h.onloaded",
          "add_all_the_time_tooltip_for_VR();do_crop_animation(" +
            val.icon.iconOriginalWidth +
            "," +
            val.icon.iconOriginalHeight / val.icon.gifFrameNum +
            "," +
            60 / val.icon.gifTime +
            ");",
        );
        window.krpano.set(
          "h.oy1",
          ((-val.icon.iconOriginalHeight / val.icon.gifFrameNum) *
            val.icon.iconSize) /
            2 -
            10,
        );
      } else if (val.icon.iconType == 1 && val.icon.customType == 0) {
        window.krpano.set("h.width", 120);
        window.krpano.set(
          "h.height",
          val.icon.iconOriginalHeight / (val.icon.iconOriginalWidth / 120),
        );
        if (val.icon.activeIconPath.length > 0) {
          window.krpano.set(
            "hotspot[" + hotname + "].onover",
            "set(url," + val.icon.activeIconPath + ")",
          );
          window.krpano.set(
            "hotspot[" + hotname + "].onout",
            "set(url," + val.icon.iconPath + ")",
          );
        }
        window.krpano.set("h.enabled", true);
        window.krpano.set("h.onloaded", "add_all_the_time_tooltip_for_VR();");
        window.krpano.set(
          "h.oy1",
          ((-val.icon.iconOriginalHeight / (val.icon.iconOriginalWidth / 120)) *
            val.icon.iconSize) /
            2 -
            10,
        );
      } else {
        window.krpano.set("h.onloaded", "add_all_the_time_tooltip_for_VR();");
        window.krpano.set(
          "h.oy1",
          (-(val.icon.iconHeight == 0 ? 120 : val.icon.iconHeight) *
            val.icon.iconSize) /
            2 -
            10,
        );
      }
      window.krpano.set(
        "h.isgif",
        val.icon.iconType == 1 && val.icon.customType == 1,
      );

      window.krpano.set(
        "hotspot[vrtooltip_" + hotname + "].visible",
        val.showName,
      );

      window.krpano.call("addhotspot(hotspot_line_" + hotname + ", hl)");
      window.krpano.call("hl.loadstyle(hotspot_line_style)");
      window.krpano.set("hl.visible", val.isShow && val.icon.showLine);
      if (
        !window.jydata.scenes.find(
          (item) => item.name === window.krpano.xml.scene,
        ).model &&
        window.jydata.scenes.find(
          (item) => item.name === window.krpano.xml.scene,
        ).type != 3
      ) {
        window.krpano.set("hl.visible", false);
      }
      if (
        window.jydata.scenes.find(
          (item) => item.name === window.krpano.xml.scene,
        ).type == 3
      ) {
        window.krpano.set("hl.borderwidth", val.icon.thickness / 10);
      } else {
        window.krpano.set("hl.borderwidth", val.icon.thickness / 100);
      }
      window.krpano.set("hl.bordercolor", "0x" + val.icon.color.substring(1));
      window.krpano.set(
        "hl.borderalpha",
        val.icon.showLine ? val.icon.pellucidity / 100 : 0,
      );
      for (let k in val.position) {
        if (k == "tx" || k == "ty" || k == "tz") {
          window.krpano.set(
            "h." + k,
            val.position[k] +
              val.position["n" + k.substring(1)] * val.icon.distance,
          );
          window.krpano.set("hl.point[0]." + k.substring(1), val.position[k]);
          window.krpano.set(
            "hl.point[1]." + k.substring(1),
            val.position[k] +
              val.position["n" + k.substring(1)] * val.icon.distance,
          );
        } else {
          window.krpano.set("h." + k, val.position[k]);
        }
      }
      if (!val.is3d) {
        window.krpano.set("h.tx", 0);
        window.krpano.set("h.ty", 0);
        window.krpano.set("h.tz", 0);
        window.krpano.set("h.depth", 160);
        window.krpano.set("h.depthbuffer", false);
        window.krpano.set("h.ath", val.position.ath);
        window.krpano.set("h.atv", val.position.atv);
        window.krpano.set("hotspot[vrtooltip_" + hotname + "].tx", 0);
        window.krpano.set("hotspot[vrtooltip_" + hotname + "].ty", 0);
        window.krpano.set("hotspot[vrtooltip_" + hotname + "].tz", 0);
        window.krpano.set("hotspot[vrtooltip_" + hotname + "].depth", 160);
        window.krpano.set(
          "hotspot[vrtooltip_" + hotname + "].depthbuffer",
          false,
        );
        window.krpano.set(
          "hotspot[vrtooltip_" + hotname + "].ath",
          val.position.ath,
        );
        window.krpano.set(
          "hotspot[vrtooltip_" + hotname + "].atv",
          val.position.atv,
        );
      }
      window.krpano.set("h.hotspottype", val.hotSpotType);

      window.krpano.set(
        "hotspot[vrtooltip_" + hotname + "].hotspottype",
        val.hotSpotType,
      );

      window.krpano.set("h.keep2", val.keep);
      window.krpano.set("hotspot[vrtooltip_" + hotname + "].keep2", val.keep);

      if (window.krpano.webvr && window.krpano.webvr.isenabled) {
        let val = window.krpano.get("h");
        val.distorted = true;
        let arr1 = [
          window.krpano.view.tx,
          window.krpano.view.ty,
          window.krpano.view.tz,
        ];
        let arr2 = [val.tx, val.ty, val.tz];
        val.ry =
          Math.atan2(arr2[0] - arr1[0], arr2[2] - arr1[2]) * (180 / Math.PI);
        val.rx = 0;
        val.rz = 0;
        val.scale = val.scalevr;
        window.krpano.set(
          "hotspot[vrtooltip_" + hotname + "].scale",
          val.scalevr,
        );
      }
    }
  });
});

function addFlootHot(link, isModel, posOverride) {
  if (!link) return;
  let linkData = window.jydata.scenes.find((item) => item.name === link);
  // Per-current-scene override for relevance hotspot position
  // Falls back to target scene's own position when no override is provided
  let pos = posOverride || linkData.position;
  let height =
    posOverride && posOverride.height != null
      ? posOverride.height
      : linkData.position.height;
  window.krpano.call(
    "addhotspot(floorspot_" + linkData.name.substring(6) + ", f)",
  );
  window.krpano.call("f.loadstyle(floorspot_img)");
  window.krpano.set("f.tx", pos.tx);
  window.krpano.set("f.ty", pos.ty + height - 1 + 5);
  window.krpano.set("f.tz", pos.tz);
  window.krpano.set("f.linkedscene", linkData.name);
  window.krpano.set("f.url", window.jydata.base.footstepControl.icon.iconPath);

  let footstepControlIcon = window.jydata.base.footstepControl.icon;
  let isChange =
    footstepControlIcon.iconType == 1 && footstepControlIcon.activeIconPath;
  if (isModel) {
    window.krpano.set(
      "f.scale",
      window.jydata.base.footstepControl.icon.iconSize * 1.5,
    );
  } else {
    window.krpano.set(
      "f.scale",
      window.jydata.base.footstepControl.icon.iconSize * 1.5,
    );

    if (window.jydata.base.footstepControl.feedbackType == "1") {
      window.krpano.set(
        "f.onover",
        "tween(scale," +
          (window.jydata.base.footstepControl.icon.iconSize * 1.5 +
            window.jydata.base.footstepControl.feedbackNum / 100) +
          ")",
      );
      window.krpano.set(
        "f.onout",
        "tween(scale," +
          window.jydata.base.footstepControl.icon.iconSize * 1.5 +
          ")",
      );
    } else if (window.jydata.base.footstepControl.feedbackType == "2") {
      window.krpano.set(
        "f.onover",
        "tween(alpha," +
          (1 - window.jydata.base.footstepControl.feedbackNum / 100) +
          ")",
      );
      window.krpano.set("f.onout", "tween(alpha," + 1 + ")");
    } else if (window.jydata.base.footstepControl.feedbackType == "3") {
      window.krpano.set(
        "f.onover",
        "tween(scale," +
          (window.jydata.base.footstepControl.icon.iconSize * 1.5 -
            window.jydata.base.footstepControl.feedbackNum / 100) +
          ")",
      );
      window.krpano.set(
        "f.onout",
        "tween(scale," +
          window.jydata.base.footstepControl.icon.iconSize * 1.5 +
          ")",
      );
    }
  }
  if (isChange) {
    window.krpano.set(
      "f.onover",
      window.krpano.get("f.onover") +
        ";set(url," +
        footstepControlIcon.activeIconPath +
        ")",
    );
    window.krpano.set(
      "f.onout",
      window.krpano.get("f.onover") +
        ";set(url," +
        footstepControlIcon.iconPath +
        ")",
    );
  }
}
function madeLine(pos1, pos2, name) {
  // window.krpano.call('addhotspot(floorspot_' + name + ', hl)');
  // window.krpano.call('hl.loadstyle(hotspot_line_style1)');
  // window.krpano.set('hl.point[0].x', pos1.tx);
  // window.krpano.set('hl.point[0].y', pos1.ty  + pos1.height);
  // window.krpano.set('hl.point[0].z', pos1.tz);
  // window.krpano.set('hl.point[1].x', pos2.tx);
  // window.krpano.set('hl.point[1].y', pos2.ty  + pos2.height);
  // window.krpano.set('hl.point[1].z', pos2.tz);
  let arr = {
    name: name,
    pos: pos2,
    names: [],
  };
  // arr.names.push('floorspot_'+ name)
  let length = Math.sqrt(
    Math.pow(Math.abs(pos1.tx - pos2.tx), 2) +
      Math.pow(Math.abs(pos1.tz - pos2.tz), 2),
  ).toFixed(2);
  let count = length / 100;
  let rotation =
    Math.atan2(pos2.tx - pos1.tx, pos2.tz - pos1.tz) * (180 / Math.PI);
  for (var i = 1; i < count - 1; i++) {
    window.krpano.call("addhotspot(floorspot_" + name + i + ", icon)");
    window.krpano.call("icon.loadstyle(hotspot_icon_style1)");
    window.krpano.set("icon.tx", pos1.tx + (pos2.tx - pos1.tx) * (i / count));
    window.krpano.set(
      "icon.ty",
      pos1.ty + (pos2.ty - pos1.ty) * (i / count) + pos2.height,
    );
    window.krpano.set("icon.tz", pos1.tz + (pos2.tz - pos1.tz) * (i / count));
    window.krpano.set("icon.rz", rotation);
    window.krpano.set("icon.visible", false);
    window.krpano.set(
      "icon.url",
      window.jydata.base.guideLine.guideLineList[
        window.jydata.base.guideLine.guideLineType
      ].value,
    );
    arr.names.push("floorspot_" + name + i);
  }
  arr.rotation = rotation < 0 ? rotation + 360 : rotation;
  return arr;
}
window.Panorama.on("showFlootHotspot", () => {
  let names = [];

  window.krpano
    .get("hotspot")
    .getArray()
    .map((val, inx) => {
      if (val.name.indexOf("floorspot_") != -1) {
        names.push(val.name);
      }
    });
  names.map((val) => {
    window.krpano.call("removehotspot(" + val + ")");
  });
  if (
    window.jydata.scenes.find((item) => item.name === window.krpano.xml.scene)
      .model
  ) {
    window.krpano.set("hotspot[hotspot_mouse].visible", true);
  } else {
    window.krpano.set("hotspot[hotspot_mouse].visible", false);
  }

  window.jydata.sandTable.map.forEach((item, index) => {
    if (
      item.points.findIndex(
        (item1) => item1.sceneName == window.krpano.xml.scene,
      ) > -1
    ) {
      window.currentMap = item;
    }
  });
  window.jydata.scenes.map((scene) => {
    if (
      scene.name == window.krpano.xml.scene &&
      window.jydata.scenes.find((item) => item.name === window.krpano.xml.scene)
        .model
    ) {
      let overrides = scene.relevanceOverride || {};
      scene.relevance.map((link) => {
        if (window.jydata.scenes.find((item) => item.name === link).model) {
          addFlootHot(link, false, overrides[link]);
        }
      });
      addFlootHot(window.krpano.xml.scene, false);
    } else if (scene.name == window.krpano.xml.scene && scene.type == 3) {
      if (window.currentMap) {
        window.currentMap.points.forEach((item) => {
          addFlootHot(item.sceneName, true);
        });
      }
    }
  });
});

window.Panorama.on("pano_video_ready", () => {
  // let scene =  window.jydata.scenes.find(scene => scene.name == window.krpano.xml.scene)
  // if(scene.type == 2){
  //     window.Panorama.emit('loadscene', ([scene.name,true,1]))
  // }
});

window.Panorama.on("implant_change", (names = [], subgroup) => {
  if (window.hideImplant) {
    return;
  }
  let scenedata = window.jydata.scenes.find(
    (scene) => scene.name == window.krpano.xml.scene,
  );
  window.jydata.implantList.map((val) => {
    if (val.scenes.findIndex((item) => item == window.krpano.xml.scene) != -1) {
      if (!val.isShow) return;
      let hotname = "hot_implant_" + val.id;
      let nameIndex = names.findIndex((name) => name == hotname);

      if (nameIndex > -1) {
        names.splice(nameIndex, 1);
        nameIndex = names.findIndex(
          (name) => name == hotname + "_implant_icon",
        );
        if (nameIndex > -1) {
          names.splice(nameIndex, 1);
        }

        nameIndex = names.findIndex((name) => name == hotname + "_line");
        if (nameIndex > -1) {
          names.splice(nameIndex, 1);
        }
        nameIndex = names.findIndex((name) => name == hotname + "_point");
        if (nameIndex > -1) {
          names.splice(nameIndex, 1);
        }
        return;
      }
      if (!subgroup && window.currentSubgroup) {
        subgroup = window.currentSubgroup;
      }
      if (subgroup) {
        if (val.subgroup.findIndex((item) => item == subgroup) == -1) return;
      }
      window.krpano.call("addhotspot(" + hotname + ", h)");
      let implant = window.krpano.get("h");
      let implantImg;

      if (val.isimg && val.imgList.length > 1) {
        val.hotSpotId = false;
      } else if (!val.isimg && !val.isrect && !val.istext) {
        val.hotSpotId = false;
      }

      if (val.hotSpotId) {
        implant.addevent("onclick", () => {
          window.hotclick(
            val.hotSpotId,
            window.jydata.hotSpotList.find((item) => item.id == val.hotSpotId)
              .keep,
          );
        });
      }

      if (val.isrect) {
        window.krpano.call("h.loadstyle(rectimplant)");
        val.positionList.map((val1, index) => {
          if (val.is3d) {
            window.krpano.set("h.point[" + index + "].x", val1.x);
            window.krpano.set("h.point[" + index + "].y", val1.y);
            window.krpano.set("h.point[" + index + "].z", val1.z);
          } else {
            window.krpano.set("h.point[" + index + "].ath", val1.x);
            window.krpano.set("h.point[" + index + "].atv", val1.y);
          }
        });
        window.krpano.set("h.fillcolor", "0x" + val.fillColorA.substring(1));
        window.krpano.set("h.fillalpha", val.fillColorOpacityA * 0.01);

        window.krpano.set("h.borderwidth", val.thicknessA * 0.1);
        window.krpano.set(
          "h.bordercolor",
          "0x" + val.strokeColorA.substring(1),
        );
        window.krpano.set("h.borderalpha", val.strokeColorOpacityA * 0.1);
        window.krpano.set(
          "h.onout",
          "tween(fillcolor|fillalpha|borderwidth|bordercolor|borderalpha," +
            "0x" +
            val.fillColorA.substring(1) +
            "|" +
            val.fillColorOpacityA * 0.01 +
            "|" +
            val.thicknessA * 0.1 +
            "|" +
            "0x" +
            val.strokeColorA.substring(1) +
            "|" +
            val.strokeColorOpacityA * 0.01 +
            ")",
        );
        window.krpano.set(
          "h.onover",
          "tween(fillcolor|fillalpha|borderwidth|bordercolor|borderalpha," +
            "0x" +
            val.fillColorB.substring(1) +
            "|" +
            val.fillColorOpacityB * 0.01 +
            "|" +
            val.thicknessB * 0.1 +
            "|" +
            "0x" +
            val.strokeColorB.substring(1) +
            "|" +
            val.strokeColorOpacityB * 0.01 +
            ")",
        );
        if (!val.is3d) {
          window.krpano.set("h.borderwidth", val.thicknessA);
          window.krpano.set("h.depth", 1000);
          window.krpano.set(
            "h.onout",
            "tween(fillcolor|fillalpha|borderwidth|bordercolor|borderalpha," +
              "0x" +
              val.fillColorA.substring(1) +
              "|" +
              val.fillColorOpacityA * 0.01 +
              "|" +
              val.thicknessA +
              "|" +
              "0x" +
              val.strokeColorA.substring(1) +
              "|" +
              val.strokeColorOpacityA * 0.01 +
              ")",
          );
          window.krpano.set(
            "h.onover",
            "tween(fillcolor|fillalpha|borderwidth|bordercolor|borderalpha," +
              "0x" +
              val.fillColorB.substring(1) +
              "|" +
              val.fillColorOpacityB * 0.01 +
              "|" +
              val.thicknessB +
              "|" +
              "0x" +
              val.strokeColorB.substring(1) +
              "|" +
              val.strokeColorOpacityB * 0.01 +
              ")",
          );
        }
        if (val.hotSpotId) {
          implant.capture = true;
        }
      } else if (val.istext) {
        window.krpano.call("h.loadstyle(textimplant)");
        window.krpano.set("h.visible", val.isShow);

        window.krpano.set("h.bgcolor", "0x" + val.textSet.bgColor.substring(1));
        window.krpano.set("h.bgalpha", val.textSet.bgColorOpacity * 0.01);
        window.krpano.set(
          "h.bgborder",
          2 +
            " 0x" +
            val.textSet.borderColor.substring(1) +
            " " +
            val.textSet.borderColorOpacity * 0.01,
        );
        window.krpano.set(
          "h.css",
          "white-space:pre;text-align:center; color:" +
            val.textSet.fontColor +
            "; font-size:" +
            (12 + val.textSet.size * 6) +
            "px;opacity:" +
            val.textSet.fontColorOpacity * 0.01,
        );
        window.krpano.set(
          "h.padding",
          4 + 4 * val.textSet.size + " " + (4 + 4 * val.textSet.size),
        );
        if (val.name) {
          window.krpano.set(
            "h.bgroundedge",
            (8 + 8 * val.textSet.size + 4 + (12 + val.textSet.size * 6)) / 2,
          );
        }
        window.krpano.call("addhotspot(" + hotname + "_line, hl)");
        window.krpano.call("hl.loadstyle(textimplant_line)");

        window.krpano.call("addhotspot(" + hotname + "_point, hp)");
        window.krpano.call("hp.loadstyle(textimplant_point)");
        window.krpano.set("hp.url", val.textSet.endImgPath);
        window.krpano.set("hp.scale", val.textSet.endImgSize / 100);
        // val.textSet.position = 3
        if (val.is3d) {
          if (val.textSet.position == 1) {
            window.krpano.set(
              "h.tx",
              val.position.tx + val.position.nx * val.distance,
            );
            window.krpano.set(
              "h.ty",
              val.position.ty + val.position.ny * val.distance,
            );
            window.krpano.set(
              "h.tz",
              val.position.tz + val.position.nz * val.distance,
            );
            window.krpano.set(
              "hl.point[1].x",
              val.position.tx + val.position.nx * val.distance,
            );
            window.krpano.set(
              "hl.point[1].y",
              val.position.ty + val.position.ny * val.distance,
            );
            window.krpano.set(
              "hl.point[1].z",
              val.position.tz + val.position.nz * val.distance,
            );
          } else if (val.textSet.position == 0) {
            window.krpano.set(
              "h.tx",
              val.position.tx + val.position.nx * val.distance,
            );
            window.krpano.set(
              "h.ty",
              val.position.ty + -val.position.ny * val.distance,
            );
            window.krpano.set(
              "h.tz",
              val.position.tz + val.position.nz * val.distance,
            );
            window.krpano.set("h.edge", "top");
            window.krpano.set(
              "hl.point[1].x",
              val.position.tx + val.position.nx * val.distance,
            );
            window.krpano.set(
              "hl.point[1].y",
              val.position.ty + -val.position.ny * val.distance,
            );
            window.krpano.set(
              "hl.point[1].z",
              val.position.tz + val.position.nz * val.distance,
            );
          } else if (val.textSet.position == 3) {
            window.krpano.set(
              "h.tx",
              val.position.tx + val.position.nz * val.distance,
            );
            window.krpano.set(
              "h.ty",
              val.position.ty + val.position.nx * val.distance,
            );
            window.krpano.set(
              "h.tz",
              val.position.tz + -val.position.ny * val.distance,
            );
            window.krpano.set(
              "hl.point[1].x",
              val.position.tx + val.position.nz * val.distance,
            );
            window.krpano.set(
              "hl.point[1].y",
              val.position.ty + val.position.nx * val.distance,
            );
            window.krpano.set(
              "hl.point[1].z",
              val.position.tz + -val.position.ny * val.distance,
            );
            window.krpano.set("h.edge", "right");
          } else if (val.textSet.position == 2) {
            window.krpano.set(
              "h.tx",
              val.position.tx + val.position.nz * val.distance,
            );
            window.krpano.set(
              "h.ty",
              val.position.ty + val.position.nx * val.distance,
            );
            window.krpano.set(
              "h.tz",
              val.position.tz + val.position.ny * val.distance,
            );
            window.krpano.set(
              "hl.point[1].x",
              val.position.tx + val.position.nz * val.distance,
            );
            window.krpano.set(
              "hl.point[1].y",
              val.position.ty + val.position.nx * val.distance,
            );
            window.krpano.set(
              "hl.point[1].z",
              val.position.tz + val.position.ny * val.distance,
            );
            window.krpano.set("h.edge", "left");
          }
          window.krpano.set("h.depthbuffer", false);

          window.krpano.set("hl.point[0].x", val.position.tx);
          window.krpano.set("hl.point[0].y", val.position.ty);
          window.krpano.set("hl.point[0].z", val.position.tz);

          window.krpano.set(
            "hl.borderalpha",
            val.textSet.lineColorOpacity * 0.01,
          );
          window.krpano.set(
            "hl.bordercolor",
            " 0x" + val.textSet.lineColor.substring(1),
          );
          if (
            window.jydata.scenes.find(
              (item) => item.name === window.krpano.xml.scene,
            ).type == 3
          ) {
            window.krpano.set(
              "hl.borderwidth",
              val.textSet.thickness / 10 +
                (val.textSet.thickness > 0 ? 0.5 : 0),
            );
          } else {
            window.krpano.set(
              "hl.borderwidth",
              val.textSet.thickness / 100 +
                (val.textSet.thickness > 0 ? 0.5 : 0),
            );
          }

          window.krpano.set("hp.tx", val.position.tx);
          window.krpano.set("hp.ty", val.position.ty);
          window.krpano.set("hp.tz", val.position.tz);
          window.krpano.set("hp.depth", 0);
        } else {
          window.krpano.set("hotspot[" + hotname + "].ath", val.position.ath);
          window.krpano.set("hotspot[" + hotname + "].atv", val.position.atv);
          window.krpano.set("hotspot[" + hotname + "].depth", 1000);
          window.krpano.set("hotspot[" + hotname + "].depthbuffer", false);

          if (val.textSet.position == 1) {
            window.krpano.set("h.oy", -val.distance);
            window.krpano.set("hl.width", val.textSet.thickness / 10);
            window.krpano.set("hl.height", val.distance);
            window.krpano.set("hl.edge", "bottom");
          } else if (val.textSet.position == 0) {
            window.krpano.set("h.edge", "top");
            window.krpano.set("hl.edge", "top");
            window.krpano.set("hl.width", val.textSet.thickness / 10);
            window.krpano.set("hl.height", val.distance);
            window.krpano.set("h.oy", val.distance);
          } else if (val.textSet.position == 3) {
            window.krpano.set("hl.edge", "right");
            window.krpano.set("h.edge", "right");
            window.krpano.set("hl.width", val.distance);
            window.krpano.set("hl.height", val.textSet.thickness / 10);
            window.krpano.set("h.ox", -val.distance);
          } else if (val.textSet.position == 2) {
            window.krpano.set("hl.edge", "left");
            window.krpano.set("h.edge", "left");
            window.krpano.set("hl.width", val.distance);
            window.krpano.set("hl.height", val.textSet.thickness / 10);
            window.krpano.set("h.ox", val.distance);
          }

          window.krpano.set("hl.depth", 1000);
          window.krpano.set("hl.depthbuffer", false);
          window.krpano.set("hl.type", "text");
          window.krpano.set("hl.ath", val.position.ath);
          window.krpano.set("hl.atv", val.position.atv);
          window.krpano.set("hl.bgborder", "0 0x000000 0");
          window.krpano.set("hl.bgalpha", val.textSet.lineColorOpacity * 0.01);
          window.krpano.set(
            "hl.bgcolor",
            " 0x" + val.textSet.lineColor.substring(1),
          );

          window.krpano.set("hp.depth", 1000);
          window.krpano.set("hp.depthbuffer", false);
          window.krpano.set("hp.ath", val.position.ath);
          window.krpano.set("hp.atv", val.position.atv);
        }
        window.krpano.set("h.html", val.name);
      } else {
        window.krpano.call("h.loadstyle(imgimplant)");
        implant.enabled = false;
        if (val.hotSpotId) {
          implant.enabled = true;
        }
        let videoIcon = null;
        if (val.isimg) {
          implant.url = val.imgList.length > 0 ? val.imgList[0].filePath : "";
          implant.zorder = 3;

          if (val.imgList.length > 1) {
            let _val = val;
            if (!val.imgListIndex) val.imgListIndex = 0;
            if (val.way) {
              implant.addevent("onclick", () => {
                _val.imgListIndex++;
                if (_val.imgListIndex > _val.imgList.length - 1)
                  _val.imgListIndex = 0;
                implant.url = val.imgList[_val.imgListIndex].filePath;
              });
              implant.enabled = true;
            } else {
              let setInt = setInterval(() => {
                _val.imgListIndex++;
                if (_val.imgListIndex > _val.imgList.length - 1)
                  _val.imgListIndex = 0;
                implant.url = val.imgList[_val.imgListIndex].filePath;
              }, val.velocity * 1000);
              window.implantInterval.push({ hotname: setInt });
            }
          }
        } else {
          implantImg = window.krpano.actions.addhotspot(hotname + "_img");
          implantImg.loadstyle("imgimplant");
          implantImg.url = val.videoPosterPath;

          implant.url = "%VIEWER%/plugins/jy-config/videoplayer.js";
          implant.videourl = val.videoPath;
          implant.posterurl = val.videoPosterPath;

          implant.loop = val.isLoop;
          implant.muted = val.isMute;
          implant.pausedonstart = !val.isAutoPlay;
          implant.autopause = false;
          implant.autoresume = false;
          implant.enabled = true;
          let _val = val;
          implant.addevent("onloaded", () => {
            if (_val.isAutoPlay) {
              if (window.WeixinJSBridge) {
                window.WeixinJSBridge.invoke("getNetworkType", {}, () => {
                  implant.play();
                });
              } else {
                implant.play();
              }
            }
          });
          implant.addevent("onclick", () => {
            implant.togglepause();
            implant.isuserplay = !implant.ispaused;
          });
          window.krpano.call("addhotspot(" + hotname + "_implant_icon, hicon)");
          videoIcon = window.krpano.get("hicon");
          videoIcon.url = "%VIEWER%/plugins/jy-config/embed_video_play.png";

          videoIcon.depthbuffer = true;
          implant.depthbuffer = true;
          implant.isuserplay = false;
          videoIcon.addevent("onclick", () => {
            implant.play();
            videoIcon.visible = false;
            implant.isuserplay = !implant.ispaused;
          });
          implant.addevent("onvideoplay", () => {
            videoIcon.visible = false;
            implant.alpha = 1;
            window.krpano.actions.removehotspot(implantImg.name);
            // implant.enabled = false
            if (window.isShowDialog) return;
            if (_val.isCloseBgm) {
              window.Panorama.emit("pause_music");
            }
            if (_val.isCloseExplain) {
              window.Panorama.emit("pause_voice");
            }
          });
          implant.addevent("onvideopaused", () => {
            videoIcon.visible = true;
            // implant.enabled = true
            let isOtherPlay = [false, false];
            window.jydata.implantList.map((val1) => {
              if (
                val1.scenes.findIndex(
                  (item) => item == window.krpano.xml.scene,
                ) != -1
              ) {
                if (
                  val1.isCloseBgm &&
                  window.jydata.scenes.find(
                    (item) => item.name == window.krpano.xml.scene,
                  ).audio.bgm.isAutoPlay &&
                  window.jydata.scenes.find(
                    (item) => item.name == window.krpano.xml.scene,
                  ).audio.bgm.audioPath
                ) {
                  if (
                    window.krpano.get("hotspot[hot_implant_" + val.id + "]")
                      .ispaused
                  ) {
                    isOtherPlay[0] = true;
                  }
                }
                if (
                  val1.isCloseExplain &&
                  window.jydata.scenes.find(
                    (item) => item.name == window.krpano.xml.scene,
                  ).audio.explain.isAutoPlay &&
                  window.jydata.scenes.find(
                    (item) => item.name == window.krpano.xml.scene,
                  ).audio.explain.audioPath
                ) {
                  if (
                    window.krpano.get("hotspot[hot_implant_" + val.id + "]")
                      .ispaused
                  ) {
                    isOtherPlay[1] = true;
                  }
                }
              }
            });
            if (window.isShowDialog) return;
            if (isOtherPlay[0]) {
              window.Panorama.emit("play_music");
            }
            if (isOtherPlay[1]) {
              window.Panorama.emit("play_voice");
            }
          });
        }
        try {
          implant.chromakey =
            "0x" +
            val.particulars.color.substring(1) +
            "|" +
            val.particulars.threshold +
            "|" +
            val.particulars.smoothness;
        } catch (error) {}

        implant.scale = val.particulars.scale;

        if (scenedata.type == 4) {
          window.krpano.set("h.scale", val.particulars.scale * 0.01);
        }
        implant.is3d = val.is3d;
        if (val.is3d && !val.islive) {
          implant.tx =
            val.position.tx + val.position["nx"] * val.particulars.distance;
          implant.ty =
            val.position.ty + val.position["ny"] * val.particulars.distance;
          implant.tz =
            val.position.tz + val.position["nz"] * val.particulars.distance;
          implant.rx =
            val.position.rx + val.position["nx"] * val.particulars.rotate;
          implant.ry =
            val.position.ry + val.position["ny"] * val.particulars.rotate;
          implant.rz =
            val.position.rz + val.position["nz"] * val.particulars.rotate;
          implant.width = 128;
          implant.height = "prop";
        } else {
          implant.width = 64;
          implant.height = "prop";
          implant.depth = 160;
          implant.depthbuffer = false;
          implant.ath = val.position.ath + val.particulars.horizontal;
          implant.atv = val.position.atv + val.particulars.direction;
          implant.tx = scenedata.position.tx;
          implant.ty = scenedata.position.ty;
          implant.tz = scenedata.position.tz;
          implant.rx = val.particulars.rx;
          implant.ry = val.particulars.ry;
          implant.rz = val.particulars.rz;
        }
        if (val.islive && val.position.hfov) {
          implant.ath = 0;
          implant.atv = 0;
          implant.rx = 0;
          implant.ry = 0;
          implant.rz = 0;
          implant.onloaded =
            "calc_pos_from_hfov_yaw_pitch_roll(" +
            val.position.hfov +
            ", " +
            val.position.yaw +
            ", " +
            val.position.pitch +
            ", " +
            val.position.roll +
            ");";
          implant.scale = 160 / 1000;
          implant.nodrop = true;
          window.krpano.call("callwith(h,onloaded)");
        }
        if (!val.is3d) {
          implant.tx = 0;
          implant.ty = 0;
          implant.tz = 0;
        }
        if (!val.islive && val.isParallel) {
          let arr1 = [
            scenedata.position.tx,
            scenedata.position.ty,
            scenedata.position.tz,
          ];
          let arr2 = [implant.tx, implant.ty, implant.tz];
          window.krpano.set("h.rx", 0);
          window.krpano.set("h.rz", 0);
          window.krpano.set(
            "h.ry",
            Math.atan2(arr2[0] - arr1[0], arr2[2] - arr1[2]) * (180 / Math.PI),
          );
          window.implantIntervalLook.push(implant);
        }

        if (!val.islive) {
          window.krpano.set(
            "h.height",
            window.krpano.get("h.width") / val.particulars.aspectRatio,
          );
        }
        if (val.isimg && val.imgList.length > 1) {
          window.krpano.set("h.height", "prop");
        }

        if (videoIcon) {
          videoIcon.width = implant.width / 4;
          videoIcon.height = "prop";
          videoIcon.scale = implant.scale;
          videoIcon.depth = implant.depth;
          if (val.islive) {
            videoIcon.depth = implant.depth - 5;
          }
          videoIcon.tx = implant.tx;
          videoIcon.ty = implant.ty;
          videoIcon.tz = implant.tz;
          videoIcon.ath = implant.ath;
          videoIcon.atv = implant.atv;
          videoIcon.rx = implant.rx;
          videoIcon.ry = implant.ry;
          videoIcon.rz = implant.rz;
          videoIcon.zorder = implant.zorder + 1;
          if (scenedata.type != 4) {
            videoIcon.oy = -1;
          }
          videoIcon.distorted = implant.distorted;
          videoIcon.rotationorder = implant.rotationorder;
          window.videoIcon = videoIcon;
          if (val.isLock) {
            implant.enabled = false;
          }
          if (val.isHidePauseButton) {
            videoIcon.alpha = 0;
          }

          implantImg.width = implant.width;
          implantImg.height = implant.width / val.particulars.aspectRatio;
          implantImg.scale = implant.scale;
          implantImg.depth = implant.depth;
          implantImg.tx = implant.tx;
          implantImg.ty = implant.ty;
          implantImg.tz = implant.tz;
          implantImg.ath = implant.ath;
          implantImg.atv = implant.atv;
          implantImg.rx = implant.rx;
          implantImg.ry = implant.ry;
          implantImg.rz = implant.rz;
          implantImg.zorder = implant.zorder;
          implantImg.distorted = implant.distorted;
          implantImg.rotationorder = implant.rotationorder;
          implantImg.enabled = false;
          implant.alpha = 0;
          try {
            implantImg.chromakey =
              "0x" +
              val.particulars.color.substring(1) +
              "|" +
              val.particulars.threshold +
              "|" +
              val.particulars.smoothness;
          } catch (error) {}
        }
      }
    }
  });
});
window.Panorama.on("is_implant_play", () => {
  window.isImplantPlay = [false, false];
  window.jydata.implantList.map((val1) => {
    if (
      val1.scenes.findIndex((item) => item == window.krpano.xml.scene) != -1
    ) {
      if (
        !window.krpano.get("hotspot[hot_implant_" + val1.id + "]")?.ispaused &&
        !val1.isimg &&
        val1.implantType != 5 &&
        val1.implantType != 7
      ) {
        if (val1.isCloseBgm) {
          window.isImplantPlay[0] = true;
        }
        if (val1.isCloseExplain) {
          window.isImplantPlay[1] = true;
        }
      }
    }
  });
});

window.Panorama.on("init_pano", (name) => {
  window.krpano.call(
    "loadscene(" +
      name +
      ",null,MERGE|KEEPVIEW|KEEPMOVING|KEEPHOTSPOTS,BLEND(0));",
  );
  window.krpano.set("view.tx", window.krpano.get("image.ox"));
  window.krpano.set("view.ty", window.krpano.get("image.oy"));
  window.krpano.set("view.tz", window.krpano.get("image.oz"));
});
window.Panorama.on("init_littleplanet", () => {
  var _hlookat = 0;
  window.krpano.set("image.depthmap.enabled", false);
  window.krpano.set("view.fov", 150); // 120
  window.krpano.set("view.fisheye", 1);
  window.krpano.set("view.vlookat", 90);
  window.krpano.set("view.fovmax", 150);
  let scene = window.jydata.scenes.find(
    (item) => item.name === window.krpano.xml.scene,
  );
  window.krpano.set("view.hlookat", scene.view.vlookat - 90);
  window.krpano.call("tween(view.fov,120,3);");
  window.krpano.call("tween(view.hlookat,360,8);");
  setTimeout(() => {
    _hlookat = parseFloat(window.krpano.get("view.hlookat"));
    window.krpano.call("stoptween(view.hlookat);");
    window.initLittle = setInterval(() => {
      if (_hlookat > 360) {
        _hlookat -= 360;
      } else {
        _hlookat += 0.1;
      }
      window.krpano.set("view.hlookat", _hlookat);
    }, 5);
  }, 3000);
});
window.Panorama.on("init_krpano", () => {
  let scene = window.jydata.scenes.find(
    (item) => item.name === window.krpano.xml.scene,
  );
  clearInterval(window.initLittle);
  window.krpano.call("tween(view.fov," + scene.view.fov + ",3);");
  window.krpano.call("tween(view.fisheye,0,3);");
  window.krpano.call("tween(view.hlookat," + scene.view.hlookat + ",3);");
  window.krpano.call("tween(view.vlookat," + scene.view.vlookat + ",3);");
  setTimeout(() => {
    window.krpano.set("view.fovmax", scene.view.fovmax);

    window.krpano.set("image.depthmap.enabled", true);
  }, 3000);
});
window.Panorama.on("init_littleplanet_krpano", () => {
  let scene = window.jydata.scenes.find(
    (item) => item.name === window.krpano.xml.scene,
  );
  window.krpano.set("image.depthmap.enabled", false);
  window.krpano.set("view.fov", 150);
  window.krpano.set("view.fisheye", 1);
  window.krpano.set("view.fovmax", 150);
  window.krpano.set("view.vlookat", 90);
  window.krpano.set("view.hlookat", scene.view.hlookat - 180);
  setTimeout(() => {
    window.krpano.call("tween(view.fov," + scene.view.fov + ",3);");
    window.krpano.call("tween(view.fisheye,0,3);");
    window.krpano.call("tween(view.hlookat," + scene.view.hlookat + ",3);");
    window.krpano.call("tween(view.vlookat," + scene.view.vlookat + ",3);");
    setTimeout(() => {
      window.krpano.set("view.fovmax", scene.view.fovmax);
      window.krpano.set("image.depthmap.enabled", true);
    }, 3000);
  }, 2000);
});
function showHotspot() {
  window.Panorama.emit("shade_change");
  window.Panorama.emit("hotspots_change");
  window.Panorama.emit("line_change");
  window.Panorama.emit("implant_change");
}
function deleteAllHotspot() {
  let names = [];
  window.krpano
    .get("hotspot")
    .getArray()
    .map((val, inx) => {
      if (val.name.indexOf("_implant_") != -1) {
        names.push(val.name);
      }
      if (val.name.indexOf("_hotspot_") != -1) {
        names.push(val.name);
      }
      if (val.name.indexOf("_scaleplate_") != -1) {
        names.push(val.name);
      }
    });
  names.map((val) => {
    window.krpano.call("removehotspot(" + val + ")");
  });
  window.implantInterval.map((name, setInt) => {
    clearInterval(setInt);
  });
  window.implantInterval = [];
  window.implantIntervalLook = [];
}
window.deleteAllHotspot = deleteAllHotspot;
window.showHotspot = showHotspot;

window.Panorama.on("delete_hotspots", () => {
  let names = [];
  window.krpano
    .get("hotspot")
    .getArray()
    .map((val, inx) => {
      if (
        val.name.indexOf("_hotspot_") != -1 &&
        !(val.hotspottype == 1 || val.hotspottype == 2)
      ) {
        names.push(val.name);
      }
    });
  names.map((val) => {
    window.krpano.call("removehotspot(" + val + ")");
  });
});
window.Panorama.on("enterVR", () => {
  let names = [];
  window.krpano
    .get("hotspot")
    .getArray()
    .map((val, inx) => {
      if (
        val.name.indexOf("_hotspot_") != -1 &&
        !(val.hotspottype == 1 || val.hotspottype == 2)
      ) {
        names.push(val.name);
      }
      if (val.name.indexOf("_scaleplate_") != -1) {
        names.push(val.name);
      }
    });
  names.map((val) => {
    window.krpano.call("removehotspot(" + val + ")");
  });
  window.krpano
    .get("hotspot")
    .getArray()
    .map((val, inx) => {
      if (val.name.indexOf("_hotspot_") != -1) {
        val.distorted = true;
        let arr1 = [
          window.krpano.view.tx,
          window.krpano.view.ty,
          window.krpano.view.tz,
        ];
        let arr2 = [val.tx, val.ty, val.tz];
        val.ry =
          Math.atan2(arr2[0] - arr1[0], arr2[2] - arr1[2]) * (180 / Math.PI);
        val.rx = 0;
        val.rz = 0;
        val.scale = val.scalevr;
        if (val.name.indexOf("vrtooltip_") != -1) {
          val.oy = -5;
        }
      }
    });
});
window.Panorama.on("exitVR", () => {
  let names = [];
  window.krpano
    .get("hotspot")
    .getArray()
    .map((val, inx) => {
      if (val.name.indexOf("_hotspot_") != -1) {
        names.push(val.name);
      }

      if (val.name.indexOf("_scaleplate_") != -1) {
        names.push(val.name);
      }
    });
  names.map((val) => {
    window.krpano.call("removehotspot(" + val + ")");
  });
  window.Panorama.emit("hotspots_change");
  window.Panorama.emit("line_change");
});

window.Panorama.on("krTweenUpdate", () => {
  window.implantIntervalLook.map((hot) => {
    if (!hot) {
      return;
    }
    let arr1 = [
      window.krpano.view.tx,
      window.krpano.view.ty,
      window.krpano.view.tz,
    ];
    let arr2 = [hot.tx, hot.ty, hot.tz];
    hot.ry = Math.atan2(arr2[0] - arr1[0], arr2[2] - arr1[2]) * (180 / Math.PI);
    window.krpano.set("hotspot[" + hot.name + "_implant_icon].ry", hot.ry);
  });
  if (window.krpano.webvr && window.krpano.webvr.isenabled) {
    window.krpano
      .get("hotspot")
      .getArray()
      .map((val, inx) => {
        if (val.name.indexOf("_hotspot_") != -1) {
          val.distorted = true;
          let arr1 = [
            window.krpano.view.tx,
            window.krpano.view.ty,
            window.krpano.view.tz,
          ];
          let arr2 = [val.tx, val.ty, val.tz];
          val.ry =
            Math.atan2(arr2[0] - arr1[0], arr2[2] - arr1[2]) * (180 / Math.PI);
          val.rx = 0;
          val.rz = 0;
          val.scale = val.scalevr;
          if (val.name.indexOf("vrtooltip_") != -1) {
            val.oy = -5;
          }
        }
      });
  }
});

window.Panorama.on("loadscene", ([name, iskeep, type, isviewkeep]) => {
  let scene = window.jydata.scenes.find((item) => item.name === name);
  type = type == undefined ? 0 : type;
  iskeep = iskeep == undefined ? false : true;
  isviewkeep = isviewkeep == "true" ? true : false;

  clearTimeout(window.setTimeKrHot);

  if (type == 0 && scene.type != 3) {
    if (
      scene.view.hlookatmin != -180 ||
      scene.view.hlookatmax != 180 ||
      scene.view.vlookatmin != -90 ||
      scene.view.vlookatmax != 90
    ) {
      type = 1;
    } else if (!scene.model) {
      type = 1;
    }
  }

  if (type !== 0 && type !== 8) {
    deleteAllHotspot();
  }

  if (window.jydata.base.tour.revolve != "none") {
    window.krpano.autorotate.interrupt();
  }

  window.krpano.set("control.bouncinglimits", false);

  const BIGANTO_EASING = "easeInOutQuad";
  const TRANSITION_DURATION = 0.95;
  const CROSSFADE_DURATION = 0.95;
  const TWEEN_DURATION = 0.95;
  const LOOK_DURATION = 0.95;
  const PRELOAD_DELAY = 250;
  const HOTSPOT_DELAY = TRANSITION_DURATION * 1000 + 100;

  try {
    window.krpano.set("image.multires.loadahead", 1);
    window.krpano.set("image.multires.downloadlockedlevels", true);
  } catch (e) {}

  // Hàm helper để setup view
  const setupSceneView = (scene) => {
    if (scene.type == 3) {
      window.krpano.set("control.invert", true);
      window.krpano.set("view.tx", scene.position.tx);
      window.krpano.set("view.ty", scene.position.ty);
      window.krpano.set("view.tz", scene.position.tz);
      window.krpano.set("view.ox", 0);
      window.krpano.set("view.oy", 0);
      window.krpano.set(
        "view.oz",
        window.jydata.sandTable.map.find(
          (item1) => item1.id == scene.sandTableSet.sandTableId,
        ).distance,
      );
    } else {
      window.krpano.set("control.invert", false);
      window.krpano.set("view.tx", window.krpano.get("image.ox"));
      window.krpano.set("view.ty", window.krpano.get("image.oy"));
      window.krpano.set("view.tz", window.krpano.get("image.oz"));
      window.krpano.set("view.ox", 0);
      window.krpano.set("view.oy", 0);
      window.krpano.set("view.oz", 0);
      if (scene.type == 4) {
        window.krpano.set("control.bouncinglimits", true);
      }
    }
  };

  // Hàm helper để cleanup hotspots
  const cleanupHotspots = (delay = 1500) => {
    window.setTimeKrHot = setTimeout(() => {
      let names = [];
      window.krpano
        .get("hotspot")
        .getArray()
        .forEach((val) => {
          if (
            val.name.indexOf("_implant_") != -1 ||
            val.name.indexOf("_hotspot_") != -1 ||
            val.name.indexOf("_scaleplate_") != -1
          ) {
            names.push(val.name);
          }
        });

      window.Panorama.emit("implant_change", names);
      window.Panorama.emit("hotspots_change", names);
      window.Panorama.emit("line_change", names);

      names.forEach((val) => {
        window.krpano.call("removehotspot(" + val + ")");
      });

      window.implantInterval.forEach((setInt, index) => {
        const name = window.implantInterval[index];
        let nameIndex = names.findIndex((name1) => name1 == name);
        if (nameIndex < 0) {
          clearInterval(setInt);
        }
      });

      window.implantInterval = [];

      window.implantIntervalLook.forEach((hotspot, index) => {
        if (hotspot) {
          let nameIndex = names.findIndex((name1) => name1 == hotspot.name);
          if (nameIndex > -1) {
            window.implantIntervalLook[index] = null;
          }
        }
      });
    }, delay);
  };
  const bigantoSmoothTransition = (scene, customEasing = null) => {
    const easing = customEasing || BIGANTO_EASING;

    let preCleanupNames = [];
    window.krpano
      .get("hotspot")
      .getArray()
      .forEach((val) => {
        if (
          val.name.indexOf("_implant_") != -1 ||
          val.name.indexOf("_hotspot_") != -1 ||
          val.name.indexOf("_scaleplate_") != -1
        ) {
          preCleanupNames.push(val.name);
        }
      });

    preCleanupNames.forEach((val) => {
      window.krpano.call("removehotspot(" + val + ")");
    });

    window.krpano.actions.loadscene(
      name,
      null,
      "MERGE|KEEPVIEW|KEEPMOVING",
      `BLEND(${CROSSFADE_DURATION}, ${easing})`,
      () => {
        // Setup view ngay sau khi load
        if (scene.type == 3) {
          window.krpano.set("control.invert", true);

          const currentTx = window.krpano.get("view.tx");
          const currentTy = window.krpano.get("view.ty");
          const currentTz = window.krpano.get("view.tz");

          // Animate position mượt mà
          if (
            currentTx != scene.position.tx ||
            currentTy != scene.position.ty ||
            currentTz != scene.position.tz
          ) {
            window.krpano.call(
              `tween(view.tx|view.ty|view.tz, calc('${scene.position.tx}|${scene.position.ty}|${scene.position.tz}'), ${TWEEN_DURATION}, ${easing})`,
            );
          } else {
            window.krpano.set("view.tx", scene.position.tx);
            window.krpano.set("view.ty", scene.position.ty);
            window.krpano.set("view.tz", scene.position.tz);
          }

          window.krpano.call(
            `tween(view.ox|view.oy|view.oz, calc('0|0|${
              window.jydata.sandTable.map.find(
                (item1) => item1.id == scene.sandTableSet.sandTableId,
              ).distance
            }'), ${TWEEN_DURATION}, ${easing})`,
          );
        } else {
          window.krpano.set("control.invert", false);

          const targetTx = window.krpano.get("image.ox");
          const targetTy = window.krpano.get("image.oy");
          const targetTz = window.krpano.get("image.oz");

          window.krpano.call(
            `tween(view.tx|view.ty|view.tz|view.ox|view.oy|view.oz, calc('${targetTx}|${targetTy}|${targetTz}|0|0|0'), ${TWEEN_DURATION}, ${easing})`,
          );

          if (scene.type == 4) {
            window.krpano.set("control.bouncinglimits", true);
          }
        }

        // Hiển thị hotspots sau khi animation hoàn tất
        setTimeout(
          () => {
            showHotspot();
          },
          TWEEN_DURATION * 1000 + 50,
        );
      },
    );

    window.Panorama.emit("shade_change");

    // Animate camera look - đồng bộ với blend
    if (scene.view.isCheck) {
      setTimeout(() => {
        window.krpano.call(
          `lookto(${scene.view.hlookat}, ${scene.view.vlookat}, ${window.krpano.view.fov}, tween(${easing}, ${LOOK_DURATION}), true)`,
        );
      }, PRELOAD_DELAY);
    }

    cleanupHotspots(HOTSPOT_DELAY);
  };

  // ============ BIGANTO-STYLE OPENBLEND (Alternative) ============
  const bigantoOpenBlend = (scene) => {
    // Xóa hotspots
    let preCleanupNames = [];
    window.krpano
      .get("hotspot")
      .getArray()
      .forEach((val) => {
        if (
          val.name.indexOf("_implant_") != -1 ||
          val.name.indexOf("_hotspot_") != -1 ||
          val.name.indexOf("_scaleplate_") != -1
        ) {
          preCleanupNames.push(val.name);
        }
      });

    preCleanupNames.forEach((val) => {
      window.krpano.call("removehotspot(" + val + ")");
    });

    // OPENBLEND: Hiệu ứng mượt, không xé ảnh
    window.krpano.actions.loadscene(
      name,
      null,
      "MERGE|KEEPVIEW|KEEPMOVING",
      `OPENBLEND(${CROSSFADE_DURATION}, 1.0, 0.0, 0.0, ${BIGANTO_EASING})`,
      () => {
        if (scene.type == 3) {
          window.krpano.set("control.invert", true);

          const currentTx = window.krpano.get("view.tx");
          const currentTy = window.krpano.get("view.ty");
          const currentTz = window.krpano.get("view.tz");

          if (
            currentTx != scene.position.tx ||
            currentTy != scene.position.ty ||
            currentTz != scene.position.tz
          ) {
            window.krpano.call(
              `tween(view.tx|view.ty|view.tz, calc('${scene.position.tx}|${scene.position.ty}|${scene.position.tz}'), ${TWEEN_DURATION}, ${BIGANTO_EASING})`,
            );
          } else {
            window.krpano.set("view.tx", scene.position.tx);
            window.krpano.set("view.ty", scene.position.ty);
            window.krpano.set("view.tz", scene.position.tz);
          }

          window.krpano.call(
            `tween(view.ox|view.oy|view.oz, calc('0|0|${
              window.jydata.sandTable.map.find(
                (item1) => item1.id == scene.sandTableSet.sandTableId,
              ).distance
            }'), ${TWEEN_DURATION}, ${BIGANTO_EASING})`,
          );
        } else {
          window.krpano.set("control.invert", false);

          const targetTx = window.krpano.get("image.ox");
          const targetTy = window.krpano.get("image.oy");
          const targetTz = window.krpano.get("image.oz");

          window.krpano.call(
            `tween(view.tx|view.ty|view.tz|view.ox|view.oy|view.oz, calc('${targetTx}|${targetTy}|${targetTz}|0|0|0'), ${TWEEN_DURATION}, ${BIGANTO_EASING})`,
          );

          if (scene.type == 4) {
            window.krpano.set("control.bouncinglimits", true);
          }
        }

        setTimeout(
          () => {
            showHotspot();
          },
          TWEEN_DURATION * 1000 + 50,
        );
      },
    );

    window.Panorama.emit("shade_change");

    if (scene.view.isCheck) {
      setTimeout(() => {
        window.krpano.call(
          `lookto(${scene.view.hlookat}, ${scene.view.vlookat}, ${window.krpano.view.fov}, tween(${BIGANTO_EASING}, ${LOOK_DURATION}), true)`,
        );
      }, PRELOAD_DELAY);
    }

    cleanupHotspots(HOTSPOT_DELAY);
  };

  // ============ SWITCH CASES VỚI BIGANTO STYLE ============
  switch (type) {
    case 0: // Smooth transition - BIGANTO STYLE
      bigantoSmoothTransition(scene, BIGANTO_EASING);
      break;

    case 1: // Standard blend - Biganto style
      window.krpano.actions.loadscene(
        name,
        null,
        (isviewkeep ? "KEEPVIEW|" : "") + "MERGE|KEEPHOTSPOTS|KEEPMOVING",
        `BLEND(${CROSSFADE_DURATION}, ${BIGANTO_EASING})`,
        () => {
          setupSceneView(scene);
          showHotspot();
        },
      );
      break;

    case 2: // Zoom blend
      window.krpano.actions.loadscene(
        name,
        null,
        (isviewkeep ? "KEEPVIEW|" : "") + "MERGE|KEEPHOTSPOTS|KEEPMOVING",
        `ZOOMBLEND(1.2, ${CROSSFADE_DURATION}, ${BIGANTO_EASING})`,
        () => {
          setupSceneView(scene);
          showHotspot();
        },
      );
      break;

    case 3: // Color blend
      window.krpano.actions.loadscene(
        name,
        null,
        (isviewkeep ? "KEEPVIEW|" : "") + "MERGE|KEEPHOTSPOTS|KEEPMOVING",
        `COLORBLEND(${CROSSFADE_DURATION}, 0x000000, ${BIGANTO_EASING})`,
        () => {
          setupSceneView(scene);
          showHotspot();
        },
      );
      break;

    case 4: // Light blend
      window.krpano.actions.loadscene(
        name,
        null,
        (isviewkeep ? "KEEPVIEW|" : "") + "MERGE|KEEPHOTSPOTS|KEEPMOVING",
        `LIGHTBLEND(${CROSSFADE_DURATION}, 0xFFFFFF, 1.2, ${BIGANTO_EASING})`,
        () => {
          setupSceneView(scene);
          showHotspot();
        },
      );
      break;

    case 5: // Slide blend
      window.krpano.actions.loadscene(
        name,
        null,
        (isviewkeep ? "KEEPVIEW|" : "") + "MERGE|KEEPHOTSPOTS|KEEPMOVING",
        `SLIDEBLEND(${CROSSFADE_DURATION}, 0.0, 0.15, ${BIGANTO_EASING})`,
        () => {
          setupSceneView(scene);
          showHotspot();
        },
      );
      break;

    case 6: // Open blend - Biganto's signature
      bigantoOpenBlend(scene);
      break;

    case 7: // Keep view blend
      window.krpano.actions.loadscene(
        name,
        null,
        "MERGE|KEEPHOTSPOTS|KEEPVIEW|KEEPMOVING",
        `BLEND(${CROSSFADE_DURATION}, ${BIGANTO_EASING})`,
        () => {
          setupSceneView(scene);
          showHotspot();
        },
      );
      break;

    case 8: // Custom smooth - Vertical look only
      let preCleanup8Names = [];
      window.krpano
        .get("hotspot")
        .getArray()
        .forEach((val) => {
          if (
            val.name.indexOf("_implant_") != -1 ||
            val.name.indexOf("_hotspot_") != -1 ||
            val.name.indexOf("_scaleplate_") != -1
          ) {
            preCleanup8Names.push(val.name);
          }
        });

      preCleanup8Names.forEach((val) => {
        window.krpano.call("removehotspot(" + val + ")");
      });

      window.krpano.actions.loadscene(
        name,
        null,
        "MERGE|KEEPVIEW|KEEPMOVING",
        `BLEND(${CROSSFADE_DURATION}, ${BIGANTO_EASING})`,
        () => {
          if (scene.type == 3) {
            window.krpano.set("control.invert", true);

            const currentTx = window.krpano.get("view.tx");
            const currentTy = window.krpano.get("view.ty");
            const currentTz = window.krpano.get("view.tz");

            if (
              currentTx != scene.position.tx ||
              currentTy != scene.position.ty ||
              currentTz != scene.position.tz
            ) {
              window.krpano.call(
                `tween(view.tx|view.ty|view.tz, calc('${scene.position.tx}|${scene.position.ty}|${scene.position.tz}'), ${TWEEN_DURATION}, ${BIGANTO_EASING})`,
              );
            } else {
              window.krpano.set("view.tx", scene.position.tx);
              window.krpano.set("view.ty", scene.position.ty);
              window.krpano.set("view.tz", scene.position.tz);
            }

            window.krpano.call(
              `tween(view.ox|view.oy|view.oz, calc('0|0|${
                window.jydata.sandTable.map.find(
                  (item1) => item1.id == scene.sandTableSet.sandTableId,
                ).distance
              }'), ${TWEEN_DURATION}, ${BIGANTO_EASING})`,
            );
          } else {
            window.krpano.set("control.invert", false);

            const targetTx = window.krpano.get("image.ox");
            const targetTy = window.krpano.get("image.oy");
            const targetTz = window.krpano.get("image.oz");

            window.krpano.call(
              `tween(view.tx|view.ty|view.tz|view.ox|view.oy|view.oz, calc('${targetTx}|${targetTy}|${targetTz}|0|0|0'), ${TWEEN_DURATION}, ${BIGANTO_EASING})`,
            );

            if (scene.type == 4) {
              window.krpano.set("control.bouncinglimits", true);
            }
          }

          setTimeout(
            () => {
              showHotspot();
            },
            TWEEN_DURATION * 1000 + 50,
          );
        },
      );

      window.Panorama.emit("shade_change");

      // Chỉ animate vertical look
      setTimeout(() => {
        window.krpano.call(
          `lookto(${window.krpano.view.hlookat}, ${scene.view.vlookat}, ${window.krpano.view.fov}, tween(${BIGANTO_EASING}, ${LOOK_DURATION}), true)`,
        );
      }, PRELOAD_DELAY);

      cleanupHotspots(HOTSPOT_DELAY);
      break;

    case 9: // Instant load
      window.krpano.actions.loadscene(
        name,
        null,
        "MERGE|KEEPHOTSPOTS",
        "BLEND(0.1)",
        () => {
          setupSceneView(scene);
          showHotspot();
        },
      );
      break;

    default:
      window.krpano.actions.loadscene(
        name,
        null,
        (isviewkeep ? "KEEPVIEW|" : "") + "MERGE|KEEPHOTSPOTS|KEEPMOVING",
        `BLEND(${CROSSFADE_DURATION}, ${BIGANTO_EASING})`,
        () => {
          setupSceneView(scene);
          showHotspot();
        },
      );
  }

  // Set view angles với timing mượt
  if (!iskeep) {
    if (scene.model) {
      setTimeout(() => {
        window.krpano.call(
          `lookto(${scene.view.hlookat}, ${scene.view.vlookat}, ${scene.view.fov}, tween(${BIGANTO_EASING}, ${LOOK_DURATION}))`,
        );
      }, PRELOAD_DELAY);
    } else {
      window.krpano.set("view.hlookat", scene.view.hlookat);
      window.krpano.set("view.vlookat", scene.view.vlookat);
    }
  }
});

window.Panorama.on("krpanoChangeCursor", () => {
  if (window.jydata.base.cursor.cursorSrc) {
    window.krpano.set(
      "hotspot[hotspot_mouse].url",
      "./" + window.jydata.base.cursor.cursorSrc,
    );
  }
  window.krpano.set(
    "hotspot[hotspot_mouse].scale",
    window.jydata.base.cursor.cursorSize,
  );
});
window.Panorama.on("readyAddScene", () => {
  let angle = 360 / window.jydata.base.tour.velocity;
  angle = angle * (window.jydata.base.tour.revolve != "right" ? 1 : -1);
  if (window.jydata.base.tour.revolve != "none") {
    let xmlstring =
      '<krpano><autorotate enabled ="false" waittime ="5"  accel ="1.0"' +
      ' speed ="' +
      angle +
      '" ' +
      ' horizon ="' +
      (window.jydata.base.tour.cruise ? "0" : "off") +
      '" ' +
      ' tofov ="off" oneroundrange ="360.0" zoomslowdown ="true"  interruptionevents ="userviewchange|layers|keyboard "/></krpano>';
    window.krpano.call("includexmlstring(" + xmlstring + ");");
  } else {
    window.krpano.autorotate.speed = 0;
    window.krpano.autorotate.waittime = 9999;
  }
  window.krpano.actions.includexml("%VIEWER%/plugins/jy-config/webvr.xml");

  if (window.jydata.base.visibles.enhance) {
    window.krpano.addplugin("pp_sharpen");
    window.krpano.set(
      "plugin[pp_sharpen].url",
      "%VIEWER%/plugins/jy-config/pp_sharpen.js",
    );
    window.krpano.set("plugin[pp_sharpen].keep", true);
    window.krpano.set("plugin[pp_sharpen].strength", 2.0);
    window.krpano.set("plugin[pp_sharpen].range", 1.0);
    window.krpano.set("plugin[pp_sharpen].luminanceonly", true);
    window.krpano.set("plugin[pp_sharpen].quality", 3.0);
    window.krpano.set("plugin[pp_sharpen].order", 7.0);
    window.krpano.set("plugin[pp_sharpen].phase", 2.0);
  }
  let isVideoPano = false;
  let videourl = "";
  let posterurl = "";
  window.jydata.scenes.forEach((val) => {
    if (val.type == 2) {
      isVideoPano = true;
      videourl = val.videoUrl;
      posterurl = val.videoPreview;
    }
  });
  if (isVideoPano) {
    window.krpano.addplugin("video_plugin");
    window.krpano.set(
      "plugin[video_plugin].url",
      "%VIEWER%/plugins/jy-config/videoplayer.js",
    );
    window.krpano.set("plugin[video_plugin].keep", true);
    window.krpano.set("plugin[video_plugin].pausedonstart", true);
    window.krpano.set("plugin[video_plugin].loop", false);
    window.krpano.set("plugin[video_plugin].alpha", 0);
    window.krpano.set("plugin[video_plugin].volume", 1);
    window.krpano.set("plugin[video_plugin].panovideo", true);
    // window.krpano.set('plugin[video_plugin].html5preload', 'metadata')

    window.krpano.set("plugin[video_plugin].enabled", false);
    window.krpano.set(
      "plugin[video_plugin].onvideoready",
      "js(pano_video_ready())",
    );
    window.krpano.set(
      "plugin[video_plugin].onvideoplay",
      "js(pano_video_play())",
    );

    window.krpano.set(
      "plugin[video_plugin].onvideocomplete",
      "js(pano_video_complete())",
    );
    window.krpano.set(
      "plugin[video_plugin].onvideopaused",
      "js(pano_video_paused())",
    );
    window.krpano.set("plugin[video_plugin].onloaded", "js(videoPluginLoad())");
  }
});

window.Panorama.on("pano_video_complete", () => {
  let scene = window.jydata.scenes.find(
    (scene) => scene.name == window.krpano.xml.scene,
  );
  if (scene.videoSet.type == 2 && scene.videoSet.endScene != "") {
    window.Panorama.emit("loadscene", [scene.videoSet.endScene, true, 7]);
  } else if (scene.videoSet.type == 1 && scene.videoSet.startScene != "") {
    window.Panorama.emit("loadscene", [scene.videoSet.startScene, true, 7]);
  }
});

window.Panorama.on("relevance_update", () => {
  // if(!window.jydata.base.model) return
  let arr = [];
  window.jydata.scenes.forEach((val) => {
    if (!val.model) return;
    let arr1 = [[], [], []];
    arr1[0] = [val.name.substring(6), val.name];
    if (val.relevance) {
      val.relevance.forEach((val1) => {
        arr1[1].push(val1.substring(6));
      });
    }
    arr1[2] = [val.position.tx, val.position.ty, val.position.tz];
    arr.push(arr1);
  });

  window.krpano.jynav = arr;
  if (window.jydata.base.visibles.forwardSensing) {
    window.krpano.events.onclick += ";js(navigatorNormal())";
  } else {
    if (!window.krpano.xml.scene)
      window.krpano.xml.scene = window.krpano.get("scene[0].name");
    window.krpano.removeplugin("navigator");
    window.krpano.addplugin("navigator");
    window.krpano.set(
      "plugin[navigator].url",
      "%VIEWER%/plugins/jy-config/jy_nav.js",
    );
    window.krpano.set("plugin[navigator].keep", true);
    window.krpano.set("plugin[navigator].devices", "html5");
  }
});
window.Panorama.on("navigatorNormal", () => {
  if (window.krpano && (window.krpano.get("measure3d_loop") == true || window.krpano.get("measure3d_loop") === "true" || window.krpano.measure3d_loop === true)) {
    return;
  }
  // 1) Prefer the cached target the cursor arrow is *currently* pointing at:
  //    this guarantees the click navigates to exactly the scene the user
  //    sees the arrow indicate, even if mouse_pos and click-time hits
  //    differ slightly (rapid moves, throttling, etc.).
  let name =
    typeof window.cursorArrowGetLastNearestScene === "function"
      ? window.cursorArrowGetLastNearestScene()
      : null;

  var hit = window.krpano.actions.screentodepth(
    window.krpano.mouse.x,
    window.krpano.mouse.y,
  );
  if (!hit) return;

  // 2) Otherwise recompute with the same 3D nearest-relevance logic
  //    (mobile / first interaction with no prior mousemove).
  if (!name && typeof window.cursorArrowFindNearestScene === "function") {
    name = window.cursorArrowFindNearestScene(hit.x, hit.y, hit.z);
  }

  // Fallback: legacy behaviour using each scene's own position. Kept for
  // scenes where cursor-arrow has no cache (e.g. no relevance entries).
  if (!name) {
    var arr = [];
    window.krpano.jynav.forEach((item) => {
      if (item[0][1] == window.krpano.xml.scene) {
        item[1].forEach((item1) => {
          let scene = window.jydata.scenes.find(
            (s) => s.name === "scene_" + item1,
          );
          if (scene) arr.push(scene);
        });
      }
    });
    arr.push(
      window.jydata.scenes.find(
        (item) => item.name === window.krpano.xml.scene,
      ),
    );
    let distance = Infinity;
    arr.forEach((item) => {
      if (!item || !item.position) return;
      const dx = item.position.tx - hit.x,
        dy = item.position.ty - hit.y,
        dz = item.position.tz - hit.z;
      const dist = dx * dx + dy * dy + dz * dz;
      if (distance > dist) {
        name = item.name;
        distance = dist;
      }
    });
  }

  if (!name || name == window.krpano.xml.scene) return;
  window.Panorama.emit("loadscene", [name, true, 0]);
});

window.Panorama.on("autorotatenextscene", () => {
  if (!window.jydata.base.tour.autoJumpNextScene) return;
  let index0, index1, index2, scene;
  window.jydata.groups.map((val, inx0) => {
    val.childGroups.map((val1, inx1) => {
      val1.scenes.map((scene, inx2) => {
        if (scene == window.krpano.xml.scene) {
          index0 = inx0;
          index1 = inx1;
          index2 = inx2;
        }
      });
    });
  });
  if (!scene) {
    (function loop(val) {
      if (val[index0]) {
        if (val[index0].childGroups[index1]) {
          if (val[index0].childGroups[index1].scenes[index2 + 1]) {
            scene =
              window.jydata.groups[index0].childGroups[index1].scenes[
                index2 + 1
              ];
          } else {
            index2 = -1;
            index1++;
            loop(val);
          }
        } else {
          index2 = -1;
          index1 = 0;
          index0++;
          loop(val);
        }
      } else {
        index2 = -1;
        index1 = 0;
        index0 = 0;
        loop(val);
      }
    })(window.jydata.groups);
  }
  window.Panorama.emit("loadscene", [scene, true, 1]);
});

window.Panorama.on("implant_togglepause", (isPlay) => {
  if (isPlay) {
    window.jydata.implantList.map((val) => {
      if (
        val.scenes.findIndex((item) => item == window.krpano.xml.scene) != -1
      ) {
        let hotname = "hot_implant_" + val.id;
        if (!val.isimg && val.isAutoPlay && !val.isrect && !val.istext) {
          let implant = window.krpano.get("hotspot[" + hotname + "]");
          if (!implant.isuserplay) {
            implant.play();
          }
        }
      }
    });
  } else {
    window.jydata.implantList.map((val) => {
      if (
        val.scenes.findIndex((item) => item == window.krpano.xml.scene) != -1
      ) {
        let hotname = "hot_implant_" + val.id;
        if (!val.isimg && !val.isrect && !val.istext) {
          let implant = window.krpano.get("hotspot[" + hotname + "]");
          implant && implant.pause();
        }
      }
    });
  }
});
window.Panorama.on("smallKrpanoInit", () => {
  // Nếu không có sandTable type 2 (3D dollhouse) thì bỏ qua, tránh lỗi loadscene(scene_1)
  if (
    !window.jydata ||
    !window.jydata.sandTable ||
    !window.jydata.sandTable.map.some((item) => item.type == 2)
  ) {
    return;
  }
  window.embedpano({
    xml: null,
    target: "map-container-3d",
    bgcolor: "transparent",
    html5: "webgl+only",
    mobilescale: 1.0,
    consolelog: true,
    passQueryParameters: true,
    onready: (jsapi) => {
      window.addressKrpano = jsapi.get("global");
      window.addressKrpano.set("control.invert", true);
      window.addressKrpano.set("view.oz", 1500);
      window.jydata.sandTable.map.forEach((item, index) => {
        if (item.type == 2) {
          let scene = window.jydata.scenes.find((item1) =>
            item1.sandTableSet
              ? item1.sandTableSet.sandTableId == item.id
              : false,
          );
          if (scene) {
            let xml = scene.content;
            xml =
              '<krpano><scene  name="scene_' +
              item.id +
              '" ><control usercontrol="none"/>' +
              xml +
              "</scene></krpano>";
            window.addressKrpano.call("includexmlstring(" + xml + ", null);");
          }
        }
      });
      window.jydata.sandTable.map.forEach((item, index) => {
        if (
          item.points.findIndex(
            (item1) => item1.sceneName == window.krpano.xml.scene,
          ) > -1
        ) {
          window.addressKrpano.call(
            "loadscene(scene_" +
              item.id +
              ",null,MERGE|KEEPVIEW|KEEPMOVING,BLEND(1.6,easeinoutcubic));",
          );
          window.currentMap = item;
          window.addressKrpano.set("view.oz", item.distance / 2);
        }
      });
    },
  });
});
window.Panorama.on("setviewstate", () => {
  if (
    window.currentMap &&
    window.currentMap.type == 2 &&
    window.currentMap.points.find(
      (item) => item.sceneName == window.krpano.xml.scene,
    ) &&
    window.addressKrpano
  ) {
    window.addressKrpano.view.hlookat = window.krpano.view.hlookat;
    window.addressKrpano.view.vlookat = window.krpano.view.vlookat + 45;
    window.addressKrpano.view.fov = window.krpano.view.fov;
    window.addressKrpano.view.tx = window.krpano.view.tx;
    window.addressKrpano.view.ty = window.krpano.view.ty;
    window.addressKrpano.view.tz = window.krpano.view.tz;
  }
});
window.Panorama.on("sceneLoad", () => {
  let scene1 = window.jydata.scenes.find(
    (item) => item.name === window.krpano.xml.scene,
  );
  if (window.jydata.base.tour.revolve != "right") {
    window.krpano.autorotate.oneroundrange =
      scene1.view.hlookatmax - scene1.view.hlookatmin < 360
        ? scene1.view.hlookatmax - scene1.view.hlookat
        : 360;
  } else {
    window.krpano.autorotate.oneroundrange =
      scene1.view.hlookatmax - scene1.view.hlookatmin < 360
        ? scene1.view.hlookat - scene1.view.hlookatmin
        : 360;
  }

  window.jydata.sandTable.map.forEach((item) => {
    item.points.forEach((point) => {
      if (point.sceneName == window.krpano.xml.scene) {
        window.currentMap = item;
      }
    });
  });
  if (window.currentMap) {
    if (
      window.addressKrpano &&
      window.addressKrpano.xml.scene !=
        "scene_" + window.currentMap.id.toLowerCase()
    ) {
      window.addressKrpano.call(
        "loadscene(scene_" +
          window.currentMap.id +
          ",null,MERGE|KEEPVIEW|KEEPMOVING,BLEND(1.6,easeinoutcubic));",
      );
      window.addressKrpano.set(
        "view.oz",
        window.jydata.sandTable.map.find(
          (item1) => item1.id == window.currentMap.id,
        ).distance / 2,
      );
    }
  }
  let pos1 = window.jydata.scenes.find(
    (item) => item.name === window.krpano.xml.scene,
  ).position;
  let flootArrow = [];
  clearInterval(window.flootIconInt);
  if (window.jydata.base.guideLine.guideLineShow == 1) {
    window.jydata.scenes.map((scene) => {
      if (
        scene.name == window.krpano.xml.scene &&
        window.jydata.scenes.find(
          (item) => item.name === window.krpano.xml.scene,
        ).model
      ) {
        scene.relevance.map((link) => {
          if (window.jydata.scenes.find((item) => item.name === link).model) {
            let arr = madeLine(
              pos1,
              window.jydata.scenes.find((item) => item.name === link).position,
              link,
            );
            flootArrow.push(arr);
          }
        });
      }
    });
    if (window.jydata.base.guideLine.guideLineWay == 0) {
      window.flootIconInt = setInterval(() => {
        let distance = Infinity,
          index = "";
        flootArrow.map((val, inx) => {
          let dis = window.krpano.actions.getlooktodistance(
            null,
            val.rotation,
            window.krpano.view.vlookat,
          );
          if (dis < distance) {
            distance = dis;
            index = inx;
          }
          val.names.map((val1) => {
            window.krpano.set("hotspot[" + val1 + "].visible", false);
          });
        });
        if (flootArrow[index]) {
          flootArrow[index].names.map((val) => {
            window.krpano.set("hotspot[" + val + "].visible", true);
          });
        }
      }, 250);
    }
  }
  let scene = window.jydata.scenes.find(
    (scene) => scene.name == window.krpano.xml.scene,
  );
  if (scene.type == 4) {
    window.krpano.autorotate.enabled = false;
    window.krpano.set("view.hlookatmin", NaN);
    window.krpano.set("view.hlookatmax", NaN);
    window.krpano.set("view.vlookatmin", NaN);
    window.krpano.set("view.vlookatmax", NaN);
    window.krpano.set("view.limitview", "fullrange");
    window.krpano.set("control.bouncinglimits", true);

    let hfov = window.krpano.get("image.hfov")
      ? window.krpano.get("image.hfov")
      : 1;
    let vfov = window.krpano.get("image.vfov")
      ? window.krpano.get("image.vfov")
      : 0.00001;
    if (scene.view.showType == 1) {
      if (hfov / vfov < window.innerWidth / window.innerHeight) {
        window.krpano.set("view.fovtype", "HFOV");
        window.krpano.set("view.fov", hfov);
        window.krpano.set("view.fovmax", hfov);
      } else {
        window.krpano.set("view.fovtype", "VFOV");
        window.krpano.set("view.fov", vfov);
        window.krpano.set("view.fovmax", vfov);
      }
    } else {
      if (hfov / vfov > window.innerWidth / window.innerHeight) {
        window.krpano.set("view.fovtype", "HFOV");
        window.krpano.set("view.fov", hfov);
        window.krpano.set("view.fovmax", hfov);
      } else {
        window.krpano.set("view.fovtype", "VFOV");
        window.krpano.set("view.fov", vfov);
        window.krpano.set("view.fovmax", vfov);
      }
    }

    if (scene.view.fov != 1) {
      window.krpano.set("view.fov", scene.view.fov);
    }
  } else {
    window.krpano.set("control.bouncinglimits", false);
    window.krpano.autorotate.enabled = true;
  }
  let pano_video = window.krpano.get("plugin[video_plugin]");
  if (!pano_video || !pano_video.play) return;
  if (scene.type == 2) {
    // pano_video.pausedonstart = scene.videoSet.isAutoPlay
    if (scene.videoSet.type == 1) {
      if (scene.videoSet.overType == 1) {
        pano_video.loop = true;
      } else {
        pano_video.loop = false;
      }
    } else {
      pano_video.loop = false;
    }

    let autoPlay = false;
    if (scene.videoSet.isAutoPlay) {
      if (window.jydata.open.openingCover && window.firstVideoPano) {
        window.firstVideoPano = false;
        autoPlay = true;
        if (window.jydata.open.openingCover.entryMode == 1) {
          setTimeout(() => {
            pano_video.pausedonstart = false;
            pano_video.play();
          }, window.jydata.open.openingCover.retentionTime * 1000);
        }
      }
    } else {
      autoPlay = true;
    }
    pano_video.playvideo(scene.videoUrl, scene.videoPreview, autoPlay, 0);

    // pano_video.playvideo(scene.videoUrl,scene.videoPreview,!scene.videoSet.isAutoPlay,0)
    // }
  } else {
    pano_video.pause();
    pano_video.videourl = "";
    pano_video.posterurl = "";
  }
});
var isDoubleClick = false;

window.Panorama.on("krpanoClick", () => {
  if (window.krpano && (window.krpano.get("measure3d_loop") == true || window.krpano.get("measure3d_loop") === "true" || window.krpano.measure3d_loop === true)) {
    return;
  }
  // Click nằm trên panel thước đo (UI): không điều hướng 360.
  if (window.krpano && window.krpano.overMeasureUI === true) {
    return;
  }
  window.krpano.jyNavEnabled = true;

  window.clickTimeout = setTimeout(function () {
    if (!isDoubleClick) {
      window.krpano.jyNavEnabled = false;
      window.krpano.events
        .getArray()
        .find((itm) => itm.name == "navigator_events")
        .onclick();
      let scene = window.jydata.scenes.find(
        (scene) => scene.name == window.krpano.xml.scene,
      );
      if (scene.type == 3) {
        var hit = window.krpano.actions.screentodepth(
          window.krpano.mouse.x,
          window.krpano.mouse.y,
        );
        if (
          window.krpano.mouse.x < window.innerWidth * 0.7 &&
          window.krpano.mouse.x > window.innerWidth * 0.3 &&
          window.krpano.mouse.y < window.innerHeight * 0.7 &&
          window.krpano.mouse.y > window.innerHeight * 0.3
        ) {
          let name = "",
            distance = Infinity;

          window.currentMap.points.forEach((item) => {
            let scenepos = window.jydata.scenes.find(
              (scene) => scene.name == item.sceneName,
            ).position;
            const dx = scenepos.tx - hit.x,
              dy = scenepos.ty - hit.y,
              dz = scenepos.tz - hit.z;
            const dist = dx * dx + dy * dy + dz * dz;
            if (distance > dist) {
              name = item.sceneName;
              distance = dist;
            }
          });
          window.krpano.set("control.invert", false);
          window.Panorama.emit("loadscene", [name, true, 0]);
        } else {
          if (!hit) {
            return;
          }
          window.krpano.call(
            "tween(view.tx|view.ty|view.tz," +
              hit.x +
              "|" +
              hit.y +
              "|" +
              hit.z +
              ",1.5,default);",
          );
        }
      }
    }
    isDoubleClick = false;
  }, 200);
});
window.Panorama.on("krpanoDClick", () => {
  if (window.krpano && (window.krpano.get("measure3d_loop") == true || window.krpano.get("measure3d_loop") === "true" || window.krpano.measure3d_loop === true)) {
    return;
  }
  // Double-click trên panel thước đo (UI): không điều hướng 360.
  if (window.krpano && window.krpano.overMeasureUI === true) {
    return;
  }
  isDoubleClick = true;
  window.krpano.jyNavEnabled = false;
  window.Panorama.emit("navigatorNormal");
  clearTimeout(window.clickTimeout);
});
window.Panorama.on("openAnimations", (type) => {
  let startScene = window.jydata.base.customScene
    ? window.jydata.base.customScene
    : window.jydata.groups[0]?.childGroups[0]?.scenes[0];
  if (type == 2) {
    window.jydata.sandTable.map.forEach((item) => {
      item.points.forEach((point) => {
        if (point.sceneName == startScene) {
          let goalScene = window.jydata.scenes.find(
            (item1) => item1.sandTableSet.sandTableId === item.id,
          ).name;
          // window.Panorama.emit('loadscene', [goalScene, false, 9])
          setTimeout(() => {
            window.Panorama.emit("loadscene", [goalScene, false, 9]);
          }, 1);
        }
      });
    });
  } else if (type == 3) {
    window.jydata.sandTable.map.forEach((item) => {
      if (item.type == 1 && !item.isuse) return;
      item.points.forEach((point) => {
        if (point.sceneName == startScene) {
          let goalScene = window.jydata.scenes.find(
            (item1) => item1.sandTableSet.sandTableId === item.id,
          ).name;
          // setTimeout(()=>{
          //     window.Panorama.emit('loadscene', [goalScene, false, 9])
          // },1)
          setTimeout(() => {
            let goalScene = window.jydata.scenes.find(
              (item1) => item1.name === startScene,
            );

            let nowLook = window.krpano.view.hlookat % 360,
              newLook = goalScene.view.hlookat % 360;
            nowLook += 360;
            newLook += 360;

            window.krpano.set("view.hlookat", nowLook);
            if (nowLook - newLook < -180) {
              newLook = newLook - 360;
            } else if (nowLook - newLook > 180) {
              newLook = newLook + 360;
            }
            if (nowLook - newLook < -180) {
              newLook = newLook - 360;
            } else if (nowLook - newLook > 180) {
              newLook = newLook + 360;
            }

            window.krpano.call("tween(view.hlookat," + newLook + ",3);");

            window.krpano.call(
              "tween(view.tx|view.ty|view.tz,calc('" +
                (goalScene.position.tx +
                  "|" +
                  goalScene.position.ty +
                  "|" +
                  goalScene.position.tz) +
                "'),3,default);",
            );
            setTimeout(() => {
              window.Panorama.emit("loadscene", [startScene, true, 8]);
            }, 3000);
          }, 1500);
        }
      });
    });
  } else if (type == 4) {
    let goalScene = window.jydata.scenes.find(
      (item1) => item1.name === startScene,
    );
    if (goalScene.type != 4) {
      goalScene = window.jydata.scenes.find((item1) => item1.type === 4);
    }
    // window.Panorama.emit('loadscene', [goalScene.name, true, 9])
    // window.krpano.actions.loadscene(goalScene.name,null,'MERGE|KEEPHOTSPOTS','BLEND(0, easeInCubic)',()=>{
    window.krpano.set("view.hlookat", 0);
    window.krpano.set("view.vlookat", 0);
    window.krpano.set("view.fov", 1);
    window.krpano.set("control.invert", false);
    window.krpano.set("view.oz", 0);
    window.krpano.set("control.bouncinglimits", true);
    setTimeout(() => {
      window.krpano.call(
        "tween(view.hlookat," + goalScene.view.hlookat + ",3);",
      );
      window.krpano.call(
        "tween(view.vlookat," + goalScene.view.vlookat + ",3);",
      );
      window.krpano.call("tween(view.fov," + goalScene.view.fov + ",3);");
      showHotspot();
    }, 2000);
    // })
  }
});
window.Panorama.on("videoPluginLoad", () => {
  let startScene = window.jydata.base.customScene
    ? window.jydata.base.customScene
    : window.jydata.groups[0]?.childGroups[0]?.scenes[0];
  if (startScene == window.krpano.xml.scene) {
    let scene = window.jydata.scenes.find(
      (scene) => scene.name == window.krpano.xml.scene,
    );
    if (scene.type == 2) {
      window.firstVideoPano = true;
      window.Panorama.emit("loadscene", [scene.name, false, 1]);
    }
  }
});
function addLinePoint(val, data, index, isShow) {
  let hotname = "hot_scaleplate_" + val.id + "_points_" + index;
  let point;
  point = window.krpano.actions.addhotspot(hotname);
  point.loadstyle("point_line_point_style");
  if (val.is3d) {
    point.tx = data.x;
    point.ty = data.y;
    point.tz = data.z;
    point.rx = data.rx;
    point.ry = data.ry;
    point.rz = data.rz;
    point.depth = "0";
    point.scale = val.endSize / 400;
  } else {
    point.ath = data.x;
    point.atv = data.y;
    point.depth = "1000";
    point.distorted = false;
    point.scale = 0.5;
    point.scale = val.endSize / 100;
  }
  point.is3d = val.is3d;
  point.dataindex = index;
  if (isShow) {
    point.ondown = "";
    point.onup = "";
  }
  if (val.endType == 0) {
    point.visible = false;
    if (!isShow) {
      point.visible = true;
    }
  } else if (val.endType == 1) {
    point.visible = true;
    point.url = "";
    point.bgroundedge = 74;
    point.type = "text";
    point.bg = false;
    point.bgborder =
      "10 0x" + val.endColor.substring(1) + " " + val.endColorOpacity / 100;
  } else if (val.endType == 2) {
    point.visible = true;
    point.url = "";
    point.bgroundedge = 64;
    point.type = "text";
    point.bg = true;
    point.bgcolor = "0x" + val.endColor.substring(1);
    point.bgalpha = val.endColorOpacity / 100;
    point.bgborder = "0 0xffffff 0";
  }
}
window.Panorama.on("line_change", (names = [], subgroup) => {
  if (window.hideHotspot) {
    return;
  }
  window.jydata.scaleplateList.map((val) => {
    if (val.scenes.findIndex((item) => item == window.krpano.xml.scene) != -1) {
      let hotname = "hot_scaleplate_" + val.id;

      let nameIndex = names.findIndex((name) => name == hotname);
      if (nameIndex > -1) {
        names.splice(nameIndex, 1);
        nameIndex = names.findIndex((name) => name == hotname + "_points_0");
        if (nameIndex > -1) {
          names.splice(nameIndex, 1);
        }
        nameIndex = names.findIndex((name) => name == hotname + "_points_1");
        if (nameIndex > -1) {
          names.splice(nameIndex, 1);
        }
        nameIndex = names.findIndex((name) => name == hotname + "_text");
        if (nameIndex > -1) {
          names.splice(nameIndex, 1);
        }
        return;
      }
      if (!subgroup && window.currentSubgroup) {
        subgroup = window.currentSubgroup;
      }
      if (subgroup) {
        if (val.subgroup.findIndex((item) => item == subgroup) == -1) return;
      }
      window.krpano.call("addhotspot(" + hotname + ", h)");
      let scaleplate = window.krpano.get("h");
      scaleplate.loadstyle("scaleplate_style");
      val.positionList.map((val1, index) => {
        if (val.is3d) {
          window.krpano.set("h.point[" + index + "].x", val1.x);
          window.krpano.set("h.point[" + index + "].y", val1.y);
          window.krpano.set("h.point[" + index + "].z", val1.z);
        } else {
          window.krpano.set("h.point[" + index + "].ath", val1.x);
          window.krpano.set("h.point[" + index + "].atv", val1.y);
        }
        addLinePoint(val, val1, index, true);
      });
      scaleplate.bordercolor = "0x" + val.scaleplateColorA.substring(1);
      scaleplate.borderalpha = val.scaleplateColorOpacityA * 0.01;
      scaleplate.borderwidth = val.thickness * 0.1;
      scaleplate.onout =
        "tween(bordercolor|borderalpha," +
        "0x" +
        val.scaleplateColorA.substring(1) +
        "|" +
        val.scaleplateColorOpacityA * 0.01 +
        ")";
      scaleplate.onover =
        "tween(bordercolor|borderalpha," +
        "0x" +
        val.scaleplateColorB.substring(1) +
        "|" +
        val.scaleplateColorOpacityB * 0.01 +
        ")";
      if (val.positionList.length < 2) return;
      let scaleplatetext = window.krpano.actions.addhotspot(hotname + "_text");
      scaleplatetext.loadstyle("scaleplate_text_style");
      if (val.is3d) {
        scaleplatetext.tx =
          0.5 * val.positionList[0].x + 0.5 * val.positionList[1].x;
        scaleplatetext.ty =
          0.5 * val.positionList[0].y + 0.5 * val.positionList[1].y;
        scaleplatetext.tz =
          0.5 * val.positionList[0].z + 0.5 * val.positionList[1].z;
        scaleplatetext.depth = 0;
      } else {
        let pos = scaleplate.getcenter();
        // scaleplatetext.ath = pos.x
        // scaleplatetext.atv = pos.y

        scaleplatetext.ath = val.positionList[0].rx;
        scaleplatetext.atv = val.positionList[0].ry;

        scaleplatetext.depth = 1000;
        scaleplate.borderwidth = val.thickness;
      }
      scaleplatetext.html = val.text;
      if ((val.text == "" || val.text.search("cm") > -1) && val.is3d) {
        var dx = val.positionList[0].x - val.positionList[1].x;
        var dy = val.positionList[0].y - val.positionList[1].y;
        var dz = val.positionList[0].z - val.positionList[1].z;
        var length = Math.sqrt(dx * dx + dy * dy + dz * dz);

        scaleplatetext.html = val.text = length.toFixed(3) + "cm";
      }
      scaleplatetext.css =
        "white-space:pre;text-align:center; color:" +
        val.fontColor +
        "; font-size:" +
        (12 + val.size * 6) +
        "px;opacity:" +
        val.fontColorOpacity * 0.01;
      scaleplatetext.bgcolor = "0x" + val.fillColor.substring(1);
      scaleplatetext.bgalpha = val.fillColorOpacity * 0.01;
      scaleplatetext.onout =
        "tween(hotspot[" +
        hotname +
        "].bordercolor|hotspot[" +
        hotname +
        "].borderalpha," +
        "0x" +
        val.scaleplateColorA.substring(1) +
        "|" +
        val.scaleplateColorOpacityA * 0.01 +
        ")";
      scaleplatetext.onover =
        "tween(hotspot[" +
        hotname +
        "].bordercolor|hotspot[" +
        hotname +
        "].borderalpha," +
        "0x" +
        val.scaleplateColorB.substring(1) +
        "|" +
        val.scaleplateColorOpacityB * 0.01 +
        ")";
      scaleplatetext.bgborder =
        2 +
        " 0x" +
        val.strokeColor.substring(1) +
        " " +
        val.strokeColorOpacity * 0.01;
    }
  });
});
