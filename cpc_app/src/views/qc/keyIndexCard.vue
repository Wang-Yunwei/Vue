<template>
  <div :class="keyIndexCardClass" @click="onCardClick">
    <div class="card">
      <van-row>
        <van-col span="24" class="name">
          {{ indexValue.name }}
        </van-col>
        <span :class="numberClass">{{ this.indexValue.code }}</span>
      </van-row>
      <!-- <van-row>
        <van-col span="24" class="desc">
          {{ indexValue.desc }}
        </van-col>
      </van-row> -->
      <van-row class="value-row">
        <van-col span="17" class="value-column">
          <van-row class="value">
            {{ this.indexValue.value }}
          </van-row>
          <van-row>
            {{ this.referTypeName }}：{{ this.indexValue.refer }}
          </van-row>
          <van-row v-if="indexValue.core === 'THREE_MEETING'">&nbsp;</van-row>
          <van-row v-else> 排名：{{ this.indexValue.rank }} 名 </van-row>
        </van-col>
        <van-col span="7" class="image-container">
          <med-svg :icon-class="indexValue.icon" />
          <!-- <van-image
            :src="require('@assets/image/qc/keyindex/DIDO.png')"
          /> -->
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KeyIndexCard',
  props: {
    indexValue: {
      type: Object,
      default: () => {}
    },
    referType: {
      type: String,
      default: '1'
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
    // valueDesc() {

    //   return `${this.indexValue.value}`
    // },
    changeValue() {
      return `${this.indexValue.change}${this.indexValue.rate}`
    },
    keyIndexCardClass() {
      let _class = 'med-key-index-card-wrapper'
      if (this.indexValue.result === 'OK') {
        _class += ' med-key-index-card-border-ok'
      } else if (this.indexValue.result === 'NG') {
        _class += ' med-key-index-card-border-ng'
      }
      return _class
    },
    numberClass() {
      let _class = 'number'
      if (this.indexValue.result === 'OK') {
        _class += ' number-ok'
      } else if (this.indexValue.result === 'NG') {
        _class += ' number-ng'
      }
      return _class
    },
    referTypeName() {
      if (this.referType === '1') return '全国'
      else if (this.referType === '2') return '全省'
      else if (this.referType === '3') return '全市'
      return '????'
    }
  },
  methods: {
    onCardClick() {
      this.$emit('click-card', this.indexValue)
    }
  },
  watch: {}
}
</script>

<style lang="less" scoped>
.med-key-index-card-wrapper {
  height: 200px;
  width: 100%;
  -moz-box-shadow: 0px 3px 10px #a6a6a6;
  -webkit-box-shadow: 0px 3px 10px #a6a6a6;
  box-shadow: 0px 3px 10px #a6a6a6;
  display: inline-block;
  background-color: #fff;
  border-radius: 8px;
  border-top: 6px solid;
  padding: 16px 0;
  .number {
    width: 78px;
    height: 56px;
    margin-top: -56px;
    margin-right: -32px;
    float: right;
    position: relative;
    border-radius: 0 3px 0 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    padding-left: 4px;
    padding-bottom: 4px;
  }
  .number-ok {
    background: green;
  }
  .number-ng {
    background: red;
  }
  .card {
    height: 100%;
    display: flex;
    position: relative;
    flex-flow: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 0 32px;
    .van-row {
      padding: 3px 0;
      width: 100%;
      .van-col {
        display: flex;
        justify-content: flex-start;
      }
    }
  }
  // .van-row {
  //   padding: 3px 16px;
  //   align-items: center;
  //   .van-col {
  //     display: flex;
  //     justify-content: flex-start;
  //   }
  // }
  .name {
    font-size: 32px;
    font-weight: bold;
    height: 34px;
    line-height: 34px;
  }
  .desc {
    font-size: 12px;
    height: 26px;
  }
  .value-row {
    flex-grow: 1;
    display: flex;
    align-items: flex-end;
    padding: 12px;
    .value-column {
      display: flex;
      flex-flow: column;
      font-size: 28px;
    }
    .value {
      font-size: 42px;
      padding: 3px 0;
      color: #333bd2;
      display: flex;
      justify-content: flex-start;
    }
    .image-container {
      justify-content: flex-end !important;
      margin-bottom: 10px;
      .svg-icon {
        color: #333bd2;
        font-size: 128px;
      }
    }
  }
  .van-divider {
    color: #1989fa;
    border-color: #1989fa;
    width: 100%;
    margin: 0;
    padding-bottom: 6px;
  }
}
.med-key-index-card-border-ok {
  border-top-color: green;
}
.med-key-index-card-border-ng {
  border-top-color: red;
}
</style>
