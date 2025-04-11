<template>
  <med-view-container @return="jumpToDetails">
    <div class="task-title">
      <p>
        姓名:{{ this.details.name }} 性别:<span
v-if="details.gender == '1'"
          >男</span
        >
        <span v-else-if="details.gender == '2'">女</span>
        <span v-else>未知</span>
        {{ this.details.age }}岁
        <span v-if="details.comingType == '1'">当地120</span>
        <span v-else-if="details.comingType == '2'">自行来院</span>
        <span v-else-if="details.comingType == '3'">外院转诊</span>
        <span v-else-if="details.comingType == '4'">院内发病</span>
        <span v-else>未知</span>
      </p>
    </div>
    <div class="scroll-view">
      <van-tabs v-model="active" sticky color="#5e74fe">
        <van-tab
          v-for="(item, index) in tabList"
          :title="item.name"
          :key="index"
        >
          <component v-show="active === index" :is="item.part"></component>
        </van-tab>
      </van-tabs>
    </div>
  </med-view-container>
</template>
<script>
import Vue from 'vue'
import { Step, Steps } from 'vant'
import * as parts from '../../detail/overview/parts/index'

Vue.use(Step)
Vue.use(Steps)
export default {
  name: 'overview',

  components: { ...parts },
  data() {
    return {
      active: 6,
      registId: this.$route.query.registId,
      details: {},
      tabList: [
        { name: '绿通病历', part: parts.GcCaseHistory },
        { name: '急救病历', part: parts.FirstAid },
        { name: '转诊信息' },
        { name: '预检分诊' },
        { name: '检查/检验' },
        { name: '用药' }
      ]
    }
  },
  created() {
    this.getDiagnosisTime()
  },
  methods: {
    // 返回主页面
    jumpToDetails() {
      this.$router.push({
        path: '/gc',
        query: { registId: this.registId }
      })
    },
    getDiagnosisTime() {
      this.$api.preview.getPreviewList(this.registId, '1').then(res => {
        this.details = res.result.medswmgcvo
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
