<template>
  <div class="emergency-no-task-wrapper flex-c-c">
    <div class="emergency-no-task-header" @click="goBack">
      <van-icon name="arrow-left" size="32" />
    </div>
    <center class="emergency-no-task-main">
      <div class="emergency-no-task-icon flex-c-c">
        <i class="iconfont iconicon1-441"></i>
      </div>
      <h2 class="emergency-no-task-title">哎呀，还没有任务哦！</h2>
      <div class="emergency-no-task-discription">
        点击新建任务按钮创建新任务吧！
      </div>
      <div class="emergency-no-task-button">
        <van-button round block color="#5e74fe" @click="createTask">
          新建任务
        </van-button>
      </div>
    </center>
  </div>
</template>

<script>
import * as types from '@store/mutations/mutations-types'
import { mapMutations } from 'vuex'

export default {
  name: 'NoTask',
  created() {
    this.noTaskInit()
  },
  methods: {
    ...mapMutations(types),
    noTaskInit() {
      this[types.SET_MISSIONINFO]({})
      this[types.SET_PATIENTINFO]({})
      this[types.SET_TOHOSPITALID]('')
    },
    createTask() {
      this.$emit('create')
    },
    goBack() {
      window.history.back()
    }
  }
}
</script>

<style lang="less" scoped>
.emergency-no-task-header {
  position: fixed;
  left: 30px;
  top: 30px;
  opacity: 0.3;
}
.emergency-no-task {
  &-wrapper {
    height: 100%;
    background-color: #fff;
  }

  &-icon {
    width: 5.41rem;
    height: 5.41rem;
    box-shadow: 0 0 1rem #ddd;
    border-radius: 50%;

    .iconicon1-441 {
      font-size: 2.24rem;
      color: #ebecef;
    }
  }

  &-title {
    margin-top: 1.15rem;
    font-size: 0.48rem;
    color: #5e74fe;
    font-weight: bold;
  }

  &-discription {
    font-size: 0.42rem;
    color: #161808;
    margin-top: 0.57rem;
    font-weight: 400;
  }

  &-button {
    width: 4rem;
    margin-top: 0.85rem;
  }
}
</style>
