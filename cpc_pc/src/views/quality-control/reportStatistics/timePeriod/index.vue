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
            type: 'value',
            name: '分'
          }
        ],
        seriesData: []
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

      this.docData.seriesData = []
      for (let i = 0; i < param.patientType.length; i++) {
        const data = []
        let color = ''
        if (param.patientType[i] === 'D2W') {
          color = '#409EFF'
          for (let j = 0; j < this.docData.xAxisData.length; j++) {
            const numData = Math.floor(Math.random() * 130) + 70
            data.push(numData)
          }
        } else if (param.patientType[i] === 'FMC2ECG') {
          color = '#67C23A'
          for (let j = 0; j < this.docData.xAxisData.length; j++) {
            const numData = Math.floor(Math.random() * 12) + 3
            data.push(numData)
          }
        } else if (param.patientType[i] === 'FMC2W') {
          color = '#E6A23C'
          for (let j = 0; j < this.docData.xAxisData.length; j++) {
            const numData = Math.floor(Math.random() * 120) + 80
            data.push(numData)
          }
        } else {
          color = '#909399'
          for (let j = 0; j < this.docData.xAxisData.length; j++) {
            const numData = Math.floor(Math.random() * 70) + 30
            data.push(numData)
          }
        }
        const series = {
          name: param.patientType[i],
          type: 'line',
          data: data,
          lineStyle: {
            color: color
          },
          itemStyle: {
            color: color
          }
        }
        this.docData.seriesData.push(series)
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
