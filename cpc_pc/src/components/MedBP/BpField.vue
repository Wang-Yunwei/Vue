<template>
  <div class="med-bp-field-wrapper">
    <el-form-item :label="label" size="mini" :prop="formProp" :rules="rules">
      <med-bp v-model="bpValue1" v-bind="$props" />
    </el-form-item>
  </div>
</template>

<script>
import MedBp from './Bp.vue'
export default {
  name: 'MedBpField',
  components: {
    MedBp
  },
  model: {
    prop: 'value',
    event: '_change'
  },
  props: {
    ...MedBp.props,
    value: {
      type: String,
      default: ''
    },
    formProp: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    }
  },
  computed: {
    bpValue1: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('_change', val)
      }
    }
  }
}
</script>
