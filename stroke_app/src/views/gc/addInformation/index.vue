<template>
  <med-view-container @return="jumpToDetails" title="建档信息">
    <template #right-part>
      <!-- <div @click.stop>
        <i class="iconfont iconicon1-281" @click="startVoiceInput" />
      </div> -->
    </template>
    <div class="scroll-view">
      <div class="content-wrapper" sticky :offset-top="126">
        <van-form @submit="submit">
          <med-hint-field
            required
            v-model="ph.gcDetail.name"
            label="姓名"
            placeholder="请输入"
            maxlength="15"
            :rules="[{ required: true, message: '必填' }]"
          />
          <med-radio-button-field
            required
            v-model="ph.gcDetail.gender"
            label="性别"
            :rules="[{ required: true, message: '必填' }]"
            :selectOptions="dicData.genderOpts"
          >
          </med-radio-button-field>
          <med-radio-select-field
            required
            v-model="ph.gcDetail.comingType"
            label="来院方式"
            :rules="[{ required: true, message: '必填' }]"
            :selectOptions="dicData.comingTypeOpts"
          />
          <med-radio-select-field
            v-model="ph.gcDetail.idcardType"
            label="证件类型"
            :select-options="dicData.idCardTypeOpts"
          />
          <med-idcard-field
            v-model="ph.gcDetail.identificationCard"
            v-if="
              ph.gcDetail.idcardType !== '' &&
                ph.gcDetail.idcardType !== this.cardType.unknown
            "
            label="证件号"
            :scan-type="[
              ph.gcDetail.idcardType === this.cardType.idCard
                ? scanType.idCard
                : scanType.cvcard
            ]"
            :show-scan="
              ph.gcDetail.idcardType === this.cardType.idCard ||
                ph.gcDetail.idcardType === this.cardType.citizenCard
            "
            @scanned="onIdcardScanned"
            @change="onIdcardChanged"
          />
          <med-date-picker
            v-model="ph.gcDetail.birthday"
            label="出生日期"
            type="date"
            display-formatter="YYYY-MM-DD"
            clearable
            @_change="onChangeBirthday"
          />
          <med-number-field
            required
            :rules="[{ required: true }]"
            v-model.number="ph.gcDetail.age"
            label="年龄"
            unit="岁"
          />
          <med-radio-select-field
            v-model="ph.gcDetail.hospitalArea"
            label="院区"
            :rules="[{ required: true, message: '必填' }]"
            :select-options="hospitalArea"
          />
          <!--          <van-field
            label="门急诊号"
            placeholder="请输入"
            v-model="ph.gcDetail.outPatientNo"
          />
          <van-field
            label="住院号"
            placeholder="请输入"
            v-model="ph.gcDetail.admissionNo"
          />-->
          <van-button
            class="save-btn"
            block
            round
            type="info"
            icon-position="left"
            size="normal"
            v-if="$entitled('mr-add')"
          >
            &nbsp;&nbsp; 建档 &nbsp;&nbsp;
          </van-button>
        </van-form>
      </div>
    </div>
  </med-view-container>
</template>
<script>
import {
  Gc,
  GcCure,
  GcFirstAid,
  GcMh,
  GcSign,
  GcTriage
} from '@model/commonModel'
import dateMixin from '@mixins/dateMixin'
import hospitalMixin from '@mixins/hospitalMixin'
import { mapGetters, mapMutations } from 'vuex'
import * as types from '@store/mutations/mutations-types'
import { removeIfEmpty } from '@utils/commonUtil'
import { scanType, cardType } from '@constant/commonConstant'
import idCardMixin from '@mixins/idCardMixin'
import loadingMixin from '@mixins/loadingMixin'

export default {
  name: 'addInformation',
  components: {},
  // type就是infoComingType
  props: ['patientData', 'type'],
  mixins: [dateMixin, hospitalMixin, loadingMixin, idCardMixin],
  data() {
    return {
      registId: this.$route.query.registId,
      patientHistory: undefined,
      // 新建的病历数据
      ph: {
        gcDetail: Gc(), // 主表
        gcFirstAid: GcFirstAid(), // 急救信息
        gcTriage: GcTriage(), // 分诊信息
        gcMh: GcMh(), // 病史记录
        gcCure: GcCure(), // 治疗
        gcSign: GcSign(), // 生命体征
        source: '',
        registId: '',
        medSwmGcTriage: ''
      },
      campusList: [] /* 院区 */,
      details: {
        hospitalId: '',
        relationId: '',
        type:
          this.$route.query?.type ||
          this.$route.query?.patientHistory?.comingType ||
          this.type
      },
      cardType,
      scanType
    }
  },
  // 查询字典
  created() {
    this.parseRouteInfo()
    this.onVoiceInputEnd()
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'hospitalId',
      'hospitalArea',
      'curHospitalArea',
      'dicData'
    ])
  },
  methods: {
    ...mapMutations(types),
    /**
     * 获取急救的病历信息
     */
    parseRouteInfo() {
      this.patientHistory = undefined
      this.details = {
        type:
          this.$route.query?.type ||
          this.$route.query?.patientHistory?.comingType ||
          this.type
      }
      this.ph = {
        gcDetail: {
          ...Gc(),
          hospitalId: this.hospitalId,
          hospitalArea: this.curHospitalArea,
          createName: this.userInfo.name
        }, // 主表
        gcFirstAid: GcFirstAid(), // 急救信息
        gcTriage: GcTriage(), // 分诊信息
        gcMh: GcMh(), // 病史记录
        gcCure: GcCure(), // 治疗
        gcSign: GcSign(), // 生命体征
        source: '',
        registId: ''
      }
      const { query } = this.$route
      const patientHistory = query?.patientHistory || this.patientData

      this.patientHistory = patientHistory
      this.ph.gcDetail = {
        ...this.ph.gcDetail,
        ...patientHistory?.gcDetail
      }
      if (!patientHistory) {
        return
      }
      this.fillAdditionalFields(patientHistory)
    },
    async fillAdditionalFields(patientHistory) {
      this.details.hospitalId = this.hospitalAndArea()
      this.details.relationId = patientHistory.relationId

      const response = await this.$api.basicInfo.getPatientDetails(
        this.details
      )
      if (response.status === 202) {
        this.$notify({
          type: 'warning',
          message: response.message || '无法获取患者信息'
        })
        return
      }
      const result = response.result
      this.ph = {
        gcDetail: result.medswmgc,
        gcFirstAid: result.medswmgcfirstaid,
        gcTriage: result.medSwmGcTriage,
        gcMh: result.medswmgcmh,
        gcCure: result.medswmgccure,
        gcSign: result.medswmgcsign,
        medSwmGcOutcome: result.medSwmGcOutcome,
        registId: '',
        source: '0'
      }
      if (this.ph.gcDetail.identificationCard) {
        const birthday = this.getBirthday(this.ph.gcDetail.identificationCard)
        if (birthday && this.$moment(birthday).isValid()) {
          this.ph.gcDetail.birthday = birthday
        }
      }
    },
    onSubmit(values) {},
    // 保存信息
    submit() {
      // 设置来院方式
      this[types.SET_COMINGTYPE](this.ph.gcDetail.comingType)
      if (!this.patientHistory) {
        // 创建空白病历
        this.createEmpty()
      } else {
        this.addPatientDetails()
      }
    },
    addPatientDetails() {
      // 删除参数中空的对象
      removeIfEmpty(this.ph, [
        'gcDetail',
        'gcFirstAid',
        'gcTriage',
        'gcMh',
        'gcCure',
        'gcSign',
        'medSwmGcTriage'
      ])
      this.ph.gcDetail.hospitalId = this.hospitalId
      this.ph.gcDetail.cometype = '1'
      if (this.type && this.ph.gcDetail.infoComingType === '') {
        this.ph.gcDetail.infoComingType = this.type
      }
      this.ph.registId = this.registId
      switch (this.type) {
        case 1: // 急救 呼救时间
          this.ph.gcFirstAid.callTime = this.patientData.time
          break
        case 2: // 给分诊时间赋值
          this.ph.gcTriage.triageTime = this.patientData.time
          break
        case 3: // 门诊 门诊时间
          break
        case 4: // 住院入院时间
          break
      }
      this.$api.basicInfo.addPatientDetails(this.ph).then(({ result }) => {
        if (!result) {
          this.$notify({ type: 'danger', message: '保存失败' })
          return
        }
        if (this.$route.path === '/gc/patientList') {
          // 进入遍历编辑页面
          this.$emit('enterEdit', result)
        } else if (
          this.$route.path === '/gc/preHospitalPush/createPatientHistory'
        ) {
          this.$router.push({
            path: '/gc/detail',
            query: { registId: result }
          })
        } else {
          this.$emit('back')
        }
      })
    },
    /**
     * 创建空白病历
     */
    createEmpty() {
      this.$api.basicInfo
        .insertBasicInformation(this.ph.gcDetail)
        .then(({ result }) => {
          // 进入遍历编辑页面
          if (result) {
            this.$emit('enterEdit', result)
          }
        })
    },
    // 返回跳转
    jumpToDetails() {
      if (
        this.$route.path === '/gc/addInformation' ||
        this.$route.path === '/gc/preHospitalPush/createPatientHistory'
      ) {
        this.$router.go(-1)
      } else {
        this.$emit('back')
      }
    },
    onIdcardScanned(data) {
      // 身份证处理
      if (data.identity) {
        this.ph.gcDetail.name = data.name
        if (data.sex) {
          this.ph.gcDetail.gender = data.sex === '男' ? '1' : '2'
        }
        if (data.birth) {
          this.ph.gcDetail.birthday = this.toBirthday(data.birth)
          this.onBirthdayChanged(this.ph.gcDetail.birthday)
        }
        if (!data.sex || !data.birth) this.onIdcardChanged(data.identity)
        if (data.nation) {
          if (data.nation === '汉') this.ph.gcDetail.nation = '01'
        }
      }
      // 证件类型
      this.ph.gcDetail.idcardType =
        data.type === this.scanType.idCard
          ? this.cardType.idCard
          : this.cardType.citizenCard
    },
    onIdcardChanged(val) {
      if (this.ph.gcDetail && val) {
        var flag = false
        const birthday = this.getBirthday(val)
        if (birthday && this.$moment(birthday).isValid()) {
          flag = true
          this.ph.gcDetail.birthday = birthday
          this.ph.gcDetail.age = this.calcAge(birthday)
          const sex = this.getSex(val)
          if (sex) this.ph.gcDetail.gender = sex
        }
        this.ph.gcDetail.idcardType = flag
          ? this.cardType.idCard
          : this.cardType.citizenCard
      }
    },
    onBirthdayChanged(time) {
      this.ph.gcDetail.age = this.calcAge(this.$moment(time))
    },
    startVoiceInput() {
      this.$bridge.startVoiceInput()
    },
    onVoiceInputEnd: function() {
      console.log('regist onVoiceInputEnd')
      const msg = this.$bridge.onVoiceInputEnd(res => {
        const _res = this.exactVoice(res)
        console.log('onVoiceInputEndcallback', res, _res)
      })
      console.log('onVoiceInputEnd', msg)
    },
    exactVoice(str) {
      let age
      let gender = ''
      let name = ''
      let birdthDay = ''

      const agePattern = /年龄\d+岁?/i
      var res = agePattern.exec(str)
      if (res && res.length > 0) {
        age = res[0].replace('年龄', '').replace('岁', '')
        str = str.replace(res[0], '')
      }

      const sexPattern = /性别[男女]/i
      res = sexPattern.exec(str)
      if (res && res.length > 0) {
        gender = res[0].replace('性别', '')
        str = str.replace(res[0], '')
      }

      const birthdayPattern = /出生日期\d{4}年\d{1,2}月\d{1,2}日/i
      res = birthdayPattern.exec(str)
      if (res && res.length > 0) {
        birdthDay = res[0]
          .replace('出生日期', '')
          .replace('年', '-')
          .replace('月', '-')
          .replace('日', '')
        str = str.replace(res[0], '')
      }

      const namePattern = /姓名\W{1,4}/i
      res = namePattern.exec(str)
      if (res && res.length > 0) {
        name = res[0]
          .replace('姓名', '')
          .replaceAll(',', '')
          .replaceAll('，', '')
        str = str.replace(res[0], '')
      }

      this.ph.gcDetail.name = name
      this.ph.gcDetail.age = age
      this.ph.gcDetail.gender = gender === '男' ? '1' : '2'
      this.ph.gcDetail.birthday = birdthDay

      return {
        age,
        gender,
        name,
        birdthDay
      }
    },
    onChangeBirthday(val) {
      this.ph.gcDetail.age = this.calcAge(val)
    }
  },
  watch: {
    curHospitalArea: {
      immediate: true,
      handler(val) {
        if (val) {
          this.$set(this.ph.gcDetail, 'hospitalArea', val)

          // this.ph.gcDetail.hospitalArea = val
          this.$forceUpdate()
        }
      }
    },
    patientData() {
      this.parseRouteInfo()
    },
    type() {
      this.parseRouteInfo()
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
