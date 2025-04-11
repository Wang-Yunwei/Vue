<template>
  <div class="med-bp-field-wrapper">
    <med-hint-field v-bind="$props" :rules="[]">
      <template #input-part>
        <van-row>
          <van-col :span="24" class="bp-field">
            <van-field
              name="sbp"
              v-model="privateSbp"
              :readonly="readonly"
              :disabled="disabled"
              :required="required"
              :rules="BPRules"
              type="digit"
              :placeholder="highValuePlaceholder"
              @input="$forceUpdate()"
              @blur="onSbpBlur"
              v-int="{ min: 0, max: 300 }"
            >
            </van-field>
            <i class="split" :style="disabled ? { color: '#c8c9cc' } : {}" />
            <van-field
              name="dbp"
              v-model="privateDbp"
              :readonly="readonly"
              :disabled="disabled"
              type="digit"
              :required="required"
              :rules="BPRules"
              :placeholder="lowValuePlaceholder"
              @input="$forceUpdate()"
              @blur="onDbpBlur"
              v-int="{ min: 0, max: 300 }"
            >
            </van-field>
          </van-col>
        </van-row>
      </template>
      <template #right-icon>
        <span>mmHg</span>
      </template>
    </med-hint-field>
  </div>
</template>

<script>
import MedHintField from '../MedHintField/index.jsx'
export default {
  name: '',
  props: {
    ...MedHintField.props,
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    sbp: {
      type: Number,
      default: undefined
    },
    dbp: {
      type: Number,
      default: undefined
    }
  },
  data() {
    return {
      privateSbp: undefined,
      privateDbp: undefined
    }
  },
  beforeDestroy() {
    this.$emit('update:sbp', undefined)
    this.$emit('update:dbp', undefined)
  },
  computed: {
    BPRules() {
      const rules = this.required ? [{ required: true }] : []
      return rules
    },
    highValuePlaceholder() {
      if (this.disabled) return ''
      return '收缩压'
    },
    lowValuePlaceholder() {
      if (this.disabled) return ''
      return '舒张压'
    }
  },
  watch: {
    sbp: {
      immediate: true,
      handler(v) {
        this.privateSbp = v
      }
    },
    dbp: {
      immediate: true,
      handler(v) {
        this.privateDbp = v
      }
    }
  },
  methods: {
    onSbpBlur() {
      const numberSbpVal = this.toNumber(this.privateSbp)
      this.$emit('update:sbp', numberSbpVal)
    },
    onDbpBlur() {
      const numberDbpVal = this.toNumber(this.privateDbp)
      this.$emit('update:dbp', numberDbpVal)
    },
    toNumber(v) {
      const num = Number(v)
      if (!v || isNaN(num)) {
        return undefined
      }
      return num
    }
  }
}
</script>

<style lang="less" scoped>
.med-bp-field-wrapper {
  .bp-field {
    display: flex;
    align-items: center;

    .van-cell {
      padding: 0;
    }

    .split {
      &:before {
        content: "/";
      }
      font-style: normal;
      padding-right: 10px;
    }
    /deep/ .van-cell--required::before {
      content: "";
    }
  }
  /deep/ .med-hint-field-wrapper .med-hint-field .van-field__error-message {
    display: block;
    position: absolute;
    top: 30px;
  }
}
</style>
