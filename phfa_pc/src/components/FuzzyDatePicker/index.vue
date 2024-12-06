<template>
  <el-row
    type="flex"
    :class="['fuzzy-date-picker', bordered ? '' : 'no-border']"
  >
    <el-col :span="showSwitch ? 9 : 11">
      <el-date-picker
        v-model="date"
        :readonly="readonly"
        type="date"
        placeholder="选择日期"
        value-format="yyyy-MM-dd"
        format="yyyy-MM-dd"
        :size="size"
        style="width: 100%"
        @change="onDateChange"
      />
    </el-col>
    <el-col :span="showSwitch ? 10 : 13" class="select-wrapper">
      <med-select
        v-if="isMorb === '1'"
        v-model="range"
        :readonly="readonly"
        :size="size"
        :options="dictionary[dic.onsetTime]"
        placeholder="选择时间段"
        @change="onRangeChange"
      />
      <el-time-select
        v-else
        v-model="time"
        :readonly="readonly"
        :size="size"
        :picker-options="{
          start: '00:00',
          step: '00:05',
          end: '23:50'
        }"
        placeholder="选择精确时间"
        class="time-picker"
        @change="onTimeChange"
      />
    </el-col>
    <el-col v-if="showSwitch" :span="5" :class="['switch-wrapper', size]">
      <el-switch
        v-model="isFuzzy"
        :disabled="readonly"
        :size="size"
        inactive-color="#07c160"
      />
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex'
import { dicConstant as dic } from '@/constant'
import MedSelect from '@/components/MedSelect/Select'
export default {
  name: 'FuzzyDatePicker',
  components: { MedSelect },
  props: {
    value: {
      type: String,
      default: ''
    },
    isMorb: {
      type: String,
      default: '0'
    },
    size: {
      type: String,
      default: 'small'
    },
    showSwitch: {
      type: Boolean,
      default: true
    },
    bordered: {
      type: Boolean,
      default: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dic,
      date: '',
      range: '',
      time: ''
    }
  },
  computed: {
    ...mapGetters(['dictionary']),
    isFuzzy: {
      get() {
        return this.isMorb === '1'
      },
      set(v) {
        this.range = ''
        this.time = ''
        this.$emit('update:isMorb', v ? '1' : '0')
        this.$nextTick(() => {
          this.onDateChange(this.date)
        })
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(v) {
        this.parseValue(v)
      }
    }
  },
  methods: {
    emitValue(dateTime) {
      let formatedVal
      const date = dateTime.slice(0, 10)
      if (dateTime && this.$moment(date).isValid()) {
        if (this.isFuzzy) {
          formatedVal = dateTime
            .split('~')
            .map(
              (str, idx) =>
                // date + this.$moment(str).format(`[T]${idx ? 'kk' : 'HH'}:mm:ss`)
                date + this.$moment(str).format(` ${idx ? 'kk' : 'HH'}:mm:ss`)
            )
            .join('~')
        } else {
          // formatedVal = this.$moment(dateTime).format('YYYY-MM-DD[T]HH:mm:ss')
          formatedVal = this.$moment(dateTime).format('YYYY-MM-DD HH:mm:ss')
        }
      }

      this.$emit('input', formatedVal)
    },
    onRangeChange(range) {
      const [startHour, endHour] = (range || '').split('-')
      if (endHour) {
        const fullStart = `0${startHour}`.slice(-2) + ':00'
        const fullEnd = `0${endHour}`.slice(-2) + ':00'
        const nVal = `${
          this.date || this.$moment().format('YYYY-MM-DD')
        } ${fullStart}~${
          this.date || this.$moment().format('YYYY-MM-DD')
        } ${fullEnd}`
        this.emitValue(nVal)
      }
    },
    onTimeChange(time) {
      this.emitValue(
        `${this.date || this.$moment().format('YYYY-MM-DD')} ${time}`
      )
    },
    onDateChange(val) {
      if (val) {
        if (this.isFuzzy) {
          const [startHour, endHour] = (this.range || '').split('-')
          if (endHour) {
            const fullStart = `0${startHour}`.slice(-2) + ':00'
            const fullEnd = `0${endHour}`.slice(-2) + ':00'
            const nVal = `${val} ${fullStart}~${val} ${fullEnd}`
            this.emitValue(nVal)
          } else {
            this.emitValue(`${val} 00:00~${val} 24:00`)
          }
        } else {
          this.emitValue(val + ' ' + (this.time || '00:00'))
        }
      } else {
        this.emitValue('')
      }
    },
    // 解析值
    parseValue(val) {
      if (val) {
        // 值有两种情况 2022-05-16T15:05:00  |  2022-05-16T14:00:00~2022-05-16T17:00:00
        const cleanVal = val.replace(/T/g, ' ')
        const [start = '', end = ''] = cleanVal.split('~')

        if (this.isFuzzy) {
          // 时间是一个范围
          this.date = start.slice(0, 10)
          const startHour = start.slice(11, 13)
          const endHour = end.slice(11, 13)
          const key = `${parseInt(startHour)}-${parseInt(endHour)}`
          this.range = key
          this.time = ''
        } else {
          // 时间是一个精确值
          const [date, time] = start.split(' ')
          this.date = date
          this.range = ''
          this.time = time
        }
      } else {
        this.date = ''
        this.range = ''
        this.time = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.fuzzy-date-picker {
  &.no-border {
    ::v-deep .el-input__inner {
      border: none;
    }
  }
  .time-picker {
    // width: auto;
  }
  .select-wrapper:not(:last-child) {
    ::v-deep .el-input__inner {
      border-right: none;
      border-radius: 4px 0 0 4px;
    }
  }
  .switch-wrapper {
    &.mini ::v-deep .el-switch {
      height: 28px;
      width: 100%;
      justify-content: end;
    }
    ::v-deep .el-switch {
      border: solid 1px #dfe4ed;
      height: 32px;
      vertical-align: baseline;
      border-left: none;
      border-radius: 0 5px 5px 0;
      padding-right: 4px;
      .el-switch__core {
        min-width: 50px;
        height: 22px;
        line-height: 22px;
        border-radius: 11px;
        &:before {
          content: '精确';
          color: #fff;
          font-size: 12px;
          vertical-align: top;
          margin-left: 21px;
        }
        &:after {
          height: 18px;
          width: 18px;
        }
      }
      &.is-checked .el-switch__core {
        &:before {
          content: '模糊';
          margin-left: 2px;
        }
        &:after {
          margin-left: -19px;
        }
      }
    }
  }
  ::v-deep .el-input__inner {
    padding: 0 2px 0 6px;
    &:focus {
      border-color: #dcdfe6;
    }
  }
  ::v-deep .el-input__suffix {
    display: none;
  }
  ::v-deep .el-input__prefix {
    display: none;
  }
}
</style>
