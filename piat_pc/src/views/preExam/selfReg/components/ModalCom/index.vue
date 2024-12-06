<template>
  <a-config-provider :locale="locales">
    <med-s-modal
      centered
      class="score-modal-wrapper"
      v-model="visible"
      :title="'患者评分-' + title"
      width="80%"
      @cancel="$emit('cancel')"
    >
      <div class="info" v-if="info.name">
        <span>{{ info.name }}</span>
        <span>{{ info.gender | gender }} </span>
        <span>{{ parseInt(info.age) || 0 }}岁 </span>
      </div>
      <med-s-card
        :loading="!modalFlag"
        class="score-modal-card"
        tabStyle
        :tabList="tabList"
        :activeTabKey="activeTabKey"
        @tabChange="tabListChange"
      >
        <component :is="currentTabComponent" ref="childCom" :regId="info.regId" />
      </med-s-card>
      <template #footer>
        <div class="flex-c-c">
          <med-button type="primary" shape="round" @click="submit(true)">保存</med-button>
          <med-button shape="round" @click="$emit('cancel')">取消</med-button>
        </div>
      </template>
    </med-s-modal>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { mapState, mapMutations, mapGetters } from 'vuex'
import { queryScoreList } from '@/api'
import Gcs from './Gcs.vue'
import Mews from './Mews.vue'
import REMS from './REMS.vue'
import RTS from './RTS.vue'
import Pain from './Pain.vue'
export default {
  name: 'ModalCom',
  components: {
    Gcs,
    Mews,
    REMS,
    RTS,
    Pain
  },
  data() {
    return {
      locales: zhCN,
      visible: this.modalFlag,
      tabList: [
        {
          key: '1',
          tab: '疼痛评分'
        },
        {
          key: '2',
          tab: 'MEWS评分'
        },
        {
          key: '3',
          tab: 'GCS评分'
        },
        {
          key: '4',
          tab: 'RTS评分'
        },
        {
          key: '5',
          tab: 'REMS评分'
        }
      ],
      activeTabKey: this.modalType,
      tabComponents: [Pain, Mews, Gcs, RTS, REMS]
    }
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    modalType: {
      type: String,
      default: '1'
    },
    modalFlag: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      scoreInfo: state => state.preExamScore.scoreInfo
    }),
    ...mapGetters(['hospitalId']),
    title() {
      const arr = ['疼痛评分', 'MEWS评分', 'GCS评分', 'RTS评分', 'REMS评分']
      const idx = Number(this.activeTabKey) - 1
      return arr[idx]
    },
    currentTabComponent() {
      const idx = Number(this.activeTabKey) - 1
      return this.tabComponents[idx]
    }
  },
  created() {
    this.queryScoreList()
  },
  methods: {
    ...mapMutations(['SET_SCORE_INFO']),
    async queryScoreList() {
      const res = await queryScoreList({ hospitalId: this.hospitalId })
      if (res?.code === '000000') {
        const list = this.initList(res.body)
        sessionStorage.setItem('PRE_EXAM_SLEF_REG_SCORE_MODAL', JSON.stringify(list))
      } else {
        this.$notification.error({ message: '获取评分配置数据失败!', description: res.message })
      }
    },
    initList(arrObj) {
      const obj = {}
      Object.keys(arrObj || {}).forEach(key => {
        const listObj = arrObj[key]
        const list = listObj.map(item => {
          let content = []
          try {
            content = JSON.parse(item.content)
          } catch (err) {}
          item.score = 0
          content.forEach(el => {
            if (key === 'RTS' && el.Type === 'Select') {
              el.content = el.Value.map(ell => {
                return {
                  ...ell,
                  label: ell.ItemName,
                  value: ell.ItemId
                }
              })
            }
            el.label = el.SubName
            el.value = el.Id
          })

          return { ...item, content }
        })
        obj[key] = list
      })
      return obj
    },
    tabListChange(val) {
      const _this = this
      const data = this.$refs.childCom.handleData()
      if (data) {
        // 评分有变动才会进来
        this.$confirm({
          title: '请注意',
          content: '是否保存已编辑的内容？',
          okText: '立即保存',
          cancelText: '放弃内容',
          onOk() {
            _this.submit()
            _this.activeTabKey = val
          },
          onCancel() {
            _this.SET_SCORE_INFO(_this.scoreInfo)
            _this.activeTabKey = val
          }
        })
      } else {
        _this.activeTabKey = val
      }
    },
    submit(type) {
      const data = this.$refs.childCom.handleData()
      if (!data) {
        // 因为后台每一次评分都算作新增，所以没有更改的数据这里不送
        this.$emit('cancel')
        return
      }
      let arr = this.scoreInfo
      const result = arr.length ? arr.some(el => el.vulnusType === data.vulnusType) : false
      if (!result) {
        arr.push({ ...data, changed: true })
      } else {
        arr = arr.map(item => {
          if (item.vulnusType === data.vulnusType) {
            return {
              ...item,
              ...data,
              changed: true
            }
          }
          return {
            ...item
          }
        })
      }
      this.SET_SCORE_INFO(arr)
      if (type) this.$emit('cancel')
    }
  },
  filters: {
    gender(val) {
      if (val === '1') {
        return '男'
      } else if (val === '2') {
        return '女'
      } else {
        return '未知'
      }
    }
  },
  watch: {
    modalFlag(val) {
      this.visible = val
    },
    modalType(val) {
      this.activeTabKey = val
    }
  }
}
</script>

<style lang="less" scoped>
.score-modal-wrapper {
  position: relative;
  /deep/ .ant-modal-content {
    background: #efefef;
    > .ant-modal-body {
      padding: 10px 10px 0 10px;
      max-height: 830px;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 4px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 2px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #eff1f7;
      }
      &::-webkit-scrollbar-track {
        -webkit-box-shadow: 0;
        border-radius: 0;
        background: #f6f8ff;
      }
    }
    > .ant-modal-footer {
      background: transparent;
      border-top: none;
    }
  }

  /deep/ .small-table {
    .ant-table.ant-table-small {
      padding: 4px;
      .ant-table-content {
        .ant-table-header .ant-table-thead {
          background-color: @primary-color;
          th {
            color: #fff;
          }
        }
        .ant-table-scroll .ant-table-body {
          margin-top: 13px;
        }
        table tr {
          th,
          td {
            padding: 5px;
            a.remove {
              color: #ff8690;
            }
          }
        }
      }
    }
  }

  .score-modal-card {
    background: transparent;
    border: none;
    /deep/ .ant-card-body {
      padding-left: 0px;
      padding-right: 0px;
      padding-top: 2px;
      padding-bottom: 0;
      .med-s-card-wrapper {
        border-radius: 6px;
        padding: 10px 20px;
        &:first-of-type {
          border-radius: 0 0 6px 6px;
          padding: 6px 10px 10px 10px;
        }
      }
    }
  }
  .info {
    position: absolute;
    top: 9px;
    left: 180px;
    background: #fff;
    color: #000;
    padding: 0 10px;
    font-size: 14px;
    line-height: 32px;
    height: 32px;
    border-radius: 20px;
    span {
      margin: 0 3px;
    }
  }
}
</style>
