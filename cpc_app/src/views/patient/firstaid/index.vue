<template>
  <medical-record />
</template>
<script>
import Vue from 'vue'
import { Step, Steps } from 'vant'
import * as parts from './parts'

Vue.use(Step)
Vue.use(Steps)
export default {
  name: 'overview',
  components: { ...parts },
  data() {
    return {
      active: 6,
      tabList: [
        { name: '患者病历', part: parts.medicalRecord },
        { name: '时间轴', part: parts.Timeline },
        { name: '地图', part: parts.mapl },
        { name: '会诊', part: parts.consultation }
      ]
    }
  },
  computed: {
    businessId() {
      return this.$route.query.businessId
    }
  },
  beforeRouteLeave(to, from, next) {
    const keepPath = ['/patient/document/addInformation']

    if (keepPath.includes(to.path)) {
      from.meta.keepAlive = true
    } else {
      const vnode = this.$vnode
      const parentVnode = vnode && vnode.parent
      if (
        parentVnode &&
        parentVnode.componentInstance &&
        parentVnode.componentInstance.cache
      ) {
        var key =
          vnode.key == null
            ? vnode.componentOptions.Ctor.cid +
              (vnode.componentOptions.tag
                ? `::${vnode.componentOptions.tag}`
                : '')
            : vnode.key
        var cache = parentVnode.componentInstance.cache
        var keys = parentVnode.componentInstance.keys
        if (cache[key]) {
          this.$destroy()
          if (keys.length) {
            var index = keys.indexOf(key)
            if (index > -1) {
              keys.splice(index, 1)
            }
          }
          cache[key] = null
        }
      }
    }
    next()
  },
  methods: {
    // 返回主页面
    jumpToDetails() {
      this.$router.push({
        path: '/patient/preHospitalPush'
      })
    }
  },
  watch: {
    $route: {
      immediate: false,
      handler() {
        if (this.$route.path === '/patient/preHospitalPush') {
          this.active = 0
        }
      },
      deep: true
    }
  }
}
</script>
