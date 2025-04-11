<template>
  <div>
    <med-subtitle title="远程会诊" />
    <el-row :gutter="24">
      <el-col :span="3">
        <med-radio-field
          v-model="data.isCardiolohyConsultant"
          radio-type="button"
          :disabled="disabled"
          label="心内科会诊"
          :select-options="dictionary.yesOrNoDict"
          form-prop="prehospital.isCardiolohyConsultant"
          :rules="[
            { required: true, message: '请填写心内科会诊', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col v-if="data.isCardiolohyConsultant == 1" :span="6">
        <med-datetime-field
          v-model="data.noticeConsultantTime"
          label="通知会诊时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          form-prop="prehospital.noticeConsultantTime"
          :rules="[
            { required: true, message: '请填写通知会诊时间', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col v-if="data.isCardiolohyConsultant == 1" :span="6">
        <med-datetime-field
          v-model="data.consultantTime"
          label="会诊时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          form-prop="prehospital.consultantTime"
          :rules="[
            { required: true, message: '请填写会诊时间', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col v-if="diagnosisVal" :span="3">
        <med-radio-field
          v-model="data.isBypassEm"
          :disabled="disabled"
          label="绕行急诊"
          :select-options="dictionary.yesOrNoDict"
          form-prop="prehospital.isBypassEm"
          :rules="[
            { required: true, message: '请填写绕行急诊', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col v-if="diagnosisVal" :span="3">
        <med-radio-field
          v-model="data.isBypassCcu"
          :disabled="disabled"
          label="绕行CCU"
          :select-options="dictionary.yesOrNoDict"
          form-prop="prehospital.isBypassCcu"
          :rules="[
            { required: true, message: '请填写绕行CCU', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Mdt',
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
      maxDate: new Date(2025, 10, 1),
      diagnosisVal: true
    }
  },
  computed: {
    ...mapGetters(['dictionary'])
  },
  watch: {
    'data.diagnosis': {
      immediate: false,
      handler(newVal, oldVal) {
        if (['4', '5', '6', '7', '9'].includes(newVal)) {
          this.diagnosisVal = false
          this.data.isBypassEm = ''
          this.data.isBypassCcu = ''
        } else {
          this.diagnosisVal = true
        }
      },
      deep: true
    }
  },
  created() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped></style>
