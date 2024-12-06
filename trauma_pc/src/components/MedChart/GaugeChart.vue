<template>
  <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
  <div :id="elementId" style="width: 100%; height: 100%" />
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'GaugeChart',
  props: {
    elementId: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    seriesData: {
      type: Number,
      require: true,
      default: () => []
    }
  },
  data() {
    return {}
  },
  mounted() {
    this.initCharts()
  },
  methods: {
    initCharts() {
      const myChartId = document.getElementById(this.elementId)
      myChartId.style.width = myChartId.parentNode.clientWidth + 'px'
      myChartId.style.height = myChartId.parentNode.clientHeight + 'px'
      const myChart = echarts.init(myChartId) // 图标初始化
      myChart.clear()
      // 绘制图表
      myChart.setOption({
        title: {
          text: this.title,
          left: 'left',
          padding: 2,
          textStyle: {
            color: '#222', // 颜色
            fontSize: '16' // 大小
          }
        },
        tooltip: {
          formatter: '{a} : {c}%'
        },
        series: [
          {
            name: this.title,
            type: 'gauge',
            center: ['50%', '52%'],
            progress: {
              show: true
            },
            axisTick: {
              show: false
            },
            detail: {
              valueAnimation: true,
              fontSize: 18,
              offsetCenter: [0, '70%'],
              formatter: '{value}%'
            },
            data: [
              {
                value: this.seriesData
              }
            ]
          }
        ]
      })
      // 随着屏幕大小调节图表
      window.onresize = function() {
        myChart.resize()
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
