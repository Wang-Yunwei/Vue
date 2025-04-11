<template>
  <div class="med-fast-date-field-wrapper">
    <med-hint-field hintType="" v-model="childTime">
      <template #right-part>
        <van-button
          :type="childTime ? 'primary' : 'warning'"
          @click.stop="onClick"
        >
          {{ childTime ? "重新采集" : "采集" }}
        </van-button>
      </template>
      <template #input>
        <div :class="'input-field' + (required ? ' input-field-required' : '')">
          <div>{{ label }}</div>
          <med-date-picker
            v-bind="$props"
            hintType=""
            placeholder="请填写时间"
            v-model="childTime"
            clear-icon="clear"
            @confirm="onConfirm"
            :border="false"
          ></med-date-picker>
        </div>
      </template>
    </med-hint-field>
  </div>
</template>

<script>
import MedDateField from '../MedDatePicker/index.jsx'
import { Dialog } from 'vant'
export default {
  name: 'MedFastDateField',
  inheritAttrs: false,
  props: {
    ...MedDateField.props,
    dateTime: {
      require: true,
      type: [Date, String]
    },
    voicePrompt: {
      type: Boolean,
      default: true
    }
  },
  model: {
    prop: 'dateTime',
    event: '_change'
  },
  data() {
    return {
      childTime: this.dateTime
    }
  },
  computed: {},
  methods: {
    onConfirm(val) {
      this.$emit('_change', this.childTime)
      this.$emit('confirm', this.childTime)
      if (this.voicePrompt && this.childTime && this.$bridge?.playSoundOnce) {
        this.$bridge.playSoundOnce(`${this.label}时间已采集`)
      }
    },
    onClick() {
      if (this.readonly || this.disabled) return
      if (!this.childTime) {
        this.childTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
        this.onConfirm(this.childTime)
      } else {
        this.$backhelper.push(() => {
          Dialog.close()
          this.$backhelper.pop()
        })
        Dialog.confirm({
          title: '提示',
          message: `确定要重新采集${this.label}${
            (this.label || '').endsWith('时间') ? '' : '时间'
          }？`
        })
          .then(() => {
            this.$backhelper.pop()
            this.childTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
            this.onConfirm(this.childTime)
          })
          .catch(() => {
            this.$backhelper.pop()
          })
      }
    }
  },
  watch: {
    dateTime(val) {
      this.childTime = val
    }
  }
}
</script>

<style lang="less" scoped>
.med-fast-date-field-wrapper {
  .input-field {
    width: 100%;
    /deep/ .med-hint-field::after {
      content: none;
    }
    /deep/ .van-cell {
      padding: 2px 0;
      .van-cell__title,
      .van-field__label {
        display: none;
      }
      .van-field__control {
        width: 280px;
      }
    }
  }
  .input-field-required::before {
    position: absolute;
    left: -16px;
    color: #ee0a24;
    font-size: 0.373333rem;
    content: "*";
  }
  /deep/ .van-cell {
    font-size: @font-md-size;
    justify-content: space-between;

    .van-cell__title,
    .van-cell__label {
      display: none;
    }
  }
  /deep/ .van-button {
    margin: 0 !important;
    // background: #5e74fe;
    width: 200px;
    height: 70px;
    border: 1px solid;
    border-radius: 44px;
    // color: #fff;
  }
  /deep/ .van-button.van-button--primary {
    background: #5e74fe;
    color: #fff;
    border-color: #5e74fe;
  }
  /deep/ .van-button.van-button--warning {
    background: #fff;
    color: #f86359;
    border-color: #f86359;
  }
  /deep/ .van-cell--required::before {
    content: "" !important;
  }
  /deep/ .van-icon-clear {
    color: #aaa;
  }
  /deep/.med-datepicker-wrapper .med-hint-field-wrapper > .van-cell:after {
    content: none;
  }
}
</style>
<style lang="less">
.van-dialog__confirm, .van-dialog__confirm:active {
  span {
    color: #5e74fe;
  }
}
</style>
