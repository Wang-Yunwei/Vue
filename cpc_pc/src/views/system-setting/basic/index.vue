<template>
  <div>
    <el-tabs style="height:100%">
      <el-tab-pane label="网络医院">
        <networkhospital />
      </el-tab-pane>
      <el-tab-pane label="医护人员">
        <medicalworkers />
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import networkhospital from './networkHospitalSetting'
import medicalworkers from './medicalWorkersSetting'
export default {
  name: 'BasicSetting',
  components: {
    networkhospital,
    medicalworkers
  }
}
</script>

<style lang="sass" scoped>
.divider
  margin: 20px 0
</style>
