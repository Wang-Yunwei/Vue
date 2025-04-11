<template>
  <div class="med-setting-wrapper">
    <el-container class="med-setting-menu">
      <el-aside width="300px">
        <el-menu :default-active="mod" :default-openeds="['1', '2', '3','4']" @select="menuSelected">
          <el-submenu v-for="m in menuSetting" :key="'menu' + m.index" :index="m.index">
            <template slot="title"><i :class="m.title.class" />{{ m.title.text }}</template>
            <el-menu-item v-for="item in m.items" :key="'item' + item.index" :index="item.index">{{ item.text }}</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title"><i class="el-icon-s-home" />医院管理</template>
            <!-- <el-menu-item index="userSetting">用户管理</el-menu-item>
            <el-menu-item index="roleSetting">角色管理</el-menu-item> -->
            <el-menu-item index="basicSetting">基础数据</el-menu-item>
            <!-- <el-menu-item index="logDownload">日志下载</el-menu-item> -->
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container style="margin-bottom: 20px">
        <!-- <el-header style="text-align: right; font-size: 12px">
          <el-button type="primary" size="small" @click="save">保存</el-button>
        </el-header> -->
        <el-main>
          <component :is="mod" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import defaultSetting from './rules'
import basicSetting from './basic'
import userSetting from './hospital/user'
import roleSetting from './hospital/role'
import logDownload from './basic/logDownload'
export default {
  name: 'SystemSetting',
  components: {
    defaultSetting,
    basicSetting,
    userSetting,
    roleSetting,
    logDownload
  },
  data() {
    return {
      menuSetting: [
        // { index: '1',
        //   title: { class: 'el-icon-menu', text: '通用设定' },
        //   items: [{ index: '11', text: '常规' }, { index: '12', text: '接口' }] },
        // { index: '2',
        //   title: { class: 'el-icon-setting', text: '基础数据' },
        //   items: [{ index: 'basicSetting', text: '基础数据' }] },
        { index: '3',
          title: { class: 'el-icon-edit-outline', text: '填报规则' },
          items: [
            { index: 'defaultSetting', text: '默认值' }
            // { index: '32', text: '计算值' }
          ]
        }
        // { index: '4',
        //   title: { class: 'el-icon-refresh', text: '互联互通' },
        //   items: [{ index: '31', text: '急救' }, { index: '32', text: '急诊' }, { index: '33', text: '门诊' }, { index: '34', text: '住院' }] }
      ],
      mod: 'defaultSetting'
    }
  },
  methods: {
    menuSelected(index) {
      if (Object.keys(this.$options.components).includes(index)) {
        this.mod = index
      } else alert('还没做好哦')
    }
  }
}
</script>
<style lang="sass" scoped>
.med-setting-wrapper
  height: 100%
  display: flex
  .med-setting-menu
    height: calc(100vh - 64px)
    .el-aside
      padding: 2px 0

  .function-title
    margin-bottom: 15px

</style>
