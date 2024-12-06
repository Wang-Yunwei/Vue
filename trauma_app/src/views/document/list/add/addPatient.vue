<template>
  <med-popup-container title="建档信息" v-bind="$attrs" v-on="$listeners">
    <div v-if="!auth_add">
      <van-empty description="未授权" :image="require('@assets/image/empty.png')" />
    </div>
    <div v-else class="add-patient" ref="tab_add">
      <van-form @submit="saveButton" @failed="failedClick">
        <med-radio-button-field v-model="form.hasName" label="是否无名氏" :selectOptions="WHETHER" @change="getPatinetName" />
        <van-field label="姓名" placeholder="请填写姓名" v-model="form.name" ref="inputName" :readonly="form.hasName === '1'" required :rules="[{ required: true }]" maxlength="20" />
        <med-radio-select-field label="来院方式" v-model="form.visitType" :select-options="VISIT_0001" required :rules="[{ required: true }]" />
        <van-field label="其他来院方式" v-model="form.visitTypeOther" placeholder="请填写其他来院方式" v-if="form.visitType === '05'" />

        <med-radio-button-field v-model="form.gender" label="性别" :selectOptions="GENDER_0001" required :rules="[{ required: true }]" />
        <van-field label="身份证号" v-model="form.idNumber" placeholder="请填写身份证号" @input="IDChange" maxlength="18">
          <template #right-icon>
            <van-icon name="scan" @click="scanIdCard" size="30px" />
          </template>
        </van-field>
        <med-radio-select-field label="年龄区间" v-model="form.ageRange" :select-options="AGE_0001" required :rules="[{ required: true }]" @change="changAgeRange" />
        <van-field v-if="form.ageRange" label="年龄" v-model="form.age" type="number" maxlength="3" :placeholder="form.ageRange === '02' ? '请填写' : '请填写年龄'" required :rules="[{ required: true }]" @blur="blurAge('blur')" @input="$refs.tab_add.style.setProperty('--ageColor', '#323233')" id="age">
          <template #right-icon>
            {{ form.ageRange === "03" ? "天" : "岁" }}
            <span v-if="form.ageRange === '02'">
              &nbsp;&nbsp;&nbsp;
              <input v-model="form.ageMonth" placeholder="请填写" type="number" maxlength="3" step="0.0000001" oninput="if (value.length > 2) value = value.slice(0, 2)" @blur="blurAge('blur')" @input="$refs.tab_add.style.setProperty('--ageMonthColor', '#323233')" clean class="age-month" />月
            </span>
          </template>
        </van-field>
        <med-radio-select-field label="院区" v-model="form.hospitalArea" :select-options="hospitalAreaList" required :rules="[{ required: true }]" />
        <van-cell style="margin-top: 0.3rem;">
          <van-button native-type="submit" round block color="#333bd2" style="width: 88%;margin: 0 auto;" :disabled="createButton">
            建档
          </van-button>
        </van-cell>
      </van-form>
    </div>
  </med-popup-container>
</template>
<script>
import * as types from '@/store/mutations-types'
import { mapGetters, mapMutations } from 'vuex'
import dictionariesMixin from '@mixins/dictionariesMixin'
export default {
  name: 'AddPatient',
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
      createButton: false,
      form: {}
    }
  },
  computed: {
    ...mapGetters(['hospitalAreaList', 'hospitalArea', 'loginUserInfo']),
    auth_add() {
      // 权限控制 - 建档 sign = trauma-mr-add
      return (
        this.loginUserInfo?.resources?.filter(el => el.sign === 'trauma-mr-add').length > 0
      )
    }
  },
  methods: {
    ...mapMutations([types.SET_REGIST_ID, types.SET_PATIENT_NAME]),
    changAgeRange() {
      // 修改年龄区间
      this.form.age = ''
      this.form.ageMonth = ''
    },
    failedClick() {
      // 校验表单异常后执行的function
      this.$refs.tab_add.style.setProperty('--activeColor', 'rgb(238,10,36)')
    },
    inputAge() {
      this.$refs.tab_add.style.setProperty('--ageColor', '#323233')
    },
    blurAge(val) {
      // 输入年龄
      let result = true
      switch (this.form.ageRange) {
        case '01':
          // 6岁以上 (6-140)
          if (this.form.age < 7 || this.form.age > 140 || !/^[0-9]*$/.test(this.form.age)) {
            result = false
            this.$refs.tab_add.style.setProperty('--ageColor', 'rgb(238,10,36)')
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
          if (this.form.age < 0 || this.form.age > 6 || !/^[0-9]*$/.test(this.form.age)) {
            this.$refs.tab_add.style.setProperty('--ageColor', 'rgb(238,10,36)')
            result = false
            i = false
            if (val === 'submit') {
              this.$notify({
                type: 'warning',
                message: '请输入0-6之间的整数'
              })
            }
          }
          if (this.form.ageMonth < 0 || this.form.ageMonth > 12 || !/^[0-9]*$/.test(this.form.ageMonth)) {
            this.$refs.tab_add.style.setProperty('--ageMonthColor', 'rgb(238,10,36)')
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
          if (this.form.age < 0 || this.form.age > 30 || !/^[0-9]*$/.test(this.form.age)) {
            this.$refs.tab_add.style.setProperty('--ageColor', 'rgb(238,10,36)')
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
            this.$set(this.form, 'name', res.body)
          }
        })
      }
    },
    saveButton() {
      // 保存按钮
      this.createButton = true
      const res = this.blurAge('submit')
      if (res) {
        if (this.form.ageRange === '03') {
          this.form.ageDay = this.form.age
        }
        if (this.form.source) {
          this.form.infoComingType = this.form.source
        }
        // 校验
        this.$api.addBasePatient(this.form).then(res => {
          if (res.code === '000000') {
            this[types.SET_REGIST_ID](res.body)
            this[types.SET_PATIENT_NAME](this.form.name)
            // 跳转到编辑页面
            this.$router.push({
              path: '/document/detail'
            })
            // 关闭当前页面
            this.$emit('close')
          }
        })
      }
    },
    scanIdCard() {
      // 1 扫描二维码  2 身份证识别  3 医保卡识别
      this.$bridge.callhandler('scanner', { type: ['2'] }, data => {
        if (!data) this.$toast('无效的扫描数据')
        const result = JSON.parse(data)
        if (result && Object.keys(result).length > 0) {
          this.$set(this.form, 'hasName', '0')
          // {name: 'xxx',nation:'汉',sex:'男',address:'住址',birth:'生日',image:'照片',identity:'身份证号码'}
          this.$set(this.form, 'idNumber', result.identity)
          this.$set(this.form, 'name', result.name)
          this.IDChange(result.identity)
        } else {
          this.$toast('不支持的扫码类型')
        }
      })
    },
    // 根据身份证号，计算年龄、年龄区间
    IDChange(val) {
      if (val.length === 18) {
        // 身份证号码第七位到第十四位 为出生日期；先验证填写日期是否正确
        if (!this.$moment(val.substr(6, 8)).isValid()) {
          this.$notify({
            type: 'warning',
            message: '身份证号码不正确'
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
            this.$set(this.form, 'ageRange', '01')
            this.$set(this.form, 'age', year)
          } else if (year < 1 && months < 1) {
            // 新生儿
            this.$set(this.form, 'ageRange', '03')
            this.$set(this.form, 'age', days)
          } else {
            // 六岁及以下
            this.$set(this.form, 'ageRange', '02')
            this.$set(this.form, 'age', year)
            this.$set(this.form, 'ageMonth', months)
          }
          // 获取性别
          const idCardLast = parseInt(val.charAt(16)) // 获取身份证号码的第 17 位数字
          if (idCardLast % 2 == 1) {
            // 判断奇偶性
            this.$set(this.form, 'gender', '1') // 男性
          } else {
            this.$set(this.form, 'gender', '2') // 女性
          }
        }
      }
    },
    initForm() {
      // 初始化表单
      this.form = {
        hasName: '0', // 是否无名氏,默认否
        hospitalArea: this.hospitalArea // 院区
      }
    }
  },
  watch: {
    isShow(val) {
      if (val) {
        this.createButton = false // 取消按钮置灰
        this.initForm()
        this.form = {
          ...this.form,
          ...this.data,
          visitType: this.data.comingType, // 来院方式
          idNumber: this.data.idCard, // 身份证号
          age: this.data.ageRange === '03' ? this.data.ageDay : this.data.age // 年龄
        }
        // 处理年龄
        if (this.data.idCard && !this.data.ageRange) {
          this.IDChange(this.data.idCard)
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.add-patient {
  --activeColor: #ccc;
  --ageColor: #323233;
  --ageMonthColor: #323233;

  width: 97%;
  margin: 0 auto;

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
}
</style>
