import InfoCard from "./InfoCard";
import GradientText from "./GradientText";
import GlobalHeader from "./GlobalHeader.vue";
import RoundedRectangle from "./RoundedRectangle.vue";
import StatisticCard from "./StatisticCard.vue";
import Marquee from "./Marquee.vue";

export default {
  install: (Vue) => {
    Vue.component("info-card", InfoCard);
    Vue.component("gradient-text", GradientText);
    Vue.component("global-header", GlobalHeader);
    Vue.component("rounded-rectangle", RoundedRectangle);
    Vue.component("statistic-card", StatisticCard);
    Vue.component("marquee-box", Marquee);
  },
};
