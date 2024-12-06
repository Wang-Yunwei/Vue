<template>
  <div class="epidemiological-wrapper">
    <h2><center>新冠流调表</center></h2>
    <br>
    <el-form ref="form" :model="form" label-width="80px" label-position="top">
      <el-row :gutter="24">
        <el-col :span="6">
          <el-form-item
            label="姓名"
            prop="name"
            required
            :rules="[{ required: true, message: '请填写姓名' }]"
          >
            <el-input
              v-model="form.name"
              :readonly="readonly"
              size="mini"
              placeholder="姓名"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="体温℃"
            prop="t"
            required
            :rules="[{ required: true, message: '请填写体温' }]"
          >
            <el-input
              v-model="form.t"
              :readonly="readonly"
              size="mini"
              placeholder="体温"
            /> </el-form-item></el-col>
        <el-col :span="6">
          <el-form-item
            label="手机号"
            prop="tel"
            required
            :rules="[{ required: true, message: '请填写手机号' }]"
          >
            <el-input
              v-model="form.tel"
              :readonly="readonly"
              size="mini"
              placeholder="手机号码"
            /> </el-form-item></el-col>
        <el-col :span="6">
          <el-form-item
            label="身份证号"
            prop="cardNo"
            required
            :rules="[{ required: true, message: '请填写身份证号' }]"
          >
            <el-input
              v-model="form.cardNo"
              :readonly="readonly"
              size="mini"
              placeholder="身份证号"
            /> </el-form-item></el-col>
        <el-col :span="24">
          <el-form-item
            label="现住址"
            prop="fullAddress"
            required
            :rules="[{ required: true, message: '请填写详细住址' }]"
          >
            <el-input
              v-model="form.fullAddress"
              :readonly="readonly"
              size="mini"
              placeholder="现住址（精确到门牌号）"
            /> </el-form-item></el-col>
      </el-row>

      <div class="sub-title">
        1、最近14天内您是否有发热、干咳、乏力、鼻塞、流涕、咽痛、肌痛、结膜炎、腹泻、嗅觉味觉减退或丧失等症状？
        <br>
        <med-radio
          v-model="form.isFever"
          :readonly="readonly"
          :options="dictionary[dic.yesNo]"
        />
      </div>
      <div class="sub-title">
        2、您最近14天内是否接触过新冠确诊者，或无症状感染者，或密切接触者？
        <br>
        <med-radio
          v-model="form.isContact"
          :readonly="readonly"
          :options="dictionary[dic.yesNo]"
        />
      </div>
      <div class="sub-title">
        3、您最近14天内是否有中高风险地区，或其他有新冠肺炎病例报告社区的旅行史或居住史？
        <br>
        <med-radio
          v-model="form.isTravel"
          :readonly="readonly"
          :options="dictionary[dic.yesNo]"
        />
      </div>
      <div class="sub-title">
        4、您最近14天内是否有境外旅行史或居住史？
        <br>
        <med-radio
          v-model="form.isFtravel"
          :readonly="readonly"
          :options="dictionary[dic.yesNo]"
        />
      </div>
      <div class="sub-title">
        5、您的健康码状态 <br>
        <med-radio
          v-model="form.healthCode"
          :readonly="readonly"
          :options="dictionary[dic.healthCode]"
        />
      </div>
      <div class="sub-title">
        6、您的通信行程码状态
        <br>
        <med-radio
          v-model="form.tourCode"
          :readonly="readonly"
          :options="dictionary[dic.travelCode]"
        />
      </div>

      <div class="notice">
        1.如果您的体温≥37.3℃，或有咳嗽等呼吸道症状，或有腹泻的，或有不明原因乏力的，请您到发热门诊就诊；<br>
        2.所有患者到医院就诊时，请全程正确佩戴口罩，不要佩戴有呼吸阀的口罩；<br>
        3.请您配合填写流行病学调查表，根据《中国人民共和国传染病防治法》，请如实填写，不得瞒报、谎报
      </div>
      <div class="option">
        <el-checkbox v-model="form.isInformed" :disabled="readonly" />
        已知情同意
      </div>

      <div class="sign-box">
        流调人员签名:
        <med-sign
          v-model="form.ereservers"
          :disabled="readonly"
          :file-name="patientId + 'ereservers'"
          :business-id.sync="form.id"
          :file-type="8"
        />
      </div>
      <div class="sign-box">
        医护签名:
        <med-sign
          v-model="form.medicalWorkers"
          :disabled="readonly"
          :file-name="patientId + 'medicalWorkers'"
          :file-type="5"
          :business-id.sync="form.id"
        />
      </div>
    </el-form>
    <div v-if="!readonly" class="sub-title flex-c-c">
      <el-button icon="el-icon-printer">打印新冠流调表</el-button>
    </div>
  </div>
</template>

<script>
import { queryDetail, saveOrUpdate } from '@/api/epidemiological'
import MedSign from '@/components/MedSign'
import { mapGetters } from 'vuex'
import { dicConstant as dic } from '@/constant'

export default {
  name: 'Epidemiological',
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
    ...mapGetters(['dictionary', 'missionStatus']),
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
      const res = await queryDetail(this.patientId)
      const cleanDetail = this.clearNull(res.body || {})

      const { medPhepEpidemiologicalEntity = {}, medPhepPatientsEntity = {}} =
        cleanDetail
      this.medPhepPatientsEntity = medPhepPatientsEntity
      this.form = {
        ...medPhepEpidemiologicalEntity,
        name: medPhepPatientsEntity.name,
        cardNo: medPhepPatientsEntity.cardNo,
        isInformed: !!medPhepEpidemiologicalEntity.isInformed
      }
    },
    async onSave() {
      // 由外部提交按钮触发
      if (!this.form.isInformed) {
        this.$message.error('请勾选已知情同意')
        return
      }
      if (this.missionStatus !== '5') {
        this.form.isInformed = '1'
        this.form.patientId = this.patientId
        this.form.createTime = this.$moment().format('YYYY-MM-DD[T]HH:mm:ss')
        this.form.patientId = this.patientId

        const { name, cardNo, ...rest } = this.form
        const payload = {
          medPhepEpidemiologicalEntity: rest,
          medPhepPatientsEntity: {
            ...this.medPhepPatientsEntity,
            name: name,
            cardNo: cardNo
          }
        }
        const res = await saveOrUpdate(payload)
        if (res.code === '000000') {
          this.$message.success({
            type: 'success',
            message: '已成功提交新冠流调表'
          })
        }
      } else {
        this.$message.success({
          type: 'warning',
          message: '操作失败,病历已经提交!'
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.epidemiological-wrapper {
  //   width: 860px;
  border: 1px solid #ddd;
  padding: 10px 30px;
  .sub-title {
    font-size: 15px;
    margin-top: 25px;
    margin-bottom: 20px;
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
  .notice {
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
