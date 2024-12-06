<template>
  <div :class="$style.wrapper">
    <med-s-card title="来诊时间段分布" :bordered="false">
      <a-row type="flex" :gutter="10">
        <a-col flex="520px">
          <a-space>
            <a-range-picker v-model="triageTime" v-show="timeShowFlag" />
            <!-- <a-date-picker v-model="triageTime" v-show="timeShowFlag" /> -->
            <a-date-picker
              mode="year"
              format="YYYY"
              v-show="monthShowFlag"
              v-model="triageMonthDate"
              :open="monthOpenFlag"
              placeholder="请选择"
              @panelChange="monthPanelChange"
              @focus="monthOpenFlag = true"
            />
            <a-range-picker
              v-show="yearShowFlag"
              :mode="mode"
              format="YYYY"
              @panelChange="yearPanelChange"
              v-model="triageYearArray"
              ref="yearRange"
            />
            <a-button @click="onSubmit()" type="primary" ghost>查询</a-button>
          </a-space>
        </a-col>
        <a-col flex="auto">
          <a-radio-group button-style="solid" @change="onClick($event.target.value)">
            <a-radio-button value="day">
              天
            </a-radio-button>
            <a-radio-button value="month">
              月
            </a-radio-button>
            <a-radio-button value="year">
              年
            </a-radio-button>
          </a-radio-group>
        </a-col>
        <a-col>
          <a-button @click="exportExcel" icon="cloud-download" type="primary" ghost>导出</a-button>
        </a-col>
      </a-row>
    </med-s-card>
    <med-s-card :bordered="false">
      <a-col>
        <div :class="$style.liteBox">
          <div id="container" />
        </div>
      </a-col>
    </med-s-card>
  </div>
</template>
<script>
import DownMixin from '@/mixins/fileDownload'
import { Column } from '@antv/g2plot'
import moment from 'moment'
import { queryTimeCount, queryMonthCount, queryYearCount } from '@/api/preExam/triageStatistics' // 接口
import { exportAsExcel } from '@/utils/excel'
export default {
  name: 'TimePeriodDistribution',
  components: {},
  data() {
    return {
      plot: null,
      timeShowFlag: true,
      monthShowFlag: false,
      monthOpenFlag: false,
      yearShowFlag: false,
      mode: ['year', 'year'],
      timeType: '',
      timePeriodDistributionRequestVo: {},
      timePeriodDistributionTimeCountVo: {},
      triageMonthDate: moment().format('YYYY'),
      // triageTime: moment(),
      triageTime: [moment().startOf('month'), moment().endOf('month')],
      triageYearArray: [moment().startOf('year'), moment().endOf('year')]
    }
  },
  mixins: [DownMixin],
  created() {
    this.onSubmit()
  },
  methods: {
    monthPanelChange(date) {
      this.triageMonthDate = String(date.year())
      this.monthOpenFlag = false
    },
    yearPanelChange(date, mode) {
      this.triageYearArray = date
      if (mode[1] === null) {
        if (this.$refs.yearRange?.$refs?.picker) {
          this.$refs.yearRange.$refs.picker.sOpen = false
        }
      }
    },
    onClick(va) {
      this.timeType = va
      this.onSubmit(this.timeType)
    },
    async onSubmit(va) {
      va = this.timeType
      if (va === 'day' || va === '') {
        this.timeShowFlag = true
        this.monthShowFlag = false
        this.yearShowFlag = false
        if (this.triageTime != null) {
          this.timePeriodDistributionRequestVo = {
            startTime: moment(this.triageTime[0]).format('YYYY-MM-DD'),
            endTime: moment(this.triageTime[1]).format('YYYY-MM-DD')
          }
        }
        const res = await queryTimeCount(this.timePeriodDistributionRequestVo)
        this.timePeriodDistributionTimeCountVo = res.result
      }
      if (va === 'month') {
        this.timeShowFlag = false
        this.monthShowFlag = true
        this.yearShowFlag = false
        this.timePeriodDistributionRequestVo = { triageTime: moment(this.triageMonthDate).format('YYYY') }
        const res = await queryMonthCount(this.timePeriodDistributionRequestVo)
        this.timePeriodDistributionTimeCountVo = res.result
      }
      if (va === 'year') {
        this.timeShowFlag = false
        this.monthShowFlag = false
        this.yearShowFlag = true
        if (this.triageYearArray != null) {
          this.timePeriodDistributionRequestVo = {
            startTime: moment(this.triageYearArray[0]).format('YYYY'),
            endTime: moment(this.triageYearArray[1]).format('YYYY')
          }
        }
        const res = await queryYearCount(this.timePeriodDistributionRequestVo)
        this.timePeriodDistributionTimeCountVo = res.result
      }
      this.initPieCharts(this.timePeriodDistributionTimeCountVo)
    },
    initPieCharts(arr) {
      this.plot && this.plot.destroy()
      this.plot = null
      const data = arr
      const cfg = {
        data,
        xField: 'triageTime',
        yField: 'count',
        colorField: 'triageTime',
        label: {
          // 可手动配置 label 数据标签位置
          position: 'middle', // 'top', 'bottom', 'middle',
          // 配置样式
          style: {
            fill: '#FFFFFF',
            opacity: 0.6
          }
        },
        xAxis: {
          label: {
            autoHide: true,
            autoRotate: false
          }
        },
        yAxis: {
          line: {
            style: {
              lineWidth: 2,
              cursor: 'pointer'
            }
          }
        },
        meta: {
          type: {
            alias: '类别'
          },
          value: {
            alias: '人数'
          }
        },
        theme: {
          styleSheet: {
            backgroundColor: '#fff'
          }
        }
      }
      this.plot = new Column('container', cfg)
      this.plot.render()
    },
    async exportExcel() {
      this.exporting = true
      await exportAsExcel({
        fileName: '来诊时间段分布.xlsx',
        sheets: [
          {
            chart: this.plot.chart
          }
        ]
      })
      this.exporting = false
    }
  }
}
</script>
<style lang="less" module>
.wrapper {
  > div[class~='med-s-card-wrapper'] {
    &:first-child {
      :global {
        .ant-calendar-picker-input,
        .ant-btn {
          border-radius: 5px;
          font-size: 16px;
          line-height: 20px;
        }
        .ant-btn {
          color: #5e74fe;
          border-color: #94a3ff;
        }
        .ant-radio-button-wrapper {
          padding: 0 40px;
          font-size: 16px;
          height: 32px;
          line-height: 30px;
          border-color: #94a3ff;
          &:not(.ant-radio-button-wrapper-checked) {
            color: #5e74fe;
          }
          &:first-child {
            border-radius: 5px 0 0 5px;
          }
          &:last-child {
            border-radius: 0 5px 5px 0;
          }
        }
      }
    }

    &:nth-child(2) {
      :global {
        .ant-table-thead > tr > th {
          background-color: rgb(94, 116, 254);
          color: #fff;
          padding: 9px 16px;
        }
        .ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
          background: rgb(255, 237, 239);
        }
      }
    }
    &:nth-child(3) {
      :global {
        .ant-card-head {
          box-shadow: 0 2px 10px 1px #e5e6e9;
          z-index: 2;
          padding: 0 15px;
          margin: 0;
        }
        .ant-card-body {
          padding-top: 0;
        }
      }
    }

    &:not(:first-child) {
      margin-top: 10px;
      border-radius: 5px;
    }
    .liteBox {
      padding: 10px;
      border: 1px solid #eee;
      height: 100%;
    }
    > div[class~='ant-card-body'] {
      padding: 10px;
    }
  }
}

.multiLevelHeader {
  :global {
    .ant-table-thead > tr > th {
      box-shadow: -1px 1px 0.5px #fff inset;
    }
  }
}
</style>
