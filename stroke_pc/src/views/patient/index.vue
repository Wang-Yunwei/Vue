<template>
  <div>
    <patientlist />
  </div>
</template>

<script>
import patientlist from './list'

export default {
  name: 'PatientIndex',
  components: {
    patientlist
  },
  data() {
    return {}
  }
}
</script>
