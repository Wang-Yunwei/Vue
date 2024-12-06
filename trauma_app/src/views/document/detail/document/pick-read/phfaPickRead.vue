<template>
  <div class="phfa">
    <van-empty v-if="emptData" description="未查询到急救病历信息" :image="require('@assets/image/empty.png')" />
    <van-collapse v-else v-model="active">
      <van-collapse-item v-for="(item, index) in  list " :key="index" :title="item.title" :name="index">
        <div class="content">
          <div v-for="(itemA, indexA) in  item.list " :key="indexA" style="margin-bottom: 0.2rem;">
            <div v-if="index === 4 && indexA === 2" style="text-align: center;font-weight: 600;margin-bottom: 0.2rem;">
              POCT
            </div>
            <div :style="optionA.includes(itemA.label) ? '' : 'display:flex'">
              <div style="flex: 40%;">{{ itemA.label }}</div>
              <div v-if="optionA.includes(itemA.label)">
                <div style="color: rgb(136, 134, 134);">
                  <div v-if="(typeof itemA.value) === 'object'">
                    <div v-for="(itemB, indexB) in itemA.value" :key="indexB">
                      <div v-if="itemA.label === '急救措施'" style="margin: 0.2rem 0 0 0.3rem;">
                        {{ itemB.measureName }} - {{ itemB.opTime }}
                      </div>
                      <div v-if="itemA.label === '用药'" style="margin: 0.2rem 0 0 0.3rem;">
                        {{ itemB.medPhepEmergencyOrdersEntity.createTime + itemB.medPhepDrugEntity.name + '(' +
      itemB.medPhepDrugEntity.specifications + ')' }}
                      </div>
                      <div v-if="itemA.label === '心电图'" style="margin: 0.2rem 0;">
                        <van-image fit="contain" :src="itemB" @click="preview(itemB)" />
                      </div>
                    </div>
                  </div>
                  <div v-else style="margin: 0.2rem 0 0 0.3rem;">{{ itemA.value }}</div>
                </div>
              </div>
              <div v-else style="flex: 60%;color: rgb(136, 134, 134)">
                {{ itemA.value }}
              </div>
            </div>
          </div>
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import dictionariesMixin from '@mixins/dictionariesMixin'
import { ImagePreview } from 'vant'
export default {
  name: 'phfaPickRead',
  mixins: [dictionariesMixin],
  data() {
    return {
      optionA: ['发病时间', '心电图', '急救措施', '用药', '送往医院'],
      emptData: true, // 判断是否有数据
      active: [0, 1, 2, 3, 4, 5, 6],
      form: {
        patientBaseInfoDto: {}, // 患者信息
        medicalRecordInfoDto: {}, // 病历
        physicalExaminationDtoList: [], // 体格检查列表
        supplementaryExaminationDto: {}, // 辅助检查
        medPhepMeasuresEntityList: {}, // 急救措施
        taskInfoDto: {} // 任务信息
      }
    }
  },
  activated() {
    this.getDetails()
  },
  mounted() {
    this.getDetails()
  },
  computed: {
    ...mapGetters(['emId', 'hospitalId', 'hospitalArea']),
    list() {
      // 处理体格检查
      const pe = []
      if (this.form.physicalExaminationDtoList.length > 0) {
        this.form.physicalExaminationDtoList.filter(item => item.createTime).sort((a, b) => b.createTime - a.createTime).forEach(el => {
          pe.push({ label: '检查时间', value: el.createTime })
          pe.push({ label: '体温（℃）', value: el.t })
          pe.push({ label: '呼吸（次/分）', value: el.rr })
          pe.push({ label: '脉搏（次/分）', value: el.pulse })
          pe.push({ label: '血压（mmHg）', value: el.sbp && el.dbp ? parseInt(el.sbp) + '/' + parseInt(el.dbp) : '' })
          pe.push({ label: '血氧（%）', value: el.spo2 })
          pe.push({ label: '意识', value: el.consciousness })
        })
      }
      return [
        {
          title: '基本信息',
          list: [
            { label: '姓名', value: this.form.patientBaseInfoDto.name },
            { label: '性别', value: this.form.patientBaseInfoDto.gender },
            { label: '年龄', value: this.form.patientBaseInfoDto.age ? this.form.patientBaseInfoDto.age + '岁' : '' },
            { label: '民族', value: this.form.patientBaseInfoDto.nation },
            { label: '联系电话', value: this.form.medicalRecordInfoDto.contactNumber }
          ]
        },
        {
          title: '任务信息',
          list: [
            { label: '车牌号', value: this.form.taskInfoDto.licensePlate },
            { label: '呼叫原因', value: this.form.medicalRecordInfoDto.reasonType },
            { label: '疾病类别', value: this.form.medicalRecordInfoDto.diseaseCategory },
            { label: '接诊地址', value: this.form.medicalRecordInfoDto.address },
            { label: '出车分站', value: this.form.taskInfoDto.dispatchVehicleSiteName },
            { label: '出诊医生', value: this.form.taskInfoDto.doctorName },
            { label: '出诊护士', value: this.form.taskInfoDto.nurseName }
          ]
        },
        {
          title: '患者病史',
          list: [
            { label: '发病时间', value: this.form.medicalRecordInfoDto.morbtimearea },
            { label: '主诉', value: this.form.medicalRecordInfoDto.chiefComplaint },
            { label: '现病史', value: this.form.medicalRecordInfoDto.presentIllness },
            { label: '过敏史', value: this.form.medicalRecordInfoDto.allergicHistory },
            { label: '既往史', value: this.form.medicalRecordInfoDto.pastHistory }
          ]
        },
        {
          title: '体格检查',
          list: pe
        },
        {
          title: '辅助检查',
          list: [
            { label: '心电图', value: this.form.supplementaryExaminationDto.ecg },
            { label: '血糖（mmol/L）', value: this.form.supplementaryExaminationDto.bloodglucose },
            { label: '检查时间', value: this.form.supplementaryExaminationDto?.medPhepPoctEntity?.checkTime },
            { label: '报告时间', value: this.form.supplementaryExaminationDto?.medPhepPoctEntity?.reportTime },
            { label: 'TnT（' + this.form.supplementaryExaminationDto?.medPhepPoctEntity?.tntUnit + '）', value: this.form.supplementaryExaminationDto?.medPhepPoctEntity?.tnt },
            { label: 'TnI（' + this.form.supplementaryExaminationDto?.medPhepPoctEntity?.tnlUnit + '）', value: this.form.supplementaryExaminationDto.medPhepPoctEntity?.tnl }
          ]
        },
        {
          title: '专科评估',
          list: [
            { label: 'TI评估', value: this.form.supplementaryExaminationDto.tiScore },
            { label: 'GCS评估', value: this.form.supplementaryExaminationDto.gcsScore },
            { label: '胸痛评估', value: this.form.supplementaryExaminationDto.chestPainAssessment },
            { label: 'Killip分级', value: this.form.supplementaryExaminationDto.killip },
            { label: 'FAST评估', value: this.form.supplementaryExaminationDto.fastAssessment },
            { label: '其他检查', value: this.form.supplementaryExaminationDto.otherCheck }
          ]
        },
        {
          title: '诊断处理',
          list: [
            { label: '初步诊断', value: this.form.diagnosticProcessingDto?.diagnosis },
            { label: '病情判断', value: this.form.medicalRecordInfoDto.conditionGrade },
            { label: '急救措施', value: this.form.medPhepMeasuresEntityList },
            { label: '用药', value: this.form.diagnosticProcessingDto?.emergencyOrders },
            { label: '病情转归', value: this.form.medicalRecordInfoDto.rescueChangeResultName },
            { label: '出诊结果', value: this.form.medicalRecordInfoDto.treatmentResultName },
            { label: '送往医院', value: this.form.medicalRecordInfoDto.toHospitalName }
          ]
        }
      ]
    }
  },
  methods: {
    preview(val) {
      // 图片预览
      ImagePreview([val])
    },
    getDetails() {
      this.$api.getfirstAidList({
        emId: this.emId,
        hospitalId: this.hospitalId + '_' + this.hospitalArea
      }).then(res => {
        if (res.code === '000000') {
          if (res.body && Object.keys(res.body).length > 0) {
            this.emptData = false
            this.form = {
              ...this.form,
              ...res.body
            }
          } else {
            this.emptData = true
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.phfa {
  width: 98%;
  margin: 0 auto;

  font-weight: 700;
  font-size: 0.4rem;

  .content {
    margin: 0.2rem 0 0 0.4rem;
    color: black;
    font-size: 0.4rem;
    font-weight: 400;
  }
}
</style>
