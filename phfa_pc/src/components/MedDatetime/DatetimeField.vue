<template>
  <div class="med-datetime-field-wrapper">
    <el-form-item :label="label" size="mini" :prop="formProp">
      <med-datetime
        v-model="value"
        :placeholder="placeholderValue"
        v-bind="$props"
      />
    </el-form-item>
  </div>
</template>

<script>
import { MedDatetime } from './Datetime.vue'
export default {
  name: 'MedDatetimeField',
  components: {
    MedDatetime
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
