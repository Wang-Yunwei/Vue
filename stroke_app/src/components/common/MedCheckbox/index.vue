<template>
  <div class="med-checkbox-wrapper">
    <van-checkbox-group
      class="med-checkbox-group"
      :direction="direction"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <van-checkbox
        class="med-checkbox"
        v-for="item in options"
        :key="item.value"
        :name="item.value"
      >
        {{ item.label }}
      </van-checkbox>
    </van-checkbox-group>
  </div>
</template>

<script>
export default {
  props: {
    direction: {
      type: String,
      default: 'horizontal'
    },
    options: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="less" scoped>
.med-checkbox-wrapper {
  overflow: hidden;
  .med-checkbox-group {
    margin-left: -16px;
    /deep/ .van-checkbox {
      margin: 0;
      .van-checkbox__icon {
        display: none;
      }

      .van-checkbox__label {
        margin-bottom: 20px;
        font-size: 0.34rem;
        line-height: 40px;
        border-radius: 0.4rem;
        padding: 0.1rem 0.34rem;
        background-color: rgb(239, 241, 255);
      }

      .van-checkbox__icon--checked + .van-checkbox__label {
        background-color: #444fdb;
        border-color: #444fdb;
        color: #fff;
      }
    }
  }
}
</style>
