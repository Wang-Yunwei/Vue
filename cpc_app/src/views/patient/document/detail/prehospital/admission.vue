<template>
  <div>
    <med-hint-field
      v-model="data.licensePlate"
      label="车牌号"
      :readonly="true"
      link
      :disabled="disabled || !dataRegist.emId"
      @click="showimport"
      @confirm="onChanged"
    >
    </med-hint-field>
    <med-radio-button-field
      v-model="dataMain.isAttackUncertain"
      :disabled="disabled"
      label="发病无法精确到分钟"
      required
      :rules="[{ required: true, message: '请填写无法精确到分钟' }]"
      :select-options="dictionary.yesOrNoDict"
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
      :select-options="dictionary.attackZoneDict"
      @confirm="onMainChanged"
      v-if="dataMain.isAttackUncertain === '1'"
    >
    </med-radio-select-field>
    <div v-if="dataAdmission.comeType == 1">
      <med-date-picker
        v-model="data.helpTime"
        label="呼救时间"
        :disabled="disabled"
        @confirm="onChanged"
        required
        :rules="[{ required: true, message: '请填写呼救时间' }]"
      />
      <med-radio-select-field
        v-model="data.ambulanceDepartment"
        :disabled="disabled"
        required
        :rules="[{ required: true, message: '请填写出车单位' }]"
        label="出车单位"
        :select-options="dictionary.ambulanceDepartmentDict"
        @confirm="onChanged"
      >
      </med-radio-select-field>
    </div>
    <div v-if="dataAdmission.comeType == 1 || dataAdmission.comeType == 2">
      <med-text-field
        v-model="data.admissionDoctor"
        label="医护人员"
        :disabled="disabled"
        :select-options="admissionDoctors"
        @confirm="onChanged"
      >
      </med-text-field>
    </div>
    <div v-if="dataAdmission.comeType == 2">
      <med-radio-select-field
        v-model="data.zcyyType"
        :disabled="disabled"
        required
        :rules="[{ required: true, message: '请填写转院类型' }]"
        label="转院类型"
        :select-options="dictionary.transferTypeDict"
        @confirm="onChanged"
      >
      </med-radio-select-field>
      <med-text-field
        v-model="data.zcyyHospitalName"
        label="医院名称"
        v-if="data.zcyyType === '2'"
        :disabled="disabled"
        @confirm="onChanged"
      />
      <med-radio-select-field
        v-model="data.zcyyHospitalName"
        :disabled="disabled"
        v-if="data.zcyyType === '1'"
        label="医院名称"
        :select-options="netHospitalsDict"
        @confirm="onChanged"
      >
      </med-radio-select-field>
      <med-date-picker
        v-model="data.zcyyVisitTime"
        label="转出医院入门时间"
        :min-date="minDate"
        :max-date="maxDate"
        :disabled="disabled"
        @confirm="onChanged"
        required
        :rules="[{ required: true, message: '请填写转出医院入门时间' }]"
      />
      <med-date-picker
        v-model="data.zcyyDecisionTime"
        label="决定转院时间"
        :min-date="minDate"
        :max-date="maxDate"
        :disabled="disabled"
        required
        :rules="[{ required: true, message: '请填写决定转院时间' }]"
        @confirm="onChanged"
      />
      <med-date-picker
        v-model="data.zcyyLeaveTime"
        label="转出医院出门时间"
        :min-date="minDate"
        :max-date="maxDate"
        :disabled="disabled"
        @confirm="onChanged"
        required
        :rules="[{ required: true, message: '请填写转出医院出门时间' }]"
      />
    </div>
    <div v-if="dataAdmission.comeType == 1 || dataAdmission.comeType == 2">
      <med-radio-button-field
        v-model="data.isTransHospital"
        :disabled="disabled"
        label="直接转送上级医院(转出患者时)"
        :select-options="dictionary.yesOrNoDict"
        @confirm="onTransHospitalChanged"
        required
        :rules="[
          { required: true, message: '请填写直接转送上级医院(转出患者时)' }
        ]"
      >
      </med-radio-button-field>
      <van-cell v-show="data.isTransHospital === '1'">
        <div class="message">
          表示不进入本院，直接转送至上级医疗机构，患者转归不用填写!
        </div>
      </van-cell>
      <med-radio-button-field
        v-if="data.isTransHospital === '1'"
        v-model="data.isDirectPci"
        :disabled="disabled"
        label="直达导管室"
        :select-options="dictionary.yesOrNoDict"
        @confirm="onChanged"
        required
        :rules="[{ required: true, message: '请填写直达导管室' }]"
      >
      </med-radio-button-field>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ruleConstant } from '@/constant/commonConstant'

export default {
  name: 'Admission',
  components: {},
  props: {
    data: {
      required: true,
      type: Object
    },
    dataAdmission: {
      required: true,
      type: Object
    },
    dataRegist: {
      required: true,
      type: Object
    },
    dataMain: {
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
      minDate: new Date(2020, 0, 10),
      maxDate: new Date(2025, 10, 1),
      active: 0,
      registId: 0,
      netHospitalsDict: []
    }
  },
  computed: {
    ...mapGetters(['configure', 'dictionary', 'doctorsSetting']),
    admissionDoctors() {
      return this.doctorsSetting
    },
    comingTypeDic() {
      return this.dictionary.comingDict
    },
    showLicensePlate() {
      if (this.configure.dockingWay === '2') {
        return false
      } else {
        if (
          this.dataRegist.infoComingType === '1' ||
          this.dataRegist.infoComingType === '0'
        ) {
          return false
        } else return true
      }
    },
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
    }
  },
  created() {
    this.getNetHospitals()
  },
  methods: {
    getNetHospitals() {
      this.$api.service
        .getSysSetting({ code: ruleConstant.NET_HOSPITAL })
        .then(res => {
          // debugger
          if (res.status === 200) {
            if (res.hasOwnProperty('result')) {
              const netHospitals = JSON.parse(res.result.value)
              this.netHospitalsDict = netHospitals
                .filter(m => m.isEnabled)
                .map(m => {
                  return { label: m.name, value: m.name }
                })
            }
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
    },
    showimport() {
      if (this.disabled || !this.dataRegist.emId) return
      this.$emit('showimport', '-1')
    },
    onTransHospitalChanged() {
      this.$emit('onTransHospitalChanged')
    },
    onChanged() {
      this.$emit('change')
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
      this.$emit('mainChange')
    },
    onTraigeAdmissionChanged() {
      this.$emit('traigeAdmissionChange')
    }
  }
}
</script>
<style lang="less" scoped>
.message {
  color: red;
}
</style>
