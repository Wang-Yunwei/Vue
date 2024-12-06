<template>
  <div class="string-checkbox">
    <el-checkbox-group
      v-bind.sync="$attrs"
      :value="arrVal"
      :options="opts"
      @input="handleChange"
    >
      <el-checkbox v-for="opt in opts" :key="opt.value" :label="opt.value">{{
        opt.label
      }}</el-checkbox>
      <template v-if="otherInputVisible">
        <el-input
          class="other-input"
          :value="other"
          v-bind="otherAttrs"
          @input="handleOtherChange"
        />
      </template>
    </el-checkbox-group>
  </div>
</template>

<script>
// AdvancedCheckbox 可配置输入输出都是字符串格式的值,以逗号","分隔,可配置分隔符号
// 带有"其他"字段,选择"其他"时需填写"其他"内容
export default {
  name: 'AdvancedCheckbox',
  props: {
    stringifyValue: {
      // 控制输入输出是否字符串格式
      type: Boolean,
      default: true
    },
    value: {
      // 值,字符串或数组格式
      type: [String, Array],
      default: ''
    },
    options: {
      // 侯选项
      type: Array,
      default: () => [] // “其他” 字段使用 isOther:true标记,或label="其他"
    },
    other: {
      // “其他” 字段
      type: String,
      default: ''
    },
    otherAttrs: {
      // “其他” 输入框的属性
      type: Object,
      default: () => ({
        size: 'small',
        placeholder: '请输入其他内容',
        style: {
          width: '160px'
        }
      })
    },
    separator: {
      // 分隔符号,默认逗号
      type: String,
      default: ','
    }
  },
  computed: {
    opts() {
      return this.options.map((o) => {
        return {
          ...o,
          isOther: o.isOther || o.label === '其他'
        }
      })
    },
    arrVal() {
      let val = []
      if (typeof this.value === 'string' && this.value) {
        val = this.value.split(this.separator)
      } else if (Array.isArray(this.value)) {
        val = this.value
      }
      return val
    },
    otherOption() {
      return (this.options || []).find(
        (opt) => opt.isOther || opt.label === '其他'
      )
    },
    otherInputVisible() {
      return this.arrVal.includes(this.otherOption?.value)
    }
  },
  watch: {
    otherInputVisible(v) {
      if (!v) {
        this.$emit('update:other', '')
      }
    }
  },
  methods: {
    handleChange(checkedValue) {
      const strVal = (checkedValue || []).join(this.separator)
      const outputVal = this.stringifyValue ? strVal : checkedValue
      this.$emit('input', outputVal)
      this.$emit('change', outputVal)
    },
    handleOtherChange(e) {
      this.$emit('update:other', e)
    }
  }
}
</script>

<style lang="scss" scoped>
.string-checkbox {
  >>> .ant-checkbox-group-item {
    line-height: 25px;
  }
}
.other-input {
  margin-left: 10px;
}
</style>
