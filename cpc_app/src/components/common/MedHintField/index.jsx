import './index.less'
import T from 'vant/es/field/index'
import {
  getClass,
  getStyle,
  initDefaultProps,
  getListeners,
  getOptionProps
} from '../../_utils/props-util'

const selfProps = (defaultProps = {}) => {
  return initDefaultProps(
    {
      ...T.props,
      value: {
        type: [String, Number, Date],
        default: ''
      },
      placeholder: {
        type: String,
        default: ''
      },
      link: {
        type: Boolean,
        default: false
      },
      linkIcon: {
        type: String,
        default: ''
      },
      hintType: {
        type: String,
        default: ''
      },
      hintMessage: {
        type: String,
        default: ''
      },
      border: {
        type: Boolean,
        default: true
      }
    },
    defaultProps
  )
}
export default {
  TreeNode: { ...T.TreeNode, name: 'MedHintFieldNode' },
  name: 'MedHintField',
  inheritAttrs: false,
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
  methods: {
    switchElPosition() {
      if (this.hintType) {
        const icon = this.$el.querySelector('.van-field__left-icon')
        const label = this.$el.querySelector(
          '.van-cell__title.van-field__label'
        )

        icon && label && icon.before(label)
      }
    },
    linkClick() {
      this.$emit('link-click')
    },
    input(val) {
      if (val === '' && this.value) {
        this.fieldValue = val
        this.$emit('_change', val)
        this.$emit('change', val)
        this.$emit('input', val)
      }
    },
    onBlur(event) {
      this.$emit('blur', event)
      this.$emit('confirm', this.fieldValue)
    },
    showHint(val) {
      this.errorMessages = val || ''
    },
    getPlaceholder() {
      if (this.disabled) return ''
      if (this.placeholder && this.placeholder !== '') return this.placeholder
      return '请填写' + (this.label || '')
    }
  },
  mounted() {
    this.switchElPosition()
  },
  watch: {
    fieldValue(val) {
      // if (this.$attrs.type === 'number') {
      //   if (val === '') {
      //     this.$emit('_change', val)
      //     this.$emit('change', val)
      //   } else {
      //     this.$emit('_change', Number(val))
      //     this.$emit('change', Number(val))
      //   }
      //   return
      // }
      this.$emit('_change', val)
      this.$emit('change', val)
    },
    value(val) {
      if (this.fieldValue !== val) {
        this.fieldValue = val
      }
    }
  },
  render() {
    const { $attrs, $scopedSlots } = this
    const TProps = {
      class: getClass(this),
      style: getStyle(this)
    }
    const ChildProps = {
      attrs: $attrs,
      props: {
        ...getOptionProps(this),
        placeholder: this.getPlaceholder(),
        isLink: this.link,
        rightIcon: this.linkIcon,
        leftIcon: this.hintType,
        errorMessage: this.hintMessage || this.errorMessages,
        clearable: this.clearable,
        clearTrigger: 'always',
        name: this.label
      },
      on: {
        ...getListeners(this),
        'click-right-icon': this.linkClick,
        blur: this.onBlur,
        input: this.input
      },
      scopedSlots: $scopedSlots
    }
    const bodySlots = Object.keys(this.$slots).map(slot => {
      if (slot === 'default') return this.$slots[slot]
      if (slot === 'right-part') {
        return <template slot={'right-icon'}>{this.$slots[slot]}</template>
      }
      if (slot === 'input-part') {
        return <template slot={'input'}>{this.$slots[slot]}</template>
      }
      return <template slot={slot}>{this.$slots[slot]}</template>
    })

    const hideLinkArrow =
      this.link &&
      (!!this.linkIcon || Object.keys(this.$slots).includes('right-part'))
    return (
      <div
        class={{
          'med-hint-field-wrapper': true,
          'no-link-arrow': hideLinkArrow
        }}
        {...TProps}
      >
        <div
          class={
            this.border
              ? 'med-hint-field med-hint-field--bottom'
              : 'med-hint-field'
          }
        >
          <van-field {...ChildProps} v-model={this.fieldValue}>
            {bodySlots}
          </van-field>
        </div>
      </div>
    )
  }
}
