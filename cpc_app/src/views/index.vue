<template>
  <div>
    <med-view-container @return="exit" return-label="">
      <template #title>
        <div>
          胸痛档案
        </div>
        <div class="med-header-title-slot" @click="onShowHospitalArea">
          <div class="flex-c-c">
            <span class="select-title">{{ title }}</span>
            <van-icon color="white" name="arrow-down" v-if="!active" />
          </div>
        </div>
      </template>
      <router-view />
    </med-view-container>
    <van-tabbar v-model="active" route @change="activeChange">
      <van-tabbar-item
        replace
        icon="search"
        to="/document/index"
      >
        <template #icon="props">
          <med-svg icon-class="iconlvtong-bingli" />
        </template>
        档案
      </van-tabbar-item>
      <van-tabbar-item
        name="statistics"
        replace
        to="/qc/index"
        v-if="_resources.chestpainQc() && false"
      >
        <template #icon="props">
          <med-svg
            :icon-class="props.active ? 'iconlvtong-661' : 'iconlvtong-671'"
          />
        </template>
        质控
      </van-tabbar-item>
      <van-tabbar-item
        icon="search"
        replace
        to="/patient/preHospitalPush"
        v-if="_resources.transferList()"
        >
        <template #icon="props">
          <med-svg icon-class="iconlvtong-tuisong" />
        </template>
        推送
      </van-tabbar-item>
    </van-tabbar>
    <med-action-sheet
      v-model="showHospitalArea"
      :actions="hospitalAreaActions"
      @select="onSelectedHospitalArea"
      @close="onCloseHospitalArea"
      @clear="showHospitalArea = false"
    >
    </med-action-sheet>
  </div>
</template>

<script>
import { Dialog } from 'vant'
import { mapGetters, mapMutations } from 'vuex'
import * as types from '@/store/mutations/mutations-types'
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

export default {
  // 胸痛档案
  name: 'Main',
  components: {},
  data() {
    return {
      active: 0,
      showHospitalArea: false
    }
  },

  computed: {
    ...mapGetters(['hospitalArea', 'curHospitalArea', 'appName', 'configure']),
    curHospitalAreaName() {
      const matched = this.hospitalArea.find(
        el => el.value === this.curHospitalArea
      )
      return matched?.label
    },
    hospitalAreaActions() {
      return (this.hospitalArea || []).map(ele => {
        const selected = ele.value === this.curHospitalArea
        return {
          ...ele,
          name: ele.label,
          className: selected ? 'selected' : undefined
        }
      })
    },
    title() {
      return `${this.curHospitalAreaName}`
    }
  },
  mounted() {
    this.active = Number(localStorage.getItem('activeTab')) || 0
    this.$backhelper.push(this.exit)
  },
  methods: {
    ...mapMutations([types.SET_CURHOSPITALAREA]),
    exit() {
      Dialog.confirm({
        title: '提示',
        message: `确定要退出${this.appName}？`
      })
        .then(() => {
          if (!IS_PROD) {
            localStorage.clear()
            this.$router.push('/login')
          }
          this.$bridge.exit()
        })
        .catch(() => {})
    },
    activeChange(val) {
      localStorage.setItem('activeTab', val)
    },
    handleScan() {
      this.$bridge
        .scan(['1'])
        .then(data => {
          console.log('data', data)
        })
        .catch(e => {
          console.log(e)
        })
    },
    onShowHospitalArea() {
      if (this.active !== 0) return
      this.showHospitalArea = true
    },
    onSelectedHospitalArea(selected) {
      this.showHospitalArea = false
      this[types.SET_CURHOSPITALAREA](selected.value)
    },
    onCloseHospitalArea() {
      console.log('close')
    }
  },
  watch: {
    hospitalArea: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val?.length && !this.curHospitalArea) {
          this[types.SET_CURHOSPITALAREA](val[0]?.value)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
