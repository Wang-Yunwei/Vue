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
      chart: null,
      isMounted: false
    }
  },
  computed: {
    ...mapGetters(['dictionary']),
    cityCode() {
      const list = this.dictionary[this.dic.defaultCity] || []
      const defaultCityCode = list[0]?.value
      return defaultCityCode
    }
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
      let legendData = [] // 图例
      const xAxisData = [] // 横轴日期
      const seriesData = [] // 折线数据
      if (this.data.length) {
        this.data.forEach((el) => {
          const [[date, vals]] = Object.entries(el)
          legendData = Object.keys(vals)
          xAxisData.push(date)

          legendData.forEach((stationName) => {
            const matchedSeriesData = seriesData.find(
              (el) => el.name === stationName
            )
            if (matchedSeriesData) {
              matchedSeriesData.data.push(vals[stationName])
            } else {
              seriesData.push({
                type: 'line',
                data: [vals[stationName]],
                name: stationName
              })
            }
          })
        })
      }
      return {
        legendData,
        xAxisData,
        seriesData
      }
    },
    async initChart() {
      if (!this.isMounted) {
        return
      }
      if (!this.chart) this.chart = this.$echarts.init(this.$refs.chart)
      const { legendData, xAxisData, seriesData } = this.getData()

      // 指定图表的配置项和数据
      const option = {
        title: {
          text: '平均反应时间表',
          subtext: '',
          left: 'left'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: legendData
        },
        xAxis: {
          type: 'category',
          data: xAxisData
        },
        yAxis: {
          type: 'value'
        },
        series: seriesData
      }
      //   展示数据
      this.chart.setOption(option)
    }
  }
}
</script>

<style></style>
