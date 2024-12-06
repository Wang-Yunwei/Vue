<template>
  <div class="med-checkbox-field-wrapper">
    <el-form-item :label="label" size="mini" :prop="formProp">
      <med-checkbox v-model="values" v-bind="$props" @_change="onChanged" />
    </el-form-item>
  </div>
</template>

<script>
import { MedCheckbox } from './Checkbox.vue'
export default {
  name: 'MedCheckboxField',
  components: {
    MedCheckbox
  },
  model: {
    prop: 'values',
    event: '_change'
  },
  props: {
    ...MedCheckbox.props,
    values: {
      type: [Array, String],
      default: () => []
    },
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

  },
  watch: {

  },
  methods: {
    onChanged(val) {
      this.$emit('_change', val)
    }
  }
}
</script>

<style lang="less" scoped>
.med-checkbox-field-wrapper {

}
</style>
