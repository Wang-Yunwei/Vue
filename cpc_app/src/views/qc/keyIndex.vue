<template>
  <div class="med-key-index-wrapper">
    <div class="detail">
      <div class="condition">
        <van-dropdown-menu>
          <van-dropdown-item
            v-model="query.scope"
            :options="compareRangeDic"
            @open="open"
            @close="close"
            ref="dropMenu"
            @change="onScopeChanged"
          />
          <van-dropdown-item
            ref="item"
            :title="timeQueryTitle"
            @open="open"
            @close="close"
          >
            <div>
              <med-radio-select-field
                v-model="query.year"
                label="年份"
                :select-options="years"
                @confirm="onYearConfirm"
              >
              </med-radio-select-field>
              <med-radio-button-field
                v-model="query.yearsType"
                label="年平均"
                :select-options="createYearTypes()"
                @confirm="onYearTypeConfirm"
              />
              <med-radio-button-field
                v-model="query.quarterType"
                label="季度"
                :select-options="createQuarter()"
                @confirm="onQuarterTypeConfirm"
              />
              <med-radio-button-field
                v-model="query.month"
                label="月平均"
                :select-options="months"
                @confirm="onMonthConfirm"
              >
              </med-radio-button-field>
            </div>
          </van-dropdown-item>
        </van-dropdown-menu>
      </div>
      <!-- <van-pull-refresh v-model="refreshing" @refresh="onRefresh"> -->
      <!-- <van-list
        :loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      > -->
      <div class="scroll-view">
        <key-index-score
          :summary="qcIndex.summary"
          :description="qcIndex.description"
        />
        <van-row>
          <van-col span="24" v-for="item in qcIndex.indexs" :key="item.core">
            <key-index-card
              :index-value="item"
              :refer-type="query.scope"
              @click-card="onCardClick"
            />
          </van-col>
        </van-row>
      </div>
    </div>
    <!-- </van-list> -->
    <!-- </van-pull-refresh> -->
    <med-popup-container
      v-model="showDetail"
      :title="currentQcIndex.name"
      get-container="body"
      position="right"
      @return="onReturnClick"
    >
      <div class="key-index-detail-container">
        <key-index-detail
          v-if="showDetail"
          :core="currentQcIndex.core"
          :description="qcIndex.description"
          :parentQuery="query"
        ></key-index-detail>
      </div>
    </med-popup-container>
    <med-loading v-model="showLoading" />
  </div>
</template>

<script>
import moment from 'moment'
import keyIndexCard from './keyIndexCard.vue'
import keyIndexScore from './keyIndexScore.vue'
import keyIndexDetail from './keyIndexDetail.vue'
import { mapGetters, mapMutations } from 'vuex'
import * as types from '@/store/mutations/mutations-types'
export default {
  components: { keyIndexCard, keyIndexScore, keyIndexDetail },
  name: 'KeyIndex',
  comments: [keyIndexCard, keyIndexScore, keyIndexDetail],
  data() {
    return {
      searchVisible: false,
      query: {
        scope: '1',
        year: new Date().getFullYear().toString(),
        yearsType: '',
        quarterType: '',
        month: moment()
          .month()
          .toString(),
        start: moment(new Date())
          .add(-2, 'months')
          .format('YYYY-MM-DD'),
        end: moment(new Date()).format('YYYY-MM-DD')
      },
      buttonMonth: 'primary',
      buttonSixMonth: 'default',
      buttonYear: 'default',
      buttonCustom: 'default',
      showLoading: false,
      finished: false,
      compareRangeDic: [
        { text: '省内对比', value: '2' },
        { text: '市内对比', value: '3' },
        { text: '国内对比', value: '1' }
      ],
      timeRangeDic: [
        { text: '近3月', value: '1' },
        { text: '近6月', value: '2' },
        { text: '近1年', value: '3' }
      ],
      yearTypes: [
        { label: '整年', value: '1' },
        { label: '上半年', value: '2' },
        { label: '下半年', value: '3' }
      ],
      quarterTypes: [
        { label: '一季度', value: '1' },
        { label: '二季度', value: '2' },
        { label: '三季度', value: '3' },
        { label: '四季度', value: '4' }
      ],
      months: [
        { label: '1月', value: '1' },
        { label: '2月', value: '2' },
        { label: '3月', value: '3' },
        { label: '4月', value: '4' },
        { label: '5月', value: '5' },
        { label: '6月', value: '6' },
        { label: '7月', value: '7' },
        { label: '8月', value: '8' },
        { label: '9月', value: '9' },
        { label: '10月', value: '10' },
        { label: '11月', value: '11' },
        { label: '12月', value: '12' }
      ],
      qcIndex: {
        summary: '',
        description: '', // '数据源为截止到2022-07-25 00:00之前填报的数据，数据下次更新时间为2022-08-22',
        indexs: []
      },
      showDetail: false,
      currentQcIndex: {}
    }
  },
  mounted() {
    this.buildQuery()
    this.getKeyIndex()
    this.getUpdateTime()
  },
  // 钩子方法
  created() {
    this.createYear()
    this.createMonth()
  },
  computed: {
    timeQueryTitle() {
      const year = this.query.year
      if (this.query.yearsType) {
        const yearType = this.yearTypes.find(
          m => m.value === this.query.yearsType
        )
        return year + '年' + yearType.label
      } else if (this.query.quarterType) {
        const quarterType = this.quarterTypes.find(
          m => m.value === this.query.quarterType
        )
        return year + '年' + quarterType.label
      } else if (this.query.month) {
        const month = this.months.find(m => m.value === this.query.month)
        return year + '年' + month.label
      }
      return '时间范围'
    }
  },
  methods: {
    onLoad() {},
    ...mapMutations([types.SET_CURHOSPITALAREA]),
    createQuarter() {
      if (
        this.query.year ===
        moment()
          .year()
          .toString()
      ) {
        const quarter = moment().quarter()
        const quarterDesc = this.quarterTypes.slice(0, quarter - 1)
        return quarterDesc
      }
      return this.quarterTypes
    },
    createYearTypes() {
      if (
        this.query.year ===
          moment()
            .year()
            .toString() &&
        moment().month() === 0
      ) {
        return []
      } else if (
        this.query.year ===
        moment()
          .year()
          .toString()
      ) {
        const month = moment().month() + 1
        if (month > 6) {
          const yearsDesc = this.yearTypes.slice(0, 2).slice(1, 2)
          return yearsDesc
        }
      }
      return this.yearTypes
    },
    createYear() {
      this.years = []
      const year = moment().year()
      const month = moment().month()

      for (var i = year - 4; i <= year; i++) {
        this.years.push({
          label: `${i}`,
          value: `${i}`
        })
      }
    },
    createMonth() {
      this.months = []
      let month = moment().month()
      if (
        this.query.year ===
        moment()
          .year()
          .toString()
      ) {
        month = month + 1
      } else {
        month = 12
      }
      for (var i = 1; i <= month; i++) {
        this.months.push({
          label: `${i}月`,
          value: `${i}`
        })
      }
    },
    getKeyIndex() {
      this.showLoading = true
      this.$api.service.getKeyIndex(this.query).then(res => {
        if (res.status === 200 && res.result) {
          const result = res.result
          this.qcIndex.summary = result.score
          this.qcIndex.indexs = []
          if (result.hospitalIndexList) {
            this.qcIndex.indexs = result.hospitalIndexList.map(m => {
              return {
                code: m.coreId,
                core: m.core,
                name: m.coreName,
                value: m.value,
                result: m.isProblem === '1' ? 'NG' : 'OK',
                refer: m.avg,
                rank: `${m.rank ? m.rank : '--'}/${
                  m.finalRank ? m.finalRank : '--'
                }`,
                icon: this.getIcon(m.core)
              }
            })
          }
        } else {
          this.$notify({ type: 'warning', message: '质控指标信息获取失败' })
        }
        this.showLoading = false
      })
    },
    getUpdateTime() {
      this.showLoading = true
      this.$api.service.getUpdateTime().then(res => {
        if (res.status === 200 && res.result) {
          this.qcIndex.description = res.result.updateMsg.replace('*', '')
        } else {
          this.$notify({ type: 'warning', message: '质控指标信息获取失败' })
        }
      })
    },
    getIcon(code) {
      switch (code) {
        case 'CONDUIT':
          return 'KI-CONDUIT'
        case 'D2B':
          return 'KI-D2B'
        case 'D2B_QUALIFIED':
          return 'KI-D2B_QUALIFIED'
        case 'DIDO':
          return 'KI-DIDO'
        case 'ECGREMOTE':
          return 'KI-ECGREMOTE'
        case 'FMC2B':
          return 'KI-FMC2B'
        case 'FMC2B_QUALIFIED':
          return 'KI-FMC2B_QUALIFIED'
        case 'FMC2ECG':
          return 'KI-FMC2ECG'
        case 'FOLLOW1':
          return 'KI-FOLLOW1'
        case 'FOLLOW12':
          return 'KI-FOLLOW12'
        case 'FOLLOW3':
          return 'KI-FOLLOW3'
        case 'FOLLOW6':
          return 'KI-FOLLOW6'
        case 'HIGH_RISK':
          return 'KI-HIGH_RISK'
        case 'INFORMATIZATION':
          return 'KI-INFORMATIZATION'
        case 'PCI':
          return 'KI-PCI'
        case 'REPERRATIO':
          return 'KI-REPERRATIO'
        case 'S2FMC':
          return 'KI-S2FMC'
        case 'THREE_MEETING':
          return 'KI-THREE_MEETING'
        case 'TIMELINESS_CREATE':
          return 'KI-TIMELINESS_CREATE'
        case 'TIMELINESS_FILE':
          return 'KI-TIMELINESS_FILE'
        case 'CGA':
          return 'KI-CGA'
        case 'RAT':
          return 'KI-RAT'
        case 'CONDUIT_TRANSFER':
          return 'KI-CONDUIT'
        case 'D2N':
          return 'KI-D2N'
        case 'D2N_QUALIFIED':
          return 'KI-D2N_QUALIFIED'
        case 'DIDO_TRANSFER':
          return 'KI-DIDO'
        case 'DIDO_TRANSFER_QUALIFIED':
          return 'KI-DIDO_TRANSFER_QUALIFIED'
        case 'ECGDIAGNOSE':
          return 'KI-ECGDIAGNOSE'
        case 'FMC2B_TRANSFER':
          return 'KI-FMC2B'
        case 'FMC2B_TRANSFER_QUALIFIED':
          return 'KI-FMC2B_QUALIFIED'
        default:
          return ''
      }
    },
    onScopeChanged() {
      this.buildQuery()
      this.getKeyIndex()
    },
    onYearConfirm() {
      this.createMonth()
      this.buildQuery()
      this.getKeyIndex()
    },
    onYearTypeConfirm() {
      this.query.quarterType = ''
      this.query.month = ''
      this.quarterTypesDesc = []
      this.buildQuery()
      this.getKeyIndex()
    },
    onQuarterTypeConfirm() {
      this.query.yearsType = ''
      this.query.month = ''
      this.buildQuery()
      this.getKeyIndex()
    },
    onMonthConfirm() {
      this.query.yearsType = ''
      this.query.quarterType = ''
      this.buildQuery()
      this.getKeyIndex()
    },
    buildQuery() {
      if (this.query.yearsType) {
        this.buildQueryYearsType(this.query.year)
      } else if (this.query.quarterType) {
        this.buildQueryQuarterType(this.query.year)
      } else if (this.query.month) {
        this.buildQueryMonth(this.query.year)
      }
    },
    buildQueryYearsType(year) {
      let startMonth = 0
      if (this.query.yearsType === '3') startMonth += 6
      const startDate = moment(new Date(year, startMonth, 1))
      this.query.start = startDate.format('YYYY-MM-DD')
      let endDate = startDate.add(6, 'months').add(-1, 'days')
      if (this.query.yearsType === '1') endDate = startDate.add(6, 'months')
      this.query.end = endDate.format('YYYY-MM-DD')
    },
    buildQueryQuarterType(year) {
      let startMonth = 0
      if (this.query.quarterType === '2') startMonth += 3
      else if (this.query.quarterType === '3') startMonth += 6
      else if (this.query.quarterType === '4') startMonth += 9
      const startDate = moment(new Date(year, startMonth, 1))
      this.query.start = startDate.format('YYYY-MM-DD')
      const endDate = startDate.add(3, 'months').add(-1, 'days')
      this.query.end = endDate.format('YYYY-MM-DD')
    },
    buildQueryMonth(year) {
      const startMonth = parseInt(this.query.month) - 1
      const startDate = moment(new Date(year, startMonth, 1))
      this.query.start = startDate.format('YYYY-MM-DD')
      const endDate = startDate.add(1, 'months').add(-1, 'days')
      this.query.end = endDate.format('YYYY-MM-DD')
    },
    open() {
      this.$backhelper.push(() => {
        this.$refs.dropMenu.toggle(false)
        this.$refs.item.toggle(false)
      })
    },
    close() {
      this.$backhelper.pop()
    },
    onCardClick(indexValue) {
      if (indexValue && indexValue.core === 'INFORMATIZATION') {
        this.$notify({ type: 'warning', message: '无追溯消息' })
        return
      }
      this.currentQcIndex = indexValue
      this.showDetail = true
    },
    onReturnClick() {
      this.showDetail = false
    }
  },
  watch: {}
}
</script>

<style lang="less" scoped>
.med-key-index-wrapper {
  .detail {
    position: relative;
    /deep/ .condition {
      .med-radio-select-wrapper,
      .med-radio-button-field-wrapper {
        .van-cell .van-cell__title {
          min-width: 100px;
        }
        .van-radio-group .van-radio {
          margin-right: 8px;
          .van-radio__label {
            padding-left: 18px;
            padding-right: 18px;
          }
        }
      }
    }
    .scroll-view {
      overflow-y: auto;
      height: calc(100vh - 420px);
    }
    .background {
      height: 20px;
      z-index: 2;
      background-color: #333bd2;
    }
    .van-row {
      padding: 10px 12px;

      .van-col {
        padding: 6px 8px;
      }
    }
  }
}
.key-index-detail-container {
  margin-top: 5px;
}
</style>
