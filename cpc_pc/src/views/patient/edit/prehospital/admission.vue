<template>
  <div>
    <med-subtitle title="院前接诊" />
    <el-row :gutter="24">
      <el-col :span="6">
        <!-- <med-text-field
          v-model="data.licensePlate"
          label="车牌号"
          maxlength="10"
          :disabled="disabled"
          form-prop="prehospital.licensePlate"
          @click="showimport"
        /> -->
        <el-form-item size="mini" label="车牌号">
          <bind-patient
            :disabled="!isBound || disabled"
            title="关联患者"
            type="1"
            :patient-name="dataRegist.name"
            :value="data.licensePlate"
            :hospital-id="dataRegist.hospitalId"
            :hospital-area="dataRegist.hospitalArea"
            @bind="onBindlicensePlate"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="24">
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
    </el-row>
    <el-row :gutter="24">
      <div v-if="dataAdmission.comeType === '1'">
        <el-col :span="6">
          <med-datetime-field
            v-model="data.helpTime"
            label="呼救时间"
            :disabled="disabled"
            form-prop="prehospital.helpTime"
            :rules="[
              { required: true, message: '请填写呼救时间', trigger: 'change' }
            ]"
          />
        </el-col>
        <el-col :span="6">
          <med-radio-field
            v-model="data.ambulanceDepartment"
            radio-type="button"
            :disabled="disabled"
            label="出车单位"
            :select-options="dictionary.ambulanceDepartmentDict"
            form-prop="prehospital.ambulanceDepartment"
            :rules="[
              { required: true, message: '请填写出车单位', trigger: 'change' }
            ]"
          />
        </el-col>
      </div>

      <div v-if="dataAdmission.comeType === '1' || dataAdmission.comeType === '2'">
        <el-col :span="6">
          <med-datetime-field
            v-model="dataAdmission.fmcTime"
            label="首次医疗接触时间"
            :min-date="minDate"
            :max-date="maxDate"
            :disabled="disabled"
            form-prop="admission.fmcTime"
            :rules="[
              { required: true, message: '请填写首次医疗接触时间', trigger: 'change' }
            ]"
          />
        </el-col>
        <el-col :span="6">
          <med-text-field
            v-model="data.admissionDoctor"
            :select-options="admissionDoctors"
            label="医护人员"
            :disabled="disabled"
            form-prop="prehospital.admissionDoctor"
          />
        </el-col>
      </div>
    </el-row>
    <el-row v-if="dataAdmission.comeType === '2'" :gutter="24">
      <el-col :span="6">
        <med-radio-field
          v-model="data.zcyyType"
          radio-type="button"
          :disabled="disabled"
          label="转院类型"
          :select-options="dictionary.transferTypeDict"
          form-prop="prehospital.zcyyType"
          :rules="[
            { required: true, message: '请填写转院类型', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col v-if="data.zcyyType==='1'" :span="6">
        <med-autocomplete-field
          v-model="data.zcyyHospitalName"
          :suggestion="hospitalSuggestion"
          label="医院名称"
          :disabled="disabled"
        />
      </el-col>
      <el-col v-if="data.zcyyType==='2'" :span="6">
        <med-text-field
          v-model="data.zcyyHospitalName"
          label="医院名称"
          :disabled="disabled"
        />
      </el-col>
    </el-row>
    <el-row v-if="dataAdmission.comeType === '2'" :gutter="24">
      <el-col :span="6">
        <med-datetime-field
          v-model="data.zcyyVisitTime"
          label="转出医院入门时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          form-prop="prehospital.zcyyVisitTime"
          :rules="[
            { required: true, message: '请填写转出医院入门时间', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-datetime-field
          v-model="data.zcyyDecisionTime"
          label="决定转院时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          form-prop="prehospital.zcyyDecisionTime"
          :rules="[
            { required: true, message: '请填写决定转院时间', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-datetime-field
          v-model="data.zcyyLeaveTime"
          label="转出医院出门时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          form-prop="prehospital.zcyyLeaveTime"
          :rules="[
            { required: true, message: '请填写转出医院出门时间', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row v-if="dataAdmission.comeType === '1' || dataAdmission.comeType === '2'" :gutter="24">
      <el-col :span="24">
        <div style="display: flex; align-items: flex-end;">
          <med-radio-field
            v-model="data.isTransHospital"
            :disabled="disabled"
            label="直接转送上级医院（转出患者时）"
            :select-options="dictionary.yesOrNoDict"
            form-prop="prehospital.isTransHospital"
            :rules="[
              { required: true, message: '请填写直接转送上级医院', trigger: 'change' }
            ]"
          />
          <span v-if="data.isTransHospital === '1'" style="color: red; margin-bottom: 18px;">
            表示不进入本院，直接转送至上级医疗机构，患者转归不用填写!
          </span>
        </div>
      </el-col>
      <el-col v-if="data.isTransHospital === '1'" :span="3">
        <med-radio-field
          v-model="data.isDirectPci"
          form-prop="prehospital.isDirectPci"
          :disabled="disabled"
          label="直达导管室"
          :select-options="dictionary.yesOrNoDict"
          :rules="[
            { required: true, message: '请填写直达导管室', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import bindPatient from '../bindPatient'
import { mapGetters } from 'vuex'
import { querySetting } from '@/api/setting'
import { basicConstant } from '@/constant'
import { relationPatient } from '@/api/patient/edit'
export default {
  name: 'Admission',
  components: {
    bindPatient
  },
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
    dataAdmission: {
      required: true,
      type: Object
    },
    dataRegist: {
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
      minDate: new Date(2020, 0, 10),
      maxDate: new Date(2025, 10, 1),
      active: 0,
      registId: 0,
      admissionDoctors: [
        { label: '王医生', value: '1' },
        { label: '李医生', value: '2' }
      ],
      hospitalSuggestion: []
    }
  },
  computed: {
    ...mapGetters(['dictionary', 'configure', 'hospitalId']),
    showLicensePlate() {
      if (
        this.dataRegist.infoComingType === '1' ||
        this.dataRegist.infoComingType === '0'
      ) {
        return false
      } else return true
    }
  },
  created() {
    // 获取网络医院建议列表
    this.getNetworkHospitals()
  },
  methods: {
    onBindlicensePlate(item, closePop) {
      // 车牌号
      this.$set(this.data, 'licensePlate', item?.licensePlate || '')
      if (item.relationId) {
        relationPatient({
          registId:
              this.dataRegist.id || this.$route.query.id,
          visitId: item.relationId,
          type: '1',
          hospitalArea: this.dataRegist.hospitalArea,
          hospitalId: this.dataRegist.hospitalId,
          patientNo: this.dataRegist.emId
        })
          .then(({ result, message }) => {
            if (!result) {
              this.$message.error(message)
            } else {
              this.$message.success('绑定成功!')
              this.$eventBus.$emit('refreshPatient', { licensePlate: item?.licensePlate || '' })
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
    async getNetworkHospitals() {
      const { result } = await querySetting({ code: basicConstant.NETWORKHOSPITAL, hospitalId: this.hospitalId })
      if (result) {
        this.hospitalSuggestion = JSON.parse(result.value).filter(s => s.isEnabled).map(s => Object.assign({ value: s.name }, s))
      }
    },
    showimport() {
      this.$emit('showimport', '1')
    }
  }
}
</script>
