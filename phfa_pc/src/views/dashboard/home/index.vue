<template>
  <div class="home">
    <el-row>
      <el-col :span="12">
        <RegionalAnalysis />
      </el-col>
      <el-col :span="12">
        <DiseaseClassification />
      </el-col>
    </el-row>
    <patient-trends />
  </div>
</template>

<script>
import PatientTrends from './patientTrends.vue'
import RegionalAnalysis from '../regionalAnalysis/chart.vue'
import DiseaseClassification from '../diseaseClassification/chart.vue'
export default {
  components: {
    PatientTrends,
    RegionalAnalysis,
    DiseaseClassification
  }
}
</script>

<style lang="scss" scoped>
.home {
  padding: 20px;
}
</style>
