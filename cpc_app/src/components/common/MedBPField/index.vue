<template>
  <div class="med-bp-field-wrapper">
    <med-hint-field v-bind="$props" :rules="[]">
      <template #input-part>
        <van-row>
          <van-col :span="24" class="bp-field">
            <div>
              <van-field
                v-int="{ min: 0, max: 300 }"
                v-model="highValue"
                :readonly="readonly"
                :disabled="disabled"
                :required="required"
                :rules="rules"
                type="number"
                input-align="left"
                :placeholder="highValuePlaceholder"
                @blur="onConfirm('1')"
              >
              </van-field>
            </div>
            <span
class="split"
:style="disabled ? { color: '#c8c9cc' } : {}"
              >/</span
            >
            <div>
              <van-field
                v-int="{ min: 0, max: 300 }"
                v-model="lowValue"
                :readonly="readonly"
                :disabled="disabled"
                type="number"
                :required="required"
                :rules="rules"
                input-align="left"
                :placeholder="lowValuePlaceholder"
                @blur="onConfirm('2')"
              >
              </van-field>
            </div>
          </van-col>
        </van-row>
      </template>
      <template #right-icon>
        <i>mmHg</i>
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
  model: {
    prop: 'bpValue',
    event: '_change'
  },
  data() {
    return {
      show: false,
      highValue: '',
      lowValue: '',
      min: 0,
      max: 300
    }
  },
  mounted() {
    const _bp = this.parseBpValue(this.bpValue)
    this.highValue = _bp.sbp
    this.lowValue = _bp.dbp
    this.$forceUpdate()
  },
  computed: {
    highValuePlaceholder() {
      if (this.disabled) return ''
      return '收缩压'
    },
    lowValuePlaceholder() {
      if (this.disabled) return ''
      return '舒张压'
    }
  },
  methods: {
    makeBpValue(sbp, dbp) {
      return sbp + '/' + dbp
    },
    parseBpValue(bp) {
      const _bp = { sbp: '', dbp: '' }
      if (!bp || bp === '') return _bp
      const arr = bp.split('/')
      if (!arr) return _bp
      if (arr.length > 0) _bp.sbp = arr[0]
      if (arr.length > 1) _bp.dbp = arr[1]
      return _bp
    },
    handleValue(value) {
      let result = value
      if (result !== '') {
        if (this.max !== undefined) {
          result = Math.min(result, Number(this.max))
        }
        if (this.min !== undefined) {
          result = Math.max(result, Number(this.min))
        }
      }
      return result
    },
    onConfirm(type) {
      if (type === '1') this.highValue = this.handleValue(this.highValue)
      if (type === '2') this.lowValue = this.handleValue(this.lowValue)
      const _bpValue = this.makeBpValue(this.highValue, this.lowValue)
      if (_bpValue !== this.bpValue) {
        this.$emit('_change', _bpValue)
        this.$emit('confirm', _bpValue)
      }
    }
  },
  watch: {
    bpValue(val) {
      const _bp = this.parseBpValue(this.bpValue)
      this.highValue = _bp.sbp
      this.lowValue = _bp.dbp
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
      padding: 0 10px;
    }
    /deep/ .van-cell--required::before {
      content: "";
    }
  }
}
</style>
