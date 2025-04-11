<template>
  <el-row class="med-layout-flow-wrapper">
    <slot />
  </el-row>
</template>

<script>
import Vue from 'vue'
import { Row } from 'element-ui'
Vue.use(Row)

export default {
  name: 'MedLayoutFlow',
  props: {
    ...Row.props
  },
  data() {
    return {
    }
  },
  computed: {

  },
  watch: {

  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.med-layout-flow-wrapper {
  display: flex;
  flex-flow: row;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
}
</style>
