<template>
  <med-view-container @return="jumpToDetails" title="调阅" wide>
    <template #right>
      <van-popover
        v-model="showMoreActions"
        trigger="click"
        placement="bottom-end"
        :actions="[
          {
            icon: 'notes-o',
            text: '病历'
          }
        ]"
        :offset="[18, 8]"
        @select="onSelectMoreActions"
      >
        <template #reference>
          <i class="iconfont iconicon1-151" style="font-size: 0.6rem" />
        </template>
      </van-popover>
    </template>
    <patient-info
      v-bind="patientInformation"
      :dic="dicData"
      :viewMode="true"
      @changed="getBasicInfo(registId, false)"
      @rfTagIdChange="rfTagIdChange"
    />
    <div class="scroll-view">
      <van-tabs v-model="active" sticky color="#5e74fe" :lazy-render="false">
        <van-tab
          v-for="(item, index) in tabList"
          :title="item.name"
          :key="index"
        >
          <component
            v-show="active === index"
            :is="item.part"
            @hiddenChange="hiddenChange(item.name)"
          />
        </van-tab>
      </van-tabs>
    </div>
  </med-view-container>
</template>
<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { Step, Steps } from 'vant'
import * as parts from './parts'
import PatientInfo from '@/views/gc/detail/task/components/PatientInfo'
import basicInfoMixin from '@mixins/basicInfoMixin'

Vue.use(Step)
Vue.use(Steps)
export default {
  name: 'overview',
  mixins: [basicInfoMixin],
  components: { PatientInfo, ...parts },
  data() {
    return {
      hiddenTabs: [],
      active: 6,
      details: {},
      hiddenArray: ['2', '4', '5'],
      showMoreActions: false
    }
  },
  computed: {
    ...mapGetters(['dicData', 'patientInfo']),
    registId() {
      return this.$route.query.registId
    },
    tabList() {
      const all = [
        {
          name: '急救病历',
          part: parts.FirstAid,
          hidden: this.hiddenArray.includes(this.patientInfo.comingType)
        },
        { name: '预检分诊', part: parts.Triage },
        // { name: '绿通病历', part: parts.GcCaseHistory },
        { name: '检查', part: parts.Examination },
        { name: '检验', part: parts.Inspection },
        { name: '用药', part: parts.Medication }
      ]

      return all.filter(el => !el.hidden)
    }
  },
  created() {
    this.getBasicInfo(this.registId, false)
  },
  methods: {
    rfTagIdChange(id) {
      // 腕带号变化
      this.$set(this.details, 'rfTagId', id)
    },
    hiddenChange(tabName) {
      if (tabName && !this.hiddenTabs.includes(tabName)) {
        this.hiddenTabs.push(tabName)
      }
    },
    // 返回主页面
    jumpToDetails() {
      this.$router.push({
        path: '/gc',
        query: { registId: this.registId }
      })
    },
    onSelectMoreActions(e) {
      if (e.text === '病历') {
        const { registId, infoComingType, emId, regNo } = this.$route.query
        this.$router.push({
          path: '/gc/detail',
          query: {
            registId,
            regNo,
            infoComingType,
            emId
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
