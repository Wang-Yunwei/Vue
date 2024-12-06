<template>
  <div ref="chart" style="width: 100%; height: 680px" />
</template>

<script>
import { mapGetters } from 'vuex'
import { dicConstant as dic } from '@/constant'
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
      const defaultCityCode = list[0]?.value
      return defaultCityCode
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    // 获取当前区域数据
    getRegionalData() {
      return [
        { name: '吴江区', value: 177 },
        { name: '吴中区', value: 42 },
        { name: '相城区', value: 102 },
        { name: '虎丘区', value: 182 },
        { name: '相城区', value: 102 },
        { name: '苏州工业园区', value: 102 },
        { name: '姑苏区', value: 81 },
        { name: '昆山市', value: 47 },
        { name: '常熟市', value: 67 },
        { name: '太仓市', value: 67 },
        { name: '张家港市', value: 82 }
      ]
    },
    async initChart() {
      if (!this.cityCode) {
        this.$message.error('没有配置默认城市,请先在字典中配置!')
        return
      }
      const json = require('@/assets/geo-json/city/' + this.cityCode + '.json')
      if (json) {
        this.chart = this.$echarts.init(this.$refs.chart)
        const mapName = 'map'
        this.$echarts.registerMap(mapName, json)
        const data = await this.getRegionalData()

        // 指定图表的配置项和数据
        const option = {
          title: {
            text: '区域分析'
          },
          tooltip: {},
          // 这个属性控制地图的多彩板块
          visualMap: {
            show: true,
            min: 0,
            max: 200,
            left: 200,
            bottom: 200,
            text: ['高', '低'], // 文本，默认为数值文本
            calculable: true,
            seriesIndex: [0],
            inRange: {
              color: ['#A5CC82', '#ff0', '#f80', '#d33']
            }
          },
          geo: {
            show: true,
            map: mapName,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            roam: true,
            itemStyle: {
              normal: {
                areaColor: '#031525',
                borderColor: '#3B5077'
              },
              emphasis: {
                areaColor: '#2B91B7'
              }
            }
          },
          series: [
            // 为了与visualMap配对，必须要加上
            {
              name: '区域数量',
              type: 'map',
              map: mapName,
              geoIndex: 0,
              aspectScale: 0.75, // 长宽比
              showLegendSymbol: false, // 存在legend时显示
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false,
                  textStyle: {
                    color: '#fff'
                  }
                }
              },
              roam: true,
              itemStyle: {
                normal: {
                  areaColor: '#031525',
                  borderColor: '#3B5077'
                },
                emphasis: {
                  areaColor: '#2B91B7'
                }
              },
              animation: false,
              data: data
            }
          ]
        }
        //   展示数据
        this.chart.setOption(option)
      }
    }
  }
}
</script>

<style></style>
