<template>
  <div class="med-checkbox-field-wrapper">
    <el-form-item :label="label" size="mini" :prop="formProp" :rules="rules">
      <med-checkbox v-model="selectValue" v-bind="$props" @click="input" />
    </el-form-item>
  </div>
</template>

<script>
import MedCheckbox from './Checkbox'
export default {
  name: 'MedCheckboxField',
  components: {
    MedCheckbox
  },
  props: {
    ...MedCheckbox.props,
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
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectValue: this.value
    }
  },
  computed: {

  },
  watch: {
    value: {
      handler(val) {
        this.selectValue = val
      },
      immediate: true
    }
  },
  methods: {
    input() {
      this.$emit('input', this.selectValue)
      this.$emit('change')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
