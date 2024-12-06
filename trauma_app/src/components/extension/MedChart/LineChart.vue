<template>
  <div class="med-chart-wrapper">
    <med-bar-chart v-bind="$props" :series-data="series" />
  </div>
</template>

<script>
import MedBarChart from './BarChart.vue'

export default {
  name: 'med-line-chart',
  inheritAttrs: false,
  props: {
    ...MedBarChart.props,
    seriesData: {
      type: Array,
      require: true,
      default: () => []
    },
    showSerieLabel: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {},
  computed: {
    series() {
      return (this.seriesData || []).map(ele => {
        if (!ele.type || ele.type === '') ele.type = 'line'
        if (!ele.label && this.showSerieLabel) {
          ele.label = {
            show: true,
            position: 'top'
          }
        }
        return ele
      })
    }
  },
  watch: {}
}
</script>

<style lang="less" scoped></style>
