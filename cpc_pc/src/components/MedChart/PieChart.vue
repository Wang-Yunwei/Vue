<template>
  <div class="med-pie-chart-wrapper">
    <div ref="pieChart" class="med-pie-chart-wrapper-chart" />
  </div>
</template>

<script>
export default {
  name: 'MedPieChart',
  inheritAttrs: false,
  props: {
    showLegend: {
      type: Boolean,
      default: false
    },
    circular: {
      type: Boolean,
      default: false
    },
    seriesData: {
      type: Array,
      require: true,
      default: () => []
    },
    chartOptions: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      echartInstance: null,
      options: {
        title: {
          show: false
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          show: this.showLegend,
          top: 'bottom',
          orient: 'horizontal',
          left: 'center',
          textStyle: {
            fontSize: '14px'
          }
        },
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            bottom: '10%',
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: true
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '16px',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: true
            },
            data: this.seriesData
          }
        ]
      }
    }
  },
  computed: {},
  watch: {
    seriesData: {
      immediate: false,
      handler(val) {
        this.initChart()
      },
      deep: true
    },
    chartOptions: {
      immediate: false,
      handler(val) {
        this.initChart()
      },
      deep: true
    }
  },
  created() {},
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      if (!this.chartOptions) {
        if (this.circular) {
          this.options.series[0].radius = ['40%', '85%']
        }
        this.options.legend.show = this.showLegend
        if (!this.showLegend) {
          this.options.series[0].radius = '70%'
          this.options.series[0].bottom = '0%'
          this.options.series[0].center = ['50%', '50%']
        }
        this.options.series[0].data = this.seriesData
      } else {
        this.options = this.chartOptions
      }
      if (this.echartInstance) this.echartInstance.clear()
      this.echartInstance = this.$echarts.init(this.$refs.pieChart)
      this.echartInstance.setOption(this.options)
    }
  }
}
</script>

<style lang="scss" scoped>
.med-pie-chart-wrapper {
  height: 100%;
  display: flex;
  flex: 1;
  &-chart {
    flex-grow: 1;
  }
}
</style>
