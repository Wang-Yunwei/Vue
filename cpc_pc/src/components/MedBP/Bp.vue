<template>
  <div class="med-bp-wrapper">
    <med-text v-model="bpHighValue" v-int="{ min: 0, max: 300 }" v-bind="$props" :placeholder="highValuePlaceholder" />
    <div class="bp_split">/</div>
    <med-text v-model="bpLowValue" v-int="{ min: 0, max: 300 }" v-bind="$props" :placeholder="lowValuePlaceholder" />
    <div class="bp__append">mmHg</div>
  </div>
</template>

<script>
import MedText from '../MedText/Text.vue'
export default {
  name: 'MedBp',
  components: {
    MedText
  },
  model: {
    prop: 'bpValue',
    event: '_change'
  },
  props: {
    ...MedText.props,
    bpValue: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: false,
      highValue: '',
      lowValue: '',
      tmpValue: ''
    }
  },
  computed: {
    highValuePlaceholder() {
      if (this.disabled) return ''
      return '收缩压'
    },
    lowValuePlaceholder() {
      if (this.disabled) return ''
      return '舒张压'
    },
    bpHighValue: {
      get() {
        if (this.bpValue) {
          const bps = this.bpValue.split('/')
          if (bps.length === 2) { return bps[0] }
        }
        return ''
      },
      set(val) {
        let v = (!val && !this.bpLowValue) ? '' : `${val}/${this.bpLowValue}`
        this.$emit('_change', v)
        this.$emit('confirm', v)
      }
    },
    bpLowValue: {
      get() {
        if (this.bpValue) {
          const bps = this.bpValue.split('/')
          if (bps.length === 2) { return bps[1] }
        }
        return ''
      },
      set(val) {
        let v = (!val && !this.bpHighValue) ? '' : `${this.bpHighValue}/${val}`
        this.$emit('_change', v)
        this.$emit('confirm', v)
      }
    }
  }
}
</script>

<style lang="scss">
.med-bp-wrapper {
  display: flex;
  align-items: center;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

.med-input-wrapper {
  flex-grow: 1;
}
  .el-input__inner {
    border: none;
  }
  .el-input-group {
    .el-input-group__append {
      border: none;
    }
  }

  &:focus-within {
    border-color: #1890ff;
  }

  .bp__append {
    border-left: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    background-color: #f5f7fa;
    color: #909399;
    vertical-align: middle;
    // display: table-cell;
    // position: relative;
    border-left: 1px solid #dcdfe6;

    padding: 0 20px;
    white-space: nowrap;
  }
}
</style>
