<template>
  <div class="med-subtitle-wrapper">
    <i class="el-icon-edit" />
    <span>{{ title }}</span>
    <slot />
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    }
  },
  mounted() {

  }
}
</script>
<style lang="less" scoped>
  .med-subtitle-wrapper {
    font-size: 16px;
    font-weight: 600;
    padding-top: 16px;
    line-height:20px;

    i {
      margin-right:5px;
    }
  }
</style>
