<template>
  <div class="modal flex-c-c" v-show="visible">
    <div class="modal-content txt-c">
      <div class="icon"></div>
      <div class="title">{{ title }}</div>
      <div class="text">{{ text }}</div>
    </div>
    <div class="countdown" v-if="duration">{{ duration }}</div>
  </div>
</template>

<script>
let countTimer;
export default {
  name: "Modal",
  data() {
    return {
      visible: false,
      title: "",
      text: "",
      duration: 0,
    };
  },
  methods: {
    show(arg = {}) {
      this.title = arg.title;
      this.text = arg.text;
      this.visible = true;
      if (arg.duration && typeof arg.duration === "number") {
        this.duration = arg.duration;
        this.countdown(this.duration);
      }
    },
    hide() {
      this.visible = false;
    },
    countdown(seconds) {
      clearTimeout(countTimer);
      countTimer = setTimeout(() => {
        this.duration -= 1;
        if (seconds - 1 > 0) {
          this.countdown(seconds - 1);
        } else {
          this.hide();
        }
      }, 1000);
    },
  },
  watch: {
    "$route.path": {
      handler() {
        clearTimeout(countTimer);
        this.duration = 0;
        this.hide();
      },
    },
  },
};
</script>

<style lang="less" scoped>
.modal {
  position: fixed;
  z-index: 1;
  top: calc(50% - 400px);
  width: calc(100% - 100px);
  height: 800px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(203, 4, 4, 0.5) 20%,
    rgba(203, 4, 4, 0.85),
    rgba(203, 4, 4, 0.6) 80%,
    transparent
  );
  font-size: 48px;
  line-height: 92px;
  text-shadow: 0px 2px 2px rgba(0, 2, 6, 0.36);
  .icon {
    display: inline-block;
    width: 160px;
    height: 160px;
    background-image: url(~@/assets/alert.png);
  }
  .text {
    font-size: 36px;
  }
  .countdown {
    color: #ff9900;
    position: absolute;
    right: 0;
    bottom: 30px;
  }
}
</style>
