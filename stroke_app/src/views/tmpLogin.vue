<template>
  <div class="login">
    <h1>临时登录</h1>
    <van-field v-model="account" label="账号" placeholder="请输入账号" @focus="selectText" />
    <van-field v-model="passwd" label="密码" placeholder="请输入密码" @focus="selectText" @keydown.enter="login"/>
    <van-button @click="login" type="primary" size="large" block>
      登录
    </van-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      account: 'xh',
      passwd: 'Mdsd12345'
    }
  },
  methods: {
    selectText(e) {
      if (e.target?.select) {
        e.target.select()
      }
    },
    login() {
      this.$api.auth
        .loginByPassword({
          username: this.account,
          password: this.passwd
        })
        .then(({ result }) => {
          const token = result.jwt_token
          if (!token) {
            this.$toast('获取token失败')
            return
          }
          this.$router.push({
            name: 'fileList',
            query: {
              token: token
            },
            replace: true
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
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
  /deep/ .van-field__control::selection{
    background-color: rgb(51, 144, 255);
    color:#fff
  }
}
</style>
