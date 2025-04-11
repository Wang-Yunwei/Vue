<template>
  <div class="med-drug-dose-field-wrapper">
    <med-hint-field v-bind="$props" :readonly="readonly" :disabled="disabled">
      <template #input-part>
        <van-row class="drug-dose-field">
          <van-col :span="14">
            <van-field
              v-model="result"
              :readonly="readonly"
              :disabled="disabled"
              type="number"
              input-align="left"
              :placeholder="resultPlaceholder"
              @blur="onConfirm"
            >
            </van-field>
          </van-col>
          <van-col :span="10">
            <div>
              <van-field
                v-model="unitName"
                readonly
                :disabled="disabled"
                input-align="right"
                :placeholder="unitPlaceholder"
                @click="onFieldClick"
              >
                <template #right-icon>
                  <van-icon name="arrow-down" />
                </template>
              </van-field>
            </div>
          </van-col>
        </van-row>
      </template>
    </med-hint-field>
    <van-field
      v-show="false"
      v-model="result"
      :readonly="readonly"
      :disabled="disabled"
      type="number"
      input-align="left"
      :placeholder="resultPlaceholder"
      @blur="onConfirm"
    >
    </van-field>
    <med-action-sheet
      cancel-text="取消"
      class="med-select-options"
      v-if="!disabled && !readonly"
      :duration="0.12"
      get-container="body"
      v-model="showOptions"
      :actions="actions"
      @select="onSelect"
      @click.stop
    >
      <van-empty
        :image="require('@assets/image/empty.png')"
        description="暂无数据"
        v-if="showOptions && !actions.length"
      />
    </med-action-sheet>
  </div>
</template>

<script>
import T from '../MedHintField/index.jsx'
export default {
  name: 'MedDrugDoseField',
  inheritAttrs: false,
  props: {
    ...T.props,
    fValue: {
      type: Object,
      default: () => ({
        value: '',
        unit: ''
      })
    },
    unitOptions: {
      type: Array,
      default: () => []
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
    prop: 'fValue',
    event: '_change'
  },
  data() {
    return {
      result: '',
      unitId: '',
      unitName: '',
      showOptions: false
    }
  },
  created() {},
  mounted() {
    this.update(this.fValue)
    this.$forceUpdate()
  },
  methods: {
    onFieldClick() {
      if (!this.readonly && !this.disabled) {
        this.showOptions = true
      }
    },
    onSelect(action) {
      this.unitId = action.value
      this.unitName = action.label
      this.showOptions = false
      this.onConfirm()
    },
    onConfirm() {
      if (
        this.fValue.unit !== this.unitId ||
        this.fValue.value !== this.result
      ) {
        const returnValue = { value: this.result, unit: this.unitId }
        this.$emit('_change', returnValue)
        this.$emit('confirm', returnValue)
      }
    },
    update(val) {
      if (val) {
        this.unitId = val.unit
        if (val && this.unitOptions && this.unitOptions.length > 0) {
          if (!this.unitId || this.unitId === '') {
            this.unitId = this.unitOptions[0].value
            this.unitName = this.unitOptions[0].label
          } else {
            const obj = this.unitOptions.find(
              item => item.value === this.unitId
            )
            this.unitName = obj ? obj.label : ''
          }
        }
        this.result = val.value
      }
    }
  },
  computed: {
    actions() {
      return (this.unitOptions || []).map(ele => {
        const selected = ele.value === this.unitId
        return {
          ...ele,
          name: ele.label,
          className: selected ? 'selected' : undefined
        }
      })
    },
    selectedItem() {
      const matched = (this.unitOptions || []).find(
        ele => ele.value === this.value
      )
      if (matched) return matched
      return {}
    },
    resultPlaceholder() {
      if (this.disabled) return ''
      if (this.placeholder) return this.placeholder
      return this.label
    },
    unitPlaceholder() {
      if (this.disabled) return ''
      return '单位'
    }
  },
  watch: {
    result(val) {
      // this.$emit('_change', { value: val, unit: this.unitId })
      this.$emit('change', { value: val, unit: this.unitId })
    },
    unitId(val) {
      // this.$emit('_change', { value: this.cValue, unit: this.unitId })
      this.$emit('change', { value: this.result, unit: val })
    },
    fValue: {
      immediate: true,
      handler(val) {
        this.update(val)
      },
      deep: true
    },
    unitOptions: {
      immediate: true,
      handler(val) {
        this.update({ value: this.result, unit: this.unitId })
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.med-drug-dose-field-wrapper {
  .drug-dose-field {
    display: flex;
    align-items: center;

    .van-cell {
      padding: 0;
    }

    .split {
      padding: 0 10px;
    }
  }
}
.med-select-options .van-action-sheet__item {
  position: relative;
  &:before {
    content: "";
    border: 0.04rem solid #5e74fe;
    border-left: none;
    border-top: none;
    width: 0.18rem;
    height: 0.32rem;
    display: block;
    position: absolute;
    top: 0.5rem;
    left: 0.8rem;
    transition: all 0.2s linear;
    transform: rotate(45deg);
    opacity: 0;
  }
  &.selected {
    color: #5e74fe;
    &:before {
      animation: bounce 0.3s;
      transform: rotate(45deg);
      opacity: 1;
    }
  }
}
</style>
