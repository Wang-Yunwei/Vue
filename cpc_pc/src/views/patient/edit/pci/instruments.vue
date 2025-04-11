<template>
  <div>
    <med-subtitle title="手术器械" />
    <el-row :gutter="24">
      <el-col :span="12">
        <med-radio-field
          v-model="data.lumenImage"
          form-prop="treatmentPci.lumenImage"
          :disabled="disabled"
          label="腔内影像"
          :select-options="dictionary.intracavityImageDict"
          :rules="[
            { required: true, message: '请填写腔内影像', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-radio-field
          v-model="data.functionTest"
          form-prop="treatmentPci.functionTest"
          :disabled="disabled"
          label="功能检测"
          :select-options="dictionary.functionTestDict"
          :rules="[
            { required: true, message: '请填写功能检测', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="4">
        <med-text-field
          v-if="
            data.functionTest === '1' ||
              data.functionTest === '2' ||
              data.functionTest === '3'
          "
          v-model="data.functionTestValue"
          v-float="{ scale: 2, min: 0, max: 1 }"
          form-prop="treatmentPci.functionTestValue"
          label="数值"
          :rules="[{ required: true, message: '请填写数值', trigger: 'blur' }]"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="6">
        <med-radio-field
          v-model="data.iabp"
          form-prop="treatmentPci.iabp"
          :disabled="disabled"
          label="IABP"
          :select-options="dictionary.yesOrNoDict"
          :rules="[
            { required: true, message: '请填写IABP', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-radio-field
          v-model="data.temporaryPacemaker"
          form-prop="treatmentPci.temporaryPacemaker"
          :disabled="disabled"
          label="临时起搏器"
          :select-options="dictionary.yesOrNoDict"
          :rules="[
            { required: true, message: '请填写临时起搏器', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-radio-field
          v-model="data.ecmo"
          form-prop="treatmentPci.ecmo"
          :disabled="disabled"
          label="ECMO"
          :select-options="dictionary.yesOrNoDict"
          :rules="[
            { required: true, message: '请填写ECMO', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-radio-field
          v-model="data.leftAssistDevice"
          form-prop="treatmentPci.leftAssistDevice"
          :disabled="disabled"
          label="左心室辅助装置"
          :select-options="dictionary.yesOrNoDict"
          :rules="[
            { required: true, message: '请填写左心室辅助装置', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="24">
        <med-checkbox-field
          v-model="data.complication"
          display-type="check"
          form-prop="treatmentPci.complication"
          label="术中并发症"
          :disabled="disabled"
          :select-options="dictionary.pciComplicationDict"
          :rules="[
            { required: true, message: '请填写术中并发症', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="6">
        <med-autocomplete-field
          v-model="data.createBy"
          :suggestion="medicalWorkers"
          :disabled="disabled"
          label="填写人员"
          form-prop="treatmentPci.createBy"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Instruments',
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
      registId: 0
    }
  },
  computed: {
    ...mapGetters([
      'dictionary',
      'medicalWorkers'
    ])
  },
  created() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped></style>
