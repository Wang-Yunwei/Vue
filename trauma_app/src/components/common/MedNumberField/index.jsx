import './index.less'
import {
  getClass,
  getStyle,
  initDefaultProps,
  getListeners,
  getOptionProps
} from '../../_utils/props-util'
import MedHintFiled from './../MedHintField'

const selfProps = (defaultProps = {}) => {
  return initDefaultProps(
    {
      ...MedHintFiled.props,
      maxlength: {
        type: Number,
        default: 10
      },
      unit: {
        type: String,
        required: true,
        default: '单位'
      },
      scale: {
        type: [String, Number],
        required: false
      },
      min: {
        type: [String, Number],
        required: false
      },
      max: {
        type: [String, Number],
        required: false
      }
    },
    defaultProps
  )
}
export default {
  name: 'MedNumberField',
  inheritAttrs: false,
  components: {
    MedHintFiled
  },
  props: selfProps({}),
  data() {
    return {
      fieldValue: '',
      errorMessages: ''
    }
  },
  model: {
    prop: 'value',
    event: '_change'
  },
  computed: {
    validRules() {
      const _rules = []
      if (this.rules) {
        this.rules.forEach(m => {
          _rules.push(m)
        })
      }
      if (this.max !== undefined) {
        _rules.push({
          validator: this.isOver,
          message: `${this.label}超出最大值${this.max}`
        })
      }
      if (this.min !== undefined) {
        _rules.push({
          validator: this.isBelow,
          message: `${this.label}低于最小值${this.min}`
        })
      }
      return _rules
    }
  },
  methods: {
    showHint(val) {
      this.errorMessages = val || ''
    },
    isOver() {
      if (!this.fieldValue) return true
      return Number(this.fieldValue) <= Number(this.max)
    },
    isBelow() {
      if (!this.fieldValue) return true
      return Number(this.fieldValue) >= Number(this.min)
    },
    inputHandler(value) {
      const valArr = value.split('.')
      if (this.scale !== undefined) {
        if (valArr.length > 1) {
          let pointLength = valArr[1].length
          pointLength =
            Number(this.scale) > pointLength ? pointLength : Number(this.scale)
          if (Number(this.scale) > 0) {
            value =
              +valArr[0] +
              (valArr.length > 1 ? `.${valArr[1].substr(0, pointLength)}` : '')
          } else {
            value = +valArr[0] + ''
          }
        } else {
          value = +value + ''
        }
        this.$emit('_change', value)
      }
      if (this.max !== undefined) {
        value = Math.min(value, Number(this.max))
        this.$emit('_change', value)
      }
      if (this.min !== undefined) {
        value = Math.max(value, Number(this.min))
        this.$emit('_change', value)
      }
    },
    onConfirm() {
      // this.inputHandler(this.fieldValue)
      this.$emit('confirm', this.fieldValue)
    }
  },
  watch: {
    // fieldValue(val) {
    //   if (val === '') {
    //     this.$emit('_change', val)
    //   } else {
    //     this.$emit('_change', Number(val))
    //   }
    // },
    value(val) {
      if (this.fieldValue !== val) {
        this.fieldValue = val
      }
    }
  },
  render() {
    const TProps = {
      class: getClass(this),
      style: getStyle(this)
    }
    const ChildProps = {
      attrs: this.$attrs,
      props: {
        ...getOptionProps(this),
        rules: [...this.validRules]
      },
      on: {
        ...getListeners(this),
        input: this.inputHandler,
        blur: this.onConfirm
      }
    }
    const bodySlots = Object.keys(this.$slots).length
      ? Object.keys(this.$slots).map(slot => {
          if (slot === 'default') {
            return <template slot={'right-icon'}>{this.$slots[slot]}</template>
          }
          return <template slot={slot}>{this.$slots[slot]}</template>
        })
      : [<template slot={'right-icon'}>{this.unit}</template>]
    return (
      <div
        class={{
          'med-number-field-wrapper': true
        }}
        {...TProps}
      >
        <med-hint-field
          class="no-link-arrow"
          type="number"
          v-model={this.fieldValue}
          {...ChildProps}
        >
          {bodySlots}
        </med-hint-field>
      </div>
    )
  }
}
