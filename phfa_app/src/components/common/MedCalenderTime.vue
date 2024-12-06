<template>
  <van-popup
    v-model="show"
    position="bottom"
    safe-area-inset-bottom
    class="calendar"
    :close-on-click-overlay="false"
    @closed="handleCalendarClosed"
    @opened="handleCalendarOpened"
  >
    <van-calendar
      ref="calendar"
      :poppable="false"
      allow-same-day
      color="#101a52"
      :type="isRange ? 'range' : 'single'"
      :close-on-click-overlay="false"
      @confirm="onCalendarConfirm"
      @select="onCalendarSelect"
      :default-date="defaultDate"
      :minDate="minDate"
    >
      <div slot="title" class="calendar-header flex-c-c">
        <van-icon class="icon" name="cross" @click="handleBack" />
        <div class="title">{{ pickerTitle }}</div>
        <span class="clear" v-show="startDate" @click.stop="handleClearDate">
          清除
        </span>
      </div>
      <div slot="footer" class="calendar-footer flex-c-b flex-y-center">
        <div class="flex-box f-14 text">
          <p>开始时间：{{ start }}</p>
          <p v-show="isRange">结束时间：{{ end }}</p>
        </div>
        <van-button
          color="#101a52"
          :disabled="isDisabled"
          @click="onCalendarConfirm"
        >
          确定
        </van-button>
      </div>
    </van-calendar>
    <van-popup
      v-model="showPicker"
      round
      class="timer"
      position="bottom"
      @opened="handlePopupOpen"
    >
      <van-picker
        item-height="100"
        class="timer-picker"
        ref="picker"
        show-toolbar
        :columns="columns"
        @cancel="showPicker = false"
        @change="onPickerChange"
        swipe-duration="500"
        visible-item-count="5"
      >
        <div class="picker-title">{{ pickerText }}</div>
      </van-picker>
    </van-popup>
  </van-popup>
</template>

<script>
function initData() {
  return {
    pickerText: '开始时间',
    show: true,
    isDisabled: true,
    showPicker: false,
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: ''
  }
}

export default {
  name: 'MedCalenderTime',
  props: {
    isRange: {
      type: Boolean,
      default: false
    },
    pickerTitle: {
      type: String,
      default: '日期选择'
    },
    defaultDate: {
      default: null
    }
  },
  data() {
    return {
      minDate: this.$moment()
        .subtract(5, 'months')
        .toDate(),
      maxDate: new Date(),
      columns: [
        {
          values: [
            '00',
            '01',
            '02',
            '03',
            '04',
            '05',
            '06',
            '07',
            '08',
            '09',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19',
            '20',
            '21',
            '22',
            '23'
          ],
          defaultIndex: 0
        },
        {
          values: [
            '00',
            '01',
            '02',
            '03',
            '04',
            '05',
            '06',
            '07',
            '08',
            '09',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19',
            '20',
            '21',
            '22',
            '23',
            '24',
            '25',
            '26',
            '27',
            '28',
            '29',
            '30',
            '31',
            '32',
            '33',
            '34',
            '35',
            '36',
            '37',
            '38',
            '39',
            '40',
            '41',
            '42',
            '43',
            '44',
            '45',
            '46',
            '47',
            '48',
            '49',
            '50',
            '51',
            '52',
            '53',
            '54',
            '55',
            '56',
            '57',
            '58',
            '59'
          ],
          defaultIndex: 0
        },
        {
          values: [
            '00',
            '01',
            '02',
            '03',
            '04',
            '05',
            '06',
            '07',
            '08',
            '09',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19',
            '20',
            '21',
            '22',
            '23',
            '24',
            '25',
            '26',
            '27',
            '28',
            '29',
            '30',
            '31',
            '32',
            '33',
            '34',
            '35',
            '36',
            '37',
            '38',
            '39',
            '40',
            '41',
            '42',
            '43',
            '44',
            '45',
            '46',
            '47',
            '48',
            '49',
            '50',
            '51',
            '52',
            '53',
            '54',
            '55',
            '56',
            '57',
            '58',
            '59'
          ],
          defaultIndex: 0
        }
      ],
      ...initData()
    }
  },
  watch: {
    startDate() {
      if (this.isRange) this.isDisabled = true
      else this.isDisabled = false
    },
    endTime(val) {
      if (!val) return
      if (this.$moment(this.end).isBefore(this.$moment(this.start))) {
        this.startTime = this.endTime
      }
      this.isDisabled = false
    }
  },
  computed: {
    start() {
      return this.startDate ? this.startDate + ' ' + this.startTime : ''
    },
    end() {
      return this.endDate ? this.endDate + ' ' + this.endTime : ''
    }
  },
  methods: {
    handleBack() {
      const val = this.isRange ? [] : ''
      this.$emit('cancel', val)
    },
    // 清空
    handleClearDate() {
      this.$refs.calendar.reset()
      Object.assign(this.$data, {
        pickerText: '开始时间',
        isDisabled: true,
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: ''
      })
    },
    handleCalendarOpened() {
      const calendarBody = document.getElementsByClassName(
        'van-calendar__body'
      )[0]
      calendarBody.scrollTo({
        top: calendarBody.scrollHeight,
        behavior: 'smooth'
      })
    },
    handleCalendarClosed() {
      this.$refs.calendar.reset()
      Object.assign(this.$data, initData())
    },
    handlePopupOpen() {
      if (this.pickerText === '开始时间') {
        this.$refs.picker.setIndexes([8, 0, 0])
      }
      const value = this.$refs.picker.getValues()
      const str = value.join(':')
      if (this.pickerText === '开始时间') {
        this.startTime = str
        return
      }
      this.endTime = str
    },
    onCalendarConfirm() {
      if (!this.start) {
        this.$notify({ type: 'danger', message: '请选择时间！' })
        return
      }
      if (this.isRange) {
        this.$emit('submit', [this.start, this.end])
      } else {
        this.$emit('submit', this.start)
      }
    },
    onCalendarSelect(val) {
      if (val[1] && this.isRange) {
        this.endDate = this.$moment(val[1]).format('YYYY-MM-DD')
        this.pickerText = '结束时间'
      } else {
        if (this.end) {
          this.endDate = ''
          this.endTime = ''
        }
        const result = this.isRange ? val[0] : val
        this.startDate = this.$moment(result).format('YYYY-MM-DD')
        this.pickerText = '开始时间'
      }
      this.showPicker = true
    },
    onPickerChange(el, value) {
      const str = value.join(':')
      if (this.pickerText === '开始时间') {
        this.startTime = str
        return
      }
      this.endTime = str
    }
  }
}
</script>

<style scoped lang="less">
.calendar {
  width: 100%;
  height: 50%;
  border-top-left-radius: 50px;
  border-top-right-radius: 50px;
  .calendar-header {
    position: relative;

    .icon {
      position: absolute;
      left: 8px;
      top: 50%;
      width: 24px;
      height: 24px;
      line-height: 24px;
      padding: 0 6px;
      transform: translateY(-50%);
    }

    .title {
      text-align: center;
    }

    .clear {
      position: absolute;
      right: 8px;
      top: 50%;
      height: 24px;
      line-height: 24px;
      font-size: 24px;
      padding: 0 6px;
      color: red;
      transform: translateY(-50%);
    }
  }

  .calendar-footer {
    padding: 6px 0;

    .text {
      line-height: 20px;
      p {
        font-size: @font-md-size;
        line-height: 2;
      }
    }
  }

  /deep/ .van-picker__toolbar {
    justify-content: center;
    font-weight: 500;
  }
}
</style>
