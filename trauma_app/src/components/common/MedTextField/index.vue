<template>
  <div class="med-text-field-wrapper">
    <med-hint-field v-bind="$props" v-model="fieldValue" @blur="onConfirm" @input="onInput">
      <template #right-icon>
        <van-icon name="apps-o" @click="onIconClick" v-if="showSelectIcon" />
      </template>
    </med-hint-field>
    <med-popup-container v-model="show" :title="optionTitle" :duration="0.15" get-container="body" position="right"
      @click.stop @return="show = false">
      <van-empty :image="require('@assets/image/empty.png')" description="暂无数据" v-if="show && !selectOptions.length" />
      <div class="med-select-page-wrapper">
        <van-radio-group v-model="selectedValue">
          <van-cell-group>
            <van-cell clickable v-for="item in selectOptions" :key="item.label" :title="item.label"
              @click="handleSelect(item)">
              <template #right-icon>
                <van-radio :name="item.value" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
    </med-popup-container>
  </div>
</template>

<script>
import MedHintField from '../MedHintField/index.jsx'
export default {
  name: '',
  props: {
    ...MedHintField.props,
    textValue: {
      type: String,
      default: ''
    },
    selectOptions: {
      type: Array,
      default: () => []
    },
    voiceInput: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: 'textValue',
    event: '_change'
  },
  data() {
    return {
      show: false,
      fieldValue: this.textValue,
      selectedValue: ''
    }
  },
  mounted() {
    this.fieldValue = this.textValue
    this.$forceUpdate()
  },
  computed: {
    optionTitle() {
      return this.label
    },
    showSelectIcon() {
      return (
        !this.readonly &&
        !this.disabled &&
        !this.voiceInput &&
        this.selectOptions &&
        this.selectOptions.length > 0
      )
    }
  },
  methods: {
    onIconClick() {
      const _this = this
      if (!this.readonly && !this.disabled) {
        setTimeout(function () {
          _this.show = true
        }, 100)
      }
    },
    handleSelect(selected) {
      this.fieldValue = selected.label
      this.onConfirm()
      this.$emit('select', selected)
      this.show = false
    },
    onInput() {
      this.$emit('_change', this.fieldValue)
    },
    onConfirm() {
      this.$emit('_change', this.fieldValue)
      this.$emit('change', this.fieldValue)
      this.$emit('confirm', this.fieldValue)
    }
  },
  watch: {
    fieldValue(val) {
      this.selectedValue = val
      this.$emit('change', val)
    },
    textValue(val) {
      this.fieldValue = this.textValue
    }
  }
}
</script>

<style lang="less" scoped>
.med-text-field-wrapper {
  .van-field__right-icon .van-icon {
    font-size: 48px !important;
  }
}
</style>
