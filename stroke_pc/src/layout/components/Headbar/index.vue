<template>
  <div class="headbar">
    <div class="logo-wrapper">
      <img :src="logo" alt="logo">
      <el-divider direction="vertical" />
      <img class="doCare" :src="badge" alt="badge">
      <h1>{{ projectTitle }}</h1><h3>{{ version }}</h3>
    </div>
    <el-menu
      mode="horizontal"
      :default-active="activeMenu"
      :background-color="variables.headMenuBg"
      :text-color="variables.headMenuText"
      :active-text-color="variables.headMenuActiveText"
    >
      <sidebar-item
        v-for="route in permission_routes"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
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
      logo: require('@/assets/images/headbar/logo.png'),
      badge: require('@/assets/images/headbar/logo_docare.png'),
      projectTitle:
        window.GLOBAL_APP_PROJECT_NAME ||
        process.env.VUE_APP_PROJECT_NAME ||
        '麦迪斯顿',
      version:
        window.GLOBAL_APP_VERSION ||
        process.env.GLOBAL_APP_VERSION ||
        'V1.0'
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
      height: 40px;
      line-height: 50px;
    }
    img {
      width: 150px;
      height: 40px;
      line-height: 50px;
    }
    .doCare {
      width: 74px;
      height: 23px;
      line-height: 50px;
    }
    h1 {
      font-size: 22px;
      margin: 3px 0 0 9px;
      line-height: 22px;
      color: rgb(68,79,219);
      font-weight: 500;
      letter-spacing: 0.24px;
    }
    h3 {
      font-size: 15px;
      margin: 11px 0 0 9px;
      line-height: 22px;
      color: rgb(68,79,219);
      font-weight: 500;
      letter-spacing: 0.24px;
    }
  }
  .el-menu {
    min-width: 880px;
    overflow-x: auto;
    display: flex;
    flex-wrap: nowrap;
  }
}
</style>
