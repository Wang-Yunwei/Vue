<template>
  <div>
    <med-view-container
      @return="jumpToDetails"
      title="时间轴"
      :returnLabel="returnLabel"
      wide
    >
      <div class="med-card-edit-wrapper">
        <patient-info :data="patientInfo" :bindBtn="true" :viewMode="false">
        </patient-info>
        <div class="task-main">
          <Timeline :disabled="patientInfo.isLock === '1'" />
        </div>
      </div>
    </med-view-container>
  </div>
</template>

<script>
import Timeline from './Timeline'
import PatientInfo from '@/views/patient/document/detail/patientCard'

export default {
  name: 'timeline',
  components: { Timeline, PatientInfo },
  data() {
    return {
      time: 200000,
      active: 0,
      openUrl: this.$route.query.openUrl,
      registId: this.$route.query.registId,
      returnLabel: this.$route.query.openUrl === '1' ? '关闭' : '返回',
      isLock: '',
      data: {
        admission: {},
        admissionEcgList: [],
        creatinineproteinList: [],
        diagnosisTest: {},
        dischargeDrugsList: [],
        dischargeTestList: [],
        inspection: {},
        main: {},
        prehospital: {},
        rehospitalEcgList: [],
        regist: {},
        discharge: {}
      },
      countdown: {
        finallyNormallCountdown: '', // 距最后正常时间
        isCompleted: '' // 距最后正常时间
      }
    }
  },
  computed: {
    patientInfo() {
      const { data: d } = this
      if (!d) {
        return {}
      } else {
        return {
          name: d.regist.name,
          gender: d.regist.gender,
          age: d.regist.age,
          rfTagId: d.regist.rfTagId,
          comingType: d.admission.comeType,
          diagnosis: d.inspection.diagnosis,
          outpatientNo: d.main.outPatientNo,
          inpatientNo: d.main.admissionNo,
          diseaseTime: d.main.attackTime,
          isTimearea: d.main.isTimearea,
          isAttackUncertain: d.main.isAttackUncertain,
          arriveTime: d.admission.arrivedHospitalTime,
          idcardType: d.regist.idcardType,
          identificationNo: d.regist.identificationNo,
          fmcTime: d.admission.fmcTime,
          birthday: d.regist.birthday,
          prediagnosis: d.prehospital.diagnosis,
          isLock: d.isLock,
          reportNo: d.main.reportNo
        }
      }
    }
  },
  async created() {
    //    倒计时数据
    this.isLock = this.patientInfo.isLock
    this.getCountdown()
    this.getBasicInformation()
  },
  methods: {
    // 倒计时数据
    getCountdown() {
      this.$api.timeManagement.getCountdown(this.registId).then(res => {
        this.countdown = res.result
      })
    },
    jumpToDetails() {
      if (this.openUrl === '1') {
        this.$bridge.exit()
      } else {
        this.$router.push({
          path: '/index',
          query: {
            type: this.$route.query.type
          }
        })
      }
    },
    getBasicInformation() {
      this.registId = this.$route.query.registId
      this.$api.service.getFillInfoAggregate(this.registId).then(res => {
        this.$preventWatch(() => {
          this.data = res.result
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import './Timeline.less';
</style>
