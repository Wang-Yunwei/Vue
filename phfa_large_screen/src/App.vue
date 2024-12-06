<template>
  <div id="app">
    <keep-alive><router-view /></keep-alive>
    <modal ref="modal" />
  </div>
</template>
<script>
import Modal from "@/components/Modal";
import { registerSSE } from "@/utils/sse";
import Vue from "vue";
import { mapGetters } from "vuex";

export default {
  components: {
    Modal,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["hospitalId", 'hospitalArea']),
  },
  mounted() {
    Vue.prototype.$modal = this.$refs.modal;
  },
  watch: {
    hospitalId: {
      immediate: true,
      handler(v) {
        console.log(v, 'hos');
        if (v) {
          this.startSSE();
        }
      },
    },
  },
  methods: {
    onMsg(msg) {
      // console.log("收到", msg);
      if (this.$route.path === "/dispatching") {
        // 调度页面不跳转
        return;
      }
      if (msg && msg.startsWith("{") && msg.endsWith("}")) {
        const parsedMsg = {
          ...JSON.parse(msg || ""),
        };
        if (parsedMsg.type === "inform") {
          // 收到告知
          const { missionId } = parsedMsg.content;
          const prompted = localStorage.getItem("prompted") || "[]";
          const filtered = JSON.parse(prompted).filter((m) => !m === missionId);
          // 清除警告记录,重新警告
          localStorage.setItem("prompted", JSON.stringify(filtered));
          if (this.$route.path !== "/task/detail") {
            this.$router.push("/task/detail?missionId=" + missionId);
          } else {
            this.$router.replace(
              {
                path: "/task/detail",
                query: { missionId: missionId },
              },
              () => { }
            );
          }
        }
      }
    },
    // 启动SSE
    startSSE() {
      registerSSE(this.hospitalId + '_' + this.hospitalArea, this.onMsg);
    },
  },
};
</script>
