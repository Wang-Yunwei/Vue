<template>
  <div>
    <med-subtitle title="到院交接" />
    <el-row :gutter="24">
      <el-col :span="6">
        <med-datetime-field
          v-model="data.arrivedHospitalTime"
          label="到达医院大门时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          form-prop="prehospital.arrivedHospitalTime"
          :rules="[
            { required: true, message: '请填写到达医院大门时间', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-autocomplete-field
          v-model="data.createBy"
          :suggestion="medicalWorkers"
          :disabled="disabled"
          label="护士人员"
          form-prop="prehospital.createBy"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Handover',
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
    ...mapGetters(['medicalWorkers'])
  },
  created() {},
  methods: {

  }
}
</script>

<style lang="scss" scoped></style>
