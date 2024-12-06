<template>
  <div class="score-modal-pain-wrapper">
    <med-s-card class="top-card" :bordered="false" title="历史记录">
      <a-row :gutter="20" type="flex" align="top" justify="space-around" class="history-box">
        <a-col :span="8">
          <med-s-table
            ref="historyTable"
            class="small-table"
            size="small"
            rowKey="vdId"
            questNow
            :columns="columns"
            :dataSource="loadData"
            :showPagination="false"
            :scroll="{ y: 300 }"
            @rowLock="querySingleScore"
          >
            <template slot="actions" slot-scope="record">
              <a-popconfirm
                arrowPointAtCenter
                title="确认删除吗?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="removeSingleScore(record)"
              >
                <a class="remove" href="javascript:;" @click.stop>删除</a>
              </a-popconfirm>
            </template>
          </med-s-table>
        </a-col>
        <a-col :span="16">
          <div id="container" />
        </a-col>
      </a-row>
    </med-s-card>
    <med-s-card class="bottom-card" :bordered="false">
      <div class="bottom-card-time flex-c-b">
        <div class="flex-c-s">
          <span>评分时间： </span>
          <a-date-picker
            :allow-clear="false"
            show-time
            v-model="operatorTime"
            placeholder="请选择评分时间"
            valueFormat="YYYY-MM-DD HH:mm:ss"
          >
            <template #suffixIcon>
              <a-icon class="icon-shijian" type="icon_shijian"></a-icon>
            </template>
          </a-date-picker>
        </div>
        <div class="flex-c-s" v-show="total">
          <p>
            总得分：<span>{{ total }}</span>
          </p>
        </div>
      </div>
      <div class="bottom-card-main">
        <ul class="list">
          <li class="flex-c-b" v-for="(item, idx) in list" :key="idx">
            <div class="flex-c-s">
              <span>{{ item.label }}</span>
              <med-s-radio
                buttonType
                :initialValue="item.initialValue"
                :optionList="item.content"
                v-model="item.checked"
                @change="val => onChange(val, item.label, item)"
              />
            </div>
            <div>{{ item.score }}</div>
          </li>
        </ul>
      </div>
      <div class="bottom-card-tip">
        <div class="one flex-c-s">
          <a-icon type="info-circle" theme="filled" />
          <span>
            注：≤11分为轻度伤，通常无死亡发生；12~23分为中度伤，病死率较高；≥24为危重伤，病死率极高。
          </span>
        </div>
      </div>
    </med-s-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { querySingleScore } from '@/api/preExam/score'
import moment from 'moment'
import scoreMixn from './score-mixin'
const columns = [
  { title: '评估时间', width: 160, dataIndex: 'operatorTime', key: 'operatorTime', align: 'center' },
  { title: '评分值', dataIndex: 'degreeResult', key: 'degreeResult', align: 'center' },
  { title: '评估人', dataIndex: 'doctorId', key: 'doctorId', align: 'center' },
  {
    title: '操作',
    align: 'center',
    scopedSlots: {
      customRender: 'actions'
    }
  }
]

export default {
  data() {
    return {
      list: [],
      columns,
      operatorTime: moment(),
      active: 0,
      vulnusType: 'GCS',
      details: []
    }
  },
  props: {
    regId: {
      type: String,
      default: ''
    }
  },
  mixins: [scoreMixn],
  methods: {
    async querySingleScore(record) {
      if (!record) {
        this.operatorTime = moment()
        const obj = {
          degreeResult: 0,
          operatorTime: moment(),
          vulnusType: '',
          details: []
        }
        this.initList(obj)
        return
      }
      this.operatorTime = record.operatorTime
      const res = await querySingleScore(record.vdId)
      const obj = {
        degreeResult: record.degreeResult,
        operatorTime: record.operatorTime,
        vulnusType: record.vulnusType,
        details: res.body
      }
      this.initList(obj)
    },
    initList(arrs) {
      const obj = arrs instanceof Array ? arrs.find(item => item.vulnusType === this.vulnusType) : arrs
      const arr = obj ? obj.details || [] : []
      this.details = JSON.parse(JSON.stringify(arr))
      const listObj = JSON.parse(sessionStorage.getItem('PRE_EXAM_SLEF_REG_SCORE_MODAL'))
      this.list = listObj[this.vulnusType] || []
      this.list.forEach(item => {
        arr.forEach(el => {
          if (item.label === el.type) {
            this.$set(item, 'checked', el.value[0].value)
            this.$set(item, 'score', el.value[0].score)
            this.$set(item, 'initialValue', el.value[0].value)
          }
        })
      })
    },
    onChange(val, title, item) {
      const obj = item.content.find(el => el.value === val)
      const result = this.details.some(el => el.type === item.label)
      if (!result) {
        this.details.push({ type: item.label, value: [{ id: obj.Id, value: obj.Id, score: obj.Value }] })
      } else {
        this.details = this.details.map(el => {
          if (el.type === item.label) {
            return {
              ...el,
              value: [{ id: obj.Id, value: obj.Id, score: obj.Value }]
            }
          }
          return { ...el }
        })
      }
      this.$set(item, 'score', obj.Value)
    },
    handleData() {
      if (!this.list.filter(el => el.checked)?.length || !this.changed) {
        return undefined
      }
      return {
        vulnusType: this.vulnusType,
        degreeResult: this.total,
        operatorTime: this.operatorTime,
        details: this.details
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initList(this.scoreInfo)
    })
  },
  computed: {
    ...mapState({
      scoreInfo: state => state.preExamScore.scoreInfo
    }),
    total() {
      let total = 0
      this.list.forEach(item => {
        total += Number(item.score)
      })
      return total
    },
    changed() {
      return this.list.some(el => el.checked !== el.initialValue)
    }
  }
}
</script>

<style lang="less" scoped>
.score-modal-pain-wrapper {
  .top-card {
    .history-box {
      padding: 10px;
      #container {
        border: 1px solid #eee;
        padding: 10px;
      }
    }
    /deep/ .ant-card-head {
      min-height: auto;
      margin: 0 10px;
      .ant-card-head-wrapper {
        line-height: 2;
        display: inline-grid;
        margin-bottom: -1px;
        .ant-card-head-title {
          border-left: none;
          margin: 0;
          border-bottom: 2px solid @primary-color;
        }
      }
    }
    /deep/ .ant-table-body {
      &::-webkit-scrollbar {
        width: 4px;
      }
    }
    /deep/ .ant-table-header {
      overflow-y: hidden !important;
    }
    #container {
      height: 300px;
    }
  }
  .bottom-card {
    margin-top: 10px;
    overflow-x: auto;
    /deep/ .ant-card-body {
      padding-bottom: 0;
      overflow-x: auto;
    }
    &-time {
      > div {
        span {
          color: #333333;
        }
        p {
          color: #333;
          margin: 0;
          padding: 0;
          span {
            color: red;
            font-size: 18px;
          }
        }
      }
      .icon-shijian {
        font-size: 24px;
        color: #cccccc;
        margin-top: 0;
      }
    }
    &-main {
      padding: 30px 0 0;
      min-width: 1300px;
      .list {
        padding: 0;
        > li {
          color: #000;
          border-bottom: 1px solid #f2f2f2;
          font: 16px;
          line-height: 16px;
          margin: 20px 0;
          padding-bottom: 10px;
          span {
            padding-left: 10px;
            border-left: 2px solid @primary-color;
            display: inline-block;
            min-width: 150px;
          }
          &:last-of-type {
            border: none;
          }
          /deep/ .ant-radio-group {
            margin-bottom: -10px;
          }
          /deep/ .ant-radio-button-wrapper {
            width: 200px;
            font-size: 14px;
            margin-bottom: 10px;
            &.ant-radio-button-wrapper-checked {
              background: @primary-color;
              border-color: @primary-color;
            }
          }
        }
      }
    }
    &-tip {
      padding-top: 10px;
      padding-bottom: 50px;
      border-top: 1px solid #f2f2f2;
      i {
        color: #cccccc;
      }
      span {
        margin-left: 10px;
        font-size: 12px;
        color: #ff3333;
      }
      .two {
        text-indent: 40px;
        span {
          color: #999;
        }
      }
      .three {
        text-indent: 60px;
        span {
          display: block;
          color: #999;
        }
      }
    }
  }
}
</style>
