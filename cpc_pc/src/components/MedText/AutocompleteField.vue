<template>
  <div class="med-text-field-wrapper">
    <el-form-item :label="label" size="mini" :prop="formProp" :rules="rules">
      <div class="med-text-field-wrapper-item">
        <el-autocomplete
          v-model="acValue"
          v-bind="$props"
          :fetch-suggestions="querySearch"
          :placeholder="placeholderValue"
          style="width: 100%;"
        />
        <slot name="formitem" />
      </div>
    </el-form-item>
  </div>
</template>

<script>
import { Autocomplete } from 'element-ui'
export default {
  name: 'MedAutocompleteField',
  components: {
  },
  props: {
    ...Autocomplete.props,
    label: {
      type: String,
      default: ''
    },
    formProp: {
      type: String,
      default: ''
    },
    rules: {
      type: Array,
      default: () => []
    },
    suggestion: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  data() {
    return {
    }
  },
  computed: {
    acValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    placeholderValue() {
      if (this.placeholder && this.placeholder !== '') return this.placeholder
      return `请填写${this.label}`
    }
  },
  methods: {
    querySearch(queryString, cb) {
      var list = this.suggestion
      var results = queryString ? list.filter(this.createFilter(queryString)) : list
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (item) => {
        return (item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.med-text-field-wrapper-item {
  display: flex;
}
</style>
