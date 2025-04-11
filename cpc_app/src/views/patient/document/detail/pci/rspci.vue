<template>
  <div>
    <med-date-picker
      v-model="data.startRadiographyTime"
      label="造影开始时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      @confirm="onChanged"
    />
    <med-radio-select-field
      v-model="data.timi"
      @confirm="onChanged"
      label="TIMI血流等级(仅造影时)"
      :disabled="disabled"
      :select-options="timiLevelDic"
    />
  </div>
</template>

<script>
import { dicConstant } from '@/constant/commonConstant'

export default {
  name: 'PostRsPCI',
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
      timiLevelDic: []
    }
  },
  computed: {},
  created() {
    this.getDicList()
  },
  methods: {
    getDicList() {
      this.$api.service.getDictionary('').then(result => {
        this.timiLevelDic = result[dicConstant.timiLevelCode]
      })
    },
    onChanged() {
      this.$emit('change', 'treatmentPci')
    }
  }
}
</script>

<style lang="less" scoped></style>
