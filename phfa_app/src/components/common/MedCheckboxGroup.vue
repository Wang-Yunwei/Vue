<template>
  <van-checkbox-group
    class="med-checkbox-group"
    :direction="direction"
    :value="transedValue"
    @input="handleChange"
  >
    <van-checkbox
      v-for="item in dataSource"
      :class="
        `med-checkbox ${
          transedValue && transedValue.includes(item.value)
            ? 'med-checkbox-checked'
            : ''
        }`
      "
      :key="item.value"
      :name="item.value"
      >{{ item.label }}</van-checkbox
    >
  </van-checkbox-group>
</template>

<script>
export default {
  name: 'MedCheckboxGroup',
  props: {
    dataSource: {
      type: Array,
      default: () => []
    },
    direction: {
      type: String,
      default: 'horizontal'
    },
    checkedColor: {
      type: String,
      default: '#d7dcff'
    },
    value: {
      type: [Array, String],
      default: () => []
    },
    input: {
      type: Function,
      default: () => {}
    },
    stringValue: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    transedValue() {
      if (this.stringValue) {
        const str = this.value || ''
        return str ? str.split(',') : undefined
      }
      return this.value || []
    }
  },
  methods: {
    handleChange(v) {
      let newValue = v
      if (this.stringValue) {
        newValue = (v || []).join(',') || ''
      }
      this.$emit('input', newValue)
    }
  }
}
</script>

<style lang="less" scoped>
.med-checkbox-group {
  // padding: 0 0.3rem 0 0.3rem;
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-between;
  .med-checkbox {
    flex: 1 1 25%;
    margin: 0.14rem;
    font-size: 0.34rem;
    padding: 0.06rem 0.34rem;
    border-radius: 0.4rem;
    // overflow: hidden;
    // text-overflow: ellipsis;
    min-width: 3rem;
    max-width: 100%;
    display: block;
    /deep/ .van-checkbox__icon {
      display: none;
    }
    /deep/ .van-checkbox__label {
      // white-space: nowrap;
      color: #5e74fe;
      margin-left: 0;
    }
    &-checked {
      background-color: #d7dcff;
    }
  }
}
</style>
