<template>
  <div class="card">
    <div class="title-wrapper" v-if="showTitle">
      <div class="card-title">
        <gradient-text>{{ title }}</gradient-text>
      </div>
      <div class="extra">
        <div class="stripe" :style="{ clipPath: stripeClipPath }"></div>
      </div>
    </div>
    <div :class="{ 'body-wrapper': true, 'no-title': !showTitle }">
      <div class="card-body"><slot></slot></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InfoCard",
  props: {
    title: {
      type: String,
      default: "标题",
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    stripeClipPath() {
      return this.genPath({
        startX: 10,
        width: 8,
        gapWidth: 5,
        height: 20,
        offset: 14,
        num: 17,
      });
    },
  },
  methods: {
    genPath({ startX, width, gapWidth, height, offset, num }) {
      let str = `polygon(`;
      let curx = startX;
      for (let i = 0; i < num; i++) {
        str += `${curx + gapWidth}px 0,${
          curx + gapWidth + offset
        }px ${height}px,${curx + gapWidth + offset + width}px ${height}px,${
          curx + gapWidth + width
        }px 0px${i < num - 1 ? "," : ")"}`;
        curx += gapWidth + width;
      }
      return str;
    },
  },
};
</script>

<style lang="less" scoped>
.card {
  overflow: hidden;
  .title-wrapper {
    display: flex;
    .card-title {
      min-width: 108px;
      font-size: 19px;
      line-height: 19px;
      white-space: nowrap;
      font-weight: bold;
      padding-left: 30px;
      padding-top: 9px;
      border-top: 2px solid rgb(72, 119, 184);
      border-left: 2px solid #537eb7;
      position: relative;
      box-shadow: 4px 5px 6px rgba(72, 119, 184, 0.36) inset;
      background: rgba(100, 170, 240, 0.1);

      &:before {
        content: "";
        position: absolute;
        left: 12px;
        top: calc(50%);
        display: block;
        width: 10px;
        height: 10px;
        background-image: linear-gradient(#fff, rgb(129, 207, 255));
      }
      &:after {
        content: "";
        display: block;
        position: absolute;
        bottom: -11px;
        background: linear-gradient(
          90deg,
          transparent 33%,
          #3192ff 0,
          #3192ff 65%,
          transparent 0
        );
        opacity: 0.5;
        background-size: 7px 10px;
        width: 194px;
        height: 6px;
        transform: skewX(34deg);
      }
    }
    .extra {
      padding-left: 26px;
      position: relative;
      flex: auto;
      .stripe {
        margin-top: 5px;
        height: 13px;
        background: linear-gradient(
          to right,
          transparent 20%,
          rgba(49, 164, 255, 0.2) 40%,
          #3192ff 100%
        );
        opacity: 0.5;
      }
      &:before {
        content: "";
        display: block;
        height: 30px;
        width: calc(100% - 18px);
        left: 8px;
        position: absolute;
        border: 2px solid rgb(72, 119, 184);
        border-top: none;
        border-right: none;
        box-shadow: -5px 2px 10px rgba(72, 119, 184, 0.6);
        transform: skewX(34deg);
      }
      &:after {
        content: "";
        display: block;
        margin: 2px 0;
        height: 0;
        border-top: 5px solid #3caceb;
        border-left: 5px solid transparent;
      }
    }
  }
  .body-wrapper {
    border: 2px solid rgb(72, 119, 184);
    border-top: none;
    padding: 20px;
    background: rgba(100, 170, 240, 0.1);
    position: relative;
    overflow: hidden;
    &.no-title {
      border-top: 2px solid rgb(72, 119, 184);
      &:before{
        border-top: 3px solid #96c2ff;
      }
    }
    &:before {
      content: "";
      display: block;
      position: absolute;
      left: -2px;
      top: -3px;
      width: calc(100% + 4px);
      height: calc(100% + 5px);
      border: 3px solid #96c2ff;
      border-top: transparent;
      filter: blur(5px);
      pointer-events: none;
    }

    .card-body {
      //   padding: 40px;
      //   border: 1px solid rgb(1, 91, 157);
      //   border-radius: 6px;
      //   background: rgba(100, 170, 240, 0.25);
    }
  }
}
</style>
