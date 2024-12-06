<template>
  <div>
    <div class="pre-hospital-head">
      <van-field v-model="searchParam.name" @click="isShowSearch = true" class="plus-sign-input" right-icon="search" placeholder="按照患者姓名搜索" readonly />
    </div>
    <div class="pre-hospital-body">
      <van-pull-refresh v-model="isLoading" @refresh="pushList" success-text="刷新成功" head-height="150" style="height: calc(100vh - 5.2rem);overflow: auto;padding-bottom:1rem">
        <template #loading>
          <van-loading>加载中...</van-loading>
        </template>
        <div v-if="list.length > 0" style="padding-bottom: 1.5rem">
          <div class="body-card" v-for="(item, index) in list" :key="index">
            <div class="card-header flex-c-s">
              <span>{{ item.pushTime }}</span>
            </div>
            <div class="card-body" @click="toDetails(item)">
              <div style="font-size: 0.5rem;margin-bottom: 0.2rem;">
                <span>{{ item.name }}</span>
                <span class="spacing">{{ item.gender === '1' ? '男' : item.gender === '2' ? '女' : '未知' }}</span>
                <span class="spacing">{{ item.age }}</span>
                <span class="source">{{ source[item.source] }}</span>
              </div>
              <div v-if="item.source === 'phep'">
                <p style="margin-bottom: 0.1rem;">呼救时间: {{ item.callTime }}</p>
                <p>诊断: {{ item.diagnosis }}</p>
              </div>
              <div v-if="item.source === 'piat'">
                <p style="margin-bottom: 0.1rem;">分诊时间: {{ item.triageTime }}</p>
                <p>主诉: {{ item.patientSay }}</p>
              </div>
            </div>
            <div class="flex-c-e" style="padding: 0.2rem 0.3rem;">
              <van-button style="width: 1.8rem;height: 0.8rem;" @click="putOnRecord(item)" plain round color="rgb(94,116,254)">建档</van-button>
            </div>
          </div>
        </div>
        <van-empty v-else description="暂无数据" :image="require('@assets/image/empty.png')" />
      </van-pull-refresh>
    </div>
    <search-push-list v-model="isShowSearch" @close="closeSearch" />
    <add-patient v-model="isShowAddPatient" :isShow="isShowAddPatient" :data="addPatientForm" @close="isShowAddPatient = false" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import searchPushList from './searchPushList.vue'
import addPatient from '@/views/document/list/add/addPatient'
export default {
  components: { searchPushList, addPatient },
  data() {
    return {
      isLoading: false,
      isShowSearch: false, // 是否显示查询页面
      isShowAddPatient: false, // 是否显示新增页面
      addPatientForm: {},
      source: {
        phep: '急救',
        piat: '急诊'
      },
      list: [],
      searchParam: {}
    }
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === 'documentList') {
      next(vm => {
        vm.initPage()
        vm.pushList()
      })
    } else {
      next()
    }
  },
  computed: {
    ...mapGetters(['hospitalId', 'hospitalArea'])
  },
  methods: {
    putOnRecord(obj) {
      // 验证患者是否已经建档
      this.$api.getPatientBaseInfo({
        relationId: obj.relationId,
        type: obj.source === 'phep' ? '1' : '2'
      }).then(res => {
        if (res.code === '000000') {
          // 建档
          this.addPatientForm = {
            ...res.body,
            isPush: 1
          }
          this.isShowAddPatient = true
        }
      }).catch(err => {
        this.$toast(err.response.data.message)
      })
    },
    toDetails(obj) {
      this.$router.push({
        name: 'preHospitalDetails',
        query: {
          ...obj
        }
      })
    },
    closeSearch(obj) {
      // 关闭检索推送列表
      this.isShowSearch = false
      this.searchParam = {
        ...this.searchParam,
        ...obj
      }
      this.pushList()
    },
    pushList() {
      // 查询院前推送列表
      this.$api.pushList(this.searchParam).then(res => {
        if (res.code === '000000') {
          this.isLoading = false // 加载完成
          this.list = res.body
        }
      }).catch(() => {
        this.isLoading = false // 加载完成
      })
    },
    initPage() {
      // 初始化分页信息
      this.searchParam = {
        hospitalId: this.hospitalId,
        hospitalArea: this.hospitalArea,
        beginTime: this.$moment().endOf('day').subtract(3, 'days').add(1, 'minutes').format('YYYY-MM-DD HH:mm'),
        endTime: this.$moment().endOf('day').format('YYYY-MM-DD HH:mm')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.pre-hospital-head {
  position: fixed;
  top: 2.6rem;
  left: 0;
  right: 0;
  overflow: hidden;
  padding: 0 0.4rem;

  .plus-sign-input {
    padding: 0 0.3rem 0 0.6rem;
    width: 100%;
    height: 1rem;
    line-height: 0.9rem;
    border-radius: 50px;
    background-color: rgb(247, 248, 250);
  }
}

.pre-hospital-body {
  position: fixed;
  top: 4rem;
  left: 0;
  right: 0;

  .body-card {
    width: 96%;
    border-radius: 0.2rem;
    margin: 0.3rem auto;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

    .card-header {

      padding-left: 0.3rem;
      line-height: 2.5;
      background-color: rgb(247, 247, 247);
      color: rgba(108, 108, 108, 1);

      >span+b {
        margin-left: 0.5rem;
      }
    }

    .card-body {
      line-height: 2;
      padding-bottom: 0.2rem;
      margin: 0.1rem 0.3rem 0 0.3rem;
      border-bottom: 2px solid rgb(239, 241, 255);

      .spacing {
        margin-left: 0.3rem;
        font-size: 0.4rem;
      }

      .source {
        margin-left: 0.3rem;
        font-size: 0.36rem;
        border-radius: 0.3rem;
        padding: 0.1rem 0.15rem;
        background-color: rgb(239, 241, 255);
        color: rgb(94, 116, 254);
      }
    }
  }
}
</style>
