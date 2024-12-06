<template>
  <med-popup-container title="基本信息" v-bind="$attrs" v-on="$listeners" @backClick="goBack">
    <div class="basic" ref="basic">
      <van-form @failed="failedEvent" :show-error-message="false">
        <med-radio-button-field label="是否无名氏" v-model="form.patientRegist.hasName" :select-options="WHETHER" @change="getPatinetName" :disabled="readonly || !auth_patient" />
        <med-text-field label="姓名" v-model="form.patientRegist.name" required :maxlength="20" :rules="rules.name" :disabled="readonly || !auth_patient" />
        <med-radio-button-field label="性别" v-model="form.patientRegist.gender" :select-options="GENDER_0001" :rules="rules.gender" :disabled="readonly || !auth_patient" required />
        <med-radio-select-field label="来院方式" v-model="form.patientMain.visitType" :select-options="VISIT_0001" required :rules="rules.visitType" :disabled="readonly || !auth_patient" />
        <div v-if="form.patientMain.visitType === '05'" style="margin-left: 0.3rem;">
          <van-field label="其它来院方式" placeholder="请填写其它来院方式" v-model="form.patientMain.visitTypeOther" :disabled="readonly || !auth_patient" :maxlength="100" />
        </div>
        <van-field label="身份证号" v-model="form.patientRegist.idNumber" placeholder="请填写身份证号" :maxlength="18" @blur="IDChange(form.patientRegist.idNumber)" :disabled="readonly || !auth_patient">
          <template #right-icon>
            <van-icon name="scan" @click="scanIdCard('2')" size="30px" v-if="!readonly" />
          </template>
        </van-field>
        <med-radio-select-field label="年龄区间" v-model="form.patientRegist.ageRange" :select-options="AGE_0001" required :rules="rules.ageRange" :disabled="readonly || !auth_patient" @change="changAgeRange" />
        <van-field v-if="form.patientRegist.ageRange" v-model="form.patientRegist.age" label="年龄" type="number" maxlength="3" :placeholder="form.patientRegist.ageRange === '02' ? '请填写' : '请填写年龄'" required :rules="rules.age" :disabled="readonly || !auth_patient" @blur="blurAge('blur')" @input="$refs.basic.style.setProperty('--ageColor', '#323233')" id="age">
          <template #right-icon>
            {{ form.patientRegist.ageRange === "03" ? "天" : "岁" }}
            <span v-if="form.patientRegist.ageRange === '02'">
              &nbsp;&nbsp;&nbsp;
              <input v-model="form.patientRegist.ageMonth" placeholder="请填写" step="0.0000001" type="number" oninput="if (value.length > 2) value = value.slice(0, 2)" @blur="blurAge('blur')" @input="$refs.basic.style.setProperty('--ageMonthColor', '#323233')" clean class="age-month" />月
            </span>
          </template>
        </van-field>
        <med-radio-select-field label="卡类型" v-model="form.patientRegist.idcardType" :select-options="CARD_0001" :disabled="readonly || !auth_patient" />
        <van-field v-if="['2', '3', '4'].includes(form.patientRegist.idcardType)" label="卡号" v-model="form.patientRegist.identificationNo" placeholder="请填写卡号" :maxlength="20" :disabled="readonly || !auth_patient">
          <template v-if="form.patientRegist.idcardType === '2'" #right-icon>
            <van-icon name="scan" @click="scanIdCard('3')" size="30px" v-if="!readonly" />
          </template>
        </van-field>
        <med-text-field label="紧急联系人" v-model="form.patientRegist.emergencyContact" :maxlength="20" :disabled="readonly || !auth_patient" />
        <van-field label="联系电话" v-model="form.patientRegist.phoneNumber" placeholder="请填写联系电话" maxlength="11" @blur="val => validPhone(val, form.patientRegist.phoneNumber)" :disabled="readonly || !auth_patient" />
        <med-text-field label="家庭住址" v-model="form.patientRegist.homeAddress" maxlength="100" :disabled="readonly || !auth_patient" />
        <med-text-field label="详细地址" v-model="form.patientRegist.detailAddress" maxlength="100" :disabled="readonly || !auth_patient" />
        <med-number-field v-model.number="form.patientRegist.height" label="身高" unit="cm" v-float="{ scale: 1, min: 1, max: 300 }" :disabled="readonly || !auth_patient" />
        <med-number-field v-model.number="form.patientRegist.weight" label="体重" unit="kg" v-float="{ scale: 1, min: 1, max: 400 }" :disabled="readonly || !auth_patient" />
        <van-field label="所属院区" v-model="form.patientMain.hospitalAreaName" readonly :disabled="readonly || !auth_patient" />
      </van-form>
    </div>
  </med-popup-container>
</template>

<script>
import { mapGetters } from 'vuex'
import dictionariesMixin from '@mixins/dictionariesMixin'
import dateUtil from '@utils/dateUtil'
export default {
  name: 'basicInfo',
  inject: ['readonly'],
  model: {
    prop: 'show',
    event: '_change'
  },
  props: {
    data: {
      type: Object,
      default: () => { }
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  mixins: [dictionariesMixin],
  directives: {
    clear: {
      // 卸载组件时自动清除v-model值
      unbind: (...arg) => arg[2]?.data?.model?.callback(void 0)
    }
  },
  data() {
    return {
      isShowMpds: false,
      form: {
        patientMain: {},
        patientRegist: {}
      },
      rules: {
        name: [{ required: true, message: '姓名不能为空！' }],
        gender: [{ required: true, message: '性别不能为空！' }],
        visitType: [{ required: true, message: '来院方式不能为空！' }],
        ageRange: [{ required: true, message: '年龄区间不能为空！' }],
        age: [{ required: true, message: '年龄不能为空！' }]
      }
    }
  },
  computed: {
    ...mapGetters(['hospitalAreaList', 'hospitalId', 'loginUserInfo']),
    auth_patient() {
      // 权限控制 - 病历编辑 - 患者信息 sign = trauma-mr-patient
      return (
        this.loginUserInfo?.resources?.filter(
          el => el.sign === 'trauma-mr-patient'
        ).length > 0
      )
    }
  },
  methods: {
    changAgeRange() {
      // 修改年龄区间
      this.form.patientRegist.age = ''
      this.form.patientRegist.ageMonth = ''
    },
    validPhone(va, val) {
      if (val === '') return true
      var mobile = /^((\+86)|(86))?\d{11}$/g
      var telStandard = /^(\d{4}|\d{3})-?(\d{7,8})$/g
      var telBranch = /^(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})$/g
      const res =
        mobile.test(val) || telStandard.test(val) || telBranch.test(val)
      if (!res) {
        this.$notify({ type: 'warning', message: '联系电话填写不正确!' })
        return
      }
      return res
    },
    failedEvent(obj) {
      this.$notify({ type: 'warning', message: obj.errors[0].message })
    },
    inputAge() {
      this.$refs.basic.style.setProperty('--ageColor', '#323233')
    },
    blurAge(val) {
      // 输入年龄
      let result = true
      switch (this.form.patientRegist.ageRange) {
        case '01':
          // 6岁以上 (6-140)
          if (this.form.patientRegist.age < 7 || this.form.patientRegist.age > 140 || !/^[0-9]*$/.test(this.form.patientRegist.age)) {
            result = false
            this.$refs.basic.style.setProperty('--ageColor', 'rgb(238,10,36)')
            if (val === 'submit') {
              this.$notify({
                type: 'warning',
                message: '请输入7-140之间的整数'
              })
            }
          }
          break
        case '02':
          // 6岁及以下 岁(0-6) 月(0-12)
          let i = true
          if (this.form.patientRegist.age < 0 || this.form.patientRegist.age > 6 || !/^[0-9]*$/.test(this.form.patientRegist.age)) {
            this.$refs.basic.style.setProperty('--ageColor', 'rgb(238,10,36)')
            result = false
            i = false
            if (val === 'submit') {
              this.$notify({
                type: 'warning',
                message: '请输入0-6之间的整数'
              })
            }
          }
          if (this.form.patientRegist.ageMonth < 0 || this.form.patientRegist.ageMonth > 12 || !/^[0-9]*$/.test(this.form.patientRegist.ageMonth)) {
            this.$refs.basic.style.setProperty('--ageMonthColor', 'rgb(238,10,36)')
            result = false
            if (i && val === 'submit') {
              this.$notify({
                type: 'warning',
                message: '请输入0-12之间的整数'
              })
            }
          }
          break
        case '03':
          // 新生儿(一个月内)
          if (this.form.patientRegist.age < 0 || this.form.patientRegist.age > 30 || !/^[0-9]*$/.test(this.form.patientRegist.age)) {
            this.$refs.basic.style.setProperty('--ageColor', 'rgb(238,10,36)')
            result = false
            if (val === 'submit') {
              this.$notify({
                type: 'warning',
                message: '请输入1-30之间的整数'
              })
            }
          }
          break
        default:
          break
      }
      return result
    },
    getPatinetName(val) {
      // 获取无名氏
      if (val === '1') {
        this.$api.getPatientName().then(res => {
          if (res.code === '000000') {
            this.$set(this.form.patientRegist, 'name', res.body)
          }
        })
      }
    },
    saveBasicInfo() {
      // 保存基本信息
      if (this.form.patientRegist.ageRange === '03') {
        this.form.patientRegist.ageDay = this.form.patientRegist.age
      }
      this.$api.updatePatient(this.form)
    },
    scanIdCard(val) {
      // 1 扫描二维码  2 身份证识别  3 医保卡识别 4 本地身份证识别 5 暂留本地社保卡
      this.$bridge.callhandler('scanner', { type: [val] }, data => {
        if (!data && data.length < 1) {
          this.$toast('无效的扫描数据')
        } else {
          // result = {name: 'xxx', identity: '身份证号', cardNo: '社保卡号'}
          const result = JSON.parse(data)
          // 判断是否有姓名
          if (result.name) {
            this.$set(this.form.patientRegist, 'name', result.name)
            this.$set(this.form.patientRegist, 'hasName', '0')
          }
          // 判断是否有身份证号
          if (result.identity) {
            this.$set(this.form.patientRegist, 'idNumber', result.identity)
            this.IDChange(result.identity)
          }
          // 判断是否有社保卡号
          if (result.cardNo) {
            this.$set(this.form.patientRegist, 'identificationNo', result.cardNo)
          }
        }
      })
    },
    // 根据身份证号，计算年龄、年龄区间
    IDChange(val) {
      if (!val) return
      const idcard = dateUtil.toIdcard(val)
      if (!idcard.ok) {
        this.$notify({ type: 'warning', message: idcard.message })
        return
      }
      if (val.length === 18) {
        // 身份证号码第七位到第十四位 为出生日期；先验证填写日期是否正确
        if (!this.$moment(val.substr(6, 8)).isValid()) {
          this.$notify({
            type: 'warning',
            message: '身份证号码出生日期不正确'
          })
        } else {
          // 计算年龄
          const birth = this.$moment(val.substr(6, 8), 'YYYYMMDD') // 出生日期
          const nowTime = this.$moment() // 当前日期
          let year = nowTime.format('YYYY') - birth.format('YYYY') // 年数
          let months = nowTime.format('MM') - birth.format('MM') // 月数
          const days = birth.format('days') // 天数
          if (birth.format('MM') > nowTime.format('MM')) {
            // 出生月大于当前月则年份减一,则月份计算方式为 12 - 生日月 + 当前月
            year -= 1
            months = (12 - birth.format('MM')) + parseInt(nowTime.format('MM'))
          }
          if (year > 6) {
            // 六岁以上
            this.$set(this.form.patientRegist, 'ageRange', '01')
            this.$set(this.form.patientRegist, 'age', year)
          } else if (year < 1 && months < 1) {
            // 新生儿
            this.$set(this.form.patientRegist, 'ageRange', '03')
            this.$set(this.form.patientRegist, 'age', days)
          } else {
            // 六岁及以下
            this.$set(this.form.patientRegist, 'ageRange', '02')
            this.$set(this.form.patientRegist, 'age', year)
            this.$set(this.form.patientRegist, 'ageMonth', months)
          }
          // 获取性别
          const idCardLast = parseInt(val.charAt(16)) // 获取身份证号码的第 17 位数字
          if (idCardLast % 2 == 1) {
            // 判断奇偶性
            this.$set(this.form.patientRegist, 'gender', '1') // 男性
          } else {
            this.$set(this.form.patientRegist, 'gender', '2') // 女性
          }
        }
      }
    },
    goBack() {
      // 返回
      let result = true
      if (this.form.patientRegist.ageRange) {
        switch (this.form.patientRegist.ageRange) {
          case '01':
          case '03':
            if (this.form.patientRegist.age) {
              result = this.blurAge('submit') // 校验年龄的正确性
            }
            break
          case '02':
            if (this.form.patientRegist.age || this.form.patientRegist.ageMonth) {
              result = this.blurAge('submit') // 校验年龄的正确性
            }
            break
          default:
            break
        }
      }
      if (result) {
        this.$emit('close')
      }
    }
  },
  watch: {
    form: {
      deep: true,
      handler(newVal, oldVal) {
        if (this.isShow) {
          if (
            Object.getOwnPropertyNames(newVal).length ===
            Object.getOwnPropertyNames(oldVal).length
          ) {
            this.saveBasicInfo()
          }
        }
      }
    },
    'form.patientRegist.name'(val) {
      if (!val) {
        this.$set(this.form.patientRegist, 'hasName', '0')
      }
    },
    data() {
      // 处理院区
      const hal =
        this.hospitalAreaList.filter(
          el => el.value === this.form.patientMain.hospitalArea
        ) || []
      if (hal.length > 0) {
        this.data.patientMain.hospitalAreaName = hal[0].label
      }
      this.form = {
        ...this.form,
        ...this.data,
        hospitalId: this.hospitalId
      }
      // 判断年龄区间
      if (this.data.patientRegist.ageRange === '03') {
        this.form.patientRegist.age = this.form.patientRegist.ageDay
      }
    },
    isShow(val) {
      if (val && this.readonly) {
        this.$nextTick(() => {
          this.$refs.basic.style.setProperty(
            '--requiredColor',
            'rgb(189,189,189)'
          )
        })
      } else {
        this.$nextTick(() => {
          this.$refs.basic.style.setProperty('--requiredColor', 'red')
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.basic {
  --requiredColor: red;
  --activeColor: #ccc;
  --ageColor: #323233;
  --ageMonthColor: #323233;

  margin: 0 auto;
  height: calc(100vh - 1.8rem);
  overflow: auto;

  input::-webkit-input-placeholder {
    color: var(--activeColor);
  }

  /deep/ #age {
    color: var(--ageColor);
  }

  .age-month {
    width: 1.6rem;
    border: none;
    color: var(--ageMonthColor);
  }

  /deep/ .van-cell--required::before {
    color: var(--requiredColor);
  }

  .save-btn {
    position: fixed;
    bottom: 0.1rem;
  }
}
</style>
