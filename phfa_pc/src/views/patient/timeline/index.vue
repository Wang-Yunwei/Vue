<template>
  <div>
    <el-divider content-position="left">
      <span style="color: blue">时间轴</span>
    </el-divider>
    <div class="timeline">
      <el-timeline>
        <el-timeline-item
          v-for="item in timeline"
          :key="item.title"
          placement="bottom"
          :type="timelineValues[item.valueField] ? 'success' : ''"
        >
          {{ item.title }}

          <fuzzy-date-picker
            v-if="
              timelineValues[item.valueField] &&
                timelineValues[item.valueField].includes('~')
            "
            v-model="timelineValues[item.valueField]"
            size="mini"
            is-morb="1"
            :show-switch="false"
            :bordered="false"
            style="width: 100%"
            @input="handleSave"
          />
          <el-date-picker
            v-else
            v-model="timelineValues[item.valueField]"
            class="time-picker"
            size="mini"
            type="datetime"
            placeholder="选择时间"
            value-format="yyyy-MM-dd[T]HH:mm:ss"
            format="yyyy-MM-dd HH:mm"
            @change="handleSave"
          />
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { dicConstant as dic } from '@/constant'
import { getTimeAxis, updateTimeAxis } from '@/api/medicalRecord'

export default {
  data() {
    return {
      dic,
      timelineValues: {}
    }
  },
  computed: {
    ...mapGetters(['dictionary']),
    timeMap() {
      const map = {}(this.dictionary[this.dic.onsetTime] || []).forEach(
        (ele) => {
          map[ele.value] = ele.label
        }
      )
      return map
    },
    missionId() {
      return this.$route.query.missionId
    },
    timeline() {
      return [
        {
          title: '发病时间',
          valueField: 'morbtimearea'
        },
        {
          title: '呼救时间',
          valueField: 'callTime'
        },
        {
          title: '接令时间',
          valueField: 'planVehicleTime'
        },
        {
          title: '出车时间',
          valueField: 'dispatchVehicleTime'
        },
        {
          title: '到达现场时间',
          valueField: 'arrivedSceneTime'
        },
        {
          title: '接触患者时间',
          valueField: 'touchPatientTime'
        },
        {
          title: '离开现场时间',
          valueField: 'leftSceneTime'
        },
        {
          title: '首份心电图时间',
          valueField: 'firstEcgTime'
        },
        {
          title: '首次用药时间',
          valueField: 'firstMedicationTime'
        },
        {
          title: '预警时间',
          valueField: 'earlyWarningTime'
        },
        {
          title: '到达医院时间',
          valueField: 'arrivedHospitalTime'
        },
        {
          title: '交接完成时间',
          valueField: 'shiftTime'
        }
      ]
      // .map((item) => {
      //   return {
      //     title: item.title,
      //     value: this.parseTimeStr(item.value)
      //   }
      // })
    }
  },
  mounted() {
    this.initTimeAxis()
  },
  methods: {
    async handleSave() {
      console.log('handleSave')
      const payload = {
        missionId: this.missionId,
        ...this.timelineValues
      }
      const res = await updateTimeAxis(payload)
      if (res.code === '000000') {
        this.$notify({ type: 'success', message: '保存成功' })
        this.initTimeAxis()
        this.$emit('change')
      } else {
        this.$notify({ type: 'warning', message: res.message })
      }
    },
    // 解析时间
    parseTimeStr(str) {
      if (str && str.includes('~')) {
        // 时间是一个范围
        const [start = '', end = ''] = str.split('~')
        const date = start.slice(0, 10)
        const startHour = start.slice(11, 13)
        const endHour = end.slice(11, 13)
        const key = `${parseInt(startHour)}-${parseInt(endHour)}`
        const timeRange = this.timeMap[key]
        return `${date} ${timeRange}`
      }
      return str || ''
    },
    async initTimeAxis() {
      const res = await getTimeAxis(this.missionId)
      this.timelineValues = res.body
    }
  }
}
</script>

<style lang="scss" scoped>
.timeline ::v-deep .el-timeline-item__node--normal {
  top: 7px;
}
.timeline ::v-deep .el-timeline {
  padding-left: 30px;
}
.time-picker {
  width: 100%;
  ::v-deep .el-input__inner {
    border: none;
    padding-left: 0;
  }
  ::v-deep .el-input__prefix {
    display: none;
  }
}
</style>
