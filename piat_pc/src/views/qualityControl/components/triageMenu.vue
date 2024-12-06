<template>
  <div class="med-triagemenu">
    <p :class="{ active: current === 'triageQualityControl' }" @click="goQC">
      分诊质控
    </p>
    <p :class="{ active: current === 'triageStatistics' }" @click="goSTA">
      分诊统计
    </p>
  </div>
</template>

<script>
export default {
  name: 'TriageMenu',
  props: {
    current: {
      type: String,
      required: true
    }
  },
  methods: {
    goQC() {
      this.$emit('change', 'triageQualityControl')
      this.$router.push('/qualityControl/triageQualityControl')
    },
    goSTA() {
      this.$emit('change', 'triageStatistics')
      this.$router.push('/qualityControl/triageStatistics')
    }
  }
}
</script>

<style lang="less" scoped>
.med-triagemenu {
  margin-top: -10px;
  margin-left: -10px;
  margin-right: -10px;
  margin-bottom: 10px;
  background: #5e74fe;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  z-index: 1;
  p {
    margin: 0;
    width: 140px;
    text-align: center;
    color: #fff;
    cursor: pointer;
    line-height: 30px;
    &.active {
      background: @primary-color;
    }
  }
}
</style>
