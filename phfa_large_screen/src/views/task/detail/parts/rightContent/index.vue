<template>
  <section>
    <time-line />
    <task-map />
  </section>
</template>

<script>
import TimeLine from "./TimeLine";
import TaskMap from "./TaskMap";

export default {
  name: "RightContent",
  components: {
    TimeLine,
    TaskMap,
  },
};
</script>

<style lang="less" scoped>
section {
  width: calc(100% - 393px);
}
</style>
