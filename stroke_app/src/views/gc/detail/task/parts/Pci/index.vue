<template>
  <div class="content-wrapper">
    <van-form ref="form">
      <div class="task-part-title">
        <span class="solid" />
        <span>介入手术</span>
      </div>
      <div class="main">
        <van-cell-group>
          <med-date-picker
            v-model="cure.crActiveTime"
            label="激活导管室时间"
            clearable
          />
          <med-date-picker
            v-model="cure.crEnterTime"
            label="进入导管室时间"
            clearable
          />
          <med-date-picker
            v-model="cure.crLeaveTime"
            label="离开导管室时间"
            clearable
          />
          <med-date-picker
            v-model="cure.pciAdmissionTime"
            label="介入医生接诊时间"
            required
            clearable
            :rules="[{ required: true, message: '必填' }]"
          />
          <med-text-field
            label="介入接诊医生"
            v-model="cure.pciAdmissionDoctor"
            placeholder="介入接诊医生"
            :selectOptions="dic.doctorOpts"
          />
          <multi-select
            label="介入禁忌症"
            v-model="cure.pciTaboo"
            :options="dic.pciTabooList"
            title="介入禁忌症"
          />
          <med-date-picker
            required
            v-model="cure.pciTalkStartTime"
            label="介入开始谈话时间"
            clearable
            :rules="[{ required: true, message: '必填' }]"
          />
          <med-hint-field
            readonly
            clickable
            required
            :name="cure.isPciInformed"
            :value="isPciInformedText"
            label="介入是否知情"
            placeholder="介入是否知情"
            link-icon="arrow"
            @click="hrefShow('isPciInformedShow')"
            :rules="[{ required: true, message: '必填' }]"
          />
          <med-radio-button-field
            required
            name="isPciInformedArgee"
            v-model="cure.isPciInformedArgee"
            label="介入知情同意"
            :select-options="agreeOrNot"
            :rules="[{ required: true, message: '必填' }]"
          >
          </med-radio-button-field>
          <med-date-picker
            v-if="informedArgee"
            required
            v-model="cure.pciInformedSignTime"
            label="介入家属签字时间"
            :rules="[{ required: true, message: '必填' }]"
            clearable
          />
          <med-date-picker
            v-if="informedDisArgee"
            required
            v-model="cure.pciTalkEndTime"
            label="介入谈话结束时间"
            :rules="[{ required: true, message: '必填' }]"
            clearable
          />
          <med-hint-field
            readonly
            label="介入谈话耗时"
            :value="calcPciCostTime"
            placeholder="介入谈话耗时"
          >
            <template #right-icon>
              分钟
            </template>
          </med-hint-field>
          <div v-if="informedArgee">
            <multi-select
              label="介入适应症"
              v-model="cure.pciAdaptation"
              :options="dic.pciAdaptationList"
              title="介入适应症"
            />
            <med-radio-button-field
              required
              name="isPci"
              v-model="cure.isPci"
              label="是否介入治疗"
              :select-options="yesNoOption"
              :rules="[{ required: true, message: '必填' }]"
            >
            </med-radio-button-field>
            <multi-select
              v-if="cure.isPci === '0'"
              label="介入治疗拒绝原因"
              v-model="cure.pciRefuseReason"
              :options="dic.pciRefuseReasonList"
              title="介入治疗拒绝原因"
            />
            <div v-if="showByIsPci">
              <estimating
                :readonly="viewMode"
                v-model="cure.pciNihssBeforeId"
                :reference-id="firstNihssId"
                :type="templateConstant.strokeNihss"
                label="介入前NIHSS"
                placeholder="未评"
                required
                :rules="[{ required: true, message: '必填' }]"
              />
              <med-date-picker
                v-if="false"
                v-model="cure.femoralArteryStartTime"
                label="股动脉穿刺开始时间"
                clearable
              />
              <med-date-picker
                v-model="cure.femoralArteryFinishTime"
                label="完成动脉穿刺时间"
                clearable
              />
              <med-date-picker
                v-if="false"
                v-model="cure.bloodVesselsTime"
                label="首次血管造影开始时间"
                clearable
              />
              <med-radio-select-field
                label="再通前TICI分级"
                v-model="cure.bloodVesselsTiciLevel"
                :select-options="dic.ticiLevelList"
                required
                :rules="[{ required: true, message: '必填' }]"
              ></med-radio-select-field>
              <med-date-picker
                required
                v-model="cure.pciReFinishTime"
                label="完成造影评估时间"
                :rules="[{ required: true, message: '必填' }]"
                clearable
              />
              <multi-select
                label="开通策略"
                v-model="cure.pciStrategy"
                :options="dic.pciStrategyList"
                title="开通策略"
              />
              <med-date-picker
                v-model="cure.thrombectomyStartTime"
                label="开始取栓时间"
                clearable
              />
              <med-radio-select-field
                label="首次再通TICI分级"
                v-model="cure.pciFroTiciLevel"
                :select-options="dic.ticiLevelList"
                required
                :rules="[{ required: true, message: '必填' }]"
              ></med-radio-select-field>
              <med-date-picker
                required
                v-model="cure.pciFroTime"
                label="首次血管再通时间"
                :rules="[{ required: true, message: '必填' }]"
                clearable
              />
              <med-radio-select-field
                label="末次TICI分级"
                v-model="cure.pciLroTiciLevel"
                :select-options="dic.ticiLevelList"
              >
              </med-radio-select-field>
              <med-date-picker
                v-model="cure.pciLroTime"
                label="末次血管再通时间"
                clearable
              />
              <estimating
                :readonly="viewMode"
                v-model="cure.pciNihssAfterId"
                :type="templateConstant.strokeNihss"
                label="介入后即刻NIHSS"
                placeholder="未评"
                required
                :reference-id="firstNihssId"
                :rules="[{ required: true, message: '必填' }]"
              />
              <med-radio-button-field
                required
                name="isPciAde"
                v-model="cure.isPciAde"
                label="介入是否发生不良事件"
                :select-options="yesNoOption"
                :rules="[{ required: true, message: '必填' }]"
              >
              </med-radio-button-field>
              <med-date-picker
                v-if="cure.isPciAde === '1'"
                v-model="cure.pciAdeTime"
                label="介入不良事件时间"
                clearable
              />
              <multi-select
                v-if="cure.isPciAde === '1'"
                label="介入不良事件类型"
                :options="dic.pciAdeTypeList"
                v-model="cure.pciAdeType"
                :other.sync="cure.pciAdeOther"
                title="介入不良事件类型"
              />
            </div>
          </div>
        </van-cell-group>
      </div>
    </van-form>
    <van-popup
      v-model="isPciInformedShow"
      position="right"
      :style="{ width: '100%', height: '100%' }"
    >
      <PciInformed @backClick="backClick" :pciInformed="cure.isPciInformed" />
    </van-popup>
  </div>
</template>

<script>
import dateMixin from '@mixins/dateMixin'
import watchFormMixin from '@mixins/watchFormMixin'
import loadingMixin from '@mixins/loadingMixin'
import PciInformed from '@views/gc/detail/task/parts/Pci/pciInformed'
import Estimating from '@views/gc/detail/task/components/Estimating'
import { yesNoOption, templateConstant } from '@constant/commonConstant'
import { GcCure } from '@model/commonModel'
import dateUtil from '@utils/dateUtil'
import { throttle } from 'lodash'
import { mapGetters } from 'vuex'
import { validateTimeSequence } from '@/utils/validate'

const timeout = 2000

export default {
  name: 'Pci',
  components: { PciInformed, Estimating },
  mixins: [watchFormMixin, dateMixin, loadingMixin],
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
      templateConstant,
      registId: this.$route.query.registId,
      isPciInformedShow: false,
      cure: this.initForm(),
      yesNoOption,
      agreeOrNot: [
        { label: '同意', name: '', value: '1' },
        { label: '拒绝', name: '', value: '0' }
      ]
    }
  },
  created() {
    this.init()
  },
  computed: {
    ...mapGetters(['firstNihssId']),
    /**
     * 介入知情同意
     * @returns {boolean}
     */
    informedArgee() {
      return this.cure.isPciInformedArgee === '1'
    },
    informedDisArgee() {
      return this.cure.isPciInformedArgee === '0'
    },
    showByIsPci() {
      return this.cure.isPci === '1'
    },
    /**
     * 介入是否知情
     * @returns {string}
     */
    isPciInformedText() {
      return !this.cure.isPciInformed || this.cure.isPciInformed === ''
        ? '请选择'
        : this.cure.isPciInformed === '1'
        ? '是'
        : '否'
    },
    /**
     * 计算介入谈话耗时
     * 在同意时取介入家属签字时间-介入开始谈话时间，在拒绝时取介入谈话结束时间-介入开始谈话时间
     * @returns {string|number}
     */
    calcPciCostTime() {
      if (this.cure.isPciInformedArgee === '') {
        return ''
      }
      if (this.cure.isPciInformedArgee === '1') {
        return dateUtil.timeDiffForMinute(
          this.cure.pciTalkStartTime,
          this.cure.pciInformedSignTime
        )
      } else {
        return dateUtil.timeDiffForMinute(
          this.cure.pciTalkStartTime,
          this.cure.pciTalkEndTime
        )
      }
    }
  },
  methods: {
    init() {
      this.queryGcCure()
    },
    initForm() {
      return {
        ...GcCure(),
        registId: this.$route.query.registId
      }
    },
    /**
     * 打开第二页面
     * @param value
     */
    hrefShow(value) {
      this[value] = true
    },
    /**
     * 返回第一界面接收参数
     * @param name
     * @param value
     */
    backClick(name, value) {
      const show = name + 'Show'
      this[show] = false
      this.cure[name] = value.toString()
    },
    queryGcCure() {
      this.loading()
      this.$api.cure
        .getGcCure({
          registId: this.registId
        })
        .then(({ result }) => {
          this.$preventWatch(() => {
            if (result.cure) {
              this.cure = {
                ...this.cure,
                ...result.cure
              }
            }
            validateTimeSequence(this.cure, 'cure')
          })
        })
        .finally(() => this.hideLoading())
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
    saveOrUpdateGcCure: throttle(function() {
      const req = { ...this.cure }
      this.$api.cure.savePci(req).then(res => {
        if (res.code !== '-1') {
          this.$notify({ type: 'success', message: '保存成功' })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, timeout)
  },
  watch: {
    'cure.isPciInformedArgee': {
      immediate: false,
      handler(newVal, oldVal) {
        if (this.cure.isPciInformedArgee === '0') {
          this.$set(this.cure, 'pciInformedSignTime', '')
          this.$set(this.cure, 'pciAdaptation', '')
          this.$set(this.cure, 'isPci', '')
          this.$set(this.cure, 'pciRefuseReason', '')
          this.$set(this.cure, 'pciNihssBeforeId', '')
          this.$set(this.cure, 'femoralArteryStartTime', '')
          this.$set(this.cure, 'femoralArteryFinishTime', '')
          this.$set(this.cure, 'bloodVesselsTiciLevel', '')
          this.$set(this.cure, 'pciReFinishTime', '')
          this.$set(this.cure, 'pciStrategy', '')
          this.$set(this.cure, 'thrombectomyStartTime', '')
          this.$set(this.cure, 'pciFroTiciLevel', '')
          this.$set(this.cure, 'pciFroTime', '')
          this.$set(this.cure, 'pciLroTiciLevel', '')
          this.$set(this.cure, 'pciLroTime', '')
          this.$set(this.cure, 'pciNihssAfterId', '')
          this.$set(this.cure, 'isPciAde', '')
          this.$set(this.cure, 'pciAdeTime', '')
          this.$set(this.cure, 'pciAdeType', '')
        } else if (this.cure.isPciInformedArgee === '1') {
          this.$set(this.cure, 'pciTalkEndTime', '')
        }
      },
      deep: true
    },
    'cure.isPci': {
      immediate: false,
      handler(newVal, oldVal) {
        if (this.cure.isPci === '0') {
          this.$set(this.cure, 'pciNihssBeforeId', '')
          this.$set(this.cure, 'femoralArteryStartTime', '')
          this.$set(this.cure, 'femoralArteryFinishTime', '')
          this.$set(this.cure, 'bloodVesselsTiciLevel', '')
          this.$set(this.cure, 'pciReFinishTime', '')
          this.$set(this.cure, 'pciStrategy', '')
          this.$set(this.cure, 'thrombectomyStartTime', '')
          this.$set(this.cure, 'pciFroTiciLevel', '')
          this.$set(this.cure, 'pciFroTime', '')
          this.$set(this.cure, 'pciLroTiciLevel', '')
          this.$set(this.cure, 'pciLroTime', '')
          this.$set(this.cure, 'pciNihssAfterId', '')
          this.$set(this.cure, 'isPciAde', '')
          this.$set(this.cure, 'pciAdeTime', '')
          this.$set(this.cure, 'pciAdeType', '')
        }
      },
      deep: true
    },
    'cure.isPciAde': {
      immediate: false,
      handler(newVal, oldVal) {
        if (this.cure.isPciAde === '0') {
          this.$set(this.cure, 'pciAdeTime', '')
          this.$set(this.cure, 'pciAdeType', '')
        }
      },
      deep: true
    },
    cure: {
      immediate: false,
      handler(newVal, oldVal) {
        const isTimeValid = validateTimeSequence(this.cure, 'cure')
        this.saveOrUpdateGcCure()
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
