<template>
  <div class="basic-info">
    <p>TI评估 : {{ findResult("ti") }}</p>
    <p>GCS评估 : {{ findResult("gcs") }}</p>
    <p>胸痛评估 : {{ findResult("chestPain") }}</p>
    <p>Killip评估 : {{ findResult("killip") }}</p>
    <p>FAST评估 : {{ findResult("fast") }}</p>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  mounted() {},
  computed: {
    ...mapGetters(["curMissionDetail", "dicMap"]),
    pageData() {
      const { estimateList } = this.curMissionDetail;
      return estimateList || [];
    },
  },
  methods: {
    findResult(type) {
      return (
        this.pageData.find((el) => el.name === type)?.description || "未评估"
      );
    },
  },
};
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
