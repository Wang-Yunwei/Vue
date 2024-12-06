<template>
  <div class="med-text-field-wrapper">
    <el-form-item :label="label" size="mini" :prop="formProp">
      <div class="med-text-field-wrapper-item">
        <med-text
          v-model="textValue"
          :placeholder="placeholderValue"
          v-bind="$props"
          @change="onInputChanged"
        >
          <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope" />
          </template>
        </med-text>

        <slot name="formitem" />
      </div>
    </el-form-item>
  </div>
</template>

<script>
import MedText from './Text.vue'
export default {
  name: 'MedTextField',
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
      this.$emit('change')
    }
  }
}
</script>

<style lang="scss" scoped>
.med-text-field-wrapper-item {
  display: flex;
}
</style>
