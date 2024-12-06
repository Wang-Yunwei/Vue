<template>
  <div class="piat-body" ref="piat">
    <van-form ref="formData" :show-error-message="false">
      <div>
        <div class="task-part-title">
          <span class="solid" />
          <span>接诊信息</span>
        </div>
        <div v-if="['03', '04', '05'].includes(visitType)">
          <med-date-picker label="发病时间" v-model="form.attackTime" type="datetime" formatter="YYYY-MM-DD HH:mm" v-clear :disabled="readonly" @confirm="(val) => val ? $emit('validateTimeField') : ''" />
          <med-text-field label="发病地址" v-model="form.address" maxlength="100" :disabled="readonly" />
          <med-radio-select-field v-if="visitType === '03'" label="自行来院方式" v-model="form.selfVisitType" :select-options="SELF_VISIT_0001" :disabled="readonly" />
          <med-date-picker label="到达医院时间" v-model="form.arriveHospitalTime" type="datetime" formatter="YYYY-MM-DD HH:mm" v-clear required :rules="[{ required: true, message: '请选择到达医院时间' }]" :disabled="readonly" @confirm="(val) => val ? $emit('validateTimeField') : ''" />
        </div>
        <van-field v-model="form.regNo" label="门诊号" right-icon="arrow" placeholder="门诊号" readonly :disabled="readonly || isEmId" @click="isShowPatientList = isEmId ? false : true" />
        <med-list-select-field label="MPDS症状" :placeholder="form.mpds ? ' ' : '请选择MPDS症状'" v-model="form.mpds" style="width: 100%;" :selectOptions="TRAUMA_0001" required :disabled="readonly" :rules="getValidationRules(form.mpds)" />
        <div v-if="form.mpds && (form.mpds.includes('08') || form.mpds.includes('11'))
      ">
          <van-field v-if="form.mpds.includes('08')" label="创伤(其他创伤)明细" placeholder="请填写创伤(其他创伤)明细" v-model="form.traumaDetail" :disabled="readonly" />
          <van-field v-if="form.mpds.includes('11')" label="其他非创伤症状明细" placeholder="请填写其他非创伤症状明细" v-model="form.traumaOther" :disabled="readonly" />
        </div>
        <med-radio-select-field label="病情判断" v-model="form.diagnosis" :select-options="DIAGNOSIS_0001" required :rules="[{ required: true, message: '请选择病情判断' }]" @change="$emit('diagnosisChange', form.diagnosis)" :disabled="readonly" />
        <med-radio-select-field label="接诊科室" v-model="form.receiveDept" :select-options="DEPT_0001" @change="
      setReceiveDept(form.receiveDept);
    transformMinutes = '';
    " required :rules="[{ required: true, message: '请填写接诊科室' }]" :disabled="readonly" />
        <med-text-field label="接诊医生" v-model="form.receiveDoctor" :select-options="DOCTOR_0001" :disabled="readonly" maxlength="36" />
        <med-text-field label="接诊护士" v-model="form.receiveNurse" :select-options="NURSE" :disabled="readonly" maxlength="36" />
        <div v-if="form.receiveDept === '01'">
          <med-date-picker label="到达急诊时间" v-model="form.arriveEdTime" type="datetime" formatter="YYYY-MM-DD HH:mm" required :rules="[{ required: true, message: '请填写到达急诊时间' }]" :disabled="readonly" clear />
          <med-radio-button-field label="到达急诊时是否已经死亡" v-model="form.arriveEdIsDead" :select-options="WHETHER" required :rules="[
      { required: true, message: '请选择到达急诊时是否已经死亡' }
    ]
      " :disabled="readonly || phfaDeath" clear />
        </div>
        <div v-if="form.receiveDept === '02'">
          <med-date-picker label="到达门诊时间" v-model="form.arriveOsTime" type="datetime" formatter="YYYY-MM-DD HH:mm" required :rules="[{ required: true, message: '请填写到达门诊时间' }]" :disabled="readonly" clear />
          <med-radio-button-field label="到达门诊时是否已经死亡" v-model="form.arriveOsIsDead" :select-options="WHETHER" required :rules="[
      { required: true, message: '请选择到达急诊时是否已经死亡' }
    ]
      " :disabled="readonly || phfaDeath" clear />
        </div>
        <med-date-picker v-if="(form.receiveDept === '01' && form.arriveEdIsDead === '1') ||
      (form.receiveDept === '02' && form.arriveOsIsDead === '1')
      " label="死亡时间" v-model="form.deadTime" type="datetime" formatter="YYYY-MM-DD HH:mm" v-clear :disabled="readonly" />
        <med-number-field v-if="['01', '02'].includes(visitType)" label="院前急救转运时间" :value="transformMinutes" unit="分钟" placeholder="自动计算" readonly :disabled="readonly" />
        <med-radio-button-field label="是否到达抢救室" v-model="form.isArriveEr" :select-options="WHETHER" :disabled="readonly" />
        <div v-if="form.isArriveEr === '1'">
          <med-date-picker label="到达抢救室时间" v-model="form.arriveErTime" type="datetime" formatter="YYYY-MM-DD HH:mm" v-clear :disabled="readonly" />
          <med-date-picker label="离开抢救室时间" v-model="form.leaveErTime" type="datetime" formatter="YYYY-MM-DD HH:mm" v-clear :disabled="readonly" />
        </div>
        <div v-if="isDie" style="font-size: 0.36rem;color: red;padding: 0.2rem 0 0.4rem 0.42rem;font-weight: normal;line-height: 30px;">
          此选择表示创伤诊疗结束,不再继续跟踪患者的救治情况！
        </div>
      </div>
      <div v-if="!isDie">
        <div class="task-part-title">
          <span class="solid" />
          <span>院内体征</span>
        </div>
        <med-number-field label="体温" v-model="form.sign.temperature" unit="℃" :disabled="readonly" v-float="{ scale: 1, min: 30, max: 47 }" />
        <med-number-field label="心率" v-model="form.sign.heartRate" unit="次/分" :disabled="readonly" v-int="{ min: 0, max: 300 }" />
        <med-number-field label="脉搏" v-model="form.sign.plus" unit="次/分" :disabled="readonly" v-int="{ min: 0, max: 300 }" />
        <med-number-field label="呼吸" v-model="form.sign.breath" unit="次/分" :disabled="readonly" v-int="{ min: 0, max: 50 }" />
        <med-bp-field label="血压" :sbp.sync="form.sign.sbp" :dbp.sync="form.sign.dbp" :disabled="readonly" v-int="{ min: 0, max: 300 }" />
        <med-number-field label="血氧" v-model="form.sign.spo" unit="%" :disabled="readonly" v-int="{ min: 0, max: 100 }" />
        <med-number-field label="血糖" v-model="form.sign.bloodglucose" unit="mmol/L" :disabled="readonly" v-float="{ scale: 2, min: 0, max: 100 }" />
      </div>
      <div v-if="!isDie">
        <div class="task-part-title">
          <span class="solid" />
          <span>院内预警联动</span>
        </div>
        <med-radio-button-field label="是否呼叫了创伤救治团队" v-model="form.isCall" :select-options="WHETHER" required :rules="[{ required: true, message: '请选择是否呼叫了创伤救治团队' }]" :disabled="readonly" />
        <div v-if="form.isCall === '1'">
          <med-date-picker label="创伤救治团队到达急诊科时间" v-model="form.treatmentArriveTime" type="datetime" formatter="YYYY-MM-DD HH:mm" required :rules="[{ required: true, message: '请填写创伤救治团队到达急诊科时间' }]" :disabled="readonly" v-clear @confirm="(val) => val ? $emit('validateTimeField') : ''" />
          <med-number-field label="急诊准备时间" :value="prepareMinutes" placeholder="自动计算" unit="分钟" readonly :disabled="readonly" v-clear />
        </div>
      </div>
    </van-form>
    <AssociatedPatients v-model="isShowPatientList" :isShow="isShowPatientList" tabSign="piat" @close="isShowPatientList = false;" />
  </div>
</template>
<script>
import * as types from '@/store/mutations-types'
import { mapMutations, mapGetters } from 'vuex'
import dictionariesMixin from '@mixins/dictionariesMixin'
export default {
  name: 'piat',
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
      transformMinutes: '', // 院前急救转运时间(分钟)
      isShowPatientList: false,
      form: {
        sign: {}
      }
    }
  },
  activated() {
    this.detail()
  },
  mounted() {
    this.detail()
  },
  computed: {
    ...mapGetters(['registId', 'leaveLocationTime', 'visitType', 'arriveHospitalConnect', 'binding', 'phfaDeath', 'phfaDeathTime']),
    isDie() {
      // 到达门诊或急诊是否已死亡
      let result = false
      if (this.phfaDeath) {
        result = true
      } else {
        if (this.form.receiveDept && (this.form.arriveEdIsDead || this.form.arriveOsIsDead)) {
          // 当接诊科室与到达急诊时是否已经死亡或到达门诊时是否已经死亡不为null时
          result = this.form.receiveDept === '01' ? this.form.arriveEdIsDead === '1' : this.form.arriveOsIsDead === '1'
        }
      }
      this.$emit('isDie', result)
      return result
    },

    // 急诊准备时间(分钟)
    prepareMinutes() {
      return this.form.treatmentArriveTime && this.form.arriveEdTime
        ? (this.$moment(this.form.treatmentArriveTime)
          .toDate()
          .getTime() -
          this.$moment(this.form.arriveEdTime)
            .toDate()
            .getTime()) /
        1000 /
        60
        : ''
    }
  },
  methods: {
    ...mapMutations([
      types.SET_RECEIVE_DEPT,
      types.SET_DIAGNOSIS,
      types.SET_ARRIVE_HOSPITAL_TIME,
      types.SET_ATTACK_TIME,
      types.SET_ARRIVAL_TIME
    ]),
    getValidationRules(val) {
      // MPDS校验
      if (!val && val < 1) {
        return [
          { required: true, message: '请选择MPDS症状' }
        ]
      }
    },
    computTransformMinutes(val) {
      // 计算院前急救运转时间
      if (val && this.leaveLocationTime) {
        this.transformMinutes = this.computedTime(
          val,
          this.leaveLocationTime,
          'mm'
        )
      } else {
        this.transformMinutes = ''
      }
    },
    validate() {
      // 校验表单数据
      return this.$refs.formData.validate()
    },
    setReceiveDept(val) {
      // 设置接诊科室
      this[types.SET_RECEIVE_DEPT](val)
      switch (val) {
        case '01': // 急诊
          this.$set(this.form, 'arriveOsTime', '') // 清空到达门诊时间
          break
        case '02': // 门诊
          this.$set(this.form, 'arriveEdTime', '') // 清空到达急诊时间
          break
        default:
          break
      }
    },
    savePiat() {
      // 保存预检分诊
      this.$api.updatePatient({
        admission: this.form
      })
    },
    detail() {
      // 获取详情
      this.$api.detail({
        registId: this.registId,
        types: ['piat']
      }).then(res => {
        if (res.code === '000000') {
          if (!res.body.admission.sign) {
            res.body.admission.sign = {}
          }
          this.form = res.body.admission
          // 接诊科室
          this.setReceiveDept(this.form.receiveDept)
        }
      })
    }
  },
  watch: {
    phfaDeath(val) {
      // 监听院前死亡
      if (val) {
        this.$set(this.form, 'arriveEdIsDead', '1')
        this.$set(this.form, 'arriveOsIsDead', '1')
      }
    },
    phfaDeathTime(val) {
      // 监听院前死亡时间
      this.$set(this.form, 'deadTime', val)
    },
    binding() {
      // 监听绑定
      this.detail()
    },

    arriveHospitalConnect(val) {
      // 监听院前急救-到院交接
      Object.keys(val).forEach(key => {
        this.$set(this.form, key, val[key])
      })
    },
    visitType(val) {
      // 监听来院方式
      if (!['01', '02'].includes(val)) {
        // 监听来院方式
        this[types.SET_ATTACK_TIME](this.form.attackTime) // 发病时间
        this[types.SET_ARRIVE_HOSPITAL_TIME](this.form.arriveHospitalTime) // 到院时间
      }
    },
    'form.arriveHospitalTime'(val) {
      // 监听到院时间
      if (!['01', '02'].includes(this.visitType)) {
        this[types.SET_ARRIVE_HOSPITAL_TIME](val) // 到院时间
      }
    },
    'form.attackTime'(val) {
      // 监听发病时间
      if (!['01', '02'].includes(this.visitType)) {
        this[types.SET_ATTACK_TIME](val) // 发病时间
      }
    },
    leaveLocationTime(val) {
      // 监听院前急救中的离开现场时间,计算院前急救运转时间
      if (this.form.arriveEdTime || this.form.arriveOsTime) {
        if (this.form.receiveDept === '01') {
          // 到达急诊时间 - 离开现场时间
          this.transformMinutes = this.computedTime(this.form.arriveEdTime, val, 'mm')
        } else {
          // 到达门诊时间 - 离开现场时间
          this.transformMinutes = this.computedTime(this.form.arriveOsTime, val, 'mm')
        }
      } else {
        this.transformMinutes = ''
      }
    },
    'form.arriveEdTime'(val) {
      // 监听到达急诊时间,计算院前急救转运时间 (分钟)
      if (this.form.receiveDept === '01') {
        this.transformMinutes = this.computedTime(val, this.leaveLocationTime, 'mm')
        this[types.SET_ARRIVAL_TIME](val)
      }
    },
    'form.arriveOsTime'(val) {
      // 监听到达门诊时间,计算院前急救转运时间 (分钟)
      if (this.form.receiveDept === '02') {
        this.transformMinutes = this.computedTime(val, this.leaveLocationTime, 'mm')
        this[types.SET_ARRIVAL_TIME](val)
      }
    },
    readonly: {
      immediate: true,
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.$refs.piat.style.setProperty(
              '--requiredColor',
              'rgb(189,189,189)'
            )
          })
        } else {
          this.$nextTick(() => {
            this.$refs.piat.style.setProperty('--requiredColor', 'red')
          })
        }
      }
    },
    form: {
      deep: true, // 深度监听
      handler(newVal, oldVal) {
        if (
          Object.getOwnPropertyNames(newVal).length ===
          Object.getOwnPropertyNames(oldVal).length
        ) {
          setTimeout(() => {
            this.savePiat()
          }, 1000)
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.piat-body {
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
}
</style>
