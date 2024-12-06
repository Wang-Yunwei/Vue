<template>
  <van-form>
    <div class="task-epidemiological-wrapper">
      <med-header title="新冠流调表" @backClick="$emit('back')" />
      <div class="scroll-box">
        <div :style="!canEdit ? 'pointer-events:none' : ''">
          <div class="info">
            <van-cell-group>
              <van-field required v-model="patientForm.name" label="姓名" :rules="[{ required: true, message: '请输入真实姓名' }]" />
              <van-field required v-model="epidemiologicalForm.t" label="体温" :rules="[{ required: true, message: '请输入体温' }]" />
              <van-field required v-model="epidemiologicalForm.tel" label="手机号码" :rules="[{ required: true, message: '请输入手机号码' }]" />
              <van-field required v-model="patientForm.cardNo" label="身份证号码" :rules="[{ required: true, message: '请输入身份证号码' }]" />
              <van-field required v-model="epidemiologicalForm.fullAddress" label="现住址精确到门牌" :rules="[{ required: true, message: '请输入现住址精确到门牌' }]" />
            </van-cell-group>
          </div>
          <div class="check">
            <p>
              最近14天内您是否有发热、干咳、乏力、鼻塞流涕、
              咽痛、肌痛、结膜炎、腹泻、嗅觉味觉减退或丧失 等症状？
            </p>
            <van-radio-group v-model="epidemiologicalForm.isFever" class="flex-c-s radio-btn-type">
              <van-radio v-for="item in flagList" :key="item.value" :name="item.value">
                {{ item.label }}
              </van-radio>
            </van-radio-group>
            <p>
              您最近14天内是否接触过新冠确诊者，或无症状感染 者，或密切接触者？
            </p>
            <van-radio-group v-model="epidemiologicalForm.isContact" class="flex-c-s radio-btn-type">
              <van-radio v-for="item in flagList" :key="item.value" :name="item.value">
                {{ item.label }}
              </van-radio>
            </van-radio-group>
            <p>
              您最近14天内是否有中高风险地区，或其他有新冠肺
              炎病例报告社区的旅行史或居住史？
            </p>
            <van-radio-group v-model="epidemiologicalForm.isTravel" class="flex-c-s radio-btn-type">
              <van-radio v-for="item in flagList" :key="item.value" :name="item.value">
                {{ item.label }}
              </van-radio>
            </van-radio-group>
            <p>
              您最近14天内是否有境外旅行史或居住史？
            </p>
            <van-radio-group v-model="epidemiologicalForm.isFtravel" class="flex-c-s radio-btn-type">
              <van-radio v-for="item in flagList" :key="item.value" :name="item.value">
                {{ item.label }}
              </van-radio>
            </van-radio-group>
            <p>
              您的健康码状态
            </p>
            <van-radio-group v-model="epidemiologicalForm.healthCode" class="flex-c-s radio-btn-type">
              <van-radio v-for="item in healthCodeList" :key="item.value" :name="item.value">
                {{ item.label }}
              </van-radio>
            </van-radio-group>
            <p>
              您的通信行程码状态
            </p>
            <van-radio-group v-model="epidemiologicalForm.tourCode" class="flex-c-s radio-btn-type">
              <van-radio v-for="item in tourCodeList" :key="item.value" :name="item.value">
                {{ item.label }}
              </van-radio>
            </van-radio-group>
          </div>
          <div class="tip">
            <p>
              1.如果您的体温≥37.3℃，或有咳嗽等呼吸道症状，或有腹
              泻的，或有不明原因乏力的，请您到发热门诊就诊；
            </p>
            <p>
              2.所有患者到医院就诊时，请全程正确佩戴口罩，不要佩戴
              有呼吸阀的口罩；
            </p>
            <p>
              3.请您配合填写流行病学调查表，根据《中国人民共和国传
              染病防治法》，请如实填写，不得瞒报、谎报。
            </p>
            <van-checkbox v-model="epidemiologicalForm.isInformed" name="1" shape="square">
              已知情同意
            </van-checkbox>
          </div>
          <div class="sign">
            <van-field class="imgField" required readonly label="流调人员签名" :placeholder="epidemiologicalForm.ereservers ? '已签，点击重签' : '去签名'
        " @click="signClick('ereservers')">
              <template #right-icon>
                <van-image :src="epidemiologicalForm.ereservers" width="100" height="100" fit="contain" v-if="epidemiologicalForm.ereservers" />
                <i class="iconfont iconicon1svg-18"></i>
              </template>
            </van-field>
            <van-field class="imgField" required readonly label="医护签名" :placeholder="epidemiologicalForm.medicalWorkers ? '已签，点击重签' : '去签名'
        " @click="signClick('medicalWorkers')">
              <template #right-icon>
                <van-image :src="epidemiologicalForm.medicalWorkers" width="100" height="100" fit="contain" v-if="epidemiologicalForm.medicalWorkers" />
                <i class="iconfont iconicon1svg-18"></i>
              </template>
            </van-field>
          </div>
          <div class="sub" v-if="canEdit">
            <van-button round type="info" block @click="onSubmitForm">
              提交新冠流调表
            </van-button>
          </div>
        </div>
      </div>
    </div>
    <van-popup v-model="drawerFlag" get-container="body" position="right" :style="{ width: '100%', height: '100%' }" :lock-scroll="false">
      <med-header title="签名" @backClick="drawerFlag = false" />
      <med-sign :fileName="patientId + signPa" @signSubmit="signSubmit" />
    </van-popup>
  </van-form>
</template>
<script>
import methodMixin from '@mixins/methodMixin'
import { mapGetters } from 'vuex'
import { attSave } from '@/api/attachment'

export default {
  name: 'Epidemiological',
  data() {
    return {
      fileTypes: [], // 文件类别
      drawerFlag: false,
      signPa: '',
      patientForm: {
        name: '', // 姓名
        cardNo: '' // 身份证号
      },
      epidemiologicalForm: {
        T: '', // 体温
        tel: '', // 手机号
        fullAddress: '', // 住址
        isFever: '', // 是否发热
        isContact: '', // 是否接触新冠确诊者
        isTravel: '', // 是否有中高风险区
        isFtravel: '', // 是否境外旅行史或居住史
        healthCode: '', // 健康码状态
        tourCode: '', // 行程码状态
        isInformed: '', // 知情同意
        ereservers: '', // 流调人员签名
        medicalWorkers: '' // 医护签名
      },
      flagList: [],
      healthCodeList: [],
      tourCodeList: []
    }
  },
  computed: {
    ...mapGetters(['patientId', 'missionStatus', 'medicalStatus']),
    canEdit() {
      return (
        !this.epidemiologicalForm.createTime && this.medicalStatus === '01'
      )
    }
  },
  created() {
    this.$router.afterEach(() => {
      window.scrollTo(0, 0)
    })
    this.getCodeList()
    this.queryByPatientId()
  },
  methods: {
    parseFileTypeCode(type) {
      return this.fileTypes.find(el => el.label === type)?.value
    },
    parseSignPa(s) {
      switch (s) {
        case 'medicalWorkers':
          return {
            type: this.parseFileTypeCode('医护签名'),
            remark: '医护签名'
          }
        case 'ereservers':
          return {
            type: this.parseFileTypeCode('流调人员签名'),
            remark: '流调人员签名'
          }
        default:
      }
    },
    async queryByPatientId() {
      if (this.patientId) {
        const res = await this.$api.mpeQueryByPatientId(
          this.patientId
        )
        this.epidemiologicalForm = {
          ...res.body.medPhepEpidemiologicalEntity
        }
        this.patientForm = { ...res.body.medPhepPatientsEntity }
      }
    },
    async getCodeList() {
      const res = this.getCodeListByKey([
        'PHFA_0061', // 是否
        'PHFA_0035', // 健康码状态
        'PHFA_0056', // 通信行程码
        'PHFA_0064' // 文件类别
      ])
      this.flagList = res.PHFA_0061
      this.healthCodeList = res.PHFA_0035
      this.tourCodeList = res.PHFA_0056
      this.fileTypes = res.PHFA_0064
    },
    async onSubmitForm() {
      if (!this.epidemiologicalForm.isInformed) {
        this.$notify({ type: 'warning', message: '未选择已知情同意' })
        return
      }
      if (!this.patientForm.name) {
        this.$notify({ type: 'warning', message: '未填写姓名' })
        return
      }
      if (!this.epidemiologicalForm.t) {
        this.$notify({ type: 'warning', message: '未填写体温' })
        return
      }
      if (!this.epidemiologicalForm.tel) {
        this.$notify({ type: 'warning', message: '未填写手机号' })
        return
      }
      if (!this.patientForm.cardNo) {
        this.$notify({ type: 'warning', message: '未填写身份证号' })
        return
      }
      if (!this.epidemiologicalForm.fullAddress) {
        this.$notify({ type: 'warning', message: '未填写现住址' })
        return
      }
      if (!this.epidemiologicalForm.ereservers) {
        this.$notify({ type: 'warning', message: '流调人员未签名' })
        return
      }
      if (!this.epidemiologicalForm.medicalWorkers) {
        this.$notify({ type: 'warning', message: '医护人员未签名' })
        return
      }

      if (this.missionStatus !== '5') {
        this.epidemiologicalForm.isInformed = '1'
        this.epidemiologicalForm.patientId = this.patientId
        this.epidemiologicalForm.createTime = this.$moment().format(
          'YYYY-MM-DD[T]HH:mm:ss'
        )
        this.patientForm.patientId = this.patientId
        var epidemiologicalSaveOrUpdateVo = {
          medPhepEpidemiologicalEntity: this.epidemiologicalForm,
          medPhepPatientsEntity: this.patientForm
        }
        const res = await this.$api.mpeSaveOrUpdate(
          epidemiologicalSaveOrUpdateVo
        )
        if (res.code === '000000') {
          this.$notify({
            type: 'success',
            message: '已成功提交新冠流调表'
          })
          this.$emit('back')
        }
      } else {
        this.$notify({ type: 'warning', message: '已提交病历' })
      }
    },
    signClick(pa) {
      this.drawerFlag = true
      this.signPa = pa
    },
    signSubmit(data) {
      setTimeout(async () => {
        var formData = new FormData()
        formData.append('file', data)
        let id = this.epidemiologicalForm?.id
        if (!id) {
          // 获取uuid
          const { body } = await this.$api.getUUID()
          id = body
        }
        formData.append('businessId', id)
        formData.append('remark', this.parseSignPa(this.signPa).remark)
        formData.append('fileType', this.parseSignPa(this.signPa).type)

        const res = await attSave(formData)
        this.$set(this.epidemiologicalForm, this.signPa, res.body)
      })
      this.drawerFlag = false
    }
  },
  mixins: [methodMixin]
}
</script>

<style lang="less" scoped>
.task-epidemiological-wrapper {
  width: 100%;
  overflow-x: hidden;
  padding: 36px 0;
  padding-bottom: 100px;

  .scroll-box {
    max-height: calc(100vh - 2.2rem);
    overflow: auto;
  }

  .check {
    background: #fff;
    margin-top: 20px;
    padding: 20px 30px 0;

    p {
      color: #202020;
      font-size: 30px;
      line-height: 1.5;
    }

    .van-radio {
      margin: 20px 0;
      margin-right: 20px;
      font-size: 26px;
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

    .sign {
      margin-top: 20px;
    }
  }

  .sub {
    background: #f2f4f5;
    padding-top: 50px;
    padding-bottom: 50px;

    .van-button {
      width: 90%;
      margin: 0 auto;
    }
  }

  .sign {
    .imgField {
      /deep/ .van-field__body {
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
