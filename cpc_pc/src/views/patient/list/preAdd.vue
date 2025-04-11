<template>
  <div>
    <el-form ref="form" :model="model" label-width="140px">
      <div class="basic-form-item-row">
        <el-form-item
          size="mini"
          label="姓名"
          prop="regist.name"
          :rules="[{ required: true, message: '请填写姓名', trigger: 'blur' }]"
        >
          <el-input v-model="model.regist.name" style="width: 200px" />
        </el-form-item>
        <med-radio-field
          v-model="model.regist.gender"
          form-prop="regist.gender"
          label="性别"
          :select-options="dictionary.genderDict"
        />
      </div>
      <div class="basic-form-item-row">
        <el-form-item size="mini" label="出生日期" prop="regist.birthday">
          <el-date-picker
            v-model="model.regist.birthday"
            type="date"
            placeholder="选择出生日期"
            @change="onBirthdayChanged"
          />
        </el-form-item>
        <el-form-item size="mini" label="年龄" prop="regist.age">
          <el-input v-model="model.regist.age" style="width: 200px">
            <template slot="append">岁</template>
          </el-input>
        </el-form-item>
      </div>
      <div class="basic-form-item-row">
        <el-form-item
          size="mini"
          label="来院方式"
          prop="regist.comeType"
          :rules="[
            { required: true, message: '请填写来院方式', trigger: 'change' }
          ]"
        >
          <el-select v-model="model.regist.comeType" placeholder="来院方式">
            <el-option
              v-for="d in commingTypes"
              :key="d.name + d.value"
              :label="d.label"
              :value="d.value"
            />
          </el-select>
        </el-form-item>
        <!-- <med-select-field
          v-model="model.regist.comeType"
          form-prop="regist.comeType"
          label="来院方式"
          :rules="[{ required: true, message: '请填写来院方式', trigger: 'change' }]"
          :select-options="dictionary.comingDict"
        /> -->
        <med-datetime-field
          v-model="model.regist.fmcTime"
          label="首次医疗接触时间"
          form-prop="regist.fmcTime"
          :min-date="minDate"
          :max-date="maxDate"
          :rules="[
            {
              required: true,
              message: '请填写首次医疗接触时间',
              trigger: 'change'
            }
          ]"
        />
      </div>
      <div class="basic-form-item-row">
        <el-form-item size="mini" label="证件类型" prop="regist.idcardType">
          <el-select v-model="model.regist.idcardType" placeholder="证件类型">
            <el-option
              v-for="d in dictionary.idCardDict"
              :key="d.name + d.value"
              :label="d.label"
              :value="d.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="
            model.regist.idcardType === '1' ||
              model.regist.idcardType === '2' ||
              model.regist.idcardType === '3'
          "
          size="mini"
          label="证件号"
          prop="regist.identificationNo"
        >
          <el-input
            v-model="model.regist.identificationNo"
            style="width: 250px"
            @input="onIdcardChanged"
          />
        </el-form-item>
      </div>
      <div class="basic-form-item-row">
        <el-form-item size="mini" label="医保类型" prop="regist.healthcardType">
          <el-select
            v-model="model.regist.healthcardType"
            placeholder="医保类型"
          >
            <el-option
              v-for="d in dictionary.insuranceDict"
              :key="d.name + d.value"
              :label="d.label"
              :value="d.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item size="mini" label="医保编号" prop="regist.healthcardNo">
          <el-input v-model="model.regist.healthcardNo" style="width: 250px" />
        </el-form-item>
      </div>
      <div class="basic-form-item-row">
        <el-form-item
          size="mini"
          label="所属院区"
          prop="regist.hospitalArea"
          :rules="[
            { required: true, message: '请填写所属院区', trigger: 'change' }
          ]"
        >
          <el-select
            v-model="model.regist.hospitalArea"
            placeholder="所属院区"
            disabled
          >
            <el-option
              v-for="a in hospitalArea"
              :key="a.value + a.label + 'hospital'"
              :label="a.label"
              :value="a.value"
            />
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <div style="width: 150px; margin: 0 auto">
      <el-button type="primary" @click="save">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>
<script>
import { getBirthday, getSex } from '@/utils/common-tool'
import dateUtil from '@/utils/date-tool'
import { mapGetters } from 'vuex'
import moment from 'moment'
import { saveMedicalRecord } from '@/api/patient/list'
import { getPatientInfo } from '@/api/patient/list'
import checkPermission from '@/utils/permission'

export default {
  name: 'PreAdd',
  props: {
    source: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      minDate: new Date(2020, 0, 10),
      maxDate: new Date(2025, 10, 1),
      hospitalState: true,
      patientHistory: undefined,
      model: {
        regist: {
          missionId: '',
          age: '',
          birthday: '',
          cultureDegree: '',
          gender: '',
          healthcardNo: '',
          healthcardType: '',
          comeType: '',
          height: '',
          hospitalId: '',
          hospitalArea: '',
          id: '',
          idcardType: '',
          identificationNo: '',
          job: '',
          marriage: '',
          name: '',
          nationality: '',
          patientNo: '',
          phoneNumber: '',
          weight: '',
          infoComingType: '0', // 0:手动创建 1:急救 2:急诊 3:门诊 4:住院
          fmcTime: ''
        }
      },
      patientInfo: {},
      queryAPI: {
        hospitalId: '',
        type: '',
        patientNo: ''
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
      curHospitalArea: ''
    }
  },
  computed: {
    ...mapGetters([
      'hospitalId',
      'hospitalArea',
      'dictionary',
      'currentHospitalArea'
    ]),
    commingTypes() {
      const hasFirstAid = checkPermission(['mr-firstaid'])
      const hasTriage = checkPermission(['mr-triage'])
      let exclude = []
      if (hasFirstAid && !hasTriage) {
        exclude = ['3', '4']
      }
      return this.dictionary.comingDict.filter(
        (d) => !exclude.includes(d.value)
      )
    }
  },
  // 查询字典
  created() {},
  mounted() {
    this.parseRouteInfo()
    this.model.regist.hospitalArea = this.currentHospitalArea
  },
  methods: {
    onBirthdayChanged(time) {
      this.model.regist.age = dateUtil.calcAge(moment(time))
    },
    onIdcardChanged(val) {
      if (this.model.regist && val) {
        const birthday = getBirthday(val)
        if (birthday) {
          this.model.regist.birthday = birthday
          this.model.regist.age = dateUtil.calcAge(birthday)
        }
        const sex = getSex(val)
        if (sex) this.model.regist.gender = sex
      }
    },
    /**
     * 获取急救的病历信息
     */
    async parseRouteInfo() {
      if (!this.source) {
        return
      }
      this.patientHistory = Object.assign({}, this.source)
      this.curHospitalArea = this.patientHistory.hospitalArea
      this.model.regist.infoComingType = this.patientHistory.type
      this.model.regist.hospitalArea = this.patientHistory.hospitalArea
      this.model.regist.emId = this.patientHistory.patientNo
      // this.queryAPI.type = this.patientHistory.type
      // this.queryAPI.patientNo = this.patientHistory.patientNo
      this.queryAPI.type = Number(this.patientHistory.type) || 1
      this.queryAPI.emId = this.patientHistory.patientNo
      this.queryAPI.sysId = 'cpc'
      this.queryAPI.hospitalId = `${this.hospitalId}_${this.curHospitalArea}`
      this.queryAPI.relationId = this.patientHistory.relationId
      if (this.patientHistory.patientNo != null) {
        this.model.regist.patientNo = this.patientHistory.patientNo
        const p = Object.assign(this.queryAPI, {
          hospitalArea: this.curHospitalArea,
          hospitalId: this.hospitalId
        })
        const { result } = (await getPatientInfo(p)) || {}
        console.log('getPatientInfo', result)
        this.patientInfo = { ...this.patientHistory, ...result }
        if (this.patientInfo != null) {
          this.model.regist.name = this.patientInfo.name
          this.model.regist.licensePlate = this.patientInfo.licensePlate
          this.model.regist.outPatientNo = this.patientInfo.clinicNo
          this.model.regist.gender = this.patientInfo.gender || ''
          this.model.regist.age = this.patientInfo.age
          this.model.regist.birthday = this.patientInfo.birthday
          this.model.regist.comeType = this.patientInfo.comeType // 来院方式
          this.model.regist.fmcTime =
            this.patientInfo.fmcTime || moment().format('YYYY-MM-DD HH:mm')
          this.model.regist.idcardType = this.patientInfo.cardType
          this.model.regist.identificationNo = this.patientInfo.cardNo

          if (this.patientInfo.birthday) {
            this.model.regist.birthday = this.patientInfo.birthday
          } else if (this.patientInfo.cardType) {
            this.model.regist.identificationNo = this.patientInfo.cardNo
            const birthday = getBirthday(this.patientInfo.cardNo || '')
            this.model.regist.birthday = birthday
          }
        }
      } else {
        this.model.regist.gender = this.source.gender || ''
        this.model.regist.name = this.source.name
        this.model.regist.age = this.source.age
        this.model.regist.idcardType = this.source.idcardType
        this.model.regist.identificationNo = this.source.idcardNo
      }
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.saveRegist()
        }
      })
    },
    async saveRegist() {
      // this.model.regist.hospitalArea = this.curHospitalArea
      this.model.regist.hospitalId = this.hospitalId
      const { result } = (await saveMedicalRecord(this.model.regist)) || ''

      if (result) this.$emit('cancel')
      else {
        this.$message.error('保存患者失败')
        return
      }

      // 跳转编辑页
      const { href } = this.$router.resolve({
        name: 'Edit',
        query: { id: result }
      })
      window.open(href, '_blank')
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-form-item-row {
  display: flex;

  .el-form-item {
    width: 50%;
  }
}
</style>
