<template>
  <div class="patient-edit-wrapper">
    <med-view-container @return="backClick" :title="title" scroll space="150">
      <template #right-part>
        <div @click.stop>
          <i
            class="iconfont iconicon1-281"
            v-if="false"
            @click="startVoiceInput"
          />

          <!-- <i
            class="iconfont iconicon1-13"
            v-if="showScan"
            @click="onScanClick"
          /> -->
        </div>
      </template>
      <div class="med-card-edit-wrapper">
        <div class="scroll-view">
          <div
            class="scroll-container content-wrapper"
            sticky
            :offset-top="125"
          >
            <van-form ref="form">
              <med-text-field
                v-noSS
                :disabled="disabled"
                required
                v-model="data.regist.name"
                maxlength="30"
                label="姓名"
                :rules="[{ required: true, message: '请填写姓名' }]"
              />
              <div v-if="isAdd || isImport">
                <med-radio-select-field
                  :disabled="disabled"
                  required
                  label="来院方式"
                  v-model="data.regist.comeType"
                  :select-options="comingTypeDesc"
                  :rules="[{ required: true, message: '请填写来院方式' }]"
                  @confirm="onComeTypeChanged"
                >
                </med-radio-select-field>
                <med-date-picker
                  v-model="data.regist.fmcTime"
                  label="首次医疗接触时间"
                  :min-date="minDate"
                  :max-date="maxDate"
                  :disabled="disabled"
                  :clearable="false"
                  required
                  :rules="[
                    { required: true, message: '请填写首次医疗接触时间' }
                  ]"
                />
                <med-radio-button-field
                  v-model="data.regist.gender"
                  :disabled="disabled"
                  label="性别"
                  :select-options="dictionary.genderDict"
                >
                </med-radio-button-field>
                <med-radio-select-field
                  v-model="data.regist.idcardType"
                  :disabled="disabled"
                  label="证件类型"
                  :select-options="idCard"
                  @confirm="onIdcardTypeChanged"
                >
                </med-radio-select-field>
                <med-idcard-field
                  v-model="data.regist.identificationNo"
                  :disabled="disabled"
                  label="证件号"
                  :maxlength="data.regist.idcardType == '1' ? 18 : 24"
                  v-if="
                    data.regist.idcardType == '1' ||
                      data.regist.idcardType == '2' ||
                      data.regist.idcardType == '3'
                  "
                  :show-scan="data.regist.idcardType == '1'"
                  :rules="[
                    { validator: validIdcard, message: '证件号填写不正确' }
                  ]"
                  @scanned="onIdcardScanned"
                  @confirm="onIdcardChanged"
                >
                </med-idcard-field>
                <med-date-picker
                  v-model="data.regist.birthday"
                  label="出生日期"
                  :disabled="disabled"
                  formatter="YYYY-MM-DD"
                  display-formatter="YYYY-MM-DD"
                  :clickDefault="false"
                  @confirm="onBirthdayChanged"
                />
                <med-number-field
                  v-model="data.regist.age"
                  :disabled="disabled"
                  max="250"
                  min="0"
                  label="年龄"
                  unit="岁"
                >
                </med-number-field>
              </div>
              <div v-else>
                <med-radio-button-field
                  required
                  :rules="[{ required: true, message: '请填写性别' }]"
                  v-model="data.regist.gender"
                  :disabled="disabled"
                  label="性别"
                  :select-options="dictionary.genderDict"
                >
                </med-radio-button-field>
                <med-radio-select-field
                  v-model="data.regist.comeType"
                  :disabled="disabled"
                  required
                  label="来院方式"
                  :select-options="comingTypeDesc"
                  :rules="[{ required: true, message: '请填写来院方式' }]"
                  @confirm="onComeTypeChanged"
                >
                </med-radio-select-field>
                <med-date-picker
                  v-model="data.regist.fmcTime"
                  label="首次医疗接触时间"
                  :min-date="minDate"
                  :max-date="maxDate"
                  :disabled="disabled"
                  :clearable="false"
                  required
                  :rules="[
                    { required: true, message: '请填写首次医疗接触时间' }
                  ]"
                />
                <med-radio-select-field
                  v-model="data.regist.idcardType"
                  :disabled="disabled"
                  required
                  :rules="[{ required: true, message: '请填写证件类型' }]"
                  label="证件类型"
                  :select-options="idCard"
                  @confirm="onIdcardTypeChanged"
                >
                </med-radio-select-field>
                <med-idcard-field
                  v-model="data.regist.identificationNo"
                  :disabled="disabled"
                  label="证件号"
                  :maxlength="data.regist.idcardType == '1' ? 18 : 24"
                  v-if="
                    data.regist.idcardType == '1' ||
                      data.regist.idcardType == '2' ||
                      data.regist.idcardType == '3'
                  "
                  :show-scan="data.regist.idcardType == '1'"
                  @scanned="onIdcardScanned"
                  @confirm="onIdcardChanged"
                  :rules="[
                    { validator: validIdcard, message: '证件号填写不正确' }
                  ]"
                >
                </med-idcard-field>
                <med-date-picker
                  v-model="data.regist.birthday"
                  label="出生日期"
                  :disabled="disabled"
                  formatter="YYYY-MM-DD"
                  display-formatter="YYYY-MM-DD"
                  :clickDefault="false"
                  @confirm="onBirthdayChanged"
                />
                <med-number-field
                  v-int="{ min: 1, max: 140 }"
                  min="1"
                  max="140"
                  required
                  :rules="[{ required: true, message: '请填写年龄' }]"
                  v-model="data.regist.age"
                  :disabled="disabled"
                  label="年龄"
                  unit="岁"
                >
                </med-number-field>
                <med-address-field
                  v-model="data.main.dacounty"
                  :disabled="disabled"
                  label="发病地址"
                  @onLocation="onLocation"
                />
                <med-text-field
                  v-model="data.main.address"
                  :disabled="disabled"
                  label="详细地址"
                  maxlength="30"
                />
                <med-radio-button-field
                  v-model="data.main.isIllness"
                  :disabled="disabled"
                  label="大病医保"
                  :select-options="yesOrNoDic"
                >
                </med-radio-button-field>
              </div>
              <med-radio-select-field
                v-model="data.regist.healthcardType"
                :disabled="disabled"
                label="医保类型"
                :select-options="insuranceDic"
              >
              </med-radio-select-field>
              <med-idcard-field
                v-model="data.regist.healthcardNo"
                :disabled="disabled"
                label="医保编号"
                type="cvcard"
                maxlength="20"
                show-scan
                :scanType="[scanType.cvcard]"
                @scanned="onCvcardScanned"
              >
              </med-idcard-field>
              <div v-if="!isAdd && !isImport">
                <med-radio-select-field
                  v-model="data.regist.nationality"
                  :disabled="disabled"
                  label="民族"
                  :select-options="nationOpts"
                  show-mode="popup"
                >
                </med-radio-select-field>
                <med-radio-select-field
                  v-model="data.regist.cultureDegree"
                  :disabled="disabled"
                  label="文化程度"
                  :select-options="cultureDegree"
                >
                </med-radio-select-field>
                <med-radio-select-field
                  v-model="data.regist.marriage"
                  :disabled="disabled"
                  label="婚姻状况"
                  :select-options="marital"
                >
                </med-radio-select-field>
                <med-radio-select-field
                  v-model="data.regist.job"
                  :disabled="disabled"
                  label="职业"
                  :select-options="job"
                  show-mode="popup"
                >
                </med-radio-select-field>
                <med-text-field
                  v-phonenumber
                  v-model="data.regist.phoneNumber"
                  :disabled="disabled"
                  label="联系电话"
                  :rules="[
                    {
                      validator: validPhone,
                      message: '联系电话填写不正确',
                      trigger: 'onChange'
                    }
                  ]"
                />
                <med-number-field
                  v-int="{ min: 50, max: 300 }"
                  v-model="data.regist.height"
                  :disabled="disabled"
                  label="身高"
                  min="50"
                  max="300"
                  unit="cm"
                >
                </med-number-field>
                <med-number-field
                  v-float="{ scale: 1, min: 2, max: 400 }"
                  v-model="data.regist.weight"
                  :disabled="disabled"
                  label="体重"
                  min="2"
                  max="400"
                  unit="kg"
                >
                </med-number-field>
                <med-radio-select-field
                  v-model="curHospitalArea"
                  :disabled="disabled"
                  :readonly="hospitalState"
                  label="所属院区"
                  :select-options="hospitalArea"
                  :rules="[{ required: true, message: '请选择所属院区' }]"
                >
                </med-radio-select-field>
              </div>
            </van-form>
          </div>
        </div>
      </div>
      <template #bottom-part>
        <div class="flex-c-c">
          <van-button
            class="save-btn"
            block
            round
            type="info"
            icon-position="left"
            size="normal"
            :disabled="isSaving || disabled"
            @click="save"
            >
            {{ saveText }}
          </van-button>
        </div>
      </template>
    </med-view-container>
    <med-loading v-model="showLoading" />
  </div>
</template>
<script>
import { getBirthday, getSex, exactVoice } from '@/utils/commonUtil'
import hospitalMixin from '@mixins/hospitalMixin'
import dateMixin from '@/mixins/dateMixin'
import dateUtil from '@utils/dateUtil'
import { mapGetters } from 'vuex'
import { dicConstant } from '@/constant/commonConstant'
import state from '@store/state/state'
import moment from 'moment'
import { Dialog } from 'vant'
import { scanType } from '@constant/commonConstant'

export default {
  name: 'add',
  components: {},
  mixins: [dateMixin, hospitalMixin],
  data() {
    return {
      scanType,
      perhospitalCheck: {
        modelName: 'perhospital',
        registId: '',
        timeStamp: null,
        hadBeenModify: null
      },
      mainCheck: {
        modelName: 'main',
        registId: '',
        timeStamp: null,
        hadBeenModify: null
      },
      admissionCheck: {
        modelName: 'admission',
        registId: '',
        timeStamp: null,
        hadBeenModify: null
      },
      checkData: [],
      checkReturnData: '',
      showLoading: false,
      addresDesc: {},
      from: 'add',
      hospitalState: true,
      registId: '',
      patientHistory: undefined,
      minDate: new Date(2020, 0, 10),
      maxDate: new Date(),
      isSaving: false,
      data: {
        regist: {
          missionId: '',
          age: '',
          birthday: '',
          cultureDegree: '',
          gender: '',
          healthcardNo: '',
          healthcardType: '',
          height: '',
          hospitalId: '',
          id: '',
          idcardType: '',
          identificationNo: '',
          job: '',
          marriage: '',
          name: '',
          nationality: '',
          phoneNumber: '',
          fmcTime: new Date(),
          weight: '',
          infoComingType: '0', // 0:手动创建 1:急救 2:急诊 3:门诊 4:住院
          dacounty: '',
          isIllness: '',
          address: ''
        },
        main: {
          status: ''
        }
      },
      patientInfo: {},
      queryAPI: {
        hospitalId: '',
        type: '',
        relationId: ''
      },
      insuranceDic: [],
      hospitalDic: [],
      attackZoneDic: [],
      // 性别字典
      genderDic: [],
      yesOrNoDic: [],
      comingTypeDic: [],
      cultureDegree: [],
      nationOpts: [],
      idCard: [],
      marital: [],
      job: [],
      codeList: [
        dicConstant.genderCode,
        dicConstant.distressCaseCode,
        dicConstant.comingCode,
        dicConstant.attackZoneCode,
        dicConstant.yesOrNoCode,
        dicConstant.nationalityCode,
        dicConstant.cultureDegreeCode,
        dicConstant.idCardCode,
        dicConstant.maritalCode,
        dicConstant.jobCode,
        dicConstant.attackZoneCode,
        dicConstant.insuranceCode
      ]
    }
  },
  // 查询字典
  created() {
    if (this.$route.query.patientHistory) {
      this.data.regist = { ...this.data.regist, ...this.$route.query.patientHistory }
    }
  },
  mounted() {
    this.from = this.$route.query.from
    this.getDicList()
    this.getBasicInformation()
    this.onVoiceInputEnd()
  },
  computed: {
    ...mapGetters([
      'hospitalArea',
      'curHospitalArea',
      'location',
      'dictionary'
    ]),
    title() {
      if (
        this.$route.query.from === 'add' ||
        this.$route.query.from === 'import'
      ) {
        return '建档信息'
      }
      return '基本信息'
    },
    saveText() {
      if (
        this.$route.query.from === 'add' ||
        this.$route.query.from === 'import'
      ) {
        return '建档'
      }
      return '保存'
    },
    disabled() {
      return (
        this.data.isLock === '1' ||
        this.data.main.status === '21' ||
        this.data.main.status === '31' ||
        this.data.main.status === '41' ||
        this._resources.mrAdd() === false
      )
    },
    comingTypeDesc() {
      const tempArr = [...this.comingTypeDic]

      if (tempArr && tempArr.length > 0) {
        if (
          this._resources.mrFirstAid() &&
          this._resources.mrTriage() === false
        ) {
          var index2 = tempArr.findIndex(m => m.value === '3')
          if (index2 > -1) {
            tempArr.splice(index2, 1)
          }
          var index3 = tempArr.findIndex(m => m.value === '4')
          if (index3 > -1) {
            tempArr.splice(index3, 1)
          }
        }
      }
      return tempArr
    },
    isAdd() {
      return this.from === 'add'
    },
    isImport() {
      return this.from === 'import'
    },
    showScan() {
      if (this.disabled) return false
      return true
    }
  },
  methods: {
    async getBasicInformation() {
      this.registId = this.$route.query.registId
      if (!this.registId) {
        this.parseRouteInfo()
      } else {
        try {
          const res = await this.$api.service.getFillInfoAggregate(this.registId)
          if (res.status === 200) {
            this.$preventWatch(() => {
              const regist = res.result.regist
              const newRegist = { ...regist, fmcTime: res.result.prehospital.fmcTime || res.result.admission.fmcTime }
              this.data = { ...res.result, regist: newRegist }
            })
          } else {
            throw new Error(res.message || '请求错误')
          }
        } catch (err) {
          this.$notify({ type: 'danger', message: err.message })
        }
      }
    },
    /**
     * 获取急救的病历信息
     */
    async parseRouteInfo() {
      const { query } = this.$route
      const { patientHistory } = query ?? ''

      if (!patientHistory) return
      this.patientHistory = patientHistory
      this.queryAPI.hospitalId = this.hospitalAndArea()
      this.queryAPI.relationId = this.patientHistory.relationId
      this.queryAPI.emId = this.patientHistory.emId
      this.queryAPI.type = Number(this.patientHistory.type) || 1
      this.queryAPI.sysId = 'cpc'
      this.data.regist.infoComingType = this.patientHistory.type
      const res = await this.$api.service.getPatientInfo(this.queryAPI)
      try {
        if (res.status === 200) {
          this.patientInfo = { ...this.patientHistory, ...res.result }
          this.data.regist.emId = this.patientInfo.emId
          this.data.regist.name = this.patientInfo.name
          this.data.regist.comeType = this.patientInfo.comeType || ''
          this.data.regist.outPatientNo = this.patientInfo.clinicNo
          this.data.regist.gender = this.patientInfo.gender
          this.data.regist.age = this.patientInfo.age
          this.data.regist.healthcardNo = this.patientInfo.healthcardNo
          this.data.regist.healthcardType = this.patientInfo.healthcardType
          this.data.regist.fmcTime = this.patientInfo.fmcTime || new Date()

          if (this.patientInfo.birthday) {
            this.data.regist.birthday = this.patientInfo.birthday
          } else if (this.patientInfo.cardType) {
            this.data.regist.identificationNo = this.patientInfo.cardNo
            const birthday = getBirthday(this.patientInfo.cardNo || '')
            this.data.regist.birthday = birthday
          }
          this.data.regist.idcardType = this.patientInfo.cardType
          this.data.regist.identificationNo = this.patientInfo.cardNo
          } else {
            throw new Error(res.message || '接口异常')
          }
      } catch (err) {
        this.$notify({ type: 'danger', message: err.message })
      }
    },
    async updateTimeStamp() {
      const res = await this.$api.service.updateTimeStamp(this.checkData)
      if (res.status === 200) {
      } else {
        this.$notify({ type: 'warning', message: res.message })
      }
    },
    async checkTimeStamp() {
      this.checkData = []
      this.perhospitalCheck.registId = this.$route.query.registId
      this.mainCheck.registId = this.$route.query.registId
      this.admissionCheck.registId = this.$route.query.registId
      this.perhospitalCheck.timeStamp = this.data.prehospital.timeStamp
      this.mainCheck.timeStamp = this.data.main.timeStamp
      this.admissionCheck.timeStamp = this.data.admission.timeStamp
      this.admissionCheck.timeStamp = this.data.admission.timeStamp
      this.checkData.push(this.perhospitalCheck)
      this.checkData.push(this.mainCheck)
      this.checkData.push(this.admissionCheck)

      const res = await this.$api.service.checkTimeStamp(this.checkData)
      if (res.status === 200) {
        // this.checkReturnData = 'perhospital'
        const admissionCheck = res.result.find(m => m.modelName === 'admission')
        if (admissionCheck.hadBeenModify) {
          this.checkReturnData = admissionCheck?.modelName
          return
        }
        const mainCheck = res.result.find(m => m.modelName === 'main')
        if (mainCheck.hadBeenModify) {
          this.checkReturnData = mainCheck.modelName
          return
        }
        const perhospitalCheck = res.result.find(
          m => m.modelName === 'perhospital'
        )
        if (perhospitalCheck.hadBeenModify) {
          this.checkReturnData = perhospitalCheck.modelName
          return
        }
        this.checkReturnData = ''
      } else {
        this.$notify({ type: 'warning', message: res.message })
      }
    },
    async checkSave() {
      if (this.$route.query.registId != null) {
        await this.checkTimeStamp()
        if (this.checkReturnData === 'admission') {
          Dialog.alert({
            title: '提示',
            message: '接诊信息已被编辑，系统将强制刷新',
            theme: 'round-button'
          }).then(() => {
            this.getBasicInformation()
            this.showLoading = false
          })
        } else if (this.checkReturnData === 'main') {
          Dialog.alert({
            title: '提示',
            message: '患者信息已被编辑，系统将强制刷新',
            theme: 'round-button'
          }).then(() => {
            this.getBasicInformation()
            this.showLoading = false
          })
        } else if (this.checkReturnData === 'perhospital') {
          Dialog.confirm({
              title: '提示',
              message: '院前信息已被编辑过，是否覆盖?',
              confirmButtonText: '是',
              cancelButtonText: '否'
            })
            .then(() => {
              this.saveRegist()
            })
            .catch(() => {
              this.getBasicInformation()
              this.showLoading = false
            })
        } else {
          await this.saveRegist()
        }
      } else {
        await this.saveRegist()
      }
    },
    /**
     * 创建空白病历
     */
    async saveRegist() {
      this.showLoading = true
      let times = ''
      let days = 0
      if (
        this.data.main.hasOwnProperty('createTime') &&
        this.data.main.createTime != null
      ) {
        times = this.data.main.createTime
        days = moment(times).diff(this.data.regist.fmcTime, 'day')
      } else {
        times = this.data.regist.fmcTime
        days = moment(new Date()).diff(times, 'day')
      }
      if (days >= 14) {
        this.$notify({
          type: 'warning',
          message: '首次医疗接触时间不能大于14天'
        })
        this.showLoading = false
        this.isSaving = false
        return
      }

      this.data.regist.hospitalArea = this.curHospitalArea
      this.data.regist.hospitalId = state.hospitalId
      this.data.regist.dacounty = this.data.main.dacounty
      this.data.regist.isIllness = this.data.main.isIllness
      this.data.regist.address = this.data.main.address

      this.isSaving = true
      try {
        const params = {
          ...this.data.regist,
          type: Number(this.data.regist.type)
        }
        const res = await this.$api.service.saveMedicalRecord(params)
        if (res.status === 200) {
          this.showLoading = false
          this.isSaving = false
          const registId = this.registId || res.result
          if (this.registId != null) {
            this.updateTimeStamp()
          }
          this.$router.push({
            path: '/patient/document/detail',
            query: { registId: registId }
          })
        } else {
          throw new Error(res.message || '请求错误')
        }
      } catch (err) {
        this.showLoading = false
        this.isSaving = false
        this.$notify({ type: 'danger', message: err.message })
      }
    },
    // 保存信息
    save() {
      this.$refs.form
        .validate()
        .then(() => {
          this.checkSave()
        })
        .catch(e => {
          if (e && e.length > 0) {
            this.$notify({ type: 'warning', message: e[0].message })
          } else {
            this.$notify({ type: 'warning', message: '保存失败' })
          }
        })
    },
    // 获取字典
    async getDicList() {
      try {
        const res = await this.$api.service.getDictionary('')
        if (res) {
          this.genderDic = res[dicConstant.genderCode]
          this.distressCaseDic = res[dicConstant.distressCaseCode]
          this.comingTypeDic = res[dicConstant.comingCode]
          this.attackZoneDic = res[dicConstant.attackZoneCode]
          this.yesOrNoDic = res[dicConstant.yesOrNoCode]
          this.nationOpts = res[dicConstant.nationalityCode]
          this.cultureDegree = res[dicConstant.cultureDegreeCode]
          this.idCard = res[dicConstant.idCardCode]
          this.marital = res[dicConstant.maritalCode]
          this.job = res[dicConstant.jobCode]
          this.insuranceDic = res[dicConstant.insuranceCode]
        } else {
          throw new Error(res.message || '请求错误')
        }
      } catch (err) {
        this.$notify({ type: 'danger', message: err.message })
      }
    },
    onLocation(address) {
      if (!this.data.main.address && this.data.regist.comeType === '1') {
        this.data.main.address = address
      }
    },
    // 1:二维码,2:身份证,3:医保卡
    onScanClick() {
      this.$bridge.callhandler('scanner', { type: ['3', '2'] }, data => {
        if (!data) this.$toast('无效的扫描数据')
        const result = JSON.parse(data)
        if (result && (result.type === '2' || result.type === '3')) {
          if (result.type === '2') {
            this.data.regist.identificationNo = result.identity
            this.onIdcardScanned(result)
          } else if (result.type === '3') {
            this.data.regist.healthcardNo = result.cardNo
            this.onCvcardScanned(result)
          }
        } else {
          this.$toast('不支持的扫码类型')
        }
      })
    },
    onIdcardScanned(data) {
      if (data) {
        this.data.regist.name = data.name
        this.data.regist.idcardType = '1'
        if (data.sex) {
          this.data.regist.gender = data.sex === '男' ? '1' : '2'
        }
        if (data.birth) {
          this.data.regist.birthday = dateUtil.toBirthday(data.birth)
          this.data.regist.age = dateUtil.calcAge(
            moment(this.data.regist.birthday)
          )
        }
        if (!data.sex || !data.birth) this.onIdcardChanged(data.identity)
        if (data.nation) {
          if (data.nation === '汉') this.data.regist.nationality = '01'
        }
      }
    },
    onCvcardScanned(data) {
      if (data) {
        this.data.regist.name = data.name
        if (data.identity) {
          this.data.regist.identificationNo = data.identity
          this.data.regist.idcardType = '1'
          this.onIdcardChanged(data.identity)
        }
      }
    },
    onComeTypeChanged(val) {
      if (val) {
        this.data.regist.comeType = val
        this.$forceUpdate()
      }
    },
    onIdcardTypeChanged(val) {
      if (val) {
        this.data.regist.idcardType = val
        this.$forceUpdate()
      }
    },
    onBirthdayChanged(time) {
      if (time) {
        this.data.regist.age = dateUtil.calcAge(moment(time))
      }
    },
    onAgeChanged(age) {
      if (!age) return
      if (!this.data.regist.birthday) {
        this.data.regist.birthday = moment()
          .subtract(parseInt(age), 'years')
          .toDate()
      }
    },
    onIdcardChanged(val) {
      if (!this.data.regist || !val) return
      if (this.data.regist.idcardType !== '1') return
      const idcard = dateUtil.toIdcard(val)
      if (!idcard.ok) {
        this.$notify({ type: 'warning', message: idcard.message })
        return
      }

      if (val.length !== 18 && val.length !== 15) return
      if (this.data.regist.idcardType === '1' || !this.data.regist.idcardType) {
        const birthday = getBirthday(val)
        if (birthday) {
          this.data.regist.birthday = birthday
          this.data.regist.age = dateUtil.calcAge(birthday)
        }
        const sex = getSex(val)
        if (sex) this.data.regist.gender = sex
        this.data.regist.idcardType = '1'
      }
    },
    validIdcard() {
      if (Number(this.data.regist.idcardType) !== '1') return true
      const idcard = dateUtil.toIdcard(this.data.regist.identificationNo)
      return idcard.ok
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
    backClick() {
      if (this.$route.path === '/patient/document/addInformation') {
        this.$router.go(-1)
      } else {
        this.$emit('back')
      }
    },
    startVoiceInput: function() {
      this.$bridge.startVoiceInput()
    },
    onVoiceInputEnd: function() {
      this.$bridge.onVoiceInputEnd(res => {
        const _res = exactVoice(res)
        const gender = this.genderDic.find(t => t.label === _res.gender)
        this.data.regist.name = _res.name
        if (gender) {
          this.data.regist.gender = gender.value
        }
        this.data.regist.birthday = moment(_res.birdthDay).format('YYYY-MM-DD')
        this.data.regist.age = _res.age
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
