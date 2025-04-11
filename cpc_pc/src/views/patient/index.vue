<template>
  <div class="med-patient-wrapper">
    <patientlist />
    <developing v-if="false" />
  </div>
</template>

<script>
import patientlist from './list'
import developing from '@/views/developing.vue'
export default {
  name: 'PatientIndex',
  components: {
    patientlist,
    developing
  },
  data() {
    return {}
  }
}
</script>
<style lang="scss" scoped>
.med-patient-wrapper {
  height: calc(100vh - 50px);
  overflow-y: auto;
  display: flex;
  flex-direction: row;
}
</style>
