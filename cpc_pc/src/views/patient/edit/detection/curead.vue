<template>
  <div>
    <med-subtitle title="治疗信息" />
    <el-row :gutter="24">
      <el-col :span="6">
        <med-datetime-field
          v-model="data.cscNoticeTime"
          form-prop="inspection.cscNoticeTime"
          label="通知心外科会诊时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
        />
      </el-col>
      <el-col :span="6">
        <med-datetime-field
          v-model="data.cscTime"
          form-prop="inspection.cscTime"
          label="心外科会诊时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="6">
        <med-radio-field
          v-model="data.interlayerType"
          form-prop="inspection.interlayerType"
          :disabled="disabled"
          label="夹层类型"
          :select-options="dictionary.interlayerTypeDict"
          :rules="[
            { required: true, message: '请填写夹层类型', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="24">
        <med-radio-field
          v-model="data.treatmentStrategy"
          form-prop="inspection.treatmentStrategy"
          label="治疗策略"
          :disabled="disabled"
          :select-options="dictionary.treatmentStrategyDict"
          :rules="[
            { required: true, message: '请填写治疗策略', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'CureAd',
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
