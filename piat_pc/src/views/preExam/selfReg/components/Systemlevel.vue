<template>
  <div class="sys-level-wrapper">
    <med-icon :type="'tag_level-' + level" :url="url" />
  </div>
</template>

<script>
export default {
  props: {
    level: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      url: require('@/assets/iconfonts/iconfont.js')
    }
  }
}
</script>

<style lang="less" scoped>
.sys-level {
  &-wrapper {
    position: absolute;
    right: 0;
    top: -10px;
    /deep/ .anticon {
      font-size: 60px;
    }
  }
}
</style>
