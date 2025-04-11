<template>
  <div>
    <med-subtitle title="溶栓治疗" />
    <el-row :gutter="24">
      <el-col :span="6">
        <med-radio-field
          v-model="data.rsScreen"
          :disabled="disabled"
          form-prop="treatment.rsScreen"
          label="溶栓筛查"
          :select-options="dictionary.thrombolyticScreeningDict"
          :rules="[
            { required: true, message: '请填写溶栓筛查', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col v-if="data.rsScreen === '1'" :span="6">
        <med-radio-field
          v-model="data.hasContraindication"
          form-prop="treatment.hasContraindication"
          :disabled="disabled"
          label="存在禁忌症"
          :select-options="dictionary.yesOrNoDict"
        />
      </el-col>
      <el-col v-if="data.rsScreen === '2'" :span="6">
        <med-radio-field
          v-model="data.isRs"
          form-prop="treatment.isRs"
          :disabled="disabled"
          label="溶栓治疗"
          :select-options="dictionary.haveOrNotDict"
          :rules="[
            { required: true, message: '请填写溶栓治疗', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <div v-if="data.rsScreen === '2' && data.isRs === '1'">
      <el-row :gutter="24">
        <el-col :span="6">
          <med-radio-field
            v-model="data.isRsDirect"
            form-prop="treatment.isRsDirect"
            :disabled="disabled"
            label="直达溶栓场所"
            :select-options="dictionary.yesOrNoDict"
            :rules="[
              { required: true, message: '请填写直达溶栓场所', trigger: 'change' }
            ]"
          />
        </el-col>
        <el-col :span="12">
          <med-radio-field
            v-model="data.rsPlace"
            form-prop="treatment.rsPlace"
            :disabled="disabled"
            required
            label="溶栓场所"
            :select-options="dictionary.ihThrombolyticPlaceDict"
            :rules="[
              { required: true, message: '请填写溶栓场所', trigger: 'change' }
            ]"
          />
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="6">
          <med-datetime-field
            v-model="data.rsStartAgreeTime"
            form-prop="treatment.rsStartAgreeTime"
            label="开始知情同意时间"
            :min-date="minDate"
            :max-date="maxDate"
            :disabled="disabled"
            :rules="[
              { required: true, message: '请填写开始知情同意时间', trigger: 'change' }
            ]"
          />
        </el-col>
        <el-col :span="6">
          <med-datetime-field
            v-model="data.rsSignAgreeTime"
            form-prop="treatment.rsSignAgreeTime"
            label="签署知情同意书时间"
            :min-date="minDate"
            :max-date="maxDate"
            :disabled="disabled"
            :rules="[
              { required: true, message: '请填写签署知情同意书时间', trigger: 'change' }
            ]"
          />
        </el-col>
        <el-col :span="6">
          <med-datetime-field
            v-model="data.rsStartTime"
            form-prop="treatment.rsStartTime"
            label="开始溶栓时间"
            :min-date="minDate"
            :max-date="maxDate"
            :disabled="disabled"
            :rules="[
              { required: true, message: '请填写开始溶栓时间', trigger: 'change' }
            ]"
          />
        </el-col>
        <el-col :span="6">
          <med-datetime-field
            v-model="data.rsEndTime"
            form-prop="treatment.rsEndTime"
            label="溶栓结束时间"
            :min-date="minDate"
            :max-date="maxDate"
            :disabled="disabled"
            :rules="[
              { required: true, message: '请填写溶栓结束时间', trigger: 'change' }
            ]"
          />
        </el-col>
        <el-col :span="6">
          <med-radio-field
            v-model="data.rsDrugType"
            form-prop="treatment.rsDrugType"
            :disabled="disabled"
            label="溶栓药物"
            :select-options="dictionary.thrombolyticDrugTypeDict"
            :rules="[
              { required: true, message: '请填写溶栓药物', trigger: 'change' }
            ]"
          />
        </el-col>
        <el-col :span="3">
          <med-radio-field
            v-model="data.rsDrugCode"
            form-prop="treatment.rsDrugCode"
            :disabled="disabled"
            label="溶栓药物剂量"
            :select-options="dictionary.thrombolyticDrugDict"
            :rules="[
              { required: true, message: '请填写溶栓药物剂量', trigger: 'change' }
            ]"
          />
        </el-col>
        <el-col :span="3">
          <med-radio-field
            v-model="data.isRsRecanalization"
            form-prop="treatment.isRsRecanalization"
            :disabled="disabled"
            label="是否溶栓再通"
            :select-options="dictionary.yesOrNoDict"
            :rules="[
              { required: true, message: '请填写是否溶栓再通', trigger: 'change' }
            ]"
          />
        </el-col>
      </el-row>
    </div>
    <el-row>
      <el-col :span="6">
        <med-radio-field
          v-model="data.rsStrategy"
          form-prop="treatment.rsStrategy"
          :disabled="disabled"
          required
          label="溶栓后措施"
          :select-options="dictionary.reperfusionMeasureRsDict"
        />
      </el-col>
      <el-col v-if="data.rsStrategy === '21'" :span="6">
        <med-datetime-field
          v-model="data.decisionPciTime"
          form-prop="treatment.decisionPciTime"
          label="决定介入手术时间"
          :min-date="minDate"
          :max-date="maxDate"
          :rules="[
            { required: true, message: '请填写决定介入手术时间', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <!-- <remedypci
      v-if="showRemedyPCI"
      :data="data"
      :disabled="disabled"
    />

    <pci
      v-if="showPCI"
      :data="data"
      :disabled="disabled"
    /> -->
  </div>
</template>

<script>
// import remedypci from './remedypci'
// import pci from './pci'
import { mapGetters } from 'vuex'
export default {
  name: 'Thrombolysis',
  // components: {
  //   remedypci,
  //   pci
  // },
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
    }
  },
  computed: {
    ...mapGetters([
      'dictionary'
    ]),
    showRemedyPCI() {
      return this.data.strategy === '21'
    },
    showPCI() {
      return this.data.strategy === '22'
    }
  },
  created() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped></style>
