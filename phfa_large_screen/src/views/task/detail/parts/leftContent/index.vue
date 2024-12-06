<template>
  <aside>
    <info-card title="车辆信息" class="info-card"
      ><rounded-rectangle show-tag tag-text="120急救中心">
        <div class="info-title">
          <gradient-text>{{ curData().licensePlate }}</gradient-text>
        </div>
        <ul class="info-list">
          <li>
            <span>出车分站：</span
            ><span>{{ curData().dispatchVehicleSite }}</span>
          </li>
          <li><span>急诊类型：</span><span>转院</span></li>
          <li>
            <span>接诊地址：</span
            ><span>{{
              curData().address || curData().destinationAddress
            }}</span>
          </li>
          <li>
            <span>送往医院：</span
            ><span>{{ curData().toHospitalName || curData().toHospial }}</span>
          </li>
        </ul>
      </rounded-rectangle></info-card
    ><info-card title="患者信息" class="info-card">
      <rounded-rectangle>
        <div class="info-title flex-c-s">
          <span class="name">{{ curData().name }}</span>
          <span class="age">{{ curData().age }}</span>
          <span :class="genderClass(curData().gender)"></span>
        </div>
        <ul class="info-list">
          <li>
            <span>疾病类别：</span><span>{{ curData().diseaseCategory }}</span>
          </li>
          <li>
            <span>初步诊断：</span><span>{{ curData().diagnosis }}</span>
          </li>
          <li>
            <span>急救措施：</span><span>{{ parseTreatment(curData()) }}</span>
          </li>
        </ul>
      </rounded-rectangle>
      <div class="vital-signs">
        <div class="flex-c-b">
          <div class="vital-signs-card txt-c corners">
            <div class="vital-signs-card-title">心率</div>
            <div class="vital-signs-card-value">
              <span :class="['number', 'level-' + calcLevel(112, 'pulse')]">{{
                curData().pulse
              }}</span
              ><span class="unit">bpm</span>
            </div>
          </div>
          <div class="vital-signs-card txt-c corners">
            <div class="vital-signs-card-title">血压</div>
            <div class="vital-signs-card-value">
              <span :class="['number', 'level-' + calcLevel(112, 'sbp')]">{{
                curData().sbp
              }}</span
              >/<span :class="['number', 'level-' + calcLevel(89, 'dbp')]">{{
                curData().dbp
              }}</span
              ><span class="unit">mm/Hg</span>
            </div>
          </div>
        </div>
        <div class="flex-c-b">
          <div class="vital-signs-card txt-c corners">
            <div class="vital-signs-card-title">血氧</div>
            <div class="vital-signs-card-value">
              <span :class="['number', 'level-' + calcLevel(100, 'spo')]">{{
                curData().spo2
              }}</span
              ><span class="unit">%</span>
            </div>
          </div>
          <div class="vital-signs-card txt-c corners">
            <div class="vital-signs-card-title">呼吸</div>
            <div class="vital-signs-card-value">
              <span :class="['number', 'level-' + calcLevel(14, 'breath')]">{{
                curData().rr
              }}</span
              ><span class="unit">rpm</span>
            </div>
          </div>
        </div>
      </div>
    </info-card>
  </aside>
</template>

<script>
export default {
  name: "LeftContent",
  inject: ["curData"],
  methods: {
    parseTreatment(curData) {
      const list = (curData.medPhepMeasuresEntities || []).map(
        (el) => el.measureName
      );
      return list.join(' / ');
    },
    // 性别样式名
    genderClass(type) {
      let cls = "gender";
      switch (type) {
        case "2":
          cls += " female";
          break;
        case "1":
          cls += " male";
          break;
        default:
          break;
      }
      return cls;
    },
    // 体征等级
    calcLevel(num, type) {
      let level = 4;
      let val = parseInt(num) || 0;

      switch (type) {
        case "pulse": // 心率
          if (val > 110) {
            level = 3;
          }
          break;
        case "sbp": // 收缩压
          if (val > 110) {
            level = 3;
          }
          break;
        case "dbp": // 舒张压
          if (val > 110) {
            level = 3;
          }
          break;
        case "spo": // 血氧
          if (val > 110) {
            level = 3;
          }
          break;
        case "breath": // 呼吸
          if (val > 110) {
            level = 3;
          }
          break;

        default:
          break;
      }
      return level;
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
    .info-title {
      font-size: 24px;
      font-weight: 400;
      align-items: end;
      margin-bottom: 10px;
      .name {
        text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.35);
      }
      .age {
        margin-left: 20px;
        text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.35);
        font-size: 18px;
        margin-bottom: 2px;
      }
      .gender {
        margin-left: 20px;
        width: 20px;
        height: 20px;
        background-size: cover;
        margin-bottom: 5px;
        &.male {
          background-image: url(~@/assets/male.png);
        }
        &.female {
          background-image: url(~@/assets/female.png);
        }
      }
    }
    .info-list {
      li {
        line-height: 40px;
        display: flex;
        span {
          min-width: 100px;
        }
      }
    }
    /deep/ .rectangle {
      margin-top: 10px;
    }
    .vital-signs {
      margin-top: 20px;
      > div:nth-of-type(2) {
        margin-top: 20px;
      }
      &-card {
        height: 110px;
        flex: 0 0 calc(50% - 10px);
        background-color: rgba(60, 172, 235, 0.15);
        text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.35);
        font-size: 22px;
        display: flex;
        flex-flow: column;
        justify-content: center;

        &-value {
          margin-top: 10px;
          .unit {
            font-size: 16px;
            padding-left: 2px;
          }
        }
      }
    }
  }
}
</style>
