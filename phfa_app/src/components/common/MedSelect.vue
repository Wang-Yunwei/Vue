<template>
  <div class="med-select-wrapper" @click="handleShowList">
    <div class="med-select-value flex-c-s" v-if="value">
      <!-- {{ selectedLabels }} -->
      <template v-if="multiple">
        <div
          class="med-select-label-item"
          v-for="label in selectedLabels"
          :key="label"
        >
          {{ label }}
        </div>
      </template>
      <template v-else>{{ selectedLabels[0] }}</template>
    </div>
    <div class="med-select-placeholder" v-if="!value">{{ placeholder }}</div>
    <div class="med-select-arrow">
      <slot name="icon" v-if="showArrow">
        <van-icon :name="isOpenInNewPage ? 'arrow' : 'arrow-down'" />
      </slot>
    </div>
    <van-action-sheet
      cancel-text="取消"
      class="med-select-options"
      v-if="!disabled && !readonly && !isOpenInNewPage"
      :duration="0.12"
      get-container="body"
      v-model="show"
      :actions="show ? actions : []"
      @select="handleSelect"
      @click.stop
      :description="multiple ? '(多选)' : ''"
    >
      <med-empty description="暂无数据" v-if="show && !actions.length" />
    </van-action-sheet>
    <van-popup
      v-model="show"
      :duration="0.15"
      get-container="body"
      position="right"
      v-if="!disabled && !readonly && isOpenInNewPage"
      @click.stop
    >
      <transition name="moveR" :duration="500">
        <med-empty description="暂无数据" v-if="show && !actions.length" />
        <div class="med-select-page-wrapper" v-if="show && actions.length">
          <med-header :title="pageTitle" @backClick="show = false" />
          <van-checkbox-group v-model="checkboxValue" class="content-box">
            <van-cell-group>
              <van-cell
                clickable
                v-for="(item, index) in options"
                :key="item.value"
                :title="item.label"
                @click="toggle(index)"
              >
                <template #right-icon>
                  <van-checkbox
                    class="checkbox"
                    :name="item.value"
                    ref="checkboxes"
                  />
                </template>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
        </div>
      </transition>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'MedSelect',
  props: {
    placeholder: {
      type: String,
      default: '请选择'
    },
    options: {
      type: Array,
      default: () => []
    },
    value: {
      type: [String, Array], // 单选默认string,多选默认Array,可设置multiple.stringValue=true改为string格式
      default: ''
    },
    openInPage: {
      // 在新页面打开候选项列表,true:打开新页面, false:不打开新页面, 'auto':超过一定数量(>=openTirggerNumber)时在新页面打开
      type: [Boolean, String],
      default: 'auto'
    },
    openTirggerNumber: {
      // 当openInPage为auto时, 触发新窗口打开的最少候选项数量
      type: Number,
      default: 6
    },
    pageTitle: {
      type: String,
      default: '请选择'
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showArrow: {
      type: Boolean,
      default: true
    },
    multiple: {
      // 多选模式
      type: [Boolean, Object], // 为Object时: {stringValue:Boolean,separator:String}
      default: false
    }
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    isOpenInNewPage() {
      return (
        this.openInPage === true ||
        (this.openInPage === 'auto' &&
          this.options.length >= this.openTirggerNumber)
      )
    },
    actions() {
      return (this.options || []).map(ele => {
        let selected = false
        if (typeof this.formatedValue === 'string') {
          selected = ele.value === this.formatedValue
        } else if (Array.isArray(this.formatedValue)) {
          selected = this.formatedValue.includes(ele.value)
        }
        return {
          ...ele,
          name: ele.label,
          className: selected ? 'selected' : undefined
        }
      })
    },
    selectedItems() {
      const items = []
      if (Array.isArray(this.formatedValue)) {
        this.formatedValue.forEach(val => {
          const matched = (this.options || []).find(ele => ele.value === val)
          if (matched) {
            items.push(matched)
          }
        })
      } else {
        const matched = (this.options || []).find(
          ele => ele.value === this.formatedValue
        )
        if (matched) {
          items.push(matched)
        }
      }
      return items
    },
    selectedLabels() {
      return this.selectedItems.map(el => el.label)
    },
    checkboxValue: {
      get() {
        return this.formatedValue && typeof this.formatedValue === 'string'
          ? [this.formatedValue]
          : this.formatedValue || undefined
      },
      set(arr) {
        let newValue = arr
        if (this.multiple && arr?.length) {
          if (typeof this.multiple === 'object' && this.multiple.stringValue) {
            const { separator = ',' } = this.multiple
            newValue = newValue.join(separator)
          }
        } else {
          newValue = arr.pop()
        }
        this.$emit('input', newValue)
        this.$emit('change', newValue)
      }
    },
    formatedValue() {
      let formatted = this.value
      if (
        typeof this.multiple === 'object' &&
        this.multiple.stringValue &&
        typeof this.value === 'string'
      ) {
        const { separator = ',' } = this.multiple
        formatted = formatted ? formatted.split(separator) : []
      }
      return formatted
    }
  },
  methods: {
    toggle(index) {
      const instance = this.$refs.checkboxes[index]
      if (instance && (this.multiple || !instance.checked)) {
        instance.toggle()
      }
      // if (instance.checked) {
      this.$emit('select', this.options[index])
      // }
      // 单选自动关闭打开的页面
      if (this.isOpenInNewPage) {
        // 延迟关闭避免setter失效
        setTimeout(() => (this.show = false), 50)
      }
    },
    handleShowList() {
      if (!this.readonly && !this.disabled) {
        this.show = true
      }
    },
    handleSelect(selected) {
      if (this.multiple) {
        let newValue = []
        if (typeof this.formatedValue === 'string') {
          let separator = ','
          if (typeof this.multiple === 'object') {
            separator = this.multiple.separator || ','
            newValue = this.formatedValue.split(separator)
          }
        } else if (Array.isArray(this.formatedValue)) {
          newValue = [...this.formatedValue]
        }
        if (newValue.includes(selected.value)) {
          newValue = newValue.filter(val => val !== selected.value)
        } else {
          newValue.push(selected.value)
        }
        newValue = newValue.filter(item =>
          this.options.some(opt => opt.value === item)
        )

        if (!newValue.length) {
          newValue = undefined
        } else if (
          typeof this.multiple === 'object' &&
          this.multiple.stringValue
        ) {
          const { separator = ',' } = this.multiple
          newValue = newValue.join(separator)
        }
        this.$emit('input', newValue)
        this.$emit('change', newValue)
        if (this.options.length === 1) {
          this.show = false
        }
      } else {
        this.$emit('input', selected.value)
        this.$emit('change', selected.value)
        this.show = false
      }
      this.$emit('select', selected)
    }
  },
  watch: {
    show(val) {
      this.$emit(val ? 'open' : 'close')
    }
  }
}
</script>

<style lang="less">
.med-select-wrapper {
  flex: auto;
  display: flex;
  margin-bottom: -0.1rem;
  .med-select-value,
  .med-select-placeholder {
    padding-right: 0.2rem;
    flex: auto;
  }
  .med-select-placeholder {
    color: rgba(0, 0, 0, 0.26);
  }
  .med-select-value {
    color: rgba(0, 0, 0, 0.8);
    overflow: auto;
    flex-wrap: wrap;
  }
  .med-select-arrow {
    color: #969799;
  }
  .med-select-label-item {
    background-color: rgb(228, 232, 255);
    color: #5e74fe;
    border-radius: 0.3rem;
    padding: 0 0.22rem;
    flex: 0 1 auto;
    white-space: nowrap;
    margin-bottom: 0.1rem;
    &:not(:last-child),
    &:only-child {
      margin-right: 0.1rem;
    }
  }
}
.med-select-page-wrapper {
  width: 100vw;
  height: 100vh;
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
  max-height: 55%;
  .van-action-sheet__item {
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
}
.content-box {
  max-height: calc(100vh - 2rem);
  overflow: auto;
  .van-cell-group .van-cell__title {
    max-width: 100%;
  }
}
.checkbox {
  pointer-events: none;
}
</style>
