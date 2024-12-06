<template>
  <header>
    <div class="left">
      <img src="~@/assets/logo.png" alt="logo" />
    </div>
    <div class="txt-c">
      <h1><gradient-text>{{title}}</gradient-text></h1>
    </div>
    <div class="right txt-r">
      <div class="time txt-l">{{ now }}</div>
    </div>
  </header>
</template>

<script>
export default {
  name: "GlobalHeader",
  props: {
    title: {
      type: String,
      default: "急救公告大屏",
    },
  },
  data() {
    return {
      now: "",
    };
  },
  mounted() {
    this.refreshTime();
  },
  methods: {
    refreshTime() {
      setTimeout(() => {
        this.now = this.$moment().format("YYYY-MM-DD dddd HH:mm:ss");
        this.refreshTime();
      }, 1000);
    },
  },
};
</script>

<style lang="less" scoped>
header {
  padding: 8px 20px 0 20px;
  display: flex;
  height: 100px;
  background: url(~@/assets/bg-title.png) no-repeat center;
  h1 {
    font-size: 48px;
    margin: 0;
  }
  .left,
  .right {
    flex: 20%;
  }
  .right {
    .time {
      width: 326px;
      white-space: nowrap;
      display: inline-block;
      font-size: 26px;
      font-weight: 100;
    }
  }
}
</style>
