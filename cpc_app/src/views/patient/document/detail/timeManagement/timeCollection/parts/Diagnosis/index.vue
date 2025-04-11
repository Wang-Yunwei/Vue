<template>
  <div class="time-content-wrapper">
    <van-cell-group>
      <med-title title="接诊" />
      <med-fast-date-field
        class="red-label"
        required
        v-model="main.attackTime"
        label="发病"
        :type="main.isAttackUncertain === '1' ? 'date' : 'datetime'"
        :formatter="
          main.isAttackUncertain === '1' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm'
        "
        v-if="
          this.admission.comeType === '3' || this.admission.comeType === '4'
        "
        :disabled="disabled"
        @confirm="onMainChanged"
      />
      <med-radio-button-field
        v-model="main.isAttackUncertain"
        :disabled="disabled"
        label="发病无法精确到分钟"
        required
        v-if="
          this.admission.comeType === '3' || this.admission.comeType === '4'
        "
        :select-options="yesOrNoDic"
      />
      <med-radio-select-field
        v-model="main.isTimearea"
        :disabled="disabled"
        required
        :rules="[{ required: true, message: '请选择发病区间' }]"
        label="发病区间"
        :select-options="attackZoneDic"
        class="font-color"
        v-if="
          (this.admission.comeType === '3' ||
            this.admission.comeType === '4') &&
            this.main.isAttackUncertain === '1'
        "
        @confirm="onMainChanged"
      >
      </med-radio-select-field>
      <med-fast-date-field
        class="red-label"
        required
        v-model="admission.arrivedHospitalTime"
        label="到达医院大门"
        v-if="this.admission.comeType === '3'"
        :disabled="disabled"
        @confirm="onAdmissionChanged"
      />
      <med-fast-date-field
        class="red-label"
        required
        v-model="admission.fmcTime"
        label="首次医疗接触"
        v-if="this.admission.comeType === '3'"
        :disabled="disabled"
        @confirm="onAdmissionChanged"
      />
      <med-fast-date-field
        class="red-label"
        required
        v-model="admission.admissionTime"
        label="院内首诊医师接诊"
        :disabled="disabled"
        @confirm="onAdmissionChanged"
      />
      <med-fast-date-field
        class="red-label"
        required
        v-model="admission.afterFmcTime"
        label="本次发病后首次医疗接触"
        v-if="this.admission.comeType === '4'"
        :disabled="disabled"
        @confirm="onAdmissionChanged"
      />
      <med-fast-date-field
        class="red-label"
        v-model="admission.leaveAddressTime"
        label="离开发病现场"
        v-if="this.admission.comeType === '4'"
        :disabled="disabled"
        @confirm="onAdmissionChanged"
      />

      <med-title title="院内心电图" style="margin-top: 4px;" />
      <med-fast-date-field
        class="red-label"
        required
        v-model="ecg.checkTime"
        label="院内首份心电图"
        :disabled="disabled"
        @confirm="onEcgChanged"
      />
      <med-fast-date-field
        class="red-label"
        required
        v-model="ecg.diagnosisTime"
        label="心电图诊断"
        :disabled="disabled"
        @confirm="onEcgChanged"
      />
      <med-fast-date-field
        class="red-label"
        required
        v-model="admission.ecgTransmissionTime"
        label="接收120/网络医院心电图"
        :disabled="disabled"
        @confirm="onAdmissionChanged"
      />

      <med-title title="肌钙蛋白" style="margin-top: 4px;" />
      <med-fast-date-field
        class="red-label"
        required
        v-model="creatinineprotein.drawBloodTime"
        label="肌钙抽血完成"
        @confirm="onCtnChanged"
      />
      <med-fast-date-field
        class="red-label"
        required
        v-model="creatinineprotein.reportTime"
        label="获得报告"
        @confirm="onCtnChanged"
      />

      <med-title title="辅助检查" style="margin-top: 4px;" />
      <med-fast-date-field
        class="red-label"
        required
        v-model="screenage.noticeTime"
        label="CT通知"
        :disabled="disabled"
        @confirm="onCTChanged"
      />
      <med-fast-date-field
        class="red-label"
        required
        v-model="screenage.enterTime"
        label="CT室完成准备"
        :disabled="disabled"
        @confirm="onCTChanged"
      />
      <med-fast-date-field
        v-model="screenage.checkTime"
        label="CT扫描开始"
        :disabled="disabled"
        @confirm="onCTChanged"
      />
      <med-fast-date-field
        v-model="screenage.reportTime"
        label="CT报告"
        :disabled="disabled"
        @confirm="onCTChanged"
      />
      <med-fast-date-field
        v-model="screenageCC.noticeTime"
        label="通知彩超室"
        :disabled="disabled"
        @confirm="onCDUChanged"
      />
      <med-fast-date-field
        v-model="screenageCC.checkTime"
        label="彩超检查"
        :disabled="disabled"
        @confirm="onCDUChanged"
      />
      <med-fast-date-field
        v-model="screenageCC.reportTime"
        label="彩超出结果"
        :disabled="disabled"
        @confirm="onCDUChanged"
      />

      <med-title title="会诊" style="margin-top: 4px;" />
      <med-fast-date-field
        required
        class="red-label"
        v-model="inspection.noticeConsultantTime"
        label="通知心内科会诊"
        :disabled="disabled"
        @confirm="onInspectionChanged"
      />
      <med-fast-date-field
        required
        class="red-label"
        v-model="inspection.consultantTime"
        label="心内科会诊"
        @confirm="onInspectionChanged"
      />
      <med-fast-date-field
        v-model="inspection.cscNoticeTime"
        label="通知心外科会诊"
        :disabled="disabled"
        @confirm="onInspectionChanged"
      />
      <med-fast-date-field
        v-model="inspection.cscTime"
        label="心外科会诊"
        :disabled="disabled"
        @confirm="onInspectionChanged"
      />
      <med-title title="初步诊断" style="margin-top: 4px;" />
      <med-fast-date-field
        class="red-label"
        required
        v-model="inspection.diagnosisTime"
        label="初步诊断"
        :disabled="disabled"
        @confirm="onInspectionChanged"
      />
      <med-fast-date-field
        class="red-label"
        required
        v-model="inspection.graceRehazardTime"
        label="再次危险分层"
        :disabled="disabled"
        @confirm="onInspectionChanged"
      />
    </van-cell-group>
  </div>
</template>
<script>
import dateMixin from '@mixins/dateMixin'
import { dicConstant } from '@/constant/commonConstant'
import { debounce } from 'lodash'
import moment from 'moment'

export default {
  mixins: [dateMixin],
  props: {
    disabled: {
      required: false,
      type: Boolean
    }
  },
  data() {
    return {
      dateShow: false,
      checkup: false,
      attackZoneDic: [],
      yesOrNoDic: [],
      codeList: [dicConstant.attackZoneCode],
      registId: this.$route.query.registId,
      main: {
        // 患者
        registId: '',
        isAttackUncertain: '',
        attackTime: '',
        isTimearea: ''
      },
      admission: {
        // 接诊
        registId: '',
        comeType: '',
        arrivedHospitalTime: '',
        fmcTime: '',
        admissionTime: '',
        afterFmcTime: '',
        leaveAddressTime: '',
        ecgTransmissionTime: ''
      },
      ecg: {
        registId: '',
        checkTime: '',
        diagnosisTime: ''
      },
      creatinineprotein: {
        registId: '',
        drawBloodTime: '',
        reportTime: ''
      },
      screenage: {
        registId: '',
        noticeTime: '',
        enterTime: '',
        checkTime: '',
        reportTime: ''
      },
      screenageCC: {
        registId: '',
        noticeTime: '',
        checkTime: '',
        reportTime: ''
      },
      inspection: {
        registId: '',
        noticeConsultantTime: '',
        consultantTime: '',
        cscNoticeTime: '',
        cscTime: '',

        diagnosisTime: '',
        graceRehazardTime: ''
      }
    }
  },
  computed: {},
  // 钩子方法
  created() {
    this.getTimeManagement()
    this.getDicList()
  },
  methods: {
    onAdmissionChanged() {
      this.updateAdmission()
    },
    // 患者接诊
    updateAdmission: debounce(function() {
      this.admission.registId = this.registId
      this.$api.timeManagement
        .updateTimeManagement({
          simpleCpcAdmission: this.admission,
          editFlag: 'admission'
        })
        .then(res => {
          if (res.status === 200) {
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
    }, 300),
    onEcgChanged() {
      this.updateEcg()
    },
    // 心电图
    updateEcg: debounce(function() {
      this.ecg.registId = this.registId
      this.$api.timeManagement
        .updateTimeManagement({
          simpleCpcEcg: this.ecg,
          editFlag: 'ecg'
        })
        .then(res => {
          if (res.status === 200) {
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
    }, 300),
    onCtnChanged() {
      this.updateCreatinineprotein()
    },
    // 肌酐蛋白
    updateCreatinineprotein: debounce(function() {
      this.creatinineprotein.registId = this.registId
      this.$api.timeManagement
        .updateTimeManagement({
          simpleCpcCreatinineprotein: this.creatinineprotein,
          editFlag: 'creatinineprotein'
        })
        .then(res => {
          if (res.status === 200) {
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
    }, 300),
    onCTChanged() {
      this.updateScreenage()
    },
    // 影像学(CT)
    updateScreenage: debounce(function() {
      this.screenage.registId = this.registId
      this.$api.timeManagement
        .updateTimeManagement({
          simpleCpcScreenage: this.screenage,
          editFlag: 'screenage'
        })
        .then(res => {
          if (res.status === 200) {
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
    }, 300),
    onCDUChanged() {
      this.updateScreenageCC()
    },
    // 影像学(彩超)
    updateScreenageCC: debounce(function() {
      this.screenageCC.registId = this.registId
      this.$api.timeManagement
        .updateTimeManagement({
          simpleCpcScreenageCC: this.screenageCC,
          editFlag: 'screenageCC'
        })
        .then(res => {
          if (res.status === 200) {
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
    }, 300),
    onInspectionChanged() {
      this.updateInspection()
    },
    // 检验检测
    updateInspection: debounce(function() {
      this.inspection.registId = this.registId
      this.$api.timeManagement
        .updateTimeManagement({
          simpleCpcInspection: this.inspection,
          editFlag: 'inspection'
        })
        .then(res => {
          if (res.status === 200) {
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
    }, 300),
    onMainChanged() {
      this.updateMain()
    },
    // 患者
    updateMain: debounce(function() {
      if (this.main.isAttackUncertain === '1' && this.main.attackTime) {
        this.main.attackTime = moment(this.main.attackTime).format(
          'YYYY-MM-DD'
        )
      }

      this.main.registId = this.registId
      this.$api.timeManagement
        .updateTimeManagement({
          simpleCpcMain: this.main,
          editFlag: 'main'
        })
        .then(res => {
          if (res.status === 200) {
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
    }, 300),
    // 获取分检诊
    getTimeManagement() {
      this.$api.timeManagement
        .getTimeManagement(this.registId, '2')
        .then(res => {
          if (res.result.simpleCpcMain) {
            this.main.isTimearea = res.result.simpleCpcMain.isTimearea
            this.main.attackTime = res.result.simpleCpcMain.attackTime
            this.main.isAttackUncertain =
              res.result.simpleCpcMain.isAttackUncertain
          }

          if (res.result.simpleCpcAdmission) {
            this.admission.arrivedHospitalTime =
              res.result.simpleCpcAdmission.arrivedHospitalTime
            this.admission.fmcTime = res.result.simpleCpcAdmission.fmcTime
            this.admission.admissionTime =
              res.result.simpleCpcAdmission.admissionTime
            this.admission.afterFmcTime =
              res.result.simpleCpcAdmission.afterFmcTime
            this.admission.leaveAddressTime =
              res.result.simpleCpcAdmission.leaveAddressTime
            this.admission.ecgTransmissionTime =
              res.result.simpleCpcAdmission.ecgTransmissionTime
            this.admission.comeType = res.result.simpleCpcAdmission.comeType
          }

          if (res.result.simpleCpcEcg) {
            this.ecg.checkTime = res.result.simpleCpcEcg.checkTime
            this.ecg.diagnosisTime = res.result.simpleCpcEcg.diagnosisTime
          }
          if (res.result.simpleCpcCreatinineprotein) {
            this.creatinineprotein.drawBloodTime =
              res.result.simpleCpcCreatinineprotein.drawBloodTime
            this.creatinineprotein.reportTime =
              res.result.simpleCpcCreatinineprotein.reportTime
          }
          if (res.result.simpleCpcScreenage) {
            this.screenage.noticeTime =
              res.result.simpleCpcScreenage.noticeTime
            this.screenage.enterTime = res.result.simpleCpcScreenage.enterTime
            this.screenage.checkTime = res.result.simpleCpcScreenage.checkTime
            this.screenage.reportTime =
              res.result.simpleCpcScreenage.reportTime
          }
          if (res.result.simpleCpcScreenageCC) {
            this.screenageCC.noticeTime =
              res.result.simpleCpcScreenageCC.noticeTime
            this.screenageCC.checkTime =
              res.result.simpleCpcScreenageCC.checkTime
            this.screenageCC.reportTime =
              res.result.simpleCpcScreenageCC.reportTime
          }
          if (res.result.simpleCpcInspection) {
            this.inspection.noticeConsultantTime =
              res.result.simpleCpcInspection.noticeConsultantTime
            this.inspection.consultantTime =
              res.result.simpleCpcInspection.consultantTime
            this.inspection.cscNoticeTime =
              res.result.simpleCpcInspection.cscNoticeTime
            this.inspection.cscTime = res.result.simpleCpcInspection.cscTime
            this.inspection.diagnosisTime =
              res.result.simpleCpcInspection.diagnosisTime
            this.inspection.graceRehazardTime =
              res.result.simpleCpcInspection.graceRehazardTime
          }
        })
    },
    // 获取字典
    getDicList() {
      this.$api.service.getDictionary('').then(result => {
        this.attackZoneDic = result[dicConstant.attackZoneCode]
        this.yesOrNoDic = result[dicConstant.yesOrNoCode]
      })
    }
  },
  watch: {}
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
