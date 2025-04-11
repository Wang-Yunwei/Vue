<template>
  <div>
    <el-form
      ref="firstAid"
      :inline="true"
      label-position="top"
      :model="gc"
      :rules="rules"
      class="demo-form-inline"
      size="mini"
    >
      <div>
        <med-subtitle title="院前信息" />
        <el-row
          v-if="
            comingType &&
              (comingType.indexOf('1') > -1 || comingType.indexOf('3') > -1)
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
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="gc.triage.isAfterWakeup === '1'" :span="6">
            <el-form-item label="发现时间" prop="triage.awareTime">
              <med-datetime
                v-model="gc.triage.awareTime"
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="gc.triage.isAfterWakeup === '0'" :span="6">
            <el-form-item label="发病时间" prop="triage.onsetTime">
              <med-datetime
                v-model="gc.triage.onsetTime"
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="车牌号">
              <bind-patient
                :disabled="!isBound || disabled"
                title="关联患者"
                type="1"
                :patient-name="triageInfo.gcBasic.name"
                :value="gc.firstAid.licensePlate"
                :hospital-id="triageInfo.gcBasic.hospitalId"
                :hospital-area="triageInfo.gcBasic.hospitalArea"
                @bind="onBindlicensePlate"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="呼救时间">
              <med-datetime
                v-model="gc.firstAid.callTime"
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="接警时间">
              <med-datetime
                v-model="gc.firstAid.acceptMissionTime"
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="派车时间">
              <med-datetime
                v-model="gc.firstAid.planVehicleTime"
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="出车时间">
              <med-datetime
                v-model="gc.firstAid.dispatchVehicleTime"
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="医生到达现场时间">
              <med-datetime
                v-model="gc.firstAid.arrivePatientSideTime"
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="120首诊医生">
              <el-input v-model="gc.firstAid.fmcDoctor" :disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="首次医疗接触时间">
              <med-datetime
                v-model="gc.firstAid.fmcTime"
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="离开现场时间">
              <med-datetime
                v-model="gc.firstAid.leftSceneTime"
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="送达医院时间">
              <med-datetime
                v-model="gc.firstAid.arrivedHospitalTime"
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div>
        <med-subtitle title="患者病史" />
        <el-row>
          <el-col :span="6">
            <el-form-item label="病史记录" prop="firstAid.isMedicalHistory">
              <med-radio
                v-model="gc.firstAid.isMedicalHistory"
                :readonly="disabled"
                :select-options="isOrNotOpts"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              v-if="gc.firstAid.isMedicalHistory === '1'"
              label="病史陈述者"
            >
              <el-input
                v-model="gc.firstAid.declarantName"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              v-if="gc.firstAid.isMedicalHistory === '1'"
              label="主诉"
            >
              <el-input
                v-model="gc.firstAid.cc"
                type="textarea"
                :rows="2"
                class="el-input-textarea"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item
            v-if="gc.firstAid.isMedicalHistory === '1'"
            label="既往病史"
          >
            <advancedCheckbox
              v-model="gc.firstAid.pastHistory"
              :options="dic.pastHistory"
              :other.sync="gc.firstAid.pastHistoryOther"
              :disabled="disabled"
            />
          </el-form-item>
        </el-row>
      </div>
      <div>
        <med-subtitle title="院前生命体征" />
        <el-row>
          <el-col :span="6">
            <el-form-item label="是否检测生命体征">
              <med-radio
                v-model="gc.firstAid.isSign"
                :readonly="disabled"
                :select-options="isOrNotOpts"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="gc.firstAid.isSign === '1'">
          <el-col :span="6">
            <el-form-item label="体温">
              <el-input
                v-model="gc.firstAid.temperature"
                placeholder="请输入内容"
                :disabled="disabled"
              >
                <template slot="append">℃</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="脉搏">
              <el-input
                v-model="gc.firstAid.plus"
                placeholder="请输入内容"
                :disabled="disabled"
              >
                <template slot="append">次/分</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="呼吸">
              <el-input
                v-model="gc.firstAid.breath"
                placeholder="请输入内容"
                :disabled="disabled"
              >
                <template slot="append">次/分</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="gc.firstAid.isSign === '1'">
          <el-col :span="6">
            <el-form-item label="收缩压">
              <el-input
                v-model="gc.firstAid.sbp"
                placeholder="请输入内容"
                :disabled="disabled"
              >
                <template slot="append">mmHg</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="舒张压">
              <el-input
                v-model="gc.firstAid.dbp"
                placeholder="请输入内容"
                :disabled="disabled"
              >
                <template slot="append">mmHg</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="血氧">
              <el-input
                v-model="gc.firstAid.spo"
                placeholder="请输入内容"
                :disabled="disabled"
              >
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="gc.firstAid.isSign === '1'">
          <el-form-item label="意识">
            <el-radio-group v-model="gc.firstAid.mind" :disabled="disabled">
              <el-radio
                v-for="item in dic.mind"
                :key="item.value"
                :label="item.value"
              >
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
      </div>
      <div>
        <med-subtitle title="院前心电图" />
        <ecg-list v-model="gc.ecg.a" :disabled="disabled" propPath="ecg.a"/>
      </div>
      <div>
        <med-subtitle title="院前处置" />
        <el-row>
          <el-col :span="6">
            <el-form-item label="是否院前处置">
              <med-radio
                v-model="gc.firstAid.isPreTreatment"
                :readonly="disabled"
                :select-options="isOrNotOpts"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              v-if="gc.firstAid.isPreTreatment === '1'"
              label="开通静脉通道时间"
            >
              <med-datetime
                v-model="gc.firstAid.openveinTime"
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          v-if="gc.firstAid.isPreTreatment === '1'"
          label="院前用药史"
        >
          <advancedCheckbox
            v-model="gc.firstAid.phepDrugs"
            :options="dic.pharmacyHistory"
            :other.sync="gc.firstAid.phepDrugsOthers"
            :disabled="disabled"
          />
        </el-form-item>
        <br>
        <el-form-item v-if="gc.firstAid.isPreTreatment === '1'" label="吸氧">
          <med-radio
            v-model="gc.firstAid.isOxygen"
            :readonly="disabled"
            :select-options="isOrNotOpts"
          />
        </el-form-item>
        <el-row>
          <el-col :span="6">
            <el-form-item label="是否检测快速血糖">
              <med-radio
                v-model="gc.firstAid.isFastBloodSurger"
                :readonly="disabled"
                :select-options="isOrNotOpts"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="gc.firstAid.isFastBloodSurger === '1'" :span="6">
            <el-form-item label="快速血糖" prop="firstAid.fastBloodSurger">
              <el-input
                v-model="gc.firstAid.fastBloodSurger"
                type="number"
                :disabled="disabled"
              >
                <template slot="append">mmol/L</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="gc.firstAid.isFastBloodSurger === '1'" :span="6">
            <el-form-item label="快速血糖时间">
              <med-datetime
                v-model="gc.firstAid.fastBloodSurgerTime"
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div>
        <med-subtitle title="初步印象" />
        <el-form-item label="初步印象">
          <med-radio
            v-model="gc.firstAid.firstImpression"
            radio-type=""
            :readonly="disabled"
            :select-options="dic.impression"
          />
        </el-form-item>
      </div>
      <div v-if="comingType && comingType.indexOf('3') > -1">
        <med-subtitle title="外院转诊" />
        <el-row>
          <el-col :span="6">
            <el-form-item label="是否外院CT检查">
              <med-radio
                v-model="gc.outReferal.isCtExam"
                :readonly="disabled"
                :select-options="isOrNotOpts"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="gc.outReferal.isCtExam === '1'" :span="6">
            <el-form-item label="CT检查完成时间">
              <med-datetime
                v-model="gc.outReferal.ctExamTime"
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="gc.outReferal.isCtExam === '1'" :span="6">
            <el-form-item label="检查医院">
              <el-input
                v-model="gc.outReferal.hospitalId"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="是否外院行静脉溶栓">
              <med-radio
                v-model="gc.outReferal.isOpenvein"
                :readonly="disabled"
                :select-options="isOrNotOpts"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="gc.outReferal.isOpenvein === '1'">
          <el-col :span="6">
            <el-form-item label="溶栓医院">
              <el-input
                v-model="gc.outReferal.veinHospital"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否是协作医院">
              <med-radio
                v-model="gc.outReferal.isAssitHospital"
                :readonly="disabled"
                :select-options="isOrNotOpts"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="gc.outReferal.isOpenvein === '1'">
          <el-col :span="6">
            <el-form-item label="溶栓药物">
              <med-radio
                v-model="gc.outReferal.veinDrugs"
                :readonly="disabled"
                :select-options="[
                  {
                    label: 'rt-PA',
                    value: '1'
                  },
                  {
                    label: '尿激酶',
                    value: '0'
                  }
                ]"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="gc.outReferal.veinDrugs === '1'" :span="6">
            <el-form-item label="首剂药量">
              <med-radio
                v-model="gc.outReferal.firstDosage"
                :readonly="disabled"
                :select-options="[
                  {
                    label: '0.6mg/kg',
                    value: '1'
                  },
                  {
                    label: '0.9mg/kg',
                    value: '0'
                  }
                ]"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="实际给药剂量">
              <el-input-number
                v-model="gc.outReferal.realDosage"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="gc.outReferal.isOpenvein === '1'">
          <el-col :span="6">
            <el-form-item label="有无其他药物">
              <med-radio
                v-model="gc.outReferal.isOtherDrug"
                :readonly="disabled"
                :select-options="isOrNotOpts"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="gc.outReferal.isOtherDrug === '1'" :span="18">
            <el-form-item label="其他药物">
              <med-radio
                v-model="gc.outReferal.otherDrugs"
                :readonly="disabled"
                :select-options="dic.rsOtherDrug"
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
import { GcFirstAid, GcTriage, Ecg, OutReferal } from '@/model/commonModel'
import advancedCheckbox from '@/components/AdvancedCheckbox'
import EcgList from './ecgList'
import storage from 'store'
import MedSubtitle from '@/components/MedTitle/Subtitle'
import bindPatient from './bindPatient.vue'
import patientApi from '@/api/patient'
import { validateForm } from '@/utils/validate'

export default {
  name: 'FirstAid',
  components: {
    EcgList,
    advancedCheckbox,
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
    triageInfo: {
      type: Object,
      default: () => ({})
    },
    comingType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isOrNotOpts,
      gc: {
        firstAid: { ...GcFirstAid() },
        triage: { ...GcTriage() },
        ecg: { a: [{ ecgType: '2', ...Ecg() }] },
        outReferal: { ...OutReferal() }
      },
      dic: storage.get('dicData'),
      dialogImageUrl: '',
      dialogVisible: false,
      rules: {
        'triage.onsetTime': [
          { required: true, message: '请填写发病时间', trigger: 'blur' }
        ],
        'triage.isAfterWakeup': [
          { required: true, message: '请填写是否为醒后卒中', trigger: 'blur' }
        ],
        'triage.lastHealthyTime': [
          { required: true, message: '请填写最后看起来正常时间', trigger: 'blur' }
        ],
        'firstAid.isMedicalHistory': [
          { required: true, message: '请填写病史记录', trigger: 'blur' }
        ],
        'firstAid.fastBloodSurger': [
          { required: true, message: '请填写快速血糖', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    info: {
      deep: true,
      immediate: true,
      handler(v) {
        this.gc.firstAid = { ...this.gc.firstAid, ...this.info.gcFirstAidVO }
        this.gc.ecg.a = this.info.ecgList
        this.gc.outReferal = { ...this.gc.outReferal, ...this.info.outReferalVO }
      }
    },
    triageInfo: {
      deep: true,
      immediate: true,
      handler(v) {
        this.gc.triage = { ...this.gc.triage, ...v.gcTriage }
      }
    },
    comingType: {
      handler() {
        if (
          !(
            this.comingType &&
            (this.comingType.indexOf('1') > -1 ||
              this.comingType.indexOf('3') > -1)
          )
        ) {
          this.gc.triage.isAfterWakeup = ''
          this.gc.triage.lastHealthyTime = ''
          this.gc.triage.awareTime = ''
          this.gc.triage.onsetTime = ''
        }
        if (!this.comingType.indexOf('3') > -1) {
          this.gc.outReferal.isCtExam = ''
          this.gc.outReferal.ctExamTime = ''
          this.gc.outReferal.hospitalId = ''
          this.gc.outReferal.isOpenvein = ''
          this.gc.outReferal.veinHospital = ''
          this.gc.outReferal.isAssitHospital = ''
          this.gc.outReferal.veinDrugs = ''
          this.gc.outReferal.firstDosage = ''
          this.gc.outReferal.realDosage = ''
          this.gc.outReferal.isOtherDrug = ''
          this.gc.outReferal.otherDrugs = ''
        }
      }
    },
    'gc.triage.isAfterWakeup': {
      handler() {
        if (this.gc.triage.isAfterWakeup === '0') { // 否
          this.$set(this.gc.triage, 'lastHealthyTime', '')
          this.$set(this.gc.triage, 'awareTime', '')
        } else if (this.gc.triage.isAfterWakeup === '1') { // 是
          this.$set(this.gc.triage, 'onsetTime', '')
        }
      }
    },
    'gc.firstAid.isMedicalHistory': {
      handler() {
        if (this.gc.firstAid.isMedicalHistory === '0') {
          this.gc.firstAid.declarantName = ''
          this.gc.firstAid.cc = ''
          this.gc.firstAid.pastHistory = ''
          this.gc.firstAid.pastHistoryOther = ''
        }
      }
    },
    'gc.firstAid.pastHistory': {
      handler() {
        if (!this.gc.firstAid.pastHistory.includes('99')) {
          this.gc.firstAid.pastHistoryOther = ''
        }
      }
    },
    'gc.firstAid.isSign': {
      handler() {
        if (this.gc.firstAid.isSign === '0') {
          this.gc.firstAid.mind = ''
          this.gc.firstAid.sbp = ''
          this.gc.firstAid.dbp = ''
          this.gc.firstAid.temperature = ''
          this.gc.firstAid.plus = ''
          this.gc.firstAid.breath = ''
          this.gc.firstAid.heartRate = ''
          this.gc.firstAid.spo = ''
        }
      }
    },
    'gc.firstAid.isPreTreatment': {
      handler() {
        if (this.gc.firstAid.isPreTreatment === '0') {
          this.gc.firstAid.openveinTime = ''
          this.gc.firstAid.phepDrugs = ''
          this.gc.firstAid.phepDrugsOthers = ''
          this.gc.firstAid.isOxygen = ''
        }
      }
    },
    'gc.firstAid.phepDrugs': {
      handler() {
        if (!this.gc.firstAid.phepDrugs.includes('99')) {
          this.gc.firstAid.phepDrugsOthers = ''
        }
      }
    },
    'gc.firstAid.isFastBloodSurger': {
      handler() {
        if (this.gc.firstAid.isFastBloodSurger === '0') {
          this.gc.firstAid.fastBloodSurger = ''
          this.gc.firstAid.fastBloodSurgerTime = ''
        }
      }
    },
    'gc.outReferal.isCtExam': {
      handler() {
        if (this.gc.outReferal.isCtExam === '0') {
          this.gc.outReferal.ctExamTime = ''
          this.gc.outReferal.hospitalId = ''
        }
      }
    },
    'gc.outReferal.isOpenvein': {
      handler() {
        if (this.gc.outReferal.isOpenvein === '0') {
          this.gc.outReferal.veinHospital = ''
          this.gc.outReferal.isAssitHospital = ''
          this.gc.outReferal.veinDrugs = ''
          this.gc.outReferal.firstDosage = ''
          this.gc.outReferal.realDosage = ''
          this.gc.outReferal.isOtherDrug = ''
          this.gc.outReferal.otherDrugs = ''
        }
      }
    },
    'gc.outReferal.veinDrugs': {
      handler() {
        if (this.gc.outReferal.veinDrugs === '0') {
          this.gc.outReferal.firstDosage = ''
        }
      }
    },
    'gc.outReferal.isOtherDrug': {
      handler() {
        if (this.gc.outReferal.isOtherDrug === '0') {
          this.gc.outReferal.otherDrugs = ''
        }
      }
    }
  },
  mounted() {
  },
  methods: {
    onBindlicensePlate(item, closePop) {
      // 车牌号
      this.$set(this.gc.firstAid, 'licensePlate', item?.licensePlate || '')
      console.log(this.triageInfo.gcTriage)
      if (item.relationId) {
        patientApi
          .bindWithDepartment({
            registId:
              this.triageInfo.gcTriage?.registId || this.$route.query.registId,
            visitId: item.relationId,
            department: '1'
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
      } else {
        this.$message.error('患者缺失relationId')
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
      this.gc.ecg.a.push({ ...Ecg() })
    },
    remove(index) {
      this.gc.ecg.a.splice(index, 1)
    },
    validate() {
      return validateForm(this.$refs['firstAid'], '院前急救')
    }
  }
}
</script>
<style scoped>
.el-input-textarea {
  width: 600px;
}
</style>
