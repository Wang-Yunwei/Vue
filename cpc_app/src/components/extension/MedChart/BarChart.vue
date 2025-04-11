<template>
  <div class="med-chart-wrapper">
    <van-cell v-bind="$props">
      <template #title>
        <div class="title">{{ title }}</div>
      </template>
      <template #label>
        <div class="med-chart-wrapper-body">
          <div ref="barChart" class="med-chart-wrapper-chart"></div>
        </div>
      </template>
    </van-cell>
  </div>
</template>

<script>
import T from 'vant/es/cell/index'

export default {
  name: 'med-chart',
  inheritAttrs: false,
  props: {
    ...T.props,
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
    showSerieLabel: {
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
  model: {
    prop: 'fValue',
    event: '_change'
  },
  data() {
    return {
      echartInstance: null,
      options: {
        legend: {
          bottom: '0%',
          orient: 'horizontal',
          left: 'center',
          data: []
        },
        tooltip: {
          trigger: 'item'
        },
        grid: {
          top: '13%',
          left: '5%',
          right: '5%',
          bottom: '25%',
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
        if (!this.showLegend) this.options.grid.bottom = '2%'
      } else {
        this.options = this.chartOptions
      }
      if (this.echartInstance) this.echartInstance.clear()
      this.echartInstance = this.$echarts.init(this.$refs.barChart)
      this.echartInstance.setOption(this.options)
    }
  },
  computed: {
    legendData() {
      return (this.seriesData || []).map(ele => ele.name)
    },
    series() {
      return (this.seriesData || []).map(ele => {
        if (!ele.type || ele.type === '') ele.type = 'bar'
        if (!ele.label && this.showSerieLabel) {
          ele.label = {
            show: true,
            position: 'top'
          }
        }
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
  }
}
</script>

<style lang="less" scoped>
.med-chart-wrapper {
  z-index: 999;
  .van-cell {
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
    .title {
      padding: 0 12px;
    }
    .van-cell__title,
    .van-cell__label {
      margin-right: 0 !important;
      max-width: none !important;
    }
  }
  &-body {
    padding: 0px 0px;
  }
  &-chart {
    min-height: 480px;
  }
}
</style>
