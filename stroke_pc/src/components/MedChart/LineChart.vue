<template>
  <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
  <div :id="elementId" style="width: 100%; height: 100%" />
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'LineChart',
  props: {
    elementId: {
      type: String,
      require: true,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    dataZoom: {
      type: Boolean,
      default: false
    },
    seriesData: {
      type: Object,
      require: true,
      default: () => {}
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
    this.initCharts()
  },
  methods: {
    initCharts() {
      let dataZoomArr = []
      if (this.dataZoom) {
        dataZoomArr = [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 10
          }
        ]
      }
      const obj = Object.keys(this.seriesData)
      const series = obj.map((item) => ({
        data: this.seriesData[item]?.map((item) => item.value),
        name:
          this.seriesData[item].length !== 0
            ? this.seriesData[item][0].desc
            : '',
        type: 'line',
        label: {
          show: true,
          formatter: '{c}'
        }
      }))

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
          trigger: 'axis'
        },
        legend: {
          left: 'right'
        },
        // toolbox: {
        //   show: true,
        //   feature: {
        //     dataView: { readOnly: false },
        //     saveAsImage: {}
        //   }
        // },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.seriesData[obj[0]]?.map((item) => item.name)
        },
        yAxis: {
          type: 'value'
        },
        dataZoom: dataZoomArr,
        series: series
      })
      // 随着屏幕大小调节图表
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
