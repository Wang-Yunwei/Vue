<template>
  <div class="med-datetime-wrapper">
    <el-date-picker
      v-model="pickValue"
      v-fast
      v-bind="$props"
      :format="format"
      :picker-options="options"
      :value-format="format"
      @change="onTimeChanged"
    />
  </div>
</template>
<script>
import Vue from 'vue'
import { DateTimePicker } from 'element-ui'
Vue.use(DateTimePicker)
export default {
  name: 'MedDatetime',
  directives: {
    fast: {
      inserted: (el, binding, vnode) => {
        var blur = function(event) {
          if (isNaN(Date.parse(vnode.componentInstance.value))) return

          var oldVal = new Date(vnode.componentInstance.value)
          var year = oldVal.getFullYear()
          var month = oldVal.getMonth()
          var day = oldVal.getDate()
          var hour = oldVal.getHours()
          var minute = oldVal.getMinutes()
          var second = oldVal.getSeconds()

          if (event.target.value) {
            var time = this.formatTime(event.target.value, { hour: hour, minute: minute, second: second })
            // _.set(vnode.context, binding.expression, new Date(year, month, day, time.hour, time.minute, time.second));
            vnode.componentInstance.emitInput(new Date(year, month, day, time.hour, time.minute, time.second))
          } else {
            // _.set(vnode.context, binding.expression, new Date(year, month, day, hour, minute, second));
            vnode.componentInstance.emitInput(new Date(year, month, day, hour, minute, second))
          }
        }

        if (vnode.componentOptions.tag === 'el-date-picker') {
          var elm = el.getElementsByTagName('input')[0]
          elm.addEventListener('focus', () => {
            if (!vnode.componentInstance.value) { // 获取焦点时，若没有值则自动赋值
              vnode.componentInstance.emitInput(new Date())
            }

            var arr = [...document.querySelectorAll('.el-date-picker')].map(e => +window.getComputedStyle(e).zIndex || 0)
            var max = arr.length ? Math.max(...arr) : 0
            var pop = [...document.querySelectorAll('.el-date-picker')].find(e => (+window.getComputedStyle(e).zIndex || 0) === max)

            var timeInput = pop.querySelectorAll('.el-date-picker__time-header input')[1]
            timeInput.removeEventListener('blur', blur)
            timeInput.addEventListener('blur', blur)
          })
        }
      }
    }
  },
  model: {
    prop: 'value',
    event: '_change'
  },
  props: {
    ...DateTimePicker.$props,
    format: {
      type: String,
      required: false,
      default: 'yyyy-MM-dd HH:mm'
    },
    minDate: {
      type: [String, Date],
      required: false,
      default: () => null
    },
    maxDate: {
      type: [String, Date],
      required: false,
      default: () => null
    }
  },
  data() {
    return {
      pickValue: null,
      options: {}
    }
  },
  watch: {
    maxDate(val) {
      this.updateOptions()
    },
    minDate(val) {
      this.updateOptions()
    },
    value(val) {
      this.pickValue = val
    }
  },
  mounted() {
    this.pickValue = this.value
    this.updateOptions()
  },
  methods: {
    onTimeChanged(val) {
      this.$emit('_change', val)
      this.$emit('change', val)
    },
    updateOptions() {
      if (!this.options || (!this.maxDate && !this.minDate)) this.options = {}
      this.options.disabledDate = time => {
        let result = false
        if (this.minDate) {
          result = result || time.getTime() < new Date(this.minDate)
        }
        if (this.maxDate) {
          result = result || time.getTime() > new Date(this.maxDate)
        }
        return result
      }
    },
    formatTime(val, defaultVal = { hour: 0, minute: 0, second: 0 }) {
      if (/(^[1-9]\d*$)/.test(Number(val))) {
        if (val.length === 2) return { hour: val > 23 ? 0 : val, minute: 0, second: 0 }
        else if (val.length === 4) {
          const hour = Number((val + '').substr(0, 2))
          const minute = Number((val + '').substr(2, 2))
          return { hour: hour > 23 ? 0 : hour, minute: minute > 59 ? 0 : minute, second: 0 }
        } else if (val.length === 6) {
          const hour = Number((val + '').substr(0, 2))
          const minute = Number((val + '').substr(2, 2))
          const second = Number((val + '').substr(4, 2))
          return { hour: hour > 23 ? 0 : hour, minute: minute > 59 ? 0 : minute, second: second > 59 ? 0 : second }
        } else {
          return defaultVal
        }
      } else {
        return defaultVal
      }
    }
  }
}
</script>
<style lang="less" scoped>

</style>
