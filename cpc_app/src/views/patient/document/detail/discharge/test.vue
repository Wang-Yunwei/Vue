<template>
  <div class="mini">
    <med-radio-button-field
      v-model="data.isHospitalinspection"
      :disabled="disabled"
      label="是否有住院检查"
      :select-options="dictionary.yesOrNoDict"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写是否有住院检查' }]"
    >
    </med-radio-button-field>
    <med-radio-button-field
      v-model="data.isTroponinH72"
      :disabled="disabled"
      label="72h内肌钙蛋白"
      :select-options="dictionary.yesOrNoDict"
      v-if="data.isHospitalinspection == 1"
      @confirm="onH72Changed"
      required
      :rules="[{ required: true, message: '请填写72h内肌钙蛋白' }]"
    >
    </med-radio-button-field>
    <med-radio-select-field
      v-model="data.troponinH72.type"
      :disabled="disabled"
      required
      :rules="[{ required: true, message: '请填写72h内肌钙蛋白' }]"
      label="72h内肌钙蛋白"
      :select-options="dictionary.troponinDict"
      v-if="data.isHospitalinspection == 1 && data.isTroponinH72 == 1"
      @confirm="onTroponinH72Changed"
    >
    </med-radio-select-field>
    <med-lab-result-field
      :maxlength="12"
      v-float="{ scale: 3, min: 0, max: 99999999 }"
      label="肌钙蛋白最高值"
      v-model="troponinH72"
      :disabled="disabled"
      :unit-options="dictionary.ctnUnitDict"
      v-if="data.isHospitalinspection == 1 && data.isTroponinH72 == 1"
      required
      :rules="[{ required: true, message: '请填写肌钙蛋白最高值' }]"
      @confirm="onTroponinH72Changed"
    />
    <!-- <med-number-field
      v-if="data.isHospitalinspection == 1 && data.isTroponinH72 == 1"
      v-model="data.troponinH72.result"
      :disabled="disabled"
      label="肌钙蛋白最高值"
      unit="ng/mL"
      @confirm="onTroponinH72Changed"
      required
      :rules="[{ required: true, message: '' }]"
    >
    </med-number-field> -->
    <med-radio-button-field
      v-model="data.isBnp"
      :disabled="disabled"
      label="脑钠肽"
      :select-options="dictionary.yesOrNoDict"
      v-if="data.isHospitalinspection == 1"
      @confirm="onBnpSelectChanged"
      required
      :rules="[{ required: true, message: '请填写脑钠肽' }]"
    >
    </med-radio-button-field>
    <med-radio-select-field
      v-model="data.bnp.type"
      :disabled="disabled"
      required
      :rules="[{ required: true, message: '请填写脑钠肽' }]"
      label="脑钠肽"
      :select-options="dictionary.bnpTypeDict"
      v-if="data.isHospitalinspection == 1 && data.isBnp == 1"
      @confirm="onBnpChanged"
    >
    </med-radio-select-field>
    <med-number-field
      :maxlength="12"
      v-float="{ scale: 3, min: 0, max: 99999999 }"
      v-if="data.isHospitalinspection == 1 && data.isBnp == 1"
      v-model="data.bnp.result"
      :disabled="disabled"
      label="脑钠肽最高值"
      unit="pg/Ml"
      required
      :rules="[{ required: true, message: '请填写脑钠肽最高值' }]"
      @confirm="onBnpChanged"
    >
    </med-number-field>
    <med-radio-button-field
      v-model="data.isTc"
      :disabled="disabled"
      label="总胆固醇(TC)"
      :select-options="dictionary.yesOrNoDict"
      v-if="data.isHospitalinspection == 1"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写总胆固醇(TC)' }]"
    >
    </med-radio-button-field>
    <med-number-field
      :maxlength="12"
      v-float="{ scale: 3, min: 0, max: 99999999 }"
      v-if="data.isHospitalinspection == 1 && data.isTc == 1"
      v-model="data.tc.result"
      :disabled="disabled"
      label="总胆固醇(TC)"
      unit="mmol/L"
      @confirm="onTcChanged"
      required
      :rules="[{ required: true, message: '请填写总胆固醇(TC)' }]"
    >
    </med-number-field>
    <med-radio-button-field
      v-model="data.isTg"
      :disabled="disabled"
      label="甘油三酯(TG)"
      :select-options="dictionary.yesOrNoDict"
      v-if="data.isHospitalinspection == 1"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写甘油三酯(TG)' }]"
    >
    </med-radio-button-field>
    <med-number-field
      :maxlength="12"
      v-float="{ scale: 3, min: 0, max: 99999999 }"
      v-if="data.isHospitalinspection == 1 && data.isTg == 1"
      v-model="data.tg.result"
      :disabled="disabled"
      label="甘油三酯(TG)"
      unit="mmol/L"
      @confirm="onTgChanged"
      required
      :rules="[{ required: true, message: '请填写甘油三酯(TG)' }]"
    >
    </med-number-field>
    <med-radio-button-field
      v-model="data.isHdlC"
      :disabled="disabled"
      label="高密度脂蛋白(HDL-C)"
      :select-options="dictionary.yesOrNoDict"
      v-if="data.isHospitalinspection == 1"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写高密度脂蛋白(HDL-C)' }]"
    >
    </med-radio-button-field>
    <med-number-field
      :maxlength="12"
      v-float="{ scale: 3, min: 0, max: 99999999 }"
      v-if="data.isHospitalinspection == 1 && data.isHdlC == 1"
      v-model="data.hdlC.result"
      :disabled="disabled"
      label="高密度脂蛋白(HDL-C)"
      unit="mmol/L"
      @confirm="onHdlcChanged"
      required
      :rules="[{ required: true, message: '请填写高密度脂蛋白(HDL-C)' }]"
    >
    </med-number-field>
    <med-radio-button-field
      v-model="data.isLdlC"
      :disabled="disabled"
      label="低密度脂蛋白(LDL-C)"
      :select-options="dictionary.yesOrNoDict"
      v-if="data.isHospitalinspection == 1"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写低密度脂蛋白(LDL-C)' }]"
    >
    </med-radio-button-field>
    <med-number-field
      :maxlength="12"
      v-float="{ scale: 3, min: 0, max: 99999999 }"
      v-if="data.isHospitalinspection == 1 && data.isLdlC == 1"
      v-model="data.ldlC.result"
      :disabled="disabled"
      label="低密度脂蛋白(LDL-C)"
      unit="mmol/L"
      @confirm="onLdlcChanged"
      required
      :rules="[{ required: true, message: '请填写低密度脂蛋白(LDL-C)' }]"
    >
    </med-number-field>
    <med-radio-button-field
      v-model="data.isUcg"
      :disabled="disabled"
      label="超声心动图"
      :select-options="dictionary.yesOrNoDict"
      v-if="data.isHospitalinspection == 1"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写超声心动图' }]"
    >
    </med-radio-button-field>
    <med-number-field
      :maxlength="5"
      v-float="{ scale: 2, min: 0, max: 100 }"
      v-if="data.isHospitalinspection == 1 && data.isUcg == 1"
      v-model="data.lvef"
      :disabled="disabled"
      label="LVEF"
      unit="%"
      min="0"
      max="100"
      @confirm="onChanged"
    >
    </med-number-field>
    <med-radio-button-field
      v-model="data.isVntricularAneurysm"
      :disabled="disabled"
      label="室壁瘤"
      :select-options="dictionary.yesOrNoDict"
      v-if="data.isHospitalinspection == 1 && data.isUcg == 1"
      @confirm="onChanged"
    >
    </med-radio-button-field>
    <med-radio-button-field
      v-model="data.isPartVntricular"
      :disabled="disabled"
      label="局部室壁活动异常"
      :select-options="dictionary.yesOrNoDict"
      v-if="data.isHospitalinspection == 1 && data.isUcg == 1"
      @confirm="onChanged"
    >
    </med-radio-button-field>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Test',
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
      troponinH72: {
        unit: '1',
        value: '7'
      }
    }
  },
  computed: {
    ...mapGetters(['dictionary'])
  },
  created() {
    if (this.data.troponinH72 != null) {
      this.troponinH72.unit = this.data.troponinH72.unit
      this.troponinH72.value = this.data.troponinH72.result
    }
  },
  methods: {
    onH72Changed() {
      if (this.data.isTroponinH72 === '1') {
        this.data.troponinH72.type = 'TnT'
      }
      this.$emit('change', 'discharge')
    },
    onBnpSelectChanged() {
      if (this.data.isBnp === '1') {
        this.data.bnp.type = 'Bnp'
      }
      this.$emit('change', 'discharge')
    },
    onChanged() {
      this.$emit('change', 'discharge')
    },
    onTroponinH72Changed() {
      this.$emit('troponinH72Change', this.troponinH72)
    },
    onBnpChanged() {
      this.$emit('change', 'bnp')
    },
    onTcChanged() {
      this.$emit('change', 'tc')
    },
    onTgChanged() {
      this.$emit('change', 'tg')
    },
    onHdlcChanged() {
      this.$emit('change', 'hdlc')
    },
    onLdlcChanged() {
      this.$emit('change', 'ldlc')
    }
  },
  watch: {
    data: {
      handler(newName, oldName) {
        // debugger
        if (this.data.troponinH72 != null) {
          this.troponinH72 = {
            unit: this.data.troponinH72.unit,
            value: this.data.troponinH72.result
          }
        }
      }
      // deep: true
    }
  }
}
</script>
<style lang="less" scoped></style>
