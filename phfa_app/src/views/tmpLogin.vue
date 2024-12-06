<template>
  <div class="login">
    <h1>临时登录</h1>
    <van-field v-model="form.username" label="账号" placeholder="请输入账号" />
    <van-field v-model="form.password" label="密码" placeholder="请输入密码" />
    <van-button @click="login" type="primary" size="large" block>
      登录
    </van-button>
  </div>
</template>

<script>
import { getAuthToken } from '@/api/tmpLogin'
export default {
  data() {
    return {
      form: {
        username: 'xh',
        password: 'Mdsd12345'
      }
    }
  },
  methods: {
    login() {
      getAuthToken(this.form).then(res => {
        const { jwt_token } = res.body
        this.$router.push({
          name: 'aid',
          query: {
            token: jwt_token
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
    margin: 100px 0;
  }
}
</style>
