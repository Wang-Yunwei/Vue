<template>
  <div class="med-checkbox-select-wrapper">
    <med-hint-field
      v-bind="$props"
      :link="!disabled && !readonly"
      link-icon="arrow-down"
      readonly
      v-model="fieldValue"
      @click="onFieldClick"
    >
      <template #input-part v-if="selectedItem && selectedItem.length > 0">
        <div class="med-checkbox-label-wapper">
          <div
            :class="['med-select-label-item', { 'item-disable': disabled }]"
            v-for="(item, index) in selectedItem"
            :key="index"
          >
            {{ item.label }}
          </div>
        </div>
      </template>
    </med-hint-field>
    <med-action-sheet
      cancel-text="清除"
      class="med-select-options"
      v-if="!disabled && !readonly"
      :duration="0.12"
      get-container="body"
      v-model="show"
      :actions="show ? actions : []"
      @select="handleSelect"
      @click.stop
      @clear="handleCancel"
    >
    </med-action-sheet>
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
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    separator: {
      type: String,
      default: ','
    },
    multivalue: {
      type: [Array], // 单选默认string,多选默认Array,可设置multiple.stringValue=true改为string格式
      default: () => []
    },
    nonCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      show: false,
      fieldValue: ''
    }
  },
  model: {
    prop: 'multivalue',
    event: 'change'
  },
  computed: {
    actions() {
      const _actions = (this.selectOptions || []).map(ele => {
        const selected = this.formatedValue
          ? this.formatedValue.find(t => t === ele.value)
          : null
        return {
          ...ele,
          name: ele.label,
          className: selected ? 'selected' : undefined
        }
      })
      return _actions
    },
    selectedItem() {
      const items = []
      if (!this.formatedValue) return items
      this.formatedValue.forEach(val => {
        const matched = (this.selectOptions || []).find(
          ele => ele.value === val
        )
        if (matched) {
          items.push(matched)
        }
      })
      return items
    },
    formatedValue() {
      return this.multivalue
    }
    // fieldValue() {
    //   return this.multivalue && this.multivalue.length > 0
    //     ? JSON.stringify(this.multivalue)
    //     : null
    // }
  },
  methods: {
    onFieldClick() {
      if (!this.readonly && !this.disabled) {
        this.show = true
      }
    },
    handleSelect(selected) {
      let newValue = []
      if (this.formatedValue) newValue = [...this.formatedValue]
      if (newValue.includes(selected.value)) {
        newValue = newValue.filter(val => val !== selected.value)
      } else {
        newValue.push(selected.value)
      }

      // “无”选项互斥
      if (this.nonCode && newValue.length > 0) {
        if (newValue[newValue.length - 1] === this.nonCode) {
          newValue = [this.nonCode]
        } else if (newValue[0] === this.nonCode) {
          newValue = newValue.slice(1)
        }
      }

      newValue = newValue.filter(item =>
        this.selectOptions.some(opt => opt.value === item)
      )
      this.notifyChanged(newValue)
      if (this.selectOptions.length === 1) {
        this.show = false
      }
      this.$emit('select', selected)
    },
    notifyChanged(value) {
      this.$emit('input', value)
      this.$emit('change', value)
      this.$emit('confirm', value)
    },
    handleCancel() {
      this.notifyChanged([])
      this.$emit('select', { label: '', value: '' })
    }
  },
  watch: {
    show(val) {
      this.$emit(val ? 'open' : 'close')
    },
    multivalue: {
      immediate: true,
      handler(val) {
        this.fieldValue = val && val.length > 0 ? JSON.stringify(val) : null
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.med-checkbox-select-wrapper {
  flex: auto;
  display: flex;
  .med-hint-field-wrapper {
    flex-grow: 1;
  }
  .med-checkbox-label-wapper {
    display: flex;
    flex-wrap: wrap;
    flex-grow: 1;
    .med-select-label-item {
      background-color: rgb(228, 232, 255);
      color: #5e74fe;
      border-radius: 0.3rem;
      padding: 0 0.22rem;
      margin: 2px 0;
      flex: 0 1 auto;
      &:not(:last-child),
      &:only-child {
        margin-right: 0.1rem;
      }
    }
    .item-disable {
      background-color: #c8c9cc;
      color: #ffffff;
    }
  }
}

@keyframes bounce {
  0% {
    transform: rotate(45deg) scale(3.2);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  30% {
    transform: rotate(45deg) scale(1);
    opacity: 1;
  }
  60% {
    transform: rotate(45deg) scale(1.2);
    opacity: 1;
  }
  100% {
    transform: rotate(45deg) scale(1);
    opacity: 1;
  }
}
.med-select-options {
  /deep/ .van-action-sheet__header {
    background: #333bd2;
    color: #fff;
  }
}
</style>
