<template>
  <div>
    <div class="navbar">
      <hamburger
        v-if="menuInLeft"
        id="hamburger-container"
        :is-active="sidebar.opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
      />

      <headbar v-if="!menuInLeft" class="headbar-wrapper" style="width: 100%" />

      <div class="right-menu flex-c-b">
        <div style="color: rgb(68,79,219);">
          {{ userInfo.name }}
        </div>
        <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">

          <div class="avatar-wrapper">
            <img
              :src="
                userInfo.avatar ||
                  'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
              "
              class="user-avatar"
            >
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="logout">
              <span style="display: block">退出登录</span>
            </el-dropdown-item>
            <!-- <el-dropdown-item @click.native="goDic">
              <span style="display: block">字典列表</span>
            </el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Headbar from '@/layout/components/Headbar'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Headbar
  },
  computed: {
    ...mapGetters(['sidebar', 'userInfo', 'device']),
    ...mapState({
      menuInLeft: (state) => state.settings.menuInLeft
    })
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    goDic() {
      // 跳转字典列表(临时)
      this.$router.push(`/dictionary`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
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
        margin-top: 5px;
        position: relative;

        .user-avatar {
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
