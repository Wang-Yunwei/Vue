import './index.less'
import T from 'vant/es/datetime-picker'
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
      label: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: ''
      },
      value: {
        type: [Date, String],
        default: ''
      },
      dateTime: {
        require: true,
        type: [Date, String]
      },
      required: {
        required: false,
        type: Boolean
      },
      rules: {
        required: false,
        type: [Object, Array]
      },
      disabled: {
        required: false,
        type: Boolean
      },
      type: {
        required: false,
        default: 'datetime'
      },
      formatter: {
        required: false,
        default: 'YYYY-MM-DD HH:mm'
      },
      minDate: {
        required: false,
        type: [String, Date]
      },
      maxDate: {
        required: false,
        type: [String, Date]
      },
      hintType: {
        type: String,
        default: ''
      },
      hintMessage: {
        type: String,
        default: ''
      },
      clearable: {
        type: Boolean,
        default: true
      },
      clearIcon: {
        type: String,
        default: 'close'
      },
      border: {
        type: Boolean,
        default: true
      },
      clickDefault: {
        type: Boolean,
        default: true
      }
    },
    defaultProps
  )
}
export default {
  TreeNode: { ...T.TreeNode, name: 'MedDatePickerNode' },
  name: 'MedDatePicker',
  inheritAttrs: false,
  props: selfProps({}),
  model: {
    prop: 'dateTime',
    event: '_change'
  },
  data() {
    return {
      show: false,
      childTime: ''
    }
  },
  computed: {
    format() {
      if (this.formatter) {
        return this.formatter
      }
      return this._type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm'
    },
    dateValue() {
      const times =
        typeof this.dateTime === 'string'
          ? this.dateTime.replace(/-/g, '/')
          : ''
      return times ? new Date(times) : new Date()
    },

    _minDate() {
      if (!this.minDate) {
        return this.$moment('1930-01-01').toDate()
      }
      return this.$moment(this.minDate).toDate()
    },
    _maxDate() {
      if (!this.maxDate) return undefined
      return this.$moment(this.maxDate).toDate()
    },
    _type() {
      if (this.formatter === 'YYYY-MM-DD') {
        return 'date'
      }
      return this.type
    }
  },
  created() {
    this.childTime = this.dateTime
      ? this.$moment(this.dateTime).format(this.format)
      : ''
  },
  updated() {
    this.childTime = this.dateTime
      ? this.$moment(this.dateTime).format(this.format)
      : ''
  },
  methods: {
    showPicker() {
      if (!this.disabled && !this.readonly) {
        if (!this.childTime && this.clickDefault) {
          this.childTime = this.$moment(new Date()).format(this.format)
          this.$emit('_change', this.childTime)
          this.$emit('confirm', this.childTime)
        } else {
          this.show = true
        }
      }
    },
    onCancel() {
      this.show = false
    },
    onConfirm(val) {
      this.show = false
      this.childTime = this.$moment(val).format(this.format)
      this.$emit('_change', this.childTime)
      this.$emit('confirm', val)
    },
    onChange(val) {
      this.$emit('change', val)
    },
    formatters(type, val) {
      if (type === 'year') {
        return `${val}年`
      } else if (type === 'month') {
        return `${val}月`
      } else if (type === 'day') {
        return `${val}日`
      } else if (type === 'hour') {
        return `${val}时`
      } else if (type === 'minute') {
        return `${val}分`
      }
      return val
    },
    showHint(val) {
      this.$refs.hintField.showHint(val)
    },
    clear(e) {
      this.childTime = ''
      this.$emit('_change', this.childTime)
      this.$emit('confirm', this.childTime)
      e.stopPropagation()
    },
    onOpen() {
      this.$backhelper.push(() => {
        this.show = false
      })
    },
    onClose() {
      this.$backhelper.pop()
    }
  },
  watch: {
    // childTime(val) {
    //   this.$emit('changeTime', val)
    //   this.$emit('_change', val)
    // }
  },
  render() {
    const { $attrs, $scopedSlots } = this
    const TProps = {
      class: getClass(this),
      style: getStyle(this),
      props: {
        required: this.required,
        label: this.label,
        placeholder: this.placeholder,
        disabled: this.disabled,
        rules: this.rules,
        hintType: this.hintType,
        hintMessage: this.hintMessage,
        border: this.border
      },
      on: {
        click: this.showPicker
      }
    }

    const ChildProps = {
      props: {
        ...getOptionProps(this),
        type: this._type,
        minDate: this._minDate,
        maxDate: this._maxDate,
        filter: this.filter,
        formatter: this.formatters,
        value: this.dateValue
      },
      on: {
        ...getListeners(this),
        cancel: this.onCancel,
        confirm: this.onConfirm,
        change: this.onChange
      },
      attrs: $attrs,
      scopedSlots: $scopedSlots
    }
    const PopProps = {
      on: {
        ...getListeners(this),
        cancel: this.onCancel,
        confirm: this.onConfirm,
        change: this.onChange
      }
    }
    const bodySlots = Object.keys(this.$slots).map(slot => {
      if (slot === 'default') return this.$slots[slot]
      return <template slot={slot}>{this.$slots[slot]}</template>
    })
    return (
      <div
        class={{
          'med-datepicker-wrapper': true
        }}
      >
        <med-hint-field
          ref="hintField"
          readonly
          class="no-link-arrow"
          v-model={this.childTime}
          {...TProps}
        >
          <template slot="right-part">
            <van-icon
              vShow={
                !this.readonly &&
                !this.disabled &&
                this.clearable &&
                this.childTime
              }
              name={this.clearIcon}
              class="clear-icon"
              onClick={e => this.clear(e)}
            />
          </template>
          {bodySlots}
        </med-hint-field>

        <van-popup
          class="med-datepicker-popup"
          get-container="body"
          position="bottom"
          v-model={this.show}
          onOpen={this.onOpen}
          onClose={this.onClose}
        >
          <van-datetime-picker
            type={this._type}
            title="选择时间"
            item-height={'1.2rem'}
            visible-item-count={5}
            {...ChildProps}
          />
        </van-popup>
      </div>
    )
  }
}
