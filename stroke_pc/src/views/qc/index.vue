<template>
  <div class="qc-wrapper">
    <el-row>
      <QC-search @onSearch="getRecordQuality" />
    </el-row>
    <el-row v-if="qcFlag">
      <metrics :metrics-data="metricsData" />
    </el-row>
    <el-row>
      <el-tabs
        v-model="activeName"
        stretch
        type="border-card"
        style="margin: 0 20px; border-radius: 6px"
      >
        <el-tab-pane label="质控分析" name="qc">
          <analyse v-if="activeName === 'qc'" ref="analyse" :analyse-data="qcAnalysis" />
        </el-tab-pane>
        <el-tab-pane label="数据统计" name="dc">
          <detail v-if="activeName === 'dc'" :detail-data="detailData" />
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </div>
</template>

<script>
import QCSearch from '@/views/qc/QCSearch'
import Metrics from '@/views/qc/Metrics'
import Detail from '@/views/qc/Detail'
import qualityApi from '@/api/quality'
import storage from 'store'
import Analyse from '@/views/qc/analyse'
import { mapGetters } from 'vuex'

export default {
  name: 'Qc',
  components: { Analyse, QCSearch, Metrics, Detail },
  data() {
    return {
      activeName: 'qc',
      qcFlag: false,
      dic: storage.get('dicData'),
      metricsData: {
        gcPatients: 0,
        strokePatients: 0,
        ischemicStrokePatients: 0,
        rsPatients: 0,
        pciPatients: 0,
        bridgingPatients: 0,
        dntMedian: 0,
        dptMedian: 0
      },
      detailData: {
        distribution: {
          maleByAge: '',
          femaleByAge: ''
        },
        decisions: {
          diagStat: '',
          whereaboutsStat: '',
          disposeStat: ''
        },
        rs: {
          ischemicMonthly: '',
          rsPatientMonthly: '',
          dntMedianList: '',
          dntAverageList: '',
          ontMedianList: '',
          ontAverageList: ''
        },
        therapy: {
          dptMedianList: '',
          dptAverageList: '',
          drtAverageList: ''
        }
      },
      qcAnalysis: {
        dateType: '',
        beginTime: '',
        endTime: '',
        dntReachRate: [],
        ottReachRate: [],
        dptReachRate: [],
        drtReachRate: [],
        skullCtRate: [],
        lisReportTimeRate: [],
        deathRate: []
      }
    }
  },
  computed: {
    ...mapGetters(['hospitalId', 'curHospitalArea'])
  },
  methods: {
    getRecordQuality(qcSearchParam) {
      this.qcAnalysis.dateType = qcSearchParam.dateType
      this.qcAnalysis.beginTime = qcSearchParam.beginTime
      this.qcAnalysis.endTime = qcSearchParam.endTime
      qualityApi.getRecordQuality({
        hospitalIds: [this.hospitalId],
        hospitalAreas: [this.curHospitalArea],
        ...qcSearchParam
      }).then((res) => {
        if (res.status === 200) {
          this.metricsData.gcPatients = res.result.gcPatients
          this.metricsData.strokePatients = res.result.strokePatients
          this.metricsData.ischemicStrokePatients =
            res.result.ischemicStrokePatients
          this.metricsData.rsPatients = res.result.rsPatients
          this.metricsData.pciPatients = res.result.pciPatients
          this.metricsData.bridgingPatients = res.result.bridgingPatients
          this.metricsData.dntMedian = res.result.dntMedian
          this.metricsData.dptMedian = res.result.dptMedian
          this.detailData.distribution.maleByAge = res.result.maleByAge
          this.detailData.distribution.femaleByAge = res.result.femaleByAge
          this.detailData.decisions.diagStat = res.result.diagStat
          this.detailData.decisions.whereaboutsStat =
            res.result.whereaboutsStat.map((ele) => {
              if (ele.name === '-1') {
                return {
                  ...ele,
                  name: '未填写'
                }
              }
              const matched = this.dic.whereabouts?.find(
                (item) => item.value === ele.name
              )
              return {
                ...ele,
                name: matched.label
              }
            })
          this.detailData.decisions.disposeStat = res.result.disposeStat
          this.detailData.rs.ischemicMonthly = res.result.ischemicMonthly
          this.detailData.rs.rsPatientMonthly = res.result.rsPatientMonthly
          this.detailData.rs.dntMedianList = res.result.dntMedianList
          this.detailData.rs.dntAverageList = res.result.dntAverageList
          this.detailData.rs.ontMedianList = res.result.ontMedianList
          this.detailData.rs.ontAverageList = res.result.ontAverageList
          this.detailData.rs.dntByTimeList = res.result.dntByTimeList
          this.detailData.therapy.bridgingMonthly = res.result.bridgingMonthly
          this.detailData.therapy.pciMonthly = res.result.pciMonthly
          this.detailData.therapy.dptMedianList = res.result.dptMedianList
          this.detailData.therapy.dptAverageList = res.result.dptAverageList
          this.detailData.therapy.drtAverageList = res.result.drtAverageList
          this.detailData.therapy.ischemicMonthly = res.result.ischemicMonthly
          this.qcAnalysis.dntReachRate = res.result.dntReachRate
          this.qcAnalysis.ottReachRate = res.result.ottReachRate
          this.qcAnalysis.dptReachRate = res.result.dptReachRate
          this.qcAnalysis.drtReachRate = res.result.drtReachRate
          this.qcAnalysis.skullCtRate = res.result.skullCtRate
          this.qcAnalysis.lisReportTimeRate = res.result.lisReportTimeRate
          this.qcAnalysis.deathRate = res.result.deathRate

          this.qcFlag = true

          this.$refs.analyse.getRatePage()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
