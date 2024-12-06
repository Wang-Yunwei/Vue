<template>
  <med-popup-container v-bind="$attrs" v-on="$listeners" title="患者搜索">
    <van-field placeholder="患者姓名" left-icon="search" v-model="form.name"
      style="background-color: rgb(247, 248, 250);width: 90%;border-radius: 1rem;margin: 0.3rem auto;font-size: 0.4rem;padding: .133333rem .213333rem .133333rem 0.3rem" />
    <div class="screen-body">
      <div class="screen-body-title">
        类型
        <div class="screen-body-button">
          <med-radio-button-rectangle-group v-model="form.type" :dataSource="[
            { label: '急救', value: '1' },
            { label: '急诊', value: '2' },
            { label: '门诊', value: '3' },
            { label: '住院', value: '4' }
          ]" @input="inputClick" />
        </div>
      </div>
      <div class="screen-body-title">
        时间
        <div class="screen-body-button">
          <div class="flex-c-b">
            <med-date-picker v-model="form.fromDate" placeholder="开始时间" type="datetime" label=""
              @_change="setTimeInterval(form.fromDate, 0)">
            </med-date-picker>
            <span style="font-size: 0.3rem;"> ~ </span>
            <med-date-picker v-model="form.toDate" placeholder="结束时间" type="datetime" label=""
              @_change="setTimeInterval(form.toDate, 1)">
            </med-date-picker>
          </div>
        </div>
      </div>
    </div>
    <div class="screen-foot flex-c-c">
      <van-button @click="reset" class="screen-foot-button">
        重置
      </van-button>
      <van-button @click="certainButton" class="screen-foot-button" color="rgb(43, 101, 248)">
        确定
      </van-button>
    </div>
  </med-popup-container>
</template>

<script>
export default {
  name: 'filterPop',
  model: {
    prop: 'show',
    event: '_change'
  },
  props: ['initForm'],
  data() {
    return {
      form: {
        type: '2',
        fromDate: this.$moment().startOf('day').format('YYYY-MM-DD HH:mm'),
        toDate: this.$moment().endOf('day').format('YYYY-MM-DD HH:mm')
      }
    }
  },
  methods: {
    inputClick(val) {
      // 当类型=急救时,如果时间区间大于3天,则根据结束时间,设置开始时间
      if (val === '1' && this.form.fromDate && this.form.toDate) {
        const startTime = this.$moment(this.form.fromDate).toDate().getTime()
        const endTime = this.$moment(this.form.toDate).toDate().getTime()
        const timeDiff = Math.abs(endTime - startTime)
        const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
        if (dayDiff > 3) {
          this.$set(this.form, 'fromDate', this.$moment(this.form.toDate).subtract(3, 'days').add(1, 'minutes').format('YYYY-MM-DD HH:mm')
          )
        }
      }
    },
    reset() {
      // 重置
      this.form = {
        type: '2',
        fromDate: this.$moment().startOf('day').format('YYYY-MM-DD HH:mm'),
        toDate: this.$moment().endOf('day').format('YYYY-MM-DD HH:mm')
      }
    },
    setTimeInterval(val, type) {
      // 设置时间区间
      if (this.form.type === '1') {
        const timestamp = this.$moment(val)
          .toDate()
          .getTime()
        if (type === 0) {
          // 设置结束时间
          if (this.form.toDate) {
            // 如果结束时间存在,判断结束时间是否在三天内
            const endTime = this.$moment(this.form.toDate)
              .toDate()
              .getTime()
            const timeDiff = Math.abs(endTime - timestamp)
            const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
            if (dayDiff > 3) {
              this.$set(
                this.form,
                'toDate',
                this.$moment(val)
                  .add(3, 'days')
                  .subtract(1, 'minutes')
                  .format('YYYY-MM-DD HH:mm')
              )
            }
          }
        } else {
          // 设置开始时间
          if (this.form.fromDate) {
            // 如果开始时间存在,判断结束时间是否在三天内
            const startTime = this.$moment(this.form.fromDate)
              .toDate()
              .getTime()
            const timeDiff = Math.abs(timestamp - startTime)
            const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
            if (dayDiff > 3) {
              this.$set(
                this.form,
                'fromDate',
                this.$moment(val)
                  .subtract(3, 'days')
                  .add(1, 'minutes')
                  .format('YYYY-MM-DD HH:mm')
              )
            }
          }
        }
      }
    },
    certainButton() {
      // 确定按钮
      this.$emit('certainButton', this.form)
    }
  },
  watch: {
    initForm() {
      // 初始化搜索条件
      this.reset()
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .van-search__content>div {
  flex-direction: row-reverse;
}

.screen-head {
  position: fixed;
  top: 2.8rem;
  left: 0;
  right: 0;
  overflow: hidden;
  padding: 0 0.4rem;

  .search-input {
    padding: 0.05rem 0.2rem;
    width: 100%;
    border-radius: 50px;
    background-color: #efefef;
  }
}

.screen-body {
  position: fixed;
  top: 3.5rem;
  left: 0;
  right: 0;
  padding-left: 0.3rem;

  .screen-body-title {
    font-weight: 700;
    font-size: 0.4rem;
    color: rgba(16, 16, 16, 1);
    letter-spacing: 0px;
    line-height: 28px;
    margin: 0.3rem 0.4rem 0.7rem 0;
    min-width: 4em;

    .screen-body-button {
      font-weight: 400;
      margin-top: 0.3rem;

      /deep/ .med-radio {
        padding: 0.01rem 0.3rem;
      }
    }

    .screen-body-checkbox-group {
      margin-top: 0.3rem;

      /deep/ .med-radio-group {
        text-align: center;
      }
    }
  }
}

.screen-foot {
  position: fixed;
  bottom: 0.7rem;
  left: 0;
  right: 0;

  /deep/ .van-button .van-button__content {
    font-size: 0.34rem;
  }

  .screen-foot-button {
    height: 0.86rem;
    border-radius: 50px 0px 0px 50px;
    border: 3px solid rgb(43, 101, 248);
    color: rgb(43, 101, 248);
    border-right: none;
    width: 4.5rem;

    &+.screen-foot-button {
      border-radius: 0px 50px 50px 0px;
    }
  }
}
</style>
