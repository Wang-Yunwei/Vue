<template>
  <bm-overlay
    ref="customOverlay"
    :class="{ sample: true, active }"
    pane="labelPane"
    @draw="draw"
  >
    <div @click="handleClick" @touchstart="handleClick">
      <div class="hos-title">{{ point.name }}</div>
      <div class="specialties">
        <i
          v-if="specialistCenters.includes('1')"
          class="iconfont iconzhuankezhongxintubiao_zuzhong"
        ></i>
        <i
          v-if="specialistCenters.includes('2')"
          class="iconfont iconzhuankezhongxintubiao_xiongtong"
        ></i>
        <i
          v-if="specialistCenters.includes('3')"
          class="iconfont iconzhuankezhongxintubiao_chuangshang"
        ></i>
        <!-- <i class="iconfont iconzhuankezhongxintubiao_yunchanfu"></i> -->
        <!-- <i class="iconfont iconzhuankezhongxintubiao_xinshenger"></i> -->
      </div>
    </div>
  </bm-overlay>
</template>

<script>
export default {
  props: ['position', 'active', 'point'],
  computed: {
    specialistCenters() {
      //  1:卒中  2:胸痛   3:创伤
      const str = this.point?.specialistCenter || ''
      const list = str.split(',').filter(el => el)
      return list
    }
  },
  watch: {
    position: {
      handler() {
        this.$refs.customOverlay.reload()
      },
      deep: true
    }
  },
  methods: {
    handleClick() {
      this.$emit('click')
    },
    draw({ el, BMap, map }) {
      const { lng, lat } = this.position
      const pixel = map.pointToOverlayPixel(new BMap.Point(lng, lat))
      el.style.left = pixel.x - 60 + 'px'
      el.style.top = pixel.y - 20 + 'px'
    }
  }
}
</script>

<style lang="less">
.sample {
  opacity: 0.85;
  width: max-content;
  padding: 10px 18px;
  color: #fff;
  text-align: center;
  transform: translate(-66px, -95%);
  position: absolute;
  background-color: #444fdb;
  border-radius: 10px;
  box-shadow: 8px 16px 22px rgba(0, 0, 0, 0.3);
  &:after {
    content: "";
    display: block;
    border-left: 24px solid #444fdb;
    border-top: 24px solid transparent;
    position: absolute;
    bottom: -10px;
    left: calc(50% - 12px);
    transform: rotate(-45deg);
  }
}
.sample.active {
  color: #fff;
}
.iconicon1svg-51 {
  color: #f54336;
  background-image: radial-gradient(
    closest-corner at 50% 40%,
    #fff 50%,
    transparent 51%
  );
  font-size: 80px;
}

.hos-title {
  display: inline-block;
  max-width: 210px;
  border-bottom: 1px solid #fff;
  padding-bottom: 6px;
  margin-bottom: 2px;
}

.specialties {
  padding-top: 10px;
  line-height: 32px;
  i.iconfont {
    font-size: 32px;
    margin: 0 6px;
  }
}
</style>
