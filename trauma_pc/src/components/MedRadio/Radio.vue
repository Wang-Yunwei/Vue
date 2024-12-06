<template>
  <div class="med-radio-wrapper">
    <el-radio-group
      :value="value"
      v-bind="$attrs"
      :class="{ readonly }"
      @input="onChange"
    >
      <template v-if="radioType === 'button'">
        <el-radio-button
          v-for="(item, index) in options"
          :key="item.key + index"
          :label="item.value"
        >
          {{ item.label }}
        </el-radio-button>
      </template>
      <template v-else>
        <el-radio
          v-for="item in options"
          :key="item.value"
          :border="border"
          :label="item.value"
        >
          {{ item.label }}
        </el-radio>
      </template>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  name: 'MedRadio',
  model: {
    prop: 'value',
    event: '_change'
  },
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    radioType: {
      type: String,
      default: 'radio'
    },
    options: {
      type: Array,
      default: () => []
    },
    border: {
      type: Boolean,
      default: false
    },
    deselect: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onChange(val) {
      this.$emit('_change', val)
      this.$emit('change', val)
    }
  }
}
</script>
<style lang="scss" scoped>
.med-radio-wrapper {
  ::v-deep .el-radio-group {
    line-height: 45px;
    .el-radio {
      & + .el-radio {
        margin-left: 0;
      }
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
