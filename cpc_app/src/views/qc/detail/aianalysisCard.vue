<template>
  <div :class="aianalysisCardClass">
    <div class="card">
      <div class="summary">
        <div @click="showDetail(model)">
          <div
            :class="
              isExpand ? 'van-cell-memo__hidden' : 'van-cell-memo__visable'
            "
          >
            <van-row class="title">
              <div>
                <span :class="numberClass">
                  {{ model.code + (model.isKeyIndex === "1" ? " * " : " ") }}
                </span>
              </div>
              <div>
                {{ model.shortTitle }}
              </div>
            </van-row>
            <div class="memo">
              <div>
                <van-row class="description">
                  <div class="description_standard">
                    <div>参考标准：{{ model.standardValue }}</div>
                  </div>
                </van-row>
                <van-row class="description">
                  <div v-if="model.yAxisType === '1'">
                    平均值：<span>{{ model.avgValue }}</span
                    >min
                  </div>
                </van-row>
              </div>
              <div class="description_expand" style="display:none">
                <span
@click.stop="showExpand"
                  >查看<van-icon
name="arrow-down"
                /></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isExpand" class="detail">
        <van-cell class="memo">
          <template #title>
            <div class="memo_content">
              <van-row class="memo_target">
                <van-col :span="22">
                  <span>考核对象：</span
                  ><span>{{ model.assessmentObject }}</span>
                </van-col>
                <van-col :span="2" @click="showDetail(model)">
                  <span style="color:blue;">详情</span>
                </van-col>
              </van-row>
              <van-row class="memo_state">
                <div>
                  <span>符合条件病历(例)：</span
                  ><span>{{ model.accordWithNum }}</span>
                </div>
                <div>
                  <span>占比：</span><span>{{ model.accordWithRate }}</span
                  ><span>%</span>
                </div>
                <div>
                  <span>总病历数：</span><span>{{ model.total }}</span
                  ><span>例</span>
                </div>
              </van-row>
              <van-row>时间未达标分析</van-row>
              <van-row class="memo_time_ng_reason">
                <div
                  v-for="(item, index) in model.analysisAbnormalList"
                  :key="index"
                >
                  <van-row class="title-row">
                    <div>
                      {{ item.desc
                      }}<span
@click="showOpinion(item.opinion)"
                        ><van-icon
name="info-o"
                      /></span>
                    </div>
                    <div>{{ item.num }}例</div>
                  </van-row>
                  <van-row class="progress-row">
                    <Progress
                      :percentage="item.ratio"
                      stroke-width="10"
                      color="#5e74fe"
                      pivot-color="#5e74fe"
                    />
                  </van-row>
                </div>
              </van-row>
            </div>
          </template>
        </van-cell>
      </div>
    </div>
  </div>
</template>

<script>
import { Progress } from 'vant'
export default {
  name: 'aianalysisCard',
  components: { Progress },
  props: {
    model: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isExpand: false
    }
  },
  mounted() {},
  // 钩子方法
  created() {
    //
  },
  computed: {
    numberClass() {
      let _class = 'result'
      if (this.model.isUpToStandard === '1') {
        _class += ' result-ok'
      } else {
        _class += ' result-ng'
      }
      return _class
    },
    aianalysisCardClass() {
      let _class = 'med-analysis-card-wrapper'
      if (this.model.isUpToStandard === '1') {
        _class += ' med-analysis-card-border-ok'
      } else {
        _class += ' med-analysis-card-border-ng'
      }
      return _class
    }
  },
  methods: {
    onLoad() {},
    showDetail(item) {
      this.$emit('showDetail', item)
    },
    showOpinion(message) {
      this.$toast(message)
    },
    showExpand() {
      if (this.isExpand) {
        this.isExpand = false
      } else {
        this.isExpand = true
      }
    }
  },
  watch: {}
}
</script>

<style lang="less" scoped>
.med-analysis-card-wrapper {
  width: 100%;
  -moz-box-shadow: 0px 3px 10px #a6a6a6;
  -webkit-box-shadow: 0px 3px 10px #a6a6a6;
  box-shadow: 0px 3px 10px #a6a6a6;
  display: inline-block;
  background-color: #fff;
  border-radius: 8px;
  border-top: 6px solid;
  padding: 16px 0;
  min-height: 160px;

  .card {
    height: 100%;
    display: flex;
    position: relative;
    flex-flow: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 0 32px;
    .van-row {
      width: 100%;
      .van-col {
        display: flex;
        justify-content: flex-start;
      }
    }
    .result {
      height: 60px;
      margin-top: -26px;
      margin-left: -32px;
      float: left;
      position: relative;
      width: 100%;
      border-radius: 4px 0 8px 0px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      padding-left: 4px;
      padding-bottom: 4px;
    }
  }
  /deep/ .summary {
    position: relative;
    width: 100%;
    .title {
      font-size: 32px;
      padding-top: 8px;
      line-height: 38px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      div:nth-of-type(1) {
        width: 120px;
        position: relative;
      }
      div:nth-of-type(2) {
        flex-grow: 1;
        margin-top: -6px;
      }
    }
    .memo {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
    }
    .description {
      display: flex;
      justify-content: space-between;
      font-size: 28px;
      .description_standard {
        flex: 1;
        display: flex;
        div:nth-of-type(1) {
          margin-right: 30px;
        }
      }
      .description_expand {
        min-width: 15%;
        color: #5e74fe;
        .van-icon {
          padding: 0 6px;
        }
      }
    }
  }
  .detail {
    .memo {
      background: #f2f4f5;
    }
    .memo_content {
      font-size: 28px;
      .memo_state {
        display: flex;
        justify-content: flex-start;
        div:nth-of-type(1) {
          margin-right: 25px;
        }
        div:nth-of-type(2) {
          margin-right: 25px;
        }
      }
      .memo_time_ng_reason {
        font-size: 24px;
        padding-left: 32px;
        .title-row {
          display: flex;
          padding-top: 10px;
          div:nth-of-type(1) {
            flex: 1;
            padding-right: 12px;
            span {
              padding-left: 5px;
            }
          }
          div:nth-of-type(2) {
            max-width: 120px;
            display: flex;
            align-items: flex-end;
          }
        }
        .progress-row {
          display: flex;
          align-items: center;
          height: 48px;
          width: 100%;
          .van-progress {
            width: 100%;
          }
        }
      }
    }
  }

  .result {
    display: flex;
    justify-content: center !important;
    align-items: center;
    align-self: stretch;
  }
  .result div {
    width: 28px;
    font-size: 24px;
  }
  .result-na {
    background-color: grey;
  }
  .result-ng {
    background-color: red;
  }
  .result-ok {
    background-color: green;
  }
}
.med-analysis-card-border-ok {
  border-top-color: green;
}
.med-analysis-card-border-ng {
  border-top-color: red;
}
</style>
