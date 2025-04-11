<template>
  <div class="mini">
    <med-check-select-field
      v-model="data.hazards"
      @confirm="onChanged"
      label="危险因素"
      :disabled="disabled"
      :select-options="strHazardsDic"
      required
      :rules="[{ required: true, message: '请填写危险因素' }]"
      non-code="99"
    ></med-check-select-field>
    <med-radio-select-field
      v-model="data.smokingSituation"
      :disabled="disabled"
      required
      :rules="[{ required: true, message: '请填写吸烟' }]"
      label="吸烟"
      :select-options="strSmokingSituationDic"
      v-if="showSubitem('吸烟')"
      @confirm="onChanged"
    >
    </med-radio-select-field>
  </div>
</template>

<script>
import { dicConstant } from '@/constant/commonConstant'

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
      maxDate: new Date(2025, 10, 1),
      yesOrNoDic: [],
      strHazardsDic: [
        { label: '高血压', value: '01' },
        { label: '高脂血症', value: '02' },
        { label: '糖尿病', value: '03' },
        { label: '吸烟', value: '04' },
        { label: '肥胖', value: '05' },
        { label: '早发CVD家族史(男<55岁，女<60岁)', value: '06' },
        { label: '无', value: '99' }
      ],
      strSmokingSituationDic: []
    }
  },
  computed: {},
  created() {
    this.getDicList()
  },
  methods: {
    getDicList() {
      this.$api.service.getDictionary('').then(result => {
        this.yesOrNoDic = result[dicConstant.yesOrNoCode]
        this.strSmokingSituationDic = result[dicConstant.smokingSituationCode]
      })
    },
    showSubitem(testKey) {
      if (!this.data.hazards) {
        return false
      }

      const dic = this.strHazardsDic.find(t => t.label === testKey)
      if (!dic) {
        return false
      }
      if (!dic.value) {
        return false
      }

      return this.data.hazards.indexOf(dic.value) > -1
    },
    onChanged() {
      console.log('riskfactors changed')
      this.$emit('change', 'discharge')
    }
  }
}
</script>
<style lang="less" scoped></style>
