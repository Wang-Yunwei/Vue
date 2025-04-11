<template>
  <div>
    <med-view-container
      class="firstaid-list-wrapper"
      @return="back"
      return-label=""
    >
      <template #title>
        <div class="med-header-title-slot">
          <div>
            卒中档案
          </div>
          <div class="med-select-value">
            {{ getCurHosArea() }}
          </div>
        </div>
      </template>
      <template #bottom-part>
        <van-tabbar :value="tabActive">
          <van-tabbar-item
            name="strokeGcList"
            icon="home-o"
            @click="jump('/gc/fileList')"
          >
            <template #icon="props">
              <med-svg icon-class="iconlvtong-bingli" />
            </template>
            档案
          </van-tabbar-item>
          <van-tabbar-item
            name="preHospitalPush"
            icon="search"
            v-if="$entitled('list-transfer')"
            @click="jump('/gc/preHospitalPush')"
          >
            <template #icon="props">
              <med-svg icon-class="iconlvtong-tuisong" />
            </template>
            推送
          </van-tabbar-item>
        </van-tabbar>
      </template>
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
                      ? '/gc/preHospitalPreview'
                      : '/gc/piatPreview',
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
                    >建档
                  </van-button>
                </div>
              </div>
            </div>
            <van-empty
              v-if="list.length === 0"
              :image="require('@assets/image/empty.png')"
              description="暂无数据"
            />
          </div>
        </van-pull-refresh>
      </div>
    </med-view-container>
    <med-popup-container
      class="firstaid-list-wrapper"
      title="患者搜索"
      returnLabel=""
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
            <div class="search-page-field-title">类型</div>
            <div class="search-page-field-control">
              <van-checkbox-group v-model="type" direction="horizontal">
                <van-checkbox
                  v-for="item in typeList"
                  :key="item.value"
                  :name="item.value"
                  >{{ item.label }}</van-checkbox
                >
              </van-checkbox-group>
            </div>
            <div class="search-page-field-title">
              时间
            </div>
            <div class="search-page-field-control">
              <med-range-picker
                :beginTime.sync="query.fromDate"
                :endTime.sync="query.toDate"
                maxRange="3days"
              />
              <!-- <div class="range-picker flex-c-c">
                <med-date-picker
                  v-model="query.fromDate"
                  label=""
                  placeholder="开始时间"
                  clearable
                />
                <span> ~ </span>
                <med-date-picker
                  v-model="query.toDate"
                  label=""
                  placeholder="结束时间"
                  clearable
                />
              </div> -->
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
          <van-button color="#2b65f8" @click="handleSearch" size="small">
            确定
          </van-button>
        </div>
      </template>
    </med-popup-container>
  </div>
</template>

<script>
import { GoodsAction, GoodsActionButton } from 'vant'
import { mapGetters } from 'vuex'
import hospitalMixin from '@mixins/hospitalMixin'
import moment from 'moment'

const fromDate = moment()
  .startOf('day')
  .subtract(3, 'days')
  .format('YYYY-MM-DD HH:mm:ss')
const toDate = moment()
  .endOf('day')
  .format('YYYY-MM-DD HH:mm:ss')

export default {
  // 院前推送
  name: 'FirstaidList',
  components: { GoodsAction, GoodsActionButton },
  mixins: [hospitalMixin],
  data() {
    return {
      tabActive: 'preHospitalPush',
      toast: null,
      query: this.defaultFormValues(),
      lastQuery: {},
      searchPageVisible: false,
      list: [],
      pullDisabled: false,
      loading: false,
      pagination: {
        current: 1,
        pageSize: 5,
        pages: 1
      },
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
      details: {
        hospitalId: '',
        relationId: '',
        type: ''
      }
    }
  },
  // 钩子方法
  created() {
    // 获取基本信息
    this.handleSearch()
  },
  mounted() {
    this.$backhelper.push(() => {
      this.back()
    })
  },
  computed: {
    ...mapGetters(['hospitalArea', 'curHospitalArea']),
    type: {
      get() {
        if (this.query.type === '') {
          return []
        }
        if (this.query.type === undefined) {
          // 全选传到后台是空(查全部)
          return ['phep', 'piat']
        }
        return [this.query.type]
      },
      set(v) {
        const length = v ? v.length : 0
        if (length === 0) {
          this.query.type = ''
        } else if (length === 1) {
          this.query.type = v[0]
        } else {
          this.query.type = undefined
        }
      }
    }
  },
  methods: {
    defaultFormValues() {
      return {
        type: '',
        text: '',
        fromDate: `${fromDate}`,
        toDate: `${toDate}`
      }
    },
    onEdit(a, b) {
      console.log(a, b)
    },
    // 页面跳转使用
    jump(path, item) {
      let param = { path }
      if (item) {
        param = {
          ...param,
          query: item
        }
      }
      this.$router.push(param)
    },
    async handleBind(item) {
      if (item.relationId) {
        this.details.hospitalId = this.hospitalAndArea()
        this.details.type = item.source === 'phep' ? '1' : '2'
        this.details.relationId = item.relationId
        const response = await this.$api.basicInfo.getEmIdPatient(this.details)
        if (response.status === 200 && response.result) {
          this.$toast('该患者已建档')
          return
        }
      }
      this.$router.push({
        name: 'createPatientHistory',
        query: { patientHistory: item }
      })
    },
    handleBack() {
      this.searchPageVisible = false
      this.query = { ...this.lastQuery }
    },
    async handleSearch() {
      this.lastQuery = { ...this.query }
      this.loading = true
      this.searchPageVisible = false

      const res = await this.$api.preHospitalPush.getPreHospitalList({
        status: 1,
        beginTime:
          this.query.fromDate ||
          this.$moment()
            .subtract(3, 'days')
            .format('YYYY-MM-DD HH:mm:ss'),
        endTime:
          this.query.toDate || this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        includeEmpty: true,
        hospitalId: this.hospitalAndArea(),
        source: this.query.type,
        name: this.query.text
      })
      if (res.status === 200 && res.code === '0') {
        this.list = res.result
        console.log('pushlist', res.result)
      }
      // 避免误触滚动事件
      setTimeout(() => {
        this.loading = false
      }, 200)
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
      const loadedAll = this.pagination.current >= this.pagination.pages
      if (atBottom && !loadedAll && !this.loading) {
        this.handleSearch((this.pagination?.current || 0) + 1)
      }
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
    back() {
      this.$dialog
        .confirm({
          title: '提示',
          message: '确定要退出卒中工作站?',
          confirmButtonColor: '#5e74fe'
        })
        .then(() => {
          // 确定
          this.$bridge.callhandler('finishPager', {}, async data => {})
        })
        .catch(() => {
          this.$backhelper.push(() => {
            this.back()
          })
        })
    },
    getCurHosArea() {
      return this.hospitalArea.find(item => item.value === this.curHospitalArea)
        .label
    }
  },
  watch: {
    '$route.path': {
      handler(val) {
        const isEnter = val === '/gc/preHospitalPush'
        if (isEnter) {
          this.handleSearch()
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
.bottom-button {
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
.med-select-value {
  font-size: 26px;
}
/deep/ .van-checkbox {
  margin: 0;
  .van-checkbox__icon {
    display: none;
  }

  .van-checkbox__label {
    margin: 6px;
    font-size: 26px;
    line-height: 80px;
    border-radius: 15px;
    padding: 0 20px;
    background-color: rgb(239, 241, 255);
  }

  .van-checkbox__icon--checked + .van-checkbox__label {
    background-color: #2b65f8;
    border-color: #2b65f8;
    color: #fff;
  }
}
</style>
