<template>
  <div>
    <med-view-container title="基本信息" @return="backClick" scroll>
      <div class="scroll-view content-wrapper">
        <van-form ref="form">
          <van-cell-group>
            <med-text-field
              required
              v-model="details.gcBasic.name"
              label="姓名"
              :rules="[{ required: true, message: '必填' }]"
            />
            <med-radio-button-field
              required
              v-model="details.gcBasic.gender"
              label="性别"
              :rules="[{ required: true, message: '必填' }]"
              :selectOptions="dicData.genderOpts"
            >
            </med-radio-button-field>
            <med-radio-select-field
              label="来院方式"
              required
              v-model="details.gcBasic.comingType"
              :rules="[{ required: true, message: '必填' }]"
              :select-options="dic.comingTypeOpts"
              @change="onComingTypeChange"
            />
            <med-radio-select-field
              v-model="details.gcBasic.idcardType"
              required
              label="证件类型"
              :select-options="dic.idCardTypeOpts"
            />
            <med-idcard-field
              v-model="details.gcBasic.identificationCard"
              label="证件号"
              v-if="
                details.gcBasic.idcardType !== '' &&
                  details.gcBasic.idcardType !== this.cardType.unknown
              "
              :scan-type="[scanType.idCard]"
              :show-scan="details.gcBasic.idcardType === this.cardType.idCard"
              @scanned="onIdcardScanned"
              @change="onIdcardChanged"
              :rules="[{ validator: validIdcard, message: '证件号填写不正确' }]"
            />
            <med-date-picker
              v-model="details.gcBasic.birthday"
              label="出生日期"
              display-formatter="YYYY-MM-DD"
              type="date"
              clearable
            />
            <med-number-field
              required
              :rules="[{ required: true }]"
              v-int="{ min: 1, max: 140 }"
              v-model.number="details.gcBasic.age"
              label="年龄"
              unit="岁"
            />
            <med-radio-select-field
              v-model="details.gcBasic.nation"
              label="民族"
              :select-options="dicData.nationOpts"
            >
            </med-radio-select-field>
            <med-text-field
              v-model="details.gcBasic.ecName"
              label="紧急联系人"
            />
            <med-radio-select-field
              v-model="details.gcBasic.ecType"
              label="紧急联系人与患者关系"
              :select-options="dicData.urgentTypeOpts"
            >
            </med-radio-select-field>
            <med-text-field
              v-model="details.gcBasic.ecPhone"
              label="联系电话"
              maxlength="20"
              :rules="[
                {
                  validator: validPhone,
                  message: '联系电话填写不正确',
                  trigger: 'onChange'
                }
              ]"
            />
            <med-radio-select-field
              label="所属院区"
              readonly
              v-model="details.gcBasic.hospitalArea"
              :select-options="hospitalArea"
            />
          </van-cell-group>
        </van-form>
      </div>
    </med-view-container>
  </div>
</template>
<script>
import { yesno, scanType, cardType, emrStatus } from '@constant/commonConstant'
import { mapGetters, mapMutations } from 'vuex'
import * as types from '@store/mutations/mutations-types'
// import PatientList from '@views/gc/patientList'
import { removeIfEmpty } from '@utils/commonUtil'
import { Gc, GcTriage } from '@model/commonModel'
import loadingMixin from '@mixins/loadingMixin'
import idCardMixin from '@mixins/idCardMixin'
import { throttle } from 'lodash'
import dateUtil from '@utils/dateUtil'

const timeout = 2000

export default {
  name: 'BasicInfo',
  // components: { PatientList },
  mixins: [loadingMixin, idCardMixin],
  props: {
    dic: {
      type: Object,
      default: () => ({})
    },
    viewMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // showPatientList: false,
      nationOpts: [], // 民族
      genderList: [], // 性别
      urgentTypeOpts: [],
      registId: this.$route.query.registId,
      yesno,
      scanType,
      cardType,
      emrStatus,
      details: this.emptyData(),
      // 是否重新绑定过
      rebind: false
    }
  },
  // 钩子方法
  created() {
    this.init()
  },
  computed: {
    ...mapGetters(['dicData', 'hospitalArea', 'basicInfo'])
  },
  methods: {
    ...mapMutations(types),
    init() {
      // 根据患者id查询患者记录
      this.getBasicInfo()
    },
    onComingTypeChange(v) {
      if (!['1', '3'].includes(v) && this.$root.resetFirstAidTab) {
        this.$root.resetFirstAidTab()
      }
    },
    emptyData() {
      return {
        gcBasic: { ...Gc(), registId: this.$route.query.registId },
        gcTriage: { ...GcTriage(), registId: this.$route.query.registId }
      }
    },
    // 根据患者id查询患者记录
    getBasicInfo() {
      this.loading()
      this.$api.basicInfo
        .getBasicInfo(this.registId)
        .then(({ result }) => {
          this.$preventWatch(() => {
            if (result) {
              if (result.gcBasic) {
                this.details.gcBasic = {
                  ...this.emptyData().gcBasic,
                  ...result.gcBasic
                }
                if (this.details.gcBasic.identificationCard) {
                  this.onIdcardChanged(this.details.gcBasic.identificationCard)
                }
              }
              if (result.gcTriage) {
                this.details.gcTriage = {
                  ...this.emptyData().gcTriage,
                  ...result.gcTriage
                }
              }
            }
          })
        })
        .finally(() => {
          this.hideLoading()
        })
    },
    onIdcardScanned(data) {
      if (data) {
        this.details.gcBasic.identificationCard = data.identity
        this.details.gcBasic.name = data.name
        this.details.gcBasic.idcardType = this.cardType.idCard
        if (data.sex) {
          this.details.gcBasic.gender = data.sex === '男' ? '1' : '2'
        }
        if (data.birth) {
          this.details.gcBasic.birthday = this.toBirthday(data.birth)
          this.onBirthdayChanged(this.details.gcBasic.birthday)
        }
        if (!data.sex || !data.birth) this.onIdcardChanged(data.identity)
        if (data.nation) {
          if (data.nation === '汉') this.details.gcBasic.nation = '01'
        }
      }
    },
    onIdcardChanged(val) {
      if (this.details.gcBasic && val) {
        const birthday = this.getBirthday(val)
        if (birthday && this.$moment(birthday).isValid()) {
          this.details.gcBasic.birthday = birthday
          this.details.gcBasic.age = this.calcAge(birthday)
        }
        const sex = this.getSex(val)
        if (sex) this.details.gcBasic.gender = sex
      }
    },
    onBirthdayChanged(time) {
      this.details.gcBasic.age = this.calcAge(this.$moment(time))
    },
    /**
     * 表单验证
     * @param name
     * @returns {Promise<unknown>}
     */
    validate(name) {
      return new Promise((resolve, reject) => {
        this.$refs.form
          .validate()
          .then(r => resolve(r))
          .catch(e => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({ tabName: name, errors: e })
          })
      })
    },
    saveTriageInfo: throttle(
      function() {
        const req = { ...this.details.gcTriage }
        this.$api.triage.saveForBasicInfo(req).then(res => {
          if (res.status === 200) {
            this.$notify({ type: 'success', message: '保存成功' })
            this.$emit('saved')
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
      },
      timeout,
      { leading: false, trailing: true }
    ),
    // 保存基本信息
    insertBasicInformation: throttle(
      function() {
        // 手工创建
        this.details.gcBasic.cometype = '1'
        const req = { ...this.details.gcBasic }
        this.$api.basicInfo.insertBasicInformation(req).then(res => {
          if (res.status === 200) {
            this.$notify({ type: 'success', message: '保存成功' })
            this.$emit('saved')
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
      },
      timeout,
      { leading: false, trailing: true }
    ),
    /**
     * 打开患者列表
     */
    // openPatientList() {
    //   this.showPatientList = true
    // },
    // handleBackClick(patient) {
    //   this.getBasicInfo()
    //   this.$emit('saved')
    //   this.showPatientList = false
    // },
    /**
     * 从急救患者创建病历
     */
    createFromFirstAid(patient) {
      if (patient.basicInfo) {
        delete patient.basicInfo
      }
      // 删除参数中空的对象
      removeIfEmpty(patient, ['gcFirstAid', 'gcTriage'])
      this.$api.basicInfo.createFromFirstAid(patient).then(({ result }) => {
        if (result) {
          this.getBasicInfo()
          this.$emit('saved')
        } else {
          this.$notify({ type: 'danger', message: '保存失败' })
        }
      })
    },
    /**
     * 从急诊患者创建病历
     */
    createFromTriage(patient) {
      if (patient.basicInfo) {
        delete patient.basicInfo
      }
      this.$api.basicInfo.createFromTriage(patient).then(({ result }) => {
        if (result) {
          this.getBasicInfo()
          this.$emit('saved')
        } else {
          this.$notify({ type: 'danger', message: '保存失败' })
        }
      })
    },
    backClick() {
      this.$emit('backClick')
    },
    validPhone(val) {
      if (val === '') return true
      var mobile = /^((\+86)|(86))?\d{11}$/g
      var telStandard = /^(\d{4}|\d{3})-?(\d{7,8})$/g
      var telBranch = /^(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})$/g
      const res =
        mobile.test(val) || telStandard.test(val) || telBranch.test(val)
      return res
    },
    validIdcard() {
      const idcard = dateUtil.toIdcard(this.details.gcBasic.identificationCard)
      return idcard.ok
    }
  },
  watch: {
    // 监听是否为醒后卒中
    // 'details.gcTriage.isAfterWakeup': {
    //   immediate: false,
    //   handler(newVal, oldVal) {
    //     if (this.details.gcTriage.isAfterWakeup === this.yesno.no) {
    //       this.$set(this.details.gcTriage, 'lastHealthyTime', '')
    //       this.$set(this.details.gcTriage, 'awareTime', '')
    //     } else if (this.details.gcTriage.isAfterWakeup === this.yesno.yes) {
    //       this.$set(this.details.gcTriage, 'onsetTime', '')
    //     } else {
    //       this.$set(this.details.gcTriage, 'lastHealthyTime', '')
    //       this.$set(this.details.gcTriage, 'awareTime', '')
    //       this.$set(this.details.gcTriage, 'onsetTime', '')
    //     }
    //   }
    // },
    'details.gcBasic': {
      immediate: false,
      handler(newVal, oldVal) {
        // 必填字段保存到缓存中以便表单验证使用
        const basic = {
          ...this.basicInfo,
          age: newVal.age,
          name: newVal.name,
          gender: newVal.gender,
          idcardType: newVal.idcardType
        }
        this[types.SET_BASIC_INFO](basic)
        this.insertBasicInformation()
      },
      deep: true
    },
    'details.gcTriage': {
      immediate: false,
      handler(newVal, oldVal) {
        // 必填字段保存到缓存中以便表单验证使用
        const basic = {
          ...this.basicInfo
          // isAfterWakeup: newVal.isAfterWakeup,
          // onsetTime: newVal.onsetTime
        }
        this[types.SET_BASIC_INFO](basic)
        this.saveTriageInfo()
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
