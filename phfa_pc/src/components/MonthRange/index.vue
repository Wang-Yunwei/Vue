<template>
  <el-date-picker
    v-model="range"
    type="monthrange"
    range-separator="~"
    format="yyyy[年]MM[月]"
    start-placeholder="开始月份"
    end-placeholder="结束月份"
    :picker-options="pickerOptions"
    style="width: 100%"
  />
</template>

<script>
const formatStr = 'YYYY-MM-DD[T00:00:00]'

export default {
  name: 'MonthRange',
  props: {
    start: {
      type: String,
      default: ''
    },
    end: {
      type: String,
      default: ''
    },
    defaultThisYear: {
      type: Boolean,
      default: true
    }
  },
  data() {
    const startOfYear = this.$moment().startOf('year').format(formatStr)
    const endOfYear = this.$moment()
      .endOf('year')
      .add(1, 'month')
      .format(formatStr)

    return { startOfYear, endOfYear, startDate: null }
  },
  computed: {
    pickerOptions() {
      return {
        disabledDate: (time) => {
          // 不允许选超出一年的范围
          if (this.startDate) {
            const min = this.$moment(this.startDate)
              .subtract(1, 'years')
              .add(1, 'month')
            const max = this.$moment(this.startDate)
              .add(1, 'years')
              .subtract(1, 'month')
            return (
              this.$moment(time).isBefore(min) ||
              this.$moment(time).isAfter(max)
            )
          }
          return false
        },
        onPick: ({ minDate, maxDate }) => {
          if (minDate && !maxDate) {
            // 记录第一个选中的时间 用于禁用超出一年以外的选项
            this.startDate = minDate
          } else if (minDate && maxDate) {
            this.startDate = null
          }
        }
      }
    },
    range: {
      get() {
        const { start, end } = this
        if (start && end) {
          return [
            this.$moment(start).format(formatStr),
            this.$moment(end).subtract(1, 'month').format(formatStr)
          ]
        }
        return []
      },
      set(v) {
        const newVal = []
        if (v?.length) {
          newVal[0] = this.$moment(v[0]).format(formatStr)
          newVal[1] = this.$moment(v[1]).add(1, 'month').format(formatStr)
        }
        this.$emit('update:start', newVal[0])
        this.$emit('update:end', newVal[1])
      }
    }
  },
  mounted() {
    if (this.defaultThisYear && !this.start && !this.end) {
      this.$emit('update:start', this.startOfYear)
      this.$emit('update:end', this.endOfYear)
    }
  }
}
</script>

<style></style>
