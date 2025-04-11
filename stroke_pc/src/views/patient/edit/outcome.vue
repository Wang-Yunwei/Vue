<template>
  <div>
    <el-form
      ref="outcome"
      :inline="true"
      label-position="top"
      :model="gc"
      :rules="rules"
      class="demo-form-inline"
      size="mini"
    >
      <el-row>
        <el-form-item label="是否有延误原因" prop="isDelay">
          <med-radio
            v-model="gc.outcome.isDelay"
            :disabled="disabled"
            :select-options="isOrNotOpts"
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item
          v-if="gc.outcome.isDelay === '1'"
          label="耗时原因"
          prop="delayReason"
        >
          <advancedCheckbox
            v-model="gc.outcome.delayReason"
            :disabled="disabled"
            :options="dic.delayReason"
            :other.sync="gc.outcome.delayReasonOther"
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="病人去向" prop="outcome.whereabouts">
          <advancedRadio
            v-model="gc.outcome.whereabouts"
            :disabled="disabled"
            :options="dic.whereabouts"
            :other.sync="gc.outcome.whereaboutsOther"
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item
            v-if="gc.outcome.whereabouts === '0'"
            label="住院号"
            prop="inpatientNo"
          >
            <bind-patient
              :disabled="!isBound || disabled"
              title="关联"
              type="4"
              :patient-name="patientInfo.name"
              :value="gc.outcome.inpatientNo"
              :hospital-id="patientInfo.hospitalId"
              :hospital-area="patientInfo.hospitalArea"
              @bind="onBindInpatientNo"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            v-if="gc.outcome.whereabouts === '0'"
            label="办理入院时间"
            prop="admissionTime"
          >
            <med-datetime
              v-model="gc.outcome.admissionTime"
              placeholder="选择日期时间"
              :disabled="disabled"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            v-if="gc.outcome.whereabouts === '0'"
            label="入院科别"
            prop="admissionDept"
          >
            <advancedRadio
              v-model="gc.outcome.admissionDept"
              :options="dic.admissionDept"
              :other.sync="gc.outcome.admissionDeptOther"
              :disabled="disabled"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { GcOutcome } from '@/model/commonModel'
import advancedCheckbox from '@/components/AdvancedCheckbox'
import advancedRadio from '@/components/AdvancedRadio'
import storage from 'store'
import bindPatient from './bindPatient.vue'
import { isOrNotOpts } from '@/constant/commonConstant'
import { validateForm } from '@/utils/validate'

export default {
  name: 'Outcome',
  components: {
    advancedCheckbox,
    advancedRadio,
    bindPatient
  },
  props: {
    patientInfo: {
      type: Object,
      default: () => ({})
    },
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
    }
  },
  data() {
    return {
      isOrNotOpts,
      gc: {
        outcome: { ...GcOutcome() }
      },
      dic: storage.get('dicData'),
      rules: {
        'outcome.whereabouts': [
          { required: true, message: '请选择病人去向', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    info: {
      deep: true,
      immediate: true,
      handler(v) {
        this.gc.outcome = { ...this.gc.outcome, ...this.info }
      }
    },
    'gc.outcome.isDelay': {
      handler() {
        if (this.gc.outcome.isDelay === '0') {
          this.gc.outcome.delayReason = ''
          this.gc.outcome.delayReasonOther = ''
        }
      }
    },
    'gc.outcome.whereabouts': {
      handler() {
        if (!this.gc.outcome.whereabouts === '0') {
          this.gc.outcome.inpatientNo = ''
          this.gc.outcome.admissionTime = ''
          this.gc.outcome.admissionDept = ''
          this.gc.outcome.admissionDeptOther = ''
        } else if (!this.gc.outcome.whereabouts === '0') {
          this.gc.outcome.whereaboutsOther = ''
        }
      }
    },
    'gc.outcome.admissionDept': {
      handler() {
        if (!this.gc.outcome.admissionDept === '99') {
          this.gc.outcome.admissionDeptOther = ''
        }
      }
    }
  },
  created() {},
  mounted() {
  },
  methods: {
    onBindInpatientNo(item, closePop) {
      this.$set(this.gc.outcome, 'inpatientNo', item?.displayNo || '')
      // 获取办理入院时间
      this.$set(this.gc.outcome, 'admissionTime', item?.time || '')
      this.$emit('bind')
      closePop()
    },
    validate() {
      return validateForm(this.$refs['outcome'], '患者转归')
    }
  }
}
</script>

<style lang="less" scoped></style>
