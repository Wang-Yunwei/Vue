<template>
  <div>
    <el-descriptions :column="4">
      <el-descriptions-item label="姓名">{{
        gc.patientInfo.name
      }}</el-descriptions-item>
      <el-descriptions-item label="身份证号">{{
        gc.patientInfo.identificationCard
      }}</el-descriptions-item>
      <el-descriptions-item label="性别">{{
        parseDic(gc.patientInfo.gender, dic.gender)
      }}</el-descriptions-item>
      <el-descriptions-item label="出生日期">
        {{ gc.patientInfo.birthday }}
      </el-descriptions-item>
      <el-descriptions-item label="年龄">{{
        gc.patientInfo.age
      }}</el-descriptions-item>
      <el-descriptions-item label="联系电话">{{
        gc.patientInfo.ecPhone
      }}</el-descriptions-item>
      <el-descriptions-item label="来院方式">{{
        parseDic(gc.patientInfo.comingType, dic.comingType)
      }}</el-descriptions-item>
      <el-descriptions-item label="民族">{{
        parseDic(gc.patientInfo.nation, dic.strokeNation)
      }}</el-descriptions-item>
      <el-descriptions-item label="紧急联系人">{{
        parseDic(gc.patientInfo.ecName, dic.strokeNation)
      }}</el-descriptions-item>
      <el-descriptions-item label="紧急联系人与患者关系">{{
        parseDic(gc.patientInfo.ecType, dic.urgentType)
      }}</el-descriptions-item>
      <el-descriptions-item label="院区">{{
        parseDic(gc.patientInfo.hospitalArea, hospitalArea)
      }}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import { Gc } from '@/model/commonModel'
import storage from 'store'
import { mapGetters } from 'vuex'

export default {
  name: 'BaseInfo',
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      gc: { patientInfo: { ...Gc() }},
      dic: storage.get('dicData')
    }
  },
  computed: {
    ...mapGetters(['hospitalArea'])
  },
  mounted() {
    this.gc.patientInfo = { ...this.gc.patientInfo, ...this.info }
    this.comingTypeChange()
  },
  methods: {
    parseDic(val, dicList) {
      const list = dicList || []
      return list.find((el) => el.value === val)?.label || ''
    },
    comingTypeChange() {
      this.$emit('comingTypeChange', this.gc.patientInfo.comingType)
    }
  }
}
</script>
