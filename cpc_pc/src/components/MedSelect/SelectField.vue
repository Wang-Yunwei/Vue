<template>
  <div class="med-select-field-wrapper">
    <el-form-item :label="label" size="mini" :prop="formProp" :rules="rules">
      <med-select
        v-model="selectedValue"
        :placeholder="placeholderValue"
        v-bind="$props"
      />
    </el-form-item>
  </div>
</template>

<script>
import MedSelect from './Select.vue'
export default {
  name: 'MedSelectField',
  components: {
    MedSelect
  },
  model: {
    prop: 'value',
    event: '_change'
  },
  props: {
    ...MedSelect.props,
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
    }
  },
  computed: {
    selectedValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('_change', val)
        this.$emit('change')
      }
    },
    placeholderValue() {
      if (this.placeholder && this.placeholder !== '') return this.placeholder
      return `请填写${this.label}`
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
