<template>
  <div class="med-checkbox-wrapper">
    <el-checkbox-group
      v-model="selectValues"
      v-bind="$props"
      @change="onCheckBoxClick"
    >
      <div v-if="displayType === 'button'">
        <el-checkbox-button
          v-for="(item, index) in selectOptions"
          :key="item.value + index"
          :label="item.value"
          :disabled="disabled"
        >
          {{ item.label }}
        </el-checkbox-button>
      </div>
      <div v-else>
        <el-checkbox
          v-for="(item, index) in selectOptions"
          :key="item.value + index"
          :label="item.value"
          :disabled="disabled"
        >
          {{ item.label }}
        </el-checkbox>
      </div>
    </el-checkbox-group>
  </div>
</template>

<script>
import Vue from 'vue'
import { Checkbox, CheckboxButton, CheckboxGroup } from 'element-ui'
Vue.use(Checkbox).use(CheckboxButton).use(CheckboxGroup)
export default {
  name: 'MedCheckbox',
  model: {
    prop: 'values',
    event: '_change'
  },
  props: {
    ...CheckboxGroup.props,
    displayType: {
      type: String,
      default: 'button'
    },
    selectOptions: {
      type: Array,
      default: () => []
    },
    values: {
      type: [Array, String],
      default: () => []
    },
    deselect: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectValues: []
    }
  },
  computed: {

  },
  watch: {
    values: {
      handler(val) {
        this.buildSelectValues(val)
      },
      immediate: true
    }
  },
  mounted() {
    // if (!this.values) return
    // this.buildSelectValues(this.values)
    // this.$forceUpdate()
  },
  methods: {
    buildSelectValues(val) {
      let _values = []
      if (val && typeof (val) === 'string') {
        _values = val.split(',')
      } else if (val && val instanceof Array) {
        _values = val
      }
      this.selectValues = []
      _values.forEach(m => {
        this.selectValues.push(m)
      })
    },
    onCheckBoxClick(e) {
      if (this.disabled || this.readonly) return
      if (this.deselect) {
        // 处理取消选择
      }
      this.$emit('_change', this.selectValues)
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss">
.med-checkbox-wrapper .el-checkbox-button:focus:not(.is-focus):not(:active):not(.is-disabled) {
  box-shadow: none;
}

.med-checkbox-wrapper .el-checkbox-button.is-focus {
  .el-checkbox-button__inner {
  border-color: #DCDFE6;
  }
}
</style>
