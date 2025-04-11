<template>
  <div class="task-basic-info-wrapper">
    <div class="top-block">
      <div class="flex-c-b">
        <p v-for="item in countdown.list" :key="item.name">
          <span :style="`color:${item.color === '1' ? 'red' : 'inherit'}`">{{
            item.timeValue
          }}</span>
          <span>min</span>
          <span>{{ item.nodeName }}</span>
        </p>
      </div>
    </div>
    <div class="time-axis">
      <ul
        class="time-axis__content van-tabs__content"
        v-if="dataSource && dataSource.length"
      >
        <li
          class="time-axis__item"
          v-for="item in dataSource"
          :key="item.nodeName"
        >
          <div class="flex-c-s">
            <van-icon :name="item.timeValue ? 'clock' : 'clock-o'" />
            <div class="time-axis__title">
              <p>{{ item.nodeName }}</p>
            </div>
            <div class="time-axis__time">
              <template>
                <div>
                  {{
                    item.timeValue
                      ? $moment(item.timeValue).format("YYYY-MM-DD HH:mm")
                      : ""
                  }}
                </div>
              </template>
            </div>
          </div>
          <div class="time-details">
            <p
              v-for="timeDiff in item.timeDiffs"
              :key="timeDiff.name"
              :style="{ color: timeDiff.color }"
            >
              <span>
                {{ timeDiff.name }}
              </span>
              <span>
                {{ timeDiff.value }}{{ timeDiff.value ? "min" : "" }}
              </span>
            </p>
          </div>
        </li>
      </ul>
      <van-empty
        :image="require('@assets/image/empty.png')"
        description="暂无数据"
        v-if="!dataSource || !dataSource.length"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import timeCollection from '@views/gc/timeManagement/timeCollection/index'

export default {
  name: 'Timeline',
  components: { timeCollection },
  data() {
    return {
      registId: this.$route.query.registId,
      edittingItem: {},
      dataSource: [],
      countdown: {
        isArchived: '', // 是否归档
        list: []
      },
      timeline: {
        id: '',
        entityClassMapping: '',
        editable: '',
        fieldName: '',
        isCorrectOrder: '',
        nodeName: '',
        order: '',
        tableName: '',
        timeValue: '',
        countdownName: '',
        countdownTime: '',
        countdowncolor: '',
        timeDiffs: []
      }
    }
  },
  created() {
    this.getDiagnosisTime()
    this.getCountdown()
  },
  computed: {
    ...mapGetters(['missionId'])
  },
  methods: {
    // 获取时间轴
    getDiagnosisTime() {
      this.$api.timeManagement.getTimeline(this.registId).then(res => {
        this.dataSource = res.result
        this.$forceUpdate()
      })
    },
    getCountdown() {
      this.$api.timeManagement.getCountdown(this.registId).then(res => {
        this.countdown = res.result
      })
    },
    onEdit(newVal, item) {
      this.timeline = item
      this.timeline.entityClassMapping = item.tableName
      this.entityClassMapping = this.$api.timeManagement
        .updateTimeline(this.timeline)
        .then(res => {})
      this.getDiagnosisTime()
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
