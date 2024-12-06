<template>
  <div class="login">
    <h1>临时登录</h1>
    <div style="margin-top:40px;">
      <van-form>
        <van-field v-model="account.username" label="用户名" placeholder="请填写用户名" :rules="[{ required: true, message: '请填写用户名' }]" />
        <van-field v-model="account.password" type="password" label="密码" placeholder="请填写密码" :rules="[{ required: true, message: '请填写密码' }]" />
      </van-form>
      <van-button @click="login" type="primary" size="large" block>
        登录
      </van-button>
    </div>
    <med-loading v-model="showLoading" />
  </div>
</template>

<script>
import { getAuthToken } from '@/api/authority'
export default {
  data() {
    return {
      account: {
        username: 'admin',
        password: 'admin'
      },
      showLoading: false
    }
  },
  methods: {
    async login() {
      this.showLoading = true
      getAuthToken(this.account).then(res => {
        this.showLoading = false
        if (res.code === '000000') {
          this.$router.push({
            name: 'document',
            query: {
              token: res.body.jwt_token
            },
            // 替换路由：当导航到相同路径但不同参数的路由时，会替换掉当前的路由记录而不是添加到历史记录中。
            replace: true
          })
        }
      }).catch(() => {
        this.showLoading = false
      })
    }
  }
}
</script>

<style lang="less">
.login {
  text-align: center;
  padding: 100px 20px;

  h1 {
    font-size: 80px;
    font-weight: bold;
  }

  .van-button {
    margin: 40px 0;
  }
}
</style>
