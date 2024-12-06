<template>
  <div>
    <med-select :options="options" v-bind.sync="$attrs" v-on="$listeners" />
  </div>
</template>

<script>
import { escPageList } from '@/api/emergencyStation'
export default {
  name: 'StationSelect',
  model: {
    prop: 'value',
    event: '_change'
  },
  props: {
    hospitalId: {
      type: String,
      default: ''
    },
    hospitalArea: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      options: []
    }
  },
  watch: {
    hospitalId: {
      immediate: true,
      handler(v) {
        if (v) this.getOptions()
      }
    },
    hospitalArea(v) {
      if (v) this.getOptions()
    }
  },
  methods: {
    async getOptions() {
      const payload = {}
      if (this.hospitalId) {
        payload.hospitalId = this.hospitalId
        payload.hospitalArea = this.hospitalArea
      }
      const res = await escPageList(payload)
      this.options = (res.body?.records || []).map((item) => {
        return {
          ...item,
          label: item.name,
          value: item.id
        }
      })
    }
  }
}
</script>

<style></style>
