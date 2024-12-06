<template>
  <div class="med-radio-select-wrapper">
    <div>
      <med-hint-field v-bind="$props" :link="!disabled && !readonly" :link-icon="isPopup ? '' : 'arrow-down'" readonly v-model="selectedItem.value" @click="onFieldClick">
        <template #input-part>
          <span class="med-radio-select-input-part">
            <van-field v-model="selectedItem.label" readonly="readonly" :disabled="disabled" input-align="left" :placeholder="radioPlaceholder">
            </van-field>
          </span>
        </template>
      </med-hint-field>
    </div>
    <med-action-sheet :cancel-text="deselect ? '清除' : ''" class="med-select-options" v-if="!disabled && !readonly" :duration="0.12" get-container="body" v-model="show" :actions="show ? actions : []" @select="handleSelect" @clear="handleCancel">
    </med-action-sheet>
    <med-popup-container v-model="showPopup" :title="label" get-container="body" position="right" @return="onReturnClick" scroll @editClick="onClearClick">
      <div @click.stop>
        <van-radio-group v-model="selectedValue">
          <van-cell-group>
            <van-cell v-for="(item, index) in selectOptions" :key="item.value" :value="item.label" clickable @click="onRadioCellClick(item, index)">
              <template #right-icon>
                <van-radio :name="item.value" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
    </med-popup-container>
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
    },
    showMode: {
      type: String,
      default: 'action-sheet'
    },
    deselect: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      show: false,
      showPopup: false,
      selectedValue: ''
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
    },
    isPopup() {
      return this.showMode !== 'action-sheet'
    }
  },
  methods: {
    onFieldClick() {
      if (!this.readonly && !this.disabled) {
        if (this.showMode === 'action-sheet') this.show = true
        else {
          this.$bridge.hideKeyboard()
          setTimeout(() => {
            this.showPopup = true
            this.selectedValue = _this.value
          }, 100)
        }
      }
    },
    handleSelect(selected) {
      if (
        this.deselect &&
        this.selectedItem &&
        this.selectedItem.value === selected.value
      ) {
        this.notifyChanged({ label: '', value: '' })
      } else {
        this.notifyChanged(selected)
      }
      this.show = false
    },
    handleCancel() {
      this.notifyChanged({ label: '', value: '' })
      this.show = false
    },
    onRadioCellClick(selected, index) {
      if (
        this.deselect &&
        this.selectedItem &&
        this.selectedItem.value === selected.value
      ) {
        this.notifyChanged({ label: '', value: '' })
      } else {
        this.notifyChanged(selected)
      }
      this.showPopup = false
    },
    onClearClick() {
      this.notifyChanged({ label: '', value: '' })
      this.showPopup = false
    },
    notifyChanged(selected) {
      this.$emit('input', selected.value)
      this.$emit('change', selected.value)
      this.$emit('confirm', selected.value)
      this.$emit('select', selected)
    },
    onReturnClick() {
      this.showPopup = false
    }
  },
  watch: {
    show(val) {
      this.$emit(val ? 'open' : 'close')
    },
    showPop(val) {
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
</style>
