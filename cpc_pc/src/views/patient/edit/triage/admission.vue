<template>
  <div>
    <med-subtitle title="接诊" />
    <el-row :gutter="24">
      <el-col :span="6">
        <el-form-item size="mini" label="门诊号">
          <bind-patient
            :disabled="!isBound || disabled"
            title="关联患者"
            :type="departmentType"
            :patient-name="dataRegist.name"
            :value="dataMain.outPatientNo"
            :hospital-id="dataRegist.hospitalId"
            :hospital-area="dataRegist.hospitalArea"
            @bind="onBindOutPatientNo"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <med-text-field
          v-model="data.chiefComplaint"
          form-prop="admission.chiefComplaint"
          :disabled="disabled"
          label="主诉"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="12">
        <med-radio-field
          v-model="dataMain.distressCase"
          :disabled="disabled"
          form-prop="main.distressCase"
          label="病情评估"
          :select-options="dictionary.distressCaseDict"
          :rules="[
            { required: true, message: '请填写病情评估', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="24">
        <med-checkbox-field
          v-model="dataMain.distressCaseDetail"
          display-type="check"
          form-prop="main.distressCaseDetail"
          :disabled="disabled"
          label="病情评估明细"
          :select-options="dictionary.distressCaseDetailDict"
        />
      </el-col>
    </el-row>
    <el-row v-if="data.comeType !== '1' && data.comeType !== '2'" :gutter="24">
      <el-col :span="3">
        <med-radio-field
          v-model="dataMain.isAttackUncertain"
          form-prop="main.isAttackUncertain"
          :disabled="disabled"
          label="发病无法精确到分钟"
          required
          :select-options="dictionary.yesOrNoDict"
          :rules="[
            { required: true, message: '请填写发病无法精确到分钟', trigger: 'change' }
          ]"
        />
      </el-col>

      <div v-if="dataMain.isAttackUncertain === '1'">
        <el-col :span="4">
          <med-datetime-field
            v-model="dataMain.attackTime"
            form-prop="main.attackTime"
            :disabled="disabled"
            type="date"
            formatter="YYYY-MM-DD"
            label="发病时间"
            :rules="[
              { required: true, message: '请填写发病时间', trigger: 'change' }
            ]"
          />
        </el-col>
        <el-col :span="3">
          <med-select-field
            v-if="dataMain.isAttackUncertain === '1'"
            v-model="dataMain.isTimearea"
            form-prop="main.isTimearea"
            :disabled="disabled"
            label="发病区间"
            :select-options="dictionary.attackZoneDict"
            :rules="[
              { required: true, message: '请填写发病区间', trigger: 'change' }
            ]"
          />
        </el-col>
      </div>
      <el-col v-if="dataMain.isAttackUncertain === '0'" :span="6">
        <med-datetime-field
          v-model="dataMain.attackTime"
          form-prop="main.attackTime"
          :disabled="disabled"
          type="datetime"
          formatter="YYYY-MM-DD HH:mm"
          label="发病时间"
          :rules="[
            { required: true, message: '请填写发病时间', trigger: 'change' }
          ]"
        />
      </el-col>
      <div v-if="data.comeType !== '4'">
        <el-col :span="6">
          <med-address-field
            v-model="dataMain.dacounty"
            form-prop="main.dacounty"
            :disabled="disabled"
            label="发病地址"
          />
        </el-col>
        <el-col :span="6">
          <med-text-field
            v-model="dataMain.address"
            form-prop="main.address"
            :disabled="disabled"
            label="详细地址"
          />
        </el-col>
      </div>
      <!-- <div v-if="data.comeType !== '4'">
        <el-col :span="6">
          <med-text-field
            v-model="data.address"
            form-prop="admission.address"
            :disabled="disabled"
            label="发病地点"
            :rules="[
              { required: true, message: '请填写发病地点', trigger: 'blur' }
            ]"
          />
        </el-col>
      </div> -->
    </el-row>
    <!-- 呼救120和转院 -->
    <el-row v-if="data.comeType === '1'" :gutter="24">
      <el-col :span="6">
        <med-datetime-field
          v-model="data.admissionTime"
          form-prop="admission.admissionTime"
          :disabled="disabled"
          label="院内首诊医师接诊时间"
          :min-date="minDate"
          :max-date="maxDate"
          :rules="[
            { required: true, message: '请填写院内首诊医师接诊时间', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-autocomplete-field
          v-model="data.admissionDoctor"
          :suggestion="medicalWorkers"
          :disabled="disabled"
          label="医护人员"
          form-prop="admission.admissionDoctor"
        />
      </el-col>
    </el-row>
    <!-- 转院 -->
    <el-row v-if="data.comeType === '2'" :gutter="24">
      <el-col :span="6">
        <med-datetime-field
          v-model="data.admissionTime"
          form-prop="admission.admissionTime"
          :disabled="disabled"
          label="院内接诊时间"
          :min-date="minDate"
          :max-date="maxDate"
          :rules="[
            { required: true, message: '请填写院内接诊时间', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-autocomplete-field
          v-model="data.admissionDoctor"
          :suggestion="medicalWorkers"
          :disabled="disabled"
          label="医护人员"
          form-prop="admission.admissionDoctor"
        />
      </el-col>
    </el-row>
    <!-- 自行来院 -->
    <el-row v-if="data.comeType === '3'" :gutter="24">
      <el-col :span="6">
        <med-datetime-field
          v-model="data.arrivedHospitalTime"
          form-prop="admission.arrivedHospitalTime"
          label="到达医院大门时间"
          :disabled="disabled"
          :min-date="minDate"
          :max-date="maxDate"
          :rules="[
            { required: true, message: '请填写到达医院大门时间', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-datetime-field
          v-model="data.fmcTime"
          form-prop="admission.fmcTime"
          :disabled="disabled"
          label="首次医疗接触时间"
          :min-date="minDate"
          :max-date="maxDate"
          :rules="[
            { required: true, message: '请填写首次医疗接触时间', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-datetime-field
          v-model="data.admissionTime"
          form-prop="admission.admissionTime"
          :disabled="disabled"
          label="院内首诊医师接诊时间"
          :min-date="minDate"
          :max-date="maxDate"
          :rules="[
            { required: true, message: '请填写院内首诊医师接诊时间', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-text-field
          v-model="data.admissionDoctor"
          form-prop="admission.admissionDoctor"
          :disabled="disabled"
          label="医护人员"
        />
      </el-col>
    </el-row>
    <!-- 院内发病 -->
    <el-row v-if="data.comeType === '4'" :gutter="24">
      <el-col :span="6">
        <med-text-field
          v-model="data.address"
          form-prop="admission.address"
          label="发病地点"
          placeholder="发病地点"
          :rules="[
            { required: true, message: '请填写发病地点', trigger: 'blur' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-datetime-field
          v-model="data.fmcTime"
          form-prop="admission.fmcTime"
          :disabled="disabled"
          label="本次发病后首次医疗接触时间"
          :min-date="minDate"
          :max-date="maxDate"
          :rules="[
            { required: true, message: '请填写本次发病后首次医疗接触时间', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-datetime-field
          v-model="data.leaveAddressTime"
          form-prop="admission.leaveAddressTime"
          :disabled="disabled"
          label="离开发病现场时间"
          :min-date="minDate"
          :max-date="maxDate"
        />
      </el-col>
      <el-col :span="6">
        <med-text-field
          v-model="data.afterFmcStaff"
          form-prop="admission.afterFmcStaff"
          :disabled="disabled"
          label="本次发病后首次医疗接触人员"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import bindPatient from '../bindPatient.vue'
import { mapGetters } from 'vuex'
import { relationPatient } from '@/api/patient/edit'
export default {
  name: 'Admission',
  components: { bindPatient },
  props: {
    isBound: {
      type: Boolean,
      default: false
    },
    data: {
      required: true,
      type: Object
    },
    dataMain: {
      required: true,
      type: Object
    },
    dataRegist: {
      required: true,
      type: Object
    },
    dataPre: {
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
      maxDate: new Date(2025, 10, 1),
      admissionDoctors: [
        { label: '王医生', value: '1' },
        { label: '李医生', value: '2' }
      ]
    }
  },
  computed: {
    ...mapGetters(['dictionary', 'configure', 'medicalWorkers']),
    showOutPatientNo() {
      if (
        this.dataRegist.infoComingType === '2' ||
        this.dataRegist.infoComingType === '3' ||
        this.dataRegist.infoComingType === '0'
      ) {
        return false
      } else return true
    },
    departmentType() {
      let department
      // 来院方式为当地120、外院转诊时，门诊号关联列表为急诊列表；
      // 来院方式为自行来院、院内发病、其他时，门诊号关联列表为门诊列表
      if (this.data.comeType === '1' || this.data.comeType === '2') {
        department = '2'
      } else {
        department = '3'
      }
      return department
    }
  },
  mounted() {

  },
  created() {},
  methods: {
    onBindOutPatientNo(item, closePop) {
      this.$set(this.dataMain, 'outPatientNo', item.displayNo)
      if (item.relationId) {
        relationPatient({
          registId: this.dataRegist.id || this.$route.query.id,
          visitId: item.relationId,
          type: this.departmentType,
          hospitalArea: this.dataRegist.hospitalArea,
          hospitalId: this.dataRegist.hospitalId,
          patientNo: this.dataRegist.emId
        })
          .then(({ result, message }) => {
            if (!result) {
              this.$message.error(message)
            } else {
              this.$message.success('绑定成功!')
              this.$eventBus.$emit('refreshPatient', { outPatientNo: item.displayNo })
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
    showimport() {
      this.$emit('showimport', '3')
    }
  }
}
</script>

<style lang="scss" scoped></style>
