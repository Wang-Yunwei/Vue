<template>
  <med-s-modal
    title="修改患者去向"
    size="medium"
    :visible="visible"
    @cancel="handleHide"
    @ok="handleOk"
    :okButtonProps="{
      props: {
        loading
      }
    }"
  >
    <med-s-form-model :form="infoForm" :responsive="responsive" :dataSource="infoFormConfig" />
    <med-s-form-model
      ref="inputForm"
      :form="inputForm"
      :responsive="responsive"
      :dataSource="inputFormConfig"
      @submit="handleSubmit"
    />
    <med-s-radio
      buttonType
      :optionList="turnResultList"
      @change="handleTurnResultChange"
      :disabled="departmentDisabled"
    />
  </med-s-modal>
</template>

<script>
import moment from 'moment'
import { regSaveOrUpdate } from '@/api/preExam/basic' // 接口

export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    visible: {
      type: Boolean,
      default: false
    },
    turnResultList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      infoForm: {},
      inputForm: {
        triageTime: moment().format('YYYY-MM-DDTHH:mm:[00][Z]')
      },
      responsive: { xl: 12, lg: 12, md: 12, sm: 12, xs: 12 }
    }
  },
  computed: {
    infoFormConfig() {
      return [
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
        }
      ]
    },
    inputFormConfig() {
      return [
        {
          labelText: '去向时间',
          type: 'datetime',
          fieldName: 'triageTime',
          placeholder: '选择日期',
          showTime: true
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
          required: true,
          wrongMsg: '请从下方选择修改去向',
          fieldName: 'changeTurnResult',
          optionList: this.turnResultList
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
    },
    departmentDisabled() {
      const { changeTurnResult } = this.inputForm
      const disabled = false
      if (changeTurnResult) {
        const selected = this.turnResultList.find(el => el.value === changeTurnResult)
        if (selected?.label === '入院') {
          disabled = true
        }
      }
      return disabled
    }
  },
  methods: {
    handleHide() {
      this.$emit('cancel')
    },
    handleTurnResultChange(val) {
      this.inputForm = { ...this.inputForm, changeTurnResult: val }
    },
    async handleSubmit(vals) {
      const { regId, patientId } = this.data
      const { triageTime, changeTurnResult, departmentId } = this.inputForm

      this.$refs.inputForm.validateValue()
      const payload = {
        // 基本信息
        regId, // 急诊编号
        patientId, // 病历号/患者档案号
        triageTime, // 分诊时间
        // 患者去向
        whereabouts: {
          turnResult: changeTurnResult, // 去向
          departmentId // 就诊科室
        }
      }
      this.loading = true
      let res = {}
      try {
        res = await regSaveOrUpdate(payload)
      } catch (e) {}
      this.loading = false
      if (res.body) {
        this.$message.success('修改成功！')
        this.handleHide()
        this.$emit('refreshList')
      } else {
        this.$message.error('修改出错! ' + res.message)
      }
    },
    handleOk() {
      this.$refs.inputForm.submit()
    }
  },
  watch: {
    data(val) {
      this.infoForm = { ...this.infoForm, ...val }
    },
    visible(val) {
      if (!val) {
        this.infoForm = {}
      }
    }
  }
}
</script>

<style></style>
