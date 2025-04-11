<template>
  <div class="content-wrapper">
    <div class="main-body">
      <div class="title">
        腕带号
      </div>
      <div class="main">
        <van-form @submit="submit">
          <div class="flex-c-b">
            <med-select
              v-model="triage.rfTagId"
              :options="rfTagOpts"
              placeholder="请选择腕带号"
            ></med-select>
            <i
              class="iconfont iconicon1-13"
              style="font-size: 0.5rem"
              @click="scanRfTag"
            ></i>
          </div>
          <div
            style="position: absolute; bottom: 10px; width: calc(100% - 0.8rem); text-align: center;"
          >
            <van-button
              class="save-btn"
              block
              round
              type="info"
              icon-position="left"
              size="normal"
            >
              &nbsp;&nbsp; 绑定 &nbsp;&nbsp;
            </van-button>
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>
<script>
import scannerMixin from '@mixins/scannerMixin'
import { mapGetters } from 'vuex'

export default {
  name: 'RfTagList',
  mixins: [scannerMixin],
  data() {
    return {
      // 腕带列表
      rfTagList: [],
      triage: {
        registId: this.$route.query.registId,
        rfTagId: ''
      }
    }
  },
  // 钩子方法
  created() {
    this.init()
  },
  computed: {
    ...mapGetters(['hospitalId']),
    // 腕带下拉框
    rfTagOpts() {
      if (!this.rfTagList) {
        return []
      }
      return this.rfTagList.map(e => {
        return { label: e.tagName ? e.tagName : e.tagId, value: e.tagId }
      })
    }
  },
  methods: {
    init() {
      this.getUnboundTag()
    },
    /**
     * 获取未绑定的腕带列表
     */
    async getUnboundTag() {
      const hospitalId = this.hospitalId
      // const params = { hospitalId: hospitalId, hospitalArea: '123' }
      const params = { hospitalId: '123', hospitalArea: '123' }
      this.$api.dataCollection.getUnboundTag(params).then(({ result }) => {
        this.rfTagList = result
      })
    },
    /**
     * 腕带号扫码
     */
    scanRfTag() {
      this.$bridge.callhandler('scanner', { type: ['1'] }, data => {
        if (data && this.rfTagList && this.rfTagList.length > 0) {
          const code = this.parseScanQrOrBar(data)
          // 匹配腕带
          const rfTag = this.rfTagList.find(e => e.tagId === code)
          if (rfTag) {
            this.$set(this.triage, 'rfTagId', rfTag.tagId)
          } else {
            this.$toast('未找到匹配的腕带')
          }
        }
      })
    },
    /**
     * 提交绑定腕带
     */
    submit() {
      if (this.triage.rfTagId === '') {
        this.$toast(`请选择腕带`)
        return
      }
      this.$api.triage.bindRfTagId(this.triage).then(({ result }) => {
        if (result) {
          this.$toast(`绑定成功`)
          this.backClick(this.triage.rfTagId)
        }
      })
    },
    /**
     * 返回，关闭对话框
     * @param rfTagId 选中的腕带号
     */
    backClick(rfTagId) {
      this.$emit('backClick', rfTagId)
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
