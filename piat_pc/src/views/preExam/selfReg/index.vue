<template>
  <a-spin :spinning="loading">
    <div class="pre-exam-wrapper">
      <med-sub-menu current="selfReg" />
      <a-row :gutter="10">
        <a-col :xl="17" :lg="16" :md="24" :sm="24" :xs="24">
          <basic ref="basic" :regId="regId" :detailInfo="detailInfo"></basic>
          <datas ref="datas" :regId="regId" :detailInfo="detailInfo"></datas>
          <score ref="scores" :regId="regId" :detailInfo="detailInfo"></score>
        </a-col>
        <a-col :xl="7" :lg="8" :md="24" :sm="24" :xs="24">
          <knowledge ref="knowledge" :regId="regId" :detailInfo="detailInfo"></knowledge>
        </a-col>
        <a-col :xl="7" :lg="8" :md="24" :sm="24" :xs="24"></a-col>
        <a-col :xl="7" :lg="8" :md="24" :sm="24" :xs="24"></a-col>
      </a-row>
      <a-row :gutter="10">
        <a-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
          <grade ref="grade" :regId="regId" :detailInfo="detailInfo"></grade>
        </a-col>
        <a-col :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
          <whereabouts
            ref="whereabouts"
            @submit="handleSubmitAll"
            :submitting="submitting"
            :regId="regId"
            :detailInfo="detailInfo"
          ></whereabouts>
        </a-col>
        <a-col
          :xl="24"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24"
          class="pre-exam-footer">
          <div class="pre-exam-basic-card-btn flex-c-b">
            <div class="pre-exam-basic-card-btn-left flex-c-c">
              <p class="flex-c-c">
                <a-space>
                  <med-button shape="round" @click="clearPage">清屏</med-button>
                  <wrist-band
                    v-if="detailInfo.regId"
                    :rowData="detailInfo"
                  ><med-button shape="round">绑定腕带</med-button></wrist-band
                  >
                  <print-btn
                    v-if="detailInfo.regId"
                    modal-title="打印腕带"
                    :patientInfo="detailInfo"
                    :tabMode="false"
                    :width="500"
                    :height="310"
                    :source="getWristBandSrc"
                  >
                    <med-button shape="round">打印腕带</med-button></print-btn
                  >
                  <print-btn
                    v-if="detailInfo.regId"
                    modal-title="打印分诊凭条"
                    :patientInfo="detailInfo"
                    :tabMode="false"
                    :width="410"
                    :height="626"
                    :source="getTickertapeSrc"
                  >
                    <med-button shape="round">打印分诊凭条</med-button>
                  </print-btn>
                </a-space>
              </p>
            </div>
            <!--            <div class="pre-exam-basic-card-btn-right flex-c-c" @click="SecondaryTriage" style="color: red;">
              <a-icon type="exclamation-circle" />
              二次评估: 当前超时候诊患者{{ this.countl }}人
            </div>-->
            <indexl ref="indexl"></indexl>
          </div>
        </a-col>
      </a-row>
    </div>
    <change-level-modal ref="changeLevelModal" :regId="regId" />
  </a-spin>
</template>

<script>
import moment from 'moment'
import { mapState, mapMutations, mapGetters } from 'vuex'
import { PrintBtn } from '@/components'
import MedSubMenu from './../components/medSubMenu.vue'
import WristBand from '@/views/triageList/wristBand'
import { Basic, Datas, Grade, Knowledge, Score, Whereabouts, ChangeLevelModal } from './components'
import indexl from '../secondaryDiagnosis'
import { queryByCodeList } from '@/api' // 接口
import {
  getFlowingWaterId,
  regSaveOrUpdate,
  regDetails,
  getTickertapePdfUrl,
  getWristbandPdfUrl
} from '@/api/preExam/basic' // 接口
import sharedData from './sharedData'

const preSetData = () => {
  return {
    createId: '', // 创建人
    createTime: '', // 创建时间
    tagNo: '', // 腕带编号
    nurseId: '', // 分诊护士
    // 基本信息
    regId: '', // 急诊编号
    patientId: '', // 病历号/患者档案号
    isNoname: '', // 是否三无人员
    name: '', // 姓名
    gender: '', // 性别
    nation: '', // 民族
    tel: '', // 联系电话
    idcardType: '', // 证件类型
    identificationCard: '', // 证件号
    birthday: '', // 出生日期
    regAge: undefined, // 就诊时年龄
    triageTime: '', // 分诊时间
    job: '', // 职业
    address: '', // 住址
    describe: '', // 备注
    channel: '', // 绿色通道
    other: '', // 其他
    arriveType: '', // 来院方式
    subjective: '', // 患者主诉
    knowledgeId: '', // 分诊依据ID
    secondSubjective: '', // 第二主诉
    phepPid: '', //急救ID
    hospitalArer: '', //院区
    // 生命体征,到院信息,流行病学史
    datas: {
      // 生命体征
      vitalSigns: {
        sourceDevice: '', // 采集设备
        acqTime: '', // 采集时间
        area: '', // 采集区域
        haslife: '', // 是否有生命迹象(0:否,1:是,2:拒绝TPRBP)
        temperature: undefined, // 体温
        plus: undefined, // 脉搏(次/分钟)
        breath: undefined, // 呼吸(次/分钟)
        dbp: undefined, // 舒张压(mmhg)
        sbp: undefined, // 收缩压(mmhg)
        spo: undefined, // SPO₂ (%)
        mind: '' // 意识
      },
      // 到院信息
      arriveInfo: {
        acceptTime: '', // 急救呼叫时间/120接诊时间
        acceptAddress: '', // 120接诊地址
        diseaseTime: '', // 发病时间
        plateNumber: '', // 车牌号
        arriveTime: '', // 到院时间
        checkDoctorId: '', // 接诊医生Id
        checkDoctorName: '', // 接诊医生姓名
        checkDoctorTel: '', // 接诊医生电话
        address: '', // 发病地址/发现地址
        arrivewithName: '', // 陪送/110/120/相关人员姓名
        arrivewithTel: '', // 陪送/110/120/相关人员电话
        policeStation: '' // 派出所
      },
      // 流行病学史登记
      infectHistory: {
        infectMsg: '', // 是否有流行病病史
        feverTime: '', // 发热时间
        epidemicArea: '', // 疫区旅游史
        isFever: '', // 24小时体温超过38度
        isHvaeFeverHistory: '', // 入院前三天有发热学史
        diseaseTouch: '' // 死亡或者动物接触史
      }
    },
    // 评分
    scores: [],
    // 分级
    grade: {
      syslevel: '', // 系统分级
      resetLevel: '' // 护士分诊的级别
    },
    // 患者去向
    whereabouts: {
      turnResult: '', // 去向
      departmentId: '', // 就诊科室
      checkDoctorId: '' // 就诊医生
    }
  }
}

const mountQueue = []

export default {
  name: 'PreExam',
  components: {
    Basic,
    Datas,
    Grade,
    Knowledge,
    Score,
    WristBand,
    Whereabouts,
    MedSubMenu,
    indexl,
    ChangeLevelModal,
    PrintBtn
  },
  data() {
    return {
      sharedData,
      loading: false,
      submitting: false,
      countl: '',
      timer: '',
      detailInfo: {},
      oldDetailInfo: {},
      reasons: '',
      remark: ''
    }
  },
  computed: {
    ...mapState({
      scoreInfo: state => state.preExamScore.scoreInfo,
      msgInfo: state => state.preExamMsg.msgInfo
    }),
    ...mapGetters(['hospitalId'])
  },
  // 钩子方法调用定时任务
  async created() {
    this.regId = this.$route.query.regId || ''
    if (this.regId) {
      this.regDetails()
    } else {
      this.sharedData.ready = true
    }

    // 下拉框绑定由接口获取的选项值
    /*   const genderList = await this.timerl()
    const obj = {
      gender: genderList
    }*/
    /* this.QueryPatient()*/
  },
  mounted() {
    if (this.regId) {
      this.regDetails()
    } else {
      this.SET_SCORE_MAN({})
      this.SET_SCORE_INFO([])
    }

    do {
      const func = mountQueue.shift()
      if (func) func()
    } while (mountQueue?.length)
  },
  methods: {
    ...mapMutations(['SET_SCORE_INFO', 'SET_SCORE_MAN', 'SET_MSG_INFO']),
    waitMounted(func) {
      mountQueue.push(func)
    },
    parseMsgInfo(msg) {
      const { age, name, gender, cardType, cardNo, birthday, toHospital, missionId } = msg
      const basic = {
        age,
        name,
        gender,
        idcardType: cardType,
        identificationCard: cardNo,
        birthday,
        phepPid: missionId,
        hospitalArer: toHospital
      }
      if (this.$refs.basic) {
        this.$refs.basic.form = { ...this.$refs.basic.form, ...basic }
      } else {
        this.waitMounted(() => {
          this.$refs.basic.form = { ...this.$refs.basic.form, ...basic }
        })
      }
    },
    // 打印凭条
    async getTickertapeSrc(patientInfo) {
      let src = ''
      const { regId } = patientInfo
      const res = await getTickertapePdfUrl({ regId, hospitalId: this.hospitalId })
      if (res) {
        const blob = new Blob([res], { type: 'application/pdf;chartset=UTF-8' })
        src = URL.createObjectURL(blob)
      }
      return src
    },
    // 打印腕带
    async getWristBandSrc(patientInfo) {
      let src = ''
      const { regId } = patientInfo
      const res = await getWristbandPdfUrl({ regId, hospitalId: this.hospitalId })
      if (res) {
        const blob = new Blob([res], { type: 'application/pdf;chartset=UTF-8' })
        src = URL.createObjectURL(blob)
      }
      return src
    },
    // 获取字典数据
    async getDictionaryData() {
      const params = {
        codeList: [
          'lowerRightCorner' //个人登记页右下角菜单按钮
        ],
        hospitalId: this.hospitalId
      }
      const res = await queryByCodeList(params)
      const { lowerRightCorner } = res.result || {}
      this.optionList = lowerRightCorner
    },
    async regDetails() {
      this.loading = true
      let err = null
      let res = null
      try {
        res = await regDetails(this.regId)
      } catch (e) {
        console.log(typeof e)
        err = e
      }
      this.loading = false
      if (!err) {
        // 后端返回的评分结构和前端送出的不一致,这里转一下
        const conventedScores = (res.body.scores || []).map(item => ({
          ...item,
          details: item.details.map(d => JSON.parse(d.content))
        }))
        res.body.scores = conventedScores

        this.detailInfo = res.body
        this.SET_SCORE_INFO(res.body.scores || [])
        this.oldDetailInfo = JSON.parse(JSON.stringify(res.body))
      }
    },
    // 跳转二次分诊页面
    SecondaryTriage() {
      this.$router.push({
        path: '/preExam/secondaryDiagnosis'
      })
    },
    // 清屏
    clearPage() {
      this.SET_SCORE_MAN({})
      this.SET_SCORE_INFO([])
      this.$router.replace('/')
      this.$reload()
    },
    // 收集各卡片表单数据并提交
    async handleSubmitAll() {
      let payload = {
        ...preSetData()
      }
      console.log(payload.scores)

      const refKeys = ['basic', 'datas', 'scores', 'grade', 'whereabouts', 'knowledge']
      const promises = refKeys.map(async key => {
        let result = null
        if (this.$refs[key]?.formSubmit) {
          result = await this.$refs[key].formSubmit()
        }
        if (['basic', 'knowledge'].includes(key)) {
          return result
        }
        return { [key]: result }
      })
      const values = await Promise.all(promises)
      values.forEach(valObj => {
        payload = { ...payload, ...valObj }
      })

      console.log(payload.scores)

      payload.datas.vitalSigns.acqTime = moment().format('YYYY-MM-DDTHH:mm:ss[Z]')

      //获取流水号
      if (this.regId) {
        payload.regId = this.regId

        const { grade = {}, subjective = '', whereabouts = {} } = this.oldDetailInfo

        // 判断是否修改过分级
        const levelChanged = parseInt(grade.resetLevel) !== parseInt(payload.grade.resetLevel)

        // 判断是否修改过主诉
        const subjectiveChanged = subjective !== payload.subjective

        // 判断是否修改过患者去向
        const whereaboutsChanged = whereabouts.departmentId !== payload.whereabouts.departmentId

        // 判断是否修改过就诊科室
        const departmentChanged = whereabouts.turnResult !== payload.whereabouts.turnResult

        const shouldShowModal =
          (levelChanged || subjectiveChanged || whereaboutsChanged || departmentChanged) && this.$refs.changeLevelModal

        if (shouldShowModal) {
          // 修改过分级要先填写理由
          await this.$refs.changeLevelModal.showModal()
        }
      } else {
        const { body: regId } = await getFlowingWaterId()
        payload.regId = regId
      }

      this.submitting = true

      // 拼好数据送出
      let res = {}
      let err = null
      try {
        res = await regSaveOrUpdate(payload)
      } catch (error) {
        err = error
      }
      this.submitting = false

      if (res.body) {
        this.$success({
          title: '分诊成功！',
          content: '已成功分诊'
        })

        this.$router.replace({
          path: '/preExam/selfReg',
          query: {
            regId: payload.regId
          }
        })

        this.$nextTick(() => {
          this.regId = payload.regId
          this.regDetails()
        })
      } else {
        this.$error({
          title: '分诊出错！',
          content: res.message || err
        })
      }
    },
    beforeDestroy() {
      clearInterval(this.timer)
    }
  },
  watch: {
    msgInfo: {
      handler(val) {
        if (!val || !Object.keys(val)?.length) {
          return
        }
        this.parseMsgInfo(val)
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.pre-exam-wrapper {
  .med-s-card-wrapper {
    margin-bottom: 10px;
  }
}
.pre-exam-footer {
  width: calc(100% + 10px);
  padding: 0 !important;
  margin: 0 -5px -10px;
}

.pre-exam-basic-card-btn {
  background-color: #fff;
  padding: 8px 20px;

  p.flex-c-c {
    margin: 0;
  }
}
</style>
