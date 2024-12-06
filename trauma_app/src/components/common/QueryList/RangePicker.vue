<template>
  <div class="range-picker flex-c-c">
    <med-date-picker
      v-model="sTime"
      formatter="YYYY-MM-DD"
      @confirm="v => onValueChange(v, 'start')"
      label=""
      placeholder="开始时间"
      :clearable="false"
    />
    <span> ~ </span>
    <med-date-picker
      v-model="eTime"
      formatter="YYYY-MM-DD"
      @confirm="v => onValueChange(v, 'end')"
      label=""
      placeholder="结束时间"
      :clearable="false"
    />
  </div>
</template>

<script>
export default {
  name: 'RangePicker',
  props: ['value', 'showIcon'],
  data() {
    return {
      sTime: this.value[0],
      eTime: this.value[1]
    }
  },
  model: {
    prop: 'value',
    event: '_change'
  },
  created() {
    console.log(this.value)
  },
  methods: {
    onValueChange(val, type) {
      const newVal = this.value || []
      const typeMap = {
        start: 0,
        end: 1
      }
      newVal[typeMap[type]] = val
      this.$emit('input', [...newVal])
      this.$emit('change', [...newVal])
      this.$emit('_change', [...newVal])
    }
  }
}
</script>

<style lang="less" scoped>
.range-picker {
  > span {
    color: #696969;
    padding: 0 10px;
  }
  /deep/ .med-datepicker-wrapper {
    line-height: 80px;
    border-radius: 15px;
    background-color: rgb(239, 241, 255);
  }
}
</style>
