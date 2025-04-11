<template>
  <div>
    <div
      class="firstaid-list-wrapper"
      title="推送"
      return-label=""
      @return="exit"
    >
      <div class="firstaid-list-wrapper-main">
        <van-search
          class="firstaid-list-wrapper-search flex-c-c"
          readonly
          v-model="query.text"
          shape="round"
          background="transparent"
          placeholder="按照患者姓名搜索"
          right-icon="search"
          left-icon=""
          @click="openSearchPage"
        />
        <van-pull-refresh
          :disabled="pullDisabled"
          v-model="loading"
          @refresh="handleSearch"
        >
          <div
            class="firstaid-list-wrapper-list"
            ref="scrollBox"
            @scroll.stop="handleScroll"
          >
            <div class="card-item" v-for="item in list" :key="item.id">
              <div class="card-item-top flex-c-s">
                <span v-if="item.pushTime">{{ item.pushTime }}</span>
              </div>
              <div
                class="card-item-center"
                @click="
                  jump(
                    item.source === 'phep'
                      ? '/patient/firstaid'
                      : '/patient/piatPreview',
                    item
                  )
                "
              >
                <div class="card-item-title flex-c-b">
                  <div class="card-item-title-left flex-c-s">
                    <div class="name">{{ item.name }}</div>
                    <div :class="genderClass(item.gender)"></div>
                    <div class="age">{{ item.age }}</div>
                    <div :class="['badge', 'from', '']">
                      {{ item.source | comingTypeFilter }}
                    </div>
                  </div>
                </div>
                <p v-if="item.callTime">呼救时间 : {{ item.callTime }}</p>
                <p v-if="item.triageTime">分诊时间 : {{ item.triageTime }}</p>
                <p v-if="item.diagnosis">诊断：{{ item.diagnosis }}</p>
                <p v-if="item.patientSay">主诉：{{ item.patientSay }}</p>
              </div>
              <div class="card-item-bottom flex-c-b">
                <van-icon />
                <div class="btns">
                  <van-button
                    round
                    color="#5E74FE"
                    plain
                    @click.stop="handleBind(item)"
                  >
                    建档
                  </van-button>
                </div>
              </div>
            </div>
            <van-empty
              v-if="!loading && (!list || !list.length)"
              :image="require('@assets/image/empty.png')"
              description="暂无数据"
            />
          </div>
        </van-pull-refresh>
      </div>
    </div>
    <med-popup-container
      class="firstaid-list-wrapper"
      title="患者搜索"
      return-label=""
      v-model="searchPageVisible"
    >
      <div class="search-page-wrapper">
        <div class="search-page-main">
          <van-search
            v-model="query.text"
            shape="round"
            placeholder="按照患者姓名搜索"
          />
          <div class="search-page-field">
            <div class="search-page-field-title">
              类型
            </div>
            <div class="search-page-field-control">
              <med-radio-group v-model="query.type" :dataSource="typeList" />
            </div>
            <div class="search-page-field-title">
              时间
            </div>
            <div class="search-page-field-control">
              <div class="range-picker flex-c-c">
                <med-date-picker
                  v-model="query.beginTime"
                  label=""
                  placeholder="开始时间"
                  clearable
                />
                <span> ~ </span>
                <med-date-picker
                  v-model="query.endTime"
                  label=""
                  placeholder="结束时间"
                  clearable
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #bottom-part>
        <div class="bottom-button">
          <van-button
            plain
            color="#2b65f8"
            @click="query = defaultFormValues()"
            size="small"
          >
            重置
          </van-button>
          <van-button
            color="#2b65f8"
            @click="getPreHospitalPushList"
            size="small"
          >
            确定
          </van-button>
        </div>
      </template>
    </med-popup-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Dialog } from 'vant'
import moment from 'moment'
import das from '@constant/das'
import hospitalMixin from '@mixins/hospitalMixin'

const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

const fromDate = moment()
  .startOf('day')
  .subtract(2, 'days')
  .format('YYYY-MM-DD HH:mm')
const toDate = moment()
  .endOf('day')
  .format('YYYY-MM-DD HH:mm')

export default {
  // 推送
  name: 'FirstaidList',
  mixins: [hospitalMixin],
  data() {
    return {
      pullDisabled: false,
      toast: null,
      loading: false,
      query: this.defaultFormValues(),
      typeList: [
        {
          label: '急救',
          value: 'phep'
        },
        {
          label: '急诊',
          value: 'piat'
        }
      ],
      lastQuery: {},
      searchPageVisible: false,
      list: [],
      pagination: {
        pageIndex: 1,
        pageSize: 5,
        pages: 1
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    const keepPath = ['/patient/firstaid', '/patient/document/addInformation', '/document/index', '/patient/piatPreview']
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
  created() {
    this.getPreHospitalPushList()
  },
  computed: {
    ...mapGetters(['hospitalId', 'hospitalArea', 'curHospitalArea', 'appName']),
    curHospitalAreaName() {
      const matched = this.hospitalArea.find(
        el => el.value === this.curHospitalArea
      )
      return matched?.label
    }
  },
  methods: {
    defaultFormValues() {
      return {
        beginTime: `${fromDate}`,
        endTime: `${toDate}`,
        sysId: das.sysId,
        status: '1',
        includeEmpty: true,
        dateType: 0,
        type: '',
        source: ''
      }
    },
    // 页面跳转使用
    jump(path, item) {
      if (item) {
        this.$router.push({
          path,
          query: { patientHistory: item }
        })
      } else {
        this.$router.push({
          path
        })
      }
    },
    handleBack() {
      this.searchPageVisible = false
      this.query = { ...this.lastQuery }
    },
    handleScroll(e) {
      const {
        target: { offsetHeight, scrollTop, scrollHeight }
      } = e
      const atBottom = scrollHeight - offsetHeight - scrollTop <= 5
      const atTop = scrollTop === 0
      if (atTop) {
        this.pullDisabled = false
      } else {
        this.pullDisabled = true
      }
      const loadedAll = this.pagination.pageIndex >= this.pagination.pages
      if (atBottom && !loadedAll && !this.loading) {
        this.handleSearch((this.pagination?.pageIndex || 0) + 1)
      }
    },
    handleViewDetail(item) {
      const data = { id: item.id, status: '2' }
      this.$api.preHospitalPush.updateStatus(data)
    },
    async handleBind(item) {
      try {
        const type = item.source === 'phep' ? 1 : 2
        item.type = type
        if (!item.relationId) {
          throw new Error('没有relationId')
        }
        const p = {
          hospitalId: this.hospitalAndArea(),
          relationId: item.relationId,
          visitId: item.relationId,
          type
        }
        const res = await this.$api.service.getEmIdPatient(p)
        if (res.status === 200) {
          if (res.result.isRegister) {
            this.$toast('该患者已建档')
          } else {
            item.emId = res.result.emId
            this.$router.push({
              path: '/patient/document/addInformation',
              query: { from: 'import', patientHistory: { ...item } }
            })
          }
        } else {
          throw new Error(res.message || '接口异常')
        }
      } catch (err) {
        this.$notify(err.message)
      }
    },
    async handleSearch(page) {
      this.lastQuery = { ...this.query }
      this.loading = true
      this.searchPageVisible = false
      const params = {
        ...this.query,
        beginTime:
          this.query.beginTime ||
          this.$moment()
            .subtract(3, 'days')
            .format('YYYY-MM-DD HH:mm'),
        endTime:
          this.query.endTime || this.$moment().format('YYYY-MM-DD HH:mm'),
        hospitalId: this.hospitalAndArea(),
        source: this.query.type
      }
      const res = await this.$api.preHospitalPush.getPreHospitalPushList(params)

      // 滚动加载在尾部追加
      if (res.code === 0) {
        this.list = [...res.data]
      }

      // 非滚动加载自动将列表滚回顶部
      if (!page && this.$refs.scrollBox) {
        this.$refs.scrollBox.scrollTop = 0
      }

      // 避免误触滚动事件
      setTimeout(() => {
        this.loading = false
      }, 200)
    },
    openSearchPage() {
      this.searchPageVisible = true
    },
    genderClass(sex) {
      let className = 'gender'
      switch (sex) {
        case '1':
          className += ' male iconfont'
          break
        case '2':
          className += ' female iconfont'
          break
        default:
          break
      }
      return className
    },
    // 跳转页面
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

    // 查询院前推送列表
    async getPreHospitalPushList() {
      const response = await this.$api.preHospitalPush.getPreHospitalPushList({
        ...this.query,
        hospitalId: this.hospitalAndArea(),
        source: this.query.type
      })
      if (response.success) {
        this.list = response.data
        this.searchPageVisible = false
      }
    }
  },
  watch: {
    loading(bool) {
      if (bool) {
        this.toast = this.$toast.loading({
          duration: 0,
          message: '加载中...'
        })
      } else if (this.toast) {
        this.toast.clear()
      }
    },
    '$route.path': {
      handler(val) {
        const isEnter = val === '/patient/preHospitalPush'
        if (isEnter) {
          this.handleSearch()
        }
      }
    },
    'query.type': {
      deep: true,
      handler(val) {
        if (val === 'phep') {
          const diffs = this.$moment(this.query.endTime).diff(this.$moment(this.query.beginTime), 'day')
          if (diffs <= 2 && diffs >= 0) return
          const beginTime = this.$moment(this.query.endTime).startOf('day').subtract(2, 'days').format('YYYY-MM-DD HH:mm')
          if (beginTime === this.query.beginTime) return
          this.$set(this.query, 'beginTime', beginTime)
        }
      }
    },
    'query.beginTime': {
      deep: true,
      handler(val) {
        if (this.query.type === 'phep' && val) {
          const diffs = this.$moment(this.query.endTime).diff(this.$moment(val), 'day')
          if (diffs <= 2 && diffs >= 0) return
          const endTime = this.$moment(val).endOf('day').add(2, 'days').format('YYYY-MM-DD HH:mm')
          if (endTime === this.query.endTime) return
          this.$set(this.query, 'endTime', endTime)
        }
      }
    },
    'query.endTime': {
      deep: true,
      handler(val) {
        if (this.query.type === 'phep' && val) {
          const diffs = this.$moment(val).diff(this.$moment(this.query.beginTime), 'day')
          if (diffs <= 2 && diffs >= 0) return
          const beginTime = this.$moment(val).startOf('day').subtract(2, 'days').format('YYYY-MM-DD HH:mm')
          if (beginTime === this.query.beginTime) return
          this.$set(this.query, 'beginTime', beginTime)
        }
      }
    }
  },
  filters: {
    comingTypeFilter(type) {
      switch (type) {
        case 'phep':
          return '急救'
        default:
          return '急诊'
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
