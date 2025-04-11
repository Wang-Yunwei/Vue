<template>
  <div>
    <med-subtitle title="分诊结果" />
    <el-row :gutter="24">
      <el-col :span="6">
        <med-radio-field
          v-model="data.triageOutcome"
          :disabled="disabled"
          form-prop="admission.triageOutcome"
          label="患者去向"
          :select-options="toWhereDic"
        />
      </el-col>
      <el-col :span="6">
        <med-autocomplete-field
          v-model="data.triageNurse"
          :suggestion="medicalWorkers"
          :disabled="disabled"
          label="分诊护士"
          form-prop="admission.triageNurse"
        />
      </el-col>
    </el-row>
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
    ...mapGetters(['medicalWorkers'])
  },
  created() {},
  methods: {

  }
}
</script>

<style lang="scss" scoped></style>
