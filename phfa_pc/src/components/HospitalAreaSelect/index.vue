<template>
  <med-select v-model="value" v-bind="$attrs" :options="hospitalAreaList" />
</template>

<script>
// 同一个组件 输出两个字段:hospitalArea和hospitalId
import { mapGetters } from 'vuex'
export default {
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
    return {}
  },
  computed: {
    ...mapGetters(['hospitalAreaList']),
    value: {
      get() {
        if (this.hospitalId && this.hospitalArea) {
          return this.hospitalId + '_' + this.hospitalArea
        }
        return undefined
      },
      set(v) {
        const [hospitalId, hospitalArea] = (v || '').split('_')
        if (hospitalId && hospitalArea) {
          this.$emit('update:hospitalId', hospitalId)
          this.$emit('update:hospitalArea', hospitalArea)
        }
      }
    }
  }
}
</script>

<style></style>
