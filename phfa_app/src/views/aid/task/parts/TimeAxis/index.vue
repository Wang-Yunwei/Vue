<template>
  <div class="task-basic-info-wrapper">
    <div class="task-part-title">
      <span class="solid"></span><span>时间轴</span>
    </div>
    <div class="time-axis">
      <ul class="time-axis__content" v-if="dataSource && dataSource.length">
        <li class="flex-c-b time-axis__item" v-for="item in dataSource" :key="item.title">
          <van-icon :name="item.value ? 'clock' : 'clock-o'" class="time-axis__icon" />
          <div class="time-axis__title">{{ item.title }}</div>
          <div class="time-axis__time">
            <div v-if="isFuzzy(item)">
              <fuzzy-datetime-picker class="fuzzy-date" :ranges="ranges" v-model="timelineValues[item.field]" :show-switch="false" @change="onFuzzyTimeChange" />
            </div>
            <template v-if="isExact(item)">
              <med-date-picker v-model="timelineValues[item.field]" placeholder="请选择准确时间" label="" :disabled="item.disabled" @changeTime="onTimeChange" />
            </template>
          </div>
        </li>
      </ul>
      <med-empty description="暂无数据" v-if="!dataSource || !dataSource.length" />
    </div>
  </div>
</template>
<script>
import * as types from '@store/mutations/mutations-types'
import { mapMutations, mapGetters } from 'vuex'
import methodMixin from '@mixins/methodMixin'
import FuzzyDatetimePicker from '../../components/FuzzyDatetimePicker'

export default {
  components: { FuzzyDatetimePicker },
  mixins: [methodMixin],
  data() {
    return {
      ready: false,
      pickerTitle: '请选择时间',
      showPicker: false,
      defaultDate: '',
      ranges: [],
      timelineValues: {}
    }
  },
  created() {
    this.getList()
    const res = this.getCodeListByKey([
      'PHFA_0013' // 发病时间
    ])
    this.ranges = res.PHFA_0013
  },
  methods: {
    ...mapMutations(types),
    isFuzzy(item) {
      return item.title === '发病时间' && this.medicalHistory.isMorb === '1'
    },
    isExact(item) {
      return (
        item.title !== '发病时间' ||
        (item.title === '发病时间' && this.medicalHistory.isMorb === '0')
      )
    },
    tabChange() {
      this.getList()
    },
    async getList() {
      const res = await this.$api.getTimeAxis(this.missionId)
      this.timelineValues = res.body || {}
      if (this.timelineValues.patientId) {
        this[types.SET_PATIENTID](this.timelineValues.patientId)
      }
      setTimeout(() => {
        this.ready = true
      }, 200)
    },
    async handleSave() {
      if (!this.ready) return

      const payload = {
        missionId: this.missionId,
        ...this.timelineValues
      }
      const res = await this.$api.updateTimeAxis(payload)
      if (res.code === '000000') {
        this.$notify({ type: 'success', message: '保存成功' })
        this.getList()
      } else {
        this.$notify({ type: 'warning', message: res.message })
      }
    },
    onTimeChange(v) {
      this.$forceUpdate()
      this.$nextTick(() => {
        this.handleSave()
      })
    },
    onFuzzyTimeChange(v) {
      this.onTimeChange()
    }
  },
  computed: {
    ...mapGetters(['missionId', 'medicalHistory']),
    dataSource() {
      return [
        {
          title: '发病时间',
          field: 'morbtimearea'
        },
        {
          title: '呼救时间',
          field: 'callTime'
        },
        {
          title: '接令时间',
          field: 'planVehicleTime'
        },
        {
          title: '出车时间',
          field: 'dispatchVehicleTime'
        },
        {
          title: '到达现场时间',
          field: 'arrivedSceneTime'
        },
        {
          title: '接触患者时间',
          field: 'touchPatientTime'
        },
        {
          title: '离开现场时间',
          field: 'leftSceneTime'
        },
        {
          title: '首份心电图时间',
          field: 'firstEcgTime',
          disabled: true
        },
        {
          title: '首次用药时间',
          field: 'firstMedicationTime',
          disabled: true
        },
        {
          title: '预警时间',
          field: 'earlyWarningTime'
        },
        {
          title: '到达医院时间',
          field: 'arrivedHospitalTime'
        },
        {
          title: '交接完成时间',
          field: 'shiftTime',
          disabled: true
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.task-basic-info-wrapper {
  .time-axis {
    position: relative;
    padding: 30px 0 0px 0;
    margin-bottom: 80px;

    &:before {
      content: "";
      display: block;
      width: 1px;
      background-color: #5e74fe;
      height: 100%;
      position: absolute;
      left: 78px;
      z-index: 0;
      top: 0;
    }

    &__item {
      padding: 20px 60px;

      &:last-child {
        background-color: #fff;
        padding-bottom: 0;

        .time-axis__icon {
          box-shadow: 0 10px 0 #fff;
        }
      }
    }

    &__icon {
      position: relative;
      z-index: 1;
      font-size: @font-xl-size;
      color: #5e74fe;
      margin-right: 20px;
      background-color: #fff;
      padding: 10px 0;
    }

    &__title {
      font-size: @font-md-size;
      flex: 120px;
    }

    &__time {
      font-size: @font-lg-size;
      flex: 200px;

      /deep/.van-cell {
        padding: 0;

        .van-field__control {
          line-height: 1rem;
        }
      }
    }

    // /deep/.fuzzy-date-picker-value {
    //   font-size: 0.355rem;
    // }
  }
}

/deep/ .med-datepicker-wrapper:after {
  content: none;
}

.fuzzy-date {
  /deep/ .fuzzy-date-picker-value {
    font-size: @font-md-size;
  }
}
</style>
