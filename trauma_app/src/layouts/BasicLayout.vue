<template>
  <div class="med-global-layout-wrapper">
    <med-header @backClick="goBback">
      <template #title>
        <span>创伤档案</span>
        <div style="max-width: 1.95rem;height: 0.4rem;">
          <med-select v-if="!$route.path.includes('prehospital')" class="hospital-area" v-model="curHospitalArea" :options="hospitalAreaList"></med-select>
        </div>
      </template>
    </med-header>
    <div class="container">
      <router-view />
    </div>
    <van-tabbar route v-if="!/\/document\/detail/.test(this.$route.path)">
      <van-tabbar-item to="/document">
        <template #icon="props">
          <med-svg icon-class="iconlvtong-bingli" />
        </template>
        档案
      </van-tabbar-item>
      <van-tabbar-item to="/prehospital" v-if="auth_push">
        <template #icon="props">
          <med-svg icon-class="iconlvtong-tuisong" />
        </template>
        推送
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
import * as types from '@/store/mutations-types'
import { mapGetters, mapMutations } from 'vuex'
const IS_PROD = process.env.NODE_ENV === 'production'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['hospitalArea', 'hospitalAreaList', 'loginUserInfo']),
    auth_push() {
      // 权限控制 - 推送 sign = trauma-list-transfer
      return this.loginUserInfo?.resources?.filter(el => el.sign === 'trauma-list-transfer').length > 0
    },
    curHospitalArea: {
      // 当前院区
      get() {
        return this.hospitalArea
      },
      set(v) {
        this[types.SET_HOSPITAL_AREA](v)
      }
    }
  },
  methods: {
    ...mapMutations([types.SET_HOSPITAL_AREA]),
    goBback() {
      this.$dialog.confirm({ title: '提示', message: `确定要退出创伤中心?`, confirmButtonColor: 'rgb(94,116,254)' }).then(() => {
        if (!IS_PROD) {
          localStorage.clear()
          this.$router.push('/login')
        }
        this.$bridge.exit()
      }).catch(() => { })
    }
  }
}
</script>

<style lang="less" scoped>
@import "@/assets/styles/common/layouts/wrapper.less";

.hospital-area {
  /deep/ div.med-select-value {
    color: #fff;
    font-size: 0.36rem;
  }

  /deep/ .med-select-arrow .van-icon-arrow-down {
    color: #fff;
  }
}

.container {
  padding-top: 1.9rem;
}
</style>
