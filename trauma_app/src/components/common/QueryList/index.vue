<template>
  <div class="query-list-main">
    <div>
      <van-search readonly class="query-list-search" :value="values[mainCondition.field]" shape="round"
        background="transparent" :placeholder="placeholder" right-icon="search" left-icon="" @click="openSearchPage" />
    </div>
    <div class="query-list" ref="queryList" @scroll="handleScroll" :style="{ overflow: 'auto', height: scrollheight }">
      <van-pull-refresh v-model="loading" @refresh="handleRefresh">
        <div class="query-list-item" v-for="(item, idx) in list" :key="idx">
          <slot name="listItem" :item="item" v-bind:index="idx">
            <van-cell>请自定义 listItem 插槽来显示列表项</van-cell>
          </slot>
        </div>
      </van-pull-refresh>

      <van-empty :image="require('@assets/image/empty.png')" description="暂无数据" v-if="!list.length" />
    </div>

    <med-popup-container position="right" duration="0.2" v-model="searchPageVisible" return-label="" @return="handleBack"
      scroll class="search-page-wrapper">
      <template #title>
        <van-search v-if="mainCondition" v-model="values[mainCondition.field]" shape="round" placeholder="患者姓名" />
      </template>
      <div class="search-page-main">
        <div class="search-page-field" v-for="condition in ordinaryConditions" :key="condition.field"
          v-show="visibleConditions.includes(condition.field)">
          <div class="search-page-field-title">
            {{ condition.title }}
            <span class="checkbox-subtitle" v-if="condition.type === 'checkbox'">(多选)</span>
          </div>
          <div class="search-page-field-control">
            <!-- 日期范围 -->
            <range-picker v-if="condition.type === 'range'" v-model="values[condition.field]"
              :disabled="condition.disabled" :readonly="condition.readonly">
            </range-picker>

            <!-- 单选 -->
            <med-radio-button-group v-if="condition.type === 'radio'" v-model="values[condition.field]"
              :dataSource="condition.options" :disabled="condition.disabled" :readonly="condition.readonly" />

            <!-- 下拉 -->

            <!-- 多选 -->
            <van-checkbox-group class="check-box" v-if="condition.type === 'checkbox'" v-model="values[condition.field]"
              :disabled="condition.disabled" :readonly="condition.readonly">
              <van-checkbox v-for="(item, idx) in condition.options" :key="idx" :name="item.value">{{ item.text ||
                item.label }}
              </van-checkbox>
            </van-checkbox-group>

            <!-- 输入框 -->
            <van-field style="border:1px solid #ccc;border-radius:10px;padding:20px 40px"
              v-if="condition.type === 'input'" v-model="values[condition.field]" :disabled="condition.disabled"
              :readonly="condition.readonly" />
          </div>
        </div>
      </div>
      <template #bottom-part>
        <goods-action class="goods-action-wrapper">
          <goods-action-button type="warning" text="重置" @click="handleReset" />
          <goods-action-button type="danger" text="确定" @click="handleOk()" />
        </goods-action>
      </template>
    </med-popup-container>
  </div>
</template>

<script>
import { GoodsAction, GoodsActionButton } from 'vant'
import moment from 'moment'
import RangePicker from './RangePicker'

function startOfDay() {
  return moment()
    .startOf('day')
    .format('YYYY-MM-DD HH:mm')
}

function now() {
  return moment().format('YYYY-MM-DD HH:mm')
}

// async function defaultSearch(formValues, pagi, callback) {
//   console.log(formValues)
//   let url = ''
//   switch (formValues.source) {
//     case '0':
//       // todo
//       url = thirdPartyUrl.getTriageList
//       break
//     case '1':
//       url = thirdPartyUrl.firstAidPatients
//       break
//     case '2':
//       url = thirdPartyUrl.firstAidPatients
//       break
//     case '3':
//       url = thirdPartyUrl.firstAidPatients
//       break
//   }
//   const params = {
//     patientName: formValues.patientName,
//     fromDate: formValues.time[0],
//     toDate: formValues.time[1]
//   }
//   const result = await this.getGcPatients(url, params)
//   if (!result || !result.records) {
//     this.$notify({ type: 'danger', message: '无法获取患者列表' })
//     return
//   }
//   const list = result.records.map(e => ({ ...e, source: formValues.source }))
//   const pagination = {
//     ...pagi,
//     total: result.page
//   }
//   if (callback) callback({ list, pagination })
// }

let typeList = []

// const defaultConditions = [
//   {
//     field: 'source',
//     title: '类型',
//     type: 'radio',
//     get options() {
//       return typeList
//     }
//   },
//   {
//     field: 'name',
//     title: '姓名',
//     type: 'input',
//     isMain: true
//   },
//   {
//     field: 'time',
//     title: '时间',
//     type: 'range'
//   }
// ]

export default {
  name: 'QueryList',
  components: {
    GoodsAction,
    GoodsActionButton,
    RangePicker
  },
  props: {
    conditions: {
      type: Array,
      default: () => []
    },
    formValues: {
      type: Object,
      default: () => ({})
    },
    customSearch: {
      type: Function,
      default: () => { }
    },
    placeholder: {
      type: String,
      default: '搜索'
    }
  },
  data() {
    return {
      loading: false,
      values: { ...this.formValues },
      lastQuery: {},
      isMounted: false,
      activeTimePanel: '',
      searchPageVisible: false,
      showDatePicker: false,
      list: [],
      pagination: {
        current: 1,
        pageSize: 10,
        pages: 1
      }
    }
  },
  computed: {
    mainCondition() {
      return this.conditions.find(c => c.isMain)
    },
    ordinaryConditions() {
      return this.conditions.filter(c => !c.isMain)
    },
    scrollheight() {
      const defaultHeight = 500
      if (!this.isMounted || !this.$refs?.queryList) {
        return defaultHeight
      }
      return `${document.body.offsetHeight -
        this.$refs.queryList.offsetTop -
        68}px`
    },
    visibleConditions() {
      return (
        this.conditions.filter(c => this.checkVisible(c)).map(c => c.field) ||
        []
      )
    },
    hiddenConditions() {
      return (
        this.conditions.filter(c => !this.checkVisible(c)).map(c => c.field) ||
        []
      )
    }
  },
  methods: {
    checkVisible(condition) {
      let visible = !condition.hidden
      if (typeof condition.hidden === 'function') {
        visible = !condition.hidden(this.values)
      }
      return visible
    },
    handleRefresh() {
      this.pagination.current = 1
      this.handleSearch()
    },
    handleScroll(e) {
      const {
        target: { offsetHeight, scrollTop, scrollHeight }
      } = e
      const atBottom = scrollHeight - offsetHeight - scrollTop <= 5
      const loadedAll = this.pagination.current >= this.pagination.pages
      if (atBottom && !loadedAll && !this.loading) {
        this.handleReachBottom()
      }
    },
    handleReset() {
      this.values = { ...this.formValues }
    },
    handleBack() {
      this.searchPageVisible = false
      this.values = { ...this.lastQuery }
    },
    openSearchPage() {
      this.searchPageVisible = true
    },
    async getDefaultOptions() {
      typeList = [
        { text: '急诊', value: '0' },
        { text: '门诊', value: '1' },
        { text: '住院', value: '2' },
        { text: '急救', value: '3' }
      ]
    },
    handleReachBottom() {
      const newPagi = {
        ...this.pagination,
        current: this.pagination.current + 1
      }

      this.handleSearch(newPagi)
    },
    handleOk() {
      this.$emit('confirm', this.values)
      this.handleSearch()
    },
    handleSearch(pagi, callFromOutside) {
      this.loading = true
      this.searchPageVisible = false
      this.hiddenConditions.forEach(m => {
        if (this.values.hasOwnProperty(m)) this.values[m] = this.formValues[m]
      })
      this.lastQuery = { ...this.values }
      this.customSearch(
        this.values,
        pagi || this.pagination,
        res => {
          this.loading = false
          if (res) {
            const { list = [], pagination = {} } = res
            this.pagination = { ...this.pagination, ...pagination }
            this.list = pagi ? this.list.concat(list) : list
          }
        },
        callFromOutside
      )
    }
  },
  watch: {
    loading(bool) {
      if (bool) {
        this.toast = this.$toast.loading({
          duration: 0, // 持续展示 toast
          // forbidClick: true,
          message: '加载中...'
        })
      } else if (this.toast) {
        this.toast.clear()
      }
    },
    formValues: {
      handler(val) {
        this.values = { ...this.values, ...val }
        this.hiddenConditions.forEach(c => {
          const matched = this.conditions.find(el => el.field === c)
          if (matched && !matched.keepValue) {
            this.values[c] = undefined
          }
        })
      },
      immediate: true
    },
    values: {
      deep: true,
      handler(val) {
        this.$emit('valuesChange', val)
      }
    },
    visibleConditions(val, oldVal) {
      const shown = val
        .concat(oldVal)
        .filter(el => val.includes(el) && !oldVal.includes(el))
      const hidden = val
        .concat(oldVal)
        .filter(el => !val.includes(el) && oldVal.includes(el))
      if (shown.length) {
        shown.forEach(field => {
          const matched = this.conditions.find(el => el.field === field)
          if (matched && !matched.keepValue) {
            this.values[field] = this.formValues[field]
          }
        })
      }
      if (hidden.length) {
        hidden.forEach(field => {
          const matched = this.conditions.find(el => el.field === field)
          if (matched && !matched.keepValue) {
            this.values[field] = undefined
          }
        })
      }
    },
    // 跳转进来刷新页面
    '$route.path': {
      handler(val) {
        const isEnter = val === '/gc/patientList'
        if (isEnter) {
          this.handleSearch()
        } else {
          this.handleReset()
          this.pagination.current = 1
          if (this.toast) {
            this.toast.clear()
          }
        }
      }
    }
  },
  filters: {
    pickerTitle(type) {
      switch (type) {
        case 'start':
          return '开始时间'
        case 'end':
          return '结束时间'
        default:
          return '选择时间'
      }
    }
  },
  created() {
    this.getDefaultOptions()
  },
  mounted() {
    this.handleSearch()
    this.isMounted = true
  },
  beforeDestroy() {
    if (this.toast) {
      this.toast.clear()
    }
  }
}
</script>
<style lang="less" scoped>
@import "@/assets/styles/common/search/wrapper.less";

.query-list {
  padding: 0 0.3rem;

  &-main {
    position: relative;
    z-index: 1;
  }

  &-search {
    margin: 0 auto;
    width: 90%;
  }

  &-item {
    margin-bottom: 20px;
  }

  &-title>div:not(:last-of-type) {
    padding-right: 0.5rem;
  }

  &-name {
    color: #444fdb;
    font-weight: bold;
    font-size: 0.39rem;
  }

  &-conditions {
    /deep/ .van-dropdown-menu__bar {
      height: 0.8rem;

      .van-dropdown-menu__title {
        font-size: 0.37rem;
      }
    }
  }
}
</style>
