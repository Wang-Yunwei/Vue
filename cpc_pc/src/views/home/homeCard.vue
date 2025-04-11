<template>
  <div class="med-home-card-wrapper">
    <slot />
  </div>
</template>

<script>
export default {
  components: {},
  props: {

  },
  data() {
    return {
    }
  },
  computed: {},
  watch: {},
  created() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.med-home-card-wrapper {
  display: flex;
  flex-flow: column;
  flex: 1;
  height: 100%;
  align-content: center;
  align-items: stretch;
  background: #ffffff;
  z-index: 2;
  // -moz-box-shadow: 0px 3px 10px #a6a6a6;
  // -webkit-box-shadow: 0px 3px 10px #a6a6a6;
  // box-shadow: 0px 3px 10px #a6a6a6;
}
</style>
