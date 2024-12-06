<template>
  <med-popup-container title="绑定患者" v-bind="$attrs" v-on="$listeners" @backClick="goBack">
    <div>
      <van-dropdown-menu :close-on-click-outside="false">
        <van-dropdown-item :title="searchParam.name ? searchParam.name : '姓名'" ref="item">
          <van-search v-model="searchParam.name" placeholder="请输入搜索关键词" show-action>
            <template #action>
              <div @click="$refs.item.toggle(); initPage(); queryThirdPatientsByPage();">
                搜索
              </div>
            </template>
          </van-search>
        </van-dropdown-item>
        <van-dropdown-item v-model="searchParam.type" :options="optionA" @change="initPage(); queryThirdPatientsByPage();" />
        <van-dropdown-item v-model="timeInterval" :options="searchParam.type === '1' ? optionC : optionB" />
      </van-dropdown-menu>
      <van-row gutter="24" class="time-interval">
        <van-col span="11">
          <med-date-picker v-model="searchParam.fromDate" formatter="YYYY-MM-DD" placeholder="开始日期" type="date" :disabled="[0, 1].includes(this.timeInterval)" @_change="setTimeInterval(searchParam.fromDate, 0)" />
        </van-col>
        <van-col span="2">
          <span>到</span>
        </van-col>
        <van-col span="11">
          <med-date-picker v-model="searchParam.toDate" formatter="YYYY-MM-DD" placeholder="结束日期" type="date" :disabled="[0, 1].includes(this.timeInterval)" @_change="setTimeInterval(searchParam.toDate, 1)" />
        </van-col>
      </van-row>
    </div>
    <div>
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh" style="height: calc(100vh - 6rem);overflow: auto;">
        <van-list v-model="loading" :finished="finished" @load="onLoad" offset="10">
          <van-cell v-for="(item, index) in list" :key="index" @click="cellClick(item)">
            <p style="margin: 0.1rem 0 0.5rem 0;">
              <span style="font-size: 0.5rem;margin-right: 0.2rem;">
                {{ item.name }}
              </span>
              <span class="gender">
                <i v-if="item.gender === '1'" class="iconfont iconicon1-55female" />
                <i v-else-if="item.gender === '2'" class="iconfont iconicon1-54male" />
                <span v-else>未知</span>
              </span>
              <span style="margin-right: 0.2rem;">{{ item.age }}岁</span>
              <span v-if="item.diagnosis" class="diagnosis">
                {{ item.diagnosis }}
              </span>
            </p>
            <p style="margin: 0.4rem 0 0.2rem 0;">
              <span style="font-size: 0.3rem;color: rgb(186,186,186);">
                {{ optionA[parseInt(searchParam.type) - 1].timeName + item.time }}
              </span>
              <span v-if="searchParam.type === '1'" style="float: right;">{{ item.displayNo }}</span>
            </p>
          </van-cell>
        </van-list>
      </van-pull-refresh>
    </div>
    <div v-if="finished" style="color: #969799;font-size: 0.373333rem;text-align: center;margin: 0.1rem 0;">
      没有更多了
    </div>
  </med-popup-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import * as types from '@/store/mutations-types'
export default {
  name: 'bindingPop',
  model: {
    prop: 'show',
    event: '_change'
  },
  props: {
    isShow: {
      type: Boolean,
      defalut: false
    }
  },
  data() {
    return {
      isLoading: false,
      timeInterval: 0,
      optionA: [
        { text: '急救', value: '1', timeName: '呼救时间: ' },
        { text: '急诊', value: '2', timeName: '分诊时间: ' },
        { text: '门诊', value: '3', timeName: '门诊时间: ' },
        { text: '住院', value: '4', timeName: '入院时间: ' }
      ],
      optionB: [
        { text: '近三天', value: 0 },
        { text: '近一周', value: 1 },
        { text: '自定义', value: 2 }
      ],
      optionC: [
        { text: '近三天', value: 0 },
        { text: '自定义', value: 2 }
      ],
      searchParam: {},
      total: 0,
      list: [],
      loading: false,
      finished: false
    }
  },
  computed: {
    ...mapGetters(['hospitalId', 'hospitalArea', 'registId', 'patientName', 'binding'])
  },
  methods: {
    ...mapMutations([types.SET_BINDING]),
    onRefresh() {
      this.queryThirdPatientsByPage()
      setTimeout(() => {
        this.initPage()
        this.isLoading = false
      }, 1000)
    },
    setTimeInterval(val, type) {
      // 设置时间区间
      if (this.searchParam.type === '1') {
        const timestamp = this.$moment(val).toDate().getTime()
        if (type === 0) {
          // 开始时间
          if (this.searchParam.toDate) {
            // 如果结束时间存在,判断结束时间是否在三天内
            const endTime = this.$moment(this.searchParam.toDate).toDate().getTime()
            const timeDiff = Math.abs(endTime - timestamp)
            const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
            if (dayDiff > 3) {
              this.$set(this.searchParam, 'toDate', this.$moment(val).add(3, 'days').subtract(1, 'minutes').format('YYYY-MM-DD HH:mm'))
            }
            this.searchParam.fromDate = this.$moment(val).startOf('day').format('YYYY-MM-DD HH:mm')
            this.initPage()
            this.queryThirdPatientsByPage()
          }
        } else {
          // 结束时间
          if (this.searchParam.fromDate) {
            // 如果开始时间存在,判断结束时间是否在三天内
            const startTime = this.$moment(this.searchParam.fromDate).toDate().getTime()
            const timeDiff = Math.abs(timestamp - startTime)
            const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
            if (dayDiff > 3) {
              this.$set(this.searchParam, 'fromDate', this.$moment(val).subtract(3, 'days').add(1, 'minutes').format('YYYY-MM-DD HH:mm'))
            }
            this.searchParam.toDate = this.$moment(val).endOf('day').format('YYYY-MM-DD HH:mm')
            this.initPage()
            this.queryThirdPatientsByPage()
          }
        }
      } else {
        if (type === 0) {
          this.searchParam.fromDate = this.$moment(val).startOf('day').format('YYYY-MM-DD HH:mm')
        } else {
          this.searchParam.toDate = this.$moment(val).endOf('day').format('YYYY-MM-DD HH:mm')
        }
        this.initPage()
        this.queryThirdPatientsByPage()
      }
    },
    async queryThirdPatientsByPage() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续展示 toast
      })
      // 查询病历信息
      this.searchParam.pageNo += 1
      this.$api.queryThirdPatientsByPage(this.searchParam).then(res => {
        if (res.code === '000000') {
          this.$toast.clear() // 清除加载提示
          this.loading = false // 加载状态结束
          this.total = res.body.total
          this.searchParam.pageNo = res.body.current
          this.searchParam.pageSize = res.body.size
          if (res.body.current * res.body.size >= res.body.total) {
            // 数据全部加载完成
            this.finished = true
          }
          this.list = this.list.concat(res.body.records)
        }
      })
    },
    onLoad() {
      // 异步更新数据
      setTimeout(() => {
        if (this.refreshing) {
          this.initPage()
          this.refreshing = false
        }
        this.queryThirdPatientsByPage()
      }, 1000)
    },
    initPage() {
      // 初始化分页语句
      this.total = 0
      this.searchParam.pageNo = 0
      this.searchParam.pageSize = 10
      this.list = []
      this.finished = false
    },
    initSearchParam() {
      // 初始化查询参数
      this.searchParam = {
        type: '2',
        name: this.patientName,
        hospitalAndArea: this.hospitalId + '_' + this.hospitalArea,
        fromDate: this.$moment().endOf('day').subtract(3, 'days').add(1, 'minutes').format('YYYY-MM-DD HH:mm'),
        toDate: this.$moment().endOf('day').format('YYYY-MM-DD HH:mm')
      }
      this.initPage()
    },
    cellClick(item) {
      // 确认是否绑定患者,绑定成功立即返回
      this.$dialog.confirm({ title: '提示', message: `确认绑定患者【${item.name}】吗?`, confirmButtonColor: '#5e74fe' }).then(() => {
        this.$toast.loading({
          message: '绑定中...',
          // forbidClick: true, // 禁用背景点击
          duration: 0 // 持续展示 toast
        })
        this.$api.initDept({ registId: this.registId, type: this.searchParam.type, visitId: item.relationId }).then(res => {
          if (res.code === '000000') {
            this.$toast.clear()// 清除提示
            this.$notify({ type: 'success', message: '绑定成功' })
            this[types.SET_BINDING]('123456')
            this.goBack()
          }
        }).catch(err => {
          this.$toast(err.response.data.message)
        })
      })
    },
    goBack() {
      // 返回上一页
      this.$emit('close')
      this.list = []
    }
  },
  watch: {
    'searchParam.type'(val) {
      // 监听类别
      if (val === '1') {
        this.timeInterval = 0
      }
    },
    timeInterval(val) {
      // 时间区间
      this.searchParam.fromDate = this.$moment().endOf('day').subtract(val === 1 ? 7 : 3, 'days').add(1, 'minutes').format('YYYY-MM-DD HH:mm')
      this.searchParam.toDate = this.$moment().endOf('day').format('YYYY-MM-DD HH:mm')
      this.initPage()
      this.queryThirdPatientsByPage()
    },
    isShow(val) {
      if (val) {
        this.initSearchParam()
        this.queryThirdPatientsByPage()
      }
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .van-dropdown-menu__bar {
  box-shadow: none;
}

/deep/ .van-list .van-loading {
  display: none;
}

.time-interval {
  line-height: 1rem;

  /deep/ .van-field__control {
    text-align: center;
  }
}

.gender {
  margin-right: 0.2rem;

  .iconicon1-55female {
    font-size: 0.32rem;
    font-weight: bold;
    color: #333bd2;
  }

  .iconicon1-54male {
    font-weight: bold;
    font-size: 0.32rem;
    color: rgb(255, 90, 64);
  }
}

.diagnosis {
  background-color: rgb(239, 241, 255);
  color: rgb(94, 116, 254);
  padding: 5px 8px;
  border-radius: 0.3rem;
}
</style>
