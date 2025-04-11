<template>
  <med-view-container title="介入知情工具" @return="backClick">
    <div class="scroll-view content-wrapper">
      <van-image
        width="10rem"
        height="10rem"
        fit="contain"
        :src="require('@assets/image/jrzq.jpg')"
      />
      <med-radio-button-field
        required
        v-model="result"
        label="介入是否知情"
        :select-options="yesNoOption"
        :rules="[{ required: true, message: '必填' }]"
      />
    </div>
  </med-view-container>
</template>

<script>
import { yesNoOption } from '@constant/commonConstant'
export default {
  name: 'isPciInformed',
  data() {
    return {
      yesNoOption,
      result: ''
    }
  },
  props: ['pciInformed'],
  created() {},
  watch: {
    pciInformed: {
      immediate: true,
      handler(v) {
        this.result = v
      }
    }
  },
  methods: {
    backClick() {
      this.$emit('backClick', 'isPciInformed', this.result)
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
