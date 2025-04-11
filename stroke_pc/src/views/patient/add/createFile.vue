<template>
  <div>
    <el-form
      ref="gcDetail"
      :model="gcDetail"
      :rules="rules"
      label-width="20%"
      class="demo-ruleForm"
    >
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="gcDetail.name"
          style="width: 40%"
          placeholder="姓名"
        />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="gcDetail.gender">
          <el-radio-button
            v-for="item in dic.gender"
            :key="item.value"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <div class="flex-c-s">
          <el-input-number
            v-model="gcDetail.age"
            label="年龄"
            :controls="false"
            class="number-input"
          />
          岁
        </div>
      </el-form-item>
      <el-form-item label="来院方式" prop="comingType">
        <el-radio-group v-model="gcDetail.comingType">
          <el-radio-button
            v-for="item in dic.comingType"
            :key="item.value"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="院区" prop="hospitalArea">
        <el-radio-group v-model="gcDetail.hospitalArea" disabled>
          <el-radio-button
            v-for="item in hospitalArea"
            :key="item.areaId"
            :label="item.areaId"
          >
            {{ item.areaName }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="false" label="诊号" prop="outPatientNo">
        <el-input v-model="gcDetail.outPatientNo" style="width: 40%" />
      </el-form-item>
      <el-form-item v-if="false" label="住院号" prop="admissionNo">
        <el-input v-model="gcDetail.admissionNo" style="width: 40%" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('gcDetail')"
        >建档</el-button>
        <el-button @click="resetForm('gcDetail')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import patientApi from '@/api/patient'
import storage from 'store'
import { mapGetters } from 'vuex'

export default {
  name: 'CreateFile',
  props: {
    fileInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      gcDetail: {
        name: '',
        gender: '',
        age: void 0,
        comingType: '',
        hospitalArea: '',
        outPatientNo: '',
        admissionNo: ''
      },
      gcFirstAid: {},
      gcTriage: {},
      gcMh: {},
      gcCure: {},
      gcSign: {},
      gcOutCome: {},
      dic: storage.get('dicData'),
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { max: 10, message: '姓名长度10个字符', trigger: 'blur' }
        ],
        gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value < 0 || value > 140) {
                callback('请输入0~140之间的数字')
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        comingType: [
          { required: true, message: '请选择来院方式', trigger: 'blur' }
        ],
        hospitalArea: [
          { required: true, message: '请选择院区', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['hospitalId', 'hospitalArea', 'curHospitalArea'])
  },
  watch: {
    curHospitalArea: {
      immediate: true,
      handler(v) {
        this.gcDetail.hospitalArea = v
      }
    }
  },
  mounted() {
    this.getPatientDetails()
  },
  methods: {
    getPatientDetails() {
      if (!this.fileInfo.name) {
        return
      }
      patientApi
        .getPatientDetails({
          relationId: this.fileInfo.relationId,
          type: this.fileInfo.type,
          hospitalId: this.hospitalId + '_' + this.curHospitalArea
        })
        .then((res) => {
          if (res.status === 200 && res.code === '0') {
            this.gcDetail = {
              ...this.gcDetail,
              ...(res.result.medswmgc ? res.result.medswmgc : '')
            }
            this.gcDetail.hospitalArea = this.curHospitalArea
            this.gcFirstAid = {
              ...this.gcFirstAid,
              ...(res.result.medswmgcfirstaid
                ? res.result.medswmgcfirstaid
                : '')
            }
            this.gcTriage = {
              ...this.gcTriage,
              ...(res.result.medSwmGcTriage ? res.result.medSwmGcTriage : '')
            }
            this.gcMh = {
              ...this.gcMh,
              ...(res.result.medswmgcmh ? res.result.medswmgcmh : '')
            }
            this.gcCure = {
              ...this.gcCure,
              ...(res.result.medswmgccure ? res.result.medswmgccure : '')
            }
            this.gcSign = {
              ...this.gcSign,
              ...(res.result.medswmgcsign ? res.result.medswmgcsign : '')
            }
            this.gcOutCome = {
              ...this.gcOutCome,
              ...(res.result.medSwmGcOutcome ? res.result.medSwmGcOutcome : '')
            }
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((error) => {
          if (error.response) {
            this.$message.error(error.response.data.message)
          }
        })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.fileInfo.name) {
            this.addPatientDetails()
          } else {
            this.createEmpty()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    addPatientDetails() {
      patientApi
        .addPatientDetails({
          gcDetail: this.gcDetail,
          gcFirstAid: this.gcFirstAid,
          gcTriage: this.gcTriage,
          gcMh: this.gcMh,
          gcCure: this.gcCure,
          gcSign: this.gcSign,
          medSwmGcOutcome: this.gcOutCome
        })
        .then((res) => {
          if (res.status === 200 && res.code === '0') {
            this.createHideModal()
            // 进入遍历编辑页面
            this.goUpdateView(res.result)
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((error) => {
          if (error.response) {
            this.$message.error(error.response.data.message)
          }
        })
    },
    /**
     * 创建空白病历
     */
    createEmpty() {
      patientApi
        .insertBasicInformation({
          ...this.gcDetail,
          hospitalId: this.hospitalId
        })
        .then((res) => {
          if (res.status === 200 && res.code === '0') {
            this.createHideModal()
            // 进入遍历编辑页面
            this.goUpdateView(res.result)
          } else {
            this.$message.error('错了哦，请联系开发者')
          }
        })
    },
    createHideModal() {
      this.$emit('createHideModal')
    },
    // 编辑页面跳转
    goUpdateView(code) {
      const { href } = this.$router.resolve({
        name: 'Edit',
        query: { registId: code }
      })
      window.open(href, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.number-input {
  width: 93px;
  margin-right: 10px;
  ::v-deep .el-input__inner {
    text-align: left;
  }
}
</style>
