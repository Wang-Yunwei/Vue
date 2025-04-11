<template>
  <div>
    <med-subtitle title="CABG" />
    <el-row :gutter="24">
      <el-col :span="6">
        <med-datetime-field
          v-model="data.cabgDecisionTime"
          form-prop="treatment.cabgDecisionTime"
          label="决定CABG时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          :rules="[
            { required: true, message: '请填写决定CABG时间', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-datetime-field
          v-model="data.cabgStartTime"
          form-prop="treatment.cabgStartTime"
          label="开始CABG时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          :rules="[
            { required: true, message: '请填写开始CABG时间', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Cabg',
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
