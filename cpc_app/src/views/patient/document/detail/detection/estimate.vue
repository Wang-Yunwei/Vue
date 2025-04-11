<template>
  <div>
    <van-cell-group title="胸痛评估"> </van-cell-group>
  </div>
</template>

<script>
import { dicConstant } from '../../../../../constant/commonConstant'

export default {
  name: 'Estimate',
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
      codeList: [dicConstant.yesOrNoCode, dicConstant.remoteEcgtranWayCode]
    }
  },
  computed: {},
  created() {},
  methods: {}
}
</script>

<style lang="less" scoped></style>
