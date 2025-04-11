<template>
  <div>
    <el-form
      ref="triage"
      :inline="true"
      label-position="top"
      :model="gc"
      :rules="rules"
      class="demo-form-inline"
      size="mini"
    >
      <div>
        <med-subtitle title="接诊信息" />
        <el-row
          v-if="
            comingType &&
              (comingType.indexOf('2') > -1 ||
                comingType.indexOf('4') > -1 ||
                comingType.indexOf('5') > -1)
          "
        >
          <el-col :span="6">
            <el-form-item label="是否为醒后卒中" prop="triage.isAfterWakeup">
              <med-radio
                v-model="gc.triage.isAfterWakeup"
                :readonly="disabled"
                :select-options="isOrNotOpts"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="gc.triage.isAfterWakeup === '1'" :span="6">
            <el-form-item
              label="最后看起来正常时间"
              prop="triage.lastHealthyTime"
            >
              <med-datetime
                v-model="gc.triage.lastHealthyTime"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="gc.triage.isAfterWakeup === '1'" :span="6">
            <el-form-item label="发现时间" prop="triage.awareTime">
              <med-datetime
                v-model="gc.triage.awareTime"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="gc.triage.isAfterWakeup === '0'" :span="6">
            <el-form-item label="发病时间" prop="triage.onsetTime">
              <med-datetime
                v-model="gc.triage.onsetTime"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="门诊号">
              <bind-patient
                :disabled="!isBound || disabled"
                title="关联患者"
                :type="departmentType"
                :patient-name="gc.baseInfo.name"
                :value="gc.baseInfo.outPatientNo"
                :hospital-id="gc.baseInfo.hospitalId"
                :hospital-area="gc.baseInfo.hospitalArea"
                @bind="onBindOutPatientNo"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="患者到院时间" prop="triage.arriveHospitalTime">
              <med-datetime
                v-model="gc.triage.arriveHospitalTime"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="急诊分诊时间" prop="triage.triageTime">
              <med-datetime
                v-model="gc.triage.triageTime"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="急诊医生接诊时间"
              prop="triage.triageVisitTime"
            >
              <med-datetime
                v-model="gc.triage.triageVisitTime"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="通知卒中医生时间">
              <med-datetime
                v-model="gc.triage.strokeNotifyTime"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="卒中医生接诊时间">
              <med-datetime
                v-model="gc.triage.strokeVisitTime"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="接诊医生">
              <el-input
                v-model="gc.triage.strokeDoctor"
                :disabled="disabled"
                placeholder="接诊医生"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="入抢时间">
              <med-datetime
                v-model="gc.triage.rrEnterTime"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="出抢时间">
              <med-datetime
                v-model="gc.triage.rrLeaveTime"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div>
        <med-subtitle title="专科评估" />
        <el-row>
          <el-col :span="6">
            <el-form-item label="是否FAST-ED评分">
              <med-radio
                v-model="gc.triage.isFasted"
                :readonly="disabled"
                :select-options="isOrNotOpts"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item
              v-if="gc.triage.isFasted === '1'"
              label="FAST-ED评分"
              prop="triage.fastedId"
            >
              <estimating-input
                v-model="gc.triage.fastedId"
                title="卒中_FASTED评分"
                type="STROKE_FASTED"
                :regist-id="gc.triage.registId || $route.query.registId"
                placeholder="未评"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="病情分级">
              <med-radio
                v-model="gc.triage.illnessLevel"
                :readonly="disabled"
                :select-options="dic.illnessLevel"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="是否mRS评分">
              <med-radio
                v-model="gc.triage.isMrs"
                :readonly="disabled"
                :select-options="isOrNotOpts"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item v-if="gc.triage.isMrs === '1'" label="mRS评分">
              <estimating-input
                v-model="gc.triage.mrsId"
                title="卒中_mRS评分"
                type="STROKE_MRS"
                :regist-id="gc.triage.registId || $route.query.registId"
                placeholder="未评"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div>
        <med-subtitle title="生命体征" />
        <el-row>
          <el-col :span="6">
            <el-form-item label="体温" prop="sign.temperature">
              <el-input
                v-model="gc.sign.temperature"
                type="number"
                placeholder="请输入内容"
                :disabled="disabled"
              >
                <template slot="append">℃</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="脉搏" prop="sign.plus">
              <el-input
                v-model="gc.sign.plus"
                type="number"
                placeholder="请输入内容"
                :disabled="disabled"
              >
                <template slot="append">次/分</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="呼吸" prop="sign.breath">
              <el-input
                v-model="gc.sign.breath"
                type="number"
                placeholder="请输入内容"
                :disabled="disabled"
              >
                <template slot="append">次/分</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="收缩压" prop="sign.sbp">
              <el-input
                v-model="gc.sign.sbp"
                type="number"
                placeholder="请输入内容"
                :disabled="disabled"
              >
                <template slot="append">mmHg</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="舒张压" prop="sign.dbp">
              <el-input
                v-model="gc.sign.dbp"
                type="number"
                placeholder="请输入内容"
                :disabled="disabled"
              >
                <template slot="append">mmHg</template>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label="心率" prop="sign.heartRate">
              <el-input v-model="gc.sign.heartRate" type="number" placeholder="请输入内容">
                <template slot="append">次/分</template>
              </el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="6">
            <el-form-item label="血氧" prop="sign.spo">
              <el-input
                v-model="gc.sign.spo"
                type="number"
                placeholder="请输入内容"
                :disabled="disabled"
              >
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="意识" prop="sign.mind">
          <med-radio
            v-model="gc.sign.mind"
            radio-type=""
            :readonly="disabled"
            :select-options="dic.mind"
          />
        </el-form-item>
      </div>
      <div>
        <med-subtitle title="心电图" />
        <ecg-list v-model="gc.ecg.b" :disabled="disabled" propPath="ecg.b"/>
      </div>
      <br>
      <div>
        <med-subtitle title="分诊处置" />
        <el-row>
          <el-col :span="6">
            <el-form-item label="采血时间" prop="detection.bloodCollectionTime">
              <med-datetime
                v-model="gc.detection.bloodCollectionTime"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="体重" prop="triage.bodyWeight">
              <el-input
                v-model="gc.triage.bodyWeight"
                type="number"
                :disabled="disabled"
              >
                <template slot="append">Kg</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="快速血糖" prop="triage.bloodGlucose">
              <el-input
                v-model="gc.triage.bloodGlucose"
                type="number"
                :disabled="disabled"
              >
                <template slot="append">mmol/L</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="快速血糖时间">
              <med-datetime
                v-model="gc.triage.bloodGlucoseTime"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="是否开通静脉">
              <med-radio
                v-model="gc.triage.isOpenvein"
                :readonly="disabled"
                :select-options="isOrNotOpts"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              v-if="gc.triage.isOpenvein === '1'"
              label="开通静脉时间"
            >
              <med-datetime
                v-model="gc.triage.openveinTime"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import { isOrNotOpts } from '@/constant/commonConstant'
import { GcTriage, GcSign, Ecg, GcDetection, Gc } from '@/model/commonModel'
import storage from 'store'
import EstimatingInput from '@/components/EstimatingInput'
import EcgList from './ecgList'
import MedSubtitle from '@/components/MedTitle/Subtitle'
import bindPatient from './bindPatient.vue'
import patientApi from '@/api/patient'
import { validateForm } from '@/utils/validate'

export default {
  name: 'Triage',
  components: {
    EstimatingInput,
    EcgList,
    MedSubtitle,
    bindPatient
  },
  props: {
    isBound: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => ({})
    },
    detectionInfo: {
      type: Object,
      default: () => ({})
    },
    comingType: {
      type: String,
      default: ''
    },
    patientInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      isOrNotOpts,
      gc: {
        triage: { ...GcTriage() },
        detection: { ...GcDetection() },
        ecg: { b: [{ ecgType: '1', ...Ecg() }] },
        sign: { ...GcSign() },
        baseInfo: { ...Gc() }
      },
      dic: storage.get('dicData'),
      rules: {
        'triage.isAfterWakeup': [
          { required: true, message: '请选择是否为醒后卒中', trigger: 'blur' }
        ],
        'triage.lastHealthyTime': [
          { required: true, message: '请选择最后看起来正常时间', trigger: 'blur' }
        ],
        'triage.onsetTime': [
          { required: true, message: '请选择发病时间', trigger: 'blur' }
        ],
        'triage.arriveHospitalTime': [
          { required: true, message: '请选择患者到院时间', trigger: 'blur' }
        ],
        'triage.triageTime': [
          { required: true, message: '请选择急诊分诊时间', trigger: 'blur' }
        ],
        'triage.triageVisitTime': [
          { required: true, message: '请选择急诊医生接诊时间', trigger: 'blur' }
        ],
        'sign.mind': [
          { required: true, message: '请输入意识', trigger: 'blur' }
        ],
        'sign.dbp': [
          { required: true, message: '请输入舒张压', trigger: 'blur' }
        ],
        'sign.sbp': [
          { required: true, message: '请输入收缩压', trigger: 'blur' }
        ],
        'sign.temperature': [
          { required: true, message: '请输入体温', trigger: 'blur' }
        ],
        'sign.plus': [
          { required: true, message: '请输入脉搏', trigger: 'blur' }
        ],
        'sign.breath': [
          { required: true, message: '请输入呼吸', trigger: 'blur' }
        ],
        'sign.heartRate': [
          { required: true, message: '请输入心率', trigger: 'blur' }
        ],
        'sign.spo': [
          { required: true, message: '请输入血氧', trigger: 'blur' }
        ],
        'detection.bloodCollectionTime': [
          { required: true, message: '请选择采血时间', trigger: 'blur' }
        ],
        'triage.bodyWeight': [
          { required: true, message: '请输入体重', trigger: 'blur' }
        ],
        'triage.bloodGlucose': [
          { required: true, message: '请选择快速血糖时间', trigger: 'blur' }
        ],
        'triage.fastedId': [
          { required: true, message: '请填写FAST-ED评分', trigger: 'blur' }
        ]
      },
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  computed: {
    departmentType() {
      let department
      // 来院方式为当地120、外院转诊时，门诊号关联列表为急诊列表；
      // 来院方式为自行来院、院内发病、其他时，门诊号关联列表为门诊列表
      if (this.comingType === '1' || this.comingType === '3') {
        department = '2'
      } else {
        department = '3'
      }
      return department
    }
  },
  watch: {
    info: {
      deep: true,
      immediate: true,
      handler(v) {
        this.gc.triage = { ...this.gc.triage, ...this.info.gcTriage }
        this.gc.sign = { ...this.gc.sign, ...this.info.gcSign }
        this.gc.ecg.b = this.info.ecgList
      }
    },
    detectionInfo: {
      deep: true,
      immediate: true,
      handler(v) {
        this.gc.detection = { ...this.gc.detection, ...v.gcDetection }
      }
    },
    patientInfo: {
      deep: true,
      immediate: true,
      handler(v) {
        this.gc.baseInfo = { ...this.gc.baseInfo, ...v }
      }
    },
    comingType: {
      handler() {
        if (
          this.comingType &&
            (this.comingType.indexOf('1') > -1 ||
                this.comingType.indexOf('3') > -1)
        ) {
          this.gc.triage.isAfterWakeup = ''
          this.gc.triage.lastHealthyTime = ''
          this.gc.triage.awareTime = ''
          this.gc.triage.onsetTime = ''
        }
      }
    },
    'gc.triage.isAfterWakeup': {
      handler() {
        if (this.gc.triage.isAfterWakeup === '0') {
          this.gc.triage.lastHealthyTime = ''
          this.gc.triage.awareTime = ''
        } else if (this.gc.triage.isAfterWakeup === '1') {
          this.gc.triage.onsetTime = ''
        }
      }
    },
    'gc.triage.isFasted': {
      handler() {
        if (this.gc.triage.isFasted === '0') {
          this.gc.triage.illnessLevel = ''
        }
      }
    },
    'gc.triage.isOpenvein': {
      handler() {
        if (this.gc.triage.isOpenvein === '0') {
          this.gc.triage.openveinTime = ''
        }
      }
    }
  },
  mounted() {
  },
  methods: {
    onBindOutPatientNo(item, closePop) {
      this.$set(this.gc.baseInfo, 'outPatientNo', item.displayNo)
      if (item.relationId) {
        patientApi
          .bindWithDepartment({
            registId: this.gc.triage.registId || this.$route.query.registId,
            visitId: item.relationId,
            department: this.departmentType
          })
          .then(({ result, message }) => {
            if (!result) {
              this.$message.error(message)
            } else {
              this.$message.success('绑定成功!')
              this.$emit('bind')
              closePop()
            }
          })
          .catch((err) => {
            if (err.response?.data?.message) {
              this.$message.error(err.response?.data?.message)
            }
          })
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    add() {
      this.gc.ecg.b.push({ ...Ecg() })
    },
    remove(index) {
      this.gc.ecg.b.splice(index, 1)
    },
    validate() {
      return validateForm(this.$refs['triage'], '预检分诊')
    }
  }
}
</script>
