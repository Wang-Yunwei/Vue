<template>
  <div :class="'med-index-card-wrapper' + resultClass">
    <van-row>
      <van-col span="24" class="detail">
        <div>
          <van-row class="index-result">
            <van-col span="10"> {{ indexValue.statusDesc }} </van-col>
            <van-col span="14">
              质控要求：{{ indexValue.standardValue }}
            </van-col>
          </van-row>
          <van-row class="index-title">
            {{ indexValue.title }}
          </van-row>
          <van-row class="index-target"> 入选条件：{{ assetObject }} </van-row>
          <van-row>
            <van-divider />
          </van-row>
        </div>
        <div class="index-memo">
          <van-row
            v-for="item in indexValue.qcStandardTimeDtoList"
            :key="item.title"
          >
            {{ getItemValue(indexValue, item) }}
          </van-row>
        </div>
      </van-col>
    </van-row>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'KeyIndexCard',
  props: {
    indexValue: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  mounted() {},
  // 钩子方法
  created() {
    //
  },
  computed: {
    resultClass() {
      let _class = ''
      if (this.indexValue.status === 1) {
        _class += ' result-ok'
      } else if (this.indexValue.status === 2) {
        _class += ' result-ng'
      } else if (this.indexValue.status === 3 || this.indexValue.status === 4) {
        _class += ' result-na'
      }
      return _class
    },
    assetObject() {
      if (this.indexValue.status === 5) {
        return this.indexValue.assetObject
      }

      return this.indexValue.assetObject
    }
  },
  methods: {
    getFormatValue(item) {
      if (!item) return ''
      if (!item.value) return '未填写'
      // return '不满足'
      return item.value
      // return moment(item.value).format('YYYY-MM-DD HH:mm')
    },
    getItemValue(indexValue, item) {
      const value = this.getFormatValue(item)
      if (indexValue.status === 4 && value === '不满足') {
        return `${item.title}`
      }
      return `${item.title}： ${value}`
    }
  },
  watch: {}
}
</script>

<style lang="less" scoped>
.med-index-card-wrapper {
  min-height: 240px;
  width: 100%;
  padding: 8px 24px;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.2), 0 3px 12px 0 rgba(0, 0, 0, 0.19);
  text-align: center;
  display: inline-block;
  background-color: #fff;
  border-radius: 20px;

  .van-row {
    display: flex;
    align-items: center;
  }

  .result {
    display: flex;
    justify-content: center !important;
    align-items: center;
    align-self: stretch;
  }
  .result div {
    width: 28px;
    font-size: 30px;
  }
  &.result-na {
    .index-result .van-col:nth-of-type(1) {
      color: grey;
    }
    border-left: 10px solid grey;
  }
  &.result-ng {
    .index-result .van-col:nth-of-type(1) {
      color: red;
    }
    border-left: 10px solid red;
  }
  &.result-ok {
    .index-result .van-col:nth-of-type(1) {
      color: blue;
    }
    border-left: 10px solid blue;
  }

  .detail {
    display: flex;
    flex-flow: column;
    padding: 14px 0px 14px;
    align-self: flex-start;
    height: 100%;
    width: 100%;
    .index-result {
      font-size: 28px;
      line-height: 48px;
      .van-col {
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
      .van-col:nth-of-type(2) {
        color: #b5b5b5;
      }
    }

    .index-title {
      font-weight: bold;
      font-size: 28px;
      line-height: 32px;
      text-align: start;
      padding: 8px 0;
    }

    .index-target,
    .index-memo {
      flex-grow: 1;
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: flex-start;
      font-size: 24px;
      line-height: 40px;
      color: #b5b5b5;
      text-align: left;
    }
    .index-memo {
      min-height: 80px;
    }
  }
  .van-divider {
    color: #b5b5b5;
    border: 0px solid #b5b5b5;
    width: 100%;
    margin: 12px 0;
  }
}
</style>
