<template>
  <div>
    <el-divider content-position="left">
      <b class="timeline-title">时间轴</b>
    </el-divider>

    <el-timeline class="timeline">
      <el-timeline-item v-for="(item, index) in timeline" :key="index" type="info">
        <div class="time-title">{{ item.nodeName }}</div>
        <div v-if="item.indexList && item.indexList.length" class="time-diff">
          <el-row
            v-for="el in item.indexList"
            :key="el.countdownName"
            class="time-diff-item"
            :class="{ abnormal: el.countdowncolor === 'red' }"
            :gutter="12"
          >
            <el-col :span="15">{{ el.countdownName }}</el-col>
            <el-col :span="9">{{ el.countdownTime }}min</el-col>
          </el-row>
        </div>
        <template #dot>
          <div :class="{ dot: true, 'is-date': !item.nodeName }">
            {{ item.timeValue }}
          </div>
        </template>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { getTimeline } from '@/api/patient/timeline'
import moment from 'moment'
export default {
  filters: {
    DateTimeFormat(val) {
      return moment(val).format('YYYY-MM-DD HH:mm')
    }
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    placement: {
      type: String,
      default: 'top'
    }
  },
  data() {
    return {
      timeline: []
    }
  },
  computed: {
    validTimeNodes() {
      return this.timeline.filter(() => true)
    }
  },
  async mounted() {
    this.getTimelineY()
  },
  methods: {
    async getTimelineY() {
      const { result } = await getTimeline({ registid: this.id }) || { autoTimesList: [] }
      const sortedArr = result.autoTimesList

      let moreDays = sortedArr.length === 0
      let currentDate
      for (let i = sortedArr.length - 1; i >= 0; i--) {
        const curItem = sortedArr[i]
        const prevItem = sortedArr[i - 1]
        const [date, time] = curItem.timeValue
          ? moment(curItem.timeValue)
            .format('YYYY-MM-DD HH:mm')
            .split(' ')
          : []
        const isInSameDay = moment(prevItem?.timeValue).format('YYYY-MM-DD') === date
        if (!isInSameDay) {
          // 在日期变化间隙插入日期分隔节点
          sortedArr.splice(i, 0, { timeValue: date })
          moreDays = true
        }
        curItem.timeValue = time
        currentDate = date
      }

      if (!moreDays) sortedArr.splice(0, 0, { timeValue: currentDate })

      this.timeline = sortedArr
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/variables.scss';

.timeline-title {
  color: $blue;
}

.timeline {
  padding-left: 0;

  ::v-deep .el-timeline-item {
    display: flex;
    min-height: 42px;
    padding-bottom: 0;

    &__tail {
      left: 43px;
    }

    &__dot {
      width: 88px;
      color: #435372;
      text-align: center;
      background: #fff;
    }

    &__wrapper {
      line-height: 32px;
      padding-left: 84px;
      width: 100%;
    }
  }

  .time-title {
    color: #435372;
  }

  .time-diff {
    font-size: 14px;

    .time-diff-item {
      border-radius: 5px;
      line-height: 1.6;
      background-color: #ECF5FF;
      color: #4b60fd;

      &+.time-diff-item {
        margin-top: 5px;
      }

      &.abnormal {
        color: rgb(255, 78, 78);
        background-color: #FEF0F0;
      }
    }
  }

  .dot {
    line-height: 1.8;

    &.is-date {
      font-size: 15px;
      font-weight: 550;
    }
  }
}
</style>
