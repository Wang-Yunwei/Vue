<template>
  <div class="task-basic-info-wrapper">
    <div class="task-part-title">
      <span class="solid" />
      <span>基本信息</span>
    </div>
    <div class="main">
      <van-cell-group>
        <van-field required v-model="patients.name" label="姓名" placeholder="姓名" />
        <van-cell required title="性别">
          <van-radio-group class="flex-c-s radio-btn-type" v-model="patients.gender">
            <van-radio v-for="item in genderList" :key="item.value" :name="item.value">
              {{ item.label }}
            </van-radio>
          </van-radio-group>
        </van-cell>
        <van-field v-model="patients.age" label="年龄" placeholder="年龄" type="digit" :maxlength="3" :readonly="!['01', '02', , '03'].includes(patients.ageExtend)">
          <template #right-icon>
            <med-select class="age-type" v-model="patients.ageExtend" :options="ageList" @change="handleAgeTypeChange" />
          </template>
        </van-field>
        <van-cell title="证件类型">
          <med-select v-model="patients.cardType" :options="cardTypeList"></med-select>
        </van-cell>
        <van-field v-model="patients.cardNo" label="证件号码" placeholder="证件号码">
          <template #right-icon>
            <i class="iconfont iconicon1-13" @click="onScanClick" />
          </template>
        </van-field>
        <van-cell title="民族">
          <template>
            <med-select v-model="patients.nation" :options="nationList"></med-select>
          </template>
        </van-cell>
        <van-cell title="国籍">
          <template>
            <med-select v-model="patients.state" :options="stateList"></med-select>
          </template>
        </van-cell>
        <van-field v-model="medicalRecords.contact" label="联系人" placeholder="联系人" />
        <van-field v-model="medicalRecords.contactNumber" label="联系电话" placeholder="联系电话" />
        <van-field v-model="medicalRecords.reasonType" label="呼叫原因" placeholder="呼叫原因" type="textarea" rows="2" />
        <van-cell title="急救类型">
          <med-select v-model="missions.missionType" :options="missionTypeList"></med-select>
        </van-cell>
        <van-field v-model="medicalRecords.address" label="接诊地址" placeholder="接诊地址" type="textarea" rows="2" />
        <van-field v-model="missions.mpds" label="MPDS" placeholder="MPDS" type="textarea" rows="2" />
        <van-field v-model="patients.tagId" label="腕带" placeholder="腕带">
          <template #right-icon>
            <i class="iconfont iconicon1-13" style="font-size:0.4rem"></i>
          </template>
        </van-field>
        <van-cell title="出车分站">
          <med-select v-model="missions.dispatchVehicleSite" :options="dispatchVehicleSiteList"></med-select>
        </van-cell>
        <person-select label="驾驶员" v-model="missions.driverName" :options="driverList"></person-select>
        <person-select label="出诊医生" v-model="missions.doctorName" :options="doctors"></person-select>
        <person-select label="出诊护士" v-model="missions.nurseName" :options="nurses"></person-select>
        <med-date-picker label="接触患者时间" v-model="missions.touchPatientTime"></med-date-picker>
        <van-field :value="diseaseCategory" readonly label="疾病类别" placeholder="疾病类别" @click="hrefDiseaseCategory" right-icon="arrow" />
      </van-cell-group>
    </div>
    <van-action-sheet v-model="show" :actions="sheetList" @select="onSelect" />

    <van-popup v-model="diseaseCategoryShow" :lazy-render="false" position="right" :style="{ width: '100%', height: '100%' }">
      <DiseaseCategory v-if="diseaseCategoryShow" ref="diseaseCategory" @backClick="diseaseCategoryShow = false" @submit="submit" />
    </van-popup>
    <!-- <van-popup position="right" v-model="signModalVisible">
      <sign-pad @back="signModalVisible = false" :type="signType"></sign-pad>
    </van-popup> -->
  </div>
</template>
<script>
import * as types from '@store/mutations/mutations-types'
import methodMixin from '@mixins/methodMixin'
import { mapGetters, mapMutations } from 'vuex'
import { throttle } from 'lodash'
import DiseaseCategory from '../BasicInfo/diseaseCategory'
import SignPad from './SignPad'

let saveTimer

export default {
  components: { DiseaseCategory, SignPad },
  data() {
    return {
      loading: false,
      ageList: [],
      patients: {
        patientId: '',
        missionId: '',
        name: '',
        gender: '',
        age: '',
        ageExtend: '01',
        cardType: '',
        cardNo: '',
        nation: '0',
        state: ''
      },
      missions: {
        missionId: '',
        dispatchVehicleSite: '',
        touchPatientTime: '',
        wd: '',
        mpds: '',
        driverName: '',
        doctorName: '',
        nurseName: ''
      },
      medicalRecords: {
        recordId: '',
        patientId: '',
        contact: '',
        contactNumber: '',
        address: '',
        reasonType: '',
        missionType: '',
        diseaseCategory: ''
      },
      diseaseCategoryShow: false,
      show: false,
      // signModalVisible: false,
      signType: 'doctor',
      sheetList: [],
      sheetType: '',
      nationList: [],
      diseaseCategoryList: [],
      genderList: [],
      cardTypeList: [],
      missionTypeList: [],
      stateList: [],
      driverList: [],
      doctors: [],
      nurses: [],
      dispatchVehicleSiteList: []
    }
  },
  methods: {
    ...mapMutations(types),
    async getStationList() {
      const res = await this.$api.escPageList({
        hospitalId: this.hospitalId,
        hospitalArea: this.hospitalArea
      })
      this.dispatchVehicleSiteList = (res.body?.records || []).map(item => {
        return {
          ...item,
          label: item.name,
          value: item.id
        }
      })
    },
    async getPersonList(rescuerType) {
      const res = await this.$api.getPersonList({
        hospitalId: this.hospitalId,
        hospitalArea: this.hospitalArea,
        rescuerType
      })
      return (res.body?.records || []).map(item => {
        return {
          ...item,
          label: item.rescuerName,
          value: item.rescuerId
        }
      })
    },
    async getDiverList() {
      this.driverList = await this.getPersonList('03')
    },
    async getDoctorList() {
      this.doctors = await this.getPersonList('01')
    },
    async getNurseList() {
      this.nurses = await this.getPersonList('02')
    },
    onScanClick() {
      if (this.patients.cardType) {
        // 01:身份证,02:医保卡,03:护照,04:驾驶证
        const type =
          this.patients.cardType === '1'
            ? ['2']
            : this.patients.cardType === '2'
              ? ['3']
              : []
        // 1:二维码,2:身份证,3:医保卡
        this.$bridge.callhandler('scanner', { type }, data => {
          if (!data) this.$toast('无效的扫描数据')
          const result = JSON.parse(data)
          if (result && (result.type === '2' || result.type === '3')) {
            console.log(
              result.type === '2' ? '身份证扫描:' : '医保卡扫描:',
              result
            )
            this.patients.name = result.name // 姓名
            const genderObj = this.genderList.find(g => g.label === result.sex)
            this.patients.gender = genderObj?.value // 性别
            /**
             * 龄计算规则:
             * 当前日期减出生日期，年份减年份，月份减月份，日减日，判断当月份和日二者相减，任何一个相减为负数，年龄则年份相减后再减一
             * 判断当月份和日二者相减，任何一个相减大于或等于0时 ，年龄则显示为年份相减后得数
             * 例:患者出生日期为1996年9月1号，当前日期为：2022年4月23日，2022-1996=26，4-9= -5，年龄则为26-1=25岁
             */
            const nowDate = new Date()
            const date = {
              year: nowDate.getFullYear(),
              month: nowDate.getMonth() + 1,
              day: nowDate.getDate()
            }
            const ageYear = result.birth.substring(0, 4)
            const ageMonth = result.birth.substring(4, 6)
            const ageDay = result.birth.substring(6, 8)
            let ageIs = true
            if (ageMonth > date.month || ageDay > date.day) {
              ageIs = false
            }
            // console.log(
            //   'date:',
            //   date.year,
            //   date.month,
            //   date.day,
            //   'age:',
            //   ageYear,
            //   ageMonth,
            //   ageDay,
            //   'ageIs:',
            //   ageIs,
            //   'ageMonth > date.month',
            //   ageMonth > date.month,
            //   'ageDay > date.day',
            //   ageDay > date.day
            // )
            this.patients.age = ageIs
              ? date.year - ageYear
              : date.year - ageYear - 1
            // this.patients.age = result.birth //生日'19930730'
            const nationObj = this.nationList.find(
              n => n.label === result.nation
            )
            this.patients.nation = nationObj?.value // 民族
            this.patients.cardNo = result.identity // 证件号码
          } else {
            this.$toast('不支持的扫码类型')
          }
        })
      }
    },
    async getCodeList() {
      const res = this.getCodeListByKey([
        'PHFA_0001', // 性别
        'PHFA_0003', // 证件类型
        'PHFA_0006', // 急救类型
        'PHFA_0011', // 疾病类别
        'PHFA_0004', // 民族
        'PHFA_0005', // 国家
        'PHFA_0002' // 年龄分类
      ])
      this.cardTypeList = res.PHFA_0003
      this.missionTypeList = res.PHFA_0006
      this.ageList = res.PHFA_0002
      this.nationList = res.PHFA_0004
      this.stateList = res.PHFA_0005
      this.diseaseCategoryList = res.PHFA_0011.map(item => ({
        name: item.label,
        value: item.value
      }))
      this.genderList = res.PHFA_0001
    },
    async init() {
      this.loading = true
      this.getStationList()
      this.getDiverList()
      this.getDoctorList()
      this.getNurseList()
      const { body } = await this.$api.pmDetail({
        missionId: this.missionId
      })
      this[types.SET_MISSIONSTATUS](body?.missionsEntity?.status)
      this.$preventWatch(() => {
        // 年龄单位默认为岁
        const defaultAgeUnit = (this.ageList || []).find(a => a.label === '岁')
          ?.value
        if (defaultAgeUnit) {
          this.patients.ageExtend = defaultAgeUnit
        }
        this.missions = { ...body?.missionsEntity }
        const patientsEntity = this.clearNull(body?.patientsEntity)
        this.patients = {
          ageExtend: defaultAgeUnit,
          ...patientsEntity,
          age: `${body?.patientsEntity?.age || ''}`
        }
        if (body && body.medicalRecordsEntity) {
          this.medicalRecords.recordId = body.medicalRecordsEntity.recordId
          this.medicalRecords.patientId = body.medicalRecordsEntity.patientId
          this.medicalRecords.contact = body.medicalRecordsEntity.contact
          this.medicalRecords.contactNumber =
            body.medicalRecordsEntity.contactNumber
          this.medicalRecords.address = body.medicalRecordsEntity.address
          this.medicalRecords.reasonType = body.medicalRecordsEntity.reasonType
          this.medicalRecords.missionType =
            body.medicalRecordsEntity.missionType
          this.medicalRecords.diseaseCategory =
            body.medicalRecordsEntity.diseaseCategory
          this[types.SET_DISEASE_CATEGORY](
            body.medicalRecordsEntity.diseaseCategory
          )
        }
        const patientId = body?.patientsEntity?.patientId || ''
        const recordId = body?.medicalRecordsEntity?.recordId || ''
        const toHospital = body?.medicalRecordsEntity?.toHospital || ''
        const toHospitalName = body?.medicalRecordsEntity?.toHospitalName || ''

        this[types.SET_TOHOSPITALNAME](toHospitalName)
        this[types.SET_TOHOSPITALID](toHospital)
        this[types.SET_PATIENTID](patientId)
        this[types.SET_RECORDID](recordId)

        // 全局病历信息
        this.doSaveGlobalPatientId()
        // 全局任务信息
        this[types.SET_MISSIONINFO]({
          ...this.missions
        })
        this[types.SET_MISSIONSTATUS](this.missions.status)
        // 格式化患者接触时间
        if (this.missions.touchPatientTime) {
          this.missions.touchPatientTime = this.formatDate(
            this.missions.touchPatientTime
          )
        }
      })

      this.loading = false
    },
    // showSignModal(type) {
    //   this.signType = type
    //   this.signModalVisible = true
    // },
    handleAgeTypeChange(type) {
      if (!['01', '02', '03'].includes(type)) {
        // 选择模糊年龄
        this.$set(this.patients, 'age', undefined)
      }
    },
    onSelect(item) {
      this.show = false
      if (
        this.sheetType === 'nation' ||
        this.sheetType === 'state' ||
        this.sheetType === 'cardType'
      ) {
        this.patients[this.sheetType] = item.name
      } else if (
        this.sheetType === 'dispatchVehicleSite' ||
        this.sheetType === 'driverName' ||
        this.sheetType === 'doctorName' ||
        this.sheetType === 'nurseName'
      ) {
        this.missions[this.sheetType] = item.name
      }
    },
    // 时间格式化
    formatDate(date) {
      return this.$moment(date).format('YYYY-MM-DD[T]HH:mm:ss')
    },
    hrefDiseaseCategory() {
      this.diseaseCategoryShow = true
      // this.$refs.diseaseCategory.init()
    },

    handleMissionsSave: throttle(
      function () {
        const req = { ...this.missions, missionId: this.missionId }
        this.$api.pmUpdate(req).then(res => {
          if (res.code === '000000') {
            this[types.SET_MISSIONINFO](this.missions)
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
      },
      1000,
      { leading: false, trailing: true }
    ),
    handlePatientsSave() {
      const req = { ...this.patients, patientId: this.patientId }
      this.$api.ppUpdate(req).then(res => {
        if (res.code === '000000') {
          this.doSaveGlobalPatientId()
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    },
    handleMedicalRecordsSave: throttle(
      function () {
        const req = { ...this.medicalRecords, patientId: this.patientId }
        this.$api.mpmrupdateByPatientId(req).then(res => {
          if (res.code === '000000') {
            this.doSaveGlobalPatientId()
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
      },
      2000,
      { leading: false, trailing: true }
    ),
    doSaveGlobalPatientId() {
      this[types.SET_PATIENTINFO]({
        ...this.patients,
        diseaseCategory: this.medicalRecords.diseaseCategory
      })
    },
    submit(val) {
      this.$set(this.medicalRecords, 'diseaseCategory', val.diseaseCategory)
    }
  },
  computed: {
    ...mapGetters([
      'missionId',
      'patientId',
      'missionId',
      'hospitalId',
      'hospitalArea'
    ]),
    diseaseCategory() {
      const obj = this.diseaseCategoryList.find(
        t => t.value === this.medicalRecords.diseaseCategory
      )
      if (obj) return obj.name
      return ''
    }
  },
  async created() {
    await this.getCodeList()
    this.init()
  },
  mounted() {
    if (this.loading) {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '加载中...'
      })
    }
  },
  beforeDestroy() {
    this.$toast.clear()
  },
  watch: {
    hospitalId: {
      immediate: true,
      handler(v) {
        if (v) {
          this.getStationList()
        }
      }
    },
    missions: {
      handler() {
        this.handleMissionsSave()
      },
      deep: true
    },
    patients: {
      handler() {
        clearTimeout(saveTimer)
        saveTimer = setTimeout(() => {
          this.handlePatientsSave()
        }, 2000)
      },
      deep: true
    },
    medicalRecords: {
      handler() {
        this.handleMedicalRecordsSave()
      },
      deep: true
    },
    loading: {
      handler(v) {
        if (v) {
          this.$toast.loading({
            duration: 0, // 持续展示 toast
            forbidClick: true,
            message: '加载中...'
          })
        } else {
          this.$toast.clear()
        }
      }
    }
  },
  mixins: [methodMixin]
}
</script>

<style lang="less" scoped>
.age-type {
  /deep/.med-select-value {
    padding-right: 0.4rem;
  }

  /deep/.med-select-arrow {
    border-left: 1px solid #ddd;
    padding: 0 0.2rem;
  }
}

.iconicon1svg-18,
.iconicon1-13 {
  font-size: 0.5rem;
  color: #5e74fe;
  border-left: 1px solid #ddd;
  padding: 0 0.15rem;
  margin-left: 0.3rem;
}

.iconicon1-13 {
  border-left: none;
}

.auto-complete {
  /deep/ .ivu-input {
    border: none;
    padding: 0;

    &:focus {
      box-shadow: none;
    }
  }
}
</style>
