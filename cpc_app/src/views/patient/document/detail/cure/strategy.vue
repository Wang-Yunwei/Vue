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
    strategy
  },
  data() {
    return {
      active: 0,
      registId: 0,
      details: []
    }
  },
  computed: {},
  created() {},
  methods: {}
}
</script>

<style lang="less" scoped></style>
