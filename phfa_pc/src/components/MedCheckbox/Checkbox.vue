<template>
  <div class="med-checkbox-wrapper">
    <el-checkbox-group
      v-model="selectValues"
      v-bind="$attrs"
      :class="{ readonly }"
    >
      <template v-if="radioType === 'button'">
        <el-checkbox-button
          v-for="item in options"
          :key="item.value"
          :label="item.value"
        >
          <slot name="label" v-bind="item">{{ item.label }}</slot>
        </el-checkbox-button>
      </template>
      <template v-else>
        <el-checkbox
          v-for="item in options"
          :key="item.value"
          :border="border"
          :label="item.value"
        >
          <slot name="label" v-bind="item">{{ item.label }}</slot>
        </el-checkbox>
      </template>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  name: 'MedCheckbox',
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    radioType: {
      type: String,
      default: 'checkbox'
    },
    options: {
      type: Array,
      default: () => []
    },
    value: {
      type: [Array, String],
      default: ''
    },
    border: {
      type: Boolean,
      default: false
    },
    stringifyValue: {
      // stringifyValue为true时, 值会格式化成逗号分隔的字符串
      type: Boolean,
      default: false
    }
  },
  computed: {
    selectValues: {
      get() {
        const arr = this.value || []
        let selectValues = []
        if (typeof arr === 'string') {
          selectValues = arr.split(',')
        } else {
          selectValues = arr || []
        }
        return selectValues
      },
      set(v) {
        let newValue = v
        if (this.stringifyValue && Array.isArray(v)) {
          // stringifyValue为true时, 值会格式化成逗号分隔的字符串
          newValue = newValue.join()
        }
        this.$emit('input', newValue)
        this.$emit('change', newValue)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.med-checkbox-wrapper {
  ::v-deep .el-checkbox-group {
    line-height: 45px;
    .el-checkbox + .el-checkbox {
      margin-left: 0;
    }
  }
}
.readonly {
  pointer-events: none;
  ::v-deep * {
    pointer-events: none;
  }
}
</style>
