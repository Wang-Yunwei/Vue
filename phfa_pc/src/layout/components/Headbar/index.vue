<template>
  <div class="headbar">
    <div class="logo-wrapper">
      <!-- <img :src="logo" alt="logo"> -->
      <!-- <el-divider direction="vertical" /> -->
      <!-- <img :src="badge" alt="badge"> -->
      <h1>{{ projectTitle }}</h1>
    </div>
    <el-menu mode="horizontal" :default-active="activeMenu" :background-color="variables.headMenuBg"
      :text-color="variables.headMenuText" :active-text-color="variables.headMenuActiveText">
      <sidebar-item v-for="route in permission_routes" :key="route.Name" :item="route" :base-path="route.path" />
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import variables from '@/assets/styles/variables.scss'

export default {
  name: 'Headbar',
  components: { SidebarItem },
  data() {
    return {
      logo: require('@/assets/images/headbar/logo1.png'),
      // badge: require('@/assets/images/headbar/logo_docare.png'),
      projectTitle:
        window.GLOBAL_APP_PROJECT_NAME ||
        process.env.VUE_APP_PROJECT_NAME ||
        '麦迪斯顿'
    }
  },
  computed: {
    ...mapGetters(['permission_routes', 'sidebar']),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style lang="scss">
.headbar {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 100%;

  .logo-wrapper {
    display: flex;
    align-items: center;
    margin-right: 30px;

    .el-divider {
      height: 44px;
      line-height: 50px;
    }

    img {
      // width: 150px;
      height: 44px;
      line-height: 50px;
    }

    h1 {
      font-size: 20px;
      padding-left: 10px;
      color: #444fdb;
      font-weight: 600;
      letter-spacing: 1.5px;
    }
  }

  .el-menu {
    // min-width: 880px;
    overflow-x: auto;
    display: flex;
    flex-wrap: nowrap;
  }
}
</style>
