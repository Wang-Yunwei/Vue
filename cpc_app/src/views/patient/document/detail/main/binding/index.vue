<template>
    <med-view-container title="绑定患者" @return="backClick">
      <!-- 筛选条件 -->
      <van-dropdown-menu class="top" :close-on-click-outside="false">
        <van-dropdown-item ref="name">
          <template #title>
            <span>{{
              search.patientName ? search.patientName : "姓名"
            }}</span>
          </template>
          <van-search
            v-model="search.patientName"
            show-action
            placeholder="请输入姓名查询"
            @search="onSelect"
          >
            <template #action>
              <div @click="onSelect">搜索</div>
            </template>
          </van-search>
        </van-dropdown-item>
        <van-dropdown-item
          v-model="search.type"
          :options="preDiagnosisOption"
          @change="onSubmit"
        />
        <van-dropdown-item
          v-model="search.time"
          :options="timeOptions"
          @change="timeChange"
        />
      </van-dropdown-menu>
      <van-row gutter="24" class="condition-date">
        <van-col span="11">
          <med-date-picker
            v-model="search.fromDate"
            formatter="YYYY-MM-DD"
            placeholder="开始日期"
            type="date"
            :disabled="timeDisabled"
            minDate="2021-01-01"
            @confirm="onSubmit(true)"
          />
        </van-col>
        <van-col span="2">
          <div>到</div>
        </van-col>
        <van-col span="11">
          <med-date-picker
            v-model="search.toDate"
            formatter="YYYY-MM-DD"
            placeholder="结束日期"
            type="date"
            :disabled="timeDisabled"
            minDate="2021-01-01"
            @confirm="onSubmit(true)"
          />
        </van-col>
      </van-row>
      <van-list
        v-model="addLoading"
        offset="1"
        :immediate-check="false"
        :finished="addFinished"
        :finished-text="list.length ? '没有更多了' : ''"
        @load="onLoad"
        class="scroll-box"
      >
        <van-pull-refresh
          v-model="addRefreshing"
          success-text="刷新成功"
          @refresh="onRefresh"
        >
          <add-card ref="addCard" :list="list" :type="search.type" @select="selectItem" />
        </van-pull-refresh>
      </van-list>
    </med-view-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { throttle } from 'lodash'
import hospitalMixin from '@mixins/hospitalMixin'
import AddCard from './addCard'

const timeOption = [
  { text: '近三天', value: 1 },
  { text: '自定义', value: 3 }
]
const timeOption2 = [
  { text: '近三天', value: 1 },
  { text: '近一周', value: 2 },
  { text: '自定义', value: 3 }
]

const preDiagnosisOption = [
  { text: '急救', value: '1' },
  { text: '急诊', value: '2' },
  { text: '门诊', value: '3' },
  { text: '住院', value: '4' }
]

export default {
  name: 'Binding',
  components: { AddCard },
  mixins: [hospitalMixin],
  data() {
    return {
      search: {
        hospitalAndArea: '',
        fromDate: '',
        toDate: '',
        type: '',
        patientName: '',
        time: ''
      },
      preDiagnosisOption,
      timeOption,
      timeOption2,
      timeDisabled: true,
      list: [],
      addLoading: false,
      addFinished: false,
      addRefreshing: false,
      current: 0,
      pageSize: 10
    }
  },
  props: {
    patientInfo: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters(['hospitalId', 'dictionary', 'curHospitalArea']),
    timeOptions() {
      return this.search.type === '1' ? timeOption : timeOption2
    }
  },
  mounted() {
    this.initOption()
    this.timeChange(this.search.time)
  },
  methods: {
    initOption() {
      this.search = {
        ...this.search,
        hospitalAndArea: this.hospitalAndArea(),
        patientName: this.patientInfo.name,
        fromDate: '',
        toDate: '',
        type: '2',
        time: 1
      }
    },
    backClick() {
      this.$emit('backClick')
    },
    convert(value, dic) {
      if (!value) return ''
      if (!dic || !Array.isArray(dic)) return value
      value = value.toString()
      return (dic.find(v => v.value === value) || { label: '' }).label
    },
    handleSeveralDay(days) {
      const fromDate = this.$moment()
        .subtract(days, 'days')
        .format('YYYY-MM-DD 00:00')
      const toDate = this.$moment().format('YYYY-MM-DD 23:59')
      this.timeDisabled = true
      this.$set(this.search, 'fromDate', fromDate)
      this.$set(this.search, 'toDate', toDate)
      this.onSubmit()
    },
    timeChange(val) {
      if (val === 1) {
        this.handleSeveralDay(3)
      } else if (val === 2) {
        this.handleSeveralDay(7)
      } else {
        this.timeDisabled = false
        this.onSubmit()
      }
    },
    onSelect() {
      this.$refs.name.toggle()
      this.onSubmit()
    },
    onSubmit(bool) {
      if (bool && this.search.time === 3 && this.search.type === '1') return
      this.list = []
      this.current = 1
      this.onSearch()
    },
    async onSearch() {
      this.addLoading = true
      const param = {
        current: this.current,
        pageSize: this.pageSize,
        ...this.search,
        fromDate: this.$moment(this.search.fromDate).format('YYYY-MM-DD 00:00'),
        toDate: this.$moment(this.search.toDate).format('YYYY-MM-DD 23:59')
      }
      try {
        const res = await this.$api.thirdParty.getGcThirdPartyPatients(param)
        if (res.status === 200) {
            this.addLoading = false
            this.addRefreshing = false
            console.log(res.result.records)
            this.list.push(...res.result.records)
            // 如果查询出来的数据少于pageSize，说明数据已被查询完，则关闭查询接口
            if (res.result.records.length < this.pageSize) {
              this.addFinished = true
            } else {
              this.addFinished = false
            }
          } else {
            throw new Error(res.message)
          }
      } catch (err) {
          this.$notify(err.message || '数据获取失败！！')
          this.addLoading = false
          this.addRefreshing = false
      }
    },
    onLoad: throttle(function() {
      // 清空列表数据
      if (this.addRefreshing) {
        this.list = []
        this.current = 0
        this.addRefreshing = false
      }
      // 重新加载数据
      this.current++
      this.onSearch()
      this.addLoading = false
    }, 1000),
    onRefresh() {
      this.addFinished = false
      this.addLoading = true
      this.onSubmit()
    },
    selectItem(item) {
      const newItem = { ...item, type: this.search.type }
      this.$emit('select', newItem, 'bind')
    }
  },
  watch: {
    'search.type': {
      deep: true,
      handler(val) {
        if (val === '1') {
          this.$set(this.search, 'time', 1)
          // this.handleSeveralDay(2)
        }
      }
    },
    'search.fromDate': {
      deep: true,
      handler(val) {
        if (this.search.time === 3 && this.search.type === '1' && val) {
          const diffs = this.$moment(this.search.toDate).diff(this.$moment(val), 'day')
          if (diffs <= 2 && diffs >= 0) return
          const toDate = this.$moment(val).endOf('day').add(2, 'days').format('YYYY-MM-DD HH:mm')
          if (toDate === this.search.toDate) return
          this.$set(this.search, 'toDate', toDate)
          this.onSubmit()
        }
      }
    },
    'search.toDate': {
      deep: true,
      handler(val) {
        if (this.search.time === 3 && this.search.type === '1' && val) {
          const diffs = this.$moment(val).diff(this.$moment(this.search.fromDate), 'day')
          if (diffs <= 2 && diffs >= 0) return
          const fromDate = this.$moment(val).startOf('day').subtract(2, 'days').format('YYYY-MM-DD HH:mm')
          if (fromDate === this.search.fromDate) return
          this.$set(this.search, 'fromDate', fromDate)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.top {
  position: fixed;
  top: 146px;
  z-index: 9;
  left: 0;
  right: 0;
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.1);

  /deep/ .van-dropdown-menu__bar {
    box-shadow: none;
  }
}

.condition-date {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  margin-top: 100px;
  position: fixed;
  z-index: 1;

  :deep(.van-field__control) {
    text-align: center;
  }
}
/deep/ .van-dropdown-item__option {
  .van-cell__title {
    max-width: 100% !important;
  }
}
.scroll-box {
  margin-top: 184px;
  height: calc(100vh - 4.37rem);
  overflow: auto;
  /deep/ .van-pull-refresh {
    padding-bottom: 2.5rem;
  }
  /deep/ .van-list__finished-text {
    margin-top: -2.5rem;
    height: 0;
  }
}
</style>
