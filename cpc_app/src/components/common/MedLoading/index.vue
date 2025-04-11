<template>
  <van-overlay :show="value" @click="onClick" z-index="99">
    <div class="loading-wrapper">
      <div class="block">
        <van-loading color="#1989fa" size="1.5rem" />
      </div>
    </div>
  </van-overlay>
</template>

<script>
export default {
  name: '',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: this.value
    }
  },
  computed: {},
  methods: {
    onClick() {
      // this[types.SET_LOADING](false)
      // the checking is mdsd............................................................
      // console.log('onClick', this.show)
      // this.show = false
      // this.$emit('input', false)
    }
  },
  watch: {
    // value: function (val) {
    //   console.log('value', val)
    //   this.show = val
    // }
  }
}
</script>

<style lang="less" scoped>
.loading-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
