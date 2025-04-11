<template>
  <div>
    <el-form
      ref="rs"
      :inline="true"
      label-position="top"
      :model="gc"
      :rules="rules"
      class="demo-form-inline"
      size="mini"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item label="溶栓医生接诊时间" prop="cure.rsAdmissionTime">
            <med-datetime
              v-model="gc.cure.rsAdmissionTime"
              placeholder="选择日期时间"
              :disabled="disabled"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="接诊医生" prop="rsAdmissionDoctor">
            <el-input
              v-model="gc.cure.rsAdmissionDoctor"
              :disabled="disabled"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="溶栓禁忌症" prop="rsTaboo">
        <advancedCheckbox
          v-model="gc.cure.rsTaboo"
          :options="dic.rsTaboo"
          :disabled="disabled"
        />
      </el-form-item>
      <el-form-item label="溶栓相对禁忌症" prop="rsRelativeTaboo">
        <advancedCheckbox
          v-model="gc.cure.rsRelativeTaboo"
          :options="dic.rsRelativeTaboo"
          :disabled="disabled"
        />
      </el-form-item>
      <el-row>
        <el-col :span="6">
          <el-form-item label="溶栓开始谈话时间" prop="cure.rsTalkStartTime">
            <med-datetime
              v-model="gc.cure.rsTalkStartTime"
              placeholder="选择日期时间"
              :disabled="disabled"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="溶栓是否知情" prop="cure.isRsInformed">
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
          <el-form-item label="溶栓知情同意" prop="cure.isRsInformedArgee">
            <med-radio
              v-model="gc.cure.isRsInformedArgee"
              :readonly="disabled"
              :select-options="[
                {
                  label: '同意',
                  value: '1'
                },
                {
                  label: '拒绝',
                  value: '0'
                }
              ]"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="gc.cure.isRsInformedArgee === '0'" :span="6">
          <el-form-item label="溶栓谈话结束时间" prop="cure.rsTalkEndTime">
            <med-datetime
              v-model="gc.cure.rsTalkEndTime"
              placeholder="选择日期时间"
              :disabled="disabled"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="gc.cure.isRsInformedArgee === '1'" :span="6">
          <el-form-item label="溶栓家属签字时间" prop="cure.rsInformedSignTime">
            <med-datetime
              v-model="gc.cure.rsInformedSignTime"
              placeholder="选择日期时间"
              :disabled="disabled"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item v-if="gc.cure.isRsInformedArgee" label="溶栓谈话耗时">
            <el-input :value="calcRsCostTime" placeholder="溶栓谈话耗时">
              <template slot="append">分钟</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-if="gc.cure.isRsInformedArgee === '1'">
        <el-row>
          <el-col :span="6">
            <el-form-item label="是否静脉溶栓" prop="cure.sRsVein">
              <med-radio
                v-model="gc.cure.sRsVein"
                :readonly="disabled"
                :select-options="isOrNotOpts"
              />
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item
              v-if="gc.cure.sRsVein === '0'"
              label="拒绝溶栓原因"
              prop="rsRefuseReason"
            >
              <med-radio
                v-model="gc.cure.rsRefuseReason"
                :readonly="disabled"
                :select-options="dic.rsRefuseReason"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="gc.cure.sRsVein === '1'" :span="6">
            <el-form-item label="溶栓前NIHSS" prop="cure.rsNihssBeforeId">
              <estimating-input
                v-model="gc.cure.rsNihssBeforeId"
                title="溶栓前_NIHSS评分"
                type="STROKE_NIHSS"
                :regist-id="gc.cure.registId || $route.query.registId"
                placeholder="未评"
                :disabled="disabled"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="gc.cure.sRsVein === '1'">
          <el-row>
            <el-col :span="6">
              <el-form-item label="首剂给药时间" prop="cure.firstPharmacyTime">
                <med-datetime
                  v-model="gc.cure.firstPharmacyTime"
                  placeholder="选择日期时间"
                  :disabled="disabled"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="患者体重" prop="bodyWeight">
                <el-input v-model="gc.cure.bodyWeight" :disabled="disabled">
                  <template slot="append">Kg</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="溶栓药物" prop="cure.rsDrugs">
                <med-radio
                  v-model="gc.cure.rsDrugs"
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
          </el-row>
          <el-form-item
            v-if="gc.cure.rsDrugs === '1'"
            label="溶栓适应症"
            prop="rsAdaptation"
          >
            <advancedCheckbox
              v-model="gc.cure.rsAdaptation"
              :options="dic.rsAdaptation1"
              :disabled="disabled"
            />
          </el-form-item>
          <el-form-item
            v-if="gc.cure.rsDrugs === '0'"
            label="溶栓适应症"
            prop="rsAdaptation"
          >
            <advancedCheckbox
              v-model="gc.cure.rsAdaptation"
              :options="dic.rsAdaptation2"
              :disabled="disabled"
            />
          </el-form-item>
          <el-row>
            <el-col :span="6">
              <el-form-item
                v-if="gc.cure.rsDrugs === '1'"
                label="给药剂量标准"
                prop="rsDose"
              >
                <med-radio
                  v-model="gc.cure.rsDose"
                  radio-type=""
                  :readonly="disabled"
                  :select-options="dic.rsDose"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                v-if="gc.cure.rsDrugs === '1'"
                label="实际给药剂量"
                prop="rsDoseActual"
              >
                <el-input
                  v-model="gc.cure.rsDoseActual"
                  placeholder="请输入内容"
                  :disabled="disabled"
                >
                  <template slot="append">mg</template>
                </el-input>
              </el-form-item>
              <el-form-item
                v-if="gc.cure.rsDrugs === '0'"
                label="尿激酶给药剂量"
                prop="rsDoseActual"
              >
                <el-input
                  v-model="gc.cure.rsUrokinaseDose"
                  placeholder="请输入内容"
                  :disabled="disabled"
                >
                  <template slot="append">mg</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item label="其他溶栓药物" prop="rsOtherDrug">
                <advancedRadio
                  v-model="gc.cure.rsOtherDrug"
                  :options="dic.rsOtherDrug"
                  :other.sync="gc.cure.rsOthers"
                  :disabled="disabled"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7">
              <el-form-item label="溶栓后即刻NIHSS" prop="cure.rsNihssAfterId">
                <estimating-input
                  v-model="gc.cure.rsNihssAfterId"
                  title="溶栓后_NIHSS评分"
                  type="STROKE_NIHSS"
                  :regist-id="gc.cure.registId || $route.query.registId"
                  placeholder="未评"
                  :disabled="disabled"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="静脉溶栓是否发生不良事件"
                prop="cure.isRsAde"
              >
                <med-radio
                  v-model="gc.cure.isRsAde"
                  :readonly="disabled"
                  :select-options="isOrNotOpts"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if="gc.cure.isRsAde === '1'">
            <el-row>
              <el-col :span="6">
                <el-form-item label="静脉溶栓不良事件时间" prop="rsAdeTime">
                  <med-datetime
                    v-model="gc.cure.rsAdeTime"
                    placeholder="选择日期时间"
                    :disabled="disabled"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="静脉溶栓不良事件类型" prop="rsAdeType">
                  <med-radio
                    v-model="gc.cure.rsAdeType"
                    radio-type=""
                    :readonly="disabled"
                    :select-options="dic.rsAdeType"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="15">
                <el-form-item
                  v-if="gc.cure.rsAdeType === '0'"
                  label="颅内出血类型"
                  prop="rsAdeIhType"
                >
                  <med-radio
                    v-model="gc.cure.rsAdeIhType"
                    radio-type=""
                    :readonly="disabled"
                    :select-options="dic.rsAdeIhType"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item
                  v-if="gc.cure.rsAdeType === '0'"
                  label="出血严重程度"
                  prop="rsAdeIhSeverity"
                >
                  <med-radio
                    v-model="gc.cure.rsAdeIhSeverity"
                    radio-type=""
                    :readonly="disabled"
                    :select-options="dic.rsAdeIhSeverity"
                  />
                </el-form-item>
              </el-col>
              <el-form-item
                v-if="gc.cure.rsAdeType === '0'"
                label="是否合并梗死灶外出血转化"
                prop="isRsAdeIahr"
              >
                <med-radio
                  v-model="gc.cure.isRsAdeIahr"
                  :readonly="disabled"
                  :select-options="isOrNotOpts"
                />
              </el-form-item>

              <el-form-item
                v-if="gc.cure.rsAdeType === '1'"
                label="静脉溶栓其他不良事件"
                prop="rsAdeOther"
              >
                <med-radio
                  v-model="gc.cure.rsAdeOther"
                  :readonly="disabled"
                  radio-type=""
                  :select-options="rsAdeOther"
                />
              </el-form-item>
            </el-row>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import moment from 'moment'
import storage from 'store'
import { GcRs } from '@/model/commonModel'
import advancedCheckbox from '@/components/AdvancedCheckbox'
import advancedRadio from '@/components/AdvancedRadio'
import EstimatingInput from '@/components/EstimatingInput'
import { isOrNotOpts } from '@/constant/commonConstant'
import { validateForm } from '@/utils/validate'

export default {
  name: 'Cure',
  components: {
    EstimatingInput,
    advancedCheckbox,
    advancedRadio
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
        cure: { ...GcRs() }
      },
      dic: storage.get('dicData'),
      rules: {
        'cure.rsAdmissionTime': [
          { required: true, message: '请选择溶栓医生接诊时间', trigger: 'blur' }
        ],
        'cure.rsTalkStartTime': [
          { required: true, message: '请选择溶栓开始谈话时间', trigger: 'blur' }
        ],
        'cure.isRsInformed': [
          { required: true, message: '请选择溶栓是否知情', trigger: 'blur' }
        ],
        'cure.isRsInformedArgee': [
          { required: true, message: '请选择溶栓知情同意', trigger: 'blur' }
        ],
        'cure.rsInformedSignTime': [
          { required: true, message: '请选择溶栓家属签字时间', trigger: 'blur' }
        ],
        'cure.rsTalkEndTime': [
          { required: true, message: '请选择溶栓谈话结束时间', trigger: 'blur' }
        ],
        'cure.sRsVein': [
          { required: true, message: '请选择是否静脉溶栓', trigger: 'blur' }
        ],
        'cure.firstPharmacyTime': [
          { required: true, message: '请选择首剂给药时间', trigger: 'blur' }
        ],
        'cure.rsDrugs': [
          { required: true, message: '请选择溶栓药物', trigger: 'blur' }
        ],
        'cure.rsNihssAfterId': [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        'cure.isRsAde': [
          { required: true, message: '请选择静脉溶栓是否发生不良事件', trigger: 'blur' }
        ],
        'cure.rsNihssBeforeId': [
          { required: true, message: '请填写溶栓前NIHSS', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    /**
     * 计算溶栓谈话耗时
     * 在同意时取溶栓家属签字时间-溶栓开始谈话时间，在拒绝时取溶栓谈话结束时间-溶栓开始谈话时间
     * @returns {string|number}
     */
    calcRsCostTime() {
      if (!this.gc.cure.isRsInformedArgee) {
        return ''
      }
      if (this.gc.cure.isRsInformedArgee === '1') {
        if (!this.gc.cure.rsInformedSignTime || !this.gc.cure.rsTalkStartTime) {
          return ''
        }
        const timeCost =
          moment(this.gc.cure.rsInformedSignTime).valueOf() -
          moment(this.gc.cure.rsTalkStartTime).valueOf()
        return Math.floor(timeCost / 1000 / 60)
      } else if (this.gc.cure.isRsInformedArgee === '0') {
        if (!this.gc.cure.rsTalkEndTime || !this.gc.cure.rsTalkStartTime) {
          return ''
        }
        const timeCost =
          moment(this.gc.cure.rsTalkEndTime).valueOf() -
          moment(this.gc.cure.rsTalkStartTime).valueOf()
        return Math.floor(timeCost / 1000 / 60)
      } else {
        return ''
      }
    }
  },
  watch: {
    'gc.cure.isRsInformedArgee': {
      immediate: false,
      handler() {
        if (this.gc.cure.isRsInformedArgee === '0') {
          this.$set(this.gc.cure, 'isRsInformed', '')
          this.$set(this.gc.cure, 'rsInformedSignTime', '')
          this.$set(this.gc.cure, 'sRsVein', '')
          this.$set(this.gc.cure, 'rsRefuseReason', '')
          this.$set(this.gc.cure, 'rsNihssBeforeId', '')
          this.$set(this.gc.cure, 'firstPharmacyTime', '')
          this.$set(this.gc.cure, 'bodyWeight', '')
          this.$set(this.gc.cure, 'rsDrugs', '')
          this.$set(this.gc.cure, 'rsDose', '')
          this.$set(this.gc.cure, 'rsDoseActual', '')
          this.$set(this.gc.cure, 'rsUrokinaseDose', '')
          this.$set(this.gc.cure, 'rsOtherDrug', '')
          this.$set(this.gc.cure, 'rsOthers', '')
          this.$set(this.gc.cure, 'rsNihssAfterId', '')
          this.$set(this.gc.cure, 'isRsAde', '')
          this.$set(this.gc.cure, 'rsAdeTime', '')
          this.$set(this.gc.cure, 'rsAdeType', '')
          this.$set(this.gc.cure, 'rsAdeIhType', '')
          this.$set(this.gc.cure, 'rsAdeIhSeverity', '')
          this.$set(this.gc.cure, 'isRsAdeIahr', '')
          this.$set(this.gc.cure, 'rsAdeOther', '')
        } else if (this.gc.cure.isRsInformedArgee === '1') {
          this.$set(this.gc.cure, 'rsTalkEndTime', '')
        }
      }
    },
    'gc.cure.sRsVein': {
      immediate: false,
      handler() {
        if (this.gc.cure.sRsVein === '0') {
          this.$set(this.gc.cure, 'rsNihssBeforeId', '')
          this.$set(this.gc.cure, 'firstPharmacyTime', '')
          this.$set(this.gc.cure, 'bodyWeight', '')
          this.$set(this.gc.cure, 'rsDrugs', '')
          this.$set(this.gc.cure, 'rsAdaptation', '')
          this.$set(this.gc.cure, 'rsDose', '')
          this.$set(this.gc.cure, 'rsDoseActual', '')
          this.$set(this.gc.cure, 'rsUrokinaseDose', '')
          this.$set(this.gc.cure, 'rsOtherDrug', '')
          this.$set(this.gc.cure, 'rsOthers', '')
          this.$set(this.gc.cure, 'rsNihssAfterId', '')
          this.$set(this.gc.cure, 'isRsAde', '')
          this.$set(this.gc.cure, 'rsAdeTime', '')
          this.$set(this.gc.cure, 'rsAdeType', '')
          this.$set(this.gc.cure, 'rsAdeIhType', '')
          this.$set(this.gc.cure, 'rsAdeIhSeverity', '')
          this.$set(this.gc.cure, 'isRsAdeIahr', '')
          this.$set(this.gc.cure, 'rsAdeOther', '')
        } else {
          this.$set(this.gc.cure, 'rsRefuseReason', '')
        }
      }
    },
    'gc.cure.rsDrugs': {
      immediate: false,
      handler() {
        // this.$set(this.gc.cure, 'rsAdaptation', '')
        if (this.gc.cure.rsDrugs === '1') {
          this.$set(this.gc.cure, 'rsUrokinaseDose', '')
        } else {
          this.$set(this.gc.cure, 'rsDose', '')
          this.$set(this.gc.cure, 'rsDoseActual', '')
        }
      }
    },
    'gc.cure.rsOtherDrug': {
      immediate: false,
      handler() {
        if (this.gc.cure.rsOtherDrug !== '6') {
          this.$set(this.gc.cure, 'rsOthers', '')
        }
      }
    },
    'gc.cure.isRsAde': {
      immediate: false,
      handler() {
        if (this.gc.cure.isRsAde === '0') {
          this.$set(this.gc.cure, 'rsAdeTime', '')
          this.$set(this.gc.cure, 'rsAdeType', '')
          this.$set(this.gc.cure, 'rsAdeIhType', '')
          this.$set(this.gc.cure, 'rsAdeIhSeverity', '')
          this.$set(this.gc.cure, 'isRsAdeIahr', '')
          this.$set(this.gc.cure, 'rsAdeOther', '')
        }
      }
    },
    'gc.cure.rsAdeType': {
      immediate: false,
      handler() {
        if (this.gc.cure.rsAdeType === '0') {
          this.$set(this.gc.cure, 'rsAdeOther', '')
        } else {
          this.$set(this.gc.cure, 'rsAdeIhType', '')
          this.$set(this.gc.cure, 'rsAdeIhSeverity', '')
          this.$set(this.gc.cure, 'isRsAdeIahr', '')
        }
      }
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
      return validateForm(this.$refs['rs'], '溶栓')
    }
  }
}
</script>
