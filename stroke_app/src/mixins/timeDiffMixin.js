import { emrStatus } from '@constant/commonConstant'
const dateTimeFormat = 'YYYY-MM-DD HH:mm'
export default {
  data() {
    return {
      emrStatus,
      now: this.$moment(),
      timer: undefined
    }
  },
  computed: {
    /**
     * 距最后正常时间
     * @returns {string|undefined}
     */
    fromLastHealthyTime() {
      const label = '距已发病：'
      const tempDate =
        this.details.onsetTime || this.details.lastHealthyTime || undefined
      if (!tempDate) {
        return label
      }
      const date = this.$moment(tempDate, dateTimeFormat)
      // 相差的分钟数
      let diffMinute
      // 未完成则计算时间差
      if (this.details.status === this.emrStatus.archived) {
        if (this.details.status === '') {
          return label
        }
        const completeTimeTemp = this.$moment(
          this.details.completeTime,
          dateTimeFormat
        )
        diffMinute = completeTimeTemp.diff(date, 'minute')
      } else {
        diffMinute = this.now.diff(date, 'minute')
      }
      // 相差的小时数
      const hour = Math.floor(diffMinute / 60)
      // 计算相差小时后余下的分钟数
      const minute = diffMinute % 60
      const diff = `${label}${hour}小时${minute}分钟`
      return diff
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    startTimer() {
      this.timer = setInterval(() => {
        this.now = this.$moment()
      }, 1000)
    }
  }
}
