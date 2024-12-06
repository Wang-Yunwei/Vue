<template>
  <div class="patient-outcome-body" ref="patient_outcome_body">
    <van-form ref="formData" :show-error-message="false">
      <div>
        <div class="task-part-title">
          <span class="solid" />
          <span>病人去向</span>
        </div>
        <med-radio-select-field label="病人去向" v-model="form.turnResult" :select-options="patientDestinations" required :rules="[{ required: true, message: '请选择病人去向' }]" :disabled="readonly" @change="changeTurnResult" />
        <div v-if="patientDestinations.length > 0">
          <div v-if="form.turnResult === patientDestinations[0].value">
            <div v-if="receiveDept === '01'">
              <med-date-picker label="急诊离院时间" v-model="form.leaveEmTime" type="datetime" formatter="YYYY-MM-DD HH:mm" :disabled="readonly" required :rules="[{ required: true, message: '请填写急诊离院时间' }]" v-clear @confirm="(val) => val ? $emit('validateTimeField') : ''" />
              <med-number-field label="急诊停留时间" v-model="form.emStayMinutes" unit="分钟" placeholder="自动计算" readonly v-clear :disabled="readonly" />
            </div>
            <div v-if="receiveDept === '02'">
              <med-date-picker label="离院时间" v-model="form.outphospitalTime" type="datetime" formatter="YYYY-MM-DD HH:mm" :disabled="readonly" required :rules="[{ required: true, message: '请填写离院时间' }]" v-clear @confirm="(val) => val ? $emit('validateTimeField') : ''" />
              <med-number-field label="门诊停留时间" v-model="form.outpatientStayMinutes" unit="分钟" placeholder="自动计算" readonly v-clear :disabled="readonly" />
            </div>
            <med-radio-select-field label="治疗结果" v-model="form.treatmentResult" :select-options="CURERESULT_0001" :disabled="readonly" />
            <med-text-field v-if="form.treatmentResult === '04'" label="其他原因离院" v-model="form.otherOuthospitalReason" :disabled="readonly" maxlength="100" />
          </div>
          <div v-if="form.turnResult === patientDestinations[1].value">
            <med-radio-select-field label="住院科室" v-model="form.admissionDept" :select-options="INHOSPITAL_DEPT" v-clear :disabled="readonly" />
            <van-field v-model="form.admissionNo" label="住院号" placeholder="住院号" v-clear :disabled="readonly || isEmId">
              <template #right-icon>
                <van-icon name="arrow" @click="isShowPatientList = isEmId ? false : true" />
              </template>
            </van-field>
            <med-date-picker label="办理住院时间" v-model="form.inphospitalTime" type="datetime" formatter="YYYY-MM-DD HH:mm" v-clear required :rules="[{ required: true, message: '请填写办理住院时间' }]" :disabled="readonly" @confirm="(val) => val ? $emit('validateTimeField') : ''" />
            <med-date-picker label="结束住院时间" v-model="form.endphospitalTime" type="datetime" formatter="YYYY-MM-DD HH:mm" v-clear required :rules="[{ required: true, message: '请填写结束住院时间' }]" :disabled="readonly" @confirm="(val) => val ? $emit('validateTimeField') : ''" />
            <med-number-field label="住院天数" v-model="form.outphospitalDays" unit="天" placeholder="自动计算" readonly v-clear :disabled="readonly" />
            <med-radio-button-field label="住院后是否死亡" v-model="form.isInpatientDead" :select-options="WHETHER" v-clear required :rules="[{ required: true, message: '请选择住院后是否死亡' }]" :disabled="readonly" />
            <med-date-picker v-if="form.isInpatientDead === '1'" label="死亡时间" v-model="form.deadTime" type="datetime" formatter="YYYY-MM-DD HH:mm" v-clear required :rules="[{ required: true, message: '请填写住院后死亡时间' }]" :disabled="readonly" />
            <med-radio-button-field label="是否到达ICU" v-model="form.isIcu" :select-options="WHETHER" @change="IcuButton" v-clear required :rules="[{ required: true, message: '请选择是否到达ICU' }]" :disabled="readonly" />
            <div v-if="form.isIcu === '1'">
              <van-field label="到达ICU时间" required readonly :disabled="readonly">
                <template #right-icon>
                  <van-icon name="add-o" :color="readonly ? 'rgb(200,201,204)' : 'rgb(97,109,245)'" @click="readonly ? '' : addICU()" :disabled="readonly" />
                </template>
              </van-field>
              <div v-for="(item, index) in form.icuRecordList" :key="index" style="display: flex;position: relative">
                <div class="time-ICU ">
                  <med-date-picker label="到达ICU时间" v-model="item.arriveIcuTime" type="datetime" formatter="YYYY-MM-DD HH:mm" v-clear required :rules="[{ required: true, message: '请填写到达ICU时间' }]" :disabled="readonly" @_change="computICU" @confirm="(val) => val ? $emit('validateTimeField') : ''" />
                  <med-date-picker label="离开ICU时间" v-model="item.leaveIcuTime" type="datetime" formatter="YYYY-MM-DD HH:mm" v-clear required :rules="[{ required: true, message: '请填写离开ICU时间' }]" :disabled="readonly" @_change="computICU" @confirm="(val) => val ? $emit('validateTimeField') : ''" />
                </div>
                <div style="flex: 1;position: relative;text-align: right;">
                  <van-icon name="delete-o" color="red" @click="deleteICU(item.id, index)" v-if="!readonly" style="position: absolute;top: 50%;right: 23%;transform: translate(-50%, -50%);" size="0.4rem" />
                </div>
                <div style="position: absolute; left:3.5rem;top: 22%;">
                  <div style="width: 0.14rem;height: 0.14rem;border-radius: 0.2rem; background-color: rgb(200,201,204);" />
                  <div style="border-left: 1px solid rgb(200,201,204);height: 1rem;position: relative;left: 0.06rem; margin: 0.01rem 0 0.02rem 0;" />
                  <div style="width: 0.14rem;height: 0.13rem;border-radius: 0.2rem; background-color: rgb(200,201,204);" />
                </div>
              </div>
            </div>
            <med-number-field v-if="form.isIcu === '1'" label="ICU住院天数" v-model="form.stayIcuDays" unit="天" placeholder="自动计算" readonly v-clear :disabled="readonly" />
          </div>
          <div v-if="form.turnResult === patientDestinations[2].value">
            <med-date-picker label="交接时间" v-model="form.shiftTime" type="datetime" formatter="YYYY-MM-DD HH:mm" v-clear required :rules="[{ required: true, message: '请填写交接时间' }]" :disabled="readonly" @confirm="(val) => val ? $emit('validateTimeField') : ''" />
            <med-text-field label="接收医院" v-model="form.receiveHospital" v-clear :disabled="readonly" maxlength="50" />
            <med-radio-select-field label="转院时病情判断" v-model="form.transferDiagnosis" :select-options="DIAGNOSIS_0001" v-clear required :rules="[{ required: true, message: '请选择转院时病情判断' }]" :disabled="readonly" />
          </div>
          <div v-if="form.turnResult === patientDestinations[3].value">
            <med-date-picker label="死亡时间" v-model="form.deadTime" type="datetime" formatter="YYYY-MM-DD HH:mm" v-clear required :rules="[{ required: true, message: '请填写死亡时间' }]" :disabled="readonly" />
            <med-text-field label="死亡原因描述" v-model="form.deadReason" v-clear :disabled="readonly" maxlength="100" />
          </div>
          <div v-if="form.turnResult === patientDestinations[4].value">
            <med-date-picker label="留观时间" v-model="form.observingTime" type="datetime" formatter="YYYY-MM-DD HH:mm" v-clear required :rules="[{ required: true, message: '请填写留观时间' }]" :disabled="readonly" @confirm="(val) => val ? $emit('validateTimeField') : ''" />
            <div v-if="receiveDept === '02'">
              <med-radio-button-field label="留观后是否死亡" v-model="form.isObservingDead" :select-options="WHETHER" v-clear required :rules="[{ required: true, message: '请选择留观后是否死亡' }]" :disabled="readonly" />
              <med-date-picker v-if="form.isObservingDead === '1'" label="死亡时间" v-model="form.deadTime" type="datetime" formatter="YYYY-MM-DD HH:mm" v-clear required :rules="[{ required: true, message: '请填写死亡时间' }]" :disabled="readonly" />
            </div>
            <div v-else>
              <med-radio-button-field label="急诊留观后是否死亡" v-model="form.isEmDead" :select-options="WHETHER" v-clear required :rules="[
      { required: true, message: '请选择急诊留观后是否死亡' }
    ]" :disabled="readonly" />
              <med-date-picker v-if="form.isEmDead === '1'" label="死亡时间" v-model="form.deadTime" type="datetime" formatter="YYYY-MM-DD HH:mm" v-clear required :rules="[{ required: true, message: '请填写死亡时间' }]" :disabled="readonly" />
            </div>
            <med-text-field label="留观原因描述" v-model="form.observingReason" v-clear :disabled="readonly" maxlength="100" />
          </div>
          <div v-if="form.turnResult === patientDestinations[5].value">
            <med-date-picker label="转归时间" v-model="form.outcomeTime" type="datetime" formatter="YYYY-MM-DD HH:mm" v-clear required :rules="[{ required: true, message: '请填写转归时间' }]" :disabled="readonly" @confirm="(val) => val ? $emit('validateTimeField') : ''" />
            <med-text-field label="具体去向" v-model="form.specialTo" v-clear :disabled="readonly" />
          </div>
        </div>
        <med-text-field label="病人去向情况备注" v-model="form.turnResultRemark" :disabled="readonly" />
      </div>
      <div v-if="form.turnResult === '02'">
        <div class="task-part-title">
          <span class="solid" />
          <span>诊断符合情况</span>
        </div>
        <med-text-field label="入院诊断" placeholder="自动同步" v-model="form.diagnosis" :disabled="readonly" readonly maxlength="100" />
        <med-text-field label="出院诊断" v-model="form.outhospitalDiagnosis" :disabled="readonly" maxlength="100" />
        <med-radio-button-field label="入院诊断是否与出院诊断符合" v-model="form.isDiagnosisConform" :select-options="WHETHER" :disabled="readonly" />
        <div class="task-part-title">
          <span class="solid" />
          <span>抢救情况</span>
        </div>
        <med-radio-select-field label="抢救结果" v-model="form.rescueResult" :select-options="RESCUE_RESULT_0001" :disabled="readonly" />
        <med-number-field label="手术次数" v-model="form.surgers" unit="次" :disabled="readonly" v-int="{ min: 0, max: 20 }" />
        <med-number-field label="住院费用" v-model="form.allCost" unit="元" :disabled="readonly" />
      </div>
    </van-form>
    <AssociatedPatients v-model="isShowPatientList" :isShow="isShowPatientList" tabSign="po" @close="isShowPatientList = false;" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import dictionariesMixin from '@mixins/dictionariesMixin'
export default {
  name: 'patientOutcome',
  components: {
    AssociatedPatients: () => import('./components/AssociatedPatients.vue')
  },
  inject: ['readonly', 'isEmId'],
  directives: {
    clear: {
      // 卸载组件时自动清除v-model值
      unbind: (...arg) => arg[2]?.data?.model?.callback(void 0)
    }
  },
  mixins: [dictionariesMixin],
  data() {
    return {
      isShowPatientList: false,
      form: {
        icuRecordList: []
      },
      patientDestinations: [],
      cleanValue: ['leaveEmTime', 'outphospitalTime', 'shiftTime', 'observingTime', 'outcomeTime']
    }
  },
  activated() {
    this.detail()
  },
  mounted() {
    this.detail()
  },
  computed: {
    ...mapGetters(['receiveDept', 'registId', 'arrivalTime', 'admittingDiagnosis', 'binding'])
  },
  methods: {
    changeTurnResult() {
      this.cleanValue.forEach(el => {
        this.$set(this.form, el, '')
      })
    },
    computICU(val) {
      // 计算ICU住院时间
      if (this.form.icuRecordList.length > 0) {
        const ICUList = this.form.icuRecordList.filter(
          el => el.arriveIcuTime && el.leaveIcuTime
        )
        if (ICUList.length > 0) {
          let stayIcuDays = 0
          ICUList.forEach(el => {
            if (el.arriveIcuTime && el.leaveIcuTime) {
              stayIcuDays += this.computedTime(
                el.leaveIcuTime,
                el.arriveIcuTime,
                'dd'
              )
            }
          })
          if (stayIcuDays > 0) {
            this.$set(this.form, 'stayIcuDays', stayIcuDays.toFixed(2))
          }
        } else {
          this.$set(this.form, 'stayIcuDays', '')
        }
      }
    },
    validate() {
      // 校验表单
      return this.$refs.formData.validate()
    },
    IcuButton(val) {
      if (val === '0') {
        this.form.icuRecordList = []
      } else {
        if (this.form.icuRecordList.length < 1) {
          this.form.icuRecordList.push({
            arriveIcuTime: '',
            leaveIcuTime: '',
            registId: this.form.registId
          })
        }
      }
    },
    deleteICU(id, index) {
      // 删除 ICU
      this.$api.deleteICUById(id).then(res => {
        if (res.code === '000000') {
          this.form.icuRecordList.splice(index, 1)
        }
      })
    },
    addICU() {
      // 添加 ICU
      if (!this.form.icuRecordList) {
        this.$set(this.form, 'icuRecordList', [])
      }
      this.form.icuRecordList.push({
        arriveIcuTime: '',
        leaveIcuTime: '',
        registId: this.registId
      })
    },
    savePatientOutcome() {
      // 保存患者转归
      this.$api.updatePatient({ outcome: this.form })
    },
    detail() {
      this.$api
        .detail({
          registId: this.registId,
          types: ['patientOutCome']
        })
        .then(res => {
          if (res.code === '000000') {
            if (!res.body.outcome.icuRecordList) {
              res.body.outcome.icuRecordList = []
            }
            this.form = res.body.outcome
          }
        })
    }
  },
  watch: {
    binding() {
      // 监听绑定
      this.detail()
    },
    admittingDiagnosis(val) {
      // 监听入院诊断
      this.$set(this.form, 'diagnosis', val)
    },
    arrivalTime(val) {
      // 监听到达时间
      switch (this.receiveDept) {
        case '01': // 急诊
          this.$set(this.form, 'emStayMinutes', this.computedTime(this.form.leaveEmTime, val, 'mm'))
          break
        case '02': // 门诊
          this.$set(this.form, 'outpatientStayMinutes', this.computedTime(this.form.outphospitalTime, val, 'mm'))
          break
        default:
          break
      }
    },
    'form.leaveEmTime'() {
      // 计算急诊停留时间 (分钟)
      this.form.emStayMinutes = this.computedTime(
        this.form.leaveEmTime,
        this.arrivalTime,
        'mm'
      )
    },
    'form.outphospitalTime'() {
      // 计算门诊停留时间 (分钟)
      this.form.outpatientStayMinutes = this.computedTime(
        this.form.outphospitalTime,
        this.arrivalTime,
        'mm'
      )
    },
    readonly: {
      immediate: true,
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.$refs.patient_outcome_body.style.setProperty(
              '--requiredColor',
              'rgb(189,189,189)'
            )
          })
        } else {
          this.$nextTick(() => {
            this.$refs.patient_outcome_body.style.setProperty(
              '--requiredColor',
              'red'
            )
          })
        }
      }
    },
    receiveDept: {
      immediate: true,
      handler(val) {
        // 病人去向
        const result = this.TURN_0001
        if (val === '02') {
          result[0].label = '离院'
          result[4].label = '留观'
        } else {
          result[0].label = '急诊离院'
          result[4].label = '急诊留观'
        }
        this.patientDestinations = result
      }
    },
    'form.icuRecordList': {
      // 监听到达ICU时间列表,计算ICU住院天数
      handler(val) {
        if (val && val.length > 0) {
          let stayIcuDays = 0
          val.forEach(el => {
            if (el.arriveIcuTime && el.leaveIcuTime) {
              stayIcuDays += this.computedTime(
                el.leaveIcuTime,
                el.arriveIcuTime,
                'dd'
              )
            }
          })
          if (stayIcuDays > 0) {
            this.$set(this.form, 'stayIcuDays', stayIcuDays.toFixed(2))
          }
        }
      },
      deep: true
    },
    'form.inphospitalTime'(val) {
      // 监听办理住院时间,计算住院天数 (天)
      this.$set(
        this.form,
        'outphospitalDays',
        val && this.form.endphospitalTime
          ? this.computedTime(this.form.endphospitalTime, val, 'dd').toFixed(2)
          : ''
      )
    },
    'form.endphospitalTime'(val) {
      // 监听结束住院时间,计算住院天数 (天)
      this.$set(
        this.form,
        'outphospitalDays',
        val && this.form.inphospitalTime
          ? this.computedTime(val, this.form.inphospitalTime, 'dd').toFixed(2)
          : ''
      )
    },
    form: {
      deep: true,
      handler(newVal, oldVal) {
        if (
          Object.getOwnPropertyNames(newVal).length ===
          Object.getOwnPropertyNames(oldVal).length
        ) {
          setTimeout(() => {
            this.savePatientOutcome()
          }, 1000)
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.patient-outcome-body {
  --requiredColor: red;
  width: 95%;
  margin: 0 auto;

  /deep/ .van-field--disabled .van-field__label {
    color: rgb(154, 154, 154);
  }

  /deep/ .van-field__control:disabled {
    -webkit-text-fill-color: rgb(154, 154, 154);
  }

  /deep/ .van-cell--required::before {
    color: var(--requiredColor);
  }

  /deep/ .van-cell-group {
    margin: 0.1rem auto;
    padding-bottom: 0.3rem;

    &>div {
      padding: 0rem 0.2rem 0rem 0.2rem;

      &>i {
        font-size: 0.45rem;
        margin-bottom: 0.3rem;
      }
    }
  }

  .time-ICU {
    flex: 8;
    padding-left: 0.4rem;
    display: inline-block;

    /deep/ .van-cell__title.van-field__label {
      margin-right: 0;
      max-width: 3rem;
      min-width: 3rem;
    }

    :first-child /deep/.med-hint-field-wrapper .med-hint-field--bottom::after {
      border-bottom: none;
    }

    :last-child /deep/.med-hint-field-wrapper .med-hint-field--bottom::after {
      right: -0.5rem;
    }
  }
}
</style>
