<template>
  <div>
    <div v-if="showEmpty">
      <el-descriptions class="desStyle" title="基本信息" :column="4" border :label-style="widthValue">
        <el-descriptions-item label="姓名">
          {{ patientDetail.patientBaseInfoDto.name }}
        </el-descriptions-item>
        <el-descriptions-item label="性别">
          {{ patientDetail.patientBaseInfoDto.gender }}
          <!-- {{
            conversionOne(
              patientDetail.patientBaseInfoDto.gender,
              dic.gender
            )
          }} -->
        </el-descriptions-item>
        <el-descriptions-item label="年龄">
          {{ patientDetail.patientBaseInfoDto.age }}
        </el-descriptions-item>
        <el-descriptions-item label="民族">
          {{ patientDetail.patientBaseInfoDto.nation }}
          <!-- {{
            conversionOne(
              patientDetail.patientBaseInfoDto.nation,
              dic.strokeNation
            )
          }} -->
        </el-descriptions-item>
        <el-descriptions-item label="联系电话">
          {{ patientDetail.medicalRecordInfoDto.contactNumber }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="desStyle" title="任务信息" :column="4" border :label-style="widthValue">
        <el-descriptions-item label="车牌号">{{ patientDetail.taskInfoDto.licensePlate }}</el-descriptions-item>
        <el-descriptions-item label="呼叫原因">{{ patientDetail.medicalRecordInfoDto.reasonType }}</el-descriptions-item>
        <el-descriptions-item label="疾病类别">{{ patientDetail.medicalRecordInfoDto.diseaseCategory }}</el-descriptions-item>
        <el-descriptions-item label="接诊地址">{{ patientDetail.medicalRecordInfoDto.address }}</el-descriptions-item>
        <el-descriptions-item label="出车分站">{{ patientDetail.taskInfoDto.dispatchVehicleSiteName }}</el-descriptions-item>
        <el-descriptions-item label="出诊医生">{{ patientDetail.taskInfoDto.doctorName }}</el-descriptions-item>
        <el-descriptions-item label="出诊护士">{{ patientDetail.taskInfoDto.nurseName }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="desStyle" title="患者病史" :column="4" border :label-style="widthValue">
        <el-descriptions-item label="发病时间">{{ patientDetail.medicalRecordInfoDto.morbtimearea }}</el-descriptions-item>
        <el-descriptions-item label="主诉">{{ patientDetail.medicalRecordInfoDto.chiefComplaint }}</el-descriptions-item>
        <el-descriptions-item label="现病史">{{ patientDetail.medicalRecordInfoDto.presentIllness }}</el-descriptions-item>
        <el-descriptions-item label="过敏史">{{ patientDetail.medicalRecordInfoDto.allergicHistory }}</el-descriptions-item>
        <el-descriptions-item label="既往史">{{ patientDetail.medicalRecordInfoDto.pastHistory }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions v-for="(item,index) in patientDetail.physicalExaminationDtoList" :key="index" class="desStyle" title="体格检查" :column="4" border :label-style="widthValue">
        <el-descriptions-item label="检查时间">{{ item.createTime }}</el-descriptions-item>
        <el-descriptions-item label="体温（℃）">{{ item.t }}</el-descriptions-item>
        <el-descriptions-item label="呼吸（次/分）">{{ item.rr }}</el-descriptions-item>
        <el-descriptions-item label="脉搏（次/分）">{{ item.pulse }}</el-descriptions-item>
        <el-descriptions-item v-if="item.sbp" label="血压（mmHg）">{{ Number(item.sbp) }} / {{ Number(item.dbp) }}</el-descriptions-item>
        <el-descriptions-item label="血氧（%）">{{ item.spo2 }}</el-descriptions-item>
        <el-descriptions-item label="意识">
          {{ item.consciousness }}
          <!-- {{
            conversionOne(
              item.spo2,
              dic.mind
            )
          }} -->
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="desStyle" title="辅助检查" :column="1" border :label-style="widthValue">
        <el-descriptions-item label="心电图">
          <span v-for="(item, index) in patientDetail.supplementaryExaminationDto.ecg" :key="index">
            <img
              :key="item"
              :src="item"
              width="100px"
              height="100px"
              @click="openPicture(item)"
            >
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="血糖">
          {{ patientDetail.supplementaryExaminationDto.bloodglucose }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="desStyle" title="POCT" :column="4" border :label-style="widthValue">
        <el-descriptions-item label="检查时间">{{ patientDetail.supplementaryExaminationDto.medPhepPoctEntity.checkTime }}</el-descriptions-item>
        <el-descriptions-item label="报告时间">{{ patientDetail.supplementaryExaminationDto.medPhepPoctEntity.reportTime }}</el-descriptions-item>
        <el-descriptions-item
          :label="'TnT(' +
            patientDetail.supplementaryExaminationDto.medPhepPoctEntity.tntUnit+ ')'"
        >
          {{ patientDetail.supplementaryExaminationDto.medPhepPoctEntity.tnt }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="'TnI(' +
            patientDetail.supplementaryExaminationDto.medPhepPoctEntity.tnlUnit + ')'"
        >
          {{ patientDetail.supplementaryExaminationDto.medPhepPoctEntity.tnl }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="desStyle" title="专科评估" :column="4" border :label-style="widthValue">
        <el-descriptions-item label="TI评估">{{ patientDetail.supplementaryExaminationDto.tiScore }}</el-descriptions-item>
        <el-descriptions-item label="GCS评估">{{ patientDetail.supplementaryExaminationDto.gcsScore }}</el-descriptions-item>
        <el-descriptions-item label="胸痛评估">{{ patientDetail.supplementaryExaminationDto.chestPainAssessment }}</el-descriptions-item>
        <el-descriptions-item label="killip分级">{{ patientDetail.supplementaryExaminationDto.killip }}</el-descriptions-item>
        <el-descriptions-item label="FAST评估">{{ patientDetail.supplementaryExaminationDto.fastAssessment }}</el-descriptions-item>
        <el-descriptions-item label="其他检查">{{ patientDetail.supplementaryExaminationDto.otherCheck }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="desStyle" title="诊断处理" :column="4" border :label-style="widthValue">
        <el-descriptions-item label="初步诊断">
          {{ patientDetail.diagnosticProcessingDto.diagnosis }}
        </el-descriptions-item>
        <el-descriptions-item label="病情判断">
          {{ patientDetail.medicalRecordInfoDto.conditionGrade }}
          <!-- {{
            conversionOne(
              patientDetail.diagnosticProcessingDto.conditionGrade,
              dic.conditionGrade
            )
          }} -->
        </el-descriptions-item>
        <el-descriptions-item label="急救措施" :span="2">
          <span v-for="(item, index) in patientDetail.medPhepMeasuresEntityList" :key="index">
            {{ item.measureName }} - {{ item.opTime }} \
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="用药" :span="4">
          <span v-for="(item, index) in patientDetail.diagnosticProcessingDto.emergencyOrders" :key="index">
            {{ item.medPhepDrugEntity.createdDate }}
            {{ item.medPhepDrugEntity.name }}
            ({{ item.medPhepEmergencyOrdersEntity.dose }}
            {{ item.medPhepDrugEntity.drugUnit }})\
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="病情转归">
          {{ patientDetail.medicalRecordInfoDto.rescueChangeResultName }}
        </el-descriptions-item>
        <el-descriptions-item label="出诊结果">
          {{ patientDetail.medicalRecordInfoDto.treatmentResultName }}
          <!-- {{
            conversionOne(
              patientDetail.medicalRecordInfoDto.treatmentResult,
              dic.rescueChangeResult
            )
          }} -->
        </el-descriptions-item>
        <el-descriptions-item label="送往医院">
          {{ patientDetail.medicalRecordInfoDto.toHospitalName }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div v-if="!showEmpty">
      <el-empty description="未查询到急救信息" />
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img :src="imgUrl" class="pan-img" height="600" width="600">
    </el-dialog>
  </div>
</template>

<script>
import accessApi from '@/api/access'
import storage from 'store'
import FirstAidPreview from '@/model/firstAidPreview'

export default {
  props: {},
  data() {
    return {
      dialogVisible: false,
      imgUrl: '',
      widthValue: { width: '10%' },
      patientDetail: FirstAidPreview(),
      dic: storage.get('dicData'),
      showEmpty: false
    }
  },
  computed: {
  },
  mounted() {
    // 查询急救信息
    this.getPreviewList()
  },
  methods: {
    openPicture(url) {
      this.dialogVisible = true
      this.imgUrl = url
    },
    // value 转换成汉字
    conversionOne(str, list) {
      if (str && list) {
        const matched = list.find(valx => valx.value === str)
        return matched?.label
      }
    },
    // 查询急救信息
    getPreviewList() {
      accessApi
        .getfirstAidList(
          this.$route.query.emId, this.$route.query.hospitalAndArea
        )
        .then((res) => {
          if (res.status === 200) {
            if (res.result && Object.keys(res.result)?.length) {
              this.patientDetail = { ...res.result }
              if (this.patientDetail) {
                this.showEmpty = true
              }
            }
          }
        })
    }
  }
}
</script>

<style scoped>
  .desStyle {
    padding-bottom: 30px;
  }
</style>
