<template>
  <div>
    <med-subtitle title="院内初步诊断" />
    <el-row :gutter="24">
      <el-col :span="24">
        <med-radio-field
          v-model="data.diagnosis"
          :disabled="disabled"
          form-prop="inspection.diagnosis"
          label="诊断"
          :select-options="diagCodeDic"
          :rules="[
            { required: true, message: '请填写诊断', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="6">
        <med-datetime-field
          v-model="data.diagnosisTime"
          form-prop="inspection.diagnosisTime"
          label="诊断时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          :rules="[
            { required: true, message: '请填写诊断时间', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-autocomplete-field
          v-model="data.diagnosisDoctor"
          :suggestion="medicalWorkers"
          :disabled="disabled"
          label="诊断医生"
          form-prop="inspection.diagnosisDoctor"
        />
      </el-col>
    </el-row>
    <el-row v-if="isAcs" :gutter="24">
      <el-col :span="24">
        <med-radio-field
          v-model="data.killipLevel"
          form-prop="inspection.killipLevel"
          :disabled="disabled"
          required
          label="心功能分级"
          :select-options="killipLevelDic"
          :rules="[
            { required: true, message: '请填写心功能分级', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row v-if="isNonacs" :gutter="24">
      <el-col :span="24">
        <med-checkbox-field
          v-model="data.nacsType"
          display-type="check"
          form-prop="inspection.nacsType"
          :disabled="disabled"
          :select-options="nonacsDic"
          label="非ACS心源性胸痛类型"
          :rules="[
            { required: true, message: '请填写非ACS心源性胸痛类型', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row v-if="isNoncardiogenic" :gutter="24">
      <el-col :span="24">
        <med-checkbox-field
          v-model="data.nccpType"
          display-type="check"
          form-prop="inspection.nccpType"
          :disabled="disabled"
          :select-options="noncardiogenicDic"
          label="其它非心源性胸痛类型"
          :rules="[
            { required: true, message: '请填写其它非心源性胸痛类型', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row v-if="showMeasure" :gutter="24">
      <el-col :span="24">
        <med-radio-field
          v-model="data.handleWay"
          form-prop="inspection.handleWay"
          :disabled="disabled"
          label="处理措施"
          :select-options="measuresDic"
          :rules="[
            { required: true, message: '请填写处理措施', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="24">
        <div style="display: flex; align-items: flex-end;">
          <med-radio-field
            v-model="data.isGiveupTreatment"
            form-prop="inspection.isGiveupTreatment"
            :disabled="disabled"
            label="患者自愿放弃后续治疗"
            :select-options="yesOrNoDic"
            :rules="[
              { required: true, message: '请填写患者自愿放弃后续治疗', trigger: 'change' }
            ]"
          />
          <span v-if="data.isGiveupTreatment === '1'" style="color: red; margin-bottom: 18px;">
            此选择表示胸痛诊疗结束,不再继续跟踪患者的救治情况!
          </span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { dicConstant } from '@/constant/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Diagnosis',
  components: {},
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
      active: 0,
      registId: 0,
      minDate: new Date(2020, 0, 10),
      maxDate: new Date(2025, 10, 1)
      // yesOrNoDic: [],
      // diagCodeDic: [],
      // killipLevelDic: [],
      // nonacsDic: [],
      // noncardiogenicDic: [],
      // measuresDic: []
    }
  },
  computed: {
    isAcs() {
      return (
        this.data.diagnosis === '1' ||
        this.data.diagnosis === '2' ||
        this.data.diagnosis === '3'
      )
    },
    isNonacs() {
      return this.data.diagnosis === '6'
    },
    isNoncardiogenic() {
      return this.data.diagnosis === '7'
    },
    showMeasure() {
      return (
        this.isNonacs || this.isNoncardiogenic || this.data.diagnosis === '9'
      )
    },
    ...mapGetters(['dictionary', 'medicalWorkers']),
    yesOrNoDic() {
      return this.dictionary[dicConstant.yesOrNoCode]
    },
    diagCodeDic() {
      return this.dictionary[dicConstant.diagnosisCode]
    },
    killipLevelDic() {
      return this.dictionary[dicConstant.killipLevelCode]
    },
    nonacsDic() {
      return this.dictionary[dicConstant.nacsTypeCode]
    },
    noncardiogenicDic() {
      return this.dictionary[dicConstant.nccpTypeCode]
    },
    measuresDic() {
      return this.dictionary[dicConstant.handleWayCode]
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped></style>
