<template>
  <div>
    <med-subtitle title="院前体征" />
    <el-row :gutter="24">
      <el-col :span="6">
        <med-select-field
          v-model="data.consciousnessType"
          :disabled="disabled"
          radio-type="button"
          label="意识"
          :select-options="dictionary.senseDict"
          form-prop="prehospital.consciousnessType"
          :rules="[{ required: true, message: '请填写意识', trigger: 'change' }]"
        />
      </el-col>
      <el-col :span="3">
        <med-text-field
          v-model="data.respirationRate"
          v-int="{ max: 50, min: 0 }"
          :disabled="disabled"
          label="呼吸"
          append="次/分"
          form-prop="prehospital.respirationRate"
          :rules="[{ required: true, message: '请填写呼吸', trigger: 'blur' }]"
        />
      </el-col>
      <el-col :span="3">
        <med-text-field
          v-model="data.pulseRate"
          v-int="{ max: 300, min: 0 }"
          :disabled="disabled"
          label="脉搏"
          append="次/分"
          form-prop="prehospital.pulseRate"
          :rules="[{ required: true, message: '请填写脉搏', trigger: 'blur' }]"
        />
      </el-col>
      <el-col :span="3">
        <med-text-field
          v-model="data.heartRate"
          v-int="{ max: 300, min: 0 }"
          :disabled="disabled"
          label="心率"
          append="次/分"
          form-prop="prehospital.heartRate"
          :rules="[{ required: true, message: '请填写心率', trigger: 'blur' }]"
        />
      </el-col>
      <el-col :span="6">
        <med-bp-field
          v-model="data.bloodPressure"
          :disabled="disabled"
          label="血压"
          form-prop="prehospital.bloodPressure"
          :rules="[
            { required: true, message: '请填写血压', trigger: 'blur' },
            { validator: bpValidator, trigger: 'blur' }
          ]"
        />
      </el-col>
      <el-col :span="3">
        <med-text-field
          v-model="data.temperature"
          v-float="{ max: 47, min: 30, scale: 1 }"
          :disabled="disabled"
          label="体温"
          append="℃"
          form-prop="prehospital.temperature"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Vitalsigns',
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
      registId: 0
    }
  },
  computed: {
    ...mapGetters(['dictionary'])
  },
  created() {

  },
  methods: {
    bpValidator(rule, value, callback) {
      const bps = (value || '').split('/')
      if (!bps[0]) {
        callback(new Error('收缩压不能为空'))
      } else if (!bps[1]) {
        callback(new Error('舒张压不能为空'))
      } else {
        callback()
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
