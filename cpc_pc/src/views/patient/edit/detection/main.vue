<template>
  <div class="content-wrapper">
    <el-form
      ref="detectionform"
      :model="data"
      label-width="80px"
      label-position="top"
    >
      <div>
        <ecg
          :data="data.admission"
          :data-ecg="data.admissionEcgList"
          :disabled="disabled"
          @ecgchanged="ecgchanged"
        />
        <lis
          v-if="data.inspection && data.diagnosisTest"
          :regist-id="data.regist.id"
          :data="data.inspection"
          :diagnosis-test="data.diagnosisTest"
          :tn-test="data.creatinineproteinList"
          :disabled="disabled"
          @change="onChanged"
        />
        <cmdt
          :data="data.inspection"
          :disabled="disabled"
          @change="onChanged"
        />
        <diagnosis
          :data="data.inspection"
          :disabled="disabled"
          @change="onChanged"
        />
        <pacs
          v-if="showPacs"
          :data="data.inspection"
          :data-screenage="data.screenage"
          :disabled="disabled"
          @change="onChanged"
        />
        <curead
          v-if="showCureAd"
          :data="data.inspection"
          :disabled="disabled"
          @change="onChanged"
        />
        <curepe
          v-if="showCurePe"
          :data="data.inspection"
          :disabled="disabled"
          @change="onChanged"
        />
        <grace
          v-if="showGrace"
          :data="data.inspection"
          :data-grace="data.grace"
          :patient-info="data"
          :disabled="disabled"
          @change="onChanged"
        />
        <nsteacs
          v-if="showNsteacs"
          :data="data.inspection"
          :data-treatment="data.treatment"
          :disabled="disabled"
          @change="onChanged"
        />
        <!--
    <estimate />
    -->
      </div>
    </el-form>
  </div>
</template>

<script>
import lis from './lis'
import cmdt from './cmdt'
import diagnosis from './diagnosis'
import pacs from './pacs'
import curead from './curead'
import curepe from './curepe'
import nsteacs from './nsteacs'
import grace from './grace'
import ecg from './ecg'
import { debounce } from 'lodash'

export default {
  name: 'Detection',
  components: {
    lis,
    cmdt,
    diagnosis,
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
      active: 0
    }
  },
  computed: {
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
  methods: {
    save: debounce(function() {
      this.data.inspection.registId = this.$route.query.registId
      this.$api.service.saveInspection(this.data.inspection).then((res) => {
        if (res.status === 200) {
          // this.$notify({ type: 'success', message: '保存成功' })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, 300),
    saveCrDiagnosisTest: debounce(function() {
      this.data.diagnosisTest.cr.registId = this.$route.query.registId
      this.data.diagnosisTest.cr.checkType = '1'
      this.data.diagnosisTest.cr.orderNo = 1
      this.$api.service
        .saveDiagnosisTest(this.data.diagnosisTest.cr)
        .then((res) => {
          if (res.status === 200) {
            // this.$notify({ type: 'success', message: '保存成功' })
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
    }, 300),
    saveDdimerDiagnosisTest: debounce(function() {
      this.data.diagnosisTest.ddimer.registId = this.$route.query.registId
      this.data.diagnosisTest.ddimer.checkType = '2'
      this.data.diagnosisTest.ddimer.orderNo = 2
      this.$api.service
        .saveDiagnosisTest(this.data.diagnosisTest.ddimer)
        .then((res) => {
          if (res.status === 200) {
            // this.$notify({ type: 'success', message: '保存成功' })
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
    }, 300),
    saveBnpDiagnosisTest: debounce(function() {
      this.data.diagnosisTest.bnp.registId = this.$route.query.registId
      this.data.diagnosisTest.bnp.checkType = '3'
      this.data.diagnosisTest.bnp.orderNo = 3
      this.$api.service
        .saveDiagnosisTest(this.data.diagnosisTest.bnp)
        .then((res) => {
          if (res.status === 200) {
            // this.$notify({ type: 'success', message: '保存成功' })
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
    }, 300),
    saveNTproBNPDiagnosisTest: debounce(function() {
      this.data.diagnosisTest.nTproBNP.registId = this.$route.query.registId
      this.data.diagnosisTest.nTproBNP.checkType = '4'
      this.data.diagnosisTest.nTproBNP.orderNo = 4
      this.$api.service
        .saveDiagnosisTest(this.data.diagnosisTest.nTproBNP)
        .then((res) => {
          if (res.status === 200) {
            // this.$notify({ type: 'success', message: '保存成功' })
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
    }, 300),
    saveMyoDiagnosisTest: debounce(function() {
      // console.log(this.data.diagnosisTest)
      this.data.diagnosisTest.myo.registId = this.$route.query.registId
      this.data.diagnosisTest.myo.checkType = '5'
      this.data.diagnosisTest.myo.orderNo = 5
      this.$api.service
        .saveDiagnosisTest(this.data.diagnosisTest.myo)
        .then((res) => {
          if (res.status === 200) {
            // this.$notify({ type: 'success', message: '保存成功' })
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
    }, 300),
    saveCkmbDiagnosisTest: debounce(function() {
      // console.log(this.data.diagnosisTest)
      this.data.diagnosisTest.ckmb.registId = this.$route.query.registId
      this.data.diagnosisTest.ckmb.checkType = '6'
      this.data.diagnosisTest.ckmb.orderNo = 6
      this.$api.service
        .saveDiagnosisTest(this.data.diagnosisTest.ckmb)
        .then((res) => {
          if (res.status === 200) {
            //  this.$notify({ type: 'success', message: '保存成功' })
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
    }, 300),
    saveCt: debounce(function() {
      console.log(this.data.screenage.ect)
      this.data.screenage.ect.registId = this.$route.query.registId
      this.data.screenage.ect.checkType = '1'
      this.data.screenage.ect.orderNo = 1
      this.$api.service.saveScreenage(this.data.screenage.ect).then((res) => {
        if (res.status === 200) {
          // this.$notify({ type: 'success', message: '保存成功' })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, 300),
    saveCdu: debounce(function() {
      this.data.screenage.cdu.registId = this.$route.query.registId
      this.data.screenage.cdu.checkType = '2'
      this.data.screenage.cdu.orderNo = 2
      this.$api.service.saveScreenage(this.data.screenage.cdu).then((res) => {
        if (res.status === 200) {
          // this.$notify({ type: 'success', message: '保存成功' })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, 300),
    saveTreatment: debounce(function() {
      this.data.treatment.registId = this.$route.query.registId
      this.$api.service.saveTreatment(this.data.treatment).then((res) => {
        if (res.status === 200) {
          // this.$notify({ type: 'success', message: '保存成功' })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, 300),
    onChanged(type) {
      // if (type === 'inspection') {
      //   this.save()
      // } else if (type === 'cr') {
      //   this.saveCrDiagnosisTest()
      // } else if (type === 'ddimer') {
      //   this.saveDdimerDiagnosisTest()
      // } else if (type === 'bnp') {
      //   this.saveBnpDiagnosisTest()
      // } else if (type === 'proBnp') {
      //   this.saveNTproBNPDiagnosisTest()
      // } else if (type === 'myo') {
      //   this.saveMyoDiagnosisTest()
      // } else if (type === 'ckmb') {
      //   this.saveCkmbDiagnosisTest()
      // } else if (type === 'ect') {
      //   this.saveCt()
      // } else if (type === 'cdu') {
      //   this.saveCdu()
      // } else if (type === 'treatment') {
      //   this.saveTreatment()
      // }
    },
    validate() {
      return new Promise((resolve, reject) => {
        const formRef = this.$refs['detectionform']
        formRef.validate((valid, err) => {
          const errors = Object.keys(err).reduce((arr, key) => {
            const label = formRef.fields.find((f) => f.prop === key)?.label
            return arr.concat([
              {
                module: '检验检查',
                fieldName: label,
                message: '必填'
              }
            ])
          }, [])
          if (valid) {
            resolve(true)
          } else {
            reject({ errors })
          }
        })
      })
    },
    clearValidate() {
      this.$refs['detectionform'].clearValidate()
    },
    ecgchanged(ecgList) {
      this.data.admissionEcgList = ecgList
    }
  }
}
</script>

<style lang="scss" scoped></style>
