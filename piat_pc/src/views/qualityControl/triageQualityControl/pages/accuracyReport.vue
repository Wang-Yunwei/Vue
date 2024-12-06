<template>
  <div :class="$style.wrapper">
    <med-s-card title="分诊正确率报表" :bordered="false">
      <a-row type="flex" :gutter="10">
        <a-col flex="520px">
          <a-space>
            <a-range-picker v-show="timeShowFlag" v-model="triageTimeArray" />
            <a-date-picker
              mode="year"
              format="YYYY"
              v-show="monthShowFlag"
              v-model="triageMonthDate"
              :open="monthOpenFlag"
              @panelChange="monthPanelChange"
              @focus="monthOpenFlag = true"
            />
            <a-range-picker
              v-show="yearShowFlag"
              format="YYYY"
              :mode="mode"
              @panelChange="yearPanelChange"
              v-model="triageYearArray"
              ref="yearRange"
            />
            <a-config-provider :autoInsertSpaceInButton="false">
              <a-button @click="onSubmit('day')" type="primary" ghost>查询</a-button>
            </a-config-provider>
          </a-space>
        </a-col>
        <a-col flex="auto">
          <a-button-group button-style="solid">
            <a-button @click="onSubmit('month')">
              月度
            </a-button>
            <a-button @click="onSubmit('year')" style="margin-left:30px">
              年度
            </a-button>
          </a-button-group>
        </a-col>
        <a-col>
          <a-button @click="exportExcel" icon="cloud-download" type="primary" ghost>导出</a-button>
        </a-col>
      </a-row>
    </med-s-card>
    <med-s-card :bordered="false">
      <a-row type="flex" :gutter="10">
        <a-col :span="12">
          <div :class="$style.liteBox">
            <med-s-table
              v-show="timeShowFlag"
              ref="requestTable"
              rowKey="errType"
              :columns="tableColumnsDataSource"
              :dataSource="tableDataSource"
              :showPagination="false"
            >
              <template #footer>
                <table>
                  <tfoot>
                    <tr class="ant-table-row">
                      <td width="100px">患者总数</td>
                      <td align="center">{{ patientCount }}</td>
                    </tr>
                  </tfoot>
                </table>
              </template>
            </med-s-table>
            <med-s-table
              :class="$style.multiLevelHeader"
              v-show="monthDataFlag"
              ref="monthTable"
              rowKey="triageTime"
              :columns="monthTableColumnsDataSource"
              :dataSource="monthTableDataSource"
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
            ref="detailTable"
            :columns="detailsColumnsDataSource"
            :dataSource="detailsDataSource"
            rowKey="rowNum"
          >
          </med-s-table>
        </med-s-card>
      </a-row>
    </med-s-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import DownMixin from '@/mixins/fileDownload'
import { Pie, Line, measureTextWidth } from '@antv/g2plot'
import moment from 'moment'
import { exportAsExcel } from '@/utils/excel'
import {
  queryTriageWrongRatio,
  queryTriageWrongRatioDetail,
  queryTriageWrongMonthRatio,
  queryTriageWrongDetailExport
} from '@/api/preExam/triageQualityControl' // 接口
import { queryByCodeList } from '@/api'

export default {
  name: 'PatientProportionReport',
  components: {},
  data() {
    return {
      plot: null,
      codeList: [
        'departmentId', //分诊科室
        'ERR_TYPE',
        'resetLevel' //分诊级别
      ],
      timeShowFlag: true,
      monthShowFlag: false,
      yearShowFlag: false,
      monthDataFlag: false,
      status: '',
      timeType: '',
      mode: ['year', 'year'],
      triageTimeArray: [moment().startOf('month'), moment().endOf('month')],
      triageYearArray: [moment().startOf('year'), moment().endOf('year')],
      triageMonthDate: moment().format('YYYY'),
      monthOpenFlag: false,
      resetLevel: [], //分诊级别
      departmentId: [], //就诊科室
      errType: [], //分诊错误信息
      patientCount: '',
      triageWrongRequestVo: {},
      triageWrongDetailVos: [],
      triageWrongRatioVo: [],
      monthTableDataList: [],
      tableDataSource: parameter => {
        const requestParameters = Object.assign({}, parameter, this.triageWrongRequestVo)
        return queryTriageWrongRatio(requestParameters).then(res => {
          this.patientCount = res?.result?.patientCount
          this.triageWrongRatioVo = [
            ...res?.result?.triageWrongRatioVo,
            { errType: '患者总数', count: this.patientCount }
          ]
          res.result = { current: 1, records: res?.result?.triageWrongRatioVo, pageSize: 1 }
          this.initPieCharts(res?.result?.records)
          return res.result
        })
      },
      detailsDataSource: parameter => {
        const requestParameters = Object.assign({}, parameter, this.triageWrongRequestVo)
        return queryTriageWrongRatioDetail(requestParameters).then(res => {
          res.result.records = res?.result?.records.map(item => {
            let objOld
            let objNew
            if (item.errType === '1') {
              objOld = this.departmentId.find(va => item.oldValue && item.oldValue === va.value)
              objNew = this.departmentId.find(va => item.newValue && item.newValue === va.value)
            } else if (item.errType === '2') {
              objOld = this.resetLevel.find(va => item.oldValue && item.oldValue === va.value)
              objNew = this.resetLevel.find(va => item.newValue && item.newValue === va.value)
            }
            return {
              errType: item.errType,
              name: item.name,
              newValue: objNew?.label,
              oldValue: objOld?.label,
              regId: item.regId,
              rowNum: item.rowNum,
              triageTime: item.triageTime
            }
          })
          return res.result
        })
      },
      monthTableDataSource: parameter => {
        const requestParameters = Object.assign({}, parameter, this.triageWrongRequestVo)
        return queryTriageWrongMonthRatio(requestParameters, this.status).then(res => {
          this.monthTableDataList = res?.result?.triageWrongRatioVos
          this.initLineCharts(res?.result?.ratioChartsVos)
          res.result = { current: 1, records: res?.result?.triageWrongRatioVos, pageSize: 1 }
          return res.result
        })
      },
      tableColumnsDataSource: [
        {
          title: '名称',
          dataIndex: 'errType',
          key: 'errType'
        },
        {
          title: '人数',
          dataIndex: 'count',
          key: 'count'
        },
        {
          title: '占比',
          dataIndex: 'ratio',
          key: 'ratio'
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
          title: '变更前',
          dataIndex: 'oldValue',
          key: 'oldValue'
        },
        {
          title: '变更后',
          dataIndex: 'newValue',
          key: 'newValue'
        },
        {
          title: '修改人员',
          dataIndex: 'createID',
          key: 'createID'
        }
      ],
      monthTableColumnsDataSource: [
        {
          title: '时间',
          dataIndex: 'triageTime',
          key: 'triageTime',
          width: '10%'
        },
        {
          title: '科室错误',
          children: [
            {
              title: '人数',
              dataIndex: 'aCount',
              key: 'aCount',
              width: '10%'
            },
            {
              title: '占比',
              dataIndex: 'aRatio',
              key: 'aRatio',
              width: '10%'
            }
          ]
        },
        {
          title: '级别错误',
          children: [
            {
              title: '人数',
              dataIndex: 'bCount',
              key: 'bCount',
              width: '10%'
            },
            {
              title: '占比',
              dataIndex: 'bRatio',
              key: 'bRatio',
              width: '10%'
            }
          ]
        },
        {
          title: '错误总数',
          children: [
            {
              title: '人数',
              dataIndex: 'cCount',
              key: 'cCount',
              width: '10%'
            },
            {
              title: '占比',
              dataIndex: 'cRatio',
              key: 'cRatio',
              width: '10%'
            }
          ]
        },
        {
          title: '患者总数',
          dataIndex: 'patientCount',
          key: 'patientCount',
          width: '10%'
        }
      ]
    }
  },
  mixins: [DownMixin],
  created() {
    this.getDic()
  },
  computed: {
    ...mapGetters(['hospitalId'])
  },
  methods: {
    async getDic() {
      const res = await queryByCodeList({ codeList: this.codeList, hospitalId: this.hospitalId })
      const obj = {
        resetLevel: res.result.resetLevel, //分诊级别
        departmentId: res.result.departmentId, //就诊科室
        errType: res.result.ERR_TYPE
      }
      this.resetLevel = obj.resetLevel
      this.departmentId = obj.departmentId
      this.errType = obj.errType
    },
    automatch(arr, val, key, sKey) {
      const obj = arr.find(item => item[key] === val)
      if (obj) return obj[sKey]
      else return ''
    },
    initPieCharts(arr) {
      this.plot && this.plot.destroy()
      this.plot = null
      const data = arr
      const cfg = {
        appendPadding: 10,
        data,
        angleField: 'count',
        colorField: 'errType',
        color: ['#66CDCC', '#CC9866', '#5E74FE'],
        radius: 0.75,
        innerRadius: 0.64,
        meta: {
          value: {
            formatter: v => `${v} 人`
          }
        },
        label: {
          type: 'spider',
          labelHeight: 28,
          content: '{name} - {value}人'
        },
        statistic: {
          title: {
            offsetY: -4,
            customHtml: (container, view, datum) => {
              const { width, height } = container.getBoundingClientRect()
              const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2))
              const text = datum ? datum.errType : '总计'
              return this.renderStatistic(d, text, { fontSize: 28 })
            }
          }
        },
        interactions: [{ type: 'element-selected' }, { type: 'element-active' }, { type: 'pie-statistic-active' }],
        theme: {
          styleSheet: {
            backgroundColor: '#fff'
          }
        }
      }
      this.plot = new Pie('container', cfg)
      this.plot.render()
    },
    initLineCharts(arr) {
      this.plot && this.plot.destroy()
      this.plot = null
      const data = arr.map(el => {
        const obj = this.errType.find(item => el.errType === item.value)
        if (obj) return { triageTime: el.triageTime, count: el.count, errType: obj.label }
        return { triageTime: el.triageTime, count: el.count, errType: el.errType }
      })
      const cfg = {
        data,
        xField: 'triageTime',
        yField: 'count',
        seriesField: 'errType',
        point: {
          size: 5,
          shape: 'diamond',
          style: {
            fill: 'white',
            stroke: '#444FDB',
            lineWidth: 2
          }
        },
        state: {
          active: {
            style: {
              shadowBlur: 4,
              stroke: '#000',
              fill: 'red'
            }
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
        color: ['#66CDCC', '#CC9866', '#5E74FE'],
        theme: {
          styleSheet: {
            backgroundColor: '#fff'
          }
        }
      }
      this.plot = new Line('container', { ...cfg })
      this.plot.render()
    },
    renderStatistic(containerWidth, text, style) {
      const { width: textWidth, height: textHeight } = measureTextWidth(text, style)
      const R = containerWidth / 2
      let scale = 1
      if (containerWidth < textWidth) {
        scale = Math.min(
          Math.sqrt(Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2)))),
          1
        )
      }
      const textStyleStr = `width:${containerWidth}px;`
      return `<div style="${textStyleStr};font-size:${scale}em;line-height:${scale < 1 ? 1 : 'inherit'};">${text}</div>`
    },
    yearPanelChange(date, mode) {
      this.triageYearArray = date
      if (mode[1] === null) {
        if (this.$refs.yearRange?.$refs?.picker) {
          this.$refs.yearRange.$refs.picker.sOpen = false
        }
      }
    },
    monthPanelChange(date) {
      this.monthOpenFlag = false
      this.triageMonthDate = moment(date).format('YYYY')
    },
    async exportExcel() {
      this.triageWrongDetailVos = await queryTriageWrongDetailExport(this.triageWrongRequestVo)
      this.triageWrongDetailVos.result = this.triageWrongDetailVos.result.map(item => {
        let objOld
        let objNew
        if (item.errType === '1') {
          objOld = this.departmentId.find(va => item.oldValue && item.oldValue === va.value)
          objNew = this.departmentId.find(va => item.newValue && item.newValue === va.value)
        } else if (item.errType === '2') {
          objOld = this.resetLevel.find(va => item.oldValue && item.oldValue === va.value)
          objNew = this.resetLevel.find(va => item.newValue && item.newValue === va.value)
        }
        return {
          errType: item.errType,
          name: item.name,
          newValue: objNew?.label,
          oldValue: objOld?.label,
          regId: item.regId,
          rowNum: item.rowNum,
          triageTime: item.triageTime
        }
      })
      this.exporting = true
      if (this.timeType === 'day') {
        const { startTime, endTime } = this.triageWrongRequestVo
        await exportAsExcel({
          fileName: '分诊正确率报表.xlsx',
          sheets: [
            {
              sheetName: '分诊正确率报表',
              title: '分诊正确率报表',
              subtitle: `时间范围:${startTime} - ${endTime}`,
              columns: this.tableColumnsDataSource,
              dataSource: this.triageWrongRatioVo,
              chart: this.plot.chart
            },
            {
              sheetName: '明细表格',
              columns: this.detailsColumnsDataSource,
              dataSource: this.triageWrongDetailVos?.result
            }
          ]
        })
      } else if (this.timeType === 'month' || this.timeType === 'year') {
        let year
        if (this.timeType === 'month') {
          year = this.triageWrongRequestVo.year || []
        } else if (this.timeType === 'year') {
          year = this.triageWrongRequestVo.startYear + '-' + this.triageWrongRequestVo.endYear
        }
        await exportAsExcel({
          fileName: '急诊各级患者比例.xlsx',
          sheets: [
            {
              sheetName: '急诊各级患者比例',
              title: '急诊各级患者比例',
              subtitle: `时间范围:` + year,
              columns: this.monthTableColumnsDataSource,
              dataSource: this.monthTableDataList,
              chart: this.plot.chart
            },
            {
              sheetName: '明细表格',
              columns: this.detailsColumnsDataSource,
              dataSource: this.triageWrongDetailVos?.result
            }
          ]
        })
      }

      this.exporting = false
    },
    async onSubmit(va) {
      this.timeType = va
      if (va === 'day') {
        this.timeShowFlag = true
        this.monthShowFlag = false
        this.yearShowFlag = false
        this.monthDataFlag = false
        if (this.triageTimeArray != null) {
          this.triageWrongRequestVo = {
            startTime: moment(this.triageTimeArray[0]).format('YYYY-MM-DD'),
            endTime: moment(this.triageTimeArray[1]).format('YYYY-MM-DD')
          }
        }
        this.$refs.requestTable.refresh()
        this.$refs.detailTable.refresh()
      }
      if (va === 'month') {
        this.timeShowFlag = false
        this.monthShowFlag = true
        this.yearShowFlag = false
        this.monthDataFlag = true
        this.status = '1'
        this.triageWrongRequestVo = { year: moment(this.triageMonthDate).format('YYYY') }
        this.$refs.monthTable.refresh()
        this.$refs.detailTable.refresh()
      }
      if (va === 'year') {
        this.timeShowFlag = false
        this.monthShowFlag = false
        this.yearShowFlag = true
        this.monthDataFlag = true
        this.status = '2'
        if (this.triageYearArray != null) {
          this.triageWrongRequestVo = {
            startYear: moment(this.triageYearArray[0]).format('YYYY'),
            endYear: moment(this.triageYearArray[1]).format('YYYY')
          }
        }
        this.$refs.monthTable.refresh()
        this.$refs.detailTable.refresh()
      }
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
</style>
