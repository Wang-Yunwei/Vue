<template>
  <div>
    <med-subtitle title="择期介入" />
    <el-row :gutter="24">
      <el-col :span="6">
        <med-datetime-field
          v-model="data.decisionPciTime"
          form-prop="treatment.decisionPciTime"
          label="决定介入手术时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          :rules="[
            { required: true, message: '请填写决定介入手术时间', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-datetime-field
          v-model="data.startRadiographyTime"
          form-prop="treatment.startRadiographyTime"
          label="造影开始时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          :rules="[
            { required: true, message: '请填写造影开始时间', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'ElectivePCI',
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
  computed: {},
  created() {},
  methods: {

  }
}
</script>

<style lang="scss" scoped></style>
