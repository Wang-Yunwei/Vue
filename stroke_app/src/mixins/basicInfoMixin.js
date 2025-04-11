import { mapGetters, mapMutations } from 'vuex'
import * as types from '@/store/mutations/mutations-types'
import { BasicInfoCache } from '@model/commonModel'
import { emrStatus } from '@constant/commonConstant'

export default {
  data() {
    return {
      emrStatus
    }
  },
  computed: {
    ...mapGetters(['patientInfo', 'basicInfo']),
    patientInformation() {
      const { patientInfo: d } = this
      return {
        name: d.name,
        gender: d.gender,
        age: d.age,
        symptom: d.diag,
        comingType: d.comingType,
        outpatientNo: d.outPatientNo,
        inpatientNo: d.admissionNo,
        diseaseTime: d.onsetTime,
        arriveTime: d.arriveHospitalTime,
        lastHealthyTime: d.lastHealthyTime,
        rfTagId: d.rfTagId,
        status: d.status
      }
    },
    // 是否存档
    isArchived() {
      return this.details.status === this.emrStatus.archived
    }
  },
  methods: {
    ...mapMutations(types),
    // 获取基本信息
    getBasicInfo(registId, isCache = false, callback) {
      this.$api.basicInfo.getBasicInfo(registId).then(({ result }) => {
        const basic = result.gcBasic
        const triage = result.gcTriage
        const detection = result.gcDetection
        this.details = {
          ...basic,
          onsetTime: triage?.onsetTime || '',
          arriveHospitalTime: triage?.arriveHospitalTime || '',
          lastHealthyTime: triage?.lastHealthyTime || '',
          rfTagId: triage?.rfTagId || '',
          diag: detection?.diag || ''
        }
        this[types.SET_PATIENT_INFO]({ ...this.details })
        this[types.SET_COMINGTYPE](basic.comingType)
        this[types.SET_DISPOSE](detection.dispose)
        if (isCache) {
          this[types.SET_BASIC_INFO]({})
          // 把基本信息页面必填数据保存到缓存中
          const basicInfoCache = {
            ...BasicInfoCache(),
            name: basic?.name || '',
            gender: basic?.gender || '',
            age: basic?.age || undefined,
            idcardType: basic?.idcardType || '',
            isAfterWakeup: triage?.isAfterWakeup || '',
            onsetTime: triage?.onsetTime || ''
          }
          this[types.SET_BASIC_INFO](basicInfoCache)
        }
        // 回调函数
        if (callback) {
          callback()
        }
      })
    }
  }
}
