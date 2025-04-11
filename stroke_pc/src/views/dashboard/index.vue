<template>
  <div class="dashboard">
    <el-row style="color: red; font-weight: bold;">
      *数据统计周期为：{{ getSearchRange() }}
    </el-row>
    <el-row v-if="dashboardFlag" :gutter="70">
      <el-col :span="18" style="border-right: 1px solid #efefef">
        <cases :cases-data="casesData" />
        <el-row :gutter="100" style="margin-bottom: 30px">
          <el-col :span="10">
            <div style="height: 336px">
              <pie-chart
                element-id="pieChart1"
                title="病因分析"
                :series-data="pieSeries.seriesData1"
              />
            </div>
          </el-col>
          <el-col :span="14">
            <div style="height: 336px">
              <line-chart
                element-id="lineChart1"
                title="DNT"
                :series-data="lineSeries.seriesData1"
              />
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="100">
          <el-col :span="10">
            <div style="height: 336px">
              <bar-chart
                element-id="barChart1"
                title="脑梗死特异性治疗例数"
                :series-data="barSeries.seriesData1"
              />
            </div>
          </el-col>
          <el-col :span="14">
            <div style="height: 336px">
              <line-chart
                element-id="lineChart2"
                title="DPT"
                :series-data="lineSeries.seriesData2"
              />
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row>
          <statistics :statistics-data="statisticsData" />
        </el-row>
        <el-row style="height: 250px">
          <gauge-chart
            element-id="gaugeChart1"
            title="发病4.5小时内脑梗死患者静脉溶栓率"
            :series-data="gaugeSeries.seriesData1"
          />
        </el-row>
        <el-row style="height: 250px">
          <gauge-chart
            element-id="gaugeChart2"
            title="发病6小时内脑梗死患者血管内机械取栓率"
            :series-data="gaugeSeries.seriesData2"
          />
        </el-row>
        <el-row style="height: 230px">
          <bar-chart
            element-id="barChart2"
            title="来院方式月份趋势图"
            :series-data="barSeries.seriesData2"
          />
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import moment from 'moment'
import Cases from '@/views/dashboard/Cases'
import Statistics from '@/views/dashboard/Statistics'
import PieChart from '@/components/MedChart/PieChart'
import LineChart from '@/components/MedChart/LineChart'
import BarChart from '@/components/MedChart/BarChart'
import GaugeChart from '@/components/MedChart/GaugeChart'
import dashboardApi from '@/api/dashboard'
import storage from 'store'
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  components: { Cases, Statistics, PieChart, LineChart, BarChart, GaugeChart },
  data() {
    return {
      dashboardFlag: false,
      screeHeight: document.body.clientHeight,
      casesData: {
        total: '0',
        new: '0',
        week: '0',
        month: '0'
      },
      pieSeries: {
        seriesData1: []
      },
      lineSeries: {
        seriesData1: {
          dntAverageList: [],
          dntMedianList: []
        },
        seriesData2: {
          dptAverageList: [],
          dptMedianList: []
        }
      },
      barSeries: {
        seriesData1: {},
        seriesData2: {}
      },
      statisticsData: {
        ontAver: '0',
        dntMid: '0',
        dptMid: '0'
      },
      gaugeSeries: {
        seriesData1: 0,
        seriesData2: 0
      },
      dic: storage.get('dicData')||{},
      info: storage.get('SET_INFO')
    }
  },
  computed: {
    ...mapGetters(['curHospitalArea'])
  },
  mounted() {
    this.getRecordDashboard()
  },
  methods: {
    getRecordDashboard() {
      dashboardApi.getRecordDashboard().then((res) => {
        if (res.status === 200) {
          this.casesData.total = res?.result?.totalPatients
          this.casesData.new = res?.result?.dailyPatients
          this.casesData.week = res?.result?.weeklyPatients
          this.casesData.month = res?.result?.monthlyPatients
          this.pieSeries.seriesData1 = res?.result?.diagList?.map((ele) => {
            const matched = this.dic.diag?.find(
              (item) => item.value === ele.name
            )
            return {
              ...ele,
              name: matched?.label
            }
          })
          this.lineSeries.seriesData1.dntAverageList = res?.result?.dntAverageList || []
          this.lineSeries.seriesData1.dntMedianList = res?.result?.dntMedianList || []
          this.barSeries.seriesData1.disposeList = res?.result?.disposeList
          this.lineSeries.seriesData2.dptAverageList = res?.result?.dptAverageList || []
          this.lineSeries.seriesData2.dptMedianList = res?.result?.dptMedianList || []
          this.statisticsData.ontAver = res?.result?.ontAverage
          this.statisticsData.dntMid = res?.result?.dntMedian
          this.statisticsData.dptMid = res?.result?.dptMedian
          this.barSeries.seriesData2.comingType = res?.result?.comingType?.map(
            (ele) => {
              const matched = this.dic.comingType?.find(
                (item) => item.value === ele.name
              )
              return {
                ...ele,
                name: matched?.label
              }
            }
          )
          this.gaugeSeries.seriesData1 = res?.result?.rsPercentage
          this.gaugeSeries.seriesData2 = res?.result?.merciPercentage
        }
        this.dashboardFlag = true
      })
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
.dashboard {
  padding: 12px 30px 0 30px;
}
</style>
