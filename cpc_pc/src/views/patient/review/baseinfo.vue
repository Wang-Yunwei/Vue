<template>
  <div>
    <el-descriptions :column="4">
      <el-descriptions-item label="姓名">{{
        patientInfo.name
      }}</el-descriptions-item>
      <el-descriptions-item label="身份证号">{{
        patientInfo.identificationNo
      }}</el-descriptions-item>
      <el-descriptions-item label="性别">{{
        parseDic(patientInfo.gender, dictionary.genderDict)
      }}</el-descriptions-item>
      <el-descriptions-item label="出生日期">
        {{ patientInfo.birthday | dateFormater }}
      </el-descriptions-item>
      <el-descriptions-item label="年龄">{{
        patientInfo.age
      }}</el-descriptions-item>
      <el-descriptions-item label="联系电话">{{
        patientInfo.phoneNumber
      }}</el-descriptions-item>
      <el-descriptions-item label="来院方式">{{
        parseDic(patientInfo.comeType, dictionary.comingDict)
      }}</el-descriptions-item>
      <el-descriptions-item label="民族">{{
        parseDic(patientInfo.nationality, dictionary.nationalityDict)
      }}</el-descriptions-item>
      <!-- <el-descriptions-item label="紧急联系人">{{
        parseDic(patientInfo.ecName, dictionary.nationOpts)
      }}</el-descriptions-item>
      <el-descriptions-item label="紧急联系人与患者关系">{{
        parseDic(patientInfo.ecType, dictionary.urgentTypeOpts)
      }}</el-descriptions-item> -->
      <el-descriptions-item label="院区">{{
        parseDic(patientInfo.hospitalArea, hospitalArea)
      }}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import storage from 'store'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'BaseInfo',
  filters: {
    dateFormater(val) {
      if (moment(val).isValid()) { return moment(val).format('YYYY-MM-DD') }
      return ''
    }
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      patientInfo: {
        name: '',
        age: null,
        gender: '',
        comingType: '',
        patientId: '',
        registId: '',
        regNo: '',
        outPatientNo: '', // 门诊号
        admissionNo: '',
        hospitalArea: '',
        // 1:手工创建
        cometype: '1',
        createTime: '',
        createName: 'adminx',
        // 院前任务号
        firstaidNo: '',
        idcardType: '1', // 证件类别
        identificationCard: '',
        birthday: '',
        nation: '',
        ecName: '',
        ecType: '',
        ecPhone: '',
        status: ''
      },
      dic: storage.get('DICTIONARY')
    }
  },
  computed: {
    ...mapGetters(['hospitalArea', 'dictionary'])
  },
  mounted() {
    this.patientInfo = { ...this.patientInfo, ...this.info }
    this.comingTypeChange()
  },
  methods: {
    parseDic(val, dicList) {
      const list = dicList || []
      return list.find((el) => el.value === val)?.label || ''
    },
    comingTypeChange() {
      this.$emit('comingTypeChange', this.patientInfo.comeType)
    }
  }
}
</script>
