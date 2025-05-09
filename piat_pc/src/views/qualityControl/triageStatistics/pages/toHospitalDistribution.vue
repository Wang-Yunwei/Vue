<template>
  <div :class="$style.wrapper">
    <med-s-card title="来院方式分布" :bordered="false">
      <a-row type="flex" :gutter="10">
        <a-col flex="520px">
          <a-space>
            <a-range-picker v-model="triageTimeArray" />
            <a-button @click="onSubmit" type="primary" ghost>查询</a-button>
          </a-space>
        </a-col>
        <a-col flex="auto"> </a-col>
        <a-col>
          <a-button @click="exportExcel" :loading="exporting" icon="cloud-download" type="primary" ghost>导出</a-button>
        </a-col>
      </a-row>
    </med-s-card>
    <med-s-card :bordered="false">
      <a-row type="flex" :gutter="10">
        <a-col :span="12">
          <div :class="$style.liteBox">
            <med-s-table
              ref="requestTable"
              rowKey="arriveType"
              :columns="tableColumnsDataSource"
              :dataSource="tableDataSource"
              :showPagination="false"
            >
            </med-s-table>
          </div>
        </a-col>
        <a-col :span="12">
          <div :class="$style.liteBox">
            <div id="container" />
          </div>
        </a-col>
      </a-row>
    </med-s-card>
    <med-s-card title="明细数据" :bordered="false">
      <a-row align="bottom">
        <med-s-card :bordered="false">
          <med-s-table
            class="standard-table"
            ref="detailsTable"
            :columns="detailsColumnsDataSource"
            :dataSource="detailsDataSource"
            rowKey="infoId"
          >
            <div slot="gender" slot-scope="text">
              {{ automatch(gender, text, 'value', 'label') }}
            </div>
            <div slot="arriveType" slot-scope="text">
              {{ automatch(toHospitalWay, text, 'value', 'label') }}
            </div>
            <div slot="resetLevel" slot-scope="text" :class="'levelColor' + text">
              {{ automatch(resetLevel, text, 'value', 'label') }}
            </div>
            <div slot="turnResult" slot-scope="text" :class="'turnResult' + text">
              {{ automatch(turnResult, text, 'value', 'label') }}
            </div>
            <div slot="regAge" slot-scope="text, record">
              {{ record.regAgeCaption }}
            </div>
          </med-s-table>
        </med-s-card>
      </a-row>
    </med-s-card>
  </div>
</template>
<script>
import DownMixin from '@/mixins/fileDownload'
import { Pie } from '@antv/g2plot'
import moment from 'moment'
import { queryToHospitalCount, queryToHospitalDetail, exportToHospital } from '@/api/preExam/triageStatistics' // 接口
import { queryByCodeList } from '@/api'
import { exportAsExcel } from '@/utils/excel'
import { mapGetters } from 'vuex'
export default {
  name: 'ReceptionStatistics',
  components: {},
  data() {
    return {
      exporting: false,
      plot: null,
      codeList: ['toHospitalWay', 'gender', 'resetLevel', 'turnResult'],
      gender: [], //性别
      toHospitalWay: [], //患者类型
      resetLevel: [], //分诊级别
      turnResult: [], //去向
      triageTimeArray: [moment().startOf('month'), moment().endOf('month')],
      dataSource: [],
      toHospitalDistributionRequestVo: {},
      toHospitalDistributionCountVo: [],
      tableDataSource: parameter => {
        const requestParameters = Object.assign({}, parameter, this.toHospitalDistributionRequestVo)
        return queryToHospitalCount(requestParameters).then(res => {
          this.toHospitalDistributionCountVo = res.result.map(el => {
            const obj = this.toHospitalWay.find(item => el.arriveType && el.arriveType === item.value)
            if (obj) return { count: el.count, arriveType: obj.label }
            if (!el.arriveType) return { count: el.count, arriveType: '未知' }
          })
          res.result = { current: 1, records: this.toHospitalDistributionCountVo, pageSize: 1 }
          this.initPieCharts(this.toHospitalDistributionCountVo)
          return res.result
        })
      },
      detailsDataSource: parameter => {
        const requestParameters = Object.assign({}, parameter, this.toHospitalDistributionRequestVo)
        return queryToHospitalDetail(requestParameters).then(res => {
          return res.result
        })
      },
      tableColumnsDataSource: [
        {
          title: '名称',
          dataIndex: 'arriveType',
          key: 'arriveType'
        },
        {
          title: '数值',
          dataIndex: 'count',
          key: 'count'
        }
      ],
      detailsColumnsDataSource: [
        {
          title: '分诊时间',
          dataIndex: 'triageTime',
          key: 'triageTime',
          sort: true
        },
        {
          title: '来院方式',
          dataIndex: 'arriveType',
          key: 'arriveType',
          scopedSlots: {
            customRender: 'arriveType'
          }
        },
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '病历号',
          dataIndex: 'patientId',
          key: 'patientId'
        },
        {
          title: '急诊编号',
          dataIndex: 'regId',
          key: 'regId'
        },
        {
          title: '性别',
          dataIndex: 'gender',
          key: 'gender',
          scopedSlots: {
            customRender: 'gender'
          }
        },
        {
          title: '年龄',
          dataIndex: 'regAge',
          key: 'regAge',
          scopedSlots: {
            customRender: 'regAge'
          }
        },
        {
          title: '分诊级别',
          dataIndex: 'resetLevel',
          key: 'resetLevel',
          scopedSlots: {
            customRender: 'resetLevel'
          }
        },
        {
          title: '去向',
          dataIndex: 'turnResult',
          key: 'turnResult',
          scopedSlots: {
            customRender: 'turnResult'
          }
        }
      ]
    }
  },
  mixins: [DownMixin],
  async created() {
    this.getDic()
  },
  computed: {
    ...mapGetters(['hospitalId'])
  },
  methods: {
    //自动匹配
    automatch(arr, val, key, sKey) {
      const obj = arr.find(item => item[key] === val)
      if (obj) return obj[sKey]
      else return ''
    },
    async getDic() {
      const res = await queryByCodeList({ codeList: this.codeList, hospitalId: this.hospitalId })
      const obj = {
        toHospitalWay: res.result.toHospitalWay, //来院方式
        gender: res.result.gender, //性别
        resetLevel: res.result.resetLevel, //分诊级别
        turnResult: res.result.turnResult //去向
      }
      this.toHospitalWay = obj.toHospitalWay
      this.gender = obj.gender
      this.resetLevel = obj.resetLevel
      this.turnResult = obj.turnResult
    },
    async onSubmit(va) {
      if (this.triageTimeArray != null) {
        this.toHospitalDistributionRequestVo = {
          startTime: moment(this.triageTimeArray[0]).format('YYYY-MM-DD'),
          endTime: moment(this.triageTimeArray[1]).format('YYYY-MM-DD')
        }
      }
      this.$refs.requestTable.refresh()
      this.$refs.detailsTable.refresh()
    },
    initPieCharts(arr) {
      const data = arr
      this.plot?.destroy()
      this.plot = new Pie('container', {
        appendPadding: 10,
        data,
        angleField: 'count',
        colorField: 'arriveType',
        radius: 0.75,
        label: {
          type: 'spider',
          labelHeight: 28,
          content: '{name}'
        },
        interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
        theme: {
          styleSheet: {
            backgroundColor: '#fff'
          }
        }
      })

      this.plot.render()
    },
    async exportExcel() {
      if (this.triageTimeArray != null) {
        this.toHospitalDistributionRequestVo = {
          startTime: moment(this.triageTimeArray[0]).format('YYYY-MM-DD'),
          endTime: moment(this.triageTimeArray[1]).format('YYYY-MM-DD')
        }
      }
      const res = await exportToHospital(this.toHospitalDistributionRequestVo)
      this.dataSource = res.result || []

      this.exporting = true
      const { startTime, endTime } = this.toHospitalDistributionRequestVo
      await exportAsExcel({
        fileName: '来院方式分布.xlsx',
        sheets: [
          {
            sheetName: '来院方式分布',
            title: '来院方式分布',
            subtitle: `时间范围:${startTime} - ${endTime}`,
            columns: this.tableColumnsDataSource,
            dataSource: this.toHospitalDistributionCountVo,
            chart: this.plot.chart
          },
          {
            sheetName: '明细表格',
            columns: this.detailsColumnsDataSource,
            dataSource: this.dataSource
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

<style>
.levelColor01 {
  color: #cc0000;
}
.levelColor02 {
  color: #ff6600;
}
.levelColor03 {
  color: #ff9900;
}
.levelColor04 {
  color: #009900;
}
.turnResult01 {
  color: #cc0000;
}
.turnResult02 {
  color: #ff9900;
}
.turnResult03 {
  color: #009900;
}
.turnResult04 {
  color: #009900;
}
</style>
