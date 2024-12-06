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
    ...mapGetters(['dictionary'])
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler(v) {
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
      const xAxisData = []
      const overtimeData = []
      const unfilledData = []
      const filledData = []
      this.data.forEach((el) => {
        const [[hospital, vals]] = Object.entries(el)
        xAxisData.push(hospital)
        overtimeData.push(vals.超时完成数 || 0)
        unfilledData.push(vals.病历未填写任务数 || 0)
        filledData.push(vals.病历填写任务数 || 0)
      })
      const result = { xAxisData, overtimeData, unfilledData, filledData }
      return result
    },
    async initChart() {
      if (!this.isMounted) {
        return
      }
      if (!this.chart) this.chart = this.$echarts.init(this.$refs.chart)
      const { xAxisData, overtimeData, unfilledData, filledData } =
        this.getData()

      // 指定图表的配置项和数据
      const option = {
        title: {
          text: '病历完成率',
          subtext: '',
          left: 'left'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // Use axis to trigger tooltip
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: xAxisData
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '超时完成数',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: overtimeData
          },
          {
            name: '病历未填任务数',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: unfilledData
          },
          {
            name: '病历填写任务数',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: filledData
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
