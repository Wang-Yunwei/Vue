<template>
  <div class="map-wrapper">
    <baidu-map
      id="task-map"
      ak="69B0IYEmlwQ5v9Q1amubZ8fL9bRhbMXA"
      scroll-wheel-zoom
      :center="center"
      :min-zoom="5"
      :zoom="12"
      @ready="mapReady"
    >
      <bm-marker v-if="showCar" :position="curPos" :dragging="false" :icon="icon" :offset="{ width: 21, height: 40 }" />
    </baidu-map>
    <div class="slider-wrap">
      <el-button
        class="play-btn"
        size="mini"
        :icon="playing ? 'el-icon-video-pause' : 'el-icon-video-play'"
        circle
        :disabled="!path.length"
        @click="togglePlay"
      />
      <el-slider v-model="sliderValue" :disabled="!path.length" :format-tooltip="formatTooltip" />
    </div>
  </div>
</template>

<script>
import { getPath } from '@/api/map'
import BaiduMap from 'vue-baidu-map/components/map/Map'
import { BmMarker } from 'vue-baidu-map'
export default {
  name: 'TaskMap',
  components: {
    BaiduMap,
    BmMarker
    // BmPolyline,
    // BmControl
  },
  props: {
    missionId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      timer: 0,
      playing: false,
      showCar: false,
      sliderValue: 0,
      drivingRoute: null, // 路线规划实例
      map: null,
      BMap: null,
      myGeo: null,
      path: [], // 渲染到地图上的路径
      missionPath: [], // 后台记录的路径
      center: { lng: 120.779152, lat: 31.343605 }
    }
  },
  computed: {
    icon() {
      const movingIcon = require('@/assets/icons/icon1-50.gif')
      const staticIcon = require('@/assets/icons/icon1-50.png')
      return {
        url: this.playing ? movingIcon : staticIcon,
        opts: {
          anchor: { width: 50, height: 98 },
          imageSize: { width: 60, height: 60 }
        },
        size: { width: 60, height: 60 }
      }
    },
    curPos() {
      if (this.missionPath.length) {
        const realIndex = Math.round(
          (this.missionPath.length * this.sliderValue) / 100
        )
        const item = this.missionPath[realIndex]
        if (item) {
          return {
            lat: item.latitude,
            lng: item.longitude,
            recordingTime: item.recordingTime
          }
        }
      }
      return {}
    }
  },
  watch: {
    missionId: {
      handler(v) {
        if (v) {
          this.getMissionPath()
        }
      }
    }
  },
  beforeDestroy() {
    this.stop()
  },
  methods: {
    togglePlay() {
      this.playing = !this.playing
      if (this.playing) {
        this.play()
      } else {
        this.stop()
      }
    },
    play() {
      if (this.sliderValue === 100) {
        this.sliderValue = 0
      }
      this.timer = setInterval(() => {
        if (this.sliderValue < 100) {
          this.sliderValue += 0.25
        } else {
          this.stop()
        }
      }, 100)
    },
    stop() {
      this.playing = false
      clearInterval(this.timer)
    },
    formatTooltip(val) {
      return this.curPos.recordingTime
    },
    mapReady({ BMap, map }) {
      this.map = map
      this.BMap = BMap
      this.myGeo = new BMap.Geocoder()
      var geolocation = new BMap.Geolocation({ autoLocation: true })
      geolocation.getCurrentPosition(
        (r) => {
          console.log('定位数据', r)
          this.center = {
            lng: r.point.lng,
            lat: r.point.lat
            // lng: 120.61712 || r.point.lng,
            // lat: 31.336607 || r.point.lat
          }

          this.getMissionPath()
        },
        {
          enableHighAccuracy: true
        }
      )
    },
    // 路线搜索回调
    searchComplete(results) {
      const plan = results.getPlan(0)
      if (!plan) return

      this.path = plan
        .getRoute(0)
        .getPath()
        ?.map((p) => ({ ...p, of: undefined }))

      this.showCar = true
    },
    replayPath(path = []) {
      if (!this.drivingRoute) {
        this.drivingRoute = new this.BMap.DrivingRoute(this.map, {
          renderOptions: { map: this.map },
          onSearchComplete: this.searchComplete,
          onPolylinesSet: () => { }
        })
      }
      const [start] = path
      const [end] = path.slice(-1)

      if (start && end) {
        // this.center = {
        //   lng: end.lng,
        //   lat: end.lat
        // }
        const { Point } = this.BMap
        var startPoint = new Point(start?.longitude, start?.latitude)
        var endPoint = new Point(end?.longitude, end?.latitude)
        this.drivingRoute.search(
          startPoint,
          endPoint,
          'BMAP_DRIVING_POLICY_LEAST_TIME',
          path.map((el) => ({ lat: el.latitude, lng: el.longitude }))
        )
      }
    },
    async getMissionPath() {
      const res = await getPath({ missionId: this.missionId })
      if (res.code === '000000') {
        this.missionPath = res.body || []
        this.replayPath(this.missionPath)
      } else {
        this.$message.error('获取路径失败!' + res.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.map-wrapper {
  #task-map {
    height: 500px;

    ::v-deep .anchorBL {
      display: none;
    }
  }

  .slider-wrap {
    padding: 10px 10px 0 0;
    display: flex;

    .play-btn {
      flex: 0 1 40px;
      padding: 0;
      font-size: 38px;
      border: none;
    }

    ::v-deep .el-slider {
      flex: auto;
      margin-left: 16px;
    }
  }
}
</style>
