<template>
  <div class="emergency-index-wrapper">
    <keep-alive :include="cached">
      <router-view v-if="isLoaded" @reload="onReload" />
    </keep-alive>
    <van-tabbar :value="active" v-if="curpage !== 'ambulances'">
      <van-tabbar-item name="task" icon="home-o" @click="jump('/aid/task')">
        <template #icon="props">
          <svg-icon class="tabicon" :name="props.active ? '当前任务-选中-02' : '当前任务1'" />
        </template>
        当前任务
      </van-tabbar-item>
      <van-tabbar-item name="map" icon="search" @click="jump('/aid/map')">
        <template #icon="props">
          <svg-icon class="tabicon" :name="props.active ? 'icon1-10' : 'icon1-05'" />
        </template>
        专科地图
      </van-tabbar-item>
      <van-tabbar-item name="consultation" icon="friends-o" @click="jump('/aid/consultation')">
        <template #icon="props">
          <svg-icon class="tabicon" :name="props.active ? 'icon1-12' : 'icon1-07'" />
        </template>
        移动会诊
      </van-tabbar-item>
      <van-tabbar-item name="history" icon="setting-o" @click="jump('/aid/history')">
        <template #icon="props">
          <svg-icon class="tabicon" :name="props.active ? 'icon1-09' : 'icon1-03'" />
        </template>
        历史任务
      </van-tabbar-item>
      <van-tabbar-item name="mine" icon="setting-o" @click="jump('/aid/mine')">
        <template #icon="props">
          <svg-icon class="tabicon" :name="props.active ? 'icon1-11' : 'icon1-06'" />
        </template>
        我的
      </van-tabbar-item>
    </van-tabbar>
    <!-- <baidu-map @ready="mapReady">
      <bm-geolocation
        anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
        :showAddressBar="true"
        :autoLocation="true"
        @location-success="onSuccess"
        @location-error="onErr"
      ></bm-geolocation>
    </baidu-map> -->
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import storage from 'store'
import * as types from '@store/mutations/mutations-types'
import { getCurLocation } from '@/utils/map'
export default {
  data() {
    return {
      unwatchStore: () => { },
      allowRepeat: true, // 允许坐标点重复记录
      isLoaded: false,
      // canUpload: true,
      cached: ['Task', 'Map']
    }
  },
  async created() {
    const patientId = storage.get('patientId') || ''
    const missionId = storage.get('missionId') || ''
    const recordId = storage.get('recordId') || ''
    const licensePlate = storage.get('licensePlate') || ''
    const codeList = storage.get('codeList') || '{}'
    const curpage = storage.get('curpage') || 'task'
    const endPoint = storage.get('endPoint') || null
    this[types.SET_PATIENTID](patientId)
    this[types.SET_MISSIONID](missionId)
    this[types.SET_RECORDID](recordId)
    this[types.SET_CURPAGE](curpage)
    this[types.SET_ENDPOINT](endPoint)
    this[types.SET_LICENSEPLATE](licensePlate)
    this[types.SET_CODELIST](codeList)
    this[types.SET_CURRENTNAV](this.active)
    this.isLoaded = true
  },
  mounted() {
    if (this.$route.path !== '/aid/history') {
      this.unwatchStore = this.$store.watch(
        (state, getter) =>
          state.missionId &&
          !state.isHandedOver &&
          state.missionStatus !== '06',
        newVal => {
          if (newVal) {
            this.trackLocation()
          }
        },
        {
          immediate: true
        }
      )
    }
  },
  watch: {
    active(nVal) {
      this[types.SET_CURRENTNAV](nVal)
    },
    currentNav(nVal, oVal) {
      if (oVal === 'history' && nVal === 'task') {
        this.isLoaded = false
        // if (this.$route.query && this.$route.query.status === '已提交') {
        //   this.canUpload = false
        // } else if (this.$route.query && this.$route.query.status === '未提交') {
        //   this.canUpload = true
        // }
        this.$nextTick(() => {
          this.isLoaded = true
        })
      }
    },
    currentPosition(newVal, oldVal) {
      // if (!this.canUpload) return
      if (
        !this.allowRepeat &&
        newVal?.latitude === oldVal?.latitude &&
        newVal?.longitude === oldVal?.longitude
      ) {
        console.log('坐标未移动')
      }

      if (!this.endPoint) {
        // console.log('未指明目的地')
      }
      this.savePath() // 20220826需求:未指明目的地也要记录路径
    }
  },
  methods: {
    ...mapMutations(types),
    // onSuccess(s) {
    //   console.log(s)
    // },
    // onErr(s) {
    //   console.log(s)
    // },
    onReload(compNames) {
      console.log('收到')
      this.isLoaded = false
      this.cached = this.cached.filter(el => !compNames.includes(el))
      this.$nextTick(() => {
        this.cached.push(...compNames)
        this.isLoaded = true
      })
    },
    jump(path) {
      if (path === this.$route.path) return
      this.$router.push({
        path: path,
        redirect: true
      })
    },
    // mapReady({ BMap }) {
    //   console.log('map ready')
    //   this.geolocation = new BMap.Geolocation({
    //     autoLocation: true,
    //     locationSuccess(s) {
    //       console.log('succeed', s)
    //     },
    //     locationError(e) {
    //       console.log('err', e)
    //     }
    //   })
    // },
    async trackLocation() {
      this.$store.dispatch('trackLocation') // 开始实时记录位置
    },
    async savePath() {
      // 保存路线信息
      const position = this.currentPosition
      if (position && Object.keys(position).length) {
        // console.log('保存路线', position)
        // const now = this.$moment().format(YYYY-MM-DD[T]HH:mm:ss)
        const payload = {
          missionId: this.missionId,
          currentPoints: {
            lat: Number(position.latitude),
            lng: Number(position.longitude)
            // recordingTime: now
          }
          // 终点不送,后端会通过missionId获取终点医院
          // endPoints: {
          //   lat: this.endPoint?.latitude,
          //   lng: this.endPoint?.longitude
          // }
        }
        const res = await this.$api.recordTrack(payload)
        // 静默保存
        // if (res.body) {
        //   this.$toast('保存成功')
        // } else {
        //   this.$toast('路线保存失败!' + res.message)
        // }
      }
    }
  },
  beforeDestroy() {
    this.unwatchStore()
    this[types.SET_PATIENTID]('')
    this[types.SET_MISSIONID]('')
    this[types.SET_RECORDID]('')
    this[types.SET_CURPAGE]('ambulances')
    this[types.SET_ENDPOINT](null)
    this[types.SET_LICENSEPLATE]('')
  },
  computed: {
    ...mapGetters([
      'curpage',
      'currentNav',
      'endPoint',
      'currentPosition',
      'missionId'
    ]),
    active() {
      const { path } = this.$route
      return path.replace(/.*?\/([\w]*$)/, '$1')
    }
  }
}
</script>

<style lang="less" scoped>
.emergency-index-wrapper {
  background: #f2f4f5;
  height: 100%;

  .tabicon {
    width: 50px;
    height: 50px;
    color: #999;
  }

  /deep/ .van-tabbar-item {
    .van-tabbar-item__text {
      font-size: @font-xs-size;
      color: #646566;
    }

    &.van-tabbar-item--active {
      .van-tabbar-item__text {
        font-size: @font-md-size;
        color: #1989fa;
      }
    }
  }
}
</style>
