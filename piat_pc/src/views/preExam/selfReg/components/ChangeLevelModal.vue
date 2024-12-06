<template>
  <med-s-modal
    v-model="modalVisible"
    title="请填写修改分级分诊原因"
    @ok="handleOk()"
    :width="800"
    okText="保存"
    :ok-button-props="{
      props: {
        icon: 'icon_baocun',
        disabled: !formValues.reasons || (formValues.reasons === '06' && !formValues.other)
      }
    }"
    :cancel-button-props="{
      props: {
        icon: 'icon_quxiao'
      }
    }"
  >
    <a-spin :spinning="loading">
      <a-row>
        <a-col :span="22" :offset="2">
          <div class="reasons">
            <med-s-radio
              buttonType
              :optionList="reasonList.slice(0, reasonList.length - 1)"
              v-model="formValues.reasons"
            />
            <a-row type="flex">
              <a-col flex="70px">
                <med-s-radio
                  buttonType
                  :optionList="reasonList.slice(reasonList.length - 1)"
                  v-model="formValues.reasons"
                />
              </a-col>
              <a-col flex="auto">
                <a-input :disabled="formValues.reasons !== '06'" placeholder="请输入原因" v-model="formValues.other" />
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-row>
      <a-row :gutter="8" style="padding-top:10px">
        <a-col :span="2" class="flex-c-e" style="line-height:32px"> 备注 :</a-col>
        <a-col :span="22"> <a-input v-model="formValues.remark"/></a-col>
      </a-row>
    </a-spin>
  </med-s-modal>
</template>

<script>
import { queryByCodeList } from '@/api' // 接口
import { modSaveOrUpdate } from '@/api/preExam/basic'
import { mapGetters } from 'vuex'
let nextStep = () => {}

export default {
  name: 'ChangeLevelModal',
  props: {
    regId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      modalVisible: false,
      loading: false,
      reasonList: [],
      formValues: {}
    }
  },
  computed: {
    ...mapGetters(['hospitalId'])
  },
  methods: {
    showModal() {
      return new Promise(resolve => {
        this.modalVisible = true
        nextStep = resolve
      })
    },
    // 获取字典数据
    async getDictionaryData() {
      const params = {
        codeList: [
          'modifyreason' // 修改分诊分级理由
        ],
        hospitalId: this.hospitalId
      }
      this.loading = true
      const res = await queryByCodeList(params)
      this.loading = false

      const { modifyreason } = res.result || {}
      this.reasonList = modifyreason
    },
    async handleOk() {
      const res = await modSaveOrUpdate({ ...this.formValues, regId: this.regId })
      if (res.body) {
        this.modalVisible = false
        nextStep(true)
      } else {
        this.$notification.error({ message: '保存出错', description: res.message })
      }
    }
  },
  watch: {
    modalVisible(visible) {
      if (visible && !this.reasonList.length) {
        this.getDictionaryData()
      }
    },
    'formValues.reasons': {
      handler() {
        this.formValues = { ...this.formValues, other: '' }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.reasons {
  /deep/ .ant-radio-button-wrapper {
    margin-bottom: 10px;
  }
}
</style>
