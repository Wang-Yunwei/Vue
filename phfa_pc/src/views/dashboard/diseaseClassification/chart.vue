<template>
  <div ref="chart" style="width: 100%; height: 680px" />
</template>

<script>
import { mapGetters } from 'vuex'
import { dicConstant as dic } from '@/constant'
import { qcDiseaseEntities } from '@/api/qc'
export default {
  name: 'Chart',
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
    async getData(params) {
      const res = await qcDiseaseEntities({ ...params, missionStatus: '06' })
      const seriesData = (res.body || []).map((el) => {
        const [[name, value]] = Object.entries(el)
        return {
          name,
          value
        }
      })
      // const seriesData = [
      //   { name: '创伤-交通事故', value: Math.round(Math.random() * 1000) },
      //   { name: '创伤-高坠', value: Math.round(Math.random() * 1000) },
      //   { name: '其他', value: Math.round(0 * 1000) }
      // ]
      return {
        legendData: seriesData.map((el) => el.name),
        seriesData: seriesData
      }
    },
    async initChart() {
      this.chart = this.$echarts.init(this.$refs.chart)
      const data = await this.getData()

      // 指定图表的配置项和数据
      const option = {
        title: {
          text: '病种分类统计表',
          subtext: '',
          left: 'left'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: data.legendData
        },
        series: [
          {
            name: '病种',
            type: 'pie',
            radius: '55%',
            center: ['40%', '50%'],
            data: data.seriesData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
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
