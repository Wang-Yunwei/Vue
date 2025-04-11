<template>
  <div class="mini">
    <med-radio-button-field
      v-model="data.isAntiplatelet"
      :disabled="disabled"
      label="是否双抗给药"
      :select-options="yesOrNoDic"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写双抗给药' }]"
    >
    </med-radio-button-field>
    <div v-if="data.isAntiplatelet == '1'">
      <med-check-select-field
        v-model="data.antiplateletDrug"
        @confirm="onChanged"
        label="双抗药物"
        required
        :rules="[{ required: true, message: '请填写双抗药物' }]"
        :disabled="disabled"
        :select-options="antiplateletDrugDic"
      />
      <div v-if="isAnticoagulationDrug('1')">
        <med-date-picker
          v-model="data.aspirinTime"
          label="阿司匹林给药时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          required
          :rules="[{ required: true, message: '请填写阿司匹林给药时间' }]"
          @confirm="onChanged"
        />
        <med-radio-select-field
          v-model="data.aspirinDose"
          :disabled="disabled"
          label="阿司匹林剂量"
          :select-options="aspirinDoseDic"
          required
          :rules="[{ required: true, message: '请填写阿司匹林剂量' }]"
          @confirm="onChanged"
        >
        </med-radio-select-field>
        <!-- <med-number-field
          v-model="data.aspirinDose"
          :disabled="disabled"
          label="阿司匹林剂量"
          unit="mg"
          @confirm="onChanged"
        >
        </med-number-field> -->
      </div>
      <div v-if="isAnticoagulationDrug('2')">
        <med-date-picker
          v-model="data.clopidogrelTime"
          label="氯吡格雷给药时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          required
          :rules="[{ required: true, message: '请填写氯吡格雷给药时间' }]"
          @confirm="onChanged"
        />
        <med-radio-select-field
          v-model="data.clopidogrelDose"
          :disabled="disabled"
          label="氯吡格雷剂量"
          :select-options="clopidogrelDoseDic"
          required
          :rules="[{ required: true, message: '请填写氯吡格雷剂量' }]"
          @confirm="onChanged"
        >
        </med-radio-select-field>
        <!-- <med-number-field
          v-model="data.clopidogrelDose"
          :disabled="disabled"
          label="氯吡格雷剂量"
          unit="mg"
          @confirm="onChanged"
        >
        </med-number-field> -->
      </div>
      <div v-if="isAnticoagulationDrug('3')">
        <med-date-picker
          v-model="data.tigrilloTime"
          label="替格瑞洛给药时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          required
          :rules="[{ required: true, message: '请填写替格瑞洛给药时间' }]"
          @confirm="onChanged"
        />
        <med-radio-select-field
          v-model="data.tigrilloDose"
          :disabled="disabled"
          label="替格瑞洛剂量"
          :select-options="ticagrelorDoseDic"
          required
          :rules="[{ required: true, message: '请填写替格瑞洛剂量' }]"
          @confirm="onChanged"
        >
        </med-radio-select-field>
        <!-- <med-number-field
          v-model="data.tigrilloDose"
          :disabled="disabled"
          label="替格瑞洛剂量"
          unit="mg"
          @confirm="onChanged"
        >
        </med-number-field> -->
      </div>
    </div>
    <med-radio-button-field
      v-model="data.isAnticoagulation"
      :disabled="disabled"
      label="术前抗凝"
      :select-options="yesOrNoDic"
      required
      :rules="[{ required: true, message: '请填写术前抗凝' }]"
      @confirm="onChanged"
    >
    </med-radio-button-field>
    <div v-if="data.isAnticoagulation == '1'">
      <med-radio-select-field
        v-model="data.anticoagulationDrug"
        :disabled="disabled"
        label="抗凝药物"
        :select-options="anticoagulationDrugDic"
        @confirm="onChanged"
      >
      </med-radio-select-field>
      <med-date-picker
        v-model="data.anticoagulationTime"
        label="抗凝时间"
        :min-date="minDate"
        :max-date="maxDate"
        :disabled="disabled"
        @confirm="onChanged"
      />
      <med-drug-dose-field
        v-model="anticoagulation"
        :disabled="disabled"
        label="抗凝剂量"
        v-float="{ scale: 2, min: 0, max: 99999999 }"
        max-length="11"
        :unit-options="anticoagulationUnitDic"
        @confirm="onAnticoagulationConfirm"
      >
      </med-drug-dose-field>
    </div>
    <med-radio-button-field
      v-model="data.isStatin"
      :disabled="disabled"
      label="他汀治疗"
      :select-options="yesOrNoDic"
      @confirm="onChanged"
    >
    </med-radio-button-field>
    <med-radio-button-field
      v-model="data.isBetaBlocker"
      :disabled="disabled"
      label="β受体阻滞剂"
      :select-options="yesOrNoDic"
      @confirm="onChanged"
    >
    </med-radio-button-field>
    <van-dialog v-model="showDiag" title="院前双抗信息" show-cancel-button>
      <van-cell
        v-for="(item, index) in antiplateletList"
        :key="index"
        :title="item.title"
        :value="item.value"
      />
    </van-dialog>
  </div>
</template>

<script>
import { dicConstant } from '@/constant/commonConstant'
import dic from '../../../../../api/dic'
import { Dialog } from 'vant'
import { mapGetters } from 'vuex'

export default {
  name: 'Medicine',
  props: {
    data: {
      required: true,
      type: Object
    },
    dataPrehospital: {
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
      showDiag: false,
      antiplateletList: [],
      active: 0,
      registId: 0,
      minDate: new Date(2020, 0, 10),
      maxDate: new Date(2025, 10, 1),
      yesOrNoDic: [],
      anticoagulationDrugDic: [],
      antiplateletDrugDic: [],
      anticoagulationUnitDic: [],
      codeList: [
        dicConstant.yesOrNoCode,
        dicConstant.drugItemsCode,
        dicConstant.anticoagulationUnitCode,
        dicConstant.anticoagulationDrugCode
      ],
      anticoagulation: {
        value: '',
        unit: ''
      },
      aspirinDoseDic: dicConstant.aspirinDoseDic,
      clopidogrelDoseDic: dicConstant.clopidogrelDoseDic,
      ticagrelorDoseDic: dicConstant.ticagrelorDoseDic
    }
  },
  computed: {
    ...mapGetters(['dictionary'])
  },
  created() {
    this.getDicList()
  },
  mounted() {
    this.anticoagulation.value = this.data.anticoagulationDose
    this.anticoagulation.unit = this.data.anticoagulationUnit
  },
  methods: {
    showPhepAntiplatelet() {
      if (
        this.dataPrehospital.isAntiplatelet === '1' &&
        this.dataPrehospital.antiplatelet != null &&
        this.dataPrehospital.antiplatelet.length > 0
      ) {
        this.showDiag = true
        this.antiplateletList = []
        this.dataPrehospital.antiplatelet.forEach(str => {
          if (str === '1') {
            this.antiplateletList.push({
              title: this.conversionOne(str, this.dictionary.drugItemsDict),
              value: this.conversionOne(
                this.dataPrehospital.aspirin,
                this.aspirinDoseDic
              )
            })
          } else if (str === '2') {
            this.antiplateletList.push({
              title: this.conversionOne(str, this.dictionary.drugItemsDict),
              value: this.conversionOne(
                this.dataPrehospital.clopidogrel,
                this.clopidogrelDoseDic
              )
            })
          } else if (str === '3') {
            this.antiplateletList.push({
              title: this.conversionOne(str, this.dictionary.drugItemsDict),
              value: this.conversionOne(
                this.dataPrehospital.ticagrelor,
                this.ticagrelorDoseDic
              )
            })
          }
        })
      } else {
        Dialog.alert({
          title: '提示',
          message: '没有院前双抗基本信息！',
          theme: 'round-button'
        }).then(() => {})
      }
    },
    conversionOne(str, list) {
      if (str && list) {
        const matched = list.find(valx => valx.value === str)
        return matched?.label
      }
    },
    getDicList() {
      this.$api.service.getDictionary('').then(result => {
        this.yesOrNoDic = result[dicConstant.yesOrNoCode]
        this.antiplateletDrugDic = result[dicConstant.drugItemsCode]
        this.anticoagulationUnitDic =
          result[dicConstant.anticoagulationUnitCode]
        this.anticoagulationDrugDic =
          result[dicConstant.anticoagulationDrugCode]
      })
    },
    isAnticoagulationDrug(testKey) {
      if (!this.data.antiplateletDrug) return false
      return this.data.antiplateletDrug.indexOf(testKey) > -1
    },
    onChanged() {
      this.$emit('change', 'treatment')
    },
    onAnticoagulationConfirm() {
      this.data.anticoagulationDose = this.anticoagulation.value
      this.data.anticoagulationUnit = this.anticoagulation.unit
      this.onChanged()
    }
  },
  watch: {
    'data.anticoagulationDose': {
      immediate: false,
      handler(val) {
        this.anticoagulation.value = this.data.anticoagulationDose
      },
      deep: true
    },
    'data.anticoagulationUnit': {
      immediate: false,
      handler(val) {
        this.anticoagulation.unit = this.data.anticoagulationUnit
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped></style>
