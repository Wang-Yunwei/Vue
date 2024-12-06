<template>
  <el-card shadow="never" class="card">
    <el-descriptions :column="8" title="">
      <el-descriptions-item label="姓名">{{
        patientInfo.name
      }}</el-descriptions-item>
      <el-descriptions-item label="性别">{{
        value2Label(patientInfo.gender, dic.gender)
      }}</el-descriptions-item>
      <el-descriptions-item
        label="年龄"
      >{{ patientInfo.age
      }}{{
        value2Label(patientInfo.ageExtend, dic.ageType)
      }}</el-descriptions-item>
      <el-descriptions-item label="证件类型">
        {{ value2Label(patientInfo.cardType, dic.idCard) }}
      </el-descriptions-item>
      <el-descriptions-item label="证件号" :span="2">{{
        patientInfo.cardNo
      }}</el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>

<script>
import { dicConstant as dic } from '@/constant'
import { mapGetters } from 'vuex'

export default {
  name: 'BaseInfo',
  components: {},
  props: {
    detailData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dic
    }
  },
  computed: {
    ...mapGetters(['dictionary']),
    patientInfo() {
      const { medPhepPatientsEntity = {}} = this.detailData
      return medPhepPatientsEntity
    }
  },
  watch: {
    value: {
      handler(val) {
        this.regist = Object.assign({}, val)
      },
      deep: true,
      immediate: true
    }
  },
  async mounted() {},
  methods: {
    value2Label(value, dicType) {
      const list = this.dictionary[dicType] || []
      return list.find((d) => d.value === value)?.label
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  margin: 0 -20px;
  border: none;
}
.age-extend {
  width: 80px;
  margin: -10px -20px;
  ::v-deep div.el-select.el-select--small {
    margin: 0;
  }
}
</style>
