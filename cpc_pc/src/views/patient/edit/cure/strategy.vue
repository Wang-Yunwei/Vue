<template>
  <div>
    <medicine />
    <reperfusion />
    <ppci />
    <thrombolysis />
    <electivepci />
    <cabg />
    <transitpci />
    <remedypci />
    <pci />
    <strategy />
  </div>
</template>

<script>
import medicine from './medicine'
import reperfusion from './reperfusion'
import ppci from './ppci'
import thrombolysis from './thrombolysis'
import electivepci from './electivepci'
import cabg from './cabg'
import transitpci from './transitpci'
import remedypci from './remedypci'
import pci from './pci'
import strategy from './strategy'
export default {
  name: 'Task',
  components: {
    medicine,
    reperfusion,
    ppci,
    thrombolysis,
    electivepci,
    cabg,
    transitpci,
    remedypci,
    pci,
    strategy
  },
  data() {
    return {
      active: 0,
      registId: 0
    }
  },
  computed: {},
  created() {},
  methods: {}
}
</script>

<style lang="scss" scoped></style>
