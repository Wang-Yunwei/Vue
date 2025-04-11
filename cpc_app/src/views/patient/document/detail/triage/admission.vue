<template>
  <div class="mini">
    <div v-if="configure.dockingWay === '1'">
      <med-hint-field
        v-model="dataMain.outPatientNo"
        label="门诊号"
        link
        :readonly="true"
        @click="showimport"
        v-char
        :disabled="disabled || !dataRegist.emId"
        @confirm="onMainChanged"
      >
      </med-hint-field>
    </div>
    <med-text-field
      v-model="data.chiefComplaint"
      :disabled="disabled"
      label="主诉"
      @confirm="onChanged"
    />
    <med-radio-select-field
      v-model="dataMain.distressCase"
      :disabled="disabled"
      required
      :rules="[{ required: true, message: '请填写病情评估' }]"
      label="病情评估"
      :select-options="distressCaseDic"
      @confirm="onMainChanged"
    >
    </med-radio-select-field>
    <med-list-select-field
      v-model="dataMain.distressCaseDetail"
      :disabled="disabled"
      label="病情评估明细"
      :select-options="distressCaseDetailDic"
      :rules="[{ required: false, message: '请填写病情评估明细' }]"
      @confirm="onMainChanged"
      :hasOther="false"
    />
    <!-- <med-radio-select-field
      v-model="data.comeType"
      :disabled="disabled"
      label="来院方式"
      :select-options="comingTypeDesc"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '' }]"
    >
    </med-radio-select-field> -->
    <!-- <med-address-field
      v-model="dataMain.dacounty"
      :address="addresDesc"
      :disabled="disabled"
      label="发病地址"
      @confirm="onMainChanged"
    >
    </med-address-field> -->
    <!-- <med-text-field
      v-model="dataMain.address"
      :disabled="disabled"
      label="详细地址"
      @confirm="onMainChanged"
    /> -->
    <!-- <med-radio-button-field
      v-model="dataMain.isIllness"
      :disabled="disabled"
      label="大病医保"
      :select-options="yesOrNoDic"
      @confirm="onMainChanged"
    >
    </med-radio-button-field> -->
    <div v-if="data.comeType == '3' || data.comeType == '4'">
      <med-radio-button-field
        v-model="dataMain.isAttackUncertain"
        :disabled="disabled"
        label="发病无法精确到分钟"
        required
        :rules="[{ required: true, message: '请填写发病无法精确到分钟' }]"
        :select-options="yesOrNoDic"
        @confirm="onMainChanged"
      >
      </med-radio-button-field>
      <med-date-picker
        v-model="dataMain.attackTime"
        :disabled="disabled"
        :type="dataMain.isAttackUncertain === '1' ? 'date' : 'datetime'"
        :formatter="
          dataMain.isAttackUncertain === '1' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm'
        "
        label="发病时间"
        @confirm="onMainChanged"
        required
        :rules="[{ required: true, message: '请填写发病时间' }]"
      />
      <med-radio-select-field
        v-model="dataMain.isTimearea"
        :disabled="disabled"
        required
        :rules="[{ required: true, message: '请填写发病区间' }]"
        label="发病区间"
        :select-options="attackZoneDic"
        v-if="dataMain.isAttackUncertain === '1'"
        @confirm="onMainChanged"
      >
      </med-radio-select-field>
    </div>
    <!-- 呼救120和转院 -->
    <div v-if="data.comeType == '1' || data.comeType == '2'">
      <med-date-picker
        v-model="data.admissionTime"
        v-if="data.comeType == '1'"
        :disabled="disabled"
        label="院内首诊医师接诊时间"
        :min-date="minDate"
        :max-date="maxDate"
        required
        :rules="[{ required: true, message: '请填写院内首诊医师接诊时间' }]"
        @confirm="onChanged"
      />
      <med-date-picker
        v-model="data.admissionTime"
        v-if="data.comeType == '2'"
        :disabled="disabled"
        label="院内接诊时间"
        :min-date="minDate"
        :max-date="maxDate"
        required
        :rules="[{ required: true, message: '请填写院内接诊时间' }]"
        @confirm="onChanged"
      />
      <med-text-field
        v-model="data.admissionDoctor"
        label="医护人员"
        :disabled="disabled"
        :select-options="doctorsSetting"
        @confirm="onChanged"
      >
      </med-text-field>
    </div>
    <!-- 自行来院 -->
    <div v-if="data.comeType == '3'">
      <med-date-picker
        v-model="data.arrivedHospitalTime"
        label="到达医院大门时间"
        :disabled="disabled"
        required
        :rules="[{ required: true, message: '请填写到达医院大门时间' }]"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onChanged"
      />
      <med-date-picker
        v-model="data.admissionTime"
        :disabled="disabled"
        label="院内首诊医师接诊时间"
        :min-date="minDate"
        :max-date="maxDate"
        required
        :rules="[{ required: true, message: '请填写院内首诊医师接诊时间' }]"
        @confirm="onChanged"
      />
      <med-text-field
        v-model="data.admissionDoctor"
        label="医护人员"
        :disabled="disabled"
        :select-options="doctorsSetting"
        @confirm="onChanged"
      />
    </div>
    <!-- 院内发病 -->
    <div v-if="data.comeType == '4'">
      <med-text-field
        required
        :rules="[{ required: true, message: '请填写发病地点' }]"
        v-model="data.address"
        label="发病地点"
        :disabled="disabled"
        @confirm="onChanged"
      />
      <med-date-picker
        v-model="data.leaveAddressTime"
        :disabled="disabled"
        label="离开发病现场时间"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onChanged"
      />
      <med-text-field
        v-model="data.afterFmcStaff"
        label="本次发病后首次医疗接触人员"
        :disabled="disabled"
        @confirm="onChanged"
      />
    </div>
  </div>
</template>

<script>
import { dicConstant } from '../../../../../constant/commonConstant'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Admission',
  components: {},
  props: {
    data: {
      required: true,
      type: Object
    },
    dataMain: {
      required: true,
      type: Object
    },
    dataRegist: {
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
      comingTypeDic: [],
      comingTypeComputed: [],
      insuranceDic: [],
      distressCaseDetailDic: [],
      attackZoneDic: [],
      yesOrNoDic: [],
      // 病情评估字典
      distressCaseDic: [],
      codeList: [
        dicConstant.comingCode,
        dicConstant.insuranceCode,
        dicConstant.distressCaseCode,
        dicConstant.distressCaseDetailCode,
        dicConstant.attackZoneCode,
        dicConstant.yesOrNoCode
      ],
      addresDesc: {}
    }
  },
  computed: {
    ...mapGetters(['configure', 'location', 'doctorsSetting']),
    comingTypeDesc() {
      if (this.comingTypeDic && this.comingTypeDic.length > 0) {
        // 空白病例 来源方式 全都有
        if (this.dataRegist.infoComingType === '0') {
          return this.comingTypeDic
        } else if (this.dataRegist.infoComingType === '1') {
          // 急救 只有 120和转院
          return this.comingTypeDic.filter(function(x) {
            return x.value !== '3' && x.value !== '4'
          })
        } else if (this.dataRegist.infoComingType === '2') {
          // 急诊 只有 120、转院和自行来院
          return this.comingTypeDic.filter(function(x) {
            return x.value !== '4'
          })
        } else if (this.dataRegist.infoComingType === '3') {
          // 门诊 只有自行来院
          return this.comingTypeDic.filter(function(x) {
            return x.value !== '1' && x.value !== '2' && x.value !== '4'
          })
        } else if (this.dataRegist.infoComingType === '4') {
          // 门诊 只有 120、转院和住院
          return this.comingTypeDic.filter(function(x) {
            return x.value !== '3'
          })
        }
      }
      return this.comingTypeDic
    },
    showOutPatientNo() {
      if (
        this.dataRegist.infoComingType === '2' ||
        this.dataRegist.infoComingType === '3' ||
        this.dataRegist.infoComingType === '0'
      ) {
        return false
      } else return true
    }
  },
  mounted() {
    this.getDicList()
  },
  methods: {
    showimport() {
      if (this.disabled || !this.dataRegist.emId) return
      this.$emit('showimport', this.dataRegist.comeType)
    },
    getDicList() {
      this.$api.service.getDictionary('').then(result => {
        this.comingTypeDic = result[dicConstant.comingCode]
        this.insuranceDic = result[dicConstant.insuranceCode]
        this.distressCaseDic = result[dicConstant.distressCaseCode]
        this.distressCaseDetailDic = result[dicConstant.distressCaseDetailCode]
        this.attackZoneDic = result[dicConstant.attackZoneCode]
        this.yesOrNoDic = result[dicConstant.yesOrNoCode]
      })
    },
    onChanged() {
      this.$emit('change', '1')
    },
    onMainChanged() {
      if (
        this.dataMain.isAttackUncertain === '1' &&
        this.dataMain.attackTime != null &&
        this.dataMain.attackTime !== ''
      ) {
        this.dataMain.attackTime = this.$moment(
          this.dataMain.attackTime
        ).format('YYYY-MM-DD 00:00')
      }
      this.$emit('change', '2')
    }
  }
}
</script>

<style lang="less" scoped></style>
