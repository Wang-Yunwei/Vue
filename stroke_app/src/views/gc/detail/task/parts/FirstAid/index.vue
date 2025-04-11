<template>
  <div class="content-wrapper">
    <van-form ref="form">
      <div>
        <div class="task-part-title">
          <span class="solid" />
          <span>院前接诊</span>
        </div>
        <template
          v-if="
            [
              comingTypeConst.local120,
              comingTypeConst.otherHospitalTransfer
            ].includes(comingType)
          "
        >
          <med-radio-button-field
            name="isAfterWakeup"
            v-model="triage.gcTriage.isAfterWakeup"
            label="是否为醒后卒中"
            required
            :rules="[{ required: true, message: '必填' }]"
            :select-options="yesNoOption"
          />
          <div v-if="triage.gcTriage.isAfterWakeup !== ''">
            <med-date-picker
              v-clear
              v-model="triage.gcTriage.onsetTime"
              v-if="!showByIsAfterWakeup"
              required
              :rules="[{ required: true, message: '必填' }]"
              label="发病时间"
              clearable
            />
            <div v-if="showByIsAfterWakeup">
              <med-date-picker
                v-clear
                v-model="triage.gcTriage.lastHealthyTime"
                required
                :rules="[{ required: true, message: '必填' }]"
                label="最后看起来正常时间"
                clearable
              />
              <med-date-picker
                v-clear
                v-model="triage.gcTriage.awareTime"
                label="发现时间"
                clearable
              />
            </div>
          </div>
        </template>
        <patients
          :disabled="!isBound"
          :type="departmentConst.firstAid"
          label="车牌号"
          v-model="firstAid.gcfirstaid.licensePlate"
          :patientName="patientInfo.name"
          @selectItem="handleSelectPatient"
        />
        <med-date-picker
          v-model="firstAid.gcfirstaid.callTime"
          label="呼救时间"
          clearable
        />
        <med-date-picker
          v-model="firstAid.gcfirstaid.acceptMissionTime"
          label="接警时间"
          clearable
        />
        <med-date-picker
          v-model="firstAid.gcfirstaid.planVehicleTime"
          label="派车时间"
          clearable
        />
        <med-date-picker
          v-model="firstAid.gcfirstaid.dispatchVehicleTime"
          label="出车时间"
          clearable
        />
        <med-date-picker
          v-model="firstAid.gcfirstaid.arrivePatientSideTime"
          label="医生到达现场时间"
          clearable
        />
        <med-date-picker
          v-model="firstAid.gcfirstaid.fmcTime"
          label="首次医疗接触时间"
          clearable
        />
        <med-text-field
          label="120首诊医生"
          v-model="firstAid.gcfirstaid.fmcDoctor"
          placeholder="120首诊医生"
          :selectOptions="dic.doctorOpts"
        />
        <med-date-picker
          v-model="firstAid.gcfirstaid.leftSceneTime"
          label="离开现场时间"
          clearable
        />
        <med-date-picker
          v-model="firstAid.gcfirstaid.arrivedHospitalTime"
          label="到达医院时间"
          clearable
        />
      </div>
      <div class="mini">
        <div class="task-part-title">
          <span class="solid" />
          <span>患者病史</span>
        </div>
        <med-radio-button-field
          required
          name="isMedicalHistory"
          v-model="firstAid.gcfirstaid.isMedicalHistory"
          label="病史记录"
          :select-options="yesNoOption"
          :rules="[{ required: true, message: '必填' }]"
        >
        </med-radio-button-field>
        <div v-if="firstAid.gcfirstaid.isMedicalHistory === '1'">
          <med-hint-field
            label="主诉"
            v-model="firstAid.gcfirstaid.cc"
            placeholder="主诉"
          />
          <med-hint-field
            label="病史陈述者"
            v-model="firstAid.gcfirstaid.declarantName"
            placeholder="病史陈述者"
          />
          <multi-select
            label="既往病史"
            :options="dic.pastHistoryOpts"
            v-model="firstAid.gcfirstaid.pastHistory"
            :other.sync="firstAid.gcfirstaid.pastHistoryOther"
            title="既往病史"
            @backClick="onPastHistoryChange"
          />
        </div>
      </div>
      <div class="mini">
        <div class="task-part-title">
          <span class="solid" />
          <span>院前体征</span>
        </div>
        <med-radio-button-field
          name="isSign"
          v-model="firstAid.gcfirstaid.isSign"
          label="是否检测生命体征"
          :select-options="yesNoOption"
          :rules="[{ required: true, message: '必填' }]"
        >
        </med-radio-button-field>

        <div v-if="firstAid.gcfirstaid.isSign === '1'">
          <med-number-field
            v-clear
            lazy
            required
            :rules="[{ required: true, message: '请填写体温' }]"
            v-float="{ scale: 1, min: 30, max: 47 }"
            v-model.number="firstAid.gcfirstaid.temperature"
            label="体温"
            placeholder="请填写体温"
            unit="℃"
          />
          <med-number-field
            lazy
            v-clear
            v-int="{ min: 0, max: 300 }"
            v-model.number="firstAid.gcfirstaid.plus"
            label="脉搏"
            placeholder="请填写脉搏"
            unit="次/分"
            required
            :rules="[{ required: true, message: '请填写脉搏' }]"
          />
          <med-number-field
            lazy
            v-clear
            v-int="{ min: 0, max: 50 }"
            placeholder="请填写呼吸"
            v-model.number="firstAid.gcfirstaid.breath"
            label="呼吸"
            unit="次/分"
            required
            :rules="[{ required: true, message: '请填写呼吸' }]"
          />
          <med-bp-field
            required
            label="血压"
            :sbp.sync="firstAid.gcfirstaid.sbp"
            :dbp.sync="firstAid.gcfirstaid.dbp"
          />
          <med-number-field
            lazy
            v-clear
            v-int="{ min: 0, max: 100 }"
            placeholder="请填写血氧"
            v-model.number="firstAid.gcfirstaid.spo"
            label="血氧"
            unit="%"
            required
            :rules="[{ required: true, message: '请填写血氧' }]"
          />
          <med-radio-select-field
            label="意识"
            v-model="firstAid.gcfirstaid.mind"
            :select-options="dic.mindOpts"
          />
        </div>
      </div>
      <div class="mini">
        <div class="task-part-title">
          <span class="solid" />
          <span>心电图</span>
        </div>
        <med-ecg-field
          label="上传"
          :prefixUrl="attachPrefix"
          :upload-url="$api.ecg.upload"
          :delete-url="$api.ecg.deleteEcg"
          :record-list="ecgList"
          :readonly="viewMode"
          auto-close
          @submit="submitEcg"
          @delete-success="deleteSuccess"
        />
      </div>
      <div class="mini">
        <div class="task-part-title">
          <span class="solid" />
          <span>专科评估</span>
        </div>
        <multi-select
          label="FAST评估"
          :options="dic.evaluateOpts"
          v-model="firstAid.gcfirstaid.fast"
          title="FAST评估"
        />
      </div>
      <div class="mini">
        <div class="task-part-title">
          <span class="solid" />
          <span>院前处置</span>
        </div>
        <med-radio-button-field
          name="isPreTreatment"
          v-model="firstAid.gcfirstaid.isPreTreatment"
          label="是否院前处置"
          :select-options="yesNoOption"
        >
        </med-radio-button-field>
        <div v-if="firstAid.gcfirstaid.isPreTreatment === '1'">
          <med-date-picker
            v-model="firstAid.gcfirstaid.openveinTime"
            label="开通静脉通道时间"
            clearable
          />
          <multi-select
            label="院前用药史"
            :options="dic.pharmacyHistoryOpts"
            v-model="firstAid.gcfirstaid.phepDrugs"
            :other.sync="firstAid.gcfirstaid.phepDrugsOthers"
            title="院前用药史"
          />
        </div>
        <med-radio-button-field
          name="isOxygen"
          v-model="firstAid.gcfirstaid.isOxygen"
          label="是否吸氧"
          :select-options="yesNoOption"
        >
        </med-radio-button-field>
        <med-radio-button-field
          name="isFastBloodSurger"
          v-model="firstAid.gcfirstaid.isFastBloodSurger"
          label="是否检测快速血糖"
          :select-options="yesNoOption"
        >
        </med-radio-button-field>
        <div v-if="firstAid.gcfirstaid.isFastBloodSurger === '1'">
          <med-number-field
            v-clear
            v-float="{ scale: 2, min: 0, max: 100 }"
            required
            :rules="[{ required: true, message: '请填写快速血糖' }]"
            v-model.number="firstAid.gcfirstaid.fastBloodSurger"
            label="快速血糖"
            unit="mmol/L"
          >
          </med-number-field>
          <med-date-picker
            v-model="firstAid.gcfirstaid.fastBloodSurgerTime"
            label="快速血糖时间"
            clearable
          />
        </div>
      </div>
      <div class="mini">
        <div class="task-part-title">
          <span class="solid" />
          <span>初步印象</span>
        </div>
        <med-radio-button-field
          name="firstImpression"
          v-model="firstAid.gcfirstaid.firstImpression"
          label="初步印象"
          :select-options="dic.impressionOpts"
        >
        </med-radio-button-field>
      </div>
      <div
        class="mini"
        v-if="comingType === comingTypeConst.otherHospitalTransfer"
      >
        <div class="task-part-title">
          <span class="solid" />
          <span>外院转诊</span>
        </div>
        <med-radio-button-field
          name="isPreTreatment"
          v-model="firstAid.outreferal.isCtExam"
          label="是否外院CT检查"
          :select-options="yesNoOption"
        >
        </med-radio-button-field>
        <med-date-picker
          v-if="firstAid.outreferal.isCtExam === '1'"
          v-model="firstAid.outreferal.ctExamTime"
          label="CT检查完成时间"
          clearable
        />
        <med-hint-field
          label="检查医院"
          v-if="firstAid.outreferal.isCtExam === '1'"
          v-model="firstAid.outreferal.hospitalId"
          placeholder="检查医院"
        />
        <med-radio-button-field
          name="isPreTreatment"
          v-model="firstAid.outreferal.isOpenvein"
          label="是否外院行静脉溶栓"
          :select-options="yesNoOption"
        >
        </med-radio-button-field>
        <div v-if="firstAid.outreferal.isOpenvein === '1'">
          <med-hint-field
            label="溶栓医院"
            v-model="firstAid.outreferal.veinHospital"
            placeholder="溶栓医院"
          />
          <med-radio-button-field
            name="isAssitHospital"
            v-model="firstAid.outreferal.isAssitHospital"
            label="是否是协作医院"
            :select-options="yesNoOption"
          />
          <med-radio-button-field
            name="veinDrugs"
            v-model="firstAid.outreferal.veinDrugs"
            label="溶栓药物"
            :select-options="drugList"
          />
          <med-radio-button-field
            name="firstDosage"
            v-model="firstAid.outreferal.firstDosage"
            label="首剂药量"
            :select-options="dosageList"
          />
          <med-number-field
            v-clear
            v-int="{ min: 0, max: 9999999999 }"
            v-model="firstAid.outreferal.realDosage"
            label="实际给药剂量"
            min="0"
            :unit="realDosageUnit"
          />
          <med-radio-button-field
            name="isOtherDrug"
            v-model="firstAid.outreferal.isOtherDrug"
            label="有无其他药物"
            :select-options="isDrugsList"
          />
          <div v-if="firstAid.outreferal.isOtherDrug === '1'">
            <med-radio-select-field
              label="其他药物"
              v-model="firstAid.outreferal.otherDrugs"
              :select-options="dic.rsOtherDrugList"
            />
          </div>
        </div>
      </div>
    </van-form>
  </div>
</template>
<script>
import Patients from '@views/gc/detail/task/components/Patients/index'
import { GcFirstAid, GcTriage, GcOutReferral, Ecg } from '@model/commonModel'
import {
  ecgType,
  yesno,
  yesNoOption,
  departmentConst,
  comingTypeConst
} from '@constant/commonConstant'
// import Electrocardiogram from '@views/gc/electrocardiogram'
import loadingMixin from '@mixins/loadingMixin'
import doctorsMixin from '@mixins/doctorsMixin'
import * as types from '@store/mutations/mutations-types'
import { mapGetters, mapMutations } from 'vuex'
import { throttle } from 'lodash'
import hospitalMixin from '@mixins/hospitalMixin'
import { validateTimeSequence } from '@/utils/validate'

const timeout = 2000

export default {
  name: 'FirstAid',
  components: { Patients },
  mixins: [loadingMixin, doctorsMixin, hospitalMixin],
  props: {
    isBound: {
      type: Boolean,
      default: false
    },
    viewMode: {
      type: Boolean,
      default: false
    },
    dic: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      attachPrefix: window.GLOBAL_ATTACH_PREFIX,
      ecgList: [],
      ecg: this.emptyEcg(),
      pattern: /^([0-9]{1,2}|100)$/,
      registId: this.$route.query.registId,
      // comingType: '', // 来院方式
      ecgType,
      yesNoOption,
      departmentConst,
      comingTypeConst,
      triage: {
        gcTriage: { ...GcTriage(), registId: this.$route.query.registId }
      },
      firstAid: {
        gcfirstaid: { ...GcFirstAid(), registId: this.$route.query.registId },
        outreferal: { ...GcOutReferral(), registId: this.$route.query.registId }
      },
      DrugsList: {},
      drugList: [
        { label: 'rt-PA', name: '溶栓药物', value: '1' },
        { label: '尿激酶', name: '溶栓药物', value: '0' }
      ],
      dosageList: [
        { label: '0.6mg/kg', name: '首剂药量', value: 1 },
        { label: '0.9mg/kg', name: '首剂药量', value: 0 }
      ],
      isDrugsList: [
        { label: '有', name: '有无其他药物', value: '1' },
        { label: '无', name: '有无其他药物', value: '0' }
      ]
    }
  },
  computed: {
    ...mapGetters(['sharedData', 'patientInfo', 'comingType']),
    realDosageUnit() {
      if (this.firstAid.outreferal.veinDrugs === '1') {
        return 'mg'
      }
      if (this.firstAid.outreferal.veinDrugs === '0') {
        return 'IU'
      }
      return ''
    },
    showByIsAfterWakeup() {
      return this.triage.gcTriage.isAfterWakeup === yesno.yes
    },
    // 是否有心电图
    hasEcg() {
      return this.ecg
    },
    dbpWidth() {
      return this.firstAid.gcfirstaid.dbp ? 'width:0.68rem;' : 'width:1.3rem;'
    },
    sbpWidth() {
      return this.firstAid.gcfirstaid.sbp ? 'width:0.68rem;' : ';width:1.5rem;'
    }
  },
  // 钩子方法
  created() {
    this.init()
    this.$root.resetFirstAidTab = this.resetData
  },
  beforeDestroy() {
    delete this.$root.resetFirstAidTab
  },
  methods: {
    ...mapMutations(types),
    init() {
      // 根据患者id查询患者记录
      this.getFirstAidList()
      // 查询外院转诊数据
      this.getOutReferral()
      // 获取心电图列表
      this.getEcgList()
      // 获取分诊
      this.getGcTriage()
    },
    resetData() {
      // 页签隐藏清理脏数据
      console.log('reset!')
      this.triage = {
        gcTriage: { ...GcTriage(), registId: this.$route.query.registId }
      }
      this.firstAid = {
        gcfirstaid: { ...GcFirstAid(), registId: this.$route.query.registId },
        outreferal: { ...GcOutReferral(), registId: this.$route.query.registId }
      }
    },
    /**
     * 选择患者回调
     * @param patient 选择的患者
     * @param closePop 关闭窗口回调
     */
    handleSelectPatient(patient, closePop) {
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
              type: '1'
            }
            // 根据急诊号(急诊分诊凭条)，是否已经建档
            const response = await this.$api.basicInfo.getEmIdPatient(params)
            if (response.status === 200 && response.result) {
              this.$toast('该患者已建档')
              return
            }
          }
          if (!patient?.relationId) {
            return
          }
          // 绑定急救
          this.bind(patient, closePop)
        })
        .catch(() => {})
    },
    /**
     * 绑定急救
     * @param patient
     * @param closePop 关闭窗口回调
     */
    bind(patient, closePop) {
      // 绑定参数
      const bindInfo = {
        registId: this.registId,
        visitId: patient.relationId,
        department: this.departmentConst.firstAid
      }
      this.loading()
      this.$api.thirdParty
        .bindWithDepartment(bindInfo)
        .then(res => {
          if (res.status === 202 && !res.result) {
            this.$notify({ type: 'warning', message: res.message })
            return
          }
          // 获取车牌号
          this.$set(
            this.firstAid.gcfirstaid,
            'licensePlate',
            patient?.licensePlate || ''
          )
          closePop()
        })
        .finally(() => this.hideLoading())
    },
    // 同步[院前急救：到达医院时间]到vuex
    onArrivedHospitalTimeChange(val) {
      if (val) {
        const newData = { ...this.sharedData, arrivedHospitalTime: val }
        this[types.SET_SHARED_DATA](newData)
      }
    },
    // 同步[院前急救：开通静脉通道时间]到vuex
    onOpenveinTimeChange(val) {
      if (val) {
        const newData = { ...this.sharedData, openveinTime: val }
        this[types.SET_SHARED_DATA](newData)
      }
    },
    // 同步[院前急救：既往病史]到vuex
    onPastHistoryChange() {
      const val = this.firstAid.gcfirstaid.pastHistory
      const newData = {
        ...this.sharedData,
        pastHistory: val,
        pastHistoryOther: this.firstAid.gcfirstaid.pastHistoryOther
      }
      this[types.SET_SHARED_DATA](newData)
    },
    // 同步[院前急救：既往病史(其它)]到vuex
    onPastHistoryOtherChange(val) {
      if (val) {
        const newData = { ...this.sharedData, pastHistoryOther: val }
        this[types.SET_SHARED_DATA](newData)
      }
    },
    getGcTriage() {
      this.loading()
      this.$api.triage
        .getGcTriage(this.registId)
        .then(({ result }) => {
          if (result.gcTriage) {
            this.$preventWatch(() => {
              this.triage.gcTriage = {
                ...this.triage.gcTriage,
                ...result.gcTriage
              }
            })
          }
          // this.comingType = result.gcBasic.comingType
        })
        .finally(() => this.hideLoading())
    },
    // 查询患者院前急救信息
    getFirstAidList() {
      this.loading()
      this.$api.filing
        .getFirstAidList(this.firstAid.gcfirstaid.registId)
        .then(({ result }) => {
          this.$preventWatch(() => {
            if (result.registId) {
              this.firstAid.gcfirstaid = {
                ...this.firstAid.gcfirstaid,
                ...result
              }
              // 收集
              validateTimeSequence(this.firstAid.gcfirstaid, 'firstAid')
            }
          })
        })
        .finally(() => this.hideLoading())
    },
    // 调用外院柱转诊数据
    getOutReferral() {
      this.loading()
      this.$api.outReferral
        .getOutReferral(this.firstAid.outreferal.registId)
        .then(({ result }) => {
          this.$preventWatch(() => {
            if (result) {
              this.firstAid.outreferal = {
                ...this.firstAid.outreferal,
                ...result
              }
            }
          })
        })
        .finally(() => this.hideLoading())
    },
    emptyEcg() {
      return {
        ...Ecg(),
        registId: this.$route.query.registId,
        ecgType: ecgType.preHospital
      }
    },
    /**
     * 查询心电图列表
     */
    getEcgList() {
      this.$api.ecg
        .getEcg(this.$route.query.registId, ecgType.preHospital)
        .then(({ result }) => {
          this.$preventWatch(() => {
            this.ecgList = result || []
          })
        })
    },
    spoValidator(value) {
      if (!value) {
        return true
      }
      const result = this.pattern.test(value)
      if (!result) {
        const spoStr = this.firstAid.gcfirstaid.spo.toString()
        const newValue = spoStr.substring(0, spoStr.length - 1)
        this.$set(this.firstAid.gcfirstaid, 'spo', parseInt(newValue))
      }
      return result
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
    // 保存心电图
    submitEcg(type, params) {
      this.ecg.ecgDiagnosis = params.ecgDiagnosis
      this.ecg.ecgFile = params.ecgFile
      this.ecg.ecgTime = params.ecgTime
      if (params.id) {
        this.ecg.id = params.id
      }
      if (params.ecgException) {
        this.ecg.ecgException = params.ecgException
      }
      if (params.ecgExceptionOther) {
        this.ecg.ecgExceptionOther = params.ecgExceptionOther
      }
      this.saveEcg()
    },
    saveEcg() {
      this.$api.ecg.saveEcg(this.ecg).then(res => {
        if (res.status === 200) {
          this.$notify({ type: 'success', message: '保存成功' })
          this.ecg = this.emptyEcg()
          this.getEcgList()
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    },
    // 删除心电图回调
    deleteSuccess() {
      this.getEcgList()
    },
    // 保存分诊信息
    saveTriage: throttle(function() {
      const req = { ...this.triage.gcTriage }
      this.$api.triage.saveGcTriage(req).then(res => {
        if (res.status === 200) {
          this.$notify({ type: 'success', message: '保存成功' })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, timeout),
    // 校验体征数据
    // async validateVitalSigns(obj) {
    //   let result = ''
    //   if (
    //     (obj.temperature && (obj.temperature < 30 || obj.temperature > 47)) ||
    //     (obj.plus && (obj.plus < 0 || obj.plus > 300)) ||
    //     (obj.breath && (obj.breath < 0 || obj.breath > 50)) ||
    //     (obj.sbp && (obj.sbp < 0 || obj.sbp > 300)) ||
    //     (obj.dbp && (obj.dbp < 0 || obj.dbp > 300)) ||
    //     (obj.spo && (obj.spo < 0 || obj.spo > 100))
    //   ) {
    //     result = '体征校验不通过'
    //   }
    //   if (result) {
    //     console.warn(result)
    //     return Promise.reject(result)
    //   }
    //   return true
    // },
    // 保存急救信息
    saveFirstAidInformation: throttle(async function() {
      const req = { ...this.firstAid.gcfirstaid }
      // await this.validateVitalSigns(req)
      this.$api.filing.updateFirstAidList(req).then(res => {
        if (res.status === 200) {
          this.$notify({ type: 'success', message: '保存成功' })
          this.getFirstAidList()
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, timeout),
    // 保存外院转诊
    saveOutreferalInformation: throttle(function() {
      const req = { ...this.firstAid.outreferal }
      req.realDosage = parseFloat(req.realDosage)
      this.$api.filing.updateOutreferalList(req).then(res => {
        if (res.status === 200) {
          this.$notify({ type: 'success', message: '保存成功' })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, timeout)
  },
  watch: {
    'triage.gcTriage': {
      immediate: false,
      deep: true,
      handler(newVal, oldVal) {
        const valid = validateTimeSequence(newVal, 'triage')
        this.saveTriage(newVal)
      }
    },
    'firstAid.gcfirstaid.arrivedHospitalTime': {
      immediate: false,
      handler(newVal, oldVal) {
        this.onArrivedHospitalTimeChange(newVal)
      }
    },
    'firstAid.gcfirstaid.openveinTime': {
      immediate: false,
      handler(newVal, oldVal) {
        this.onOpenveinTimeChange(newVal)
      }
    },
    // 既往病史
    // 'firstAid.gcfirstaid.pastHistory': {
    //   immediate: false,
    //   handler(newVal, oldVal) {
    //     this.onPastHistoryChange(newVal)
    //   }
    // },
    // 既往病史(其它)
    // 'firstAid.gcfirstaid.pastHistoryOther': {
    //   immediate: false,
    //   handler(newVal, oldVal) {
    //     this.onPastHistoryOtherChange(newVal)
    //   }
    // },
    'firstAid.gcfirstaid': {
      immediate: false,
      handler(newVal, oldVal) {
        // 校验
        const valid = validateTimeSequence(newVal, 'firstAid')
        this.saveFirstAidInformation()
      },
      deep: true
    },
    'firstAid.outreferal': {
      immediate: false,
      handler(newVal, oldVal) {
        this.saveOutreferalInformation()
      },
      deep: true
    },
    // 是否为外院转诊
    comingType: {
      immediate: false,
      handler(newVal, oldVal) {
        if (['1', '3'].includes(oldVal) && !['1', '3'].includes(newVal)) {
          console.log('来院方式改变!!')
        }
        if (this.comingType !== '3') {
          this.$set(this.firstAid.outreferal, 'isCtExam', '')
          this.$set(this.firstAid.outreferal, 'ctExamTime', '')
          this.$set(this.firstAid.outreferal, 'hospitalId', '')
          this.$set(this.firstAid.outreferal, 'isOpenvein', '')
          this.$set(this.firstAid.outreferal, 'veinHospital', '')
          this.$set(this.firstAid.outreferal, 'isAssitHospital', '')
          this.$set(this.firstAid.outreferal, 'veinDrugs', '')
          this.$set(this.firstAid.outreferal, 'firstDosage', undefined)
          this.$set(this.firstAid.outreferal, 'realDosage', undefined)
          this.$set(this.firstAid.outreferal, 'isOtherDrug', '')
          this.$set(this.firstAid.outreferal, 'otherDrugs', '')
        }
      }
    },
    // 是否外院行静脉溶栓
    'firstAid.outreferal.isOpenvein': {
      immediate: false,
      handler() {
        if (this.firstAid.outreferal.isOpenvein === '0') {
          this.$set(this.firstAid.outreferal, 'veinHospital', '')
          this.$set(this.firstAid.outreferal, 'isAssitHospital', '')
          this.$set(this.firstAid.outreferal, 'veinDrugs', '')
          this.$set(this.firstAid.outreferal, 'firstDosage', undefined)
          this.$set(this.firstAid.outreferal, 'realDosage', undefined)
          this.$set(this.firstAid.outreferal, 'isOtherDrug', '')
          this.$set(this.firstAid.outreferal, 'otherDrugs', '')
        }
      }
    },
    // 是否其他药物
    'firstAid.outreferal.isOtherDrug': {
      handler() {
        if (this.firstAid.outreferal.isOtherDrug === '0') {
          this.$set(this.firstAid.outreferal, 'otherDrugs', '')
        }
      }
    },
    // 监听 是否院前处置
    'firstAid.gcfirstaid.isPreTreatment': {
      immediate: false,
      handler() {
        if (this.firstAid.gcfirstaid.isPreTreatment === '0') {
          this.$set(this.firstAid.gcfirstaid, 'openveinTime', '')
          this.$set(this.firstAid.gcfirstaid, 'phepDrugs', '')
          this.$set(this.firstAid.gcfirstaid, 'phepDrugsOthers', '')
        }
      }
    },
    // 是否检测快速血糖
    'firstAid.gcfirstaid.isFastBloodSurger': {
      immediate: false,
      handler() {
        if (this.firstAid.gcfirstaid.isFastBloodSurger === '0') {
          this.$set(this.firstAid.gcfirstaid, 'fastBloodSurger', '')
          this.$set(this.firstAid.gcfirstaid, 'fastBloodSurgerTime', '')
        }
      }
    },
    // 是否病史记录
    'firstAid.gcfirstaid.isMedicalHistory': {
      immediate: false,
      handler() {
        if (this.firstAid.isMedicalHistory === '0') {
          this.$set(this.firstAid.gcfirstaid, 'cc', '')
          this.$set(this.firstAid.gcfirstaid, 'declarantName', '')
          this.$set(this.firstAid.gcfirstaid, 'pastHistory', '')
        }
      }
    },
    // 是否检测申明体征
    'firstAid.gcfirstaid.isSign': {
      immediate: false,
      handler() {
        if (this.firstAid.gcfirstaid.isSign === '0') {
          this.$set(this.firstAid.gcfirstaid, 'dbp', undefined)
          this.$set(this.firstAid.gcfirstaid, 'sbp', undefined)
          this.$set(this.firstAid.gcfirstaid, 'spo', undefined)
          this.$set(this.firstAid.gcfirstaid, 'temperature', undefined)
          this.$set(this.firstAid.gcfirstaid, 'plus', undefined)
          this.$set(this.firstAid.gcfirstaid, 'breath', undefined)
          this.$set(this.firstAid.gcfirstaid, 'heartRate', '')
          this.$set(this.firstAid.gcfirstaid, 'mind', '')
          this.$set(this.firstAid.gcfirstaid, 'acqTime', '')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
