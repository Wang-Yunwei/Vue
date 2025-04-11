<template>
  <med-view-container title="调阅" @return="jumpToDetails" wide>
    <template #right>
      <van-popover
        v-model="showMoreActions"
        trigger="click"
        placement="bottom-end"
        :actions="[
          {
            icon: 'notes-o',
            text: '病历'
          }
        ]"
        :offset="[18, 8]"
        @select="onSelectMoreActions"
      >
        <template #reference>
          <i class="iconfont iconicon1-151" style="font-size: 0.6rem" />
        </template>
      </van-popover>
    </template>
    <patient-card
      ref="patient"
      :data="patientInfo"
      :disabled="true"
      :bindBtn="true"
    />
    <div class="scroll-view" ref="scroll">
      <van-tabs v-model="active" sticky color="#5e74fe" :lazy-render="false">
        <van-tab
          v-for="(item, index) in tabList"
          :title="item.name"
          :key="index"
        >
          <component
            v-show="active === index"
            :is="item.part"
            :patientInfo = "patientInfo"
            @hiddenChange="hiddenChange(item.name)"
          />
        </van-tab>
      </van-tabs>
    </div>
  </med-view-container>
</template>

<script>
import PatientCard from '../patientCard.vue'
import FirstAid from '../firstAid/index.vue'
import Triage from '../triage/index.vue'
import Examination from '../examination/index.vue'
import Medication from '../medication/index.vue'
import Inspection from '../inspection/index.vue'

import { mapGetters, mapMutations } from 'vuex'
import * as types from '@/store/mutations/mutations-types'
export default {
  name: 'Detection',
  components: {
    FirstAid,
    Triage,
    Examination,
    Inspection,
    Medication,
    PatientCard
  },
  data() {
    return {
      showMoreActions: false,
      active: '',
      showLoading: false,
      data: {
        admission: {},
        admissionEcgList: [],
        creatinineproteinList: [],
        diagnosisTest: {},
        dischargeDrugsList: [],
        dischargeTestList: [],
        inspection: {},
        treatment: {},
        treatmentPci: {},
        treatmentPciPartList: {},
        main: {},
        prehospital: {},
        prehospitalEcgList: [],
        regist: {},
        grace: {},
        screenage: {},
        discharge: {
          bnp: {
            category: '',
            conclusion: '',
            id: '',
            orderNo: '',
            registId: '',
            result: '',
            type: '',
            unit: ''
          },
          hdlC: {
            category: '',
            conclusion: '',
            id: '',
            orderNo: '',
            registId: '',
            result: '',
            type: '',
            unit: ''
          },
          jtyw: {
            arrayName: [],
            code: '',
            frequency: '',
            id: '',
            name: '',
            orderNo: '',
            registId: '',
            times: '',
            unit: ''
          },
          knyw: {
            arrayName: [],
            code: '',
            frequency: '',
            id: '',
            name: '',
            orderNo: '',
            registId: '',
            times: '',
            unit: '',
            value: ''
          },
          ldlC: {
            category: '',
            conclusion: '',
            id: '',
            orderNo: '',
            registId: '',
            result: '',
            type: '',
            unit: ''
          },
          pcsk9: {
            arrayName: [],
            code: '',
            frequency: '',
            id: '',
            name: '',
            orderNo: '',
            registId: '',
            times: '',
            unit: '',
            value: ''
          },
          tc: {
            category: '',
            conclusion: '',
            id: '',
            orderNo: '',
            registId: '',
            result: '',
            type: '',
            unit: ''
          },
          tg: {
            category: '',
            conclusion: '',
            id: '',
            orderNo: '',
            registId: '',
            result: '',
            type: '',
            unit: ''
          }
        }
      },
      patientInfo: {
        name: '',
        gender: '',
        age: '',
        birthday: '',
        idcardType: '',
        identificationNo: '',
        comingType: '',
        diagnosis: '',
        outpatientNo: '',
        inpatientNo: '',
        diseaseTime: '',
        arriveTime: '',
        rfTagId: '',
        isAttackUncertain: '',
        isTimearea: '',
        status: '',
        prediagnosis: '',
        isLock: '',
        reportNo: '',
        licensePlate: ''
      },
      hiddenArray: ['3', '4', '5']
    }
  },
  computed: {
    ...mapGetters(['hospitalArea', 'curHospitalArea', 'configure']),
    tabList() {
      const comeType = this.patientInfo.comeType || this.patientInfo.comingType
      const all = [
        {
          name: '急救病历',
          part: FirstAid,
          hidden: this.hiddenArray.includes(comeType)
        },
        { name: '预检分诊', part: Triage },
        { name: '检查', part: Examination },
        { name: '检验', part: Inspection },
        { name: '用药', part: Medication }
      ]

      return all.filter(el => !el.hidden)
    }
  },
  created() {
    // 获取基本信息
    this.getBasicInformation()
  },
  methods: {
    ...mapMutations([types.SET_DOCTORS]),
    hiddenChange(tabName) {
      if (tabName && !this.hiddenTabs.includes(tabName)) {
        this.hiddenTabs.push(tabName)
      }
    },
    setPatientInfo(item) {
      this.patientInfo.name = item.regist.name
      this.patientInfo.gender = item.regist.gender
      this.patientInfo.age = item.regist.age
      this.patientInfo.birthday = item.regist.birthday
      this.patientInfo.idcardType = item.regist.idcardType
      this.patientInfo.identificationNo = item.regist.identificationNo
      this.patientInfo.comingType = item.admission.comeType
      this.patientInfo.diagnosis = item.inspection.diagnosis
      this.patientInfo.outpatientNo = item.main.outPatientNo
      this.patientInfo.inpatientNo = item.main.inpatientNo
      this.patientInfo.diseaseTime = item.main.attackTime
      this.patientInfo.arriveTime = item.admission.arrivedHospitalTime
      this.patientInfo.rfTagId = item.regist.rfTagId
      this.patientInfo.isAttackUncertain = item.main.isAttackUncertain
      this.patientInfo.isTimearea = item.main.isTimearea
      this.patientInfo.fmcTime = item.admission.fmcTime
      this.patientInfo.status = item.main.status
      this.patientInfo.prediagnosis = item.prehospital.diagnosis
      this.patientInfo.licensePlate = item.prehospital.licensePlate
      this.patientInfo.isLock = item.isLock
      this.patientInfo.reportNo = item.main.reportNo
    },
    onTabChange(name, title) {},
    beforeChange(index) {},

    getBasicInformation() {
      return new Promise((resolve, reject) => {
        this.showLoading = true
        this.registId = this.$route.query.registId
        this.$api.service
          .getFillInfoAggregate(this.registId)
          .then(res => {
            this.data = res.result
            this.setPatientInfo(this.data)
            this.showLoading = false
            resolve(res)
          })
          .catch(res => {
            this.showLoading = false
            reject(res)
          })
      })
    },
    jumpToDetails(item) {
      this.$router.go(-1)
    },
    onSelectMoreActions(e) {
      if (e.text === '病历') {
        const { registId, infoComingType, emId, regNo } = this.$route.query
        this.$router.push({
          path: '/patient/document/detail',
          query: {
            registId,
            regNo,
            infoComingType,
            emId
          }
        })
      }
    }
  },
  watch: {}
}
</script>

<style lang="less" scoped>
@import './index.less';
.button {
  font-size: 0.48rem;
  color: #fff;
  padding: 0 8px;
}

.op-container {
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f3f3f3;
  button {
    border-radius: 44px;
    flex-grow: 1;
    height: 76px;
    margin: 0px 10px;
  }

  .button--right {
    background: #5e74fe;
    color: #fff;
    border: 1px solid #5e74fe;
  }

  .button--left {
    background: #fff;
    color: #5e74fe;
    border: 1px solid #5e74fe;
  }

  button:nth-child(3) {
    margin-left: 0px;
  }
  .span {
    flex-grow: 1;
    display: flex;
    justify-content: space-between;
    .van-button {
      flex-grow: 1;
    }
  }
}
</style>
