<template>
  <div class="content-wrapper">
    <van-form ref="form">
      <div class="task-part-title">
        <span class="solid" />
        <span>病史记录</span>
      </div>
      <div class="main">
        <med-text-field
          v-model="detectionInfo.gcMh.declarantName"
          label="病史陈述者姓名"
        />
        <med-radio-select-field
          label="与患者关系"
          v-model="detectionInfo.gcMh.declarantType"
          :select-options="dic.declarantTypeOpts"
        />
        <med-text-field v-model="detectionInfo.gcMh.cc" label="主诉" />
        <multi-select
          v-model="detectionInfo.gcMh.symptom"
          :options="dic.symptomOpts"
          :other.sync="detectionInfo.gcMh.symptomOther"
          label="症状"
          title="症状"
        />
        <multi-select
          v-model="detectionInfo.gcMh.pastHistory"
          :options="dic.pastHistoryOpts"
          :other.sync="detectionInfo.gcMh.pastHistoryOther"
          label="既往病史"
          title="既往病史"
        />
        <photo-picker
          label="既往病史记录"
          title="既往病史记录"
          :attachUse="attachUse.pastHistory"
        />
        <med-radio-button-field
          name="isAllergicHistory"
          v-model="detectionInfo.gcMh.isAllergicHistory"
          label="过敏史"
          :select-options="yesNoOption"
        >
        </med-radio-button-field>
        <med-text-field
          v-if="showByIsAllergicHistory"
          v-model="detectionInfo.gcMh.allergicHistory"
          label="过敏史"
        />
        <multi-select
          v-model="detectionInfo.gcMh.pharmacyHistory"
          :options="dic.pharmacyHistoryOpts"
          :other.sync="detectionInfo.gcMh.pharmacyHistoryOther"
          label="用药史"
          title="用药史"
        />
        <multi-select
          v-if="phAntiplateletShow"
          v-model="detectionInfo.gcMh.phAntiplatelet"
          :options="dic.phAntiplateletOpts"
          :other.sync="detectionInfo.gcMh.phAntiplateletOther"
          label="抗血小板药物"
          title="抗血小板药物"
        />
        <multi-select
          v-if="phAnticoagulationShow"
          v-model="detectionInfo.gcMh.phAnticoagulation"
          :options="dic.phAnticoagulationOpts"
          :other.sync="detectionInfo.gcMh.phAnticoagulationOther"
          label="抗凝药物"
          title="抗凝药物"
        />
      </div>
      <div class="task-part-title">
        <span class="solid" />
        <span>评分</span>
      </div>
      <div class="main">
        <med-radio-button-field
          required
          name="isNihssFirst"
          v-model="detectionInfo.gcDetection.isNihssFirst"
          label="是否首次NIHSS评分"
          :select-options="yesNoOption"
          :rules="[{ required: true, message: '必填' }]"
        >
        </med-radio-button-field>
        <estimating
          required
          :readonly="viewMode"
          v-if="showByIsNihssFirst"
          v-model="detectionInfo.gcDetection.firstNihssId"
          :type="templateConstant.strokeNihss"
          label="首次NIHSS评分"
          placeholder="未评"
          @change="onFirstNihssChange"
          :rules="[{ required: true, message: '必填' }]"
        />
        <med-radio-button-field
          required
          name="isGcsFirst"
          v-model="detectionInfo.gcDetection.isGcsFirst"
          label="是否首次GCS评分"
          :select-options="yesNoOption"
          :rules="[{ required: true, message: '必填' }]"
        >
        </med-radio-button-field>
        <estimating
          :readonly="viewMode"
          v-if="showByIsGcsFirst"
          v-model="detectionInfo.gcDetection.firstGcsId"
          :type="templateConstant.strokeGcs"
          label="首次GCS评分"
          placeholder="未评"
          @change="
            ({ time }) => (detectionInfo.gcDetection.gcsFirstTime = time)
          "
        />
        <div class="task-part-title">
          <span class="solid" />
          <span>实验室检查</span>
        </div>
        <div class="main">
          <med-radio-button-field
            required
            name="isLabInspection"
            v-model="detectionInfo.gcDetection.isLabInspection"
            label="是否有检验项目"
            :select-options="yesNoOption"
            :rules="[{ required: true, message: '必填' }]"
          >
          </med-radio-button-field>
          <div
            v-if="detectionInfo.gcDetection.isLabInspection === this.yesno.yes"
          >
            <med-check-select-field
              :rules="[{ required: true, message: '必填' }]"
              v-model="lisItemTypes"
              label="检验类型"
              required
              :select-options="dic.lisItemTypeOpts"
            >
            </med-check-select-field>
            <div v-if="showLisItem('1')">
              <med-date-picker
                v-model="bloodRoutine.reportTime"
                :rules="[{ required: true, message: '必填' }]"
                required
                clearable
                label="血常规报告时间"
              />
              <photo-picker
                v-if="false"
                label="血常规拍照记录"
                title="血常规拍照记录"
                :attachUse="attachUse.bloodRoutine"
              />
            </div>
            <div v-if="showLisItem('2')">
              <med-date-picker
                v-model="coagulationRoutine.reportTime"
                :rules="[{ required: true, message: '必填' }]"
                required
                label="凝血常规报告时间"
                clearable
              />
              <photo-picker
                v-if="false"
                label="凝血常规拍照记录"
                title="凝血常规拍照记录"
                :attachUse="attachUse.coagulationRoutine"
              />
            </div>
            <div v-if="showLisItem('3')">
              <med-date-picker
                required
                v-model="liverElectrolyte.reportTime"
                label="肝肾功能及电解质报告时间"
                :rules="[{ required: true, message: '必填' }]"
                clearable
              />

              <photo-picker
                v-if="false"
                label="肝肾功能及电解质拍照记录"
                title="肝肾功能及电解质拍照记录"
                :attachUse="attachUse.liverElectrolyte"
              />
            </div>
          </div>
        </div>
        <div class="task-part-title">
          <span class="solid" />
          <span>影像检查</span>
        </div>
        <div class="main">
          <med-radio-button-field
            required
            name="isSkullCt"
            v-model="detectionInfo.gcDetection.isSkullCt"
            label="是否开具头颅CT单"
            :select-options="yesNoOption"
            :rules="[{ required: true, message: '必填' }]"
          >
          </med-radio-button-field>
          <med-date-picker
            v-if="showByIsSkullCt"
            v-model="detectionInfo.gcDetection.skullCtTime"
            label="开具头颅CT单时间"
            clearable
          />
          <med-radio-button-field
            name="isScreenInspection"
            v-model="detectionInfo.gcDetection.isScreenInspection"
            label="是否有检查项目"
            :select-options="yesNoOption"
          >
          </med-radio-button-field>
          <div
            v-if="detectionInfo.gcDetection.isScreenInspection === yesno.yes"
          >
            <med-check-select-field
              v-model="imageTypes"
              label="检查类型"
              :select-options="dic.imageItemTypeOpts"
            />
            <div v-if="detectionInfo.gcDetection.isCt === yesno.yes">
              <med-date-picker
                v-model="detectionInfo.gcDetection.ctEnterTime"
                label="进入CT室时间"
                clearable
              />
              <med-date-picker
                v-model="detectionInfo.gcDetection.ctLeaveTime"
                label="离开CT室时间"
                clearable
              />
              <med-date-picker
                required
                v-model="ctFinishTime"
                :rules="[{ required: true, message: '必填' }]"
                label="CT平扫检查完成时间"
                clearable
              />
              <photo-picker
                v-if="false"
                label="CT平扫拍照记录"
                title="CT平扫拍照记录"
                :attachUse="attachUse.ct"
              />
              <med-radio-button-field
                name="isCtAspects"
                v-model="detectionInfo.gcDetection.isCtAspects"
                label="是否CT-Aspects评分"
                :select-options="yesNoOption"
              >
              </med-radio-button-field>
              <div v-if="showByIsCtAspects">
                <multi-estimating
                  :readonly="viewMode"
                  v-model="detectionInfo.gcDetection.ctAspectsBeforeId"
                  :type="templateConstant.strokeAspectBefore"
                  label="CT-Aspects评分前循环"
                  placeholder="未评"
                />
                <multi-estimating
                  :readonly="viewMode"
                  v-model="detectionInfo.gcDetection.ctAspectsAfterId"
                  :type="templateConstant.strokeAspectAfter"
                  label="CT-Aspects评分后循环"
                  placeholder="未评"
                />
              </div>
            </div>
            <div v-if="showByImageTypes('2')">
              <med-date-picker
                v-model="ctaFinishTime"
                label="CTA检查完成时间"
                clearable
              />
              <photo-picker
                v-if="false"
                label="CTA拍照记录"
                title="CTA拍照记录"
                :attachUse="attachUse.cta"
              />
            </div>
            <div v-if="showByImageTypes('3')">
              <med-date-picker
                v-model="ctpFinishTime"
                label="CTP检查完成时间"
                clearable
              />
              <photo-picker
                v-if="false"
                label="CTP拍照记录"
                title="CTP拍照记录"
                :attachUse="attachUse.ctp"
              />
            </div>
            <div v-if="isMri">
              <med-date-picker
                v-model="mriApplyTime"
                label="MRI开单时间"
                clearable
              />
              <med-date-picker
                v-model="mriFinishTime"
                label="MRI检查完成时间"
                clearable
              />
              <photo-picker
                v-if="false"
                label="MRI拍照记录"
                title="MRI拍照记录"
                :attachUse="attachUse.mri"
              />
              <med-radio-button-field
                name="isMriAspects"
                v-model="detectionInfo.gcDetection.isMriAspects"
                label="是否MRI-Aspects评分"
                :select-options="yesNoOption"
              >
              </med-radio-button-field>
              <div v-if="showByIsMriAspects">
                <multi-estimating
                  :readonly="viewMode"
                  v-model="detectionInfo.gcDetection.mriAspectsBeforeId"
                  :type="templateConstant.strokeAspectBefore"
                  label="MRI-Aspects评分前循环"
                  placeholder="未评"
                />
                <multi-estimating
                  :readonly="viewMode"
                  v-model="detectionInfo.gcDetection.mriAspectsAfterId"
                  :type="templateConstant.strokeAspectAfter"
                  label="MRI-Aspects评分后循环"
                  placeholder="未评"
                />
              </div>
            </div>
            <div v-if="showByImageTypes('5')">
              <med-date-picker
                v-model="mraFinishTime"
                label="MRA检查完成时间"
                clearable
              />
              <photo-picker
                v-if="false"
                label="MRA拍照记录"
                title="MRA拍照记录"
                :attachUse="attachUse.mra"
              />
            </div>
            <div v-if="showByImageTypes('6')">
              <med-date-picker
                v-model="dwiFinishTime"
                label="DWI检查完成时间"
                clearable
              />
              <photo-picker
                v-if="false"
                label="DWI拍照记录"
                title="DWI拍照记录"
                :attachUse="attachUse.dwi"
              />
            </div>
            <div v-if="showByImageTypes('7')">
              <med-date-picker
                v-model="pwiFinishTime"
                label="PWI检查完成时间"
                clearable
              />
              <photo-picker
                v-if="false"
                label="PWI拍照记录"
                title="PWI拍照记录"
                :attachUse="attachUse.pwi"
              />
            </div>
          </div>
        </div>
        <div class="task-part-title">
          <span class="solid" />
          <span>分检诊结果</span>
        </div>
        <div class="main">
          <med-radio-select-field
            required
            label="初步诊断"
            v-model="detectionInfo.gcDetection.diag"
            :rules="[{ required: true, message: '必填' }]"
            :select-options="dic.diagOpts"
          ></med-radio-select-field>
          <med-radio-button-field
            required
            name="isLvo"
            v-model="detectionInfo.gcDetection.isLvo"
            label="是否大血管闭塞"
            :select-options="yesNoOption"
            :rules="[{ required: true, message: '必填' }]"
          >
          </med-radio-button-field>
          <van-field
            required
            label="初步处置"
            :value="detectionInfo.gcDetection.dispose"
            :rules="[{ required: true, message: '必填' }]"
          >
            <template #input>
              <med-select
                v-model="detectionInfo.gcDetection.dispose"
                :multiple="{ stringValue: true }"
                :options="dic.disposeOpts"
              />
            </template>
          </van-field>
        </div>
      </div>
    </van-form>
  </div>
</template>

<script>
import {
  attachUse,
  templateConstant,
  yesno,
  yesNoOption,
  imageType
} from '@constant/commonConstant'
import dateMixin from '@mixins/dateMixin'
import dateUtil from '@utils/dateUtil'
import { mapGetters, mapMutations } from 'vuex'
import * as types from '@store/mutations/mutations-types'
import Estimating from '@views/gc/detail/task/components/Estimating'
import MultiEstimating from '@views/gc/detail/task/components/MultiEstimating'
import PhotoPicker from '@views/gc/detail/task/components/PhotoPicker'
import { ImagePreview } from 'vant'
import { GcDetection, GcImage, GcLis, GcMh } from '@model/commonModel'
import loadingMixin from '@mixins/loadingMixin'
import { throttle } from 'lodash'
import { validateTimeSequence } from '@/utils/validate'

const timeout = 2000

export default {
  // 检诊
  name: 'Detection',
  components: { Estimating, MultiEstimating, PhotoPicker },
  mixins: [dateMixin, loadingMixin],
  props: {
    dic: {
      type: Object,
      default: () => ({})
    },
    viewMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      firstNihssId: '',
      registId: this.$route.query.registId,
      dateUtil,
      templateConstant,
      yesno,
      attachUse,
      imageType,
      // 是否有检查项目(实验室检查)
      lisItemTypes: [],
      // 选中的影像学检查类型
      imageTypes: [],
      // 日期时间弹窗字段
      dateField: '',
      // CT检查完成时间
      ctFinishTime: '',
      // CTA检查完成时间
      ctaFinishTime: '',
      // CTP检查完成时间
      ctpFinishTime: '',
      // MRI开单时间
      mriApplyTime: '',
      // MRI检查完成时间
      mriFinishTime: '',
      // MRA检查完成时间
      mraFinishTime: '',
      // DWI检查完成时间
      dwiFinishTime: '',
      // PWI检查完成时间
      pwiFinishTime: '',
      detectionInfo: this.emptyData(),
      // 血常规
      bloodRoutine: {
        ...GcLis(),
        itemType: '1',
        registId: this.$route.query.registId
      },
      // 凝血常规
      coagulationRoutine: {
        ...GcLis(),
        itemType: '2',
        registId: this.$route.query.registId
      },
      // 肝肾功及电解质
      liverElectrolyte: {
        ...GcLis(),
        itemType: '3',
        registId: this.$route.query.registId
      },
      yesNoOption
    }
  },
  created() {
    this.init()
  },
  computed: {
    ...mapGetters(['sharedData']),
    showByIsAllergicHistory() {
      return this.detectionInfo.gcMh.isAllergicHistory === this.yesno.yes
    },
    showByIsNihssFirst() {
      return this.detectionInfo.gcDetection.isNihssFirst === this.yesno.yes
    },
    showByIsGcsFirst() {
      return this.detectionInfo.gcDetection.isGcsFirst === this.yesno.yes
    },
    showByIsCtAspects() {
      return this.detectionInfo.gcDetection.isCtAspects === this.yesno.yes
    },
    showByIsMriAspects() {
      return this.detectionInfo.gcDetection.isMriAspects === this.yesno.yes
    },
    showByIsSkullCt() {
      return this.detectionInfo.gcDetection.isSkullCt === this.yesno.yes
    },
    /**
     * 是否需要显示抗血小板药物
     */
    phAntiplateletShow() {
      if (!this.detectionInfo.gcMh.pharmacyHistory) {
        return false
      }
      const values = this.detectionInfo.gcMh.pharmacyHistory.split(',')
      return values.includes('1')
    },
    /**
     * 是否需要显示抗凝药物
     */
    phAnticoagulationShow() {
      const values = this.detectionInfo.gcMh.pharmacyHistory?.split(',')
      return values && values.includes('2')
    },
    isMri() {
      return this.imageTypes?.includes(this.imageType.mri)
    },
    showLisItem: function() {
      return parameter => {
        if (this.lisItemTypes) {
          return this.lisItemTypes.includes(parameter)
        } else {
          return false
        }
      }
    }
  },
  methods: {
    ...mapMutations(types),
    init() {
      this.getGcDetection()
    },
    onFirstNihssChange({ time, id }) {
      this.detectionInfo.gcDetection.nihssFirstTime = time
      this[types.SET_FIRST_NIHSS_ID](id)
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
    showByImageTypes(imageType) {
      if (this.imageTypes) {
        return this.imageTypes.includes(imageType)
      } else {
        return false
      }
    },
    preview(item) {
      ImagePreview(item)
    },
    emptyData() {
      return {
        gcDetection: { ...GcDetection(), registId: this.$route.query.registId },
        gcMh: { ...GcMh(), registId: this.$route.query.registId },
        // 实验室检查
        gcLisList: [],
        // 影像学检查
        gcImageList: []
      }
    },
    /**
     * 获取分诊信息
     */
    getGcDetection() {
      this.loading()
      this.$api.detection
        .getGcDetection(this.registId)
        .then(({ result }) => {
          this.$preventWatch(() => {
            if (result) {
              if (result.gcDetection) {
                this.detectionInfo.gcDetection = {
                  ...this.detectionInfo.gcDetection,
                  ...result.gcDetection
                }
                // 控制静脉溶栓和介入是否显示
                this[types.SET_DISPOSE](result.gcDetection.dispose)
                this[types.SET_FIRST_NIHSS_ID](result.gcDetection.firstNihssId)
              } else {
                this.detectionInfo.gcDetection = this.emptyData().gcDetection
                this[types.SET_DISPOSE]('')
                this[types.SET_FIRST_NIHSS_ID]('')
              }
              if (result.gcMh) {
                this.detectionInfo.gcMh = {
                  ...this.detectionInfo.gcMh,
                  ...result.gcMh
                }
              } else {
                this.detectionInfo.gcMh = this.emptyData().gcMh
              }
              // 获取实验室检查数据
              if (result.gcLisList) {
                this.detectionInfo.gcLisList = [...result.gcLisList]
                this.lisItemTypes = result.gcLisList.map(e => e.itemType)
                const filteredBloodRoutine = result.gcLisList.find(
                  e => e.itemType === '1'
                )
                if (filteredBloodRoutine) {
                  this.bloodRoutine = filteredBloodRoutine
                }
                const filteredCoagulationRoutine = result.gcLisList.find(
                  e => e.itemType === '2'
                )
                if (filteredCoagulationRoutine) {
                  this.coagulationRoutine = filteredCoagulationRoutine
                }
                const filteredLiverElectrolyte = result.gcLisList.find(
                  e => e.itemType === '3'
                )
                if (filteredLiverElectrolyte) {
                  this.liverElectrolyte = filteredLiverElectrolyte
                }
              } else {
                this.detectionInfo.gcLisList = this.emptyData().gcLisList
              }
              // 获取影像学检查数据
              if (result.gcImageList) {
                this.detectionInfo.gcImageList = [...result.gcImageList]
                this.imageTypes = result.gcImageList.map(e => e.itemType)
                const ctImage = result.gcImageList.find(
                  e => e.itemType === this.imageType.ct
                )
                if (ctImage) {
                  this.ctFinishTime = ctImage.finishTime || ''
                }
                const ctaImage = result.gcImageList.find(
                  e => e.itemType === this.imageType.cta
                )
                if (ctaImage) {
                  this.ctaFinishTime = ctaImage.finishTime || ''
                }
                const ctpImage = result.gcImageList.find(
                  e => e.itemType === this.imageType.ctp
                )
                if (ctpImage) {
                  this.ctpFinishTime = ctpImage.finishTime || ''
                }
                const mriImage = result.gcImageList.find(
                  e => e.itemType === this.imageType.mri
                )
                if (mriImage) {
                  this.mriFinishTime = mriImage.finishTime || ''
                  this.mriApplyTime = mriImage.applyTime || ''
                }
                const mraImage = result.gcImageList.find(
                  e => e.itemType === this.imageType.mra
                )
                if (mraImage) {
                  this.mraFinishTime = mraImage.finishTime || ''
                }
                const dwiImage = result.gcImageList.find(
                  e => e.itemType === this.imageType.dwi
                )
                if (dwiImage) {
                  this.dwiFinishTime = dwiImage.finishTime || ''
                }
                const pwiImage = result.gcImageList.find(
                  e => e.itemType === this.imageType.pwi
                )
                if (pwiImage) {
                  this.pwiFinishTime = pwiImage.finishTime || ''
                }
              } else {
                this.detectionInfo.gcImageList = this.emptyData().gcImageList
              }
              validateTimeSequence(this.detectionInfo, 'detection')
            }
          })
        })
        .finally(() => this.hideLoading())
    },
    /**
     * 创建影像学检查
     * @param itemType
     */
    createGcImage(itemType) {
      return {
        ...GcImage(),
        itemType: `${itemType}`,
        registId: this.$route.query.registId
      }
    },
    clearCt() {
      this.$set(this.detectionInfo.gcDetection, 'isCt', '0')
      this.$set(this.detectionInfo.gcDetection, 'ctEnterTime', '')
      this.$set(this.detectionInfo.gcDetection, 'ctLeaveTime', '')
      this.$set(this.detectionInfo.gcDetection, 'skullCtTime', '')
      this.$set(this.detectionInfo.gcDetection, 'isCtAspects', '')
      this.$set(this.detectionInfo.gcDetection, 'ctAspectsBeforeId', '')
      this.$set(this.detectionInfo.gcDetection, 'ctAspectsAfterId', '')
      this.ctFinishTime = ''
    },
    clearMri() {
      this.$set(this.detectionInfo.gcDetection, 'isMri', '0')
      this.$set(this.detectionInfo.gcDetection, 'mriStartTime', '')
      this.$set(this.detectionInfo.gcDetection, 'mriFinishTime', '')
      this.$set(this.detectionInfo.gcDetection, 'isMriAspects', '')
      this.$set(this.detectionInfo.gcDetection, 'mriAspectsBeforeId', '')
      this.$set(this.detectionInfo.gcDetection, 'mriAspectsAfterId', '')
      this.mriFinishTime = ''
      this.mriApplyTime = ''
    },
    clearCta() {
      this.$set(this.detectionInfo.gcDetection, 'isCta', '0')
      this.ctaFinishTime = ''
    },
    clearCtp() {
      this.$set(this.detectionInfo.gcDetection, 'isCtp', '0')
      this.ctpFinishTime = ''
    },
    clearMra() {
      this.$set(this.detectionInfo.gcDetection, 'isMra', '0')
      this.mraFinishTime = ''
    },
    clearDwi() {
      this.$set(this.detectionInfo.gcDetection, 'isDwi', '0')
      this.dwiFinishTime = ''
    },
    clearPwi() {
      this.$set(this.detectionInfo.gcDetection, 'isPwi', '0')
      this.pwiFinishTime = ''
    },
    prepareImageList() {
      for (const item of this.imageTypes) {
        const gcImage = this.createGcImage(item)
        switch (item) {
          case this.imageType.ct:
            gcImage.enterTime = this.detectionInfo.gcDetection.ctEnterTime
            gcImage.leaveTime = this.detectionInfo.gcDetection.ctLeaveTime
            gcImage.finishTime = this.ctFinishTime
            break
          case this.imageType.cta:
            gcImage.finishTime = this.ctaFinishTime
            break
          case this.imageType.ctp:
            gcImage.finishTime = this.ctpFinishTime
            break
          case this.imageType.mri:
            gcImage.finishTime = this.mriFinishTime
            gcImage.applyTime = this.mriApplyTime
            break
          case this.imageType.mra:
            gcImage.finishTime = this.mraFinishTime
            break
          case this.imageType.dwi:
            gcImage.finishTime = this.dwiFinishTime
            break
          case this.imageType.pwi:
            gcImage.finishTime = this.pwiFinishTime
            break
        }
        this.detectionInfo.gcImageList.push(gcImage)
      }
    },
    // 检查完成时间
    imageFinishTime(newVal, itemType) {
      const image = this.detectionInfo.gcImageList.find(
        e => e.itemType === itemType
      )
      if (image) {
        this.$set(image, 'finishTime', newVal)
      }
    },
    // 开单时间
    imageApplyTime(newVal, itemType) {
      if (newVal !== '') {
        const image = this.detectionInfo.gcImageList.find(
          e => e.itemType === itemType
        )
        if (image) {
          this.$set(image, 'applyTime', newVal)
        }
      }
    },
    /**
     * 保存检诊
     */
    saveDetection: throttle(function() {
      const req = { ...this.detectionInfo.gcDetection }
      this.$api.detection.saveGcDetection(req).then(res => {
        if (res.status === 200) {
          this.$notify({ type: 'success', message: '保存成功' })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, timeout),
    /**
     * 保存病历记录
     */
    saveMh: throttle(function() {
      const req = { ...this.detectionInfo.gcMh }
      this.$api.mh.saveGcMh(req).then(res => {
        if (res.status === 200) {
          this.$notify({ type: 'success', message: '保存成功' })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, timeout),
    /**
     * 保存实验室检查
     */
    saveLis: throttle(function() {
      this.$api.lis
        .saveGcLis(this.registId, this.detectionInfo.gcLisList)
        .then(res => {
          if (res.status === 200) {
            this.$notify({ type: 'success', message: '保存成功' })
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
    }, timeout),
    /**
     * 保存影像学检查
     */
    saveImage: throttle(function() {
      this.$api.image
        .saveGcImage(this.registId, this.detectionInfo.gcImageList)
        .then(res => {
          if (res.status === 200) {
            this.$notify({ type: 'success', message: '保存成功' })
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
    }, timeout)
  },
  watch: {
    // 监听既往病史
    'sharedData.pastHistory': {
      immediate: true,
      handler(val) {
        if (val && !this.detectionInfo.gcMh.pastHistory) {
          this.$set(this.detectionInfo.gcMh, 'pastHistory', val)
        }
      }
    },
    // 监听既往病史(其它)
    'sharedData.pastHistoryOther': {
      immediate: true,
      handler(val) {
        if (val && !this.detectionInfo.gcMh.pastHistoryOther) {
          this.$set(this.detectionInfo.gcMh, 'pastHistoryOther', val)
        }
      }
    },
    'detectionInfo.gcDetection.dispose': {
      handler(val) {
        this[types.SET_DISPOSE](val)
      },
      immediate: true
    },
    'detectionInfo.gcMh.isAllergicHistory': {
      immediate: false,
      handler(newVal, oldVal) {
        if (this.detectionInfo.gcMh.isAllergicHistory === this.yesno.no) {
          this.$set(this.detectionInfo.gcMh, 'allergicHistory', '')
        }
      }
    },
    // 实验室检查
    lisItemTypes: {
      immediate: false,
      handler(newVal, oldVal) {
        const lisList = []
        if (this.lisItemTypes) {
          if (this.lisItemTypes.includes('1')) {
            this.detectionInfo.gcDetection.isRbt = this.yesno.yes
            lisList.push(this.bloodRoutine)
          } else {
            this.detectionInfo.gcDetection.isRbt = this.yesno.no
            this.$set(this.bloodRoutine, 'reportTime', '')
          }
          if (this.lisItemTypes.includes('2')) {
            this.detectionInfo.gcDetection.isCf = this.yesno.yes
            lisList.push(this.coagulationRoutine)
          } else {
            this.detectionInfo.gcDetection.isCf = this.yesno.no
            this.$set(this.coagulationRoutine, 'reportTime', '')
          }
          if (this.lisItemTypes.includes('3')) {
            this.detectionInfo.gcDetection.isRef = this.yesno.yes
            lisList.push(this.liverElectrolyte)
          } else {
            this.detectionInfo.gcDetection.isRef = this.yesno.no
            this.$set(this.liverElectrolyte, 'reportTime', '')
          }
        } else {
          this.detectionInfo.gcDetection.isRbt = this.yesno.no
          this.detectionInfo.gcDetection.isCf = this.yesno.no
          this.detectionInfo.gcDetection.isRef = this.yesno.no
          this.$set(this.bloodRoutine, 'reportTime', '')
          this.$set(this.coagulationRoutine, 'reportTime', '')
          this.$set(this.liverElectrolyte, 'reportTime', '')
        }
        this.$set(this.detectionInfo, 'gcLisList', lisList)
      }
    },
    // 是否有实验室检查项目
    'detectionInfo.gcDetection.isLabInspection': {
      immediate: false,
      handler(newVal, oldVal) {
        if (this.detectionInfo.gcDetection.isLabInspection === this.yesno.no) {
          this.lisItemTypes = []
          this.$set(this.detectionInfo.gcDetection, 'bloodCollectionTime', '')
          this.$set(this.bloodRoutine, 'reportTime', '')
          this.$set(this.coagulationRoutine, 'reportTime', '')
          this.$set(this.liverElectrolyte, 'reportTime', '')
        }
      }
    },
    // 是否有影像学检查项目
    'detectionInfo.gcDetection.isScreenInspection': {
      immediate: false,
      handler(newVal, oldVal) {
        if (
          this.detectionInfo.gcDetection.isScreenInspection === this.yesno.no
        ) {
          this.imageTypes = []
        }
      }
    },
    // 影像学检查下拉框
    imageTypes: {
      handler(newVal, oldVal) {
        this.detectionInfo.gcImageList = []
        if (newVal) {
          this.prepareImageList()
          if (newVal.includes(this.imageType.ct)) {
            this.$set(this.detectionInfo.gcDetection, 'isCt', '1')
          } else {
            this.clearCt()
          }
          if (newVal.includes(this.imageType.cta)) {
            this.$set(this.detectionInfo.gcDetection, 'isCta', '1')
          } else {
            this.clearCta()
          }
          if (newVal.includes(this.imageType.ctp)) {
            this.$set(this.detectionInfo.gcDetection, 'isCtp', '1')
          } else {
            this.clearCtp()
          }
          if (newVal.includes(this.imageType.mri)) {
            this.$set(this.detectionInfo.gcDetection, 'isMri', '1')
          } else {
            this.clearMri()
          }
          if (newVal.includes(this.imageType.mra)) {
            this.$set(this.detectionInfo.gcDetection, 'isMra', '1')
          } else {
            this.clearMra()
          }
          if (newVal.includes(this.imageType.dwi)) {
            this.$set(this.detectionInfo.gcDetection, 'isDwi', '1')
          } else {
            this.clearDwi()
          }
          if (newVal.includes(this.imageType.pwi)) {
            this.$set(this.detectionInfo.gcDetection, 'isPwi', '1')
          } else {
            this.clearPwi()
          }
        } else {
          // 一个都没选中,全部清空
          this.clearCt()
          this.clearCta()
          this.clearMri()
          this.clearCtp()
          this.clearMra()
          this.clearDwi()
          this.clearPwi()
        }
      }
    },
    ctFinishTime: {
      immediate: false,
      handler(newVal, oldVal) {
        this.imageFinishTime(newVal, this.imageType.ct)
      }
    },
    ctaFinishTime: {
      immediate: false,
      handler(newVal, oldVal) {
        this.imageFinishTime(newVal, this.imageType.cta)
      }
    },
    ctpFinishTime: {
      immediate: false,
      handler(newVal, oldVal) {
        this.imageFinishTime(newVal, this.imageType.ctp)
      }
    },
    mriFinishTime: {
      immediate: false,
      handler(newVal, oldVal) {
        this.imageFinishTime(newVal, this.imageType.mri)
      }
    },
    mriApplyTime: {
      immediate: false,
      handler(newVal, oldVal) {
        this.imageApplyTime(newVal, this.imageType.mri)
      }
    },
    mraFinishTime: {
      immediate: false,
      handler(newVal, oldVal) {
        this.imageFinishTime(newVal, this.imageType.mra)
      }
    },
    dwiFinishTime: {
      immediate: false,
      handler(newVal, oldVal) {
        this.imageFinishTime(newVal, this.imageType.dwi)
      }
    },
    pwiFinishTime: {
      immediate: false,
      handler(newVal, oldVal) {
        this.imageFinishTime(newVal, this.imageType.pwi)
      }
    },
    // 初步诊断
    'detectionInfo.gcDetection.diag': {
      immediate: false,
      handler(newVal, oldVal) {
        if (newVal !== this.yesno.yes) {
          this.$set(this.detectionInfo.gcDetection, 'isLvo', '')
        }
      }
    },
    // 用药史
    'detectionInfo.gcMh.pharmacyHistory': {
      immediate: false,
      handler(newVal, oldVal) {
        if (this.detectionInfo.gcMh.pharmacyHistory) {
          const values = this.detectionInfo.gcMh.pharmacyHistory.split(',')
          if (!values.includes('1')) {
            this.$set(this.detectionInfo.gcMh, 'phAntiplatelet', '')
            this.$set(this.detectionInfo.gcMh, 'phAntiplateletOther', '')
          }
          if (!values.includes('2')) {
            this.$set(this.detectionInfo.gcMh, 'phAnticoagulation', '')
            this.$set(this.detectionInfo.gcMh, 'phAnticoagulationOther', '')
          }
        } else {
          this.$set(this.detectionInfo.gcMh, 'phAntiplatelet', '')
          this.$set(this.detectionInfo.gcMh, 'phAntiplateletOther', '')
          this.$set(this.detectionInfo.gcMh, 'phAnticoagulation', '')
          this.$set(this.detectionInfo.gcMh, 'phAnticoagulationOther', '')
        }
      }
    },
    // 是否开具头颅CT单
    'detectionInfo.gcDetection.isSkullCt': {
      immediate: false,
      handler(newVal, oldVal) {
        if (this.detectionInfo.gcDetection.isSkullCt === this.yesno.no) {
          this.$set(this.detectionInfo.gcDetection, 'skullCtTime', '')
        }
      }
    },
    'detectionInfo.gcDetection.isNihssFirst': {
      immediate: false,
      handler(newVal, oldVal) {
        if (this.detectionInfo.gcDetection.isNihssFirst === this.yesno.no) {
          this.$set(this.detectionInfo.gcDetection, 'firstNihssId', '')
          this[types.SET_FIRST_NIHSS_ID]('')
        }
      }
    },
    'detectionInfo.gcDetection.isGcsFirst': {
      immediate: false,
      handler(newVal, oldVal) {
        if (this.detectionInfo.gcDetection.isGcsFirst === this.yesno.no) {
          this.$set(this.detectionInfo.gcDetection, 'firstGcsId', '')
        }
      }
    },
    'detectionInfo.gcDetection.isCtAspects': {
      immediate: false,
      handler(newVal, oldVal) {
        if (this.detectionInfo.gcDetection.isCtAspects === this.yesno.no) {
          this.$set(this.detectionInfo.gcDetection, 'ctAspectsBeforeId', '')
          this.$set(this.detectionInfo.gcDetection, 'ctAspectsAfterId', '')
        }
      }
    },
    'detectionInfo.gcDetection.isMriAspects': {
      immediate: false,
      handler(newVal, oldVal) {
        if (this.detectionInfo.gcDetection.isMriAspects === this.yesno.no) {
          this.$set(this.detectionInfo.gcDetection, 'mriAspectsBeforeId', '')
          this.$set(this.detectionInfo.gcDetection, 'mriAspectsAfterId', '')
        }
      }
    },
    // 保存各个模块
    // 保存检诊
    'detectionInfo.gcDetection': {
      immediate: false,
      handler(newVal, oldVal) {
        const isTimeValid = validateTimeSequence(this.detectionInfo, 'detection')
        this.saveDetection()
      },
      deep: true
    },
    'detectionInfo.gcMh': {
      immediate: false,
      handler(newVal, oldVal) {
        this.saveMh()
      },
      deep: true
    },
    // 保存实验室检查
    'detectionInfo.gcLisList': {
      handler(newVal, oldVal) {
        const isTimeValid = validateTimeSequence(this.detectionInfo, 'detection')
        this.saveLis()
      },
      deep: true
    },
    // 保存影像学检查
    'detectionInfo.gcImageList': {
      handler(newVal, oldVal) {
        const isTimeValid = validateTimeSequence(this.detectionInfo, 'detection')
        this.saveImage()
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
