<template>
  <div class="mini">
    <med-subtitle title="治疗信息" />
    <el-row :gutter="24">
      <el-col :span="12">
        <med-radio-field
          v-model="data.pulmonaryLevel"
          form-prop="inspection.pulmonaryLevel"
          :disabled="disabled"
          label="危险分层"
          :select-options="dictionary.highriskLaminationDict"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="6">
        <med-datetime-field
          v-model="data.anticoagulationTime"
          form-prop="inspection.anticoagulationTime"
          label="开始抗凝治疗时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="12">
        <med-radio-field
          v-model="data.rsScreen"
          form-prop="inspection.rsScreen"
          label="溶栓筛查"
          :disabled="disabled"
          :select-options="dictionary.thrombolyticScreeningDict"
          :rules="[
            { required: true, message: '请填写溶栓筛查', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col v-if="data.rsScreen == '1'" :span="6" :gutter="24">
        <med-radio-field
          v-model="data.hasContraindication"
          form-prop="inspection.hasContraindication"
          :disabled="disabled"
          label="存在禁忌症"
          :select-options="dictionary.yesOrNoDict"
        />
      </el-col>
      <el-col v-if="data.rsScreen == '2'" :span="6">
        <med-radio-field
          v-model="data.isRs"
          form-prop="inspection.isRs"
          :disabled="disabled"
          label="溶栓治疗"
          :select-options="dictionary.haveOrNotDict"
          :rules="[
            { required: true, message: '请填写溶栓治疗', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'CurePe',
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
  async created() {

  },
  methods: {
  }
}
</script>

<style lang="scss" scoped></style>
