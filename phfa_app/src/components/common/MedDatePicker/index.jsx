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
        default: '选择时间'
      },
      placeholder: {
        type: String,
        default: '请选择时间'
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
        default: 'YYYY-MM-DD[T]HH:mm:ss'
      },
      displayFormatter: {
        required: false,
        default: 'YYYY-MM-DD HH:mm'
      },
      autoFill: {
        required: false,
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
      childTime: this.date2String(this.dateTime)
    }
  },
  computed: {
    displayTime() {
      return this.childTime
        ? this.$moment(this.childTime).format(
            this.displayFormatter || this.formatter
          )
        : ''
    },
    dateValue() {
      return this.string2Date(this.value)
    }
  },
  // updated() {
  //   this.childTime = this.date2String(this.dateTime)
  // },
  methods: {
    onClick() {
      if (this.disabled) {
        return
      }
      if (this.autoFill && !this.dateTime) {
        const now = this.$moment().format(this.formatter)
        this.childTime = this.date2String(now)
      } else {
        this.showPicker()
      }
    },
    showPicker() {
      this.show = true
    },
    date2String(date) {
      if (date) {
        return this.$moment(date).format(this.formatter)
      }
      return ''
    },
    string2Date(str) {
      return str ? new Date(str) : new Date()
    },
    handleShowList() {
      if (!this.readonly && !this.disabled) {
        this.show = true
      }
    },
    onCancel() {
      this.show = false
      this.$emit('cancel')
    },
    onConfirm(val) {
      this.show = false
      if (this.childTime !== this.date2String(val)) {
        this.childTime = this.date2String(val)
      } else {
        // 防止childTime值没改变时不触发watch,这里手动触发
        this.$emit('changeTime', this.childTime)
        this.$emit('_change', this.childTime)
      }
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
    }
  },
  watch: {
    dateTime(v) {
      this.childTime = this.date2String(v)
    },
    childTime(val) {
      this.$emit('changeTime', val)
      this.$emit('_change', val)
    }
  },
  render() {
    const { $attrs, $scopedSlots } = this
    const TProps = {
      class: getClass(this),
      style: getStyle(this)
    }
    const ChildProps = {
      props: {
        ...getOptionProps(this),
        minDate: this.minDate,
        maxDate: this.maxDate,
        filter: this.filter,
        formatter: this.formatters,
        value: this.dateValue
      },
      on: {
        ...getListeners(this),
        cancel: this.onCancel,
        confirm: this.onConfirm
      },
      attrs: $attrs,
      scopedSlots: $scopedSlots
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
        {...TProps}
      >
        <van-field
          readonly
          value={this.displayTime}
          required={this.required}
          label={this.label}
          placeholder={this.placeholder}
          disabled={this.disabled}
          onClick={this.onClick}
          rules={this.rules}
        >
          {bodySlots}
        </van-field>
        <van-popup
          class="med-datepicker-popup"
          get-container="body"
          position="bottom"
          v-model={this.show}
          on={{
            'click-overlay': this.onCancel,
            'click-close-icon': this.onCancel
          }}
        >
          {this.show && (
            <van-datetime-picker
              {...ChildProps}
              type={this.type}
              title="选择完整时间"
              item-height={'1.2rem'}
              visible-item-count={5}
            />
          )}
        </van-popup>
      </div>
    )
  }
}
