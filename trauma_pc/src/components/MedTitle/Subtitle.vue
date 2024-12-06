<template>
  <div class="med-subtitle-wrapper">
    <!-- <i class="el-icon-tickets" /> -->
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
    return {}
  },
  mounted() {}
}
</script>
<style lang="scss" scoped>
.med-subtitle-wrapper {
  border-left: 4px solid #1890ff;
  display: flex;
  align-items: center;
  // background: #444fdb;
  // border-radius: 3px;
  font-size: 18px;
  font-weight: 600;
  padding: 0 6px;
  line-height: 1.2;
  color: rgb(30, 50, 81);
  margin: 20px 0 24px 0;
  // i {
  //   font-size: 20px;
  //   margin:0 5px;
  // }
}
</style>
