<template>
  <div class="phfa" ref="phfa">
    <van-form ref="formData" :show-error-message="false">
      <div>
        <div class="task-part-title">
          <span class="solid" />
          <span>院前接诊</span>
        </div>
        <van-field v-model="form.licensePlate" label="车牌号" right-icon="arrow" placeholder="请填写车牌号" readonly :disabled="readonly || isEmId" @click="isShowPatientList = isEmId ? false : true" />
        <med-date-picker label="发病时间" v-model="form.attackTime" type="datetime" formatter="YYYY-MM-DD HH:mm" required :rules="rules.attackTime" :disabled="readonly" @confirm="(val) => val ? $emit('validateTimeField') : ''" />
        <med-text-field label="发病地址" v-model="form.address" maxlength="100" :disabled="readonly" />
        <med-date-picker label="呼救时间" v-model="form.helpTime" type="datetime" formatter="YYYY-MM-DD HH:mm" required :rules="rules.helpTime" :disabled="readonly" @confirm="(val) => val ? $emit('validateTimeField') : ''" />
        <med-date-picker label="救护车出发时间" v-model="form.ambulanceLeaveTime" type="datetime" formatter="YYYY-MM-DD HH:mm" required :rules="rules.ambulanceLeaveTime" :disabled="readonly" />
        <med-date-picker label="到达现场时间" v-model="form.arriveLocationTime" type="datetime" formatter="YYYY-MM-DD HH:mm" required :rules="rules.arriveLocationTime" :disabled="readonly" @confirm="(val) => val ? $emit('validateTimeField') : ''" />
        <div v-if="visitType === '01'">
          <med-radio-select-field label="出车单位" v-model="form.ambulanceStation" :select-options="STATION_0001" :disabled="readonly" />
          <med-text-field label="跟车医生" v-model="form.admissionDoctor" maxlength="50" :selectOptions="DOCTOR_0001" required :rules="rules.admissionDoctor" :disabled="readonly" />
          <med-text-field label="跟车护士" v-model="form.admissionNurse" maxlength="50" :selectOptions="NURSE" required :rules="rules.admissionNurse" :disabled="readonly" />
        </div>
        <med-text-field v-if="visitType === '02'" label="转入医院名称" v-model="form.zcyyHospitalName" maxlength="36" :disabled="readonly" />
        <med-date-picker label="离开现场时间" v-model="form.leaveLocationTime" type="datetime" formatter="YYYY-MM-DD HH:mm" required :rules="rules.leaveLocationTime" :disabled="readonly" />
      </div>
      <div>
        <div class="task-part-title">
          <span class="solid" />
          <span>患者病史</span>
        </div>
        <med-text-field label="主诉" v-model="form.chiefComplaint" maxlength="60" :disabled="readonly" />
        <med-text-field label="现病史" v-model="form.presentHistory" maxlength="60" :disabled="readonly" />
        <van-field label="即往史" right-icon="arrow-down" :disabled="readonly">
          <template #input>
            <med-select placeholder="请填写既往史" v-model="form.pastHistory" :multiple="{ stringValue: true }" :options="PAST_0001" :disabled="readonly" />
          </template>
        </van-field>
        <med-text-field label="其它即往史" v-model="form.otherPastHistory" :disabled="readonly" v-if="form.pastHistory?.includes('09')" />
      </div>
      <div>
        <div class="task-part-title">
          <span class="solid" />
          <span>院前体征</span>
        </div>
        <med-number-field label="体温" v-model="form.sign.temperature" unit="℃" :disabled="readonly" v-float="{ scale: 1, min: 30, max: 47 }" />
        <med-number-field label="心率" v-model="form.sign.heartRate" unit="次/分" :disabled="readonly" v-int="{ min: 0, max: 300 }" />
        <med-number-field label="脉搏" v-model="form.sign.plus" unit="次/分" :disabled="readonly" v-int="{ min: 0, max: 300 }" />
        <med-number-field label="呼吸" v-model="form.sign.breath" unit="次/分" :disabled="readonly" v-int="{ min: 0, max: 50 }" />
        <med-bp-field label="血压" :sbp.sync="form.sign.sbp" :dbp.sync="form.sign.dbp" :disabled="readonly" />
        <med-number-field label="血氧" v-model="form.sign.spo" unit="%" :disabled="readonly" v-int="{ min: 0, max: 100 }" />
        <med-number-field label="血糖" v-model="form.sign.bloodglucose" unit="mmol/L" :disabled="readonly" v-float="{ scale: 2, min: 0, max: 100 }" />
      </div>
      <div>
        <div class="task-part-title">
          <span class="solid" />
          <span>院前体格检查</span>
        </div>
        <van-field label="体格检查" placeholder="点击右侧填写" v-model="form.isCheck" right-icon="arrow" readonly @click="isShowPe = true" :disabled="readonly" style="color:red" id="physical" />
        <PhysicalExamination v-model="isShowPe" :data="form" :isShowPe="isShowPe" @close="closePe" />
      </div>
      <div>
        <div class="task-part-title">
          <span class="solid" />
          <span>院前TI创伤评分</span>
        </div>
        <Score v-model="form.tiGrade" title="院前TI创伤评分" label="TI" />
        <div style="height: 0.1rem;border-bottom: 0.04rem solid #ebedf0;width: 91%;margin: 0 auto;"></div>
      </div>
      <div>
        <div class="task-part-title">
          <span class="solid" />
          <span>院前诊断</span>
        </div>
        <med-text-field label="院前诊断" v-model="form.diagnosis" maxlength="100" :disabled="readonly" />
      </div>
      <div>
        <div class="task-part-title">
          <span class="solid" />
          <span>院前处置</span>
        </div>
        <med-list-select-field label="院前抢救措施" placeholder="请填写院前抢救措施" v-model="form.emeregncyMeasures" style="width: 100%;" :selectOptions="PRE_MEASURE_0001" :disabled="readonly" />
        <med-text-field label="抢救措施说明" v-model="form.measuresInfo" maxlength="100" :disabled="readonly" />
        <med-list-select-field label="治疗药物" placeholder="请选择治疗药物" v-model="form.therapeutic" style="width: 100%;" :selectOptions="THERAPEUTIC_0001" :disabled="readonly" />
        <med-text-field label="其它治疗药物" v-model="form.otherTherapeutic" :disabled="readonly" v-if="form.therapeutic?.includes('9000')" />
        <med-radio-button-field label="是否心电图检查" v-model="form.isEcg" :select-options="WHETHER" :disabled="readonly" />
        <med-ecg-field v-if="form.isEcg === '1'" label="心电图" v-model="form.ecgField" :upload-url="ecgPrefixUrl" :upload-image="uploadImage" :deleteRecord="deleteRecord" :record-list="form.ecgList" :show-first="showFirstEcgTag" :update-record="saveEcg" :readonly="readonly" />
      </div>
      <div>
        <div class="task-part-title">
          <span class="solid" />
          <span>院前救治结果</span>
        </div>
        <med-radio-button-field label="是否死亡" v-model="form.isDeath" :select-options="WHETHER" required :rules="[{ required: true, message: '请选择是否死亡' }]" :disabled="readonly" />
        <med-date-picker v-if="form.isDeath === '1'" label="病人死亡时间" v-model="form.deathTime" type="datetime" formatter="YYYY-MM-DD HH:mm" :disabled="readonly" v-clear />
      </div>
      <div>
        <div class="task-part-title">
          <span class="solid" />
          <span>院前预警联动</span>
        </div>
        <med-radio-button-field label="是否预警医院" v-model="form.isWarning" :select-options="WHETHER" required :rules="[{ required: true, message: '请选择是否预警医院' }]" :disabled="readonly" />
        <med-date-picker v-if="form.isWarning === '1'" label="预警时间" v-model="form.warningTime" type="datetime" formatter="YYYY-MM-DD HH:mm" required :rules="[{ required: true, message: '请填写预警医院时间' }]" :disabled="readonly" v-clear />
      </div>
      <div>
        <div class="task-part-title">
          <span class="solid" />
          <span>到院交接</span>
        </div>
        <med-date-picker label="到达医院时间" v-model="form.arriveHospitalTime" type="datetime" formatter="YYYY-MM-DD HH:mm" required :rules="[{ required: true, message: '请选择到达医院时间' }]" :disabled="readonly" @confirm="(val) => val ? $emit('validateTimeField') : ''" />
        <med-radio-select-field label="接诊科室" v-model="form.receiveDept" :select-options="DEPT_0001" required :rules="[{ required: true, message: '请选择接诊科室' }]" :disabled="readonly" @change="arriveHospitalConnect" />
        <med-text-field label="接诊医生" v-model="form.receiveDoctor" :select-options="DOCTOR_0001" :disabled="readonly" maxlength="20" @confirm="arriveHospitalConnect" />
        <med-text-field label="接诊护士" v-model="form.receiveNurse" :select-options="NURSE" :disabled="readonly" maxlength="20" @confirm="arriveHospitalConnect" />
      </div>
    </van-form>
    <AssociatedPatients v-model="isShowPatientList" :isShow="isShowPatientList" tabSign="phfa" @close=" isShowPatientList = false;" />
  </div>
</template>
<script>
import * as types from '@/store/mutations-types'
import { mapGetters, mapMutations } from 'vuex'
import dictionariesMixin from '@mixins/dictionariesMixin'
export default {
  name: 'phfa',
  components: {
    PhysicalExamination: () => import('./components/PhysicalExamination.vue'),
    Score: () => import('./components/Score.vue'),
    AssociatedPatients: () => import('./components/AssociatedPatients.vue')
  },
  inject: ['readonly', 'isEmId'],
  mixins: [dictionariesMixin],
  directives: {
    clear: {
      // 卸载组件时自动清除v-model值
      unbind: (...arg) => arg[2]?.data?.model?.callback(void 0)
    }
  },
  data() {
    return {
      isShowPatientList: false,
      ecgPrefixUrl: window.GLOBAL_APP_API_BASE_URL, // 心电图上传接口
      showFirstEcgTag: true, // 是否显示首次心电图标记
      recordList: [], // 心电图列表
      isShowPe: false,
      ecgFile: {},
      form: {
        sign: {} // 院前体征
      },
      rules: {
        attackTime: [{ required: true, message: '请填写发病时间！' }],
        helpTime: [{ required: true, message: '请填写呼救时间！' }],
        ambulanceLeaveTime: [
          { required: true, message: '请填写救护车出发时间！' }
        ],
        arriveLocationTime: [
          { required: true, message: '请填写到达现场时间！' }
        ],
        admissionDoctor: [
          { required: true, message: '请填写或选择跟车医生！' }
        ],
        admissionNurse: [{ required: true, message: '请填写或选择跟车护士！' }],
        leaveLocationTime: [{ required: true, message: '请填写离开现场时间！' }]
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
    ...mapGetters(['registId', 'visitType', 'binding'])
  },
  methods: {
    ...mapMutations([
      types.SET_LEAVE_LOCATION_TIME,
      types.SET_ARRIVE_HOSPITAL_TIME,
      types.SET_ATTACK_TIME,
      types.SET_ARRIVE_HOSPITAL_CONNECT,
      types.SET_PHFA_DEATH,
      types.SET_PHFA_DEATH_TIME
    ]),
    arriveHospitalConnect() {
      // 到院交接
      this[types.SET_ARRIVE_HOSPITAL_CONNECT]({
        receiveDept: this.form.receiveDept, // 急救科室
        receiveDoctor: this.form.receiveDoctor, // 接诊医生
        receiveNurse: this.form.receiveNurse // 接诊护士
      })
    },
    validate() {
      // 提交校验
      return this.$refs.formData.validate()
    },
    async uploadImage(formData) {
      const file = formData.get('file')
      const res = await this.$api.uploadFile(formData)
      if (res.code === '000000') {
        this.$set(this.ecgFile, 'attachName', file.name)
        this.$set(
          this.ecgFile,
          'attachPath',
          window.GLOBAL_APP_API_BASE_URL + res.body.filePath
        )
        this.$set(this.ecgFile, 'attachType', file.type)
        this.$set(
          this.ecgFile,
          'thumbAttachPath',
          window.GLOBAL_APP_API_BASE_URL + res.body.thumbFilePath
        )
      }
      return res.body
    },
    deleteRecord(val) {
      // 删除心电图记录
      this.$api.deleteEcgById(val.id).then(res => {
        if (res.code === '000000') {
          var index = this.form.ecgList.findIndex(m => m.id === val.id)
          this.form.ecgList.splice(index, 1)
        }
      })
    },
    saveEcg(val) {
      // 保存心电图记录
      this.$api
        .addEcg({
          ...val,
          registId: this.form.registId, // 登记号
          ecgFile: this.ecgFile
        })
        .then(async res => {
          if (res.code === '000000') {
            await this.detail()
            if (val.checkTime) {
              this.$emit('validateTimeField', { label: 'phfa', value: 'checkTime' })
            }
          }
        })
    },
    savePhfa() {
      // 保存院前急救
      this.$api.updatePatient({ prehospital: this.form })
    },
    closePe(msg) {
      // 关闭体格检查
      this.isShowPe = false
      this.physicalExamination(msg)
      this.form = {
        ...this.form,
        ...msg
      }
      this.$api.updatePatient({ prehospital: this.form })
    },
    physicalExamination(obj) {
      // 体格检查
      if (obj.pupilResponse && obj.lightReflection && obj.consciousness && obj.airway && obj.cycle && obj.heartRate && obj.chest && obj.belly && obj.borborygmus && obj.muscular && obj.fracture && obj.checkOther) {
        obj.isCheck = '已完成'
        this.$refs.phfa.style.setProperty('--physical', 'green')
      } else if (obj.pupilResponse || obj.lightReflection || obj.consciousness || obj.airway || obj.cycle || obj.heartRate || obj.chest || obj.belly || obj.borborygmus || obj.muscular || obj.fracture || obj.checkOther) {
        obj.isCheck = '部分填写'
        this.$refs.phfa.style.setProperty('--physical', 'orange')
      } else {
        obj.isCheck = ''
      }
    },
    async detail() {
      await this.$api
        .detail({
          registId: this.registId,
          types: ['phfa']
        })
        .then(res => {
          if (res.code === '000000') {
            // 体格检查
            this.physicalExamination(res.body.prehospital)
            // 院前体征
            if (!res.body.prehospital.sign) {
              res.body.prehospital.sign = {}
            }
            this.form = res.body.prehospital
          }
        })
    }
  },
  watch: {
    'form.isDeath'(val) {
      // 监听是否死亡
      this[types.SET_PHFA_DEATH](val === '1')
    },
    'form.deathTime'(val) {
      // 监听死亡时间
      if (this.form.isDeath === '1') {
        this[types.SET_PHFA_DEATH_TIME](val)
      }
    },
    binding() {
      // 监听绑定
      this.detail()
    },
    'form.arriveHospitalTime'(val) {
      // 监听到院时间
      if (['01', '02'].includes(this.visitType)) {
        this[types.SET_ARRIVE_HOSPITAL_TIME](val)
      }
    },
    'form.attackTime'(val) {
      // 监听发病时间
      if (['01', '02'].includes(this.visitType)) {
        this[types.SET_ATTACK_TIME](val)
      }
    },
    readonly: {
      immediate: true,
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.$refs.phfa.style.setProperty(
              '--requiredColor',
              'rgb(189,189,189)'
            )
          })
        } else {
          this.$nextTick(() => {
            this.$refs.phfa.style.setProperty('--requiredColor', 'red')
          })
        }
      }
    },
    'form.leaveLocationTime'(val) {
      this[types.SET_LEAVE_LOCATION_TIME](val)
    },
    form: {
      deep: true,
      handler(newVal, oldVal) {
        if (
          Object.getOwnPropertyNames(newVal).length ===
          Object.getOwnPropertyNames(oldVal).length
        ) {
          this.savePhfa()
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.phfa {
  --requiredColor: red;
  --physical: orange;
  width: 95%;
  margin: 0 auto;

  /deep/ #physical {
    color: var(--physical);
  }

  /deep/ .van-field--disabled .van-field__label {
    color: rgb(154, 154, 154);
  }

  /deep/ .van-field__control:disabled {
    -webkit-text-fill-color: rgb(154, 154, 154);
  }

  /deep/ .van-icon.van-icon-delete-o {
    color: var(--requiredColor) !important;
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

  .score {
    width: 92%;
    margin: 0 auto;
    padding-bottom: 0.3rem;
    border-bottom: 2px solid rgb(239, 239, 239);

    .score-head {
      height: 0.7rem;
      padding: 0.2rem 0 0 0;
      font-size: 0.4rem;
      display: flex;

      .score-title {
        flex: 3;
        height: 3rem;
        color: #646566;
      }

      .score-button {
        background-color: rgb(47, 89, 246);
        color: white;
        border: 2px solid #2f59f6;
        margin: 0.1rem 0 0 0.1rem;
        border-radius: 1rem;
        padding: 3px 0.2rem 0 0.2rem;
      }
    }

    .score-card {
      width: 98%;
      box-shadow: 0px 5px 10px #a6a6a6;
      margin: 0.3rem auto;
      border-radius: 0.15rem;

      .key-font {
        flex: 1;
        color: #aaa;
      }

      .card-head {
        padding: 0.2rem;
        font-size: 0.38rem;
        display: flex;

        .card-head-left {
          width: 0.1rem;
          height: 0.4rem;
          border-radius: 1rem;
          background-color: rgb(47, 89, 246);
          margin-right: 0.1rem;
        }
      }

      .card-body {
        font-size: 0.4rem;

        >div {
          margin-left: 0.4rem;
          line-height: 0.7rem;
        }
      }
    }
  }
}
</style>
