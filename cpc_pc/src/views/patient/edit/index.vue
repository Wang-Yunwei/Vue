<template>
  <div class="edit-panel">
    <el-container>
      <el-aside :class="timelineClass">
        <timeline :id="registId" ref="timeline" />
      </el-aside>
      <el-main class="content-area">
        <baseinfo
          ref="baseinfo"
          :value="patientInfo.regist"
          :data-main="patientInfo.main"
          :admission="patientInfo.admission"
          :disabled="isReadonly"
          @modelchanged="basicchanged"
        />
        <div class="button-panel">
          <!-- <div v-if="patientInfo.regist.patientNo">
            <el-button type="primary" size="medium">同步</el-button>
          </div> -->
          <div
            v-if="
              (patientInfo.main.status === '10' || patientInfo.main.status === '12' ||
                patientInfo.main.status === '13') && isLock === '0'"
          >
            <el-button
              v-permission="['mr-add']"
              type="primary"
              plain
              size="medium"
              @click="doSave"
            >保存</el-button>
            <el-button
              v-permission="['mr-submit']"
              type="primary"
              size="medium"
              @click="doSubmit"
            >提交</el-button>
          </div>
          <div v-if="patientInfo.main.status === '21' && isLock === '0'">
            <el-button
              v-show="patientInfo.main.submitBy === user.username"
              v-permission="['mr-submit']"
              type="primary"
              size="small"
              @click="withdraw"
            >撤回</el-button>
            <el-button
              v-permission="['mr-auditreject']"
              type="primary"
              plain
              size="medium"
              @click="reject('1')"
            >驳回</el-button>
            <el-button
              v-permission="['mr-audit']"
              type="primary"
              size="medium"
              @click="pass"
            >通过</el-button>
          </div>
          <div
            v-if="patientInfo.main.status === '31' && isLock === '0'"
          >
            <el-button
              v-permission="['mr-archivereject']"
              type="primary"
              plain
              size="medium"
              @click="reject('2')"
            >驳回</el-button>
            <el-button
              v-permission="['mr-archive']"
              type="primary"
              size="medium"
              @click="archive"
            >存档</el-button>
          </div>
        </div>
        <div class="tabs">
          <div v-if="patientInfo.regist" class="function-bar flex-c-b">
            <div v-if="noticeTag > 0" class="notice">
              <el-image
                style="width: 20px; height: 20px; margin-right: 6px;"
                :src="require('@/assets/images/' + iconDesc[noticeTag - 1].name)"
              />
              <span :class="getNoticeClass()">{{ iconDesc[noticeTag - 1].desc }}</span>
            </div>
            <el-button
              v-if="!isReadonly"
              size="mini"
              type="success"
              @click="rfTagShowModal(patientInfo.regist)"
            >
              {{ rfButName }}
            </el-button>
            <bind-patient
              v-if="!isBound && !isReadonly"
              title="绑定患者"
              is-bind
              type="2"
              :patient-name="patientInfo.regist.name"
              :hospital-id="patientInfo.regist.hospitalId"
              :hospital-area="patientInfo.regist.hospitalArea"
              style="margin-left: 10px"
              @bind="onBind"
            >
              <el-button size="mini" type="success">绑定患者</el-button>
            </bind-patient>
            <template v-if="isBound && !isReadonly">
              <el-button
                size="mini"
                type="success"
                @click="onSelectMoreActions()"
              >同步</el-button>
              <el-button
                size="mini"
                type="success"
                @click="onReview"
              >调阅</el-button>
            </template>
          </div>
          <el-tabs v-if="tabs.length" v-model="moduleName">
            <el-tab-pane
              v-for="tab in tabs"
              :key="tab.name"
              :label="tab.label"
              :name="tab.name"
              :class="tab.class"
            >
              <component :is="tab.component" v-bind="tab.attrs" v-on="tab.events" />
            </el-tab-pane>
            <!-- <el-tab-pane
              v-if="showFirstAid && checkPermission(['mr-firstaid'])"
              label="院前急救"
              name="first"
              :class="tabpanelClass"
            >
              <prehospital
                ref="prehospital"
                :data="patientInfo"
                :disabled="isReadonly"
                @showimport="showimport"
              />
            </el-tab-pane>
            <el-tab-pane
              v-if="checkPermission(['mr-triage'])"
              label="急诊分诊"
              name="second"
              :class="tabpanelClass"
            >
              <triage
                ref="triage"
                :data="patientInfo"
                :disabled="isReadonly"
                @showimport="showimport"
              />
            </el-tab-pane>
            <el-tab-pane
              v-if="checkPermission(['mr-inspection'])"
              label="检验检查"
              name="third"
              :class="tabpanelClass"
            >
              <detection
                ref="detection"
                :data="patientInfo"
                :disabled="isReadonly"
              />
            </el-tab-pane>
            <el-tab-pane
              v-if="showCure && checkPermission(['mr-cure'])"
              label="院内诊疗"
              name="fourth"
              :class="tabpanelClass"
            >
              <cure
                ref="cure"
                :is-stemi="isStemi"
                :data="patientInfo"
                :disabled="isReadonly"
              />
            </el-tab-pane>
            <el-tab-pane
              v-if="showPci && checkPermission(['mr-pci'])"
              label="介入手术"
              name="fifth"
              :class="tabpanelClass"
            >
              <pci
                ref="pci"
                :data="patientInfo"
                :zj-pci="showZJPCI"
                :bj-pci="showBJPCI"
                :rsh-pci="showRSHJR"
                :jj-pci="showJJPCI"
                :disabled="isReadonly"
              />
            </el-tab-pane>
            <el-tab-pane
              v-if="showDischarge&& checkPermission(['mr-discharge'])"
              label="患者转归"
              name="sixth"
              :class="tabpanelClass"
            >
              <discharge
                ref="discharge"
                :data="patientInfo"
                :disabled="isReadonly"
                @showimport="showimport"
              />
            </el-tab-pane> -->
          </el-tabs>
          <div v-else class="flex-c-c" style="height:calc(100vh - 275px)">
            <el-empty description="未授权或暂无填写数据" />
          </div>
        </div>
        <el-dialog
          key="msgDialog"
          title="病历提交失败原因"
          :visible.sync="showSubmitResult"
          width="30%"
        >
          <div
            v-for="(item, index) in submitResult"
            :key="index"
            style="margin-bottom: 15px; color: red; font-size: 16px;"
          >
            {{ index + 1 + ': ' + item }}
          </div>
        </el-dialog>
        <el-dialog
          key="rejectDialog"
          :title="`${rejectTitle}驳回`"
          :visible.sync="rejectShow"
          :close-on-click-modal="false"
          width="30%"
        >
          <el-input
            v-model="rejectText"
            type="textarea"
            :rows="2"
            placeholder="请输入驳回原因"
          />
          <span slot="footer" class="dialog-footer">
            <el-button @click="rejectCancel">取 消</el-button>
            <el-button
              :disabled="rejectText === null || rejectText === ''"
              type="primary"
              @click="doReject"
            >确 定</el-button>
          </span>
        </el-dialog>
      </el-main>
    </el-container>

    <!--绑定腕带-->
    <el-dialog
      v-if="rfTagVisible"
      :visible.sync="rfTagVisible"
      title="腕带绑定"
      width="400px"
    >
      <rf-tag
        :patient="patientInfo.regist"
        :rf-tags="rfTags"
        @cancelForm="rfTagHideModal"
      />
    </el-dialog>

    <el-dialog
      v-if="validErrVisible"
      :visible.sync="validErrVisible"
      title="校验错误"
      width="700px"
      :modal="false"
    >
      <el-table border height="400" :data="validErrData" style="width: 100%">
        <el-table-column type="index" width="40" align="center" />
        <el-table-column prop="module" label="模块" width="180" />
        <el-table-column prop="fieldName" label="项目" />
        <el-table-column prop="message" label="提示信息" width="120" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import baseinfo from './baseinfo.vue'
import timeline from '../timeline/timeliney.vue'
import prehospital from './prehospital/phepmain'
import triage from './triage/main'
import detection from './detection/main'
import cure from './cure/main'
import pci from './pci/main'
import discharge from './discharge/main'
import bindPatient from './bindPatient.vue'
import rfTag from '../list/rfTag'
import moment from 'moment'
import {
  getPatientInfo,
  save,
  submit,
  withdrawAudit,
  passAudit,
  archive,
  rejectAudit,
  rejectArchive,
  bindPatient as patientBind
} from '@/api/patient/edit'
import { syncPatientDetailManually } from '@/api/patient/thirdpart'
import { getRfTags } from '@/api/patient/list'
import { mapGetters } from 'vuex'
import checkPermission from '@/utils/permission'

export default {
  name: 'EditIndex',
  components: {
    baseinfo,
    prehospital,
    triage,
    detection,
    cure,
    pci,
    discharge,
    timeline,
    bindPatient,
    rfTag
  },
  data() {
    return {
      registId: this.$route.query.id,
      isLock: this.$route.query.isLock || '0',
      noticeTag: this.$route.query.noticeTag || 0,
      moduleName: 'first',
      timeline: null,
      timelineClass: 'timeline-area',
      tabpanelClass: 'tab-panel',
      showPatientList: false,
      showSubmitResult: false,
      submitResult: [],
      patientInfo: {
        admission: {},
        admissionEcgList: [],
        creatinineproteinList: [],
        diagnosisTest: {},
        dischargeDrugsList: [],
        dischargeTestList: [],
        inspection: {},
        main: {},
        prehospital: {},
        rehospitalEcgList: [],
        regist: {},
        grace: {},
        treatment: {},
        treatmentPci: {},
        discharge: {
          troponinH72: {
            type: '',
            result: ''
          },
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
      rejectTitle: '',
      rejectShow: false,
      rejectText: '',
      rejectType: '',
      rfButName: '绑定腕带',
      rfTagVisible: false,
      validErrVisible: false,
      validErrData: [],
      iconDesc: [
        {
          name: '106.png',
          desc: '及时上报'
        }, {
          name: '105.png',
          desc: '不可上报'
        }, {
          name: '108.png',
          desc: '即将锁定'
        }, {
          name: '122.png',
          desc: '已锁定'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['user', 'rfTags', 'hospitalId', 'currentHospitalArea']),
    tabs() {
      return [
        {
          label: '院前急救',
          name: 'prehospital',
          class: this.tabpanelClass,
          visible: this.showFirstAid && checkPermission(['mr-firstaid']),
          component: prehospital,
          attrs: {
            ref: 'prehospital',
            data: this.patientInfo,
            disabled: this.isReadonly
          },
          events: {
            showimport: this.showimport
          }
        },
        {
          label: '急诊分诊',
          name: 'triage',
          class: this.tabpanelClass,
          visible: checkPermission(['mr-triage']),
          component: triage,
          attrs: {
            ref: 'triage',
            data: this.patientInfo,
            disabled: this.isReadonly
          },
          events: {
            showimport: this.showimport
          }
        },
        {
          label: '检验检查',
          name: 'detection',
          class: this.tabpanelClass,
          visible: checkPermission(['mr-inspection']),
          component: detection,
          attrs: {
            ref: 'detection',
            data: this.patientInfo,
            disabled: this.isReadonly
          }
        },
        {
          label: '院内诊疗',
          name: 'cure',
          class: this.tabpanelClass,
          visible: this.showCure && checkPermission(['mr-cure']),
          component: cure,
          attrs: {
            ref: 'cure',
            isStemi: this.isStemi,
            data: this.patientInfo,
            disabled: this.isReadonly
          }
        },
        {
          label: '介入手术',
          name: 'pci',
          class: this.tabpanelClass,
          visible: this.showPci && checkPermission(['mr-pci']),
          component: pci,
          attrs: {
            ref: 'pci',
            zjPci: this.showZJPCI,
            bjPci: this.showBJPCI,
            rshPci: this.showRSHJR,
            jjPci: this.showJJPCI,
            data: this.patientInfo,
            disabled: this.isReadonly
          }
        },
        {
          label: '患者转归',
          name: 'discharge',
          class: this.tabpanelClass,
          visible: this.showDischarge && checkPermission(['mr-discharge']),
          component: discharge,
          attrs: {
            ref: 'discharge',
            data: this.patientInfo,
            disabled: this.isReadonly
          },
          events: {
            showimport: this.showimport
          }
        }
      ].filter(t => t.visible)
    },
    isBound() {
      // 是否已绑定
      return !!this.patientInfo?.regist.emId
    },
    showFirstAid() {
      return (
        this.patientInfo.admission.comeType === '1' ||
        this.patientInfo.admission.comeType === '2'
      )
    },
    isStemi() {
      if (this.patientInfo.inspection.diagnosis === '1') return true
      if (
        this.patientInfo.inspection.diagnosis === '2' ||
        this.patientInfo.inspection.diagnosis === '3'
      ) {
        if (this.patientInfo.inspection.graceRehazardLevel === '0') return true
      }
      return false
    },
    isNstemiOrUA() {
      return (
        this.patientInfo.inspection.diagnosis === '2' ||
        this.patientInfo.inspection.diagnosis === '3'
      )
    },
    showCure() {
      return this.isStemi || this.isNstemiOrUA
    },
    showReperfusion() {
      if (this.patientInfo.inspection.diagnosis === '1') return true
      if (!this.patientInfo.inspection.graceRehazardLevel) return false
      if (
        this.patientInfo.inspection.diagnosis === '2' ||
        this.patientInfo.inspection.diagnosis === '3'
      ) {
        return this.patientInfo.inspection.graceRehazardLevel === '0'
      }
      return false
    },
    showRsCure() {
      if (
        this.patientInfo.inspection.diagnosis !== '1' &&
        this.patientInfo.inspection.diagnosis !== '2' &&
        this.patientInfo.inspection.diagnosis !== '3' &&
        this.patientInfo.inspection.diagnosis !== '5'
      ) {
        return false
      }

      const stemiRs =
        this.showReperfusion &&
        this.patientInfo.treatment &&
        this.patientInfo.treatment.isReperfusion === '1' &&
        this.patientInfo.treatment.reperfusionMeasure === '2'
      const peRs = this.patientInfo.inspection.diagnosis === '5'
      return stemiRs || peRs
    },
    showZJPCI() {
      if (!this.showReperfusion) return false
      return (
        this.patientInfo.treatment &&
        this.patientInfo.treatment.isReperfusion === '1' &&
        this.patientInfo.treatment.reperfusionMeasure === '1'
      )
    },
    // showRSBJPCI() {
    //   if (!this.showReperfusion) return false
    //   return (
    //     this.patientInfo.treatment &&
    //     this.patientInfo.treatment.isReperfusion === '1' &&
    //     this.patientInfo.treatment.reperfusionMeasure === '2' &&
    //     (this.patientInfo.treatment.rsStrategy === '21' || this.patientInfo.treatment.rsStrategy === '22')
    //   )
    // },
    showBJPCI() {
      return (
        this.isStemi &&
        this.showRsCure &&
        this.patientInfo.treatment &&
        this.patientInfo.treatment.rsStrategy === '21'
      )
    },
    showRSHJR() {
      return (
        this.isStemi &&
        this.showRsCure &&
        this.patientInfo.treatment &&
        this.patientInfo.treatment.rsStrategy === '22'
      )
    },
    showZYPCI() {
      if (!this.patientInfo.treatment) return false
      return (
        this.isStemi &&
        this.patientInfo.treatment.isReperfusion === '1' &&
        this.patientInfo.treatment.reperfusionMeasure === '5'
      )
    },
    showJJPCI() {
      if (!this.isNstemiOrUA) return false
      if (!this.patientInfo.treatment) return false
      if (
        !this.patientInfo.inspection ||
        this.patientInfo.inspection.graceRehazardLevel === '0'
      ) {
        return false
      }
      return (
        this.patientInfo.treatment.strategy === '2' &&
        this.patientInfo.treatment.invasiveStrategy === '1'
      )
    },
    showPci() {
      if (!this.patientInfo.treatment) return false
      return (
        this.showZJPCI ||
        this.showBJPCI ||
        this.showRSHJR ||
        (this.showZYPCI &&
          this.patientInfo.treatment.pciTransferType === '2') ||
        this.showJJPCI
      )
    },
    showDischarge() {
      if (
        (this.patientInfo.admission.comeType === '1' ||
          this.patientInfo.admission.comeType === '2') &&
        this.patientInfo.prehospital.isTransHospital === '1'
      ) {
        return false
      }
      if (this.patientInfo.inspection.isGiveupTreatment === '1') {
        return false
      }
      if (
        this.patientInfo.inspection.diagnosis === '6' ||
        this.patientInfo.inspection.diagnosis === '7' ||
        this.patientInfo.inspection.diagnosis === '9'
      ) {
        return false
      }
      return true
    },
    isReadonly() {
      if (this.patientInfo.main) {
        return (
          this.patientInfo.main.status === '21' ||
          this.patientInfo.main.status === '31' ||
          this.patientInfo.main.status === '41' ||
          this.isLock === '1'|| !checkPermission(['mr-add'])
        )
      }
      return false
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
    tabs: {
      immediate: false,
      handler(newVal, oldVal) {
        if (!newVal.find(el => el.name === this.moduleName)) {
          this.moduleName = newVal[0]?.name || ''
        }
      },
      deep: true
    }
  },
  mounted() {
    this.getInfo(null, () => {
      if (this.isBound && !this.isReadonly) {
        this.onSelectMoreActions()
      }
    })
    this.$store.dispatch('common/getMedicalWorkers')

    if (!this.rfTags || this.rfTags.length === 0) {
      this.getRfTags()
    }

    this.$eventBus.$on('refreshPatient',this.getInfo)
  },
  beforeDestroy() {
    this.$eventBus.$off('refreshPatient',this.getInfo)
  },
  methods: {
    checkPermission,
    getRfTags() {
      getRfTags({
        hospitalId: this.hospitalId + '_' + this.currentHospitalArea
      }).then((res) => {
        if (res.status === 200 && res.code === '0') {
          res.result.forEach((element) => {
            this.rfTags.push({
              label: `${element.tagName}(${element.tagId})`,
              value: element.tagName,
              code: element.tagId
            })
          })
        }
      })
    },
    rfTagShowModal() {
      this.rfTagVisible = true
    },
    rfTagHideModal() {
      this.rfTagVisible = false
      this.getInfo()
    },
    onSelectMoreActions() {
      syncPatientDetailManually(this.$route.query.id).then((res) => {
        if (res.status === 200 && res.code === '0') {
          this.$message.success('同步成功')
          this.$eventBus.$emit('refreshPatient')
        } else {
          this.$message.error('同步失败')
        }
      })
    },
    onReview() {
      const { href } = this.$router.resolve({
        name: 'Review',
        query: {
          registId: this.$route.query.id,
          emId: this.patientInfo.regist.emId,
          infoComingType: this.patientInfo.regist.infoComingType,
          hospitalAndArea:
            this.patientInfo.regist.hospitalId +
            '_' +
            this.patientInfo.regist.hospitalArea
        }
      })
      window.open(href, '_blank')
    },
    onBind(item, closePop) {
      const loading = this.$loading({
        lock: true,
        text: '正在绑定...'
      })
      patientBind({
        registId: this.$route.query.id,
        visitId: item.relationId,
        type: item.type,
        hospitalArea: this.patientInfo.regist.hospitalArea,
        hospitalId: this.patientInfo.regist.hospitalId
      })
        .then((bindRes) => {
          if (bindRes.code === '0') {
            this.$message.success('绑定成功')
            this.getInfo()
            closePop()
          } else {
            this.$message.error('绑定失败!' + bindRes.message)
          }
        })
        .catch((err) => {
          if (err.response?.data?.message) {
            this.$message.error(err.response?.data?.message)
          }
        })
        .finally(() => {
          loading.close()
        })
    },
    basicchanged(code) {
      if (code === 'collapse') {
        this.timelineClass = 'timeline-area'
        this.tabpanelClass = 'tab-panel'
      } else {
        this.timelineClass = 'timeline-area-collapse'
        this.tabpanelClass = 'tab-panel-collapse'
      }
    },
    async getInfo(syncNoObj, cb) {
      const { result } =
        (await getPatientInfo({ registid: this.registId })) || {}
      this.patientInfo = result
      if (
        this.patientInfo.inspection &&
        this.patientInfo.inspection.hasCreatinineprotein === '1'
      ) {
        if (
          !this.patientInfo.creatinineproteinList ||
          this.patientInfo.creatinineproteinList.length === 0
        ) {
          this.patientInfo.creatinineproteinList = [{}]
        }
      }

      this.patientInfo.diagnosisTest.cr.registId = this.registId
      this.patientInfo.diagnosisTest.cr.checkType = '1'
      this.patientInfo.diagnosisTest.cr.orderNo = 1
      this.patientInfo.diagnosisTest.cr.unit =
        this.patientInfo.diagnosisTest.cr.unit || '1'
      this.patientInfo.diagnosisTest.ddimer.registId = this.registId
      this.patientInfo.diagnosisTest.ddimer.checkType = '2'
      this.patientInfo.diagnosisTest.ddimer.orderNo = 2
      this.patientInfo.diagnosisTest.ddimer.unit =
        this.patientInfo.diagnosisTest.ddimer.unit || '1'
      this.patientInfo.diagnosisTest.bnp.registId = this.registId
      this.patientInfo.diagnosisTest.bnp.checkType = '3'
      this.patientInfo.diagnosisTest.bnp.orderNo = 3
      this.patientInfo.diagnosisTest.bnp.unit =
        this.patientInfo.diagnosisTest.bnp.unit || '1'
      this.patientInfo.diagnosisTest.nTproBNP.registId = this.registId
      this.patientInfo.diagnosisTest.nTproBNP.checkType = '4'
      this.patientInfo.diagnosisTest.nTproBNP.orderNo = 4
      this.patientInfo.diagnosisTest.nTproBNP.unit =
        this.patientInfo.diagnosisTest.nTproBNP.unit || '1'
      this.patientInfo.diagnosisTest.myo.registId = this.registId
      this.patientInfo.diagnosisTest.myo.checkType = '5'
      this.patientInfo.diagnosisTest.myo.orderNo = 5
      this.patientInfo.diagnosisTest.myo.unit =
        this.patientInfo.diagnosisTest.myo.unit || '1'
      this.patientInfo.diagnosisTest.ckmb.registId = this.registId
      this.patientInfo.diagnosisTest.ckmb.checkType = '6'
      this.patientInfo.diagnosisTest.ckmb.orderNo = 6
      this.patientInfo.diagnosisTest.ckmb.unit =
        this.patientInfo.diagnosisTest.ckmb.unit || '1'

      this.patientInfo.screenage.ect.registId = this.registId
      this.patientInfo.screenage.ect.checkType = '1'
      this.patientInfo.screenage.ect.orderNo = 1
      this.patientInfo.screenage.cdu.registId = this.registId
      this.patientInfo.screenage.cdu.checkType = '2'
      this.patientInfo.screenage.cdu.orderNo = 2

      this.patientInfo.discharge.jtyw.registId = this.registId
      this.patientInfo.discharge.jtyw.code = '1'
      this.patientInfo.discharge.knyw.registId = this.registId
      this.patientInfo.discharge.knyw.code = '2'
      this.patientInfo.discharge.pcsk9.registId = this.registId
      this.patientInfo.discharge.pcsk9.code = '3'

      // this.patientInfo.treatment.anticoagulationUnit = this.patientInfo.treatment.anticoagulationUnit || '1' // 院内诊疗-抗凝剂量
      this.patientInfo.treatmentPci.anticoagulationUnit =
        this.patientInfo.treatmentPci.anticoagulationUnit || '1' // 介入手术-术中抗凝药物剂量

      this.$eventBus.$emit('syncDefaultValues') // 同步默认值

      this.$nextTick(() => {
        this.$refs.baseinfo?.clearValidate()
        if (this.$refs.prehospital) this.$refs.prehospital?.clearValidate()
        this.$refs.triage?.clearValidate()
        this.$refs.detection?.clearValidate()
        if (this.$refs.cure) this.$refs.cure.clearValidate()
        if (this.$refs.pci) this.$refs.pci.clearValidate()
        if (this.$refs.discharge) this.$refs.discharge.clearValidate()
      })

      this.rfButName = this.patientInfo.regist?.rfTagId
        ? '腕带:' + this.patientInfo.regist?.rfTagId
        : '绑定腕带'

      if (syncNoObj) {
        if (Object.keys(syncNoObj).indexOf('licensePlate') > -1) {
          this.$set(
            this.patientInfo.prehospital,
            'licensePlate',
            syncNoObj.licensePlate
          )
        } else if (Object.keys(syncNoObj).indexOf('outPatientNo') > -1) {
          this.$set(
            this.patientInfo.main,
            'outPatientNo',
            syncNoObj.outPatientNo
          )
        } else if (Object.keys(syncNoObj).indexOf('admissionNo') > -1) {
          this.$set(
            this.patientInfo.main,
            'admissionNo',
            syncNoObj.admissionNo
          )
        }
      }

      if (cb) {
        cb()
      }
    },
    showimport(item) {
      if (
        this.patientInfo.main.status === '21' ||
        this.patientInfo.main.status === '31' ||
        this.patientInfo.main.status === '41'
      ) {
        return
      }
      this.filterTypes = []
      this.filterTypes.push(item)
      this.bindType = item
      this.showPatientList = true
    },
    async doSave() {
      if (this.showFirstAid) {
        this.patientInfo.admission.arrivedHospitalTime =
          this.patientInfo.prehospital.arrivedHospitalTime
      }
      // 保存时，院前远程心电图传输、心内科会诊、双绕及诊断相关字段填写后，若检查检验模块相应数据为空，则将所填数值对应同步到检查检验中
      if (!this.patientInfo.admission.isEcgTransmission) {
        this.$set(
          this.patientInfo.admission,
          'isEcgTransmission',
          this.patientInfo.prehospital.isRemotetrans
        )
      }
      if (!this.patientInfo.admission.ecgTransmissionTime) {
        this.$set(
          this.patientInfo.admission,
          'ecgTransmissionTime',
          this.patientInfo.prehospital.remotetransTime
        )
      }
      if (!this.patientInfo.admission.ecgTransmissionType) {
        this.$set(
          this.patientInfo.admission,
          'ecgTransmissionType',
          this.patientInfo.prehospital.remotetransType
        )
      }
      if (!this.patientInfo.inspection.isCardiolohyConsultant) {
        this.$set(
          this.patientInfo.inspection,
          'isCardiolohyConsultant',
          this.patientInfo.prehospital.isCardiolohyConsultant
        )
      }
      if (!this.patientInfo.inspection.noticeConsultantTime) {
        this.$set(
          this.patientInfo.inspection,
          'noticeConsultantTime',
          this.patientInfo.prehospital.noticeConsultantTime
        )
      }
      if (!this.patientInfo.inspection.consultantTime) {
        this.$set(
          this.patientInfo.inspection,
          'consultantTime',
          this.patientInfo.prehospital.consultantTime
        )
      }
      if (!this.patientInfo.inspection.isBypassEm) {
        this.$set(
          this.patientInfo.inspection,
          'isBypassEm',
          this.patientInfo.prehospital.isBypassEm
        )
      }
      if (!this.patientInfo.inspection.isBypassCcu) {
        this.$set(
          this.patientInfo.inspection,
          'isBypassCcu',
          this.patientInfo.prehospital.isBypassCcu
        )
      }
      if (!this.patientInfo.inspection.diagnosis) {
        this.$set(
          this.patientInfo.inspection,
          'diagnosis',
          this.patientInfo.prehospital.diagnosis
        )
      }
      if (!this.patientInfo.inspection.diagnosisTime) {
        this.$set(
          this.patientInfo.inspection,
          'diagnosisTime',
          this.patientInfo.prehospital.diagnosisTime
        )
      }

      const res = await save(this.patientInfo)
      if (res.status === 200 && res.result) {
        this.$message({ type: 'success', message: '保存成功' })
        this.$refs.timeline.getTimelineY()
      }
    },
    doSubmit() {
      this.$confirm('确定提交审核吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 待校验模块ref名
        const refNames = [
          'baseinfo',
          'prehospital',
          'triage',
          'detection',
          'cure',
          'pci',
          'discharge'
        ].filter((n) => this.$refs[n])

        const validateErrs = (
          await Promise.allSettled(
            refNames.map((n) => this.$refs[n].validate().catch(err => Promise.reject({ ...err, m: n })))
          )
        ).filter((r) => r.reason)

        this.validErrData = []
        if (validateErrs.length) {
          validateErrs.forEach(({ reason }) => {
            if (!this.validErrData.length) {
              // 跳转第一个错误页签
              if (reason.m) {
                this.moduleName = reason.m
              }
              this.$nextTick(() => {
                document
                  .querySelector('.el-form-item.is-error')
                  .scrollIntoView()
              })
            }
            // 收集校验错误信息
            this.validErrData.push(...reason.errors)
          })
          // 显示错误详情
          this.validErrVisible = true
          return
        }

        // 前端校验通过
        this.updateAttackTime()
        const res = await submit(this.patientInfo)
        if (res.status === 200 && res.result) {
          if (res.result.isSuccess === '0') {
            if (res.result.errorList && res.result.errorList.length > 0) {
              this.submitResult = res.result.errorList
              this.showSubmitResult = true
            } else {
              this.$message({ type: 'error', message: '系统错误' })
            }
          } else {
            this.$message({ type: 'success', message: '提交审核成功' })
            this.getInfo()
          }
        }
      })
    },
    withdraw() {
      this.$confirm('确定撤回审核吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await withdrawAudit({
          registId: this.registId,
          userId: this.user.username
        })

        if (res.status === 200) {
          this.$message({ type: 'success', message: '撤回审核成功' })
          this.getInfo()
        } else {
          this.$message({ type: 'warning', message: res.message })
        }
      })
    },
    pass() {
      this.$confirm('确定通过审核吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await passAudit({
          registId: this.registId,
          userId: this.user.username
        })

        if (res.status === 200) {
          this.$message({ type: 'success', message: '通过审核成功' })
          this.getInfo()
        } else {
          this.$message({ type: 'warning', message: res.message })
        }
      })
    },
    archive() {
      this.$confirm('确定归档吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await archive({
          registId: this.registId,
          userId: this.user.username
        })

        if (res.status === 200) {
          this.$message({ type: 'success', message: '归档成功' })
          this.getInfo()
        } else {
          this.$message({ type: 'warning', message: res.message })
        }
      })
    },
    reject(type) {
      this.rejectTitle = type === '1' ? '审核' : '存档'
      this.rejectType = type
      this.rejectShow = true
    },
    rejectCancel() {
      this.rejectText = ''
      this.rejectShow = false
    },
    async doReject() {
      const p = {
        registId: this.registId,
        userId: this.user.username,
        reason: this.rejectText
      }
      let res = {}
      if (this.rejectType === '1') {
        res = await rejectAudit(p)
      } else if (this.rejectType === '2') {
        res = await rejectArchive(p)
      }

      if (res.status === 200) {
        this.$message({
          type: 'success',
          message: `驳回${this.rejectTitle}成功`
        })
        this.rejectShow = false
        this.getInfo()
      } else {
        this.$message({ type: 'warning', message: res.message })
      }
    },
    getNoticeClass() {
      if (this.noticeTag > 0) {
        const classArray = ['font106', 'font105', 'font106', 'font105']
        return classArray[this.noticeTag - 1]
      }
      return ''
    },
    updateAttackTime() {
      if (this.patientInfo.main?.isTimearea && this.patientInfo.main?.attackTime) {
        var time = ''
        switch (this.patientInfo.main?.isTimearea) {
          case '1':
            time = ' 03:00:00'
            break
          case '2':
            time = ' 07:00:00'
            break
          case '3':
            time = ' 10:00:00'
            break
          case '4':
            time = ' 13:00:00'
            break
          case '5':
            time = ' 16:00:00'
            break
          case '6':
            time = ' 18:00:00'
            break
          case '7':
            time = ' 22:00:00'
            break
        }
        var day = moment(this.patientInfo.main?.attackTime).format('YYYY-MM-DD')
        this.patientInfo.main.attackTime = day + time
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-panel {
  margin-top: 5px;
  background-color: #f0f2f5;
  height: calc(100vh - 84px);

  .base-area {
    height: auto !important;
    background-color: #fff;
    margin: 10px;
  }

  .timeline-area {
    width: 300px;
    height: calc(100vh - 90px);
    background-color: #fff;
    margin: 0 5px;
    overflow-x: hidden;
  }

  .timeline-area-collapse {
    width: 300px;
    height: calc(100vh - 90px);
    background-color: #fff;
    margin: 0 5px;
    overflow-x: hidden;
  }

  .content-area {
    background-color: #fff;
    margin: 0 5px 0 0;
    height: calc(100vh - 90px);
    overflow-y: auto;
    overflow-x: hidden;

    ::v-deep .el-divider--horizontal {
      margin: 5px 0 24px;
    }
    ::v-deep .el-tabs__header {
      background-color: #f5f6fb;
      margin: 0 -20px;
      padding: 0 20px 0 10px;
    }
    ::v-deep .el-tabs__nav-wrap::after {
      display: none;
    }
    ::v-deep .el-tabs__item {
      font-weight: 550;
      font-size: 18px;
      padding-top: 6px;
      height: 70px;
      line-height: 66px;
      color: #435372;
    }
    ::v-deep .el-tabs__active-bar {
      width: 72px;
      transform: translateX(0px);
      bottom: 12px;
      left: 0;
      height: 2px;
      background-color: #4b60fd;
    }
    ::v-deep .el-tabs__item.is-active {
      color: #4b60fd;
    }
  }
  .button-panel {
    position: absolute;
    bottom: 20px;
    right: 40px;
    z-index: 999;
  }

  .tabs {
    position: relative;
  }
  .function-bar {
    position: absolute;
    right: 0;
    top: 23px;
    z-index: 9;
  }
  .notice {
    font-size: 14px;
    margin-right: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .font106 {
    color: #D81E06;
  }
  .font105 {
    color: #F0752A
  }
}
</style>
