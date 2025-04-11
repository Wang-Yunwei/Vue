<template>
  <div class="med-radio-field-wrapper">
    <el-form-item :label="label" size="mini" :prop="formProp" :rules="rules">
      <med-radio v-model="selectValue" v-bind="$props" @click="input" />
      <template slot="label">
        <slot name="label" />
      </template>
    </el-form-item>
  </div>
</template>

<script>
import MedRadio from './Radio.vue'
export default {
  name: 'MedRadioField',
  components: {
    MedRadio
  },
  props: {
    ...MedRadio.props,
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

  data() {
    return {
      selectValue: this.value
    }
  },
  computed: {},
  watch: {
    value(val) {
      this.selectValue = val
    }
  },
  mounted() {},
  methods: {
    input() {
      this.$emit('input', this.selectValue)
      this.$emit('change')
    }
  }
}
</script>

<style lang="scss" scoped>
.med-radio-field-wrapper {
  ::v-deep .el-form-item__content {
    margin-top: -2px;
  }
}
</style>
