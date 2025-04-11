<template>
  <div class="med-datetime-field-wrapper">
    <el-form-item :label="label" size="mini" :prop="formProp" :rules="rules">
      <med-datetime
        v-model="datetime"
        :placeholder="placeholderValue"
        v-bind="$props"
        @change="onTimeChanged"
      />
    </el-form-item>
  </div>
</template>

<script>
import MedDatetime from './Datetime'
export default {
  name: 'MedDatetimeField',
  components: {
    MedDatetime
  },
  model: {
    prop: 'value',
    event: '_change'
  },
  props: {
    ...MedDatetime.props,
    label: {
      type: String,
      default: ''
    },
    formProp: {
      type: String,
      default: ''
    },
    value: {
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
      datetime: this.value
    }
  },
  computed: {
    placeholderValue() {
      if (this.placeholder && this.placeholder !== '') return this.placeholder
      return `请填写${this.label}`
    }
  },
  watch: {
    value: {
      handler(val) {
        this.datetime = val
      },
      immediate: true
    }
  },
  mounted() {

  },
  methods: {
    onTimeChanged(val) {
      this.$emit('_change', val)
      this.$emit('change', val)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
