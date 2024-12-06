<template>
  <section>
    <task-map />
  </section>
</template>

<script>
import TaskMap from "./TaskMap";

export default {
  name: "RightContent",
  components: {
    TaskMap,
  },
};
</script>

<style lang="less" scoped>
section {
  width: calc(100% - 393px);
}
</style>
