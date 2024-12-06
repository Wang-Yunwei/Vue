<template>
  <div class="med-checkbox-button-group">
    <van-checkbox-group v-bind.sync="$attrs" v-on="$listeners">
      <van-checkbox v-for="opt in options" :name="opt.value" :key="opt.value">
        {{ opt.label }}
      </van-checkbox>
    </van-checkbox-group>
  </div>
</template>

<script>
export default {
  name: 'MedCheckboxButtonGroup',
  props: {
    options: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="less" scoped>
.med-checkbox-button-group {
  /deep/ .van-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    margin-top: -0.2rem;
    .van-checkbox__label {
      border-radius: 0.4rem;
      border: 0.013333rem solid #ddd;
      padding: 0.04rem 0.25rem;
      font-weight: normal;
      font-size: 0.32rem;
    }
    .van-checkbox {
      margin-right: 0.2rem;
      margin-top: 0.2rem;
    }
    .van-checkbox__label {
      margin-left: 0;
      white-space: nowrap;
    }
    .van-checkbox__icon {
      display: none;

      &--checked + .van-checkbox__label {
        background-color: #d7dcff;
      }
    }
  }
}
</style>
