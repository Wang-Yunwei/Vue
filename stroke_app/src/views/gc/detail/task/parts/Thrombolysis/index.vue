<template>
  <div class="content-wrapper">
    <van-form ref="form">
      <div class="task-part-title">
        <span class="solid" />
        <span>静脉溶栓</span>
      </div>
      <div class="main">
        <van-cell-group>
          <med-date-picker
            v-model="cure.rsAdmissionTime"
            label="溶栓医生接诊时间"
            required
            clearable
            :rules="[{ required: true, message: '必填' }]"
          />
          <med-text-field
            label="接诊医生"
            v-model="cure.rsAdmissionDoctor"
            placeholder="接诊医生"
            :selectOptions="dic.doctorOpts"
          />
          <multi-select
            label="溶栓禁忌症"
            :options="dic.rsTabooList"
            v-model="cure.rsTaboo"
            title="溶栓禁忌症"
          />
          <multi-select
            label="溶栓相对禁忌症"
            :options="dic.rsRelativeTabooList"
            v-model="cure.rsRelativeTaboo"
            title="溶栓相对禁忌症"
          />
          <med-date-picker
            v-model="cure.rsTalkStartTime"
            label="溶栓开始谈话时间"
            required
            clearable
            :rules="[{ required: true, message: '必填' }]"
          />
          <med-hint-field
            readonly
            clickable
            required
            :name="cure.isRsInformed"
            :value="isRsInformedText"
            label="溶栓是否知情"
            placeholder="溶栓是否知情"
            link-icon="arrow"
            @click="hrefShow('isRsInformedShow')"
            :rules="[{ required: true, message: '必填' }]"
          />
          <med-radio-button-field
            required
            name="isRsInformedArgee"
            v-model="cure.isRsInformedArgee"
            label="溶栓知情同意"
            :select-options="agreeOrNot"
            :rules="[{ required: true, message: '必填' }]"
          >
          </med-radio-button-field>
          <med-date-picker
            v-if="informedArgee"
            name="rsInformedSignTime"
            required
            v-model="cure.rsInformedSignTime"
            label="溶栓家属签字时间"
            :rules="[{ required: true, message: '必填' }]"
            clearable
          />
          <med-date-picker
            v-if="informedDisArgee"
            required
            v-model="cure.rsTalkEndTime"
            label="溶栓谈话结束时间"
            :rules="[{ required: true, message: '必填' }]"
            clearable
          />
          <med-hint-field
            readonly
            v-if="informedArgee || informedDisArgee"
            label="溶栓谈话耗时"
            :value="calcRsCostTime"
            placeholder="溶栓谈话耗时"
          >
            <template #right-icon>
              分钟
            </template>
          </med-hint-field>
          <med-radio-button-field
            required
            name="sRsVein"
            v-model="cure.sRsVein"
            label="是否静脉溶栓"
            :select-options="yesNoOption"
            :rules="[{ required: true, message: '必填' }]"
          >
          </med-radio-button-field>
          <multi-select
            v-if="informedArgee && cure.sRsVein === '0'"
            label="溶栓拒绝原因"
            :options="dic.rsRefuseReasonList"
            v-model="cure.rsRefuseReason"
            title="溶栓拒绝原因"
          />
          <estimating
            :readonly="viewMode"
            v-if="informedArgee && cure.sRsVein === '1'"
            label="溶栓前NIHSS"
            placeholder="未评"
            :type="templateConstant.strokeNihss"
            v-model="cure.rsNihssBeforeId"
            :reference-id="firstNihssId"
            required
            :rules="[{ required: true, message: '必填' }]"
          />
          <med-date-picker
            required
            v-if="informedArgee && cure.sRsVein === '1'"
            v-model="cure.firstPharmacyTime"
            label="首剂给药时间"
            :rules="[{ required: true, message: '必填' }]"
            clearable
          />
          <med-number-field
            v-if="informedArgee && cure.sRsVein === '1'"
            v-clear
            v-float="{ scale: 1, min: 2, max: 400 }"
            placeholder="2-400"
            v-model.number="cure.bodyWeight"
            label="患者体重"
            unit="kg"
            min="2"
          />
          <med-radio-button-field
            required
            v-if="informedArgee && cure.sRsVein === '1'"
            label="溶栓药物"
            v-model="cure.rsDrugs"
            :rules="[{ required: true, message: '必填' }]"
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
          ></med-radio-button-field>
          <multi-select
            v-if="informedArgee && cure.sRsVein === '1' && cure.rsDrugs === '1'"
            label="溶栓适应症"
            v-model="cure.rsAdaptation"
            :options="dic.rsAdaptation1List"
            title="溶栓适应症"
          />
          <multi-select
            v-if="informedArgee && cure.sRsVein === '1' && cure.rsDrugs === '0'"
            label="溶栓适应症"
            v-model="cure.rsAdaptation"
            :options="dic.rsAdaptation2List"
            title="溶栓适应症"
          />
          <med-radio-select-field
            v-if="informedArgee && cure.sRsVein === '1' && cure.rsDrugs === '1'"
            label="给药剂量标准"
            v-model="cure.rsDose"
            :select-options="dic.rsDoseList"
          ></med-radio-select-field>
          <med-number-field
            v-clear
            v-int="{ min: 0, max: 9999999999 }"
            v-if="informedArgee && cure.sRsVein === '1' && cure.rsDrugs === '1'"
            v-model.number="cure.rsDoseActual"
            label="实际给药剂量"
            placeholder="实际给药剂量"
            min="0"
            unit="mg"
          />
          <med-number-field
            v-clear
            v-if="informedArgee && cure.sRsVein === '1' && cure.rsDrugs === '0'"
            v-int="{ min: 0, max: 9999999999 }"
            v-model.number="rsUrokinaseDose"
            label="尿激酶给药剂量"
            placeholder="尿激酶给药剂量"
            min="0"
            unit="万IU"
          />
          <med-radio-select-field
            v-if="informedArgee && cure.sRsVein === '1'"
            label="使用其他药物"
            v-model="cure.rsOtherDrug"
            :select-options="dic.rsOtherDrugList"
          ></med-radio-select-field>
          <med-hint-field
            v-if="
              informedArgee && cure.sRsVein === '1' && cure.rsOtherDrug === '5'
            "
            v-model="cure.rsOthers"
            label="使用其他药物其他"
            placeholder="使用其他药物其他"
          />
          <estimating
            :readonly="viewMode"
            v-if="informedArgee && cure.sRsVein === '1'"
            label="溶栓后即刻NIHSS"
            placeholder="未评"
            :type="templateConstant.strokeNihss"
            v-model="cure.rsNihssAfterId"
            :reference-id="firstNihssId"
            required
            :rules="[{ required: true, message: '必填' }]"
          />
          <med-radio-button-field
            required
            name="isRsAde"
            v-if="informedArgee && cure.sRsVein === '1'"
            v-model="cure.isRsAde"
            label="静脉溶栓是否发生不良事件"
            :select-options="yesNoOption"
            :rules="[{ required: true, message: '必填' }]"
          >
          </med-radio-button-field>
          <med-date-picker
            v-if="informedArgee && cure.sRsVein === '1' && cure.isRsAde === '1'"
            v-model="cure.rsAdeTime"
            label="静脉溶栓不良事件时间"
            clearable
          />
          <med-radio-select-field
            v-if="informedArgee && cure.sRsVein === '1' && cure.isRsAde === '1'"
            label="静脉溶栓不良事件类型"
            v-model="cure.rsAdeType"
            :select-options="dic.rsAdeTypeList"
          ></med-radio-select-field>
          <med-radio-select-field
            v-if="
              informedArgee &&
                cure.sRsVein === '1' &&
                cure.isRsAde === '1' &&
                cure.rsAdeType === '0'
            "
            label="颅内出血类型"
            v-model="cure.rsAdeIhType"
            :select-options="dic.rsAdeIhTypeList"
          ></med-radio-select-field>
          <med-radio-select-field
            label="出血严重程度"
            v-if="
              informedArgee &&
                cure.sRsVein === '1' &&
                cure.isRsAde === '1' &&
                cure.rsAdeType === '0'
            "
            v-model="cure.rsAdeIhSeverity"
            :select-options="dic.rsAdeIhSeverityList"
          >
          </med-radio-select-field>
          <med-radio-button-field
            name="sRsVein"
            v-if="
              informedArgee &&
                cure.sRsVein === '1' &&
                cure.isRsAde === '1' &&
                cure.rsAdeType === '0'
            "
            v-model="cure.isRsAdeIahr"
            label="是否合并梗死灶外出血转化"
            :select-options="yesNoOption"
          >
          </med-radio-button-field>
          <multi-select
            v-if="
              informedArgee &&
                cure.sRsVein === '1' &&
                cure.isRsAde === '1' &&
                cure.rsAdeType === '1'
            "
            label="静脉溶栓其他不良事件"
            :options="dic.rsAdeOtherOpts"
            v-model="cure.rsAdeOther"
          />
        </van-cell-group>
      </div>
    </van-form>
    <van-popup
      v-model="isRsInformedShow"
      position="right"
      :style="{ width: '100%', height: '100%' }"
    >
      <RsInformed @backClick="backClick" :rsInformed="cure.isRsInformed" />
    </van-popup>
    <van-popup
      v-model="rsAdeOtherShow"
      position="right"
      :style="{ width: '100%', height: '100%' }"
    >
      <RsAdeOther @backClick="backClick" :rsAdeOther="cure.rsAdeOther" />
    </van-popup>
  </div>
</template>

<script>
import dateMixin from '@mixins/dateMixin'
import watchFormMixin from '@mixins/watchFormMixin'
import loadingMixin from '@mixins/loadingMixin'
import RsInformed from '@views/gc/detail/task/parts/Thrombolysis/rsInformed'
import RsAdeOther from '@views/gc/detail/task/parts/Thrombolysis/rsAdeOther'
import Estimating from '@views/gc/detail/task/components/Estimating'
import { GcCure } from '@model/commonModel'
import { templateConstant, yesno, yesNoOption } from '@constant/commonConstant'
import dateUtil from '@utils/dateUtil'
import { throttle } from 'lodash'
import { mapGetters } from 'vuex'
import { validateTimeSequence } from '@/utils/validate'

const timeout = 2000

export default {
  // 静脉溶栓
  name: 'Thrombolysis',
  components: { RsInformed, RsAdeOther, Estimating },
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
      yesno,
      registId: this.$route.query.registId,
      isRsInformedShow: false,
      rsAdeOtherShow: false,
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
    ...mapGetters(['sharedData', 'firstNihssId']),
    rsUrokinaseDose: {
      get() {
        // 数据库为字符类型,考虑后续要支持区间值先不改,前端强转为数字
        return this.cure.rsUrokinaseDose
          ? Number(this.cure.rsUrokinaseDose)
          : undefined
      },
      set(v) {
        this.cure.rsUrokinaseDose = v
      }
    },
    sRsVein() {
      return this.cure.sRsVein === this.yesno.yes
    },
    // 知情同意
    informedArgee() {
      return this.cure.isRsInformedArgee === '1'
    },
    // 知情拒绝
    informedDisArgee() {
      return this.cure.isRsInformedArgee === '0'
    },
    /**
     * 溶栓是否知情
     * @returns {string}
     */
    isRsInformedText() {
      return !this.cure.isRsInformed || this.cure.isRsInformed === ''
        ? '请选择'
        : this.cure.isRsInformed === '1'
        ? '是'
        : '否'
    },
    /**
     * 计算溶栓谈话耗时
     * 在同意时取溶栓家属签字时间-溶栓开始谈话时间，在拒绝时取溶栓谈话结束时间-溶栓开始谈话时间
     * @returns {string|number}
     */
    calcRsCostTime() {
      if (this.cure.isRsInformedArgee === '') {
        return ''
      }
      if (this.cure.isRsInformedArgee === '1') {
        return dateUtil.timeDiffForMinute(
          this.cure.rsTalkStartTime,
          this.cure.rsInformedSignTime
        )
      } else {
        return dateUtil.timeDiffForMinute(
          this.cure.rsTalkStartTime,
          this.cure.rsTalkEndTime
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
      this.$api.cure.saveThrombolysis(req).then(res => {
        if (res.code !== '-1') {
          this.$notify({ type: 'success', message: '保存成功' })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, timeout)
  },
  watch: {
    'cure.isRsInformedArgee': {
      immediate: false,
      handler() {
        if (this.cure.isRsInformedArgee === '0') {
          this.$set(this.cure, 'isRsInformed', '')
          this.$set(this.cure, 'rsInformedSignTime', '')
          this.$set(this.cure, 'rsCostTime', '')
          this.$set(this.cure, 'sRsVein', '')
          this.$set(this.cure, 'rsRefuseReason', '')
          this.$set(this.cure, 'rsNihssBeforeId', '')
          this.$set(this.cure, 'firstPharmacyTime', '')
          this.$set(this.cure, 'bodyWeight', undefined)
          this.$set(this.cure, 'rsDrugs', '')
          this.$set(this.cure, 'rsDose', '')
          this.$set(this.cure, 'rsDoseActual', undefined)
          this.$set(this.cure, 'rsUrokinaseDose', undefined)
          this.$set(this.cure, 'rsOtherDrug', '')
          this.$set(this.cure, 'rsOthers', '')
          this.$set(this.cure, 'rsNihssAfterId', '')
          this.$set(this.cure, 'isRsAde', '')
          this.$set(this.cure, 'rsAdeTime', '')
          this.$set(this.cure, 'rsAdeType', '')
          this.$set(this.cure, 'rsAdeIhType', '')
          this.$set(this.cure, 'rsAdeIhSeverity', '')
          this.$set(this.cure, 'isRsAdeIahr', '')
          this.$set(this.cure, 'rsAdeOther', '')
        } else if (this.cure.isRsInformedArgee === '1') {
          this.$set(this.cure, 'rsTalkEndTime', '')
        }
      }
    },
    'cure.sRsVein': {
      immediate: false,
      handler() {
        if (this.cure.sRsVein === this.yesno.no) {
          this.$set(this.cure, 'rsNihssBeforeId', '')
          this.$set(this.cure, 'firstPharmacyTime', '')
          this.$set(this.cure, 'bodyWeight', undefined)
          this.$set(this.cure, 'rsDrugs', '')
          this.$set(this.cure, 'rsAdaptation', '')
          this.$set(this.cure, 'rsDose', '')
          this.$set(this.cure, 'rsDoseActual', undefined)
          this.$set(this.cure, 'rsUrokinaseDose', undefined)
          this.$set(this.cure, 'rsOtherDrug', '')
          this.$set(this.cure, 'rsOthers', '')
          this.$set(this.cure, 'rsNihssAfterId', '')
          this.$set(this.cure, 'isRsAde', '')
          this.$set(this.cure, 'rsAdeTime', '')
          this.$set(this.cure, 'rsAdeType', '')
          this.$set(this.cure, 'rsAdeIhType', '')
          this.$set(this.cure, 'rsAdeIhSeverity', '')
          this.$set(this.cure, 'isRsAdeIahr', '')
          this.$set(this.cure, 'rsAdeOther', '')
        } else {
          this.$set(this.cure, 'rsRefuseReason', '')
          // 使用分诊的体重
          const val = this.sharedData.bodyWeight
          if (val && !this.cure.bodyWeight) {
            this.$set(this.cure, 'bodyWeight', val)
          }
        }
      }
    },
    'cure.rsDrugs': {
      immediate: false,
      handler() {
        this.$set(this.cure, 'rsAdaptation', '')
        if (this.cure.rsDrugs === '1') {
          this.$set(this.cure, 'rsUrokinaseDose', undefined)
        } else {
          this.$set(this.cure, 'rsDose', '')
          this.$set(this.cure, 'rsDoseActual', undefined)
        }
      }
    },
    'cure.rsOtherDrug': {
      immediate: false,
      handler() {
        if (this.cure.rsOtherDrug !== '6') {
          this.$set(this.cure, 'rsOthers', '')
        }
      }
    },
    'cure.isRsAde': {
      immediate: false,
      handler() {
        if (this.cure.isRsAde === '0') {
          this.$set(this.cure, 'rsAdeTime', '')
          this.$set(this.cure, 'rsAdeType', '')
          this.$set(this.cure, 'rsAdeIhType', '')
          this.$set(this.cure, 'rsAdeIhSeverity', '')
          this.$set(this.cure, 'isRsAdeIahr', '')
          this.$set(this.cure, 'rsAdeOther', '')
        }
      }
    },
    'cure.rsAdeType': {
      immediate: false,
      handler() {
        if (this.cure.rsAdeType === '0') {
          this.$set(this.cure, 'rsAdeOther', '')
        } else {
          this.$set(this.cure, 'rsAdeIhType', '')
          this.$set(this.cure, 'rsAdeIhSeverity', '')
          this.$set(this.cure, 'isRsAdeIahr', '')
        }
      }
    },
    cure: {
      immediate: false,
      handler() {
        const isTimeValid = validateTimeSequence(this.cure, 'cure')
        this.saveOrUpdateGcCure()
      },
      deep: true
    },
    // 开通静脉时间
    'sharedData.bodyWeight': {
      immediate: true,
      handler(val) {
        if (this.sRsVein && val && !this.cure.bodyWeight) {
          this.$set(this.cure, 'bodyWeight', val)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
