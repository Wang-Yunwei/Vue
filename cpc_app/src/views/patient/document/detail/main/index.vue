<template>
  <div>
    <med-view-container
      title="病历编辑"
      @return="jumpToDetails"
      wide
      :returnLabel="returnLabel"
    >
      <template #right-part>
        <div @click.stop="bindPatient" v-if="showBind">
          <i class="iconfont iconlvtong-96" />
          <span>绑定</span>
        </div>
        <van-popover
          v-else
          v-model="showMoreActions"
          trigger="click"
          placement="bottom-end"
          :actions="actionList"
          :offset="[18, 8]"
          @select="onSelectMoreActions"
        >
          <template #reference>
            <i class="iconfont iconicon1-151" style="font-size: 0.6rem" />
          </template>
        </van-popover>
      </template>
      <div class="med-card-edit-wrapper">
        <patient-card
          ref="patient"
          :data="patientInfo"
          :disabled="isReadonly"
          :bindBtn="true"
          @changed="handlePatientInfoChange"
          @rfTagIdChange="rfTagIdChange"
        />
        <div class="scroll-view" ref="scroll">
          <van-tabs
            v-if="hasPermision()"
            v-model="active"
            sticky
            color="#5e74fe"
            :lazy-render="false"
            swipeable
            @click="onTabChange"
          >
            <!-- :before-change="beforeChange" -->
            <van-tab
              title="院前急救"
              v-if="_resources.mrFirstAid() && showFirstAid"
            >
              <prehospital
                :data="data"
                ref="tab_firstaid"
                @showimport="showimport"
                @onSaveException="onSaveException"
                :disabled="isReadonly"
                @checkRefresh="refreshData"
                @notifyReportStatus="changeReportStatus"
              />
            </van-tab>
            <van-tab :title="emrgencyTitleDesc" v-if="_resources.mrTriage()">
              <triage
                :data="data"
                ref="tab_traige"
                @showimport="showimport"
                @onSaveException="onSaveException"
                :disabled="isReadonly"
                @notifyReportStatus="changeReportStatus"
              />
            </van-tab>
            <van-tab title="检验检查" v-if="_resources.mrInspection()">
              <detection
                :data="data"
                ref="tab_detection"
                :disabled="isReadonly"
                @onSaveException="onSaveException"
                @checkRefresh="refreshData"
                @notifyReportStatus="changeReportStatus"
                @refreshDiagnosisData="refreshDiagnosisData"
              />
            </van-tab>
            <van-tab title="院内诊疗" v-if="_resources.mrCure() && showCure">
              <cure
                :data="data"
                ref="tab_cure"
                :disabled="isReadonly"
                :stemi="isStemi"
                @onSaveException="onSaveException"
                @notifyReportStatus="changeReportStatus"
                @checkRefresh="refreshData"
              />
            </van-tab>
            <van-tab title="介入手术" v-if="_resources.mrPci() && showPci">
              <pci
                :data="data"
                ref="tab_pci"
                :zj-pci="showZJPCI"
                :bj-pci="showBJPCI"
                :rsh-pci="showRSHJR"
                :jj-pci="showJJPCI"
                :disabled="isReadonly"
                @onSaveException="onSaveException"
                @notifyReportStatus="changeReportStatus"
              />
            </van-tab>
            <van-tab
              title="患者转归"
              v-if="_resources.mrDischarge() && showDischarge"
            >
              <discharge
                :data="data"
                ref="tab_discharge"
                @showimport="showimport"
                :disabled="isReadonly"
                @onSaveException="onSaveException"
                @notifyReportStatus="changeReportStatus"
              />
            </van-tab>
          </van-tabs>
          <van-empty
            v-if="!hasPermision()"
            :image="require('@assets/image/empty.png')"
            description="未授权或暂无填写数据"
          />
        </div>
        <div
          v-if="hasPermision()"
          ref="opContainer"
          class="op-container">
          <van-button
            v-if="showSave"
            size="small"
            type="plain-primary"
            class="button--left"
            @click="onSaveClick"
            >
            保存
          </van-button>
          <span v-if="showSpan()" class="span">
            <van-button
              v-for="a in actions"
              :key="a.key"
              size="small"
              :type="
                ['rejectAudit', 'rejectApprove'].indexOf(a.key) > -1
                  ? 'plain-primary'
                  : 'primary'
              "
              :class="
                ['rejectAudit', 'rejectApprove'].indexOf(a.key) > -1
                  ? 'button--left'
                  : 'button--right'
              "
              @click="onMenuSelected(a)"
              >{{ a.text }}</van-button
            >
          </span>
        </div>
      </div>
    </med-view-container>
    <med-popup
      v-model="showPatientList"
      :style="{ width: '100%', height: '100%' }"
      position="right"
    >
      <importForm
        v-if="showPatientList"
        :registId="registId"
        @backClick="handleBackClick"
        @select="selectItem"
        :filterTypes="filterTypes"
        :patientInfo="patientInfo"
      />
    </med-popup>
    <med-popup
      v-model="showBindingList"
      :style="{ width: '100%', height: '100%' }"
      position="right"
    >
      <binding :patientInfo="patientInfo"  @backClick="handleBackClick" @select="selectItem"/>
    </med-popup>
    <med-popup-container v-model="opHisShow" :duration="0.12" hideHeader>
      <OperationHistory
        v-if="opHisShow"
        :registId="$route.query.registId"
        @backClick="closeOpHis"
      />
    </med-popup-container>
    <med-popup-container
      v-model="showSubmitResult"
      title="病例提交失败原因"
      position="right"
      scroll
      @return="showSubmitResult = false"
    >
      <van-cell
        v-for="(item, index) in submitResult"
        :key="'submit-result-desc' + index"
        :title="item"
      />
    </med-popup-container>
    <reason
      ref="reason"
      :title="reasonTitle"
      :reasonType="reasonType"
      @refresh="refreshData"
    />
    <med-loading v-model="showLoading" />
  </div>
</template>

<script>
import { Dialog } from 'vant'
import { mapGetters, mapMutations } from 'vuex'
import * as types from '@/store/mutations/mutations-types'
import { ruleConstant } from '@/constant/commonConstant'
import importForm from '../../importInfo/index'
import PatientCard from '../patientCard'
import prehospital from '../prehospital/phepmain'
import triage from '../triage/main'
import detection from '../detection/main'
import cure from '../cure/main'
import pci from '../pci/main'
import discharge from '../discharge/main'
import reason from './reason'
import parseJson from 'parse-json'
import OperationHistory from '../components/OperationHistory/index'
import Binding from './binding'
import hospitalMixin from '@mixins/hospitalMixin'

export default {
  mixins: [hospitalMixin],
  name: 'Detection',
  components: {
    prehospital,
    triage,
    detection,
    cure,
    pci,
    discharge,
    reason,
    PatientCard,
    importForm,
    OperationHistory,
    Binding
  },
  data() {
    return {
      actionList: [
        {
          icon: 'replay',
          text: '同步'
        },
        {
          icon: 'label-o',
          text: '日志'
        },
        {
          icon: 'description',
          text: '调阅'
        }
      ],
      opHisShow: false,
      showMoreActions: false,
      returnLabel: this.$route.query.openUrl === '1' ? '关闭' : '返回',
      showLoading: false,
      reportloading: false,
      graceTemp: {
        id: '',
        scoreValue: ''
      },
      loading: false,
      bindType: 0, // 0:绑定患者基础信息  1：绑定急救车牌和急救任务号  2：绑定急诊号  3：绑定门诊号  4： 绑定住院号
      active: 0,
      reasonTitle: '',
      reasonType: '',
      registId: 0,
      filterTypes: ['1', '2', '3', '4'],
      showPopover: false,
      showPatientList: false,
      showBindingList: false,
      showSubmitResult: false,
      submitActiveName: 0,
      syncButtonText: '',
      syncButtonType: '',
      data: {
        admission: {},
        admissionEcgList: [],
        creatinineproteinList: [],
        diagnosisTest: {},
        dischargeDrugsList: [],
        dischargeTestList: [],
        inspection: {},
        treatment: {},
        treatmentPci: {},
        treatmentPciPartList: {},
        main: {},
        prehospital: {},
        prehospitalEcgList: [],
        regist: {},
        grace: {},
        screenage: {},
        discharge: {
          bnp: {
            category: '',
            conclusion: '',
            id: '',
            orderNo: '',
            registId: '',
            result: '',
            type: '',
            unit: ''
          },
          hdlC: {
            category: '',
            conclusion: '',
            id: '',
            orderNo: '',
            registId: '',
            result: '',
            type: '',
            unit: ''
          },
          jtyw: {
            arrayName: [],
            code: '',
            frequency: '',
            id: '',
            name: '',
            orderNo: '',
            registId: '',
            times: '',
            unit: ''
          },
          knyw: {
            arrayName: [],
            code: '',
            frequency: '',
            id: '',
            name: '',
            orderNo: '',
            registId: '',
            times: '',
            unit: '',
            value: ''
          },
          ldlC: {
            category: '',
            conclusion: '',
            id: '',
            orderNo: '',
            registId: '',
            result: '',
            type: '',
            unit: ''
          },
          pcsk9: {
            arrayName: [],
            code: '',
            frequency: '',
            id: '',
            name: '',
            orderNo: '',
            registId: '',
            times: '',
            unit: '',
            value: ''
          },
          tc: {
            category: '',
            conclusion: '',
            id: '',
            orderNo: '',
            registId: '',
            result: '',
            type: '',
            unit: ''
          },
          tg: {
            category: '',
            conclusion: '',
            id: '',
            orderNo: '',
            registId: '',
            result: '',
            type: '',
            unit: ''
          }
        }
      },
      archiveData: {
        registId: '',
        userId: this._permission().user.id
      },
      bindData: {
        visitId: '',
        registId: '',
        type: 0
      },
      relationData: {
        visitId: '',
        patientNo: '',
        type: 0
      },
      syncData: {
        patientNo: '',
        registId: ''
      },
      patientInfo: {
        name: '',
        gender: '',
        age: '',
        birthday: '',
        idcardType: '',
        identificationNo: '',
        comingType: '',
        diagnosis: '',
        outpatientNo: '',
        inpatientNo: '',
        diseaseTime: '',
        arriveTime: '',
        rfTagId: '',
        isAttackUncertain: '',
        isTimearea: '',
        status: '',
        prediagnosis: '',
        isLock: '',
        reportNo: ''
      },
      submitResult: [],
      tabIndex: 0,
      defaultInspection: {},
      defaultMedicineinHos: {},
      defaultAnticoagulation: {},
      defaultDischargemedication: {},
      inspectionRule: {
        code: ruleConstant.INSPECTION
      },
      medicineinhosRule: {
        code: ruleConstant.MEDICINEINHOS
      },
      anticoagulationRule: {
        code: ruleConstant.ANTICOAGULATION
      },
      antiplateletRule: {
        code: ruleConstant.ANTIPLATELET
      },
      dischargemedicationRule: {
        code: ruleConstant.DISCHARGEMEDICATION
      }
    }
  },
  computed: {
    ...mapGetters(['hospitalArea', 'curHospitalArea', 'configure']),
    // patientInfo() {
    //   const { data: d } = this
    //   return {
    //     name: d.regist.name,
    //     gender: d.regist.gender,
    //     age: d.regist.age,
    //     birthday: d.regist.birthday,
    //     idcardType: d.regist.idcardType,
    //     identificationNo: d.regist.identificationNo,
    //     comingType: d.admission.comeType,
    //     diagnosis: d.inspection.diagnosis,
    //     outpatientNo: d.main.outPatientNo,
    //     inpatientNo: d.main.admissionNo,
    //     diseaseTime: d.main.attackTime,
    //     arriveTime: d.admission.arrivedHospitalTime,
    //     rfTagId: d.regist.rfTagId,
    //     isAttackUncertain: d.main.isAttackUncertain,
    //     isTimearea: d.main.isTimearea
    //   }
    // },
    disabledSyncButton() {
      return this.data.regist.isReport === '1'
    },
    emrgencyTitleDesc() {
      if (
        (this.data.regist.comeType === '1' ||
          this.data.regist.comeType === '2') &&
        this.data.prehospital.isBypassEm === '1' &&
        this.data.prehospital.isBypassCcu === '1'
      ) {
        return '院内接诊'
      } else {
        return '急诊分诊'
      }
    },
    actions() {
      const _actions = []
      if (
        this._resources.mrSubmit() &&
        (this.data.main.status === '10' ||
          this.data.main.status === '12' ||
          this.data.main.status === '13')
      ) {
        _actions.push({
          text: '提交',
          icon: 'passed',
          key: 'submitAudit'
          // className: 'iconfont iconlvtong-95'
        })
      } else if (this.data.main.status === '21') {
        if (
          this._resources.mrSubmit() &&
          this.data.main.submitBy === this._permission().user.id
        ) {
          _actions.push({
            text: '撤回',
            icon: 'close',
            key: 'withdrawAudit'
            // className: 'iconfont iconlvtong-95'
          })
        }
        if (this._resources.mrAuditReject()) {
          // 审核驳回
          _actions.push({
            text: '驳回',
            icon: 'close',
            key: 'rejectAudit'
          })
        }
        if (this._resources.mrAudit()) {
          _actions.push({
            text: '通过',
            icon: 'passed',
            key: 'passAudit'
            // className: 'iconfont iconlvtong-95'
          })
        }
      } else if (
        this.data.main.status === '31'
      ) {
        if (this._resources.mrArchiveReject()) {
          _actions.push({
            text: '驳回',
            icon: 'close',
            key: 'rejectApprove'
            // className: 'iconfont iconlvtong-95'
          })
        }
        if (this._resources.mrArchive()) {
          _actions.push({
            text: '存档',
            icon: 'passed',
            key: 'archive'
            // className: 'iconfont iconlvtong-95'
          })
        }
      }
      return _actions
    },
    showFirstAid() {
      return (
        this.data.regist.comeType === '1' || this.data.regist.comeType === '2'
      )
    },
    showSave() {
      if (this.isReadonly) return false
      return this._resources.mrAdd() && this.hasPermision()
    },
    showReport() {
      return this._resources.mrAdd()
    },
    showScan() {
      return false
      // 注释的代码不要去掉
      // if (!this.data || !this.data.regist) return false
      // if (this.isReadonly) return false
      // return true
    },
    showBind() {
      if (this.configure.dockingWay === '2') {
        return false
      } else {
        if (!this.data || !this.data.regist) return false
        if (this.isReadonly) return false
        const emId = this.data.regist.emId
        return !emId || emId === ''
      }
    },
    isStemi() {
      if (this.data.inspection.diagnosis === '1') return true
      if (
        this.data.inspection.diagnosis === '2' ||
        this.data.inspection.diagnosis === '3'
      ) {
        if (this.data.inspection.graceRehazardLevel === '0') return true
      }
      return false
    },
    isNstemiOrUA() {
      return (
        this.data.inspection.diagnosis === '2' ||
        this.data.inspection.diagnosis === '3'
      )
    },
    showCure() {
      return this.isStemi || this.isNstemiOrUA
    },
    showReperfusion() {
      if (this.data.inspection.diagnosis === '1') return true
      if (!this.data.inspection.graceRehazardLevel) return false
      if (
        this.data.inspection.diagnosis === '2' ||
        this.data.inspection.diagnosis === '3'
      ) {
        return this.data.inspection.graceRehazardLevel === '0'
      }
      return false
    },
    showRsCure() {
      if (
        this.data.inspection.diagnosis !== '1' &&
        this.data.inspection.diagnosis !== '2' &&
        this.data.inspection.diagnosis !== '3' &&
        this.data.inspection.diagnosis !== '5'
      ) {
        return false
      }

      const stemiRs =
        this.showReperfusion &&
        this.data.treatment &&
        this.data.treatment.isReperfusion === '1' &&
        this.data.treatment.reperfusionMeasure === '2'
      const peRs = this.data.inspection.diagnosis === '5'
      return stemiRs || peRs
    },
    showZJPCI() {
      if (!this.showReperfusion) return false
      return (
        this.data.treatment &&
        this.data.treatment.isReperfusion === '1' &&
        this.data.treatment.reperfusionMeasure === '1'
      )
    },
    showBJPCI() {
      return (
        this.isStemi &&
        this.showRsCure &&
        this.data.treatment &&
        this.data.treatment.rsStrategy === '21'
      )
    },
    showRSHJR() {
      return (
        this.isStemi &&
        this.showRsCure &&
        this.data.treatment &&
        this.data.treatment.rsStrategy === '22'
      )
    },
    showZYPCI() {
      if (!this.data.treatment) return false
      return (
        this.isStemi &&
        this.data.treatment.isReperfusion === '1' &&
        this.data.treatment.reperfusionMeasure === '5'
      )
    },
    showJJPCI() {
      if (!this.isNstemiOrUA) return false
      if (!this.data.treatment) return false
      if (
        !this.data.inspection ||
        this.data.inspection.graceRehazardLevel === '0'
      ) {
        return false
      }
      return (
        this.data.treatment.strategy === '2' &&
        this.data.treatment.invasiveStrategy === '1'
      )
    },
    showPci() {
      if (!this.data.treatment) return false
      return (
        this.showZJPCI ||
        this.showBJPCI ||
        this.showRSHJR ||
        (this.showZYPCI && this.data.treatment.pciTransferType === '2') ||
        this.showJJPCI
      )
    },
    showDischarge() {
      if (
        (this.data.admission.comeType === '1' ||
          this.data.admission.comeType === '2') &&
        this.data.prehospital.isTransHospital === '1'
      ) {
        return false
      }
      if (this.data.inspection.isGiveupTreatment === '1') {
        return false
      }
      if (
        this.data.inspection.diagnosis === '6' ||
        this.data.inspection.diagnosis === '7' ||
        this.data.inspection.diagnosis === '9'
      ) {
        return false
      }
      return true
    },
    isReadonly() {
      return (
        this.data.isLock === '1' ||
        this.data.main.status === '21' ||
        this.data.main.status === '31' ||
        this.data.main.status === '41' ||
        this._resources.mrAdd() === false
      )
    },
    validateTabs() {
      const tabs = []
      let index = 0
      if (this.showFirstAid) {
        tabs.push({ name: 'tab_firstaid', index: index++ })
      }
      tabs.push({ name: 'tab_traige', index: index++ })
      tabs.push({ name: 'tab_detection', index: index++ })
      if (this.showCure) tabs.push({ name: 'tab_cure', index: index++ })
      if (this.showPci) tabs.push({ name: 'tab_pci', index: index++ })
      if (this.showDischarge) {
        tabs.push({ name: 'tab_discharge', index: index++ })
      }
      return tabs
    }
  },
  created() {
    // 获取基本信息
    this.registId = this.$route.query.registId

    this.getBasicInfo()
    this.$backhelper.push(this.jumpToDetails)
    this.isLoaded = false
  },
  methods: {
    ...mapMutations([types.SET_DOCTORS]),
    closeOpHis() {
      this.opHisShow = false
    },
    async getBasicInfo() {
      await this.getBasicInformation()
      this.$nextTick(async () => {
        if (this.$refs.tab_firstaid && this.$refs.tab_firstaid.$refs.ecg && this.isLoaded) {
          await this.$refs.tab_firstaid.$refs.ecg.initEcgData()
        }
        if (this.$refs.tab_detection && this.$refs.tab_detection.$refs.ecg && this.isLoaded) {
          await this.$refs.tab_detection.$refs.ecg.initEcgData()
        }
        this.isLoaded = true
      })
    },
    async syncPatientData() {
      const status = this.$route.query.status
      const statusList = ['21', '31', '41']
      if (!statusList.includes(status)) {
        await this.$api.thirdParty.syncPatientDetailManually(this.registId)
      }
      this.getBasicInfo()
    },
    // 更多操作
    async onSelectMoreActions(e) {
      if (e.text === '同步') {
        this.showLoading = true
        this.syncPatientData()
        this.$notify({ type: 'success', message: '同步成功' })
        this.showLoading = false
      } else if (e.text === '日志') {
        this.opHisShow = true
      } else if (e.text === '调阅') {
        this.$router.push({
          path: '/patient/document/overview',
          query: {
            registId: this.registId,
            emId: this.data.regist.emId,
            infoComingType: this.data.regist.infoComingType
          }
        })
      }
    },
    setPatientInfo(item) {
      this.patientInfo.name = item.regist.name
      this.patientInfo.gender = item.regist.gender
      this.patientInfo.age = item.regist.age
      this.patientInfo.birthday = item.regist.birthday
      this.patientInfo.idcardType = item.regist.idcardType
      this.patientInfo.identificationNo = item.regist.identificationNo
      this.patientInfo.comingType = item.regist.comeType
      this.patientInfo.diagnosis = item.inspection.diagnosis
      this.patientInfo.outpatientNo = item.main.outPatientNo
      this.patientInfo.inpatientNo = item.main.admissionNo
      this.patientInfo.diseaseTime = item.main.attackTime
      this.patientInfo.arriveTime = item.admission.arriveTime
      this.patientInfo.rfTagId = item.regist.rfTagId
      this.patientInfo.isAttackUncertain = item.main.isAttackUncertain
      this.patientInfo.isTimearea = item.main.isTimearea
      this.patientInfo.status = item.main.status
      this.patientInfo.fmcTime = item.admission.fmcTime
      this.patientInfo.prediagnosis = item.prehospital.diagnosis
      this.patientInfo.isLock = item.isLock
      this.patientInfo.reportNo = item.main.reportNo
    },
    onTabChange(name, title) {},
    beforeChange(index) {
      const hasCure = this._resources.mrCure()
      const hasPci = this._resources.mrPci()
      const hasDischarge = this._resources.mrDischarge()
      const isFirstAdd = this.showFirstAid
      let cureIndex = 2
      let pciIndex = 3
      let dischargeIndex = 4
      if (isFirstAdd) {
        cureIndex = 3
        pciIndex = 4
        dischargeIndex = 5
      }
      if (hasCure && hasPci && hasDischarge) {
        cureIndex = 2
        pciIndex = 3
        dischargeIndex = 4
        if (isFirstAdd) {
          cureIndex = 3
          pciIndex = 4
          dischargeIndex = 5
        }
      } else if (hasCure === false && hasPci && hasDischarge) {
        cureIndex = -1
        pciIndex = 2
        dischargeIndex = 3
        if (isFirstAdd) {
          cureIndex = -1
          pciIndex = 3
          dischargeIndex = 4
        }
      } else if (hasCure && hasPci === false && hasDischarge) {
        cureIndex = 2
        pciIndex = -1
        dischargeIndex = 3
        if (isFirstAdd) {
          cureIndex = 3
          pciIndex = -1
          dischargeIndex = 4
        }
      }
      if (index === pciIndex) {
        if (hasPci === false) {
          this.$notify({
            type: 'warning',
            message: '当前账户无此权限，请联系管理员增加相应权限'
          })
          return false
        }
        if (!this.showPci) {
          this.$notify({
            type: 'warning',
            message: '请先填写(检验检查项中的)院内初步诊断或初步处置'
          })
          return false
        }
        return true
      }
      if (index === cureIndex) {
        if (hasCure === false) {
          this.$notify({
            type: 'warning',
            message: '当前账户无此权限，请联系管理员增加相应权限'
          })
          return false
        }
        if (!this.showCure) {
          this.$notify({
            type: 'warning',
            message: '请先填写(检验检查项中的)院内初步诊断或初步处置'
          })
          return false
        }
      }
      if (index === dischargeIndex) {
        if (hasDischarge === false) {
          this.$notify({
            type: 'warning',
            message: '当前账户无此权限，请联系管理员增加相应权限'
          })
          return false
        }
        if (!this.showDischarge) {
          this.$notify({
            type: 'warning',
            message: '请先填写(检验检查项中的)院内初步诊断或是否放弃治疗'
          })
          return false
        }
      }
      return true
    },
    showReason(type) {
      if (type === '1') {
        this.reasonTitle = '驳回'
        this.reasonType = type
      } else if (type === '2') {
        this.reasonTitle = '驳回'
        this.reasonType = type
      }
      this.$refs.reason.showModel(true)
    },
    onMenuSelected(action) {
      if (action.key === 'submitAudit') {
        this.onSubmitAuditClick()
      } else if (action.key === 'withdrawAudit') {
        this.withdrawAudit()
      } else if (action.key === 'syncPatient') {
        this.syncPatient()
      } else if (action.key === 'passAudit') {
        this.passAudit()
      } else if (action.key === 'archive') {
        this.archive()
      } else if (action.key === 'rejectAudit') {
        this.showReason('1')
      } else if (action.key === 'rejectApprove') {
        this.showReason('2')
      }
    },
    syncPatient() {
      this.syncData.patientNo = this.data.regist.patientNo
      this.loading = true
      this.$api.service.syncPatient(this.syncData).then(res => {
        if (res.status === 200) {
          this.getBasicInformation()
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
        this.loading = false
      })
    },
    showSpan() {
      if (
        this.data.isLock === '1' ||
        this.data.main.status === '41' ||
        !this.actions ||
        this.actions.length <= 0
      ) {
        return false
      }
      return true
    },
    showimport(item) {
      if (
        this.data.main.status === '21' ||
        this.data.main.status === '31' ||
        this.data.main.status === '41'
      ) {
        return
      }
      this.filterTypes = []
      this.filterTypes.push(item)
      this.bindType = item
      this.showPatientList = true
    },
    bindPatient() {
      this.bindType = 0
      this.filterTypes = []
      this.showBindingList = true
    },
    handleBackClick() {
      this.showPatientList = false
      this.showBindingList = false
    },
    async selectItem(item, type) {
      try {
        if (!item.relationId) {
          throw new Error('没有relationId')
        }
        const p = {
          hospitalId: this.hospitalAndArea(),
          relationId: item.relationId,
          visitId: item.relationId,
          type: item.type
        }
        const res = type === 'bind' ? await this.$api.service.getEmIdPatient(p) : await this.$api.service.getRelationEmIdPatient(p)
        if (res.status === 200) {
        if (res.result.isRegister) {
          this.$toast('该患者已建档')
          } else {
            const bindTypeFlag = this.bindType === 0
            this.$dialog
              .confirm({ title: '提示', message: `确定绑定患者【${item.name}】吗?` })
              .then(() => {
                if (bindTypeFlag) {
                  this.bindData.type = item.type
                  this.bindData.visitId = item.relationId
                  this.bindData.registId = this.registId
                  this.bindPatientInfo()
                } else {
                  this.relationData.type = item.type
                  this.relationData.visitId = item.relationId
                  this.relationData.patientNo = this.data.regist.emId
                  this.relationPatientInfo()
                }
                this.showPatientList = false
                this.showBindingList = false
            })
          }
        } else {
          throw new Error(res.message || '接口异常')
        }
      } catch (err) {
        this.$notify(err.message)
      }
    },
    // 绑定患者信息
    async bindPatientInfo() {
      const res = await this.$api.service.bindPatient(this.bindData)
      if (res.status === 200) {
          this.$notify({ type: 'success', message: '绑定成功' })
          this.getBasicInformation()
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
    },
    // 建立关联
    async relationPatientInfo() {
      const res = await this.$api.service.relationPatient(this.relationData)
      if (res.status === 200) {
        this.$notify({ type: 'success', message: '绑定成功' })
        this.getBasicInformation()
      } else {
        this.$notify({ type: 'warning', message: res.message })
      }
    },
    rfTagIdChange(id) {
      // 腕带号变化
      this.$set(this.details, 'rfTagId', id)
    },
    handlePatientInfoChange() {
      // this.active = this.tabList[0]?.name
      // this.getBasicInformation()
      // this.tabList.forEach(tab => {
      //   if (this.$refs[tab.name][0]?.init) {
      //     this.$refs[tab.name][0].init()
      //   }
      // })
    },
    getDischargemedicationRule() {
      this.$api.service
        .getSysSetting(this.dischargemedicationRule)
        .then(res => {
          if (res.status === 200) {
            if (res.hasOwnProperty('result')) {
              this.defaultDischargemedication = parseJson(res.result.value)
              this.setDischargemedicationDefalut(
                this.defaultDischargemedication
              )
            }
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
    },
    setDischargemedicationDefalut(settingValue) {
      if (
        settingValue != null &&
        settingValue.isEnabled &&
        settingValue.itemConfig != null
      ) {
        const outDrugDaptList = settingValue.itemConfig.filter(function(x) {
          return x.code === '1'
        })
        if (outDrugDaptList != null && outDrugDaptList.length > 0) {
          const outDrugDapt = outDrugDaptList[0]
          if (outDrugDapt.isEnabled) {
            if (this.data.discharge.outDrugIsDaptNameList == null) {
              this.data.discharge.outDrugIsDaptNameList = []
            }
            if (this.data.discharge.outDrugIsDaptNameList.length <= 0) {
              for (var i = 0; i < outDrugDapt.defaultDrug.length; i++) {
                this.data.discharge.outDrugIsDaptNameList.push(
                  outDrugDapt.defaultDrug[i]
                )
              }
              for (var j = 0; j < outDrugDapt.defaultUsage.length; j++) {
                const usage = outDrugDapt.defaultUsage[j]
                this.data.dischargeDrugsList.push({
                  code: '1',
                  name: usage.code,
                  unit: 'mg',
                  value: usage.dose,
                  frequency: usage.frequency,
                  times: usage.times,
                  registId: this.registId
                })
              }
            }
          }
        }

        const outDrugAceiorarbList = settingValue.itemConfig.filter(function(
          x
        ) {
          return x.code === '2'
        })
        if (outDrugAceiorarbList != null && outDrugAceiorarbList.length > 0) {
          const outDrugAceiorarb = outDrugAceiorarbList[0]
          if (outDrugAceiorarb.isEnabled) {
            if (this.data.discharge.outDrugIsAceiorarbNameList == null) {
              this.data.discharge.outDrugIsAceiorarbNameList = []
            }
            if (this.data.discharge.outDrugIsAceiorarbNameList.length <= 0) {
              if (outDrugAceiorarb.defaultDrug != null) {
                const aceiorarb = outDrugAceiorarb.defaultDrug
                this.data.discharge.outDrugIsAceiorarbNameList.push(
                  aceiorarb.code
                )
                this.data.dischargeDrugsList.push({
                  code: '2',
                  name: aceiorarb.code,
                  unit: 'mg',
                  value: aceiorarb.dose,
                  frequency: aceiorarb.frequency,
                  times: aceiorarb.times,
                  registId: this.registId
                })
              }
            }
          }
        }

        const outDrugStatinsList = settingValue.itemConfig.filter(function(x) {
          return x.code === '3'
        })
        if (outDrugStatinsList != null && outDrugStatinsList.length > 0) {
          const outDrugStatins = outDrugStatinsList[0]
          if (outDrugStatins.isEnabled) {
            if (this.data.discharge.outDrugIsStatinsNameList == null) {
              this.data.discharge.outDrugIsStatinsNameList = []
            }
            if (this.data.discharge.outDrugIsStatinsNameList.length <= 0) {
              for (var o = 0; o < outDrugStatins.defaultDrug.length; o++) {
                this.data.discharge.outDrugIsStatinsNameList.push(
                  outDrugStatins.defaultDrug[o]
                )
              }
              for (var p = 0; p < outDrugStatins.defaultUsage.length; p++) {
                const drugRetardant = outDrugStatins.defaultUsage[p]
                this.data.dischargeDrugsList.push({
                  code: '3',
                  name: drugRetardant.code,
                  unit: 'mg',
                  value: drugRetardant.dose,
                  frequency: drugRetardant.frequency,
                  times: drugRetardant.times,
                  registId: this.registId
                })
              }
            }
          }
        }

        const outDrugIsRetardantNameList = settingValue.itemConfig.filter(
          function(x) {
            return x.code === '4'
          }
        )
        if (
          outDrugIsRetardantNameList != null &&
          outDrugIsRetardantNameList.length > 0
        ) {
          const outDrugRetardant = outDrugIsRetardantNameList[0]
          if (outDrugRetardant.isEnabled) {
            if (this.data.discharge.outDrugIsRetardantNameList == null) {
              this.data.discharge.outDrugIsRetardantNameList = []
            }
            if (this.data.discharge.outDrugIsRetardantNameList.length <= 0) {
              if (outDrugRetardant.defaultDrug != null) {
                const drugRetardant = outDrugRetardant.defaultDrug
                this.data.discharge.outDrugIsRetardantNameList.push(
                  drugRetardant.code
                )
                this.data.dischargeDrugsList.push({
                  code: '4',
                  name: drugRetardant.code,
                  unit: 'mg',
                  value: drugRetardant.dose,
                  frequency: drugRetardant.frequency,
                  times: drugRetardant.times,
                  registId: this.registId
                })
              }
            }
          }
        }
      }
    },
    getDefaultAnticoagulation() {
      this.$api.service.getSysSetting(this.anticoagulationRule).then(res => {
        if (res.status === 200) {
          if (res.hasOwnProperty('result')) {
            this.defaultAnticoagulation = parseJson(res.result.value)
            this.setAnticoagulationDefalut(this.defaultAnticoagulation)
          }
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    },
    setAnticoagulationDefalut(settingValue) {
      if (
        settingValue != null &&
        settingValue.isEnabled &&
        settingValue.itemConfig != null
      ) {
        const anticoagulationDrugList = settingValue.itemConfig.filter(function(
          x
        ) {
          return x.code === '1'
        })
        if (
          anticoagulationDrugList != null &&
          anticoagulationDrugList.length > 0
        ) {
          const anticoagulationDrug = anticoagulationDrugList[0]
          if (anticoagulationDrug.isEnabled) {
            if (this.data.treatment.anticoagulationDrug == null) {
              this.data.treatment.anticoagulationDrug =
                anticoagulationDrug.defaultDrug
            }
            if (this.data.treatment.anticoagulationDose == null) {
              this.data.treatment.anticoagulationDose =
                anticoagulationDrug.defaultDose
            }
            if (this.data.treatment.anticoagulationUnit == null) {
              this.data.treatment.anticoagulationUnit =
                anticoagulationDrug.defaultUnit
            }
          }
        }
      }
    },
    getMedicineinHosDefalut() {
      this.$api.service.getSysSetting(this.medicineinhosRule).then(res => {
        if (res.status === 200) {
          if (res.hasOwnProperty('result')) {
            this.defaultMedicineinHos = parseJson(res.result.value)
            this.setMedicineinhosDefalut(this.defaultMedicineinHos)
          }
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    },
    setMedicineinhosDefalut(settingValue) {
      if (
        settingValue != null &&
        settingValue.isEnabled &&
        settingValue.itemConfig != null
      ) {
        const jtywList = settingValue.itemConfig.filter(function(x) {
          return x.code === '1'
        })
        if (
          this.data.discharge != null &&
          this.data.discharge.jtyw.arrayName.length > 0
        ) {
        } else {
          if (jtywList != null && jtywList.length > 0) {
            const jtyw = jtywList[0]
            if (jtyw.isEnabled) {
              for (var i = 0; i < jtyw.defaultDrug.length; i++) {
                if (
                  this.data.discharge.jtyw.arrayName.indexOf(
                    jtyw.defaultDrug[i]
                  ) < 0
                ) {
                  this.data.discharge.jtyw.arrayName.push(jtyw.defaultDrug[i])
                }
              }
              // if (this.$refs.tab_discharge !== undefined) {
              //   this.$refs.tab_discharge.saveJtyw()
              // }
            }
          }
        }

        const knywList = settingValue.itemConfig.filter(function(x) {
          return x.code === '2'
        })
        if (
          this.data.discharge != null &&
          this.data.discharge.knyw.name != null
        ) {
        } else {
          if (knywList != null && knywList.length > 0) {
            const knyw = knywList[0]
            if (knyw.isEnabled) {
              if (this.data.discharge.knyw.name == null) {
                this.data.discharge.knyw.name = knyw.defaultDrug
              }
              // if (this.$refs.tab_discharge !== undefined) {
              //   this.$refs.tab_discharge.saveKnyw()
              // }
            }
          }
        }

        const pcsk9List = settingValue.itemConfig.filter(function(x) {
          return x.code === '3'
        })
        if (
          this.data.discharge != null &&
          this.data.discharge.pcsk9.name != null
        ) {
        } else {
          if (pcsk9List != null && pcsk9List.length > 0) {
            const pcsk9 = pcsk9List[0]
            if (pcsk9.isEnabled) {
              if (this.data.discharge.pcsk9.name == null) {
                this.data.discharge.pcsk9.name = pcsk9.defaultDrug
              }
              if (
                this.data.discharge.pcsk9 != null &&
                this.data.discharge.pcsk9.value == null
              ) {
                this.data.discharge.pcsk9.value = pcsk9.defaultDose
              }
              // if (this.$refs.tab_discharge !== undefined) {
              //   this.$refs.tab_discharge.savePcsk9()
              // }
            }
          }
        }
      }
    },
    async getInspectionDefalut() {
      const res = await this.$api.service.getSysSetting(this.inspectionRule)
      if (res.status === 200) {
        if (res.hasOwnProperty('result')) {
          this.defaultInspection = parseJson(res.result.value)
          this.setInspectionDefalut(this.defaultInspection)
        }
      } else {
        this.$notify({ type: 'warning', message: res.message })
      }
    },
    setInspectionDefalut(settingValue) {
      if (
        settingValue != null &&
        settingValue.isEnabled &&
        settingValue.itemConfig != null
      ) {
        if (
          this.data.inspection.examineType != null &&
          this.data.inspection.examineType.length > 0
        ) {
          return
        }

        const crList = settingValue.itemConfig.filter(function(x) {
          return x.code === '1'
        })
        if (crList != null && crList.length > 0) {
          const cr = crList[0]
          if (cr.isEnabled) {
            if (this.data.inspection.examineType == null) {
              this.data.inspection.examineType = []
            }
            if (this.data.inspection.examineType.indexOf('1') < 0) {
              this.data.inspection.examineType.push(cr.code)
            }
            if (
              this.data.diagnosisTest.cr != null &&
              this.data.diagnosisTest.cr.unit == null
            ) {
              this.data.diagnosisTest.cr.unit = cr.defaultUnit
            }
          }
        }

        const ddimerList = settingValue.itemConfig.filter(function(x) {
          return x.code === '2'
        })
        if (ddimerList != null && ddimerList.length > 0) {
          const ddimer = ddimerList[0]
          if (ddimer.isEnabled) {
            if (this.data.inspection.examineType == null) {
              this.data.inspection.examineType = []
            }
            if (this.data.inspection.examineType.indexOf('2') < 0) {
              this.data.inspection.examineType.push(ddimer.code)
            }
            if (
              this.data.diagnosisTest.ddimer != null &&
              this.data.diagnosisTest.ddimer.unit == null
            ) {
              this.data.diagnosisTest.ddimer.unit = ddimer.defaultUnit
            }
          }
        }

        const bnpList = settingValue.itemConfig.filter(function(x) {
          return x.code === '3'
        })
        if (bnpList != null && bnpList.length > 0) {
          const bnp = bnpList[0]
          if (bnp.isEnabled) {
            if (this.data.inspection.examineType == null) {
              this.data.inspection.examineType = []
            }
            if (this.data.inspection.examineType.indexOf('3') < 0) {
              this.data.inspection.examineType.push(bnp.code)
            }
            if (
              this.data.diagnosisTest.bnp != null &&
              this.data.diagnosisTest.bnp.unit == null
            ) {
              this.data.diagnosisTest.bnp.unit = bnp.defaultUnit
            }
          }
        }

        const nTproBNPList = settingValue.itemConfig.filter(function(x) {
          return x.code === '4'
        })
        if (nTproBNPList != null && nTproBNPList.length > 0) {
          const nTproBNP = nTproBNPList[0]
          if (nTproBNP.isEnabled) {
            if (this.data.inspection.examineType == null) {
              this.data.inspection.examineType = []
            }
            if (this.data.inspection.examineType.indexOf('4') < 0) {
              this.data.inspection.examineType.push(nTproBNP.code)
            }
            if (
              this.data.diagnosisTest.nTproBNP != null &&
              this.data.diagnosisTest.nTproBNP.unit == null
            ) {
              this.data.diagnosisTest.nTproBNP.unit = nTproBNP.defaultUnit
            }
          }
        }

        const myoList = settingValue.itemConfig.filter(function(x) {
          return x.code === '5'
        })
        if (myoList != null && myoList.length > 0) {
          const myo = myoList[0]
          if (myo.isEnabled) {
            if (this.data.inspection.examineType == null) {
              this.data.inspection.examineType = []
            }
            if (this.data.inspection.examineType.indexOf('5') < 0) {
              this.data.inspection.examineType.push(myo.code)
            }
            if (
              this.data.diagnosisTest.myo != null &&
              this.data.diagnosisTest.myo.unit == null
            ) {
              this.data.diagnosisTest.myo.unit = myo.defaultUnit
            }
          }
        }

        const ckmbList = settingValue.itemConfig.filter(function(x) {
          return x.code === '6'
        })
        if (ckmbList != null && ckmbList.length > 0) {
          const ckmb = ckmbList[0]
          if (ckmb.isEnabled) {
            if (this.data.inspection.examineType == null) {
              this.data.inspection.examineType = []
            }
            if (this.data.inspection.examineType.indexOf('6') < 0) {
              this.data.inspection.examineType.push(ckmb.code)
            }
            if (
              this.data.diagnosisTest.ckmb != null &&
              this.data.diagnosisTest.ckmb.unit == null
            ) {
              this.data.diagnosisTest.ckmb.unit = ckmb.defaultUnit
            }
          }
        }
      }
    },
    async getAntiplateletRuleConstant() {
      const res = await this.$api.service.getSysSetting(this.antiplateletRule)
      if (res.status === 200) {
        if (res.hasOwnProperty('result')) {
          this.setDefalutValue(parseJson(res.result.value))
        }
      } else {
        this.$notify({ type: 'warning', message: res.message })
      }
    },
    setDefalutValue(settingValue) {
      if (
        settingValue != null &&
        settingValue.isEnabled &&
        settingValue.itemConfig != null
      ) {
        if (
          this.data.treatment.antiplateletDrug != null &&
          this.data.treatment.antiplateletDrug.length > 0
        ) {
          return
        }
        const antiplateletList = settingValue.itemConfig.filter(function(x) {
          return x.code === '1'
        })
        if (antiplateletList != null && antiplateletList.length > 0) {
          const antiplatelet = antiplateletList[0]
          if (antiplatelet.isEnabled) {
            if (!this.data.treatment.antiplateletDrug) {
              this.data.treatment.antiplateletDrug = []
            }
            if (this.data.treatment.antiplateletDrug.indexOf('1') < 0) {
              this.data.treatment.antiplateletDrug.push(antiplatelet.code)
            }
            if (this.data.treatment.aspirinDose == null) {
              this.data.treatment.aspirinDose = antiplatelet.defaultDose
            }
          }
        }

        const clopidogrelList = settingValue.itemConfig.filter(function(x) {
          return x.code === '2'
        })
        if (clopidogrelList != null && clopidogrelList.length > 0) {
          const clopidogrel = clopidogrelList[0]
          if (clopidogrel.isEnabled) {
            if (this.data.treatment.antiplateletDrug == null) {
              this.data.treatment.antiplateletDrug = []
            }
            if (this.data.treatment.antiplateletDrug.indexOf('2') < 0) {
              this.data.treatment.antiplateletDrug.push(clopidogrel.code)
            }
            if (this.data.treatment.clopidogrelDose == null) {
              this.data.treatment.clopidogrelDose = clopidogrel.defaultDose
            }
          }
        }
        const ticagrelorList = settingValue.itemConfig.filter(function(x) {
          return x.code === '3'
        })
        if (ticagrelorList != null && ticagrelorList.length > 0) {
          const ticagrelor = ticagrelorList[0]
          if (ticagrelor.isEnabled) {
            if (this.data.treatment.antiplateletDrug == null) {
              this.data.treatment.antiplateletDrug = []
            }
            if (this.data.treatment.antiplateletDrug.indexOf('3') < 0) {
              this.data.treatment.antiplateletDrug.push(ticagrelor.code)
            }
            if (this.data.treatment.tigrilloDose == null) {
              this.data.treatment.tigrilloDose = ticagrelor.defaultDose
            }
          }
        }
      }
    },
    changeReportStatus(data) {
      this.setSyncStatus(data)
    },
    setSyncStatus(data) {
      if (data.regist.isReport === '1') {
        this.syncButtonText = '已同步至填报平台'
        this.syncButtonType = 'plain-success'
      } else {
        this.syncButtonText = '同步至填报平台'
        this.syncButtonType = 'plain-warn'
      }
    },
    getBasicInformation() {
      return new Promise(async (resolve, reject) => {
        this.showLoading = true
        try {
          const res = await this.$api.service.getFillInfoAggregate(this.registId)
          this.setSyncStatus(res.result)
          if (res.result.grace.hasOwnProperty('id') === false) {
            res.result.grace = this.graceTemp
          }
          if (
            res.result.admission.hasOwnProperty('isEcgTransmission') === false
          ) {
            res.result.admission.isEcgTransmission = null
          }
          if (
            res.result.admission.hasOwnProperty('ecgTransmissionTime') ===
            false
          ) {
            res.result.admission.ecgTransmissionTime = null
          }
          if (
            res.result.admission.hasOwnProperty('ecgTransmissionType') ===
            false
          ) {
            res.result.admission.ecgTransmissionType = null
          }
          if (
            res.result.inspection.hasOwnProperty('isCardiolohyConsultant') ===
            false
          ) {
            res.result.inspection.isCardiolohyConsultant = null
          }
          if (
            res.result.inspection.hasOwnProperty('noticeConsultantTime') ===
            false
          ) {
            res.result.inspection.noticeConsultantTime = null
          }
          if (
            res.result.inspection.hasOwnProperty('consultantTime') === false
          ) {
            res.result.inspection.consultantTime = null
          }
          if (
            res.result.inspection.hasOwnProperty('consultantType') === false
          ) {
            res.result.inspection.consultantType = null
          }
          if (res.result.inspection.hasOwnProperty('isBypassEm') === false) {
            res.result.inspection.isBypassEm = null
          }
          if (res.result.inspection.hasOwnProperty('isBypassCcu') === false) {
            res.result.inspection.isBypassCcu = null
          }
          if (res.result.prehospital.hasOwnProperty('aspirin') === false) {
            res.result.prehospital.aspirin = null
          }
          if (
            res.result.prehospital.hasOwnProperty('clopidogrel') === false
          ) {
            res.result.prehospital.clopidogrel = null
          }
          if (res.result.prehospital.hasOwnProperty('ticagrelor') === false) {
            res.result.prehospital.ticagrelor = null
          }
          if (
            res.result.treatment.hasOwnProperty('antiplateletDrug') === false
          ) {
            res.result.treatment.antiplateletDrug = []
          }
          if (res.result.treatment.hasOwnProperty('aspirinDose') === false) {
            res.result.treatment.aspirinDose = null
          }
          if (
            res.result.treatment.hasOwnProperty('clopidogrelDose') === false
          ) {
            res.result.treatment.clopidogrelDose = null
          }
          if (
            res.result.treatment.hasOwnProperty('ticagrelorDose') === false
          ) {
            res.result.treatment.ticagrelorDose = null
          }
          const arr = ['21', '31', '41']
          if (arr.includes(res.result.main.status)) {
            this.actionList = [
              {
                icon: 'label-o',
                text: '日志'
              },
              {
                icon: 'description',
                text: '调阅'
              }
            ]
          } else {
            this.actionList = [
              {
                icon: 'replay',
                text: '同步'
              },
              {
                icon: 'label-o',
                text: '日志'
              },
              {
                icon: 'description',
                text: '调阅'
              }
            ]
          }

          const newRes = { ...res.result }
          newRes.admission.heartRate = newRes.admission.heartRate || newRes.admission.pulseRate
          this.data = { ...newRes }

          this.getInspectionDefalut()
          this.getMedicineinHosDefalut()
          this.getDefaultAnticoagulation()
          this.setPatientInfo(this.data)
          this.getAntiplateletRuleConstant()
          this.getDischargemedicationRule()
          this.showLoading = false
          resolve(res)
        } catch (err) {
          this.showLoading = false
          reject(err)
        }
      })
    },
    jumpToDetails() {
      const openUrl = this.$route.query.openUrl
      if (openUrl === '1') {
        this.$bridge.exit()
      } else {
        const type = this.$route.query.type
        this.$router.push({
          path: '/index',
          query: {
            type: type
          }
        })
      }
    },
    jump(path) {
      if (path === this.$route.path) return
      this.$router.push({
        path,
        query: { registId: this.registId }
      })
    },
    refreshData() {
      return this.getBasicInformation()
    },
    refreshDiagnosisData(value) {
      this.patientInfo.diagnosis = value
    },
    onSyncClick() {
      this.reportloading = true
      const _this = this
      setTimeout(() => {
        _this.onSyncClickProcess()
      }, 3000)
    },
    onSyncClickProcess() {
      if (this.$refs.tab_discharge !== undefined) {
        this.data.dischargeDrugsList = this.$refs.tab_discharge.queryData()
      }
      this.$api.service
        .saveFillInfoAggregate(this.data)
        .then(res => {
          if (res.status === 200) {
            if (res.result.isSuccess === '0') {
              if (res.result.errorList && res.result.errorList.length > 0) {
                this.submitResult = res.result.errorList
                this.showSubmitResult = true
              } else if (
                res.result.lmErrorList &&
                res.result.lmErrorList.length > 0
              ) {
                const msg = res.result.lmErrorList.toString()
                this.$notify({
                  type: 'warning',
                  message: '同步至填报平台失败'
                })
                // Dialog.alert({
                //   title: '同步失败',
                //   message: '同步失败',
                //   theme: 'round-button'
                // }).then(() => {})
              } else {
                this.$notify({ type: 'warning', message: '系统错误' })
              }
            } else {
              this.syncButtonText = '已同步至填报平台'
              this.syncButtonType = 'plain-success'
              this.data.regist.isReport = '1'
              this.$notify({
                type: 'success',
                title: '提示',
                message: '患者信息已同步至填报平台'
              })
            }
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
          this.reportloading = false
        })
        .catch(res => {
          this.onSaveException(res)
          this.reportloading = false
        })
    },
    onSaveClick() {
      this.$notify({
        type: 'success',
        title: '提示',
        message: '患者信息保存成功'
      })
    },
    // 提交审核
    onSubmitAuditClick() {
      this.$dialog
        .confirm({ title: '提示', message: '确定提交审核吗?' })
        .then(() => {
          if (this.$refs['patient'].showWarning) {
            Dialog.alert({
              title: '提示',
              message: '请完善患者基本信息！',
              theme: 'round-button'
            }).then(() => {})
            return
          }
          this.tabIndex = 0
          this.validate(() => {
            this.submitAudit()
          })
        })
        .catch(validate => {})
    },
    submitAudit() {
      this.showLoading = true
      if (this.$refs.tab_discharge !== undefined) {
        this.data.dischargeDrugsList = this.$refs.tab_discharge.queryData()
      }
      this.$api.service
        .submitAudit(this.data)
        .then(res => {
          this.showLoading = false
          if (res.status === 200) {
            if (res.result.isSuccess === '0') {
              if (res.result.errorList && res.result.errorList.length > 0) {
                this.submitResult = res.result.errorList
                // this.showSubmitResult = true
                this.$notify({
                  type: 'warning',
                  message: this.submitResult[0]
                })
              } else if (
                res.result.lmErrorList &&
                res.result.lmErrorList.length > 0
              ) {
                const msg = res.result.lmErrorList.toString()
                Dialog.alert({
                  title: '上传联盟错误',
                  message: msg,
                  theme: 'round-button'
                }).then(() => {})
              } else {
                this.$notify({ type: 'error', message: '系统错误' })
              }
            } else {
              this.$notify({ type: 'success', message: '提交审核成功' })
              this.getBasicInformation()
            }
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
        .catch(_ => {
          this.showLoading = false
        })
    },
    validate(callback) {
      if (this.tabIndex >= this.validateTabs.length) {
        const checkNoRes = this.checkMzAndZy()
        const checkMedicineRes = this.checkMedicine()
        if (checkNoRes.result && checkMedicineRes.result) {
          callback(true)
        } else if (!checkNoRes.result) {
          this.active = checkNoRes.tabIndex
          this.$notify({ type: 'warning', message: `${checkNoRes.errMsg}` })
        } else {
          this.active = checkMedicineRes.tabIndex
          this.$notify({
            type: 'warning',
            message: `${checkMedicineRes.errMsg}`
          })
        }
        return
      }
      const tab = this.validateTabs[this.tabIndex]
      this.$refs[tab.name]
        .validate()
        .then(valid => {
          this.tabIndex++
          this.validate(callback)
        })
        .catch(valid => {
          this.active = tab.index
          if (valid && valid.length > 0) {
            this.$notify({ type: 'warning', message: valid[0].message })
          } else {
            this.$notify({ type: 'warning', message: '患者信息提交失败' })
          }
        })
    },
    checkMzAndZy() {
      if (this._resources.mrDischarge() && this.showDischarge) {
        // 显示转归模块，门诊号和住院号二选一填写
        if (!this.data.main.outPatientNo && !this.data.main.admissionNo) {
          return {
            result: false,
            errMsg: '门诊号和住院号二选一填写',
            tabIndex: this.showFirstAid ? 1 : 0
          }
        }
      } else {
        // 不显示转归模块，门诊号必填
        if (!this.data.main.outPatientNo) {
          return {
            result: false,
            errMsg: '门诊号必填',
            tabIndex: this.showFirstAid ? 1 : 0
          }
        }
      }

      return { result: true }
    },
    // 双抗给药必须至少选择一种要，并且时间和剂量都填写
    checkMedicine() {
      let res = { result: true }

      // 院前双抗给药校验
      if (this._resources.mrFirstAid() && this.showFirstAid) {
        if (
          !this.data.prehospital.isAntiplatelet ||
          this.data.prehospital.isAntiplatelet === '0' ||
          (this.data.prehospital.isAntiplatelet === '1' &&
            this.data.prehospital.drugTime &&
            ((this.data.prehospital.antiplatelet.indexOf('1') > -1 &&
              this.data.prehospital.aspirin) ||
              (this.data.prehospital.antiplatelet.indexOf('2') > -1 &&
                this.data.prehospital.clopidogrel) ||
              (this.data.prehospital.antiplatelet.indexOf('3') > -1 &&
                this.data.prehospital.ticagrelor)))
        ) {
          res = { result: true }
        } else {
          res = {
            result: false,
            errMsg: '院前抗血小板治疗药物必选一项',
            tabIndex: 0
          }
        }
      }

      if (res.result) {
        if (this._resources.mrCure() && this.showCure) {
          if (
            !this.data.treatment.isAntiplatelet ||
            this.data.treatment.isAntiplatelet === '0' ||
            (this.data.treatment.isAntiplatelet === '1' &&
              ((this.data.treatment.antiplateletDrug &&
                this.data.treatment.antiplateletDrug.indexOf('1') > -1 &&
                this.data.treatment.aspirinDose &&
                this.data.treatment.aspirinTime) ||
                (this.data.treatment.antiplateletDrug &&
                  this.data.treatment.antiplateletDrug.indexOf('2') > -1 &&
                  this.data.treatment.clopidogrelDose &&
                  this.data.treatment.clopidogrelTime) ||
                (this.data.treatment.antiplateletDrug &&
                  this.data.treatment.antiplateletDrug.indexOf('3') > -1 &&
                  this.data.treatment.tigrilloDose &&
                  this.data.treatment.tigrilloTime)))
          ) {
            return { result: true }
          } else {
            return {
              result: false,
              errMsg: '院内抗血小板治疗药物必选一项',
              tabIndex: this.tabIndex - 2
            }
          }
        } else {
          return { result: true }
        }
      } else {
        return { result: true }
      }
    },
    // 撤回审核
    withdrawAudit() {
      this.$dialog
        .confirm({ title: '提示', message: '确定撤回审核吗?' })
        .then(() => {
          this.showLoading = true
          this.archiveData.registId = this.registId
          this.$api.service.withdrawAudit(this.archiveData).then(res => {
            if (res.status === 200) {
              this.$notify({ type: 'success', message: '撤回审核成功' })
              this.getBasicInformation()
            } else {
              this.$notify({ type: 'warning', message: res.message })
            }
            this.showLoading = false
          })
        })
        .catch(() => {
          this.showLoading = false
        })
    },
    // 通过审核
    passAudit() {
      this.$dialog
        .confirm({ title: '提示', message: '确定通过审核吗?' })
        .then(() => {
          this.archiveData.registId = this.registId
          this.showLoading = true
          this.$api.service.passAudit(this.archiveData).then(res => {
            if (res.status === 200) {
              this.$notify({ type: 'success', message: '通过审核成功' })
              this.getBasicInformation()
            } else {
              this.$notify({ type: 'warning', message: res.message })
            }
            this.showLoading = false
          })
        })
        .catch(() => {
          this.showLoading = false
        })
    },
    // 存档
    archive() {
      this.$dialog
        .confirm({ title: '提示', message: '确定通过审核吗?' })
        .then(() => {
          this.archiveData.registId = this.registId
          this.showLoading = true
          this.$api.service.archive(this.archiveData).then(res => {
            if (res.status === 200) {
              this.$notify({ type: 'success', message: '通过审核成功' })
              this.getBasicInformation()
            } else {
              this.$notify({ type: 'warning', message: res.message })
            }
            this.showLoading = false
          })
        })
        .catch(() => {
          this.showLoading = false
        })
    },
    onSaveException(res) {
      if (res && res.code && res.code === '10') {
        Dialog.alert({
          message: res.message
        }).then(() => {
          this.showLoading = true
          this.refreshData()
            .then(() => {
              this.showLoading = false
            })
            .catch(() => {
              this.showLoading = false
            })
        })
      }
    },
    hasPermision() {
      return ((this._resources.mrFirstAid() && this.showFirstAid) ||
      this._resources.mrTriage() ||
      this._resources.mrInspection() ||
      (this._resources.mrCure() && this.showCure()) ||
      (this._resources.mrPci() && this.showPci) ||
      (this._resources.mrDischarge() && this.showDischarge())
      )
    }
  },
  watch: {
    loading(bool) {
      if (bool) {
        this.toast = this.$toast.loading({
          duration: 0, // 持续展示 toast
          // forbidClick: true,
          message: '同步中...'
        })
      } else if (this.toast) {
        this.toast.clear()
      }
    },
    'data.admission.comeType': {
      immediate: false,
      handler(newVal, oldVal) {
        if (
          this.data.admission.comeType === '3' ||
          this.data.admission.comeType === '4'
        ) {
          this.active = '0'
        }
      },
      deep: true
    },
    'data.prehospital.arrivedHospitalTime': {
      immediate: false,
      handler(newVal, oldVal) {
        this.patientInfo.arriveTime = newVal
      },
      deep: true
    },
    'data.admission.arrivedHospitalTime': {
      immediate: false,
      handler(newVal, oldVal) {
        this.patientInfo.arriveTime = newVal
        if (
          this._resources.mrCure() &&
          this.showCure &&
          newVal &&
          this.data.treatment.rsStartTime &&
          this.$moment(newVal).isAfter(
            this.$moment(this.data.treatment.rsStartTime)
          )
        ) {
          this.$notify({
            type: 'warning',
            message: '到院时间应早于开始溶栓时间'
          })
        }

        if (
          this._resources.mrPci() &&
          this.showPci &&
          newVal &&
          this.data.treatmentPci.gwPassageTime &&
          this.$moment(newVal).isAfter(
            this.$moment(this.data.treatmentPci.gwPassageTime)
          )
        ) {
          this.$notify({
            type: 'warning',
            message: '到院时间应早于导丝通过时间'
          })
        }
      },
      deep: true
    },
    'data.main.attackTime': {
      immediate: false,
      handler(newVal, oldVal) {
        this.patientInfo.diseaseTime = newVal
        if (
          this.data.admission.fmcTime &&
          newVal &&
          this.$moment(this.data.admission.fmcTime).isBefore(
            this.$moment(newVal)
          )
        ) {
          this.$notify({
            type: 'warning',
            message: '发病时间应早于首次医疗接触时间'
          })
        }
      },
      deep: true
    },
    'data.main.outPatientNo': {
      immediate: false,
      handler(newVal, oldVal) {
        this.patientInfo.outpatientNo = newVal
      },
      deep: true
    },
    'data.prehospital.rsStartTime': {
      immediate: false,
      handler(newVal) {
        // if (
        //   this._resources.mrFirstAid() &&
        //   this.showFirstAid &&
        //   newVal &&
        //   this.data.admission.arrivedHospitalTime &&
        //   this.$moment(this.data.admission.arrivedHospitalTime).isAfter(
        //     this.$moment(newVal)
        //   )
        // ) {
        //   this.$notify({
        //     type: 'warning',
        //     message: '到院时间应早于开始溶栓时间'
        //   })
        // }

        if (
          this._resources.mrFirstAid() &&
          this.showFirstAid &&
          newVal &&
          this.data.admission.fmcTime &&
          this.$moment(this.data.admission.fmcTime).isAfter(
            this.$moment(newVal)
          )
        ) {
          this.$notify({
            type: 'warning',
            message: '首次医疗接触时间应早于开始溶栓时间'
          })
        }

        if (
          this._resources.mrFirstAid() &&
          this.showFirstAid &&
          this.data.prehospital.rsScreen === '2' &&
          this.data.prehospital.isRs === '1' &&
          newVal &&
          this.data.prehospital.diagnosisTime &&
          this.$moment(this.data.prehospital.diagnosisTime).isAfter(
            this.$moment(newVal)
          )
        ) {
          this.$notify({
            type: 'warning',
            message: '院前诊断时间应早于开始溶栓时间'
          })
        }
      },
      deep: true
    },
    'data.prehospital.rsStartAgreeTime': {
      immediate: false,
      handler(newVal) {
        if (
          this._resources.mrFirstAid() &&
          this.showFirstAid &&
          this.data.prehospital.rsScreen === '2' &&
          this.data.prehospital.isRs === '1' &&
          newVal &&
          this.data.prehospital.diagnosisTime &&
          this.$moment(this.data.prehospital.diagnosisTime).isAfter(
            this.$moment(newVal)
          )
        ) {
          this.$notify({
            type: 'warning',
            message: '院前诊断时间应早于开始知情同意时间'
          })
        }
      },
      deep: true
    },
    'data.prehospital.rsSignAgreeTime': {
      immediate: false,
      handler(newVal) {
        if (
          this._resources.mrFirstAid() &&
          this.showFirstAid &&
          this.data.prehospital.rsScreen === '2' &&
          this.data.prehospital.isRs === '1' &&
          newVal &&
          this.data.prehospital.diagnosisTime &&
          this.$moment(this.data.prehospital.diagnosisTime).isAfter(
            this.$moment(newVal)
          )
        ) {
          this.$notify({
            type: 'warning',
            message: '院前诊断时间应早于签署知情同意书时间'
          })
        }
      },
      deep: true
    },
    'data.prehospital.rsEndTime': {
      immediate: false,
      handler(newVal) {
        if (
          this._resources.mrFirstAid() &&
          this.showFirstAid &&
          this.data.prehospital.rsScreen === '2' &&
          this.data.prehospital.isRs === '1' &&
          newVal &&
          this.data.prehospital.diagnosisTime &&
          this.$moment(this.data.prehospital.diagnosisTime).isAfter(
            this.$moment(newVal)
          )
        ) {
          this.$notify({
            type: 'warning',
            message: '院前诊断时间应早于溶栓结束时间'
          })
        }
      },
      deep: true
    },
    'data.treatment.rsStartTime': {
      immediate: false,
      handler(newVal) {
        if (
          this._resources.mrCure() &&
          this.showCure &&
          newVal &&
          this.data.admission.arrivedHospitalTime &&
          this.$moment(this.data.admission.arrivedHospitalTime).isAfter(
            this.$moment(newVal)
          )
        ) {
          this.$notify({
            type: 'warning',
            message: '到院时间应早于开始溶栓时间'
          })
        }

        if (
          this._resources.mrCure() &&
          this.showCure &&
          newVal &&
          this.data.admission.fmcTime &&
          this.$moment(this.data.admission.fmcTime).isAfter(
            this.$moment(newVal)
          )
        ) {
          this.$notify({
            type: 'warning',
            message: '首次医疗接触时间应早于开始溶栓时间'
          })
        }
      },
      deep: true
    },
    'data.prehospitalEcgList': {
      immediate: false,
      handler(newVal) {
        if (
          this._resources.mrFirstAid() &&
          this.showFirstAid &&
          this.data.prehospital.hasPreEcg === '1'
        ) {
          const tempArr = [...this.data.prehospitalEcgList]
          if (tempArr.length === 0) return
          const firstEcg = tempArr.sort((a, b) => a.checkTime - b.checkTime)[0]
          if (
            firstEcg.checkTime &&
            this.data.admission.fmcTime &&
            this.$moment(this.data.admission.fmcTime).isAfter(
              this.$moment(firstEcg.checkTime)
            )
          ) {
            this.$notify({
              type: 'warning',
              message: '首次医疗接触时间应早于首份心电图时间'
            })
          }

          if (
            firstEcg.checkTime &&
            firstEcg.diagnosisTime &&
            this.$moment(firstEcg.checkTime).isAfter(
              this.$moment(firstEcg.diagnosisTime)
            )
          ) {
            this.$notify({
              type: 'warning',
              message: '首份心电图时间应早于首份心电图诊断时间'
            })
          }
        }
      },
      deep: true
    },
    'data.admissionEcgList': {
      immediate: false,
      handler(newVal) {
        if (this.showInspection && this.data.admission.isEcg === '1') {
          const tempArr = [...this.data.admissionEcgList]
          if (tempArr.length === 0) return
          const firstEcg = tempArr.sort((a, b) => a.checkTime - b.checkTime)[0]
          if (
            firstEcg.checkTime &&
            this.data.admission.fmcTime &&
            this.$moment(this.data.admission.fmcTime).isAfter(
              this.$moment(firstEcg.checkTime)
            )
          ) {
            this.$notify({
              type: 'warning',
              message: '首次医疗接触时间应早于首份心电图时间'
            })
          }

          if (
            firstEcg.checkTime &&
            firstEcg.diagnosisTime &&
            this.$moment(firstEcg.checkTime).isAfter(
              this.$moment(firstEcg.diagnosisTime)
            )
          ) {
            this.$notify({
              type: 'warning',
              message: '首份心电图时间应早于首份心电图诊断时间'
            })
          }
        }
      },
      deep: true
    },
    'data.creatinineproteinList': {
      immediate: false,
      handler(newVal) {
        if (this.showInspection) {
          const tempArr = [...this.data.creatinineproteinList]
          if (tempArr.length === 0) return
          const firstTn = tempArr.sort(
            (a, b) => a.drawBloodTime - b.drawBloodTime
          )[0]
          console.log(firstTn)

          if (
            firstTn.drawBloodTime &&
            firstTn.reportTime &&
            this.$moment(firstTn.drawBloodTime).isAfter(
              this.$moment(firstTn.reportTime)
            )
          ) {
            this.$notify({
              type: 'warning',
              message: '首次肌钙蛋抽血完成时间应早于首次肌钙蛋白获取报告时间'
            })
          }
        }
      },
      deep: true
    },
    'data.treatmentPci.gwPassageTime': {
      immediate: false,
      handler(newVal) {
        if (
          this._resources.mrPci() &&
          this.showPci &&
          newVal &&
          this.data.admission.arrivedHospitalTime &&
          this.$moment(this.data.admission.arrivedHospitalTime).isAfter(
            this.$moment(newVal)
          )
        ) {
          this.$notify({
            type: 'warning',
            message: '到院时间应早于导丝通过时间'
          })
        }

        if (
          this._resources.mrPci() &&
          this.showPci &&
          newVal &&
          this.data.admission.fmcTime &&
          this.$moment(this.data.admission.fmcTime).isAfter(
            this.$moment(newVal)
          )
        ) {
          this.$notify({
            type: 'warning',
            message: '首次医疗接触时间应早于导丝通过时间'
          })
        }
      },
      deep: true
    },
    'data.prehospital.diagnosisTime': {
      immediate: false,
      handler(newVal) {
        if (
          this._resources.mrFirstAid() &&
          this.showFirstAid &&
          newVal &&
          (this.data.admission.comeType === '1' ||
            this.data.admission.comeType === '2')
        ) {
          if (
            this.data.prehospital.isAntiplatelet === '1' &&
            this.data.prehospital.drugTime &&
            this.$moment(newVal).isAfter(
              this.$moment(this.data.prehospital.drugTime)
            )
          ) {
            this.$notify({
              type: 'warning',
              message: '院前诊断时间应早于负荷量双抗给药时间'
            })
          }
          if (
            this.data.inspection.diagnosisTime &&
            this.showInspection &&
            this.$moment(newVal).isAfter(
              this.$moment(this.data.inspection.diagnosisTime)
            )
          ) {
            this.$notify({
              type: 'warning',
              message: '院前诊断时间应早于初步诊断时间'
            })
          }

          if (
            this._resources.mrCure() &&
            this.showCure &&
            this.data.treatment.isAntiplatelet === '1' &&
            this.data.treatment.antiplateletDrug &&
            this.data.treatment.antiplateletDrug.length > 0
          ) {
            let drugTime = ''
            if (this.data.treatment.antiplateletDrug.indexOf('1') > -1) {
              drugTime = this.data.treatment.aspirinTime
            }
            if (this.data.treatment.antiplateletDrug.indexOf('2') > -1) {
              drugTime =
                this.data.treatment.clopidogrelTime < drugTime
                  ? this.data.treatment.clopidogrelTime
                  : drugTime
            }
            if (this.data.treatment.antiplateletDrug.indexOf('3') > -1) {
              drugTime =
                this.data.treatment.tigrilloTime < drugTime
                  ? this.data.treatment.tigrilloTime
                  : drugTime
            }

            if (
              drugTime &&
              this.$moment(newVal).isAfter(this.$moment(drugTime))
            ) {
              this.$notify({
                type: 'warning',
                message: '院前诊断时间应早于院内负荷量双抗给药时间'
              })
            }
          }

          if (
            this._resources.mrCure() &&
            this.showCure &&
            this.data.treatment.isAnticoagulation === '1' &&
            this.data.treatment.anticoagulationTime &&
            this.$moment(newVal).isAfter(
              this.$moment(this.data.treatment.anticoagulationTime)
            )
          ) {
            this.$notify({
              type: 'warning',
              message: '院前诊断时间应早于术前抗凝时间'
            })
          }

          if (
            this.data.admission.fmcTime &&
            this.$moment(this.data.admission.fmcTime).isAfter(
              this.$moment(newVal)
            )
          ) {
            this.$notify({
              type: 'warning',
              message: '首次医疗接触时间应早于院前诊断时间'
            })
          }

          if (
            this.data.prehospital.rsScreen === '2' &&
            this.data.prehospital.isRs === '1'
          ) {
            if (
              this.data.prehospital.rsStartAgreeTime &&
              this.$moment(newVal).isAfter(
                this.$moment(this.data.prehospital.rsStartAgreeTime)
              )
            ) {
              this.$notify({
                type: 'warning',
                message: '院前诊断时间应早于开始知情同意时间'
              })
            }

            if (
              this.data.prehospital.rsSignAgreeTime &&
              this.$moment(newVal).isAfter(
                this.$moment(this.data.prehospital.rsSignAgreeTime)
              )
            ) {
              this.$notify({
                type: 'warning',
                message: '院前诊断时间应早于签署知情同意书时间'
              })
            }

            if (
              this.data.prehospital.rsStartTime &&
              this.$moment(newVal).isAfter(
                this.$moment(this.data.prehospital.rsStartTime)
              )
            ) {
              this.$notify({
                type: 'warning',
                message: '院前诊断时间应早于开始溶栓时间'
              })
            }

            if (
              this.data.prehospital.rsEndTime &&
              this.$moment(newVal).isAfter(
                this.$moment(this.data.prehospital.rsEndTime)
              )
            ) {
              this.$notify({
                type: 'warning',
                message: '院前诊断时间应早于溶栓结束时间'
              })
            }
          }
        }
      },
      deep: true
    },
    'data.inspection.diagnosisTime': {
      immediate: false,
      handler(newVal) {
        if (newVal) {
          if (
            this._resources.mrFirstAid() &&
            this.showFirstAid &&
            this.showInspection &&
            this.data.prehospital.diagnosisTime &&
            this.$moment(this.data.prehospital.diagnosisTime).isAfter(
              this.$moment(newVal)
            )
          ) {
            this.$notify({
              type: 'warning',
              message: '院前诊断时间应早于初步诊断时间'
            })
          }
          if (
            this._resources.mrCure() &&
            this.showCure &&
            this.showInspection &&
            this.data.treatment.isAntiplatelet === '1' &&
            this.data.treatment.antiplateletDrug &&
            this.data.treatment.antiplateletDrug.length > 0
          ) {
            let drugTime = ''
            if (this.data.treatment.antiplateletDrug.indexOf('1') > -1) {
              drugTime = this.data.treatment.aspirinTime
            }
            if (this.data.treatment.antiplateletDrug.indexOf('2') > -1) {
              drugTime =
                this.data.treatment.clopidogrelTime < drugTime
                  ? this.data.treatment.clopidogrelTime
                  : drugTime
            }
            if (this.data.treatment.antiplateletDrug.indexOf('3') > -1) {
              drugTime =
                this.data.treatment.tigrilloTime < drugTime
                  ? this.data.treatment.tigrilloTime
                  : drugTime
            }

            if (
              drugTime &&
              this.$moment(newVal).isAfter(this.$moment(drugTime))
            ) {
              this.$notify({
                type: 'warning',
                message: '初步诊断时间应早于院内负荷量双抗给药时间'
              })
            }
          }

          if (
            this._resources.mrCure() &&
            this.showCure &&
            this.showInspection &&
            this.data.treatment.isAnticoagulation === '1' &&
            this.data.treatment.anticoagulationTime &&
            this.$moment(newVal).isAfter(
              this.$moment(this.data.treatment.anticoagulationTime)
            )
          ) {
            this.$notify({
              type: 'warning',
              message: '初步诊断时间应早于术前抗凝时间'
            })
          }
        }
      },
      deep: true
    },
    'data.prehospital.drugTime': {
      immediate: false,
      handler(newVal) {
        if (
          this._resources.mrFirstAid() &&
          this.showFirstAid &&
          newVal &&
          this.data.prehospital.isAntiplatelet === '1' &&
          this.data.prehospital.diagnosisTime &&
          this.$moment(this.data.prehospital.diagnosisTime).isAfter(
            this.$moment(newVal)
          )
        ) {
          this.$notify({
            type: 'warning',
            message: '院前诊断时间应早于负荷量双抗给药时间'
          })
        }
      },
      deep: true
    },
    'data.treatment.aspirinTime': {
      immediate: false,
      handler(newVal) {
        if (
          this._resources.mrCure() &&
          this.showCure &&
          this.data.treatment.isAntiplatelet === '1' &&
          this.data.treatment.antiplateletDrug &&
          this.data.treatment.antiplateletDrug.length > 0 &&
          newVal &&
          this.data.inspection.diagnosisTime &&
          this.$moment(this.data.inspection.diagnosisTime).isAfter(
            this.$moment(newVal)
          )
        ) {
          this.$notify({
            type: 'warning',
            message: '初步诊断时间应早于负荷量双抗给药时间'
          })
        }
      },
      deep: true
    },
    'data.treatment.clopidogrelTime': {
      immediate: false,
      handler(newVal) {
        if (
          this._resources.mrCure() &&
          this.showCure &&
          this.data.treatment.isAntiplatelet === '1' &&
          this.data.treatment.antiplateletDrug &&
          this.data.treatment.antiplateletDrug.length > 0 &&
          newVal &&
          this.data.inspection.diagnosisTime &&
          this.$moment(this.data.inspection.diagnosisTime).isAfter(
            this.$moment(newVal)
          )
        ) {
          this.$notify({
            type: 'warning',
            message: '初步诊断时间应早于负荷量双抗给药时间'
          })
        }
      },
      deep: true
    },
    'data.treatment.tigrilloTime': {
      immediate: false,
      handler(newVal) {
        if (
          this._resources.mrCure() &&
          this.showCure &&
          this.data.treatment.isAntiplatelet === '1' &&
          this.data.treatment.antiplateletDrug &&
          this.data.treatment.antiplateletDrug.length > 0 &&
          newVal &&
          this.data.inspection.diagnosisTime &&
          this.$moment(this.data.inspection.diagnosisTime).isAfter(
            this.$moment(newVal)
          )
        ) {
          this.$notify({
            type: 'warning',
            message: '初步诊断时间应早于负荷量双抗给药时间'
          })
        }
      },
      deep: true
    },
    'data.treatment.anticoagulationTime': {
      immediate: false,
      handler(newVal) {
        if (
          this._resources.mrCure() &&
          this.showCure &&
          this.data.treatment.isAnticoagulation === '1' &&
          newVal &&
          this.data.inspection.diagnosisTime &&
          this.$moment(this.data.inspection.diagnosisTime).isAfter(
            this.$moment(newVal)
          )
        ) {
          this.$notify({
            type: 'warning',
            message: '初步诊断时间应早于术前抗凝时间'
          })
        }
      },
      deep: true
    },
    'data.prehospital.zcyyVisitTime': {
      immediate: false,
      handler(newVal) {
        if (
          this._resources.mrFirstAid() &&
          this.showFirstAid &&
          newVal &&
          this.data.prehospital.zcyyLeaveTime &&
          this.$moment(newVal).isAfter(
            this.$moment(this.data.prehospital.zcyyLeaveTime)
          )
        ) {
          this.$notify({
            type: 'warning',
            message: '转出医院入门时间应早于转出医院出门时间'
          })
        }
      },
      deep: true
    },
    'data.prehospital.zcyyLeaveTime': {
      immediate: false,
      handler(newVal) {
        if (
          this._resources.mrFirstAid() &&
          this.showFirstAid &&
          newVal &&
          this.data.prehospital.zcyyVisitTime &&
          this.$moment(this.data.prehospital.zcyyVisitTime).isAfter(
            this.$moment(newVal)
          )
        ) {
          this.$notify({
            type: 'warning',
            message: '转出医院入门时间应早于转出医院出门时间'
          })
        }
      },
      deep: true
    },
    'data.screenage.ect.noticeTime': {
      immediate: false,
      handler(newVal) {
        if (
          this.showInspection &&
          this.showPacs &&
          newVal &&
          this.data.inspection.hasMedicalimages === '1' &&
          this.data.medicalimagesType?.indexOf('1') > -1 &&
          this.data.screenage.ect.enterTime &&
          this.$moment(newVal).isAfter(
            this.$moment(this.data.screenage.ect.enterTime)
          )
        ) {
          this.$notify({
            type: 'warning',
            message: '通知CT时间应早于CT室完成准备时间'
          })
        }
      },
      deep: true
    },
    'data.screenage.ect.enterTime': {
      immediate: false,
      handler(newVal) {
        if (
          this.showInspection &&
          this.showPacs &&
          newVal &&
          this.data.inspection.hasMedicalimages === '1' &&
          this.data.medicalimagesType?.indexOf('1') > -1 &&
          this.data.screenage.ect.noticeTime &&
          this.$moment(this.data.screenage.ect.noticeTime).isAfter(
            this.$moment(newVal)
          )
        ) {
          this.$notify({
            type: 'warning',
            message: '通知CT时间应早于CT室完成准备时间'
          })
        }
      },
      deep: true
    },
    'data.treatment.startPciTime': {
      immediate: false,
      handler(newVal) {
        if (
          this._resources.mrCure() &&
          this.showCure &&
          (this.showZJPCI || this.showJJPCI) &&
          newVal &&
          this.data.treatmentPci.activateConduitTime &&
          this.$moment(newVal).isAfter(
            this.$moment(this.data.treatmentPci.activateConduitTime)
          )
        ) {
          this.$notify({
            type: 'warning',
            message: '启动导管室时间应早于导管室激活时间'
          })
        }
      },
      deep: true
    },
    'data.treatmentPci.activateConduitTime': {
      immediate: false,
      handler(newVal) {
        if (
          this._resources.mrPci() &&
          this.showPci &&
          this.showPPCI &&
          newVal &&
          this.data.treatment.startPciTime &&
          this.$moment(this.data.treatment.startPciTime).isAfter(
            this.$moment(newVal)
          )
        ) {
          this.$notify({
            type: 'warning',
            message: '启动导管室时间应早于导管室激活时间'
          })
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/styles/common/document/edit.less';
.button {
  font-size: 0.48rem;
  color: #fff;
  padding: 0 8px;
}

.op-container {
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f3f3f3;
  button {
    border-radius: 44px;
    flex-grow: 1;
    height: 76px;
    margin: 0px 10px;
  }

  .button--right {
    background: #5e74fe;
    color: #fff;
    border: 1px solid #5e74fe;
  }

  .button--left {
    background: #fff;
    color: #5e74fe;
    border: 1px solid #5e74fe;
  }

  button:nth-child(3) {
    margin-left: 0px;
  }
  .span {
    flex-grow: 1;
    display: flex;
    justify-content: space-between;
    .van-button {
      flex-grow: 1;
    }
  }
}
.scroll-view{
  /deep/.van-tab__pane + .van-empty{
    display: none;
  }
}
</style>
