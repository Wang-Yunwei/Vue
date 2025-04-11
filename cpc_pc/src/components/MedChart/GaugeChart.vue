<template>
  <div class="med-gauge-chart-wrapper">
    <div ref="gaugeChart" class="med-gauge-chart-wrapper-chart" />
  </div>
</template>
<script>
export default {
  name: 'MedGaugeChart',
  inheritAttrs: false,
  props: {
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
        series: [
          {
            type: 'gauge',
            startAngle: 90,
            endAngle: -270,
            radius: '90%',
            center: ['50%', '50%'],
            pointer: {
              show: false
            },
            progress: {
              show: true,
              overlap: false,
              clip: false,
              itemStyle: {
                borderWidth: 2,
                borderColor: '#fff'
              }
            },
            axisLine: {
              lineStyle: {
                width: 80
              }
            },
            splitLine: {
              show: false,
              distance: 0,
              length: 10
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false,
              distance: 50
            },
            data: this.seriesData,
            title: {
              fontSize: 14
            },
            detail: {
              show: true,
              width: 50,
              height: 14,
              fontSize: 14,
              color: 'inherit',
              borderColor: 'inherit',
              borderRadius: 20,
              borderWidth: 1,
              backgroundColor: 'transparent',
              formatter: '{value}%'
            }
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
        this.options.series[0].data = this.seriesData
      } else {
        this.options = this.chartOptions
      }
      if (this.echartInstance) this.echartInstance.clear()
      this.echartInstance = this.$echarts.init(this.$refs.gaugeChart)
      this.echartInstance.setOption(this.options)
    }
  }
}
</script>

<style lang="scss" scoped>
.med-gauge-chart-wrapper {
  display: flex;
  flex: 1;
  &-chart {
    flex-grow: 1;
  }
}
</style>
