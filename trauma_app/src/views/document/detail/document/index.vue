<template>
  <div>
    <div v-if="(!auth_phfa && !auth_piat && !auth_inspection && !auth_hdat && !auth_patientOutcome) || (!['01', '02'].includes(visitType) && auth_phfa && !auth_piat && !auth_inspection && !auth_hdat && !auth_patientOutcome)">
      <van-empty description="未授权或暂无填写数据" :image="require('@assets/image/empty.png')" />
    </div>
    <van-tabs v-else v-model="active" swipeable color="rgb(94,116,254)" :lazy-render="false" line-width="25px">
      <div v-if="isPickRead" style="background-color: aqua;">
        <van-tab v-for="(item, index) in pickReadTabs" :title="item.name" :key="index">
          <div class="scroll-box-b">
            <div style="margin-top: 0.18rem;background-color: rgb(255,255,255);height: 100vh;">
              <component :is="item.value" />
            </div>
          </div>
        </van-tab>
      </div>
      <div v-else>
        <van-tab title="院前急救" v-if="['01', '02'].includes(visitType) && auth_phfa">
          <div class="scroll-box-a">
            <phfa ref="phfa" @validateTimeField="validateTimeField" />
          </div>
        </van-tab>
        <van-tab title="预检分诊" v-if="auth_piat">
          <div class="scroll-box-a">
            <piat ref="piat" @isDie="(val) => isDieVal = val" @diagnosisChange="(val) => $emit('diagnosisChange', val)" @validateTimeField="validateTimeField" />
          </div>
        </van-tab>
        <van-tab title="检验检查" v-if="!isDieVal && auth_inspection">
          <div class="scroll-box-a">
            <inspection ref="inspection" @validateTimeField="validateTimeField" />
          </div>
        </van-tab>
        <van-tab title="院内诊疗" v-if="!isDieVal && auth_hdat">
          <div class="scroll-box-a">
            <hdat ref="hdat" @validateTimeField="validateTimeField" />
          </div>
        </van-tab>
        <van-tab title="患者转归" v-if="!isDieVal && auth_patientOutcome">
          <div class="scroll-box-a">
            <patientOutcome ref="patientOutcome" @validateTimeField="validateTimeField" />
          </div>
        </van-tab>
      </div>
    </van-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { phfa, piat, inspection, hdat, patientOutcome } from './tabs/index'
import {
  phfaPickRead,
  piatPickRead,
  checkPickRead,
  inspectionPickRead,
  medications
} from './pick-read/index'
export default {
  name: 'detailsPage',
  components: {
    phfa,
    piat,
    inspection,
    hdat,
    patientOutcome,
    phfaPickRead,
    piatPickRead,
    checkPickRead,
    inspectionPickRead,
    medications
  },
  inject: ['isSubmit'],
  data() {
    return {
      isDieVal: false,
      verifyParamList: [],
      active: 0,
      validateTimeMessage: [] // 校验时间字段顺序
    }
  },
  computed: {
    ...mapGetters(['visitType', 'loginUserInfo', 'isPickRead', 'arriveHospitalTime']),
    auth_phfa() {
      // 权限控制 - 病历编辑 - 院前急救 sign = trauma-mr-firstaid
      return (
        this.loginUserInfo?.resources?.filter(
          el => el.sign === 'trauma-mr-firstaid'
        ).length > 0
      )
    },
    auth_piat() {
      // 权限控制 - 病历编辑 - 预检分诊 sign = trauma-mr-triage
      return (
        this.loginUserInfo?.resources?.filter(
          el => el.sign === 'trauma-mr-triage'
        ).length > 0
      )
    },
    auth_inspection() {
      // 权限控制 - 病历编辑 - 检验检查 sign = trauma-mr-inspection
      return (
        this.loginUserInfo?.resources?.filter(
          el => el.sign === 'trauma-mr-inspection'
        ).length > 0
      )
    },
    auth_hdat() {
      // 权限控制 - 病历编辑 - 院内诊疗 sign = trauma-mr-treatment
      return (
        this.loginUserInfo?.resources?.filter(
          el => el.sign === 'trauma-mr-treatment'
        ).length > 0
      )
    },
    auth_patientOutcome() {
      // 权限控制 - 病历编辑 - 患者转归 sign = trauma-mr-outcome
      return (
        this.loginUserInfo?.resources?.filter(
          el => el.sign === 'trauma-mr-outcome'
        ).length > 0
      )
    },
    pickReadTabs() {
      let result = []
      if (this.visitType != '') {
        result = ['01', '02'].includes(this.visitType)
          ? [
            { name: '急救病历', value: 'phfaPickRead' },
            { name: '预检分诊', value: 'piatPickRead' },
            { name: '检查', value: 'checkPickRead' },
            { name: '检验', value: 'inspectionPickRead' },
            { name: '用药', value: 'medications' }
          ]
          : [
            { name: '预检分诊', value: 'piatPickRead' },
            { name: '检查', value: 'checkPickRead' },
            { name: '检验', value: 'inspectionPickRead' },
            { name: '用药', value: 'medications' }
          ]
      }
      return result
    },
    childrens() {
      let result = []
      if (['01', '02'].includes(this.visitType)) {
        result = this.isDieVal
          ? ['phfa', 'piat']
          : ['phfa', 'piat', 'inspection', 'hdat', 'patientOutcome']
      } else {
        result = this.isDieVal
          ? ['piat']
          : ['piat', 'inspection', 'hdat', 'patientOutcome']
      }
      return result
    }
  },
  methods: {
    timeField(val) {
      switch (val) {
        case 0:
          return [
            { label: '发病时间', key: 'attackTime' },
            { label: '呼救时间', key: 'helpTime' },
            { label: '到达现场时间', key: 'arriveLocationTime' },
            { label: '心电图完成时间', key: 'checkTime' },
            { label: '到达医院时间', key: 'arriveHospitalTime' },
            { label: '创伤救治团队到达急诊时间', key: 'treatmentArriveTime', ref: 'piat' }
          ]
        case 1:
          return [
            { label: '全身快速CT完成时间', key: 'bodyCtFinishTime', ref: 'inspection' },
            { label: '胸X片完成时间', key: 'chestXFinishTime', ref: 'inspection' },
            { label: '骨盆X片完成时间', key: 'pelvisXFinishTime', ref: 'inspection' },
            { label: 'FAST完成时间', key: 'fastFinishTime', ref: 'inspection' },
            { label: '其他X片类型完成时间', key: 'otherXFinishTime', ref: 'inspection' }
          ]
        case 2:
          return [
            { label: '到达医院时间', key: 'arriveHospitalTime' },
            { label: '提出放置时间', key: 'applyPutTime', ref: 'hdat' },
            { label: '成功放置时间', key: 'putFinishTime', ref: 'hdat' }
          ]
        case 3:
          return [
            { label: '到达医院时间', key: 'arriveHospitalTime' },
            { label: '申请输血时间', key: 'applyBloodTime', ref: 'hdat' },
            { label: '执行输血时间', key: 'executeBloodTime', ref: 'hdat' }
          ]
        case 4:
          return [
            { label: '到达医院时间', key: 'arriveHospitalTime' },
            { label: '提出建立时间', key: 'applyEstablishTime', ref: 'hdat' },
            { label: '成功建立时间', key: 'establishFinishTime', ref: 'hdat' }
          ]
        case 5:
          return [
            { label: '到达医院时间', key: 'arriveHospitalTime' },
            { label: '提出手术医嘱时间', key: 'surgerAdviceTime', ref: 'hdat' },
            { label: '到达手术室时间', key: 'arriveSurgerRoomTime', ref: 'hdat' },
            { label: '开始手术的时间', key: 'surgerStartTime', ref: 'hdat' },
            { label: '离开手术室时间', key: 'leaveSurgerRoomTime', ref: 'hdat' }
          ]
        case 6:
          return [
            { label: '到达医院时间', key: 'arriveHospitalTime' },
            { label: '到达ICU时间', key: 'arriveIcuTime', ref: 'patientOutcome' },
            { label: '离开ICU时间', key: 'leaveIcuTime', ref: 'patientOutcome' }
          ]
        case 7:
          return [
            { label: '到达医院时间', key: 'arriveHospitalTime' },
            { label: '办理住院时间', key: 'inphospitalTime', ref: 'patientOutcome' },
            { label: '结束住院时间', key: 'endphospitalTime', ref: 'patientOutcome' }
          ]
        case 8:
          return [
            { label: '急诊离院时间', key: 'leaveEmTime', ref: 'patientOutcome' },
            { label: '离院时间', key: 'outphospitalTime', ref: 'patientOutcome' },
            { label: '交接时间', key: 'shiftTime', ref: 'patientOutcome' },
            { label: '留观时间', key: 'observingTime', ref: 'patientOutcome' },
            { label: '转归时间', key: 'outcomeTime', ref: 'patientOutcome' }
          ]
        case 9:
          return [
            { label: '到达医院时间', key: 'arriveHospitalTime' },
            { label: '呼吸机开始使用时间', key: 'breathingStartTime', ref: 'hdat' },
            { label: '呼吸机结束使用时间', key: 'breathingEndTime', ref: 'hdat' }
          ]
        default:
          break
      }
    },
    validateTimeField() {
      // 校验时间字段顺序
      // 1.ref有值使用ref获取form实例,否则获取方法入参获取form实例
      const form = ['01', '02'].includes(this.visitType) ? this.$refs.phfa.form : this.$refs.piat.form
      // 2.处理心电图时间,获取心电图最小时间
      let ecgCheckTime = ''
      const ecgList = form.ecgList
      if (ecgList && ecgList.length > 0) {
        const ecg = ecgList.filter(el => el.checkTime).sort((a, b) => new Date(a.checkTime) - new Date(b.checkTime))
        if (ecg.length > 0) {
          ecgCheckTime = ecg[0].checkTime
        }
      }
      // 2.1 获取创伤救治团队到达急诊时间
      const treatmentArriveTime = this.$refs.piat.form.treatmentArriveTime
      // 2.2 获取检验检查实例,获取全身快速CT完成时间、胸X片完成时间、骨盆X片完成时间、FAST完成时间、其他X片类型完成时间
      const inspection = this.$refs.inspection.form
      const checkTimeField = this.timeField(1)
      checkTimeField.forEach(el => {
        const fieldKey = el.key
        if (inspection[fieldKey]) {
          el.value = inspection[fieldKey]
        }
      })
      // 2.3 获取院内诊疗实例
      const hdat = this.$refs.hdat.form
      // 2.4 获取患者转归实例,获取急诊离院时间、离院时间、交接时间、留观时间、转归时间
      const patientOutcome = this.$refs.patientOutcome.form
      const outTOTimeField = this.timeField(8)
      outTOTimeField.forEach(el => {
        const fieldKey = el.key
        if (patientOutcome[fieldKey]) {
          el.value = patientOutcome[fieldKey]
        }
      })
      // 3.循环比较
      for (let i = 0; i < this.timeField(0).length - 1; i++) {
        let valA = form[this.timeField(0)[i].key]
        switch (i) {
          case 3:// 心电图完成时间
            valA = ecgCheckTime
            break
          case 5:// 创伤救治团队到达急诊时间
            valA = treatmentArriveTime
            break
          default:
            break
        }
        if (valA) {
          for (let j = i + 1; j < this.timeField(0).length; j++) {
            let valB = form[this.timeField(0)[j].key]
            switch (j) {
              case 3:// 心电图完成时间
                valB = ecgCheckTime
                break
              case 5:// 创伤救治团队到达急诊时间
                valB = treatmentArriveTime
                break
              default:
                break
            }
            if (valB) {
              if (this.$moment(valA).toDate().getTime() > this.$moment(valB).toDate().getTime()) {
                this.$notify({
                  type: 'warning',
                  message: `${this.timeField(0)[i].label}应早于${this.timeField(0)[j].label}`
                })
                this.$emit('initSub')
                return false
              }
            }
            // 到达医院时间
            if (i === 4 && j === 5) {
              // 检验检查时间
              for (const el of checkTimeField) {
                if (el.value) {
                  if (this.$moment(valA).toDate().getTime() > this.$moment(el.value).toDate().getTime()) {
                    this.$notify({
                      type: 'warning',
                      message: `${this.timeField(0)[i].label}应早于${el.label}`
                    })
                    this.$emit('initSub')
                    return false
                  }
                }
              }
              // 胸腔闭式引流、输血、建立人工气道、紧急手术
              for (let c = 2; c < 6; c++) {
                for (let a = 0; a < this.timeField(c).length - 1; a++) {
                  const valC = a === 0 ? valA : hdat[this.timeField(c)[a].key]
                  if (valC) {
                    for (let b = a + 1; b < this.timeField(c).length; b++) {
                      const valD = hdat[this.timeField(c)[b].key]
                      if (valD) {
                        if (this.$moment(valC).toDate().getTime() > this.$moment(valD).toDate().getTime()) {
                          this.$notify({
                            type: 'warning',
                            message: `${this.timeField(c)[a].label}应早于${this.timeField(c)[b].label}`
                          })
                          this.$emit('initSub')
                          return false
                        }
                      }
                    }
                  }
                }
              }
              // 呼吸机开始使用时间大于结束时间
              const ventilatorDuration = this.timeField(9)
              for (let a = 0; a < ventilatorDuration.length - 1; a++) {
                const valC = a === 0 ? valA : hdat[ventilatorDuration[a].key]
                if (valC) {
                  for (let b = a + 1; b < ventilatorDuration.length; b++) {
                    const valD = hdat[ventilatorDuration[b].key]
                    if (valD && this.$moment(valC).toDate().getTime() > this.$moment(valD).toDate().getTime()) {
                      this.$notify({
                        type: 'warning',
                        message: `${ventilatorDuration[a].label}应早于${ventilatorDuration[b].label}`
                      })
                      this.$emit('initSub')
                      return false
                    }
                  }
                }
              }
              // 到达ICU
              const icuList = patientOutcome.icuRecordList
              if (icuList && icuList.length > 0) {
                for (let a = 0; a < icuList.length; a++) {
                  // 到达医院时间小于到达ICU时间
                  if (icuList[a].arriveIcuTime && (this.$moment(valA).toDate().getTime() > this.$moment(icuList[a].arriveIcuTime).toDate().getTime())) {
                    this.$notify({
                      type: 'warning',
                      message: `到达医院时间应早于第${a + 1}次到达ICU时间`
                    })
                    this.$emit('initSub')
                    return false
                  }
                  // 到达医院时间小于离开ICU时间
                  if (icuList[a].leaveIcuTime && (this.$moment(valA).toDate().getTime() > this.$moment(icuList[a].leaveIcuTime).toDate().getTime())) {
                    this.$notify({
                      type: 'warning',
                      message: `到达医院时间应早于第${a + 1}次离开ICU时间`
                    })
                    this.$emit('initSub')
                    return false
                  }
                  // 到达ICU时间小于离开ICU时间
                  if ((icuList[a].arriveIcuTime && icuList[a].leaveIcuTime) && (this.$moment(icuList[a].arriveIcuTime).toDate().getTime() > this.$moment(icuList[a].leaveIcuTime).toDate().getTime())) {
                    this.$notify({
                      type: 'warning',
                      message: `第${a + 1}次到达ICU时间应早于第${a + 1}次离开ICU时间`
                    })
                    this.$emit('initSub')
                    return false
                  }
                }
                // 第一次ICU时间小于第二次ICU时间
                for (let a = 0; a < icuList.length - 1; a++) {
                  const leaveIcuTimeA = icuList[a].leaveIcuTime
                  if (leaveIcuTimeA) {
                    for (let b = a + 1; b < icuList.length; b++) {
                      const arriveIcuTimeB = icuList[b].arriveIcuTime
                      if (arriveIcuTimeB && (this.$moment(leaveIcuTimeA).toDate().getTime() > this.$moment(arriveIcuTimeB).toDate().getTime())) {
                        this.$notify({
                          type: 'warning',
                          message: `第${a + 1}次离开ICU时间应早于第${b + 1}次到达ICU时间`
                        })
                        this.$emit('initSub')
                        return false
                      }
                    }
                  }
                }
              }
              // 住院
              const inHospitalList = this.timeField(7)
              for (let a = 0; a < inHospitalList.length - 1; a++) {
                const valC = a === 0 ? valA : patientOutcome[inHospitalList[a].key]
                if (valC) {
                  for (let b = 0; b < inHospitalList.length; b++) {
                    const valD = patientOutcome[inHospitalList[b].key]
                    if (valD && this.$moment(valC).toDate().getTime() > this.$moment(valD).toDate().getTime()) {
                      this.$notify({
                        type: 'warning',
                        message: `${inHospitalList[a].label}应早于${inHospitalList[b].label}`
                      })
                      this.$emit('initSub')
                      return false
                    }
                  }
                }
              }
              // 急诊离院时间/离院时间/交接时间/留观时间/转归时间
              for (const el of outTOTimeField) {
                if (el.value) {
                  if (this.$moment(valA).toDate().getTime() > this.$moment(el.value).toDate().getTime()) {
                    this.$notify({
                      type: 'warning',
                      message: `${this.timeField(0)[i].label}应早于${el.label}`
                    })
                    this.$emit('initSub')
                    return false
                  }
                }
              }
            }
          }
        } else {
          // 如果空值跳过
          continue
        }
      }
      return true
    }
  },
  watch: {
    '$route.path'(val) {
      if (/\/document\/list/.test(val)) {
        this.active = 0
      }
    },
    visitType() {
      this.active = 0
    },
    isSubmit(val) {
      // 提交表单验证
      if (this.validateTimeField()) {
        if (val) {
          this.$nextTick(() => {
            if (this.childrens.length > 0) {
              let countA = 0
              let countB = 0
              this.childrens.forEach(el => {
                if (this.$refs[el].validate) {
                  this.$refs[el]
                    .validate()
                    .then(() => {
                      let result = false // 参数校验是否通过默认: 否
                      countA = ++countA
                      if (countA === this.childrens.length) {
                        const pia = this.$refs.piat
                        // 判断到达门诊或急诊已经死亡
                        if (this.isDieVal) {
                          if (pia.form.regNo) {
                            result = true
                          } else {
                            this.$notify({
                              type: 'warning',
                              message: '门诊号不能为空!'
                            })
                            this.$emit('initSub')
                          }
                        } else {
                          const ti = this.$refs.inspection.$refs.ti
                          if (!ti.formCard.gradeTime) {
                            this.$notify({
                              type: 'warning',
                              message: '请选择院内TI创伤评分'
                            })
                            this.$emit('initSub')
                            if (
                              this.active !== this.childrens.indexOf('inspection')
                            ) {
                              this.active = this.childrens.indexOf('inspection')
                            }
                            return
                          }
                          const gcs = this.$refs.inspection.$refs.gcs
                          if (!gcs.formCard.gradeTime) {
                            this.$notify({
                              type: 'warning',
                              message: '请选择GCS评分'
                            })
                            this.$emit('initSub')
                            if (
                              this.active !== this.childrens.indexOf('inspection')
                            ) {
                              this.active = this.childrens.indexOf('inspection')
                            }
                            return
                          }
                          const issAis = this.$refs.hdat.$refs.issAis
                          if (issAis.issGradeList.length < 1) {
                            this.$notify({
                              type: 'warning',
                              message: '请选择ISS-AIS评分'
                            })
                            this.$emit('initSub')
                            if (this.active !== this.childrens.indexOf('hdat')) {
                              this.active = this.childrens.indexOf('hdat')
                            }
                            return
                          }
                          const pat = this.$refs.patientOutcome
                          if (pia.form.regNo || pat.form.admissionNo) {
                            result = true
                          } else {
                            this.$notify({
                              type: 'warning',
                              message: '门诊号或住院号任一不为空!'
                            })
                            this.$emit('initSub')
                          }
                        }
                      }
                      if (result) {
                        this.$dialog.confirm({
                          title: '提示',
                          message: '确认提交审核吗？',
                          confirmButtonColor: 'rgb(94,116,254)'
                        }).then(() => {
                          this.$emit('verifyParam')
                        }).catch(() => {
                          this.$emit('initSub')
                        })
                      }
                    })
                    .catch(err => {
                      if (countB === 0) {
                        this.$emit('initSub')
                        countB += 1
                        if (this.active !== this.childrens.indexOf(el)) {
                          this.active = this.childrens.indexOf(el)
                        }
                        this.$notify({
                          type: 'warning',
                          message: err[0].message
                        })
                      }
                    })
                }
              })
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.scroll-box-a {
  height: calc(100vh - 8.5rem);
  overflow: auto;
}

.scroll-box-b {
  height: calc(101vh - 6rem);
  overflow: auto;
  background-color: rgb(242, 244, 245);
}
</style>
