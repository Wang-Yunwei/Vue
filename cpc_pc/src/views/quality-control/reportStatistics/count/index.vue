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
            name: '例'
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
      let startTime = moment(param.daterange[0])
      const endTime = moment(param.daterange[1])
      while (startTime <= endTime) {
        this.docData.xAxisData.push(startTime.format('MM') + '月')
        startTime.add(1, 'month')
      }

      this.docData.seriesData = []
      for (let i = 0; i < param.patientType.length; i++) {
        const data = []
        for (let j = 0; j < this.docData.xAxisData.length; j++) {
          const numData = Math.floor(Math.random() * 9 + 1) * param.patientType.length
          data.push(numData)
        }
        const series = {
          name: param.patientType[i],
          type: 'line',
          data: data,
          lineStyle: {
            color: this.checkColor(param.patientType[i]),
          },
          itemStyle: {
            color: this.checkColor(param.patientType[i]),
          }
        }
        this.docData.seriesData.push(series)
      }
    },
    checkColor(type) {
      if (type === 'STEMI') {
        return '#409EFF'
      } else if (type === 'NSTEMI') {
        return '#67C23A'
      } else if (type === 'UA') {
        return '#E6A23C'
      } else if (type === '主动脉夹层') {
        return '#F56C6C'
      } else {
        return '#909399'
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
