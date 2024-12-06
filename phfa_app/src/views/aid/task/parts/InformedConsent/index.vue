<template>
  <div class="task-basic-info-wrapper">
    <div class="task-part-title">
      <span class="solid"></span><span>知情同意</span>
    </div>
    <div>
      <van-cell title="知情同意书" :value="consentsStatus" is-link @click="consentsShow = true" />
      <van-cell title="新冠流调表" :value="epidemiologicalStatus" is-link @click="epidemiologicalShow = true" />
    </div>
    <!-- 知情同意 -->
    <van-popup :value="consentsShow || epidemiologicalShow" position="right" get-container="body" class="popup" duration="0.2">
      <transition name="fade" :duration="500">
        <consents v-if="consentsShow" @back="handleBack" />
        <epidemiological v-if="epidemiologicalShow" @back="handleBack" />
      </transition>
    </van-popup>
  </div>
</template>

<script>
import Consents from './Consents'
import Epidemiological from './Epidemiological'
import methodMixin from '@mixins/methodMixin'
import { mapGetters } from 'vuex'
export default {
  name: 'informedConsent',
  components: {
    Epidemiological,
    Consents
  },
  data() {
    return {
      consentsShow: false,
      epidemiologicalShow: false,
      active: 'task',
      consentsStatus: '',
      epidemiologicalStatus: '',
      tourCodeList: []
    }
  },
  computed: {
    ...mapGetters(['patientId'])
  },
  async created() {
    this.getCodeList()
  },
  mounted() {
    if (this.patientId) this.init()
  },
  methods: {
    handleBack() {
      this.consentsShow = false
      this.epidemiologicalShow = false
      this.init()
    },
    async init() {
      const res = await this.$api.mpcQueryDetailByPatientId(
        this.patientId
      )
      if (res.body.medPhepConsentsEntity) {
        this.consentsStatus = '已签署'
      } else {
        this.consentsStatus = '未签署'
      }
      const res2 = await this.$api.mpeQueryByPatientId(
        this.patientId
      )
      if (res2.body.medPhepEpidemiologicalEntity) {
        if (res2?.body?.medPhepEpidemiologicalEntity?.tourCode) {
          const tourCodeLable =
            this.tourCodeList.find(
              item =>
                item.value === res2.body.medPhepEpidemiologicalEntity.tourCode
            ) || {}
          if (res2.body.medPhepEpidemiologicalEntity.tourCode === '4') {
            this.epidemiologicalStatus = '未见异常-' + tourCodeLable.label
          } else {
            this.epidemiologicalStatus = '有异常-' + tourCodeLable.label
          }
        }
      } else {
        this.epidemiologicalStatus = '未调查'
      }
    },
    getCodeList() {
      const res = this.getCodeListByKey([
        'PHFA_0056' // 通信行程码
      ])
      this.tourCodeList = res.PHFA_0056
    }
  },
  mixins: [methodMixin],
  watch: {
    patientId(v) {
      if (v) {
        this.init()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.popup {
  width: 100vw;
}
</style>
