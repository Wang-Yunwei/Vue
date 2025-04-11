<template>
  <div class="med-setting-wrapper">
    <el-container class="med-setting-menu">
      <el-aside width="300px">
        <el-menu :default-active="mod" @select="menuSelected">
          <el-submenu v-for="m in menuSetting" :key="'menu' + m.index" :index="m.index">
            <template slot="title"><i :class="m.title.class" />{{ m.title.text }}</template>
            <el-menu-item
              v-for="item in m.items"
              :key="'item' + item.index"
              :index="item.index"
            >
              {{ item.text }}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container style="margin-bottom: 20px">
        <el-main>
          <component :is="mod" @goAianalysis="goAianalysis" />
        </el-main>
      </el-container>
    </el-container>
    <developing v-if="false" />
  </div>
</template>
<script>

import aianalysis from './aianalysis'
import aianalysisList from './aianalysis/aianalysisList'
import reportStatistics from './reportStatistics'
import developing from '@/views/developing.vue'
export default {
  name: 'QualityControl',
  components: {
    aianalysis,
    aianalysisList,
    reportStatistics,
    developing
  },
  data() {
    return {
      menuSetting: [
        { index: '1',
          title: { class: 'el-icon-menu', text: '统计分析' },
          items: [
            // { index: 'aianalysis', text: '智能分析' },
            { index: 'aianalysisList', text: '认证指标' }
            // { index: 'reportStatistics', text: '报表统计' }
          ]
        }
      ],
      mod: 'aianalysisList'
    }
  },
  methods: {
    goAianalysis(item) {
      this.menuSelected(item)
    },
    menuSelected(index) {
      if (Object.keys(this.$options.components).includes(index)) { this.mod = index } else alert('还没做好哦')
    }
  }
}
</script>
<style lang="sass" scoped>
.med-setting-wrapper
  height: calc(100vh - 50px)
  display: flex
  .med-setting-menu
    height: calc(100vh - 64px)
    .el-aside
      padding: 2px 0

  .function-title
    margin-bottom: 15px
</style>
