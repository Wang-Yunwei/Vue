<template>
  <div class="mini">
    <med-radio-select-field
      v-model="data.triageOutcome"
      :disabled="disabled"
      label="患者去向"
      :select-options="toWhereDic"
      @confirm="onChanged"
    >
    </med-radio-select-field>
    <med-text-field
      v-model="data.triageNurse"
      :disabled="disabled"
      label="分诊护士"
      :select-options="doctorsSetting"
      @confirm="onChanged"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Outcome',
  components: {},
  props: {
    data: {
      required: true,
      type: Object
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      active: 0,
      registId: 0,
      toWhereDic: [
        { label: '至胸痛诊室', value: '1' },
        { label: '至抢救室', value: '2' },
        { label: '至导管室', value: '3' }
      ]
    }
  },
  computed: {
    ...mapGetters(['doctorsSetting'])
  },
  created() {},
  methods: {
    onChanged() {
      this.$emit('change', '1')
    }
  }
}
</script>

<style lang="less" scoped></style>
