<template>
  <div class="navbar">
    <hamburger v-if="menuInLeft" id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <headbar v-if="!menuInLeft" class="headbar-wrapper" style="width: 100%" />
    <div class="right-menu">
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <span class="user-name">{{ info.name }}</span>
          <el-avatar style="vertical-align: middle;" :src="avatar" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="dialogVisible = true">
            <span style="display: block">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogVisible" width="25%" :close-on-click-modal="false" :before-close="(done) => done()">
      <el-form ref="form" :model="form" label-width="auto" label-position="top" hide-required-asterisk>
        <el-form-item label="旧密码" prop="old" autocomplete="off" :rules="[{ required: true, message: '请输入旧密码' }]">
          <el-input v-model="form.old" show-password />
        </el-form-item>
        <el-form-item prop="password" :rules="[{ validator: validateNewPassword, trigger: 'input' }]">
          <template #label>
            <div>
              <span>新密码</span>
              <span class="tip">
                <i class="el-icon-warning-outline" />
                密码由大写字母、小写字母和数字组成，长度为8~16位</span>
            </div>
          </template>
          <el-input v-model="form.password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword" autocomplete="off" :rules="[{ validator: validateConfirmPassword, trigger: 'blur' }]">
          <el-input v-model="form.confirmPassword" show-password />
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" style="width: 100%" @click="changePassword">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Hamburger from '@/components/Hamburger'
import Headbar from '@/layout/components/Headbar'
import storage from 'store'
import { AuthorityMixin } from '@/mixins/index'

export default {
  components: {
    Hamburger,
    Headbar
  },
  mixins: [AuthorityMixin],
  data() {
    return {
      form: {},
      dialogVisible: false,
      info: JSON.parse(storage.get('SET_INFO'))
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'userInfo', 'device']),
    ...mapState({
      menuInLeft: (state) => state.settings.menuInLeft
    }),
    avatar() {
      return this.userInfo && this.userInfo.avatar
        ? this.userInfo.avatar
        : require('@/assets/images/headbar/avatar.png')
    }
  },
  methods: {
    changePassword() {
      // 修改密码
      this.$refs.form.validate((valid, error) => {
        if (valid) {
          this.$confirm('确定要修改密码吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
          })
            .then(() => {
              this.$api
                .changePassword({
                  ...this.form,
                  id: this.loginUserInfo.user.id
                })
                .then((res) => {
                  if (res.code === '000000') {
                    // 修改成功,设置倒计时退出登录
                    let countdown = 6
                    const msg = `密码修改成功！将于${countdown}秒后跳转登录页面`
                    const time = setInterval(() => {
                      countdown--
                      document.getElementById('timed').innerHTML = countdown
                      if (countdown <= 0) {
                        // 退出登录并清除记时间器
                        this.$msgbox.close()

                        this.logout()
                        clearInterval(time)
                      }
                    }, 1000)
                    this.$confirm(
                      `<p>密码修改成功！将于<span id='timed'>6</span>秒后跳转登录页面</p>`,
                      '提示',
                      {
                        confirmButtonText: '跳转登录',
                        type: 'success',
                        showClose: false,
                        showCancelButton: false,
                        dangerouslyUseHTMLString: true
                      }
                    ).then(() => {
                      // 直接跳转到登录页面
                      this.logout()
                    })
                  }
                })
            })
            .catch(() => { })
        } else {
          return false
        }
      })
    },
    validateNewPassword(rule, value, callback) {
      // 校验新密码
      const regex = new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{8,16}')
      if (!regex.test(value)) {
        callback(new Error('请输入符合规则的密码'))
      } else if (value === this.form.old) {
        callback(new Error('新密码不能和旧密码一致'))
      } else {
        if (this.form.confirmPassword !== '') {
          this.$refs.form.validateField('confirmPassword')
        }
        callback()
      }
    },
    validateConfirmPassword(rule, value, callback) {
      // 校验确认密码
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
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
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    position: absolute;
    top: 0;
    right: 0;

    &:focus {
      outline: none;
    }

    display: flex;
    align-items: center;

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #fff;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;
        height: 50px;

        .user-name {
          color: rgb(68, 79, 219);
          vertical-align: middle;
          margin-right: 6px;
        }
      }
    }
  }

  .tip {
    padding-left: 4px;
    font-weight: normal;
    font-size: 12px;
    color: rgb(255, 137, 94);
  }
}
</style>
