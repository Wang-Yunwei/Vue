<template>
  <div>
    <med-subtitle title="危险因素" />
    <el-row :gutter="24">
      <el-col :span="24">
        <med-checkbox-field
          v-model="data.hazards"
          display-type="check"
          form-prop="discharge.hazards"
          label="危险因素"
          :disabled="disabled"
          :select-options="dictionary.cardiovRiskFactorsDict"
          :rules="[
            { required: true, message: '请填写危险因素', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row v-if="showSubitem('吸烟')" :gutter="24">
      <el-col :span="6">
        <med-radio-field
          v-model="data.smokingSituation"
          form-prop="discharge.smokingSituation"
          :disabled="disabled"
          label="吸烟"
          :select-options="dictionary.smokingSituationDict"
          :rules="[
            { required: true, message: '请填写吸烟', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Riskfactors',
  components: {},
  props: {
    data: {
      required: true,
      type: Object
    },
    disabled: {
      required: false,
      type: Boolean
    }
  },
  data() {
    return {
      active: 0,
      registId: 0,
      minDate: new Date(2020, 0, 10),
      maxDate: new Date(2025, 10, 1)
    }
  },
  computed: {
    ...mapGetters(['dictionary'])
  },
  created() {},
  methods: {
    showSubitem(testKey) {
      if (!this.data.hazards) {
        return false
      }

      const dic = this.dictionary.cardiovRiskFactorsDict.find(t => t.label === testKey)
      if (!dic) {
        return false
      }
      if (!dic.value) {
        return false
      }

      return this.data.hazards.indexOf(dic.value) > -1
    }
  }
}
</script>
<style lang="scss" scoped></style>
