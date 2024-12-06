<template>
  <div class="wrapper">
    <med-header title="签名" @backClick="onClickLeft" />
    <med-sign ref="esign" @signSubmit="signSubmit" :lineWidth="16" />
  </div>
</template>

<script>
import vueEsign from 'vue-esign'

export default {
  name: 'SignPad',
  components: { vueEsign },
  props: ['type'],
  data() {
    return {
      isCrop: true,
      lineWidth: 16,
      lineColor: '#000',
      bgColor: '#f2f4f5'
    }
  },
  methods: {
    onClickLeft() {
      this.$emit('back')
      this.handleClear()
    },
    async signSubmit(file) {
      console.log(file)
    },
    handleClear() {
      this.$refs.esign.clear()
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  background-color: #f2f4f5;
  width: 10rem;
  height: 100vh;
}
</style>
