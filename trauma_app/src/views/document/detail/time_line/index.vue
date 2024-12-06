<template>
  <div class="time-axis" style="overflow: auto;height: calc(100vh - 5.9rem);">
    <ul class="van-tabs__content" v-if="form && form.length">
      <li class="time-axis__item" v-for="(item, index) in form" :key="index">
        <div style="display: flex;">
          <van-icon :name="item.value ? 'clock' : 'clock-o'" class="time-axis__icon" />
          <div style="flex: 1;display: flex;margin-top: 0.1rem;font-size: 0.38rem;">
            <div style="flex: 1;">
              <p style="line-height: 20px;">{{ item.name }}</p>
              <p v-if="item.timeDifferenceVO" :style="{
                'line-height': '20px',
                'font-size': '0.38rem',
                'display': 'flex',
                'color': (item.timeDifferenceVO.value || '').includes('-') > 0 ? 'red' : 'rgb(94,116,254)'
              }">
                {{ item.timeDifferenceVO.name }}
              </p>
            </div>
            <div style="flex: 1;margin-left: 0.1rem;">
              <p style="line-height: 20px;">{{ item.value }}</p>
              <p v-if="item.timeDifferenceVO" :style="{
                'line-height': '20px',
                'font-size': '0.38rem',
                'display': 'flex',
                'color': (item.timeDifferenceVO.value || '').includes('-') > 0 ? 'red' : 'rgb(94,116,254)'
              }">
                {{ item.timeDifferenceVO.value }}
              </p>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <van-empty :image="require('@assets/image/empty.png')" description="暂无数据" v-else />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      form: []
    }
  },
  mounted() {
    this.selectTimeAxis()
  },
  computed: {
    ...mapGetters(['registId'])
  },
  methods: {
    selectTimeAxis() {
      this.$api
        .selectTimeAxis({
          registId: this.registId,
          sign: 0
        })
        .then(res => {
          if (res.code === '000000') {
            this.form = res.body
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>
@import "@/assets/styles/common/time/time-axis";
</style>
