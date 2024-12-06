<template>
  <div class="basic-info">
    <p>患者主诉 : {{ pageData.chiefComplaint }}</p>
    <p>
      初步诊断 :
      {{ pageData.diagnosis }}
    </p>
    <p>病情判断 : {{ parseConditionGrade(pageData.conditionGrade) }}</p>
    <p>呼吸 : {{ pageData.rr }} 次/分</p>
    <p>脉搏 : {{ pageData.pulse }} 次/分</p>
    <p>收缩压: {{ pageData.sbp }} mmhg</p>
    <p>舒张压 : {{ pageData.dbp }} mmhg</p>
    <p>SPO2 : {{ pageData.spo2 }} %</p>
    <p>意识 : {{ parseConsciousness(pageData.consciousness) }}</p>
    <p>皮肤 : {{ parseDicVal("skin", pageData.skin) }}</p>
    <p>瞳孔 : {{ parseDicVal("pupil", pageData.pupilResponse) }}</p>
    <p>
      对光反射 : {{ parseDicVal("lightReaction", pageData.lightReflection) }}
    </p>
    <p>体温 : {{ pageData.t }} °C</p>
    <p>辅助检查 : {{ pageData.accessoryExam }}</p>
    <hr />
    <p>急救措施 :</p>
    <p v-for="m in pageData.measuresList" :key="m.name">
      {{ m.measureName }} {{ m.opTime }}
    </p>
    <hr />
    <p>用药 :</p>
    <p v-for="drug in pageData.usingDrugsList" :key="drug.name">
      {{ drug.name }} <br />
      {{ drug.defaultUsage }} /
      {{ drug.defaultDose }}
      {{ drug.drugUnit }}<br />
      {{ drug.createTime }}
    </p>
    <p>其他用药 : {{ pageData.otherDruge }}</p>
    <hr />
    <p>
      交接医院 :
      {{ parseHospital(pageData.toHospital) }}
    </p>
    <p>
      交接科室 :
      {{ parsehandoverDepartment(pageData.dept) }}
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
    ...mapGetters([
      "curMissionDetail",
      "dicMap",
      "hospitalAreaList",
    ]),
    toHospialList() {
      return this.hospitalAreaList;
    },
    pageData() {
      const {
        medPhepShiftRecordEntity,
        measuresList,
        usingDrugsList,
        generalList,
      } = this.curMissionDetail;
      const lastPhysicalExamination =
        (generalList && (generalList || [])[generalList.length - 1]) || {};

      return {
        ...(medPhepShiftRecordEntity || {}),
        measuresList: measuresList || [],
        usingDrugsList: usingDrugsList || [],
        ...lastPhysicalExamination,
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
  created() {},
  mounted() {},
  methods: {
    // 解析字典值
    parseDicVal(dicName, dicVal, defaultVal) {
      const opts = this.dicMap[dicName] || [];
      const matched = opts.find((o) => o.value === dicVal);
      return matched?.label || defaultVal;
    },
    // 意识
    parseConsciousness(v) {
      return this.parseDicVal("consciousness", v);
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
    // 交接科室
    parsehandoverDepartment(v) {
      return this.parseDicVal("handoverDepartment", v);
    },
    parseHospital(v) {
      const matched = this.toHospialList.find((h) => h.value === v);
      return matched?.label;
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
