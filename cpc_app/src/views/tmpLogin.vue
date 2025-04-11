<template>
  <div class="login">
    <h1>临时登录</h1>
    <div style="margin-top:40px;">
      <van-form>
        <van-field
          v-model="account.loginName"
          label="用户名"
          placeholder="请填写用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="account.password"
          type="password"
          label="密码"
          placeholder="请填写密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-form>
      <van-button @click="login" type="primary" size="large" block>
        登录
      </van-button>
    </div>
    <med-loading v-model="showLoading" />
    <!-- <van-field v-model="account" label="账号" placeholder="请输入账号" />
    <van-field v-model="passwd" label="密码" placeholder="请输入密码" /> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      account: {
        loginName: 'xh',
        password: 'Mdsd12345'
      },
      showLoading: false
    }
  },
  methods: {
    login() {
      this.showLoading = true
      this.$api.tmpLogin.login(this.account).then(res => {
        this.showLoading = false
        this.$router.push({
          name: 'document/index',
          query: {
            token: res.result.jwt_token
          },
          replace: true
        })
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
