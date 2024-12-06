<template>
  <div class="basic-info">
    <!-- 明细文字 -->
    <p>病历号 : {{ pageData.code }}</p>
    <p>
      病史提供者 :
      {{ parseProvideType(pageData.medicalHisProType) }}
    </p>
    <p>病史提供者姓名 : {{ pageData.historyProvider }}</p>
    <p>发病时间 : {{ parseDiseaseTime(pageData.morbtimearea) }}</p>
    <p>主诉 : {{ pageData.chiefComplaint }}</p>
    <p>现病史 : {{ pageData.presentIllness }}</p>
    <p>既往史 : {{ pageData.pastHistory }}</p>
    <p>过敏史 : {{ pageData.allergicHistory }}</p>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["curMissionDetail", "dicMap"]),
    pageData() {
      const recordsEntity =
        this.curMissionDetail?.medPhepMedicalRecordsEntity || {};
      return {
        ...recordsEntity,
      };
    },
  },
  mounted() {},
  methods: {
    // 解析发病时间
    parseDiseaseTime(time) {
      if (typeof time === "string") {
        if (time.includes("~")) {
          const onsetTimeList = this.dicMap.onsetTime || [];
          const aliasMap = {};
          onsetTimeList.forEach((item) => {
            aliasMap[item.value] = item.label;
          });
          const [start, end] = time.split("~");
          if (end) {
            const prefix = this.$moment(start).format("YYYY-MM-DD");
            const startHour = start.slice(11, 13);
            const endHour = end.slice(11, 13);
            const key = `${parseInt(startHour)}-${parseInt(endHour)}`;
            const suffix = aliasMap[key];
            return prefix + " \n" + suffix;
          }
          return start;
        }
        return (time||'').replace(/T|\:\d\d$/g,' ');
      }
      return "";
    },
    // 解析病史提供者类型
    parseProvideType(type) {
      const opts = this.dicMap.medicalHistoryProvider || [];
      return opts.find((el) => el.value === type)?.label;
    },
  },
};
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
