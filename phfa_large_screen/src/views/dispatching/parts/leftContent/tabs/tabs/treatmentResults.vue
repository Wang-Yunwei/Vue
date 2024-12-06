<template>
  <div class="basic-info">
    <p>
      病情转归 :
      {{ parseRescueChangeResult(pageData.rescueChangeResult) }}
    </p>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      showDrugs: [],
    };
  },

  computed: {
    ...mapGetters(["curMissionDetail", "dicMap"]),
    pageData() {
      const { medPhepMedicalRecordsEntity, measuresList, usingDrugsList } =
        this.curMissionDetail;
      return {
        ...(medPhepMedicalRecordsEntity || {}),
        measuresList: measuresList || [],
        usingDrugsList: usingDrugsList || [],
      };
    },
    getSource() {
      switch (this.sourceType) {
        case "dirTree":
          return this.dirTree;
        case "rootDirTree":
          return this.rootDirTree;
        case "assetCategoryTree":
          return this.assetCategoryTree;
        case "assetCategoryOnlyTree":
          return this.assetCategoryOnlyTree;
        default:
          return this.assetCategoryTree;
      }
    },
  },
  created() {
  },
  mounted() {},
  methods: {
    // 解析字典值
    parseDicVal(dicName, dicVal, defaultVal) {
      const opts = this.dicMap[dicName] || [];
      const matched = opts.find((o) => o.value === dicVal);
      return matched?.label || defaultVal;
    },
    // 病情判断
    parseConditionGrade(v) {
      return this.parseDicVal("conditionJudgment", v);
    },
    // 病情转归
    parseRescueChangeResult(v) {
      return this.parseDicVal("prognosis", v);
    },
    // 出诊结果
    parseTreatmentResult(v) {
      return this.parseDicVal("visitResult", v);
    },
    FindTreeCurrentItem(val, tree) {
      let currentItem = null;
      for (const key in tree) {
        const item = tree[key];
        if (item.id == val) {
          currentItem = item;
        } else {
          if (item.children && item.children.length > 0) {
            currentItem = this.FindTreeCurrentItem(val, item.children);
          }
        }

        if (currentItem != null) break;
      }
      return currentItem;
    },
    getPath(val, tree) {
      const ret = [];
      let name;
      while (val != "0") {
        const currentItem = this.FindTreeCurrentItem(val, tree);
        val = currentItem.parentId;
        name = currentItem.name;
        if (name != "0") {
          ret.unshift(name);
        }
      }
      console.log(ret, "ret");
      return ret;
    },
    matchingDia(k, v) {
      const diagnosisList = this.$enums.dic.getter(k);
      const diagnItem = diagnosisList.find((item) => item.v === v);
      return diagnItem.codeName + "-" + diagnItem.k;
    },
  },
};
</script>
<style lang="less" scoped>
@import "./index.less";
.list-item {
  line-height: 2.4;
  padding-left: 10px;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-left: none;
  border-right: none;
}
</style>
