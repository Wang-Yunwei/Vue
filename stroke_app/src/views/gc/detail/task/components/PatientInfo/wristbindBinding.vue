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
import scannerMixin from '@mixins/scannerMixin'
import { Dialog } from 'vant'
import { mapGetters } from 'vuex'
import { Medication } from '@model/commonModel'

export default {
  name: 'wristbindBinding',
  mixins: [scannerMixin],
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
      rfId: '',
      medication: Medication()
    }
  },
  // 钩子方法
  created() {
    this.init('')
  },
  computed: {
    ...mapGetters(['hospitalId', 'curHospitalArea']),
    splicingHospitalArea() {
      return this.hospitalId + '_' + this.curHospitalArea
    },
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
      this.getUnboundTag()
    },
    async getUnboundTag() {
      this.$api.dataCollection
        .getwristbandList(this.splicingHospitalArea)
        .then(({ result }) => {
          console.log('腕带返回', result)
          this.rfTagList = result
        })
    },
    /**
     * 腕带号扫码
     */
    onRfIdScan() {
      /**
       * 1:二维码,2:身份证,3:医保卡
       * 返回json格式
       * {
       *     "type": "1",
       *     "words_result":
       *     {
       *         "text": "扫码结果"
       *     },
       *     "image": "无"
       * }
       */
      this.$bridge.callhandler('scanner', { type: ['1'] }, data => {
        if (data && this.rfTagList && this.rfTagList.length > 0) {
          const code = this.parseScanQrOrBar(data)
          // 匹配腕带
          const rfTag = this.rfTagList.find(e => e.tagId === code)
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
        message: `确定要给患者【${this.name}】绑定腕带【${item.value}】？`,
        confirmButtonColor: '#5e74fe'
      })
        .then(() => {
          this.medication.registId = this.registId
          this.medication.rfTagId = item.value
          this.medication.hospitalId = this.splicingHospitalArea
          // 调用绑定腕带接口
          this.$api.triage.bindRfTagId(this.medication).then(({ result }) => {
            if (result) this.$emit('selected', item)
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.content-wrapper {
  height: calc(100vh - 2rem);
  box-sizing: border-box;
  overflow: auto;
  &:after {
    content: " ";
    display: block;
    height: 1rem;
  }
}
</style>
