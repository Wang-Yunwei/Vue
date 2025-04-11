<template>
  <div class="med-bar-chart-wrapper">
    <div ref="barChart" class="med-bar-chart-wrapper-chart" />
  </div>
</template>

<script>
export default {
  name: 'MedChart',
  inheritAttrs: false,
  model: {
    prop: 'fValue',
    event: '_change'
  },
  props: {
    xAxisData: {
      type: Array,
      require: true,
      default: () => []
    },
    yAxisData: {
      type: Array,
      default: () => [
        {
          type: 'value'
        }
      ]
    },
    showLegend: {
      type: Boolean,
      default: true
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
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          bottom: '0%',
          orient: 'horizontal',
          left: 'center',
          data: []
        },
        grid: {
          top: '10%',
          left: '5%',
          right: '5%',
          bottom: '14%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.xAxisData
        },
        yAxis: this.yAxisData,
        series: []
      }
    }
  },
  computed: {
    legendData() {
      return (this.seriesData || []).map(ele => ele.name)
    },
    series() {
      return (this.seriesData || []).map(ele => {
        if (!ele.type || ele.type === '') ele.type = 'bar'
        return ele
      })
    }
  },
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
        this.options.xAxis.data = this.xAxisData
        this.options.series = this.series
        const legend = this.legendData
        if (this.showLegend && legend.length > 1) {
          this.options.legend.data = this.legendData
        }
        if (!this.showLegend) this.options.grid.bottom = '6%'
      } else {
        this.options = this.chartOptions
      }
      if (this.echartInstance) this.echartInstance.clear()
      this.echartInstance = this.$echarts.init(this.$refs.barChart)
      this.echartInstance.setOption(this.options)
    }
  }
}
</script>

<style lang="scss" scoped>
.med-bar-chart-wrapper {
  height: 100%;
  display: flex;
  justify-content: stretch;
  align-items: stretch;
  flex: 1;
  &-chart {
    flex-grow: 1;
  }
}
</style>
