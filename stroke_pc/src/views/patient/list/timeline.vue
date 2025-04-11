<template>
  <div>
    <el-row class="descriptions">
      <el-col :span="6">患者姓名: {{ patient.name }}</el-col>
      <el-col
        :span="6"
      >患者性别: {{ convert(patient.gender, dic.gender) }}</el-col>
      <el-col :span="6">患者年龄: {{ patient.age }}</el-col>
      <el-col :span="6">联系方式: {{ patient.ecPhone }}</el-col>
    </el-row>
    <el-row class="descriptions">
      <el-col :span="6">诊断: {{ convert(patient.diag, dic.diag) }}</el-col>
      <el-col :span="6">门诊号: {{ patient.outPatientNo }}</el-col>
      <el-col :span="6">住院号: {{ patient.admissionNo }}</el-col>
      <el-col :span="6">接诊时间: {{ patient.createTime }}</el-col>
    </el-row>
    <el-divider />
    <ul class="timeline-wrapper">
      <li
        v-for="group in dateGroups"
        :key="group.key"
        class="date-row flex-c-s"
      >
        <div class="date">
          <div>{{ group.year }}</div>
          <p>{{ group.date }}</p>
        </div>
        <ul class="time-groups">
          <li
            v-for="(nodeGroup, index) in group.timeNodesGroup"
            :key="index"
            class="time-group flex-c-s"
          >
            <div v-for="(node, idx) in nodeGroup" :key="idx" class="time-node">
              <p>{{ node.time }}</p>
              <p>{{ node.nodeName }}</p>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import patientApi from '@/api/patient'
import moment from 'moment'

export default {
  name: 'Timeline',
  filters: {
    DateTimeFormat(val) {
      return moment(val).format('YYYY-MM-DD HH:mm')
    }
  },
  props: {
    dic: {
      type: Object,
      default: () => {}
    },
    patient: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      timelines: [],
      dateGroups: []
    }
  },
  computed: {},
  created() {
    this.getTimeline(this.patient.registId)
  },
  methods: {
    genGroup() {
      const groups = []
      this.timelines.forEach(({ id, timeValue, nodeName }) => {
        const [year, date, time] = moment(timeValue)
          .format('YYYY MM-DD HH:mm')
          .split(' ')
        const timeNode = { id, nodeName, time }
        const group = groups.find((g) => g.year === year && g.date === date)
        if (group) {
          group.timeNodes.push(timeNode)
        } else {
          groups.push({
            key: year + date,
            year,
            date,
            timeNodes: [timeNode]
          })
        }
      })
      groups.forEach((g) => {
        const timeNodesGroup = []
        // 8个一行
        const colNum = 8
        for (let i = 0; i < Math.ceil(g.timeNodes.length / colNum); i++) {
          timeNodesGroup.push(g.timeNodes.slice(i * colNum, (i + 1) * colNum))
        }
        g.timeNodesGroup = timeNodesGroup
      })
      this.dateGroups = groups
    },
    convert(value, dic) {
      if (!value) return ''
      if (!dic || !Array.isArray(dic)) return value
      value = value.toString()
      return (dic.find((v) => v.value === value) || { label: '' }).label
    },
    // 获取患者时间轴
    async getTimeline(registId) {
      const res = await patientApi.getTimeline(registId)
      this.timelines = res.result
      console.log('时间轴返回为', this.timelines)
      this.genGroup()
    }
  }
}
</script>

<style lang="scss" scoped>
.descriptions {
  margin-bottom: 20px;
}

$blue: #6174fb;

ul {
  padding: 0;
  margin: 0;
}
.timeline-wrapper {
  max-height: 72vh;
  min-height: 116px;
  overflow: auto;
  .date-row {
    // 按天分块
    color: $blue;
    position: relative;
    padding-right: 14px;
    // box-shadow: 0 0 2px;
    &::after {
      // 时间轴灰色竖线
      content: '';
      position: absolute;
      left: 24px;
      bottom: -18px;
      display: block;
      width: 1px;
      height: calc(100% - 62px);
      min-height: 36px;
      background: #ddd;
    }
    &:last-child {
      // 防止一条数据也出滚动条
      margin-bottom: 20px;
    }
    .date {
      // 左侧年月
      padding-top: 30px;
      align-self: baseline;
      font-size: 15px;
      line-height: 1.2;
      width: 50px;
      text-align: center;
      p {
        font-size: 16px;
        font-weight: bold;
        margin: 0;
      }
    }
    .time-groups {
      // 右侧容器
      flex: 1;
      margin-left: 20px;
      .time-group {
        // 时间线一行
        position: relative;
        &:not(:first-child):before {
          // 左侧纵向虚线
          content: '';
          position: absolute;
          z-index: 2;
          display: block;
          width: 0px;
          height: 97px;
          top: -48px;
          left: 0;
          border-right: 1px dashed $blue;
        }
        &:nth-child(even) {
          // 偶数行反向排列
          flex-flow: row-reverse;
          &:before {
            // 右侧纵向虚线
            right: 0;
            width: 0;
            left: unset;
          }
        }
        &:last-child {
          .time-node:last-child::after {
            // 末尾小箭头
            content: '';
            position: absolute;
            width: 6px;
            height: 6px;
            top: calc(50% - 3px);
            right: -6px;
            transform: rotate(-45deg);
            box-shadow: -1px -1px 0px $blue inset, 2px 2px 0px #fff,
              3px 3px 0px $blue;
          }
          &:nth-child(even) .time-node:last-child::after {
            // 反方向小箭头
            right: unset;
            left: -6px;
            transform: rotate(135deg);
          }
        }
        .time-node {
          // 时间节点
          // box-shadow: 0px 0px 1px;
          width: 12.5%;
          position: relative;
          font-weight: bold;
          p {
            // 文字
            text-align: center;
            margin: 0;
            height: 48px;
            padding: 17px 6px 0 6px;
            & + p {
              // 横向虚线
              border-top: 1px dashed $blue;
              position: relative;
              padding-top: 14px;
              &::before {
                // 圆点
                content: '';
                display: block;
                background: $blue;
                width: 18px;
                height: 18px;
                position: absolute;
                border-radius: 100%;
                border: 5px solid #fff;
                top: -9px;
                left: calc(50% - 9px);
              }
            }
          }
        }
      }
    }
    &:last-child .time-group:last-child {
      .time-node:last-child::after {
        // 终点
        content: '结束';
        position: absolute;
        font-weight: bold;
        top: calc(50% - 8px);
        font-size: 14px;
        right: -32px;
        color: orange;
        transform: none;
        width: auto;
        height: auto;
        box-shadow: none;
      }
      &:nth-child(even) .time-node:last-child::after {
        // 反向的终点
        right: unset;
        left: -32px;
        transform: none;
      }
    }
  }
}
</style>
