<template>
  <div class="mini">
    <med-date-picker
      v-model="data.cabgDecisionTime"
      label="决定CABG时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写决定CABG时间' }]"
    />
    <med-date-picker
      v-model="data.cabgStartTime"
      label="开始CABG时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写开始CABG时间' }]"
    />
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
    onChanged() {
      this.$emit('change', 'treatment')
    }
  }
}
</script>

<style lang="less" scoped></style>
