<template>
  <div class="med-drug-result-field-wrapper">
    <el-form-item :label="label" size="mini">
      <el-row :gutter="12">
        <el-col v-if="isOther" :span="4">
          <med-text
            v-model="otherName"
            label="药品名称"
            :readonly="readonly"
            :disabled="disabled"
            input-align="left"
            placeholder="药品名称"
            @change="onConfirm"
          />
        </el-col>
        <el-col :span="2">
          <med-select
            v-model="frequency.value"
            :select-options="strFrequencyDic"
            :disabled="disabled"
            placeholder="服用频次"
            @change="onConfirm"
          />
        </el-col>
        <el-col :span="2">
          <med-select
            v-model="times.value"
            :select-options="strTimesDic"
            :disabled="disabled"
            placeholder="服用频次"
            @change="onConfirm"
          />
        </el-col>
        <el-col :span="3">
          <med-text
            v-model="unitvalue"
            label="单次剂量"
            :readonly="readonly"
            :disabled="disabled"
            type="number"
            input-align="left"
            placeholder="单次剂量"
            :append="unit"
            @change="onConfirm"
          />
        </el-col>
      </el-row>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'Meddrug',
  model: {
    prop: 'fValue',
    event: '_change'
  },
  props: {
    fValue: {
      type: Object,
      default: () => ({
        times: '',
        frequency: '',
        unit: '',
        value: '',
        otherName: ''
      })
    },
    label: {
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
      frequency: {
        label: '',
        value: ''
      },
      times: {
        label: '',
        value: ''
      },
      otherName: this.fValue.otherName,
      unit: this.fValue.unit,
      unitvalue: this.fValue.value,
      showOptions: false,
      strTimesDic: [
        { label: '1次', value: '1', type: 'time' },
        { label: '2次', value: '2', type: 'time' },
        { label: '3次', value: '3', type: 'time' },
        { label: '4次', value: '4', type: 'time' }
      ],
      strFrequencyDic: [
        { label: '每日', value: '1', type: 'frequency' },
        { label: '每周', value: '2', type: 'frequency' },
        { label: '每月', value: '3', type: 'frequency' }
      ],
      actions: []
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
      this.actions = this.strFrequencyDic.map((ele) => {
        const selected = ele.value === this.frequency.value
        return {
          ...ele,
          className: selected ? 'selected' : undefined
        }
      })
      this.onFieldClick()
    },
    onFieldClick2() {
      this.actions = this.strTimesDic.map((ele) => {
        const selected = ele.value === this.times.value
        return {
          ...ele,
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
        otherName: this.otherName
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
          (t) => t.value === this.fValue.frequency
        )
        if (freq) {
          this.frequency = { ...freq }
        }

        const time = this.strTimesDic.find((t) => t.value === this.fValue.times)
        if (time) {
          this.times = { ...time }
        }

        this.unit = this.fValue.unit
        this.unitvalue = this.fValue.value
      }
    }
  }
  // watch: {
  //   result(val) {
  //     // this.$emit('_change', { value: val, unit: this.unitId })
  //     this.$emit('change', { value: val, unit: this.unitId })
  //   },
  //   unitId(val) {
  //     // this.$emit('_change', { value: this.cValue, unit: this.unitId })
  //     this.$emit('change', { value: this.result, unit: val })
  //   },
  //   fValue(val) {
  //     this.update(val)
  //   }
  // }
}
</script>

<style lang="scss" scoped>
.med-drug-frequency {
  display: flex;
}

.med-drug-frequency-span {
  padding: 5px;
}
.med-drug-result-field-wrapper {
  .drug-field {
    display: flex;
    flex-wrap: wrap;
    flex-grow: 1;
    & > div {
      display: flex;
      flex-grow: 1;
    }
  }
  .first-row .van-cell {
    padding: 0px 0 8px 0;
  }
  .second-row .van-cell {
    padding: 8px 0 0px 0;
  }
  // /deep/ .first-row .van-cell::after {
  //   border-bottom: 0px;
  // }

  .split {
    padding: 0 10px;
  }
}
.med-select-options .van-action-sheet__item {
  position: relative;
  &:before {
    content: '';
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
