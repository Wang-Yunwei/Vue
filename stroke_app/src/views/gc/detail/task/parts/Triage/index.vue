<template>
  <div class="content-wrapper">
    <van-form ref="form">
      <div class="task-part-title">
        <span class="solid" />
        <span>接诊</span>
      </div>
      <div class="main">
        <van-cell-group>
          <patients
            :disabled="!isBound"
            :type="departmentType"
            label="门诊号"
            v-model="triage.gcBasic.outPatientNo"
            :patientName="patientInfo.name"
            @selectItem="handleSelectPatient"
          />
          <!-- <van-field
            label="来院方式"
            required
            :value="triage.comingType"
            :rules="[{ required: true, message: '必填' }]"
          >
            <template #input>
              <med-select
                v-model="triage.comingType"
                :options="dic.comingTypeOpts"
              />
            </template>
          </van-field> -->
          <med-date-picker
            name="arriveHospitalTime"
            required
            v-model="triage.gcTriage.arriveHospitalTime"
            label="患者到院时间"
            :rules="[{ required: true, message: '必填' }]"
            clearable
          />
          <template
            v-if="
              [
                comingTypeConst.selfCome,
                comingTypeConst.currentHospitalMorbidity,
                comingTypeConst.other
              ].includes(triage.comingType)
            "
          >
            <med-radio-button-field
              name="isAfterWakeup"
              v-model="triage.gcTriage.isAfterWakeup"
              label="是否为醒后卒中"
              required
              :select-options="yesNoOption"
            />
            <div v-if="triage.gcTriage.isAfterWakeup !== ''">
              <med-date-picker
                v-model="triage.gcTriage.onsetTime"
                v-if="!showByIsAfterWakeup"
                required
                label="发病时间"
                clearable
              />
              <div v-if="showByIsAfterWakeup">
                <med-date-picker
                  v-model="triage.gcTriage.lastHealthyTime"
                  required
                  label="最后看起来正常时间"
                  clearable
                />
                <med-date-picker
                  v-model="triage.gcTriage.awareTime"
                  label="发现时间"
                  clearable
                />
              </div>
            </div>
          </template>
          <med-date-picker
            required
            v-model="triage.gcTriage.triageTime"
            label="急诊分诊时间"
            :rules="[{ required: true, message: '必填' }]"
            clearable
          />
          <med-date-picker
            required
            name="triageVisitTime"
            v-model="triage.gcTriage.triageVisitTime"
            label="急诊医生接诊时间"
            :rules="[{ required: true, message: '必填' }]"
            clearable
          />
          <med-date-picker
            v-model="triage.gcTriage.strokeNotifyTime"
            label="通知卒中医生时间"
            clearable
          />
          <med-date-picker
            v-model="triage.gcTriage.strokeVisitTime"
            label="卒中医生接诊时间"
            clearable
          />
          <med-text-field
            label="接诊医生"
            v-model="triage.gcTriage.strokeDoctor"
            placeholder="接诊医生"
            :selectOptions="dic.doctorOpts"
          />
          <med-date-picker
            v-model="triage.gcTriage.rrEnterTime"
            label="入抢时间"
            clearable
          />
          <med-date-picker
            v-model="triage.gcTriage.rrLeaveTime"
            label="出抢时间"
            clearable
          />
          <med-radio-button-field
            name="isOpenvein"
            v-model="triage.gcTriage.isFasted"
            label="是否FAST-ED评分"
            :select-options="yesNoOption"
          >
          </med-radio-button-field>
          <estimating
            v-if="triage.gcTriage.isFasted === '1'"
            :readonly="viewMode"
            required
            :rules="[{ required: true, message: '必填' }]"
            label="FAST-ED评分"
            placeholder="未评"
            :type="templateConstant.strokeFasted"
            v-model="triage.gcTriage.fastedId"
          />
          <med-radio-select-field
            label="病情分级"
            v-model="triage.gcTriage.illnessLevel"
            :select-options="dic.illnessLevelOpts"
          />
          <med-radio-button-field
            name="isOpenvein"
            v-model="triage.gcTriage.isMrs"
            label="是否mRS评分"
            :select-options="yesNoOption"
          >
          </med-radio-button-field>
          <estimating
            v-if="triage.gcTriage.isMrs === '1'"
            :readonly="viewMode"
            label="发病前mRS评分"
            placeholder="未评"
            :type="templateConstant.strokeMrs"
            v-model="triage.gcTriage.mrsId"
          />
          <med-number-field
            lazy
            v-clear
            v-float="{ scale: 1, min: 30, max: 47 }"
            v-model.number="triage.gcSign.temperature"
            required
            :rules="[{ required: true, message: '请填写体温' }]"
            label="体温"
            placeholder="请填写体温"
            unit="℃"
          />
          <med-number-field
            lazy
            v-clear
            v-int="{ min: 0, max: 300 }"
            v-model.number="triage.gcSign.plus"
            required
            :rules="[{ required: true, message: '请填写脉搏' }]"
            label="脉搏"
            placeholder="请填写脉搏"
            unit="次/分"
          />
          <med-number-field
            lazy
            v-clear
            v-int="{ min: 0, max: 50 }"
            placeholder="请填写呼吸"
            required
            :rules="[{ required: true, message: '请填写呼吸' }]"
            v-model.number="triage.gcSign.breath"
            label="呼吸"
            unit="次/分"
          />
          <med-bp-field
            required
            label="血压"
            :sbp.sync="triage.gcSign.sbp"
            :dbp.sync="triage.gcSign.dbp"
          />
          <med-number-field
            lazy
            v-clear
            v-int="{ min: 0, max: 100 }"
            placeholder="请填写血氧"
            v-model.number="triage.gcSign.spo"
            required
            :rules="[{ required: true, message: '请填写血氧' }]"
            label="血氧"
            unit="%"
          />
          <med-radio-select-field
            required
            label="意识"
            v-model="triage.gcSign.mind"
            :select-options="dic.mindOpts"
            :rules="[{ required: true, message: '必填' }]"
          />
        </van-cell-group>
      </div>
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
      <div class="task-part-title">
        <span class="solid" />
        <span>其它</span>
      </div>
      <div class="main">
        <med-date-picker
          required
          v-model="triage.gcDetection.bloodCollectionTime"
          label="采血时间"
          :rules="[{ required: true, message: '必填' }]"
          clearable
        />
        <med-number-field
          v-float="{ scale: 2, min: 0, max: 100 }"
          required
          :rules="[{ required: true, message: '请填写快速血糖' }]"
          v-model.number="triage.gcTriage.bloodGlucose"
          label="快速血糖"
          unit="mmol/L"
        ></med-number-field>
        <med-date-picker
          v-model="triage.gcTriage.bloodGlucoseTime"
          label="快速血糖时间"
          clearable
        />
        <med-number-field
          v-float="{ scale: 1, min: 2, max: 400 }"
          required
          :rules="[{ required: true, message: '请填写体重' }]"
          v-model.number="triage.gcTriage.bodyWeight"
          label="体重"
          placeholder="2-400"
          unit="kg"
        >
        </med-number-field>
        <med-radio-button-field
          name="isOpenvein"
          v-model="triage.gcTriage.isOpenvein"
          label="是否开通静脉"
          :select-options="yesNoOption"
        >
        </med-radio-button-field>
        <med-date-picker
          v-if="showByIsOpenvein"
          v-model="triage.gcTriage.openveinTime"
          label="开通静脉时间"
          clearable
        />
      </div>
    </van-form>
  </div>
</template>

<script>
import Patients from '@views/gc/detail/task/components/Patients/index'
import {
  templateConstant,
  yesno,
  yesNoOption,
  ecgType,
  departmentConst,
  comingTypeConst
} from '@constant/commonConstant'
import watchFormMixin from '@mixins/watchFormMixin'
import dateMixin from '@mixins/dateMixin'
import loadingMixin from '@mixins/loadingMixin'
import hospitalMixin from '@mixins/hospitalMixin'
import Estimating from '@views/gc/detail/task/components/Estimating'
// import Electrocardiogram from '@views/gc/electrocardiogram'
import { GcTriage, GcSign, GcDetection, Ecg, Gc } from '@model/commonModel'
import { mapMutations, mapGetters } from 'vuex'
import * as types from '@store/mutations/mutations-types'
import validateFormMixin from '@mixins/validateFormMixin'
import { throttle } from 'lodash'
import { validateTimeSequence } from '@/utils/validate'

const timeout = 2000

export default {
  // 分诊
  name: 'Triage',
  mixins: [
    watchFormMixin,
    dateMixin,
    loadingMixin,
    validateFormMixin,
    hospitalMixin
  ],
  components: { Estimating, Patients },
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
      registId: this.$route.query.registId,
      ecgList: [],
      ecg: this.emptyEcg(),
      templateConstant,
      yesno,
      ecgType,
      departmentConst,
      comingTypeConst,
      // 分诊数据
      triage: this.emptyData(),
      yesNoOption
    }
  },
  created() {
    this.init()
  },
  computed: {
    ...mapGetters(['sharedData', 'patientInfo', 'comingType']),
    departmentType() {
      let department
      // 来院方式为当地120、外院转诊时，门诊号关联列表为急诊列表；
      // 来院方式为自行来院、院内发病、其他时，门诊号关联列表为门诊列表
      if (
        this.comingType === this.comingTypeConst.local120 ||
        this.comingType === this.comingTypeConst.otherHospitalTransfer
      ) {
        department = this.departmentConst.emergency
      } else {
        department = this.departmentConst.outpatient
      }
      return department
    },
    showByIsAfterWakeup() {
      return this.triage.gcTriage.isAfterWakeup === yesno.yes
    },
    /**
     * 是否显示开通静脉时间
     * @returns {boolean}
     */
    showByIsOpenvein() {
      return this.triage.gcTriage.isOpenvein === this.yesno.yes
    },
    // 是否有心电图
    hasEcg() {
      return this.ecg
    },
    dbpWidth() {
      return this.triage.gcSign.dbp ? 'width:0.68rem;' : 'width:1.3rem;'
    },
    sbpWidth() {
      return this.triage.gcSign.sbp ? 'width:0.68rem;' : ';width:1.5rem;'
    }
  },
  methods: {
    ...mapMutations(types),
    init() {
      this.getGcTriage()
      this.getEcgList()
    },
    emptyData() {
      return {
        gcBasic: { ...Gc(), registId: this.$route.query.registId },
        gcTriage: { ...GcTriage(), registId: this.$route.query.registId },
        gcSign: { ...GcSign(), registId: this.$route.query.registId },
        comingType: '',
        gcDetection: { ...GcDetection(), registId: this.$route.query.registId }
      }
    },
    emptyEcg() {
      return {
        ...Ecg(),
        registId: this.$route.query.registId,
        ecgType: ecgType.withinHospital
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
              type: this.departmentType
            }
            // 根据急诊号(急诊分诊凭条)，是否已经建档
            const response = await this.$api.basicInfo.getEmIdPatient(params)
            if (response.status === 200 && response.result) {
              this.$toast('该患者已建档')
              return
            }
          }
          if (!patient?.relationId) {
            this.$toast('该患者缺失relationId')
            return
          }
          // 绑定门诊
          this.bind(patient, closePop)
        })
        .catch(() => {})
    },
    /**
     * 绑定门诊
     * @param patient
     * @param closePop 关闭窗口回调
     */
    bind(patient, closePop) {
      // 绑定参数
      const bindInfo = {
        registId: this.registId,
        visitId: patient.relationId,
        department: this.departmentType
      }
      this.loading()
      this.$api.thirdParty
        .bindWithDepartment(bindInfo)
        .then(res => {
          if (!res.result) {
            this.$notify({ type: 'warning', message: res.message })
            return
          }
          // 获取门诊号
          this.$set(
            this.triage.gcBasic,
            'outPatientNo',
            patient?.displayNo || ''
          )
          closePop()
        })
        .finally(() => this.hideLoading())
    },
    /**
     * 获取分诊信息
     */
    getGcTriage() {
      this.loading()
      this.$api.triage
        .getGcTriage(this.registId)
        .then(({ result }) => {
          this.$preventWatch(() => {
            if (result) {
              if (result.gcBasic) {
                this.triage.gcBasic = {
                  ...this.triage.gcBasic,
                  ...result.gcBasic
                }
                if (result.gcBasic.comingType) {
                  this.triage.comingType = result.gcBasic.comingType
                  this[types.SET_COMINGTYPE](result.gcBasic.comingType)
                }
              }
              if (result.gcTriage) {
                this.triage.gcTriage = {
                  ...this.triage.gcTriage,
                  ...result.gcTriage
                }
                validateTimeSequence(this.triage.gcTriage, 'triage')
              }
              if (result.gcSign) {
                this.triage.gcSign = {
                  ...this.triage.gcSign,
                  ...result.gcSign
                }
              }
              if (result.gcDetection) {
                this.triage.gcDetection = {
                  ...this.triage.gcDetection,
                  ...result.gcDetection
                }
              }
            }
          })
        })
        .finally(() => this.hideLoading())
    },
    /**
     * 获取心电图
     */
    getEcgList() {
      this.$api.ecg
        .getEcg(this.$route.query.registId, this.ecgType.withinHospital)
        .then(({ result }) => {
          this.$preventWatch(() => {
            this.ecgList = result.length > 0 ? result : []
          })
        })
    },
    // 同步[预检分诊：体重]到vuex
    onBodyWeightBlur(val) {
      if (val) {
        const newData = { ...this.sharedData, bodyWeight: val.target._value }
        this[types.SET_SHARED_DATA](newData)
      }
    },
    /**
     * 表单验证
     * @param name
     * @returns {Promise<unknown>}
     */
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
    /**
     * 保存分诊信息
     */
    saveTriage: throttle(function() {
      const req = { ...this.triage.gcTriage }
      const isBodyWeightValid =
        req.bodyWeight === undefined ||
        (req.bodyWeight && req.bodyWeight >= 2 && req.bodyWeight <= 400)
      const isBloodGlucoseValid =
        req.bloodGlucose === undefined ||
        (req.bloodGlucose && req.bloodGlucose >= 0 && req.bloodGlucose <= 100)
      if (isBodyWeightValid && isBloodGlucoseValid) {
        this.$api.triage.saveGcTriage(req).then(res => {
          if (res.status === 200) {
            this.$notify({ type: 'success', message: '保存成功' })
            this.$emit('changed')
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
      }
    }, timeout),
    // 保存基本信息
    saveBasice: throttle(function() {
      const req = { ...this.triage.gcBasic }
      this.$api.basicInfo.insertBasicInformation(req).then(res => {
        if (res.status === 200) {
          this.$notify({ type: 'success', message: '保存成功' })
          this.getGcTriage()
          this.$emit('changed')
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
    /**
     * 保存体征信息
     */
    saveSign: throttle(async function() {
      const req = { ...this.triage.gcSign }
      // await this.validateVitalSigns(req)
      this.$api.sign.saveGcSign(req).then(res => {
        if (res.status === 200) {
          this.$notify({ type: 'success', message: '保存成功' })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, timeout),
    updateComingType() {
      this.$api.basicInfo
        .updateComingTypeByRegistId(this.registId, this.triage.comingType)
        .then(res => {
          if (res.status === 200) {
            this.$notify({ type: 'success', message: '保存成功' })
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
    },
    /**
     * 保存检诊
     */
    saveDetection: throttle(function() {
      const req = { ...this.triage.gcDetection }
      this.$api.detection.saveForTriage(req).then(res => {
        if (res.status === 200) {
          this.$notify({ type: 'success', message: '保存成功' })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, timeout)
  },
  watch: {
    // 监听到达医院时间
    'sharedData.arrivedHospitalTime': {
      immediate: true,
      handler(val) {
        if (val && !this.triage.gcTriage.arriveHospitalTime) {
          this.$set(this.triage.gcTriage, 'arriveHospitalTime', val)
        }
      }
    },
    // 开通静脉时间
    'sharedData.openveinTime': {
      immediate: true,
      handler(val) {
        if (
          this.showByIsOpenvein &&
          val &&
          !this.triage.gcTriage.openveinTime
        ) {
          this.$set(this.triage.gcTriage, 'openveinTime', val)
        }
      }
    },
    // 监听是否开通静脉
    'triage.gcTriage.isOpenvein': {
      immediate: false,
      handler() {
        if (this.triage.gcTriage.isOpenvein === this.yesno.no) {
          this.$set(this.triage.gcTriage, 'openveinTime', '')
        } else if (this.triage.gcTriage.isOpenvein === this.yesno.yes) {
          const val = this.sharedData.openveinTime
          if (val && !this.triage.gcTriage.openveinTime) {
            this.$set(this.triage.gcTriage, 'openveinTime', val)
          }
        }
      }
    },
    // 监听体重
    // 'triage.gcTriage.bodyWeight': {
    //   immediate: false,
    //   handler(newVal) {
    //     this.onBodyWeightChange(newVal)
    //   }
    // },
    'triage.gcTriage': {
      immediate: false,
      handler(v) {
        console.log('watch triage.gcTriage', this.triage.gcTriage)
        const isTimeValid = validateTimeSequence(v, 'triage')
        this.saveTriage()
      },
      deep: true
    },
    'triage.gcBasic': {
      immediate: false,
      handler() {
        this.saveBasice()
      },
      deep: true
    },
    'triage.gcSign': {
      immediate: false,
      handler() {
        this.saveSign()
      },
      deep: true
    },
    'triage.gcDetection': {
      immediate: false,
      handler(v) {
        const isTimeValid = validateTimeSequence(v, 'detection')
        this.saveDetection()
      },
      deep: true
    },
    // 是否FAST-ED评分
    'triage.gcTriage.isFasted': {
      immediate: false,
      handler() {
        if (this.triage.gcTriage.isFasted === this.yesno.no) {
          this.$set(this.triage.gcTriage, 'fastedId', '')
        }
      }
    },
    // 是否mRS评分
    'triage.gcTriage.isMrs': {
      immediate: false,
      handler() {
        if (this.triage.gcTriage.isMrs === this.yesno.no) {
          this.$set(this.triage.gcTriage, 'mrsId', '')
        }
      }
    }
  }
}
</script>
