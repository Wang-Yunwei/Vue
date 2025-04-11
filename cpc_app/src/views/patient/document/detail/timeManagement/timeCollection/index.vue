<template>
  <div>
    <med-view-container
      @return="backClick"
      title="时间采集"
      :returnLabel="returnLabel"
      wide
    >
      <template #right-part>
        <div @click.stop>
          <i class="iconfont iconicon1-13" v-if="showScan" @click="scan" />
        </div>
      </template>
      <div class="med-card-edit-wrapper">
        <patient-info :data="patientInfo" :bindBtn="true" :viewMode="false">
        </patient-info>

        <div class="scroll-view">
          <van-tabs v-model="active" sticky color="#5e74fe" swipeable>
            <van-tab
              title="院前"
              name="preHospital"
              v-if="
                (data.admission.comeType == 1 ||
                  data.admission.comeType == 2) &&
                  _resources.mrFirstAid()
              "
            >
              <preHospital
                ref="preHospital"
                :disabled="isReadonly"
              ></preHospital>
            </van-tab>
            <van-tab
              title="分检诊"
              name="diagnosis"
              v-if="_resources.mrTriage() || _resources.mrInspection()"
            >
              <diagnosis ref="diagnosis" :disabled="isReadonly"> </diagnosis>
            </van-tab>
            <van-tab
              title="诊疗"
              name="thrombolysis"
              v-if="_resources.mrCure()"
            >
              <thrombolysis ref="thrombolysis" :disabled="isReadonly">
              </thrombolysis>
            </van-tab>
            <van-tab title="介入" name="fill" v-if="_resources.mrPci()">
              <intervention ref="intervention" :disabled="isReadonly">
              </intervention>
            </van-tab>
            <van-empty
              :image="require('@assets/image/empty.png')"
              description="未授权或暂无填写数据"
            />
          </van-tabs>
        </div>
      </div>
    </med-view-container>
  </div>
</template>

<script>
import PatientInfo from '@/views/patient/document/detail/patientCard'

import diagnosis from '../timeCollection/parts/Diagnosis/index.vue'
import intervention from '../timeCollection/parts/Intervention/index.vue'
import preHospital from '../timeCollection/parts/PreHospital/index.vue'
import thrombolysis from '../timeCollection/parts/Thrombolysis/index.vue'

export default {
  name: 'timeCollection',
  components: {
    PatientInfo,
    diagnosis,
    intervention,
    preHospital,
    thrombolysis
  },
  data() {
    return {
      returnLabel: this.$route.query.openUrl === '1' ? '关闭' : '返回',
      active: 0,
      registId: this.$route.query.registId,
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
      // tabList: [
      //   { name: '院前', part: parts.PreHospital },
      //   { name: '分检诊', part: parts.Diagnosis },
      //   { name: '诊疗', part: parts.Thrombolysis },
      //   { name: '介入', part: parts.Intervention }
      // ]
    }
  },
  computed: {
    patientInfo() {
      const { data: d } = this
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
        fmcTime: d.admission.fmcTime,
        identificationNo: d.regist.identificationNo,
        prediagnosis: d.prehospital.diagnosis,
        isLock: d.isLock,
        reportNo: d.main.reportNo
      }
    },
    isReadonly() {
      return (
        this.data.isLock === '1' ||
        this.data.main.status === '21' ||
        this.data.main.status === '31' ||
        this.data.main.status === '41'
      )
    },
    showScan() {
      if (!this.data || !this.data.regist) return false
      if (this.isReadonly) return false
      return true
    }
  },
  created() {
    //    倒计时数据
    this.getCountdown()
    this.getBasicInformation()
  },
  methods: {
    backClick() {
      this.$router.push({
        path: '/index',
        query: {
          type: this.$route.query.type
        }
      })
    },
    getCountdown() {
      this.$api.timeManagement.getCountdown(this.registId).then(res => {
        // console.log('倒计时返回', res.result)

        this.countdown = res.result
        // this.dataSource = res.result.timeline
        // ('倒计时返回结果', this.countdown)
      })
    },
    getBasicInformation() {
      this.registId = this.$route.query.registId
      this.$api.service.getFillInfoAggregate(this.registId).then(res => {
        this.$preventWatch(() => {
          this.data = res.result
        })
      })
    },
    /**
     * 扫码
     */
    scan() {
      this.$bridge.callhandler('scanner', {}, data => {
        //
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import './index.less';
/deep/ .van-tabs {
  .van-tabs__content {
    height: calc(100vh - 494px);
    overflow-y: auto;
  }
}

.scroll-view{
  /deep/.van-tab__pane + .van-empty{
    display: none;
  }
}
</style>
