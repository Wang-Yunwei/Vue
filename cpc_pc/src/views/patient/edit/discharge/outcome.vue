<template>
  <div>
    <med-subtitle title="出院信息" />
    <el-row :gutter="24">
      <el-col :span="6">
        <med-number-field
          v-model="data.hod"
          v-int="{max:99999999, min:0}"
          form-prop="discharge.hod"
          :disabled="disabled"
          label="住院天数"
          append="天"
          :rules="[
            { required: true, message: '请填写住院天数', trigger: 'blur' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-number-field
          v-model="data.totalCost"
          v-float="{max:999999999999, min:0}"
          form-prop="discharge.totalCost"
          :disabled="disabled"
          label="总费用"
          append="元"
          :rules="[
            { required: true, message: '请填写总费用', trigger: 'blur' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="12">
        <med-radio-field
          v-model="data.outcomeCode"
          form-prop="discharge.outcomeCode"
          :disabled="disabled"
          required
          label="出院或30天转归"
          :select-options="dictionary.patientOutComeDict"
          :rules="[
            { required: true, message: '请填写出院或30天转归', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row v-if="data.outcomeCode === '1' || data.outcomeCode === '2' || data.outcomeCode === '3'" :gutter="24">
      <el-col :span="24">
        <med-checkbox-field
          v-model="data.education"
          display-type="check"
          form-prop="discharge.education"
          label="离院宣教"
          :disabled="disabled"
          :select-options="dictionary.dischargeEducationDict"
        />
      </el-col>
    </el-row>
    <el-row v-if="data.outcomeCode === '1'" :gutter="24">
      <el-col :span="6">
        <med-datetime-field
          v-model="data.leaveTime"
          form-prop="discharge.leaveTime"
          label="出院时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          :rules="[
            { required: true, message: '请填写出院时间', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="10">
        <med-radio-field
          v-model="data.treatmentResult"
          form-prop="discharge.treatmentResult"
          :disabled="disabled"
          required
          label="治疗结果"
          :select-options="dictionary.treatmentResultDict"
          :rules="[
            { required: true, message: '请填写治疗结果', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <div v-if="data.outcomeCode === '2'">
      <el-row :gutter="24">
        <el-col :span="6">
          <med-datetime-field
            v-model="data.handTime"
            form-prop="discharge.handTime"
            label="离开本院大门时间"
            :min-date="minDate"
            :max-date="maxDate"
            :disabled="disabled"
            :rules="[
              { required: true, message: '请填写离开本院大门时间', trigger: 'change' }
            ]"
          />
        </el-col>
        <el-col :span="6">
          <med-text-field
            v-model="data.hospitalName"
            form-prop="discharge.hospitalName"
            :disabled="disabled"
            label="医院名称"
          />
        </el-col>
        <el-col :span="6">
          <med-radio-field
            v-model="data.isNetHospital"
            form-prop="discharge.isNetHospital"
            :disabled="disabled"
            label="是否是网络医院"
            :select-options="dictionary.yesOrNoDict"
          />
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="6">
          <med-radio-field
            v-model="data.isTransPci"
            form-prop="discharge.isTransPci"
            :disabled="disabled"
            label="是否转运PCI"
            :select-options="dictionary.yesOrNoDict"
          />
        </el-col>
        <el-col v-if="data.isTransPci === '1'" :span="6">
          <med-radio-field
            v-model="data.isDirectCatheter"
            form-prop="discharge.isDirectCatheter"
            :disabled="disabled"
            label="直达导管室"
            :select-options="dictionary.yesOrNoDict"
          />
        </el-col>
        <el-col v-if="data.isTransPci === '1'" :span="6">
          <med-datetime-field
            v-model="data.decisionOperationTime"
            form-prop="discharge.decisionOperationTime"
            label="实际介入手术开始时间"
            :min-date="minDate"
            :max-date="maxDate"
            :disabled="disabled"
          />
        </el-col>
        <el-col v-if="data.isTransPci === '1'" :span="6">
          <med-datetime-field
            v-model="data.balloonExpansionTime"
            form-prop="discharge.balloonExpansionTime"
            label="导丝通过时间"
            :min-date="minDate"
            :max-date="maxDate"
            :disabled="disabled"
          />
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="6">
          <med-radio-field
            v-model="data.transEcg"
            form-prop="discharge.transEcg"
            :disabled="disabled"
            label="远程心电图传输"
            :select-options="dictionary.ecgTransferDict"
            :rules="[
              { required: true, message: '请填写远程心电图传输', trigger: 'change' }
            ]"
          />
        </el-col>
        <el-col :span="6">
          <med-datetime-field
            v-if="data.transEcg === '1'"
            v-model="data.transEcgTime"
            form-prop="discharge.transEcgTime"
            label="传输心电图至协作单位时间"
            :min-date="minDate"
            :max-date="maxDate"
            :disabled="disabled"
          />
        </el-col>
        <el-col :span="6">
          <med-radio-field
            v-if="data.transEcg === '1'"
            v-model="data.transWay"
            form-prop="discharge.transWay"
            :disabled="disabled"
            label="传输方式"
            :select-options="dictionary.remoteEcgtranWayDict"
          />
        </el-col>
      </el-row>
    </div>
    <el-row v-if="data.outcomeCode === '3'" :gutter="24">
      <el-col :span="6">
        <med-datetime-field
          v-model="data.deptTransferTime"
          form-prop="discharge.deptTransferTime"
          label="转科时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
        />
      </el-col>
      <el-col :span="6">
        <med-text-field
          v-model="data.admissionDept"
          form-prop="discharge.admissionDept"
          label="接诊科室"
          :disabled="disabled"
        />
      </el-col>
      <el-col :span="6">
        <med-text-field
          v-model="data.deptTransferReason"
          form-prop="discharge.deptTransferReason"
          :disabled="disabled"
          label="转科原因描述"
        />
      </el-col>
    </el-row>
    <el-row v-if="data.outcomeCode === '4'" :gutter="24">
      <el-col :span="6">
        <med-datetime-field
          v-model="data.deathTime"
          form-prop="discharge.deathTime"
          label="死亡时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          :rules="[
            { required: true, message: '请填写死亡时间', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-radio-field
          v-model="data.deathCause"
          form-prop="discharge.deathCause"
          :disabled="disabled"
          label="死亡原因"
          :select-options="dictionary.deathCauseDict"
          :rules="[
            { required: true, message: '请填写死亡原因', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row v-if="data.outcomeCode === '4'" :gutter="24">
      <el-col>
        <med-text-field
          v-model="data.deathCauseDesc"
          form-prop="discharge.deathCauseDesc"
          :disabled="disabled"
          label="死亡描述"
        />
      </el-col>
    </el-row>
    <el-row v-if="data.outcomeCode === '2'" :gutter="24">
      <el-col :span="6">
        <med-radio-field
          v-if="showRs && data.outcomeCode === '2'"
          v-model="data.afterThrombolysisRadiography"
          form-prop="discharge.afterThrombolysisRadiography"
          :disabled="disabled"
          label="溶栓后24h内造影"
          :select-options="dictionary.yesOrNoDict"
          :rules="[
            { required: true, message: '请填写溶栓后24h内造影', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-datetime-field
          v-if="
            showRs &&
              data.afterThrombolysisRadiography === '1' &&
              data.outcomeCode === '2'
          "
          v-model="data.startRadiographyTime"
          form-prop="discharge.startRadiographyTime"
          label="造影开始时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          :rules="[
            { required: true, message: '请填写造影开始时间', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="24">
        <med-text-field
          v-model="data.remarks"
          form-prop="discharge.remarks"
          :disabled="disabled"
          label="患者情况备注"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Outcome',
  components: {},
  props: {
    data: {
      required: true,
      type: Object
    },
    dataTreatment: {
      required: true,
      type: Object
    },
    disabled: {
      required: false,
      type: Boolean
    }
  },
  data() {
    return {
      active: 0,
      registId: 0,
      minDate: new Date(2020, 0, 10),
      maxDate: new Date(2025, 10, 1)
    }
  },
  computed: {
    ...mapGetters(['dictionary']),
    showRs() {
      if (
        this.dataTreatment.isReperfusion === '1' &&
        (this.dataTreatment.reperfusionMeasure === '1' ||
          (this.dataTreatment.reperfusionMeasure === '2' &&
            this.dataTreatment.rsStrategy === null) ||
          this.dataTreatment.reperfusionMeasure === '3' ||
          this.dataTreatment.reperfusionMeasure === '4')
      ) {
        return true
      }
      return false
    }
  },
  created() {},
  methods: {

  }
}
</script>
<style lang="scss" scoped></style>
