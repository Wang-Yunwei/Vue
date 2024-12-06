<template>
  <div class="patient-info">
    <a-tabs
      class="tabs"
      size="small"
      tab-position="left"
      default-active-key="1"
    >
      <a-tab-pane key="1" tab="患者信息">
        <basic-info />
      </a-tab-pane>
      <a-tab-pane key="4" tab="患者病史">
        <patient-his />
      </a-tab-pane>
      <a-tab-pane key="5" tab="体格检查">
        <physical-examination />
      </a-tab-pane>
      <a-tab-pane key="3" tab="快速检验">
        <fast-check />
      </a-tab-pane>
      <a-tab-pane key="2" tab="专科评估">
        <evaluation />
      </a-tab-pane>
      <a-tab-pane key="7" tab="诊断处理">
        <diagnosis />
      </a-tab-pane>
      <a-tab-pane key="6" tab="救治结果">
        <treatment-results />
      </a-tab-pane>
      <a-tab-pane key="8" tab="交接记录">
        <handover-record />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { Tabs, TabPane } from "ant-design-vue";
import tabs from "./tabs";
// import { baseMixin } from '@/store/app-mixin'
// import { refreshPatientDetail } from '@/api/patient/list'
export default {
  components: {
    ...tabs,
    Tabs,
    TabPane,
  },
  // mixins: [baseMixin],
  props: {
    patientId: {
      // 与$route.params.patientId解耦
      type: String,
    },
  },
  data() {
    return {
      loading: false,
      errors: [],
      dto: {
        missions: {},
        patients: {},
        medRecords: {},
        evaluations: [],
        airInfos: {},
        gisList: [],
        outcome: {},
        drugs: [],
      },
      timelineDto: [],
    };
  },
  computed: {},
  async created() {
    // this.refresh(this.$route.query.id)
  },
  methods: {
    async initPatient(patientId, isRefresh) {
      // const ret = await refreshPatientDetail(patientId,isRefresh)
      // if (ret.code == '0' && ret.result) {
      //   this.dto = ret.result.patientDTO
      // }
    },
    refresh(patientId) {
      this.initPatient(patientId, false);
      this.timer = setInterval(async () => {
        await this.initPatient(patientId, true);
        //每20s刷新一次
      }, 1000 * 20);
    },
    // scrollToField(fieldKey) {
    //   // 找到对应的tab，在进行跳转查找
    //   const labelNode = document.querySelector(`label[for="${fieldKey}"]`)
    //   if (labelNode) {
    //     labelNode.scrollIntoView(true)
    //   }
    // }
  },
};
</script>
<style lang="less" scoped>
@import url("./index.less");
</style>
