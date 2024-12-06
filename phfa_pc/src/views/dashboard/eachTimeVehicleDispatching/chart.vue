<template>
  <div ref="chart" style="width: 100%; height: 680px" />
</template>

<script>
import { mapGetters } from 'vuex'
import { dicConstant as dic } from '@/constant'
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dic,
      isMounted: false,
      chart: null
    }
  },
  computed: {
    ...mapGetters(['dictionary'])
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler() {
        this.initChart()
      }
    }
  },
  mounted() {
    this.isMounted = true
    this.initChart()
  },
  methods: {
    // 获取统计数据
    getData() {
      const seriesData = []
      const legendData = this.data.map((el) => {
        const [[range, val]] = Object.entries(el)
        seriesData.push(val)
        return range
      })
      return {
        legendData: legendData,
        seriesData: seriesData
      }
    },
    async initChart() {
      if (!this.isMounted) {
        return
      }
      if (!this.chart) this.chart = this.$echarts.init(this.$refs.chart)
      const { legendData, seriesData } = this.getData()

      // 指定图表的配置项和数据
      const option = {
        title: {
          text: '各时段出车统计表',
          subtext: '',
          left: 'left'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: legendData
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: seriesData,
            type: 'bar'
          }
        ]
      }
      //   展示数据
      this.chart.setOption(option)
    }
  }
}
</script>

<style></style>
