<template>
  <div class="dashboard-container">
    <qc-index />
  </div>
</template>

<script>
import qcIndex from '../home/index.vue'
export default {
  name: 'Dashboard',
  components: {
    qcIndex
  },
  data() {
    return {
    }
  }
}
</script>
