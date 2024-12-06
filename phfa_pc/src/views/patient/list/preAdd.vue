<!-- <template>
  <div>
    <el-form ref="form" :model="data" label-width="80px">
      <div class="basic-form-item-row">
        <el-form-item
          label="姓名"
          prop="regist.name"
          :rules="[{ required: true, message: '请填写姓名', trigger: 'blur' }]"
        >
          <el-input v-model="data.regist.name" style="width: 200px" />
        </el-form-item>
        <el-form-item
          label="性别"
          prop="regist.gender"
          :rules="[{ required: true, message: '请填写性别', trigger: 'blur' }]"
        >
          <el-radio-group v-model="data.regist.gender">
            <el-radio
              v-for="d in genderDic"
              :key="d.name + d.value"
              :label="d.value"
            >{{ d.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div class="basic-form-item-row">
        <el-form-item
          label="出生日期"
          prop="regist.birthday"
          :rules="[
            { required: true, message: '请填写出生日期', trigger: 'blur' }
          ]"
        >
          <el-date-picker
            v-model="data.regist.birthday"
            type="date"
            placeholder="选择出生日期"
            @change="onBirthdayChanged"
          />
        </el-form-item>
        <el-form-item
          label="年龄"
          prop="regist.age"
          :rules="[{ required: true, message: '请填写年龄', trigger: 'blur' }]"
        >
          <el-input v-model="data.regist.age" style="width: 200px">
            <template slot="append">岁</template>
          </el-input>
        </el-form-item>
      </div>
      <div class="basic-form-item-row">
        <el-form-item label="证件类型" prop="regist.idcardType">
          <el-select v-model="data.regist.idcardType" placeholder="证件类型">
            <el-option
              v-for="d in idCard"
              :key="d.name + d.value"
              :label="d.label"
              :value="d.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="
            data.regist.idcardType == '1' ||
              data.regist.idcardType == '2' ||
              data.regist.idcardType == '3'
          "
          label="证件号"
          prop="regist.identificationNo"
        >
          <el-input
            v-model="data.regist.identificationNo"
            style="width: 250px"
            @input="onIdcardChanged"
          />
        </el-form-item>
      </div>
      <div class="basic-form-item-row">
        <el-form-item
          label="来院方式"
          prop="regist.comeType"
          :rules="[
            { required: true, message: '请填写来院方式', trigger: 'blur' }
          ]"
        >
          <el-select v-model="data.regist.comeType" placeholder="来院方式">
            <el-option
              v-for="d in comingTypeDic"
              :key="d.name + d.value"
              :label="d.label"
              :value="d.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="民族" prop="regist.nationality">
          <el-select v-model="data.regist.nationality" placeholder="民族">
            <el-option
              v-for="d in nationOpts"
              :key="d.name + d.value"
              :label="d.label"
              :value="d.value"
            />
          </el-select>
        </el-form-item>
      </div>
      <div class="basic-form-item-row">
        <el-form-item label="文化程度" prop="regist.cultureDegree">
          <el-select v-model="data.regist.cultureDegree" placeholder="文化程度">
            <el-option
              v-for="d in cultureDegree"
              :key="d.name + d.value"
              :label="d.label"
              :value="d.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="婚姻状况" prop="regist.marriage">
          <el-select v-model="data.regist.marriage" placeholder="婚姻状况">
            <el-option
              v-for="d in marital"
              :key="d.name + d.value"
              :label="d.label"
              :value="d.value"
            />
          </el-select>
        </el-form-item>
      </div>
      <div class="basic-form-item-row">
        <el-form-item label="职业" prop="regist.job">
          <el-select v-model="data.regist.job" placeholder="职业">
            <el-option
              v-for="d in job"
              :key="d.name + d.value"
              :label="d.label"
              :value="d.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="regist.phoneNumber">
          <el-input v-model="data.regist.phoneNumber" style="width: 200px" />
        </el-form-item>
      </div>
      <div class="basic-form-item-row">
        <el-form-item label="身高" prop="regist.height">
          <el-input v-model="data.regist.height" style="width: 200px">
            <template slot="append">cm</template>
          </el-input>
        </el-form-item>
        <el-form-item label="体重" prop="regist.weight">
          <el-input v-model="data.regist.weight" style="width: 200px">
            <template slot="append">kg</template>
          </el-input>
        </el-form-item>
      </div>
      <div class="basic-form-item-row">
        <el-form-item label="医保类型" prop="regist.healthcardType">
          <el-select
            v-model="data.regist.healthcardType"
            placeholder="医保类型"
          >
            <el-option
              v-for="d in insuranceDic"
              :key="d.name + d.value"
              :label="d.label"
              :value="d.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="医保卡" prop="regist.healthcardNo">
          <el-input v-model="data.regist.healthcardNo" style="width: 250px" />
        </el-form-item>
      </div>
      <div class="basic-form-item-row">
        <el-form-item label="所属院区" prop="curHospitalArea">
          <el-select v-model="curHospitalArea" placeholder="所属院区">
            <el-option
              v-for="a in hospitalArea"
              :key="a.areaId + a.areaName"
              :label="a.areaName"
              :value="a.areaId"
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
import { dicConstant as d } from '@/constant'
import { getBirthday, getSex } from '@/utils/common-tool'
import dateUtil from '@/utils/date-tool'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'PreAdd',
  props: {
    source: {
      default: null,
      require: true
    }
  },
  data() {
    return {
      hospitalState: true,
      patientHistory: undefined,
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
          patientNo: '',
          phoneNumber: '',
          weight: '',
          infoComingType: '0' // 0:手动创建 1:急救 2:急诊 3:门诊 4:住院
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
      hospitalArea: [],
      curHospitalArea: ''
    }
  },
  computed: {
    ...mapGetters(['hospitalId'])
  },
  // 查询字典
  created() {},
  mounted() {
    this.getDicList()
    this.parseRouteInfo()
  },
  methods: {
    onBirthdayChanged(time) {
      this.data.regist.age = dateUtil.calcAge(moment(time))
    },
    onIdcardChanged(val) {
      if (this.data.regist && val) {
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
    /**
     * 获取急救的病历信息
     */
    async parseRouteInfo() {
      if (!this.source) {
        return
      }
      this.patientHistory = Object.assign({}, this.source)
      this.curHospitalArea = this.patientHistory.hospitalArea
      this.queryAPI.type = this.patientHistory.type
      this.data.regist.infoComingType = this.patientHistory.type
      this.queryAPI.patientNo = this.patientHistory.patientNo
      if (this.patientHistory.patientNo != null) {
        this.data.regist.patientNo = this.patientHistory.patientNo
        this.patientInfo = null
        if (this.patientInfo != null) {
          this.data.regist.name = this.patientInfo.name
          this.data.regist.outPatientNo = this.patientInfo.clinicNo
          this.data.regist.gender = this.patientInfo.gender
          this.data.regist.age = this.patientInfo.age
        }
      } else {
        this.data.regist.gender = this.source.gender
        this.data.regist.name = this.source.name
        this.data.regist.age = this.source.age
        this.data.regist.idcardType = this.source.idcardType
        this.data.regist.identificationNo = this.source.idcardNo
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
      this.data.regist.hospitalArea = this.curHospitalArea
      this.data.regist.hospitalId = this.hospitalId

      // 跳转编辑页
      const { href } = this.$router.resolve({
        name: 'Edit'
      })
      window.open(href, '_blank')
    },
    // 获取字典
    async getDicList() {
      const { _get, getDictionary, getHospitalArea } = this
      const dic = (await getDictionary()) || {}

      this.genderDic = _get(dic, d.genderCode)
      this.distressCaseDic = _get(dic, d.distressCaseCode)
      this.comingTypeDic = _get(dic, d.comingCode)
      this.attackZoneDic = _get(dic, d.attackZoneCode)
      this.yesOrNoDic = _get(dic, d.yesOrNoCode)
      this.nationOpts = _get(dic, d.nationalityCode)
      this.cultureDegree = _get(dic, d.cultureDegreeCode)
      this.idCard = _get(dic, d.idCardCode)
      this.marital = _get(dic, d.maritalCode)
      this.job = _get(dic, d.jobCode)
      this.insuranceDic = _get(dic, d.insuranceCode)

      this.hospitalArea = (await getHospitalArea()) || []
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="sass" scoped>
.basic-form-item-row
  display: flex

  & .el-form-item
    width: 50%
</style> -->
