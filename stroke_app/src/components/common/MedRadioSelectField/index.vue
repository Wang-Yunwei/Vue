<template>
  <div class="med-radio-select-wrapper">
    <med-hint-field
      v-bind="$props"
      :link="!disabled && !readonly"
      readonly
      @click="onFieldClick"
    >
      <template #input-part>
        <span class="med-radio-select-input-part">
          <van-field
            v-model="selectedItem.label"
            readonly="readonly"
            :disabled="disabled"
            input-align="left"
            :placeholder="radioPlaceholder"
          >
          </van-field>
        </span>
      </template>
    </med-hint-field>
    <van-action-sheet
      cancel-text="取消"
      class="med-select-options"
      v-if="!disabled && !readonly"
      :duration="0.12"
      get-container="body"
      v-model="show"
      :actions="show ? actions : []"
      @select="handleSelect"
      @click.stop
    >
      <van-empty
        :image="require('@assets/image/empty.png')"
        description="暂无数据"
        v-if="show && !actions.length"
      />
    </van-action-sheet>
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
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    actions() {
      return (this.selectOptions || []).map(ele => {
        const selected = ele.value === this.value
        return {
          ...ele,
          name: ele.label,
          className: selected ? 'selected' : undefined
        }
      })
    },
    selectedItem() {
      const matched = (this.selectOptions || []).find(
        ele => ele.value === this.value
      )
      if (matched) return matched
      return {}
    },
    radioPlaceholder() {
      if (this.disabled) return ''
      if (this.placeholder) return this.placeholder
      return '请选择' + (this.label || '')
    }
  },
  methods: {
    onFieldClick() {
      if (!this.readonly && !this.disabled) {
        this.show = true
      }
    },
    handleSelect(selected) {
      this.$emit('input', selected.value)
      this.$emit('change', selected.value)
      this.$emit('confirm', selected.value)
      this.$emit('select', selected)
      this.show = false
    }
  },
  watch: {
    show(val) {
      this.$emit(val ? 'open' : 'close')
    }
  }
}
</script>

<style lang="less" scoped>
.med-radio-select-wrapper {
  .med-radio-select-input-part {
    display: flex;
    align-items: center;

    .van-cell {
      padding: 0;
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
