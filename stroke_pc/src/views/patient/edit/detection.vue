<template>
  <div>
    <el-form
      ref="detection"
      :inline="true"
      label-position="top"
      :model="gc"
      :rules="rules"
      class="demo-form-inline"
      size="mini"
    >
      <div>
        <med-subtitle title="病史记录" />
        <el-row>
          <el-col :span="5">
            <el-form-item label="病史陈诉者" prop="name">
              <el-input v-model="gc.mh.declarantName" :disabled="disabled" />
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="与患者关系" prop="declarantType">
              <med-radio
                v-model="gc.mh.declarantType"
                radio-type=""
                :readonly="disabled"
                :select-options="dic.declarantType"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="主诉" prop="cc">
              <el-input
                v-model="gc.mh.cc"
                type="textarea"
                :rows="3"
                class="el-input-textarea"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="症状" prop="symptom">
          <advancedCheckbox
            v-model="gc.mh.symptom"
            :options="dic.symptom"
            :other.sync="gc.mh.symptomOther"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item label="既往病史" prop="pastHistory">
          <advancedCheckbox
            v-model="gc.mh.pastHistory"
            :options="dic.pastHistory"
            :other.sync="gc.mh.pastHistoryOther"
            :disabled="disabled"
          />
        </el-form-item>
        <el-row>
          <el-col :span="6">
            <el-form-item label="过敏史" prop="isAllergicHistory">
              <med-radio
                v-model="gc.mh.isAllergicHistory"
                :readonly="disabled"
                :select-options="isOrNotOpts"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              v-if="gc.mh.isAllergicHistory === '1'"
              label="过敏史"
              prop="allergicHistory"
            >
              <el-input v-model="gc.mh.allergicHistory" :disabled="disabled" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="用药史" prop="pharmacyHistory">
            <advancedCheckbox
              v-model="gc.mh.pharmacyHistory"
              :options="dic.pharmacyHistory"
              :other.sync="gc.mh.pharmacyHistoryOther"
              :disabled="disabled"
            />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item
            v-if="gc.mh.pharmacyHistory.indexOf('1') !== -1"
            label="抗血小板药物"
            prop="phAntiplatelet"
          >
            <advancedCheckbox
              v-model="gc.mh.phAntiplatelet"
              :options="dic.phAntiplateletOpts"
              :other.sync="gc.mh.phAntiplateletOther"
              :disabled="disabled"
            />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item
            v-if="gc.mh.pharmacyHistory.indexOf('2') !== -1"
            label="抗凝药物"
            prop="phAnticoagulation"
          >
            <advancedCheckbox
              v-model="gc.mh.phAnticoagulation"
              :options="dic.phAnticoagulation"
              :disabled="disabled"
              :other.sync="gc.mh.phAnticoagulationOther"
            />
          </el-form-item>
        </el-row>
      </div>
      <div>
        <med-subtitle title="评分" />
        <el-row>
          <el-col :span="6">
            <el-form-item
              label="是否首次NIHSS评分"
              prop="detection.isNihssFirst"
            >
              <med-radio
                v-model="gc.detection.isNihssFirst"
                :readonly="disabled"
                :select-options="isOrNotOpts"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              v-if="gc.detection.isNihssFirst === '1'"
              label="首次NIHSS评分"
              prop="detection.firstNihssId"
            >
              <estimating-input
                v-model="gc.detection.firstNihssId"
                title="卒中_NIHSS评分"
                type="STROKE_NIHSS"
                :regist-id="gc.detection.registId || $route.query.registId"
                placeholder="未评"
                :disabled="disabled"
                @change="({ time }) => (gc.detection.nihssFirstTime = time)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              v-if="gc.detection.isNihssFirst === '1'"
              label="首次NIHSS评分完成时间"
              prop="nihssFirstTime"
            >
              <med-datetime
                v-model="gc.detection.nihssFirstTime"
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="是否首次GCS评分" prop="detection.isGcsFirst">
              <med-radio
                v-model="gc.detection.isGcsFirst"
                :readonly="disabled"
                :select-options="isOrNotOpts"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              v-if="gc.detection.isGcsFirst === '1'"
              label="首次GCS评分"
              prop="firstGcsId"
            >
              <estimating-input
                v-model="gc.detection.firstGcsId"
                title="卒中_GCS评分"
                type="STROKE_GCS"
                :regist-id="gc.detection.registId || $route.query.registId"
                placeholder="未评"
                :disabled="disabled"
                @change="({ time }) => (gc.detection.gcsFirstTime = time)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              v-if="gc.detection.isGcsFirst === '1'"
              label="首次GCS评分完成时间"
              prop="gcsFirstTime"
            >
              <med-datetime
                v-model="gc.detection.gcsFirstTime"
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div>
        <med-subtitle title="实验室检查" />
        <el-row>
          <el-col :span="6">
            <el-form-item
              label="是否有检验项目"
              prop="detection.isLabInspection"
            >
              <med-radio
                v-model="gc.detection.isLabInspection"
                :readonly="disabled"
                :select-options="isOrNotOpts"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="gc.detection.isLabInspection === '1'">
          <el-col :span="6">
            <el-form-item label="检验类型" prop="lisItemTypes">
              <advancedCheckbox
                v-model="gc.lisItemTypes"
                :options="dic.lisItemType"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              v-if="gc.lisItemTypes.includes('1')"
              label="血常规报告时间"
              prop="rbtLis.reportTime"
            >
              <med-datetime
                v-model="gc.rbtLis.reportTime"
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              v-if="gc.lisItemTypes.includes('2')"
              label="凝血常规报告时间"
              prop="crLis.reportTime"
            >
              <med-datetime
                v-model="gc.crLis.reportTime"
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              v-if="gc.lisItemTypes.includes('3')"
              label="肝肾功及电解质报告时间"
              prop="lkfLis.reportTime"
            >
              <med-datetime
                v-model="gc.lkfLis.reportTime"
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <br>
      <div>
        <med-subtitle title="影像检查" />
        <el-row>
          <el-col :span="6">
            <el-form-item label="是否开具头颅CT单" prop="detection.isSkullCt">
              <med-radio
                v-model="gc.detection.isSkullCt"
                :readonly="disabled"
                :select-options="isOrNotOpts"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              v-if="gc.detection.isSkullCt === '1'"
              label="开具头颅CT单时间"
              prop="skullCtTime"
            >
              <med-datetime
                v-model="gc.detection.skullCtTime"
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="是否有检查项目" prop="isScreenInspection">
              <med-radio
                v-model="gc.detection.isScreenInspection"
                :readonly="disabled"
                :select-options="isOrNotOpts"
              />
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item
              v-if="gc.detection.isScreenInspection === '1'"
              label="检查类型"
              prop="imageTypes"
            >
              <advancedCheckbox
                v-model="gc.imageTypes"
                :options="dic.imageItemType"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          v-if="
            gc.detection.isScreenInspection === '1' &&
              gc.imageTypes.includes('1')
          "
        >
          <el-col :span="6">
            <el-form-item label="进入CT室时间" prop="ctEnterTime">
              <med-datetime
                v-model="gc.detection.ctEnterTime"
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="CT平扫检查完成时间" prop="ctImage.finishTime">
              <med-datetime
                v-model="gc.ctImage.finishTime"
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="离开CT室时间" prop="ctLeaveTime">
              <med-datetime
                v-model="gc.detection.ctLeaveTime"
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          v-if="
            gc.detection.isScreenInspection === '1' &&
              gc.imageTypes.includes('1')
          "
        >
          <el-col :span="6">
            <el-form-item label="是否CT-Aspects评分" prop="isCtAspects">
              <med-radio
                v-model="gc.detection.isCtAspects"
                :readonly="disabled"
                :select-options="isOrNotOpts"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              v-if="gc.detection.isCtAspects === '1'"
              label="CT-Aspects评分前循环"
              prop="ctAspectsBeforeId"
            >
              <multi-estimating-input
                v-model="gc.detection.ctAspectsBeforeId"
                title="卒中_CT-Aspects评分前循环"
                type="STROKE_ASPECT_BEFORE"
                :regist-id="gc.detection.registId || $route.query.registId"
                placeholder="未评"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              v-if="gc.detection.isCtAspects === '1'"
              label="CT-Aspects评分后循环"
              prop="ctAspectsAfterId"
            >
              <multi-estimating-input
                v-model="gc.detection.ctAspectsAfterId"
                title="卒中_CT-Aspects评分后循环"
                type="STROKE_ASPECT_AFTER"
                :regist-id="gc.detection.registId || $route.query.registId"
                placeholder="未评"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          v-if="
            gc.detection.isScreenInspection === '1' &&
              gc.imageTypes.includes('2')
          "
        >
          <el-col :span="6">
            <el-form-item label="CTA检查完成时间" prop="ctafinishTime">
              <med-datetime
                v-model="gc.ctaImage.finishTime"
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          v-if="
            gc.detection.isScreenInspection === '1' &&
              gc.imageTypes.includes('3')
          "
        >
          <el-col :span="6">
            <el-form-item label="CTP检查完成时间" prop="ctpfinishTime">
              <med-datetime
                v-model="gc.ctpImage.finishTime"
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          v-if="
            gc.detection.isScreenInspection === '1' &&
              gc.imageTypes.includes('4')
          "
        >
          <el-col :span="6">
            <el-form-item label="MRI开单时间" prop="applyTime">
              <med-datetime
                v-model="gc.mriImage.applyTime"
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="MRI检查完成时间" prop="mrifinishTime">
              <med-datetime
                v-model="gc.mriImage.finishTime"
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          v-if="
            gc.detection.isScreenInspection === '1' &&
              gc.imageTypes.includes('4')
          "
        >
          <el-col :span="6">
            <el-form-item label="是否MRI-Aspects评分" prop="isMriAspects">
              <med-radio
                v-model="gc.detection.isMriAspects"
                :readonly="disabled"
                :select-options="isOrNotOpts"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              v-if="gc.detection.isMriAspects === '1'"
              label="MRI-Aspects评分前循环"
              prop="mriAspectsBeforeId"
            >
              <multi-estimating-input
                v-model="gc.detection.mriAspectsBeforeId"
                title="MRI-Aspects评分前循环"
                type="STROKE_ASPECT_BEFORE"
                :regist-id="gc.detection.registId || $route.query.registId"
                placeholder="未评"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              v-if="gc.detection.isMriAspects === '1'"
              label="MRI-Aspects评分后循环"
              prop="mriAspectsAfterId"
            >
              <multi-estimating-input
                v-model="gc.detection.mriAspectsAfterId"
                title="MRI-Aspects评分后循环"
                type="STROKE_ASPECT_AFTER"
                :regist-id="gc.detection.registId || $route.query.registId"
                placeholder="未评"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          v-if="
            gc.detection.isScreenInspection === '1' &&
              gc.imageTypes.includes('5')
          "
        >
          <el-col :span="6">
            <el-form-item label="MRA检查完成时间" prop="mrafinishTime">
              <med-datetime
                v-model="gc.mraImage.finishTime"
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          v-if="
            gc.detection.isScreenInspection === '1' &&
              gc.imageTypes.includes('6')
          "
        >
          <el-col :span="6">
            <el-form-item label="DWI检查完成时间" prop="dwifinishTime">
              <med-datetime
                v-model="gc.dwiImage.finishTime"
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          v-if="
            gc.detection.isScreenInspection === '1' &&
              gc.imageTypes.includes('7')
          "
        >
          <el-col :span="6">
            <el-form-item label="PWI检查完成时间" prop="pwifinishTime">
              <med-datetime
                v-model="gc.pwiImage.finishTime"
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div>
        <med-subtitle title="分检诊结果" />
        <el-row>
          <el-col :span="12">
            <el-form-item label="初步诊断" prop="detection.diag">
              <med-radio
                v-model="gc.detection.diag"
                radio-type=""
                :readonly="disabled"
                :select-options="dic.diag"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              v-if="gc.detection.diag === '1'"
              label="是否大血管闭塞"
              prop="detection.isLvo"
            >
              <med-radio
                v-model="gc.detection.isLvo"
                :readonly="disabled"
                :select-options="
                  isOrNotOpts.concat([{ label: '不详', value: '99' }])
                "
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="初步处置" prop="detection.dispose">
            <advancedCheckbox
              v-model="gc.detection.dispose"
              :options="dic.dispose"
              :other.sync="gc.detection.disposeOther"
              :disabled="disabled"
              @change="disposeChange"
            />
          </el-form-item>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import { isOrNotOpts } from '@/constant/commonConstant'
import { GcDetection, GcMh, GcLis, GcImage } from '@/model/commonModel'
import advancedCheckbox from '@/components/AdvancedCheckbox'
import EstimatingInput from '@/components/EstimatingInput'
import MultiEstimatingInput from '@/components/MultiEstimatingInput'
import storage from 'store'
import MedSubtitle from '@/components/MedTitle/Subtitle'
import { validateForm } from '@/utils/validate'

export default {
  name: 'Detection',
  components: {
    MultiEstimatingInput,
    EstimatingInput,
    advancedCheckbox,
    MedSubtitle
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isOrNotOpts,
      gc: {
        detection: { ...GcDetection() },
        mh: { ...GcMh() },
        rbtLis: { ...GcLis() },
        crLis: { ...GcLis() },
        lkfLis: { ...GcLis() },
        ctImage: { ...GcImage() },
        ctaImage: { ...GcImage() },
        ctpImage: { ...GcImage() },
        mriImage: { ...GcImage() },
        mraImage: { ...GcImage() },
        dwiImage: { ...GcImage() },
        pwiImage: { ...GcImage() },
        lisItemTypes: [],
        imageTypes: []
      },
      dic: storage.get('dicData'),
      rules: {
        'detection.isEcg': [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        'detection.isNihssFirst': [
          {
            required: true,
            message: '请选择是否首次NIHSS评分',
            trigger: 'blur'
          }
        ],
        'detection.firstNihssId': [
          { required: true, message: '请填写首次NIHSS评分', trigger: 'blur' }
        ],
        'detection.bloodCollectionTime': [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        'detection.isLabInspection': [
          { required: true, message: '请选择是否有检验项目', trigger: 'blur' }
        ],
        lisItemTypes: [{ required: true, message: '请选择', trigger: 'blur' }],
        'rbtLis.reportTime': [
          { required: true, message: '请选择血常规报告时间', trigger: 'change' }
        ],
        'crLis.reportTime': [
          {
            required: true,
            message: '请选择凝血常规报告时间',
            trigger: 'change'
          }
        ],
        'lkfLis.reportTime': [
          {
            required: true,
            message: '请选择肝肾功及电解质报告时间',
            trigger: 'change'
          }
        ],
        'detection.diag': [
          { required: true, message: '请选择初步诊断', trigger: 'blur' }
        ],
        'detection.isLvo': [
          { required: true, message: '请选择是否大血管闭塞', trigger: 'blur' }
        ],
        'detection.dispose': [
          { required: true, message: '请选择初步处置', trigger: 'blur' }
        ],
        'detection.isGcsFirst': [
          { required: true, message: '请选择是否首次GCS评分', trigger: 'blur' }
        ],
        'detection.isSkullCt': [
          { required: true, message: '请选择是否开具头颅CT单', trigger: 'blur' }
        ],
        'ctImage.finishTime': [
          {
            required: true,
            message: '请填写CT平扫检查完成时间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    'gc.mh.isAllergicHistory': {
      handler() {
        if (this.gc.mh.isAllergicHistory === '0') {
          this.gc.mh.allergicHistory = ''
        }
      }
    },
    'gc.detection.isNihssFirst': {
      handler() {
        if (this.gc.detection.isNihssFirst === '0') {
          this.gc.detection.nihssFirstTime = ''
        }
      }
    },
    'gc.detection.isGcsFirst': {
      handler() {
        if (this.gc.detection.isGcsFirst === '0') {
          this.gc.detection.gcsFirstTime = ''
        }
      }
    },
    'gc.detection.isLabInspection': {
      handler() {
        if (this.gc.detection.isLabInspection === '0') {
          this.gc.lisItemTypes = ''
          this.gc.rbtLis.reportTime = ''
          this.gc.crLis.reportTime = ''
          this.gc.lkfLis.reportTime = ''
        }
      }
    },
    'gc.lisItemTypes': {
      handler() {
        if (!this.gc.lisItemTypes.includes('1')) {
          this.gc.rbtLis.reportTime = ''
          this.gc.detection.isRbt = '0'
        } else {
          this.gc.detection.isRbt = '1'
        }
        if (!this.gc.lisItemTypes.includes('2')) {
          this.gc.crLis.reportTime = ''
          this.gc.detection.isCf = '0'
        } else {
          this.gc.detection.isCf = '1'
        }
        if (!this.gc.lisItemTypes.includes('3')) {
          this.gc.lkfLis.reportTime = ''
          this.gc.detection.isRef = '0'
        } else {
          this.gc.detection.isRef = '1'
        }
      }
    },
    'gc.detection.isSkullCt': {
      handler() {
        if (this.gc.detection.isSkullCt === '0') {
          this.gc.detection.skullCtTime = ''
        }
      }
    },
    'gc.detection.isScreenInspection': {
      handler() {
        if (this.gc.detection.isScreenInspection === '0') {
          this.gc.imageTypes = ''
          this.gc.detection.ctEnterTime = ''
          this.gc.ctImage.finishTime = ''
          this.gc.detection.ctLeaveTime = ''
          this.gc.detection.isCtAspects = ''
          this.gc.detection.ctAspectsBeforeId = ''
          this.gc.detection.ctAspectsAfterId = ''
          this.gc.ctaImage.finishTime = ''
          this.gc.ctpImage.finishTime = ''
          this.gc.mriImage.applyTime = ''
          this.gc.mriImage.finishTime = ''
          this.gc.detection.isMriAspects = ''
          this.gc.detection.mriAspectsBeforeId = ''
          this.gc.detection.mriAspectsAfterId = ''
          this.gc.mraImage.finishTime = ''
          this.gc.dwiImage.finishTime = ''
          this.gc.pwiImage.finishTime = ''
        }
      }
    },
    'gc.imageTypes': {
      handler() {
        if (!this.gc.imageTypes.includes('1')) {
          this.gc.detection.ctEnterTime = ''
          this.gc.ctImage.finishTime = ''
          this.gc.detection.ctLeaveTime = ''
          this.gc.detection.isCtAspects = ''
          this.gc.detection.ctAspectsBeforeId = ''
          this.gc.detection.ctAspectsAfterId = ''
          this.gc.detection.isCt = '0'
        } else {
          this.gc.detection.isCt = '1'
        }
        if (!this.gc.imageTypes.includes('2')) {
          this.gc.ctaImage.finishTime = ''
          this.gc.detection.isCta = '0'
        } else {
          this.gc.detection.isCta = '1'
        }
        if (!this.gc.imageTypes.includes('3')) {
          this.gc.ctpImage.finishTime = ''
          this.gc.detection.isCtp = '0'
        } else {
          this.gc.detection.isCtp = '1'
        }
        if (!this.gc.imageTypes.includes('4')) {
          this.gc.mriImage.applyTime = ''
          this.gc.mriImage.finishTime = ''
          this.gc.detection.isMriAspects = ''
          this.gc.detection.mriAspectsBeforeId = ''
          this.gc.detection.mriAspectsAfterId = ''
          this.gc.detection.isMri = '0'
        } else {
          this.gc.detection.isMri = '1'
        }
        if (!this.gc.imageTypes.includes('5')) {
          this.gc.mraImage.finishTime = ''
          this.gc.detection.isMra = '0'
        } else {
          this.gc.detection.isMra = '1'
        }
        if (!this.gc.imageTypes.includes('6')) {
          this.gc.dwiImage.finishTime = ''
          this.gc.detection.isDwi = '0'
        } else {
          this.gc.detection.isDwi = '1'
        }
        if (!this.gc.imageTypes.includes('7')) {
          this.gc.pwiImage.finishTime = ''
          this.gc.detection.isPwi = '0'
        } else {
          this.gc.detection.isPwi = '1'
        }
      }
    },
    'gc.detection.isCtAspects': {
      handler() {
        if (this.gc.detection.isCtAspects === '0') {
          this.gc.detection.ctAspectsBeforeId = ''
          this.gc.detection.ctAspectsAfterId = ''
        }
      }
    },
    'gc.detection.isMriAspects': {
      handler() {
        if (this.gc.detection.isMriAspects === '0') {
          this.gc.detection.mriAspectsBeforeId = ''
          this.gc.detection.mriAspectsAfterId = ''
        }
      }
    },
    'gc.detection.diag': {
      handler() {
        if (!this.gc.detection.diag === '1') {
          this.gc.detection.isLvo = ''
        }
      }
    },
    info: {
      immediate: true,
      deep: true,
      handler() {
        if (this.info) {
          this.gc.detection = { ...this.gc.detection, ...this.info.gcDetection }
          this.gc.mh = { ...this.gc.mh, ...this.info.gcMh }

          // 常规报告
          if (this.info.gcLisList) {
            this.gc.rbtLis = {
              ...this.gc.rbtLis,
              ...(this.info.gcLisList.find((e) => e.itemType === '1') || '')
            }
            this.gc.crLis = {
              ...this.gc.crLis,
              ...(this.info.gcLisList.find((e) => e.itemType === '2') || '')
            }
            this.gc.lkfLis = {
              ...this.gc.lkfLis,
              ...(this.info.gcLisList.find((e) => e.itemType === '3') || '')
            }
          }
          this.gc.lisItemTypes = []
          if (this.gc.detection.isRbt === '1') {
            this.gc.lisItemTypes.push('1')
          }
          if (this.gc.detection.isCf === '1') {
            this.gc.lisItemTypes.push('2')
          }
          if (this.gc.detection.isRef === '1') {
            this.gc.lisItemTypes.push('3')
          }

          // // 此处的代码需要重新整合，当记录为空时，需要指定基础的参数
          // if (this.gc.rbtLis.registId === '') {
          //   this.gc.rbtLis.registId = this.info.gcDetection.registId
          //   this.gc.rbtLis.itemType = '1'
          // }
          // if (this.gc.crLis.registId === '') {
          //   this.gc.crLis.registId = this.info.gcDetection.registId
          //   this.gc.crLis.itemType = '2'
          // }
          // if (this.gc.lkfLis.registId === '') {
          //   this.gc.lkfLis.registId = this.info.gcDetection.registId
          //   this.gc.lkfLis.itemType = '3'
          // }

          if (this.info.gcImageList) {
            this.gc.ctImage = {
              ...this.gc.ctImage,
              ...(this.info.gcImageList.find((e) => e.itemType === '1') || '')
            }
            this.gc.ctaImage = {
              ...this.gc.ctaImage,
              ...(this.info.gcImageList.find((e) => e.itemType === '2') || '')
            }
            this.gc.ctpImage = {
              ...this.gc.ctpImage,
              ...(this.info.gcImageList.find((e) => e.itemType === '3') || '')
            }
            this.gc.mriImage = {
              ...this.gc.mriImage,
              ...(this.info.gcImageList.find((e) => e.itemType === '4') || '')
            }
            this.gc.mraImage = {
              ...this.gc.mraImage,
              ...(this.info.gcImageList.find((e) => e.itemType === '5') || '')
            }
            this.gc.dwiImage = {
              ...this.gc.dwiImage,
              ...(this.info.gcImageList.find((e) => e.itemType === '6') || '')
            }
            this.gc.pwiImage = {
              ...this.gc.pwiImage,
              ...(this.info.gcImageList.find((e) => e.itemType === '7') || '')
            }
          }
          this.gc.imageTypes = []
          if (this.gc.detection.isCt === '1') {
            this.gc.imageTypes.push('1')
          }
          if (this.gc.detection.isCta === '1') {
            this.gc.imageTypes.push('2')
          }
          if (this.gc.detection.isCtp === '1') {
            this.gc.imageTypes.push('3')
          }
          if (this.gc.detection.isMri === '1') {
            this.gc.imageTypes.push('4')
          }
          if (this.gc.detection.isMra === '1') {
            this.gc.imageTypes.push('5')
          }
          if (this.gc.detection.isDwi === '1') {
            this.gc.imageTypes.push('6')
          }
          if (this.gc.detection.isPwi === '1') {
            this.gc.imageTypes.push('7')
          }
        }
        this.disposeChange()
      }
    }
  },
  mounted() {},
  methods: {
    disposeChange() {
      this.$emit('disposeChange', this.gc.detection.dispose)
    },
    validate() {
      return validateForm(this.$refs['detection'], '检验检测')
    }
  }
}
</script>

<style scoped>
.el-input-textarea {
  width: 600px;
}
</style>
