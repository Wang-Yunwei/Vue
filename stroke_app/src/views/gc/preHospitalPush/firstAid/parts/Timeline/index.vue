<template>
  <div class="time-axis">
    <ul
      class="time-axis__content van-tabs__content"
      v-if="dataSource && dataSource.length"
    >
      <li
        class="flex-c-s time-axis__item"
        v-for="item in dataSource"
        :key="item.nodeName"
      >
        <van-icon :name="item.timeValue ? 'clock' : 'clock-o'" />
        <div class="time-axis__title">
          <p>{{ item.nodeName }}</p>
          <p class="flex-c-s" :style="{ color: item.countdowncolor }">
            <span>{{ item.countdownName }}</span>
            <span>
              {{ item.countdownTime }}{{ item.countdownTime ? "min" : "" }}
            </span>
          </p>
        </div>
        <div class="time-axis__time">
          <template>
            <div>
              {{ item.timeValue }}
              <med-date-picker
                :disabled="true"
                v-model="item.timeValue"
                class="datepicker"
                clearable
              />
            </div>
          </template>
        </div>
      </li>
    </ul>
    <van-empty
      :image="require('@assets/image/empty.png')"
      description="暂无数据"
      v-if="!dataSource || !dataSource.length"
    />
  </div>
</template>
<script>
import hospitalMixin from '@mixins/hospitalMixin'

export default {
  mixins: [hospitalMixin],
  data() {
    return {
      missionId: this.$route.query.businessId,
      edittingItem: '',
      dataSource: []
    }
  },
  created() {
    this.getTimeAxis()
  },
  methods: {
    async getTimeAxis() {
      this.$api.preHospitalPush
        .getPreHospitalTimeline({
          missionId: this.$route.query.item.missionId,
          hospitalId: this.hospitalAndArea()
        })
        .then(res => {
          this.dataSource = res.result
          if (this.dataSource && this.dataSource.length > 0) {
            this.edittingItem = this.dataSource[0].timeValue
          }
        })
    }
  },
  watch: {
    $route: {
      immediate: false,
      handler(val) {
        this.missionId = val.query.businessId
        if (this.$route.path === '/gc/preHospitalPreview') {
          this.getTimeAxis()
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
