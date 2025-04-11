<template>
  <div class="mini">

    <med-subtitle title="Grace评估" />
    <el-row :gutter="24">
      <el-col>
        <med-checkbox-field
          v-model="data.graceRisk"
          display-type="check"
          :disabled="disabled"
          label="Grace危险因素"
          :select-options="dictionary.graceEstimateDict"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="6">
        <med-text-field
          v-if="!data.graceVhrConditions || data.graceVhrConditions.length === 0"
          v-model="dataGrace.scoreValue"
          label="Grace评估"
          readonly
          :disabled="disabled"
          append="分"
          form-prop="grace.scoreValue"
          :rules="[
            { required: true, message: '请填写Grace评估', trigger: 'blur' }
          ]"
        >
          <template #formitem>
            <el-button type="primary" icon="el-icon-medal" size="mini" style="margin-left:10px" @click="showGrace">评分</el-button>
          </template>
        </med-text-field>
      </el-col>
    </el-row>

    <div v-if="graceModel">
      <el-dialog title="Grace评估" :visible.sync="graceModel" width="60%" center="" @close="closeGrace">
        <gracescore
          ref="gracescore"
          :data="dataGrace"
          :patient-info="patientInfo"
          title="Grace评估"
          label="Grace评估"
          @input="getResult"
        />
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeGrace">取 消</el-button>
          <el-button type="primary" @click="confirmGrace">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <med-checkbox-field
      v-model="data.graceVhrConditions"
      display-type="check"
      label="Grace极高危条件(满足以下其一即可)"
      :disabled="disabled"
      :select-options="dictionary.graceHighriskConditionDict"
      @change="onGraceVhrConditionsChanged"
    />
    <el-row :gutter="24">
      <el-col :span="4">
        <med-radio-field
          v-model="data.nsteAcs"
          :disabled="disabled || (data.graceVhrConditions != null && data.graceVhrConditions.length > 0)"
          label="NSTE-ACS危险分层"
          :select-options="dictionary.graceHighriskLaminationDict"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import gracescore from './components/gracescore'
import { mapGetters } from 'vuex'
export default {
  name: 'Grace',
  components: {
    gracescore
  },
  props: {
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
    },
    patientInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      active: 0,
      registId: 0,
      minDate: new Date(2020, 0, 10),
      maxDate: new Date(2025, 10, 1),
      graceModel: false,
      initGraceData: {
        scoreValue: '',
        itemAge: '',
        itemHr: '',
        itemSbp: '',
        itemScr: '',
        itemKillip: '',
        itemRisk: []
      },
      graceSaved: false
    }
  },
  computed: {
    ...mapGetters(['dictionary']),
    graceVhrConditionsDesc() {
      if (
        this.data.graceVhrConditions != null &&
        this.data.graceVhrConditions.length > 0
      ) {
        return '极高危'
      } else {
        if (this.dataGrace.scoreValue > 140) {
          return '高危'
        } else if (
          this.dataGrace.scoreValue > 109 &&
          this.dataGrace.scoreValue < 140
        ) {
          return '中危'
        } else if (this.dataGrace.scoreValue <= 108) {
          return '低危'
        }
      }
      return ''
    }
  },
  created() {
    // this.getDicList()
  },
  methods: {
    toMgPerDl(value) {
      if (!value || isNaN(value)) return ''
      return parseFloat(value) / 88.4
    },
    isFromFirstAid() {
      if (!this.patientInfo || !this.patientInfo.regist) return false
      return (
        this.patientInfo.regist.comeType === '1' ||
        this.patientInfo.regist.comeType === '2'
      )
    },
    getInitData() {
      const age = this.patientInfo.regist.age
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
        }
      }
      let heartRate = ''
      if (!this.isFromFirstAid() || !this.patientInfo.prehospital.heartRate) {
        heartRate = this.patientInfo.admission.heartRate
      } else heartRate = this.patientInfo.prehospital.heartRate
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
        }
      }
      let bloodPressure = ''
      if (!this.isFromFirstAid() || !this.patientInfo.prehospital.bloodPressure) {
        bloodPressure = this.patientInfo.admission.bloodPressure
      } else bloodPressure = this.patientInfo.prehospital.bloodPressure
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
          }
        }
      }
      const itemScr = this.patientInfo.diagnosisTest.cr
      if (itemScr != null && itemScr.value != null) {
        const mgPerDl = this.toMgPerDl(itemScr.value)
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
        }
      }
      const itemKillip = this.patientInfo.inspection.killipLevel
      this.initGraceData.itemKillip = itemKillip
      if (this.patientInfo.grace) {
        this.initGraceData.itemRisk = this.patientInfo.grace.itemRisk
      }
      this.initGraceData.itemRisk = this.patientInfo.inspection.graceRisk
    },
    showGrace() {
      this.graceModel = true
      this.getInitData()
      this.$nextTick(() => { this.$refs.gracescore.handleShow(this.initGraceData, this.graceSaved) })
    },
    closeGrace() {
      this.graceModel = false
    },
    confirmGrace() {
      this.closeGrace()
      this.graceSaved = true
      this.$refs.gracescore.handleSave()
    },
    // getDicList() {
    //   this.$api.service.getDictionary('').then(result => {
    //     this.yesOrNoDic = result[dicConstant.yesOrNoCode]
    //     this.interlayerTypeDic = result[dicConstant.interlayerTypeCode]
    //     this.strategyCodeDic = result[dicConstant.treatmentStrategyCode]
    //     this.graceHighriskConditionDict =
    //       result[dicConstant.graceHighriskConditionCode]
    //   })
    // },
    onChanged() {
      // if (
      //   this.data.graceVhrConditions != null &&
      //   this.data.graceVhrConditions.length > 0
      // ) {
      //   this.data.nsteAcs = '1'
      // }
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
    getResult(item) {
      this.dataGrace.scoreValue = item.scoreValue
      this.data.nsteAcs = this.calcNsteAcs()
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
          return null
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-footer{
text-align: right;
}
</style>
