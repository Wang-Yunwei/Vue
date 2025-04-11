<template>
  <div class="med-personnel-wrapper">
    <div class="header">
      <!-- 查询部分 searchbar -->
      <searchbar :show-key-item="true" @doSearch="doSearch" />
    </div>
    <div>
      <statistics :doc-data="docData" />
    </div>
  </div>
</template>

<script>
import searchbar from './searchbar'
import statistics from './statistics.vue'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'CountIndex',
  components: {
    searchbar,
    statistics
  },
  data() {
    return {
      docData: {
        xAxisData: [],
        yAxisData: [
          {
            type: 'value'
          },
          {
            type: 'value',
            alignTicks: true,
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        seriesData: [
          {
            name: '上报量',
            type: 'bar',
            data: []
          },
          {
            name: '同比',
            type: 'line',
            yAxisIndex: 1,
            tooltip: {
              valueFormatter: function(value) {
                return value + '%'
              }
            },
            data: []
          },
          {
            name: '环比',
            type: 'line',
            yAxisIndex: 1,
            tooltip: {
              valueFormatter: function(value) {
                return value + '%'
              }
            },
            data: []
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'hospitalId'
    ])
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    doSearch(param) {
      this.docData.xAxisData = []
      const startTime = moment(param.daterange[0])
      const endTime = moment(param.daterange[1])
      while (startTime <= endTime) {
        this.docData.xAxisData.push(startTime.format('MM') + '月')
        startTime.add(1, 'month')
      }

      this.docData.seriesData[0].data = []
      for (let i = 0; i < this.docData.xAxisData.length; i++) {
        const numData = Math.floor(Math.random() * 9 + 1) * param.patientType.length
        this.docData.seriesData[0].data.push(numData)
      }

      this.docData.seriesData[1].data = []
      if (this.docData.xAxisData.length <= 12) {
        for (let j = 0; j < this.docData.xAxisData.length; j++) {
          const numData = Math.floor(Math.random() * 9 + 1) * param.patientType.length
          this.docData.seriesData[1].data.push(numData)
        }
      } else {
        for (let n = 0; n < 12; n++) {
          const numData = Math.floor(Math.random() * 9 + 1) * param.patientType.length
          this.docData.seriesData[1].data.push(numData)
        }
        for (let m = 12; m < this.docData.seriesData[0].data.length; m++) {
          const dm = this.docData.seriesData[0].data
          this.docData.seriesData[1].data.push(((dm[m] - dm[m - 12]) / dm[m - 12] * 100).toFixed(1))
        }
      }

      this.docData.seriesData[2].data = []
      for (let k = 0; k < this.docData.seriesData[0].data.length; k++) {
        const dk = this.docData.seriesData[0].data
        if (k === 0) {
          this.docData.seriesData[2].data.push(0)
        } else {
          // this.docData.seriesData[2].data.push(Math.floor((dk[k] - dk[k-1]) / dk[k-1] * 100) / 100)
          this.docData.seriesData[2].data.push(((dk[k] - dk[k - 1]) / dk[k - 1] * 100).toFixed(1))
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.med-personnel-wrapper {
  width: 60%;
  margin: 0 auto;
  padding: 24px 24px;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100vh;
  .header {
    padding: 20px 5px 0 5px;
    background-color: #f0f2f5;
  }
}
</style>
