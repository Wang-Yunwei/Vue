<template>
  <div>
    <med-subtitle title="胸痛会诊" />
    <el-row :gutter="24">
      <el-col :span="3">
        <med-radio-field
          v-model="data.isCardiolohyConsultant"
          form-prop="inspection.isCardiolohyConsultant"
          :disabled="disabled"
          label="是否会诊"
          :select-options="dictionary.yesOrNoDict"
          :rules="[
            { required: true, message: '请填写是否会诊', trigger: 'change' }
          ]"
        />
      </el-col>

      <div v-if="data.isCardiolohyConsultant == '1'" :gutter="24">
        <el-col :span="3">
          <med-radio-field
            v-model="data.consultantType"
            form-prop="inspection.consultantType"
            :disabled="disabled"
            label="会诊类型"
            :select-options="dictionary.consultationTypeDict"
            :rules="[
              { required: true, message: '请填写会诊类型', trigger: 'change' }
            ]"
          />
        </el-col>
        <el-col :span="6">
          <med-datetime-field
            v-model="data.noticeConsultantTime"
            form-prop="inspection.noticeConsultantTime"
            label="通知会诊时间"
            :min-date="minDate"
            :max-date="maxDate"
            :disabled="disabled"
            :rules="[
              { required: true, message: '请填写通知会诊时间', trigger: 'change' }
            ]"
          />
        </el-col>
        <el-col :span="6">
          <med-datetime-field
            v-model="data.consultantTime"
            form-prop="inspection.consultantTime"
            label="会诊时间"
            :min-date="minDate"
            :max-date="maxDate"
            :disabled="disabled"
            :rules="[
              { required: true, message: '请填写会诊时间', trigger: 'change' }
            ]"
          />
        </el-col>
      </div>
    </el-row>
    <el-row :gutter="24" v-if="diagnosisVal">
      <el-col :span="3">
        <med-radio-field
          v-model="data.isBypassEm"
          form-prop="inspection.isBypassEm"
          :disabled="disabled"
          label="绕行急诊"
          :select-options="dictionary.yesOrNoDict"
          :rules="[
            { required: true, message: '请填写绕行急诊', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="3">
        <med-radio-field
          v-model="data.isBypassCcu"
          form-prop="inspection.isBypassCcu"
          :disabled="disabled"
          label="绕行CCU"
          :select-options="dictionary.yesOrNoDict"
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
  name: 'CMdt',
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
  async created() {

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
  methods: {

  }
}
</script>

<style lang="scss" scoped></style>
