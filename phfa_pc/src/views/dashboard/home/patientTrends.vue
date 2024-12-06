<template>
  <div ref="chart" style="width: 100%; height: 320px" />
</template>

<script>
import { mapGetters } from 'vuex'
import { dicConstant as dic } from '@/constant'
import { qcPatient } from '@/api/qc'

export default {
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
  mounted() {
    this.initChart()
  },
  methods: {
    // 获取统计数据
    async getData() {
      const res = await qcPatient()
      const list = res.body || []
      const result = {
        dateList: [],
        valueList: []
      }
      list.forEach((el) => {
        const [[date, val]] = Object.entries(el)
        result.dateList.push(date)
        result.valueList.push(val)
      })
      return result
    },
    async initChart() {
      this.chart = this.$echarts.init(this.$refs.chart)
      const { dateList, valueList } = await this.getData()

      // 指定图表的配置项和数据
      const option = {
        // Make gradient line here
        visualMap: [
          {
            show: false,
            type: 'continuous',
            seriesIndex: 0,
            min: 0,
            max: 200,
            inRange: {
              color: ['#ffe319', '#ff5959']
            }
          }
        ],
        title: {
          text: '患者趋势图',
          subtext: '',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          }
        ],
        xAxis: [
          {
            data: dateList
          }
        ],
        yAxis: [{}],
        grid: [
          {
            bottom: '60%'
          }
        ],
        series: [
          {
            type: 'line',
            showSymbol: false,
            data: valueList
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
