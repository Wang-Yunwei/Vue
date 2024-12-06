<template>
  <div class="pre-exam-triage-list-wrapper">
    <med-s-card :class="['pre-exam-triage-list-card', collapsed ? 'collapsed' : '']">
      <med-s-form
        ref="forms"
        layout="card"
        :gutter="24"
        :responsive="{ xl: 6, lg: 8, md: 12, sm: 24, xs: 24 }"
        :dataSource="formDataSource.slice(4)"
        @submit="formSubmit"
        @reset="clearQueryForm"
        :maxItem="0"
      >
        <template #title>
          <med-s-form-model :form="queryParam" :gutter="24" :dataSource="formDataSource.slice(0, 4)" />
        </template>
      </med-s-form>
    </med-s-card>
    <med-s-card class="pre-exam-triage-list-card">
      <template #title>
        <span>搜索结果</span>
        <statistics :data="resultMassage" />
      </template>
      <template #extra>
        <med-button class="export-btn" icon="icon_daochuexcel" @click="regExport">导出Excel</med-button>
      </template>
      <template>
        <med-s-table
          class="standard-table"
          @batchOpt="regExport"
          :scroll="{ x: 1980 }"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :columns="tableColumnsDataSource"
          :dataSource="tableDataSource"
          rowKey="regId"
          :expandedRowKeys="[]"
          ref="table"
          questNow
        >
          <span slot="regAge" slot-scope="_, record">{{ record.regAgeCaption }}</span>
          <span :class="levelClass(text)" slot="resetLevel" slot-scope="text">{{ text === '0' ? '' : text }}</span>
          <div class="ant-dropdown-link" slot="action" slot-scope="text, record">
            <a @click="details(record)">编辑</a>
            <a-divider type="vertical"></a-divider>
            <a @click="showOptModal(record, '修改患者去向', 'turnResult')">去向</a>
            <a-divider type="vertical"></a-divider>
            <a @click="cardIdManage(record)">卡号管理</a>
            <a-divider type="vertical"></a-divider>
            <a-dropdown>
              <a-menu slot="overlay" class="more-actions">
                <a-menu-item key="1">
                  <print-btn
                    modal-title="查看明细"
                    :patientInfo="record"
                    :tabMode="false"
                    :width="500"
                    :height="626"
                    :source="getDetailSource"
                    style="color:#ff8690"
                  >急诊明细</print-btn
                  >
                </a-menu-item>
                <!-- <a-menu-item key="2"> 电子病历 </a-menu-item> -->
                <!-- <a-menu-item key="3"> 院前急救 </a-menu-item> -->
                <a-menu-item key="4">
                  <wrist-band :rowData="record" style="color:#ff8690" @change="formSubmit" />
                </a-menu-item>
                <a-menu-item key="5" style="text-align:center">
                  <print-btn :patientInfo="record" style="color:#ff8690" />
                </a-menu-item>
                <a-menu-item
                  @click="showOptModal(record, '作废', 'isUsed')"
                  key="6"
                  style="text-align:center;color:#ff8690"
                >
                  作废
                </a-menu-item>
              </a-menu>
              <a style="color: #999;">
                更多
                <a-icon type="down" />
              </a>
            </a-dropdown>
          </div>
        </med-s-table>
        <whereabouts
          :visible="whereaboutsVisible"
          :data="whereaboutsData"
          :turnResultList="turnResultMenu"
          @cancel="whereaboutsVisible = false"
          @refreshList="formSubmit"
        />
        <med-s-modal v-model="visible_isUsed" title="确认" @submit="isUsed()">
          确定要作废该条记录吗？
        </med-s-modal>
      </template>
    </med-s-card>
    <reg v-if="showModal" :showModal="showModal" :patientProp="patient" @cancel="showModal = false"></reg>
  </div>
</template>
<script>
import moment from 'moment'
import { regRemove, regList, getDetailPdfUrl, getTickertapePdfUrl } from '@/api/preExam/basic'
import { queryByCodeList } from '@/api'
import DownMixin from '@/mixins/fileDownload'
import Reg from './../registration'
import Whereabouts from './../whereabouts'
import WristBand from '../wristBand'
import Statistics from '../components/Statistics.vue'
import { PrintBtn } from '@/components'
import { mapGetters } from 'vuex'

const responsive = {
  xl: 12,
  lg: 12,
  md: 12,
  sm: 12,
  xs: 12
}
const dataSource_turnResult = [
  {
    labelText: '姓名',
    type: 'text',
    placeholder: '文本输入区域',
    fieldName: 'name',
    disabled: true,
    wrongMsg: '请输入文本'
  },
  {
    labelText: '病历号',
    type: 'text',
    placeholder: '文本输入区域',
    fieldName: 'patientId',
    disabled: true,
    wrongMsg: '请输入文本'
  },
  {
    labelText: '当前去向',
    type: 'text',
    placeholder: '文本输入区域',
    fieldName: 'turnResult',
    disabled: true,
    wrongMsg: '请输入文本',
    responsive: {
      xl: 24,
      lg: 24,
      md: 24,
      sm: 24,
      xs: 24
    },
    formLayout: {
      labelCol: {
        span: 3
      },
      wrapperCol: {
        span: 9
      }
    }
  },
  {
    labelText: '去向时间',
    type: 'datetime',
    fieldName: 'formField4',
    placeholder: '选择日期',
    showTime: true,
    initialValue: moment()
  },
  {
    labelText: '诊断',
    type: 'text',
    placeholder: '文本输入区域',
    fieldName: 'diagnoseDescribe',
    wrongMsg: '请输入文本'
  },
  {
    labelText: '修改去向',
    type: 'select',
    placeholder: '',
    open: false,
    showArrow: false,
    fieldName: 'changeTurnResult',
    optionList: []
  },
  {
    labelText: '科室',
    type: 'select',
    fieldName: 'departmentId',
    disabled: true,
    placeholder: '请选择科室',
    optionList: []
  }
]
export default {
  name: 'TriageList',
  components: {
    Reg,
    Statistics,
    PrintBtn,
    Whereabouts,
    WristBand
  },
  mixins: [DownMixin],
  mounted() {
    this.isMounted = true
  },
  data() {
    return {
      total: 0,
      isMounted: false,
      whereaboutsVisible: false,
      whereaboutsData: {},
      triageFlag: false,
      turnResultMenu: [],
      form: {},
      responsive,
      dataSource_turnResult,
      regId: '',
      visible_turnResult: false,
      visible_isUsed: false,
      patient: {},
      showModal: false,
      modalRecord: {},
      modalTitle: '',
      resultMassage: {},
      selectedRowKeys: [],
      formDataSource: [
        {
          labelText: '分诊时间',
          type: 'datetimeRange',
          showTime: true,
          fieldName: 'triageTime',
          placeholder: ['开始时间', '结束时间'],
          responsive: {
            xxl: 8,
            xl: 12,
            lg: 24
          },
          formLayout: {
            labelCol: {
              xxl: 5
            },
            wrapperCol: {
              xxl: 19
            }
          }
        },
        {
          labelText: '三无患者',
          type: 'select',
          fieldName: 'isNoname',
          placeholder: '全部',
          optionList: [
            {
              label: '否',
              value: '0'
            },
            {
              label: '是',
              value: '1'
            }
          ],
          responsive: {
            xxl: 4,
            xl: 6,
            lg: 8,
            md: 12,
            sm: 12
          },
          formLayout: {
            labelCol: {
              xxl: 10,
              xl: 8,
              lg: 8,
              md: 8,
              sm: 8
            },
            wrapperCol: {
              xxl: 14,
              xl: 16,
              lg: 16,
              md: 16,
              sm: 16
            }
          }
        },
        {
          labelText: '院前急救',
          type: 'select',
          fieldName: 'isFirstAid',
          placeholder: '全部',
          optionList: [
            {
              label: '否',
              value: 0
            },
            {
              label: '是',
              value: 1
            }
          ],
          responsive: {
            xxl: 4,
            xl: 6,
            lg: 8,
            md: 12,
            sm: 12
          },
          formLayout: {
            labelCol: {
              xxl: 10,
              xl: 8,
              lg: 8,
              md: 8,
              sm: 8
            },
            wrapperCol: {
              xxl: 14,
              xl: 16,
              lg: 16,
              md: 16,
              sm: 16
            }
          }
        },
        {
          type: 'text',
          placeholder: '患者姓名/急诊编号/病历号',
          fieldName: 'searchValue',
          wrongMsg: '请输入文本',
          responsive: {
            xxl: 8,
            xl: 12,
            lg: 8
          },
          formLayout: {
            labelCol: {
              span: 0
            },
            wrapperCol: {
              span: 24
            }
          }
        },
        {
          labelText: '就诊科室',
          type: 'select',
          fieldName: 'departmentId',
          placeholder: '全部',
          optionList: []
        },
        {
          labelText: '性别',
          type: 'select',
          fieldName: 'gender',
          placeholder: '全部',
          optionList: [
            {
              label: '女',
              value: '2'
            },
            {
              label: '男',
              value: '1'
            },
            {
              label: '未知',
              value: '3'
            }
          ]
        },
        {
          labelText: '患者诊断',
          type: 'text',
          placeholder: '请输入',
          fieldName: 'diagnoseDescribe',
          wrongMsg: '请输入文本'
        },
        {
          labelText: '分诊级别',
          type: 'select',
          fieldName: 'resetLevel',
          placeholder: '全部',
          optionList: []
        },
        {
          labelText: '转归区域',
          type: 'select',
          fieldName: 'turnResult',
          placeholder: '',
          optionList: []
        },
        {
          labelText: '绿色通道',
          type: 'select',
          fieldName: 'greenChannel',
          placeholder: '全部',
          optionList: []
        },
        {
          labelText: '状态',
          type: 'select',
          fieldName: 'isUsed',
          placeholder: '正常',
          // initialValue: '1', // 默认值无效
          optionList: [
            {
              label: '正常',
              value: '1'
            },
            {
              label: '作废',
              value: '0'
            }
          ]
        },
        {
          labelText: '主诉类别',
          type: 'text',
          placeholder: '请输入',
          fieldName: 'categoryName',
          wrongMsg: '请输入文本'
        }
      ],
      tableColumnsDataSource: [
        {
          title: '分诊时间',
          dataIndex: 'triageTime',
          key: 'triageTime',
          width: 168,
          align: 'center',
          sorter: true
        },
        {
          title: '急诊编号',
          dataIndex: 'regId',
          key: 'regId',
          width: 130,
          align: 'center',
          sorter: true
        },
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
          align: 'center'
        },
        {
          title: '性别',
          dataIndex: 'gender',
          key: 'gender',
          align: 'center',
          width: 70,
          sorter: true
        },
        {
          title: '年龄',
          dataIndex: 'regAge',
          key: 'regAge',
          align: 'center',
          sorter: true,
          scopedSlots: {
            customRender: 'regAge'
          }
        },
        {
          title: '分诊级别',
          dataIndex: 'resetLevel',
          key: 'resetLevel',
          align: 'center',
          scopedSlots: {
            customRender: 'resetLevel'
          },
          width: 90,
          sorter: true
        },
        {
          title: '患者主诉',
          dataIndex: 'subjective',
          key: 'subjective',
          align: 'center'
        },
        {
          title: '生命体征',
          dataIndex: 'mcvInfo',
          key: 'mcvInfo',
          width: 200,
          align: 'center'
        },
        {
          title: '诊断',
          dataIndex: 'diagnoseDescribe',
          key: 'diagnoseDescribe',
          align: 'center'
        },
        {
          title: '就诊科室',
          dataIndex: 'departmentId',
          key: 'departmentId',
          align: 'center'
        },
        {
          title: '去向',
          dataIndex: 'turnResult',
          key: 'turnResult',
          align: 'center'
        },
        {
          title: '就诊医师',
          dataIndex: 'checkDoctorId',
          key: 'checkDoctorId',
          align: 'center'
        },
        {
          title: '分诊护士',
          dataIndex: 'nurseId',
          key: 'nurseId',
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          align: 'center',
          width: 248,
          scopedSlots: {
            customRender: 'action'
          }
        }
      ],
      queryParam: {
        triageTime: [moment().startOf('month'), moment().endOf('month')]
      },
      // total: 0,
      tableDataSource: parameter => {
        const requestParameters = Object.assign({ hospitalId: this.hospitalId }, parameter, this.queryParam)
        if (requestParameters.sortOrder) {
          requestParameters.sortBy = {
            name: requestParameters.sortField,
            mode: requestParameters.sortOrder === 'ascend' ? 'asc' : 'desc'
          }
        }
        delete requestParameters.sortField
        delete requestParameters.sortOrder
        return regList(requestParameters).then(res => {
          this.resultMassage = res.body.resultMassage
          this.total = res.body.iPage.total
          return res.body.iPage
        })
      }
    }
  },
  async created() {
    this.getDictionaryData()
  },
  computed: {
    ...mapGetters(['hospitalId']),
    collapsed() {
      if (!this.isMounted) {
        return
      }
      const { forms } = this.$refs
      return forms && forms.collapsed
    }
  },
  methods: {
    // parseAge({ regAge, triageTime }) {
    //   if (!regAge) {
    //     return ''
    //   }
    //   // age是浮点数,这里依据分诊时间换算出月份和天数
    //   const endDay = moment(moment(triageTime).format('YYYY-MM-DD'))
    //   const years = Math.floor(regAge)
    //   let months = 0
    //   let days = 0
    //   if (years < 2 && years < regAge) {
    //     const startDay = endDay.clone()
    //     do {
    //       startDay.subtract(1, 'day')
    //     } while (parseFloat(endDay.diff(startDay, 'year', true).toFixed(4) || 0) < regAge)
    //     months = endDay.diff(startDay.subtract({ year: years }), 'month')
    //     days = endDay.diff(startDay.subtract({ month: months }), 'day')
    //   }
    //   let result = ''
    //   if (regAge >= 2) {
    //     result = `${regAge}岁`
    //   } else if (regAge >= 1 && regAge < 2) {
    //     result = `${regAge}岁${months}月`
    //   } else {
    //     result = `${months}月${days}天`
    //   }
    //   return result
    //   // this.years = years
    //   // this.months = months
    //   // this.days = days
    // },
    levelClass(text) {
      let className = 'level-'
      switch (text) {
        case '一级':
          className += '1'
          break
        case '二级':
          className += '2'
          break
        case '三级':
          className += '3'
          break
        case '四级':
          className += '4'
          break

        default:
      }
      return className
    },
    async getDetailSource(patientInfo) {
      let src = ''
      const { regId } = patientInfo
      const res = await getDetailPdfUrl({ regId })
      if (res) {
        const blob = new Blob([res], { type: 'application/pdf;chartset=UTF-8' })
        src = URL.createObjectURL(blob)
      }
      return src
    },
    // 获取字典数据
    async getDictionaryData() {
      const params = {
        codeList: [
          'greenChannel', //绿色通道
          'departmentId', //就诊科室
          'turnResult', //转归区域
          'modifyreason', //修改分级分诊原因
          'resetLevel' // 分诊级别
        ],
        hospitalId: this.hospitalId
      }
      const res = await queryByCodeList(params)
      const { greenChannel, departmentId, turnResult, modifyreason, resetLevel } = res.result || {}
      const extraGreenChannelOpts = [
        // 绿通额外的筛选项
        {
          label: '无',
          value: 'A'
        },
        {
          label: '所有绿色通道',
          value: 'B'
        }
      ]
      this.resetOptionList('greenChannel', extraGreenChannelOpts.concat(greenChannel), 'formDataSource') //绿色通道
      this.resetOptionList('departmentId', departmentId, 'formDataSource') //就诊科室
      this.resetOptionList('departmentId', departmentId, 'dataSource_turnResult') //就诊科室
      this.resetOptionList('turnResult', turnResult, 'formDataSource') //转归区域
      this.resetOptionList('changeTurnResult', turnResult, 'formDataSource') //转归区域
      this.resetOptionList('changeTurnResult', turnResult, 'dataSource_turnResult') //转归区域
      this.resetOptionList('resetLevel', resetLevel, 'formDataSource') //分诊级别
      this.turnResultMenu = turnResult
    },
    clearQueryForm() {
      this.queryParam = {}
    },
    resetOptionList(key, arr, index) {
      if (index == 'formDataSource') {
        this.formDataSource.forEach(item => {
          if (item.fieldName === key) {
            this.$set(item, 'optionList', arr)
          }
        })
      } else {
        this.dataSource_turnResult.forEach(item => {
          if (item.fieldName === key) {
            this.$set(item, 'optionList', arr)
          }
        })
      }
    },
    handleTurnResultChange(val) {
      this.form.changeTurnResult = val
    },

    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    formSubmit(params) {
      this.queryParam = { ...this.queryParam, ...params }
      this.$refs.table.refresh()
    },
    async regExport(params) {
      this.$refs.forms.submit()
      console.log(this.queryParam)
      // await regExport(this.queryParam)
      this.downFile(
        '/piat/RegistrationInfoController/v1/regExport',
        { ...this.queryParam, pageNo: 1, pageSize: this.total },
        '急诊患者预检分诊登记表.xlsx'
      )
    },
    details(params) {
      this.$router.push({
        path: '/preExam/selfReg',
        query: {
          regId: params.regId
        }
      })
    },
    callSlipUrl(row) {
      return '/piat/GroupEvents/printCallSlip/' + row.regId
    },
    showOptModal(record, title, type) {
      if (type == 'edit') {
        //编辑
        this.regId = record.regId
      } else if (type == 'turnResult') {
        //去向
        this.whereaboutsVisible = true
        this.whereaboutsData = record
        this.regId = record.regId
      } else if (type == 'isUsed') {
        this.visible_isUsed = true
        this.regId = record.regId
      }
    },
    async turnResult() {
      console.log('去向')
    },
    cardIdManage(patient) {
      this.patient = patient
      this.showModal = true
      console.log(this.patient)
    },
    async isUsed() {
      await regRemove([this.regId])
      this.visible_isUsed = false
      this.formSubmit()
    }
  }
}
</script>
<style lang="less" scoped>
@import '~ant-design-vue/es/style/themes/default.less';

.pre-exam-triage-list {
  &-wrapper {
    overflow: hidden;
  }
  &-card {
    box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.1);
    /deep/ .med-s-form-wrapper {
      .ant-card-head {
        min-height: 0;
        padding: 0;
        .ant-card-head-wrapper {
          align-items: start;
        }
        .ant-card-head-title,
        .ant-card-extra {
          padding: 0;
        }
      }
      .ant-form-item {
        height: 32px;
        margin-bottom: 12px;
        .ant-form-item-label {
        }
        .ant-form-item-control {
          min-width: 20px;
        }
      }
    }
    &:not(:last-child) {
      margin-bottom: 10px;
      /deep/ .ant-card-body {
        padding: 15px 20px 0 20px;
        .ant-card-body {
          padding: 0;
        }
      }
    }
    &.collapsed {
      /deep/ .ant-card-body .ant-card-body {
        > .ant-row {
          padding-top: 14px;
        }
      }
    }

    &:nth-child(2) {
      /deep/ .ant-card-head {
        box-shadow: 0 2px 10px 1px #e5e6e9;
        z-index: 2;
        padding: 0 15px;
        margin: 0;
        .export-btn {
          margin: 7px 30px;
          height: 28px;
          padding: 0 10px;
        }
        .anticon-icon_daochuexcel {
          font-size: 18px;
          margin-right: 0;
        }
      }
      /deep/ .ant-card-body {
        padding-top: 0;
      }
    }
  }
}
</style>
