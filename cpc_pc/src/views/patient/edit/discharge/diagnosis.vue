<template>
  <div class="mini">
    <med-subtitle title="出院诊断" />
    <el-row :gutter="24">
      <div>
        <el-col :span="6">
          <el-form-item
            size="mini"
            label="住院号"
            prop="inpatientNo"
          >
            <bind-patient
              :disabled="!isBound || disabled"
              title="关联"
              type="4"
              :patient-name="dataRegist.name"
              :value="dataMain.admissionNo"
              :hospital-id="dataRegist.hospitalId"
              :hospital-area="dataRegist.hospitalArea"
              @bind="onBindInpatientNo"
            />
            <!-- <el-input v-model="gc.outcome.inpatientNo" :disabled="disabled" /> -->
          </el-form-item>
        </el-col>
      </div>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="24">
        <med-radio-field
          v-model="data.diagnosis"
          form-prop="discharge.diagnosis"
          :disabled="disabled"
          label="出院诊断"
          :select-options="dictionary.dischargeDiagnosisDict"
          :rules="[
            { required: true, message: '请填写出院诊断', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row v-if="data.diagnosis == 6" :gutter="24">
      <el-col :span="24">
        <med-checkbox-field
          v-model="data.nonAcsType"
          display-type="check"
          form-prop="discharge.nonAcsType"
          label="非ACS心源性胸痛类型"
          :disabled="disabled"
          :select-options="dictionary.nacsTypeDict"
          :rules="[
            { required: true, message: '请填写非ACS心源性胸痛类型', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row v-if="data.diagnosis == 7" :gutter="24">
      <el-col :span="24">
        <med-checkbox-field
          v-model="data.otherAcsType"
          display-type="check"
          form-prop="discharge.otherAcsType"
          label="其它非心源性胸痛类型"
          :disabled="disabled"
          :select-options="dictionary.nccpTypeDict"
          :rules="[
            { required: true, message: '请填写其它非心源性胸痛类型', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="6">
        <med-datetime-field
          v-model="data.diagnosisTime"
          form-prop="discharge.diagnosisTime"
          label="确诊时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          :rules="[
            { required: true, message: '请填写确诊时间', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="12">
        <med-radio-field
          v-model="data.covid19"
          :disabled="disabled"
          label="COVID-19"
          :select-options="dictionary.covid19Dict"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="3">
        <med-radio-field
          v-if="data.diagnosis == 1 || data.diagnosis == 2 || data.diagnosis == 3"
          v-model="data.isHeartFailure"
          form-prop="discharge.isHeartFailure"
          :disabled="disabled"
          label="院内新发心力衰竭"
          :select-options="dictionary.yesOrNoDict"
          :rules="[
            { required: true, message: '请填写院内新发心力衰竭', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-radio-field
          v-if="
            (data.diagnosis == 1 || data.diagnosis == 2 || data.diagnosis == 3) &&
              data.isHeartFailure == 1
          "
          v-model="data.nyhaLevel"
          form-prop="discharge.nyhaLevel"
          :disabled="disabled"
          label="心功能分级"
          :select-options="dictionary.chfNyhaDict"
          :rules="[
            { required: true, message: '请填写心功能分级', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="3">
        <med-radio-field
          v-if="data.diagnosis == 1 || data.diagnosis == 2 || data.diagnosis == 3"
          v-model="data.arni"
          form-prop="discharge.arni"
          :disabled="disabled"
          label="ARNI"
          :select-options="dictionary.yesOrNoDict"
          :rules="[
            { required: true, message: '请填写ARNI', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-radio-field
          v-if="
            (data.diagnosis == 1 || data.diagnosis == 2 || data.diagnosis == 3) &&
              data.arni == 1
          "
          v-model="data.takingFrequency"
          form-prop="discharge.takingFrequency"
          label="服用频次"
          :disabled="disabled"
          :select-options="dictionary.rateCountDict"
          :rules="[
            { required: true, message: '请填写服用频次', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-radio-field
          v-if="
            (data.diagnosis == 1 || data.diagnosis == 2 || data.diagnosis == 3) &&
              data.arni == 1
          "
          v-model="data.takingFrequencyRange"
          form-prop="discharge.takingFrequencyRange"
          label="服用间隔"
          :disabled="disabled"
          :select-options="dictionary.rateTimeDict"
          :rules="[
            { required: true, message: '请填写服用间隔', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-number-field
          v-if="
            (data.diagnosis == 1 || data.diagnosis == 2 || data.diagnosis == 3) &&
              data.arni == 1
          "
          v-model="data.singleDose"
          :disabled="disabled"
          form-prop="discharge.singleDose"
          label="单次剂量"
          append="mg"
          :rules="[
            { required: true, message: '请填写单次剂量', trigger: 'blur' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="24">
        <med-checkbox-field
          v-if="data.diagnosis == 1 || data.diagnosis == 2 || data.diagnosis == 3"
          v-model="data.complication"
          display-type="check"
          form-prop="discharge.complication"
          label="住院期间并发症"
          :disabled="disabled"
          :select-options="dictionary.outcomeComplicationDict"
          :rules="[
            { required: true, message: '请填写住院期间并发症', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import bindPatient from '../bindPatient.vue'
import { mapGetters } from 'vuex'
import { relationPatient } from '@/api/patient/edit'
export default {
  name: 'Diagnosis',
  components: { bindPatient },
  props: {
    isBound: {
      type: Boolean,
      default: false
    },
    data: {
      required: true,
      type: Object
    },
    dataMain: {
      required: true,
      type: Object
    },
    dataRegist: {
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
      active: 0,
      registId: 0,
      minDate: new Date(2020, 0, 10),
      maxDate: new Date(2025, 10, 1)
    }
  },
  computed: {
    ...mapGetters(['dictionary', 'configure']),
    showAdmissionNo() {
      if (
        this.dataRegist.infoComingType === '4' ||
        this.dataRegist.infoComingType === '0'
      ) {
        return false
      } else return true
    }
  },
  created() {},
  methods: {
    onBindInpatientNo(item, closePop) {
      this.$set(this.dataMain, 'admissionNo', item?.displayNo || '')
      if (item.relationId) {
        relationPatient({
          registId: this.dataRegist.id || this.$route.query.id,
          visitId: item.relationId,
          type: item.type,
          hospitalArea: this.dataRegist.hospitalArea,
          hospitalId: this.dataRegist.hospitalId,
          patientNo: this.dataRegist.emId
        })
          .then(({ result, message }) => {
            if (!result) {
              this.$message.error(message)
            } else {
              this.$message.success('绑定成功!')
              this.$eventBus.$emit('refreshPatient', { admissionNo: item.displayNo })
              closePop()
            }
          })
          .catch((err) => {
            if (err.response?.data?.message) {
              this.$message.error(err.response?.data?.message)
            }
          })
      }
    },
    showimport() {
      this.$emit('showimport', '4')
    }
  }
}
</script>

<style lang="scss" scoped></style>
