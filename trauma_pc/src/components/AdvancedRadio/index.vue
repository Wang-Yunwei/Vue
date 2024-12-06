<template>
  <div class="string-radio">
    <el-radio-group
      v-bind.sync="$attrs"
      :value="value"
      :options="opts"
      @input="handleChange"
    >
      <el-radio v-for="opt in opts" :key="opt.value" :label="opt.value">{{
        opt.label
      }}</el-radio>
      <template v-if="otherInputVisible">
        <el-input
          class="other-input"
          :value="other"
          v-bind="otherAttrs"
          @input="handleOtherChange"
        />
      </template>
    </el-radio-group>
  </div>
</template>

<script>
// AdvancedRadio
// 带有"其他"字段,选择"其他"时需填写"其他"内容
export default {
  name: 'AdvancedRadio',
  props: {
    value: {
      // 值,字符串格式
      type: String,
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
    otherOption() {
      return (this.options || []).find(
        (opt) => opt.isOther || opt.label === '其他'
      )
    },
    otherInputVisible() {
      return this.value === this.otherOption?.value
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
      this.$emit('input', checkedValue)
      this.$emit('change', checkedValue)
    },
    handleOtherChange(e) {
      this.$emit('update:other', e)
    }
  }
}
</script>

<style lang="scss" scoped>
.string-radio {
  >>> .ant-radio-group-item {
    line-height: 25px;
  }
}
.other-input {
  margin-left: 10px;
}
</style>
