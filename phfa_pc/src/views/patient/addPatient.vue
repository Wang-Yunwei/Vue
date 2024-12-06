<template>
  <el-dialog
    :top="top"
    title="新增病历"
    :visible.sync="showDialog"
    width="900px"
    @close="onClose"
  >
    <div class="dlg-add-container">
      <el-form ref="form" :model="form" label-width="90px">
        <div class="flex-c-b">
          <el-form-item
            label="患者姓名"
            prop="patientName"
            style="flex: 1 1 33%"
          >
            <el-input v-model="form.patientName" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="性别" prop="sex" style="flex: 1 1 33%">
            <med-select
              v-model="form.sex"
              placeholder="请选择"
              :options="dictionary[dic.gender]"
            />
          </el-form-item>
          <el-form-item label="年龄" prop="age" style="flex: 1 1 33%">
            <age-input v-model="form.age" :age-extend.sync="form.ageExtend" />
          </el-form-item>
          <el-form-item label="联系人" prop="contact" style="flex: 1 1 33%">
            <el-input v-model="form.contact" placeholder="请输入" />
          </el-form-item>
          <el-form-item
            label="联系电话"
            prop="contactNumber"
            style="flex: 1 1 66%"
          >
            <el-input v-model="form.contactNumber" placeholder="请输入" />
          </el-form-item>
          <el-form-item
            label="出车分站"
            prop="dispatchVehicleSite"
            style="flex: 1 1 33%"
            :rules="[
              { required: true, message: '请选择出车分站', trigger: 'blur' }
            ]"
          >
            <station-select
              v-model="form.dispatchVehicleSite"
              placeholder="请选择"
              :hospital-id="hospitalId"
              :hospital-area="hospitalArea"
            />
          </el-form-item>
          <el-form-item
            label="急救车"
            prop="emergencyCar"
            :rules="[
              { required: true, message: '请选择急救车', trigger: 'change' }
            ]"
            style="flex: 1 1 33%"
          >
            <med-select
              v-model="form.emergencyCar"
              placeholder="请选择"
              :options="vehicleList"
            />
          </el-form-item>
          <el-form-item label="驾驶员" prop="driverName" style="flex: 1 1 33%">
            <el-autocomplete
              v-model="form.driverName"
              :readonly="viewMode"
              :fetch-suggestions="(str, cb) => querySearch('driver', str, cb)"
              placeholder="请输入"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item
            label="呼叫时间"
            prop="callTime"
            style="flex: 1 0 33%"
            :rules="[
              { required: true, message: '请填写呼叫时间', trigger: 'blur' }
            ]"
          >
            <el-date-picker
              v-model="form.callTime"
              type="datetime"
              placeholder="选择时间"
              value-format="yyyy-MM-dd[T]HH:mm:ss"
              format="yyyy-MM-dd HH:mm"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item
            label="呼叫原因"
            prop="reasonType"
            style="flex: 1 0 66%"
            :rules="[
              { required: true, message: '请填写呼叫原因', trigger: 'blur' }
            ]"
          >
            <el-input v-model="form.reasonType" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="接诊地址" prop="address" style="flex: 1 0 100%">
            <el-input v-model="form.address" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="MPDS" prop="mpds" style="flex: 1 0 100%">
            <el-input v-model="form.mpds" placeholder="请输入" />
          </el-form-item>
        </div>
        <div class="flex-c-c">
          <el-button @click="onClose">取消</el-button>
          <el-button type="primary" @click="onSubmit">创建</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
</template>
<script>
// import { dicConstant as d } from '@/constant'
// import moment from 'moment'
import MedSelect from '@/components/MedSelect/Select'
import { dicConstant as dic } from '@/constant'
import { mapGetters } from 'vuex'
import { queryNoTaskVehicleList } from '@/api'
import { mrmSaveOrUpdate } from '@/api/medicalRecord'

export default {
  components: {
    MedSelect
  },
  props: {
    top: {
      type: String,
      default: '5vh'
    },
    visible: {
      type: Boolean,
      default: false
    },
    inpatient: {
      type: Boolean,
      default: true
    },
    outpatient: {
      type: Boolean,
      default: true
    },
    emergency: {
      type: Boolean,
      default: true
    },
    daukNo: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dic,
      vehicleList: [], // 急救车
      showDialog: false,
      form: {
        ageExtend: '01'
      }
    }
  },
  computed: {
    ...mapGetters(['hospitalId', 'hospitalArea', 'dictionary', 'driverList'])
  },
  watch: {
    visible(val) {
      this.showDialog = val
    }
  },
  mounted() {
    this.initVehicleList()
    this.showDialog = this.visible
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
    async initVehicleList() {
      const res = await queryNoTaskVehicleList({
        hospitalId: this.hospitalId,
        hospitalArea: this.hospitalArea
      })
      if (Array.isArray(res.body)) {
        this.vehicleList = res.body.map((item) => {
          return {
            label: item,
            value: item
          }
        })
      } else if (res.message) {
        this.$message.error(res.message)
      }
    },
    onSubmit() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          const { form } = this
          const payload = {
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
              // diseaseCategory: 'string',
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
              // patientId: 'string',
              // presentIllness: 'string',
              reasonType: form.reasonType
              // recordId: 'string',
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
              // doctorName: 'string',
              driverName: form.driverName,
              // fromType: 'string',
              // id_120: 'string',
              // leftSceneTime: '2022-05-18T06:11:20.804Z',
              licensePlate: form.emergencyCar,
              // memo: 'string',
              // missionId: 'string',
              // missionType: 'string',
              // mpds: 'string',
              // ncidentId: 'string',
              // needStretcher: 'string',
              // nurseName: 'string',
              // planVehicleTime: '2022-05-18T06:11:20.804Z',
              reasonType: form.reasonType
              // siteStandbyTime: '2022-05-18T06:11:20.804Z',
              // status: 'string',
              // suspendType: 'string',
              // taskStandbyTime: '2022-05-18T06:11:20.804Z',
              // touchPatientTime: '2022-05-18T06:11:20.804Z'
            },
            medPhepPatientsEntity: {
              age: form.age,
              ageExtend: form.ageExtend,
              // birthday: '2022-05-18T06:11:20.804Z',
              // cardNo: 'string',
              // cardType: 'string',
              // createBy: 'string',
              // createTime: '2022-05-18T06:11:20.804Z',
              // fromEmergencyId: 'string',
              gender: form.sex,
              // healthInsuranceId: 'string',
              // healthRecordId: 'string',
              // missionId: 'string',
              name: form.patientName
              // nation: 'string',
              // patientId: 'string',
              // state: 'string',
              // status: 'string',
              // tagId: 'string'
            }
          }
          const res = await mrmSaveOrUpdate(payload)
          if (res.message === 'SUCCESS') {
            this.$message.success('创建成功!')
            this.onClose()
            this.$emit('refresh')
          } else {
            this.$message.error('创建失败!' + res.message)
          }
        }
      })
    },
    onClose() {
      this.showDialog = false
      this.$emit('update:visible', this.showDialog)
    }
  }
}
</script>
<style lang="sass" scoped>

.dlg-add-container .search-panel
  display: flex
  padding: 5px 0
  justify-content: space-between
  align-items: center

  & .search-condition
    display: flex
    flex-grow: 1
    padding-right: 20px

  & .search-condition .search-block
    margin-right: 10px
</style>
