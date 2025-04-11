<template>
  <keep-alive
    :exclude="[
      'preHospitalPush-createPatientHistory',
      'Detail',
      'TimeEdit',
      'timeCollection',
      'timeline',
      'addInformation',
      'Electrocardiogram',
      'Preview',
      'Completed',
      'FilingTimeline',
      'overview',
      'pait'
    ]"
  >
    <router-view />
  </keep-alive>
</template>

<script>
export default {
  computed: {
    active() {
      switch (this.$route.path) {
        case '/gc/fileList':
          return 'strokeGcList'
        case '/gc/preHospitalPush':
        case '/gc/preHospitalPreview':
          return 'preHospitalPush'
        default:
          return 'strokeGcList'
      }
    }
  }
}
</script>
