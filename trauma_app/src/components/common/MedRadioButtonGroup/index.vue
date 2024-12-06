<template>
  <van-radio-group class="med-radio-button-group" :direction="direction" :value="value" @input="handleChange"
    v-bind="$attrs">
    <van-radio :class="`med-radio ${item.value === value ? 'med-radio-checked' : ''}`" v-for="item in dataSource"
      :key="item.value" :name="item.value">{{ item.label || item.text }}</van-radio>
  </van-radio-group>
</template>

<script>
export default {
  name: 'MedRadioButtonGroup',
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
      type: [String, Number],
      default: ''
    },
    input: {
      type: Function,
      default: () => { }
    }
  },
  methods: {
    handleChange(v) {
      this.$emit('input', v)
    }
  }
}
</script>

<style lang="less" scoped>
.med-radio-button-group {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: flex-start;

  .med-radio {
    flex: 0 0 auto;
    margin: 0.14rem 0.17rem 0.14rem 0;
    padding: 5px 0.2rem;
    border-radius: 0.4rem;
    border: 1px solid #ddd;
    display: block;
    max-width: 100%;

    /deep/ .van-radio__icon {
      display: none;
    }

    /deep/ .van-radio__label {
      margin-left: 0;
      font-size: 0.34rem;
    }

    &-checked {
      background-color: rgb(43, 101, 248);

      /deep/ .van-radio__label {
        color: white;
      }
    }
  }
}
</style>
