<template>
  <div class="content-wrapper">
    <van-form ref="firstaid">
      <van-index-bar :index-list="indexList" :sticky="false">
        <van-index-anchor
index="1"
          ><med-title
title="院前接诊"
        /></van-index-anchor>
        <admission
          :data="data.prehospital"
          :dataAdmission="data.admission"
          :dataRegist="data.regist"
          :dataMain="data.main"
          @showimport="showimport"
          :disabled="disabled"
          @change="onSave"
          @traigeAdmissionChange="onTraigeAdmissionChanged"
          @mainChange="onMainChanged"
          @onTransHospitalChanged="onTransHospitalChanged"
        />
        <van-index-anchor
index="2"
          ><med-title
title="院前体征"
        /></van-index-anchor>
        <vitalsigns
          :data="data.prehospital"
          :disabled="disabled"
          style="margin-top:4px;"
          @change="onAdmissionChanged"
        />
        <van-index-anchor
index="3"
          ><med-title
title="院前心电图"
        /></van-index-anchor>
        <ecg
        ref="ecg"
          :data="data.prehospital"
          :dataAdmission="data.admission"
          :dataEcg="data.prehospitalEcgList"
          :disabled="disabled"
          style="margin-top:4px;"
          @change="onAdmissionChanged"
          @updateReportStatus="updateReport"
          @onSaveException="onSaveException"
        />
        <van-index-anchor
index="4"
          ><med-title
title="远程会诊"
        /></van-index-anchor>
        <mdt
          :data="data.prehospital"
          :disabled="disabled"
          style="margin-top:4px;"
          @change="onAdmissionChanged"
        />
        <van-index-anchor
index="5"
          ><med-title
title="院前初步诊断"
        /></van-index-anchor>
        <diagnosis
          :data="data.prehospital"
          :disabled="disabled"
          style="margin-top:4px;"
          @change="onAdmissionChanged"
        />
        <van-index-anchor
index="6"
          ><med-title
title="双抗治疗"
        /></van-index-anchor>
        <medicine
          :data="data.prehospital"
          :disabled="disabled"
          style="margin-top:4px;"
          @change="onAdmissionChanged"
        />
        <van-index-anchor
index="7"
          ><med-title
title="院前溶栓治疗"
        /></van-index-anchor>
        <thrombolysis
          :data="data.prehospital"
          :disabled="disabled"
          style="margin-top:4px;"
          @change="onAdmissionChanged"
        />
        <van-index-anchor
          v-if="data.admission.comeType == 1 || data.admission.comeType == 2"
          index="8"
          ><med-title
title="到院交接"
        /></van-index-anchor>
        <handover
          :data="data.prehospital"
          :dataAdmission="data.admission"
          :disabled="disabled"
          style="margin-top:4px;"
          v-if="data.admission.comeType == 1 || data.admission.comeType == 2"
          @change="onAdmissionChanged"
          @onTraigeAdmissionChanged="onTraigeAdmissionChanged"
        />
      </van-index-bar>
    </van-form>
    <med-loading v-model="showLoading" />
  </div>
</template>

<script>
import admission from './admission'
import ecg from './ecg'
import vitalsigns from './vitalsigns'
import thrombolysis from './thrombolysis'
import medicine from './medicine'
import mdt from './mdt'
import diagnosis from './diagnosis'
import handover from './handover'
import { debounce } from 'lodash'
import { Dialog } from 'vant'
export default {
  name: 'Prehospital',
  components: {
    admission,
    vitalsigns,
    ecg,
    medicine,
    thrombolysis,
    mdt,
    diagnosis,
    handover
  },
  props: {
    data: {
      required: true,
      type: Object
    },
    disabled: {
      required: false,
      type: Boolean
    }
  },
  data() {
    return {
      indexList: [1, 2, 3, 4, 5, 6, 7, 8],
      active: 0,
      registId: this.$route.query.registId,
      perhospitalCheck: {
        modelName: 'perhospital',
        registId: '',
        timeStamp: null,
        hadBeenModify: null
      },
      disChargeCheck: {
        modelName: 'discharge',
        registId: '',
        timeStamp: null,
        hadBeenModify: null
      },
      showLoading: false
    }
  },
  computed: {
    // isFinish() {
    //   return this.data.main.status
    // }
  },
  created() {},
  methods: {
    async updateTimeStamp() {
      const res = await this.$api.service.updateTimeStamp(this.checkData)
      if (res.status === 200) {
        const disChargeCheck = res.result.find(
          m => m.modelName === 'discharge'
        )
        this.data.discharge.timeStamp = disChargeCheck?.timeStamp
        // const perhospitalCheck = res.result.find(
        //   m => m.modelName === 'perhospital'
        // )
        // this.data.prehospital.timeStamp = perhospitalCheck?.timeStamp
      } else {
        this.$notify({ type: 'warning', message: res.message })
      }
    },
    async checkTimeStamp() {
      this.checkData = []
      this.perhospitalCheck.registId = this.registId
      this.disChargeCheck.registId = this.registId
      this.perhospitalCheck.timeStamp = this.data.prehospital.timeStamp
      this.disChargeCheck.timeStamp = this.data.discharge.timeStamp

      this.checkData.push(this.perhospitalCheck)
      this.checkData.push(this.disChargeCheck)

      const res = await this.$api.service.checkTimeStamp(this.checkData)
      if (res.status === 200) {
        // this.checkReturnData = 'perhospital'
        const disChargeCheck = res.result.find(
          m => m.modelName === 'discharge'
        )
        if (disChargeCheck.hadBeenModify) {
          return disChargeCheck?.modelName
        }
        const perhospitalCheck = res.result.find(
          m => m.modelName === 'perhospital'
        )
        if (perhospitalCheck.hadBeenModify) {
          return perhospitalCheck.modelName
        }
        return ''
      } else {
        this.$notify({ type: 'warning', message: res.message })
      }
    },
    async onTransHospitalChanged() {
      this.showLoading = true
      const value = await this.checkTimeStamp()
      if (value === 'perhospital') {
        Dialog.alert({
          title: '提示',
          message: '院前信息已被编辑，系统将强制刷新',
          theme: 'round-button'
        }).then(() => {
          this.$emit('checkRefresh')
          this.showLoading = false
        })
      } else if (value === 'discharge') {
        this.$dialog
          .confirm({
            title: '提示',
            message: '转归信息已被编辑过，是否覆盖?',
            confirmButtonText: '是',
            cancelButtonText: '否'
          })
          .then(() => {
            this.forceAdminssionSave()
            this.updateTimeStamp()
            this.showLoading = false
          })
          .catch(() => {
            this.$emit('checkRefresh')
            this.showLoading = false
          })
      } else {
        this.adminssionSave()
        this.updateTimeStamp()
        this.showLoading = false
      }
    },
    showimport(item) {
      this.$emit('showimport', item)
    },
    save: debounce(function() {
      this.data.prehospital.registId = this.registId
      this.$api.service
        .savePhepInfo(this.data.prehospital)
        .then(res => {
          if (res.status === 200) {
            this.data.prehospital.timeStamp = res.result.timeStamp
            this.updateReportStatus()
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    saveForce: debounce(function() {
      this.data.prehospital.registId = this.registId
      this.$api.service
        .saveForcePrehospital(this.data.prehospital)
        .then(res => {
          if (res.status === 200) {
            this.data.prehospital.timeStamp = res.result.timeStamp
            this.updateReportStatus()
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    saveTriageAdmission: debounce(function() {
      this.data.admission.isEcgTransmission = this.data.prehospital.isRemotetrans
      this.data.admission.ecgTransmissionTime = this.data.prehospital.remotetransTime
      this.data.admission.ecgTransmissionType = this.data.prehospital.remotetransType
      this.data.admission.registId = this.registId
      // console.log(this.data.admission)
      this.$api.service
        .saveAdmission(this.data.admission)
        .then(res => {
          if (res.status === 200) {
            this.data.admission.timeStamp = res.result.timeStamp
            this.updateReportStatus()
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    saveMain: debounce(function() {
      this.data.main.registId = this.registId
      this.$api.service
        .saveMain(this.data.main)
        .then(res => {
          if (res.status === 200) {
            this.data.main.timeStamp = res.result.timeStamp
            this.updateReportStatus()
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    saveEcg: debounce(function() {
      var ordrNo = 0
      this.data.prehospitalEcgList.forEach(opt => {
        opt.registId = this.registId
        opt.flag = 1
        opt.orderNo = ordrNo++
      })
      // console.log(this.data.prehospitalEcgList)
      this.$api.service.saveEcg(this.data.prehospitalEcgList).then(res => {
        if (res.status === 200) {
          this.updateReportStatus()
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, 300),
    saveInspection: debounce(function() {
      if (!this.data.inspection.isCardiolohyConsultant) {
        this.data.inspection.isCardiolohyConsultant = this.data.prehospital.isCardiolohyConsultant
      }
      if (!this.data.inspection.noticeConsultantTime) {
        this.data.inspection.noticeConsultantTime = this.data.prehospital.noticeConsultantTime
      }
      if (!this.data.inspection.consultantTime) {
        this.data.inspection.consultantTime = this.data.prehospital.consultantTime
      }
      if (!this.data.inspection.isBypassEm) {
        this.data.inspection.isBypassEm = this.data.prehospital.isBypassEm
      }
      if (!this.data.inspection.isBypassCcu) {
        this.data.inspection.isBypassCcu = this.data.prehospital.isBypassCcu
      }

      if (this.data.prehospital.isCardiolohyConsultant === '1') {
        this.data.inspection.consultantType = '2'
      }
      this.data.inspection.registId = this.registId
      this.$api.service
        .saveInspection(this.data.inspection)
        .then(res => {
          if (res.status === 200) {
            this.data.inspection.timeStamp = res.result.timeStamp
            this.updateReportStatus()
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    saveForceInspection: debounce(function() {
      if (!this.data.inspection.isCardiolohyConsultant) {
        this.data.inspection.isCardiolohyConsultant = this.data.prehospital.isCardiolohyConsultant
      }
      if (!this.data.inspection.noticeConsultantTime) {
        this.data.inspection.noticeConsultantTime = this.data.prehospital.noticeConsultantTime
      }
      if (!this.data.inspection.consultantTime) {
        this.data.inspection.consultantTime = this.data.prehospital.consultantTime
      }
      if (!this.data.inspection.isBypassEm) {
        this.data.inspection.isBypassEm = this.data.prehospital.isBypassEm
      }
      if (!this.data.inspection.isBypassCcu) {
        this.data.inspection.isBypassCcu = this.data.prehospital.isBypassCcu
      }

      if (this.data.prehospital.isCardiolohyConsultant === '1') {
        this.data.inspection.consultantType = '2'
      }
      this.data.inspection.registId = this.registId
      this.$api.service
        .saveForceInspection(this.data.inspection)
        .then(res => {
          if (res.status === 200) {
            this.data.inspection.timeStamp = res.result.timeStamp
            this.updateReportStatus()
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    onTraigeAdmissionChanged() {
      this.saveTriageAdmission()
    },
    forceAdminssionSave() {
      this.saveForce()
      this.saveTriageAdmission()
      this.saveForceInspection()
    },
    adminssionSave() {
      if (this.data.prehospital.isAntiplatelet === '1') {
        this.data.treatment.isAntiplatelet = '0'
      }
      if (
        this.data.prehospital.isBypassEm === '1' &&
        this.data.prehospital.isBypassCcu === '1'
      ) {
        if (
          this.data.inspection.diagnosis === undefined ||
          this.data.inspection.diagnosis === '' ||
          this.data.inspection.diagnosis === null
        ) {
          this.data.inspection.diagnosis = this.data.prehospital.diagnosis
        }
        if (
          this.data.inspection.diagnosisTime === undefined ||
          this.data.inspection.diagnosisTime === '' ||
          this.data.inspection.diagnosisTime === null
        ) {
          this.data.inspection.diagnosisTime = this.data.prehospital.diagnosisTime
        }
      }
      this.save()
      this.saveTriageAdmission()
      this.saveInspection()
    },
    onAdmissionChanged() {
      this.adminssionSave()
    },
    onSave() {
      this.save()
    },
    onEcgChanged() {
      this.saveEcg()
    },
    onMainChanged() {
      this.saveMain()
    },
    validate() {
      return this.$refs['firstaid'].validate()
    },
    updateReportStatus() {
      this.data.regist.isReport = '0'
      this.$emit('notifyReportStatus', this.data)
    },
    updateReport(data) {
      if (data === true) {
        this.updateReportStatus()
      }
    },
    onSaveException(res) {
      this.$emit('onSaveException', res)
    }
  }
}
</script>

<style lang="less" scoped>
@import "@/views/patient/document/detail/detail.less";

.scroll-view {
  background: none !important;
}
</style>
