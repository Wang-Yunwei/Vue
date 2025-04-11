<template>
  <div class="med-followup-wrapper">
    <developing />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import developing from '@/views/developing.vue'
export default {
  name: 'FollowupIndex',
  components: {
    developing
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
.med-followup-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 50px);
  width: 100%;
}
</style>
