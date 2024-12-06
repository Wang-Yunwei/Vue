<template>
  <el-form ref="form" :model="form" label-width="120px" label-position="top">
    <h2>
      <center>
        院前院内病情交接单
        <el-tag
          v-if="!canEdit"
          type="success"
          style="vertical-align: bottom"
        >已提交</el-tag>
        <el-button
          v-if="canEdit && !viewMode"
          type="primary"
          size="small"
          style="position: relative; right: -496px"
          @click="submitHandover"
        >提交
        </el-button>
      </center>
    </h2>
    <el-row :gutter="24">
      <el-col :span="8">
        <el-form-item label="患者姓名" prop="name">
          <el-input
            v-model="form.name"
            size="mini"
            readonly
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="性别" prop="gender">
          <med-radio
            v-model="form.gender"
            size="mini"
            readonly
            :options="dictionary[dic.gender]"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="年龄" prop="age">
          <age-input
            v-model="form.age"
            size="mini"
            readonly
            :age-extend.sync="form.ageExtend"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="16">
        <el-form-item label="接诊地址" prop="address">
          <el-input
            v-model="form.address"
            size="mini"
            readonly
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="出车分站" prop="dispatchVehicleSite">
          <station-select
            v-model="form.dispatchVehicleSite"
            size="mini"
            placeholder="请选择"
            readonly
            :hospital-id="hospitalId"
            :hospital-area="hospitalArea"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="病历编号" prop="recordId" style="flex: 1 1 33%">
          <el-input
            v-model="form.recordId"
            size="mini"
            readonly
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          label="交接时间"
          prop="shiftTime"
          :rules="[
            {
              required: true,
              message: '请选择交接时间'
            }
          ]"
          style="flex: 1 1 33%"
        >
          <el-date-picker
            v-model="form.shiftTime"
            :readonly="!canEdit || viewMode"
            size="mini"
            type="datetime"
            placeholder="选择时间"
            value-format="yyyy-MM-dd[T]HH:mm:ss"
            format="yyyy-MM-dd HH:mm"
            style="width: 360px"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="急救车" prop="licensePlate" style="flex: 1 1 33%">
          <med-select
            v-model="form.licensePlate"
            size="mini"
            readonly
            placeholder="请选择"
            :options="vehicleList"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          label="患者主诉"
          prop="chiefComplaint"
          style="flex: 1 1 100%"
        >
          <el-input
            v-model="form.chiefComplaint"
            size="mini"
            readonly
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="初步诊断" prop="diagnosis" style="flex: 1 1 100%">
          <diagnosis-input
            v-model="form.diagnosis"
            size="mini"
            readonly
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          label="病情判断"
          prop="conditionGrade"
          style="flex: 1 1 100%"
        >
          <med-radio
            v-model="form.conditionGrade"
            readonly
            :options="dictionary[dic.conditionJudgment]"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="呼吸(次/分)" prop="rr" style="flex: 1 1 33%">
          <el-input
            v-model="form.rr"
            size="mini"
            :readonly="!canEdit || viewMode"
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="脉搏(次/分)" prop="pulse" style="flex: 1 1 33%">
          <el-input
            v-model="form.pulse"
            size="mini"
            :readonly="!canEdit || viewMode"
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="体温" prop="t" style="flex: 1 1 33%">
          <el-input
            v-model="form.t"
            size="mini"
            :readonly="!canEdit || viewMode"
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="收缩压(mmhg)" prop="sbp" style="flex: 1 1 33%">
          <el-input
            v-model="form.sbp"
            size="mini"
            :readonly="!canEdit || viewMode"
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="舒张压(mmhg)" prop="dbp" style="flex: 1 1 33%">
          <el-input
            v-model="form.dbp"
            size="mini"
            :readonly="!canEdit || viewMode"
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="SPO2%" prop="spo2" style="flex: 1 1 33%">
          <el-input
            v-model="form.spo2"
            size="mini"
            :readonly="!canEdit || viewMode"
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="意识" prop="consciousness" style="flex: 1 1 100%">
          <med-radio
            v-model="form.consciousness"
            :readonly="!canEdit || viewMode"
            :options="dictionary[dic.consciousness]"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="皮肤" prop="skin">
          <med-radio
            v-model="form.skin"
            :readonly="!canEdit || viewMode"
            :options="dictionary[dic.skin]"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="瞳孔" prop="pupilResponse">
          <med-radio
            v-model="form.pupilResponse"
            :readonly="!canEdit || viewMode"
            :options="dictionary[dic.pupil]"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="对光反射" prop="lightReflection">
          <med-radio
            v-model="form.lightReflection"
            :readonly="!canEdit || viewMode"
            :options="dictionary[dic.lightReaction]"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="辅助检查" prop="accessoryExam">
          <el-input
            v-model="form.accessoryExam"
            size="mini"
            readonly
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <div class="list-wrapper">
          <el-divider content-position="left">急救措施</el-divider>
          <el-table
            size="mini"
            :data="measuresEntities"
            stripe
            style="width: 600px"
          >
            <el-table-column prop="opTime" label="时间" width="180" />
            <el-table-column prop="measureName" label="措施" />
          </el-table>
        </div>
        <div class="list-wrapper">
          <el-divider content-position="left">用药</el-divider>
          <medication :can-edit="false" :patient-id="patientId" />

          <!-- <el-table :data="patientDrugList" stripe style="width: 600px">
            <el-table-column prop="createTime" label="时间" width="180" />
            <el-table-column prop="drugName" label="药品" />
          </el-table> -->
        </div>
        <el-form-item label="其他" prop="otherInfo">
          <el-input
            v-model="form.otherInfo"
            size="mini"
            :readonly="!canEdit || viewMode"
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          label="交接医院"
          prop="handoverHospitalId"
          :rules="[
            { required: true, message: '选择交接医院', trigger: 'change' }
          ]"
          style="flex: 1 1 50%"
        >
          <med-select
            v-model="form.handoverHospitalId"
            size="mini"
            :readonly="!canEdit || viewMode"
            placeholder="请选择"
            :options="hospitalAreaList"
            @select="(e) => (form.handoverHospitalName = e.label)"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          label="交接科室"
          prop="dept"
          :rules="[
            { required: true, message: '选择交接科室', trigger: 'blur' }
          ]"
          style="flex: 1 1 50%"
        >
          <med-select
            v-model="form.dept"
            size="mini"
            :readonly="!canEdit || viewMode"
            placeholder="请选择"
            :options="dictionary[dic.handoverDepartment]"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <!-- <el-row :gutter="24">
      <el-col :span="8">
        <el-form-item
          label="出诊医生"
          prop="emergencyDoctor"
          :rules="[
            {
              required: true,
              message: '出诊医生签名不能为空',
              trigger: 'change'
            }
          ]"
          style="flex: 0 1 100%"
        >
          <med-sign
            v-model="form.emergencyDoctor"
            :disabled="!canEdit || viewMode"
            :file-name="patientId + 'emergencyDoctor'"
            :business-id.sync="form.shiftRecordId"
            :file-type="3"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          label="出诊护士"
          prop="emergencyNurse"
          style="flex: 0 1 100%"
        >
          <med-sign
            v-model="form.emergencyNurse"
            :disabled="!canEdit || viewMode"
            :file-name="patientId + 'emergencyNurse'"
            :business-id.sync="form.shiftRecordId"
            :file-type="4"
          />
        </el-form-item>
      </el-col>
    </el-row> -->
    <el-row :gutter="24">
      <el-col :span="8">
        <el-form-item
          label="出诊医护"
          prop="outOfOfficeDiagnosis"
          :rules="[
            {
              required: true,
              message: '出诊医护签名不能为空',
              trigger: 'change'
            }
          ]"
          style="flex: 0 1 100%"
        >
          <med-sign
            v-model="form.outOfOfficeDiagnosis"
            :disabled="!canEdit || viewMode"
            :file-name="patientId + 'outOfOfficeDiagnosis'"
            :file-type="3"
            :business-id.sync="form.shiftRecordId"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="接诊医护" prop="acceptDiagnosis" style="flex: 0 1 100%">
          <med-sign
            v-model="form.acceptDiagnosis"
            :disabled="!canEdit || viewMode"
            :file-name="patientId + 'acceptDiagnosis'"
            :file-type="4"
            :business-id.sync="form.shiftRecordId"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <center v-if="!canEdit && !viewMode">
      <el-button
        icon="el-icon-printer"
        @click="handlePrint"
      >打印交接单</el-button>
    </center>
    <iframe
      v-if="!viewMode"
      ref="printIframe"
      :src="pdfSrc"
      style="width: 0; height: 0; border: none"
    />
  </el-form>
</template>

<script>
import { queryShiftDetail, saveOrUpdate } from '@/api/shiftRecord'
import { dicConstant as dic } from '@/constant'
import { mapGetters } from 'vuex'
import { eccPageList } from '@/api/emergencyCar'
import MedSign from '@/components/MedSign'
import Medication from '@/components/Medication'
import { pdfDeliveryFrom } from '@/api/print'

export default {
  name: 'Handover',
  components: {
    Medication,
    MedSign
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
      vehicleList: [], // 急救车
      drugList: [], // 药品信息数据源
      patientDrugList: [], // 患者用药信息
      measuresEntities: [], // 治疗措施
      form: {},
      pdfSrc: ''
    }
  },
  computed: {
    ...mapGetters(['hospitalId', 'dictionary', 'hospitalAreaList']),
    canEdit() {
      return !this.form.submitTime
    },
    patientId() {
      return this.$route.query.patientId
    },
    recordId() {
      return this.$route.query.recordId
    },
    patientInfo() {
      return this.detailData.medPhepPatientsEntity || {}
    },
    missionInfo() {
      return this.detailData.medPhepMissionsEntity || {}
    },
    medicalRecordInfo() {
      return this.detailData.medPhepMedicalRecordsEntity || {}
    }
    // shiftRecordInfo() {
    //   return this.detailData.medPhepShiftRecordEntity
    // }
  },
  watch: {
    detailData: {
      immediate: true,
      handler(val) {
        if (val) {
          this.getDetail()
        }
      }
    }
  },
  created() {
    this.initVehicleList()
    // this.initDrugsList()
    // if (this.patientId) {
    //   this.queryPatientDrugList()
    // }
  },
  methods: {
    submitHandover() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          this.onSave(true)
        } else {
          this.$nextTick(() => {
            const errElment = this.$refs.form.$el.querySelector(
              '.el-form-item__error'
            )
            console.log(errElment)
            if (errElment) {
              errElment.scrollIntoView()
            }
          })
        }
      })
      // queryShiftDetail(this.patientId).then((res) => {
      //   if (!res.body.medPhepShiftRecordEntity) {
      //     this.$notify({
      //       title: '警告',
      //       message: '请先保存再提交!',
      //       type: 'warning'
      //     })
      //   } else {
      //     saveOrUpdate({
      //       medPhepShiftRecordEntity: {
      //         id: res.body.medPhepShiftRecordEntity.shiftRecordId,
      //         shiftTime: this.now(),
      //         patientId: this.patientId,
      //         submitStatus: this.form.submitStatus
      //       }
      //     }).then((res) => {
      //       if (res.code === '000000') {
      //         this.$message.success('提交成功')
      //       }
      //     })
      //   }
      // })
    },
    async handlePrint() {
      const res = await pdfDeliveryFrom(this.patientId)
      if (res) {
        const blob = new Blob([res], { type: 'application/pdf;chartset=UTF-8' })
        this.pdfSrc = URL.createObjectURL(blob)
        setTimeout(() => {
          this.$refs.printIframe.contentWindow.print()
        }, 500)
      } else {
        this.$message('获取打印数据失败!')
      }
    },
    now() {
      return this.$moment().format('YYYY-MM-DD[T]HH:mm:ss')
    },
    clearNull(obj) {
      const newObj = {}
      if (Object.prototype.toString.call(obj) === '[object Object]') {
        Object.keys(obj).forEach((k) => {
          if (obj[k] !== null) {
            newObj[k] = obj[k]
          }
        })
      }
      return newObj
    },
    detail2Form(shiftDetail) {
      const cleanDetail = this.clearNull(shiftDetail)
      const {
        measuresEntities = [],
        estimateEntityList = [],
        medPhepMedicalRecordsEntity = {},
        ecgCount,
        medPhepGeneralInspectionsEntity: inspectionInfo = {},
        medPhepShiftRecordEntity: shiftRecordInfo = {}
      } = cleanDetail

      this.measuresEntities = measuresEntities // 治疗措施

      let accessoryExam // 辅助检查
      if (ecgCount > 0) {
        accessoryExam = (accessoryExam || '') + '心电图:已检查'
      } else {
        accessoryExam = (accessoryExam || '') + '心电图:未检查'
      }
      if (accessoryExam) {
        accessoryExam = accessoryExam + '、'
      }
      if (medPhepMedicalRecordsEntity?.bloodglucose) {
        accessoryExam = (accessoryExam || '') + '血糖:已检查'
      } else {
        accessoryExam = (accessoryExam || '') + '血糖:未检查'
      }
      if (estimateEntityList) {
        estimateEntityList.map((item) => {
          // 评分添加显示到辅助检查
          accessoryExam =
            (accessoryExam || '') +
            '、' +
            (item.title || '') +
            ':' +
            (item.description || '')
        })
      }
      this.form = {
        name: this.patientInfo.name,
        gender: this.patientInfo.gender,
        age: this.patientInfo.age,
        ageExtend: this.patientInfo.ageExtend,

        address: this.medicalRecordInfo.address,
        dispatchVehicleSite: this.missionInfo.dispatchVehicleSite,
        licensePlate: this.missionInfo.licensePlate,

        recordId: this.medicalRecordInfo.recordId,
        chiefComplaint: this.medicalRecordInfo.chiefComplaint,
        diagnosis: this.medicalRecordInfo.diagnosis,
        conditionGrade: this.medicalRecordInfo.conditionGrade,

        createTime: inspectionInfo.createTime, // 体征时间
        isNormal: inspectionInfo.isNormal, // 体征是否正常采集
        status: inspectionInfo.status, // 体征 状态
        id: inspectionInfo.id, // 体征id
        rr: inspectionInfo.rr, // 呼吸
        pulse: inspectionInfo.pulse, // 脉搏
        sbp: inspectionInfo.sbp, // 收缩压
        dbp: inspectionInfo.dbp, // 舒张压
        spo2: inspectionInfo.spo2, // 血氧
        consciousness: inspectionInfo.consciousness, // 意识
        skin: inspectionInfo.skin, // 皮肤
        pupilResponse: inspectionInfo.pupilResponse, // 瞳孔
        lightReflection: inspectionInfo.lightReflection, // 对光反射
        t: inspectionInfo.t, // 体温

        accessoryExam: shiftRecordInfo.accessoryExam || accessoryExam, // 辅助检查
        otherInfo: shiftRecordInfo.otherInfo, // 其他
        handoverHospitalId: shiftRecordInfo.handoverHospitalId, // 交接医院
        handoverHospitalName: shiftRecordInfo.handoverHospitalName, // 交接医院名称
        dept: shiftRecordInfo.dept, // 交接科室
        emergencyDoctor: shiftRecordInfo.emergencyDoctor, // 出诊医生
        emergencyNurse: shiftRecordInfo.emergencyNurse, // 出诊护士
        outOfOfficeDiagnosis: shiftRecordInfo.outOfOfficeDiagnosis, // 出诊医护
        acceptDiagnosis: shiftRecordInfo.acceptDiagnosis, // 接诊医护
        shiftRecordId: shiftRecordInfo.shiftRecordId,
        submitTime: shiftRecordInfo.submitTime,
        shiftTime: shiftRecordInfo.shiftTime || this.now(),
        submitStatus: shiftRecordInfo.submitStatus,
        isNotifyEmergency: shiftRecordInfo.isNotifyEmergency,
        otherCheck: shiftRecordInfo.otherCheck
      }
    },
    form2Detail(isSubmit) {
      return {
        medPhepShiftRecordEntity: {
          address: this.form.address,
          accessoryExam: this.form.accessoryExam, // 辅助检查
          bloodglucose: this.form.bloodglucose,
          chiefComplaint: this.form.chiefComplaint,
          conditionGrade: this.form.conditionGrade,
          createTime: this.form.createTime,
          dept: this.form.dept, // 交接科室
          diagnosis: this.form.diagnosis,
          outOfOfficeDiagnosis: this.form.outOfOfficeDiagnosis, // 出诊医护
          acceptDiagnosis: this.form.acceptDiagnosis, // 接诊医护
          emergencyDoctor: this.form.emergencyDoctor, // 出诊医生
          emergencyNurse: this.form.emergencyNurse, // 出诊护士
          id: this.form.shiftRecordId,
          isNotifyEmergency: this.form.isNotifyEmergency,
          otherCheck: this.form.otherCheck,
          otherInfo: this.form.otherInfo, // 其他
          patientId: this.patientId,
          recordId: this.recordId,
          // rescueChangeResult: this.form.rescueChangeResult,
          shiftTime: this.form.shiftTime,
          status: this.form.submitStatus,
          submitTime: isSubmit ? this.form.submitTime || this.now() : void 0, // 提交时提供提交时间
          handoverHospitalId: this.form.handoverHospitalId, // 交接医院
          handoverHospitalName: this.form.handoverHospitalName // 交接医院名称
          // treatmentResult: this.form.treatmentResult,
          // updateTime: this.form.updateTime
        },
        medPhepGeneralInspectionsEntity: {
          consciousness: this.form.consciousness,
          createTime: this.form.createTime, // 体征时间
          dbp: this.form.dbp,
          id: this.form.id,
          isNormal: this.form.isNormal, // 体征是否正常采集
          lightReflection: this.form.lightReflection,
          patientId: this.patientId,
          pulse: this.form.pulse,
          pupilResponse: this.form.pupilResponse,
          rr: this.form.rr,
          sbp: this.form.sbp,
          skin: this.form.skin,
          spo2: this.form.spo2,
          status: this.form.status, // 体征 状态
          t: this.form.t
        }
      }
    },
    // 获取药品列表
    // initDrugsList() {
    //   queryDrugsList().then((res) => {
    //     this.drugList = res.body
    //   })
    // },
    // 获取患者用药列表
    // queryPatientDrugList() {
    //   queryByPatientId(this.patientId).then((res) => {
    //     this.patientDrugList = res.body.map((item) => {
    //       const drug =
    //         this.drugList.find(
    //           (el) => el.drugId && el.drugId === item.drugId
    //         ) || {}
    //       const drugName = drug.drugName
    //         ? drug.drugName + '/' + item.usageDesc + '/' + item.dose
    //         : ''
    //       return {
    //         ...item,
    //         drugName
    //       }
    //     })
    //   })
    // },
    async getDetail() {
      const res = await queryShiftDetail(this.patientId)
      if (res.code === '000000') {
        this.detail2Form(res.body)
      } else {
        this.$message.error('获取药品列表失败! ' + res.message)
      }
    },
    async initVehicleList() {
      const res = await eccPageList({ hospitalId: this.hospitalId })
      if (Array.isArray(res.body.records)) {
        this.vehicleList = res.body.records.map((item) => {
          return {
            label: item.licensePlate,
            value: item.licensePlate
          }
        })
      } else if (res.message) {
        this.$message.error('获取车辆列表失败! ' + res.message)
      }
    },
    // 保存交接单
    async onSave(isSubmit) {
      if (!this.canEdit) {
        this.$message.error('不可保存,因为已经交接完成')
        return
      }
      const payload = this.form2Detail(isSubmit)
      const res = await saveOrUpdate(payload)
      if (res.code === '000000') {
        this.$message.success('交接单保存成功')
        this.getDetail()
      } else {
        this.$message.error('交接单保存失败' + res.message)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.list-wrapper {
  flex: 1 1 100%;
  padding-left: 40px;
  margin-bottom: 30px;
}
</style>
