<template>
  <div class="gradient-text-wrapper">
    <span
      class="gradient-text"
      :style="{
        backgroundImage: `linear-gradient(${
          rotation + 'deg'
        }, ${startColor}, ${endColor})`,
      }"
    >
      <slot></slot>
    </span>
    <span v-if="shadow" class="text-shadow">{{ text() }}</span>
  </div>
</template>

<script>
// 渐变色字
export default {
  name: "gradientText",
  props: {
    startColor: {
      type: String,
      default: "#fff",
    },
    endColor: {
      type: String,
      default: "rgb(129, 207, 255)",
    },
    rotation: {
      type: String,
      default: "180",
    },
    shadow: {
      type: Boolean,
      default: true,
    },
  },
  methods:{
    text() {
      return this.$slots.default?.[0]?.text;
    }
  }
};
</script>

<style lang="less" scoped>
.gradient-text-wrapper {
  position: relative;
  display: inline-block;
  .gradient-text {
    position: relative;
    left: 0;
    z-index: 1;
    color: transparent;
    background-clip: text;
    -webkit-background-clip: text;
    display: inline-block;
  }
  .text-shadow {
    position: absolute;
    left: 0;
    color: transparent;
    text-shadow: 0.06em  0.1em  0.1em rgba(0,20,60,0.5);
  }
}
</style>
