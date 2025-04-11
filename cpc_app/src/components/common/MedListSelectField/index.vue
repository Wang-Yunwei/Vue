<template>
  <div class="med-list-select-wrapper">
    <med-hint-field
      :label="label"
      @click="onFieldClick"
      readonly
      v-bind="$props"
      v-model="fieldValue"
    >
      <template #right-icon>
        <van-icon name="arrow" class="select-icon" />
      </template>
      <template #input-part v-if="labelList && labelList.length > 0">
        <div class="med-list-label-wapper">
          <div
            :class="['med-select-label-item', { 'item-disable': disabled }]"
            v-for="(item, index) in labelList"
            :key="'med-list-label-' + index"
          >
            {{ item }}
          </div>
        </div>
      </template>
    </med-hint-field>
    <med-popup-container
      v-model="show"
      :title="label"
      get-container="body"
      position="right"
      @return="onReturnClick"
      scroll
    >
      <div @click.stop>
        <van-checkbox-group v-model="selectedOptions">
          <van-cell-group>
            <van-cell
              v-for="(item, index) in selectOptions"
              :key="item.value"
              :value="item.label"
              clickable
              @click="toggle(item, index)"
            >
              <template #right-icon>
                <van-checkbox ref="checkboxes" :name="item.value" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>
        <van-field
          v-if="showOther"
          v-model="otherContent"
          label="其他内容"
          maxlength="66"
          placeholder="请填写"
        />
      </div>
    </med-popup-container>
  </div>
</template>

<script>
import MedHintField from '../MedHintField/index.jsx'
export default {
  name: 'MedListSelectField',
  data() {
    return {
      show: false,
      fieldValue: ''
    }
  },
  props: {
    ...MedHintField.props,
    selectOptions: {
      require: true,
      default: () => []
    },
    value: {
      type: [Array, String],
      default: ''
    },
    other: {
      type: String,
      default: ''
    },
    hasOther: {
      type: Boolean,
      default: true
    },
    nonCode: {
      type: String,
      default: ''
    }
  },
  computed: {
    labelMap() {
      const map = {}
      this.selectOptions.forEach(opt => {
        map[opt.value] = opt.label
      })
      return map
    },
    valueList() {
      let valueArr = []
      if (this.value) {
        if (Array.isArray(this.value)) {
          valueArr = this.value
        } else valueArr = this.value.split(',')
      }
      return valueArr
    },
    labelList() {
      let labelArr = []
      let otherArr = []
      if (this.value) {
        if (this.hasOther) {
          labelArr = this.valueList
            .filter(v => v !== '99') // 隐藏'其他'项
            .map(val => this.labelMap[val])
            .filter(el => el)
        } else {
          labelArr = this.valueList
            .map(val => this.labelMap[val])
            .filter(el => el)
        }
      }
      if (this.other) {
        otherArr = [this.other]
      }
      return labelArr.concat(otherArr)
    },
    selectedOptions: {
      get() {
        return this.valueList
      },
      set(value) {
        // “无”选项互斥
        if (this.nonCode && value.length > 0) {
          if (value[value.length - 1] === this.nonCode) {
            value = [this.nonCode]
          } else if (value[0] === this.nonCode) {
            value = value.slice(1)
          }
        }

        value.sort((a, b) => {
          const matchedA = this.selectOptions.findIndex(opt => opt.value === a)
          const matchedB = this.selectOptions.findIndex(opt => opt.value === b)
          return matchedA - matchedB
        })
        this.$emit('input', value.join())
      }
    },
    otherContent: {
      get() {
        return this.other
      },
      set(value) {
        this.$emit('update:other', value)
      }
    },
    showOther() {
      const otherOpt = this.selectOptions.find(ele => ele.value === '99')
      if (
        this.hasOther &&
        otherOpt &&
        this.valueList.includes(otherOpt.value)
      ) {
        return true
      }
      return false
    }
  },
  methods: {
    setFieldValue(value) {
      if (!value || value.length === 0) {
        this.fieldValue = ''
        return
      }
      const result = value.filter(m => {
        return m && m !== ''
      })
      if (result.length === 0) {
        this.fieldValue = ''
        return
      }
      this.fieldValue = JSON.stringify(value)
    },
    onFieldClick() {
      if (!this.readonly && !this.disabled) {
        this.show = true
      }
    },
    onReturnClick() {
      this.show = false
      this.$emit('confirm', {
        selectedOptions: this.selectedOptions,
        other: this.otherContent
      })
    },
    removeItem(label) {
      if (this.readonly || this.disabled) return
      if (this.other === label) {
        // 删除'其他'的内容时,一并取消'其他'项的选中状态
        const matchedValue = (
          this.selectOptions.find(item => item.value === '99') || {}
        ).value
        const newVal = this.valueList
          .filter(item => item !== matchedValue)
          .join()
        this.$emit('input', newVal)
        this.$emit('update:other', '')
        this.$emit('confirm', {
          selectedOptions: newVal,
          other: ''
        })
      } else {
        const matchedValue = (
          this.selectOptions.find(item => item.label === label) || {}
        ).value
        const newVal = this.valueList
          .filter(item => item !== matchedValue)
          .join()
        this.$emit('input', newVal)
        this.$emit('confirm', {
          selectedOptions: newVal,
          other: ''
        })
      }
    },
    backClick() {
      this.$emit('backClick')
    },
    toggle(item, index) {
      this.$refs.checkboxes[index].toggle()
      if (item.value === '99') {
        this.otherContent = ''
      }
    }
  },
  watch: {
    selectedOptions: {
      immediate: true,
      handler(val) {
        this.setFieldValue(val)
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.down-list {
  background: #fff;
  padding-left: 0.3rem;

  // .van-cell__value:before {
  //   content: "";
  //   display: none;
  //   margin-right: 0.2rem;
  //   background-color: #666;
  //   width: 0.15rem;
  //   height: 0.15rem;
  //   border-radius: 100%;
  // }
}

.med-list-select-wrapper {
  width: 100vw;

  .med-list-label-wapper {
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
</style>
