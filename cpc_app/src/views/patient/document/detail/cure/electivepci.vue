<template>
  <div class="mini">
    <med-date-picker
      v-model="data.decisionPciTime"
      label="决定介入手术时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写决定介入手术时间' }]"
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
    />
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
    onChanged() {
      this.$emit('change', 'treatment')
    }
  }
}
</script>

<style lang="less" scoped></style>
