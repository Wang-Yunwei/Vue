<template>
  <div>
    <med-subtitle title="补救PCI" />
    <el-row :gutter="24">
      <!-- <el-col :span="6">
        <med-datetime-field
          v-model="data.cabgDecisionTime"
          form-prop="treatment.cabgDecisionTime"
          label="决定介入手术时间"
          :min-date="minDate"
          :max-date="maxDate"
          :rules="[
            { required: true, message: '请填写决定介入手术时间', trigger: 'change' }
          ]"
        />
      </el-col> -->
      <el-col :span="6">
        <med-datetime-field
          v-model="data.startRadiographyTime"
          form-prop="treatment.startRadiographyTime"
          label="造影开始时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          :rules="[
            { required: true, message: '请填写造影开始时间', trigger: 'change' }
          ]"
        />   </el-col>
      <el-col :span="6">
        <med-radio-field
          v-model="data.timi"
          form-prop="treatment.timi"
          label="TIMI血流等级"
          :disabled="disabled"
          :select-options="dictionary.timiLevelDict"
          :rules="[
            { required: true, message: '请填写TIMI血流等级', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'RemedyPCI',
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
