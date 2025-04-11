<template>
  <div class="timeline">
    <div v-if="basicInfo !== null" class="patient">
      <el-row>
        <el-col :span="6">
          <div>患者姓名 :</div>
          <span>{{ basicInfo.regist.name }}</span>
        </el-col>
        <el-col :span="6">
          <div>患者性别 :</div>
          <span>{{ basicInfo.regist.gender | convert(dictionary.genderDict) }}</span>
        </el-col>
        <el-col :span="6">
          <div>患者年龄 :</div>
          <span>{{ basicInfo.regist.age }}</span>
        </el-col>
        <el-col :span="6">
          <div>联系方式 :</div>
          <span>{{ basicInfo.regist.phoneNumber }}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div>诊断 :</div>
          <span>{{ basicInfo.inspection.diagnosis | convert(dictionary.diagnosisDict) }}</span>
        </el-col>
        <el-col :span="6">
          <div>门诊号 :</div>
          <span>{{ basicInfo.main.outPatientNo }}</span>
        </el-col>
        <el-col :span="6">
          <div>住院号 :</div>
          <span>{{ basicInfo.main.admissionNo }}</span>
        </el-col>
        <el-col :span="6">
          <div>接诊时间 :</div>
          <span>{{ basicInfo.admission.admissionTime }}</span>
        </el-col>
      </el-row>
    </div>
    <timeline :id="registId" />
  </div>
</template>

<script>
import timeline from '../timeline/timelinex'
import { getPatientInfo } from '@/api/patient/edit'
import { mapGetters } from 'vuex'
export default {
  components: {
    timeline
  },
  props: {
    registId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      basicInfo: null
    }
  },
  computed: {
    ...mapGetters([
      'dictionary'
    ])
  },
  mounted() {
    this.getBasicInfo()
  },
  methods: {
    async getBasicInfo() {
      const { result } = await getPatientInfo({ registid: this.registId })
      console.log(result)
      this.basicInfo = result || {}
    }
  }
}
</script>

<style>
.timeline .el-col div {
    width:70px;
    display:inline-block;
    line-height: 28px;
}

.timeline .description  {
    margin:0 30px 20px 30px;
}
.timeline .patient{
  padding:14px 8px;
  border-bottom: 1px solid #ddd;
  /* border-top: 1px solid #ddd; */
  margin-top:-28px;
}
.timeline .description {
    height:0px;
    padding:5px 0 5px 0
}

.timeline .patient label {
    width:120px;
}
</style>
