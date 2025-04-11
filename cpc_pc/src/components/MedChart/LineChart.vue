<template>
  <div class="med-line-chart-wrapper">
    <med-bar-chart v-bind="$props" :series-data="series" />
  </div>
</template>

<script>
import MedBarChart from './BarChart.vue'

export default {
  name: 'MedLineChart',
  inheritAttrs: false,
  props: {
    ...MedBarChart.props,
    seriesData: {
      type: Array,
      require: true,
      default: () => []
    }
  },
  data() {
    return {}
  },
  computed: {
    series() {
      return (this.seriesData || []).map(ele => {
        if (!ele.type || ele.type === '') ele.type = 'line'
        return ele
      })
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.med-line-chart-wrapper {
  height: 100%;
}
</style>
