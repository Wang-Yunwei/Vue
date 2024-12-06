<template>
  <div class="med-text-field-wrapper">
    <el-form-item :label="label" size="mini" :prop="formProp">
      <med-text
        v-model="value"
        type="tel"
        :placeholder="placeholderValue"
        v-bind="$props"
      />
    </el-form-item>
  </div>
</template>

<script>
import { MedText } from './Text.vue'
export default {
  name: '',
  components: {
    MedText
  },
  props: {
    ...MedText.props,
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

<style lang="less" scoped>

</style>
