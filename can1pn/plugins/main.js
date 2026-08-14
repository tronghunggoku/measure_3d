window.JyCom = function () {
  new Vue({
    el: "#app",
    data: () => {
      return {
        visible: false,
        type: "",
        fullscreen: false,
        title: "",
        formData: {},
        cover: null,
        firstLoad: true,
        logoUrl: "",
        curSceneName: "",
        oneLevelGroups: [],
        currentOneLevelGroupId: "",
        twoLevelGroups: [],
        currentTwoLevelGroupId: "",
        sceneList: [],
        currentMap: {},
        isVerifyPwd: false,
        isOpen: false,
        showOpenHint: false,
        hLookat: 0,
        isPlayed: false,
        isHandCloseMusic: false,
        isHandCloseVoice: false,
        isShowAdvertisement: false,
        isShowCaptions: false,
        isShowName: false,
        visibleScenes: [],
        isShowSearch: false,
        isShowDialogFull: false,
        audioBottom: 0,
        anOver: false,
      };
    },
    computed: {
      scenes() {
        window.jydata.scenes.forEach((item) => {
          item.captions.fontColorRgb = this.hexToRgb(
            item.captions.fontColor,
            item.captions.fontColorOpacity / 100,
          );
          item.captions.bgColorRgb = this.hexToRgb(
            item.captions.bgColor,
            item.captions.bgColorOpacity / 100,
          );
          item.nameDisplay.fontColorRgb = this.hexToRgb(
            item.nameDisplay.fontColor,
            item.nameDisplay.fontColorOpacity / 100,
          );
          item.nameDisplay.bgColorRgb = this.hexToRgb(
            item.nameDisplay.bgColor,
            item.nameDisplay.bgColorOpacity / 100,
          );
          item.nameDisplay.borderColorRgb = this.hexToRgb(
            item.nameDisplay.borderColor,
            item.nameDisplay.borderColorOpacity / 100,
          );
        });
        return window.jydata.scenes;
      },
      groups() {
        return window.jydata.groups;
      },
      buttons() {
        let ls = [];
        window.jydata.base.customButton.forEach((element) => {
          if (element.type != 10) {
            ls.push(element);
          }
        });
        return ls;
      },
      hotSpotList() {
        return window.jydata.hotSpotList;
      },
      implantList() {
        return window.jydata.implantList;
      },
      open() {
        return window.jydata.open;
      },
      base() {
        if (window.jydata.base.footstepControl.icon.iconSize == null) {
          window.jydata.base.footstepControl.icon.iconSize = 29;
        }
        return window.jydata.base;
      },
      tour() {
        return window.jydata.tour;
      },
      sandTable() {
        if (window.jydata.sandTable) {
          window.jydata.sandTable.pointColorRgb = this.hexToRgb(
            window.jydata.sandTable.pointColor,
            window.jydata.sandTable.pointColorOpacity / 100,
          );
          window.jydata.sandTable.pointStrokeColorRgb = this.hexToRgb(
            window.jydata.sandTable.pointStrokeColor,
            window.jydata.sandTable.pointStrokeColorOpacity / 100,
          );
          window.jydata.sandTable.pointArrowColorRgb = this.hexToRgb(
            window.jydata.sandTable.pointArrowColor,
            window.jydata.sandTable.pointArrowColorOpacity / 100,
          );
          window.jydata.sandTable.pointArrowStrokeColorRgb = this.hexToRgb(
            window.jydata.sandTable.pointArrowStrokeColor,
            window.jydata.sandTable.pointArrowStrokeColorOpacity / 100,
          );
        }
        return window.jydata.sandTable;
      },
      subgroup() {
        return window.jydata.subgroup;
      },
      advertisement() {
        return window.jydata.advertisement;
      },
      isMobile() {
        let flag = navigator.userAgent.match(
          /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
        );
        return flag;
      },
      audio() {
        if (!this.curSceneName) {
          return "";
        }
        let audio = null;
        window.jydata.scenes.forEach((element) => {
          if (element.name == this.curSceneName) {
            audio = element.audio;
          }
        });
        return audio;
      },
      captions() {
        if (!this.curSceneName) {
          return "";
        }
        let captions = null;
        window.jydata.scenes.forEach((element) => {
          if (element.name == this.curSceneName) {
            captions = element.captions;
          }
        });
        return captions;
      },
      nameDisplay() {
        if (!this.curSceneName) {
          return "";
        }
        let nameDisplay = null;
        window.jydata.scenes.forEach((element) => {
          if (element.name == this.curSceneName) {
            nameDisplay = element.nameDisplay;
          }
        });
        return nameDisplay;
      },
      compass() {
        if (!this.curSceneName) {
          return "";
        }
        let compass = null;
        window.jydata.scenes.forEach((element) => {
          if (element.name == this.curSceneName) {
            compass = element.compass;
          }
        });
        return compass;
      },
      openHintImgSrc() {
        if (this.isMobile) {
          return (
            this.base.openingPrompt.mobileUrl ||
            "plugins/images/icon_bianji_kaichangyd.png"
          );
        } else {
          return (
            this.base.openingPrompt.pcUrl ||
            "plugins/images/icon_bianji_kaichangzm.png"
          );
        }
      },
      isShowSubgroupAll() {
        let bl = false;
        let t1 = window.jydata.scaleplateList.find(
          (item) => item.subgroup.length > 0,
        );
        let t2 = window.jydata.implantList.find(
          (item) => item.subgroup.length > 0,
        );
        let t3 = window.jydata.hotSpotList.find(
          (item) => item.subgroup.length > 0,
        );
        if (t1 || t2 || t3) bl = true;
        return bl;
      },
    },
    created() {
      const parentNode = document.querySelector("#app");
      const html = `
          <div class="index-com" @click="judgeAudio" @touchstart="judgeAudio">
              <template v-if="cover === false && !isVerifyPwd && !isOpen && anOver">
                  <jy-top-left ref="jy-top-left" :views="base.views" :base="base" :logo="logoUrl" :is-show-captions="isShowCaptions" :is-show-subgroup-all="isShowSubgroupAll" :compass="compass" :captions="captions" :subgroup="subgroup" :hot-spot-list="hotSpotList" @open-link="buttonOpenDialog" @hot-spot-open-dialog="hotSpotOpenDialog"></jy-top-left>
                  <jy-right-menu ref="jy-right-menu" :base="base" :is-search="base?.search?.isOpenSearch&&base?.search?.showType==2" :is-show-search="isShowSearch"  :audio="audio" :is-show-captions="isShowCaptions" :is-show-name="isShowName" :captions="captions" :name-display="nameDisplay" :scenes="scenes" :h-lookat="hLookat" :cur-scene-name="curSceneName" :is-map="currentMap.url&&currentMap.isuse ? true : false" :is-show-praise="base.visibles.praise" :is-show-tour="base.tour.showBtn && base.tour.revolve != 'none'&&scenes.find(item=>item.name==curSceneName)?.type!=4" :is-vr="base.visibles.vr" :is-full-screen="base.visibles.fullScreen" :is-clear-screen="base.visibles.clear" :current-map="currentMap" :sand-table="sandTable" @hand-voice="isHandCloseVoice = !isHandCloseVoice" @hand-music="isHandCloseMusic = !isHandCloseMusic" @open-link="openLink" @change-search="isShowSearch=!isShowSearch"></jy-right-menu>
                  <jy-audio v-if="type == 'audio'" :base="base" :audio-bottom="audioBottom" :form-data="formData" @audio-or-video-play="audioOrVideoPlay" @close="dialogClose"></jy-audio>
                  <jy-bottom ref="jy-bottom" :visible-scenes="visibleScenes" :current-sence="curSceneName" :base="base" :tour="tour" :scenes="scenes" :one-level-groups="oneLevelGroups" :current-one-level-group-id="currentOneLevelGroupId" :two-level-groups="twoLevelGroups" :current-two-level-group-id="currentTwoLevelGroupId" :scene-list="sceneList" @group-change="groupChange" :buttons="buttons" @open-dialog="buttonOpenDialog"></jy-bottom>
                  <jy-dialog ref="jy-dialog" :base="base" :visible.sync="visible" :data="formData" :type="type" :title="title" :fullscreen="fullscreen" @audio-or-video-play="audioOrVideoPlay" @dialog-close="dialogClose"></jy-dialog>
                  <jy-dialog-full v-model="isShowDialogFull" :base="base" :form="formData" :type="type" @audio-or-video-play="audioOrVideoPlay" @dialog-close="dialogClose"></jy-dialog-full>
                  <!-- 开场图片 -->
                  <img v-if="showOpenHint" :style="{ width: isMobile ? base.openingPrompt.mobileScale * 2 +'px'||100+'px': base.openingPrompt.pcScale * 6 +'px'|| 300+'px' }" :src="openHintImgSrc" class="hint" alt="">
                  <!-- 平台标记 -->
                  <div v-if="base.visibles.introduce" class="mark" :class="isMobile ? 'mobile_mark' : 'pc_mark'">
                      <div>展示平台：步进式全景漫游平台</div>
                      <div>www.good360vr.com</div>
                  </div>
                  <!-- 广告 -->
                  <div class="advertisement" :class="isMobile?'mobile':''" v-if="isShowAdvertisement && advertisement">
                      <img class="advertisement-img" :src="advertisement?.path" alt="" @click="openAdvertisement">
                      <img class="advertisement-close" src="../../packages/assets/images/pc/btn_tanchuang_guanbi@2x.png" alt="" @click="isShowAdvertisement = false">
                      <div class="advertisement-hint">广告</div>
                  </div>
                  <!-- 搜索 -->
                  <jy-search v-show="base?.search?.isOpenSearch&&(isShowSearch||base?.search?.showType==1)&&scenes.find(item=>item.name==curSceneName)?.type!=3" :base="base" :groups="groups" :scenes="scenes" :hot-spot-list="hotSpotList" :implant-list="implantList"  @search-click="searchClick"></jy-search>
              </template>
              <jy-open v-if="cover === true && !isVerifyPwd && !isOpen" :base="base" :options="open.openingCover" @close="openClose"></jy-open>
              <jy-password :visible="isVerifyPwd" :hint="base.accessHint" @config="verifyPwd"></jy-password>
          </div>
      `;
      parentNode.innerHTML += html;
    },
    mounted() {
      this.initPano();
    },
    destroyed() {
      this.$refs["jy-bottom"] &&
        this.$refs["jy-bottom"].clearVideoSceneInfoTimer &&
        this.$refs["jy-bottom"].clearVideoSceneInfoTimer();
      window.Panorama.off("krpanoClick", undefined);
      window.Panorama.off("hotspotClick", undefined);
      window.Panorama.off("sceneLoad", undefined);
      window.Panorama.off("setviewstate", undefined);
    },
    methods: {
      searchClick(e) {
        console.log("搜索项点击emit", e);
        if (e.s_type == 1) {
          if (e.childGroups) {
            this.groupChange({ type: "oneLevelGroup", id: e.id });
          } else {
            let groups = JSON.parse(JSON.stringify(this.groups));
            let oneLevelGroup = null;
            groups.forEach((group) => {
              let twoLevelGroup = group.childGroups.find(
                (item) => item.id == e.id,
              );
              if (twoLevelGroup) {
                oneLevelGroup = group;
              }
            });
            if (
              oneLevelGroup.childGroups.some((item) =>
                item.scenes.includes(window.krpano.get("xml.scene")),
              )
            ) {
              this.groupChange({ type: "twoLevelGroup", id: e.id });
            }
          }
        } else if (e.s_type == 6) {
          let formData = this.hotSpotList.find((item) => item.id == e.id);
          let scenedata = this.scenes.find(
            (item) => item.name == window.krpano.xml.scene,
          );
          if (
            formData.scenes.findIndex(
              (item) => item == window.krpano.xml.scene,
            ) == -1
          ) {
            scenedata = this.scenes.find(
              (item) => item.name == formData.scenes[0],
            );
            let isCheck = scenedata.view.isCheck;
            scenedata.view.isCheck = false;
            window.Panorama.emit("loadscene", [formData.scenes[0], true, 0]);
            scenedata.view.isCheck = isCheck;
          }
          let arr1 = [
            scenedata.position.tx,
            scenedata.position.ty,
            scenedata.position.tz,
          ];
          let arr2 = [
            formData.position.tx,
            formData.position.ty,
            formData.position.tz,
          ];
          let hit = krpano.actions.spacetosphere(
            arr2[0] - arr1[0],
            arr2[1] - arr1[1],
            arr2[2] - arr1[2],
          );
          if (scenedata.model == null) {
            hit.h = formData.position.ath;
            hit.v = formData.position.atv;
          }
          window.krpano.call(
            "lookto(" +
              hit.h +
              "," +
              hit.v +
              "," +
              window.krpano.view.fov +
              ",tween(default,1),true )",
          );
        } else if (e.s_type == 7) {
          let formData = this.implantList.find((item) => item.id == e.id);
          let scenedata = this.scenes.find(
            (item) => item.name == window.krpano.xml.scene,
          );
          if (
            formData.scenes.findIndex(
              (item) => item == window.krpano.xml.scene,
            ) == -1
          ) {
            scenedata = this.scenes.find(
              (item) => item.name == formData.scenes[0],
            );
            let isCheck = scenedata.view.isCheck;
            scenedata.view.isCheck = false;
            window.Panorama.emit("loadscene", [formData.scenes[0], true, 0]);
            scenedata.view.isCheck = isCheck;
          }
          let arr1 = [
            scenedata.position.tx,
            scenedata.position.ty,
            scenedata.position.tz,
          ];
          let arr2 = [
            formData.position.tx,
            formData.position.ty,
            formData.position.tz,
          ];
          let hit = krpano.actions.spacetosphere(
            arr2[0] - arr1[0],
            arr2[1] - arr1[1],
            arr2[2] - arr1[2],
          );
          if (scenedata.model == null) {
            console.log("searchClick", formData);
            hit.h = formData.position.ath;
            hit.v = formData.position.atv;
            if (formData.isrect) {
              // let hotname = 'hot_implant_' + formData.id;
              // let hotspot =  window.krpano.get('hotspot['+hotname+']')
              // hit.h = hotspot.getcenter().x
              // hit.v = hotspot.getcenter().y
              const center = this.findCenter(formData.positionList);
              hit.h = center.x;
              hit.v = center.y;
            }
          } else {
            if (formData.isrect) {
              const center = this.findCenter(formData.positionList);
              hit = krpano.actions.spacetosphere(
                center.x - arr1[0],
                center.y - arr1[1],
                center.z - arr1[2],
              );
            }
          }
          window.krpano.call(
            "lookto(" +
              hit.h +
              "," +
              hit.v +
              "," +
              window.krpano.view.fov +
              ",tween(default,1),true )",
          );
        } else {
          this.$refs["jy-bottom"] &&
            this.$refs["jy-bottom"].sceneChange(e.name);
        }
      },
      findCenter(points) {
        const numPoints = points.length;
        let sum_x = 0;
        let sum_y = 0;
        let sum_z = 0;
        for (let i = 0; i < numPoints; i++) {
          sum_x += points[i].x;
          sum_y += points[i].y;
          sum_z += points[i].z;
        }
        const avg_x = sum_x / numPoints;
        const avg_y = sum_y / numPoints;
        const avg_z = sum_z / numPoints;
        return { x: avg_x, y: avg_y, z: avg_z };
      },
      getScene(sceneName) {
        return this.scenes.find((item) => item.name == sceneName);
      },
      openAdvertisement() {
        window.open(this.advertisement.link, "_blank");
      },
      dialogClose() {
        this.$refs["jy-top-left"] &&
          this.$refs["jy-top-left"].hotSpotDialogId &&
          this.$refs["jy-top-left"].changeSubgroup("");
        this.$refs["jy-right-menu"] &&
          this.$refs["jy-right-menu"].handleClick("reload");
        this.panoramicVideoPause(0);
        this.type = "";
        window.Panorama.emit("implant_togglepause", true);
        window.isShowDialog = false;
        window.Panorama.emit("is_implant_play");
        this.close();
        if (!this.isHandCloseMusic && !window.isImplantPlay[0])
          window.play_music();
        if (!this.isHandCloseVoice && !window.isImplantPlay[1])
          window.play_voice();
        if (this.$refs["jy-bottom"] && this.isHotSpotOpenDialogPauseTour) {
          this.$refs["jy-bottom"].handleTour("continue");
          this.isHotSpotOpenDialogPauseTour = false;
        }
      },
      judgeAudio() {
        window.Panorama.emit("is_implant_play");
        if (
          this.$refs["jy-right-menu"] &&
          !this.isPlayed &&
          this.audio.bgm.isAutoPlay &&
          this.audio.bgm.audioPath &&
          !this.$refs["jy-right-menu"].musicPlay &&
          !window.isImplantPlay[0]
        ) {
          this.$refs["jy-right-menu"] &&
            this.$refs["jy-right-menu"].musicPlayFn();
        }
        if (
          this.$refs["jy-right-menu"] &&
          !this.isPlayed &&
          this.audio.explain.isAutoPlay &&
          this.audio.explain.audioPath &&
          !this.$refs["jy-right-menu"].voicePlay &&
          !window.isImplantPlay[1]
        ) {
          this.$refs["jy-right-menu"] &&
            this.$refs["jy-right-menu"].voicePlayFn();
        }
        if (this.isVerifyPwd || this.cover || this.isOpen) return;
        this.isPlayed = true;
      },
      openClose() {
        // 开场动画方式（0：默认无，1：小行星，2：静止3d模型，3：3d模型滑入，4：矩阵开场）
        let openAn = this.open?.openingAnimation;
        // 开场封面
        let openCover = this.open?.openingCover;
        // 封面结束后开场动画时间：静止3d与矩阵：1.5秒，小行星（优先展示为5秒，否则为3秒），3d模型滑入6秒
        let time = 3000;
        this.cover = false;
        if (openAn == 0) {
          time = 0;
        } else if (openAn == 1) {
          // 封面优先展示播放小行星全程动画，否则播放后半段动画
          if (openCover?.firstShow) {
            time = 5000;
            window.Panorama.emit("init_littleplanet_krpano");
          } else {
            window.Panorama.emit("init_krpano");
          }
        } else {
          if (openAn == 2 || openAn == 4) {
            time = 1500;
          } else {
            time = 6000;
          }
          window.Panorama.emit("openAnimations", openAn || 2);
        }
        setTimeout(() => {
          // 宣告开场结束
          this.anOver = true;
          // // 展示ui
          this.isOpen = false;
          // 初始化沙盘（因为开场结束前dom不渲染）
          this.initMap();
          // 后续逻辑
          this.panoramicVideoPause(0);
          this.showKrContent();
          this.openHintLogic();
        }, time);
      },
      initAsteroid() {
        // 开场动画方式（0：默认无，1：小行星，2：静止3d模型，3：3d模型滑入，4：矩阵开场）
        let openAn = this.open?.openingAnimation;
        // 开场封面
        let openCover = this.open?.openingCover;
        //进入初始场景逻辑
        let startScene =
          this.base.customScene || this.groups[0]?.childGroups[0]?.scenes[0];
        if (openAn == 0 || openAn == 1) {
          window.Panorama.emit("loadscene", [startScene, true, 1]);
        } else if (openAn == 2 || openAn == 3) {
          this.sandTable.map.forEach((item) => {
            if (item.type == 1 || !item.isuse) return;
            item.points.forEach((point) => {
              if (point.sceneName == startScene) {
                let goalScene = this.scenes.find(
                  (scene) => scene.sandTableSet.sandTableId === item.id,
                ).name;
                window.Panorama.emit("loadscene", [goalScene, false, 9]);
              }
            });
          });
        } else {
          let goalScene = this.scenes.find(
            (item1) => item1.name === startScene,
          );
          if (goalScene.type != 4) {
            goalScene = this.scenes.find((item1) => item1.type === 4);
          }
          window.krpano.actions.loadscene(
            goalScene.name,
            null,
            "MERGE|KEEPHOTSPOTS",
            "BLEND(0, easeInCubic)",
            () => {},
          );
        }
        // 验证密码逻辑
        if (this.isVerifyPwd) return;
        // 开场逻辑
        // 无动画有封面不执行任何操作，等待关闭封面即可（封面显示在init方法中已处理）
        // 无动画无封面
        if (openAn == 0 && !openCover) {
          // 宣告开场结束
          this.anOver = true;
          // 后续逻辑
          this.showKrContent();
          this.openHintLogic();
        }
        // 有动画有封面
        if (openAn != 0 && openCover) {
          // 封面是否优先展示（只有小行星动画有效，此处为特殊处理）
          if (openAn == 1 && !openCover?.firstShow) {
            // 小行星前半段动画(大概3秒)
            window.Panorama.emit("init_littleplanet");
            setTimeout(() => {
              // 展示封面
              this.isOpen = false;
            }, 3000);
          } else {
            // 展示封面
            this.isOpen = false;
          }
        }
        // 有动画无封面
        if (openAn != 0 && !openCover) {
          // 小行星全程动画
          if (openAn == 1) {
            window.Panorama.emit("init_littleplanet_krpano");
          } else {
            window.Panorama.emit("openAnimations", openAn || 2);
          }
          // 开场动画时间：静止3d与矩阵：1.5秒，小行星5秒，3d模型滑入7秒
          let time = 1500;
          if (openAn == 1) {
            time = 5000;
          } else if (openAn == 3) {
            time = 7000;
          }
          // 动画结束后
          setTimeout(() => {
            // 宣告开场结束
            this.anOver = true;
            // 展示ui
            this.isOpen = false;
            // 初始化沙盘（因为开场结束前dom不渲染）
            this.initMap();
            // 后续逻辑
            this.showKrContent();
            this.openHintLogic();
          }, time);
        }
      },
      showKrContent() {
        window.hideImplant = false;
        window.hideHotspot = false;
        window.Panorama.emit("hotspots_change");
        window.Panorama.emit("line_change");
        window.Panorama.emit("implant_change");
      },
      openHintLogic() {
        if (!this.showOpenHint && this.base.openingPrompt.timeNumber > 0) {
          this.showOpenHint = true;
          setTimeout(
            () => {
              this.showOpenHint = false;
              // 矩阵开场动画后会停留在矩阵场景，不用开启漫游
              if (
                this.base.tour.revolve != "none" &&
                this.open?.openingAnimation != 4
              ) {
                window.krpano.autorotate.enabled = true;
              }
            },
            this.base.openingPrompt.timeNumber * 1000 + 500,
          );
        } else {
          // 矩阵开场动画后会停留在矩阵场景，不用开启漫游
          if (
            this.base.tour.revolve != "none" &&
            this.open?.openingAnimation != 4
          ) {
            window.krpano.autorotate.enabled = true;
          }
        }
      },
      verifyPwd(e) {
        if (this.base.password != e) {
          return this.$message({
            type: "error",
            message: `密码错误`,
          });
        }
        this.isVerifyPwd = false;
        this.initAsteroid();
        window.showHotspot();
      },
      close() {
        this.isShowDialogFull = false;
        this.visible = false;
        this.type = "";
        this.fullscreen = false;
        this.title = "";
        this.formData = {};
      },
      audioOrVideoPlay() {
        setTimeout(() => {
          window.Panorama.emit("is_implant_play");
          if (this.formData.isCloseBgm && !window.isImplantPlay[0]) {
            this.$refs["jy-right-menu"] &&
              this.$refs["jy-right-menu"].musicPauseFn();
          }
          if (this.formData.isCloseExplain && !window.isImplantPlay[1]) {
            this.$refs["jy-right-menu"] &&
              this.$refs["jy-right-menu"].voicePauseFn();
          }
        }, 10);
      },
      audioPlay() {
        setTimeout(() => {
          if (!this.$refs["jy-right-menu"]) return;
          if (
            this.audio.bgm.isAutoPlay &&
            this.audio.bgm.audioPath &&
            !this.isHandCloseMusic &&
            !this.formData.isCloseBgm &&
            !window.isImplantPlay[0]
          ) {
            this.$refs["jy-right-menu"].musicPlayFn();
          } else {
            this.$refs["jy-right-menu"].musicPauseFn();
          }
          if (
            this.audio.explain.isAutoPlay &&
            this.audio.explain.audioPath &&
            !this.isHandCloseVoice &&
            !this.formData.isCloseExplain &&
            !window.isImplantPlay[1]
          ) {
            this.$refs["jy-right-menu"].voicePlayFn();
          } else {
            this.$refs["jy-right-menu"].voicePauseFn();
          }
        }, 10);
      },
      initPano() {
        window.Panorama.on("krpanoClick", () => {
          this.judgeAudio();
        });
        window.Panorama.on("hotspotClick", (id, keep) => {
          this.hotSpotOpenDialog(id, keep);
        });
        window.Panorama.on("sceneLoad", () => {
          if (
            !this.visibleScenes.find(
              (item) => item == window.krpano.get("xml.scene"),
            )
          ) {
            this.visibleScenes.push(window.krpano.get("xml.scene"));
          }
          this.$nextTick(() => {
            if (this.getScene(this.curSceneName)?.type == 2) {
              this.$refs["jy-bottom"] &&
                this.$refs["jy-bottom"].getVideoSceneInfo();
            } else {
              this.$refs["jy-bottom"] &&
                this.$refs["jy-bottom"].clearVideoSceneInfoTimer &&
                this.$refs["jy-bottom"].clearVideoSceneInfoTimer();
            }
          });

          let curCaptionsContent =
            this.scenes.find(
              (item) => item.name == window.krpano.get("xml.scene"),
            )?.captions?.content || "";
          if (curCaptionsContent != "") {
            this.isShowCaptions = true;
          } else {
            this.isShowCaptions = false;
          }

          this.$nextTick(() => {
            this.isShowName = false;
            if (this.nameDisplay.entryMode == 1) {
              if (this.nameDisplay.time > 0) {
                this.isShowName = true;
                setTimeout(() => {
                  this.isShowName = false;
                }, this.nameDisplay.time * 1000);
              }
            } else {
              this.isShowName = true;
            }
          });

          console.log("场景切换", window.krpano.get("xml.scene"));
          this.curSceneName = window.krpano.get("xml.scene");
          if (this.$refs["jy-bottom"])
            this.$refs["jy-bottom"].sceneSwiperChange(this.curSceneName);
          if (!this.firstLoad) {
            this.sceneChange();
            this.initMap();
          }

          if (this.firstLoad) {
            this.init();

            if (this.advertisement?.path) {
              this.isShowAdvertisement = true;
            }
          }

          if (this.type == "audio") {
            if (!this.formData.scenes.includes(this.curSceneName)) {
              this.close();
            }
          }
          if (this.isPlayed) this.audioPlay();
        });
        window.Panorama.on("setviewstate", () => {
          this.hLookat = window.krpano.view.hlookat - 135;
        });
        window.Panorama.on("play_music", () => {
          this.$refs["jy-right-menu"] &&
            this.$refs["jy-right-menu"].musicPlayFn();
        });
        window.Panorama.on("pause_music", () => {
          this.$refs["jy-right-menu"] &&
            this.$refs["jy-right-menu"].musicPauseFn();
        });
        window.Panorama.on("play_voice", () => {
          this.$refs["jy-right-menu"] &&
            this.$refs["jy-right-menu"].voicePlayFn();
        });
        window.Panorama.on("pause_voice", () => {
          this.$refs["jy-right-menu"] &&
            this.$refs["jy-right-menu"].voicePauseFn();
        });
      },
      init() {
        if (!this.firstLoad) return;
        this.firstLoad = false;
        this.initMap();
        this.initOneLevelGroup();

        if (this.open?.openingCover) this.cover = true;
        if (!this.open?.openingCover) this.cover = false;
        if (!this.base.customLogo.checked) {
          this.logoUrl = this.base.customLogo.url
            ? this.base.customLogo.url
            : "plugins/images/logo.jpg";
        }
        if (this.base.password) {
          this.isVerifyPwd = true;
        } else {
          try {
            window.showHotspot();
          } catch (error) {
            console.log("error", error);
          }
        }
        if (this.open?.openingAnimation != 0) {
          this.isOpen = true;
        }

        this.initAsteroid();
      },
      initOneLevelGroup() {
        console.log("initOneLevelGroup", this.curSceneName);
        this._defaultIconSize = window.jydata.base.footstepControl.icon.iconSize;
        this._defaultCursorSize = window.jydata.base.cursor.cursorSize;
        this.oneLevelGroups = [];
        this.groups.forEach((group) => {
          let fang = false;
          group.id = this.randomString(16);
          group.childGroups.forEach((childGroup) => {
            childGroup.id = this.randomString(16);
            if (childGroup.scenes.length) fang = true;
          });
          if (fang) this.oneLevelGroups.push(group);
        });
        this.currentOneLevelGroupId = this.groups[0].id;
        this.initTwoLevelGroup();
      },
      initTwoLevelGroup(group = false, currentTwoLevelGroupId = false) {
        let tempArr = this.groups.find(
          (group) => group.id === this.currentOneLevelGroupId,
        ).childGroups;
        this.twoLevelGroups = tempArr.filter((item) => item.scenes.length);

        console.log(
          "this.twoLevelGroups",
          this.twoLevelGroups,
          currentTwoLevelGroupId,
        );
        if (!currentTwoLevelGroupId)
          this.currentTwoLevelGroupId = this.twoLevelGroups[0].id;
        console.log("this.currentTwoLevelGroupId", this.currentTwoLevelGroupId);
        this.initScenes(group);
      },
      initScenes(group = false) {
        let currentTwoLevelGroup = this.twoLevelGroups.find(
          (group) => group.id === this.currentTwoLevelGroupId,
        );
        this.sceneList = currentTwoLevelGroup.scenes;
        console.log("this.sceneList", this.sceneList);
        this.applyChildGroupSettings(currentTwoLevelGroup);
        if (group && this.base.visibles.group) {
          console.log("切换场景");
          for (let i = 0; i < this.sceneList.length; i++) {
            const element = this.sceneList[i];
            console.log(
              "test",
              this.scenes.find((item) => item.name == element).isHide,
            );
            if (!this.scenes.find((item) => item.name == element).isHide) {
              window.Panorama.emit("loadscene", [element, true, 0]);
              break;
            }
          }
        }
      },
      groupChange({ type, id }) {
        console.log(type, id);
        if (type === "oneLevelGroup") {
          this.currentOneLevelGroupId = id;
          this.initTwoLevelGroup(true);
        } else if (type === "twoLevelGroup") {
          this.currentTwoLevelGroupId = id;
          this.initScenes(true);
        }
      },
      sceneChange() {
        console.log("sceneChange", this.curSceneName);
        this.groups.forEach((group) => {
          group.childGroups.forEach((childGroups) => {
            console.log(
              "childGroups.scenes.includes(this.curSceneName)",
              childGroups.scenes.includes(this.curSceneName),
            );
            if (childGroups.scenes.includes(this.curSceneName)) {
              console.log("childGroups", childGroups);
              this.currentOneLevelGroupId = group.id;
              this.currentTwoLevelGroupId = childGroups.id;
              this.initTwoLevelGroup(false, true);
              this.applyChildGroupSettings(childGroups);
            }
          });
        });
      },
      applyChildGroupSettings(childGroup) {
        if (!childGroup) return;
        const base = window.jydata.base;
        base.footstepControl.icon.iconSize =
          childGroup.footstepControl?.icon?.iconSize ?? this._defaultIconSize;
        base.cursor.cursorSize =
          childGroup.cursor?.cursorSize ?? this._defaultCursorSize;
        window.Panorama.emit("krpanoChangeCursor");
      },
      initMap() {
        this.currentMap = {};
        if (this.sandTable.map == null) return;
        this.sandTable.map.forEach((item) => {
          item.points.forEach((point) => {
            if (point.sceneName == this.curSceneName) {
              this.currentMap = item;
              setTimeout(() => {
                if (this.$refs["jy-right-menu"])
                  this.$refs["jy-right-menu"].initMap();
              }, 0);
            }
          });
        });
      },
      buttonOpenDialog(item) {
        this.panoramicVideoPause(1);
        this.fullscreen = false;
        this.title = "";
        this.formData = item;
        if (item.type == 4 || item.type == 6 || item.type == 8) {
          window.Panorama.emit("implant_togglepause");
        }
        if (item.type != 1 && item.type != 3 && item.type != 12) {
          this.$refs["jy-right-menu"] &&
            this.$refs["jy-right-menu"].handleClick("noReload");
        }
        // 链接
        if (item.type == 1) {
          if (item.openType == 1) {
            window.open(item.linkPath, "_blank");
            return;
          } else {
            this.$refs["jy-right-menu"] &&
              this.$refs["jy-right-menu"].handleClick("noReload");
            this.type = "link";
            this.fullscreen = true;
            if (this.formData.isChangeDialogType) {
              this.isShowDialogFull = true;
              return;
            }
          }
        }
        // 电话
        if (item.type == 2) {
          this.type = "phone";
          this.title = this.formData.title;
        }
        // 导航
        if (item.type == 3) {
          console.log("普通浏览器");
          if (this.isMobile)
            window.open(
              `https://m.amap.com/share/index/lnglat=${this.formData.mapPosition}&src=uriapi&innersrc=uriapi`,
            );
          else
            window.open(
              `https://ditu.amap.com/regeo?lng=${
                this.formData.mapPosition.split(",")[0]
              }&lat=${
                this.formData.mapPosition.split(",")[1]
              }&src=uriapi&innersrc=uriapi`,
            );
          return;
        }
        //  图文
        if (item.type == 4) {
          this.type = "image";
          if (this.formData.isChangeDialogType) {
            this.isShowDialogFull = true;
            return;
          }
        }
        // 文章
        if (item.type == 5) {
          this.type = "essay";
          this.fullscreen = true;
        }
        // 视频
        if (item.type == 6) {
          this.type = "video";
          if (this.formData.isChangeDialogType) {
            this.isShowDialogFull = true;
            return;
          }
        }
        // 环物
        if (item.type == 7) {
          this.type = "object-vr";
          this.title = item.title;
          window.clear_screen(false);
          // return
        }
        // 音频
        if (item.type == 8) {
          this.type = "audio";
          this.audioBottom = this.$refs["jy-bottom"].$el.clientHeight;
          return;
        }
        // pdf
        if (item.type == 9) {
          this.type = "pdf";
          this.title = this.formData.title;
          if (this.formData.pdfList.length <= 1) {
            this.$refs["jy-dialog"] &&
              this.$refs["jy-dialog"].pdfPreview(this.formData.pdfList[0]);
            return;
          }
        }
        // 分享
        if (item.type == 10) {
          this.type = "share";
          this.title = "分享";
          this.formData = {
            list: [
              {
                link:
                  window.location.href + `&shareScenes=${this.curSceneName}`,
                code: `<iframe src="${
                  window.location.href + "&shareScenes=" + this.curSceneName
                }" frameborder="no" width="700" height="500" ></iframe>`,
              },
              {
                link: window.location.href,
                code: `<iframe src="${window.location.href}" frameborder="no" width="700" height="500" ></iframe>`,
              },
            ],
            code: '<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />',
            title: this.base.title,
            text: this.base.introduce,
            phone: "",
          };
        }
        // 简介
        if (item.type == 11) {
          this.type = "text";
          this.title = "简介";
          this.formData = {
            title: this.base.title,
            text: this.base.introduce,
            openType: 1,
          };
        }
        if (item.type == 12) {
          this.isShowSearch = !this.isShowSearch;
          return;
        }
        window.isShowDialog = true;
        this.visible = true;
      },
      hotSpotOpenDialog(id, keep) {
        this.panoramicVideoPause(1);
        this.formData = this.hotSpotList.find((item) => item.id == id);
        this.fullscreen = false;
        this.title = "";
        this.type = "";
        if (
          this.$refs["jy-bottom"] &&
          this.$refs["jy-bottom"].tourStatus == 1
        ) {
          this.$refs["jy-bottom"].handleTour("pause");
          this.isHotSpotOpenDialogPauseTour = true;
        }
        if (
          this.formData.hotSpotType == 8 ||
          this.formData.hotSpotType == 9 ||
          this.formData.hotSpotType == 10 ||
          this.formData.hotSpotType == 11
        ) {
          window.Panorama.emit("implant_togglepause");
        }
        if (
          this.formData.hotSpotType != 1 &&
          this.formData.hotSpotType != 2 &&
          this.formData.hotSpotType != 3 &&
          this.formData.hotSpotType != 13
        ) {
          this.$refs["jy-right-menu"] &&
            this.$refs["jy-right-menu"].handleClick("noReload");
        }
        // 场景切换
        if (this.formData.hotSpotType == 1) {
          if (
            this.scenes.find((item) => item.name == this.curSceneName).model &&
            (this.scenes.find((item) => item.name == this.formData.sceneName)
              .model ||
              this.scenes.find((item) => item.name == this.formData.sceneName)
                .type == 3)
          ) {
            window.Panorama.emit("loadscene", [
              this.formData.sceneName,
              this.formData.keep,
              this.formData.effect,
              keep,
            ]);
          } else {
            window.Panorama.emit("loadscene", [
              this.formData.sceneName,
              this.formData.keep,
              this.formData.effect == 0 ? 1 : this.formData.effect,
              keep,
            ]);
          }

          return;
        }
        // 标签
        if (this.formData.hotSpotType == 2) {
          return;
        }
        // 超链接
        if (this.formData.hotSpotType == 3) {
          if (this.formData.openType == 1) {
            window.open(this.formData.linkPath, "_blank");
            return;
          } else {
            this.$refs["jy-right-menu"] &&
              this.$refs["jy-right-menu"].handleClick("noReload");
            this.type = "link";
            this.fullscreen = true;
            if (this.formData.isChangeDialogType) {
              this.isShowDialogFull = true;
              return;
            }
          }
        }
        // 文本
        if (this.formData.hotSpotType == 4) {
          this.type = "text";
          if (this.formData.isChangeDialogType) {
            this.isShowDialogFull = true;
            return;
          }
        }
        // 文章
        if (this.formData.hotSpotType == 5) {
          this.type = "essay";
          this.fullscreen = true;
        }
        // pdf
        if (this.formData.hotSpotType == 6) {
          this.type = "pdf";
          this.title = this.formData.name;
          if (this.formData.pdfList.length <= 1) {
            this.$refs["jy-dialog"] &&
              this.$refs["jy-dialog"].pdfPreview(this.formData.pdfList[0]);
            return;
          }
        }
        // 环物
        if (this.formData.hotSpotType == 7) {
          this.title = this.formData.name;
          this.type = "object-vr";
          this.visible = true;
          window.clear_screen(false);
          return;
        }
        // 图片
        if (this.formData.hotSpotType == 8) {
          this.type = "image";
          if (this.formData.isChangeDialogType) {
            this.isShowDialogFull = true;
            return;
          }
        }
        // 视频
        if (this.formData.hotSpotType == 9) {
          this.type = "video";
          if (this.formData.isChangeDialogType) {
            this.isShowDialogFull = true;
            return;
          }
        }
        // 音频
        if (this.formData.hotSpotType == 10) {
          this.$nextTick(() => {
            this.type = "audio";
          });
          this.audioBottom = this.$refs["jy-bottom"].$el.clientHeight;
          return;
        }
        // 图视超
        if (this.formData.hotSpotType == 11) {
          this.type = "image_video_link";
          if (this.formData.isChangeDialogType) {
            this.isShowDialogFull = true;
            return;
          }
        }
        // 电话
        if (this.formData.hotSpotType == 12) {
          this.type = "phone";
          this.title = this.formData.name;
        }
        // 导航
        if (this.formData.hotSpotType == 13) {
          console.log("普通浏览器");
          if (this.isMobile)
            window.open(
              `https://m.amap.com/share/index/lnglat=${this.formData.mapPosition}&src=uriapi&innersrc=uriapi`,
            );
          else
            window.open(
              `https://ditu.amap.com/regeo?lng=${
                this.formData.mapPosition.split(",")[0]
              }&lat=${
                this.formData.mapPosition.split(",")[1]
              }&src=uriapi&innersrc=uriapi`,
            );
          return;
        }
        window.isShowDialog = true;
        this.visible = true;
      },
      openLink(info) {
        this.title = "";
        this.formData = info;
        this.type = "link";
        this.fullscreen = true;
        window.isShowDialog = true;
        this.visible = true;
      },
      panoramicVideoMuted(type) {
        let _curScene = this.scenes.find(
          (item) => item.name == this.curSceneName,
        );
        if (_curScene.type == 2) {
          this.$refs["jy-bottom"] && this.$refs["jy-bottom"].muteding(type);
        }
      },
      panoramicVideoPause(type) {
        let _curScene = this.scenes.find(
          (item) => item.name == this.curSceneName,
        );
        if (_curScene.type == 2) {
          this.$refs["jy-bottom"] && this.$refs["jy-bottom"].videoControl(type);
        }
      },
      randomString(len) {
        len = len || 32;
        var $chars =
          "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678"; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = "";
        for (let i = 0; i < len; i++) {
          pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
      },
      hexToRgb(hexValue, opc) {
        var rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        var hex = hexValue.replace(rgx, function (m, r, g, b) {
          return r + r + g + g + b + b;
        });
        var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!rgb) {
          return hexValue;
        }
        var r = parseInt(rgb[1], 16);
        var g = parseInt(rgb[2], 16);
        var b = parseInt(rgb[3], 16);
        return "rgba(" + r + "," + g + "," + b + "," + opc + ")";
      },
    },
  });
};
