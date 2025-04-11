<template>
  <van-action-sheet
    class="med-select-options"
    duration="0.12"
    get-container="body"
    v-model="show"
    v-bind="$attrs"
    v-on="$listeners"
    @close="onClose"
    @open="onOpen"
    @click.stop
  >
    <!-- <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template> -->
    <div class="med-action-sheet__container">
      <van-button
        v-for="(action, index) in actions"
        :key="index"
        :class="'med-action-sheet__item' + getActionClass(action)"
        @click="onSelectClick(action)"
      >
        <span>{{ action.label }}</span>
      </van-button>
      <div class="med-action-sheet__gap"></div>
      <van-button class="med-action-sheet__item" @click="onClearClick">{{
        cancelText
      }}</van-button>
    </div>
    <van-empty
      :image="require('@assets/image/empty.png')"
      description="暂无数据"
      v-if="value && !actions.length && !$scopedSlots.length"
    />
  </van-action-sheet>
</template>

<script>
export default {
  name: '',
  props: {
    cancelText: {
      type: String,
      default: '取消'
    },
    value: {
      type: Boolean,
      default: false
    },
    actions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      show: this.value
    }
  },
  computed: {},
  methods: {
    onOpen() {
      this.$backhelper.push(() => {
        this.$emit('input', false)
      })
    },
    onClose() {
      this.$backhelper.pop()
    },
    getActionClass(action) {
      if (action && action.className) return ' ' + action.className
      return ''
    },
    onSelectClick(item) {
      this.$emit('select', item)
    },
    onClearClick() {
      console.log('clear')
      this.$emit('clear')
    }
  },
  watch: {
    value: function(val) {
      this.show = val
    }
  }
}
</script>

<style lang="less" scoped>
.med-select-options {
  /deep/ .van-action-sheet__header {
    background: #333bd2;
    color: #fff;
  }
  .med-action-sheet__container {
    display: flex;
    flex-direction: column;
    background: #fff;
    /deep/ .van-button::before {
      content: "";
      clear: both;
      background: none;
    }
  }
  .med-action-sheet__gap {
    display: block;
    height: 16px;
    background: #f7f8fa;
  }
  .med-action-sheet__item {
    position: relative;
    padding: 28px 32px;
    line-height: 44px;
    font-size: 32px;
    border-width: 0;
    &.van-button {
      height: auto;
    }

    &:before {
      content: "";
      border: 0.04rem solid #5e74fe;
      border-left: none;
      border-top: none;
      width: 0.18rem;
      height: 0.32rem;
      display: block;
      position: absolute;
      top: 0.5rem;
      left: 0.8rem;
      transition: all 0.2s linear;
      transform: rotate(45deg);
      opacity: 0;
    }
    &.selected {
      color: #5e74fe;
      &:before {
        animation: bounce 0.3s;
        transform: rotate(45deg);
        opacity: 1;
      }
    }
  }
}
</style>
