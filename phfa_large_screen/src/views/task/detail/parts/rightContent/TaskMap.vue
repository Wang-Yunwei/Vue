<template>
  <div class="map-wrapper corners-lg">
    <div class="map">
      <baidu-map
        id="task-map"
        ak="69B0IYEmlwQ5v9Q1amubZ8fL9bRhbMXA"
        scroll-wheel-zoom
        :min-zoom="5"
        :center="center"
        :zoom="curZoom"
        @ready="mapReady"
        @zoomend="zoomend"
      >
        <!-- 路线 -->
        <bm-polyline
          :path="path"
          :stroke-weight="8"
          stroke-color="#3A6CFD"
          :stroke-opacity="0.8"
          :clicking="false"
        />

        <!-- 起点图标 -->
        <!-- <bm-marker :position="start" :icon="startIcon" /> -->

        <!-- 救护车图标 -->
        <bm-marker
          class="ambulance-icon"
          v-if="curPos"
          :position="curPos"
          :icon="carIcon"
        />

        <!-- 终点图标 -->
        <bm-marker v-if="end" :position="end" :icon="endIcon" />

        <!-- 路线信息卡片 -->
        <bm-control class="route-info flex-c-b" v-if="map">
          <template
            v-if="curData().toHospitalName || arriveTime || time || distance"
          >
            <div class="left"></div>
            <div class="center">
              <div class="hospital-name">{{ curData().toHospitalName }}</div>
              <div class="time">{{ arriveTime }}到达 • {{ time }}</div>
            </div>
            <div class="right">{{ distance }}</div>
          </template>
          <template v-else> 暂无路线信息 </template>
        </bm-control>

        <!-- 地图缩放滑块 -->
        <bm-control
          v-if="map"
          :offset="{ width: 18, height: 100 }"
          anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
        >
          <div class="slider">
            <div class="slider-btn" :style="`height:${curZoomPercent}%`"></div>
          </div>
        </bm-control>
      </baidu-map>
    </div>
  </div>
</template>

<script>
import BaiduMap from "vue-baidu-map/components/map/Map";
import { BmMarker, BmPolyline, BmControl } from "vue-baidu-map";
export default {
  name: "Map",
  inject: ["curData"],
  components: {
    BmMarker,
    BaiduMap,
    BmPolyline,
    BmControl,
  },
  data() {
    return {
      BMap: null,
      map: null,
      center: { lng: 120.779152, lat: 31.343605 },
      curZoom: 11,

      // hospitalName: "苏州大学附属第一医院",
      distance: "",
      time: "",

      path: [],
      // start: { lng: 120.774768, lat: 31.337282 },
      // end: { lng: 120.612273, lat: 31.350347 },
      // curPos: { lng: 120.668552, lat: 31.334784 },
    };
  },
  computed: {
    curPos() {
      return this.start;
    },
    start() {
      const throughPoint = this.curData().throughPoint;
      return throughPoint?.length
        ? this.transCoord(throughPoint[throughPoint.length - 1])
        : null;
    },
    end() {
      return this.curData().endPoint
        ? this.transCoord(this.curData().endPoint)
        : null;
    },
    carIcon: () => ({
      url: require("@/assets/ambulance.png"),
      size: { width: 60, height: 60 },
      opts: { anchor: { width: 30, height: 30 } },
    }),
    startIcon: () => ({
      url: require("@/assets/start.png"),
      size: { width: 65, height: 94 },
      opts: { anchor: { width: 33, height: 86 } },
    }),
    endIcon: () => ({
      url: require("@/assets/end.png"),
      size: { width: 65, height: 94 },
      opts: { anchor: { width: 33, height: 86 } },
    }),
    curZoomPercent() {
      return (100 * (this.curZoom - 4)) / 15;
    },
    arriveTime() {
      if (!this.time) return "";
      const arr = this.time.split(/小时|分钟/).filter((el) => el);
      const minutes = parseInt(arr.pop());
      const hours = arr.pop() || 0;
      return this.$moment().add({ hours, minutes }).format("HH:mm");
    },
    routeChanged() {
      return {
        start: this.start,
        end: this.end,
      };
    },
  },
  methods: {
    transCoord(obj = {}) {
      // 坐标转换
      return {
        lng: obj.lng,
        lat: obj.lat,
      };
    },
    // 获取路线信息
    async getRouteInfo() {
      if (this.end && this.start) {
        const { path, distance, time } = await this.getPath();
        this.path = path;
        this.distance = distance;
        this.time = time;
      } else {
        this.path = [];
        this.distance = "";
        this.time = "";
      }
    },
    getPath() {
      const { BMap, map } = this;
      return new Promise((resolve) => {
        const driving = new BMap.DrivingRoute(map, {
          renderOptions: { map: map, autoViewport: true },
          onSearchComplete: (res) => {
            const plan = res.getPlan(0);
            if (plan) {
              const route = plan.getRoute(0);
              resolve({
                path: route.getPath(),
                distance: route.getDistance(),
                time: plan.getDuration(),
              });
              driving.clearResults();
            }
          },
        });
        const start = new BMap.Point(...Object.values(this.start));
        const end = new BMap.Point(...Object.values(this.end));
        driving.search(start, end);
        // driving.search(start, end, { waypoints: wayPoints });

        // // 清除搜索标记
        // setTimeout(() => {
        //   driving.clearResults();
        // }, 500);
      });
    },
    zoomend() {
      if (this.map?.getZoom) {
        this.curZoom = this.map.getZoom();
      }
    },
    mapReady({ BMap, map }) {
      this.map = map;
      this.BMap = BMap;

      this.getRouteInfo();
    },
  },
  watch: {
    routeChanged() {
      if (this.map && this.BMap) this.getRouteInfo();
    },
    path() {
      if (this.map) {
        // 视图自动适应路径变化
        const path = this.path || [];
        const view = this.map.getViewport(path);
        const mapZoom = view.zoom;
        const centerPoint = view.center;
        this.map.centerAndZoom(centerPoint, mapZoom);
        this.center = {
          lat: centerPoint?.lat || this.center.lat,
          lng: centerPoint?.lng || this.center.lng,
        };
      }
    },
  },
};
</script>

<style lang="less" scoped>
.map-wrapper {
  height: 813px;
  .map {
    height: 100%;
    border: 2px solid rgba(126, 181, 255, 0.6);
    box-shadow: 0px 0px 24px 0px rgba(103, 168, 255, 0.35) inset;
    padding: 6px;
    #task-map {
      height: 100%;
      background-color: #fff;
      position: relative;
      /deep/.anchorBL {
        display: none;
      }

      .route-info {
        width: 617px;
        background: rgba(14, 37, 60, 0.78);
        border: 2px solid #4b71ff;
        box-shadow: 0px 3px 9px 0px rgba(76, 94, 254, 0.48),
          0px 0px 24px 0px rgba(2, 14, 25, 0.35);
        border-radius: 20px;
        margin-left: 88px;
        margin-top: 36px;
        padding: 28px 30px;
        color: #fff;
        font-size: 31px;
        font-weight: 100;

        .left {
          background-image: url(~@/assets/hospital.png);
          width: 65px;
          height: 65px;
        }
        .center {
          .hospital-name {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
          flex: 1 1 auto;
          max-width: 345px;
          .time {
            margin-top: 10px;
            font-size: 28px;
          }
        }
        .right {
          height: 88px;
          font-size: 31px;
        }
      }

      .ambulance-icon {
        border: 2px solid rgba(0, 200, 255, 0.6);
      }

      .slider {
        width: 17px;
        height: 378px;
        background: linear-gradient(0deg, #ffffff, #3a6cfd, #00a8ff);
        border: 3px solid #dadbdb;
        box-shadow: 0px 2px 0px 0px rgba(255, 255, 255, 0.2) inset;
        border-radius: 8px;
        position: relative;
        &-btn {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 11px;
          height: 238px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0px 2px 0px 0px rgba(255, 255, 255, 0.2) inset;
          &:before {
            content: "";
            display: block;
            width: 22px;
            height: 22px;
            background-color: #fff;
            background-image: linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.2),
              rgba(0, 0, 0, 0)
            );
            box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.1);
            border-radius: 11px;
            position: absolute;
            left: -6px;
            cursor: grab;
          }
        }
      }
    }
  }
}
</style>
