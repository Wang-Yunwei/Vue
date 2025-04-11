<template>
  <div class="mini">
    <med-radio-select-field
      v-model="data.graceRehazardLevel"
      @confirm="onChanged"
      label="再次危险分层"
      :disabled="disabled"
      :select-options="nsteAcsDic"
    />
    <med-date-picker
      v-model="data.graceRehazardTime"
      label="再次危险分层时间"
      required
      :rules="[{ required: true, message: '请填写再次危险分层时间' }]"
      :min-date="minDate"
      :max-date="maxDate"
      v-if="showGraceRehazardTime"
      :disabled="disabled"
      @confirm="onChanged"
    />
  </div>
</template>

<script>
import { dicConstant } from '../../../../../constant/commonConstant'

export default {
  name: 'nsteacs',
  components: {},
  props: {
    data: {
      required: true,
      type: Object
    },
    dataTreatment: {
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
      codeList: [dicConstant.graceRehazardLevelCode],
      minDate: new Date(2020, 0, 10),
      maxDate: new Date(2025, 10, 1),
      nsteAcsDic: [],
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
  },
  computed: {
    showGraceRehazardTime() {
      if (
        this.data.graceRehazardLevel === '99' ||
        this.data.graceRehazardLevel === null ||
        this.data.graceRehazardLevel === ''
      ) {
        return false
      }
      return true
    }
  },
  created() {
    this.getDicList()
  },
  methods: {
    getDicList() {
      this.$api.service.getDictionary('').then(result => {
        this.nsteAcsDic = result[dicConstant.graceRehazardLevelCode]
      })
    },
    onChanged() {
      this.$emit('change', 'inspection')
    },
    onTreatmentChanged() {
      this.$emit('change', 'treatment')
    }
  }
}
</script>

<style lang="less" scoped></style>
