<template>
  <div class="pre-exam-where-wrapper">
    <med-s-card class="where-card">
      <div class="pre-exam-where-btn flex-c-b">
        <div class="pre-exam-where-right-bottom">
          <med-s-form-model
            ref="forms"
            :form="form"
            :gutter="10"
            :responsive="{ xl: 14, lg: 12, md: 12, sm: 24, xs: 24 }"
            :formLayout="{
              labelCol: {
                span: 6
              },
              wrapperCol: {
                span: 18
              }
            }"
            :dataSource="formDataSource"
          />
          <a-row :gutter="12" class="where-wrapper" type="flex">
            <a-col flex="80px" style="line-height:32px; text-align:right">患者去向 :</a-col>
            <a-col flex="auto"> <med-s-radio buttonType :optionList="optionList" v-model="form.turnResult"/></a-col>
          </a-row>
        </div>
      </div>
    </med-s-card>
  </div>
</template>
<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
export default {
  name: 'PreExamWhere',
  props: {
    submitting: {
      type: Boolean,
      default: false
    },
    detailInfo: { type: Object, default: () => ({}) }
  },

  data() {
    return {
      form: { turnResult: '', departmentId: '' },
      formDataSource: [
        {
          labelText: '就诊科室',
          type: 'select',
          fieldName: 'departmentId',
          placeholder: '请选择就诊科室',
          optionList: []
        }
      ],
      optionList: []
    }
  },
  computed: {
    ...mapGetters(['hospitalId'])
  },
  async created() {
    const _this = this
    axios
      .post(window.GLOBAL_APP_API_DIC_URL + '/base/dictionary/queryByCodeList', {
        codeList: [
          'departmentId', //就诊科室
          'turnResult' //患者去向
        ],
        hospitalId: this.hospitalId
      })
      .then(function(res) {
        console.log('患者去向数据字典返回数据: ', res.data.result)
        _this.resetOptionList('departmentId', res.data.result.departmentId) //就诊科室
        _this.optionList = res.data.result.turnResult //患者去向
      })
      .catch(function(err) {
        console.log(err)
      })
  },
  methods: {
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
    regDetails() {
      this.form.departmentId = this.detailInfo.departmentid
      this.form.turnResult = this.detailInfo.turnresult
    },
    //重置标志
    resetSigns() {
      this.form.departmentId = ''
      this.form.turnResult = ''
    }
  },
  watch: {
    detailInfo() {
      if (this.detailInfo?.id) {
        this.regDetails()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.pre-exam-where-right-bottom {
  height: 70px;
  flex: auto;
  margin-right: 10px;
  max-width: 540px;

  /deep/ .ant-form-item {
    &-control {
      min-width: 100px;
      width: 100%;
    }
  }

  /deep/ .ant-radio-group {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .ant-radio-button-wrapper {
      border-radius: 6px;
      margin-right: 0;
      padding: 0;
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

.where-card {
  background-color: transparent;
  border: none;
}

.where-wrapper {
  width: 640px;
}
</style>
