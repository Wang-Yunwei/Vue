<template>
  <div class="med-radio-button-field-wrapper">
    <med-hint-field v-bind="$props">
      <template #input-part>
        <van-radio-group
          v-model="checked"
          :disabled="disabled"
          :readonly="readonly"
        >
          <van-radio
            v-for="item in selectOptions"
            :key="item.value"
            :name="item.value"
            @click.stop="onSelected"
          >
            {{ item.label }}
          </van-radio>
        </van-radio-group>
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
    selectOptions: {
      type: Array,
      default: () => []
    },
    selectedValue: {
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
    },
    deselect: {
      type: Boolean,
      default: true
    }
  },
  model: {
    prop: 'selectedValue',
    event: '_change'
  },
  data() {
    return {
      checked: this.selectedValue
    }
  },
  mounted() {
    this.checked = this.selectedValue
  },
  computed: {},
  methods: {
    onSelected() {
      if (this.disabled) return
      let _value = this.checked
      if (this.deselect && this.selectedValue === _value) {
        _value = ''
        this.checked = ''
      }
      this.$emit('_change', _value)
      this.$emit('change', _value)
      this.$emit('confirm', _value)
    }
  },
  watch: {
    // checked(val) {
    //   this.$emit('_change', val)
    //   this.$emit('change', val)
    // },
    selectedValue(val) {
      this.checked = val
    }
  }
}
</script>

<style lang="less" scoped>
.med-radio-button-field-wrapper {
  /deep/.van-radio-group {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-flow: wrap;
    margin-top: -10px;

    .van-radio {
      margin-right: 20px;
      margin-top: 10px;

      .van-radio__icon {
        width: 0;
        height: 0;

        .van-icon {
          width: 0;
          height: 0;
          display: none;

          &:before {
            display: none;
          }
        }

        &.van-radio__icon--checked {
          width: 0;
          height: 0;
        }

        &.van-radio__icon--checked + .van-radio__label {
          background: #5e74fe;
          color: #fff;
        }

        &.van-radio__icon--checked + .van-radio__label--disabled {
          background: #c8c9cc !important;
        }
      }

      .van-radio__label {
        border: 1px solid #dadada;
        padding: 5px 20px;
        border-radius: 44px;
        margin: 0;
      }
    }

    .van-radio:last-of-type {
      margin-right: 0;
    }
  }

  /deep/.van-field--error {
    .van-radio-group .van-radio .van-radio__label {
      border-color: red;
    }
  }
}
</style>
