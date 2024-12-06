<template>
  <div
    class="wrapper"
    tabindex="-1"
    ref="wrapper"
    @keydown.right="switchPage(1)"
    @keyup.left="switchPage(-1)"
    @blur="focus"
  >
    <div :class="`tip${tipShow ? ' show' : ''}`" @click="tipShow = false">
      预览模式 , 可使用左右方向键切换页面 &nbsp; ✖
    </div>
    <global-header v-if="!$route.meta.hideTitle"></global-header>
    <div class="main">
      <router-view />
    </div>
  </div>
</template>

<script>
const pathList = ["/patients", "/task/list", "/task/detail", "/dispatching"];
export default {
  name: "BasicLayout",
  data() {
    return {
      tipShow: false,
    };
  },
  computed: {
    curIdx() {
      return pathList.findIndex((p) => p === this.$route.path);
    },
  },
  mounted() {
    this.focus();
    this.showTip();
  },
  methods: {
    showTip() {
      setTimeout(() => {
        this.tipShow = true;
        setTimeout(() => {
          this.tipShow = false;
        }, 5000);
      }, 1000);
    },
    focus() {
      if (this.$refs.wrapper) {
        this.$refs.wrapper.focus();
      }
    },
    switchPage(d) {
      let nextIdx = this.curIdx + d;
      if (nextIdx > pathList.length - 1) {
        nextIdx = 0;
      } else if (nextIdx < 0) {
        nextIdx = pathList.length - 1;
      }
      this.$router.push({
        path: pathList[nextIdx],
      });
    },
  },
};
</script>

<style lang="less" scoped>
.wrapper {
  min-height: 100%;
  background-color: rgb(12, 37, 65);
  background-image: url(~@/assets/bg-grid.png);
  position: relative;
  &:before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(
      farthest-corner at 50% 40px,
      rgba(0, 102, 255, 0.68),
      transparent 50%
    );
    pointer-events: none;
  }
  .main {
    padding: 0 20px 20px;
    position: relative;
  }
}
.tip {
  text-align: center;
  padding: 12px;
  background-color: rgb(255, 102, 0);
  position: absolute;
  width: 50%;
  left: 25%;
  font-size: 16px;
  border-radius: 5px;
  top: -60px;
  z-index: 9;
  transition: all 0.5s;
  &.show {
    top: -5px;
  }
}
</style>
