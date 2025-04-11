<template>
  <div class="med-range-picker flex-c-b">
    <med-date-picker
      v-model="begin"
      label=""
      placeholder="开始时间"
      clearable
    />
    <span> ~ </span>
    <med-date-picker v-model="end" label="" placeholder="结束时间" clearable />
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    formatString: {
      type: String,
      default: 'YYYY-MM-DD HH:mm:ss'
    },
    beginTime: {
      type: String,
      default: ''
    },
    endTime: {
      type: String,
      default: ''
    },
    maxRange: {
      type: String,
      default: '' // 2days | 24hours | 30 minutes | 60 seconds
    }
  },
  computed: {
    begin: {
      get() {
        return this.beginTime
      },
      set(value) {
        this.onChange(value, 'beginTime')
      }
    },
    end: {
      get() {
        return this.endTime
      },
      set(value) {
        this.onChange(value, 'endTime')
      }
    }
  },
  methods: {
    onChange(val, type) {
      const anotherField = type === 'beginTime' ? 'endTime' : 'beginTime'
      if (val) {
        const start = type === 'beginTime' ? val : this.beginTime
        const end = type === 'endTime' ? val : this.endTime
        const funcs =
          type === 'beginTime' ? ['endOf', 'add'] : ['startOf', 'subtract']
        if (this.maxRange) {
          const [numStr, unit] = this.maxRange.split(/(?<=\d)(?=\w)/)
          const num = Number(numStr) - 1
          if (num >= 0) {
            const isAnotherEmpty = !this[anotherField]
            const diffs = moment(end).diff(moment(start), unit)
            if (isAnotherEmpty || diffs > num || diffs < 0) {
              const anotherValue = moment(val)
                [funcs[0]]('day')
                [funcs[1]](num, unit)
                .format(this.formatString)
              this.$emit(`update:${anotherField}`, anotherValue)
            }
          }
        } else {
          const isEndBeforeBegin = moment(end).isBefore(start)
          if (isEndBeforeBegin) {
            const anotherValue = moment(val)
              [funcs[0]]('day')
              .format(this.formatString)
            this.$emit(`update:${anotherField}`, anotherValue)
          }
        }
      }
      this.$emit(`update:${type}`, val)
    }
  },
  watch: {
    maxRange(r) {
      this.onChange(this.endTime, 'endTime')
    }
  }
}
</script>

<style></style>
