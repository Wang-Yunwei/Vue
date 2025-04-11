<template>
  <div class="content-wrapper" ref="ContentWrapper">
    <van-form ref="detection">
      <van-index-bar :index-list="indexList" :sticky="false">
        <van-index-anchor index="1">
          <med-title
title="院内心电图"
        /></van-index-anchor>
        <ecg
          ref="ecg"
          :data="data.admission"
          :dataPreEcg="data.prehospitalEcgList"
          :dataPreHospital="data.prehospital"
          :disabled="disabled"
          @change="onEntityChanged"
          @onReloadEcg="onReloadEcg"
          @updateReportStatus="updateReport"
          @onSaveException="onSaveException"
        />
        <van-index-anchor
index="2"
          ><med-title
title="实验室检查"
        /></van-index-anchor>
        <lis
          :registId="data.regist.id"
          :data="data.inspection"
          :diagnosisTest="data.diagnosisTest"
          :tnTest="data.creatinineproteinList"
          :disabled="disabled"
          style="margin-top:4px;"
          @change="onChanged"
          @updateReportStatus="updateReport"
          @onSaveException="onSaveException"
        />
        <van-index-anchor
index="3"
          ><med-title
title="胸痛会诊"
        /></van-index-anchor>
        <cmdt
          :data="data.inspection"
          :dataAdmission="data.admission"
          :dataPreHospital="data.prehospital"
          :disabled="disabled"
          style="margin-top:4px;"
          :has-first-aid="
            data.admission.comeType === '1' || data.admission.comeType === '2'
          "
          @change="onChanged"
        />
        <van-index-anchor
index="4"
          ><med-title
:title="titleDesc"
        /></van-index-anchor>
        <diagnosis
          :data="data.inspection"
          :dataAdmission="data.admission"
          :dataPrehospital="data.prehospital"
          :disabled="disabled"
          style="margin-top:4px;"
          @change="onChanged"
          @giveUpChange="giveUpChange"
          @onDiagnosisChanged="onDiagnosisChanged"
        />
        <van-index-anchor
v-if="showPacs"
index="5"
          ><med-title
title="影像学检查"
        /></van-index-anchor>
        <pacs
          :data="data.inspection"
          v-if="showPacs"
          :dataScreenage="data.screenage"
          :disabled="disabled"
          style="margin-top:4px;"
          @change="onChanged"
        />
        <van-index-anchor
v-if="showCureAd"
index="6"
          ><med-title
title="治疗信息"
        /></van-index-anchor>
        <curead
          :data="data.inspection"
          v-if="showCureAd"
          :disabled="disabled"
          style="margin-top:4px;"
          @change="onChanged"
        />
        <van-index-anchor
v-if="showCurePe"
index="7"
          ><med-title
title="治疗信息"
        /></van-index-anchor>
        <curepe
          :data="data.inspection"
          v-if="showCurePe"
          :disabled="disabled"
          style="margin-top:4px;"
          @change="onChanged"
        />
        <van-index-anchor
v-if="showGrace"
index="8"
          ><med-title
title="Grace评估"
        /></van-index-anchor>
        <grace
          :data="data.inspection"
          :dataGrace="data.grace"
          :dataAll="data"
          v-if="showGrace"
          :disabled="disabled"
          style="margin-top:4px;"
          @change="onChanged"
        />
        <van-index-anchor
v-if="showNsteacs"
index="9"
          ><med-title
title="再次危险分层"
        /></van-index-anchor>
        <nsteacs
          :data="data.inspection"
          :dataTreatment="data.treatment"
          v-if="showNsteacs"
          :disabled="disabled"
          style="margin-top:4px;"
          @change="onChanged"
        />
      </van-index-bar>
    </van-form>
    <med-loading v-model="showLoading" />
  </div>
</template>

<script>
import lis from './lis'
import cmdt from './cmdt'
import diagnosis from './diagnosis'
import estimate from './estimate'
import pacs from './pacs'
import curead from './curead'
import curepe from './curepe'
import nsteacs from './nsteacs'
import grace from './grace'
import { debounce } from 'lodash'
import ecg from './ecg'
import { Dialog } from 'vant'

export default {
  name: 'Detection',
  components: {
    lis,
    cmdt,
    diagnosis,
    estimate,
    pacs,
    curead,
    curepe,
    nsteacs,
    grace,
    ecg
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
      indexList: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      active: 0,
      registId: this.$route.query.registId,
      inspectionCheck: {
        modelName: 'inspection',
        registId: '',
        timeStamp: null,
        hadBeenModify: null
      },
      treatmentCheck: {
        modelName: 'treatment',
        registId: '',
        timeStamp: null,
        hadBeenModify: null
      },
      dischargeCheck: {
        modelName: 'discharge',
        registId: '',
        timeStamp: null,
        hadBeenModify: null
      },
      showLoading: false
    }
  },
  computed: {
    titleDesc() {
      if (
        this.data.prehospital.isBypassEm === '1' &&
        this.data.prehospital.isBypassCcu === '1'
      ) {
        return '初步诊断'
      } else {
        return '院内初步诊断'
      }
    },
    detection() {
      return this.data.inspection
    },
    showPacs() {
      return (
        this.data.inspection.diagnosis === '4' ||
        this.data.inspection.diagnosis === '5'
      )
    },
    showCureAd() {
      return this.data.inspection.diagnosis === '4'
    },
    showCurePe() {
      return this.data.inspection.diagnosis === '5'
    },
    showNsteacs() {
      return (
        this.data.inspection.diagnosis === '2' ||
        this.data.inspection.diagnosis === '3'
      )
    },
    showGrace() {
      return (
        this.data.inspection.diagnosis === '2' ||
        this.data.inspection.diagnosis === '3'
      )
    }
  },
  created() {},
  methods: {
    async updateTimeStamp() {
      const res = await this.$api.service.updateTimeStamp(this.checkData)
      if (res.status === 200) {
        const treatmentCheck = res.result.find(m => m.modelName === 'treatment')
        this.data.treatment.timeStamp = treatmentCheck.timeStamp

        // const inspectionCheck = res.result.find(
        //   m => m.modelName === 'inspection'
        // )
        // this.data.inspection.timeStamp = inspectionCheck.timeStamp
        const dischargeCheck = res.result.find(m => m.modelName === 'discharge')
        this.data.discharge.timeStamp = dischargeCheck.timeStamp
      } else {
        this.$notify({ type: 'warning', message: res.message })
      }
    },
    async checkTimeStamp() {
      this.checkData = []
      this.inspectionCheck.registId = this.registId
      this.treatmentCheck.registId = this.registId
      this.dischargeCheck.registId = this.registId
      this.inspectionCheck.timeStamp = this.data.inspection.timeStamp
      this.treatmentCheck.timeStamp = this.data.treatment.timeStamp
      this.dischargeCheck.timeStamp = this.data.discharge.timeStamp

      this.checkData.push(this.inspectionCheck)
      this.checkData.push(this.treatmentCheck)
      this.checkData.push(this.dischargeCheck)

      const res = await this.$api.service.checkTimeStamp(this.checkData)
      if (res.status === 200) {
        // this.checkReturnData = 'perhospital'
        const treatmentCheck = res.result.find(m => m.modelName === 'treatment')
        if (treatmentCheck.hadBeenModify) {
          return treatmentCheck?.modelName
        }
        const inspectionCheck = res.result.find(
          m => m.modelName === 'inspection'
        )
        if (inspectionCheck.hadBeenModify) {
          return inspectionCheck.modelName
        }
        const dischargeCheck = res.result.find(m => m.modelName === 'discharge')
        if (dischargeCheck.hadBeenModify) {
          return dischargeCheck.modelName
        }
        return ''
      } else {
        this.$notify({ type: 'warning', message: res.message })
      }
    },
    async onDiagnosisChanged() {
      this.showLoading = true
      if (
        this.data.prehospital.diagnosis !== null &&
        this.data.prehospital.diagnosis !== '' &&
        (this.data.admission.comeType === '1' ||
          this.data.admission.comeType === '2') &&
        this.data.prehospital.isBypassCcu === '1' &&
        this.data.prehospital.isBypassEm === '1'
      ) {
        if (this.data.diagnosis !== this.data.prehospital.diagnosis) {
          this.$notify({ type: 'warning', message: '院前已填诊断' })
        }
      }
      const value = await this.checkTimeStamp()

      if (value === 'inspection') {
        Dialog.alert({
          title: '提示',
          message: '检查检测信息已被编辑，系统将强制刷新',
          theme: 'round-button'
        }).then(() => {
          this.$emit('checkRefresh')
          this.showLoading = false
        })
      } else if (value === 'treatment') {
        this.$dialog
          .confirm({
            title: '提示',
            message: '院内治疗信息已被编辑过，是否覆盖?',
            confirmButtonText: '是',
            cancelButtonText: '否'
          })
          .then(() => {
            this.saveForceInspection()
            this.updateTimeStamp()
            this.showLoading = false
          })
          .catch(() => {
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
            this.saveForceInspection()
            this.updateTimeStamp()
            this.showLoading = false
          })
          .catch(() => {
            this.$emit('checkRefresh')
            this.showLoading = false
          })
      } else {
        this.save()
        this.$emit('refreshDiagnosisData', this.data.inspection.diagnosis)
        this.showLoading = false
      }
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
    save: debounce(function() {
      this.data.inspection.registId = this.registId
      this.$api.service
        .saveInspection(this.data.inspection)
        .then(res => {
          if (res.status === 200) {
            this.data.inspection.timeStamp = res.result.timeStamp
            this.updateReportStatus()
            // this.$notify({ type: 'success', message: '保存成功' })
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    saveForceInspection: debounce(function() {
      this.data.inspection.registId = this.registId
      this.$api.service
        .saveForceInspection(this.data.inspection)
        .then(res => {
          if (res.status === 200) {
            this.data.inspection.timeStamp = res.result.timeStamp
            this.updateReportStatus()
            // this.$notify({ type: 'success', message: '保存成功' })
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    saveCrDiagnosisTest: debounce(function() {
      this.data.diagnosisTest.cr.registId = this.registId
      this.data.diagnosisTest.cr.checkType = '1'
      this.data.diagnosisTest.cr.orderNo = 1
      this.data.diagnosisTest.cr.timeStamp = this.data.inspection.timeStamp
      this.$api.service
        .saveDiagnosisTest(this.data.diagnosisTest.cr)
        .then(res => {
          if (res.status === 200) {
            this.data.inspection.timeStamp = res.result.timeStamp
            this.updateReportStatus()
            // this.$notify({ type: 'success', message: '保存成功' })
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    saveDdimerDiagnosisTest: debounce(function() {
      this.data.diagnosisTest.ddimer.registId = this.registId
      this.data.diagnosisTest.ddimer.checkType = '2'
      this.data.diagnosisTest.ddimer.orderNo = 2
      this.data.diagnosisTest.ddimer.timeStamp = this.data.inspection.timeStamp
      this.$api.service
        .saveDiagnosisTest(this.data.diagnosisTest.ddimer)
        .then(res => {
          if (res.status === 200) {
            this.data.inspection.timeStamp = res.result.timeStamp
            this.updateReportStatus()
            // this.$notify({ type: 'success', message: '保存成功' })
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    saveBnpDiagnosisTest: debounce(function() {
      this.data.diagnosisTest.bnp.registId = this.registId
      this.data.diagnosisTest.bnp.checkType = '3'
      this.data.diagnosisTest.bnp.orderNo = 3
      this.data.diagnosisTest.bnp.timeStamp = this.data.inspection.timeStamp
      this.$api.service
        .saveDiagnosisTest(this.data.diagnosisTest.bnp)
        .then(res => {
          if (res.status === 200) {
            this.data.inspection.timeStamp = res.result.timeStamp
            this.updateReportStatus()
            // this.$notify({ type: 'success', message: '保存成功' })
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    saveNTproBNPDiagnosisTest: debounce(function() {
      this.data.diagnosisTest.nTproBNP.registId = this.registId
      this.data.diagnosisTest.nTproBNP.checkType = '4'
      this.data.diagnosisTest.nTproBNP.orderNo = 4
      this.data.diagnosisTest.nTproBNP.timeStamp = this.data.inspection.timeStamp
      this.$api.service
        .saveDiagnosisTest(this.data.diagnosisTest.nTproBNP)
        .then(res => {
          if (res.status === 200) {
            this.data.inspection.timeStamp = res.result.timeStamp
            this.updateReportStatus()
            // this.$notify({ type: 'success', message: '保存成功' })
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    saveMyoDiagnosisTest: debounce(function() {
      // console.log(this.data.diagnosisTest)
      this.data.diagnosisTest.myo.registId = this.registId
      this.data.diagnosisTest.myo.checkType = '5'
      this.data.diagnosisTest.myo.orderNo = 5
      this.data.diagnosisTest.myo.timeStamp = this.data.inspection.timeStamp
      this.$api.service
        .saveDiagnosisTest(this.data.diagnosisTest.myo)
        .then(res => {
          if (res.status === 200) {
            this.data.inspection.timeStamp = res.result.timeStamp
            this.updateReportStatus()
            // this.$notify({ type: 'success', message: '保存成功' })
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    saveCkmbDiagnosisTest: debounce(function() {
      // console.log(this.data.diagnosisTest)
      this.data.diagnosisTest.ckmb.registId = this.registId
      this.data.diagnosisTest.ckmb.checkType = '6'
      this.data.diagnosisTest.ckmb.orderNo = 6
      this.data.diagnosisTest.ckmb.timeStamp = this.data.inspection.timeStamp
      this.$api.service
        .saveDiagnosisTest(this.data.diagnosisTest.ckmb)
        .then(res => {
          if (res.status === 200) {
            this.data.inspection.timeStamp = res.result.timeStamp
            this.updateReportStatus()
            //  this.$notify({ type: 'success', message: '保存成功' })
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    saveCt: debounce(function() {
      console.log(this.data.screenage.ect)
      this.data.screenage.ect.registId = this.registId
      this.data.screenage.ect.checkType = '1'
      this.data.screenage.ect.orderNo = 1
      this.$api.service
        .saveScreenage(this.data.screenage.ect)
        .then(res => {
          if (res.status === 200) {
            this.updateReportStatus()
            // this.$notify({ type: 'success', message: '保存成功' })
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    saveCdu: debounce(function() {
      this.data.screenage.cdu.registId = this.registId
      this.data.screenage.cdu.checkType = '2'
      this.data.screenage.cdu.orderNo = 2
      this.$api.service
        .saveScreenage(this.data.screenage.cdu)
        .then(res => {
          if (res.status === 200) {
            this.updateReportStatus()
            // this.$notify({ type: 'success', message: '保存成功' })
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    saveTreatment: debounce(function() {
      this.data.treatment.registId = this.registId
      this.$api.service
        .saveTreatment(this.data.treatment)
        .then(res => {
          if (res.status === 200) {
            this.data.treatment.timeStamp = res.result.timeStamp
            this.updateReportStatus()
            // this.$notify({ type: 'success', message: '保存成功' })
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    saveForceTreatment: debounce(function() {
      this.data.treatment.registId = this.registId
      this.$api.service
        .saveForceTreatment(this.data.treatment)
        .then(res => {
          if (res.status === 200) {
            this.updateReportStatus()
            // this.data.treatment.timeStamp = res.result.timeStamp
            // this.$notify({ type: 'success', message: '保存成功' })
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    saveAdmission: debounce(function() {
      this.data.admission.registId = this.registId
      // console.log(this.data.admission)
      this.$api.service
        .saveAdmission(this.data.admission)
        .then(res => {
          if (res.status === 200) {
            // this.$notify({ type: 'success', message: '保存成功' })
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
    // saveEcg() {
    //   var ordrNo = 0
    //   this.data.admissionEcgList.forEach(opt => {
    //     opt.registId = this.registId
    //     opt.flag = 2
    //     opt.orderNo = ordrNo++
    //   })
    //   this.$api.service.saveEcg(this.data.admissionEcgList).then(res => {
    //     if (res.status === 200) {
    //       // this.$notify({ type: 'success', message: '保存成功' })
    //       this.data.regist.isReport = '0'
    //       this.$emit('notifyReportStatus', this.data)
    //     } else {
    //       this.$notify({ type: 'warning', message: res.message })
    //     }
    //   })
    // },
    onEntityChanged(type) {
      if (type === '1') {
        this.saveAdmission()
      } else if (type === '2') {
        // this.saveMain()
      }
    },
    onReloadEcg(ecgs) {
      this.data.admissionEcgList = ecgs
    },
    async giveUpChange() {
      const value = await this.checkTimeStamp()
      if (value === 'inspection') {
        Dialog.alert({
          title: '提示',
          message: '检查检测信息已被编辑，系统将强制刷新',
          theme: 'round-button'
        }).then(() => {
          this.$emit('checkRefresh')
        })
      } else if (value === 'treatment') {
        this.$dialog
          .confirm({
            title: '提示',
            message: '院内治疗信息已被编辑过，是否覆盖?',
            confirmButtonText: '是',
            cancelButtonText: '否'
          })
          .then(() => {
            this.saveForceInspection()
            this.updateTimeStamp()
          })
          .catch(() => {
            this.$emit('checkRefresh')
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
            this.saveForceInspection()
            this.updateTimeStamp()
          })
          .catch(() => {
            this.$emit('checkRefresh')
          })
      } else {
        this.save()
      }
    },
    onChanged(type) {
      if (type === 'inspection') {
        this.save()
      } else if (type === 'cr') {
        this.saveCrDiagnosisTest()
      } else if (type === 'ddimer') {
        this.saveDdimerDiagnosisTest()
      } else if (type === 'bnp') {
        this.saveBnpDiagnosisTest()
      } else if (type === 'proBnp') {
        this.saveNTproBNPDiagnosisTest()
      } else if (type === 'myo') {
        this.saveMyoDiagnosisTest()
      } else if (type === 'ckmb') {
        this.saveCkmbDiagnosisTest()
      } else if (type === 'ect') {
        this.saveCt()
      } else if (type === 'cdu') {
        this.saveCdu()
      } else if (type === 'treatment') {
        this.saveTreatment()
      } else {
      }
    },
    validate() {
      return this.$refs['detection'].validate()
    },
    onSaveException(res) {
      this.$emit('onSaveException', res)
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/views/patient/document/detail/detail.less';
</style>
