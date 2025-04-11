<template>
  <div>
    <med-subtitle title="院前初步诊断" />
    <el-row :gutter="24">
      <el-col :span="24">
        <med-radio-field
          v-model="data.diagnosis"
          :disabled="disabled"
          radio-type="button"
          label="诊断"
          :select-options="dictionary.diagnosisDict"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="6">
        <med-datetime-field
          v-model="data.diagnosisTime"
          label="诊断时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
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
