<template>
  <div>
    <div v-if="showEmpty">
      <el-descriptions class="desStyle" title="基本信息" :column="4" border :label-style="widthValue">
        <el-descriptions-item label="姓名">{{ patientDetail.patientBaseInfoDto?.name }}</el-descriptions-item>
        <el-descriptions-item label="性别">
          {{
            conversionOne(
              patientDetail.patientBaseInfoDto?.gender,
              dictionary.genderDict
            )
          }}
        </el-descriptions-item>
        <el-descriptions-item label="年龄">{{ patientDetail.patientBaseInfoDto?.age }}</el-descriptions-item>
        <el-descriptions-item label="民族">
          {{
            conversionOne(
              patientDetail.patientBaseInfoDto?.nation,
              dictionary.nationalityDict
            )
          }}
        </el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ patientDetail.medicalRecordInfoDto?.contactNumber }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="desStyle" title="任务信息" :column="4" border :label-style="widthValue">
        <el-descriptions-item label="车牌号">{{ patientDetail.taskInfoDto?.licensePlate }}</el-descriptions-item>
        <el-descriptions-item label="呼叫原因">{{ patientDetail.medicalRecordInfoDto?.reasonType }}</el-descriptions-item>
        <el-descriptions-item label="疾病类别">{{ patientDetail.medicalRecordInfoDto?.diseaseCategory }}</el-descriptions-item>
        <el-descriptions-item label="接诊地址">{{ patientDetail.medicalRecordInfoDto?.address }}</el-descriptions-item>
        <el-descriptions-item label="出车分站">{{ patientDetail.taskInfoDto?.dispatchVehicleSiteName }}</el-descriptions-item>
        <el-descriptions-item label="出诊医生">{{ patientDetail.taskInfoDto?.doctorName }}</el-descriptions-item>
        <el-descriptions-item label="出诊护士">{{ patientDetail.taskInfoDto?.nurseName }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="desStyle" title="患者病史" :column="4" border :label-style="widthValue">
        <el-descriptions-item label="发病时间">{{ patientDetail.medicalRecordInfoDto?.morbtimearea }}</el-descriptions-item>
        <el-descriptions-item label="主诉">{{ patientDetail.medicalRecordInfoDto?.chiefComplaint }}</el-descriptions-item>
        <el-descriptions-item label="现病史">{{ patientDetail.medicalRecordInfoDto?.presentIllness }}</el-descriptions-item>
        <el-descriptions-item label="过敏史">{{ patientDetail.medicalRecordInfoDto?.allergicHistory }}</el-descriptions-item>
        <el-descriptions-item label="既往史">{{ patientDetail.medicalRecordInfoDto?.pastHistory }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions v-for="(item,index) in (patientDetail.physicalExaminationDtoList || [])" :key="index" class="desStyle" title="体格检查" :column="4" border :label-style="widthValue">
        <el-descriptions-item label="检查时间">{{ item.createTime }}</el-descriptions-item>
        <el-descriptions-item label="体温（℃）">{{ item.t }}</el-descriptions-item>
        <el-descriptions-item label="呼吸（次/分）">{{ item.rr }}</el-descriptions-item>
        <el-descriptions-item label="脉搏（次/分）">{{ item.pulse }}</el-descriptions-item>
        <el-descriptions-item v-if="item.sbp" label="血压（mmHg）">{{ Number(item.sbp) }} / {{ Number(item.dbp) }}</el-descriptions-item>
        <el-descriptions-item label="血氧（%）">{{ item.spo2 }}</el-descriptions-item>
        <el-descriptions-item label="意识">
          {{
            conversionOne(
              item.consciousness,
              dictionary.strokeMindDict
            )
          }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="desStyle" title="辅助检查" :column="1" border :label-style="widthValue">
        <el-descriptions-item label="心电图">
          <span v-for="(item, index) in patientDetail.supplementaryExaminationDto?.ecg" :key="index">
            <img
              :key="item"
              :src="item"
              width="100px"
              height="100px"
              @click="openPicture(item)"
            >
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="血糖">{{ patientDetail.supplementaryExaminationDto?.bloodglucose }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="desStyle" title="POCT" :column="4" border :label-style="widthValue">
        <el-descriptions-item label="检查时间">{{ patientDetail.supplementaryExaminationDto?.medPhepPoctEntity?.checkTime }}</el-descriptions-item>
        <el-descriptions-item label="报告时间">{{ patientDetail.supplementaryExaminationDto?.medPhepPoctEntity?.reportTime }}</el-descriptions-item>
        <el-descriptions-item
          :label="'TnT(' +
            conversionOne(
              patientDetail.supplementaryExaminationDto?.medPhepPoctEntity?.tntUnit,
              dictionary.ctnUnitDict
            ) + ')'"
        >
          {{ patientDetail.supplementaryExaminationDto?.medPhepPoctEntity?.tnt }}</el-descriptions-item>
        <el-descriptions-item
          :label="'TnI(' +
            conversionOne(
              patientDetail.supplementaryExaminationDto?.medPhepPoctEntity?.tnlUnit,
              dictionary.ctnUnitDict
            ) + ')'"
        >
          {{ patientDetail.supplementaryExaminationDto?.medPhepPoctEntity?.tnl }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="desStyle" title="专科评估" :column="4" border :label-style="widthValue">
        <el-descriptions-item label="TI评估">{{ patientDetail.supplementaryExaminationDto?.tiScore }}</el-descriptions-item>
        <el-descriptions-item label="GCS评估">{{ patientDetail.supplementaryExaminationDto?.gcsScore }}</el-descriptions-item>
        <el-descriptions-item label="胸痛评估">{{ patientDetail.supplementaryExaminationDto?.chestPainAssessment }}</el-descriptions-item>
        <el-descriptions-item label="killip分级">{{ patientDetail.supplementaryExaminationDto?.killip }}</el-descriptions-item>
        <el-descriptions-item label="FAST评估">{{ patientDetail.supplementaryExaminationDto?.fastAssessment }}</el-descriptions-item>
        <el-descriptions-item label="其他检查">{{ patientDetail.supplementaryExaminationDto?.otherCheck }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="desStyle" title="诊断处理" :column="4" border :label-style="widthValue">
        <el-descriptions-item label="初步诊断">{{ patientDetail.diagnosticProcessingDto?.diagnosis }}</el-descriptions-item>
        <el-descriptions-item label="病情判断">
          {{
            conversionOne(
              patientDetail.diagnosticProcessingDto?.conditionGrade,
              dictionary.conditionGradeDict
            )
          }}
        </el-descriptions-item>
        <el-descriptions-item label="急救措施" :span="2">
          <span v-for="(item, index) in patientDetail.medPhepMeasuresEntityList" :key="index">
            {{ item.measureName }} - {{ item.opTime }} \
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="用药" :span="4">
          <span v-for="(item, index) in patientDetail.diagnosticProcessingDto?.emergencyOrders" :key="index">
            {{ item.medPhepDrugEntity.createdDate }}
            {{ item.medPhepDrugEntity.name }}
            ({{ item.medPhepEmergencyOrdersEntity.dose }}
            {{ item.medPhepDrugEntity.drugUnit }})\
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="病情转归">{{
          conversionOne(
            patientDetail.diagnosticProcessingDto?.rescueChangeResult,
            dictionary.PHFApatientOutComeDict
          )
        }}</el-descriptions-item>
        <el-descriptions-item label="出诊结果">
          {{ patientDetail.medicalRecordInfoDto?.treatmentResultName }}
        </el-descriptions-item>
        <el-descriptions-item label="送往医院">{{ patientDetail.medicalRecordInfoDto?.toHospitalName }}</el-descriptions-item>
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
import { getfirstAidList } from '@/api/patient/access'
import storage from 'store'
import { mapGetters } from 'vuex'
// import FirstAidPreview from '@/model/firstAidPreview'

export default {
  props: {},
  data() {
    return {
      dialogVisible: false,
      imgUrl: '',
      widthValue: { width: '10%' },
      showEmpty: false,
      patientDetail:
      {
        // 基本信息
        patientBaseInfoDto: {
          name: '', // 名字
          gender: '', // 性别
          age: '', // 年龄
          nation: '' // 民族
        },
        // 任务信息
        taskInfoDto: {
          reasonType: '', // 呼救原因
          destinationAddress: '', // 现场地址
          doctorName: '', // 车载医生
          nurseName: '', // 车载护士
          contactPhone: '' // 联系电话
        },
        // 患者疾病
        medicalRecordInfoDto: {
          diseaseCategory: '', // 疾病类别
          medicalHisProType: '', // 病史提供类型
          historyProvider: '', // 病史提供者
          isMorb: '', // 发病时间
          chiefComplaint: '', // 患者主诉
          presentIllness: '', // 现病史
          pastHistory: '', //  既往史
          allergicHistory: '' // 过敏史
        },
        // 体格检查
        physicalExaminationDtoList: [
          {
            createTime: '', // 检查时间
            rr: '', // 呼吸频率(次/分)
            pulse: '', // 脉搏(次/分)
            spo2: '', // 血氧
            sbp: '', // 收缩压
            dbp: '', // 舒张压
            consciousness: '', // 意识
            leftPulil: '', // 瞳孔（左）
            rightPulil: '', // 瞳孔（右）
            lightReflection: '' // 对光反射
          }
        ],
        // 辅助检查
        supplementaryExaminationDto: {
          // 心电图
          electrocardiogramDto: {
            patientId: '',
            attachPath: '' // 附件路径
          },
          // POCT
          medPhepPoctEntity: {
            tnt: '', // TnT(ng/L)
            tntUnit: '', // TnT单位
            tnl: '', // Tnl(ng/L)
            tnlUnit: '', // Tnl单位
            bnp: '', // BNP(pg/L)
            bnpUnit: '', // BNP单位
            checkTime: '', // 检查时间
            ckmb: '', // CKMB
            ckmbUnit: '', // CKMB单位
            dDimer: '', // D-二聚体(ng/mL)
            dDimerUnit: '', // D-二聚体单位
            myo: '', // Myo(ng/L)
            myoUnit: '', // Myo单位
            ntProbnp: '', // NT-proBNP(pg/mL)
            ntProbnpUnit: '', // NT-proBNP单位
            patientId: '', // 患者ID
            reportFile: '', // 报告附件
            reportTime: '', // 报告时间
            serum: '', // 血清肌酐(umol/mL)
            serumUnit: '' // 血清肌酐单位
          },
          bloodglucose: '', // 血糖
          tiScore: '', // TI评分
          gcsScore: '', // GCS评分
          chestPainAssessment: '', // 胸痛评估
          killip: '', // Killip分级
          fastAssessment: '', // Fast评估
          otherCheck: '', // 其它检查 ,
          sitePhotos: [], // 现场照片
          liveVideo: [] // 现场视频
        },
        // 诊断处理
        diagnosticProcessingDto: {
          // 用药
          emergencyOrdersEntity: {
            patientId: '', // 所属患者
            stackId: '', // 药品组套ID
            drugId: '', // 药品ID
            dose: '', // 用量
            usageId: '', //  用法（数据字典表主键）
            createTime: '', // 用药时间
            createBy: '', // 创建人
            specifications: '', // 规格
            status: '', // 是否用于交接
            isHand: '' // 状态
          },
          diagnosis: '', // 初步诊断
          conditionGrade: '', // 病情判断
          treatment: '', // 急救措施
          rescueChangeResult: '', // 病情转归
          treatmentResult: '', // 出诊结果
          toHospial: '' // 送往医院
        },
        // 急救措施
        medPhepMeasuresEntityList: {
          // 用药
          emergencyOrdersEntity: {
            id: '', // 主键
            patientId: '', // 患者id
            measureKey: '', // 措施标识
            measureName: '', // 措施名称
            opTime: '' //  措施时间
          }
        },
        consents: '', // 知情同意书
        epidemiological: '' // 新冠流调表
      },
      dic: storage.get('DICTIONARY')
    }
  },
  computed: {
    ...mapGetters(['dictionary'])
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
      getfirstAidList(
        this.$route.query.emId, this.$route.query.infoComingType, this.$route.query.hospitalAndArea
      )
        .then((res) => {
          if (res.status === 200) {
            if (res.result && Object.keys(res.result)?.length && Object.values(res.result).some(v => v !== null)) {
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
