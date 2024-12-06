<template>
  <div class="basic-info">
    <!-- 标题文字 -->
    <a-row type="flex" align="bottom" class="title-row">
      <a-col :offset="1">
        <div class="name">{{ patientInfo.name }}</div>
      </a-col>
      <a-col :offset="1">
        <div class="age">
          {{ patientInfo.age }}{{ parseAgeUnit(patientInfo.ageExtend) }}
        </div>
      </a-col>
    </a-row>

    <!-- 明细文字 -->
    <p>国籍 : {{ parseState(patientInfo.state) }}&nbsp;&nbsp; 民族 :{{
          parseNation(patientInfo.nation)
      }}
    </p>
    <p>{{ parseCardType(patientInfo.cardType) }} :
      {{ patientInfo.cardNo }}
    </p>
    <p>联系人 : {{ patientInfo.contact }} &nbsp;&nbsp;
      <img src="~@/assets/tel.png" alt="phone" />
      {{ patientInfo.contactNumber }}
    </p>
    <p>MPDS : {{ patientInfo.mpds }}</p>
    <p>呼救原因 : {{ patientInfo.reasonType }}</p>
    <p>疾病类别 : {{ parseDiseaseCategory(patientInfo.diseaseCategory) }}</p>
    <p>腕带 : {{ patientInfo.tagId }}</p>
    <p>出车分站 : {{ parseSite(patientInfo.dispatchVehicleSite) }}</p>
    <p>接诊地址 : {{ patientInfo.address }}</p>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { escPageList }from '@/api'

export default {
  data() {
    return { dispatchVehicleSiteList: [] };
  },
  computed: {
    ...mapGetters(["curMissionDetail", "dicMap"]),
    patientInfo() {
      const patientEntity = this.curMissionDetail?.medPhepPatientsEntity || {};
      const recordsEntity =
        this.curMissionDetail?.medPhepMedicalRecordsEntity || {};
      const missionsEntity = this.curMissionDetail?.medPhepMissionsEntity || {};

      return {
        ...patientEntity,
        contact: recordsEntity.contact,
        contactNumber: recordsEntity.contactNumber,
        reasonType: recordsEntity.reasonType,
        mpds: missionsEntity.mpds,
        diseaseCategory: recordsEntity.diseaseCategory,
        address: recordsEntity.address,
        dispatchVehicleSite: missionsEntity.dispatchVehicleSite,
      };
    },
    genderClass() {
      const cls = ["gender"];
      switch (this.patientInfo.gender) {
        case "1":
          cls.push("male");
          break;
        case "2":
          cls.push("female");
          break;
        default:
          break;
      }
      return cls;
    },
  },
  mounted() {
    this.getStations()
  },
  methods: {
    // 急救站
    async getStations() {
      const res = await escPageList({});
      if (res.code === "000000") {
        this.dispatchVehicleSiteList = (res.body?.records || []).map((item) => {
          return {
            ...item,
            label: item.name,
            value: item.id,
          };
        });
      } else {
        this.$message.error("获取出车分站失败!" + res.message);
      }
    },
    // 解析字典值
    parseDicVal(dicName, dicVal, defaultVal) {
      const opts = this.dicMap[dicName] || [];
      const matched = opts.find((o) => o.value === dicVal);
      return matched?.label || defaultVal;
    },
    // 解析年龄单位
    parseAgeUnit(v) {
      return this.parseDicVal("ageType", v, "岁");
    },
    // 解析证件类型
    parseCardType(v) {
      return this.parseDicVal("idCard", v, "证件号");
    },
    // 解析民族
    parseNation(v) {
      return this.parseDicVal("nation", v, "未知");
    },
    // 解析国籍
    parseState(v) {
      return this.parseDicVal("country", v, "未知");
    },
    // 解析疾病类别
    parseDiseaseCategory(v) {
      return this.parseDicVal("diseaseCategory", v, "未知");
    },
    // 出车分站
    parseSite(v) {
      const opts = this.dispatchVehicleSiteList || [];
      const matched = opts.find((o) => o.value === v);
      return matched?.label || '未知';
    },
  }

};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
