<template>
  <med-view-container :title="title" @return="onBack">
    <div class="med-ai-analysis-wrapper">
      <router-view />
    </div>
  </med-view-container>
</template>

<script>
import { GoodsAction, GoodsActionButton, Dialog } from 'vant'
import { dicConstant } from '@/constant/commonConstant'
import { mapGetters, mapMutations } from 'vuex'
import * as types from '@/store/mutations/mutations-types'
import state from '@store/state/state'
import moment from 'moment'
export default {
  // 胸痛档案
  name: 'qcDetail',
  components: { GoodsAction, GoodsActionButton },
  data() {
    return {
      title: this.$route.query.title
    }
  },
  mounted() {
    // this.getPatients()
    // this.getPatientsTrend()
    // this.getPatientsTrendNum()
    this.$backhelper.push(() => {
      this.onBack()
      this.$backhelper.pop()
    })
  },
  // 钩子方法
  created() {},
  computed: {
    ...mapGetters(['hospitalArea', 'curHospitalArea', 'appName', 'configure']),
    curHospitalAreaName() {
      const matched = this.hospitalArea.find(
        el => el.value === this.curHospitalArea
      )
      return matched?.label
    }
  },
  methods: {
    ...mapMutations([types.SET_CURHOSPITALAREA]),
    onBack() {
      this.$router.go(-1)
      // this.$router.push({
      //   path: '/qc/index',
      //   query: {
      //     type: '2',
      //     buttonType: this.$route.query.buttonType,
      //     startTime: this.$route.query.startTime,
      //     endTime: this.$route.query.endTime
      //   }
      // })
    }
  },
  watch: {}
}
</script>

<style lang="less" scoped>
@import '@/views/index.less';
.med-ai-analysis-wrapper {
  .scroll-view {
    background: #f2f4f5;
    .chart-title {
      margin-top: 12px;
      background: #fff;
    }
  }
  .condition {
    background: #fff;
    padding: 16px 16px 8px 16px;
  }

  .background {
    height: 20px;
    z-index: 2;
    background-color: #333bd2;
  }
  .scroll-view {
    height: calc(100vh - 460px);
    overflow-y: auto;
  }
  /deep/ .van-tabs {
    // 搜索图标
    .van-button {
      margin: 0 20px 0 240px;
      .van-icon {
        font-size: 50px;
      }
    }
  }
  .van-col {
    text-align: center;
  }
  .van-cell .van-cell__title {
    min-width: 85%;
  }
  .van-cell .van-cell__value {
    color: red !important;
  }
}
</style>
