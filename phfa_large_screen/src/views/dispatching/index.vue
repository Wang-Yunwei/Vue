<template>
  <div>
    <time-line />
    <div class="task">
      <left-content />
      <right-content />
    </div>
  </div>
</template>

<script>
import TimeLine from "./parts/TimeLine";
import LeftContent from "./parts/leftContent";
import RightContent from "./parts/rightContent";
import { mapActions, mapGetters, mapMutations } from "vuex";

let timer;
export default {
  name: "Dispatching",
  provide() {
    return {
      curData: this.curData,
    };
  },
  components: {
    TimeLine,
    LeftContent,
    RightContent,
  },
  data() {
    return {
      missions: [],
    };
  },
  computed: {
    ...mapGetters(["curMission", "curMissionId", "hospitalId", "hospitalArea"]),
  },
  mounted() {
    this.getData();
    this.getDicList({
      hospitalId: this.hospitalId,
    });
  },
  beforeDestroy() {
    clearTimeout(timer);
  },
  watch: {},
  methods: {
    ...mapMutations(["setCurMission", "setCurMissionId", "setMissions"]),
    ...mapActions(["getDicList"]),
    async getData() {
      const res = await this.$api.mobilityTrace({
        hospitalId: this.hospitalId + "_" + this.hospitalArea,
        moduleName: "map",
      });
      if (res?.body?.length) {
        this.missions = res.body;
        this.setMissions(this.missions);
        if (
          !this.curMissionId ||
          this.missions.every((m) => m.missionId !== this.curMissionId)
        ) {
          this.setCurMissionId(this.missions[0].missionId);
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
          this.getData();
        }, 6000);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.task {
  display: flex;
  justify-content: space-between;
}
</style>
