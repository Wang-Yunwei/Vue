<template>
  <div class="content-wrapper">
    <van-form ref="form">
      <div class="task-part-title">
        <span class="solid" />
        <span>患者转归</span>
      </div>
      <div class="main">
        <van-cell-group>
          <med-radio-button-field
            name="isDelay"
            v-model="outcomeInfo.outcome.isDelay"
            label="是否有延误原因"
            :select-options="yesNoOption"
          >
          </med-radio-button-field>
          <multi-select
            v-if="outcomeInfo.outcome.isDelay === yesno.yes"
            label="耗时原因"
            :options="dic.delayReasonList"
            v-model="outcomeInfo.outcome.delayReason"
            :other.sync="outcomeInfo.outcome.delayReasonOther"
            title="耗时原因"
          />
          <med-radio-select-field
            label="病人去向"
            v-model="outcomeInfo.outcome.whereabouts"
            :select-options="dic.whereaboutsList"
            required
            :rules="[{ required: true, message: '必填' }]"
          ></med-radio-select-field>
          <van-field
            v-if="outcomeInfo.outcome.whereabouts === '99'"
            v-model="outcomeInfo.outcome.whereaboutsOther"
            label="病人去向其他"
            placeholder="病人去向其他"
          >
          </van-field>
          <div v-if="showIfHospitalAdmission">
            <patients
              :disabled="!isBound"
              :type="departmentConst.inpatient"
              label="住院号"
              v-model="outcomeInfo.outcome.inpatientNo"
              :patientName="patientInfo.name"
              @selectItem="handleSelectInpatient"
            />
            <med-date-picker
              v-model="outcomeInfo.outcome.admissionTime"
              label="办理入院时间"
              clearable
            />
            <med-radio-select-field
              label="入院科别"
              v-model="outcomeInfo.outcome.admissionDept"
              :select-options="dic.admissionDeptList"
            ></med-radio-select-field>
            <med-hint-field
              v-if="outcomeInfo.outcome.admissionDept === '99'"
              v-model="outcomeInfo.outcome.admissionDeptOther"
              label="入院科别其它"
            />
          </div>
        </van-cell-group>
      </div>
    </van-form>
  </div>
</template>

<script>
import Patients from '@views/gc/detail/task/components/Patients/index'
import watchFormMixin from '@mixins/watchFormMixin'
import dateMixin from '@mixins/dateMixin'
import loadingMixin from '@mixins/loadingMixin'
import hospitalMixin from '@mixins/hospitalMixin'
import dateUtil from '@utils/dateUtil'
import { yesNoOption, yesno, departmentConst } from '@constant/commonConstant'
import { throttle } from 'lodash'
import { mapGetters } from 'vuex'
import GcOutcome from '@model/gcOutcome'
import { validateTimeSequence } from '@/utils/validate'

export default {
  // 转归
  name: 'Outcome',
  mixins: [watchFormMixin, dateMixin, loadingMixin, hospitalMixin],
  props: {
    isBound: {
      type: Boolean,
      default: false
    },
    dic: {
      type: Object,
      default: () => ({})
    }
  },
  components: { Patients },
  data() {
    return {
      registId: this.$route.query.registId,
      yesno,
      departmentConst,
      // 住院患者列表返回的患者
      inpatient: undefined,
      outcomeInfo: this.emptyData(),
      yesNoOption
    }
  },
  created() {
    this.init()
  },
  computed: {
    ...mapGetters(['userInfo', 'patientInfo', 'curHospitalArea']),
    // 入院
    showIfHospitalAdmission() {
      return this.outcomeInfo.outcome.whereabouts === '0'
    }
  },
  watch: {
    'outcomeInfo.outcome.isDelay': {
      immediate: false,
      handler(newVal, oldVal) {
        if (this.outcomeInfo.outcome.isDelay === this.yesno.no) {
          this.$set(this.outcomeInfo.outcome, 'delayReason', '')
        }
      }
    },
    'outcomeInfo.outcome.delayReason': {
      immediate: false,
      handler() {
        if (this.outcomeInfo.outcome.delayReason.indexOf('99') === -1) {
          this.$set(this.outcomeInfo.outcome, 'delayReasonOther', '')
        }
      },
      deep: true
    },
    'outcomeInfo.outcome.whereabouts': {
      immediate: false,
      handler() {
        if (this.outcomeInfo.outcome.whereabouts !== '5') {
          this.$set(this.outcomeInfo.outcome, 'whereaboutsOther', '')
        }
        if (this.outcomeInfo.outcome.whereabouts !== '0') {
          this.$set(this.outcomeInfo.outcome, 'inpatientNo', '')
          this.$set(this.outcomeInfo.outcome, 'admissionTime', '')
          this.$set(this.outcomeInfo.outcome, 'admissionDept', '')
        }
      },
      deep: true
    },
    'outcomeInfo.outcome': {
      immediate: false,
      handler(newVal, oldVal) {
        const isTimeValid = validateTimeSequence(newVal, 'outcome')
        this.saveOrUpdateGcOutcome().then(({ result }) => {
          if (
            !result ||
            newVal.inpatientNo === '' ||
            newVal.inpatientNo === oldVal.inpatientNo
          ) {
            return
          }
          this.notifyHospitalAdmission()
        })
      },
      deep: true
    },
    'outcomeInfo.outcome.admissionDept': {
      immediate: false,
      handler(newVal, oldVal) {
        if (this.outcomeInfo.outcome.admissionDept !== '99') {
          this.$set(this.outcomeInfo.outcome, 'admissionDeptOther', '')
        }
      }
    }
  },
  methods: {
    init() {
      this.queryGcOutcome()
    },
    emptyData() {
      return {
        outcome: { ...GcOutcome(), registId: this.$route.query.registId },
        // 到达医院时间
        arriveHospitalTime: '',
        // 完成动脉穿刺时间
        femoralArteryFinishTime: '',
        // 首剂给药时间
        firstPharmacyTime: ''
      }
    },
    /**
     * 获取转归信息
     * (DNT:到院时间-首剂给药时间 > 60分钟)或(DPT:到院时间-完成动脉穿刺时间 > 90分钟),是否有延误原因自动选是
     */
    queryGcOutcome() {
      this.loading()
      this.$api.outcome
        .getGcOutcome(this.registId)
        .then(({ result }) => {
          // eslint-disable-next-line standard/object-curly-even-spacing
          this.$preventWatch(() => {
            const emptyData = this.emptyData()
            this.outcomeInfo = { ...emptyData, ...result }
            if (result.outcome) {
              this.outcomeInfo.outcome = {
                ...emptyData.outcome,
                ...result.outcome
              }
            }
          })
          if (!this.outcomeInfo.outcome.isDelay && this.isDNTOrDPTExceed()) {
            this.$set(this.outcomeInfo.outcome, 'isDelay', '1')
          }
          validateTimeSequence(this.outcomeInfo.outcome, 'outcome')
        })
        .finally(() => this.hideLoading())
    },
    /**
     * DNT或者DPT是否超出阈值
     * DNT > 60分钟 或者 DPT > 90分钟
     * @returns {boolean}
     */
    isDNTOrDPTExceed() {
      // DNT是否超过60分钟
      const isDntExceed = dateUtil.isExceedForMinute(
        this.outcomeInfo.arriveHospitalTime,
        this.outcomeInfo.firstPharmacyTime,
        60
      )
      // DPT是否超过90分钟
      const isDptExceed = dateUtil.isExceedForMinute(
        this.outcomeInfo.arriveHospitalTime,
        this.outcomeInfo.femoralArteryFinishTime,
        90
      )
      return isDntExceed || isDptExceed
    },
    /**
     * 选择住院患者回调
     * @param patient 选择的患者
     * @param closePop 关闭窗口回调
     */
    handleSelectInpatient(patient, closePop) {
      this.$dialog
        .confirm({
          title: '提示',
          message: `确认关联患者【${patient.name}】吗?`,
          confirmButtonColor: '#5e74fe'
        })
        .then(async () => {
          if (patient.relationId) {
            const params = {
              hospitalId: this.hospitalAndArea(),
              relationId: patient.relationId,
              type: this.departmentConst.inpatient
            }
            // 根据急诊号(急诊分诊凭条)，是否已经建档
            const response = await this.$api.basicInfo.getEmIdPatient(params)
            if (response.status === 200 && response.result) {
              this.$toast('该患者已建档')
              return
            }
          }
          this.inpatient = patient
          // 获取住院号
          this.outcomeInfo.outcome = {
            ...this.outcomeInfo.outcome,
            inpatientNo: patient?.displayNo || ''
          }
          // 获取办理入院时间
          this.$set(
            this.outcomeInfo.outcome,
            'admissionTime',
            patient?.time || ''
          )
          closePop()
        })
        .catch(() => {})
    },
    notifyHospitalAdmission() {
      const user = this.userInfo
      if (!user || !this.curHospitalArea) {
        return
      }
      const params = {
        registId: this.registId,
        hospitalId: user.hospitalId,
        hospitalArea: this.curHospitalArea,
        userLoginName: user.username,
        userName: user.name,
        relationId: this.inpatient.relationId
      }
      this.$api.external.notifyHospitalAdmission(params)
    },
    validate(name) {
      return new Promise((resolve, reject) => {
        this.$refs.form
          .validate()
          .then(r => resolve(r))
          .catch(e => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({ tabName: name, errors: e })
          })
      })
    },
    saveOrUpdateGcOutcome: throttle(async function() {
      const req = { ...this.outcomeInfo.outcome }
      const res = await this.$api.outcome.saveOrUpdateGcOutcome(req)
      if (res.code !== '-1') {
        this.$notify({ type: 'success', message: '保存成功' })
      } else {
        this.$notify({ type: 'warning', message: res.message })
      }
      return res
    }, 1000)
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
