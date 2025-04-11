<template>
  <div class="med-ai-analysis-wrapper">
    <div>
      <med-subtitle title="整体意见" />
      <!-- <med-title title="整体意见">
        <template #right>
          <span @click="toList">指标详情</span>
        </template>
      </med-title> -->
      <el-row v-for="(item, index) in opinions" :key="'opinions' +index" :gutter="20">
        <el-col :span="24">{{ (index+1) +'.' + ' ' + item }}</el-col>
      </el-row>

      <med-subtitle title="填报异常" style="margin-top: 5px;" />
      <el-row v-for="(item, index) in abnormalReportings" :key="'abnormalReportings' + index" :gutter="20">
        <el-col :span="18">{{ (index+1) +'.' + ' ' + item.desc }}</el-col>
        <el-col :span="6">{{ item.num }}例</el-col>
      </el-row>
      <med-subtitle title="指标未达标项" style="margin-top: 5px;" />
      <!-- <med-title title="" style="margin-top: 5px;">
        <template #right>
          <span>{{ notUpToStandardsNum }} 项</span>
        </template>
      </med-title> -->
      <el-row v-for="(item, index) in notUpToStandards" :key="'notUpToStandards' +index" :gutter="20">
        <el-col :span="24">{{ (index+1) +'. ' + item.code +'* ' + item.shortTitle }}</el-col>
      </el-row>
      <!-- <div class="more">
          全部未达标项 <van-icon name="arrow-down" />
        </div> -->
      <med-subtitle title="其他问题" style="margin-top: 5px;" />
      <el-row v-for="(item, index) in otherProblems" :key="'otherProblems' +index" :gutter="20">
        <el-col :span="18">{{ (index+1) +'.' + ' ' + item.desc }}</el-col>
        <el-col :span="6">{{ item.num }}例</el-col>
      </el-row>

      <!-- <div class="more">
          全部未达标项 <van-icon name="arrow-down" />
        </div> -->
    </div>
  </div>
</template>

<script>

export default {
  // 胸痛档案
  name: 'Aianalysis',
  components: {},
  props: {
    opinions: {
      type: Array,
      require: true,
      default: () => []
    },
    abnormalReportings: {
      type: Array,
      require: true,
      default: () => []
    },
    notUpToStandards: {
      type: Array,
      require: true,
      default: () => []
    },
    otherProblems: {
      type: Array,
      require: true,
      default: () => []
    }

  },
  data() {
    return {
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
  },
  // 钩子方法
  created() {
  },

  methods: {
  }
}
</script>

<style lang="scss" scoped>
// .med-ai-analysis-wrapper {
//   .scroll-view {
//     background: #f2f4f5;
//     .chart-title {
//       margin-top: 12px;
//       background: #fff;

//       span:nth-of-type(3) {
//         display: block;
//         color: #5e74fe;
//         font-size: 32px;
//         line-height: 36px;
//         height: 36px;
//         margin-right: 20px;
//         float: right;
//       }
//     }
//   }
//   .condition {
//     background: #fff;
//     padding: 16px;
//     .van-button {
//       width: 100%;
//     }
//   }

//   .background {
//     height: 20px;
//     z-index: 2;
//     background-color: #333bd2;
//   }
//   .scroll-view {
//     height: calc(100vh - 442px);
//     overflow-y: auto;
//   }
//   .scroll-viewShow {
//     height: calc(100vh - 560px);
//     overflow-y: auto;
//   }

//   /deep/ .van-tabs {
//     // 搜索图标
//     .van-button {
//       margin: 0 20px 0 240px;
//       .van-icon {
//         font-size: 50px;
//       }
//     }
//   }
//   .van-col {
//     text-align: center;
//   }
//   .van-cell {
//     .van-cell__title {
//       max-width: none;
//     }
//     .van-cell__value {
//       color: red !important;
//       min-width: 12%;
//       flex: 0;
//     }
//   }
//   .van-hairline--top-bottom::after {
//     border-width: 0;
//   }
//   .more {
//     display: flex;
//     font-size: 24px;
//     padding: 16px 12px;
//     justify-content: center;
//     align-items: center;
//     .van-icon {
//       margin-left: 10px;
//     }
//   }
// }
</style>
