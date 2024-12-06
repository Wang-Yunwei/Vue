<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" head-height="150" style="height: calc(100vh - 4.71rem);overflow: auto;">
      <template #loading>
        <van-loading>加载中...</van-loading>
      </template>
      <div v-if="list.length > 0" style="padding-top: 0.01rem;">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div v-for="item in list" :key="item.id">
            <van-swipe-cell class="body-card" :disabled="!(item.status === '1' && auth_delete)">
              <div>
                <div class="body-card-header flex-c-s">
                  <div class="body-card-header-left" :style="`background:${DIAGNOSIS_COLOR.find(el => el.key === (item.diagnosis ? isNaN(item.diagnosis) ? '00' : item.diagnosis : '00'))?.value};`">
                    {{ item.diagnosisName ? item.diagnosisName : '未知' }}
                  </div>
                  <div style="font-size: .373333rem;">
                    建档时间 : {{ item.createTimestamp }}
                  </div>
                </div>
                <div class="body-card-body">
                  <div @click="toDetail(item, false)">
                    <div class="flex-c-s">
                      <div class="body-card-body-name" @mouseover="showText = true" @mouseout="showText = false">
                        {{ item.name }}
                      </div>
                      &nbsp; &nbsp;
                      <div>
                        {{ item.gender }}
                      </div>
                      &nbsp; &nbsp;
                      <div v-if="item.age || item.ageMonth || item.ageDay">
                        {{
      item.ageRange
        ? item.ageRange === "01"
          ? item.age + "岁"
          : item.ageRange === "02"
            ? item.age + "岁" + item.ageMonth + "月"
            : item.ageDay
              ? item.ageDay + "天"
              : ""
        : item.age
          ? item.age + "岁"
          : ""
    }}
                      </div>
                      &nbsp; &nbsp;
                      <van-button v-if="item.visitType" type="default" size="mini" class="body-card-body-button">
                        {{ item.visitType }}
                      </van-button>
                    </div>
                    <div class="body-card-body-a" style="display: flex;">
                      <div style="margin-right: 1rem; flex:1">
                        门诊号: {{ item.regNo }}
                      </div>
                      <div style="flex: 2;">腕带号: {{ item.rfTagName }}</div>
                    </div>
                    <div class="body-card-body-a">MPDS: {{ item.mpds }}</div>
                  </div>
                  <div class="foot flex-c-b">
                    <div>
                      <span v-if="['0', '1'].includes(status)" style="font-weight: 800;font-size: 0.38rem;color: #202020;">
                        {{ item.statusName }}
                      </span>
                    </div>
                    <div>
                      <!-- van-button @click="toDetail(item, true)" class="foot-button" v-if="item.emId">调阅</van-button -->
                      <van-button v-if="item.rfTagId" @click="unbindClick(item)" class="foot-button">解绑</van-button>
                      <van-button v-if="item.status === '1'" @click="traumaAssessButt(item)" class="foot-button">创伤评估</van-button>
                      <van-button v-if="item.status === '1'" @click="timeManage(item)" class="foot-button">时间管理</van-button>
                    </div>
                  </div>
                </div>
              </div>
              <template #right>
                <van-button square text="删除" type="danger" class="delete-button" @click="deleteByRegistId(item)" />
              </template>
            </van-swipe-cell>
          </div>
        </van-list>
      </div>
      <van-empty v-else description="暂无数据" :image="require('@assets/image/empty.png')" />
    </van-pull-refresh>
    <trauma-assess v-model="isShowTraumaAssess" :isShow="isShowTraumaAssess" :readonly="readonly" />
  </div>
</template>
<script>
import * as types from '@/store/mutations-types'
import { mapGetters, mapMutations } from 'vuex'
import dictionariesMixin from '@mixins/dictionariesMixin'
import traumaAssess from './traumaAssess.vue'
export default {
  name: 'cardList',
  mixins: [dictionariesMixin],
  props: {
    status: {
      type: String,
      default: ''
    },
    query: {
      type: Object,
      default: () => { }
    },
    isInitPage: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default: 0
    },
    executeSelect: {
      type: Boolean,
      default: true
    }
  },
  components: {
    traumaAssess
  },
  data() {
    return {
      queryLock: true,
      readonly: false,
      showText: false,
      isLoading: false,
      loading: false,
      finished: false,
      isShowTraumaAssess: false,
      page: {
        total: 0,
        curPage: 0, // 页码
        pageSize: 5 // 页长
      },
      list: []
    }
  },
  mounted() {
    this.queryByPage()
  },
  computed: {
    ...mapGetters(['hospitalArea', 'loginUserInfo']),
    auth_delete() {
      // 权限控制 - 病历删除 sign = trauma-mr-delete
      return (
        this.loginUserInfo?.resources?.filter(
          el => el.sign === 'trauma-mr-delete'
        ).length > 0
      )
    }
  },
  methods: {
    ...mapMutations([
      types.SET_EM_ID,
      types.SET_REGIST_ID,
      types.SET_READ_ONLY,
      types.SET_PATIENT_NAME,
      types.SET_IS_PICK_READ
    ]),
    unbindClick(val) {
      // 接触绑定
      this.$dialog.confirm({
        title: '提示',
        message: '确定要解绑腕带吗?',
        confirmButtonColor: this.BLUE_TEXT
      }).then(() => {
        let num = 0
        this.$toast.loading({
          message: '解绑中...',
          forbidClick: true,
          duration: num
        })
        this.$api.unBindRfTagId({
          hospitalId: this.hospitalId + '_' + this.hospitalArea,
          registId: val.registId,
          rfTagId: val.rfTagId,
          type: '2'
        }).then(res => {
          num = -1
          if (res.code === '000000') {
            this.$toast.success('解绑成功')
            this.initPage()
            this.queryByPage()
          } else {
            this.$toast.fail('解绑失败')
          }
        }).catch(() => {
          num = -1
          this.$toast.fail('解绑失败')
        })
      }).catch(() => { })
    },
    onRefresh() {
      // 下拉刷新
      this.initPage()// 初始化分页信息
      this.queryByPage()
      setTimeout(() => {
        this.isLoading = false
      }, 1000)
    },
    deleteByRegistId(obj) {
      // 删除档案
      this.$dialog
        .confirm({
          title: '提示',
          message: '确认要删除患者【' + obj.name + '】?',
          confirmButtonColor: 'rgb(94,116,254)'
        })
        .then(() => {
          this.$api.deleteByRegistId(obj.registId).then(res => {
            if (res.code === '000000') {
              this.$notify({
                type: 'success',
                message: '患者【' + obj.name + '】已删除'
              })
              const index = this.list.findIndex(item => item.registId === obj.registId)
              this.list.splice(index, 1)
              // 判断列表长度是否小于5，如果小于5则查询列表数据
              if (this.list.length < 5) {
                this.initPage()
                this.queryByPage()
              }
            } else {
              this.notify({
                type: 'danger',
                message: '患者【' + obj.name + '】删除失败'
              })
            }
          })
        })
        .catch(() => { })
    },
    traumaAssessButt(obj) {
      this[types.SET_REGIST_ID](obj.registId)
      if (obj.status !== '1') {
        this.readonly = true
      }
      this.isShowTraumaAssess = true
    },
    timeManage(item) {
      this[types.SET_REGIST_ID](item.registId)
      this.$router.push({
        path: '/document/detail/time-collection',
        query: {
          registId: item.registId
        }
      })
    },
    toDetail(item, isPickRead) {
      this[types.SET_EM_ID](item.emId)
      this[types.SET_READ_ONLY](item.status !== '1')
      this[types.SET_REGIST_ID](item.registId)
      this[types.SET_PATIENT_NAME](item.name)
      this[types.SET_IS_PICK_READ](isPickRead)
      this.$router.push({ name: 'documentDetail' })
      this.finished = false // 跳转详情后重置数据全部加载完标记
    },
    onLoad() {
      // 列表下拉加载事件
      setTimeout(async () => {
        // 异步更新数据
        await this.queryByPage()
        // 加载状态结束
        this.loading = false
        // 数据全部加载完成
        if (this.page.curPage * this.page.pageSize >= this.page.total) {
          this.finished = true
        }
      }, 500)
    },
    queryByPage() {
      // 查询列表数据
      return this.$api.queryByPage({
        ...this.query,
        status: this.status,
        pageNo: this.page.curPage + 1,
        pageSize: this.page.pageSize,
        hospitalArea: this.hospitalArea
      }).then(res => {
        if (res.code === '000000') {
          this.page.curPage = res.body.current
          this.page.total = res.body.total
          if (res.body.current === 1) {
            this.list = []
          }
          this.list = this.list.concat(
            res.body.records.map(item => ({
              ...item,
              // 性别
              gender: this.getDicLabelByValue(item.gender, 'GENDER_0001'),
              // 来院方式
              visitType: this.getDicLabelByValue(
                item.visitType,
                'VISIT_0001'
              ),
              // MPDS
              mpds: item.mpds
                ? this.getLabelsByValue(item.mpds, 'TRAUMA_0001')
                : ''
            }))
          )
        } else {
          this.$notify({ type: 'danger', message: res.message })
        }
      })
    },
    initPage() {
      // 初始化分页信息
      this.page = {
        total: 0,
        curPage: 0, // 页码
        pageSize: 5 // 页长
      }
      this.finished = false
    }
  },
  watch: {
    executeSelect(val) {
      // 执行查询
      if (!val) {
        this.initPage()
        this.queryByPage()
        this.finished = false
      }
    },
    status(val) {
      // status监听被调两次,添加状态锁使其只执行一次
      if (val == this.index) {
        this.initPage()
        this.queryByPage()
      }
    },
    isInitPage() {
      // 初始化分页信息
      this.initPage()
    },
    '$route.path': {
      handler(val) {
        if (/\/document\/list/.test(val)) {
          this.queryByPage()
        }
      }
    },
    hospitalArea(val) {
      if (val) {
        this.initPage()
        this.queryByPage()
      }
    },
    query(val) {
      if (Object.keys(val).length !== 0) {
        this.initPage()
        this.queryByPage()
        this.finished = false
      }
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .van-swipe-cell__right {
  right: -1px;
}

.body-card {
  width: 96%;
  border-radius: 20px;
  margin: 0.3rem auto;
  overflow: hidden;
  box-shadow: 0px 5px 10px #a6a6a6;

  button.delete-button {
    height: 100%;
    margin: 0 0.1rem;
    border-radius: 0.2rem;
  }

  /deep/.van-swipe-cell__wrapper {
    padding: 1px 0px;
  }

  .body-card-header {
    border-top-right-radius: 0.2rem;
    background-color: #e6e6e6;
    color: rgba(108, 108, 108, 1);

    .body-card-header-left {
      background-color: rgb(235, 17, 17);
      border-radius: 20px 0px;
      width: 4em;
      text-align: center;
      color: #fff;
      margin-right: 0.3rem;
      font-size: 0.373333rem;
      line-height: 2.3;
    }
  }

  .body-card-body {
    background-color: rgb(255, 255, 255);
    padding: 0.2rem;
    font-size: 0.373333rem;

    .body-card-body-name {
      font-weight: 700;
      font-size: 0.533333rem;
      color: #202020;
      letter-spacing: 0px;
      line-height: 2;
      max-width: 2.2rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .body-card-body-button {
      height: 0.5rem;
      border-style: none;
      border-color: unset;
      color: #5e74fe;
      border-radius: 0.25rem;
      text-align: center;
      line-height: 17px;
      background: rgb(239, 241, 255);
      padding: 0.4rem 0.1rem;
    }

    .body-card-body-a {
      color: #aaa;
      margin-top: 0.2rem;
      max-width: 11rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .foot {
      margin-top: 0.1rem;
      border-top: 1px solid #ddd;
      padding: 0.1rem 0;

      .foot-button {
        border: 2px solid #2f59f6;
        height: 0.75rem;
        margin-left: 0.1rem;
        margin-top: 0.1rem;
        border-radius: 25px 25px 25px 25px;
        color: #2f59f6;
      }
    }
  }
}
</style>
