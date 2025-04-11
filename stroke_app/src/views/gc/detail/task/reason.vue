<template>
  <div class="med-audit-reason-wrapper">
    <med-popup-container
      v-model="show"
      :title="title"
      @return="onCancel"
      scroll
    >
      <div @click.stop>
        <div class="header">
          <van-field
            v-model="form.remark"
            rows="5"
            autosize
            type="textarea"
            maxlength="50"
            placeholder="请输入原因"
            show-word-limit
          />
        </div>
      </div>
      <template #bottom-part>
        <div class="flex-c-c">
          <van-button
            class="save-btn"
            block
            round
            type="info"
            icon-position="left"
            size="normal"
            @click="handleConfirm"
            >确定
          </van-button>
        </div>
      </template>
    </med-popup-container>
  </div>
</template>

<script>
import { emrStatus } from '@constant/commonConstant'
import { BasicStatus } from '@model/commonModel'
import loadingMixin from '@mixins/loadingMixin'
import { mapGetters } from 'vuex'
const formatStr = 'YYYY-MM-DD HH:mm:ss'

export default {
  name: 'Reason',
  mixins: [loadingMixin],
  props: {
    title: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    reasonType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      registId: '',
      activePanel: 0,
      manuallytime: '',
      emrStatus,
      form: {
        ...BasicStatus(),
        status: emrStatus.filling,
        opBy: ''
      },
      show: false
    }
  },
  mounted() {
    this.form.opBy = this.userInfo.name
  },
  computed: {
    ...mapGetters(['hospitalId', 'userInfo'])
  },
  methods: {
    showModel(val, registId) {
      this.form.remark = ''
      this.form.reject = this.reasonType
      this.show = val
      this.form.registId = this.$route.query.registId ?? registId
    },
    onCancel() {
      this.show = false
    },
    handleConfirm() {
      this.handleSave()
    },
    handleSave() {
      if (this.form.remark === null || this.form.remark.trim() === '') {
        this.$notify({ type: 'warning', message: '请输入原因' })
        return
      }
      this.$dialog
        .confirm({
          title: '提示',
          message: '确定驳回吗?',
          confirmButtonColor: '#5e74fe'
        })
        .then(() => {
          this.loading()
          this.$api.basicInfo.updateEMRStatus(this.form).then(res => {
            if (res.status === 200) {
              this.$notify({ type: 'success', message: '驳回成功' })
              this.$emit('refresh', this.reasonType)
              this.show = false
            } else {
              this.$notify({ type: 'warning', message: res.message })
            }
          })
        })
        .finally(() => this.hideLoading())
    }
  },
  watch: {}
}
</script>

<style lang="less" scoped>
@import "@assets/styles/common/document/edit.less";

.med-audit-reason-wrapper {
  .header > .result {
    /deep/ .van-field__label,
    .van-cell__title {
      min-width: 80px !important;
      width: 100px;
    }
  }

  .van-button {
    margin: 0;
  }

  /deep/ .van-collapse-item > .van-collapse-item__title {
    .van-cell__title {
      max-width: initial;
    }

    .van-cell__value {
      max-width: 100px;
    }
  }

  .item {
    /deep/ .van-cell-group > .van-cell {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }

    /deep/ .van-cell__value {
      padding-left: 10px;
    }

    /deep/ .van-cell::after {
      border-bottom: 0px;
    }

    /deep/ .van-cell-group::after {
      border-width: 0;
    }
  }
}

.med-view-container-wrapper {
  .flex-c-c {
    padding: 12px 0px;
  }
}
</style>
