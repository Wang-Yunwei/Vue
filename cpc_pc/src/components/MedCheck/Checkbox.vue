<template>
  <div :class="['med-checkbox-wrapper', options.length === 1 ? 'no-sibling' : '']">
    <el-checkbox-group
      v-model="selectValues"
      size="mini"
      @change="onCheckBoxClick($event, this)"
    >
      <div v-if="checkType === 'button'">
        <el-checkbox-button
          v-for="(item, index) in options"
          :key="item.value + index"
          :label="item.value"
          @change="itemChanged"
        >
          {{ item.label }}
        </el-checkbox-button>
      </div>
      <div v-else>
        <el-checkbox
          v-for="(item, index) in options"
          :key="item.value + index"
          :label="item.value"
          @change="itemChanged"
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
    checkType: {
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
    },
    forbidden: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectValues: [],
      isSelected: false,
      clickedValue: ''
    }
  },
  computed: {
    options() {
      if (this.forbidden.length === 0) return this.selectOptions
      const tempOptioins = this.selectOptions.filter(s => {
        return this.forbidden.indexOf(s.value) < 0
      })

      return tempOptioins
    }
  },
  watch: {
    values: {
      handler(val) {
        this.buildSelectValues(val)
      },
      immediate: true
    },
    options: {
      handler() {
        setTimeout(() => {
          this.$forceUpdate()
        }, 100)
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
      if (this.disabled || this.readonly) {
        if (this.isSelected) {
          this.selectValues.pop()
        } else {
          this.selectValues.push(this.clickedValue)
        }
      }
      if (this.deselect) {
        // 处理取消选择
      }
      this.$emit('_change', this.selectValues)
      this.$emit('click', e)
    },
    itemChanged(e, t) {
      this.isSelected = e
      this.clickedValue = t.target._value
    }
  }
}
</script>

<style lang="scss" scoped>
.med-checkbox-wrapper {
  ::v-deep {
    .el-checkbox-button:focus:not(.is-focus):not(:active):not(.is-disabled) {
      box-shadow: none;
    }

    .el-checkbox-button.is-focus {
      .el-checkbox-button__inner {
      border-color: #DCDFE6;
      }
    }
  }
}

.no-sibling {
  ::v-deep .el-checkbox-button:last-child .el-checkbox-button__inner {
    border-radius: 4px;
  }
}
</style>
