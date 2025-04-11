<template>
  <div class="med-select-field-wrapper">
    <el-form-item :label="label" size="mini" :prop="formProp">
      <med-select
        v-model="selectedValue"
        :placeholder="placeholderValue"
        v-bind="$props"
        @change="onSelectChanged"
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
    }
  },
  data() {
    return {
      selectedValue: ''
    }
  },
  computed: {
    placeholderValue() {
      if (this.placeholder && this.placeholder !== '') return this.placeholder
      return `请填写${this.label}`
    }
  },
  watch: {
    value(val) {
      this.selectedValue = val
    }
  },
  mounted() {

  },
  methods: {
    onSelectChanged() {
      this.$emit('_change', this.selectedValue)
      this.$emit('change')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
