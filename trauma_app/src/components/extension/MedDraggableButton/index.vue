<template>
  <div class="med-draggable-button-wrapper" @mousedown="down" @touchstart="down" @mousemove="move" @touchmove="move"
    @mouseup="end" @touchend="end" ref="button">
    <van-button v-bind="$props" @click="onClick">
      <slot />
    </van-button>
  </div>
</template>

<script>
import T from 'vant/es/button/index'
export default {
  name: 'MedDraggableButton',
  props: {
    ...T.props
  },
  data() {
    return {
      flags: false,
      position: {
        x: 0,
        y: 0
      },
      nx: '',
      ny: '',
      dx: '',
      dy: '',
      xPum: '',
      yPum: ''
    }
  },
  created() { },
  mounted() { },
  methods: {
    down() {
      this.flags = true
      let touch
      if (event.touches) {
        touch = event.touches[0]
      } else {
        touch = event
      }
      this.position.x = touch.clientX
      this.position.y = touch.clientY
      this.dx = this.$refs.button.offsetLeft
      this.dy = this.$refs.button.offsetTop
    },
    move() {
      if (this.flags) {
        var touch
        if (event.touches) {
          touch = event.touches[0]
        } else {
          touch = event
        }
        this.nx = touch.clientX - this.position.x
        this.ny = touch.clientY - this.position.y
        this.xPum = this.dx + this.nx
        this.yPum = this.dy + this.ny
        const width =
          window.innerWidth - this.$refs.button.firstChild.offsetWidth // 屏幕宽度减去自身控件宽度
        const height =
          window.innerHeight - this.$refs.button.firstChild.offsetHeight // 屏幕高度减去自身控件高度
        this.xPum < 0 && (this.xPum = 0)
        this.yPum < 0 && (this.yPum = 0)
        this.xPum > width && (this.xPum = width)
        this.yPum > height && (this.yPum = height)
        if (
          this.xPum >= 0 &&
          this.yPum >= 0 &&
          this.xPum <= width &&
          this.yPum <= height
        ) {
          this.$refs.button.style.left = this.xPum + 'px'
          this.$refs.button.style.top = this.yPum + 'px'
        }
        document.addEventListener(
          'touchmove',
          function () {
            event.preventDefault()
          },
          false
        )
      }
    },
    end() {
      this.flags = false
    },
    onClick() {
      this.$emit('click')
    }
  },
  computed: {}
}
</script>

<style lang="less" scoped>
.med-draggable-button-wrapper {
  position: absolute;
  touch-action: none;
  z-index: 999;

  .van-button {
    border-radius: 50%;
    width: 1.733333rem;
    height: 1.733333rem;
    padding: 0;
    aspect-ratio: 1;
    background: rgb(94, 116, 254);
    color: #fff;
    border-color: rgb(94, 116, 254);
  }

  .van-button .iconfont {
    font-size: 40px;
  }
}
</style>
