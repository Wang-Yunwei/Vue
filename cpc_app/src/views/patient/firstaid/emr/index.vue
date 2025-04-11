<template>
  <med-view-container @return="jumpToDetails" title="急救病历">
    <div class="med-view-wrapper scroll-view">
      <medical-record />
    </div>
  </med-view-container>
</template>
<script>
import Vue from 'vue'
import { Step, Steps } from 'vant'
import * as parts from './parts'
import dictionariesMixin from '@mixins/dictionariesMixin'

Vue.use(Step)
Vue.use(Steps)
export default {
  name: 'overview',
  mixins: [dictionariesMixin],
  components: { ...parts },
  data() {
    return {
      active: 6,
      tabList: [
        { name: '患者病历', part: parts.medicalRecord },
        { name: '时间轴', part: parts.Timeline },
        { name: '地图', part: parts.mapl },
        { name: '会诊', part: parts.consultation }
      ]
    }
  },
  computed: {
    businessId() {
      return this.$route.query.businessId
    }
  },

  methods: {
    // 返回主页面
    jumpToDetails() {
      this.$router.push({
        path: '/patient/firstaid'
      })
    }
  },
  watch: {
    $route: {
      immediate: false,
      handler() {
        if (this.$route.path === '/patient/firstaid') {
          this.active = 0
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
.scroll-view > div {
  max-height: calc(100vh - 2.2rem);
  overflow: auto;
}
</style>
