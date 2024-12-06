<template>
  <div class="med-radio-field-wrapper">
    <el-form-item :label="label" size="mini" :prop="formProp">
      <med-radio v-model="value" v-bind="$props" />
    </el-form-item>
  </div>
</template>

<script>
import { MedRadio } from './Radio.vue'
export default {
  name: '',
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

  }
}
</script>

<style lang="less" scoped>
.med-radio-field-wrapper {

}
</style>
