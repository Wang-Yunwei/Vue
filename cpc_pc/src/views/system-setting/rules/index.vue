<template>
  <div>
    <el-tabs style="height:100%">
      <el-tab-pane label="药物">
        <antiplatelet />
        <div class="divider" />
        <medicine />
        <div class="divider" />
        <anticoagulation />
        <div class="divider" />
        <dischargemed />
      </el-tab-pane>
      <el-tab-pane label="检查检验">
        <inspect />
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import antiplatelet from './antiplateletSetting'
import inspect from './inspectionSetting'
import medicine from './medicineInHosSetting'
import anticoagulation from './anticoagulationSetting'
import dischargemed from './dischargeMedicationSetting'
export default {
  name: 'DefaultSetting',
  components: {
    antiplatelet,
    inspect,
    medicine,
    anticoagulation,
    dischargemed
  }
}
</script>

<style lang="sass" scoped>
.divider
  margin: 20px 0
</style>
