<template>
  <!-- style设置为inline-block，避免垂直布局的标题-->
  <div v-if="!item.hidden" style="display: inline-block">
    <template v-if="hasOneShowingChild(item.children, item) &&
    (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
    !item.alwaysShow
    ">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)">
          <i :class="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" />
          <span slot="title">{{ onlyOneChild.meta.title }}</span>
        </el-menu-item>
      </app-link>
    </template>
    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)">
      <template slot="title">
        <item v-if="item.meta" :title="item.meta.title" :icon="item.meta && item.meta.icon" />
        <div style="display: inline-block; width: 20px" />
      </template>
      <sidebar-item v-for="hild in item.children" :key="child.path" :is-nest="true" :item="child" :base-path="resolvePath(child.path)" class="head-nest-menu" />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'
import SidebarItem from './SidebarItem'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink, SidebarItem },
  mixins: [FixiOSBug],
  props: {
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      onlyOneChild: []
    }
  },

  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-menu-item i {
  color: rgb(75, 96, 253)
}
</style>
