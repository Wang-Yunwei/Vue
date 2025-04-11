<template>
  <div>
    <van-cell-group title="心外科会诊"> </van-cell-group>
  </div>
</template>

<script>
export default {
  name: 'CSMdt',
  components: {},
  props: {
    data: {
      required: true,
      type: Object
    },
    disabled: {
      required: false,
      type: Boolean
    }
  },
  data() {
    return {
      active: 0,
      registId: 0,
      minDate: new Date(2020, 0, 10),
      maxDate: new Date(2025, 10, 1)
    }
  },
  computed: {},
  created() {},
  methods: {}
}
</script>

<style lang="less" scoped></style>
