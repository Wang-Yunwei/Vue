<template>
  <div class="mini">
    <med-radio-button-field
      v-model="data.isCombinedDisease"
      :disabled="disabled"
      label="是否有合并疾病"
      :select-options="yesOrNoDic"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写是否有合并疾病' }]"
    >
    </med-radio-button-field>
    <med-check-select-field
      v-if="data.isCombinedDisease == 1"
      v-model="data.combinedDiseaseType"
      @confirm="onChanged"
      label="合并疾病类别"
      :disabled="disabled"
      :select-options="strCombinedDiseaseTypeDesc"
      required
      :rules="[{ required: true, message: '请填写合并疾病类别' }]"
    ></med-check-select-field>
    <med-radio-button-field
      v-model="data.isChdHor"
      :disabled="disabled"
      label="血运重建史"
      :select-options="yesOrNoDic"
      v-if="data.isCombinedDisease == 1 && showSubitem('冠心病')"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写血运重建史' }]"
    >
    </med-radio-button-field>
    <med-radio-select-field
      v-model="data.afType"
      :disabled="disabled"
      label="分型"
      :select-options="strAfTypeDic"
      v-if="data.isCombinedDisease == 1 && showSubitem('心房颤动')"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写分型' }]"
    >
    </med-radio-select-field>
    <med-radio-select-field
      v-model="data.chfNyha"
      :disabled="disabled"
      label="NYHA分级"
      :select-options="strChfNyhaDic"
      v-if="data.isCombinedDisease == 1 && showSubitem('慢性心力衰竭')"
      required
      :rules="[{ required: true, message: '请填写NYHA分级' }]"
      @confirm="onChanged"
    >
    </med-radio-select-field>
    <med-radio-select-field
      v-model="data.remark"
      :disabled="disabled"
      label="描述"
      :select-options="strRemarkDic"
      v-if="data.isCombinedDisease == 1 && showSubitem('脑血管疾病')"
      required
      :rules="[{ required: true, message: '请填写描述' }]"
      @confirm="onChanged"
    >
    </med-radio-select-field>
  </div>
</template>

<script>
import { dicConstant } from '@/constant/commonConstant'

export default {
  name: 'Complications',
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
      strCombinedDiseaseTypeDic: [
        { label: '冠心病', value: '1' },
        { label: '心房颤动', value: '2' },
        { label: '慢性心力衰竭', value: '3' },
        { label: '心脏瓣膜病', value: '4' },
        { label: '脑血管疾病', value: '5' },
        { label: '外周动脉疾病', value: '6' },
        { label: '主动脉瘤', value: '7' },
        { label: 'COPD', value: '8' },
        { label: '慢性肾病', value: '9' },
        { label: '贫血', value: '10' },
        { label: '消化性溃疡', value: '11' },
        { label: '甲状腺功能异常', value: '12' },
        { label: '恶性肿瘤', value: '13' }
      ],
      strAfTypeDic: [],
      strChfNyhaDic: [],
      strRemarkDic: []
    }
  },
  computed: {
    strCombinedDiseaseTypeDesc() {
      if (
        this.data.isHeartFailure != null &&
        this.data.isHeartFailure === '1'
      ) {
        return this.strCombinedDiseaseTypeDic.filter(function(x) {
          return x.value !== '3'
        })
      }
      return this.strCombinedDiseaseTypeDic
    }
  },
  created() {
    this.getDicList()
  },
  methods: {
    showSubitem(testKey) {
      if (!this.data.combinedDiseaseType) {
        return false
      }

      const dic = this.strCombinedDiseaseTypeDic.find(t => t.label === testKey)
      if (!dic) {
        return false
      }
      if (!dic.value) {
        return false
      }

      return this.data.combinedDiseaseType.indexOf(dic.value) > -1
    },
    getDicList() {
      this.$api.service.getDictionary('').then(result => {
        this.yesOrNoDic = result[dicConstant.yesOrNoCode]
        this.strAfTypeDic = result[dicConstant.afTypeCode]
        this.strChfNyhaDic = result[dicConstant.chfNyhaCode]
        this.strRemarkDic = result[dicConstant.cvdTypeCode]
      })
    },
    onChanged() {
      this.$emit('change', 'discharge')
    }
  }
}
</script>

<style lang="less" scoped></style>
