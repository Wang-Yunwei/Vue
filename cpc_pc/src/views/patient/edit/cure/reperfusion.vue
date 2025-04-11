<template>
  <div>
    <med-subtitle title="再灌注措施" />
    <el-row :gutter="24">
      <el-col :span="3">
        <med-radio-field
          v-model="data.isReperfusion"
          form-prop="treatment.isReperfusion"
          :disabled="disabled"
          label="是否再灌注"
          :select-options="dictionary.yesOrNoDict"
          :rules="[
            { required: true, message: '请填写是否再灌注', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col v-if="data.isReperfusion == '0'" :span="18">
        <med-radio-field
          v-model="data.noReperfusionMeasure"
          form-prop="treatment.noReperfusionMeasure"
          :disabled="disabled"
          required
          label="无再灌注原因"
          :select-options="dictionary.perfusionMeasureDict"
          :rules="[
            { required: true, message: '请填写无再灌注原因', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col v-if="data.isReperfusion == '1'" :span="18">
        <med-radio-field
          v-model="data.reperfusionMeasure"
          form-prop="treatment.reperfusionMeasure"
          :disabled="disabled"
          required
          label="再灌注措施"
          :select-options="dictionary.reperfusionMeasureDict"
          :rules="[
            { required: true, message: '请填写再灌注措施', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Reperfusion',
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
    ...mapGetters([
      'dictionary'
    ])
  },
  created() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped></style>
