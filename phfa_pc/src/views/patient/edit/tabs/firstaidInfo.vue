<template>
  <el-form ref="form" :model="form" label-width="120px" label-position="top">
    <el-row :gutter="24">
      <el-col :span="6">
        <el-form-item label="患者姓名" prop="name" :rules="[{ required: true, message: '请填写姓名', trigger: 'blur' }]">
          <el-input v-model="form.name" size="mini" placeholder="请输入" :readonly="viewMode" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender" size="mini" :readonly="viewMode">
            <el-radio v-for="g in dictionary[dic.gender]" :key="g.value" :label="g.value">{{ g.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="年龄" prop="age">
          <age-input v-model="form.age" :readonly="viewMode" size="mini" :age-extend.sync="form.ageExtend" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="国籍" prop="state">
          <med-select
            v-model="form.state"
            :readonly="viewMode"
            size="mini"
            placeholder="请选择"
            :options="dictionary[dic.country]"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="民族" prop="nation">
          <med-select
            v-model="form.nation"
            :readonly="viewMode"
            size="mini"
            placeholder="请选择"
            :options="dictionary[dic.nation]"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="证件类型" prop="cardType">
          <med-select
            v-model="form.cardType"
            :readonly="viewMode"
            size="mini"
            placeholder="请选择"
            :options="dictionary[dic.idCard]"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="证件号码" prop="cardNo">
          <el-input v-model="form.cardNo" :readonly="viewMode" size="mini" placeholder="请输入" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="form.contact" :readonly="viewMode" size="mini" placeholder="请输入" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="联系电话" prop="contactNumber">
          <el-input v-model="form.contactNumber" :readonly="viewMode" size="mini" placeholder="请输入" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="腕带" prop="tagId">
          <el-input v-model="form.tagId" :readonly="viewMode" size="mini" placeholder="请输入" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="接诊医生" prop="doctorName">
          <el-autocomplete
            v-model="form.doctorName"
            :readonly="viewMode"
            size="mini"
            class="inline-input"
            :fetch-suggestions="(str, cb) => querySearch('doctor', str, cb)"
            placeholder="请输入"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="接诊护士" prop="nurseName">
          <el-autocomplete
            v-model="form.nurseName"
            :readonly="viewMode"
            size="mini"
            class="inline-input"
            :fetch-suggestions="(str, cb) => querySearch('nurse', str, cb)"
            placeholder="请输入"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="接触患者时间" prop="touchPatientTime">
          <el-date-picker
            v-model="form.touchPatientTime"
            :readonly="viewMode"
            size="mini"
            type="datetime"
            placeholder="选择时间"
            value-format="yyyy-MM-dd[T]HH:mm:ss"
            format="yyyy-MM-dd HH:mm"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="驾驶员" prop="driverName">
          <el-autocomplete
            v-model="form.driverName"
            :readonly="viewMode"
            size="mini"
            class="inline-input"
            :fetch-suggestions="(str, cb) => querySearch('driver', str, cb)"
            placeholder="请输入"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="疾病类别" prop="diseaseCategory">
          <med-select
            v-model="form.diseaseCategory"
            :readonly="viewMode"
            size="mini"
            placeholder="请选择"
            :options="dictionary[dic.diseaseCategory]"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="任务状态" prop="missionStatus">
          <med-select
            v-model="form.missionStatus"
            :readonly="viewMode"
            size="mini"
            placeholder="请选择"
            :options="dictionary[dic.missionStatus]"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="出车分站" prop="dispatchVehicleSite">
          <station-select
            v-model="form.dispatchVehicleSite"
            :readonly="viewMode"
            size="mini"
            placeholder="请选择"
            :hospital-id="hospitalId"
            :hospital-area="hospitalArea"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="急救车" prop="licensePlate">
          <el-input v-model="form.licensePlate" size="mini" placeholder="请输入" readonly />
          <!-- <med-select
          v-model="form.licensePlate"
          placeholder="请选择"
          :options="vehicleList"
        /> -->
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="呼叫原因" prop="reasonType">
          <el-input v-model="form.reasonType" :readonly="viewMode" size="mini" placeholder="请输入" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="接诊地址" prop="address">
          <el-input v-model="form.address" :readonly="viewMode" size="mini" placeholder="请输入" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="MPDS" prop="mpds">
          <el-input v-model="form.mpds" :readonly="viewMode" size="mini" placeholder="请输入" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import MedSelect from '@/components/MedSelect/Select'
import { dicConstant as dic } from '@/constant'
import { mapGetters } from 'vuex'

export default {
  name: 'FirstAidInfo',
  components: {
    MedSelect
  },
  props: {
    viewMode: {
      type: Boolean,
      default: false
    },
    detailData: {
      type: Object,
      default: () => ({})
    },
    hospitalArea: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dic,
      form: {
        ageExtend: '01'
      }
    }
  },
  computed: {
    ...mapGetters([
      'hospitalId',
      'dictionary',
      'doctorList',
      'nurseList',
      'driverList'
    ])
  },
  watch: {
    detailData: {
      immediate: true,
      handler(val) {
        if (val) {
          this.form = this.detail2form(val)
          // 年龄
          if (this.form.age === 0) delete this.form.age
          // 年龄单位
          if (!this.form.ageExtend) this.$set(this.form, 'ageExtend', '01')
        }
      }
    }
  },
  methods: {
    // autocomplete 下拉筛选
    querySearch(key, queryString, cb) {
      const list =
        (this[key + 'List'] || []).map((el) => ({
          value: el.label
        })) || []
      const results = queryString
        ? list.filter((el) => el.value.includes(queryString))
        : list
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    detail2form(detail = {}) {
      const {
        medPhepMedicalRecordsEntity = {},
        medPhepMissionsEntity = {},
        medPhepPatientsEntity = {}
      } = detail
      return {
        name: medPhepPatientsEntity.name,
        gender: medPhepPatientsEntity.gender,
        age: medPhepPatientsEntity.age,
        ageExtend: medPhepPatientsEntity.ageExtend,
        state: medPhepPatientsEntity.state,
        nation: medPhepPatientsEntity.nation,
        cardType: medPhepPatientsEntity.cardType,
        cardNo: medPhepPatientsEntity.cardNo,
        contact:
          medPhepMedicalRecordsEntity.contact || medPhepMissionsEntity.contact,
        contactNumber:
          medPhepMedicalRecordsEntity.contactNumber ||
          medPhepMissionsEntity.contactPhone,
        tagId: medPhepPatientsEntity.tagId,
        doctorName: medPhepMissionsEntity.doctorName,
        nurseName: medPhepMissionsEntity.nurseName,
        touchPatientTime: medPhepMissionsEntity.touchPatientTime
          ? this.$moment(medPhepMissionsEntity.touchPatientTime).format(
            'YYYY-MM-DD[T]HH:mm:ss'
          )
          : null,
        driverName: medPhepMissionsEntity.driverName,
        diseaseCategory: medPhepMedicalRecordsEntity.diseaseCategory,
        missionStatus: medPhepMissionsEntity.status,
        dispatchVehicleSite: medPhepMissionsEntity.dispatchVehicleSite,
        licensePlate: medPhepMissionsEntity.licensePlate,
        reasonType:
          medPhepMedicalRecordsEntity.reasonType ||
          medPhepMissionsEntity.reasonType,
        address: medPhepMedicalRecordsEntity.address,
        mpds: medPhepMissionsEntity.mpds,
        patientId:
          medPhepPatientsEntity.patientId ||
          medPhepMedicalRecordsEntity.patientId,
        recordId:
          medPhepMedicalRecordsEntity.recordId ||
          medPhepPatientsEntity.healthRecordId,
        missionId: medPhepMissionsEntity.missionId
      }
    },
    form2detail(form) {
      return {
        medPhepMedicalRecordsEntity: {
          address: form.address,
          // allergicHistory: 'string',
          // archiveStatus: 'string',
          // archiveTime: '2022-05-18T06:11:20.804Z',
          // archiveUser: 'string',
          // bloodglucose: 0,
          // chiefComplaint: 'string',
          // code: 'string',
          // conditionGrade: 'string',
          contact: form.contact,
          contactNumber: form.contactNumber,
          // createBy: 'string',
          // createTime: '2022-05-18T06:11:20.804Z',
          // diagnosis: 'string',
          diseaseCategory: form.diseaseCategory,
          // historyProvider: 'string',
          // isMorb: 'string',
          // isNotifyEmergency: 0,
          // isTrauma: 'string',
          // leftPulil: 'string',
          // medicalHisProType: 'string',
          // morbtimearea: 'string',
          // notifyEmergencyTime: '2022-05-18T06:11:20.804Z',
          // otherCheck: 'string',
          // otherDruge: 'string',
          // otherInfo: 'string',
          // otherTreatment: 'string',
          // pastHistory: 'string',
          patientId: form.patientId,
          // presentIllness: 'string',
          reasonType: form.reasonType,
          recordId: form.recordId
          // rejectTime: '2022-05-18T06:11:20.804Z',
          // rejectUser: 'string',
          // rescueChangeResult: 'string',
          // rightPulil: 'string',
          // scene: 'string',
          // status: 'string',
          // submitTime: '2022-05-18T06:11:20.804Z',
          // submitUser: 'string',
          // toHospital: 'string',
          // toHospitalName: 'string',
          // traumaPart: 'string',
          // traumaType: 'string',
          // treatment: 'string',
          // treatmentResult: 'string'
        },
        medPhepMissionsEntity: {
          // acceptMissionTime: '2022-05-18T06:11:20.804Z',
          // arrivedHospitalTime: '2022-05-18T06:11:20.804Z',
          // arrivedSceneTime: '2022-05-18T06:11:20.804Z',
          callTime: form.callTime,
          // completeTime: '2022-05-18T06:11:20.804Z',
          contact: form.contact,
          contactPhone: form.contactNumber,
          // createBy: 'string',
          // createTime: '2022-05-18T06:11:20.804Z',
          // destinationAddress: form.destinationAddress,
          dispatchVehicleSite: form.dispatchVehicleSite,
          // dispatchVehicleTime: '2022-05-18T06:11:20.804Z',
          doctorName: form.doctorName,
          driverName: form.driverName,
          // fromType: 'string',
          // id_120: 'string',
          // leftSceneTime: '2022-05-18T06:11:20.804Z',
          licensePlate: form.licensePlate,
          // memo: 'string',
          missionId: form.missionId,
          // missionType: 'string',
          mpds: form.mpds,
          // ncidentId: 'string',
          // needStretcher: 'string',
          nurseName: form.nurseName,
          // planVehicleTime: '2022-05-18T06:11:20.804Z',
          reasonType: form.reasonType,
          // siteStandbyTime: '2022-05-18T06:11:20.804Z',
          status: form.missionStatus,
          // suspendType: 'string',
          // taskStandbyTime: '2022-05-18T06:11:20.804Z',
          touchPatientTime: form.touchPatientTime || null
        },
        medPhepPatientsEntity: {
          age: form.age,
          ageExtend: form.ageExtend,
          // birthday: '2022-05-18T06:11:20.804Z',
          cardNo: form.cardNo,
          cardType: form.cardType,
          // createBy: 'string',
          // createTime: '2022-05-18T06:11:20.804Z',
          // fromEmergencyId: 'string',
          gender: form.gender,
          // healthInsuranceId: 'string',
          healthRecordId: form.recordId,
          missionId: form.missionId,
          name: form.name,
          nation: form.nation,
          patientId: form.patientId,
          state: form.state,
          // status: 'string',
          tagId: form.tagId
        }
      }
    },
    onSave() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          const payload = this.form2detail(this.form)
          this.$emit('save', payload)
        }
      })
    }
  }
}
</script>
