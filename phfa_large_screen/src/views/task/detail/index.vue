<template>
  <div class="task">
    <left-content />
    <right-content />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { registerSSE } from "@/utils/sse";
import LeftContent from "./parts/leftContent";
import RightContent from "./parts/rightContent";
let timer;
export default {
  name: "Task",
  provide() {
    return {
      curData: this.curData,
    };
  },
  components: {
    LeftContent,
    RightContent,
  },
  data() {
    return {
      // prompted: this.getPromptedFromStorage(),
      list: [],
      curIndex: 0,
    };
  },
  computed: {
    ...mapGetters(["hospitalId", "hospitalArea"]),
  },
  mounted() {
    if (!this.$route.query?.missionId) {
      this.getData();
      this.startSSE();
    }
  },
  beforeDestroy() {
    clearTimeout(timer);
  },
  watch: {
    // prompted: {
    //   deep: true,
    //   handler() {
    //     this.setPrompted2Storage();
    //   },
    // },
    "$route.query": {
      immediate: true,
      async handler(v) {
        if (v.missionId) {
          // this.prompted = this.getPromptedFromStorage();
          await this.getData();
          this.$nextTick(() => {
            this.$router.replace(
              {
                query: {},
              },
              () => {}
            );
          });
        }
      },
    },
  },
  methods: {
    startSSE() {
      registerSSE(this.hospitalId + "_" + this.hospitalArea, (data) => {
        if (data === "missionChange") {
          // 任务变化 需要刷新
          this.curIndex = 0;
          this.getData();
        }
      });
    },
    // getPromptedFromStorage() {
    //   return JSON.parse(localStorage.getItem("prompted") || "[]") || [];
    // },
    // setPrompted2Storage() {
    //   return localStorage.setItem(
    //     "prompted",
    //     JSON.stringify(this.prompted || [])
    //   );
    // },
    curData() {
      return this.list[this.curIndex] || {};
    },
    async getData() {
      const res = await this.$api.mobilityTrace({
        hospitalId: this.hospitalId + "_" + this.hospitalArea,
        moduleName: "map",
      });
      const noticeMissionId = this.$route.query?.missionId;
      // console.log(noticeMissionId, "noticeMissionId");
      if (res?.body?.length) {
        let list = res.body;
        if (noticeMissionId) {
          // 有新的告知进来,排到最前面显示
          list = list.sort((a) => (a.missionId === noticeMissionId ? -1 : 0));
        }
        this.list = list;
        this.curIndex = 0;

        if (noticeMissionId) {
          this.warn();
        }

        // this.prompted = this.prompted.filter((p) =>
        //   this.list.some((ele) => ele.missionId === p)
        // );

        this.play();
      } else {
        // 没有任务 自动回到列表
        // this.$router.push("/task/list");
      }
    },
    play() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (this.curIndex < this.list.length - 1) {
          this.curIndex += 1;
        } else {
          this.curIndex = 0;
        }
        this.play();
      }, 30000);
    },
    warn() {
      const {
        licensePlate = "",
        name = "",
        gender = "",
        age = "",
        diseaseCategory = "",
        missionId = "",
      } = this.curData();
      // const genderVal = Number(gender);
      // let textGender = "未知";
      // if (genderVal === 1) {
      //   textGender = "男";
      // }
      // if (genderVal === 1) {
      //   textGender = "女";
      // }
      // if (!this.prompted.includes(missionId)) {
      // this.prompted.push(missionId);
      this.$modal.show({
        title: `${licensePlate}急救车有患者正在送往本院，请做好接诊准备！`,
        text: `${name} ${gender}/${age}/${diseaseCategory || ""}`,
        duration: 5,
      });
      // }
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
