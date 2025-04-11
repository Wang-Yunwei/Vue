<template>
  <div class="med-key-index-score-wrapper">
    <div class="card-content">
      <van-row class="total">
        <van-col span="12">
          质控指标分数
        </van-col>
        <van-col span="12"> {{ summary ? summary : "--" }} 分 </van-col>
      </van-row>
      <van-divider />
      <van-row>
        <van-col span="24">
          <van-cell :title="description" class="description"></van-cell>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    summary: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
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
.med-key-index-score-wrapper {
  z-index: 2;
  // background-color: #333bd2;
  // height: 100px;
  .card-content {
    width: 90%;
    margin: 12px auto;
    // height: 180px;
    background: #ffffff;
    border-radius: 8px;
    -moz-box-shadow: 0px 3px 10px #a6a6a6;
    -webkit-box-shadow: 0px 3px 10px #a6a6a6;
    box-shadow: 0px 3px 10px #a6a6a6;
    padding: 0px 16px;
    display: flex;
    flex-flow: column;
    align-content: center;
    align-items: stretch;
    .total {
      flex-grow: 1;
      height: 80px;
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
      margin: 6px 0;
    }
    .van-cell {
      padding: 8px 8px;
      color: red;
      font-size: 24px !important;
    }
    .van-cell::before {
      content: "*";
      padding: 0 2px;
    }
    .van-cell__title {
      max-width: none;
      min-width: none;
      margin-right: 0;
    }
  }
}
</style>
