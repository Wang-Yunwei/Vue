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
            v-model="form.reason"
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
            >确定</van-button
          >
        </div>
      </template>
    </med-popup-container>
    <med-loading v-model="showLoading" />
  </div>
</template>

<script>
const formatStr = 'YYYY-MM-DD HH:mm:ss'

export default {
  name: 'Reason',
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
      hospitalId: this._permission().user.hospitalId,
      userId: this._permission().user.userId,
      registId: '',
      activePanel: 0,
      manuallytime: '',
      form: {
        registId: '',
        reason: '',
        userId: this._permission().user.id
      },
      show: false,
      showLoading: false
    }
  },
  computed: {},
  methods: {
    showModel(val, registId) {
      this.form.reason = ''
      this.show = val
      if (registId == null) {
        this.registId = this.$route.query.registId
      } else {
        this.registId = registId
      }
    },
    onCancel() {
      this.show = false
    },
    handleConfirm() {
      this.handleSave()
    },
    handleSave() {
      this.form.registId = this.registId
      if (this.form.reason === null || this.form.reason.trim() === '') {
        this.$notify({ type: 'warning', message: '请输入原因' })
        return
      }
      if (this.reasonType === '1') {
        this.$dialog
          .confirm({ title: '提示', message: '确定驳回吗?' })
          .then(() => {
            this.showLoading = true
            this.$api.service.rejectAudit(this.form).then(res => {
              if (res.status === 200) {
                this.$notify({ type: 'success', message: '驳回成功' })
                this.$emit('refresh', this.reasonType)
                this.show = false
              } else {
                this.$notify({ type: 'warning', message: res.message })
              }
              this.showLoading = false
            })
          })
          .catch(() => {
            this.showLoading = false
          })
      } else if (this.reasonType === '2') {
        this.$dialog
          .confirm({ title: '提示', message: '确定驳回吗?' })
          .then(() => {
            this.showLoading = true
            this.$api.service.rejectArchive(this.form).then(res => {
              if (res.status === 200) {
                this.$notify({ type: 'success', message: '驳回成功' })
                this.showLoading = false
                this.$emit('refresh', this.reasonType)
                this.show = false
              } else {
                this.$notify({ type: 'warning', message: res.message })
                this.showLoading = false
              }
            })
          })
          .catch(() => {
            this.showLoading = false
          })
      }
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
