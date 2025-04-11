<template>
  <div>
    <med-subtitle title="处理策略" />
    <el-row :gutter="24">
      <el-col :span="6">
        <med-radio-field
          v-model="data.strategy"
          form-prop="treatment.strategy"
          label="策略"
          :disabled="disabled"
          :select-options="strategyDic"
          :rules="[
            { required: true, message: '请填写策略', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="12">
        <med-radio-field
          v-if="data.strategy === '2'"
          v-model="data.invasiveStrategy"
          form-prop="treatment.invasiveStrategy"
          label="侵入性策略"
          :disabled="disabled"
          :select-options="invasiveStrategyDic"
          :rules="[
            { required: true, message: '请填写侵入性策略', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-datetime-field
          v-if="data.invasiveStrategy === '2'"
          v-model="data.actualTime"
          label="实际介入治疗时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          form-prop="treatment.actualTime"
          :rules="[
            { required: true, message: '请填写实际介入治疗时间', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Measures',
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
      strategyDic: [
        { label: '保守治疗(仅药物治疗)', value: '1' },
        { label: '侵入性策略', value: '2' }
      ],
      invasiveStrategyDic: [
        { label: '2h紧急介入治疗', value: '1' },
        { label: '24h内介入治疗', value: '2' },
        { label: '72h内介入治疗', value: '3' },
        { label: '择期介入治疗', value: '4' },
        { label: 'CABG', value: '5' }
      ]
    }
  }
}
</script>

<style lang="less" scoped></style>
