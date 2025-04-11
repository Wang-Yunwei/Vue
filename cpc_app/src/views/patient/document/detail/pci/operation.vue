<template>
  <div class="mini">
    <!-- <med-text-field
      label="决定医生"
      v-model="data.PciDecisionDoctor"
      :disabled="disabled"
      @confirm="onChanged"
    /> -->
    <!-- <med-date-picker
      v-model="data.startConduitTime"
      label="启动导管室时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      @confirm="onChanged"
    /> -->
    <med-date-picker
      v-model="data.activateConduitTime"
      label="导管室激活时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      required
      :rules="[{ required: true, message: '请填写导管室激活时间' }]"
      @confirm="onChanged"
    />
    <med-date-picker
      v-model="data.patientArrivalTime"
      label="患者到达导管室时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      @confirm="onChanged"
    />
    <med-text-field
      v-model="data.interventionPerson"
      :disabled="disabled"
      label="介入医师"
      @confirm="onChanged"
    />
    <med-date-picker
      v-model="data.startPunctureTime"
      label="开始穿刺时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      @confirm="onChanged"
    />
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
      :disabled="disabled"
      label="TIMI血流等级"
      :select-options="timiDic"
      @confirm="onChanged"
    >
    </med-radio-select-field>
    <med-date-picker
      v-model="data.anticoagulationTime"
      label="术中抗凝给药时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      @confirm="onChanged"
    />
    <med-radio-select-field
      v-model="data.anticoagulationDrug"
      :disabled="disabled"
      label="术中抗凝药物"
      :select-options="knywDic"
      @confirm="onChanged"
    >
    </med-radio-select-field>
    <med-drug-dose-field
      v-model="anticoagulation"
      :disabled="disabled"
      label="术中抗凝药物剂量"
      :unit-options="anticoagulationUnitDic"
      @confirm="onAnticoagulationConfirm"
    >
    </med-drug-dose-field>
    <med-date-picker
      v-model="data.endOperationTime"
      label="手术结束时间"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled="disabled"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写手术结束时间' }]"
    />
    <div v-if="zjPci">
      <med-radio-button-field
        v-model="data.isDelay"
        :disabled="disabled"
        label="是否延误"
        :select-options="yesOrNoDic"
        @confirm="onChanged"
      >
      </med-radio-button-field>
      <med-list-select-field
        v-if="data.isDelay === '1'"
        v-model="data.delayReason"
        @confirm="onChanged"
        label="延误原因"
        :disabled="disabled"
        :select-options="delayReasonDic"
      />
      <med-number-field
        v-int="{ min: -10000, max: 999999 }"
        required
        v-model="D2W"
        :disabled="disabled"
        readonly
        label="D2W时间"
        min="-10000"
        max="999999"
        unit="分"
        placeholder="自动生成"
        @click="onD2WClick"
        @confirm="onChanged"
      >
      </med-number-field>
    </div>
  </div>
</template>

<script>
import { dicConstant } from '../../../../../constant/commonConstant'
import { Dialog } from 'vant'
export default {
  name: 'Operation',
  components: {},
  props: {
    data: {
      required: true,
      type: Object
    },
    disabled: {
      required: false,
      type: Boolean
    },
    dataPciPart: {
      required: true,
      type: []
    },
    dataAdmission: {
      required: true,
      type: Object
    },
    zjPci: {
      required: false,
      type: Boolean
    },
    jjPci: {
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
      ],
      codeList: [
        dicConstant.yesOrNoCode,
        dicConstant.anticoagulationDrugCode,
        dicConstant.timiLevelCode,
        dicConstant.delayReasonCode
      ],
      yesOrNoDic: [],
      timiDic: [],
      knywDic: [],
      delayReasonDic: [],
      anticoagulationUnitDic: [],
      anticoagulation: {
        value: '',
        unit: ''
      }
    }
  },
  computed: {
    D2W() {
      let hasValue = false
      const tempData = [...this.dataPciPart]
      const lst = tempData.sort((a, b) => {
        if (a.gwPassageTime === null && b.gwPassageTime !== null) {
          return -1
        }
        if (a.gwPassageTime !== null && b.gwPassageTime === null) {
          return 1
        }
        return this.$moment(a.gwPassageTime).isAfter(b.gwPassageTime) ? 1 : -1
      })

      if (
        this.dataAdmission.arrivedHospitalTime != null &&
        this.data.cagPosition != null &&
        this.data.cagPosition.length > 0
      ) {
        for (var i = 0; i < lst.length; i++) {
          const part = lst[i]
          if (JSON.stringify(this.data.cagPosition).indexOf(part.partId) >= 0) {
            if (part.isPci === '1' && part.gwPassageTime) {
              hasValue = true
              return this.$moment(part.gwPassageTime)
                .diff(
                  this.$moment(this.dataAdmission.arrivedHospitalTime),
                  'minute'
                )
                .toString()
            }
          }
        }
      }
      if (!hasValue) {
        return null
      }
      return '0'
    }
  },
  created() {
    this.getDicList()
  },
  mounted() {
    this.anticoagulation.value = this.data.anticoagulationDose
    this.anticoagulation.unit = this.data.anticoagulationUnit
  },
  methods: {
    getDicList() {
      this.$api.service.getDictionary('').then(result => {
        this.yesOrNoDic = result[dicConstant.yesOrNoCode]
        this.timiDic = result[dicConstant.timiLevelCode]
        this.knywDic = result[dicConstant.anticoagulationDrugCode]
        this.delayReasonDic = result[dicConstant.delayReasonCode]
        this.anticoagulationUnitDic =
          result[dicConstant.anticoagulationUnitCode]
      })
    },
    onAnticoagulationChanged(val) {
      if (!val) return
      this.data.AnticoagulationDose = val.value
      this.data.AnticoagulationUnit = val.unit.value
    },
    onChanged() {
      this.$emit('change', 'treatmentPci')
    },
    onAnticoagulationConfirm() {
      this.data.anticoagulationDose = this.anticoagulation.value
      this.data.anticoagulationUnit = this.anticoagulation.unit
      this.onChanged()
    },
    onD2WClick() {
      Dialog.alert({
        message: '需要填写到院时间和导丝通过时间'
      }).then(() => {})
    }
  },
  watch: {
    data: {
      handler(newName, oldName) {
        // debugger
        this.anticoagulation = {
          unit: this.data.anticoagulationUnit,
          value: this.data.anticoagulationDose
        }
      }
      // deep: true
    }
  }
}
</script>

<style lang="less" scoped></style>
