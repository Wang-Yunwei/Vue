<template>
  <div class="marquee" v-marquee>
    <div class="marquee-inner">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  directives: {
    marquee: {
      inserted(el) {
        if (el.scrollHeight > el.offsetHeight) {
          el.setAttribute("class", el.getAttribute("class") + " run");
        }
      },
    },
  },
};
</script>

<style lang="less" scoped>
@keyframes marquee {
  0% {
    top: 0;
    transform: translateY(0);
  }
  80% {
    top: 100%;
    transform: translateY(-100%);
  }
  100% {
    top: 100%;
    transform: translateY(-100%);
  }
}
.marquee {
  height: 100%;
  width: 100%;
  max-height: 100%;
  overflow: hidden;
  position: relative;
  .marquee-inner {
    min-height: 100%;
    position: absolute;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &.run .marquee-inner {
    animation: marquee 3s linear infinite;
  }
}
</style>
