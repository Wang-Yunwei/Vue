<template>
  <div class="med-qc-index-wrapper">
    <van-tabs v-model="active" sticky color="#fff" @change="changeTab">
      <van-tab title="数据概述" name="1">
        <summary-index />
      </van-tab>
      <van-tab title="智能分析" name="2">
        <aianalysis-index />
      </van-tab>
      <van-tab title="质控指标" name="3" v-if="isCertifiedHospital">
        <key-index />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { GoodsAction, GoodsActionButton, Dialog } from 'vant'
import { dicConstant } from '@/constant/commonConstant'
import { mapGetters, mapMutations } from 'vuex'
import * as types from '@/store/mutations/mutations-types'
import state from '@store/state/state'
import summaryIndex from './summary'
import keyIndex from './keyIndex'
import aianalysisIndex from './aianalysis'
export default {
  // 胸痛档案
  name: 'qc',
  components: {
    GoodsAction,
    GoodsActionButton,
    summaryIndex,
    keyIndex,
    aianalysisIndex
  },
  data() {
    return {
      active: '1'
    }
  },
  mounted() {
    const type = this.$route.query.type
    if (type) {
      this.active = type
    }
  },
  // 钩子方法
  created() {},
  computed: {
    ...mapGetters([
      'hospitalArea',
      'curHospitalArea',
      'appName',
      'hospitalCertifiedStatus'
    ]),
    curHospitalAreaName() {
      const matched = this.hospitalArea.find(
        el => el.value === this.curHospitalArea
      )
      return matched?.label
    },
    isCertifiedHospital() {
      return this.hospitalCertifiedStatus === '3'
    }
  },
  methods: {
    ...mapMutations([types.SET_CURHOSPITALAREA]),
    changeTab() {}
  },
  watch: {}
}
</script>

<style lang="less" scoped>
.med-qc-index-wrapper {
  /deep/ .van-tabs__nav {
    background-color: #333bd2;
  }

  /deep/ .van-tab--active {
    color: #fff;
  }
  /deep/ .van-tab__text {
    color: #fff;
  }
}
</style>
