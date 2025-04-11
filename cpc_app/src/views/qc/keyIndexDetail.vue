<template>
  <div class="med-key-index-wrapper">
    <div class="detail">
      <div class="condition">
        <van-dropdown-menu>
          <!-- <van-dropdown-item
            v-model="query.scope"
            :options="compareRangeDic"
            @open="open"
            @close="close"
            ref="dropMenu"
            @change="onScopeChanged"
          /> -->
          <van-dropdown-item
            ref="item"
            :title="timeQueryTitle"
            @open="open"
            @close="close"
          >
            <div>
              <med-radio-select-field
                v-model="parentQuery.year"
                label="年份"
                :select-options="years"
                @confirm="onYearConfirm"
              >
              </med-radio-select-field>
              <med-radio-button-field
                v-model="parentQuery.yearsType"
                label="年平均"
                :select-options="createYearTypes()"
                @confirm="onYearTypeConfirm"
              />
              <med-radio-button-field
                v-model="parentQuery.quarterType"
                label="季度"
                :select-options="createQuarter()"
                @confirm="onQuarterTypeConfirm"
              />
              <med-radio-button-field
                v-model="parentQuery.month"
                label="月平均"
                :select-options="months"
                @confirm="onMonthConfirm"
              >
              </med-radio-button-field>
            </div>
          </van-dropdown-item>
        </van-dropdown-menu>
      </div>
      <div class="scroll-view">
        <van-cell :title="description" class="description"></van-cell>
        <van-cell
          title="指标考核病例需满足条件"
          v-if="qcIndexDetail.hasCondition"
          class="card"
        >
          <template #label>
            <table cellspacing="0" style="width:100%" class="condition-card ">
              <!-- <tr class="header">
                <th>序号</th>
                <th>姓名</th>
                <th>填报编号</th>
              </tr> -->
              <tr
                v-for="(item, index) in qcIndexDetail.condition.labels"
                :key="index"
              >
                <td>
                  <div class="condition-card-memo-title">
                    {{ item.label }}
                  </div>
                </td>
                <td>
                  <div class="condition-card-memo-desc">{{ item.value }}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div
                    class="condition-card-memo-title"
                    style="color: #5e74fe;"
                  >
                    条件说明
                  </div>
                </td>
                <td>
                  <div
                    v-for="(item, index) in qcIndexDetail.condition.memos"
                    :key="index"
                    class="condition-card-memo-desc"
                  >
                    {{ item }}
                  </div>
                </td>
              </tr>
            </table>
          </template>
        </van-cell>
        <van-cell
          title="指标详情图"
          v-if="qcIndexDetail.hasIndexes"
          class="card"
        >
          <template #label>
            <table cellspacing="0" style="width:100%" class="index-card">
              <tr>
                <td>
                  <div>考核病历范围</div>
                </td>
                <td>
                  <div>{{ timeLabel }}</div>
                </td>
              </tr>
              <tr v-for="(item, index) in qcIndexDetail.indexes" :key="index">
                <td>
                  <div>{{ item.label }}</div>
                </td>
                <td>
                  <div>{{ item.value }}</div>
                </td>
              </tr>
            </table>
          </template>
        </van-cell>
        <van-cell
          title="指标统计患者详细说明图"
          v-if="qcIndexDetail.hasMemos"
          class="card"
        >
          <template #label>
            <div class="memo-card">
              <div class="memo-card-desc">
                填报编号可以用于胸痛中心填报平台进行追溯病历！！！
              </div>
              <div
                v-for="(item, index) in qcIndexDetail.memos"
                :key="index"
                class="memo-card-patient"
              >
                <div class="memo-card-patient-header">
                  <div>
                    <div>序号:</div>
                    <div>{{ index + 1 }}</div>
                  </div>
                  <div>
                    <div>编号:</div>
                    <div>{{ item.id }}</div>
                  </div>
                  <div>{{ item.name }}</div>
                  <div v-if="qcIndexDetail.classify === '1'">
                    <div>差值:</div>
                    <div>{{ item.index }}</div>
                  </div>
                  <div v-else-if="qcIndexDetail.classify === '2'">
                    <div>是否达标:</div>
                    <div v-if="item.isPassName === '未达标'" style="color:red;">
                      {{ item.isPassName }}
                    </div>
                    <div v-else>{{ item.isPassName }}</div>
                  </div>
                  <div v-else>
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <table cellspacing="0" style="width:100%" v-if="showMemo">
                  <tr v-for="(m, index) in item.memo" :key="'memo' + index">
                    <td style="width:50%;">
                      <div>{{ m.label }}</div>
                    </td>
                    <td style="width:50%;">
                      <div>{{ m.value }}</div>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </template>
        </van-cell>
      </div>
    </div>
    <med-loading v-model="showLoading" />
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters, mapMutations } from 'vuex'
import * as types from '@/store/mutations/mutations-types'
export default {
  components: {},
  props: {
    core: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    parentQuery: {
      type: Object,
      default: () => {}
    }
  },
  name: 'KeyIndexDetail',
  comments: [],
  data() {
    return {
      timeLabel: '',
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
      qcIndexDetail: {
        summary: 'STEMI患者症状到首次医疗接触（S2FMC）时间',
        classify: '病历类',
        hasCondition: false,
        condition: {
          labels: [
            // '初步诊断勾选"STEMI"',
            // '来院方式勾选"呼救(120/999或其他)出车"、"转运(包含任何机构)"且勾选"网络医院"',
            // '远程心电图传输勾选"接收120/网络医院心电图"'
          ],
          memos: [
            // '满足条件1、2、3的病例属于达标病例',
            // '满足条件1、2的病例属于未达标病例'
          ]
        },
        hasIndexes: true,
        indexes: [
          // { label: '考核病历范围', value: '2022上半年' },
          // { label: '平均时间', value: '80.3min' },
          // { label: '最大差值', value: '104min' },
          // { label: '最小差值', value: '48min' },
          // { label: '统计病例总数', value: '7例' }
        ],
        hasMemos: true,
        memos: [
          // {
          //   id: '21250050',
          //   name: '顾**',
          //   index: '75min',
          //   memo: [
          //     { label: '到大医院大门时间', value: '2022-06-23 23:14' },
          //     { label: '导丝通过时间', value: '2022-06-23 00:32' }
          //   ]
          // },
          // {
          //   id: '21250051',
          //   name: '王**',
          //   index: '75min',
          //   memo: [
          //     { label: '到大医院大门时间', value: '2022-06-23 23:14' },
          //     { label: '导丝通过时间', value: '2022-06-23 00:32' }
          //   ]
          // }
        ]
      }
    }
  },
  mounted() {
    this.buildQuery()
    this.getKeyIndex()
  },
  // 钩子方法
  created() {
    this.createYear()
    this.createMonth()
  },
  computed: {
    quarterTypesDesc() {
      const quarter = moment().quarter()
      const quarterDesc = this.quarterTypes.slice(0, quarter - 1)
      return quarterDesc
    },
    yearTypesDesc() {
      const month = moment().month() + 1
      if (month > 6) {
        const yearsDesc = this.yearTypes.slice(0, 2).slice(1, 2)
        return yearsDesc
      }
      return this.yearTypes
    },
    showMemo() {
      if (this.qcIndexDetail.classify !== '2') return true
      else if (this.core === 'TIMELINESS_FILE') return true
      return false
    },
    timeQueryTitle() {
      const year = this.parentQuery.year
      if (this.parentQuery.yearsType) {
        const yearType = this.yearTypes.find(
          m => m.value === this.parentQuery.yearsType
        )
        return year + '年' + yearType.label
      } else if (this.parentQuery.quarterType) {
        const quarterType = this.quarterTypes.find(
          m => m.value === this.parentQuery.quarterType
        )
        return year + '年' + quarterType.label
      } else if (this.parentQuery.month) {
        const month = this.months.find(m => m.value === this.parentQuery.month)
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
        this.parentQuery.year ===
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
        this.parentQuery.year ===
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
      let year = moment().year()
      const month = moment().month()
      if (month === 0) {
        year = year - 1
      }
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
        this.parentQuery.year ===
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
      this.qcIndexDetail.condition.labels = []
      this.qcIndexDetail.condition.memos = []
      this.qcIndexDetail.indexes = []
      this.qcIndexDetail.memos = []
      this.parentQuery.core = this.core
      this.$api.service.getKeyIndexDetail(this.parentQuery).then(res => {
        if (res.status === 200 && res.result) {
          this.qcIndexDetail.hasCondition = res.result.hasCondition
          this.qcIndexDetail.hasIndexes = res.result.hasIndexes
          this.qcIndexDetail.hasMemos = res.result.hasMemos
          this.qcIndexDetail.classify = res.result.classify

          if (res.result.hasCondition) {
            for (const item of res.result.condition.labels) {
              const lb = item.indexOf('：')
              if (lb >= 0) {
                this.qcIndexDetail.condition.labels.push({
                  label: item.substring(0, lb),
                  value: item.substring(lb + 1)
                })
              } else {
                this.qcIndexDetail.condition.labels.push({
                  label: item,
                  value: item
                })
              }
            }
            this.qcIndexDetail.condition.memos = res.result.condition.memos
          }

          if (res.result.hasIndexes) {
            this.qcIndexDetail.indexes = res.result.indexes
          }
          if (res.result.hasMemos) {
            this.qcIndexDetail.memos = res.result.memos
          }
        } else {
          this.$notify({
            type: 'warning',
            message: '质控指标详细信息获取失败'
          })
        }
        this.showLoading = false
      })
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
      this.parentQuery.quarterType = ''
      this.parentQuery.month = ''
      this.buildQuery()
      this.getKeyIndex()
    },
    onQuarterTypeConfirm() {
      this.parentQuery.yearsType = ''
      this.parentQuery.month = ''
      this.buildQuery()
      this.getKeyIndex()
    },
    onMonthConfirm() {
      this.parentQuery.yearsType = ''
      this.parentQuery.quarterType = ''
      this.buildQuery()
      this.getKeyIndex()
    },
    buildQuery() {
      if (this.parentQuery.yearsType) {
        this.buildQueryYearsType(this.parentQuery.year)
      } else if (this.parentQuery.quarterType) {
        this.buildQueryQuarterType(this.parentQuery.year)
      } else if (this.parentQuery.month) {
        this.buildQueryMonth(this.parentQuery.year)
      }
    },
    buildQueryYearsType(year) {
      let startMonth = 0
      if (this.parentQuery.yearsType === '3') startMonth += 6
      const startDate = moment(new Date(year, startMonth, 1))
      this.parentQuery.start = startDate.format('YYYY-MM-DD')
      let endDate = startDate.add(6, 'months').add(-1, 'days')
      if (this.parentQuery.yearsType === '1') {
        endDate = startDate.add(6, 'months')
      }
      this.parentQuery.end = endDate.format('YYYY-MM-DD')
      const yTypes = this.yearTypes.find(
        m => m.value === this.parentQuery.yearsType
      )
      this.timeLabel = this.parentQuery.year + yTypes?.label
    },
    buildQueryQuarterType(year) {
      let startMonth = 0
      if (this.parentQuery.quarterType === '2') startMonth += 3
      else if (this.parentQuery.quarterType === '3') startMonth += 6
      else if (this.parentQuery.quarterType === '4') startMonth += 9
      const startDate = moment(new Date(year, startMonth, 1))
      this.parentQuery.start = startDate.format('YYYY-MM-DD')
      const endDate = startDate.add(3, 'months').add(-1, 'days')
      this.parentQuery.end = endDate.format('YYYY-MM-DD')
      const qType = this.quarterTypes.find(
        m => m.value === this.parentQuery.quarterType
      )
      this.timeLabel = this.parentQuery.year + qType?.label
    },
    buildQueryMonth(year) {
      const startMonth = parseInt(this.parentQuery.month) - 1
      const startDate = moment(new Date(year, startMonth, 1))
      this.parentQuery.start = startDate.format('YYYY-MM-DD')
      const endDate = startDate.add(1, 'months').add(-1, 'days')
      this.parentQuery.end = endDate.format('YYYY-MM-DD')
      const mth = this.months.find(m => m.value === this.parentQuery.month)
      this.timeLabel = this.parentQuery.year + '年' + mth?.label
    },
    open() {
      this.$backhelper.push(() => {
        this.$refs.dropMenu.toggle(false)
        this.$refs.item.toggle(false)
      })
    },
    close() {
      this.$backhelper.pop()
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
      height: calc(100vh - 244px);
      .description {
        padding: 0 16px;
        color: red;
        font-size: 24px !important;
      }
      .description::before {
        content: "*";
        padding: 0 2px;
      }
      .van-cell {
        font-size: 32px;
        /deep/ .van-cell__title span {
          font-weight: bold;
        }
        /deep/ .van-cell__label {
          color: rgba(0, 0, 0, 0.87);
          margin-top: 0;
          .index-card,
          .memo-card {
            margin-top: 6px;

            tr {
              box-sizing: border-box;
              // pointer-events: none;
              right: 0.426667rem;
              left: 0.426667rem;
              border-bottom: 0.026667rem solid #ebedf0;
            }
            th,
            td {
              // height: 48px;
              // background: #333bd2;
              padding: 22px 0;
              text-align: center;
              border: 0.026667rem solid #ebedf0;
            }
            tr:nth-child(2n-1) {
              background-color: #ebedf0;
            }
            tr:nth-child(2n) {
              background-color: #fff;
            }
          }
        }
      }
      .van-cell::after {
        content: "";
        border-bottom: 0;
      }

      .card {
        width: 95%;
        position: relative;
        background: #ffffff;
        border-radius: 15px;
        margin: 12px auto;
        display: flex;
        flex-flow: column;
        align-content: center;
        align-items: stretch;
        -moz-box-shadow: 0px 3px 10px #a6a6a6;
        -webkit-box-shadow: 0px 3px 10px #a6a6a6;
        box-shadow: 0px 3px 10px #a6a6a6;
      }
      .memo-card {
        &-patient {
          margin-top: 16px;
        }

        &-patient-header {
          background: #5e74fe;
          width: 100%;
          color: #fff;
          display: flex;
          height: 64px;
          align-items: center;
          div {
            display: flex;
            justify-content: flex-start;
            padding: 0 8px;
          }
        }
        &-desc {
          margin-top: 8px;
          // line-height: 48px;
          // height: 48px;
          color: #c8c9cc;
        }
      }
      .condition-card {
        font-size: 28px;
        // color: #fff;
        // background-color: #5e74fe;
        td {
          text-align: center;
          div {
            line-height: 36px;
            font-size: 24px;
          }
        }

        &-memo-title {
          width: 140px;
        }
        &-memo-desc {
          width: 100%;
          padding: 8px 0;
        }
        &-memo-title,
        &-memo-desc {
          // display: flex;
          // align-items: center;
          text-align: left;
        }
        td {
          // height: 48px;
          // background: #333bd2;
          padding: 8px 8px;
          text-align: center;
          border: 0.026667rem solid #ebedf0;
        }
      }
    }
  }
}
</style>
