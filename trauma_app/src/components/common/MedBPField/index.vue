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
                maxlength="3"
                type="digit"
                input-align="left"
                :placeholder="disabled ? '' : '收缩压'"
              >
              </van-field>
            </div>
            <span class="split" :style="disabled ? { color: '#c8c9cc' } : {}">
              /
            </span>
            <div>
              <van-field
                v-int="{ min: 0, max: 300 }"
                v-model="lowValue"
                :readonly="readonly"
                :disabled="disabled"
                type="digit"
                maxlength="3"
                :required="required"
                :rules="rules"
                input-align="left"
                :placeholder="disabled ? '' : '舒张压'"
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
    sbp: {
      // 收缩压
      type: String,
      default: ''
    },
    dbp: {
      // 舒张压
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
      min: 0,
      max: 300
    }
  },
  computed: {
    highValue: {
      get() {
        return this.sbp
      },
      set(v) {
        this.$emit('update:sbp', this.limitValue(v, this.sbp))
      }
    },
    lowValue: {
      get() {
        return this.dbp
      },
      set(v) {
        this.$emit('update:dbp', this.limitValue(v, this.dbp))
      }
    }
  },
  methods: {
    limitValue(v, oldVal) {
      if ([undefined, '', null].includes(v)) return v
      let numVal = Number(v) || 0
      if (numVal > this.max || numVal < this.min) {
        numVal = oldVal
      }
      return numVal.toString()
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
