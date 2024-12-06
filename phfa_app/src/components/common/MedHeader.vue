<template>
  <div class="med-header-wrapper">
    <van-nav-bar
      :title="title"
      :left-text="leftText"
      :right-text="rightText"
      :left-arrow="leftArrow"
      :fixed="fixed"
      @click-left="onClickLeft"
      @click-right="onClickRight"
    >
      <template #right>
        <slot name="right"></slot>
      </template>
      <template #left>
        <slot name="left"></slot>
      </template>
    </van-nav-bar>
  </div>
</template>

<script>
export default {
  name: 'HeadTitle',
  data() {
    return {
      isShare: 1
    }
  },
  props: {
    title: {
      required: false,
      type: String,
      default: ''
    },
    rightText: {
      required: false,
      type: String,
      default: ''
    },
    leftText: {
      required: false,
      type: String,
      default: '返回'
    },
    leftArrow: {
      required: false,
      type: Boolean,
      default: true
    },
    fixed: {
      required: false,
      type: Boolean,
      default: true
    }
  },
  methods: {
    onClickLeft() {
      this.$emit('backClick')
    },
    onClickRight() {
      this.$emit('editClick')
    }
  }
}
</script>

<style lang="less">
.med-header-wrapper {
  height: 150px;
  .van-nav-bar {
    max-height: 152px;
    background: #444fdb;
    color: #fff;
    &.van-hairline--bottom::after {
      border-bottom: none;
      border-bottom-width: 0;
      display: none;
    }
    .van-icon-arrow-left,
    .van-nav-bar__text {
      font-size: 36px;
      color: #fff;
    }
    .van-nav-bar__title {
      font-size: 36px;
      color: #fff;
    }
    .van-nav-bar__content {
      font-size: 36px;
      height: 150px;
    }
  }
}
</style>
