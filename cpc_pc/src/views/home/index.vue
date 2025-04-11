<template>
  <div style="width:100%;">
    <div class="med-summary-wrapper">
      <div class="summary-left">
        <div class="header">
          <div class="timerange">
            *数据统计周期为：{{ getSearchRange() }}
          </div>
          <home-card>
            <summary-card :summary="summary" />
          </home-card>
        </div>
        <div class="chart">
          <el-row>
            <el-col :span="8">
              <home-card>
                <div class="title">病因分析</div>
                <med-pie-chart
                  title="病因分析"
                  :series-data="dataTrendNum.seriesData"
                />
              </home-card>
            </el-col>
            <el-col :span="16">
              <home-card>
                <div class="title">高危胸痛患者填报趋势</div>
                <med-line-chart
                  title="高危胸痛患者填报趋势"
                  :series-data="dataTrend.seriesData"
                  :x-axis-data="dataTrend.xAxisData"
                  :y-axis-data="yAxisData"
                />
              </home-card>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <home-card>
                <div class="title">数据填报管理执行情况</div>
                <med-gauge-chart
                  title="数据填报管理执行情况"
                  :series-data="dataFillState.seriesData"
                />
                <div style="height: 34px;">经计算,{{ willExpireLockedNum }}份病例即将到期锁定,{{ lockedNum }}份病例超过60天已被锁定</div>
              </home-card>
            </el-col>
            <el-col :span="16">
              <home-card>
                <div class="title">发病12小时以内STEMI患者再灌注策略</div>
                <med-line-chart
                  title="发病12小时以内STEMI患者再灌注策略"
                  :series-data="dataReperfusion.seriesData"
                  :x-axis-data="dataReperfusion.xAxisData"
                  :y-axis-data="yAxisData"
                />
              </home-card>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="summary-right">
        <div class="chart">
          <el-row>
            <el-col :span="24">
              <home-card>
                <div class="title">网络医院统计</div>
                <el-table
                  :data="dataNetHospital"
                  style="width: 100%"
                >
                  <el-table-column label="医院名称">
                    <template slot-scope="scope">
                      {{ scope.row.name }}
                    </template>
                  </el-table-column>
                  <el-table-column label="转诊患者数(人)">
                    <template slot-scope="scope">
                      {{ scope.row.total }}
                    </template>
                  </el-table-column>
                  <el-table-column label="STEMI患者再灌注策略数">
                    <template slot-scope="scope">
                      {{ scope.row.stemiNum }}
                    </template>
                  </el-table-column>
                </el-table>
              </home-card>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="24">
              <home-card>
                <div class="title">随访统计</div>
                <med-line-chart
                  title="随访统计"
                  :series-data="dataTrend.seriesData"
                  :x-axis-data="dataTrend.xAxisData"
                  :y-axis-data="yAxisData"
                />
              </home-card>
            </el-col>
          </el-row> -->
        <!-- <aianalysis :opinions="opinions" :abnormal-reportings="abnormalReportings" :not-up-to-standards="notUpToStandards" :other-problems="otherProblems" /> -->
        </div>
      </div>
    </div>
    <developing v-if="false" />
  </div>
</template>

<script>
import homeCard from './homeCard.vue'
import summaryCard from './summaryCard.vue'
// import aianalysis from './aianalysis.vue'
import moment from 'moment'
import { mapGetters } from 'vuex'
import { getMedicalRecordStats, getLineChart, getPicChart, getNetHospitalStats, getReperfusionStats, getDataFillingSituation } from '@/api/qc'
import developing from '@/views/developing.vue'
export default {
  // 胸痛档案
  name: 'QcIndex',
  components: { homeCard, summaryCard, developing },
  data() {
    return {
      dataReperfusion: {
        seriesData: [],
        seriesDataList: [],
        type: 'bar',
        xAxisData: []
      },
      dataNetHospital: [],
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
      dataTrend: {
        seriesData: [],
        type: 'bar',
        xAxisData: []
      },
      // 完成审核
      completeAuditRate: {
        value: null,
        name: '',
        title: {
          offsetCenter: ['-120%', '-90%']
        },
        detail: {
          valueAnimation: true,
          offsetCenter: ['-120%', '-70%']
        }
      },
      // 完成归档
      completeFileRate: {
        value: null,
        name: '',
        title: {
          offsetCenter: ['-140%', '-40%']
        },
        detail: {
          valueAnimation: true,
          offsetCenter: ['-140%', '-20%']
        }
      },
      //  完成填报
      completeFillingRate: {
        value: null,
        name: '',
        title: {
          offsetCenter: ['-140%', '10%']
        },
        detail: {
          valueAnimation: true,
          offsetCenter: ['-140%', '30%']
        }
      },
      //  超期归档
      overdueFileRate: {
        value: null,
        name: '',
        title: {
          offsetCenter: ['-120%', '60%']
        },
        detail: {
          valueAnimation: true,
          offsetCenter: ['-120%', '80%']
        }
      },
      dataFillState: {
        seriesData: []
      },
      lockedNum: '',
      willExpireLockedNum: '',
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
      loading: false,
      searchVisible: false,
      query: {
        daterange: [],
        startTime: moment(new Date()).subtract(5, 'months').startOf().format('YYYY-MM-DD'),
        endTime: moment(new Date()).format('YYYY-MM-DD')
        // hospitalArea: 'csyq',
        // hospitalId: this.hospitalId
        // hospitalArea: 'c2d2837c-7008-4f34-a3ef-787e401a6cdb',
        // hospitalId: 'c2d2837c-7008-4f34-a3ef-787e401a6cdb'
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
      ]
    }
  },
  computed: {
    ...mapGetters(['hospitalId', 'hospitalArea', 'dictionary']),
    className() {
      if (this.searchVisible) {
        return 'scroll-viewShow'
      } else {
        return 'scroll-view'
      }
    }
  },
  watch: { },
  mounted() {
    this.getPatients()
    this.getPatientsTrend()
    this.getPatientsTrendNum()
    this.getNetHospitalStats()
    this.getReperfusionStats()
    this.getDataFillingSituation()
  },
  // 钩子方法
  created() {
  },
  methods: {
    async getReperfusionStats() {
      this.query.hospitalId = this.hospitalId
      const res = await getReperfusionStats(this.query) || {}
      if (res.status === 200) {
        this.dataReperfusion = res.result
        this.dataReperfusion.seriesData = [{
          data: res.result.seriesDataList,
          type: 'bar'
        }]
      } else {
        this.$notify({ type: 'warning', message: res.message })
      }
    },
    async getNetHospitalStats() {
      this.query.hospitalId = this.hospitalId
      const res = await getNetHospitalStats(this.query) || {}
      if (res.status === 200) {
        this.dataNetHospital = res.result
      } else {
        this.$notify({ type: 'warning', message: res.message })
      }
    },
    async getPatients() {
      this.query.hospitalId = this.hospitalId
      const res = await getMedicalRecordStats(this.query) || {}
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
    },
    async getPatientsTrendNum() {
      this.query.hospitalId = this.hospitalId
      const res = await getPicChart(this.query) || {}
      if (res.status === 200) {
        this.dataTrendNum.seriesData = res.result.seriesDataPie
      } else {
        this.$notify({ type: 'warning', message: res.message })
      }
    },
    async getPatientsTrend() {
      this.query.hospitalId = this.hospitalId
      const res = await getLineChart(this.query) || {}
      if (res.status === 200) {
        this.dataTrend = res.result
      } else {
        this.$notify({ type: 'warning', message: res.message })
      }
    },
    async getDataFillingSituation() {
      this.query.hospitalId = this.hospitalId
      const res = await getDataFillingSituation(this.query) || {}
      if (res.status === 200 && res.result != null) {
        this.completeAuditRate.value = res.result.completeAuditRate
        this.completeAuditRate.name = '完成审核'
        this.dataFillState.seriesData.push(this.completeAuditRate)

        this.completeFileRate.value = res.result.completeFileRate
        this.completeFileRate.name = '完成归档'
        this.dataFillState.seriesData.push(this.completeFileRate)

        this.completeFillingRate.value = res.result.completeFillingRate
        this.completeFillingRate.name = '完成填报'
        this.dataFillState.seriesData.push(this.completeFillingRate)

        this.overdueFileRate.value = res.result.overdueFileRate
        this.overdueFileRate.name = '超期归档'
        this.dataFillState.seriesData.push(this.overdueFileRate)

        this.lockedNum = res.result.lockedNum
        this.willExpireLockedNum = res.result.willExpireLockedNum
      } else {
        this.$notify({ type: 'warning', message: res.message })
      }
    },
    getSearchRange() {
      const start = moment().subtract(5, 'months').startOf('month').format('YYYY年MM月DD日')
      const end = moment().format('YYYY年MM月DD日')
      return start + ' 至 ' + end
    }
  }
}
</script>

<style lang="scss" scoped>
.med-summary-wrapper {
  height: calc(100vh - 50px);
  overflow-y: auto;
  display: flex;
  flex-direction: row;
  .summary-left,
  .summary-right{
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    .header,
    .chart {
      padding: 12px 12px 0 12px;
    }
    .chart {
      display: flex;
      flex-direction: column;
      justify-content: stretch;
      flex: 1;

      .el-row {
        flex: 1;
        padding-bottom: 12px;
        .el-col {
          height: 100%;
        }
      }

      .med-home-card-wrapper {
        padding: 18px;
      }
      .el-col:first-child {
        padding-right: 12px;
      }
      .title {
        font-size: 20px;
        font-weight: bold;
        padding: 8px 0;
      }
    }
  }
  .summary-left {
    width:70%;
    border-right: 1px solid rgb(239, 239, 239);
  }
  .summary-right {
    width: 30%;
    .chart {
      padding: 12px 0 0 0;
    }
    .scroll {
      padding: 0 10px;
      height: calc(100vh - 74px);
      overflow-y: auto;
    }
  }
  .timerange {
    color: red;
    font-weight: bold;
    padding-top: 8px;
  }
}
</style>
