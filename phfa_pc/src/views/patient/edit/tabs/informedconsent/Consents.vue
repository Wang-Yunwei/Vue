<template>
  <div class="consents-wrapper">
    <h2><center>患者知情同意书</center></h2>
    <br>
    <el-form ref="form" :model="form" label-width="90px" label-position="top">
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item
            label="患者姓名"
            prop="name"
            required
            :rules="[{ required: true, message: '请填写姓名' }]"
            style="flex: 1 1 25%"
          >
            <el-input
              v-model="form.name"
              :readonly="readonly"
              size="mini"
              placeholder="患者姓名"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="性别"
            prop="gender"
            required
            :rules="[{ required: true, message: '请选择性别' }]"
            style="flex: 1 1 25%"
          >
            <med-radio
              v-model="form.gender"
              :readonly="readonly"
              size="mini"
              :options="dictionary[dic.gender]"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="年龄" prop="age" required style="flex: 1 1 20%">
            <age-input
              v-model="form.age"
              :readonly="readonly"
              size="mini"
              :age-extend.sync="form.ageExtend"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item
            label="初步诊断"
            prop="diagnosis"
            required
            :rules="[{ required: true, message: '请填写初步诊断' }]"
            style="flex: 1 1 30%"
          >
            <diagnosis-input
              v-model="form.diagnosis"
              :readonly="readonly"
              size="mini"
              placeholder="初步诊断"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="告知时间" prop="tellTime" style="flex: 1 1 25%">
            <el-date-picker
              v-model="form.tellTime"
              size="mini"
              :readonly="readonly"
              type="datetime"
              placeholder="选择时间"
              value-format="yyyy-MM-dd[T]HH:mm:ss"
              format="yyyy-MM-dd HH:mm"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="病情判断"
            prop="conditionGrade"
            style="flex: 1 1 75%"
          >
            <med-select
              v-model="form.conditionGrade"
              size="mini"
              :readonly="readonly"
              :options="dictionary[dic.conditionJudgment]"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <div class="sub-title">患者及家属意愿：</div>
      <div>
        <el-checkbox-group v-model="form.patientRequest" :readonly="readonly">
          <div class="option">
            <el-checkbox label="1">{{ '' }}</el-checkbox> 1、现场救治；
          </div>
          <div class="option">
            <el-checkbox label="2">{{ '' }}</el-checkbox> 2、送往<med-select
              v-model="form.toHospital"
              :readonly="readonly"
              size="mini"
              :options="hospitalAreaList"
              class="inline-select"
              @select="onHospitalChange"
            />医院救治
          </div>
          <div class="option">
            <el-checkbox label="3">{{ '' }}</el-checkbox> 3、不同意现场救治；
          </div>
          <div class="option">
            <el-checkbox label="4">{{ '' }}</el-checkbox>
            4、不同意送往医院治疗；
          </div>
          <div class="option">
            <el-checkbox label="5">{{ '' }}</el-checkbox>
            5、不同意运送过程中采取的<el-input
              v-model="form.treatmentMeasures"
              size="mini"
              :readonly="readonly"
              class="inline-select"
            />救治措施;
          </div>
          <div class="option">
            <el-checkbox label="6">{{ '' }}</el-checkbox> 6、其他：<el-input
              v-model="form.patientRequestOther"
              :readonly="readonly"
              size="mini"
              class="inline-select"
            />
          </div>
        </el-checkbox-group>
      </div>

      <div class="sub-title">可能出现的风险：</div>
      <div class="risks">
        1、运送途中因病情危重随时可能出现原有疾病加重诱发多器官病变甚至死亡；<br>
        2、运送途中因交通、天气等不可抗拒因素可能延误治疗；<br>
        3、本着救死扶伤的原则、尽其所能施救，因疾病变化是一个动态过程及存在个体差异、不对救治期望作任何保证；<br>
        4、许多抢救操作为有创操作有可能出现副损伤，搬运、转运途中有可能出现病情变化甚至死亡；<br>
        5、其它不可预料的意外。
      </div>
      <div class="option">
        <el-checkbox v-model="form.isInformed" :disabled="readonly" />
        已知情同意
      </div>
      <div class="sign-box">
        患者签名:
        <med-sign
          v-model="form.patientSignagure"
          :disabled="readonly"
          :file-name="patientId + 'patientSignagure'"
          :business-id.sync="form.id"
          :file-type="6"
          @change="onSignChange('patientSignagure', $event)"
        />
      </div>
      <div class="sign-box">
        委托人签名:
        <med-sign
          v-model="form.consignorSignagure"
          :disabled="readonly"
          :file-name="patientId + 'consignorSignagure'"
          :business-id.sync="form.id"
          :file-type="7"
          @change="onSignChange('consignorSignagure', $event)"
        />
        与患者关系:<el-input
          v-model="form.patientRelationship"
          :readonly="readonly"
          size="mini"
          class="inline-select"
        />
      </div>
      <div class="sign-box">
        医护签名:
        <med-sign
          v-model="form.hospitalSignagure"
          :disabled="readonly"
          :file-name="patientId + 'hospitalSignagure'"
          :business-id.sync="form.id"
          :file-type="4"
          @change="onSignChange('hospitalSignagure', $event)"
        />
      </div>
    </el-form>
    <div v-if="!readonly" class="sub-title flex-c-c">
      <el-button icon="el-icon-printer">打印知情同意书</el-button>
    </div>
  </div>
</template>

<script>
import { queryConsentsDetail, saveOrUpdate } from '@/api/consents'
import MedSign from '@/components/MedSign'
import { mapGetters } from 'vuex'
import { dicConstant as dic } from '@/constant'
export default {
  components: {
    MedSign
  },
  props: {
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dic,
      form: { patientRequest: [] },
      medPhepPatientsEntity: {}
    }
  },
  computed: {
    ...mapGetters(['dictionary', 'hospitalAreaList']),
    patientId() {
      return this.$route.query.patientId
    },
    missionId() {
      return this.$route.query.missionId
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    onHospitalChange(ele) {
      this.form.toHospitalName = ele.label
    },
    parseGender(v) {
      const opts = this.dictionary[this.dic.gender] || []
      return opts.find((o) => o.value === v)?.label || '未知'
    },
    parseAgeExtend(v) {
      const opts = this.dictionary[this.dic.ageType] || []
      return opts.find((o) => o.value === v)?.label || ''
    },
    onSignChange(name, url) {
      // 签名时间设置
      this.form[name + 'Time'] = this.$moment().format('YYYY-MM-DD[T]HH:mm:ss')
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
    async getDetail() {
      // 获取同意书详情
      const res = await queryConsentsDetail(this.patientId)
      const cleanDetail = this.clearNull(res.body || {})

      const {
        medPhepPatientsEntity = {},
        medPhepConsentsEntity = {},
        medPhepMedicalRecordsEntity = {}
      } = cleanDetail
      this.medPhepPatientsEntity = medPhepPatientsEntity
      this.form = {
        ...medPhepConsentsEntity,
        age: medPhepPatientsEntity.age,
        ageExtend: medPhepPatientsEntity.ageExtend,
        gender: medPhepPatientsEntity.gender,
        missionId: this.missionId,
        name: medPhepPatientsEntity.name,
        patientId: this.patientId,
        isInformed: !!medPhepConsentsEntity.isInformed,
        patientRequest: (medPhepConsentsEntity.patientRequest || '').split('|'),
        toHospital: medPhepMedicalRecordsEntity.toHospital
      }
    },
    async onSave() {
      // 由外部提交按钮触发
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          if (!this.form.isInformed) {
            this.$message.error('请勾选已知情同意')
            return
          }

          const payload = {
            medPhepConsentsEntity: {
              conditionGrade: this.form.conditionGrade, // 病情判断
              consignorSignagure: this.form.consignorSignagure, // 委托人签名
              consignorSignagureTime: this.form.consignorSignagureTime,
              diagnosis: this.form.diagnosis, // 初步诊断
              hospitalSignagure: this.form.hospitalSignagure, // 医护签名
              hospitalSignagureTime: this.form.hospitalSignagureTime,
              id: this.form.id,
              isInformed: '1', // 已知情同意
              missionId: this.missionId,
              patientId: this.patientId,
              patientRelationship: this.form.patientRelationship, // 与患者关系
              patientRequest: (this.form.patientRequest || []).join('|'), // 患者及家属意愿
              patientRequestOther: this.form.patientRequestOther,
              patientSignagure: this.form.patientSignagure, // 患者签名
              patientSignagureTime: this.form.patientSignagureTime,
              tellTime: this.form.tellTime, // 告知时间
              treatmentMeasures: this.form.treatmentMeasures // 救治措施
            },
            medPhepMedicalRecordsEntity: {
              diagnosis: this.form.diagnosis,
              patientId: this.patientId,
              toHospital: this.form.toHospital, // 送往医院
              toHospitalName: this.form.toHospitalName // 送往医院名称
            },
            medPhepPatientsEntity: {
              ...this.medPhepPatientsEntity,
              age: this.form.age,
              ageExtend: this.form.ageExtend,
              gender: this.form.gender,
              missionId: this.missionId,
              name: this.form.name,
              patientId: this.patientId
            }
          }
          const res = await saveOrUpdate(payload)
          if (res.code === '000000') {
            this.$message.success('保存成功!')
          } else {
            this.$message.error('保存失败!' + res.message)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.consents-wrapper {
  //   width: 860px;
  border: 1px solid #ddd;
  padding: 10px 30px;
  .sub-title {
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .sign-box {
    margin-top: 20px;
    font-size: 14px;
  }
  .option {
    line-height: 2.6;
    font-size: 14px;
  }
  .inline-select {
    display: inline-block;
    width: 280px;
    margin-left: 5px;
    margin-right: 5px;
    ::v-deep .el-input__inner {
      font-size: 14px;
      color: #000;
    }
  }
  .risks {
    font-size: 14px;
    line-height: 2;
    padding: 10px;
    border: 1px solid #ddd;
    color: rgb(255, 132, 0);
  }
  ::v-deep .el-checkbox__inner {
    width: 16px;
    height: 16px;
    &::after {
      height: 9px;
      left: 5px;
    }
  }
}
</style>
