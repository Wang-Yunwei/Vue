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
    data: {
      immediate: true,
      handler(v) {
        if (v?.length) {
          this.initChart()
        }
      }
    }
  },
  methods: {
    async initChart() {
      this.chart = this.$echarts.init(this.$refs.chart)
      // 指定图表的配置项和数据
      const option = {
        title: {
          text: '出车情况统计',
          subtext: '',
          left: 'left'
        },
        legend: {
          data: ['出车次数']
        },
        xAxis: {
          type: 'category',
          data: this.data.map((el) => {
            const [[key, value]] = Object.entries(el)
            return key
          })
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.data.map((el) => {
              const [[key, value]] = Object.entries(el)
              return value
            }),
            name: '出车次数',
            type: 'line'
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
