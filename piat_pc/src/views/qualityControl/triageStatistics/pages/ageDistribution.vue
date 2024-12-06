<template>
  <div :class="$style.wrapper">
    <med-s-card title="病人年龄段分布" :bordered="false">
      <a-row type="flex" :gutter="10">
        <a-col flex="520px">
          <a-space>
            <a-range-picker v-model="triageTimeArray" />
            <a-button @click="onSubmit" type="primary" ghost>查询</a-button>
          </a-space>
        </a-col>
        <a-col flex="auto"> </a-col>
        <a-col>
          <a-button @click="exportExcel" icon="cloud-download" type="primary" ghost>导出</a-button>
        </a-col>
      </a-row>
    </med-s-card>
    <med-s-card :bordered="false">
      <div :class="$style.liteBox">
        <div id="container" />
      </div>
    </med-s-card>
  </div>
</template>
<script>
import DownMixin from '@/mixins/fileDownload'
import { Column } from '@antv/g2plot'
import moment from 'moment'
import { queryAgeCount } from '@/api/preExam/triageStatistics' // 接口
import { exportAsExcel } from '@/utils/excel'
export default {
  name: 'AgeDistribution',
  components: {},
  data() {
    return {
      plot: null,
      ageDistributionRequestVo: {},
      ageDistributionCountVo: {},
      triageTimeArray: [moment().startOf('month'), moment().endOf('month')]
    }
  },
  mixins: [DownMixin],
  created() {
    this.onSubmit()
  },
  methods: {
    async onSubmit(va) {
      if (this.triageTimeArray != null) {
        this.ageDistributionRequestVo = {
          startTime: moment(this.triageTimeArray[0]).format('YYYY-MM-DD'),
          endTime: moment(this.triageTimeArray[1]).format('YYYY-MM-DD')
        }
      }
      const res = await queryAgeCount(this.ageDistributionRequestVo)
      this.ageDistributionCountVo = res.result
      this.initPieCharts(this.ageDistributionCountVo)
    },
    initPieCharts(arr) {
      this.plot && this.plot.destroy()
      this.plot = null
      const data = arr
      const cfg = {
        data,
        isGroup: true,
        xField: 'regAge',
        yField: 'count',
        seriesField: 'gender',
        // 分组柱状图 组内柱子间的间距 (像素级别)
        dodgePadding: 2,
        // 分组柱状图 组间的间距 (像素级别)
        intervalPadding: 80,
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
        // columns: this.detailsColumnsDataSource,
        // dataSource: this.dataSource,
        fileName: '病人年龄段分布.xlsx',
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
