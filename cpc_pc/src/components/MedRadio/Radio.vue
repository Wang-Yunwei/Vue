<template>
  <div class="med-radio-wrapper">
    <el-radio-group
      v-model="selectValue"
      size="mini"
    >
      <div v-if="radioType === 'button'">
        <el-radio-button
          v-for="(item, index) in selectOptions"
          :key="item.label + index"
          :label="item.value"
          @click.native.prevent="onRadioClick(item.value)"
        >
          {{ item.label }}
        </el-radio-button>
      </div>
      <div v-else>
        <el-radio
          v-for="(item, index) in selectOptions"
          :key="item.label + index"
          :label="item.value"
          @click.native.prevent="onRadioClick(item.value)"
        >
          {{ item.label }}
        </el-radio>
      </div>
    </el-radio-group>
  </div>
</template>

<script>
import Vue from 'vue'
import { Radio, RadioGroup, RadioButton } from 'element-ui'
Vue.use(Radio).use(RadioGroup).use(RadioButton)
export default {
  name: 'MedRadio',
  model: {
    prop: 'value',
    event: '_change'
  },
  props: {
    ...RadioGroup.props,
    radioType: {
      type: String,
      default: 'button'
    },
    selectOptions: {
      type: Array,
      default: () => []
    },
    deselect: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectValue: this.value
    }
  },
  computed: {

  },
  watch: {
    value(val) {
      this.selectValue = val
    }
  },
  mounted() {
  },
  methods: {
    onRadioClick(e) {
      if (this.disabled || this.readonly) return
      let _value = e
      this.selectValue = e
      if (this.deselect && this.value === _value) {
        _value = ''
        this.selectValue = ''
      }
      this.$emit('_change', _value)
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss" scoped>
.med-radio-wrapper .el-radio-button:focus:not(.is-focus):not(:active):not(.is-disabled) {
  box-shadow: none;
}
</style>
