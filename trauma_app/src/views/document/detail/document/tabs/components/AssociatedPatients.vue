<template>
  <div>
    <med-popup-container title="关联患者" v-bind="$attrs" v-on="$listeners">
      <van-search v-model="searchParam.name" shape="round" placeholder="姓名" right-icon="search" left-icon="" style="width: 90%;margin: 0.1rem auto;" @click="isShowSearch = true" readonly />
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" head-height="120" style="height: calc(100vh - 4rem);overflow: auto;">
        <van-list v-if="list.length > 0" v-model="loading" :finished="finished" @load="onLoad" finished-text="没有更多了" :offset="20" :immediate-check="false">
          <div v-for="(item, index) in list" :key="index" @click="cellClick(item)" style="padding: 0.3rem 0.5rem">
            <p style="margin: 0.1rem 0 0.5rem 0;">
              <span style="font-size: 0.5rem;margin-right: 0.2rem;">
                {{ item.name }}
              </span>
              <span class="gender">
                <i v-if="item.gender === '1'" class="iconfont iconicon1-55female" />
                <i v-else-if="item.gender === '2'" class="iconfont iconicon1-54male" />
                <span v-else>未知</span>
              </span>
              <span style="margin-right: 0.2rem;font-size: 0.4rem;">{{ item.age }}岁</span>
              <span v-if="item.diagnosis" class="diagnosis">
                {{ item.diagnosis }}
              </span>
            </p>
            <p style="margin-bottom: 0.4rem;">
              <span style="font-size: 0.3rem;color: rgb(186,186,186);">
                {{ tabSign === 'phfa' ? '呼救时间' : tabSign === 'piat' ? ['01', '02'].includes(visitType) ? '分诊时间' : '门诊时间'
      : '入院时间' }} : {{ item.time }}
              </span>
              <span v-if="tabSign === 'phfa'" style="float: right;font-size: 0.4rem;">{{ item.displayNo }}</span>
            </p>
            <div v-if="list.length > 1" style="border-top: 1px solid rgb(238,238,238);margin: 0 auto;" />
          </div>
        </van-list>
        <van-empty v-else description="暂无数据" :image="require('@assets/image/empty.png')" />
      </van-pull-refresh>
    </med-popup-container>
    <med-popup-container v-model="isShowSearch" title="患者搜索">
      <van-search v-model="searchParam.name" shape="round" placeholder="姓名" style="margin: 0.1rem 0 0.2rem 0;" />
      <span style=" font-weight: 700;font-size: 0.4rem;margin-left: 0.4rem;">
        时间
      </span>
      <div class="flex-c-b" style="margin-top: 0.3rem;width: 92%; margin: 0.25rem auto;">
        <med-date-picker placeholder="开始时间" v-model="searchParam.fromDate" label="" @_change="tabSign === 'phfa' ? setTimeInterval(searchParam.fromDate, 0) : ''" />
        ~
        <med-date-picker placeholder="结束时间" v-model="searchParam.toDate" label="" @_change="tabSign === 'phfa' ? setTimeInterval(searchParam.toDate, 1) : ''" />
      </div>
      <div class="screen-foot flex-c-c">
        <van-button class="screen-foot-button" @click="list = []; initPage()">
          重置
        </van-button>
        <van-button class="screen-foot-button" color="rgb(94,116,254)" @click="certainButton">
          确定
        </van-button>
      </div>
    </med-popup-container>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import * as types from '@/store/mutations-types'
export default {
  name: 'AssociatedPatients',
  model: {
    prop: 'show',
    event: '_change'
  },
  props: ['tabSign', 'isShow'],
  data() {
    return {
      isShowSearch: false,
      searchParam: {},
      list: [],
      loading: false,
      finished: false,
      refreshing: false
    }
  },
  computed: {
    ...mapGetters(['patientName', 'registId', 'hospitalArea', 'hospitalId', 'visitType', 'binding'])
  },
  methods: {
    ...mapMutations([types.SET_BINDING]),
    setTimeInterval(val, type) {
      // 设置时间区间
      const timestamp = this.$moment(val)
        .toDate()
        .getTime()
      if (type === 0) {
        // 设置开始时间
        if (this.searchParam.toDate) {
          // 如果结束时间存在,判断结束时间是否在三天内
          const endTime = this.$moment(this.searchParam.toDate)
            .toDate()
            .getTime()
          const timeDiff = Math.abs(endTime - timestamp)
          const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
          if (dayDiff > 3) {
            this.$set(
              this.searchParam,
              'toDate',
              this.$moment(val)
                .add(3, 'days')
                .subtract(1, 'minutes')
                .format('YYYY-MM-DD HH:mm')
            )
          }
        }
      } else {
        // 设置结束时间
        if (this.searchParam.fromDate) {
          // 如果开始时间存在,判断结束时间是否在三天内
          const startTime = this.$moment(this.searchParam.fromDate)
            .toDate()
            .getTime()
          const timeDiff = Math.abs(timestamp - startTime)
          const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
          if (dayDiff > 3) {
            this.$set(
              this.searchParam,
              'fromDate',
              this.$moment(val)
                .subtract(3, 'days')
                .add(1, 'minutes')
                .format('YYYY-MM-DD HH:mm')
            )
          }
        }
      }
    },
    getType() {
      // 来院方式为01或02时tabSign=piat展示急诊列表
      return this.tabSign === 'phfa' ? '1' : this.tabSign === 'piat' ? ['01', '02'].includes(this.visitType) ? '2' : '3' : '4'
    },
    cellClick(item) {
      this.$dialog.confirm({ title: '提示', message: `确定绑定患者【${item.name}】吗?`, confirmButtonColor: '#5e74fe' }).then(() => {
        this.$toast.loading({
          message: '关联中...',
          forbidClick: true, // 禁用背景点击
          duration: 0 // 持续展示 toast
        })
        this.$api.bindDept({
          registId: this.registId,
          type: this.getType(),
          visitId: item.relationId
        }).then(res => {
          if (res.code === '000000') {
            this.$toast.clear()
            this.$notify({ type: 'success', message: '绑定成功' })
            this[types.SET_BINDING](!this.binding)
            this.$emit('close')
          }
        }).catch(err => {
          this.$toast(err.response.data.message)
        })
      })
    },
    certainButton() {
      // 确定按钮
      this.isShowSearch = false // 关闭查询页面
      this.onRefresh()
    },
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
      // 查询病历信息
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
        type: this.getType(),
        name: this.patientName,
        hospitalAndArea: this.hospitalId + '_' + this.hospitalArea,
        fromDate: this.$moment().endOf('day').subtract(3, 'days').add(1, 'minutes').format('YYYY-MM-DD HH:mm'),
        toDate: this.$moment().endOf('day').format('YYYY-MM-DD HH:mm'),
        pageNo: 0,
        pageSize: 10,
        total: 0
      }
    }
  },
  watch: {
    isShow(val) {
      if (val) {
        this.initPage()
        this.queryThirdPatientsByPage()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.gender {
  margin-right: 0.2rem;

  .iconicon1-55female {
    font-size: 0.4rem;
    font-weight: bold;
    color: rgb(43, 101, 248);
  }

  .iconicon1-54male {
    font-size: 0.4rem;
    font-weight: bold;
    color: rgb(255, 90, 64);
  }
}

.diagnosis {
  background-color: rgb(239, 241, 255);
  color: rgb(94, 116, 254);
  padding: 5px 8px;
  border-radius: 0.3rem;
  font-size: 0.4rem;
}

.screen-foot {
  position: fixed;
  bottom: 0.78rem;
  left: 0;
  right: 0;

  .screen-foot-button {
    height: 0.85rem;
    border-radius: 50px 0px 0px 50px;
    border-color: rgb(43, 101, 248);
    color: rgb(43, 101, 248);
    border-right: none;
    width: 4.5rem;

    &+.screen-foot-button {
      border-radius: 0px 50px 50px 0px;
    }
  }
}
</style>
