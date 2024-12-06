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
          <div id="container"></div>
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
        <div class="img-bar flex-c-b">
          <div>
            <img src="~@/assets/images/preExam/pain/pain_1.png" />
            <p>无痛</p>
          </div>
          <div>
            <img src="~@/assets/images/preExam/pain/pain_2.png" />
            <p>有点痛</p>
          </div>
          <div>
            <img src="~@/assets/images/preExam/pain/pain_3.png" />
            <p>轻微痛</p>
          </div>
          <div>
            <img src="~@/assets/images/preExam/pain/pain_4.png" />
            <p>疼痛明细</p>
          </div>
          <div>
            <img src="~@/assets/images/preExam/pain/pain_5.png" />
            <p>疼痛严重</p>
          </div>
          <div>
            <img src="~@/assets/images/preExam/pain/pain_6.png" />
            <p>剧烈痛</p>
          </div>
        </div>
        <div class="color-bar flex-c-b">
          <div v-for="(item, idx) in painLevel" :key="idx">
            <med-button width="50px" height="30px" :active="active === item.id" @click="handleClick(item.id)">
              {{ idx }}
            </med-button>
            <p :class="{ active: active === item.id }">{{ item.desc }}</p>
          </div>
        </div>
      </div>
      <div class="bottom-card-tip flex-c-s">
        <a-icon type="info-circle" theme="filled" />
        <span
        >注：0分：无痛；1~3分：轻度疼痛（睡眠不受影响）；4~6分：中度疼痛（睡眠受影响）；7~10分：重度疼痛（严重影响睡眠）。</span
        >
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
const painLevel = [
  {
    id: 0,
    desc: '一点不痛'
  },
  {
    id: 1,
    desc: '安静平卧时不痛翻身咳嗽时疼痛'
  },
  {
    id: 2,
    desc: '咳嗽时疼痛深呼吸不痛'
  },
  {
    id: 3,
    desc: '安静平卧时不痛咳嗽深呼吸疼痛'
  },
  {
    id: 4,
    desc: '安静平卧有时痛'
  },
  {
    id: 5,
    desc: '安静平卧持续痛'
  },
  {
    id: 6,
    desc: '安静平卧疼痛较重'
  },
  {
    id: 7,
    desc: '疼痛严重翻转不安疲乏无法入睡'
  },
  {
    id: 8,
    desc: '持续疼痛难忍全身大汗'
  },
  {
    id: 9,
    desc: '疼痛剧烈无法忍受'
  },
  {
    id: 10,
    desc: '剧烈疼的痛'
  }
]
export default {
  data() {
    return {
      painLevel,
      columns,
      operatorTime: moment(),
      active: undefined,
      vulnusType: 'PAIN'
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
          degreeResult: undefined,
          operatorTime: moment(),
          vulnusType: '',
          details: []
        }
        this.initList(obj)
        return
      }
      const res = await querySingleScore(record.vdId)
      const obj = {
        degreeResult: record.degreeResult,
        operatorTime: record.operatorTime,
        vulnusType: record.vulnusType,
        details: res.body
      }
      this.initList(obj)
    },
    initList() {
      const obj = this.curScoreItem
      this.active = obj?.degreeResult ?? undefined
    },

    handleClick(val) {
      this.active = val
    },
    handleData() {
      if (this.active === undefined || this.active === this.curScoreItem?.degreeResult) {
        return undefined
      }
      return {
        vulnusType: this.vulnusType,
        degreeResult: this.total,
        operatorTime: this.operatorTime,
        details: [{ type: this.vulnusType, value: [{ id: this.total, value: this.total }] }]
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
      return this.active
    },
    curScoreItem() {
      const arrs = this.scoreInfo
      const obj = arrs instanceof Array ? arrs.find(item => item.vulnusType === this.vulnusType) : arrs
      return obj
    }
  }
}
</script>

<style lang="less" scoped>
.score-modal-pain-wrapper {
  .top-card {
    box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.1);
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
    box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.1);
    /deep/ .ant-card-body {
      padding-bottom: 0;
      overflow-x: auto;
    }
    &-time {
      > span {
        color: #333333;
      }
      .icon-shijian {
        font-size: 24px;
        color: #cccccc;
        margin-top: 0;
      }
    }
    &-main {
      padding: 30px 0;
      min-width: 1300px;
      .img-bar {
        margin: 0 80px;
        div {
          text-align: center;
          p {
            color: #000;
            font-size: 14px;
          }
        }
      }
      .color-bar {
        margin: 0 110px;
        height: 30px;
        background: linear-gradient(90deg, #ffffff 0%, #ffcc00 49%, #ff0000 100%);
        border-radius: 15px;
        > div {
          position: relative;
          button {
            border-radius: 15px;
          }
          p {
            text-align: center;
            position: absolute;
            top: 33px;
            left: -15px;
            color: #999;
            display: inline-block;
            width: 80px;
            word-break: break-all;
            &.active {
              color: @primary-color;
            }
          }
        }
      }
    }
    &-tip {
      margin-top: 50px;
      border-top: 1px solid #f2f2f2;
      i {
        color: #cccccc;
      }
      span {
        margin-left: 10px;
        font-size: 12px;
        color: #ff3333;
        line-height: 3;
      }
    }
  }
}
</style>
