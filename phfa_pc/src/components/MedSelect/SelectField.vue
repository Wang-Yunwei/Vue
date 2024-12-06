<template>
  <div class="med-select-field-wrapper">
    <el-form-item :label="label" size="mini" :prop="formProp">
      <med-select
        v-model="value"
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

    }
  },
  computed: {
    placeholderValue() {
      if (this.placeholder && this.placeholder !== '') return this.placeholder
      return `请填写${this.label}`
    }
  },
  watch: {

  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>

</style>
