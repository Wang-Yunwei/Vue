<template>
  <div class="med-text-field-wrapper">
    <el-form-item :label="label" size="mini" :prop="formProp">
      <med-text
        v-model="textValue"
        type="number"
        :placeholder="placeholderValue"
        v-bind="$props"
      />
    </el-form-item>
  </div>
</template>

<script>
import MedText from './Text.vue'
export default {
  name: 'MedNumberField',
  components: {
    MedText
  },
  model: {
    prop: 'value',
    event: '_change'
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
      textValue: this.value
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
      this.textValue = val
    }
  },
  mounted() {
  },
  methods: {
    onInputChanged() {
      this.$emit('_change', this.textValue)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
