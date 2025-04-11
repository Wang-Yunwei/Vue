<template>
  <med-view-container @return="back" title="建档信息">
    <div class="scroll-view">
      <van-form @submit="submit">
        <med-hint-field
          required
          v-model="ph.gcDetail.name"
          label="姓名"
          placeholder="请输入"
          maxlength="15"
          :rules="[{ required: true, message: '请填写姓名' }]"
        />
        <med-radio-button-field
          required
          label="性别"
          name="gender"
          placeholder="请输入"
          v-model="ph.gcDetail.gender"
          :select-options="dicData.genderOpts"
          :rules="[{ required: true, message: '请选择性别' }]"
        />
        <!-- <van-field
          required
          v-model="ph.gcDetail.gender"
          label="性别"
          placeholder="请输入"
          :rules="[{ required: true, message: '请选择性别' }]"
        >
          <template #input>
            <van-radio-group
              class="flex-c-s radio-btn-type"
              v-model="ph.gcDetail.gender"
            >
              <van-radio
                v-for="item in dicData.genderOpts"
                :key="item.value"
                :name="item.value"
              >
                {{ item.label }}
              </van-radio>
            </van-radio-group>
          </template>
        </van-field> -->
        <med-radio-select-field
          required
          v-model="ph.gcDetail.comingType"
          label="来院方式"
          placeholder="请输入"
          :rules="[{ required: true, message: '请选择来院方式' }]"
          :select-options="dicData.comingTypeOpts"
        >
        </med-radio-select-field>
        <med-radio-select-field
          v-if="ph.gcDetail.identificationCard"
          v-model="ph.gcDetail.idcardType"
          label="证件类型"
          :select-options="dicData.idCardTypeOpts"
        />
        <med-idcard-field
          v-model="ph.gcDetail.identificationCard"
          v-if="
            ph.gcDetail.identificationCard &&
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
          required
          label="院区"
          v-model="ph.gcDetail.hospitalArea"
          :select-options="hospitalArea"
          readonly
        ></med-radio-select-field>
        <!-- <van-field required label="院区">
          <template #input>
            <med-select
              v-model="ph.gcDetail.hospitalArea"
              :options="hospitalArea"
              readonly
            />
          </template>
        </van-field> -->
        <van-button
          native-type="submit"
          class="save-btn"
          block
          round
          type="info"
          icon-position="left"
          size="normal"
        >
          建档
        </van-button>
      </van-form>
    </div>
  </med-view-container>
</template>
<script>
import { Gc } from '@model/commonModel'
import dateMixin from '@mixins/dateMixin'
import { mapGetters } from 'vuex'
import { scanType, cardType } from '@constant/commonConstant'
import idCardMixin from '@mixins/idCardMixin'

export default {
  // 院前推送的建档
  name: 'preHospitalPush-createPatientHistory',
  mixins: [dateMixin, idCardMixin],
  data() {
    return {
      registId: '',
      patientHistory: undefined,
      // 新建的病历数据
      ph: {
        gcDetail: Gc()
      },
      cardType,
      scanType
    }
  },
  // 查询字典
  created() {
    this.parseRouteInfo()
  },
  computed: {
    ...mapGetters(['hospitalArea', 'curHospitalArea', 'dicData'])
  },
  methods: {
    /**
     * 获取急救的病历信息
     */
    parseRouteInfo() {
      const { query } = this.$route
      const { patientHistory } = query ?? ''
      console.log(patientHistory)
      if (!patientHistory) {
        return
      }
      this.patientHistory = patientHistory
      this.ph.gcDetail = {
        ...this.ph.gcDetail,
        name: patientHistory.name,
        age: Number.parseInt(patientHistory.age.replace('年龄', '')),
        gender: patientHistory.gender,
        comingType: patientHistory.comingType,
        firstaidNo: patientHistory.businessId,
        idcardType: '1',
        identificationCard: patientHistory.idCard
      }
      this.getBirthdayFromIdentification()
    },
    // 保存信息
    submit() {
      if (this.patientHistory) {
        // 创建空白病历
        this.createPatientHistory()
      }
    },
    /**
     * 根据院前推送数据创建病历
     */
    createPatientHistory() {
      this.$api.preHospitalPush
        .saveRecord({
          gcDto: {
            ...this.ph.gcDetail
          },
          patientDetailsDTO: {
            relationId: this.$route.query.patientHistory.relationId,
            type: this.$route.query.patientHistory.source === 'phep' ? 1 : 2,
            hospitalId: this.$route.query.patientHistory.toHospital,
            missionId: this.$route.query.patientHistory.missionId
          }
        })
        .then(res => {
          if (res.status !== 200) {
            this.$notify({ type: 'danger', message: '保存失败' })
            return
          }
          this.$router.push({
            path: '/gc/detail',
            query: { registId: res.result }
          })
        })
    },
    // 返回跳转
    back() {
      this.$router.go(-1)
    },
    getBirthdayFromIdentification() {
      if (this.ph.gcDetail.identificationCard) {
        const birthday = this.getBirthday(this.ph.gcDetail.identificationCard)
        if (birthday && this.$moment(birthday).isValid()) {
          this.ph.gcDetail.birthday = birthday
          this.ph.gcDetail.age = this.calcAge(birthday)
        }
      }
    },
    onChangeBirthday(val) {
      this.ph.gcDetail.age = this.calcAge(val)
    },
    onIdcardScanned(data) {
      if (data.identity) {
        // this.ph.gcDetail.identificationCard = data.identity
        this.ph.gcDetail.name = data.name
        if (data.sex) {
          this.ph.gcDetail.gender = data.sex === '男' ? '1' : '2'
        }
        if (data.birth) {
          this.ph.gcDetail.birthday = this.toBirthday(data.birth)
          this.onBirthdayChanged(this.ph.gcDetail.birthday)
        }
        if (!data.sex || !data.birth) this.onIdcardChanged(data.identity)
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
    }
  },
  watch: {
    curHospitalArea: {
      immediate: true,
      handler(val) {
        if (val) {
          this.ph.gcDetail.hospitalArea = val
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
