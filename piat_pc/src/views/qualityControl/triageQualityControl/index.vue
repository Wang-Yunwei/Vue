<template>
  <div class="triageQualityControl-wrapper">
    <triage-menu current="triageQualityControl" />
    <a-layout id="components-layout-demo-custom-trigger">
      <a-layout-sider class="part-left" v-model="collapsed" :trigger="null" collapsible>
        <a-menu
          class="side-menu"
          :default-selected-keys="['1']"
          :open-keys.sync="activeTabKey"
          mode="inline"
          @click="handleClick"
        >
          <a-menu-item key="1">
            急诊各级患者比例
          </a-menu-item>
          <a-menu-item key="2">
            分诊正确率报表
          </a-menu-item>
          <a-menu-item key="3">
            急诊科医护患比
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout class="part-right">
        <component :is="currentComponent" />
      </a-layout>
    </a-layout>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import TriageMenu from './../components/triageMenu.vue'
import accuracyReport from './pages/accuracyReport.vue'
import doctorPatientRatio from './pages/doctorPatientRatio.vue'
import patientProportionReport from './pages/patientProportionReport.vue'
import { queryByCodeList } from '@/api'
export default {
  name: 'TriageQualityControl',
  components: {
    TriageMenu
  },
  data() {
    const codeList = [
      'gender' //性别
    ]
    return {
      collapsed: false,
      activeTabKey: ['1'],
      tabComponents: [patientProportionReport, accuracyReport, doctorPatientRatio]
    }
  },
  computed: {
    ...mapGetters(['hospitalId']),
    currentComponent() {
      const idx = Number(this.activeTabKey) - 1
      return this.tabComponents[idx]
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
  methods: {
    handleClick(e) {
      this.activeTabKey = [e.key]
    }
  }
}
</script>
<style lang="less" scoped>
.triageQualityControl-wrapper {
  .part-left {
    background: #fff;
    margin-right: 10px;
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
    // background: #fff;
  }
}
</style>
