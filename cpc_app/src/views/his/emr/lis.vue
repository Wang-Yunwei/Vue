<template>
  <div>
    <med-view-container @back-click="jumpToDetails" class="med-view-wrapper">
      <div
        v-for="item in details"
        :key="item.value"
        :title="item.name"
        :name="item.value"
      >
        <div class="card-tem">
          <div class="top flex-c-s">
            <div class="side">
              <p>来院方式</p>
            </div>
            <span>2021-10-10 10:10:10</span>
            <span>车牌号</span>
          </div>
          <div class="center">
            <p>
              <span>{{ item.name }}</span>
              <span>{{ item.gender }}</span>
              <span>{{ item.age }}岁</span>
              <span>症状</span>
            </p>
            <p>呼救时间:2021-10-10 10:10:10</p>
          </div>
          <div class="bottom flex-c-b">
            <van-icon />
            <div class="btns">
              <van-button round>绑定</van-button>
            </div>
          </div>
        </div>
      </div>
    </med-view-container>
  </div>
</template>

<script>
export default {
  // 卒中档案:已归档
  name: 'Filing',
  data() {
    return {
      details: [],
      medswmgcentity: {
        type: '0',
        name: ''
      },
      medswmgcl: {
        id: '',
        isCompleted: '1'
      }
    }
  },
  // 钩子方法
  async created() {
    // 获取基本信息
    this.getBasicInformation()
  },
  methods: {
    jumpToDetails(item) {
      this.$router.push({
        path: '/gc'
      })
    },
    // 查询基本信息
    getBasicInformation() {
      this.$api.filing
        .getBasicInformation(this.medswmgcentity.type, this.medswmgcentity.name)
        .then(res => {
          this.details = res.result
        })
    },
    // 撤回患者信息
    withdraw(item) {
      this.medswmgcl.id = item.id
      this.$api.filing.insertBasicInformation(this.medswmgcl).then(res => {})
      // 撤回之后再次查询
      this.getBasicInformation()
    }
  }
}
</script>

<style lang="less" scoped>
.index-wrapper {
  background: #f2f4f5;
  height: 100%;

  .task-top {
    height: 80px;
    background: #444fdb;
    -moz-box-shadow: 0px 3px 30px #a6a6a6;
    -webkit-box-shadow: 0px 3px 30px #a6a6a6;
    box-shadow: 0px 3px 20px #a6a6a6;
    position: relative;

    .task-name {
      background: #fff;
      width: 90%;
      height: 110px;
      background: #ffffff;
      border-radius: 15px;
      margin: 0 auto;
      position: absolute;
      bottom: -20px;
      left: 0;
      right: 0;
      -moz-box-shadow: 0px 3px 10px #a6a6a6;
      -webkit-box-shadow: 0px 3px 10px #a6a6a6;
      box-shadow: 0px 3px 10px #a6a6a6;
      padding: 0 45px;
      box-sizing: border-box;

      p {
        &.spec {
          span {
            color: #f10409;
          }
        }

        span {
          font-size: 8px;
        }
      }
    }
  }
}

.card-tem {
  background: #fff;
  border: 1px solid #bbb;
  padding: 0 10px;
  margin: 0 10px;
  border-radius: 20px;
  position: relative;

  .flex-c-s {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .flex-c-b {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .top {
    font-size: 28px;
    line-height: 2;
    border-bottom: 2px solid #bbb;
    margin: 0 20px;

    span {
      padding-left: 44px;
    }
  }

  .center {
    p {
      padding-left: 44px;
      font-size: 28px;
      line-height: 2;
      margin: 0 20px;
      border-bottom: 2px solid #bbb;

      span {
        margin: 0 20px;

        &:nth-of-type(1) {
          margin-left: 0;
          font-size: 40px;
          color: #00b0ff;
        }
      }
    }
  }

  .bottom {
    padding: 20px 0;
    margin: 0 20px;

    .van-icon {
      font-size: 40px;
    }

    .btns {
      .van-button {
        font-size: 24px;
        height: auto;
        padding: 10px 30px;
        margin-left: 20px;
      }
    }
  }

  .side {
    position: absolute;
    top: 0;
    left: 10px;

    p {
      &:nth-of-type(1) {
        background: red;
        color: #fff;
        padding: 10px 5px;
        border-radius: 10px;
      }

      &:nth-of-type(2) {
        background: green;
        color: #fff;
        padding: 10px;
        border-radius: 20px;
      }
    }
  }
}
</style>
