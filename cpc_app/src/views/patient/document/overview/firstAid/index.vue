<template>
  <div class="task-preliminary-diagnosis-wrapper">
    <van-collapse v-if="emId && patientInfo.licensePlate" v-model="exhibit" @change="collapseChange">
      <van-collapse-item title="基本信息" name="exhibit1">
        <div class="center">
          <p>
            <span>姓名</span>
            <span>{{ firstAid.patientBaseInfoDto.name }}</span>
          </p>
          <p>
            <span>性别</span>
            <span>
              {{ firstAid.patientBaseInfoDto.gender }}
              <!-- {{
                conversionOne(
                  firstAid.patientBaseInfoDto.gender,
                  dictionary.genderDict
                )
              }} -->
            </span>
          </p>
          <p>
            <span>年龄</span>
            <span
              >{{ firstAid.patientBaseInfoDto.age }}
              {{ firstAid.patientBaseInfoDto.age ? '岁' : '' }}</span
            >
          </p>
          <p>
            <span>民族</span>
            <span>{{
              firstAid.patientBaseInfoDto.nation
            }}族</span>
          </p>
          <p>
            <span>联系电话</span>
            <span>{{ firstAid?.medicalRecordInfoDto?.contactNumber }}</span>
          </p>
        </div>
      </van-collapse-item>
      <van-collapse-item title="任务信息" name="exhibit2">
        <div class="center">
          <p>
            <span> 车牌号</span>
            <span>{{ firstAid?.taskInfoDto?.licensePlate }}</span>
          </p>
          <p>
            <span> 呼叫原因</span
            ><span>{{ firstAid.medicalRecordInfoDto.reasonType }}</span>
          </p>
          <p>
            <span> 疾病类别</span
            ><span>{{ firstAid.medicalRecordInfoDto.diseaseCategory }}</span>
          </p>
          <p>
            <span>接诊地址</span>
            <span>{{ firstAid.medicalRecordInfoDto.address }}</span>
          </p>
          <p>
            <span>出车分站</span>
            <span>{{ firstAid.taskInfoDto.dispatchVehicleSiteName }}</span>
          </p>
          <p>
            <span>出诊医生</span
            ><span>{{ firstAid.taskInfoDto.doctorName }}</span>
          </p>
          <p>
            <span>出诊护士</span
            ><span>{{ firstAid.taskInfoDto.nurseName }}</span>
          </p>
        </div>
      </van-collapse-item>
      <van-collapse-item title="患者病史" name="exhibit3">
        <div class="center">
          <p>
            <span>发病时间</span>
            <span>{{ firstAid.medicalRecordInfoDto.morbtimearea }}</span>
          </p>
          <p>
            <span>主诉</span>
            <span>{{ firstAid.medicalRecordInfoDto.chiefComplaint }}</span>
          </p>
          <p>
            <span>现病史</span
            ><span>{{ firstAid.medicalRecordInfoDto.presentIllness }}</span>
          </p>
          <p>
            <span>过敏史</span>
            <span>{{ firstAid.medicalRecordInfoDto.allergicHistory }}</span>
          </p>
          <p>
            <span>既往史</span>
            <span>{{ firstAid.medicalRecordInfoDto.pastHistory }}</span>
          </p>
        </div>
      </van-collapse-item>
      <van-collapse-item title="体格检查" name="exhibit4">
        <div class="center">
          <van-cell
            v-for="item in firstAid.physicalExaminationDtoList"
            :key="item.id"
          >
            <p>
              <span>检查时间</span>
              <span>{{ formatDate(item.createTime) }}</span>
            </p>
            <p>
              <span>体温（℃）</span>
              <span>{{ item.t }}</span>
            </p>
            <p>
              <span>呼吸（次/分）</span>
              <span>{{ item.rr }}</span>
            </p>
            <p>
              <span>脉搏（次/分）</span>
              <span>{{ item.pulse }}</span>
            </p>
            <p>
              <span>血压（mmHg）</span>
              <span v-show="Number(item.sbp)">
                {{ Number(item.sbp) }} / {{ Number(item.dbp) }}
              </span>
            </p>
            <p>
              <span>血氧（%）</span>
              <span>{{ item.spo2 }}</span>
            </p>
            <p>
              <span>意识</span>
              <span>{{
                item.consciousness
              }}</span>
            </p>
          </van-cell>
        </div>
      </van-collapse-item>
      <van-collapse-item title="辅助检查" name="exhibit5">
        <div class="center">
          <p>心电图</p>
          <div
            class="task-electrocardiogram-uploaded"
            v-if="firstAid.supplementaryExaminationDto?.ecg"
          >
            <van-swipe-cell
              v-for="item in firstAid.supplementaryExaminationDto?.ecg"
              :key="item"
            >
              <van-cell>
                <van-image
                  :key="item"
                  :src="item"
                  @click="imagePreview(item)"
                  fit="contain"
                />
              </van-cell>
            </van-swipe-cell>
          </div>
          <p>
            <span>血糖</span
            ><span>{{
              firstAid.supplementaryExaminationDto.bloodglucose
            }}</span>
          </p>
          <p class="titleText">
            POCT
          </p>
          <p>
            <span>检查时间</span>
            <span>{{
              firstAid.supplementaryExaminationDto?.medPhepPoctEntity?.checkTime
            }}</span>
          </p>
          <p>
            <span>报告时间</span>
            <span>{{
              firstAid.supplementaryExaminationDto?.medPhepPoctEntity?.reportTime
            }}</span>
          </p>
          <p>
            <span
              >TnT（{{
                firstAid?.supplementaryExaminationDto?.medPhepPoctEntity?.tntUnit
              }}）
            </span>
            <span>{{
              firstAid.supplementaryExaminationDto?.medPhepPoctEntity?.tnt
            }}</span>
          </p>
          <p>
            <span
              >TnI（{{
                firstAid.supplementaryExaminationDto.medPhepPoctEntity?.tnlUnit
              }}）</span
            >
            <span>{{
              firstAid.supplementaryExaminationDto.medPhepPoctEntity?.tnl
            }}</span>
          </p>
          <!-- <p>
            现场照片:
          </p>
          <div class="task-electrocardiogram-uploaded ">
            <van-swipe-cell
              v-for="item in firstAid.supplementaryExaminationDto.sitePhotos"
              :key="item"
            >
              <van-cell class="card-item">
                <van-image
                  :key="item"
                  :src="item"
                  @click="imagePreview(item)"
                  fit="contain"
                />
              </van-cell>
            </van-swipe-cell>
          </div> -->
          <!-- <p>
            现场视频:
            <van-popup v-model="previewVideoVisible" closeable>
              <video
                class="video-play"
                :src="firstAid.supplementaryExaminationDto.liveVideo"
                loop
                controls
              />
            </van-popup>
          </p> -->
          <!-- <div class="flex-c-c">
            <div
              class="card-item"
              v-for="item in firstAid.supplementaryExaminationDto.liveVideo"
              :key="item"
              @click="viewVideo"
            >
              <video :src="item" class="video-thumb"></video>
            </div>
          </div> -->
        </div>
      </van-collapse-item>
      <van-collapse-item title="专科评估" name="exhibit6">
        <div class="center">
          <p>
            <span>TI评估</span>
            <span>{{ firstAid.supplementaryExaminationDto.tiScore }}</span>
          </p>
          <p>
            <span>GCS评估</span>
            <span>{{ firstAid.supplementaryExaminationDto.gcsScore }}</span>
          </p>
          <p>
            <span> 胸痛评估</span>
            <span>{{
              firstAid.supplementaryExaminationDto.chestPainAssessment
            }}</span>
          </p>
          <p>
            <span>killip分级</span>
            <span>{{ firstAid.supplementaryExaminationDto.killip }}</span>
          </p>
          <p>
            <span>FAST评估</span>
            <span>{{
              firstAid.supplementaryExaminationDto.fastAssessment
            }}</span>
          </p>
          <p>
            <span>其他检查</span>
            <span>{{ firstAid.supplementaryExaminationDto.otherCheck }}</span>
          </p>
        </div>
      </van-collapse-item>
      <van-collapse-item title="诊断处理" name="exhibit7">
        <div class="center">
          <p>
            <span>初步诊断</span>
            <span>{{ firstAid.diagnosticProcessingDto.diagnosis }}</span>
          </p>
          <p>
            <span>病情判断</span>
            <span>{{
              firstAid?.medicalRecordInfoDto?.conditionGrade
            }}</span>
          </p>
          <p>
            <span>急救措施</span>
            <span v-if="firstAid?.medPhepMeasuresEntityList">
              <div
                v-for="el in firstAid?.medPhepMeasuresEntityList"
                :key="el.id"
              >
                {{ el.measureName }} - {{ el.opTime }}
              </div>
            </span>
          </p>
          <p>
            <span>用药</span>
            <span v-if="firstAid?.diagnosticProcessingDto?.emergencyOrders">
              <div
                v-for="item in firstAid?.diagnosticProcessingDto
                  ?.emergencyOrders"
                :key="item.id"
              >
                {{ item.medPhepDrugEntity.createdDate }}
                {{ item.medPhepDrugEntity.name }}
                ({{ item?.medPhepEmergencyOrdersEntity?.dose }}
                {{ item.medPhepDrugEntity.drugUnit }})
              </div>
            </span>
          </p>
          <p>
            <span>病情转归</span>
            <span>{{
              firstAid?.medicalRecordInfoDto?.rescueChangeResultName
            }}</span>
          </p>
          <p>
            <span>出诊结果</span>
            <span>{{ firstAid?.medicalRecordInfoDto?.treatmentResultName }}</span>
          </p>
          <p>
            <span>送往医院</span>
            <span>{{ firstAid.medicalRecordInfoDto.toHospitalName }}</span>
          </p>
        </div>
      </van-collapse-item>
    </van-collapse>
    <van-empty
      :image="require('@assets/image/empty.png')"
      description="未查询到急救病历信息"
      v-else />
  </div>
</template>
<script>
import { ImagePreview } from 'vant'
import { FirstAidPreview } from '@model/commonModel'
import hospitalMixin from '@mixins/hospitalMixin'
import { mapGetters } from 'vuex'

export default {
  mixins: [hospitalMixin],
  props: {
    patientInfo: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      // hospitalId: this.hospitalId, // 获取用户登入医院id
      infoComingType: '',
      emId: '',
      show: false,
      extend: '1', // 初步诊断标识
      exhibit: [
        'exhibit1',
        'exhibit2',
        'exhibit3',
        'exhibit4',
        'exhibit5',
        'exhibit6',
        'exhibit7'
      ],
      diagnosisTwo: '',
      firstAid: FirstAidPreview(),
      previewVideoVisible: false
    }
  },
  async created() {
    this.emId = this.$route.query.emId
    this.infoComingType = this.$route.query.infoComingType
    // 查询急救信息
    this.getPreviewList()
  },
  computed: {
    ...mapGetters([
      'hospitalId',
      'hospitalArea',
      'curHospitalArea',
      'dictionary'
    ])
  },
  methods: {
    // 查询急救信息
    async getPreviewList() {
      const { result } = await this.$api.preview.getfirstAidList(this.emId, this.infoComingType, this.hospitalAndArea())
      if (result && Object.keys(result)?.length) {
          if (result.patientBaseInfoDto) {
            this.firstAid.patientBaseInfoDto = {
              ...this.firstAid.patientBaseInfoDto,
              ...result.patientBaseInfoDto
            }
          }
          if (result.taskInfoDto) {
            this.firstAid.taskInfoDto = {
              ...this.firstAid.taskInfoDto,
              ...result.taskInfoDto
            }
          }
          if (result.medicalRecordInfoDto) {
            this.firstAid.medicalRecordInfoDto = {
              ...this.firstAid.medicalRecordInfoDto,
              ...result.medicalRecordInfoDto
            }
          }
          if (result.physicalExaminationDtoList) {
            this.firstAid.physicalExaminationDtoList = {
              ...this.firstAid.physicalExaminationDtoList,
              ...result.physicalExaminationDtoList
            }
          }
          if (result.supplementaryExaminationDto) {
            this.firstAid.supplementaryExaminationDto = {
              ...this.firstAid.supplementaryExaminationDto,
              ...result.supplementaryExaminationDto
            }
          }
          if (result.diagnosticProcessingDto) {
            this.firstAid.diagnosticProcessingDto = {
              ...this.firstAid.diagnosticProcessingDto,
              ...result.diagnosticProcessingDto
            }
          }
          if (result.medPhepMeasuresEntityList) {
            this.firstAid.medPhepMeasuresEntityList = [
              ...result.medPhepMeasuresEntityList
            ]
          }
          if (result.consents) {
            this.firstAid.consents = {
              ...this.firstAid.consents,
              ...result.consents
            }
          }
          if (result.epidemiological) {
            this.firstAid.epidemiological = {
              ...this.firstAid.epidemiological,
              ...result.epidemiological
            }
          }
      } else {
        this.$emit('hiddenChange')
      }
    },
    // 多个value转换汉字
    conversion(str, list) {
      if (str && list) {
        const arrValues = str ? str.split(',') : []
        const labels = arrValues.map(val => {
          const matched = list.find(item => item.value === val)
          return matched?.label
        })
        return labels.join(' ; ')
      }
    },
    // value 转换成汉字
    conversionOne(str, list) {
      if (str && list) {
        const matched = list.find(valx => valx.value === str)
        return matched?.label
      }
    },
    imagePreview(item) {
      ImagePreview([item])
    },
    // 时间格式化
    formatDate(date) {
      if (!date) return ''
      return this.$moment(date).format('YYYY-MM-DD HH:mm')
    },
    // 弹出视频播放
    viewVideo() {
      this.previewVideoVisible = true
    },
    collapseChange(val) {
      if (val) {
        this.diagnosisTwo = ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';

.titleText {
  text-align: center;
  font-weight: bold;
}
</style>
