<template>
  <div>
    <med-radio-select-field
      v-model="data.rsScreen"
      :disabled="disabled"
      required
      :rules="[{ required: true, message: '请填写溶栓筛查' }]"
      label="溶栓筛查"
      :select-options="screenList"
      @confirm="onChanged"
    >
    </med-radio-select-field>
    <div v-if="data.rsScreen == '1'">
      <med-radio-button-field
        v-model="data.isRsTaboo"
        :disabled="disabled"
        label="存在禁忌症"
        :select-options="yesOrNoDic"
        @confirm="onChanged"
        required
        :rules="[{ required: true, message: '请填写存在禁忌症' }]"
      >
      </med-radio-button-field>
    </div>
    <div v-if="data.rsScreen == '2'">
      <med-radio-button-field
        v-model="data.isRs"
        :disabled="disabled"
        label="溶栓治疗"
        :select-options="haveOrNotDict"
        @confirm="onChanged"
        required
        :rules="[{ required: true, message: '请填写溶栓治疗' }]"
      >
      </med-radio-button-field>
      <div v-if="data.isRs == '1'">
        <med-radio-button-field
          v-model="data.isRsDirect"
          :disabled="disabled"
          label="直达溶栓场所"
          :select-options="yesOrNoDic"
          @confirm="onChanged"
          required
          :rules="[{ required: true, message: '请填写直达溶栓场所' }]"
        >
        </med-radio-button-field>
        <med-radio-select-field
          v-model="data.rsPlace"
          :disabled="disabled"
          required
          :rules="[{ required: true, message: '请填写溶栓场所' }]"
          label="溶栓场所"
          :select-options="rsPlaceList"
          @confirm="onChanged"
        >
        </med-radio-select-field>
        <med-date-picker
          v-model="data.rsStartAgreeTime"
          label="开始知情同意时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          @confirm="onChanged"
          required
          :rules="[{ required: true, message: '请填写开始知情同意时间' }]"
        />
        <med-date-picker
          v-model="data.rsSignAgreeTime"
          label="签署知情同意书时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          @confirm="onChanged"
          required
          :rules="[{ required: true, message: '请填写签署知情同意书时间' }]"
        />
        <med-date-picker
          v-model="data.rsStartTime"
          label="开始溶栓时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          @confirm="onChanged"
          required
          :rules="[{ required: true, message: '请填写开始溶栓时间' }]"
        />
        <med-date-picker
          v-model="data.rsEndTime"
          label="溶栓结束时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          @confirm="onChanged"
          required
          :rules="[{ required: true, message: '请填写溶栓结束时间' }]"
        />
        <med-radio-select-field
          v-model="data.rsDrugType"
          :disabled="disabled"
          required
          :rules="[{ required: true, message: '请填写溶栓药物' }]"
          label="溶栓药物"
          :select-options="rsDrugList"
          @confirm="onChanged"
        >
        </med-radio-select-field>
        <med-radio-button-field
          v-model="data.rsDrugCode"
          :disabled="disabled"
          label="溶栓药物剂量"
          :select-options="rsDoseDic"
          @confirm="onChanged"
          required
          :rules="[{ required: true, message: '请填写溶栓药物剂量' }]"
        >
        </med-radio-button-field>
        <med-radio-button-field
          v-model="data.isRsRecanalization"
          :disabled="disabled"
          label="是否溶栓再通"
          :select-options="yesOrNoDic"
          @confirm="onChanged"
          required
          :rules="[{ required: true, message: '请填写是否溶栓再通' }]"
        >
        </med-radio-button-field>
        <med-date-picker
          v-if="data.isRsRecanalization == 1"
          v-model="data.rsRadiographyTime"
          label="溶栓后造影时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          @confirm="onChanged"
        />
        <med-radio-button-field
          v-model="data.isRemedyPci"
          :disabled="disabled"
          label="补救PCI"
          :select-options="yesOrNoDic"
          v-if="data.isRsRecanalization == 0"
          @confirm="onChanged"
          required
          :rules="[{ required: true, message: '请填写补救PCI' }]"
        >
        </med-radio-button-field>
        <med-date-picker
          v-if="data.isRemedyPci == 1"
          v-model="data.actualPciTime"
          label="实际手术时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          @confirm="onChanged"
        />
        <med-radio-button-field
          v-model="data.pciPlace"
          :disabled="disabled"
          label="补救PCI"
          :select-options="operDic"
          v-if="data.isRemedyPci == 1"
          @confirm="onChanged"
        >
        </med-radio-button-field>
      </div>
    </div>
  </div>
</template>

<script>
import { dicConstant } from '../../../../../constant/commonConstant'

export default {
  name: 'Thrombolysis',
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
      haveOrNotDict: [],
      screenList: [],
      rsPlaceList: [],
      rsDrugList: [],
      rsDoseDic: [],
      operDic: [],
      codeList: [
        dicConstant.yesOrNoCode,
        dicConstant.thrombolyticScreeningCode,
        dicConstant.faThrombolyticPlaceCode,
        dicConstant.thrombolyticDrugTypeCode,
        dicConstant.thrombolyticDrugCode,
        dicConstant.pciPlaceCode
      ]
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
        this.screenList = result[dicConstant.thrombolyticScreeningCode]
        this.rsPlaceList = result[dicConstant.faThrombolyticPlaceCode]
        this.rsDrugList = result[dicConstant.thrombolyticDrugTypeCode]
        this.rsDoseDic = result[dicConstant.thrombolyticDrugCode]
        this.operDic = result[dicConstant.pciPlaceCode]
        this.haveOrNotDict = result[dicConstant.haveOrNotCode]
      })
    },
    onChanged() {
      this.$emit('change')
    }
  }
}
</script>

<style lang="less" scoped></style>
