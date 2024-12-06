<template>
  <a-tabs size="small" type="card" v-if="pageData.length">
    <a-tab-pane v-for="(item, index) in pageData" :key="item.id" :tab="'体格检查' + (index + 1)" :force-render="true">
      <div class="basic-info">
        <p>脉搏 : {{ item.pulse }} 次/分</p>
        <p>呼吸频率 : {{ item.rr }} 次/分</p>
        <p>收缩压 : {{ item.sbp }} mmHg</p>
        <p>舒张压 : {{ item.dbp }} mmHg</p>
        <p>SPO2 : {{ item.spo2 }} %</p>
        <p>体温 : {{ item.t }} ℃</p>
        <p>
          意识 :
          {{ parseConsciousness(item.consciousness) }}
        </p>
        <p>
          皮肤 :
          {{ parseSkin(item.skin) }}
        </p>
        <p>
          瞳孔 :
          {{ parsePupilResponse(item.pupilResponse) }}
        </p>
        <p>
          对光反射 :
          {{ parseLightReflection(item.lightReflection) }}
        </p>
      </div>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "PhysicalExamination",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["curMissionDetail", "dicMap"]),
    pageData() {
      return this.curMissionDetail?.generalList || [];
    },
  },
  methods: {
    // 解析字典值
    parseDicVal(dicName, dicVal, defaultVal = "") {
      const opts = this.dicMap[dicName] || [];
      const matched = opts.find((o) => o.value === dicVal);
      return matched?.label || defaultVal;
    },
    parseConsciousness(v) {
      return this.parseDicVal("consciousness", v);
    },
    parseSkin(v) {
      return this.parseDicVal("skin", v);
    },
    parsePupilResponse(v) {
      return this.parseDicVal("pupil", v);
    },
    parseLightReflection(v) {
      return this.parseDicVal("lightReaction", v);
    },
  },
};
</script>
<style lang="less" scoped>
@import "./index.less";

/deep/ .ant-tabs-bar {
  border-color: #4877b8;
  margin-bottom: 0;
}

/deep/ .ant-tabs-bar.ant-tabs-top-bar .ant-tabs-nav-container {
  height: 34px;

  .ant-tabs-nav-wrap .ant-tabs-nav .ant-tabs-tab {
    background-color: transparent;
    color: #4c90d8;
    border-color: #4877b8;
    border-radius: 4px 4px 0 0;
    height: 34px;
    line-height: 34px;

    &.ant-tabs-tab-active {
      color: #fff;
      border-bottom: 1px solid #132840;
    }
  }
}

/deep/ .ant-tabs-content {
  border-left: none;
  box-shadow: -13px 0 0 rgba(0, 0, 0, 0.26);
  position: relative;
  padding-left: 8px;
  padding-top: 2px;
}
</style>
