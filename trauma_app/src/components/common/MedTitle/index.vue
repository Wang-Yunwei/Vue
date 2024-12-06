<template>
  <div class="med-title-wrapper">
    <van-cell v-bind="$props" class="med-title">
      <template #icon>
        <span class="solid" />
      </template>
      <template #title>
        <span class="title">{{ title }}</span>
      </template>
      <template #right-icon>
        <span class="right">
          <slot name="right" />
        </span>
      </template>
    </van-cell>
  </div>
</template>

<script>
import T from 'vant/es/cell/index'

export default {
  name: 'med-title',
  inheritAttrs: false,
  props: {
    ...T.props
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {},
  computed: {},
  watch: {}
}
</script>

<style lang="less" scoped>
.med-title-wrapper {
  .solid {
    display: inline-block;
    width: 12px;
    height: 24px;
    background: linear-gradient(180deg, rgba(255, 255, 255), #5e74fe);
    margin: auto 10px;
    border-radius: 6px;
  }
  .van-cell {
    padding-left: 10px;
    padding-right: 10px;
    /deep/ .van-cell__title {
      max-width: none;
    }
  }
  .med-title {
    display: flex;
    align-items: center;
    .title {
      display: flex;
      font-size: 36px;
      font-weight: bold;
      height: 100%;
      align-items: center;
    }

    .right {
      display: flex;
      font-size: 28px;
      margin-right: 32px;
      height: 100%;
      color: #5e74fe;
      align-items: center;
    }
  }
  .med-title::before {
    position: absolute;
    box-sizing: border-box;
    content: " ";
    pointer-events: none;
    left: 0.42667rem;
    bottom: 0;
    right: 0.42667rem;
    border-bottom: 4px solid #5e74fe;
    -webkit-transform: scaleY(0.5);
    -ms-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
}
</style>
