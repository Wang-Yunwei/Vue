<template>
  <div class="med-analysis-detail-wrapper">
    <div class="card title-card">
      <span>工作量统计分析</span>
    </div>
    <el-card class="card">
      <med-bar-chart
        key="statistics"
        :x-axis-data="docData.xAxisData"
        :y-axis-data="docData.yAxisData"
        :series-data="docData.seriesData"
        style="height: 300px;"
      />
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import reportType from '@/constant/reportType'

export default {
  name: 'Statistics',
  components: {},
  props: {
    docData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      reportType
    }
  },
  computed: {
    ...mapGetters(['dictionary'])
  },
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    convert(value, dic) {
      if (!value) return ''
      if (!dic || !Array.isArray(dic)) return value
      value = value.toString()
      return (dic.find((v) => v.value === value) || { label: '' }).label
    }
  }
}
</script>

<style lang="scss" scoped>
.med-analysis-detail-wrapper {
  margin: 0 auto;
  padding: 24px 24px;
  .card {
    width: 100%;
    border-radius: 15px;
    margin: 15px auto;
    box-shadow: 0px 3px 15px #a6a6a6;
    font-size: 19px;
    height: auto;
    padding: 16px;
  }

  .title-card {
    font-size: 16px;
    color: #fff;
    background-color: #5e74fe;
  }
}
</style>
