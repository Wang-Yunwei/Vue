<template>
  <div class="rectangle">
    <slot />
    <div class="tag txt-c" v-if="showTag">{{ tagText }}</div>
  </div>
</template>

<script>
export default {
  name: "RoundedRectangle",
  props: {
    showTag: {
      type: Boolean,
      default: false,
    },
    tagText: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="less" scoped>
.rectangle {
  background: rgba(0, 153, 255, 0.2);
  border: 1px solid #015ca0;
  border-radius: 5px;
  padding: 28px 19px;
  position: relative;
  font-size: 20px;
  .tag {
    position: absolute;
    padding-left: 10px;
    font-weight: 100;
    letter-spacing: 1px;
    top: 12px;
    right: -8px;
    height: 32px;
    font-size: 18px;
    line-height: 30px;
    width: 145px;
    background-image: url(~@/assets/tag.png);
  }
}
</style>
