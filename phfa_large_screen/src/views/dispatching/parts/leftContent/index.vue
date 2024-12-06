<template>
  <aside>
    <info-card title="心电图" class="info-card">
      <div class="electrocardiogram">
        <a-carousel arrows v-if="ecgList.length">
          <div
            slot="prevArrow"
            slot-scope="props"
            class="custom-slick-arrow"
            style="left: 4px"
          >
            <a-icon type="left-circle" />
          </div>
          <div
            slot="nextArrow"
            slot-scope="props"
            class="custom-slick-arrow"
            style="right: 4px"
          >
            <a-icon type="right-circle" />
          </div>
          <div class="ecg-img" v-for="src in ecgList" :key="src">
            <img :src="src" @click="viewLargerImg(src)" />
          </div>
        </a-carousel>
        <div v-else class="empty-ecg flex-c-c">暂无心电图</div>
      </div>
    </info-card>
    <info-card :show-title="false" class="info-card">
      <tabs />
    </info-card>
  </aside>
</template>

<script>
import { mapGetters } from "vuex";
import tabs from "./tabs";
export default {
  components: { tabs },
  computed: {
    ...mapGetters(["curMissionDetail"]),
    ecgList() {
      return this.curMissionDetail?.ecgList || [];
    },
  },
  methods: {
    // 看大图
    viewLargerImg(src) {
      this.$confirm({
        width: 1240,
        centered: true,
        closable: true,
        maskClosable: true,
        icon: " ",
        okButtonProps: { style: { display: "none" } },
        cancelButtonProps: { style: { display: "none" } },
        content: (h) => (
          <img
            src={src}
            style={{
              display: "block",
              maxHeight: "600px",
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          />
        ),
      });
    },
  },
};
</script>

<style lang="less" scoped>
aside {
  width: 374px;

  .info-card {
    + .info-card {
      margin-top: 18px;
    }
    /deep/ .body-wrapper {
      padding-bottom: 10px;
    }

    .electrocardiogram {
      height: 250px;
      .custom-slick-arrow {
        width: 30px;
        height: 30px;
        font-size: 30px;
        color: #fff;
        background-color: rgba(31, 45, 61, 0.11);
        opacity: 0.3;
        z-index: 2;
        &:before {
          display: none;
        }
        &:hover {
          opacity: 0.6;
          transform: scale(1.2);
        }
      }
      .ecg-img {
        height: 250px;
        position: relative;
        /deep/ img {
          position: absolute;
          max-height: 100%;
          max-width: 100%;
          cursor: zoom-in;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }

      .empty-ecg {
        color: rgba(233, 233, 255, 0.4);
        height: 100%;
        font-size: 16px;
      }

      /deep/ .ant-carousel .slick-list .slick-slide {
        pointer-events: initial;
      }
    }
  }
}
</style>
