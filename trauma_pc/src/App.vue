<template>
  <div id="app" @click="recordTime">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      timeOutVal: 45, // 设置页面超时时间
      interval: null,
      timeOutSign: true, // 开始超时标记
    };
  },
  methods: {
    timeOutToLogin() {
      // 判断是否超时
      let valB = parseInt(sessionStorage.getItem('PAGE_TIME_OUT'));
      if (valB) {
        let valA = new Date().getTime()
        if (parseInt((valA - valB) / 1000 / 60) > this.timeOutVal) {
          // 超时执行跳转登录页面
          this.logout()
        }
      } else {
        this.logout()
      }
    },
    recordTime() {
      sessionStorage.setItem('PAGE_TIME_OUT', new Date().getTime().toString());//更新操作时间
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      const ssoUrl = sessionStorage.getItem('ssoUrl')
      // 退出登录清除sessionStorage
      sessionStorage.clear()
      if (ssoUrl) {
        location.href = ssoUrl
      } else {
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      }
      if (this.interval) {
        clearInterval(this.interval)
        this.timeOutSign = true
      }
    }
  },
  watch: {
    '$route.path'(val) {
      if ((val === '/home' && this.timeOutSign)) {
        this.timeOutSign = false
        this.recordTime();
        // 用定时器监听是否长时间未操作
        this.interval = setInterval(() => {
          // 循环执行
          this.timeOutToLogin()
        }, 1000 * 60);
      }
      // 执行子窗口定时器
      if (['/patient-management/Edit', '/detailed'].includes(val)) {
        this.interval = setInterval(() => {
          let valB = parseInt(sessionStorage.getItem('PAGE_TIME_OUT'));
          if (valB) {
            let valA = new Date().getTime()
            if (parseInt((valA - valB) / 1000 / 60) > this.timeOutVal) {
              // 超时执行跳转登录页面
              this.logout()
              // 关闭子页面
              window.close()
            }
          } else {
            this.logout()
            // 关闭子页面
            window.close()
          }
        }, 1000 * 60);
      }
    },
  },
}
</script>

