<template>
  <div class="pre-exam-basic-wrapper">
    <med-s-card title="基本信息" class="container-card no-divider">
      <template slot="extra">
        <div class="pre-exam-basic-card-btn flex-c-b">
          <div class="pre-exam-basic-card-btn-left flex-c-c">
            <med-button type="primary" size="small" shape="round" icon="icon_shenfenzheng">
              读身份证
            </med-button>
            <med-button type="primary" size="small" shape="round" icon="icon_jiuzhenka">
              读就诊卡
            </med-button>
            <med-button type="primary" size="small" shape="round" icon="icon_jiankangka">
              读健康卡
            </med-button>
          </div>
          <div class="pre-exam-basic-card-btn-right flex-c-c">
            <med-button type="primary" size="small" shape="round" icon="icon_saomiaocaiji">
              扫码采集
            </med-button>
            <med-button type="primary" size="small" shape="round" icon="icon_buluxinxi">
              补录信息
            </med-button>
            <med-button type="primary" size="small" shape="round" icon="icon_yuanqianjijiu">
              院前急救
            </med-button>
          </div>
        </div>
      </template>
      <a-form>
        <a-row type="flex">
          <a-col
            class="pre-exam-basic-left"
            :xl="4"
            :lg="6"
            :md="6"
            :sm="6"
            :xs="24">
            <div class="avatar">
              <img :src="defaultAvatar" alt="头像" />
            </div>
            <div class="info">
              <div>
                急诊编号：
              </div>
              <p :title="regId">
                {{ regId }}
              </p>
              <div>
                病历号：
              </div>
              <p :title="patientId">
                {{ patientId }}
              </p>
              <a-checkbox class="noinfo" v-model="form.isNoname" @change="handleIsNonameChange">三无患者</a-checkbox>
            </div>
          </a-col>
          <a-col
            class="pre-exam-basic-right"
            :xl="20"
            :lg="18"
            :md="18"
            :sm="18"
            :xs="24">
            <div class="pre-exam-basic-right-top">
              <med-s-form-model
                ref="ruleForm"
                :form="form"
                :dataSource="dataSource"
                :responsive="formResponsive"
                :gutter="0"
                :formLayout="formLayout"
              >
              </med-s-form-model>
            </div>
            <div class="pre-exam-basic-right-bottom">
              <div class="flex-c-b" style="max-width:770px">
                <p class="flex-c-c">
                  <span style="color:#009900">绿色通道：</span>
                  <med-s-radio buttonType :optionList="greenChannelList" v-model="channel" />
                </p>
                <p class="flex-c-c">
                  <span>其他：</span>
                  <med-s-radio buttonType :optionList="otherList" v-model="other" />
                </p>
              </div>
              <p class="flex-c-t">
                <span>来院方式：</span>
                <med-s-radio buttonType :optionList="approachList" v-model="arriveType"></med-s-radio>
              </p>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </med-s-card>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import moment from 'moment'
import { AgeInput } from '@/components'
import { queryByCodeList } from '@/api'
import sharedData from '../sharedData'

export default {
  name: 'PreExamBasic',
  props: {
    regId: { type: String, default: '' },
    detailInfo: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      sharedData,
      // regId: '',
      patientId: '',
      form: {
        triageTime: moment()
      },
      defaultAvatar: require('@/assets/images/preExam/portrait_default.png'),
      approachList: [],
      genderList: [],
      nationList: [],
      idcardTypeList: [],
      jobList: [],
      arriveType: '',
      greenChannelList: [],
      channel: '',
      otherList: [],
      other: '',
      // 针对不同分辨率，表单 整体布局（可理解为一行几个， 例 24 / 8，xl分辨率为一行3个）
      formResponsive: {
        xxl: 6,
        xl: 8,
        lg: 12,
        md: 12,
        sm: 24,
        xs: 24
      },
      // 针对不同分辨率，表单 label 和 输入框 宽度
      formLayout: {
        labelCol: {
          xl: 8,
          lg: 9,
          md: 9,
          sm: 5,
          xs: 5
        },
        wrapperCol: {
          xl: 16,
          lg: 15,
          md: 15,
          sm: 19,
          xs: 19
        }
      },
      wrapperCol: {
        span: 15
      }
    }
  },
  computed: {
    ...mapState({
      scoreMan: state => state.preExamScore.scoreMan
    }),
    ...mapGetters(['hospitalId']),
    // 表单数据源
    dataSource() {
      const { isNoname } = this.form
      return [
        {
          labelText: '姓名',
          type: 'text',
          placeholder: '请输入姓名',
          fieldName: 'name',
          required: true,
          wrongMsg: '请输入正确格式的姓名'
        },
        {
          labelText: '性别',
          type: 'radio',
          placeholder: '请选择性别',
          fieldName: 'gender',
          required: true,
          wrongMsg: '请选择性别',
          initialValue: '0',
          buttonType: true,
          optionList: this.genderList
        },
        {
          labelText: '民族',
          type: 'select',
          // mode: 'multiple',
          placeholder: '请选择民族',
          fieldName: 'nation',
          required: false,
          wrongMsg: '请选择民族',
          optionList: this.nationList
        },
        {
          labelText: '联系电话',
          type: 'text',
          placeholder: '请输入联系电话',
          fieldName: 'tel',
          required: !isNoname,
          wrongMsg: '请输入正确格式的联系电话'
        },
        {
          labelText: '证件类型',
          type: 'select',
          placeholder: '请选择证件类型',
          fieldName: 'idcardType',
          required: !isNoname,
          wrongMsg: '请选择证件类型',
          optionList: this.idcardTypeList
        },
        {
          labelText: '证件号码',
          type: 'text',
          placeholder: '请输入证件号码',
          fieldName: 'identificationCard',
          required: !isNoname,
          wrongMsg: '请输入正确格式的证件号码',
          trigger: 'enter',
          validator: (rule, value, cb) => {
            if (isNoname) {
              cb()
            } else {
              const valid = this.validatIdCardNo(value)
              if (!valid) {
                cb('证件号有误')
              }
              cb()
            }
          },
          change: this.handleIdNoChange
        },
        {
          labelText: '出生日期',
          type: 'datetime',
          placeholder: '请选择出生日期',
          fieldName: 'birthday',
          required: !isNoname,
          wrongMsg: '请选择出生日期'
        },
        {
          labelText: '年龄',
          type: 'text',
          placeholder: '请输入年龄',
          fieldName: 'regAge',
          required: !isNoname,
          wrongMsg: '请输入正确格式的年龄',
          customRender: h => {
            return (
              <AgeInput
                v-model={this.form.regAge}
                caption={this.form.regAgeCaption}
                on={{
                  ['update:caption']: val => {
                    this.$set(this.form, 'regAgeCaption', val)
                  }
                }}
                change={this.handleAgeChange}
                startDay={this.form.birthday}
                endDay={this.form.triageTime}
              />
            )
          }
        },
        {
          labelText: '分诊时间',
          type: 'datetime',
          placeholder: '请选择分诊时间',
          fieldName: 'triageTime',
          showTime: true,
          required: true,
          wrongMsg: '请选择分诊时间',
          customRender: h => {
            const momentVal = moment(this.form.triageTime)
            return <a-date-picker value={momentVal} onChange={this.onTriageTimeChange} showTime />
          }
        },
        {
          labelText: '职业',
          type: 'select',
          placeholder: '请选择职业',
          fieldName: 'job',
          required: false,
          wrongMsg: '请选择职业',
          optionList: this.jobList
        },
        {
          labelText: '住址',
          type: 'text',
          placeholder: '请输入住址',
          fieldName: 'address',
          required: !isNoname,
          wrongMsg: '请输入正确格式的住址'
        },
        {
          labelText: '备注',
          type: 'text',
          placeholder: '请输入备注',
          fieldName: 'describe',
          required: false,
          wrongMsg: '请输入正确格式的备注'
        }
      ]
    }
  },
  async created() {
    await this.getDictionaryData()
  },
  methods: {
    ...mapMutations(['SET_SCORE_MAN']),
    onTriageTimeChange(v) {
      console.log(v)
      this.form.triageTime = v.format('YYYY-MM-DD HH:mm:ss')
    },
    // 校验身份证号
    validatIdCardNo(value) {
      if (typeof value !== 'string') {
        return false
      }

      const p = /^[1-9]\d{5}(19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
      const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
      const code = value.substring(17)
      if (p.test(value)) {
        let sum = 0
        for (let i = 0; i < 17; i++) {
          sum += value[i] * factor[i]
        }
        if (parity[sum % 11] == code.toUpperCase()) {
          return true
        }
      }
      return false
    },

    // 获取字典数据
    async getDictionaryData() {
      const params = {
        codeList: [
          'gender', //性别
          'nation', //民族
          'idcardType', //证件类型
          'job', //职业
          'greenChannel', //绿色通道
          'otherList', //其他
          'toHospitalWay' //来院方式
        ],
        hospitalId: this.hospitalId
      }
      const res = await queryByCodeList(params)
      const {
        gender = [],
        nation = [],
        idcardType = [],
        job = [],
        greenChannel = [],
        otherList = [],
        toHospitalWay = []
      } = res.result || {}
      this.genderList = gender //性别
      this.nationList = nation //民族
      this.idcardTypeList = idcardType //证件类型
      this.jobList = job //职业
      this.greenChannelList = greenChannel //绿色通道
      this.otherList = otherList //其他
      this.approachList = toHospitalWay //来院方式
    },
    // 获取患者信息回显
    regDetails() {
      const data = this.detailInfo
      this.form = {
        ...this.form,
        ...data,
        isNoname: data.isNoname === '1'
      }
      // this.regId = data.regId // 急诊编号
      this.patientId = data.patientId // 病历号/患者档案号
      this.channel = data.channel // 绿色通道
      this.other = data.other // 其他
      this.arriveType = data.arriveType // 来院方式
      const arriveTypeItem = this.approachList.find(el => el.value === data.arriveType)
      this.sharedData.arriveType = arriveTypeItem?.label || '' // 来院方式
      this.SET_SCORE_MAN({
        patientName: (data.name || '') + '',
        patientAge: (data.regAge || '0') + '',
        patientGender: (data.gender || '') + ''
      })
    },
    async formSubmit() {
      // 触发验证,校验通过后拼装数据向父级抛送

      const result = {
        regId: this.regId, // 急诊编号
        patientId: this.patientId, // 病历号/患者档案号
        channel: this.channel, // 绿色通道
        other: this.other, // 其他
        arriveType: this.arriveType, // 来院方式
        ...this.form,
        isNoname: this.form.isNoname ? '1' : '0', // 是否三无人员
        // name: '', // 姓名
        // gender: '', // 性别
        // nation: '', // 民族
        // tel: '', // 联系电话
        // idcardType: '', // 证件类型
        // identificationCard: '', // 证件号
        // birthday: '', // 出生日期
        // regAge: 0, // 就诊时年龄
        // triageTime: '' // 分诊时间
        // job: '', // 职业
        // address: '', // 住址
        // describe: '', // 备注
      }

      const valid = await this.$refs.ruleForm.$refs.ruleForm.validate()
      if (valid) {
        return result
      }
    },
    // 勾选三无患者变化
    handleIsNonameChange(e) {
      const { checked } = e.target
      this.$set(this.form, 'name', checked ? '三无' + moment().format('YYYYMMDDHHmmss') : undefined)
    },
    // // 证件类型变化
    // handleIdcardTypeChange(type) {
    //   if (type === '01' && this.form.identificationCard) {
    //     this.handleIdNoChange({
    //       target: {
    //         value: this.form.identificationCard
    //       }
    //     })
    //   }
    // },
    // 证件号变化
    handleIdNoChange(e) {
      const { value } = e.target
      if (this.validatIdCardNo(value)) {
        const { birthDay, sex, age } = this.parseIdCardNoInfo(value)
        this.$set(this.form, 'birthday', birthDay)
        // this.$set(this.form, 'regAge', age)
        this.$set(this.form, 'gender', sex)
      }
    },
    // 根据字典label解析value
    matchDicValue(label, dicList) {
      return dicList.find(el => el.label === label)?.value || ''
    },
    // 解析身份证号里的信息
    parseIdCardNoInfo(id) {
      let birthDay = ''
      let sex = '不详'
      switch (id.length) {
        default:
        case 18:
          birthDay = id.slice(6, 14)
          sex = id[16] % 2 ? '男' : '女'
          break
        case 15:
          birthDay = '19' + id.slice(6, 12)
          sex = id[14] % 2 ? '男' : '女'
          break
      }
      const age = moment(this.form.triageTime).diff(moment(birthDay), 'years', true)
      const sexVal = this.matchDicValue(sex, this.genderList)
      return {
        birthDay: moment(birthDay),
        sex: sexVal,
        age
      }
    },
    handleAgeChange(val) {
      if (this.form.triageTime) {
        const birthDay = moment(moment(this.form.triageTime).subtract(val)).format('YYYY-MM-DD')
        console.log('birthDay', birthDay)
        this.$set(this.form, 'birthday', birthDay)
      }
    }
    // // 生日变化
    // handleBirthDayChange(val) {
    //   if (val) {
    //     this.$set(this.form, 'regAge', moment(this.form.triageTime).diff(moment(val), 'years', true))
    //   }
    // }
  },
  watch: {
    'form.regAge': {
      handler(age) {
        this.SET_SCORE_MAN({
          ...this.scoreMan,
          patientAge: age
        })
      }
    },
    'form.name': {
      handler(name) {
        this.SET_SCORE_MAN({
          ...this.scoreMan,
          patientName: name
        })
      }
    },
    'form.gender': {
      handler(sex) {
        this.SET_SCORE_MAN({
          ...this.scoreMan,
          patientGender: sex
        })
      }
    },
    arriveType(val) {
      const matched = this.approachList.find(ele => ele.value === val)
      if (matched) this.sharedData.arriveType = matched.label
    },
    detailInfo() {
      if (this.detailInfo?.name) {
        this.regDetails()
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~ant-design-vue/es/style/themes/default.less';

/deep/ .ant-card-extra {
  width: calc(100% - 230px);
  position: relative !important;
  padding-right: 20px !important;
}

.pre-exam-basic {
  &-card-btn {
    flex-wrap: wrap;

    .ant-btn {
      &:not(:last-child) {
        margin-right: 10px;
      }

      /deep/ .anticon {
        font-size: 20px;
        line-height: 24px;
      }
    }
  }

  &-wrapper {
    /deep/ .med-s-card-wrapper > .ant-card-body {
      padding: 10px 20px 20px;
    }

    .med-s-form-wrapper {
      /deep/ .ant-card-body {
        padding: 0;
      }
    }

    .pre-exam-basic-left {
      // padding: 0 10px 10px 0;
      width: 140px;

      .avatar {
        // margin: 0 auto;
        min-width: 140px;
        width: 140px;
        height: 160px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .info {
        width: 140px;
        margin-top: 7px;

        > div {
          color: #333333;
          font-size: 14px;
          line-height: 14px;
          margin-bottom: 6px;
        }

        p {
          word-break: break-all;
          margin: 0;
          color: #000;
          font-size: 16px;
          line-height: 16px;
          white-space: nowrap;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;

          &:not(:last-of-type) {
            margin-bottom: 10px;
          }
        }

        .noinfo {
          margin-top: 14px;
          color: #333333;

          /deep/ .ant-checkbox + span {
            padding-left: 10px;
          }
        }
      }
    }

    @media (max-width: @screen-sm) {
      .pre-exam-basic-left {
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .avatar {
          margin: 0;
        }

        .info {
          margin: 0 30px;
        }
      }
    }

    .pre-exam-basic-right {
      width: calc(100% - 140px);

      /deep/ .ant-radio-group {
        min-width: 190px;
      }

      &-top {
        /deep/.med-s-form-model-wrapper {
          > .ant-form {
            .ant-form-item .ant-form-item-control {
              min-width: unset;

              .ant-radio-button-wrapper {
                &.ant-radio-button-wrapper-checked {
                  background-color: #a1a1a1;
                  border-color: #a1a1a1;
                  color: #fff;
                }

                &:nth-of-type(1) {
                  color: #02b6e9;
                  border-color: #02b6e9;

                  &.ant-radio-button-wrapper-checked {
                    background-color: #02b6e9;
                    color: #fff;
                  }
                }

                &:nth-of-type(2) {
                  color: #ff6666;
                  border-color: #ff6666;

                  &.ant-radio-button-wrapper-checked {
                    background-color: #ff6666;
                    color: #fff;

                    &:focus-within {
                      box-shadow: 0 0 0 3px rgba(255, 102, 102, 0.1);
                    }
                  }
                }
              }
            }
          }
        }
      }

      &-bottom {
        padding-left: 28px;

        div {
          flex-wrap: wrap;
        }
      }
    }
  }
}
</style>
