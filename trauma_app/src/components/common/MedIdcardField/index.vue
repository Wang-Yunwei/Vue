<template>
  <div class="med-card-field-wrapper">
    <med-hint-field
      v-bind="$props"
      v-model="fieldValue"
      @change="onCardChanged"
      @confirm="onCardConfirmed"
      v-char
    >
      <template #right-icon>
        <van-icon
          name="scan"
          @click="onIconClick"
          v-if="showScan && !disabled"
        />
      </template>
    </med-hint-field>
  </div>
</template>

<script>
import MedHintField from '../MedHintField/index.jsx'
export default {
  name: '',
  props: {
    ...MedHintField.props,
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'idcard'
    },
    readonly: {
      type: Boolean,
      default: false
    },
    showScan: {
      type: Boolean,
      default: true
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
  computed: {
    cardtype() {
      if (this.type === 'idcard') return '2'
      if (this.type === 'cvcard') return '3'
      return ''
    }
  },
  methods: {
    // 1:二维码,2:身份证,3:医保卡
    onIconClick() {
      this.$bridge.callhandler('scanner', { type: [this.cardtype] }, data => {
        if (!data) this.$toast('无效的扫描数据')
        const result = JSON.parse(data)
        if (result && (result.type === '2' || result.type === '3')) {
          let cardValue = ''
          if (result.type === '2') cardValue = result.identity
          else if (result.type === '3') cardValue = result.cardNo
          this.fieldValue = cardValue
          this.$emit('_change', cardValue)
          this.$emit('change', cardValue)
          this.$emit('confirm', cardValue)
          this.$emit('scanned', result)
        } else {
          this.$toast('不支持的扫码类型')
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
.med-card-field-wrapper {
  .van-field__right-icon .van-icon {
    font-size: 48px !important;
  }
}
</style>
