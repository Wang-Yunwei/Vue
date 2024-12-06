<template>
  <van-cell value="内容" class="med-switch">
    <template #title>
      <span style="font-size:0.48rem; font-weight:bold">{{ title }}</span>
    </template>
    <van-switch v-model="checked" size="0.6rem" active-color="#5e74fe" />
  </van-cell>
</template>

<script>
export default {
  name: '',
  props: {
    title: {
      type: String,
      default: ''
    },
    selectedValue: {
      type: String,
      default: ''
    }
  },
  model: {
    prop: 'selectedValue',
    event: '_change'
  },
  data() {
    return {
      checked: false
    }
  },
  mounted() {
    this.checked = this.selectedValue
  },
  computed: {},
  methods: {},
  watch: {
    checked(val) {
      if (val) {
        this.$emit('_change', '1')
        this.$emit('change', '1')
      } else {
        this.$emit('_change', '0')
        this.$emit('change', '0')
      }
    },
    selectedValue(val) {
      if (val === '1') {
        this.checked = true
      } else {
        this.checked = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.med-switch {
  .van-cell__title {
    display: flex;
    align-items: center;
  }

  .van-cell__value {
    display: flex;
    justify-content: right;
    align-items: center;
  }
}
</style>
