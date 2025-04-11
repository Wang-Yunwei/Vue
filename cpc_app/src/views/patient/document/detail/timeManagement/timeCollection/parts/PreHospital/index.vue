<template>
  <div class="task-basic-info-wrapper">
    <van-cell-group>
      <med-title title="院前急救" />
      <med-fast-date-field
        class="red-label"
        required
        v-model="main.attackTime"
        label="发病"
        :type="main.isAttackUncertain === '1' ? 'date' : 'datetime'"
        :formatter="
          main.isAttackUncertain === '1' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm'
        "
        v-if="this.comeType === '1' || this.comeType === '2'"
        :disabled="disabled"
        @confirm="onMainChanged"
      />
      <med-radio-button-field
        v-model="main.isAttackUncertain"
        :disabled="disabled"
        label="发病无法精确到分钟"
        required
        v-if="this.comeType === '1' || this.comeType === '2'"
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
          (this.comeType === '1' || this.comeType === '2') &&
            this.main.isAttackUncertain === '1'
        "
        @confirm="onMainChanged"
      >
      </med-radio-select-field>
      <med-fast-date-field
        class="red-label"
        required
        v-model="prehospital.helpTime"
        label="呼救"
        v-if="this.comeType === '1'"
        :disabled="disabled"
        @confirm="onPhepChanged"
      />
      <med-fast-date-field
        class="red-label"
        required
        v-model="prehospital.zcyyVisitTime"
        label="转出医院入门"
        v-if="this.comeType === '2'"
        :disabled="disabled"
        @confirm="onPhepChanged"
      />
      <med-fast-date-field
        class="red-label"
        required
        v-model="prehospital.zcyyDecisionTime"
        label="决定转院"
        v-if="this.comeType === '2'"
        :disabled="disabled"
        @confirm="onPhepChanged"
      />
      <med-fast-date-field
        class="red-label"
        required
        v-model="prehospital.zcyyLeaveTime"
        label="转出医院出门"
        v-if="this.comeType === '2'"
        :disabled="disabled"
        @confirm="onPhepChanged"
      />

      <med-fast-date-field
        class="red-label"
        required
        v-model="prehospital.arrivedHospitalTime"
        label="到达医院大门"
        v-if="this.comeType === '1' || this.comeType === '2'"
        :disabled="disabled"
        @confirm="onPhepChanged"
      />
      <med-fast-date-field
        class="red-label"
        required
        v-model="prehospital.fmcTime"
        label="首次医疗接触"
        v-if="this.comeType === '1' || this.comeType === '2'"
        :disabled="disabled"
        @confirm="onPhepChanged"
      />
      <med-fast-date-field
        class="red-label"
        required
        v-model="ecg.checkTime"
        label="院前首份心电图"
        v-if="this.comeType === '1' || this.comeType === '2'"
        :disabled="disabled"
        @confirm="onEcgChanged"
      />
      <med-fast-date-field
        class="red-label"
        required
        v-model="ecg.diagnosisTime"
        label="心电图确诊"
        v-if="this.comeType === '1' || this.comeType === '2'"
        :disabled="disabled"
        @confirm="onEcgChanged"
      />
      <med-fast-date-field
        class="red-label"
        required
        v-model="prehospital.remotetransTime"
        label="远程心电图传输"
        v-if="this.comeType === '1' || this.comeType === '2'"
        :disabled="disabled"
        @confirm="onPhepChanged"
      />

      <med-title title="院前会诊及诊断" style="margin-top: 4px;" />
      <med-fast-date-field
        v-model="prehospital.noticeConsultantTime"
        label="通知会诊"
        :disabled="disabled"
        @confirm="onPhepChanged"
      />
      <med-fast-date-field
        v-model="prehospital.consultantTime"
        label="会诊"
        :disabled="disabled"
        @confirm="onPhepChanged"
      />
      <med-fast-date-field
        v-model="prehospital.diagnosisTime"
        label="初步诊断"
        :disabled="disabled"
        @confirm="onPhepChanged"
      />

      <med-title title="双抗治疗" style="margin-top: 4px;" />
      <med-fast-date-field
        class="red-label"
        required
        v-model="prehospital.drugTime"
        label="给药"
        v-if="this.comeType === '1' || this.comeType === '2'"
        :disabled="disabled"
        @confirm="onPhepChanged"
      />

      <med-title title="院前溶栓" style="margin-top: 4px;" />
      <med-fast-date-field
        class="red-label"
        required
        v-model="prehospital.rsStartAgreeTime"
        label="开始知情同意"
        v-if="this.comeType === '1' || this.comeType === '2'"
        :disabled="disabled"
        @confirm="onPhepChanged"
      />
      <med-fast-date-field
        class="red-label"
        required
        v-model="prehospital.rsSignAgreeTime"
        label="签署知情同意书"
        v-if="this.comeType === '1' || this.comeType === '2'"
        :disabled="disabled"
        @confirm="onPhepChanged"
      />
      <med-fast-date-field
        class="red-label"
        required
        v-model="prehospital.rsStartTime"
        label="开始溶栓"
        v-if="this.comeType === '1' || this.comeType === '2'"
        :disabled="disabled"
        @confirm="onPhepChanged"
      />
      <med-fast-date-field
        class="red-label"
        required
        v-model="prehospital.rsEndTime"
        label="结束溶栓"
        v-if="this.comeType === '1' || this.comeType === '2'"
        :disabled="disabled"
        @confirm="onPhepChanged"
      />
    </van-cell-group>
  </div>
</template>
<script>
import dateUtil from '@utils/dateUtil'
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
      dateUtil,
      list: [],
      dateTimeShow: false,
      registId: this.$route.query.registId,
      comeType: '',
      attackZoneDic: [],
      yesOrNoDic: [],
      prehospital: {
        registId: '',
        helpTime: '',
        zcyyVisitTime: '',
        zcyyDecisionTime: '',
        zcyyLeaveTime: '',
        arrivedHospitalTime: '',
        fmcTime: '',
        remotetransTime: '',
        drugTime: '',

        rsStartAgreeTime: '',
        rsSignAgreeTime: '',
        rsStartTime: '',
        rsEndTime: '',

        noticeConsultantTime: '',
        consultantTime: '',
        diagnosisTime: ''
      },
      ecg: {
        registId: '',
        checkTime: '',
        diagnosisTime: ''
      },
      main: {
        // 患者
        registId: '',
        isAttackUncertain: '',
        attackTime: '',
        isTimearea: ''
      }
    }
  },
  created() {
    this.getTimeManagement()
    this.getDicList()
  },
  methods: {
    onPhepChanged() {
      this.updatePreHospital()
    },
    updatePreHospital: debounce(function() {
      const req = { ...this.prehospital }
      req.registId = this.registId
      this.$api.timeManagement
        .updateTimeManagement({
          simpleCpcPrehospital: req,
          editFlag: 'preHospital'
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
          simpleCpcEcgYQ: this.ecg,
          editFlag: 'ecgYQ'
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
    // 管理获取院前急救
    getTimeManagement() {
      this.$api.timeManagement
        .getTimeManagement(this.registId, '1')
        .then(res => {
          if (res.result.simpleCpcPrehospital) {
            this.prehospital.helpTime =
              res.result.simpleCpcPrehospital.helpTime
            this.prehospital.zcyyVisitTime =
              res.result.simpleCpcPrehospital.zcyyVisitTime
            this.prehospital.zcyyDecisionTime =
              res.result.simpleCpcPrehospital.zcyyDecisionTime
            this.prehospital.zcyyLeaveTime =
              res.result.simpleCpcPrehospital.zcyyLeaveTime
            this.prehospital.arrivedHospitalTime =
              res.result.simpleCpcPrehospital.arrivedHospitalTime
            this.prehospital.fmcTime = res.result.simpleCpcPrehospital.fmcTime
            this.prehospital.remotetransTime =
              res.result.simpleCpcPrehospital.remotetransTime
            this.prehospital.drugTime =
              res.result.simpleCpcPrehospital.drugTime
            this.prehospital.rsStartAgreeTime =
              res.result.simpleCpcPrehospital.rsStartAgreeTime
            this.prehospital.rsSignAgreeTime =
              res.result.simpleCpcPrehospital.rsSignAgreeTime
            this.prehospital.rsStartTime =
              res.result.simpleCpcPrehospital.rsStartTime
            this.prehospital.rsEndTime =
              res.result.simpleCpcPrehospital.rsEndTime
            this.prehospital.noticeConsultantTime =
              res.result.simpleCpcPrehospital.noticeConsultantTime
            this.prehospital.consultantTime =
              res.result.simpleCpcPrehospital.consultantTime
            this.prehospital.diagnosisTime =
              res.result.simpleCpcPrehospital.diagnosisTime
          }

          if (res.result.simpleCpcAdmission) {
            this.comeType = res.result.simpleCpcAdmission.comeType
          }

          if (res.result.simpleCpcMain) {
            this.main.isTimearea = res.result.simpleCpcMain.isTimearea
            this.main.attackTime = res.result.simpleCpcMain.attackTime
            this.main.isAttackUncertain =
              res.result.simpleCpcMain.isAttackUncertain
          }

          if (res.result.simpleCpcEcgYQ) {
            this.ecg.checkTime = res.result.simpleCpcEcgYQ.checkTime
            this.ecg.diagnosisTime = res.result.simpleCpcEcgYQ.diagnosisTime
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
