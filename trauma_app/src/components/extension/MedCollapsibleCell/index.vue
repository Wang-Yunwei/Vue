<template>
  <div class="med-collapsible-cell-wrapper">
    <van-cell-group>
      <template #title>
        <van-cell class="header" v-bind="$props" :is-link="showLink" :arrow-direction="arrow" :value="foldLabel"
          @click="onHeaderClick">
        </van-cell>
      </template>
      <div ref="body" class="body" :style="bodyStyle">
        <slot />
      </div>
    </van-cell-group>
  </div>
</template>

<script>
import T from 'vant/es/cell/index'
export default {
  name: '',
  props: {
    ...T.props,
    foldHeight: {
      type: Number,
      default: 86
    },
    foldable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      collapsible: false,
      foldLabel: '',
      foldStatus: true,
      bodyStyle: {},
      arrow: 'down',
      showLink: false
    }
  },
  mounted() {
    this.handleFolder()
  },
  computed: {
    // showLink() {
    //   if (!this.$refs.body) return this.foldable
    //   const bodyHeight = window
    //       .getComputedStyle(this.$refs.body)
    //       .getPropertyValue('height')
    //   return this.foldable && bodyHeight <= this.foldHeight
    // }
  },
  methods: {
    handleFolder() {
      if (!this.foldable) {
        this.hideFold()
        return
      }
      const bodyHeight = window
        .getComputedStyle(this.$refs.body)
        .getPropertyValue('height')
      if (
        this.foldStatus &&
        parseFloat(bodyHeight || 0) <= this.foldHeight + 10
      ) {
        this.hideFold()
        return
      }
      this.showLink = true
      if (this.foldStatus) {
        this.arrow = 'up'
        this.foldLabel = '展开'
        this.bodyStyle['max-height'] = `${this.foldHeight}px`
      } else {
        this.arrow = 'down'
        this.foldLabel = ''
        this.bodyStyle['max-height'] = 'none'
      }
      this.foldStatus = !this.foldStatus
    },
    hideFold() {
      this.foldLabel = ''
      this.showLink = false
      this.bodyStyle['max-height'] = 'none'
    },
    onHeaderClick() {
      this.handleFolder()
    }
  },
  watch: {
    foldable(val) {
      this.handleFolder()
    }
  }
}
</script>

<style lang="less" scoped>
.med-collapsible-cell-wrapper {
  /deep/ .header {
    padding-left: 0;
    padding-right: 0;

    .van-cell__value {
      text-align: right;
      flex: 0;
      min-width: 120px;
    }

    .van-cell__title {
      max-width: none;
      font-size: 36px;
      font-weight: bold;
    }
  }

  .van-cell-group__title {
    padding-top: 12px;
    padding-bottom: 6px;
  }

  .body {
    padding: 6px 30px;
    overflow: hidden;
  }
}
</style>
