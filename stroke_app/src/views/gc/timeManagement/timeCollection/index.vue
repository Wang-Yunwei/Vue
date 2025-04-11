<template>
  <med-view-container @return="backClick" title="时间采集" wide>
    <template #right v-if="!isArchived">
      <i
        class="iconfont iconicon1-13"
        style="font-size: 0.6rem"
        @click="scan"
      />
    </template>
    <patient-info
      v-bind="patientInformation"
      :dic="dicData"
      @changed="getBasicInfo(registId, false)"
    >
      <template #thirdLeft v-if="fromLastHealthyTime">
        <div style="color: #5e74fe">
          {{ fromLastHealthyTime }}
        </div>
      </template>
    </patient-info>
    <div class="scroll-view">
      <van-tabs v-model="active" sticky color="#5e74fe" v-if="tabList.length">
        <van-tab
          v-for="(item, index) in tabList"
          :title="item.name"
          :key="index"
        >
          <component
            v-show="active === index"
            :is="item.part"
            :key="item.name"
          />
        </van-tab>
      </van-tabs>
      <van-empty
        v-else
        :image="require('@assets/image/empty.png')"
        description="未授权或暂无填写数据"
      />
    </div>
  </med-view-container>
</template>

<script>
import * as parts from './parts'
import PatientInfo from '@/views/gc/detail/task/components/PatientInfo'
import timeDiffMixin from '@mixins/timeDiffMixin'
import basicInfoMixin from '@mixins/basicInfoMixin'
import { mapGetters } from 'vuex'
import { comingTypeConst } from '@constant/commonConstant'

export default {
  name: 'timeCollection',
  components: { PatientInfo, ...parts },
  mixins: [timeDiffMixin, basicInfoMixin],
  data() {
    return {
      active: 0,
      registId: this.$route.query.registId,
      comingTypeConst,
      details: {}
    }
  },
  computed: {
    ...mapGetters(['dicData', 'comingType']),
    tabList() {
      return [
        {
          name: '院前',
          part: parts.PreHospital,
          auth: 'mr-firstaid',
          hidden: ![
            this.comingTypeConst.local120,
            this.comingTypeConst.otherHospitalTransfer
          ].includes(this.comingType)
        },
        { name: '分检诊', part: parts.Diagnosis, auth: 'mr-triage' },
        { name: '溶栓', part: parts.Thrombolysis, auth: 'mr-rs' },
        { name: '介入', part: parts.Pci, auth: 'mr-pci' }
      ].filter(item => !item.hidden && this.$entitled(item.auth))
    }
  },
  async created() {
    //    倒计时数据
    this.getBasicInfo(
      this.$route.query.registId,
      false,
      this.startTimerIfNotComplete
    )
  },
  methods: {
    /**
     * 未完成则开始定时器
     */
    startTimerIfNotComplete() {
      if (!this.isArchived) {
        this.startTimer()
      }
    },
    backClick() {
      this.$router.push({
        path: '/gc'
      })
    },
    scan() {
      this.$bridge.callhandler('scanner', { type: ['1'] }, data => {
        const code = this.parseScanQrOrBar(data)
        console.log('扫码返回结果', code)
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
