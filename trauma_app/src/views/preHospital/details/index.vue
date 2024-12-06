<template>
  <div>
    <med-header :title="title[source]" @backClick="goBack" />
    <div style="margin-top: 0.4rem;">
      <phfa v-if="source === 'phep'" :dto="dto" />
      <piat v-if="source === 'piat'" :dto="dto" />
    </div>
    <div class="footer-button">
      <van-button type="info" size="large" @click="putOnRecord" color="rgb(51,59,210)" round style="width: 80%;height: 90%;">
        建档
      </van-button>
    </div>
    <add-patient v-model="isShowAddPatient" :isShow="isShowAddPatient" :data="addPatientForm" @close="isShowAddPatient = false" />
  </div>
</template>

<script>
import addPatient from '@/views/document/list/add/addPatient'
import phfa from './phfa'
import piat from './piat'
export default {
  components: { addPatient, phfa, piat },
  data() {
    return {
      archiving: false,
      isShowPhfa: true,
      isShowPiat: true,
      isShowAddPatient: false,
      addPatientForm: {},
      title: { phep: '急救病历', piat: '预检分诊' }
    }
  },
  computed: {
    source() {
      return this.$route.query.source
    },
    dto() {
      const result = {
        hospitalId: this.$route.query.toHospital,
        relationId: this.$route.query.relationId
      }
      return result
    }
  },
  methods: {
    putOnRecord() {
      // 验证患者是否已经建档
      this.$api.getPatientBaseInfo({
        relationId: this.$route.query.relationId,
        type: this.$route.query.source === 'phep' ? '1' : '2'
      }).then(res => {
        if (res.code === '000000') {
          // 建档
          this.addPatientForm = {
            ...res.body,
            isPush: 1
          }
          this.isShowAddPatient = true
        }
      }).catch(err => {
        this.$toast(err.response.data.message)
      })
    },

    archivingButt() {
      // 验证患者是否已经建档
      this.$api.checkExistByEmId({
        relationId: this.$route.query.relationId,
        type: this.$route.query.source === 'phep' ? '1' : '2'
      }).then(res => {
        if (res.code === '000000') {
          // 建档
          this.addPatientForm = this.$route.query
          this.addPatientForm.isPush = 1
          this.isShowAddPatient = true
        }
      }).catch(err => {
        this.$toast(err.response.data.message)
      })
    },
    goBack() {
      // 向后跳转一个页面
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
.footer-button {
  background-color: white;
  position: fixed;
  bottom: 0.01rem;
  width: 100%;
  height: 1.32rem;
  z-index: 2;
  text-align: center;
}
</style>
