<template>
  <div class="pre-exam-where-wrapper">
    <med-s-card title="患者去向" class="container-card">
      <div class="pre-exam-where-btn flex-c-b">
        <div class="pre-exam-where-right-bottom">
          <med-s-form-model
            ref="forms"
            :form="form"
            :gutter="10"
            :responsive="{ xl: 9, lg: 12, md: 12, sm: 24, xs: 24 }"
            :formLayout="{
              labelCol: {
                span: 0
              },
              wrapperCol: {
                span: 24
              }
            }"
            :dataSource="formDataSource"
          />
          <med-s-radio
            :class="turnResultClass(form.turnResult)"
            buttonType
            :optionList="optionList"
            v-model="form.turnResult"
          />
        </div>
        <div class="pre-exam-where-btn-right flex-c-c">
          <template>
            <med-button active width="240px" height="80px" :loading="submitting" @click="handleSubmit">
              确认分诊
              <med-icon type="icon_querenfenzhen" />
            </med-button>
          </template>
        </div>
      </div>
    </med-s-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { queryByCodeList } from '@/api'
import sharedData from '../sharedData'
export default {
  name: 'PreExamWhere',
  props: {
    submitting: {
      type: Boolean,
      default: false
    },
    regId: { type: String, default: '' },
    detailInfo: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      oldResetLevel: sharedData.resetLevel,
      sharedData,
      form: {},
      formDataSource: [
        {
          type: 'select',
          fieldName: 'departmentId',
          placeholder: '请选择就诊科室',
          optionList: []
        },
        {
          type: 'select',
          fieldName: 'checkDoctorId',
          placeholder: '请选择就诊医生',
          optionList: []
        }
      ],
      optionList: []
    }
  },
  async created() {
    await this.getDictionaryData()
  },
  computed: {
    ...mapGetters(['hospitalId'])
  },
  methods: {
    turnResultClass(val) {
      switch (val) {
        case '01':
          return 'turn-result-red'
        case '02':
          return 'turn-result-green'
        case '03':
          return 'turn-result-yellow'
        default:
          return ''
      }
    },
    // 获取字典数据
    async getDictionaryData() {
      const params = {
        codeList: [
          'departmentId', //就诊科室
          'checkDoctorId', //就诊医生
          'turnResult' //患者去向
        ],
        hospitalId: this.hospitalId
      }
      const res = await queryByCodeList(params)
      const { departmentId, checkDoctorId, turnResult } = res.result || {}
      this.resetOptionList('departmentId', departmentId) //就诊科室
      this.resetOptionList('checkDoctorId', checkDoctorId) //就诊医生
      this.optionList = turnResult //患者去向
    },
    resetOptionList(key, arr) {
      this.formDataSource.forEach(item => {
        if (item.fieldName === key) {
          this.$set(item, 'optionList', arr)
        }
      })
    },
    formSubmit() {
      return this.form
    },
    handleSubmit() {
      this.$emit('submit')
    },
    // 获取患者信息回显
    regDetails() {
      const { whereabouts } = this.detailInfo
      this.form = {
        ...this.form,
        ...whereabouts
      }
    }
  },
  watch: {
    detailInfo() {
      if (this.detailInfo?.whereabouts) {
        this.regDetails()
      }
    },
    sharedData: {
      handler(val) {
        if (!val.ready || val.resetLevel === this.oldResetLevel) return
        this.oldResetLevel = val.resetLevel
        const hasObservationArea = this.optionList.some(item => item.value === '02')
        // 是否存在留观区
        switch (val.resetLevel) {
          case '1':
          case '2':
            this.$set(this.form, 'turnResult', '01')
            break
          case '3':
            this.$set(this.form, 'turnResult', hasObservationArea ? '02' : '03')
            break
          case '4':
            this.$set(this.form, 'turnResult', '03')
            break
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.pre-exam-where-right-bottom {
  height: 82px;
  flex: auto;
  margin-right: 10px;
  max-width: 540px;
  .turn-result {
    &-red {
      /deep/ label.ant-radio-button-wrapper.ant-radio-button-wrapper-checked {
        &,
        &:hover {
          background: @level-color-1;
          border-color: @level-color-1;
        }
      }
    }
    &-green {
      /deep/ label.ant-radio-button-wrapper.ant-radio-button-wrapper-checked {
        &,
        &:hover {
          background: @level-color-3;
          border-color: @level-color-3;
        }
      }
    }
    &-yellow {
      /deep/ label.ant-radio-button-wrapper.ant-radio-button-wrapper-checked {
        &,
        &:hover {
          background: @level-color-4;
          border-color: @level-color-4;
        }
      }
    }
  }
  /deep/ .ant-form-item {
    &-control {
      min-width: 100px;
      width: 100%;
    }
  }
  /deep/ .ant-radio-group {
    width: 100%;
    .ant-radio-button-wrapper {
      border-radius: 6px;
      // margin-right: 0;
      // padding: 0;
      flex: 0 1 100px;
    }
  }
}
.pre-exam-where-btn-right {
  /deep/ button.ant-btn {
    font-size: 30px;
    border-radius: 6px;
    i {
      font-size: 50px;
      height: 50px;
    }
    i.anticon-loading {
      position: absolute;
      right: 30px;
      ~ span {
        padding-right: 70px;
      }
      ~ i.anticon {
        display: none;
      }
    }
  }
}
</style>
