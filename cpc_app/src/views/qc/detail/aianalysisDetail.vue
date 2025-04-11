<template>
  <div class="med-analysis-detail-wrapper">
    <van-cell class="condition">
      <div class="condition_date">
        <med-date-picker
          v-model="queryApi.startTime"
          label=""
          placeholder="开始时间"
          formatter="YYYY-MM-DD"
          :clearable="false"
          :disabled="true"
        />
        <span class="condition_seperator"> ~ </span>
        <med-date-picker
          v-model="queryApi.endTime"
          label=""
          placeholder="结束时间"
          formatter="YYYY-MM-DD"
          :clearable="false"
          :disabled="true"
        />
      </div>
      <template #right-icon>
        <van-button size="mini" style="border:none" v-if="false">
          <van-icon name="search" />
        </van-button>
      </template>
    </van-cell>
    <div class="scroll-view">
      <div class="card title-card">
        <div>{{ queryApi.code + "* " + title }}</div>
      </div>
      <div class="card chart-card">
        <med-line-chart
          v-if="yAxisType === '1'"
          :series-data="lineChart.seriesData"
          :x-axis-data="lineChart.xAxisData"
          :y-axis-data="yAxisData"
          :show-legend="true"
        ></med-line-chart>
        <med-line-chart
          v-else
          :series-data="lineChart.seriesData"
          :x-axis-data="lineChart.xAxisData"
          :y-axis-data="yAxisDataPercent"
          :show-legend="true"
        ></med-line-chart>
      </div>
      <van-cell class="van-cell__table">
        <template #title>
          <table cellspacing="0" style="width:100%">
            <tr>
              <th>月份</th>
              <th v-if="yAxisType === '1'">平均时间(分)</th>
              <th v-if="isFollowUp === '1'">随访周期</th>
              <th>符合量/总量</th>
              <th>符合率</th>
              <th>操作</th>
            </tr>
            <tr v-for="(item, index) in monthStatsList" :key="index">
              <td>{{ item.month }}</td>
              <td v-if="yAxisType === '1'">{{ item.avgTime }}</td>
              <td v-if="isFollowUp === '1'">{{ item.cycle }}</td>
              <td>{{ item.accordWithNum }}/{{ item.total }}</td>
              <td>{{ item.accordWithRate }}</td>
              <td>
                <van-button
                  @click.stop="showDetail(item)"
                  size="mini"
                  type="primary"
                  >查看</van-button
                >
              </td>
            </tr>
          </table>
        </template>
      </van-cell>
      <van-cell class="van-cell__tableDetail">
        <template #title>
          <table cellspacing="0" style="width:100%" v-if="isShowDetail">
            <tr>
              <th>
                <span>{{ colTitle }}</span
                ><span v-if="isFollowUp === '1'">({{ colCycle }})</span>
              </th>
            </tr>
          </table>

          <table cellspacing="0" style="width:100%" v-if="isShowDetail">
            <tr>
              <th>编号</th>
              <th>{{ colName }}</th>
              <th v-if="colType === '1'">{{ colStartName }}</th>
              <th v-if="colType === '1'">{{ colEndName }}</th>
              <th>{{ colTimeName }}</th>
            </tr>
            <tr v-for="(item, index) in patientList" :key="index">
              <td
                v-if="item.isSaas === '1'"
                @click="goEdit(item)"
                style="color:blue"
              >
                {{ item.code }}
              </td>
              <td v-else>{{ item.code }}</td>
              <td>{{ item.name }}</td>
              <td v-if="colType === '1'">{{ timeFormat(item.startTime) }}</td>
              <td v-if="colType === '1'">{{ timeFormat(item.endTime) }}</td>
              <td
                v-if="colType === '1' && item.isaccordWith === '0'"
                style="color:red"
              >
                {{ timeDescription(item) }}
              </td>
              <td v-if="colType === '1' && item.isaccordWith !== '0'">
                {{ timeDescription(item) }}
              </td>
              <td v-if="colType !== '1'">
                {{ isaccordDescription(item.isaccordWith) }}
              </td>
            </tr>
          </table>
        </template>
      </van-cell>
    </div>
    <med-loading v-model="showLoading" />
  </div>
</template>

<script>
import { dicConstant } from '@/constant/commonConstant'
import { mapGetters, mapMutations } from 'vuex'
import * as types from '@/store/mutations/mutations-types'
import state from '@store/state/state'
import moment from 'moment'
import storage from 'store'
const yAxisNames = [
  '5.16',
  '5.17',
  '5.19',
  '5.21',
  '5.22',
  '5.23',
  '5.33',
  '5.34',
  '5.35_1',
  '5.35_2',
  '5.35_3',
  '5.35_4',
  '5.36',
  '5.39'
]
export default {
  name: 'aianalysisDetail',
  components: {},
  data() {
    return {
      isShowDetail: false,
      showLoading: false,
      readonly: true,
      colCycle: '',
      dataDesc: {},
      isFollowUp: '',
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
      yAxisType: ''
    }
  },
  mounted() {
    this.getQcIndex()
  },
  // 钩子方法
  created() {},
  computed: {},
  methods: {
    goEdit(item) {
      this.$api.service.getRegisterIdByReportId(item.id).then(res => {
        if (res.status === 200) {
          const token = storage.get(types.SET_ACCESS_TOKEN)
          const url = window.location.href.split('/')
          const newUrl =
            url[0] +
            '//' +
            url[1] +
            url[2] +
            '/patient/document/detail?registId=' +
            res.result +
            '&status=31&openUrl=1&token=' +
            token
          console.log(newUrl)
          this.$bridge.openLink(newUrl)
          //  this.$router.push({
          //   path: '/patient/document/detail',
          //   query: {
          //     registId: res.result,
          //     status: '31',
          //     openUrl: 1
          //     // type: this.quertList.type
          //   }
          // })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    },
    showSearch() {
      if (this.searchVisible === false) {
        this.searchVisible = true
      } else {
        this.searchVisible = false
      }
    },
    getQcIndex() {
      this.showLoading = true
      this.$api.service.getQcIndex(this.queryApi).then(res => {
        if (res.status === 200) {
          this.chartType = res.result.chartType
          this.lineChart = res.result.lineChart
          this.monthStatsList = res.result.monthStatsList
          this.shortTitle = res.result.shortTitle
          this.title = res.result.title
          this.isFollowUp = res.result.isFollowUp
          this.standardValue = res.result.standardValue
          if (yAxisNames.indexOf(res.result.code) >= 0) {
            this.yAxisDataPercent[0].name = 'min'
          }
          this.yAxisType = res.result.yAxisType // 1 是平均时间  2 是百分比
          if (res.result.header != null) {
            this.colType = res.result.header.type
            console.log(res.result.header.titleList.length)
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
                (res.result.header.titleList.length === 2 ||
                  res.result.header.titleList.length === 3)
              ) {
                this.colName = res.result.header.titleList[0]
                this.colTimeName = res.result.header.titleList[1]
                // this.colEndName = res.result.header.titleList[2]
                // this.colTimeName = res.result.header.titleList[3]
              }
            }
          }
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
        this.showLoading = false
      })
    },
    getPatientDetailList(item) {
      this.queryApi.month = item.month
      this.showLoading = true
      this.$api.service.getQcPatientList(this.queryApi).then(res => {
        if (res.status === 200) {
          this.patientList = res.result
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
        this.showLoading = false
      })
    },
    showDetail(item) {
      this.isShowDetail = true
      console.log(item)
      this.colTitle = item.month
      this.colCycle = item.cycle
      this.getPatientDetailList(item)
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
    isaccordDescription(item) {
      if (item == null || item === '') {
        return ''
      }
      if (item === '1') {
        return '有'
      } else {
        return '无'
      }
    },
    timeFormat(time) {
      if (time === null) {
        return ''
      }
      return moment(time).format('MM-DD HH:mm')
    }
  },
  watch: {}
}
</script>

<style lang="less" scoped>
@import "@/views/index.less";
.med-analysis-detail-wrapper {
  .scroll-view {
    height: calc(100vh - 240px);
    overflow-y: auto;
    .chart-title {
      margin-top: 12px;
      background: #fff;
    }
  }
  .condition {
    background: #fff;
    .condition_date {
      display: flex;
      align-items: center;
    }
    /deep/ .van-cell {
      padding: 0;
      .van-icon {
        font-size: 28px;
      }
      input {
        text-align: center;
      }
    }
    .condition_seperator {
      padding: 0 12px;
    }
  }
  .card {
    width: 95%;
    position: relative;
    background: #ffffff;
    border-radius: 15px;
    margin: 16px auto;
    display: flex;
    flex-flow: column;
    align-content: center;
    align-items: stretch;
  }
  .title-card {
    font-size: 28px;
    color: #fff;
    background-color: #5e74fe;
    div {
      padding: 16px 32px;
    }
  }
  .chart-card {
    padding: 24px 0px;
    -moz-box-shadow: 0px 3px 15px #a6a6a6;
    -webkit-box-shadow: 0px 3px 15px #a6a6a6;
    box-shadow: 0px 3px 15px #a6a6a6;
  }

  .van-cell__table {
    color: rgba(0, 0, 0, 0.87);

    /deep/ .van-cell__value {
      flex: 0;
    }
    /deep/ .van-cell__title {
      width: 100%;
      max-width: none;
      margin-right: 0;
    }
    tr {
      box-sizing: border-box;
      // pointer-events: none;
      right: 0.426667rem;
      left: 0.426667rem;
      border-bottom: 0.026667rem solid #ebedf0;
    }
    th,
    td {
      // height: 48px;
      // background: #333bd2;
      padding: 22px 0;
      text-align: center;
    }
    tr:nth-child(2n-1) {
      // background-color: rgb(175, 217, 241);
    }
    tr:nth-child(2n) {
      // background-color: rgb(204, 235, 192);
    }
  }
  .van-cell__tableDetail {
    color: rgba(0, 0, 0, 0.87);

    /deep/ .van-cell__value {
      flex: 0;
    }
    /deep/ .van-cell__title {
      width: 100%;
      max-width: none;
      margin-right: 0;
    }
    tr {
      box-sizing: border-box;
      // pointer-events: none;
      right: 0.426667rem;
      left: 0.426667rem;
      border-bottom: 0.026667rem solid #ebedf0;
    }
    th,
    td {
      // height: 48px;
      // background: #333bd2;
      font-size: 22px;
      padding: 22px 0;
      text-align: center;
    }
    tr:nth-child(2n-1) {
      // background-color: rgb(175, 217, 241);
    }
    tr:nth-child(2n) {
      // background-color: rgb(204, 235, 192);
    }
  }
}
</style>
