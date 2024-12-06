<template>
  <div class="med-ecg-list-wrapper">
    <div v-for="item in records" :key="item.id">
      <van-swipe-cell>
        <van-cell class="card-item">
          <span :class="{ pin: true, spec: item.ecgDiagnosis === '0' }">
            {{ getDiagDesc(item) }}
          </span>
          <div v-for="ecg in getEcgFiles(item)" :key="ecg">
            <van-image style="padding: 8px;" :src="ecg" fit="scale-down" @click="onPreviewRecord(item)" />
          </div>
          <van-empty v-if="getEcgFiles(item).length == 0" :image="require('@assets/image/empty.png')" style="min-height:60px;">
          </van-empty>
          <div class="info flex-c-b">
            <div>
              <div class="infoTime">
                <van-icon name="clock-o" />
                <span style="margin-left:6px">完成时间：{{ getFormatTime(item.checkTime) }}</span>
              </div>
              <div class="infoTime">
                <van-icon name="clock-o" />
                <span style="margin-left:6px">诊断时间：{{ item.diagnosisTime }}</span>
              </div>
            </div>
            <!-- <span class="infoE">
              {{ exceptionReason(item.ecgException) }}
            </span> -->

            <van-button round size="small" type="default" @click="onEditRecord(item)">
              {{ disabled || readonly ? "查看" : "编辑" }}
            </van-button>
          </div>
        </van-cell>
        <template #right>
          <div class="del-icon flex-c-c" :disabled="disabled" @click="onDeleteRecord(item)">
            <van-icon name="delete-o" />
          </div>
        </template>
      </van-swipe-cell>
    </div>
    <van-empty v-if="!records || records.length === 0" :image="require('@assets/image/empty.png')" description="暂无数据" />
  </div>
</template>

<script>
import storage from 'store'
import * as types from '@/store/mutations-types'
import { ImagePreview } from 'vant'
import moment from 'moment'
export default {
  name: '',
  props: {
    records: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    deleteRecord: {
      type: Function,
      required: true
    }
  },
  model: {
    prop: 'records',
    event: '_change'
  },
  data() {
    return {}
  },
  mounted() { },
  computed: {},
  methods: {
    async onDeleteRecord(item) {
      try {
        const res = await this.deleteRecord(item)
        if (res) {
          var index = this.records.findIndex(m => m.id === item.id)
          if (index > -1) {
            this.records.splice(index, 1)
          }
        } else {
          this.$notify({ type: 'success', message: '心电图删除成功！' })
        }
      } catch (e) {
        this.$notify({ type: 'warning', message: e.message })
      }
    },
    async onPreviewRecord(item) {
      const preview = ImagePreview({
        images: this.getEcgFiles(item),
        onClose() {
          this.$backhelper.pop()
        }
      })
      this.$backhelper.push(() => {
        preview.close()
      })
    },
    async onEditRecord(item) {
      this.$emit('editRecord', item)
    },
    getEcgFiles(item) {
      if (!item.ecgFile) return []
      return item.ecgFile.attachPath.split(';')
    },
    exceptionReason(str) {
      const arrValues = str ? str.split(',') : []
      const labels = arrValues.map(val => {
        const dict = storage.get(types.SET_DICTIONARY)
        const matched = dict?.ecgExceptionOpts.find(item => item.value === val)
        return matched?.label
      })
      return labels.join(' ; ')
    },
    getDiagDesc(item) {
      if (!item) return '未知'
      if (item.ecgType === '1') return '院前'
      if (item.ecgType === '2') return '院内'
      return '未知'
    },
    getFormatTime(val) {
      if (!val) return '--'
      return moment(val).format('YYYY-MM-DD HH:mm')
    }
  },
  watch: {}
}
</script>

<style lang="less" scoped>
.med-ecg-list-wrapper {
  padding: 20px;

  .card-item {
    margin-bottom: 20px;
    border-radius: 20px;
    padding: 0;
    border: 1px solid #e7e9ea;
    position: relative;

    .pin {
      position: absolute;
      z-index: 2;
      top: 0;
      right: 20px;
      background: linear-gradient(50deg, #008aff, #2fb6fc);
      box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.35);
      border-radius: 0px 0px 15px 15px;
      color: #fff;
      padding: 20px;

      &.spec {
        background: linear-gradient(50deg, #ea5c4b, #f9a74e);
      }
    }

    .van-image {
      vertical-align: top;
      width: 100%;
      height: 400px;
    }

    .van-button {
      color: #696969;
    }

    .info {
      font-size: 28px;
      line-height: 1;
      padding: 0 20px;

      .infoTime {
        padding: 10px 0;
        color: #696969;
      }

      .infoE {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 200px;
      }
    }
  }

  .van-swipe-cell__right {
    width: 180px;

    .del-icon {
      height: 100px;
      width: 100px;
      background: red;
      color: #fff;
      font-size: 40px;
      padding: 20px;
      border-radius: 50%;
      text-align: center;
      margin-left: 20px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
