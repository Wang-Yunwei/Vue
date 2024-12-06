<template>
  <div class="basic-info">
    <p>体格检查</p>
    <div class="indent">
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
    </div>

    <hr />
    <p>血糖 : {{ pageData.bloodglucose }}</p>
    <hr />
    <p>POCT</p>
    <div class="indent">
      <p>TnT : {{ pageData.poct.tnt }} {{ pageData.poct.tntUnit }}</p>
      <p>Tnl : {{ pageData.poct.tnl }} {{ pageData.poct.tnlUnit }}</p>
      <p>
        D-二聚体 : {{ pageData.poct.dDimer }} {{ pageData.poct.dDimerUnit }}
      </p>
      <p>血清肌酐 : {{ pageData.poct.serum }} {{ pageData.poct.serumUnit }}</p>
      <p>CKMB : {{ pageData.poct.ckmb }} {{ pageData.poct.ckmbUnit }}</p>
      <p>BNP : {{ pageData.poct.bnp }} {{ pageData.poct.bnpUnit }}</p>
      <p>
        NT-proBNP : {{ pageData.poct.ntProbnp }}
        {{ pageData.poct.ntProbnpUnit }}
      </p>
      <p>Myo : {{ pageData.poct.myo }} {{ pageData.poct.myoUnit }}</p>
    </div>
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
      const { medPhepMedicalRecordsEntity, generalList, medPhepPoctEntity } =
        this.curMissionDetail;
      const lastPhysicalExamination =
        (generalList || [])[generalList?.length - 1] || {};

      return {
        ...medPhepMedicalRecordsEntity,
        ...lastPhysicalExamination,
        poct: medPhepPoctEntity || {},
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
.indent {
  padding-left: 10px;
}
</style>
