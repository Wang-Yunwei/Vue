<template>
  <div class="med-analysis-detail-wrapper">
    <div class="scroll-view">
      <van-cell class="van-cell__table">
        <template #title>
          <table cellspacing="0" style="width:100%">
            <tr>
              <th>医院名称</th>
              <th>转诊患者数(人)</th>
              <th>STEMI患者再灌注策略数</th>
            </tr>
            <tr v-for="(item, index) in dataNetHospital" :key="index">
              <td>{{ item.name }}</td>
              <td>{{ item.total }}</td>
              <td>{{ item.stemiNum }}</td>
            </tr>
          </table>
        </template>
      </van-cell>
    </div>
  </div>
</template>

<script>
import { dicConstant } from '@/constant/commonConstant'
import { mapGetters, mapMutations } from 'vuex'
import * as types from '@/store/mutations/mutations-types'
import state from '@store/state/state'
import moment from 'moment'
export default {
  name: 'aianalysisDetail',
  props: {
    dataNetHospital: {
      type: Array,
      default: () => []
    }
  },
  components: {},
  data() {
    return {}
  },
  mounted() {},
  // 钩子方法
  created() {},
  computed: {},
  methods: {},
  watch: {}
}
</script>

<style lang="less" scoped>
@import "@/views/index.less";
.med-analysis-detail-wrapper {
  .scroll-view {
    overflow-y: auto;
    .chart-title {
      margin-top: 12px;
      background: #fff;
    }
  }
  .condition {
    background: #fff;
    .condition_date {
      display: flex;
      align-items: center;
    }
    /deep/ .van-cell {
      padding: 0;
      .van-icon {
        font-size: 28px;
      }
      input {
        text-align: center;
      }
    }
    .condition_seperator {
      padding: 0 12px;
    }
  }
  .card {
    width: 95%;
    position: relative;
    background: #ffffff;
    border-radius: 15px;
    margin: 16px auto;
    display: flex;
    flex-flow: column;
    align-content: center;
    align-items: stretch;
  }
  .title-card {
    font-size: 28px;
    color: #fff;
    background-color: #5e74fe;
    div {
      padding: 16px 32px;
    }
  }
  .chart-card {
    padding: 24px 0px;
    -moz-box-shadow: 0px 3px 15px #a6a6a6;
    -webkit-box-shadow: 0px 3px 15px #a6a6a6;
    box-shadow: 0px 3px 15px #a6a6a6;
  }
  .van-cell__table {
    color: rgba(0, 0, 0, 0.87);

    /deep/ .van-cell__value {
      flex: 0;
    }
    /deep/ .van-cell__title {
      width: 100%;
      max-width: none;
      margin-right: 0;
    }
    tr {
      box-sizing: border-box;
      // pointer-events: none;
      right: 0.426667rem;
      left: 0.426667rem;
      border-bottom: 0.026667rem solid #ebedf0;
    }
    th,
    td {
      // height: 48px;
      // background: #333bd2;
      padding: 22px 0;
      text-align: center;
    }
    tr:nth-child(2n-1) {
      // background-color: rgb(175, 217, 241);
    }
    tr:nth-child(2n) {
      // background-color: rgb(204, 235, 192);
    }
  }
  .van-cell__tableDetail {
    color: rgba(0, 0, 0, 0.87);

    /deep/ .van-cell__value {
      flex: 0;
    }
    /deep/ .van-cell__title {
      width: 100%;
      max-width: none;
      margin-right: 0;
    }
    tr {
      box-sizing: border-box;
      // pointer-events: none;
      right: 0.426667rem;
      left: 0.426667rem;
      border-bottom: 0.026667rem solid #ebedf0;
    }
    th,
    td {
      // height: 48px;
      // background: #333bd2;
      font-size: 22px;
      padding: 22px 0;
      text-align: center;
    }
    tr:nth-child(2n-1) {
      // background-color: rgb(175, 217, 241);
    }
    tr:nth-child(2n) {
      // background-color: rgb(204, 235, 192);
    }
  }
}
</style>
