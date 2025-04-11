<template>
  <div class="med-datetime-wrapper">
    <div class="date-part">
      <el-date-picker
        v-model="dateValue"
        type="date"
        v-bind="$props"
        format="yyyy-MM-dd"
        :picker-options="options"
        :default-value="defaultValue"
        value-format="yyyy-MM-dd"
        placeholder="请选择日期"
        @change="onChange"
        @focus="onFocus"
      />
    </div>
    <div v-if="type === 'datetime'" class="space" />
    <div v-if="type === 'datetime'" class="time-part">
      <el-time-picker
        v-model="timeValue"
        v-bind="$props"
        arrow-control
        :disabled="disabled"
        :readonly="readonly"
        :editable="editable"
        :clearable="clearable"
        :default-value="defaultValue"
        :format="timeFormat"
        :value-format="timeFormat"
        :picker-options="{
          format: timeFormat
        }"

        placeholder="时间"
        @change="onChange"
        @focus="onFocus"
      />
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import { DatePicker, TimeSelect, TimePicker } from 'element-ui'
Vue.use(DatePicker).use(TimeSelect).use(TimePicker)
import moment from 'moment'
const __format__ = 'YYYY-MM-DD HH:mm:ss'
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
    ...DatePicker.$props,
    type: {
      type: String,
      require: false,
      default: 'datetime'
    },
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
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: true
    },
    clearable: {
      type: Boolean,
      default: true
    },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dateFormat: '',
      timeFormat: '',
      dateValue: '',
      timeValue: '',
      defaultValue: moment().format(__format__),
      options: {}
    }
  },
  computed: {

  },
  watch: {
    format(val) {
      const _format = this.parseFormat(val)
      this.dateFormat = _format.date
      this.timeFormat = _format.time
    },
    maxDate(val) {
      this.updateOptions(this.minDate, val)
    },
    minDate(val) {
      this.updateOptions(val, this.maxDate)
    },
    value: {
      handler(val) {
        this.pickValue = val
        if (this.pickValue) {
          this.defaultValue = this.pickValue
          // else this.defaultValue = moment().format(__format__)

          const res = this.parseValue(this.defaultValue)
          this.dateValue = res.date
          this.timeValue = res.time
        }
      },
      immediate: true
    }

  },
  mounted() {
    // debugger
    // this.pickValue = this.value
    const _format = this.parseFormat(this.format)
    this.dateFormat = _format.date
    this.timeFormat = _format.time
    // this.updateOptions(this.minDate, this.maxDate)
    // this.$forceUpdate()
  },
  methods: {
    updateOptions(min, max) {
      if (!this.options || (!min && !max)) this.options = {}
      this.options.disabledDate = time => {
        let result = false
        if (min) {
          result = result || time.getTime() < new Date(min)
        }
        if (max) {
          result = result || time.getTime() > new Date(max)
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
    },
    parseValue(value) {
      const result = {
        date: '',
        time: ''
      }
      const _value = moment(value)
      result.date = _value.format('yyyy-MM-DD')
      result.time = _value.format('HH:mm')
      return result
    },
    parseFormat(format) {
      const result = {
        date: 'yyyy-MM-dd',
        time: 'HH:mm'
      }
      const segments = format.split(' ')
      if (!segments || segments.length <= 0) {
        return result
      }
      result.date = segments[0]
      if (segments.length >= 1) result.time = segments[1]
      return result
    },
    buildDatetimeValue(date, time) {
      if (!date && !time) {
        return null
      } else if (!date || !time) {
        return 'Invalid date'
      }

      let _date = moment(`${date}`)
      if (time && time !== '') {
        _date = moment(`${date}T${time}`)
      }
      // const _time = moment(time)
      // _date.set('hour', _time.get('hour'))
      // _date.set('minute', _time.get('minute'))
      // _date.set('second', _time.get('second'))
      return _date.format(__format__)
    },
    onDateBlur() {
      const _value = this.buildDatetimeValue(this.dateValue, this.timeValue)
      if (_value !== 'Invalid date') {
        this.$emit('_change', _value)
        this.$emit('change', _value)
      }
    },
    onTimeBlur() {
      const _value = this.buildDatetimeValue(this.dateValue, this.timeValue)
      if (_value !== 'Invalid date') {
        this.$emit('_change', _value)
        this.$emit('change', _value)
      }
    },
    onChange() {
      const _value = this.buildDatetimeValue(this.dateValue, this.timeValue)
      if (_value !== 'Invalid date') {
        this.$emit('_change', _value)
        this.$emit('change', _value)
      }
    },
    onFocus() {
      if (!this.value) {
        const _cur = moment().format(__format__)
        const res = this.parseValue(_cur)
        this.dateValue = res.date
        this.timeValue = res.time
        this.onChange()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .med-datetime-wrapper {
     display: flex;
     flex-flow: row;
    // justify-content: space-around;
    // align-items: center;
    .date-part {

      flex-grow: 1;
      flex-shrink: 3;
      .el-date-editor.el-input {
        min-width: 120px;
        width: 100%;
      }
    }
    .space {
      width: 2%;
    }
    .time-part {
      width:100px;
      flex-grow: 1;
      flex-shrink: 1;
      .el-date-editor.el-input {
        min-width: 100px;
        width: 100%;
      }
    }

  }
</style>
