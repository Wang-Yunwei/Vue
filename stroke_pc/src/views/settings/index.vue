<template>
  <div>
    <el-container>
      <el-aside>
        <el-menu default-active="a1" style="height: 100%">
          <el-submenu index="a">
            <template slot="title">
              <i class="el-icon-setting" />
              <span>基础配置</span>
            </template>
            <el-menu-item index="a1" @click="clickMenu('a1')">字典</el-menu-item>
            <el-menu-item index="a2" @click="clickMenu('a2')">评分模板</el-menu-item>
            <el-menu-item index="a3" @click="clickMenu('a3')">评分模板明细</el-menu-item>
            <el-menu-item index="a4" @click="clickMenu('a4')">场景二维码</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main style="overflow: hidden;">
        <Dictionary v-if="menuShow.a1" />
        <RatingScale v-if="menuShow.a2" />
        <RatingScaleItem v-if="menuShow.a3" />
        <QRCode v-if="menuShow.a4" />
      </el-main>
    </el-container>
  </div>
</template>

<script>

import QRCode from '@/views/settings/qRCode'
import Dictionary from '@/views/settings/dictionary'
import RatingScale from '@/views/settings/ratingScale.vue'
import RatingScaleItem from '@/views/settings/ratingScaleItem.vue'
export default {
  name: 'Index',
  components: { QRCode, Dictionary, RatingScale, RatingScaleItem },
  data() {
    return {
      menuShow: {
        a1: true,
        a2: false,
        a3: false,
        a4: false
      }
    }
  },
  methods: {
    allFlagFalse() {
      Object.keys(this.menuShow).forEach(item => {
        this.menuShow[item] = false
      })
    },
    clickMenu(index) {
      this.allFlagFalse()
      this.$nextTick(() => {
        this.menuShow[index] = true
      })
    }
  }
}
</script>

<style scoped>
.el-container {
  height: calc(100vh - 50px);
}
.el-aside {
  margin-bottom: 0;
  background-color: white
}
</style>
