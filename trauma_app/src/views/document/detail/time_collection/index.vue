<template>
  <div>
    <div v-if="!auth_phfa && !auth_piat && !auth_inspection && !auth_hdat">
      <van-empty description="未授权或无填写数据" :image="require('@assets/image/empty.png')" />
    </div>
    <van-tabs v-model="active" swipeable color="#333bd2" v-else>
      <van-tab title="院前" v-if="['01', '02'].includes(visitType) && auth_phfa">
        <div class="scroll-box">
          <perHospital @update="updateTimeAxis" />
        </div>
      </van-tab>
      <van-tab title="分检诊" v-if="auth_piat || auth_inspection">
        <div class="scroll-box">
          <detection @update="updateTimeAxis" />
        </div>
      </van-tab>
      <van-tab title="治疗" v-if="auth_hdat">
        <div class="scroll-box">
          <cure @update="updateTimeAxis" />
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import perHospital from './perHospital.vue'
import detection from './detection.vue'
import cure from './cure.vue'
import { mapGetters } from 'vuex'
export default {
  components: { perHospital, detection, cure },
  data() {
    return {
      active: 0
    }
  },
  computed: {
    ...mapGetters(['registId', 'visitType', 'loginUserInfo']),
    auth_phfa() {
      // 权限控制 - 病历编辑 - 院前急救 sign = trauma-mr-firstaid
      return this.loginUserInfo?.resources?.filter(el => el.sign === 'trauma-mr-firstaid').length > 0
    },
    auth_piat() {
      // 权限控制 - 病历编辑 - 预检分诊 sign = trauma-mr-triage
      return this.loginUserInfo?.resources?.filter(el => el.sign === 'trauma-mr-triage').length > 0
    },
    auth_inspection() {
      // 权限控制 - 病历编辑 - 检验检查 sign = trauma-mr-inspection
      return this.loginUserInfo?.resources?.filter(el => el.sign === 'trauma-mr-inspection').length > 0
    },
    auth_hdat() {
      // 权限控制 - 病历编辑 - 院内诊疗 sign = trauma-mr-treatment
      return this.loginUserInfo?.resources?.filter(el => el.sign === 'trauma-mr-treatment').length > 0
    }
  },
  methods: {
    updateTimeAxis(val) {
      // 更新时间采集
      if (val && Object.keys(val).length > 0) {
        val.registId = this.registId
        this.$api.updateTimeAxis(val)
      }
    }
  },
  watch: {
    visitType() {
      this.active = 0
    }
  }
}
</script>

<style lang="less" scoped>
.scroll-box {
  height: calc(100vh - 7rem);
  overflow: auto;
}
</style>
