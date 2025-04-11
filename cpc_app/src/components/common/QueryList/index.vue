<template>
  <div class="query-list-main">
    <div>
      <van-search
        readonly
        class="query-list-search"
        :value="values[mainCondition.field]"
        shape="round"
        background="transparent"
        :placeholder="placeholder"
        right-icon="search"
        left-icon=""
        @click="openSearchPage"
      />
    </div>
    <div
      class="query-list"
      ref="queryList"
      @scroll="handleScroll"
    >
      <van-pull-refresh v-model="loading" @refresh="handleRefresh">
        <div class="query-list-item" v-for="(item, idx) in list" :key="idx">
          <slot name="listItem" :item="item" v-bind:index="idx">
            <van-cell>请自定义 listItem 插槽来显示列表项</van-cell>
          </slot>
        </div>
      </van-pull-refresh>

      <van-empty
        :image="require('@assets/image/empty.png')"
        description="暂无数据"
        v-if="!list.length"
      />
    </div>

    <med-popup-container
      v-model="searchPageVisible"
      class="filelist-pop-right"
      title="病案搜索"
      returnLabel=""
    >
      <div class="search-page-wrapper">
        <med-header @backClick="handleBack" :title="title" />
        <van-search
          v-if="mainCondition"
          v-model="values[mainCondition.field]"
          shape="round"
          placeholder="患者姓名"
        />
        <div class="search-page-main">
          <div
            class="search-page-field"
            v-for="condition in ordinaryConditions"
            :key="condition.field"
            v-show="visibleConditions.includes(condition.field)"
          >
            <div class="search-page-field-title">
              {{ condition.title }}
              <span
                class="checkbox-subtitle"
                v-if="condition.type === 'checkbox'"
                >(多选)</span
              >
            </div>
            <div class="search-page-field-control">
              <!-- 日期范围 -->
              <div
                class="range-picker flex-c-c"
                v-if="condition.type === 'range'"
              >
                <med-date-picker
                  v-model="sTime"
                  label=""
                  placeholder="开始时间"
                  :disabled="condition.disabled"
                  :readonly="condition.readonly"
                />
                <span> ~ </span>
                <med-date-picker
                  v-model="eTime"
                  label=""
                  placeholder="结束时间"
                  :disabled="condition.disabled"
                  :readonly="condition.readonly"
                />
              </div>

              <!-- 单选 -->
              <med-radio-group
                v-if="condition.type === 'radio'"
                v-model="values[condition.field]"
                :dataSource="condition.options"
                :disabled="condition.disabled"
                :readonly="condition.readonly"
              />

              <!-- 下拉 -->
              <med-select
                v-if="condition.type === 'select'"
                v-model="values[condition.field]"
                :options="condition.options"
                class="select"
                :disabled="condition.disabled"
                :readonly="condition.readonly"
              />

              <!-- 多选 -->
              <van-checkbox-group
                class="check-box"
                v-if="condition.type === 'checkbox'"
                v-model="values[condition.field]"
                :disabled="condition.disabled"
                :readonly="condition.readonly"
              >
                <van-checkbox
                  v-for="(item, idx) in condition.options"
                  :key="idx"
                  :name="item.value"
                  >{{ item.text || item.label }}
                </van-checkbox>
              </van-checkbox-group>

              <!-- 输入框 -->
              <van-field
                style="border:1px solid #ccc;border-radius:10px;padding:20px 40px"
                v-if="condition.type === 'input'"
                v-model="values[condition.field]"
                :disabled="condition.disabled"
                :readonly="condition.readonly"
              />
            </div>
          </div>
        </div>
      </div>
      <template #bottom-part>
        <div class="bottom-button">
          <van-button plain color="#2b65f8" @click="handleReset" size="small">
            重置
          </van-button>
          <van-button color="#2b65f8" @click="handleOk" size="small">
            确定
          </van-button>
        </div>
      </template>
    </med-popup-container>
  </div>
</template>

<script>
import { GoodsAction, GoodsActionButton } from 'vant'

let typeList = []

export default {
  name: 'QueryList',
  components: {
    GoodsAction,
    GoodsActionButton
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
      default: () => {}
    },
    placeholder: {
      type: String,
      default: '搜索'
    },
    defaultQuery: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      sTime: '',
      eTime: '',
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
    title() {
      return this.$route.query.importType === 'add' ? '患者搜索' : '关联患者'
    },
    mainCondition() {
      return this.conditions.find(c => c.isMain)
    },
    ordinaryConditions() {
      return this.conditions.filter(c => !c.isMain)
    },
    scrollheight() {
      const defaultHeight = 1400
      if (!this.isMounted || !this.$refs?.queryList) {
        return defaultHeight
      }
      return `${document.body.offsetHeight - this.$refs.queryList.offsetTop - 116}px`
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
      this.sTime = this.formValues.time[0]
      this.eTime = this.formValues.time[1]
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
      this.$emit('confirm', { ...this.values, time: [this.sTime, this.eTime] })
      this.handleSearch()
    },
    handleSearch(pagi, callFromOutside) {
      this.loading = true
      this.searchPageVisible = false
      this.lastQuery = { ...this.values, time: [this.sTime, this.eTime] }
      this.customSearch(
        { ...this.values, time: [this.sTime, this.eTime] },
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
        this.values = {
          ...this.values,
          ...val,
          time: [this.sTime, this.eTime]
        }

        // 20220429注释掉 因初始化会清除hidden项的值
        // this.hiddenConditions.forEach(c => {
        //   const matched = this.conditions.find(el => el.field === c)
        //   // keepValue控制 控件因为查询条件之间联动导致隐藏/显示的,是否在隐藏/显示时保留原值不变
        //   if (matched && !matched.keepValue) {
        //     this.values[c] = undefined
        //   }
        // })
      },
      deep: true,
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
            // keepValue控制 控件因为查询条件之间联动导致隐藏/显示的,是否在隐藏/显示时保留原值不变
            this.values[field] = undefined
          }
        })
      }
    },
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
    },
    'values.type': {
      deep: true,
      handler(val) {
        if (val === '1') {
          const diffs = this.$moment(this.eTime).diff(this.$moment(this.sTime), 'day')
          if (diffs <= 2 && diffs >= 0) return
          const sTime = this.$moment(this.eTime).startOf('day').subtract(2, 'days').format('YYYY-MM-DD HH:mm')
          if (sTime === this.sTime) return
          this.sTime = sTime
        }
      }
    },
    sTime: {
      deep: true,
      handler(val) {
        if (this.values.type === '1' && val) {
          const diffs = this.$moment(this.eTime).diff(this.$moment(val), 'day')
          if (diffs <= 2 && diffs >= 0) return
          const eTime = this.$moment(val).endOf('day').add(2, 'days').format('YYYY-MM-DD HH:mm')
          if (eTime === this.eTime) return
          this.eTime = eTime
        }
      }
    },
    eTime: {
      deep: true,
      handler(val) {
        if (this.values.type === '1' && val) {
          const diffs = this.$moment(val).diff(this.$moment(this.sTime), 'day')
          if (diffs <= 2 && diffs >= 0) return
          const sTime = this.$moment(val).startOf('day').subtract(2, 'days').format('YYYY-MM-DD HH:mm')
          if (sTime === this.sTime) return
          this.sTime = sTime
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
    this.sTime = this.formValues.time[0]
    this.eTime = this.formValues.time[1]
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
  padding: 0 20px;
  height: 1330px;
  overflow: auto;
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

  &-title > div:not(:last-of-type) {
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

.search-page-wrapper {
  height: 80%;
}

.bottom-button {
  height: 1.4rem;
  padding: 16px 40px;
  display: flex;

  button {
    flex-grow: 1;
  }

  button:nth-child(1) {
    border-radius: 1rem 0 0 1rem;
  }

  button:nth-child(2) {
    border-radius: 0 1rem 1rem 0;
  }
}
</style>
