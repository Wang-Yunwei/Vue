<template>
  <div class="mini">
    <med-check-select-field
      v-model="data.graceRisk"
      @confirm="onChanged"
      label="Grace危险因素"
      :disabled="disabled"
      :select-options="dictionary.graceEstimateDict"
    ></med-check-select-field>
    <med-hint-field
      v-if="!data.graceVhrConditions || data.graceVhrConditions.length === 0"
      v-model="dataGrace.scoreValue"
      label="Grace评估"
      readonly
      is-link
      @click="showGrace"
      required
      :rules="[{ required: true, message: '请填写Grace评估' }]"
      :disabled="disabled"
    >
      <template #input-part>
        <span
:class="disabled ? 'grace-disabled' : ''"
          >{{ dataGrace.scoreValue }} 分</span
        >
      </template>
      <template #right-icon>
        <van-icon name="arrow" class="select-icon" />
      </template>
    </med-hint-field>
    <med-check-select-field
      v-model="data.graceVhrConditions"
      @confirm="onGraceVhrConditionsChanged"
      label="Grace极高危条件(满足以下其一即可)"
      :disabled="disabled"
      :select-options="dictionary.graceHighriskConditionDict"
    ></med-check-select-field>
    <med-radio-select-field
      v-model="data.nsteAcs"
      label="NSTE-ACS危险分层"
      :select-options="dictionary.graceHighriskLaminationDict"
      @confirm="onChanged"
      :disabled="
        disabled ||
          (data.graceVhrConditions != null &&
            data.graceVhrConditions.length > 0)
      "
    >
    </med-radio-select-field>
    <!-- <med-hint-field
      v-model="graceVhrConditionsDesc"
      label="NSTE-ACS危险分层"
      :disabled="true"
    >
      <template #right-icon>
        <van-icon name="arrow" class="select-icon" />
      </template>
    </med-hint-field> -->
    <div style="height:0px">
      <gracescore
        ref="gracescore"
        title="Grace评估"
        label="Grace评估"
        :disabled="disabled"
        @input="getResult"
      />
    </div>
  </div>
</template>

<script>
import { dicConstant } from '@/constant/commonConstant'
import { toMgPerDl } from '@/utils/commonUtil'
import gracescore from './gracescore'
import { mapGetters } from 'vuex'

export default {
  name: 'Grace',
  components: {
    gracescore
  },
  props: {
    dataAll: {
      required: true,
      type: Object
    },
    data: {
      required: true,
      type: Object
    },
    dataGrace: {
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
      unitName: '分',
      graceModel: false,
      initGraceData: {
        scoreValue: '',
        itemAge: '',
        itemHr: '',
        itemSbp: '',
        itemScr: '',
        itemKillip: '',
        itemRisk: []
      }
    }
  },
  computed: {
    ...mapGetters(['dictionary'])
    // graceVhrConditionsDesc() {
    //   if (
    //     this.data.graceVhrConditions != null &&
    //     this.data.graceVhrConditions.length > 0
    //   ) {
    //     return '1'
    //   } else {
    //     if (this.dataGrace.scoreValue > 140) {
    //       return '2'
    //     } else if (
    //       this.dataGrace.scoreValue >= 109 &&
    //       this.dataGrace.scoreValue <= 140
    //     ) {
    //       return '3'
    //     } else if (this.dataGrace.scoreValue <= 108) {
    //       return '4'
    //     } else {
    //     }
    //   }
    //   return ''
    // }
  },
  created() {},
  methods: {
    showGrace() {
      this.show = true
      // if (
      //   this.dataAll.prehospital.isBypassEm === '1' &&
      //   this.dataAll.prehospital.isBypassCcu === '1'
      // ) {
      //   this.getPreHospitalInitData()
      // } else {
      //   this.getInitData()
      // }
      // 应对双向互通，以院前优先，院前没有取院内
      this.getInitData()
      this.$refs.gracescore.showModel(true, this.initGraceData)
    },
    onChanged() {
      this.$emit('change', 'inspection')
    },
    onGraceVhrConditionsChanged() {
      if (
        this.data.graceVhrConditions != null &&
        this.data.graceVhrConditions.length > 0
      ) {
        this.data.nsteAcs = '1'
      }
      this.$emit('change', 'inspection')
    },
    calcNsteAcs() {
      if (
        this.data.graceVhrConditions != null &&
        this.data.graceVhrConditions.length > 0
      ) {
        return '1'
      } else {
        if (
          this.data.graceVhrConditions != null &&
          this.data.graceVhrConditions.length > 0
        ) {
          return '1'
        } else if (this.dataGrace.scoreValue > 140) {
          return '2'
        } else if (
          this.dataGrace.scoreValue >= 109 &&
          this.dataGrace.scoreValue <= 140
        ) {
          return '3'
        } else if (this.dataGrace.scoreValue <= 108) {
          return '4'
        } else {
        }
      }
    },
    getResult(item) {
      this.dataGrace.scoreValue = item.scoreValue
      this.data.nsteAcs = this.calcNsteAcs()
      this.$emit('change', 'inspection')
    },
    isFromFirstAid() {
      if (!this.dataAll || !this.dataAll.regist) return false
      return (
        this.dataAll.regist.comeType === '1' ||
        this.dataAll.regist.comeType === '2'
      )
    },
    getInitData() {
      const age = this.dataAll.regist.age
      if (age != null) {
        if (age < 30) {
          this.initGraceData.itemAge = '1'
        } else if (age >= 30 && age <= 39) {
          this.initGraceData.itemAge = '2'
        } else if (age >= 40 && age <= 49) {
          this.initGraceData.itemAge = '3'
        } else if (age >= 50 && age <= 59) {
          this.initGraceData.itemAge = '4'
        } else if (age >= 60 && age <= 69) {
          this.initGraceData.itemAge = '5'
        } else if (age >= 70 && age <= 79) {
          this.initGraceData.itemAge = '6'
        } else if (age >= 80) {
          this.initGraceData.itemAge = '7'
        } else {
        }
      }
      let heartRate = ''
      if (!this.isFromFirstAid() || !this.dataAll.prehospital.heartRate) {
        heartRate = this.dataAll.admission.heartRate
      } else heartRate = this.dataAll.prehospital.heartRate
      if (heartRate != null) {
        if (heartRate < 50) {
          this.initGraceData.itemHr = '1'
        } else if (heartRate >= 50 && heartRate <= 69) {
          this.initGraceData.itemHr = '2'
        } else if (heartRate >= 70 && heartRate <= 89) {
          this.initGraceData.itemHr = '3'
        } else if (heartRate >= 90 && heartRate <= 109) {
          this.initGraceData.itemHr = '4'
        } else if (heartRate >= 110 && heartRate <= 149) {
          this.initGraceData.itemHr = '5'
        } else if (heartRate >= 150 && heartRate <= 199) {
          this.initGraceData.itemHr = '6'
        } else if (heartRate >= 200) {
          this.initGraceData.itemHr = '7'
        } else {
        }
      }
      let bloodPressure = ''
      if (!this.isFromFirstAid() || !this.dataAll.prehospital.bloodPressure) {
        bloodPressure = this.dataAll.admission.bloodPressure
      } else bloodPressure = this.dataAll.prehospital.bloodPressure
      if (bloodPressure != null && bloodPressure.indexOf('/') > -1) {
        const sbp = bloodPressure.split('/')[0]
        if (sbp != null) {
          if (sbp < 80) {
            this.initGraceData.itemSbp = '1'
          } else if (sbp >= 80 && sbp <= 99) {
            this.initGraceData.itemSbp = '2'
          } else if (sbp >= 100 && sbp <= 119) {
            this.initGraceData.itemSbp = '3'
          } else if (sbp >= 120 && sbp <= 139) {
            this.initGraceData.itemSbp = '4'
          } else if (sbp >= 140 && sbp <= 159) {
            this.initGraceData.itemSbp = '5'
          } else if (sbp >= 160 && sbp <= 199) {
            this.initGraceData.itemSbp = '6'
          } else if (sbp >= 200) {
            this.initGraceData.itemSbp = '7'
          } else {
          }
        }
      }
      const itemScr = this.dataAll.diagnosisTest.cr
      if (itemScr != null && itemScr.value != null) {
        const mgPerDl = toMgPerDl(itemScr.value)
        if (mgPerDl >= 0 && mgPerDl <= 0.39) {
          this.initGraceData.itemScr = '1'
        } else if (mgPerDl >= 0.4 && mgPerDl <= 0.79) {
          this.initGraceData.itemScr = '2'
        } else if (mgPerDl >= 0.8 && mgPerDl <= 1.19) {
          this.initGraceData.itemScr = '3'
        } else if (mgPerDl >= 1.2 && mgPerDl <= 1.59) {
          this.initGraceData.itemScr = '4'
        } else if (mgPerDl >= 1.6 && mgPerDl <= 1.99) {
          this.initGraceData.itemScr = '5'
        } else if (mgPerDl >= 2.0 && mgPerDl <= 3.99) {
          this.initGraceData.itemScr = '6'
        } else if (mgPerDl >= 4) {
          this.initGraceData.itemScr = '7'
        } else {
        }
      }
      const itemKillip = this.dataAll.inspection.killipLevel
      this.initGraceData.itemKillip = itemKillip
      if (this.dataAll.grace) {
        this.initGraceData.itemRisk = this.dataAll.grace.itemRisk
      }
      this.initGraceData.itemRisk = this.dataAll.inspection.graceRisk
    },
    getPreHospitalInitData() {
      const age = this.dataAll.regist.age
      if (age != null) {
        if (age < 30) {
          this.initGraceData.itemAge = '1'
        } else if (age >= 30 && age <= 39) {
          this.initGraceData.itemAge = '2'
        } else if (age >= 40 && age <= 49) {
          this.initGraceData.itemAge = '3'
        } else if (age >= 50 && age <= 59) {
          this.initGraceData.itemAge = '4'
        } else if (age >= 60 && age <= 69) {
          this.initGraceData.itemAge = '5'
        } else if (age >= 70 && age <= 79) {
          this.initGraceData.itemAge = '6'
        } else if (age >= 80) {
          this.initGraceData.itemAge = '7'
        } else {
        }
      }
      const heartRate = this.dataAll.prehospital.heartRate
      if (heartRate != null) {
        if (heartRate < 50) {
          this.initGraceData.itemHr = '1'
        } else if (heartRate >= 50 && heartRate <= 69) {
          this.initGraceData.itemHr = '2'
        } else if (heartRate >= 70 && heartRate <= 89) {
          this.initGraceData.itemHr = '3'
        } else if (heartRate >= 90 && heartRate <= 109) {
          this.initGraceData.itemHr = '4'
        } else if (heartRate >= 110 && heartRate <= 149) {
          this.initGraceData.itemHr = '5'
        } else if (heartRate >= 150 && heartRate <= 199) {
          this.initGraceData.itemHr = '6'
        } else if (heartRate >= 200) {
          this.initGraceData.itemHr = '7'
        } else {
        }
      }
      const bloodPressure = this.dataAll.prehospital.bloodPressure
      if (bloodPressure != null && bloodPressure.indexOf('/') > -1) {
        const sbp = bloodPressure.split('/')[0]
        if (sbp != null) {
          if (sbp < 80) {
            this.initGraceData.itemSbp = '1'
          } else if (sbp >= 80 && sbp <= 99) {
            this.initGraceData.itemSbp = '2'
          } else if (sbp >= 100 && sbp <= 119) {
            this.initGraceData.itemSbp = '3'
          } else if (sbp >= 120 && sbp <= 139) {
            this.initGraceData.itemSbp = '4'
          } else if (sbp >= 140 && sbp <= 159) {
            this.initGraceData.itemSbp = '5'
          } else if (sbp >= 160 && sbp <= 199) {
            this.initGraceData.itemSbp = '6'
          } else if (sbp >= 200) {
            this.initGraceData.itemSbp = '7'
          } else {
          }
        }
      }
      const itemScr = this.dataAll.diagnosisTest.cr
      if (itemScr != null && itemScr.value != null) {
        const mgPerDl = toMgPerDl(itemScr.value)
        if (mgPerDl >= 0 && mgPerDl <= 0.39) {
          this.initGraceData.itemScr = '1'
        } else if (mgPerDl >= 0.4 && mgPerDl <= 0.79) {
          this.initGraceData.itemScr = '2'
        } else if (mgPerDl >= 0.8 && mgPerDl <= 1.19) {
          this.initGraceData.itemScr = '3'
        } else if (mgPerDl >= 1.2 && mgPerDl <= 1.59) {
          this.initGraceData.itemScr = '4'
        } else if (mgPerDl >= 1.6 && mgPerDl <= 1.99) {
          this.initGraceData.itemScr = '5'
        } else if (mgPerDl >= 2.0 && mgPerDl <= 3.99) {
          this.initGraceData.itemScr = '6'
        } else if (mgPerDl >= 4) {
          this.initGraceData.itemScr = '7'
        } else {
        }
      }
      const itemKillip = this.dataAll.inspection.killipLevel
      this.initGraceData.itemKillip = itemKillip
      if (this.dataAll.grace) {
        this.initGraceData.itemRisk = this.dataAll.grace.itemRisk
      }
      this.initGraceData.itemRisk = this.dataAll.inspection.graceRisk
    }
  }
}
</script>

<style lang="less" scoped>
.grace-disabled {
  color: #c8c9cc;
}
</style>
