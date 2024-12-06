<template>
  <div class="tag">
    <canvas ref="canvas" width="100%" height="100%" />
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  mounted() {
    if (this.status) this.draw();
  },
  watch: {
    status(v) {
      if (v) this.draw();
    },
  },
  methods: {
    statusColor(status) {
      const blur = ["rgb(146,202,255)", "rgb(81,147,222)", "rgb(38,100,200)"];
      const orange = ["#fd9", "orange", "#f40"];
      let colorArr = blur;
      if (["送往医院", "到达医院"].includes(status)) {
        colorArr = orange;
      }
      return colorArr;
    },
    draw() {
      const c = this.$refs.canvas;
      if (c) {
        const ctx = c.getContext("2d");

        const pathArr = [
          [0, 0],
          [100, 0],
          [100, 100],
          [90, 100],
          [90, 95],
          [80, 95],
          [80, 90],
          [70, 90],
          [70, 85],
          [60, 85],
          [60, 80],
          [40, 80],
          [40, 85],
          [30, 85],
          [30, 90],
          [20, 90],
          [20, 95],
          [10, 95],
          [10, 100],
          [0, 100],
        ];

        const xOffset = 5;
        const yOffset = 2;

        const xScale = 0.7;
        const yScale = 0.5;

        ctx.beginPath();
        //设置路径对应值
        pathArr.forEach((a, i) => {
          const newA = [a[0] * xScale + xOffset, a[1] * yScale + yOffset];
          if (i) {
            ctx.lineTo(...newA);
          } else {
            //设置路径的起点
            ctx.moveTo(...newA);
          }
        });
        ctx.closePath();

        // 创建渐变
        const grd = ctx.createLinearGradient(40, 0, 40, 70);

        const colorArr = this.statusColor(this.status);
        if (colorArr?.length) {
          grd.addColorStop(0, colorArr[0]);
          grd.addColorStop(0.1, colorArr[1]);
          grd.addColorStop(1, colorArr[2]);
        }

        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 6;
        ctx.shadowColor = "rgba(0,0,0,0.3)";

        // 填充渐变
        ctx.fillStyle = grd;
        ctx.fill();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.tag {
  position: relative;
  width: 80px;
  height: 70px;

  .content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 26px;
    font-weight: 600;
    font-size: 14px;
  }
}
</style>
