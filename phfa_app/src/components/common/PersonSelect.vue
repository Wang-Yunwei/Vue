<template>
  <div class="doctor-select-wrapper">
    <van-field :label="label" v-model="innerVal">
      <template #right-icon>
        <i class="iconfont iconicon1-191" @click="showPopup" />
      </template>
    </van-field>
    <van-popup v-model="show" position="bottom" :style="{ height: '40%' }">
      <!--接诊医生选择器的 弹窗 -->
      <van-search placeholder="请输入名称搜索" v-model="doctorSearch" />
      <van-picker
        :default-index="defaultIndex"
        cancel-button-text="取消"
        show-toolbar
        :columns="doctorsSearchResult"
        @confirm="onConfirmPicker"
        @cancel="show = false"
        item-height="1rem"
      />
    </van-popup>
  </div>
</template>

<script>
// 医生护士选择
export default {
  name: 'PersonSelect',
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      show: false,
      doctorSearch: ''
    }
  },
  computed: {
    defaultIndex() {
      const idx = this.doctorsSearchResult.indexOf(this.value)
      return idx >= 0 ? idx : 0
    },
    innerVal: {
      get() {
        return this.value
      },
      set(v) {
        this.$emit('input', v)
      }
    },
    // 根据输入过滤医生
    doctorsSearchResult() {
      // 获取接诊医生的选择项
      const ret = []
      this.options.forEach(item => {
        // 搜索根据医生姓名搜索
        if (this.doctorSearch) {
          if (item.label.indexOf(this.doctorSearch) > -1) {
            // item.label  接诊医生的label中文属性
            ret.push(item.label)
          }
        } else {
          ret.push(item.label) // 没有搜索显示全部
        }
      })
      return ret
    }
  },
  created() {},
  methods: {
    onConfirmPicker(value) {
      this.$emit('input', value)
      this.show = false
    },
    showPopup() {
      this.show = true
    }
  }
}
</script>

<style lang="less" scoped>
.doctor-select-wrapper {
  position: relative;
  &::after {
    position: absolute;
    box-sizing: border-box;
    content: " ";
    pointer-events: none;
    right: 0.426667rem;
    bottom: 0;
    left: 0.426667rem;
    border-bottom: 0.026667rem solid #ebedf0;
    -webkit-transform: scaleY(0.5);
    -ms-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .iconicon1-191 {
    font-size: 0.42rem;
    padding: 0.2rem;
  }
  /deep/ .van-field__right-icon {
    border-left: 0.013333rem solid #cacaca;
    line-height: 0.5rem;
    padding: 0;
  }
}
</style>
