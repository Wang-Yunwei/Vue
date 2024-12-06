<template>
  <div class="past-history">
    <el-select
      v-model="privateVal"
      multiple
      filterable
      allow-create
      default-first-option
      :placeholder="placeholder"
      :size="size"
      :readonly="readonly"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script>
// 既往史控件
export default {
  name: 'PastHistory',
  props: {
    value: {
      // 逗号分隔
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入或选择'
    },
    size: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      privateVal: []
    }
  },
  watch: {
    value(v) {
      if (v && this.privateVal.join() !== v) {
        this.privateVal = v.split(',')
      }
    },
    privateVal(nVal, oVal) {
      const newValue = nVal.find((v) => !oVal.includes(v))
      if (newValue) {
        if (
          ['无', '不详'].includes(newValue) ||
          oVal.some((v) => ['无', '不详'].includes(v))
        ) {
          this.privateVal = [newValue]
        }
      }
      this.$emit('input', this.privateVal.join())
    }
  }
}
</script>

<style lang="scss" scoped></style>
