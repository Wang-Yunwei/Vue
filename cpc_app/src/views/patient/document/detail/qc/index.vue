<template>
  <div class="med-qc-index-wrapper">
    <med-view-container
      @return="jumpToDetails"
      title="病例分析"
      :returnLabel="returnLabel"
      wide
    >
      <div>
        <patient-info :data="patientInfo" :bindBtn="true" />
        <div class="condition">
          <div style="font-size:0.3rem; padding:10px 16px" v-if="rzType == '2'">
            首选再灌注措施:溶栓，次选再灌注措施:转运PPCI、本院PPCI
          </div>
          <van-dropdown-menu>
            <van-dropdown-item
              v-model="query.isUpToStandard"
              :options="indicatorsDic"
              @open="open"
              @close="close"
              ref="dropMenu"
            />
            <van-dropdown-item
              title="关键指标"
              ref="item"
              @open="open"
              @close="close"
            >
              <van-cell center title="关键指标">
                <template #right-icon>
                  <van-switch v-model="swichModel" active-color="#ee0a24" />
                </template>
              </van-cell>
            </van-dropdown-item>
          </van-dropdown-menu>
        </div>
        <div class="scroll-view">
          <!-- <van-pull-refresh v-model="refreshing" @refresh="onRefresh"> -->
          <van-list finished-text="没有更多了">
            <van-row class="main">
              <div
                v-for="item in indexs"
                :key="item.code"
                class="index-card-container"
                v-if="IsShow(item)"
              >
                <index-card :index-value="item" />
              </div>
            </van-row>
          </van-list>
          <!-- </van-pull-refresh> -->
        </div>
      </div>
    </med-view-container>
  </div>
</template>

<script>
import PatientInfo from '@/views/patient/document/detail/patientCard'
import indexCard from './indexCard.vue'
export default {
  name: 'qualityControl',
  components: { PatientInfo, indexCard },
  data() {
    return {
      showLoading: false,
      openUrl: this.$route.query.openUrl,
      returnLabel: this.$route.query.openUrl === '1' ? '关闭' : '返回',
      showTime: false,
      readonly: true,
      swichModel: false,
      query: {
        isKeyIndex: '',
        isUpToStandard: ''
      },
      indicatorsDic: [
        { text: '所有指标', value: '' },
        { text: '正常指标', value: '1' },
        { text: '异常指标', value: '0' }
      ],
      list: [],
      registId: '',
      patientInfo: {},
      indexs: [
        // {
        //   title: '首次医疗接触到ECG时间(FMC2ECG)',
        //   desc: '',
        //   isKey: true,
        //   standardValue: '<=10min',
        //   assetObject: '所有急性胸痛患者',
        //   status: '1',
        //   result: 'NG',
        //   statusDesc: '1小时2分钟',
        //   qcStandardTimeDtoList: [
        //     { title: '首次医疗接触', value: '2022-04-25 14:05' },
        //     { title: '完成首份心电图', value: '2022-04-25 14:05' }
        //   ]
        // }
      ],
      data: {},
      rzType: '1'
    }
  },
  computed: {
    IsShow() {
      return function(item) {
        if (this.swichModel) {
          if (item.isKey !== '1') {
            return false
          }
        }

        if (this.query.isUpToStandard === '') {
          return true
        } else if (this.query.isUpToStandard === '1') {
          return item.status === 1
        }

        return item.status !== 1
      }
    }
  },
  async created() {
    this.getBasicInformation()
  },
  methods: {
    // 倒计时数据
    getBasicInformation() {
      this.registId = this.$route.query.registId
      this.$api.service.getFillInfoAggregate(this.registId).then(res => {
        this.data = res.result
        this.patientInfo = this.buildPatientInfo(this.data)
        this.getIntelligentAnalysis(this.data)

        this.getRzType()
      })
    },
    getIntelligentAnalysis(data) {
      this.$api.service.getQcStandard(data).then(res => {
        if (res.status === 200) {
          this.indexs = res.result
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    },
    getRzType() {
      this.$api.service.getRzType(this.data).then(res => {
        if (res.status === 200) {
          this.rzType = res.result
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    },
    buildPatientInfo(d) {
      if (!d) {
        return {}
      } else {
        return {
          name: d.regist.name,
          gender: d.regist.gender,
          age: d.regist.age,
          comingType: d.admission.comeType,
          diagnosis: d.inspection.diagnosis,
          outpatientNo: d.main.outPatientNo,
          inpatientNo: d.main.admissionNo,
          diseaseTime: d.main.attackTime,
          isTimearea: d.main.isTimearea,
          isAttackUncertain: d.main.isAttackUncertain,
          arriveTime: d.admission.arrivedHospitalTime,
          idcardType: d.regist.idcardType,
          identificationNo: d.regist.identificationNo,
          fmcTime: d.admission.fmcTime,
          birthday: d.regist.birthday,
          prediagnosis: d.prehospital.diagnosis,
          reportNo: d.main.reportNo
        }
      }
    },
    jumpToDetails() {
      if (this.openUrl === '1') {
        this.$bridge.exit()
      } else {
        this.$router.push({
          path: '/index',
          query: {
            type: this.$route.query.type
          }
        })
      }
    },
    open() {
      this.$backhelper.push(() => {
        this.$refs.dropMenu.toggle(false)
        this.$refs.item.toggle(false)
        this.$refs.time.toggle(false)
      })
    },
    close() {
      this.$backhelper.pop()
    },
    onQcChange() {}
  }
}
</script>

<style lang="less" scoped>
.med-qc-index-wrapper {
  .main {
    padding: 8px 24px;
    .index-card-container {
      padding: 8px 0;
      display: flex;
    }
  }
  .scroll-view {
    height: calc(100vh - 550px);
    overflow-y: auto;
  }

  // .van-switch {
  //   font-size: 24px;
  //   height: 50px;
  //   width: 80px;
  //   border: 80px;
  // }

  // /deep/ .van-switch__node {
  //     height: 40px;
  //   width: 40px;
  //   }

  //   /deep/ .van-switch--on .van-switch__node {
  //     transform: translateX(20px);
  //   }
}
</style>
