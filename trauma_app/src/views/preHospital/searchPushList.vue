<template>
  <med-popup-container title="患者搜索" v-bind="$attrs" v-on="$listeners">
    <div style="padding: 0.3rem;">
      <van-field class="search-input" left-icon="search" v-model="form.name" placeholder="按照患者姓名搜索" />
      <div class="screen-body">
        <div class="screen-body-title">
          类型
          <div class="screen-body-button">
            <med-radio-button-rectangle-group v-model="form.source" :dataSource="[
              { label: '急救', value: 'phep' },
              { label: '急诊', value: 'piat' }
            ]" />
          </div>
        </div>
        <div class="screen-body-title">
          时间
          <div class="screen-body-button">
            <div class="flex-c-b">
              <med-date-picker v-model="form.beginTime" placeholder="开始时间" label="" @_change="setTimeInterval(form.beginTime, 0)">
              </med-date-picker>
              ~
              <med-date-picker v-model="form.endTime" placeholder="结束时间" label="" @_change="setTimeInterval(form.endTime, 1)">
              </med-date-picker>
            </div>
          </div>
        </div>
      </div>
      <div style="text-align: center;">
        <van-button class="screen-foot-button" @click="reset">重置</van-button>
        <van-button class="screen-foot-button" @click="$emit('close', form)">确定</van-button>
      </div>
    </div>
  </med-popup-container>
</template>

<script>
export default {
  name: 'searchPushList',
  model: {
    prop: 'show',
    event: '_change'
  },
  data() {
    return {
      form: {
        beginTime: this.$moment().endOf('day').subtract(3, 'days').add(1, 'minutes').format('YYYY-MM-DD HH:mm'),
        endTime: this.$moment().endOf('day').format('YYYY-MM-DD HH:mm')
      }
    }
  },
  methods: {
    reset() {
      // 重置
      this.form = {
        beginTime: this.$moment().endOf('day').subtract(3, 'days').add(1, 'minutes').format('YYYY-MM-DD HH:mm'),
        endTime: this.$moment().endOf('day').format('YYYY-MM-DD HH:mm')
      }
    },
    setTimeInterval(val, type) {
      // 设置时间区间
      const timestamp = this.$moment(val).toDate().getTime()
      if (type === 0) {
        // 设置开始时间
        if (this.form.endTime) {
          // 如果结束时间存在,判断结束时间是否在三天内
          const endTime = this.$moment(this.form.endTime).toDate().getTime()
          const timeDiff = Math.abs(endTime - timestamp)
          const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
          if (dayDiff > 3) {
            this.$set(this.form, 'endTime', this.$moment(val).add(3, 'days').subtract(1, 'minutes').format('YYYY-MM-DD HH:mm'))
          }
        }
      } else {
        // 设置结束时间
        if (this.form.beginTime) {
          // 如果开始时间存在,判断结束时间是否在三天内
          const startTime = this.$moment(this.form.beginTime).toDate().getTime()
          const timeDiff = Math.abs(timestamp - startTime)
          const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
          if (dayDiff > 3) {
            this.$set(this.form, 'beginTime', this.$moment(val).subtract(3, 'days').add(1, 'minutes').format('YYYY-MM-DD HH:mm'))
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search-input {
  line-height: 0.45rem;
  height: 1rem;
  background-color: rgb(247, 248, 250);
  margin: 0 auto;
  border-radius: 0.6rem;
  font-size: 0.4rem;
}

.screen-body {
  padding: 0.5rem 0;
  overflow: auto;
  height: calc(100vh - 5.5rem);

  .screen-body-title {
    font-weight: 700;
    font-size: 0.4rem;
    letter-spacing: 0px;
    line-height: 28px;
    margin: 0.3rem 0.4rem 0.7rem 0;
    min-width: 4em;

    .screen-body-button {
      margin-top: 0.3rem;
      font-weight: 400;
    }

    .screen-body-checkbox-group {
      margin-top: 0.3rem;

      &>span {
        display: inline-block;

        &+span {
          margin-left: 0.3rem;
        }
      }

      input:checked+.screen-body-checkbox {
        background-color: rgb(215, 220, 255);
        background-size: 100% 100%;
      }

      .screen-body-checkbox {
        font-size: 0.32rem;
        line-height: 2.5;
        background-color: #ffffff;
        border: 0.01rem solid rgb(95, 94, 94);
        border-radius: 15px;
        margin: 0;
        padding: 0.1rem 0.2rem;
        white-space: nowrap;
      }
    }
  }
}

.screen-foot-button {
  width: 4.5rem;
  height: 0.86rem;
  border-radius: 1rem 0 0 1rem;
  border-color: rgb(43, 101, 248);
  color: rgb(43, 101, 248);
  border-right: none;

  &+.screen-foot-button {
    border-radius: 0 1rem 1rem 0;
    background-color: rgb(43, 101, 248);
    color: white;
  }
}
</style>
