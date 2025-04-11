<template>
  <div class="time-axis">
    <ul class="time-axis__content" v-if="dataSource && dataSource.length">
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
import state from '@store/state/state'
import das from '@constant/das'

export default {
  data() {
    return {
      missionId: this.$route.query.patientHistory.missionId,
      query: {
        sysId: das.sysId,
        hospitalId: state.hospitalId + '_' + state.curHospitalArea
      },
      dataSource: []
    }
  },
  created() {
    this.gettimeAxis()
  },
  methods: {
    async gettimeAxis() {
      this.$api.preHospitalPush
        .gettimeAxis({ ...this.query, missionId: this.missionId })
        .then(res => {
          this.dataSource = res.data
        })
    }
  },
  watch: {
    $route: {
      immediate: false,
      handler(val) {
        this.missionId = val.query.businessId
        if (this.$route.path === '/patient/firstaid') {
          this.gettimeAxis()
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="less">
@import "./index.less";
.time-axis {
  .time-axis__content {
    height: calc(100vh - 270px);
  }
}
</style>
