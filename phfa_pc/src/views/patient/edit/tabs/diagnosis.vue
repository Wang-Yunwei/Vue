<template>
  <el-form ref="form" :model="form" label-width="120px" label-position="top">
    <el-row :gutter="24">
      <el-col :span="12">
        <el-form-item label="初步诊断" prop="diagnosis" style="flex: 1 1 50%">
          <diagnosis-input
            v-model="form.diagnosis"
            :readonly="viewMode"
            size="mini"
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item
          label="病情判断"
          prop="conditionGrade"
          style="flex: 1 1 50%"
        >
          <med-radio
            v-model="form.conditionGrade"
            :readonly="viewMode"
            size="mini"
            :options="dictionary[dic.conditionJudgment]"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item
          label="急救措施"
          prop="medPhepMeasures"
          style="flex: 1 1 100%"
        >
          <treatment-measures
            v-model="form.medPhepMeasures"
            :readonly="viewMode"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="用药" prop="otherDruge" style="flex: 1 1 100%">
          <medication :readonly="viewMode" :patient-id="patientId" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item
          label="其他治疗措施"
          prop="otherTreatment"
          style="flex: 1 1 100%"
        >
          <el-input
            v-model="form.otherTreatment"
            :readonly="viewMode"
            size="mini"
            placeholder="请填写"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item
          label="病情转归"
          prop="rescueChangeResult"
          style="flex: 1 1 25%"
        >
          <med-select
            v-model="form.rescueChangeResult"
            :readonly="viewMode"
            size="mini"
            :show-option-all="false"
            :options="dictionary[dic.prognosis]"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item
          label="出诊结果"
          prop="treatmentResult"
          style="flex: 1 1 25%"
        >
          <med-select
            v-model="form.treatmentResult"
            :readonly="viewMode"
            :show-option-all="false"
            size="mini"
            :options="dictionary[dic.visitResult]"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="送往医院" prop="toHospital" style="flex: 1 1 50%">
          <med-select
            v-model="form.toHospital"
            :readonly="viewMode"
            size="mini"
            :show-option-all="false"
            :options="hospitalAreaList"
            @select="onHospitalChange"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import TreatmentMeasures from '@/components/TreatmentMeasures'
import Medication from '@/components/Medication'
import { dicConstant as dic } from '@/constant'
import { mapGetters } from 'vuex'

export default {
  name: 'Diagnosis',
  components: {
    Medication,
    TreatmentMeasures
  },
  props: {
    viewMode: {
      type: Boolean,
      default: false
    },
    detailData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dic,
      form: {
        recordId: '',
        morbtimearea: '',
        isMorb: '1',
        medPhepMeasures: []
      }
    }
  },
  computed: {
    ...mapGetters(['dictionary', 'hospitalAreaList']),
    patientId() {
      return this.$route.query.patientId
    },
    pastHistoryList() {
      return this.dictionary[dic.pastHistory].map((item) => ({
        ...item,
        value: item.label
      }))
    },
    allergicHistoryList() {
      return this.dictionary[dic.allergicHistory].map((item) => ({
        ...item,
        value: item.label
      }))
    },
    driverList() {
      return (this.dictionary[this.dic.driver] || []).map((d) => ({
        ...d,
        value: d.label
      }))
    }
  },
  watch: {
    detailData: {
      immediate: true,
      handler(val) {
        if (val) {
          this.form = { ...val.medPhepMedicalRecordsEntity }
        }
      }
    }
  },
  mounted() {},
  methods: {
    onHospitalChange(opt) {
      this.form.toHospitalName = opt.label
    },
    onSave() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          const payload = { medPhepMedicalRecordsEntity: this.form }
          this.$emit('save', payload)
        }
      })
    }
  }
}
</script>
