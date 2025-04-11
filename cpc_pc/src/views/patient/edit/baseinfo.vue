<template>
  <div>
    <!-- <el-divider content-position="left">
      <span style="color: blue">基本信息</span>
    </el-divider> -->
    <el-form
      ref="basicform"
      :model="value"
      label-width="80px"
      size="small"
      label-position="left"
    >
      <el-row :gutter="20">
        <el-col :span="4">
          <med-text-field
            v-model="value.name"
            maxlength="20"
            label="姓名"
            :disabled="disabled"
            form-prop="name"
            :rules="[
              { required: true, message: '请填写姓名', trigger: 'blur' }
            ]"
          />
        </el-col>
        <el-col :span="4">
          <med-radio-field
            v-model="value.gender"
            :rules="[
              { required: true, message: '请填写性别', trigger: 'change' }
            ]"
            :disabled="disabled"
            label="性别"
            :select-options="dictionary.genderDict"
            form-prop="gender"
            radio-type="button"
          />
        </el-col>
        <el-col :span="4">
          <med-datetime-field
            v-model="value.birthday"
            form-prop="birthday"
            label="出生日期"
            type="date"
            :disabled="disabled"
            @change="onBirthdayChanged"
          />
        </el-col>
        <el-col :span="4">
          <med-text-field
            v-model="value.age"
            v-int="{ max: 140, min: 1 }"
            :disabled="disabled"
            label="年龄"
            form-prop="age"
            :rules="[
              { required: true, message: '请填写年龄', trigger: 'blur' }
            ]"
            append="岁"
          />
        </el-col>
        <el-col :span="4">
          <med-select-field
            v-model="value.idcardType"
            form-prop="idcardType"
            :disabled="disabled"
            label="证件类型"
            :rules="[
              { required: true, message: '请填写证件类型', trigger: 'change' }
            ]"
            :select-options="dictionary.idCardDict"
          />
        </el-col>
        <el-col :span="4">
          <med-text-field
            v-if="
              value.idcardType == '1' ||
                value.idcardType == '2' ||
                value.idcardType == '3'
            "
            v-model="value.identificationNo"
            label="证件号"
            form-prop="identificationNo"
            :disabled="disabled"
            maxlength="18"
            :rules="[
              { required: true, message: '请填写证件号', trigger: 'blur' }
            ]"
            @change="onIdcardChanged"
          />
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4">
          <med-layout-flow>
            <med-select-field
              v-model="admission.comeType"
              form-prop="comeType"
              :disabled="disabled"
              label="来院方式"
              prop="comeType"
              :rules="[
                { required: true, message: '请填写来院方式', trigger: 'change' }
              ]"
              :select-options="dictionary.comingDict"
            />
            <!-- <el-button type="info" :icon="status.icon" size="mini" style="margin-left:10px;" @click="extendOrNot">{{ status.text }}</el-button> -->
          </med-layout-flow>
        </el-col>
        <el-col :span="4">
          <med-select-field
            v-model="value.nationality"
            form-prop="nationality"
            :disabled="disabled"
            label="民族"
            :select-options="dictionary.nationalityDict"
          />
        </el-col>
        <el-col :span="4">
          <med-select-field
            v-model="value.marriage"
            form-prop="marriage"
            :disabled="disabled"
            label="婚姻状况"
            :select-options="dictionary.maritalDict"
          />
        </el-col>
        <el-col :span="4">
          <med-select-field
            v-model="value.cultureDegree"
            form-prop="cultureDegree"
            :disabled="disabled"
            label="文化程度"
            :select-options="dictionary.cultureDegreeDict"
          />
        </el-col>
        <el-col :span="4">
          <med-select-field
            v-model="value.job"
            form-prop="job"
            :disabled="disabled"
            label="职业"
            :select-options="dictionary.jobDict"
          />
        </el-col>
        <el-col :span="4">
          <med-text-field
            v-model="value.phoneNumber"
            v-phone
            label="联系电话"
            form-prop="phoneNumber"
            :disabled="disabled"
          />
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4">
          <med-radio-field
            v-model="dataMain.isIllness"
            :disabled="disabled"
            label="大病医保"
            :select-options="dictionary.yesOrNoDict"
            radio-type="button"
          />
        </el-col>
        <el-col :span="4">
          <med-select-field
            v-model="value.healthcardType"
            form-prop="healthcardType"
            :disabled="disabled"
            label="医保类型"
            :select-options="dictionary.insuranceDict"
          />
        </el-col>
        <el-col :span="4">
          <med-text-field
            v-model="value.healthcardNo"
            label="医保编号"
            form-prop="healthcardNo"
            :disabled="disabled"
            maxlength="20"
          />
        </el-col>

        <el-col :span="4">
          <med-text-field
            v-model="value.height"
            v-int="{ max: 300, min: 50 }"
            label="身高"
            form-prop="height"
            :disabled="disabled"
            maxlength="10"
            append="cm"
          />
        </el-col>
        <el-col :span="4">
          <med-text-field
            v-model="value.weight"
            v-float="{ max: 400, min: 2, scale: 1 }"
            label="体重"
            form-prop="weight"
            :disabled="disabled"
            maxlength="10"
            append="kg"
          />
        </el-col>
        <el-col :span="4">
          <med-select-field
            v-model="value.hospitalArea"
            form-prop="hospitalArea"
            :disabled="true"
            label="院区"
            :select-options="hospitalArea"
          />
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getBirthday, getSex } from '@/utils/common-tool'
import dateUtil from '@/utils/date-tool'
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
  name: 'BaseInfo',
  props: {
    value: {
      type: Object,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    admission: {
      type: Object,
      default: null
    },
    dataMain: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      regist: this.value,
      rules: {},

      status: {
        code: 'collapse',
        icon: 'el-icon-arrow-down',
        text: '展开'
      }
    }
  },
  computed: {
    ...mapGetters(['hospitalArea', 'dictionary']),
    comingTypeDict() {
      const comingDict = this.dictionary.comingDict
      if (comingDict && comingDict.length > 0) {
        // 空白病例 来源方式 全都有
        if (this.regist.infoComingType === '0') {
          return comingDict
        } else if (this.regist.infoComingType === '1') {
          // 急救 只有 120和转院
          return comingDict.filter(function(x) {
            return x.value !== '3' && x.value !== '4'
          })
        } else if (this.regist.infoComingType === '2') {
          // 急诊 只有 120、转院和自行来院
          return comingDict.filter(function(x) {
            return x.value !== '4'
          })
        } else if (this.regist.infoComingType === '3') {
          // 门诊 只有自行来院
          return comingDict.filter(function(x) {
            return x.value !== '1' && x.value !== '2' && x.value !== '4'
          })
        } else if (this.regist.infoComingType === '4') {
          // 门诊 只有 120、转院和住院
          return comingDict.filter(function(x) {
            return x.value !== '3'
          })
        }
      }
      return comingDict
    }
  },
  watch: {
    value: {
      handler(val) {
        this.regist = Object.assign({}, val)
      },
      deep: true,
      immediate: true
    }
  },
  async mounted() {},
  methods: {
    onBirthdayChanged(time) {
      this.value.age = dateUtil.calcAge(moment(time))
    },
    onIdcardChanged(val) {
      if (this.value && val) {
        const birthday = getBirthday(val)
        if (birthday) {
          this.value.birthday = birthday
          this.value.age = dateUtil.calcAge(birthday)
        }
        const sex = getSex(val)
        if (sex) this.value.gender = sex
        this.value.idcardType = '1'
      }
    },
    extendOrNot() {
      this.status =
        this.status.code === 'collapse'
          ? { code: 'extend', icon: 'el-icon-arrow-up', text: '收起' }
          : { code: 'collapse', icon: 'el-icon-arrow-down', text: '展开' }

      this.$emit('modelchanged', this.status.code)
    },
    validate() {
      return new Promise((resolve, reject) => {
        const formRef = this.$refs['basicform']
        formRef.validate((valid, err) => {
          const errors = Object.keys(err).reduce((arr, key) => {
            const label = formRef.fields.find(
              (f) => f.prop === key
            )?.label
            return arr.concat([
              {
                module: '基本信息',
                fieldName: label,
                message: '必填'
              }
            ])
          }, [])
          
          if (valid) {
            resolve(true)
          } else {
            reject({ errors })
          }
        })
      })
    },
    clearValidate() {
      this.$refs['basicform'].clearValidate()
    }
  }
}
</script>
