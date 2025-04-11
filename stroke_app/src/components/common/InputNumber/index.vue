<template>
  <van-field
    v-bind.sync="$attrs"
    v-on="restListeners"
    :type="type"
    :formatter="format"
    :format-trigger="formatTrigger"
    @input="onInput"
  >
    <template v-for="name in slotNames" v-slot:[name]>
      <slot :name="name" />
    </template>
  </van-field>
</template>

<script>
export default {
  name: 'InputNumber',
  props: {
    type: {
      type: String,
      default: 'digit'
    },
    formatter: Function,
    precision: {
      // 小数保留位数
      type: Number,
      default: 0
    },
    valueType: {
      // 值格式,可选number和string
      type: String,
      default: 'number'
    },
    formatTrigger: {
      type: String,
      default: 'onBlur'
    }
  },
  data() {
    return {
      mounted: false
    }
  },
  computed: {
    format() {
      return this.formatter || this.defaultFormatter
    },
    slotNames() {
      return Object.keys(this.$slots)
    },
    restListeners() {
      const { input, ...rest } = this.$listeners
      return rest
    }
  },
  mounted() {
    this.$forceUpdate()
    this.mounted = true
  },
  methods: {
    defaultFormatter(val) {
      const parseNum = this.type === 'digit' ? parseInt : parseFloat
      const parsed = parseNum(val)
      const numVal = isNaN(parsed) ? undefined : parseNum(parsed)
      const strValue = numVal === undefined ? undefined : numVal.toString()
      const trimmedStrVal = !strValue
        ? undefined
        : strValue
            .split('.')
            .map((str, idx) => (idx ? str.slice(0, this.precision) : str))
            .join('.')
      const trimmedNumVal =
        trimmedStrVal === undefined ? undefined : Number(trimmedStrVal)

      return this.valueType === 'number' ? trimmedNumVal : trimmedStrVal
    },
    onInput(val) {
      if (!this.mounted) {
        return
      }
      this.$emit('input', this.format(val))
      if (!val?.endsWith('.')) {
        this.$forceUpdate()
      }
    }
  }
}
</script>
