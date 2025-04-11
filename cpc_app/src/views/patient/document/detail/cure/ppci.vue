<template>
  <div class="mini">
    <med-text-field
      label="决定医生"
      v-model="data.decisionDoctor"
      :disabled="disabled"
      :select-options="doctorsSetting"
      @confirm="onChanged"
      v-if="data.reperfusionMeasure === '1' || data.invasiveStrategy === '1'"
    />
    <med-date-picker
      v-model="data.decisionPciTime"
      label="决定介入手术时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写决定介入手术时间' }]"
      v-if="
        data.invasiveStrategy === '1' ||
          data.reperfusionMeasure === '1' ||
          (data.reperfusionMeasure === '2' && data.rsStrategy === '21')
      "
    />
    <med-date-picker
      v-model="data.startRadiographyTime"
      label="造影开始时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写造影开始时间' }]"
      v-if="false"
    />
    <med-date-picker
      v-model="data.startPciTime"
      label="启动导管室时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写启动导管室时间' }]"
      v-if="data.reperfusionMeasure === '1' || data.invasiveStrategy === '1'"
    />
    <med-date-picker
      v-model="data.pciStartAgreeTime"
      label="开始知情同意时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写开始知情同意时间' }]"
      v-if="data.reperfusionMeasure === '1' || data.invasiveStrategy === '1'"
    />
    <med-date-picker
      v-model="data.pciSignAgreeTime"
      label="签署知情同意时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写签署知情同意时间' }]"
      v-if="data.reperfusionMeasure === '1' || data.invasiveStrategy === '1'"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'PPCI',
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
      doctors: [
        { label: 'doctor1', value: '1' },
        { label: 'doctor2', value: '2' },
        { label: 'doctor3', value: '3' }
      ]
    }
  },
  computed: {
    ...mapGetters(['doctorsSetting'])
  },
  created() {},
  methods: {
    onChanged() {
      this.$emit('change', 'treatment')
    }
  }
}
</script>

<style lang="less" scoped></style>
