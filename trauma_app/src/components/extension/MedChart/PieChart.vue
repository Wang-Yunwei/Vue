<template>
  <div class="med-chart-wrapper">
    <van-cell v-bind="$props">
      <template #title>
        <div class="title">{{ title }}</div>
      </template>
      <template #label>
        <div class="med-chart-wrapper-body">
          <div ref="pieChart" class="med-chart-wrapper-chart"></div>
        </div>
      </template>
    </van-cell>
  </div>
</template>

<script>
import T from 'vant/es/cell/index'

export default {
  name: 'med-pie-chart',
  inheritAttrs: false,
  props: {
    ...T.props,
    circular: {
      type: Boolean,
      default: false
    },
    legend: {
      type: Object,
      default: null
    },
    seriesData: {
      type: Array,
      require: false,
      default: () => []
    },
    series: {
      type: Array,
      require: false,
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
          top: 'bottom',
          orient: 'horizontal',
          left: 'center',
          textStyle: {
            fontSize: '12px'
          }
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            bottom: '20%',
            center: ['50%', '40%'],
            avoidLabelOverlap: false,
            label: {
              show: true
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '18px',
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
  created() {},
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      if (!this.chartOptions) {
        if (!this.series) {
          if (this.circular) {
            this.options.series[0].radius = ['40%', '85%']
          }
          this.options.series[0].data = this.seriesData
        } else {
          this.options.series = this.series
        }
      } else {
        this.options = this.chartOptions
      }
      if (this.legend) {
        this.options.legend = this.legend
      }
      if (this.echartInstance) this.echartInstance.clear()
      this.echartInstance = this.$echarts.init(this.$refs.pieChart)
      this.echartInstance.setOption(this.options)
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
    },
    series: {
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
