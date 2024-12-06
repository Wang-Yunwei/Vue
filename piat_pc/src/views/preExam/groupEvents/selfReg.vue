<template>
  <med-s-modal
    v-model="visible"
    centered
    title="患者列表"
    size="large"
    @cancel="$emit('cancel')"
    @submit="checkSubmit">
    <div class="pre-exam-basic-wrapper">
      <med-s-form
        ref="forms"
        layout="inline"
        :responsive="{ xl: 6, lg: 6, md: 12, sm: 24, xs: 24 }"
        :dataSource="formDataSource"
        title="表单标题"
        @submit="formSubmit"
      />
      <div>
        {{ gradeMessage }}
      </div>
      <template>
        <med-s-table
          questNow
          :scroll="{ x: 1980, y: 480 }"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :columns="tableColumnsDataSource"
          :dataSource="tableDataSource"
          rowKey="regId"
          :expandedRowKeys="[]"
          ref="table"
        >
          <div slot="gender" slot-scope="text">
            {{ automatch(gender, text, 'value', 'label') }}
          </div>
          <div slot="resetLevel" slot-scope="text" :class="'levelColor' + text">
            {{ automatch(resetLevel, text, 'value', 'label') }}
          </div>
          <div slot="departmentId" slot-scope="text">
            {{ automatch(departmentId, text, 'value', 'label') }}
          </div>
          <div slot="turnResult" slot-scope="text">
            {{ automatch(turnResult, text, 'value', 'label') }}
          </div>
          <div slot="checkDoctorId" slot-scope="text">
            {{ automatch(checkDoctorId, text, 'value', 'label') }}
          </div>
          <div slot="action">
            <med-button>电子病历</med-button>
          </div>
        </med-s-table>
      </template>
    </div>
  </med-s-modal>
</template>
<script>
import { mapGetters } from 'vuex'
import { selectByCardInfo } from '@/api/preExam/groupEvents' // 接口
import { bindingCardInfoList } from '@/api/preExam/groupEvents'
import moment from 'moment'
import { queryByCodeList } from '@/api'
export default {
  name: 'TriageList',
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    patientProp: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      codeList: [
        'greenChannel', //绿色通道
        'departmentId', //就诊科室
        'turnResult', //转归区域
        'gender', //性别
        'resetLevel', //分诊级别
        'checkDoctorId' //就诊医生
      ],
      gender: [], //性别
      resetLevel: [], //分诊级别
      departmentId: [], //就诊科室
      turnResult: [], //转归区域
      visible: this.showModal,
      patient: {},
      gradeMessage: '',
      selectedRowKeys: [],
      formDataSource: [
        {
          labelText: '分诊时间',
          type: 'datetimeRange',
          showTime: true,
          fieldName: 'startAndEndTime',
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
          ]
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
          ]
        },
        {
          type: 'text',
          placeholder: '患者姓名/急诊编号/病历号',
          fieldName: 'searchValue',
          wrongMsg: '请输入文本'
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
          optionList: []
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
          fieldName: 'channel',
          placeholder: '全部',
          optionList: []
        },
        {
          labelText: '状态',
          type: 'select',
          fieldName: 'checkStatus',
          placeholder: '正常',
          optionList: [
            {
              label: '正常',
              value: '0'
            },
            {
              label: '作废',
              value: '1'
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
          key: 'triageTime'
        },
        {
          title: '急诊编号',
          dataIndex: 'regId',
          key: 'regId'
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
          key: 'regAge'
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
          title: '患者主诉',
          dataIndex: 'subjective',
          key: 'subjective'
        },
        {
          title: '生命体征',
          dataIndex: 'mcvInfo',
          key: 'mcvInfo'
        },
        {
          title: '诊断',
          dataIndex: 'diagnoseDescribe',
          key: 'diagnoseDescribe'
        },
        {
          title: '就诊科室',
          dataIndex: 'departmentId',
          key: 'departmentId',
          scopedSlots: {
            customRender: 'departmentId'
          }
        },
        {
          title: '去向',
          dataIndex: 'turnResult',
          key: 'turnResult',
          scopedSlots: {
            customRender: 'turnResult'
          }
        },
        {
          title: '就诊医师',
          dataIndex: 'checkDoctorId',
          key: 'checkDoctorId',
          scopedSlots: {
            customRender: 'checkDoctorId'
          }
        },
        {
          title: '分诊护士',
          dataIndex: 'nurseId',
          key: 'nurseId'
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          scopedSlots: {
            customRender: 'action'
          }
        }
      ],
      queryParam: {},
      tableDataSource: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return selectByCardInfo(requestParameters).then(res => {
          return res.result
        })
      }
    }
  },
  async created() {
    const res = await queryByCodeList({ codeList: this.codeList, hospitalId: this.hospitalId })
    const obj = {
      channel: res.result.greenChannel, //绿色通道
      departmentId: res.result.departmentId, //就诊科室
      turnResult: res.result.turnResult, //转归区域
      gender: res.result.gender, //性别
      resetLevel: res.result.resetLevel, //分诊级别
      checkDoctorId: res.result.checkDoctorId //就诊医生
    }
    this.gender = obj.gender
    this.resetLevel = obj.resetLevel
    this.departmentId = obj.departmentId
    this.turnResult = obj.turnResult
    this.checkDoctorId = obj.checkDoctorId
    this.formDataSource.forEach(item => {
      if (Object.keys(obj).includes(item.fieldName)) {
        this.$set(item, 'optionList', obj[item.fieldName])
      }
    })
  },
  computed: {
    ...mapGetters(['hospitalId'])
  },
  methods: {
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    formSubmit(params) {
      this.queryParam = params
      if (this.queryParam.startAndEndTime != null) {
        this.queryParam.triageTimeStart = moment(this.queryParam.startAndEndTime[0]).valueOf()
        this.queryParam.triageTimeEnd = moment(this.queryParam.startAndEndTime[1]).valueOf()
      }
      this.$refs.table.refresh()
    },
    async checkSubmit() {
      this.patient = this.patientProp
      if (this.selectedRowKeys.length > 0) {
        const bindingResult = await bindingCardInfoList(this.selectedRowKeys, this.patient.eventId)
        if (bindingResult.result) {
          this.$notification.success({ message: '绑定成功 ', description: '绑定成功' })
          this.$emit('checkSubmit')
        } else {
          this.$notification.success({ message: '绑定失败 ', description: '绑定失败' })
        }
      } else {
        this.$notification.success({ message: '请选择绑定数据', description: '请选择绑定数据' })
      }
    },
    //自动匹配
    automatch(arr, val, key, sKey) {
      const obj = arr.find(item => item[key] === val)
      if (obj) return obj[sKey]
      else return ''
    }
  }
}
</script>

<style lang="less" scoped>
.project-list {
  .card-title {
    font-size: 0;

    a {
      color: rgba(0, 0, 0, 0.85);
      margin-left: 12px;
      line-height: 24px;
      height: 24px;
      display: inline-block;
      vertical-align: top;
      font-size: 14px;

      &:hover {
        color: #1890ff;
      }
    }
  }

  .card-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }

  .project-item {
    display: flex;
    margin-top: 8px;
    overflow: hidden;
    font-size: 12px;
    height: 20px;
    line-height: 20px;

    a {
      color: rgba(0, 0, 0, 0.45);
      display: inline-block;
      flex: 1 1 0;

      &:hover {
        color: #1890ff;
      }
    }

    .datetime {
      color: rgba(0, 0, 0, 0.25);
      flex: 0 0 auto;
      float: right;
    }
  }

  .ant-card-meta-description {
    color: rgba(0, 0, 0, 0.45);
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }
}

.item-group {
  padding: 20px 0 8px 24px;
  font-size: 0;

  a {
    color: rgba(0, 0, 0, 0.65);
    display: inline-block;
    font-size: 14px;
    margin-bottom: 13px;
    width: 25%;
  }
}
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
.members {
  a {
    display: block;
    margin: 12px 0;
    line-height: 24px;
    height: 24px;

    .member {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 24px;
      max-width: 100px;
      vertical-align: top;
      margin-left: 12px;
      transition: all 0.3s;
      display: inline-block;
    }

    &:hover {
      span {
        color: #1890ff;
      }
    }
  }
}

.mobile {
  .project-list {
    .project-card-grid {
      width: 100%;
    }
  }

  .more-info {
    border: 0;
    padding-top: 16px;
    margin: 16px 0 16px;
  }

  .headerContent .title .welcome-text {
    display: none;
  }
}
</style>
