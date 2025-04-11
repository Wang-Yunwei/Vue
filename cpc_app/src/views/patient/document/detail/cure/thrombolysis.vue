<template>
  <div class="mini">
    <med-radio-select-field
      v-model="data.rsScreen"
      :disabled="disabled"
      required
      :rules="[{ required: true, message: '请填写溶栓筛查' }]"
      label="溶栓筛查"
      :select-options="dictionary.thrombolyticScreeningDict"
      @confirm="onChanged"
    >
    </med-radio-select-field>
    <div v-if="data.rsScreen == '1'">
      <med-radio-button-field
        v-model="data.hasContraindication"
        :disabled="disabled"
        label="存在禁忌症"
        :select-options="dictionary.yesOrNoDict"
        required
        :rules="[{ required: true, message: '请填写存在禁忌症' }]"
        @confirm="onChanged"
      >
      </med-radio-button-field>
    </div>
    <div v-if="data.rsScreen == '2'">
      <med-radio-button-field
        v-model="data.isRs"
        :disabled="disabled"
        label="溶栓治疗"
        :select-options="dictionary.haveOrNotDict"
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
          :select-options="dictionary.yesOrNoDict"
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
          :select-options="dictionary.ihThrombolyticPlaceDict"
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
          required
          :rules="[{ required: true, message: '请填写开始溶栓时间' }]"
          @confirm="onChanged"
        />
        <med-date-picker
          v-model="data.rsEndTime"
          label="溶栓结束时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          required
          :rules="[{ required: true, message: '请填写溶栓结束时间' }]"
          @confirm="onChanged"
        />
        <med-radio-select-field
          v-model="data.rsDrugType"
          :disabled="disabled"
          required
          :rules="[{ required: true, message: '请填写溶栓药物' }]"
          label="溶栓药物"
          :select-options="dictionary.thrombolyticDrugTypeDict"
          @confirm="onChanged"
        >
        </med-radio-select-field>
        <med-radio-button-field
          v-model="data.rsDrugCode"
          :disabled="disabled"
          label="溶栓药物剂量"
          :select-options="dictionary.thrombolyticDrugDict"
          required
          :rules="[{ required: true, message: '请填写溶栓药物剂量' }]"
          @confirm="onChanged"
        >
        </med-radio-button-field>
        <med-radio-button-field
          v-model="data.isRsRecanalization"
          :disabled="disabled"
          label="是否溶栓再通"
          :select-options="dictionary.yesOrNoDict"
          required
          :rules="[{ required: true, message: '请填写是否溶栓再通' }]"
          @confirm="onRsRecanalizationChanged"
        >
        </med-radio-button-field>
      </div>
    </div>
    <div v-if="data.reperfusionMeasure === '2'">
      <med-radio-select-field
        v-model="data.rsStrategy"
        :disabled="disabled"
        label="溶栓后措施"
        :select-options="postRsTypeDic"
        @confirm="onChanged"
      >
      </med-radio-select-field>
      <med-date-picker
        v-model="data.decisionPciTime"
        label="决定介入手术时间"
        v-if="data.rsStrategy === '21'"
        :min-date="minDate"
        :max-date="maxDate"
        :disabled="disabled"
        @confirm="onChanged"
        required
        :rules="[{ required: true, message: '请填写决定介入手术时间' }]"
      />
    </div>
  </div>
</template>

<script>
import { dicConstant } from '@/constant/commonConstant'
import { mapGetters } from 'vuex'
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
      postRsTypeDic: [
        { value: '21', label: '补救PCI' },
        { value: '22', label: '溶栓后介入' }
      ],
      codeList: [
        dicConstant.yesOrNoCode,
        dicConstant.thrombolyticScreeningCode,
        dicConstant.ihThrombolyticPlaceCode,
        dicConstant.thrombolyticDrugTypeCode,
        dicConstant.thrombolyticDrugCode,
        dicConstant.reperfusionMeasureRsCode
      ]
    }
  },
  computed: {
    ...mapGetters(['dictionary'])
  },
  created() {},
  methods: {
    onRsRecanalizationChanged() {
      if (this.data.isRsRecanalization === '1') {
        this.data.rsStrategy = '22'
      } else if (this.data.isRsRecanalization === '0') {
        this.data.rsStrategy = '21'
      } else {
        this.data.rsStrategy = null
      }
      this.$emit('change', 'treatment')
    },
    onChanged() {
      this.$emit('change', 'treatment')
    }
  }
}
</script>

<style lang="less" scoped></style>
