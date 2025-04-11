<template>
  <div>
    <med-date-picker
      required
      :rules="[{ required: true, message: '请填写到达医院大门时间' }]"
      v-model="data.arrivedHospitalTime"
      label="到达医院大门时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      @confirm="onChanged"
    />
    <med-text-field
      v-model="data.createBy"
      :disabled="disabled"
      label="护士人员"
      :select-options="doctorsSetting"
      @confirm="onChanged"
    />
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
    dataAdmission: {
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
    ...mapGetters(['doctorsSetting'])
  },
  created() {},
  methods: {
    onChanged() {
      this.dataAdmission.arrivedHospitalTime = this.data.arrivedHospitalTime
      this.$emit('change')
    }
  }
}
</script>

<style lang="less" scoped></style>
