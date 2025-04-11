<template>
  <div class="content-wrapper">
    <van-radio-group v-model="rfId">
      <van-cell-group>
        <van-cell
          v-for="item in rfTagOpts"
          :title="item.label"
          :key="item.label"
          clickable
          @click="onSelected(item)"
        >
          <template #title>
            {{ item.label }}&nbsp;&nbsp;({{ item.tagId }})
          </template>
          <template #right-icon>
            <van-radio :name="item.value"></van-radio>
          </template>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
  </div>
</template>
<script>
import { Dialog } from 'vant'
export default {
  name: 'wristbindBinding',
  props: {
    registId: {
      required: true,
      type: String
    },
    name: {
      type: String
    }
  },
  data() {
    return {
      // 腕带列表
      rfTagList: [],
      rfId: ''
    }
  },
  // 钩子方法
  created() {
    this.init('')
  },
  computed: {
    // 腕带下拉框
    rfTagOpts() {
      if (!this.rfTagList) {
        return []
      }
      return this.rfTagList.map(e => {
        return {
          label: e.tagName ? e.tagName : e.tagId,
          value: e.tagName,
          tagId: e.tagId
        }
      })
    }
  },
  methods: {
    init(rfid) {
      this.rfId = rfid
      this.queryRfId()
    },
    /**
     * 获取未绑定的腕带列表
     */
    queryRfId() {
      this.$api.service.queryRfId({}).then(({ result }) => {
        this.rfTagList = result
      })
    },
    /**
     * 腕带号扫码
     */
    onRfIdScan() {
      this.$bridge.callhandler('scanner', {}, data => {
        if (data && this.rfTagList && this.rfTagList.length > 0) {
          // 匹配腕带
          const rfTag = this.rfTagList.find(e => e.tagId === data)
          if (rfTag) {
            this.rfId = rfTag.tagId
          } else {
            this.$toast('未找到匹配的腕带')
          }
        }
      })
    },
    onSelected(item) {
      Dialog.confirm({
        title: '提示',
        message: `确定要给患者【${this.name}】绑定腕带【${item.label}】？`
      })
        .then(() => {
          // 调用绑定腕带接口
          this.$api.service
            .bindRfId(this.registId, item.value)
            .then(({ result }) => {
              if (result) this.$emit('selected', item)
            })
        })
        .catch(() => {})
    }
  },
  watch: {
    defaultTag(val) {
      this.rfId = val
    }
  }
}
</script>

<style lang="less" scoped>
.content-wrapper {
  .main-body {
    padding: 80px 30px;
    .title {
      font-size: 30px;
      font-weight: bold;
    }
    .main {
      padding-top: 20px;
      .save-btn {
        width: 40%;
        margin: 50px auto 0;
        background: #5169ff;
      }
    }
  }
}
</style>
