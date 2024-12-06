<template>
  <div class="task-cards" @mousewheel.stop>
    <div v-for="(item, index) in missions" :key="item.missionId" :class="{ 'task-card': true, active: active === item.missionId }" @click="changeActive(item.missionId)">
      <div class="task-card-body">
        <div class="title">
          {{ item.licensePlate }}
        </div>
        <div class="tag-box">
          <card-tag :status="item.missionStatus">{{
      item.missionStatus
    }}</card-tag>
        </div>
        <div class="patient-info">
          <a-row type="flex" :gutter="8">
            <a-col class="name">{{ item.name }}</a-col>
            <a-col class="age">{{ item.age }}</a-col>
            <a-col :class="genderClass(item.gender)"></a-col>
          </a-row>
          <a-row type="flex" :gutter="8">
            <a-col>呼叫原因 : {{ item.reasonType }}</a-col>
          </a-row>
          <a-row type="flex" :gutter="8">
            <a-col>接诊地址 : {{ item.address }}</a-col>
          </a-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import CardTag from "./CardTag";
export default {
  components: { CardTag },
  computed: {
    ...mapGetters(["missions", "curMissionId", "curMission"]),
    active() {
      return this.curMissionId;
    },
  },
  methods: {
    ...mapMutations(["setCurMissionId"]),
    genderClass(gender) {
      const cls = ["gender"];
      switch (gender) {
        case "男":
          cls.push("male");
          break;
        case "女":
          cls.push("female");
          break;
        default:
          break;
      }
      return cls;
    },
    changeActive(mId) {
      this.setCurMissionId(mId);
    },
  },
};
</script>

<style lang="less" scoped>
.task-cards {
  max-height: 795px;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 8px;
    background-color: transparent;
  }

  // 滚动条轨道
  &::-webkit-scrollbar-track {
    width: 8px;
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.15);
  }

  // 滚动条滑块
  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background-color: rgba(0, 0, 0, 0.2);
  }

  .task-card {
    margin: 6px;
    padding: 8px;
    cursor: pointer;

    .task-card-body {
      position: relative;
      width: 260px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 8px;
      padding: 12px 16px 16px;
      color: #333;
      font-size: 16px;
      font-weight: 100;
      line-height: 2.1;
      box-shadow: 0 5px 5px 0 rgba(50, 50, 50, 0.3);

      .patient-info {
        color: #555;
        font-weight: 500;
      }

      .title {
        color: #555;
        font-size: 24px;
        font-weight: 500;
      }

      .tag-box {
        position: absolute;
        right: 8px;
        top: -8px;
        color: #fff;
        z-index: 1;
      }
    }

    &:hover .task-card-body,
    &.active .task-card-body {
      background-image: linear-gradient(to bottom, #1254fb, #5380f0);
      box-shadow: 0 5px 15px 0 #2784f0;
      color: #fff;

      .title,
      .patient-info {
        color: #fff;
      }

      .gender {
        &.male {
          background-image: url("~@/assets/male-select.png");
        }

        &.female {
          background-image: url("~@/assets/female-select.png");
        }
      }
    }

    .gender {
      min-width: 30px;
      background-repeat: no-repeat;
      background-position: center;
      color: transparent;

      &.male {
        background-image: url("~@/assets/male.png");
      }

      &.female {
        background-image: url("~@/assets/female.png");
      }
    }
  }
}
</style>
