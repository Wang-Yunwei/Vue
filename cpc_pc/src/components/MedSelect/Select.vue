<template>
  <div class="med-select-wrapper">
    <el-select
      v-model="selectValue"
      size="mini"
      v-bind="$props"
    >
      <el-option
        v-for="item in selectOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script>
import Vue from 'vue'
import { Select, Option } from 'element-ui'
Vue.use(Select).use(Option)
export default {
  name: 'MedSelect',
  model: {
    prop: 'value',
    event: '_change'
  },
  props: {
    ...Select.props,
    selectOptions: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    selectValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('_change', val)
        this.$emit('change')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
</style>
