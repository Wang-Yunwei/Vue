<template>
  <div class="statistic flex-c-c">
    <div class="statistic-title flex-c-c">
      <gradient-text>{{ title }}</gradient-text>
    </div>
    <div class="statistic-number flex-c-c">{{ number }}</div>
  </div>
</template>

<script>
export default {
  name: "Statistic",
  props: {
    title: {
      type: String,
      default: "",
    },
    number: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style lang="less" scoped>
.statistic {
  height: 101px;
  background: rgba(59, 81, 105, 0.2);
  border: 2px solid rgba(126, 181, 255, 0.6);
  box-shadow: 0px 0px 24px 0px rgba(103, 168, 255, 0.35) inset,
    0px 0px 2px 1px #315994 inset;
  &-title {
    padding: 0 50px;
    font-size: 21px;
  }
  &-number {
    font-weight: bold;
    color: #f48e50;
    font-size: 38px;
    height: calc(100% - 2px);
    margin: 1px 2px;
    padding: 0 60px;
    background: rgba(7, 19, 43, 0.3);
    border-radius: 4px;
    box-shadow: 0px 1px 0px 0px rgba(59, 81, 105, 0.4),
      0px 1px 2px 0px #06152c inset;
  }
  + .statistic {
    margin-left: 20px;
  }
}
</style>
