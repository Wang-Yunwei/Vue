<template>
  <div class="med-ecg-field-wrapper">
    <el-form-item :label="label" size="mini" :prop="formProp">
      <med-text
        v-model="value"
        :placeholder="placeholderValue"
        v-bind="$props"
      />
    </el-form-item>
  </div>
</template>

<script>
import MedText from '../MedText/Text.vue'
export default {
  name: 'MedEcgField',
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

<style lang="scss" scoped>

</style>
