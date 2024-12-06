<template>
  <div class="fuzzy-date-picker-wrapper flex-c-b" @click="showPicker">
    <div class="fuzzy-date-picker-placeholder" v-if="!value">
      {{ placeholder }}
    </div>
    <div class="fuzzy-date-picker-value" v-if="value">{{ transedValue }}</div>
    <div @click.stop v-if="showSwitch" class="switch">
      <ISwitch
        size="large"
        true-color="#5e74fe"
        v-model="fuzzyMode"
        true-value="1"
        false-value="0"
        @on-change="onSwitchChange"
      >
        <span slot="open">区间</span>
        <span slot="close">精确</span>
      </ISwitch>
    </div>
    <van-popup
      v-model="pickerVisible"
      position="bottom"
      @click.stop
      get-container="body"
    >
      <van-datetime-picker
        class="fuzzy-date-picker"
        :value="pickerValue"
        :type="pickerType"
        title="选择时间"
        :filter="pickerFilter"
        :formatter="pickerFormatter"
        @confirm="onConfirm"
        @cancel="pickerVisible = false"
        item-height="1.4rem"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'FuzzyDatetimePicker',
  props: {
    placeholder: {
      type: String,
      default: '请选择时间'
    },
    value: String,
    input: {
      type: Function,
      default: () => {}
    },
    fuzzy: {
      type: String,
      default: '1'
    },
    ranges: {
      type: Array,
      default: () => []
    },
    showSwitch: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      pickerVisible: false
    }
  },
  computed: {
    fuzzyMode: {
      get() {
        return this.fuzzy
      },
      set(val) {
        this.$emit('update:fuzzy', val)
      }
    },
    isFuzzy() {
      return this.fuzzy === '1'
    },
    aliasMap() {
      const map = {}
      this.ranges.forEach(item => {
        map[item.value] = item.label
      })
      return map
    },
    valueMap() {
      const map = {}
      this.ranges.forEach((item, index) => {
        const key = `0${index}`.slice(-2)
        map[key] = item
      })
      return map
    },
    transedValue() {
      if (!this.isFuzzy) {
        return this.value
          ? this.$moment(this.value).format('YYYY-MM-DD HH:mm')
          : ''
      }
      const val = this.value || ''
      const [start, end] = val.split('~')
      if (end) {
        const prefix = this.$moment(start).format('YYYY-MM-DD')
        const startHour = start.slice(11, 13)
        const endHour = end.slice(11, 13)
        const key = `${parseInt(startHour)}-${parseInt(endHour)}`
        const suffix = this.aliasMap[key]
        return prefix + ' \n' + suffix
      }
      return start
    },
    pickerValue() {
      if (!this.isFuzzy) {
        return this.value
          ? this.$moment(this.value).toDate()
          : this.$moment().toDate() // 没有值时 面板默认选中此刻
      }
      const val = this.value || ''
      const [start, end] = val.split('~')
      if (end) {
        const prefix = this.$moment(start).format('YYYY-MM-DD')
        const startHour = start.slice(11, 13)
        const endHour = end.slice(11, 13)
        const key = `${parseInt(startHour)}-${parseInt(endHour)}`
        const index = this.ranges.findIndex(opt => opt.value === key)
        if (index >= 0) {
          const realValue = this.$moment(
            prefix + ' ' + ` 0${index}`.slice(-2)
          ).toDate()
          return realValue
        }
      }
      if (start) {
        return this.$moment(start).toDate()
      }

      // 控件没有值时 面板默认选中当前时间所属的时间范围
      const nowHour = Number(this.$moment().format('HH'))
      const thisMomentRangeIndex = this.ranges.findIndex(opt => {
        const [s, e] = opt.value.split('-')
        return (
          opt.value !== '0-24' && Number(s) <= nowHour && Number(e) >= nowHour
        )
      })
      if (thisMomentRangeIndex >= 0) {
        return this.$moment(
          this.$moment().format('YYYY-MM-DD') +
            ' ' +
            ` 0${thisMomentRangeIndex}`.slice(-2)
        ).toDate()
      }

      return this.$moment().toDate()
    },
    pickerType() {
      return this.isFuzzy ? 'datehour' : 'datetime'
    }
  },
  methods: {
    onSwitchChange(val) {
      this.$emit('update:fuzzy', val)
      this.$emit('input', '')
      this.$emit('change', '')
    },
    showPicker() {
      this.pickerVisible = true
    },
    pickerFilter(type, vals) {
      if (!this.isFuzzy) {
        return vals
      }
      const visibleVals = this.ranges.map((item, index) => {
        return `0${index}`.slice(-2)
      })
      return type === 'hour' ? visibleVals : vals
    },
    pickerFormatter(type, val) {
      const map = {
        year: '年',
        month: '月',
        day: '日',
        hour: '时',
        minute: '分'
      }
      const suffix = map[type]
      if (!this.isFuzzy || type !== 'hour') {
        return val + suffix
      }
      return (this.valueMap[val] || {}).label
    },
    onConfirm(val) {
      this.pickerVisible = false
      if (!this.isFuzzy) {
        this.$emit('input', this.$moment(val).format('YYYY-MM-DD HH:mm:ss'))
        this.$emit('change', this.$moment(val).format('YYYY-MM-DD HH:mm:ss'))
      } else {
        const range = (this.valueMap[this.$moment(val).format('HH')] || {})
          .value
        if (range) {
          const date = this.$moment(val).format('YYYY-MM-DD')
          const newValue = range
            .split('-')
            .map(str => {
              const hour = `0${str}`.slice(-2)
              return date + ' ' + hour + ':00'
            })
            .join('~')
          this.$emit('input', newValue)
          this.$emit('change', newValue)
        }
      }
    }
  }
}
</script>

<style lang="less">
.fuzzy-date-picker {
  &-placeholder {
    color: rgba(0, 0, 0, 0.26);
  }
  &-value {
    color: rgba(0, 0, 0, 0.8);
    // font-size: 0.366rem;
    white-space: pre-line;
  }
  .van-picker__columns .van-picker-column {
    flex: 1 1 auto;
  }
}
</style>
