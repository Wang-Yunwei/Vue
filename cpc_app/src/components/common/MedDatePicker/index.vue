<template>
  <div class="med-datepicker-wrapper" @click="handleShowList">
    <van-field
      readonly
      v-model="childTime"
      :required="required"
      :label="label"
      :placeholder="placeholder"
      :disabled="disabled"
      @click="showPicker"
    >
      <template #right-icon>
        <div class="med-datepicker-arrow">
          <i class="iconfont iconicon1svg-52" />
        </div>
      </template>
    </van-field>
    <van-popup
      class="med-datepicker-popup"
      :duration="0.12"
      get-container="body"
      v-model="show"
      @click.stop
      position="bottom"
      @open="onOpen"
      @close="onClose"
    >
      <van-datetime-picker
        v-bind="$attrs"
        :min-date="minDate"
        :max-date="maxDate"
        :filter="filter"
        :value="dateValue"
        type="datetime"
        title="选择时间"
        item-height="1.2rem"
        :visible-item-count="5"
        :formatter="formatters"
        @cancel="show = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
import T from 'vant/es/datetime-picker'
export default {
  name: 'MedDatePicker',
  inheritAttrs: false,
  props: {
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
    }
  },
  model: {
    prop: 'dateTime',
    event: '_change'
  },
  data() {
    return {
      show: false,
      childTime: this.dateTime
    }
  },
  computed: {
    formatStr() {
      return 'YYYY-MM-DD HH:mm'
    },
    dateValue() {
      return this.string2Date(this.value)
    }
  },
  methods: {
    showPicker() {
      if (!this.disabled) {
        this.show = true
      }
    },
    date2String(date) {
      return this.$moment(date).format(this.formatStr)
    },
    string2Date(str) {
      return str ? new Date(str) : new Date()
    },
    handleShowList() {
      if (!this.readonly && !this.disabled) {
        this.show = true
      }
    },
    onConfirm(val) {
      this.show = false
      this.childTime = this.date2String(val)
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
    childTime(val) {
      console.log('childTime改变了', this.childTime)

      this.$emit('_change', val)
      this.$emit('confirm', val)
    }
  }
}
</script>

<style lang="less" scoped>
.med-datepicker-wrapper {
  display: flex;
  align-items: center;
  .med-datepicker-placeholder {
    color: rgba(0, 0, 0, 0.26);
  }
  .med-datepicker-value {
    color: rgba(0, 0, 0, 0.8);
    overflow: auto;
    flex-wrap: wrap;
  }
  .med-datepicker-arrow i.iconicon1svg-52 {
    font-size: 36px;
  }
}
</style>
