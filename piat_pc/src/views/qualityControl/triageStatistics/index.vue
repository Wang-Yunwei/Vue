<template>
  <div class="triageStatistics-wrapper">
    <triage-menu current="triageStatistics" />
    <a-layout id="components-layout-demo-custom-trigger">
      <a-layout-sider class="part-left" :trigger="null" collapsible>
        <a-menu
          class="side-menu"
          :default-selected-keys="['1']"
          :open-keys.sync="activeTabKey"
          mode="inline"
          @click="handleClick"
        >
          <a-menu-item key="1">
            特殊患者接诊统计
          </a-menu-item>
          <a-menu-item key="2">
            来诊时间段分布
          </a-menu-item>
          <a-menu-item key="3">
            病人年龄段分布
          </a-menu-item>
          <a-menu-item key="4">
            来院方式分布
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout class="part-right">
        <a-config-provider :autoInsertSpaceInButton="false">
          <component :is="currentComponent" />
        </a-config-provider>
      </a-layout>
    </a-layout>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TriageMenu from './../components/triageMenu.vue'
import ageDistribution from './pages/ageDistribution.vue'
import receptionStatistics from './pages/receptionStatistics.vue'
import timePeriodDistribution from './pages/timePeriodDistribution.vue'
import toHospitalDistribution from './pages/toHospitalDistribution.vue'
import { queryByCodeList } from '@/api'
export default {
  name: 'TriageStatistics',
  components: {
    TriageMenu
  },
  data() {
    const codeList = [
      'gender' //性别
    ]
    return {
      activeTabKey: ['1'],
      tabComponents: [receptionStatistics, timePeriodDistribution, ageDistribution, toHospitalDistribution]
    }
  },
  async created() {
    //字典表中参数获取
    const res = await queryByCodeList({ codeList: this.codeList, hospitalId: this.hospitalId })
    const obj = {
      gender: res.result.gender //性别
    }
    this.gender = obj.gender
  },
  computed: {
    ...mapGetters(['hospitalId']),
    currentComponent() {
      const idx = Number(this.activeTabKey) - 1
      return this.tabComponents[idx]
    }
  },
  methods: {
    handleClick(e) {
      this.activeTabKey = [e.key]
    }
  }
}
</script>
<style lang="less" scoped>
.triageStatistics-wrapper {
  .part-left {
    background: #fff;
    margin-right: 20px;
    .side-menu {
      height: auto !important;
      line-height: auto !important;
      background: #f0f2f5;
      border: none;
      .ant-menu-item {
        margin-bottom: 10px;
        background: #fff;
        margin-top: 0;
      }
    }
  }
  .part-right {
    background: #fff;
  }
}
</style>
