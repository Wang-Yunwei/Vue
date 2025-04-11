<template>
  <div class="med-summary-card-wrapper">
    <div class="card-content">
      <van-row class="total">
        <van-col span="12">
          累计填报量(例)
        </van-col>
        <van-col span="12">
          {{ summary.total }}
        </van-col>
      </van-row>
      <van-row>
        <van-divider />
      </van-row>
      <van-row class="step">
        <van-col span="8">
          <van-row>
            {{ summary.new ? summary.new : "--" }}
          </van-row>
          <van-row>
            昨日新增病例
          </van-row>
        </van-col>
        <van-col span="8">
          <van-row>
            {{ summary.week ? summary.week : "--" }}
          </van-row>
          <van-row>
            本周填报量
          </van-row>
        </van-col>
        <van-col span="8">
          <van-row>
            {{ summary.month ? summary.month : "--" }}
          </van-row>
          <van-row>
            本月填报量
          </van-row>
        </van-col>
      </van-row>
      <!-- <div class="flex-c-b">
        <div class="title">
          <div class="name">{{ data.name }}</div>
          <div :class="genderClass(data.gender)"></div>
          <div class="age">{{ data.age }}岁</div>
          <div class="badge">{{ diagDesc }}</div>
          <div class="badge comingType">
            {{ comeTypeDesc }}
          </div>
        </div>
        <div class="flex-c-b" @click.stop="">

        </div>
      </div>
      <div class="flex-c-b">
        <div class="bottomLeft">
          <p v-if="data.outpatientNo || !data.inpatientNo">
            门诊号:{{ data.outpatientNo }}
          </p>
          <p v-if="data.inpatientNo">住院号:{{ data.inpatientNo }}</p>
        </div>
        <div class="bottomRight">
          <slot name="bottomRight">
            <div v-if="data.diseaseTime" class="time">
              <i class="iconfont iconicon1-41"></i>
              发病 {{ diseaseTime }}
            </div>
            <div v-if="data.arriveTime" class="time">
              <i class="iconfont iconicon1-41"></i>
              到院 {{ arriveTime }}
            </div>
          </slot>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    summary: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {},
  watch: {}
}
</script>

<style lang="less" scoped>
.med-summary-card-wrapper {
  position: relative;
  z-index: 2;
  background-color: #333bd2;
  height: 110px;
  .card-content {
    width: 90%;
    margin: 0 auto;
    height: 220px;
    position: relative;
    top: 20px;
    background: #ffffff;
    border-radius: 15px;
    -moz-box-shadow: 0px 3px 30px #a6a6a6;
    -webkit-box-shadow: 0px 3px 30px #a6a6a6;
    box-shadow: 0px 3px 20px #a6a6a6;
    padding: 0px 18px;
    display: flex;
    flex-flow: column;
    align-content: center;
    align-items: stretch;
    .total {
      flex-grow: 1;
      color: #5e74fe;
      display: flex;
      align-items: center;
      font-size: 36px;
      div {
        display: flex;
        justify-content: center;
        padding: 6px;
      }
    }
    .van-divider {
      color: #1989fa;
      border-color: #1989fa;
      width: 100%;
      margin: 0px;
      padding-bottom: 6px;
    }
    .step {
      flex-grow: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      .van-row {
        flex-grow: 1;
        display: flex;
        justify-content: center;
        font-size: 24px;
        padding: 6px;
      }
    }

    .title {
      flex: auto;

      > div {
        line-height: 40px;
        vertical-align: middle;
        display: inline-block;
        word-break: break-all;
        white-space: nowrap;
        margin-right: 6px;
      }
    }

    .name {
      font-size: 36px;
      color: #202020;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 156px;
    }

    .gender {
      &:before {
        content: "不详";
      }

      &.male:before {
        content: "\e63d";
        font-size: 26px;
        font-weight: 800;
        color: #2b65f8;
      }

      &.female:before {
        content: "\e63a";
        font-size: 26px;
        font-weight: 800;
        color: #f86359;
      }
    }

    .age {
      color: #202020;
      font-size: 28px;
    }

    .badge {
      font-size: 28px;
      line-height: 42px;
      padding: 0 10px;
      border-radius: 21px;
      background: rgba(94, 116, 253, 0.1);
      color: #5e74fe;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &.comingType {
        font-size: 20px;
        color: #f86359;
        background: rgba(255, 83, 62, 0.1);
      }
    }

    .rfTagId {
      color: #202020;
      font-size: 0.32rem;
    }

    .button {
      white-space: nowrap;
      height: 50px;
      font-size: 28px;
      padding: 0 6px;
      border: 1px solid #5e74fe;
      border-radius: 25px;
      color: #5e74fe;
      line-height: 50px;

      i {
        font-size: 50px;
      }

      + .button {
        margin-left: 8px;
      }

      &:active {
        background-color: rgb(236, 236, 236);
      }
      .van-button__icon {
        padding: 7px 3px 0px 3px;
      }
      span {
        min-width: 80px;
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 24px !important;
      }
    }

    .bottomLeft {
      font-size: 24px;
      color: #b5b5b5;

      p {
        line-height: 86px;
      }
    }

    .bottomRight {
      display: flex;
      font-size: 24px;
      line-height: 76px;

      .time {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #5e74fe;
        max-width: 300px;

        i {
          font-size: 25px;
          color: #b5b5b5;
        }

        + .time {
          margin-left: 12px;
        }
      }
    }
  }
}
</style>
