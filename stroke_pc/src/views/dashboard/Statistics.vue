<template>
  <div class="statistics">
    <el-row :gutter="14">
      <el-col :span="8">
        <div class="col-bell">
          <div class="bell-title">ONT平均数</div>
          <div class="col-bel-number">
            <span>{{
              statisticsData.ontAver ? statisticsData.ontAver : '--'
            }}</span>
            分钟
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="col-bell">
          <div class="bell-title">DNT中位数</div>
          <div class="col-bel-number">
            <span>{{
              statisticsData.dntMid ? statisticsData.dntMid : '--'
            }}</span>
            分钟
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="col-bell">
          <div class="bell-title">DPT中位数</div>
          <div class="col-bel-number">
            <span>{{
              statisticsData.dptMid ? statisticsData.dptMid : '--'
            }}</span>
            分钟
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  // 胸痛档案
  name: 'Statistics',
  props: {
    statisticsData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {},
  // 钩子方法
  created() {},

  methods: {}
}
</script>

<style lang="scss" scoped>
.statistics {
  margin: 23px 0 40px 0;
}
.col-bell {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 14px 0 14px 14px;
  color: #333;
  font-size: 14px;
  .bell-title {
    margin-bottom: 10px;
  }
  // height: 100px;
}
.col-bel-number span {
  font-size: 22px;
}
</style>
