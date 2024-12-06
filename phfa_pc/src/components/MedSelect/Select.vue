<template>
  <div class="med-select-wrapper">
    <el-select
      v-model="selectValue"
      :class="{ readonly }"
      v-bind="$attrs"
      :default-first-option="defaultFirstOption"
      @change="onSelectChanged"
    >
      <template v-for="item in privateOptions">
        <!-- 处理分组的情况 -->
        <el-option-group
          v-if="item.options && !item.value"
          :key="item.label"
          :label="item.label"
        >
          <el-option
            v-for="ele in item.options"
            :key="ele.value"
            :label="ele.label"
            :value="ele.value"
          />
        </el-option-group>

        <!-- 处理不分组的情况 -->
        <el-option
          v-else
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </template>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'MedSelect',
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
      type: [String, Number],
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    },
    defaultFirstOption: {
      type: Boolean,
      default: true
    },
    showOptionAll: {
      // 在选项第一个显示"全部"选项
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
    privateOptions() {
      const optionAll = this.showOptionAll
        ? [
          {
            label: '全部',
            value: void 0
          }
        ]
        : []
      return optionAll.concat(this.options)
    }
  },
  watch: {
    value(val) {
      this.selectValue = val
    }
  },
  mounted() {
    this.selectValue = this.value
    this.$forceUpdate()
  },
  methods: {
    onSelectChanged(v) {
      this.$emit('_change', this.selectValue)
      this.$emit('change', this.selectValue)
      let selectedOpt
      this.privateOptions.forEach((ele) => {
        if (ele.options) {
          // 存在分组
          const matched = ele.options.find((o) => o.value === this.selectValue)
          if (matched) {
            selectedOpt = matched
          }
        } else if (ele.value === this.selectValue) {
          // 无分组
          selectedOpt = ele
        }
      })
      this.$emit('select', selectedOpt)
    }
  }
}
</script>

<style lang="scss" scoped>
.med-select-wrapper {
  ::v-deep .el-select {
    vertical-align: top;
  }
}
.readonly {
  pointer-events: none;
  ::v-deep * {
    pointer-events: none;
  }
}
</style>
