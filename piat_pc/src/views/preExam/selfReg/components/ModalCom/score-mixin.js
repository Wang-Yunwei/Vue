import moment from 'moment'
import { Line } from '@antv/g2plot'
import { queryScoreList, removeSingleScore } from '@/api/preExam/score'
export default {
  methods: {
    // 获取表格数据
    async loadData() {
      const cfg = {
        xField: 'dateTime',
        yField: 'degreeResult',
        lineStyle: {
          stroke: '#444FDB'
        },
        point: {
          size: 5,
          shape: 'diamond',
          style: {
            fill: 'white',
            stroke: '#444FDB',
            lineWidth: 2
          }
        },
        state: {
          active: {
            style: {
              shadowBlur: 4,
              stroke: '#000',
              fill: 'red'
            }
          }
        },
        yAxis: {
          line: {
            style: {
              lineWidth: 4,
              cursor: 'pointer'
            }
          },
          tickInterval: 6
        },
        tooltip: { showMarkers: false },
        interactions: [{ type: 'marker-active' }]
      }
      if (this.regId) {
        return queryScoreList(this.regId, this.vulnusType).then(res => {
          const obj = {
            current: 1,
            size: 10,
            total: 50,
            records: res.body
          }
          cfg.data = res.body.map(item => {
            return {
              ...item,
              dateTime: moment(item.operatorTime).format('YYYY-MM-DD HH:mm:ss')
            }
          })
          this.initCharts(cfg)
          return obj
        })
      }

      return {
        current: 1,
        size: 10,
        total: 0,
        records: []
      }
    },
    initCharts(cfg) {
      const plot = new Line('container', { ...cfg })
      plot.render()
    },
    //   删除单个历史记录
    async removeSingleScore(record) {
      const res = await removeSingleScore([record.vdId])
      if (res.body) {
        this.$notification.success({ message: '删除成功' })
        if (this.$refs.historyTable) {
          this.$refs.historyTable.refresh()
        }
      } else {
        this.$notification.error({
          message: '删除失败',
          description: res.message
        })
      }
    }
  }
}
