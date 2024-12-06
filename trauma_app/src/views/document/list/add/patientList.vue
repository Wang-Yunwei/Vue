<template>
  <med-popup-container v-bind="$attrs" v-on="$listeners" title="患者搜索">
    <template #right>
      <van-icon name="plus" color="#fff" @click="addPatientData = {}; isShowAddPatient = true;" />
    </template>
    <van-field v-model="searchParam.name" placeholder="按照患者姓名、来源、时间搜索" right-icon="search" readonly @click="isShowFilter = true" style="background-color: rgb(247, 248, 250);width: 90%;border-radius: 1rem;margin: 0.4rem auto;font-size: 0.4rem;padding: .133333rem .213333rem .133333rem 0.3rem" />
    <div>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功" style="height: calc(100vh - 4rem);overflow: auto;" head-height="120">
        <template #loading>
          <van-loading>加载中...</van-loading>
        </template>
        <van-list v-if="list.length > 0" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" offset="20" :immediate-check="false">
          <div v-for="(item, index) in list" :key="index" :name="item" @click="onSelect(item)" style="margin-bottom: 0.1rem;">
            <div style="padding: 0.3rem 0.426667rem 0.56rem 0.426667rem">
              <div style="display: flex;margin-bottom: 0.5rem;line-height: 0.3rem;">
                <div style="font-size: 0.5rem;flex: 9;">
                  {{ item.name }}
                </div>
                <div class="gender">
                  <i v-if="item.gender === '2'" class="iconfont iconicon1-54male" />
                  <i v-if="item.gender === '1'" class="iconfont iconicon1-55female" />
                  <span v-if="item.gender === '0'">未知</span>
                </div>
                <div style="font-size: 0.36rem;flex: 3;">{{ item.ageDesc }}</div>
                <div style="flex: 10;">
                  <span v-if="item.diagnosis" style="padding: 0.1rem 0.2rem; font-size: 0.36rem;border-radius: 0.3rem; background-color: rgb(239,241,255);color: rgb(103,123,245);">
                    {{ item.diagnosis }}
                  </span>
                </div>
              </div>
              <div style="color: rgb(183,183,183);font-size: 0.3rem;">
                {{ searchParam.type === '1' ? '呼救时间' : searchParam.type === '2' ? '分诊时间' : searchParam.type === '4' ?
    '入院时间' : '门诊时间' }} : {{ item.time }}
              </div>
            </div>
            <div v-if="list.length > 1" style="border-top: 1px solid rgb(238,238,238);margin: 0 auto;" />
          </div>
        </van-list>
        <van-empty v-else description="暂无数据" :image="require('@assets/image/empty.png')" />
      </van-pull-refresh>
    </div>
    <add-patient v-model="isShowAddPatient" :isShow="isShowAddPatient" :data="addPatientData" @close="isShowAddPatient = false; $emit('close')" />
    <filter-pop v-model="isShowFilter" @certainButton="closeFilter" :initForm="cleanSearch" />
  </med-popup-container>
</template>

<script>
import * as types from '@/store/mutations-types'
import { mapGetters, mapMutations } from 'vuex'
export default {
  model: {
    prop: 'show',
    event: '_change'
  },
  components: {
    addPatient: () => import('@/views/document/list/add/addPatient'),
    FilterPop: () => import('./filterPop.vue')
  },
  props: ['isShow'],
  data() {
    return {
      loading: false,
      finished: false,
      refreshing: false,
      cleanSearch: false, // 清空搜索条件
      addPatientData: {},
      isShowAddPatient: false, // 是否显示添加患者页面
      isShowFilter: false, // 是否显示筛选页面
      list: [],
      searchParam: {}// 查询条件
    }
  },
  computed: {
    ...mapGetters(['hospitalId', 'hospitalArea'])
  },
  methods: {
    ...mapMutations([types.SET_REGIST_ID]),
    onRefresh() {
      // 下拉刷新
      this.finished = false
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.searchParam.pageNo = 0
      this.searchParam.pageSize = 10
      this.searchParam.total = 0
      this.onLoad()
    },
    closeAddPatient() {
      // 关闭患者添加页面
      this.isShowAddPatient = false
      this.$emit('close') // 关闭当前页面
    },
    onSelect(row) {
      // 获取患者详情
      this.$api.getPatientBaseInfo({
        relationId: row.relationId,
        type: this.searchParam.type
      }).then(res => {
        if (res.code === '000000') {
          this.addPatientData = res.body
          this.isShowAddPatient = true
        }
      }).catch(err => {
        this.$toast(err.response.data.message)
      })
    },
    closeFilter(param) {
      // 关闭筛选页面并查询数据
      this.isShowFilter = false
      this.searchParam = {
        ...this.searchParam,
        ...param
      }
      this.onRefresh()
    },
    onLoad() {
      // 加载数据
      setTimeout(async () => {
        if (this.refreshing) {
          this.list = []
          this.refreshing = false
        }
        await this.queryThirdPatientsByPage()
        this.loading = false // 结束加载
        if (this.searchParam.pageNo * this.searchParam.pageSize >= this.searchParam.total) {
          this.finished = true // 加载完全部数据
        }
      }, 1000)
    },
    async queryThirdPatientsByPage() {
      // 查询数据列表
      this.searchParam.pageNo = ++this.searchParam.pageNo
      const res = await this.$api.queryThirdPatientsByPage(this.searchParam)
      if (res.code === '000000') {
        if (res.body.current === 1) {
          this.list = []
        }
        this.searchParam.total = res.body.total
        this.searchParam.pageNo = res.body.current
        this.searchParam.pageSize = res.body.size
        this.list = this.list.concat(res.body.records)
      }
    },
    initPage() {
      // 初始化分页信息
      this.searchParam = {
        hospitalAndArea: this.hospitalId + '_' + this.hospitalArea,
        fromDate: this.$moment().endOf('day').subtract(3, 'days').add(1, 'seconds').format('YYYY-MM-DD HH:mm'),
        toDate: this.$moment().endOf('day').format('YYYY-MM-DD HH:mm'),
        type: '2', // 默认急诊
        pageNo: 0,
        pageSize: 10,
        total: 0
      }
    }
  },
  watch: {
    isShow(val) {
      if (val) {
        this.cleanSearch = !this.cleanSearch // 清除之前的搜索条件
        this.initPage()
        this.queryThirdPatientsByPage()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.gender {
  flex: 2;

  .iconicon1-55female {
    font-weight: bold;
    font-size: 0.36rem;
    color: rgb(43, 101, 248);
  }

  .iconicon1-54male {
    font-weight: bold;
    font-size: 0.36rem;
    color: rgb(255, 84, 84);
  }
}
</style>
