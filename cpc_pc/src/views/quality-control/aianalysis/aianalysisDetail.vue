<template>
  <div class="med-analysis-detail-wrapper">
    <!-- <el-row>
      <el-col :span="24">
        <div class="card title">
          <div>{{ queryApi.startTime + "至" + queryApi.endTime }}</div>
        </div>
      </el-col>
    </el-row> -->
    <div class="card title-card">
      <div>{{ queryApi.code + "* " + title }}</div>
    </div>
    <el-card class="card">
      <div slot="header">
        <span>认证中心报表</span>
        <span style="float: right;">{{ queryApi.startTime + ' ~ ' + queryApi.endTime }}</span>
      </div>
      <med-line-chart
        :key="yAxisType"
        :series-data="lineChart.seriesData"
        :x-axis-data="lineChart.xAxisData"
        :y-axis-data="yAxisType === '1'? yAxisData : yAxisDataPercent"
        :show-legend="false"
        style="height: 300px;"
      />
      <!-- <med-line-chart
        v-else
        :series-data="lineChart.seriesData"
        :x-axis-data="lineChart.xAxisData"
        :y-axis-data="yAxisDataPercent"
        :show-legend="false"
        style="height: 300px;"
      /> -->
    </el-card>
    <el-card header="月统计报表" class="card">
      <el-table
        :data="monthStatsList"
        style="width: 100%"
      >
        <el-table-column label="月份">
          <template slot-scope="scope">
            {{ scope.row.month }}
          </template>
        </el-table-column>
        <el-table-column v-if="yAxisType === '1'" label="平均时间(分)">
          <template slot-scope="scope">
            {{ scope.row.avgTime }}
          </template>
        </el-table-column>
        <el-table-column :label="labelNameA()">
          <template slot-scope="scope">
            
            {{ !['5.35_1', '5.35_2', '5.35_3', '5.38'].includes(queryApi.code) ? scope.row.accordWithNum + '/' : ''}}{{ scope.row.total }}
          </template>
        </el-table-column>
        <el-table-column v-if="!['5.35_1', '5.35_2', '5.35_3', '5.38'].includes(queryApi.code)" :label="labelNameB()">
          <template slot-scope="scope">
            {{ scope.row.accordWithRate }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="showDetail(scope.row)"
            >查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card v-if="colTitle !== ''" :header="colTitle" class="card chart-memo">
      <el-table
        :data="patientList"
        style="width: 100%"
      >
        <el-table-column :label="colName">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row.id)">{{ scope.row.name }}</el-button>
          </template>
        </el-table-column>
        <el-table-column v-if="colType === '1'" :label="colStartName">
          <template slot-scope="scope">
            {{ timeFormat(scope.row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column v-if="colType === '1'" :label="colEndName">
          <template slot-scope="scope">
            {{ timeFormat(scope.row.endTime) }}
          </template>
        </el-table-column>
        <el-table-column :label="colTimeName">
          <template slot-scope="scope">
            <span v-if="standard(scope.row)" style="color: red;">
              {{ timeDescription(scope.row) }}
            </span>
            <span v-else>
              {{ timeDescription(scope.row) }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getQcIndex, getQcPatientList } from '@/api/qc'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'AianalysisDetail',
  components: {},
  data() {
    return {
      readonly: true,
      dataDesc: {},
      dataQuery: undefined,
      loading: false,
      searchVisible: false,
      patientList: [],
      queryApi: {
        startTime: this.$route.query.startTime,
        endTime: this.$route.query.endTime,
        code: this.$route.query.code,
        month: ''
      },
      expOrg: this.$route.query.expOrg,
      standardValueOrg: this.$route.query.standardValueOrg,
      colName: '',
      colStartName: '',
      colEndName: '',
      colTimeName: '',
      colTitle: '',
      colType: '',
      yAxisData: [
        {
          type: 'value',
          name: '分',
          position: 'left',
          alignTicks: true,
          axisLine: {
            show: true
          }
        }
      ],
      yAxisDataPercent: [
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
      chartType: '',
      lineChart: '',
      monthStatsList: [],
      shortTitle: '',
      title: '',
      standardValue: '',
      yAxisType: '2'
    }
  },
  computed: {
    ...mapGetters([
      'hospitalId'
    ])
  },
  watch: {},
  mounted() {
    this.getQcIndex()
  },
  // 钩子方法
  created() {},
  methods: {
    labelNameA() {
      if(['5.27', '5.31', '5.43'].includes(this.$route.query.code)) {
        return '死亡病例/总量'
      } else if(['5.32', '5.42'].includes(this.$route.query.code)) {
        return '心力衰竭病例/总量'
      } else if(['5.35_1', '5.35_2', '5.35_3', '5.38'].includes(this.$route.query.code)) {
        return '总量'
      } else {
        return '符合量/总量'
      }
    },
    labelNameB() {
      if(['5.27', '5.31', '5.43'].includes(this.$route.query.code)) {
        return '死亡率'
      } else if(['5.32', '5.42'].includes(this.$route.query.code)) {
        return '发生率'
      } else {
        return '综合率'
      } 
    },
    showDetail(item) {
      this.colTitle = item.month
      this.getPatientDetailList(item)
    },
    async getPatientDetailList(item) {
      this.queryApi.month = item.month
      this.queryApi.hospitalId = this.hospitalId
      const res = await getQcPatientList(this.queryApi) || {}
      if (res.status === 200) {
        this.patientList = res.result
      } else {
        this.$notify({ type: 'warning', message: res.message })
      }
    },
    async getQcIndex() {
      this.queryApi.hospitalId = this.hospitalId
      const res = await getQcIndex(this.queryApi) || {}
      if (res.status === 200) {
        this.chartType = res.result.chartType
        this.lineChart = res.result.lineChart
        this.monthStatsList = res.result.monthStatsList
        this.shortTitle = res.result.shortTitle
        this.title = res.result.title
        this.standardValue = res.result.standardValue
        this.yAxisType = res.result.yAxisType // 1 是平均时间  2 是百分比
        if (res.result.header != null) {
          this.colType = res.result.header.type
          if (this.colType === '1') {
            if (
              res.result.header.titleList != null &&
                res.result.header.titleList.length === 4
            ) {
              this.colName = res.result.header.titleList[0]
              this.colStartName = res.result.header.titleList[1]
              this.colEndName = res.result.header.titleList[2]
              this.colTimeName = res.result.header.titleList[3]
            }
          } else {
            if (
              res.result.header.titleList != null &&
                res.result.header.titleList.length === 2
            ) {
              this.colName = res.result.header.titleList[0]
              this.colTimeName = res.result.header.titleList[1]
            }
          }
        }
      } else {
        this.$notify({ type: 'warning', message: res.message })
      }
    },
    timeDescription(item) {
      if (this.colType === '1') {
        if (item.startTime === null || item.endTime === null) {
          return '填报不完整'
        }
        return item.time
      } else {
        return item.isaccordWith
      }
    },
    standard(item) {
      const time = this.timeDescription(item)
      if (typeof time === 'number') {
        if (time <= 0) {
          return true
        }
        return !eval(time + this.expOrg + this.standardValueOrg)
      } 
      return false
    },
    timeFormat(time) {
      if (time === null) {
        return ''
      }
      return moment(time).format('yyyy-MM-DD HH:mm')
    },
    handleEdit(id) {
      const { href } = this.$router.resolve({ name: 'Edit', query: { id: id }})
      window.open(href, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.med-analysis-detail-wrapper {
  width: 60%;
  margin: 0 auto;
  padding: 24px 24px;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100vh;
  .card {
    width: 100%;
    border-radius: 15px;
    margin: 15px auto;
    box-shadow: 0px 3px 15px #a6a6a6;
    font-size: 19px;
    height: auto;
    padding: 16px;
  }

  .title-card {
    font-size: 16px;
    color: #fff;
    background-color: #5e74fe;
  }
}
</style>
