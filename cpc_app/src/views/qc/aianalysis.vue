<template>
  <div class="med-ai-analysis-wrapper">
    <div class="condition">
      <van-row gutter="24">
        <van-col span="6">
          <van-button
            round
            :type="buttonMonth"
            size="small"
            @click="onchange(1)"
          >
            近3月
          </van-button>
        </van-col>
        <van-col span="6">
          <van-button
            round
            :type="buttonSixMonth"
            size="small"
            @click="onchange(2)"
          >
            近6月
          </van-button>
        </van-col>
        <van-col span="6">
          <van-button
            round
            :type="buttonYear"
            size="small"
            @click="onchange(3)"
          >
            近1年
          </van-button>
        </van-col>
        <van-col span="6">
          <van-button
            round
            :type="buttonCustom"
            size="small"
            @click="showSearch"
          >
            自定义
          </van-button>
        </van-col>
      </van-row>
      <van-row gutter="24" class="condition-date">
        <!-- v-if="searchVisible" -->
        <van-col span="11">
          <med-date-picker
            v-model="query.startTime"
            label=""
            placeholder="开始时间"
            min-date="2021-01-01"
            max-date="2050-12-31"
            formatter="YYYY-MM-DD"
            :clearable="false"
            :disabled="buttonType != 4"
            @confirm="onchange(4)"
          />
        </van-col>
        <van-col span="2">
          <div>到</div>
        </van-col>
        <van-col span="11">
          <med-date-picker
            v-model="query.endTime"
            label=""
            placeholder="结束时间"
            min-date="2021-01-01"
            max-date="2050-12-31"
            formatter="YYYY-MM-DD"
            :clearable="false"
            :disabled="buttonType != 4"
            @confirm="onchange(4)"
          />
        </van-col>
      </van-row>
    </div>
    <div :class="className">
      <med-title title="整体意见">
        <template #right>
          <van-button
            round
            type="primary"
            size="small"
            @click="toList"
            v-if="false"
            >指标详情</van-button
          >
        </template>
      </med-title>
      <van-cell-group>
        <van-cell
          v-for="(item, index) in opinions"
          :title="index + 1 + '. ' + item"
          :key="'opinions' + index"
        />
        <!-- v-show="showOpinionsMore" -->
        <div
          v-for="(item, index) in opinionsMore"
          :key="'opinionsMore' + index"
        >
          <van-cell :title="index + 4 + '. ' + item" />
        </div>
        <!-- v-if="showOpinionsMoreButton" -->
        <div class="more" v-if="false" @click="expandOpinions">
          全部详情
          <van-icon
            v-if="showOpinionsMore === false"
            name="arrow-down"
          ></van-icon>
          <van-icon v-if="showOpinionsMore" name="arrow-up"></van-icon>
        </div>
      </van-cell-group>
      <med-title title="填报异常" style="margin-top: 5px;" v-if="false" />
      <van-cell-group v-if="false">
        <van-cell
          v-for="(item, index) in abnormalReportings"
          :key="'abnormalReportings' + index"
          :value="item.num + '例'"
          :title="item.desc"
        />
        <!-- is-link -->
        <van-cell
          v-show="showAbnormalReportingsMore"
          v-for="(item, index) in abnormalReportingsMore"
          :key="'abnormalReportingsMore' + index"
          :value="item.num + '例'"
          :title="item.desc"
        />
        <div
          class="more"
          v-if="showAbnormalReportingsButton"
          @click="expandAbnormalReportings"
        >
          全部异常
          <van-icon
            v-if="showAbnormalReportingsMore === false"
            name="arrow-down"
          ></van-icon>
          <van-icon
            v-if="showAbnormalReportingsMore"
            name="arrow-up"
          ></van-icon>
        </div>
      </van-cell-group>
      <med-title title="指标未达标项" style="margin-top: 5px;" v-if="false">
        <template #right>
          <span>{{ notUpToStandardsNum }} 项</span>
        </template>
      </med-title>
      <van-cell-group v-if="false">
        <van-cell
          v-for="(item, index) in notUpToStandards"
          :key="'notUpToStandards' + index"
          :title="item.code + '* ' + item.shortTitle"
        />
        <van-cell
          v-show="showNotUpToStandardsMore"
          v-for="(item, index) in notUpToStandardsMore"
          :key="'notUpToStandardsMore' + index"
          :title="item.code + '* ' + item.shortTitle"
        />
        <div
          class="more"
          v-if="showNotUpToStandardsButton"
          @click="expandNotUpToStandards"
        >
          全部未达标项
          <van-icon
            v-if="showNotUpToStandardsMore === false"
            name="arrow-down"
          ></van-icon>
          <van-icon v-if="showNotUpToStandardsMore" name="arrow-up"></van-icon>
        </div>
      </van-cell-group>
      <med-title title="其他问题" style="margin-top: 5px;" v-if="false" />
      <van-cell-group v-if="false">
        <van-cell
          v-for="(item, index) in otherProblems"
          :key="'otherProblems' + index"
          :value="item.num + '例'"
          :title="index + 1 + '. ' + item.desc"
        />
        <van-cell
          v-show="showOtherProblemsMore"
          v-for="(item, index) in otherProblemsMore"
          :key="'otherProblemsMore' + index"
          :value="item.num + '例'"
          :title="index + 4 + '. ' + item.desc"
        />
        <div
          class="more"
          v-if="showOtherProblemsButton"
          @click="expandOtherProblems"
        >
          全部未达标项
          <van-icon
            v-if="showOtherProblemsMore === false"
            name="arrow-down"
          ></van-icon>
          <van-icon v-if="showOtherProblemsMore" name="arrow-up"></van-icon>
        </div>
      </van-cell-group>
    </div>
    <div class="op-container">
      <van-button type="primary" @click="toList">查看所有认证指标</van-button>
    </div>
    <med-loading v-model="showLoading" />
  </div>
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
  name: 'qc',
  components: { GoodsAction, GoodsActionButton },
  data() {
    return {
      buttonMonth: 'default',
      buttonSixMonth: 'primary',
      buttonYear: 'default',
      buttonCustom: 'default',
      abnormalReportings: [],
      abnormalReportingsMore: [],
      showAbnormalReportingsMore: false,
      showAbnormalReportingsButton: false,
      notUpToStandards: [],
      notUpToStandardsMore: [],
      showNotUpToStandardsMore: false,
      showNotUpToStandardsButton: false,
      opinions: [],
      opinionsMore: [],
      showOpinionsMore: false,
      showOpinionsMoreButton: false,
      otherProblems: [],
      otherProblemsMore: [],
      showOtherProblemsMore: false,
      showOtherProblemsButton: false,
      notUpToStandardsNum: 0,
      active: '1',
      showLoading: false,
      searchVisible: false,
      query: {
        startTime: moment(new Date())
          .add(-5, 'months')
          .format('YYYY-MM-DD'),
        endTime: moment(new Date()).format('YYYY-MM-DD')
      },
      buttonType: 2
    }
  },
  mounted() {
    // this.getIntelligentAnalysis()
    this.buttonType = this.$route.query.buttonType
    this.query.startTime = this.$route.query.startTime
    this.query.endTime = this.$route.query.endTime
    if (!this.buttonType) {
      this.buttonType = 2
    }
    this.onchange(parseInt(this.buttonType))
  },
  // 钩子方法
  created() {
    console.log(this.configure.dockingWay)
  },
  computed: {
    ...mapGetters(['hospitalArea', 'curHospitalArea', 'appName', 'configure']),
    curHospitalAreaName() {
      const matched = this.hospitalArea.find(
        el => el.value === this.curHospitalArea
      )
      return matched?.label
    },
    className() {
      if (this.searchVisible) {
        return 'scroll-viewShow'
      } else {
        return 'scroll-view'
      }
    }
  },
  methods: {
    ...mapMutations([types.SET_CURHOSPITALAREA]),
    setButtonType(type) {
      this.buttonType = type
      if (type === 1) {
        this.buttonMonth = 'primary'
        this.buttonSixMonth = 'default'
        this.buttonYear = 'default'
        this.buttonCustom = 'default'
      } else if (type === 2) {
        this.buttonMonth = 'default'
        this.buttonSixMonth = 'primary'
        this.buttonYear = 'default'
        this.buttonCustom = 'default'
      } else if (type === 3) {
        this.buttonMonth = 'default'
        this.buttonSixMonth = 'default'
        this.buttonYear = 'primary'
        this.buttonCustom = 'default'
      } else if (type === 4) {
        this.buttonMonth = 'default'
        this.buttonSixMonth = 'default'
        this.buttonYear = 'default'
        this.buttonCustom = 'primary'
      }
    },
    onchange(type) {
      this.setButtonType(type)
      if (type === 1) {
        this.searchVisible = false
        this.query.endTime = moment(new Date()).format('YYYY-MM-DD')
        this.query.startTime = moment(this.query.endTime)
          .add(-2, 'months')
          .format('YYYY-MM-01')
      } else if (type === 2) {
        this.searchVisible = false
        this.query.endTime = moment(new Date()).format('YYYY-MM-DD')
        this.query.startTime = moment(this.query.endTime)
          .add(-5, 'months')
          .format('YYYY-MM-01')
      } else if (type === 3) {
        this.searchVisible = false
        this.query.endTime = moment(new Date()).format('YYYY-MM-DD')
        this.query.startTime = moment(this.query.endTime)
          .add(-11, 'months')
          .format('YYYY-MM-01')
      } else if (type === 4) {
        this.showSearch()
      }
      this.getIntelligentAnalysis()
    },
    showSearch() {
      this.setButtonType(4)
      if (this.searchVisible === false) {
        this.searchVisible = true
      } else {
        this.searchVisible = false
      }
    },
    getIntelligentAnalysis() {
      this.abnormalReportings = []
      this.abnormalReportingsMore = []
      this.notUpToStandards = []
      this.notUpToStandardsMore = []
      this.opinions = []
      this.opinionsMore = []
      this.otherProblems = []
      this.otherProblemsMore = []
      this.showLoading = true
      this.$api.service.getIntelligentAnalysis(this.query).then(res => {
        if (res.status === 200) {
          // this.abnormalReportings = res.result.abnormalReportings
          if (res.result.abnormalReportings != null) {
            if (res.result.abnormalReportings.length > 3) {
              this.showAbnormalReportingsButton = true
            }
            for (var i = 0; i < res.result.abnormalReportings.length; i++) {
              if (i > 2) {
                this.abnormalReportingsMore.push(
                  res.result.abnormalReportings[i]
                )
              } else {
                this.abnormalReportings.push(res.result.abnormalReportings[i])
              }
            }
          }

          // this.notUpToStandards = res.result.notUpToStandards

          if (res.result.notUpToStandards != null) {
            if (res.result.notUpToStandards.length > 3) {
              this.showNotUpToStandardsButton = true
            }
            for (var j = 0; j < res.result.notUpToStandards.length; j++) {
              if (j > 2) {
                this.notUpToStandardsMore.push(res.result.notUpToStandards[j])
              } else {
                this.notUpToStandards.push(res.result.notUpToStandards[j])
              }
            }
          }

          if (res.result.opinions != null) {
            if (res.result.opinions.length > 3) {
              this.showOpinionsMoreButton = true
            }
            for (var n = 0; n < res.result.opinions.length; n++) {
              if (n > 2) {
                this.opinionsMore.push(res.result.opinions[n])
              } else {
                this.opinions.push(res.result.opinions[n])
              }
            }
          }
          // this.opinions = res.result.opinions
          // this.otherProblems = res.result.otherProblems

          if (res.result.otherProblems != null) {
            if (res.result.otherProblems.length > 3) {
              this.showOtherProblemsButton = true
            }
            for (var m = 0; m < res.result.otherProblems.length; m++) {
              if (m > 2) {
                this.otherProblemsMore.push(res.result.otherProblems[m])
              } else {
                this.otherProblems.push(res.result.otherProblems[m])
              }
            }
          }
          if (this.notUpToStandards != null) {
            this.notUpToStandardsNum =
              this.notUpToStandards.length + this.notUpToStandardsMore.length
          }
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
        // 避免误触滚动事件
        this.showLoading = false
      })
    },
    toList() {
      this.$router.push({
        path: '/qc/detail/aianalysisList',
        query: {
          startTime: this.query.startTime,
          endTime: this.query.endTime,
          title: '智能分析',
          buttonType: this.buttonType
        }
      })
    },
    expandOpinions() {
      if (this.showOpinionsMore) {
        this.showOpinionsMore = false
      } else {
        this.showOpinionsMore = true
      }
    },
    expandAbnormalReportings() {
      if (this.showAbnormalReportingsMore) {
        this.showAbnormalReportingsMore = false
      } else {
        this.showAbnormalReportingsMore = true
      }
    },
    expandNotUpToStandards() {
      if (this.showNotUpToStandardsMore) {
        this.showNotUpToStandardsMore = false
      } else {
        this.showNotUpToStandardsMore = true
      }
    },
    expandOtherProblems() {
      if (this.showOtherProblemsMore) {
        this.showOtherProblemsMore = false
      } else {
        this.showOtherProblemsMore = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "@/views/index.less";
.med-ai-analysis-wrapper {
  .scroll-view {
    background: #f2f4f5;
    .chart-title {
      margin-top: 12px;
      background: #fff;

      span:nth-of-type(3) {
        display: block;
        color: #5e74fe;
        font-size: 32px;
        line-height: 36px;
        height: 36px;
        margin-right: 20px;
        float: right;
      }
    }
  }
  .condition {
    background: #fff;
    padding: 16px;
    .van-button {
      width: 100%;
    }
  }
  .condition-date {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /deep/ .van-field__control {
      text-align: center;
    }
  }

  .background {
    height: 20px;
    z-index: 2;
    background-color: #333bd2;
  }
  .scroll-view {
    height: calc(100vh - 692px);
    overflow-y: auto;
  }
  .scroll-viewShow {
    height: calc(100vh - 692px);
    overflow-y: auto;
  }

  .op-container {
    position: relative;
    width: 100%;
    display: flex;
    background-color: #f3f3f3;
    align-items: center;
    justify-content: center;
    height: 160px;
    .van-button {
      width: 90%;
      height: 75%;
    }
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
  .van-cell {
    .van-cell__title {
      max-width: none;
    }
    .van-cell__value {
      color: red !important;
      min-width: 15%;
      flex: 0;
      padding-right: 8px;
      text-align: right;
    }
  }
  .van-hairline--top-bottom::after {
    border-width: 0;
  }
  .more {
    display: flex;
    font-size: 24px;
    padding: 16px 12px;
    justify-content: center;
    align-items: center;
    .van-icon {
      margin-left: 10px;
    }
  }
}
</style>
