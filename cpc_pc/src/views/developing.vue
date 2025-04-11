<template>
  <div class="med-developing-wrapper">
    <el-image src="" /><span>开发中</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'DevelopingIndex',
  components: {

  },
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'hospitalId'
    ])
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.med-developing-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  span {
    padding: 0 20px;
    font-size: 36px;
  }
}
</style>
