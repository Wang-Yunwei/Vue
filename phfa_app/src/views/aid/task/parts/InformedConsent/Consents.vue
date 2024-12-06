<template>
  <van-form>
    <div class="task-consents-wrapper">
      <med-header title="知情同意书" @backClick="$emit('back')" />
      <div class="scroll-box">
        <div :style="!canEdit ? 'pointer-events:none' : ''">
          <div class="info">
            <van-cell-group>
              <van-field required v-model="patientsForm.name" label="姓名" :rules="[{ required: true, message: '请输入真实姓名' }]" />
              <van-cell required title="性别">
                <van-radio-group v-model="patientsForm.gender" class="flex-c-s radio-btn-type">
                  <van-radio v-for="item in genderList" :key="item.value" :name="item.value">
                    {{ item.label }}
                  </van-radio>
                </van-radio-group>
              </van-cell>
              <van-field required v-model="patientsForm.age" label="年龄" :rules="[{ required: true, message: '请输入年龄' }]" />
              <van-field type="textarea" required label="初步诊断" v-model="consentsForm.diagnosis" :rules="[{ required: true, message: '请选择初步诊断' }]">
                <template #right-icon>
                  <van-icon name="arrow" class="select-icon" @click="diagnosisShow = true" />
                </template>
              </van-field>
              <van-cell title="病情判断">
                <template>
                  <med-select v-model="consentsForm.conditionGrade" :options="conditionGradeList" />
                </template>
              </van-cell>
              <med-date-picker v-model="consentsForm.tellTime" label="告知时间" />
            </van-cell-group>
          </div>
          <div class="willing">
            <div class="title">
              <span class="solid"></span><span>患者及家属意愿</span>
            </div>
            <van-checkbox-group class="check" required v-model="patientRequest">
              <van-checkbox name="1" shape="square">现场救治</van-checkbox>
              <van-checkbox name="2" shape="square">送往医院救治</van-checkbox>
              <van-cell>
                <med-select v-model="medPhepMedicalRecordsEntity.toHospital" :options="hospitalAreaList"></med-select>
              </van-cell>
              <van-checkbox name="3" shape="square">
                不同意现场救治
              </van-checkbox>
              <van-checkbox name="4" shape="square">
                不同意送往医院治疗
              </van-checkbox>
              <van-checkbox name="5" shape="square">
                不同意运送过程中采取的救治措施
              </van-checkbox>
              <van-field class="oth" rows="1" autosize type="textarea" v-model="consentsForm.treatmentMeasures" placeholder="救治措施" />
              <van-checkbox name="6" shape="square">其他</van-checkbox>
            </van-checkbox-group>
          </div>
          <div class="tip">
            <p>可能出现的风险</p>
            <p>
              1、运送途中因病情危重随时可能出现原有疾病加重诱发多器官病变甚至死亡；
            </p>
            <p>2、运送途中因交通、天气等不可抗拒因素可能延误治疗；</p>
            <p>
              3、本着救死扶伤的原则、尽其所能施救，因疾病变化是一
              个动态过程及存在个体差异、不对救治期望作任何保证；
            </p>
            <p>
              4、许多抢救操作为有创操作有可能出现副损伤，搬运、转
              运途中有可能出现病情变化甚至死亡；
            </p>
            <p>5、其它不可预料的意外。</p>
            <van-checkbox v-model="consentsForm.isInformed" shape="square">
              已知情同意
            </van-checkbox>
          </div>
          <div class="sign">
            <van-field class="imgField" required readonly label="患者签名" :placeholder="consentsForm.patientSignagure ? '已签，点击重签' : '去签名'
        " @click="signClick('patientSignagure')">
              <template #right-icon>
                <van-image :src="consentsForm.patientSignagure" width="100" height="100" fit="contain" v-if="consentsForm.patientSignagure" />
                <i class="iconfont iconicon1svg-18"></i>
              </template>
            </van-field>
            <van-field class="imgField" required readonly label="委托人签名" :placeholder="consentsForm.consignorSignagure ? '已签，点击重签' : '去签名'
        " @click="signClick('consignorSignagure')">
              <template #right-icon>
                <van-image :src="consentsForm.consignorSignagure" width="100" height="100" fit="contain" v-if="consentsForm.consignorSignagure" />
                <i class="iconfont iconicon1svg-18"></i>
              </template>
            </van-field>
            <van-field v-model="consentsForm.patientRelationship" label="与患者关系" placeholder="与患者关系" />
            <van-field class="imgField" required label="医护签名" :placeholder="consentsForm.hospitalSignagure ? '已签，点击重签' : '去签名'
        " @click="signClick('hospitalSignagure')">
              <template #right-icon>
                <van-image :src="consentsForm.hospitalSignagure" width="100" height="100" fit="contain" v-if="consentsForm.hospitalSignagure" />
                <i class="iconfont iconicon1svg-18"></i>
              </template>
            </van-field>
          </div>
          <van-button v-if="canEdit" round type="info" block style="width:90%;margin:0 auto;background:#444fdb;border-color:#444fdb;" @click="onSubmitForm">
            提交知情同意书
          </van-button>
          <transition name="moveR">
            <van-popup v-if="diagnosisShow" v-model="diagnosisShow" position="right" :style="{ width: '100%', height: '100%' }">
              <preliminaryDiagnosis @submit="submit" :list="diagnosisList" @backClick="diagnosisShow = false" />
            </van-popup>
          </transition>
          <med-time v-if="showPicker" @submit="onConfirm" @cancel="showPicker = false" />
        </div>
      </div>
    </div>
    <van-popup v-model="drawerFlag" position="right" :style="{ width: '100%', height: '100%' }">
      <med-header title="签名" @backClick="drawerFlag = false" />
      <med-sign :fileName="patientId + signPa" @signSubmit="signSubmit" />
    </van-popup>
  </van-form>
</template>
<script>
import methodMixin from '@mixins/methodMixin'
import { mapGetters, mapMutations } from 'vuex'
import * as types from '@store/mutations/mutations-types'
import preliminaryDiagnosis from '@views/aid/task/parts/Diagnosis/preliminaryDiagnosis'
import { attSave } from '@/api/attachment'

export default {
  components: { preliminaryDiagnosis },
  name: 'Consents',
  data() {
    return {
      fileTypes: [], // 文件类别
      signPa: '', // 签名参数
      drawerFlag: false,
      showPicker: false,
      diagnosisShow: false,
      genderList: [], // 性别list
      diagnosisList: [], // 初步诊断List
      conditionGradeList: [], // 病情判断List
      patientRequest: [],
      patientsForm: {
        // name: '', // 姓名
        // gender: '', // 性别
        // age: '' // 年龄
      },
      consentsForm: {
        diagnosis: '', // 初步诊断
        conditionGrade: '', // 病情判断
        tellTime: this.$moment().format('YYYY-MM-DD[T]HH:mm:ss'), // 告知时间
        patientRequest: '', // 患者及家属意愿
        isInformed: '', // 已知情同意
        patientSignagure: '', // 患者签名
        consignorSignagure: '', // 委托人签名
        patientRelationship: '', // 与患者关系
        hospitalSignagure: '', // 医护签名
        treatmentMeasures: '' // 救治措施
      },
      medPhepMedicalRecordsEntity: {
        toHospital: '' // 送往医院
      }
    }
  },
  created() {
    this.getCodeList()
    this.queryDiagnosisList()
    this.initDefaultInfo()
    if (this.patientId) {
      this.queryDetailByPatientId()
    }
  },
  computed: {
    ...mapGetters([
      'patientId',
      'patientInfo',
      'missionStatus',
      'hospitalId',
      'diagnosis',
      'medicalStatus',
      'hospitalAreaList'
    ]),
    canEdit() {
      return !this.consentsForm.createTime && this.medicalStatus === '01'
    },
    // diagnosis: {
    //   get() {
    //     const { diagnosis } = this.consentsForm
    //     // if (diagnosis) {
    //     //   const [typeId, value] = diagnosis.split('-')
    //     //   // 先找到疾病分类
    //     //   const typeObj = this.diagnosisList.find(o => typeId === o.value)
    //     //   if (typeObj) {
    //     //     // 再找到疾病对象
    //     //     const valueObj = typeObj.list.find(o => diagnosis === o.value)
    //     //     if (valueObj) {
    //     //       return valueObj.describe + '-' + valueObj.label
    //     //     }
    //     //   }
    //     // }
    //     return diagnosis
    //   },
    //   set(v) {
    //     this.$set(this.consentsForm, 'diagnosis', v)
    //   }
    // },
    conditionGrade() {
      if (this.consentsForm.conditionGrade) {
        const conditionGrade = this.conditionGradeList.find(
          item => item.value === this.consentsForm.conditionGrade
        )
        return conditionGrade.label
      }
      return ''
    }
  },
  methods: {
    ...mapMutations(types),
    initDefaultInfo() {
      this.patientsForm = {
        name: this.patientInfo.name,
        age: this.patientInfo.age,
        gender: this.patientInfo.gender,
        ...this.patientsForm
      }
    },
    parseSignPa(s) {
      switch (s) {
        case 'patientSignagure':
          return {
            type: this.parseFileTypeCode('患者签名'),
            remark: '患者签名'
          }
        case 'consignorSignagure':
          return {
            type: this.parseFileTypeCode('委托人签名'),
            remark: '委托人签名'
          }
        case 'hospitalSignagure':
          return {
            type: this.parseFileTypeCode('医护签名'),
            remark: '医护签名'
          }
        default:
      }
    },
    // 查询回显信息
    async queryDetailByPatientId() {
      if (this.patientId) {
        const res = await this.$api.mpcQueryDetailByPatientId(
          this.patientId
        )
        this.patientsForm = { ...res.body.medPhepPatientsEntity }

        if (res.body.medPhepConsentsEntity) {
          this.consentsForm = { ...res.body.medPhepConsentsEntity }
        } else {
          this.consentsForm.diagnosis =
            res.body.medPhepMedicalRecordsEntity.diagnosis
          this.consentsForm.conditionGrade =
            res.body.medPhepMedicalRecordsEntity.conditionGrade
        }
        if (res?.body?.medPhepConsentsEntity?.patientRequest) {
          this.patientRequest = res.body.medPhepConsentsEntity.patientRequest.split(
            '|'
          )
        }
        this.medPhepMedicalRecordsEntity.toHospital =
          res.body.medPhepMedicalRecordsEntity.toHospital
      }
    },
    // 查询初步诊断列表
    async queryDiagnosisList() {
      const res = await this.$api.getDictByCodes({
        hospitalId: this.hospitalId,
        code: ['PHFA_0057']
      })
      const resp = res.body || {}
      const arr = Object.keys(resp).map(key => {
        return {
          name: key,
          value: (resp[key][0].value || '').split('-')[0],
          list: resp[key]
        }
      })
      this.diagnosisList = arr
    },
    async onSubmitForm() {
      this.consentsForm.patientRequest = this.patientRequest.join('|')
      this.consentsForm.patientId = this.patientId
      this.patientsForm.patientId = this.patientId
      this.medPhepMedicalRecordsEntity.patientId = this.patientId
      const consentsSaveOrUpdateVo = {
        medPhepPatientsEntity: this.patientsForm,
        medPhepConsentsEntity: this.consentsForm,
        medPhepMedicalRecordsEntity: this.medPhepMedicalRecordsEntity
      }
      if (!this.consentsForm.isInformed) {
        this.$notify({ type: 'warning', message: '未选择已知情同意' })
        return
      }
      if (!this.patientsForm.name) {
        this.$notify({ type: 'warning', message: '未填写姓名' })
        return
      }
      if (!this.patientsForm.gender) {
        this.$notify({ type: 'warning', message: '未选择性别' })
        return
      }
      if (!this.patientsForm.age) {
        this.$notify({ type: 'warning', message: '未填写年龄' })
        return
      }
      if (!this.consentsForm.diagnosis) {
        this.$notify({ type: 'warning', message: '未填写初步诊断' })
        return
      }
      if (!this.consentsForm.patientSignagure) {
        this.$notify({ type: 'warning', message: '患者未签名' })
        return
      }
      if (!this.consentsForm.consignorSignagure) {
        this.$notify({ type: 'warning', message: '委托人未签名' })
        return
      }
      if (!this.consentsForm.hospitalSignagure) {
        this.$notify({ type: 'warning', message: '医护未签名' })
        return
      }

      if (this.missionStatus !== '5') {
        this.consentsForm.isInformed = '1'
        this.consentsForm.createTime = this.$moment().format(
          'YYYY-MM-DD[T]HH:mm:ss'
        )
        const res = await this.$api.mpcSaveOrUpdate(
          consentsSaveOrUpdateVo
        )
        if (res.code === '000000') {
          this.$notify({ type: 'success', message: '已成功提交知情同意' })
          this.$emit('back')
        }
      } else {
        this.$notify({ type: 'warning', message: '已提交病历' })
      }
    },
    parseFileTypeCode(type) {
      return this.fileTypes.find(el => el.label === type)?.value
    },
    // 查询字典表中信息
    getCodeList() {
      const res = this.getCodeListByKey([
        'PHFA_0001', // 性别
        'PHFA_0057', // 初步诊断
        'PHFA_0030', // 病情判断
        'PHFA_0064' // 文件类别
      ])
      this.genderList = res.PHFA_0001
      this.diagnosisList = res.PHFA_0057
      this.conditionGradeList = res.PHFA_0030
      this.fileTypes = res.PHFA_0064
    },
    signClick(pa) {
      this.drawerFlag = true
      this.signPa = pa
    },
    onConfirm(date) {
      this.consentsForm.tellTime = this.$moment(date).format(
        'YYYY-MM-DD[T]HH:mm:ss'
      )
      this.showPicker = false
    },
    submit(val) {
      this.consentsForm = {
        ...this.consentsForm,
        ...val
      }
    },
    signSubmit(data) {
      // 此时可以自行将文件上传至服务器
      setTimeout(async () => {
        var formData = new FormData()
        formData.append('file', data)
        let id = this.consentsForm?.id
        if (!id) {
          // 获取uuid
          const { body } = await this.$api.getUUID()
          id = body
        }

        formData.append('businessId', id)
        formData.append('remark', this.parseSignPa(this.signPa).remark)
        formData.append('fileType', this.parseSignPa(this.signPa).type)

        const res = await attSave(formData)
        this.consentsForm.id = id
        this.consentsForm[this.signPa] = res.body + '?v=' + Math.random()
        // 签名时间设置
        this.consentsForm[this.signPa + 'Time'] = this.$moment().format(
          'YYYY-MM-DD[T]HH:mm:ss'
        )
      })
      this.drawerFlag = false
    }
  },
  mixins: [methodMixin],
  watch: {
    patientId(v) {
      if (v) {
        this.queryDetailByPatientId()
      }
    },
    diagnosis: {
      handler(v) {
        this.$set(this.consentsForm, 'diagnosis', v)
      },
      immediate: true
    },
    'consentsForm.diagnosis': {
      handler(v) {
        this[types.SET_DIAGNOSIS](v)
      }
    }
  }
}
</script>

<style lang="less">
.task-consents-wrapper {
  width: 100%;
  height: 100vh;
  overflow-x: hidden;

  .scroll-box {
    max-height: calc(100vh - 2.2rem);
    overflow: auto;
  }

  .willing {
    margin-top: 10px;
    background: #fff;
    padding: 20px;

    .title {
      color: #202020;
      font-size: 30px;
      line-height: 2;
      border-bottom: 1px solid #dadada;
    }

    .check {
      margin-top: 20px;

      .van-checkbox {
        .van-checkbox__label {
          font-size: @font-md-size;
          line-height: 2.6;
          width: 100%;
          display: inline-block;
          border-bottom: 1px solid #dadada;
        }
      }

      .med-select-wrapper {
        font-size: @font-md-size;
        padding-left: 22px;
        display: flex;
        align-items: center;

        .med-select-value {
          // color: #b5b5b5;
          // line-height: 2;
        }
      }

      .oth {
        line-height: 1;
        padding-left: 54px;
        padding-top: 26px;
        padding-bottom: 26px;
      }
    }
  }

  .tip {
    padding: 30px;
    background: #f2f4f5;

    p {
      color: #5e74fe;
      font-size: 26px;
      line-height: 2;
    }

    .van-checkbox {
      margin-top: 20px;
      font-size: @font-md-size;
    }
  }

  .sign {
    .imgField {
      .van-field__body {
        align-items: flex-start;
      }
    }
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
</style>
