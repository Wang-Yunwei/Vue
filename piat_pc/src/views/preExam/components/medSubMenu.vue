<template>
  <div class="med-s-submenu">
    <p :class="{ active: current === 'selfReg' }" @click="goReg">
      个人登记
    </p>
    <p :class="{ active: current === 'groupEvents' }" @click="goGroup">
      群体事件
    </p>
  </div>
</template>

<script>
export default {
  name: 'MedSubMenu',
  props: {
    current: {
      type: String,
      required: true
    }
  },
  methods: {
    goReg() {
      this.$emit('change', 'selfReg')
      this.$router.push('/preExam/selfReg')
    },
    goGroup() {
      this.$emit('change', 'groupEvents')
      this.$router.push('/preExam/groupEvents')
    }
  }
}
</script>

<style lang="less" scoped>
.med-s-submenu {
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
