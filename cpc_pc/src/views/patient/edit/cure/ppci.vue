<template>
  <div>
    <med-subtitle title="直接PCI" />
    <el-row :gutter="24">
      <el-col :span="6">
        <med-autocomplete-field
          v-model="data.decisionDoctor"
          :suggestion="medicalWorkers"
          :disabled="disabled"
          label="决定医生"
          form-prop="treatment.decisionDoctor"
        />
      </el-col>
      <el-col :span="6">
        <med-datetime-field
          v-model="data.decisionPciTime"
          form-prop="treatment.decisionPciTime"
          label="决定介入手术时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          :rules="[
            { required: true, message: '请填写决定介入手术时间', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-datetime-field
          v-model="data.startPciTime"
          form-prop="treatment.startPciTime"
          label="启动导管室时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          :rules="[
            { required: true, message: '请填写启动导管室时间', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="6">
        <med-datetime-field
          v-model="data.pciStartAgreeTime"
          form-prop="treatment.pciStartAgreeTime"
          label="开始知情同意时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          :rules="[
            { required: true, message: '请填写开始知情同意时间', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-datetime-field
          v-model="data.pciSignAgreeTime"
          form-prop="treatment.pciSignAgreeTime"
          label="签署知情同意时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          :rules="[
            { required: true, message: '请填写签署知情同意时间', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'PPCI',
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
      maxDate: new Date(2025, 10, 1),
      doctors: [
        { label: 'doctor1', value: '1' },
        { label: 'doctor2', value: '2' },
        { label: 'doctor3', value: '3' }
      ]
    }
  },
  computed: {
    ...mapGetters(['medicalWorkers'])
  },
  created() {},
  methods: {
    onChanged() {

    }
  }
}
</script>

<style lang="scss" scoped></style>
