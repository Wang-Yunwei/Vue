<template>
  <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
  <div :id="elementId" style="width: 100%; height: 100%" />
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'PieChart',
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
      type: Array,
      require: true,
      default: () => []
    }
  },
  data() {
    return {}
  },
  watch: {
    seriesData: {
      deep: true,
      immediate: false,
      handler() {
        this.initCharts()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initCharts()
    })
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
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: 'black'
          }
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'right'
        },
        series: [
          {
            name: this.title,
            type: 'pie',
            radius: '70%',
            itemStyle: {
              borderRadius: 6,
              borderWidth: 2
            },
            label: {
              show: true,
              fontSize: '12',
              formatter: '{b}\n {c}例'
            },
            data: this.seriesData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0,0,0,0.5)'
              }
            }
          }
        ]
      })
      // 随着屏幕大小调节图表
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
