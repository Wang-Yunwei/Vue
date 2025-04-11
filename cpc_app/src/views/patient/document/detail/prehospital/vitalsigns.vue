<template>
  <div>
    <med-radio-select-field
      v-model="data.consciousnessType"
      :disabled="disabled"
      required
      :rules="[{ required: true, message: '请填写意识' }]"
      label="意识"
      :select-options="dictionary.senseDict"
      @confirm="onChanged"
    >
    </med-radio-select-field>
    <med-number-field
      v-int="{ min: 0, max: 40 }"
      required
      :rules="[{ required: true, message: '请填写呼吸' }]"
      v-model="data.respirationRate"
      :disabled="disabled"
      label="呼吸"
      min="0"
      max="40"
      unit="次/分"
      @confirm="onChanged"
    >
    </med-number-field>
    <med-number-field
      v-int="{ min: 0, max: 300 }"
      required
      :rules="[{ required: true, message: '请填写脉搏' }]"
      v-model="data.pulseRate"
      :disabled="disabled"
      label="脉搏"
      min="0"
      max="300"
      unit="次/分"
      @confirm="onChanged"
    >
    </med-number-field>
    <med-number-field
      v-int="{ min: 0, max: 300 }"
      required
      :rules="[{ required: true, message: '请填写心率' }]"
      v-model="data.heartRate"
      :disabled="disabled"
      label="心率"
      min="0"
      max="300"
      unit="次/分"
      @confirm="onChanged"
    >
    </med-number-field>
    <med-bp-field
      v-model="data.bloodPressure"
      :disabled="disabled"
      label="血压"
      required
      :rules="[{ required: true, message: '请填写血压' }]"
      @confirm="onChanged"
    >
    </med-bp-field>
    <med-number-field
      v-float="{ scale: 1, min: 30, max: 47 }"
      v-model="data.temperature"
      :disabled="disabled"
      label="体温"
      min="30"
      max="47"
      unit="℃"
      @confirm="onChanged"
    >
    </med-number-field>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Vitalsigns',
  computed: {
    ...mapGetters([
      'dictionary'
    ])
  },
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
  methods: {
    onChanged() {
      this.$emit('change')
    }
  }
}
</script>

<style lang="less" scoped></style>
