<template>
  <div class="navbar">
    <hamburger
      v-if="menuInLeft"
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->

    <headbar v-if="!menuInLeft" class="headbar-wrapper" style="width: 100%" />

    <div class="right-menu">
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <span class="user-name">{{ info.name }}</span>
          <img
            :src="(userInfo && userInfo.avatar) || avatar"
            class="user-avatar"
          >
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="changePassword">
            <span style="display: block">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <change-password
      :visible.sync="showChangePass"
      :user-id="userInfo.id"
      @success="onChangeSuccess"
    />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Hamburger from '@/components/Hamburger'
import Headbar from '@/layout/components/Headbar'
import ChangePassword from './ChangePassword'
import storage from 'store'

let timer
export default {
  components: {
    // Breadcrumb,
    Hamburger,
    Headbar,
    ChangePassword
  },
  data() {
    return {
      avatar: require('@/assets/images/headbar/avatar.png'),
      info: JSON.parse(storage.get('SET_INFO')),
      showChangePass: false,
      successDialog: false
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'userInfo', 'device']),
    ...mapState({
      menuInLeft: (state) => state.settings.menuInLeft
    })
  },
  mounted() {},
  methods: {
    onChangeSuccess() {
      const quit = () => {
        clearInterval(timer)
        this.logout()
        const countEle = document.querySelector('.count-down')
        countEle.innerHTML = '5'
        this.$msgbox.close()
      }

      this.showChangePass = false
      this.$msgbox({
        title: '提示',
        message: `<span>密码修改成功! 将于<b class="count-down">5</b>秒后跳转登录页面</span>`,
        confirmButtonText: '跳转登录',
        dangerouslyUseHTMLString: true,
        showCancelButton: false,
        type: 'success',
        showClose: false,
        closeOnClickModal: false
      }).then(() => quit())

      timer = setInterval(() => {
        const countEle = document.querySelector('.count-down')
        if (!countEle) {
          return
        }
        const curCount = countEle.innerHTML
        if ((Number(curCount) || 0) - 1 <= 0) {
          quit()
        } else {
          countEle.innerHTML = `${(Number(curCount) || 0) - 1}`
        }
      }, 1000)
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    changePassword() {
      this.showChangePass = true
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
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

        .user-avatar {
          vertical-align: middle;
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
