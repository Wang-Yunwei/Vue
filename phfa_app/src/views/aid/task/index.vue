<template>
  <div v-if="curpage === 'task'" :class="{ 'emergency-task-wrapper': true, 'prohibit-editing': !canSubmit }">
    <div class="emergency-task-top">
      <div class="emergency-task-temp flex-c-b">
        <van-icon name="arrow-left" @click="back" />
        急救病历

        <div class="emergency-task-relation" @click="handleAssociation">
          <i class="iconfont iconicon1-221" v-if="networkState" />
          <i class="iconfont iconicon1-231" v-else />
        </div>
      </div>
      <div class="emergency-task-name">
        <div class="flex-c-b">
          <p>
            <span class="one name">{{ patientInfo.name }}</span>
            <span class="one">
              <i :class="{
    gender: true,
    iconfont: true,
    'iconicon1-54male': patientInfo.gender === '01',
    'iconicon1-55female': patientInfo.gender === '02',
    no: patientInfo.gender !== '02' && patientInfo.gender !== '01'
  }" />
              {{ patientInfo.age === "0" ? "" : patientInfo.age }}
              {{
    ageExtendList.find(t => t.value === patientInfo.ageExtend)
      ? ageExtendList.find(t => t.value === patientInfo.ageExtend)
        .label
      : ""
  }}
            </span>
          </p>
          <p class="spec">
            <span>{{
      diseaseCategoryList.find(
        t => t.value === patientInfo.diseaseCategory
      )
        ? diseaseCategoryList.find(
          t => t.value === patientInfo.diseaseCategory
        ).label
        : ""
    }}</span>
          </p>
        </div>
        <div class="flex-c-b">
          <p class="spec">
            <span class="one">{{ statusText }}</span>
            <span class="one">{{ getCurrentStatusTime() }}</span>
          </p>
          <p class="spec">
            <span class="two">
              {{ toHospitalName }}
            </span>
          </p>
        </div>
      </div>
    </div>
    <div class="emergency-task-main">
      <van-tabs v-model="active" color="#5e74fe" :lazy-render="false" scrollspy sticky offset-top="4.1rem">
        <van-tab v-for="(item, index) in list" :title="item.name" :key="index">
          <component ref="compon" :is="item.part" />
        </van-tab>
      </van-tabs>
    </div>
    <van-button class="arrive-btn" type="primary" round @click="updateStatus" v-if="!btnShow && !historyBtnShow">
      {{ btnText }}
    </van-button>
    <van-button class="arrive-btn" type="primary" round @click="handleEditHistory" v-if="btnShow && canSubmit">
      提交病历
    </van-button>
  </div>
  <no-task v-else-if="curpage === 'notask'" @create="handleCreateTask" />
</template>

<script>
import * as parts from './parts'
import * as types from '@store/mutations/mutations-types'
import methodMixin from '@mixins/methodMixin'
import { mapMutations, mapGetters } from 'vuex'
import map from '../map'

export default {
  name: 'Task',
  components: { ...parts },
  props: {
    medicalStatus: {
      // 病历提交状态
      type: String,
      default: '01'
    }
  },
  data() {
    return {
      networkState: true,
      createTime: '',
      gender: false,
      missionTemplate: '02',
      active: 0,
      maskShow: false,
      missionTemplateList: [],
      missionStatusList: [],
      ageExtendList: [],
      genderList: [],
      diseaseCategoryList: [],
      statusArray: []
    }
  },
  async created() {
    this.getCodeList()
  },
  mounted() {
    this.getNetworkState()
  },
  methods: {
    ...mapMutations(types),
    getNetworkState() {
      this.$bridge.registerHandler('getNetworkState', data => {
        console.log('app主动调用js方法，传入数据:', typeof data, data)
        // 0:移动网路;1:wifi网络
        if (data < 0) {
          // 小于0没有网络
          this.networkState = false
        } else {
          this.networkState = true
        }
      })
    },
    back() {
      this.$router.push('/aid/ambulances')
    },
    submitConfirm() {
      return this.$dialog.confirm({
        title: '确定提交吗',
        message: '提交后病历将不可修改'
      })
    },
    async handleEditHistory() {
      // 提交病历之前校验必填项
      const valid = await this.validate()
      console.log(valid)
      await this.submitConfirm()
      this.$api
        .mpmrUpdateByPatientId({
          patientId: this.patientInfo.patientId,
          submitTime: this.$moment().format('YYYY-MM-DD[T]HH:mm:ss'),
          status: '02'
        })
        .then(response => {
          if (response.code === '000000') {
            this.$notify({ type: 'success', message: '病历提交成功!' })
            this[types.SET_MEDICALSTATUS]('02')
          }
        })
    },
    // 创建任务(有车 无任务执行创建)
    async handleCreateTask() {
      const res = await this.$api.init({
        status: '01',
        licensePlate: this.licensePlate,
        createTime: this.$moment().format('YYYY-MM-DD[T]HH:mm:ss')
      })
      if (res.code === '000000' && res.body) {
        const { missionId, patientId, recordId } = res.body
        this[types.SET_PATIENTID](patientId)
        this[types.SET_RECORDID](recordId)
        this[types.SET_MISSIONID](missionId)
        this[types.SET_CURPAGE]('task')
      } else {
        this.$notify({
          type: 'danger',
          message: '创建任务失败! ' + (res.message || '')
        })
      }
    },
    // 校验必填项
    async validate() {
      const basicInfo = this.$refs.compon[0]
      const handOver = this.$refs.compon[6]
      let valid = true
      if (basicInfo) {
        if (!basicInfo.patients.name) {
          valid = false
          this.$toast.fail('请填写患者姓名')
        }
        if (!basicInfo.patients.gender) {
          valid = false
          this.$toast.fail('请填写患者性别')
        }
      }
      if (valid && handOver) {
        const handOverValid = !handOver.canEdit
        if (!handOverValid) {
          valid = false
          this.$toast.fail('请先提交交接单')
        }
      }

      if (valid) {
        return true
      } else {
        return Promise.reject(new Error('校验失败,请填齐必填项'))
      }
    },
    // 更新状态
    async updateStatus() {
      // if (this.missionStatus === '05') {
      //   // 完成急救之前校验必填项
      //   const valid = await this.validate()
      //   console.log(valid)
      // }
      const nextStatusIndex = this.statusArray.indexOf(this.missionStatus) + 1
      const nextStatus = this.missionStatusList[nextStatusIndex].value
      const req = {
        missionId: this.missionId,
        patientId: this.patientInfo.patientId,
        status: nextStatus
      }
      const res = await this.$api.pmUpdateStatus(req)
      if (res.code === '000000') {
        const { body, code, message } = await this.$api.pmDetail({
          missionId: this.missionId
        })
        if (code === '000000') {
          this[types.SET_MISSIONINFO]({
            ...body?.missionsEntity
          })
          this[types.SET_MISSIONSTATUS](nextStatus)
          this.$notify({ type: 'success', message: '更新成功' })
        } else {
          this.$notify({ type: 'warning', message })
        }
      } else {
        this.$notify({ type: 'warning', message: res.message })
      }
      // 状态06:任务终止时跳转到NoTask界面
      if (this.missionStatus === '06') {
        this[types.REMOVE_PATIENTID]()
        this[types.REMOVE_RECORDID]()
        this[types.REMOVE_MISSIONID]()
        this[types.SET_CURPAGE]('notask')
        // 发送通知到急救大屏
        this.$api.pushDataToSSE({
          sseId: this.toHospitalId,
          content: 'missionChange'
        })
      }
    },
    getCodeList() {
      const res = this.getCodeListByKey([
        'PHFA_0036', // 任务模板
        'PHFA_0001', // 性别
        'PHFA_0002', // 年龄类别
        'PHFA_0011', // 疾病类别
        'PHFA_0034' // 任务状态
      ])
      this.missionTemplateList = res.PHFA_0036
      this.genderList = res.PHFA_0001
      this.ageExtendList = res.PHFA_0002
      this.diseaseCategoryList = res.PHFA_0011
      this.missionStatusList = res.PHFA_0034
      this.statusArray = res.PHFA_0034.map(item => item.value)
    },
    getCurrentStatusTime() {
      const formater = time => this.$moment(time || void 0).format('hh:mm')
      if (this.missionStatus === '01') {
        return formater(this.missionInfo.createTime)
      } else if (this.missionStatus === '02') {
        return formater(this.missionInfo.dispatchVehicleTime)
      } else if (this.missionStatus === '03') {
        return formater(this.missionInfo.arrivedSceneTime)
      } else if (this.missionStatus === '04') {
        return formater(this.missionInfo.leftSceneTime)
      } else if (['05', '06'].includes(this.missionStatus)) {
        return formater(this.missionInfo.arrivedHospitalTime)
      }
    },
    missionTemplateChange() { },
    handleAssociation() {
      console.log('click')
    }
  },
  computed: {
    canSubmit() {
      // 填写中 01
      // 已提交 02
      // 已归档 03
      return this.medicalStatus === '01'
    },
    list() {
      const arr = [
        { name: '基本信息', part: parts.BasicInfo },
        { name: '患者病史', part: parts.History },
        { name: '体格检查', part: parts.PhysicalExam },
        { name: '辅助检查', part: parts.AuxiliaryExam },
        { name: '诊断处理', part: parts.Diagnosis },
        { name: '知情同意', part: parts.InformedConsent },
        { name: '患者交接', part: parts.Handover },
        { name: '时间轴', part: parts.TimeAxis }
      ]
      if (this.$route.path === '/aid/history') {
        arr.push({ name: '地图', part: map })
      }
      return arr
    },
    historyBtnShow() {
      // 历史任务页面的按钮
      return this.$route.path === '/aid/history'
    },
    btnShow() {
      return this.missionStatus && this.missionStatus >= '06'
    },
    statusText() {
      const status = this.statusArray.indexOf(this.missionStatus)
      if (status > -1 && this.missionStatusList.length) {
        return this.missionStatusList[status]
          ? this.missionStatusList[status].label
          : ''
      }
      return ''
    },
    btnText() {
      const status = this.statusArray.indexOf(this.missionStatus) + 1
      if (status > -1 && this.missionStatusList.length) {
        return this.missionStatusList[status]
          ? this.missionStatusList[status].label
          : ''
      }
      return ''
    },
    ...mapGetters([
      'missionId',
      'missionStatus',
      'patientInfo',
      'missionInfo',
      'curpage',
      'licensePlate',
      'toHospitalId',
      'toHospitalName'
    ])
  },
  watch: {
    active(val) {
      this.$nextTick(() => {
        if (typeof this.$refs.compon[val]?.tabChange === 'function') {
          this.$refs.compon[val].tabChange()
        }
        // 提前刷新下一个页签
        if (typeof this.$refs.compon[val + 1]?.tabChange === 'function') {
          this.$refs.compon[val + 1].tabChange()
        }
      })
    },
    maskShow: {
      immediate: true,
      handler(v) {
        if (v) {
          this.$toast.loading({
            duration: 0, // 持续展示 toast
            forbidClick: true,
            message: '加载中...'
          })
        } else {
          this.$toast.clear()
        }
      }
    }
  },
  mixins: [methodMixin]
}
</script>

<style lang="less" scoped>
.emergency-task-wrapper {
  // padding-bottom: 150px;
  height: 100vh;

  .emergency-task-top {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    height: 220px;
    // padding-top: 40px;
    background: linear-gradient(45deg, #3139cb, #5563e4);
    -moz-box-shadow: 0px 3px 30px #a6a6a6;
    -webkit-box-shadow: 0px 3px 30px #a6a6a6;
    box-shadow: 0px 3px 20px #a6a6a6;

    .emergency-task-name {
      background: #fff;
      width: 95%;
      background: #ffffff;
      border-radius: 15px;
      margin: 0 auto;
      position: absolute;
      // bottom: -40px;
      left: 0;
      right: 0;
      -moz-box-shadow: 0px 3px 10px #a6a6a6;
      -webkit-box-shadow: 0px 3px 10px #a6a6a6;
      box-shadow: 0px 3px 10px #a6a6a6;
      padding: 10px 30px;
      box-sizing: border-box;

      p {
        &.spec {
          span {
            font-size: @font-md-size;
            color: #4f5e7b;
          }
        }

        span {
          font-size: @font-md-size;
          line-height: 2.2;

          &.one {
            margin-right: 16px;
          }

          &.two {
            margin-left: 20px;
            width: 360px;
            display: block;
            text-align: right;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          &.name {
            font-size: @font-lg-size;
            color: #202020;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 40%;
          }

          i.gender {
            font-size: @font-md-size;
            font-weight: 800;

            &.no:before {
              content: "";
            }

            &.iconicon1-54male {
              color: #2b65f8;
            }

            &.iconicon1-55female {
              color: #f86359;
            }
          }
        }
      }
    }

    .emergency-task-temp {
      font-size: @font-xl-size;
      color: #fff;
      padding: 1rem 35px 20px;

      /deep/ .med-select-wrapper {
        width: 220px;
        display: flex;
        align-items: center;
        justify-content: center;

        .med-select-value {
          color: #fff;
        }
      }

      /deep/ .iconicon1-141,
      .iconicon1-221,
      .iconicon1-231 {
        font-size: @font-xl-size;
        line-height: 1;
        font-weight: 100;
      }
    }
  }

  .emergency-task-main {
    padding: 300px 0 100px;
    background: #fff;

    /deep/ .van-tabs {
      .van-sticky.van-sticky--fixed {
        top: 270px;
      }

      >div {
        background: #fff;
      }

      .van-tab__text {
        font-size: @font-md-size;
        color: #aaa;
      }

      .van-tab--active {
        .van-tab__text {
          color: #202020;
        }
      }

      .van-tabs__line {
        width: 52px;
        bottom: 40px;
        z-index: 0;
      }

      .van-tabs__content {
        background: #fff;
        padding: 0 10px 0;
      }
    }
  }

  .arrive-btn {
    position: fixed;
    bottom: 150px;
    right: 20px;
    z-index: 22;
    width: 130px;
    height: 130px;
    padding: 30px;
    border-radius: 50%;
    word-break: break-all;
    background: #444fdb;
    border-color: #444fdb;
    font-size: @font-md-size;
    line-height: 1.3;
    color: #fff;
  }
}
</style>
