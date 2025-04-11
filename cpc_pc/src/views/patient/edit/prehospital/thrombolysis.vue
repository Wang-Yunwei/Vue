<template>
  <div>
    <med-subtitle title="院前溶栓治疗" />
    <el-row :gutter="24">
      <el-col :span="6">
        <med-radio-field
          v-model="data.rsScreen"
          :disabled="disabled"
          label="溶栓筛查"
          :select-options="dictionary.thrombolyticScreeningDict"
          form-prop="prehospital.rsScreen"
          :rules="[
            { required: true, message: '请填写溶栓筛查', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col v-if="data.rsScreen == '1'" :span="6">
        <med-radio-field
          v-model="data.isRsTaboo"
          :disabled="disabled"
          label="存在禁忌症"
          :select-options="dictionary.yesOrNoDict"
          form-prop="prehospital.isRsTaboo"
          :rules="[
            { required: true, message: '请填写存在禁忌症', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <div v-if="data.rsScreen == '2'">
      <el-row :gutter="24">
        <el-col :span="6">
          <med-radio-field
            v-model="data.isRs"
            :disabled="disabled"
            label="溶栓治疗"
            :select-options="dictionary.haveOrNotDict"
            form-prop="prehospital.isRs"
            :rules="[
              { required: true, message: '请填写溶栓治疗', trigger: 'change' }
            ]"
          />
        </el-col>
      </el-row>
      <div v-if="data.isRs == '1'">
        <el-row :gutter="24">
          <el-col :span="6">
            <med-radio-field
              v-model="data.isRsDirect"
              :disabled="disabled"
              label="直达溶栓场所"
              :select-options="dictionary.yesOrNoDict"
              form-prop="prehospital.isRsDirect"
              :rules="[
                { required: true, message: '请填写直达溶栓场所', trigger: 'change' }
              ]"
            />
          </el-col>
          <el-col :span="6">
            <med-radio-field
              v-model="data.rsPlace"
              :disabled="disabled"
              required
              label="溶栓场所"
              :select-options="dictionary.faThrombolyticPlaceDict"
              form-prop="prehospital.rsPlace"
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
              label="开始知情同意时间"
              :min-date="minDate"
              :max-date="maxDate"
              :disabled="disabled"
              form-prop="prehospital.rsStartAgreeTime"
              :rules="[
                { required: true, message: '请填写开始知情同意时间', trigger: 'change' }
              ]"
            />
          </el-col>
          <el-col :span="6">
            <med-datetime-field
              v-model="data.rsSignAgreeTime"
              label="签署知情同意书时间"
              :min-date="minDate"
              :max-date="maxDate"
              :disabled="disabled"
              form-prop="prehospital.rsSignAgreeTime"
              :rules="[
                { required: true, message: '请填写签署知情同意书时间', trigger: 'change' }
              ]"
            />
          </el-col>
          <el-col :span="6">
            <med-datetime-field
              v-model="data.rsStartTime"
              label="开始溶栓时间"
              :min-date="minDate"
              :max-date="maxDate"
              :disabled="disabled"
              form-prop="prehospital.rsStartTime"
              :rules="[
                { required: true, message: '请填写开始溶栓时间', trigger: 'change' }
              ]"
            />
          </el-col>
          <el-col :span="6">
            <med-datetime-field
              v-model="data.rsEndTime"
              label="溶栓结束时间"
              :min-date="minDate"
              :max-date="maxDate"
              :disabled="disabled"
              form-prop="prehospital.rsEndTime"
              :rules="[
                { required: true, message: '请填写溶栓结束时间', trigger: 'change' }
              ]"
            />
          </el-col>
          <el-col :span="6">
            <med-radio-field
              v-model="data.rsDrugType"
              :disabled="disabled"
              label="溶栓药物"
              :select-options="dictionary.thrombolyticDrugTypeDict"
              form-prop="prehospital.rsDrugType"
              :rules="[
                { required: true, message: '请填写溶栓药物', trigger: 'change' }
              ]"
            />
          </el-col>
          <el-col :span="3">
            <med-radio-field
              v-model="data.rsDrugCode"
              :disabled="disabled"
              label="溶栓药物剂量"
              :select-options="dictionary.thrombolyticDrugDict"
              form-prop="prehospital.rsDrugCode"
              :rules="[
                { required: true, message: '请填写溶栓药物剂量', trigger: 'change' }
              ]"
            />
          </el-col>
          <el-col :span="3">
            <med-radio-field
              v-model="data.isRsRecanalization"
              :disabled="disabled"
              label="是否溶栓再通"
              :select-options="dictionary.yesOrNoDict"
              form-prop="prehospital.isRsRecanalization"
              :rules="[
                { required: true, message: '请填写是否溶栓再通', trigger: 'change' }
              ]"
            />
          </el-col>
          <el-col :span="6">
            <med-datetime-field
              v-if="data.isRsRecanalization == 1"
              v-model="data.rsRadiographyTime"
              label="溶栓后造影时间"
              :min-date="minDate"
              :max-date="maxDate"
              :disabled="disabled"
            />
          </el-col>
          <el-col :span="6">
            <med-radio-field
              v-if="data.isRsRecanalization == 0"
              v-model="data.isRemedyPci"
              :disabled="disabled"
              label="补救PCI"
              :select-options="dictionary.yesOrNoDict"
              form-prop="prehospital.isRemedyPci"
              :rules="[
                { required: true, message: '请填写补救PCI', trigger: 'change' }
              ]"
            />
          </el-col>
          <el-col :span="6">
            <med-datetime-field
              v-if="data.isRemedyPci == 1"
              v-model="data.actualPciTime"
              label="实际手术时间"
              :min-date="minDate"
              :max-date="maxDate"
              :disabled="disabled"
              form-prop="prehospital.actualPciTime"
            />
          </el-col>
          <el-col :span="6">
            <med-radio-field
              v-if="data.isRemedyPci == 1"
              v-model="data.pciPlace"
              :disabled="disabled"
              label="补救PCI"
              :select-options="dictionary.pciPlaceDict"
              form-prop="prehospital.pciPlace"
            />
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Thrombolysis',
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
    }
  },
  computed: {
    ...mapGetters(['dictionary'])
  },
  created() {
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped></style>
