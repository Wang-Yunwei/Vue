<template>
  <div>
    <el-form
      ref="pci"
      :inline="true"
      label-position="top"
      :model="gc"
      :rules="rules"
      class="demo-form-inline"
      size="mini"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item label="进入导管室时间" prop="crEnterTime">
            <med-datetime
              v-model="gc.cure.crEnterTime"
              placeholder="选择日期时间"
              :disabled="disabled"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="离开导管室时间" prop="crEnterTime">
            <med-datetime
              v-model="gc.cure.crLeaveTime"
              placeholder="选择日期时间"
              :disabled="disabled"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="激活导管室时间" prop="crActiveTime">
            <med-datetime
              v-model="gc.cure.crActiveTime"
              placeholder="选择日期时间"
              :disabled="disabled"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="介入医生接诊时间" prop="cure.pciAdmissionTime">
            <med-datetime
              v-model="gc.cure.pciAdmissionTime"
              placeholder="选择日期时间"
              :disabled="disabled"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="介入接诊医生" prop="pciAdmissionDoctor">
            <el-input
              v-model="gc.cure.pciAdmissionDoctor"
              :disabled="disabled"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="介入禁忌症" prop="pciTaboo">
        <advancedCheckbox
          v-model="gc.cure.pciTaboo"
          :disabled="disabled"
          :options="dic.pciTaboo"
        />
      </el-form-item>
      <el-row>
        <el-col :span="6">
          <el-form-item label="介入开始谈话时间" prop="cure.pciTalkStartTime">
            <med-datetime
              v-model="gc.cure.pciTalkStartTime"
              placeholder="选择日期时间"
              :disabled="disabled"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="介入是否知情" prop="cure.isRsInformed">
            <med-radio
              v-model="gc.cure.isRsInformed"
              :readonly="disabled"
              :select-options="isOrNotOpts"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="介入知情同意" prop="cure.isPciInformedArgee">
            <med-radio
              v-model="gc.cure.isPciInformedArgee"
              :readonly="disabled"
              :select-options="[
                { label: '同意', value: '1' },
                { label: '拒绝', value: '0' }
              ]"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="gc.cure.isPciInformedArgee === '0'" :span="6">
          <el-form-item label="介入谈话结束时间" prop="cure.pciTalkEndTime">
            <med-datetime
              v-model="gc.cure.pciTalkEndTime"
              placeholder="选择日期时间"
              :disabled="disabled"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="gc.cure.isPciInformedArgee === '1'" :span="6">
          <el-form-item label="介入家属签字时间" prop="cure.pciInformedSignTime">
            <med-datetime
              v-model="gc.cure.pciInformedSignTime"
              placeholder="选择日期时间"
              :disabled="disabled"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item v-if="gc.cure.isPciInformedArgee" label="介入谈话耗时">
            <el-input
              :disabled="disabled"
              :value="calcPciCostTime"
              placeholder="介入谈话耗时"
            >
              <template slot="append">分钟</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-if="gc.cure.isPciInformedArgee === '1'">
        <el-form-item label="介入适应症" prop="pciAdaptation">
          <advancedCheckbox
            v-model="gc.cure.pciAdaptation"
            :disabled="disabled"
            :options="dic.pciAdaptation"
          />
        </el-form-item>
        <el-row>
          <el-col :span="6">
            <el-form-item label="是否介入治疗" prop="cure.isPci">
              <med-radio
                v-model="gc.cure.isPci"
                :readonly="disabled"
                :select-options="isOrNotOpts"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="gc.cure.isPci === '0'" :span="18">
            <el-form-item label="介入治疗拒绝原因">
              <med-radio
                v-model="gc.cure.pciRefuseReason"
                radio-type=""
                :readonly="disabled"
                :select-options="dic.pciRefuseReason"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="gc.cure.isPci === '1'" :span="6">
            <el-form-item label="介入前NIHSS" prop="cure.pciNihssBeforeId">
              <estimating-input
                v-model="gc.cure.pciNihssBeforeId"
                title="卒中_NIHSS评分"
                type="STROKE_NIHSS"
                :regist-id="gc.cure.registId"
                :disabled="disabled"
                placeholder="未评"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="gc.cure.isPci === '1'" :span="6">
            <el-form-item
              label="完成动脉穿刺时间"
              prop="femoralArteryFinishTime"
            >
              <med-datetime
                v-model="gc.cure.femoralArteryFinishTime"
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="gc.cure.isPci === '1'">
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="再通前TICI分级"
                prop="cure.bloodVesselsTiciLevel"
              >
                <med-radio
                  v-model="gc.cure.bloodVesselsTiciLevel"
                  :readonly="disabled"
                  :select-options="dic.ticiLevel"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="完成造影评估时间"
                prop="cure.pciReFinishTime"
              >
                <med-datetime
                  v-model="gc.cure.pciReFinishTime"
                  placeholder="选择日期时间"
                  :disabled="disabled"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="开通策略" prop="pciStrategy">
              <advancedCheckbox
                v-model="gc.cure.pciStrategy"
                :disabled="disabled"
                :options="dic.pciStrategy"
              />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item
              label="开始取栓时间"
              prop="cure.thrombectomyStartTime"
            >
              <med-datetime
                v-model="gc.cure.thrombectomyStartTime"
                placeholder="选择日期时间"
                :disabled="disabled"
              />
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="首次再通TICI分级"
                prop="cure.pciFroTiciLevel"
              >
                <med-radio
                  v-model="gc.cure.pciFroTiciLevel"
                  radio-type=""
                  :readonly="disabled"
                  :select-options="dic.ticiLevel"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="首次血管再通时间" prop="cure.pciFroTime">
                <med-datetime
                  v-model="gc.cure.pciFroTime"
                  placeholder="选择日期时间"
                  :disabled="disabled"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="末次再通TICI分级" prop="pciLroTiciLevel">
                <med-radio
                  v-model="gc.cure.pciLroTiciLevel"
                  radio-type=""
                  :readonly="disabled"
                  :select-options="dic.ticiLevel"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="末次再通时间" prop="pciLroTime">
                <med-datetime
                  v-model="gc.cure.pciLroTime"
                  placeholder="选择日期时间"
                  :disabled="disabled"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="介入后即刻NIHSS" prop="cure.pciNihssAfterId">
                <estimating-input
                  v-model="gc.cure.pciNihssAfterId"
                  title="卒中_NIHSS评分"
                  type="STROKE_NIHSS"
                  :regist-id="gc.cure.registId"
                  placeholder="未评"
                  :disabled="disabled"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="介入是否发生不良事件" prop="cure.isPciAde">
                <med-radio
                  v-model="gc.cure.isPciAde"
                  :readonly="disabled"
                  :select-options="isOrNotOpts"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                v-if="gc.cure.isPciAde === '1'"
                label="介入不良事件时间"
                prop="pciAdeTime"
              >
                <med-datetime
                  v-model="gc.cure.pciAdeTime"
                  placeholder="选择日期时间"
                  :disabled="disabled"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item
            v-if="gc.cure.isPciAde === '1'"
            label="介入不良事件类型"
            prop="pciAdeType"
          >
            <advancedCheckbox
              v-model="gc.cure.pciAdeType"
              :disabled="disabled"
              :options="dic.pciAdeType"
              :other.sync="gc.cure.pciAdeOther"
            />
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import moment from 'moment'
import storage from 'store'
import { GcPci } from '@/model/commonModel'
import advancedCheckbox from '@/components/AdvancedCheckbox'
import EstimatingInput from '@/components/EstimatingInput'
import { isOrNotOpts } from '@/constant/commonConstant'
import { validateForm } from '@/utils/validate'

export default {
  name: 'Pci',
  components: {
    EstimatingInput,
    advancedCheckbox
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
      moment,
      isOrNotOpts,
      gc: {
        cure: { ...GcPci() }
      },
      dic: storage.get('dicData'),
      rules: {
        'cure.pciAdmissionTime': [
          { required: true, message: '请选择介入医生接诊时间', trigger: 'blur' }
        ],
        'cure.isPciInformedArgee': [
          { required: true, message: '请选择介入知情同意', trigger: 'blur' }
        ],
        'cure.isPci': [
          { required: true, message: '请选择是否介入治疗', trigger: 'blur' }
        ],
        'cure.pciNihssBeforeId': [
          { required: true, message: '请填写介入前NIHSS', trigger: 'blur' }
        ],
        'cure.bloodVesselsTiciLevel': [
          { required: true, message: '请选择再通前TICI分级', trigger: 'blur' }
        ],
        'cure.pciReFinishTime': [
          { required: true, message: '请选择完成造影评估时间', trigger: 'blur' }
        ],
        'cure.pciFroTiciLevel': [
          { required: true, message: '请选择首次再通TICI分级', trigger: 'blur' }
        ],
        'cure.pciFroTime': [
          { required: true, message: '请选择首次血管再通时间', trigger: 'blur' }
        ],
        'cure.pciNihssAfterId': [
          { required: true, message: '请填写介入后即刻NIHSS', trigger: 'blur' }
        ],
        'cure.isPciAde': [
          { required: true, message: '请选择介入不良事件', trigger: 'blur' }
        ],
        'cure.pciTalkStartTime': [
          { required: true, message: '请选择介入开始谈话时间', trigger: 'blur' }
        ],
        'cure.isRsInformed': [
          { required: true, message: '请选择介入是否知情', trigger: 'blur' }
        ],
        'cure.pciInformedSignTime': [
          { required: true, message: '请选择介入家属签字时间', trigger: 'blur' }
        ],
        'cure.pciTalkEndTime': [
          { required: true, message: '请选择介入谈话结束时间', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    /**
     * 计算介入谈话耗时
     * 在同意时取介入家属签字时间-介入开始谈话时间，在拒绝时取介入谈话结束时间-介入开始谈话时间
     * @returns {string|number}
     */
    calcPciCostTime() {
      if (!this.gc.cure.isPciInformedArgee) {
        return ''
      }
      if (this.gc.cure.isPciInformedArgee === '1') {
        if (
          !this.gc.cure.pciInformedSignTime ||
          !this.gc.cure.pciTalkStartTime
        ) {
          return ''
        }
        const timeCost =
          moment(this.gc.cure.pciInformedSignTime).valueOf() -
          moment(this.gc.cure.pciTalkStartTime).valueOf()
        return Math.floor(timeCost / 1000 / 60)
      } else if (this.gc.cure.isPciInformedArgee === '0') {
        if (!this.gc.cure.pciTalkEndTime || !this.gc.cure.pciTalkStartTime) {
          return ''
        }
        const timeCost =
          moment(this.gc.cure.pciTalkEndTime).valueOf() -
          moment(this.gc.cure.pciTalkStartTime).valueOf()
        return Math.floor(timeCost / 1000 / 60)
      } else {
        return ''
      }
    }
  },
  watch: {
    'gc.cure.isPciInformedArgee': {
      immediate: false,
      handler(newVal, oldVal) {
        if (this.gc.cure.isPciInformedArgee === '0') {
          this.$set(this.gc.cure, 'pciInformedSignTime', '')
          this.$set(this.gc.cure, 'pciAdaptation', '')
          this.$set(this.gc.cure, 'isPci', '')
          this.$set(this.gc.cure, 'pciRefuseReason', '')
          this.$set(this.gc.cure, 'pciNihssBeforeId', '')
          this.$set(this.gc.cure, 'femoralArteryStartTime', '')
          this.$set(this.gc.cure, 'femoralArteryFinishTime', '')
          this.$set(this.gc.cure, 'bloodVesselsTiciLevel', '')
          this.$set(this.gc.cure, 'pciReFinishTime', '')
          this.$set(this.gc.cure, 'pciStrategy', '')
          this.$set(this.gc.cure, 'thrombectomyStartTime', '')
          this.$set(this.gc.cure, 'pciFroTiciLevel', '')
          this.$set(this.gc.cure, 'pciFroTime', '')
          this.$set(this.gc.cure, 'pciLroTiciLevel', '')
          this.$set(this.gc.cure, 'pciLroTime', '')
          this.$set(this.gc.cure, 'pciNihssAfterId', '')
          this.$set(this.gc.cure, 'isPciAde', '')
          this.$set(this.gc.cure, 'pciAdeTime', '')
          this.$set(this.gc.cure, 'pciAdeType', '')
        } else if (this.gc.cure.isPciInformedArgee === '1') {
          this.$set(this.gc.cure, 'pciTalkEndTime', '')
        }
      },
      deep: true
    },
    'gc.cure.isPci': {
      immediate: false,
      handler(newVal, oldVal) {
        if (this.gc.cure.isPci === '0') {
          this.$set(this.gc.cure, 'pciNihssBeforeId', '')
          this.$set(this.gc.cure, 'femoralArteryStartTime', '')
          this.$set(this.gc.cure, 'femoralArteryFinishTime', '')
          this.$set(this.gc.cure, 'bloodVesselsTiciLevel', '')
          this.$set(this.gc.cure, 'pciReFinishTime', '')
          this.$set(this.gc.cure, 'pciStrategy', '')
          this.$set(this.gc.cure, 'thrombectomyStartTime', '')
          this.$set(this.gc.cure, 'pciFroTiciLevel', '')
          this.$set(this.gc.cure, 'pciFroTime', '')
          this.$set(this.gc.cure, 'pciLroTiciLevel', '')
          this.$set(this.gc.cure, 'pciLroTime', '')
          this.$set(this.gc.cure, 'pciNihssAfterId', '')
          this.$set(this.gc.cure, 'isPciAde', '')
          this.$set(this.gc.cure, 'pciAdeTime', '')
          this.$set(this.gc.cure, 'pciAdeType', '')
        }
      },
      deep: true
    },
    'gc.cure.isPciAde': {
      immediate: false,
      handler(newVal, oldVal) {
        if (this.gc.cure.isPciAde === '0') {
          this.$set(this.gc.cure, 'pciAdeTime', '')
          this.$set(this.gc.cure, 'pciAdeType', '')
        }
      },
      deep: true
    },
    'gc.cure': {
      deep: true,
      immediate: true,
      handler(val) {
        this.$emit('update:info', val)
      }
    },
    info: {
      deep: true,
      immediate: true,
      handler(val) {
        this.gc.cure = this.info
      }
    }
  },
  methods: {
    validate() {
      return validateForm(this.$refs['pci'], '介入手术')
    }
  }
}
</script>
