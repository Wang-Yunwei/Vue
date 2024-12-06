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
      chart: null
    }
  },
  computed: {
    ...mapGetters(['dictionary']),
    cityCode() {
      const list = this.dictionary[this.dic.defaultCity] || []
      const defaultCityCode = list[0].value
      return defaultCityCode
    }
  },
  watch: {
    data() {
      this.initChart()
    }
  },
  methods: {
    // 获取统计数据
    getData() {
      const seriesData = []
      const legendData = this.data.map((el) => {
        const [[name, val]] = Object.entries(el)
        seriesData.push({
          name,
          value: val
        })
        return name
      })
      return {
        legendData: legendData,
        seriesData: seriesData
      }
    },
    async initChart() {
      if (!this.chart) this.chart = this.$echarts.init(this.$refs.chart)
      const data = this.getData()
      // 指定图表的配置项和数据
      const option = {
        title: {
          text: '急救措施统计表',
          subtext: '',
          left: 'left'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: data.legendData
        },
        series: [
          {
            name: '急救措施',
            type: 'pie',
            radius: '55%',
            center: ['40%', '50%'],
            data: data.seriesData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
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
