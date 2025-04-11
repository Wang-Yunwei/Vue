<template>
  <div class="med-summary-wrapper">
    <summary-card :summary="summary" />
    <div class="chart">
      <div class="condition">
        <van-row gutter="24">
          <van-col span="6">
            <van-button
              round
              :type="buttonMonth"
              size="small"
              @click="onchange(1)"
            >
              近3月
            </van-button>
          </van-col>
          <van-col span="6">
            <van-button
              round
              :type="buttonSixMonth"
              size="small"
              @click="onchange(2)"
            >
              近6月
            </van-button>
          </van-col>
          <van-col span="6">
            <van-button
              round
              :type="buttonYear"
              size="small"
              @click="onchange(3)"
            >
              近1年
            </van-button>
          </van-col>
          <van-col span="6">
            <van-button
              round
              :type="buttonCustom"
              size="small"
              @click="showSearch"
            >
              自定义
            </van-button>
          </van-col>
        </van-row>
        <van-row gutter="24" class="condition-date">
          <!-- v-if="searchVisible"  -->
          <van-col span="11">
            <med-date-picker
              v-model="query.startTime"
              label=""
              placeholder="开始时间"
              formatter="YYYY-MM-DD"
              min-date="2021-01-01"
              max-date="2050-12-31"
              :clearable="false"
              :disabled="buttonType != 4"
              @confirm="onchange(4)"
            />
          </van-col>
          <van-col span="2">
            <div>到</div>
          </van-col>
          <van-col span="11">
            <med-date-picker
              v-model="query.endTime"
              label=""
              placeholder="结束时间"
              min-date="2021-01-01"
              max-date="2050-12-31"
              formatter="YYYY-MM-DD"
              :clearable="false"
              :disabled="buttonType != 4"
              @confirm="onchange(4)"
            />
          </van-col>
        </van-row>
      </div>
      <div :class="className">
        <med-title title="高危胸痛患者填报趋势" style="margin-top: 5px;" />
        <med-line-chart
          :series-data="dataTrend.seriesData"
          :show-serie-label="false"
          :x-axis-data="dataTrend.xAxisData"
          :y-axis-data="yAxisData"
        ></med-line-chart>
        <med-title title="病因分析" style="margin-top: 5px;" />
        <med-pie-chart
          :series="diagRatioSeries"
          :legend="diagRatioLegend"
        ></med-pie-chart>
        <med-title
          title="发病12小时以内STEMI患者再灌注策略"
          style="margin-top: 5px;"
        />
        <med-bar-chart
          :series-data="dataReperfusion.seriesData"
          :x-axis-data="dataReperfusion.xAxisData"
          :y-axis-data="yAxisData"
        />
        <med-title title="网络医院统计" style="margin-top: 5px;" />
        <netHospital :dataNetHospital="dataNetHospital"></netHospital>
        <med-title title="数据填报管理执行情况" style="margin-top: 5px;" />
        <med-gauge-chart :series-data="dataFillState.seriesData" />
        <div class="info">
          经计算,{{ lockedNum }}份病例即将到期锁定,{{
            willExpireLockedNum
          }}份病例超过60天已被锁定
        </div>
        <med-title title="胸痛患者随访统计" style="margin-top: 5px;" />
        <med-line-chart
          :series-data="dataFollowUp.seriesData"
          :show-serie-label="true"
          :x-axis-data="dataFollowUp.xAxisData"
          :y-axis-data="yFollupAxisData"
        ></med-line-chart>
      </div>
    </div>
    <med-loading v-model="showLoading" />
  </div>
</template>

<script>
import { GoodsAction, GoodsActionButton, Dialog } from 'vant'
import { dicConstant } from '@/constant/commonConstant'
import { mapGetters, mapMutations } from 'vuex'
import * as types from '@/store/mutations/mutations-types'
import state from '@store/state/state'
import moment from 'moment'
import summaryCard from './summaryCard.vue'
import netHospital from './detail/netHospital.vue'
export default {
  // 胸痛档案
  name: 'qc',
  components: { GoodsAction, GoodsActionButton, summaryCard, netHospital },
  data() {
    return {
      dataReperfusion: {
        seriesData: [],
        type: 'bar',
        xAxisData: []
      },
      dataFollowUp: {
        seriesData: [],
        type: 'line',
        xAxisData: []
      },
      dataPatients: {
        todayAddPatients: 0,
        weekAddPatients: 0,
        monthAddPatients: 0,
        totalPatients: 0
      },
      summary: {
        total: '0',
        new: '0',
        week: '0',
        month: '0'
      },
      buttonType: '2',
      buttonMonth: 'default',
      buttonSixMonth: 'primary',
      buttonYear: 'default',
      buttonCustom: 'default',
      dataTrend: {
        seriesData: [],
        type: 'bar',
        xAxisData: []
      },
      diagRatioSeries: [],
      diagRatioLegend: {
        top: 'bottom',
        orient: 'horizontal',
        left: 'center',
        textStyle: {
          fontSize: '12px'
        },
        selected: {}
      },
      dataTrendNum: {
        seriesData: [
          // { value: '448', name: 'STEMI' },
          // { value: '735', name: 'NSTEMI' },
          // { value: '380', name: 'UA' },
          // { value: '184', name: '主动脉夹层' },
          // { value: '30', name: '肺动脉栓塞' },
          // { value: '58', name: '其他' }
        ],
        type: 'pie'
      },
      active: '1',
      showLoading: false,
      searchVisible: false,
      query: {
        startTime: moment(new Date())
          .add(-5, 'months')
          .format('YYYY-MM-01'),
        endTime: moment(new Date()).format('YYYY-MM-DD')
      },
      yAxisData: [
        {
          type: 'value',
          name: '人',
          position: 'left',
          alignTicks: true,
          axisLine: {
            show: true
          }
        }
      ],
      yFollupAxisData: [
        {
          type: 'value',
          name: '%',
          position: 'left',
          alignTicks: true,
          axisLine: {
            show: true
          }
        }
      ],
      dataNetHospital: [],
      dataFillState: {
        seriesData: []
      },
      lockedNum: '',
      willExpireLockedNum: '',
      // 完成审核
      completeFillingRate: {
        value: null,
        name: '',
        title: {
          offsetCenter: ['-125%', '-90%']
        },
        detail: {
          valueAnimation: true,
          offsetCenter: ['-125%', '-70%']
        }
      },
      // 完成归档
      completeAuditRate: {
        value: null,
        name: '',
        title: {
          offsetCenter: ['-145%', '-40%']
        },
        detail: {
          valueAnimation: true,
          offsetCenter: ['-145%', '-20%']
        }
      },
      //  完成填报
      completeFileRate: {
        value: null,
        name: '',
        title: {
          offsetCenter: ['-145%', '10%']
        },
        detail: {
          valueAnimation: true,
          offsetCenter: ['-145%', '30%']
        }
      },
      //  超期归档
      overdueFileRate: {
        value: null,
        name: '',
        title: {
          offsetCenter: ['-125%', '60%']
        },
        detail: {
          valueAnimation: true,
          offsetCenter: ['-125%', '80%']
        }
      },
      //  超期建档
      overdueFilingRate: {
        value: null,
        name: '',
        title: {
          offsetCenter: ['140%', '-80%']
        },
        detail: {
          valueAnimation: true,
          offsetCenter: ['140%', '-60%']
        }
      }
    }
  },
  mounted() {
    this.showLoading = true
    this.getPatients()
    this.getPatientsTrend()
    this.getPatientsTrendNum()
    this.getNetHospitalStats()
    this.getDataFillingSituation()
    this.getFollowUpStats()
    this.getReperfusionStats()
  },
  // 钩子方法
  created() {
    console.log(this.configure.dockingWay)
  },
  computed: {
    ...mapGetters(['hospitalArea', 'curHospitalArea', 'appName', 'configure']),
    curHospitalAreaName() {
      const matched = this.hospitalArea.find(
        el => el.value === this.curHospitalArea
      )
      return matched?.label
    },
    className() {
      if (this.searchVisible) {
        return 'scroll-viewShow'
      } else {
        return 'scroll-view'
      }
    }
  },
  methods: {
    ...mapMutations([types.SET_CURHOSPITALAREA]),
    setButtonType(type) {
      this.buttonType = type
      if (type === 1) {
        this.buttonMonth = 'primary'
        this.buttonSixMonth = 'default'
        this.buttonYear = 'default'
        this.buttonCustom = 'default'
      } else if (type === 2) {
        this.buttonMonth = 'default'
        this.buttonSixMonth = 'primary'
        this.buttonYear = 'default'
        this.buttonCustom = 'default'
      } else if (type === 3) {
        this.buttonMonth = 'default'
        this.buttonSixMonth = 'default'
        this.buttonYear = 'primary'
        this.buttonCustom = 'default'
      } else if (type === 4) {
        this.buttonMonth = 'default'
        this.buttonSixMonth = 'default'
        this.buttonYear = 'default'
        this.buttonCustom = 'primary'
      }
    },
    onchange(type) {
      this.setButtonType(type)
      if (type === 1) {
        this.searchVisible = false
        this.query.endTime = moment(new Date()).format('YYYY-MM-DD')
        this.query.startTime = moment(this.query.endTime)
          .add(-2, 'months')
          .format('YYYY-MM-01')
      } else if (type === 2) {
        this.searchVisible = false
        this.query.endTime = moment(new Date()).format('YYYY-MM-DD')
        this.query.startTime = moment(this.query.endTime)
          .add(-5, 'months')
          .format('YYYY-MM-01')
      } else if (type === 3) {
        this.searchVisible = false
        this.query.endTime = moment(new Date()).format('YYYY-MM-DD')
        this.query.startTime = moment(this.query.endTime)
          .add(-11, 'months')
          .format('YYYY-MM-01')
      } else if (type === 4) {
      }
      this.showLoading = true
      this.getPatients()
      this.getPatientsTrend()
      this.getPatientsTrendNum()
      this.getNetHospitalStats()
      this.getFollowUpStats()
      this.getReperfusionStats()
      this.getDataFillingSituation()
    },
    showSearch() {
      this.setButtonType(4)
      if (this.searchVisible === false) {
        this.searchVisible = true
      } else {
        this.searchVisible = false
      }
    },
    getNetHospitalStats() {
      this.$api.service.getNetHospitalStats(this.query).then(res => {
        if (res.status === 200) {
          this.dataNetHospital = res.result
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    },
    getFollowUpStats() {
      this.dataFollowUp.xAxisData = []
      this.dataFollowUp.seriesData = []
      this.$api.service.getFollowUpStats(this.query).then(res => {
        if (res.status === 200) {
          this.dataFollowUp.xAxisData = res.result.xAxisData
          this.dataFollowUp.seriesData = res.result.seriesData
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    },
    getReperfusionStats() {
      this.dataReperfusion.xAxisData = []
      this.dataReperfusion.seriesData = []
      this.$api.service.getReperfusionStats(this.query).then(res => {
        if (res.status === 200) {
          this.dataReperfusion.xAxisData = res.result.xAxisData
          const data = res.result.seriesData.map(m => {
            return m.data[0]
          })
          this.dataReperfusion.seriesData.push({
            data: data
          })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
        this.showLoading = false
      })
    },
    getDataFillingSituation() {
      this.dataFillState.seriesData = []
      this.$api.service.getDataFillingSituation(this.query).then(res => {
        if (res.status === 200 && res.result != null) {
          this.completeFillingRate.value = res.result.completeFillingRate
          this.completeFillingRate.name = '完成填报'
          this.dataFillState.seriesData.push(this.completeFillingRate)

          this.completeAuditRate.value = res.result.completeAuditRate
          this.completeAuditRate.name = '完成审核'
          this.dataFillState.seriesData.push(this.completeAuditRate)

          this.completeFileRate.value = res.result.completeFileRate
          this.completeFileRate.name = '完成归档'
          this.dataFillState.seriesData.push(this.completeFileRate)

          this.overdueFileRate.value = res.result.overdueFileRate
          this.overdueFileRate.name = '超期归档'
          this.dataFillState.seriesData.push(this.overdueFileRate)

          this.overdueFilingRate.value = res.result.overdueFilingRate
          this.overdueFilingRate.name = '超期建档'
          this.dataFillState.seriesData.push(this.overdueFilingRate)

          this.lockedNum = res.result.lockedNum
          this.willExpireLockedNum = res.result.willExpireLockedNum
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    },
    getPatients() {
      this.$api.service.getMedicalRecordStats(this.query).then(res => {
        if (res.status === 200) {
          this.dataPatients = res.result
          if (this.dataPatients !== null) {
            this.summary.total = this.dataPatients.totalPatients
            this.summary.new = this.dataPatients.todayAddPatients
            this.summary.week = this.dataPatients.weekAddPatients
            this.summary.month = this.dataPatients.monthAddPatients
          }
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    },
    getPatientsTrendNum() {
      this.$api.service.getPicChart(this.query).then(res => {
        if (res.status === 200) {
          res.result.seriesDataPie.forEach(m => {
            this.diagRatioLegend.selected[m.name] = m.value !== '0'
          })

          this.diagRatioSeries = [
            // {
            //   name: '',
            //   type: 'pie',
            //   radius: [0, '30%'],
            //   bottom: '15%',
            //   center: ['50%', '40%'],
            //   label: {
            //     position: 'inner',
            //     fontSize: 12,
            //     formatter: '{b} {c}例'
            //   },
            //   labelLine: {
            //     show: true
            //   },
            //   data: this.toInnerSeries(res.result.seriesDataPie)
            // },
            {
              name: '',
              type: 'pie',
              radius: ['30%', '50%'],
              bottom: '15%',
              center: ['50%', '40%'],
              label: {
                fontSize: 12,
                formatter: '{b} {c}例'
              },
              data: this.toOuterSeries(res.result.seriesDataPie)
            }
          ]
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    },
    toOuterSeries(_series) {
      const result = _series.map(m => {
        m.itemStyle = { color: this.getOuterColor(m.name) }
        return m
      })
      return result
    },
    getOuterColor(name) {
      switch (name) {
        case '诊断中':
          return '#6091fd'
        case 'STEMI':
          return '#cc3c03'
        case 'NSTEMI':
          return '#fb4903'
        case 'UA':
          return '#fd712c'
        case '主动脉夹层':
          return '#ffa34a'
        case '肺动脉栓塞':
          return '#ffce4a'
        case '非ACS心源性胸痛':
          return '#204bc8'
        case '其它非心源性胸痛':
          return '#035aee'
        case '其它':
          return '#3775fe'
      }
    },
    toInnerSeries(_series) {
      const innerSeries = []
      const acstotal = this.calcTotal(_series, ['STEMI', 'NSTEMI', 'UA'])
      const acs = {
        name: 'ACS',
        value: acstotal,
        selected: acstotal === 0
      }
      const nacstotal = this.calcTotal(_series, ['主动脉夹层', '肺动脉栓塞'])
      const nacs = {
        name: '非ACS',
        value: nacstotal,
        selected: nacstotal === 0
      }
      const othertotal = this.calcTotal(_series, [
        '诊断中',
        '非ACS心源性胸痛',
        '其它非心源性胸痛',
        '其它'
      ])
      const other = {
        name: '其他',
        value: othertotal,
        selected: othertotal === 0
      }
      innerSeries.push(acs, nacs, other)
      return innerSeries
    },
    calcTotal(_series, types) {
      const summary = _series.filter(m => {
        return types.findIndex(n => n === m.name) >= 0
      })
      let total = 0
      summary.forEach(m => {
        total += Number(m.value)
      })
      return total
    },
    getPatientsTrend() {
      this.dataTrend.xAxisData = []
      this.dataTrend.seriesData = []
      this.$api.service.getLineChart(this.query).then(res => {
        if (res.status === 200) {
          this.dataTrend = res.result
          if (this.dataTrend && this.dataTrend.seriesData) {
            if (this.dataTrend.seriesData[5]) {
              this.dataTrend.seriesData[5].label = {
                show: true,
                position: 'top'
              }
            }
          }
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.med-summary-wrapper {
  .chart {
    position: relative;
    top: 160px;
    background: #f2f4f5;
    .condition {
      background: #fff;
      padding: 0 16px 12px 16px;
    }
    .condition-date {
      display: flex;
      justify-content: space-between;
      align-items: center;
      /deep/ .van-field__control {
        text-align: center;
      }
    }
    .chart-title {
      margin-top: 12px;
      background: #fff;
    }
    .van-button {
      // height: 60px;
      width: 100%;
    }
  }
  .chart .scroll-view {
    height: calc(100vh - 668px);
    overflow-y: auto;
  }

  .chart .scroll-view {
    height: calc(100vh - 758px);
    overflow-y: auto;
  }

  .chart .scroll-viewShow {
    height: calc(100vh - 758px);
    overflow-y: auto;
  }
  .chart .info {
    font-size: 32px;
    padding: 10px 32px;
    background: #fff;
    height: 100px;
    line-height: 42px;
  }
}
</style>
