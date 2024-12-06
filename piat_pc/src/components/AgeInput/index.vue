<template>
  <a-row class="ant-input age-input">
    <a-col span="6">
      <a-input size="small" :value="years" @change="handleAgeChange" @focus="handleFocus" />
    </a-col>
    <a-col span="2" class="grey-text">岁</a-col>
    <a-col span="6">
      <a-input :disabled="years >= 2" size="small" :value="months" @change="handleMonthChange" @focus="handleFocus" />
    </a-col>
    <a-col span="2" class="grey-text">月</a-col>
    <a-col span="6">
      <a-input
        :disabled="years >= 1"
        size="small"
        :maxLength="2"
        :value="days"
        @change="handleDayChange"
        @focus="handleFocus"
      />
    </a-col>
    <a-col span="2" class="grey-text">日</a-col>
  </a-row>
</template>

<script>
import moment from 'moment'
export default {
  name: 'AgeInput',
  props: {
    value: {
      type: [String, Number],
      default: 0 // 年龄
    },
    caption: {
      type: String,
      default: '' // 补充年龄
    },
    change: {
      type: Function,
      default: () => {}
    },
    startDay: {
      type: [String, Object],
      default: ''
    },
    endDay: {
      type: [String, Object],
      default: ''
    }
  },
  data() {
    return {
      // years: '',
      // months: '',
      // days: ''
    }
  },
  computed: {
    years() {
      return this.splitDate.years
    },
    months() {
      return this.splitDate.months
    },
    days() {
      return this.splitDate.days
    },
    range() {
      return { startDay: this.shortStartDay, endDay: this.shortEndDay }
    },
    shortStartDay() {
      // 剪短日期,避免时间干扰
      return this.startDay ? moment(this.startDay).format('YYYY-MM-DD') : ''
    },
    shortEndDay() {
      // 剪短日期,避免时间干扰
      return this.endDay ? moment(this.endDay).format('YYYY-MM-DD') : ''
    },
    splitDate() {
      const parse = reg => {
        if (reg.test(this.caption)) {
          return parseInt(this.caption.replace(reg, '$1')) || 0
        }
        return 0
      }

      return {
        days: parse(/\d*月(\d*)日/),
        months: parse(/.*?(\d*)月.*/),
        years: parse(/(\d*)岁.*/)
      }
    }
  },
  methods: {
    genCaption(years, months, days) {
      let newCaption = this.caption
      if (years >= 2) {
        newCaption = `${years}岁`
      } else if (years === 1) {
        newCaption = `1岁${months}月`
      } else {
        newCaption = `${months}月${days}日`
      }
      return newCaption
    },
    // trimmNum(num) {
    //   // 剪短小数尾数,无需过高精度
    //   return parseFloat(num.toFixed(4))
    // },
    handleFocus(e) {
      e.target.select()
    },
    handleAgeChange(e) {
      const { value } = e.target
      const num = parseInt(value)
      if (!isNaN(num) && num >= 0) {
        this.$emit('input', num || 1)
        const { days, months, years } = this.splitDate

        const newCaption = this.genCaption(num, months, days)

        if (this.caption !== newCaption) {
          this.$emit('update:caption', newCaption)
        }
      }
    },
    handleMonthChange(e) {
      const { value } = e.target
      const num = parseInt(value)
      if (!isNaN(num) && num >= 0 && num < 12) {
        const { days, months, years } = this.splitDate
        const newCaption = this.genCaption(years, num, days)
        if (this.caption !== newCaption) {
          this.$emit('update:caption', newCaption)
        }
      }
    },
    handleDayChange(e) {
      const { value } = e.target
      const num = parseInt(value)
      if (!isNaN(num) && num >= 0 && num < 31) {
        const { days, months, years } = this.splitDate
        const newCaption = this.genCaption(years, months, num)
        if (this.caption !== newCaption) {
          this.$emit('update:caption', newCaption)
        }
      }
    }
    // triggerEmit() {
    //   // 触发v-model
    //   let newVal
    //   const splitVal = {
    //     years: Number(this.years),
    //     months: Number(this.months),
    //     days: Number(this.days)
    //   }
    //   if (this.shortStartDay) {
    //     newVal = moment(moment(this.shortStartDay).add(splitVal)).diff(moment(this.shortStartDay), 'year', true)
    //   } else if (this.shortEndDay) {
    //     newVal = moment(moment(this.shortEndDay)).diff(moment(this.shortEndDay).subtract(splitVal), 'year', true)
    //   }
    //   if (!isNaN(newVal)) {
    //     this.$emit('input', this.trimmNum(newVal))
    //     this.change(splitVal)
    //   }
    // }
  },
  watch: {
    value(val) {
      // // val是整数,这里依据生日换算出月份和天数
      // const startDay = moment(this.shortStartDay)
      // const years = Math.floor(val)
      // let months = 0
      // let days = 0
      // if (years < 2 && years < val) {
      //   const endDay = startDay.clone()
      //   do {
      //     endDay.add(1, 'day')
      //   } while (this.trimmNum(endDay.diff(startDay, 'year', true)) < val)
      //   months = endDay.diff(startDay.add({ year: years }), 'month')
      //   days = endDay.diff(startDay.add({ month: months }), 'day')
      // }
      // this.years = years
      // this.months = months
      // this.days = days
    },
    range(newRange) {
      const { startDay, endDay } = newRange
      if (startDay && endDay) {
        const years = moment(endDay).diff(moment(startDay), 'year')
        const months = moment(endDay).diff(moment(startDay).add(years, 'Y'), 'month')
        const days = moment(endDay).diff(moment(startDay).add({ years, months }), 'days')

        const newCaption = this.genCaption(years, months, days)
        if (this.caption !== newCaption) {
          this.$emit('update:caption', newCaption)
        }

        if (this.value !== (years || 1)) {
          this.$emit('input', years || 1)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.age-input {
  display: flex;

  padding: 0 6px 0 0;
  margin: 4px 0;
  .grey-text {
    color: #aaa;
    line-height: 30px;
  }
  /deep/ input.ant-input {
    border: none;
    padding: 0;
    width: calc(100% - 6px);
    height: 30px;
    line-height: 30px;
    text-align: right;
    background-color: transparent;
  }
}
</style>
