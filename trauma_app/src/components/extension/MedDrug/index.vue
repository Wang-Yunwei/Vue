<template>
  <div class="med-drug-result-field-wrapper">
    <med-hint-field v-bind="$props" :rules="[]">
      <template #input-part>
        <div class="drug-field">
          <div class="first-row" v-if="isOther">
            <van-field
              v-model="fValue.otherName"
              :readonly="readonly"
              :disabled="disabled"
              input-align="left"
              placeholder="用药名称"
              :required="required"
              :rules="rules"
              @blur="onConfirm"
              :maxlength="16"
            >
            </van-field>
          </div>
          <div class="first-row">
            <van-field
              v-model="frequency.name"
              readonly
              :disabled="disabled"
              input-align="left"
              placeholder="服用频次"
              :required="required"
              :rules="rules"
              @blur="onConfirm"
              @click="onFieldClick1"
            >
              <template #right-icon>
                <van-icon name="arrow-down" />
              </template>
            </van-field>
            <van-field
              v-model="times.name"
              readonly
              :disabled="disabled"
              input-align="right"
              placeholder="服用频次"
              :required="required"
              :rules="rules"
              @click="onFieldClick2"
            >
              <template #right-icon>
                <van-icon name="arrow-down" />
              </template>
            </van-field>
          </div>
          <div class="second-row">
            <van-field
              v-model="unitvalue"
              :readonly="readonly"
              :disabled="disabled"
              type="number"
              input-align="left"
              placeholder="单次剂量"
              :required="required"
              :rules="rules"
              @blur="onConfirm"
              :maxlength="11"
              v-float="{ scale: 2, min: 0, max: 99999999 }"
            >
              <template #right-icon>
                {{ unit }}
              </template>
            </van-field>
          </div>
        </div>
      </template>
    </med-hint-field>
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
      @close="close"
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
import T from '@components/common/MedHintField/index.jsx'
export default {
  name: 'meddrug',
  inheritAttrs: false,
  props: {
    ...T.props,
    fValue: {
      type: Object,
      default: () => ({
        times: '',
        frequency: '',
        unit: '',
        value: '',
        name: '',
        otherName: ''
      })
    }
  },
  model: {
    prop: 'fValue',
    event: '_change'
  },
  data() {
    return {
      frequency: {
        name: '',
        value: ''
      },
      times: {
        name: '',
        value: ''
      },
      unit: this.fValue.unit,
      unitvalue: this.fValue.value,
      showOptions: false,
      strTimesDic: [
        { name: '1次', value: '1', type: 'time' },
        { name: '2次', value: '2', type: 'time' },
        { name: '3次', value: '3', type: 'time' },
        { name: '4次', value: '4', type: 'time' }
      ],
      strFrequencyDic: [
        { name: '每日', value: '1', type: 'frequency' },
        { name: '每周', value: '2', type: 'frequency' },
        { name: '每月', value: '3', type: 'frequency' }
      ],
      actions: []
    }
  },
  created() {},
  mounted() {
    this.update()
    this.$forceUpdate()
  },
  methods: {
    onFieldClick() {
      if (!this.readonly && !this.disabled) {
        this.showOptions = true
      }
    },
    onFieldClick1() {
      this.actions = this.strFrequencyDic.map(ele => {
        const selected = ele.value === this.frequency.value
        return {
          ...ele,
          label: ele.name,
          className: selected ? 'selected' : undefined
        }
      })
      this.onFieldClick()
    },
    onFieldClick2() {
      this.actions = this.strTimesDic.map(ele => {
        const selected = ele.value === this.times.value
        return {
          ...ele,
          label: ele.name,
          className: selected ? 'selected' : undefined
        }
      })
      this.onFieldClick()
    },
    onSelect(action) {
      if (action.type === 'time') {
        this.times.name = action.name
        this.times.value = action.value
      } else if (action.type === 'frequency') {
        this.frequency.name = action.name
        this.frequency.value = action.value
      }
      this.showOptions = false
      this.onConfirm()
    },
    onConfirm() {
      const returnValue = {
        times: this.times.value,
        frequency: this.frequency.value,
        unit: this.unit,
        value: this.unitvalue,
        otherName: this.fValue.otherName
      }
      this.$emit('_change', returnValue)
      this.$emit('confirm', returnValue)
    },
    close() {
      this.$emit('close')
    },
    update() {
      if (this.fValue) {
        const freq = this.strFrequencyDic.find(
          t => t.value === this.fValue.frequency
        )
        if (freq) {
          this.frequency = { ...freq }
        }

        const time = this.strTimesDic.find(t => t.value === this.fValue.times)
        if (time) {
          this.times = { ...time }
        }

        this.unit = this.fValue.unit
        this.unitvalue = this.fValue.value
        if (this.unitvalue == null) {
          this.unitvalue = ''
        }
      }
    }
  },
  computed: {
    isOther() {
      return this.fValue.name === '99'
    }
    // actions() {
    //   return (this.unitOptions || []).map(ele => {
    //     const selected = ele.value === this.unitId
    //     return {
    //       ...ele,
    //       name: ele.name,
    //       className: selected ? 'selected' : undefined
    //     }
    //   })
    // },
    // selectedItem() {
    //   const matched = (this.unitOptions || []).find(
    //     ele => ele.value === this.value
    //   )
    //   if (matched) return matched
    //   return {}
    // },
    // resultPlaceholder() {
    //   if (this.disabled) return ''
    //   if (this.placeholder) return this.placeholder
    //   return this.label
    // },
    // unitPlaceholder() {
    //   if (this.disabled) return ''
    //   return '单位'
    // }
  },
  watch: {
    // result(val) {
    //   // this.$emit('_change', { value: val, unit: this.unitId })
    //   this.$emit('change', { value: val, unit: this.unitId })
    // },
    // unitId(val) {
    //   // this.$emit('_change', { value: this.cValue, unit: this.unitId })
    //   this.$emit('change', { value: this.result, unit: val })
    // },
    fValue(val) {
      // debugger
      this.update()
    }
  }
}
</script>

<style lang="less" scoped>
.med-drug-result-field-wrapper {
  .drug-field {
    display: flex;
    flex-wrap: wrap;
    flex-grow: 1;
    & > div {
      display: flex;
      flex-grow: 1;
    }
    .van-cell--required::before {
      content: "";
    }
  }
  .first-row .van-cell {
    padding: 0px 0 8px 0;
  }
  .second-row .van-cell {
    padding: 8px 0 0px 0;
  }
  /deep/ .first-row .van-cell::after {
    border-bottom: 0px;
  }

  .split {
    padding: 0 10px;
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
