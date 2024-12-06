<template>
  <div class="emergency-map-wrapper">
    <med-header leftText="" title="专科地图" @backClick="back">
      <template #right>
        <van-popover v-model="showPopover" trigger="click" :actions="actions" @select="selectRange">
          <template #reference>
            <van-button class="btn" round>
              {{ currentRange }}
              <van-icon name="arrow-down" />
            </van-button>
          </template>
        </van-popover>
      </template>
    </med-header>
    <div class="map-control flex-c-s" v-show="divTopShow">
      <p :class="{ checked: curType === '2' }" @click="changeType('2')">胸痛</p>
      <p :class="{ checked: curType === '1' }" @click="changeType('1')">卒中</p>
      <p :class="{ checked: curType === '3' }" @click="changeType('3')">创伤</p>
    </div>
    <baidu-map :center="curPos" :zoom="zoom" @ready="mapReady" :scroll-wheel-zoom="true">
      <bm-view class="bm-view" />
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT" />
      <!-- <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_LEFT" :autoLocation="true" /> -->
      <bm-marker v-if="bmMarkerIf" :position="curPos" :dragging="false" :icon="icon" animation="BMAP_ANIMATION_BOUNCE" :offset="{ width: -4, height: 4 }" />
      <my-overlay :point="point" v-for="point in filteredPoints" :key="point.value + point.lng + point.lat" :position="{ lng: point.lng, lat: point.lat }" @click="handleClickPoint(point)" />

      <bm-control v-show="bmControlShow" anchor="BMAP_ANCHOR_BOTTOM_RIGHT">
        <!-- <button @click="addZoom(1)" class="right-bottom-btn btn-call">
          <i class="iconfont iconicon1-161" />
          <p>呼叫</p>
        </button> -->
        <button @click="addZoom(2)" class="right-bottom-btn btn-inform">
          <i class="iconfont iconicon1-17" />
          <p>告知</p>
        </button>
      </bm-control>
    </baidu-map>
    <van-popup v-model="callShow" closeable class="call-popup">
      <van-cell style="border-radius: 30px">
        <med-select placeholder="请选择医院" v-model="form.toHospital" :options="toHospialList"></med-select>
      </van-cell>
      <br />
      <van-cell style="border-radius: 30px">
        <med-select placeholder="请选择疾病类别" v-model="form.diseaseCategory" :options="PHFA_0011" />
      </van-cell>
      <br />
      <van-form @submit="callSubmit" title="呼叫">
        选择科室
        <van-radio-group class="flex-c-s radio-btn-type" v-model="form.callDepartment">
          <van-radio name="01">急诊科</van-radio>
          <van-radio name="02">神经外科</van-radio>
          <van-radio name="03">心内科</van-radio>
          <van-radio name="04">骨科</van-radio>
        </van-radio-group>
        选择人员
        <van-radio-group class="flex-c-s radio-btn-type" v-model="form.callPersonnel">
          <van-radio name="01">值班主任</van-radio>
          <van-radio name="02">值班护士</van-radio>
          <van-radio name="03">专家</van-radio>
        </van-radio-group>
        <div class="flex-c-a call-btns">
          <van-button native-type="submit">
            <i class="iconfont iconicon1-341" />
          </van-button>
          <van-button native-type="submit">
            <i class="iconfont iconicon1-33" />
          </van-button>
        </div>
      </van-form>
    </van-popup>
    <van-popup v-model="informShow" closeable class="inform-popup">
      <van-form @submit="informSubmit">
        <center>告知</center>
        <van-cell style="border-radius: 30px">
          <med-select placeholder="请选择医院" :disabled="!!toHospitalId" v-model="form.toHospital" :options="toHospialList">
          </med-select>
        </van-cell>
        <br /><br />
        <van-radio-group class="flex-c-b radio-btn-type" v-model="form.inform">
          <van-radio name="01">全部</van-radio>
          <van-radio name="02">急诊科</van-radio>
          <van-radio name="03">神内科</van-radio>
          <van-radio name="04">导管室</van-radio>
        </van-radio-group>
        <div class="popBtn">
          <van-button round block type="info" native-type="submit" color="#5E74FE" v-if="form.toHospital">
            确定
          </van-button>
        </div>
      </van-form>
    </van-popup>
    <van-popup position="top" v-model="routeShow" :overlay="false" :closeable="false" class="hospital-info">
      <van-row type="flex" :gutter="14">
        <van-col span="3" class="flex-c-c">
          <i class="iconfont iconicon1svg-35" />
        </van-col>
        <van-col span="21">
          <van-row :gutter="12">
            <van-col span="16">
              <div class="hospital-title">
                {{ routeInfo.address }}
              </div>
            </van-col>
            <van-col span="8">{{ routeInfo.distance }}</van-col>
          </van-row>
          <van-row class="time-info" :gutter="22">
            <van-col class="arrive-time">
              {{ routeInfo.arriveTime }}到达
            </van-col>
            <van-col class="rest-time">{{ routeInfo.time }} </van-col>
          </van-row>
        </van-col>
      </van-row>
    </van-popup>
  </div>
</template>

<script>
import methodMixin from '@mixins/methodMixin'
import { mapGetters, mapMutations } from 'vuex'
import * as types from '@store/mutations/mutations-types'
import { BmlLushu } from 'vue-baidu-map'
import MyOverlay from './MyOverlay'

const delay = time => new Promise(resolve => setTimeout(() => resolve(), time))

export default {
  name: 'Map',
  components: {
    MyOverlay,
    BmlLushu
  },
  mixins: [methodMixin],
  data() {
    return {
      toHospital: '',
      drivingRoute: null, // 路线规划实例
      bmDrivingWaypoints: [],
      divTopShow: true,
      bmControlShow: true,
      play: false,
      path: [],
      icon: {
        url: require('@/assets/png/icon1-50.png'),
        opts: {
          anchor: { width: 25, height: 65 },
          imageSize: { width: 60, height: 60 }
        },
        size: { width: 60, height: 60 }
      },
      points: [],
      start: {},
      end: {},
      startCity: '苏州',
      endCity: '苏州',
      form: {
        callDepartment: '',
        callPersonnel: '',
        inform: '01',
        toHospital: ''
      },
      callShow: false,
      informShow: false,
      routeShow: false,
      routeInfo: {},
      zoom: 15,
      showPopover: false,
      currentRange: '1KM',
      curType: '',
      location: '苏州',
      circlePath: {
        center: {
          lng: 0,
          lat: 0
        },
        radius: 1000
      },
      actions: [
        {
          text: '1KM',
          value: 1000
        },
        {
          text: '5KM',
          value: 5000
        },
        {
          text: '10KM',
          value: 10000
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'patientId',
      'hospitalId',
      'missionId',
      'missionStatus',
      'toHospitalId',
      'currentPosition',
      'hospitalAreaList',
      'diseaseCategory'
    ]),
    PHFA_0011() {
      return this.getCodeListByKey([
        'PHFA_0011' // 疾病类别
      ]).PHFA_0011
    },
    toHospialList() {
      return this.hospitalAreaList
    },
    curPos() {
      const pos = this.currentPosition || {}
      return {
        lng: pos.longitude,
        lat: pos.latitude
      }
    },
    filteredPoints() {
      const filtered = (this.points || []).filter(
        item =>
          (
            (item.specialistCenter || '').split(',').filter(c => c) || []
          ).includes(this.curType) && item.id !== this.routeInfo.id
      )
      return filtered
    },
    bmMarkerIf() {
      // 在有任务且任务未完成时显示车辆位置标记
      return this.missionStatus && this.missionStatus !== '06'
    }
  },
  created() { },
  methods: {
    ...mapMutations(types),
    savePath() {
      if (this.$parent?.savePath) {
        this.$parent.savePath()
      }
    },
    back() {
      this.$router.push('/aid/ambulances')
    },
    getHospitals() {
      // 任务状态等于06则查询行动轨迹
      if (this.missionStatus === '06') {
        // console.log('单据已完成')
        this.divTopShow = false // 单据完成不显示专科top
        this.bmControlShow = false // 单据完成不显示呼叫与告知
        this.smcListOrDetail() // 查询行动轨迹
        if (this.toHospitalId) {
          this.hospitalAreaList.findIndex(item => {
            if (item.id === this.toHospitalId) {
              // console.log('诊断处理已选择医院 = ', item)
              this.handleClickPoint({
                ...item,
                lng: item.longitude,
                lat: item.latitude
              })
            }
          })
        }
      } else {
        // 显示专科医院位置
        this.points = this.hospitalAreaList
        // 如果诊断处理中已经选了'送往医院',就自动规划去往此医院的路线
        if (this.toHospitalId) {
          this.handleToHospitalChange()
        }
      }
    },
    smcListOrDetail() {
      // 查询missionId下的行动轨迹
      this.$api
        .smcListOrDetail({
          missionId: this.missionId
        })
        .then(res => {
          // console.log('历史路径', res.body)
          if (res.body?.length) {
            this.bmDrivingWaypoints = res.body.map(elem => {
              return {
                lng: elem.longitude || elem.lng,
                lat: elem.latitude || elem.lat
              }
            })
            this.replayPath(this.bmDrivingWaypoints)
          }
        })
    },
    reset() {
      this.play = false
    },
    // 路线搜索回调
    searchComplete(results) {
      const plan = results.getPlan(0)
      if (!plan) return

      this.path = plan
        .getRoute(0)
        .getPath()
        ?.map(p => ({ ...p, of: undefined }))

      this.routeInfo.time = plan.getDuration(true)
      const arr = this.routeInfo.time.split(/小时|分钟/).filter(el => el)
      const minutes = parseInt(arr.pop())
      const hours = arr.pop() || 0
      this.routeInfo.arriveTime = this.$moment()
        .add({ hours, minutes })
        .format('HH:mm')
      this.$set(this.routeInfo, 'distance', plan.getDistance(true))
      if (this.bmMarkerIf) {
        this.routeShow = true
        this.savePath()
      }
    },
    handleSearchPath() {
      // 查询路线信息
      const { Point } = this.BMap
      var start = new Point(this.start.lng, this.start.lat)
      var end = new Point(this.end.lng, this.end.lat)
      if (!this.drivingRoute) {
        this.drivingRoute = new this.BMap.DrivingRoute(this.map, {
          renderOptions: { map: this.map, autoViewport: true },
          onSearchComplete: this.searchComplete,
          onPolylinesSet: () => { }
        })
      }
      this.drivingRoute.search(start, end, 'BMAP_DRIVING_POLICY_LEAST_TIME')
    },
    replayPath(path = []) {
      if (!this.drivingRoute) {
        this.drivingRoute = new this.BMap.DrivingRoute(this.map, {
          renderOptions: { map: this.map, autoViewport: true },
          onSearchComplete: this.searchComplete,
          onPolylinesSet: () => { }
        })
      }
      const [start] = path
      const [end] = path.slice(-1)
      if (start && end) {
        const { Point } = this.BMap
        var startPoint = new Point(start?.lng, start?.lat)
        var endPoint = new Point(end?.lng, end?.lat)

        this.drivingRoute.search(
          startPoint,
          endPoint,
          'BMAP_DRIVING_POLICY_LEAST_TIME',
          this.bmDrivingWaypoints
        )
      }
    },
    async handleClickPoint(point) {
      // 自动规划路径
      // await this.clearPath()
      this.end = point
      this[types.SET_ENDPOINT](point)
      this.start = this.curPos
      this.routeInfo.address = point.label
      this.$set(this.routeInfo, 'id', point.value)
      this.handleSearchPath()
    },
    draw({ el, BMap, map }) {
      const pixel = map.pointToOverlayPixel(new BMap.Point(116.404, 39.915))
      el.style.left = pixel.x - 60 + 'px'
      el.style.top = pixel.y - 20 + 'px'
    },
    callSubmit() {
      this.toHospital = this.form.toHospital
    },
    async informSubmit(params) {
      // 发送通知到急救大屏
      const msg = {
        type: 'inform',
        content: {
          missionId: this.missionId
        }
      }

      if (this.toHospital !== this.form.toHospital) {
        this.toHospital = this.form.toHospital
        await delay(1000)
      }

      const res = await this.$api.pushDataToSSE({
        sseId: this.form.toHospital,
        content: JSON.stringify(msg)
      })

      if (res.code === '000000') {
        this.informShow = false
        this.$notify({
          type: 'success',
          message: '已发送实时通知'
        })
      } else if (res.code === '400000') {
        this.$notify({
          type: 'warning',
          message: '医院端未登录,告知无人接收!'
        })
      } else {
        this.$notify({
          type: 'danger',
          message: '告知失败! ' + res.message
        })
      }
      // 推送数据
      this.$api.pushDataToDas(this.missionId).then(res => {
        if (res.code === '000000') {
          console.log('推送数据到DAS:', res.body)
        }
      })
    },
    addZoom(level) {
      if (level === 1) {
        this.callShow = true
        // console.log('呼叫')
      } else {
        this.informShow = true
        // console.log('告知')
      }
    },
    selectRange(action) {
      // 范围筛选 暂时不做
      this.currentRange = action.text
      this.$set(this.circlePath, 'radius', action.value)
    },
    changeType(type) {
      this.curType = type
      // console.log('专科医院地址:', this.circlePath)
    },
    mapReady({ BMap, map }) {
      this.map = map
      this.BMap = BMap
      this.myGeo = new BMap.Geocoder()
      this.getHospitals()
    },
    handleToHospitalChange() {
      const matchedPoint = this.points.find(p => p.value === this.toHospitalId)
      if (matchedPoint) {
        this.handleClickPoint(matchedPoint)
      } else {
        console.warn('地图上未找到医院:' + this.toHospitalId)
      }
    }
  },
  watch: {
    end: {
      deep: true,
      immediate: true,
      handler(v) {
        // this.bmControlShow = !!Object.keys(v).length
      }
    },
    '$route.path': {
      immediate: true,
      handler(v) {
        if (v === '/aid/map') {
          if (this.toHospitalId && this.toHospital !== this.toHospitalId) {
            this.toHospital = this.toHospitalId
            this.form.toHospital = this.toHospitalId
            if (this.points.length) {
              this.handleToHospitalChange()
            }
          } else if (!this.toHospitalId && this.routeInfo.address) {
            this.$emit('reload', ['Map'])
          }
          // 疾病类别
          this.$set(this.form, 'diseaseCategory', this.diseaseCategory)
        }
      }
    },
    toHospitalId: {
      immediate: true,
      handler(v) {
        if (v && this.$route.path === '/aid/map') {
          this.toHospital = v
          this.form.toHospital = v
          if (this.points.length) {
            this.handleToHospitalChange()
          }
        }
      }
    },
    toHospital(v) {
      if (this.toHospitalId !== v) {
        const name = this.hospitalAreaList.find(el => el.value === v)?.label
        if (name) this[types.SET_TOHOSPITALNAME](name)
        this[types.SET_TOHOSPITALID](v)
        // 发送通知到急救大屏
        this.$api.pushDataToSSE({
          sseId: v,
          content: 'missionChange'
        })
      }
    },
    informShow(v) {
      // 隐藏弹窗重置form
      if (!v) {
        this.form = {
          callDepartment: '',
          callPersonnel: '',
          inform: '01',
          toHospital: this.toHospitalId
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.emergency-map-wrapper {
  height: 100vh;
  overflow: hidden;

  .btn {
    background: transparent;
    color: #fff;
    padding: 10px 30px;
    line-height: 1;
    height: auto;

    .van-icon {
      color: #fff;
    }
  }

  .van-nav-bar__right {
    line-height: 1;
  }

  .map-control {
    height: 80px;
    padding: 0 30px;

    p {
      padding: 10px 30px;
      font-size: 30px;
      color: #202020;

      &.checked {
        background: #5e74fe;
        border-radius: 50px;
        color: #fff;
      }
    }
  }

  .bm-view {
    width: 100%;
    height: calc(100vh - 4.5rem);
  }

  /deep/ .BMap_cpyCtrl {
    display: none;

    &+div.anchorBL {
      display: none;
    }
  }

  .right-bottom-btn {
    width: 1.4rem; //宽
    height: 1.4rem; //高
    font-size: 0.4rem; //字体大小
    margin-right: 0.4rem; // 外边距-右
    margin-bottom: 0.4rem; // 外边距-底部
    border-radius: 0.3rem; // 圆角
    background-color: rgba(255, 255, 255, 0.8); //背景色
    box-shadow: 0px 3px 9px 0px rgba(76, 94, 254, 0.48); // 阴影

    i {
      color: #5e74fe;
      font-size: 0.7rem;
      line-height: 0.6rem;
    }

    p {
      font-size: 0.35rem;
      margin-top: 0.1rem;
    }
  }

  .call-popup {
    width: 9.4rem;
    padding: 0.8rem 0.6rem;
    border-radius: 0.1rem;
    background-color: #f4f7f9;

    /deep/ .van-popup__close-icon {
      top: 0;
      right: 0;
    }

    /deep/ .radio-btn-type {
      margin-top: 0.4rem;
      margin-bottom: 0.4rem;
      font-size: 0.36rem;

      .van-radio__label {
        color: #696969;
        background-color: #fff;
      }
    }

    .call-btns {
      padding: 1.4rem 1.3rem 0.8rem 1.3rem;

      /deep/ .van-button {
        background-image: linear-gradient(45deg, #4c5efe, #708afe);
        color: #fff;
        border-radius: 0.3rem;
        height: 1.6rem;
        width: 1.6rem;
        border: none;
        box-shadow: 0px 3px 9px 0px rgba(76, 94, 254, 0.48);

        i.iconfont {
          font-size: 1rem;
        }
      }
    }
  }

  .inform-popup {
    width: 9.4rem;
    padding: 0.8rem 0.6rem;
    border-radius: 0.1rem;
    background-color: #f4f7f9;

    /deep/ .van-popup__close-icon {
      top: 0;
      right: 0;
    }

    .popBtn {
      margin: 60px 50px 0 50px;
    }

    center {
      margin-top: -0.4rem;
      font-size: 0.4rem;
      margin-bottom: 0.6rem;
    }

    /deep/ .radio-btn-type {
      flex-wrap: wrap;

      .van-radio {
        &:nth-child(even) {
          margin-left: 0.4rem;
        }

        flex: 1 0 3.8rem;
        margin-bottom: 0.5rem;
        margin-right: 0;

        .van-radio__label {
          line-height: 1rem;
          padding: 0 0.4rem;
          width: 100%;
          text-align: center;
          font-size: 0.36rem;
          color: #696969;
          background-color: #fff;
        }

        .van-radio__icon--checked+.van-radio__label {
          color: #5e74fe;
          background-color: rgba(94, 116, 254, 0.15);
          border: 1px solid #5e74fe;
        }
      }
    }
  }

  .hospital-info {
    width: 630px;
    // height: 131px;
    background: rgba(0, 0, 0, 0.9);
    border: 1px solid #dadada;
    box-shadow: 0px 3px 9px 0px rgba(76, 94, 254, 0.48);
    opacity: 0.8;
    border-radius: 20px;
    top: 3.2rem;
    left: calc(50% - 315px);
    padding: 0.2rem 0 0.2rem 0.3rem;
    color: #fff;
    font-size: 0.42rem;

    .time-info {
      padding-top: 0.1rem;
      font-size: 0.36rem;
      color: rgba(255, 255, 255, 0.8);

      .arrive-time {
        position: relative;

        &::after {
          position: absolute;
          right: -0.05rem;
          top: 0.22rem;
          content: "";
          display: block;
          width: 0.1rem;
          height: 0.1rem;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.8);
        }
      }
    }
  }

  .iconicon1svg-35 {
    font-size: 0.86rem;
    height: 0.86rem;
    line-height: 0.86rem;
    color: #f54336;
    background-image: radial-gradient(#fff 60%, transparent 50%);
  }
}
</style>
