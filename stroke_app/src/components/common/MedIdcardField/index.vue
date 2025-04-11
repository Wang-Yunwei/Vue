<template>
  <div class="med-idcard-field-wrapper">
    <med-hint-field
      v-bind="$props"
      v-model="fieldValue"
      @change="onCardChanged"
      @confirm="onCardConfirmed"
    >
      <template #right-icon>
        <van-icon name="scan" @click="onIconClick" v-if="showScan" />
      </template>
    </med-hint-field>
  </div>
</template>

<script>
import MedHintField from '../MedHintField/index.jsx'
import { scanType } from '@constant/commonConstant'

export default {
  name: '',
  props: {
    ...MedHintField.props,
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    showScan: {
      type: Boolean,
      default: true
    },
    // 摄像头扫描类型
    scanType: {
      type: Array,
      default: () => [scanType.idCard]
    }
  },
  model: {
    prop: 'value',
    event: '_change'
  },
  data() {
    return {
      fieldValue: this.value
    }
  },
  mounted() {
    this.fieldValue = this.value
  },
  computed: {},
  methods: {
    // 1:二维码,2:身份证,3:医保卡
    onIconClick() {
      this.$bridge.callhandler('scanner', { type: this.scanType }, data => {
        if (!data) this.$toast('无效的扫描数据')
        const result = JSON.parse(data)
        if (result) {
          var fieldValue =
            result.type === '2' ? result.identity : result.cardNo
          this.$emit('input', fieldValue)
          this.$emit('_change', fieldValue)
          this.$emit('change', fieldValue)
          this.$emit('scanned', result)
        }
      })
    },
    onCardChanged() {
      this.$emit('_change', this.fieldValue)
      this.$emit('change', this.fieldValue)
    },
    onCardConfirmed() {
      this.$emit('_change', this.fieldValue)
      this.$emit('change', this.fieldValue)
      this.$emit('confirm', this.fieldValue)
    }
  },
  watch: {
    value(val) {
      this.fieldValue = val
    }
  }
}
</script>

<style lang="less" scoped>
.med-idcard-field-wrapper {
  .van-field__right-icon .van-icon {
    font-size: 48px !important;
  }
}
</style>
