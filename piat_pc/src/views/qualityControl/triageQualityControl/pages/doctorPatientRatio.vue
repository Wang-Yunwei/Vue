<template>
  <div :class="$style.wrapper">
    <med-s-card title="急诊科医护患比" :bordered="false">
      <a-row type="flex" :gutter="10">
        <a-col flex="520px">
          <a-space>
            <a-date-picker
              mode="year"
              format="YYYY"
              v-show="timeShowFlag"
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
          <a-button @click="onSubmit('year')">年度</a-button>
        </a-col>
        <a-col>
          <a-button @click="showModal" icon="icon_baocun" type="primary" ghost>配置</a-button>
          <a-button @click="exportExcel" icon="cloud-download" type="primary" ghost>导出</a-button>
        </a-col>
      </a-row>
    </med-s-card>
    <med-s-card :bordered="false" v-show="timeShowFlag">
      <a-row type="flex" :gutter="10">
        <a-col :span="12">
          <div :class="$style.liteBox">
            <med-s-table
              ref="requestTable"
              rowKey="name"
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
    <med-s-card :bordered="false" title="数据对照" v-show="yearShowFlag">
      <med-s-table
        class="standard-table"
        ref="detailsTable"
        :columns="detailsColumnsDataSource"
        :dataSource="detailsDataSource"
        rowKey="id"
      >
        <div slot="hospitalArea" slot-scope="text">
          {{ automatch(toHospialList, text, 'value', 'label') }}
        </div>
        <div slot="patientNumber" slot-scope="text">
          {{ text / 10000 }}
        </div>
      </med-s-table>
    </med-s-card>
    <a-modal title="配置-急诊科医护患比" :visible="visible" @cancel="handleCancel" width="900px" :footer="null">
      <med-s-table
        class="standard-table"
        ref="numberTable"
        rowKey="id"
        :columns="medicalNumberColumns"
        :dataSource="medicalNumberDataSource"
      >
        <div slot="hospitalArea" slot-scope="text">
          {{ automatch(toHospialList, text, 'value', 'label') }}
        </div>
        <div slot="action" slot-scope="text, record" class="flex-c-s">
          <med-button type="link" @click="edit(record)">修改</med-button>
          <a-divider type="vertical" />
          <med-button type="link" @click="deleteSubmit(record)">删除</med-button>
        </div>
      </med-s-table>
      <div><med-button block icon="plus" @click="onInsert">新增</med-button></div>
    </a-modal>
    <a-modal
      title="配置-急诊科医护患比"
      :visible="editVisible"
      @ok="handleEidtOk"
      @cancel="handleEidtCancel"
      width="900px"
      ok-text="确认"
      cancel-text="取消"
    >
      <med-s-form-model
        ref="eidtTable"
        :form="medicalNumberEditForm"
        :dataSource="medicalNumberEditColumns"
        :responsive="formResponsive"
        @submit="submit"
      />
    </a-modal>
  </div>
</template>
<script>
import DownMixin from '@/mixins/fileDownload'
import { Column } from '@antv/g2plot'
import moment from 'moment'
import { queryByArea, queryList, saveOrUpdateByKey, getHospitals } from '@/api/preExam/triageQualityControl' // 接口
import { exportAsExcel } from '@/utils/excel'
export default {
  name: 'DoctorPatientRation',
  components: {},
  data() {
    return {
      // 针对不同分辨率，表单 整体布局（可理解为一行几个， 例 24 / 8，xl分辨率为一行3个）
      formResponsive: { xxl: 12, xl: 12, lg: 12, md: 12, sm: 24, xs: 24 },
      plot: null,
      timeShowFlag: true,
      yearShowFlag: false,
      visible: false, //配置弹框flag
      editVisible: false, //修改页面弹框flag
      mode: ['year', 'year'],
      triageYearArray: [moment().startOf('year'), moment().endOf('year')],
      triageMonthDate: moment().format('YYYY'),
      monthOpenFlag: false,
      doctorPatientRationRequestVo: [],
      doctorPatientRationNumberRequestVo: {},
      doctorPatientRationDetail: [],
      doctorPatientRationDetails: [],
      medicalNumberEditForm: {},
      toHospialList: [],
      timeValue: [],
      tableDataSource: parameter => {
        const requestParameters = Object.assign({}, parameter, this.doctorPatientRationRequestVo)
        return queryByArea(requestParameters).then(res => {
          this.doctorPatientRationDetail = { ...res.result }
          this.doctorPatientRationDetails = []
          this.doctorPatientRationDetails.push(
            {
              name: '医生总数',
              patientNumber: this.doctorPatientRationDetail.doctorNumber
            },
            { name: '护士总数', patientNumber: this.doctorPatientRationDetail.nurseNumber },
            { name: '分诊患者总数', patientNumber: this.doctorPatientRationDetail.patientNumber },
            {
              name: '医患比',
              patientNumber: this.doctorPatientRationDetail.doctorPatientRatio
                ? (this.doctorPatientRationDetail.doctorPatientRatio * 100).toFixed(3) + '%'
                : 0
            },
            {
              name: '护患比',
              patientNumber: this.doctorPatientRationDetail.nursePatientRatio
                ? (this.doctorPatientRationDetail.nursePatientRatio * 100).toFixed(3) + '%'
                : 0
            }
          )
          const doctorDetail = { ...res.result, patientNumber: res.result?.patientNumber / 10000 || [] }
          this.initPieCharts(doctorDetail)
          res.result = { current: 1, records: this.doctorPatientRationDetails, pageSize: 1 }
          return res.result
        })
      },
      medicalNumberDataSource: parameter => {
        const requestParameters = Object.assign({}, parameter, this.doctorPatientRationNumberRequestVo)
        return queryList(requestParameters).then(res => {
          return res.result
        })
      },
      detailsDataSource: parameter => {
        const requestParameters = Object.assign({}, parameter, this.doctorPatientRationNumberRequestVo)
        return queryList(requestParameters).then(res => {
          res.result.records = res.result?.records?.map(item => {
            let patientNumber = 0
            let nurseNumber = 0
            let patientNumberKey = 0
            let nurseNumberKey = 0

            if (item.doctorNumber) {
              patientNumberKey = 1
              patientNumber = Math.round(item.patientNumber / item.doctorNumber / 10000)
            }
            if (item.nurseNumber) {
              nurseNumberKey = 1
              nurseNumber = Math.round(item.patientNumber / item.nurseNumber / 10000)
            }
            return {
              ...item,
              doctorPatientRatio: patientNumberKey + ':' + patientNumber,
              nursePatientRatio: nurseNumberKey + ':' + nurseNumber
            }
          })
          return res.result
        })
      },
      tableColumnsDataSource: [
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '数值',
          dataIndex: 'patientNumber',
          key: 'patientNumber'
        }
      ],
      medicalNumberColumns: [
        {
          title: '年份',
          dataIndex: 'year',
          key: 'year',
          sorter: (a, b) => a.year > b.year
        },
        {
          title: '院区',
          dataIndex: 'hospitalArea',
          key: 'hospitalArea',
          scopedSlots: {
            customRender: 'hospitalArea'
          }
        },
        {
          title: '医生总数',
          dataIndex: 'doctorNumber',
          key: 'doctorNumber'
        },
        {
          title: '护士总数',
          dataIndex: 'nurseNumber',
          key: 'nurseNumber'
        },
        {
          title: '患者总数',
          dataIndex: 'patientNumber',
          key: 'patientNumber'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          scopedSlots: {
            customRender: 'action'
          }
        }
      ],
      medicalNumberEditColumns: [
        {
          labelText: '年份',
          type: 'text',
          placeholder: '请选择年份',
          fieldName: 'year',
          required: true,
          wrongMsg: ''
        },
        {
          labelText: '院区',
          type: 'select',
          placeholder: '请选择院区',
          fieldName: 'hospitalArea',
          required: true,
          optionList: []
        },
        {
          labelText: '医生总数',
          type: 'text',
          placeholder: '请输入医生总数',
          fieldName: 'doctorNumber',
          required: true,
          wrongMsg: ''
        },
        {
          labelText: '护士总数',
          type: 'text',
          placeholder: '请输入护士总数',
          fieldName: 'nurseNumber',
          required: true,
          wrongMsg: ''
        },
        {
          labelText: '患者总数',
          type: 'text',
          placeholder: '请输入患者总数',
          fieldName: 'patientNumber',
          required: true,
          wrongMsg: ''
        }
      ],
      detailsColumnsDataSource: [
        {
          title: '年份',
          dataIndex: 'year',
          key: 'year',
          sort: true
        },
        {
          title: '院区',
          dataIndex: 'hospitalArea',
          key: 'hospitalArea',
          scopedSlots: {
            customRender: 'hospitalArea'
          }
        },
        {
          title: '医生总数',
          dataIndex: 'doctorNumber',
          key: 'doctorNumber'
        },
        {
          title: '护士总数',
          dataIndex: 'nurseNumber',
          key: 'nurseNumber'
        },
        {
          title: '患者总数(万)',
          dataIndex: 'patientNumber',
          key: 'patientNumber',
          scopedSlots: {
            customRender: 'patientNumber'
          }
        },
        {
          title: '医患比',
          dataIndex: 'doctorPatientRatio',
          key: 'doctorPatientRatio'
        },
        {
          title: '护患比',
          dataIndex: 'nursePatientRatio',
          key: 'nursePatientRatio'
        }
      ]
    }
  },
  mixins: [DownMixin],
  async created() {
    await this.getHospitals() // 获取医院
    const obj = {
      hospitalArea: this.toHospialList //来院方式
    }
    this.medicalNumberEditColumns.forEach(item => {
      if (Object.keys(obj).includes(item.fieldName)) {
        this.$set(item, 'optionList', obj.hospitalArea)
      }
    })
  },
  created() {
    this.onSubmit('day')
  },
  methods: {
    onInsert() {
      this.medicalNumberEditForm = {}
      this.editVisible = true
    },
    //自动匹配
    automatch(arr, val, key, sKey) {
      const obj = arr.find(item => item[key] === val)
      if (obj) return obj[sKey]
      else return ''
    },
    async getHospitals() {
      const res = await getHospitals()
      this.toHospialList = res.result.map(item => {
        item.value = item.id
        item.label = item.name
      })
      this.toHospialList = res.result
    },
    async deleteSubmit(record) {
      const medClinicMedicalNumberEntity = { ...record, status: '0' }
      const res = await saveOrUpdateByKey(medClinicMedicalNumberEntity)
    },
    submit() {
      console.log(this.medicalNumberEditForm, 444444444444)
    },
    edit(record) {
      this.medicalNumberEditForm = { ...record }
      this.editVisible = true
    },
    //配置弹框
    showModal() {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.numberTable.refresh()
      })
    },
    handleCancel() {
      this.visible = false
    },
    async handleEidtOk() {
      const medClinicMedicalNumberEntity = { ...this.medicalNumberEditForm }
      const res = await saveOrUpdateByKey(medClinicMedicalNumberEntity)
      if (res.result.status === 200) {
        this.$notification.success({ message: '提交成功', description: '提交成功' })
      } else {
        this.$notification.success({ message: '提交失败', description: res.result.message })
        return
      }
      this.editVisible = false
      this.$refs.numberTable.refresh()
    },
    handleEidtCancel() {
      this.editVisible = false
    },
    initPieCharts(arr) {
      this.plot && this.plot.destroy()
      this.plot = null
      const { doctorNumber, nurseNumber, patientNumber } = arr
      const data = [
        { type: '医生（人）', value: doctorNumber },
        { type: '护士（人）', value: nurseNumber },
        { type: '患者（万人）', value: patientNumber }
      ]
      const cfg = {
        data,
        xField: 'type',
        yField: 'value',
        colorField: 'type',
        color: ({ type }) => {
          if (type === '医生（人）') {
            return '#66cdcc'
          } else if (type === '护士（人）') {
            return '#e1b6e1'
          }
          return '#9999cd'
        },
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
      if (this.timeValue === 'year') {
        this.downFile(
          '/piat/medClinicMedicalNumber/detailExport',
          this.doctorPatientRationNumberRequestVo,
          '急诊科医护患比.xlsx'
        )
      } else if (this.timeValue === 'day') {
        this.exporting = true
        const year = this.doctorPatientRationRequestVo.year || ''
        await exportAsExcel({
          fileName: '急诊科医护患比.xlsx',
          sheets: [
            {
              sheetName: '急诊科医护患比',
              title: '急诊科医护患比',
              subtitle: `时间范围:` + year,
              columns: this.tableColumnsDataSource,
              dataSource: this.doctorPatientRationDetails,
              chart: this.plot.chart
            }
          ]
        })
        this.exporting = false
      }
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

    async onSubmit(va) {
      if (va === 'day') {
        this.timeValue = 'day'
        this.timeShowFlag = true
        this.yearShowFlag = false
        const hospitalArea = '1231313'
        this.doctorPatientRationRequestVo = { year: this.triageMonthDate, hospitalArea: hospitalArea }
        this.$nextTick(() => {
          this.$refs.requestTable.refresh()
        })
      }
      if (va === 'year') {
        this.timeValue = 'year'
        this.timeShowFlag = false
        this.yearShowFlag = true
        if (this.triageYearArray != null) {
          this.doctorPatientRationNumberRequestVo = {
            startTime: moment(this.triageYearArray[0]).format('YYYY'),
            endTime: moment(this.triageYearArray[1]).format('YYYY')
          }
        }
        this.$nextTick(() => {
          this.$refs.detailsTable.refresh()
        })
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
