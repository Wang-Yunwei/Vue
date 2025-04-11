<template>
  <div class="timeline-panel">
    <div class="time-qc">
      <p>
        <span>{{ countdown.s2fmcTime ? countdown.s2fmcTime : '--' }}</span>
        <span>min</span>
        <span>S2FMC</span>
      </p>
      <p>
        <span>{{ countdown.fmc2ecgTime ? countdown.fmc2ecgTime : '--' }}</span>
        <span>min</span>
        <span>FMC2ECG</span>
      </p>
      <p>
        <span>{{ countdown.d2wTime ? countdown.d2wTime : '--' }}</span>
        <span>min</span>
        <span>D2W</span>
      </p>
      <p>
        <span>{{ countdown.fmc2wTime ? countdown.fmc2wTime : '--' }}</span>
        <span>min</span>
        <span>FMC2W</span>
      </p>
      <p>
        <span>{{ countdown.d2nTime ? countdown.d2nTime : '--' }}</span>
        <span>min</span>
        <span>D2N</span>
      </p>
    </div>
    <div class="time-axis">
      <ul class="time-axis__content" v-if="dataSource && dataSource.length">
        <li
          class="flex-c-s time-axis__item"
          v-for="item in dataSource"
          :key="item.nodeName"
        >
          <van-icon :name="item.timeValue ? 'clock' : 'clock-o'" />
          <div class="time-axis__right">
            <div class="time-axis__title">
              <div class="time-axis__nodename">{{ item.nodeName }}</div>
              <div v-if="item.indexList && item.indexList.length > 0">
                <div
                  v-for="indexItem in item.indexList"
                  :style="{
                    color: indexItem.countdowncolor,
                    'line-height': 1.3
                  }"
                  :key="indexItem.countdownName"
                >
                  {{ indexItem.countdownName }}
                </div>
              </div>
            </div>
            <div class="time-axis__time">
              <template>
                <div>
                  <!-- {{ item.timeValue }} -->
                  <!-- :disabled="
                      disabled === '1' ||
                        countdown.isCompleted === '21' ||
                        countdown.isCompleted === '31' ||
                        countdown.isCompleted === '41'
                    " -->
                  <med-date-picker
                    v-model="item.timeValue"
                    :border="false"
                    :readonly="true"
                    @confirm="onEdit($event, item)"
                  />
                </div>
              </template>
              <div v-if="item.indexList && item.indexList.length > 0">
                <div
                  v-for="indexItem in item.indexList"
                  :style="{
                    color: indexItem.countdowncolor,
                    'line-height': 1.3
                  }"
                  :key="indexItem.countdownName"
                >
                  {{ indexItem.countdownTime
                  }}{{ indexItem.countdownTime ? 'min' : '' }}
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <van-empty
        :image="require('@assets/image/empty.png')"
        description="暂无数据"
        v-if="!dataSource || !dataSource.length"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { debounce } from 'lodash'
export default {
  props: {
    disabled: {
      required: false,
      type: Boolean
    }
  },
  data() {
    return {
      registId: this.$route.query.registId,
      edittingItem: '',
      dataSource: [], // 时间轴
      countdown: {
        isCompleted: '', // 是否归档
        finallyNormallCountdown: '', // 距最后正常时间
        s2fmcTime: '', // S2FMC：发病时间-首次医疗接触时间
        fmc2ecgTime: '', // FMC2ECG：首次医疗接触时间-首份心电图时间
        d2wTime: '', // D2W：到院时间-导丝通过时间
        fmc2wTime: '', // FMC2W：首次医疗接触时间-导丝通过时间
        d2nTime: '' // D2N：到院时间-开始溶栓时间
      },
      timeline: {
        id: '',
        entityClassMapping: '',
        editable: '',
        fieldName: '',
        isCorrectOrder: '',
        nodeName: '',
        order: '',
        tableName: '',
        timeValue: '',
        countdownName: '',
        countdownTime: '',
        countdowncolor: ''
      }
    }
  },
  created() {
    this.init()
  },
  computed: {
    ...mapGetters(['missionId'])
  },
  methods: {
    // 跳转页面
    jump() {
      if (this.$route.path !== '/gc/timeManagement/timeCollection') {
        this.$router.push({
          path: '/gc/timeManagement/timeCollection',
          query: { registId: this.registId }
        })
      }
    },
    init() {
      // this.getDiagnosisTime()
      // this.getCountdown()
      this.getTimeAxis()
    },
    // 获取时间轴
    getDiagnosisTime() {
      this.$api.timeManagement.getTimeline(this.registId).then(res => {
        this.dataSource = res.result
      })
    },
    // 获取倒计时数据
    getCountdown() {
      this.$api.timeManagement.getCountdown(this.registId).then(res => {
        this.countdown = { ...res.result }
      })
    },
    // 获取时间轴
    getTimeAxis() {
      this.$api.timeManagement.getTimeAxis(this.registId).then(res => {
        this.dataSource = res.result.autoTimesList
        this.countdown = res.result.timeCountdown
      })
    },
    onEdit: debounce(function(newVal, item) {
      item.registId = this.registId
      this.$api.timeManagement.updateTimeline(item).then(res => {
        this.init()
      })
    }, 300)
  },
  filters: {
    shortDateFormat(str) {
      if (typeof str === 'string' && str) {
        return str.slice(-5)
      }
      return ''
    }
  }
}
</script>
<style lang="less" scoped>
@import './Timeline.less';
.time-qc {
  display: flex;
  justify-content: space-between;
  padding: 18px 10px 8px 10px;

  p {
    background: #ffffff;
    border: 1px solid rgba(79, 94, 123, 0.5);
    border-radius: 15px;
    flex: 1;
    margin: 0 2px;
    padding: 16px 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;

    span {
      text-align: center;
      font-size: 32px;

      &:nth-of-type(1) {
        display: block;
        font-size: @font-xxl-size;
      }

      &:nth-of-type(2) {
        display: block;
        font-size: @font-sm-size;
        padding: 2px 0 8px 0;
      }
      &:nth-of-type(3n + 3) {
        font-size: 26px;
        bottom: 10px;
      }
    }
  }
}
.time-axis {
  .time-axis__content {
    height: calc(100vh - 580px);
    height: calc(100vh - 580px - constant(safe-area-inset-bottom));
    height: calc(100vh - 580px - env(safe-area-inset-bottom));
  }
  .time-axis__right {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: flex-start;
    .time-axis__nodename {
      min-height: 70px;
      display: flex;
      align-items: center;
    }
    .time-axis__time {
      min-width: 300px;
      max-width: 300px;
      width: 300px;
    }
  }
}
</style>
