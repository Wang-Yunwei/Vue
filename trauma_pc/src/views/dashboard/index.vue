<template>
  <div class="dashboard">
    <span style="color: red;font-weight: bold">
      *数据统计周期为：{{ startDate }} 至 {{ endDate }}
    </span>
    <div v-if="dashboardFlag">
      <cases :cases-data="casesData" />
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="chart-height">
            <pie-chart element-id="pieChart1" title="来院数据统计" :series-data="pieSeries.visitTypeList" />
          </div>
        </el-col>
        <el-col :span="8">
          <div class="chart-height">
            <line-chart element-id="lineChart1" title="创伤患者趋势图" :series-data="lineSeries.seriesData1" />
          </div>
        </el-col>
        <el-col :span="8">
          <div class="chart-height">
            <div style="position: absolute;right: 0;z-index: 1;">
              <el-radio-group v-model="ageFlag">
                <el-radio-button label="1">年龄</el-radio-button>
                <el-radio-button label="2">年龄段</el-radio-button>
              </el-radio-group>
            </div>
            <pie-custom-chart element-id="pieSeries2" title="年龄占比" :series-data="pieSeries.ageList" />
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="chart-height">
            <bar-chart element-id="barChart1" title="疾病判断统计" :series-data="barSeries.seriesData1" />
          </div>
        </el-col>
        <el-col :span="8">
          <div class="chart-height">
            <transverse-bar-chart element-id="lineChart2" title="MPDS分析" :series-data="transverseBarSeries.seriesData1" />
          </div>
        </el-col>
        <el-col :span="8">
          <div class="chart-height">
            <pie-age-chart element-id="pieSeries3" title="性别占比" :series-data="pieSeries.genderList" />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { DictionariesMixin } from '@/mixins/index'
import Cases from '@/views/dashboard/Cases'
import PieChart from '@/components/MedChart/PieChart'
import PieAgeChart from '@/components/MedChart/PieAgeChart'
import PieCustomChart from '@/components/MedChart/PieCustomChart'
import LineChart from '@/components/MedChart/LineChart'
import BarChart from '@/components/MedChart/BarChart'
import TransverseBarChart from '@/components/MedChart/TransverseBarChart'

export default {
  name: 'Dashboard',
  components: {
    Cases,
    PieChart,
    LineChart,
    BarChart,
    TransverseBarChart,
    PieCustomChart,
    PieAgeChart
  },
  mixins: [DictionariesMixin],
  data() {
    return {
      visible: false,
      ageFlag: '1',
      year: '',
      timeFlag: '',
      timeShow: '',
      searchParams: {},
      startDate: '',
      endDate: '',
      dashboardFlag: false,
      screeHeight: document.body.clientHeight,
      ageRangeList: [],
      ageList: [],
      casesData: {
        total: '0',
        new: '0',
        week: '0',
        month: '0'
      },
      pieSeries: {
        visitTypeList: [],
        ageList: [],
        genderList: []
      },
      lineSeries: {
        seriesData1: {
          traumaList: [],
          seriousTraumaList: []
        }
      },
      barSeries: {
        seriesData1: {
          diagnosisList: []
        }
      },
      transverseBarSeries: {
        seriesData1: {
          mpdsList: []
        }
      },
    }
  },
  computed: {
    ...mapGetters(['hospitalId'])
  },
  watch: {
    ageFlag: {
      handler(val) {
        this.ageClick()
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.initSearchParam()
    this.getRecordDashboard()
  },
  methods: {
    ageClick() {
      if (this.ageFlag === '1') {
        this.pieSeries.ageList = this.ageRangeList
      } else if (this.ageFlag === '2') {
        this.pieSeries.ageList = this.ageList
      }
    },
    getRecordDashboard() {
      this.$api.getRecordDashboard(this.searchParams).then((res) => {
        if (res.code === '000000') {
          this.casesData.total = res.body.totalPatients
          this.casesData.new = res.body.dailyPatients
          this.casesData.week = res.body.weeklyPatients
          this.casesData.month = res.body.monthlyPatients
          this.pieSeries.visitTypeList = res.body.visitTypeList
          this.lineSeries.seriesData1.traumaList = res.body.traumaList
          this.lineSeries.seriesData1.seriousTraumaList =
            res.body.seriousTraumaList
          this.ageRangeList = res.body.ageRangeList
          this.ageList = res.body.ageList
          this.ageClick()
          this.barSeries.seriesData1.diagnosisList = res.body.diagnosisList
          this.transverseBarSeries.seriesData1.mpdsList = res.body.mpdsList
          this.pieSeries.genderList = res.body.genderList
        }
        this.dashboardFlag = true
      })
    },
    initSearchParam() {
      // 初始化查询参数
      this.startDate = this.$moment().endOf('month').add(1, 'days').subtract(6, 'month').format(this.DATE_TIME_FORMAT.DATE_CHARACTER)
      this.endDate = this.$moment().format(this.DATE_TIME_FORMAT.DATE_CHARACTER)
      this.searchParams = {
        hospitalId: this.hospitalId,
        startDate: this.$moment(this.startDate, this.DATE_TIME_FORMAT.DATE_CHARACTER).format('YYYY-MM'),
        endDate: this.$moment().format('YYYY-MM')
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.dashboard {
  padding: 20px 10px;
}

.ageStyle {
  font-size: 18px;
  font-weight: bold;
  color: black;
  display: block;
}

.chart-height {
  height: 23rem;
  position: relative;
}
</style>