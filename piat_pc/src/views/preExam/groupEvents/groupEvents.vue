<template>
  <div class="pre-exam-basic-wrapper">
    <!--新增事件模块-->
    <med-s-card class="container-card">
      <div>
        <med-s-card title="事件信息" :bordered="false">
          <med-s-form-model
            ref="ruleForm"
            :form="form1"
            :dataSource="dataSourceEvent"
            :responsive="formResponsive"
            @submit="submit"
          />
        </med-s-card>
        <div class="flex-c-c">
          <med-button style="margin-right:20px" @click="insertSubmit">
            提交
          </med-button>
          <med-button @click="reset">
            重置
          </med-button>
        </div>
        <med-s-card title="患者列表" style="margin-top:20px">
          <template slot="extra" v-if="temflag">
            <div class="pre-exam-basic-card-btn flex-c-b">
              <div class="pre-exam-basic-card-btn-left flex-c-c"></div>
              <div class="pre-exam-basic-card-btn-right flex-c-c">
                <med-button type="danger" shape="round" icon="icon_dayin" @click="printCallSlipMethod">
                  打印分诊凭条
                </med-button>
                <med-button type="danger" shape="round" icon="icon_dayin" @click="printWristBandsMethod">
                  打印腕带
                </med-button>
                <med-button type="primary" shape="round" icon="icon_jiechuguanlian" @click="disassociate">
                  解除关联
                </med-button>
                <med-button type="primary" shape="round" icon="icon_daoruhuanzhe" @click="onRedirect">
                  导入患者
                </med-button>
              </div>
            </div>
          </template>
          <template>
            <med-s-table
              ref="gesTable"
              :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
              :columns="columns"
              :dataSource="cardInfoList"
              rowKey="regId"
              :questNow="true"
            >
              <div slot="gender" slot-scope="text">
                {{ automatch(gender, text, 'value', 'label') }}
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
              <div slot="action" class="flex-c-s">
                <!-- <med-button type="link" @click="epr(text)">电子病历</med-button> -->
                <med-button type="link">电子病历</med-button>
              </div>
            </med-s-table>
          </template>
        </med-s-card>
      </div>
    </med-s-card>
    <!--导入患者-->
    <reg
      v-if="showModal"
      :showModal="showModal"
      :patientProp="patient"
      @cancel="showModal = false"
      @checkSubmit="checkSubmit"
    ></reg>
    <!--电子病历-->
    <modal-com v-if="modalFlag" :modalFlag="modalFlag" :info="info" @cancel="closeModal"></modal-com>
    <!-- 分诊凭条 -->
    <med-s-modal v-model="triageFlag" title="分诊凭条" @cancel="cancel" @submit="callSlipPrint" width="50%">
      <med-pdf v-if="triageFlag" :url="callSlipUrl" ref="callSlip" />
    </med-s-modal>
    <!-- 腕带 -->
    <med-s-modal :visible="wristBandsFlag" title="腕带" @cancel="cancel" @submit="wristBandsPrint" width="50%">
      <med-pdf v-if="wristBandsFlag" :url="wristBandsUrl" ref="wristBands" />
    </med-s-modal>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import ModalCom from './../selfReg/components/ModalCom' //电子病历
import moment from 'moment'
import MedSubMenu from './../components/medSubMenu.vue'
import { MedPdf } from '@/components'
import Reg from './selfReg'
import DownMixin from '@/mixins/fileDownload'
import { queryByCodeList } from '@/api'
import { gesSaveOrUpdate, gesSelectByIdList, disassociate } from '@/api/preExam/groupEvents' // 接口
const groupEventsColumns = [
  {
    title: '事件发生时间',
    dataIndex: 'eventTime',
    key: 'eventTime'
  },
  {
    title: '事件名称',
    dataIndex: 'eventName',
    key: 'eventName'
  },
  {
    title: '地点',
    dataIndex: 'eventAddress',
    key: 'eventAddress'
  },
  {
    title: '事件性质',
    dataIndex: 'eventProperty',
    key: 'eventProperty',
    scopedSlots: {
      customRender: 'eventProperty'
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    scopedSlots: {
      customRender: 'status'
    }
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    align: 'center',
    scopedSlots: {
      customRender: 'action'
    }
  }
]
export default {
  name: 'PreExamGroup',
  components: {
    MedSubMenu,
    Reg,
    ModalCom,
    MedPdf
  },
  data() {
    return {
      codeList: [
        'toHospitalWayGroup', //来院方式
        'eventProperty', //事件性质
        'slefReport', //主诉
        'departmentId', //分诊科室
        'status', //状态
        'gender', //性别
        'resetLevel', //分诊级别
        'turnResult' //去向
      ],
      param: [], //事件选中数据
      callSlipUrl: '', //分诊任务请求路径
      triageFlag: false, //分诊凭条弹框flag
      wristBandsUrl: '', //腕带
      wristBandsFlag: false, //腕带
      modalVisible: false, //分诊凭条打印flag
      modalFlag: false, //电子病历
      info: {}, //电子病历
      gender: [], //性别
      resetLevel: [], //分诊级别
      eventProperty: [], //事件性质
      status: [], //状态
      patient: {},
      showModal: false,
      cardInfo: [],
      form1: {},
      cardInfoList: parameter => {
        const requestParameters = Object.assign({}, parameter, this.pa)
        return gesSelectByIdList(requestParameters).then(res => {
          this.temflag = true
          this.cardInfo = res.result?.records || []
          return res.result
        })
      },
      queryParam: {},
      selectByKey: {},
      columns: [
        {
          title: '急诊编号',
          dataIndex: 'regId',
          key: 'regId'
        },
        {
          title: '病历号',
          dataIndex: 'patientId',
          key: 'patientId'
        },
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name'
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
          title: '诊断',
          dataIndex: 'diagnoseDescribe',
          key: 'diagnoseDescribe'
        },
        {
          title: '去向',
          dataIndex: 'turnResult',
          key: 'turnResult',
          scopedSlots: {
            customRender: 'turnResult'
          }
        }
      ],
      groupEventsColumns,
      selectedRowKeys: [], // Check here to configure the default column
      // 针对不同分辨率，表单 整体布局（可理解为一行几个， 例 24 / 8，xl分辨率为一行3个）
      formResponsive: { xxl: 8, xl: 8, lg: 12, md: 12, sm: 24, xs: 24 },
      // 针对不同分辨率，表单 label 和 输入框 宽度
      formLayout: {
        labelCol: { xl: 9, lg: 9, md: 9, sm: 5, xs: 5 },
        wrapperCol: { span: 15 }
      },
      // 表单数据源
      dataSourceEvent: [
        {
          labelText: '事件名称',
          type: 'text',
          placeholder: '请输入事件的名称',
          fieldName: 'eventName',
          required: true,
          wrongMsg: '请输入正确格式的名称'
        },

        {
          labelText: '发生时间',
          type: 'datetime',
          placeholder: '请选择发生时间',
          showTime: true,
          fieldName: 'eventTime',
          required: true,
          wrongMsg: '请选择发生时间'
        },
        {
          labelText: '发生地点',
          type: 'text',
          placeholder: '请选择发生地点',
          fieldName: 'eventAddress',
          wrongMsg: '请选择发生地点'
        },
        {
          labelText: '事件性质',
          type: 'radio',
          placeholder: '请选择事件性质',
          fieldName: 'eventProperty',
          required: true,
          wrongMsg: '请选择事件性质',
          buttonType: true,
          optionList: []
        },

        {
          labelText: '事件概述',
          type: 'textarea',
          placeholder: '请输入事件概述',
          fieldName: 'describe',
          required: false,
          wrongMsg: ''
        },
        {
          labelText: '抢救措施',
          type: 'textarea',
          placeholder: '请输入抢救措施',
          fieldName: 'measures',
          required: false,
          wrongMsg: ''
        }
      ],
      groupEventsDataSource: [
        {
          labelText: '事件发生时间',
          type: 'datetimeRange',
          fieldName: 'startAndEndTime',
          showTime: true,
          required: true,
          wrongMsg: '请选择事件发生时间',
          initialValue: [
            moment()
              .startOf('month')
              .format('YYYY-MM-DD 00:00:00'),
            moment()
              .endOf('month')
              .format('YYYY-MM-DD 00:00:00')
          ]
        },
        {
          labelText: '状态',
          type: 'select',
          placeholder: '请选择状态',
          fieldName: 'status',
          required: true,
          wrongMsg: '请选择状态',
          initialValue: '01',
          buttonType: true,
          optionList: []
        }
      ],
      temflag: false, //导入患者四个按钮flag
      buttonflag: false, //电子病历flag
      editflag: false //编辑flag
    }
  },
  mixins: [DownMixin],
  props: {
    pa: {
      type: Object,
      default: null
    }
  },
  computed: {
    ...mapGetters(['hospitalId'])
  },
  async created() {
    this.form1 = { ...this.pa }
    //字典表中参数获取
    const res = await queryByCodeList({ codeList: this.codeList, hospitalId: this.hospitalId })
    const obj = {
      arrayType: res.result.toHospitalWayGroup, //来院方式
      eventProperty: res.result.eventProperty, //事件性质
      slefReport: res.result.slefReport, //主诉
      departmentId: res.result.departmentId, //分诊科室
      clinicDepartmentId: res.result.departmentId, //分诊科室
      status: res.result.status, //状态
      gender: res.result.gender, //性别
      resetLevel: res.result.resetLevel, //分诊级别
      turnResult: res.result.turnResult //去向
    }
    this.gender = obj.gender
    this.resetLevel = obj.resetLevel
    this.eventProperty = obj.eventProperty
    this.turnResult = obj.turnResult
    this.status = obj.status
    this.dataSourceEvent.forEach(item => {
      if (Object.keys(obj).includes(item.fieldName)) {
        if (item.fieldName === 'status') {
          this.$set(item, 'initialValue', obj[item.fieldName])
        } else {
          this.$set(item, 'optionList', obj[item.fieldName])
        }
      }
    })
    this.groupEventsDataSource.forEach(item => {
      if (Object.keys(obj).includes(item.fieldName)) {
        this.$set(item, 'optionList', obj[item.fieldName])
        if (item.fieldName === 'status') {
          const el = obj[item.fieldName].length ? obj[item.fieldName][0].value : ''
          this.$set(item, 'initialValue', el)
        }
      }
    })
  },
  methods: {
    //电子病历使用
    epr() {
      this.info = {
        name: '电子病历',
        age: 24,
        gender: '男'
      }
      this.modalFlag = true
    },
    closeModal() {
      this.info = {}
      this.modalFlag = false
    },
    onRedirect() {
      this.patient = this.form1
      this.showModal = true
    },
    async disassociate() {
      if (this.selectedRowKeys.length > 0) {
        const result = await disassociate(this.selectedRowKeys)
        if (result.result) {
          this.$notification.success({ message: '解除成功 ', description: '解除成功' })
          this.$refs.gesTable.refresh()
        } else {
          this.$notification.success({ message: '解除失败 ', description: '解除失败' })
        }
      } else {
        this.$notification.success({ message: '请选择数据进行操作 ', description: '请选择数据进行操作' })
      }
    },
    async submit() {
      const res = await gesSaveOrUpdate({
        ...this.form1,
        eventTime: moment(this.form1.eventTime).valueOf(),
        status: '01',
        createTime: moment().valueOf()
      })
      if (res.status === 200) {
        this.$notification.success({ message: '提交成功', description: '提交成功' })
      } else {
        this.$notification.success({ message: '提交失败', description: '提交失败' })
        return
      }
      this.queryParamGes = {
        eventId: res.result
      }
      this.$refs.gesTable.refresh()
    },
    async insertSubmit() {
      this.$refs.ruleForm.submit()
      if (this.editflag != true) {
        this.columns.push({
          title: '操作',
          key: 'editAction',
          fixed: 'right',
          align: 'center',
          scopedSlots: {
            customRender: 'editAction'
          }
        })
        this.editflag = true
      }
    },
    async reset() {
      this.form1 = {}
      this.$refs.ruleForm.reset()
    },
    //导出excel
    async exportExcel() {
      this.$refs.groupRef.submit()
      this.downFile('/piat/GroupEvents/exportExcel', this.queryParam, '群伤事件一览.xls')
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    checkSubmit() {
      this.$refs.gesTable.refresh()
      this.showModal = false
    },
    //自动匹配
    automatch(arr, val, key, sKey) {
      const obj = arr.find(item => item[key] === val)
      if (obj) return obj[sKey]
      else return ''
    },
    //打印分诊凭条
    async printCallSlipMethod() {
      console.log(this.selectedRowKeys, 222222222222)
      if (this.selectedRowKeys.length != 1) {
        this.$notification.success({ message: '请选择一条需要打印的患者', description: '请选择一条需要打印的患者' })
      } else {
        const res = this.cardInfo.find(res => res.regId === this.selectedRowKeys[0])
        if (res.patientId != null) {
          this.callSlipUrl = '/piat/GroupEvents/printCallSlip/' + res.regId + '/333'
          this.triageFlag = true
        } else {
          this.$notification.success({
            message: '该患者病历号为空，请重新选择',
            description: '该患者病历号为空，请重新选择'
          })
        }
      }
    },
    //打印腕带
    async printWristBandsMethod() {
      if (this.selectedRowKeys.length != 1) {
        this.$notification.success({ message: '请选择一条需要打印的患者', description: '请选择一条需要打印的患者' })
      } else {
        const res = this.cardInfo.find(res => res.regId === this.selectedRowKeys[0])
        if (res.patientId != null) {
          this.wristBandsUrl = '/piat/GroupEvents/printWristBands/' + res.regId + '/222'
          this.wristBandsFlag = true
        } else {
          this.$notification.success({
            message: '该患者病历号为空，请重新选择',
            description: '该患者病历号为空，请重新选择'
          })
        }
      }
    },
    cancel() {
      this.wristBandsFlag = false
    },
    //打印分诊凭条
    callSlipPrint() {
      this.$refs.callSlip.print()
    },
    //打印腕带
    wristBandsPrint() {
      this.$refs.wristBands.print()
    },
    //编辑返回个人登记页面
    details(params) {
      this.$router.push({
        path: '/preExam/selfReg',
        query: {
          regId: params.regId
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '~ant-design-vue/es/style/themes/default.less';
/deep/ .ant-card-extra {
  width: 90%;
  position: relative !important;
}
.pre-exam-basic {
  &-card-btn {
    flex-wrap: wrap;
    .ant-btn {
      margin: 0 10px;
    }
  }
  &-wrapper {
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
    .status01 {
      color: #009900;
    }
    .status02 {
      color: #cc0000;
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
    /deep/ .ant-card-body {
      padding: 10px;
    }
    .med-s-form-wrapper {
      /deep/ .ant-card-body {
        padding: 0;
      }
    }
    .pre-exam-basic-left {
      padding: 0 10px 10px;
      .info {
        width: 120px;
        margin: 10px auto 0;
        p {
          margin: 0;
          color: #000;
          font-size: 14px;
        }
        .noinfo {
          margin-top: 10px;
        }
      }
    }
    @media (max-width: @screen-sm) {
      .pre-exam-basic-left {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .info {
          margin: 0 30px;
        }
      }
    }
    .pre-exam-basic-right {
      /deep/ .ant-radio-group {
        min-width: 180px;
      }
      &-top {
      }
      &-bottom {
        div {
          flex-wrap: wrap;
        }
      }
    }
  }
}
</style>
