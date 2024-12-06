<template>
  <div class="edit-panel">
    <el-main class="content-area">
      <baseinfo :detail-data="detailData" />
      <el-tabs v-model="moduleName" type="card" size="mini">
        <el-tab-pane
          v-for="tab in tabList"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
          class="tab-pane"
        >
          <component
            :is="tab.comp"
            :ref="tab.name"
            view-mode
            :detail-data="detailData"
            :hospital-area="hospitalArea"
            @save="handleSave"
            @refresh="getDetail"
          />
        </el-tab-pane>
      </el-tabs>
      <div class="flex-c-b foot-bar">
        <div class="left-part">
          病历状态 :
          <el-tag
            v-if="medicalRecorStatus === '01'"
            :border="false"
            size="small"
          ><i class="el-icon-edit-outline" /> 填写中</el-tag>
          <el-tag
            v-if="medicalRecorStatus === '02'"
            size="small"
            type="success"
          ><i class="el-icon-circle-check" /> 已提交</el-tag>
          <el-tag
            v-if="medicalRecorStatus === '03'"
            size="small"
            type="info"
          >已归档</el-tag>
        </div>
        <!-- <div class="right-part">
          <el-popconfirm
            v-if="missionStatus === '07'"
            title="确定要恢复任务吗？"
            @confirm="handleResumeTask"
          >
            <el-button
              slot="reference"
              size="small"
              icon="el-icon-refresh-left"
              style="margin-right: 10px"
            >恢复任务</el-button>
          </el-popconfirm>
          <el-button
            v-if="missionStatus != '06' && missionStatus != '07' && isSubmit"
            type="danger"
            plain
            size="small"
            icon="el-icon-switch-button"
            @click="showTerminateModal"
          >终止任务</el-button>

          <el-button
            v-if="medicalRecordSubmited"
            size="small"
            icon="el-icon-printer"
            @click="handlePrint"
          >打印病历</el-button>
          <el-button
            v-if="medicalRecorStatus === '01'"
            type="primary"
            size="small"
            icon="el-icon-check"
            @click="triggerSubmit"
          >保存</el-button>
          <el-button
            v-if="medicalRecorStatus === '01'"
            type="primary"
            plain
            size="small"
            icon="el-icon-upload"
            @click="submitMedicalRecord"
          >提交病历</el-button>
        </div> -->
      </div>
    </el-main>
    <!-- <el-dialog
      class="terminate-dialog"
      title="请填写终止原因"
      :visible.sync="terminateDialogVisible"
    >
      <el-input
        v-model="terminateForm.reason"
        placeholder="终止原因"
        :rows="4"
        type="textarea"
        autocomplete="off"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleTerminateCancel">取 消</el-button>
        <el-button type="primary" @click="handleTerminate">确 定</el-button>
      </div>
    </el-dialog> -->
    <iframe
      ref="printIframe"
      :src="pdfSrc"
      style="width: 0; height: 0; border: none; float: left"
    />
  </div>
</template>

<script>
import FirstaidInfo from '../edit/tabs/firstaidInfo'
import History from '../edit/tabs/history'
import PhysicalExam from '../edit/tabs/physicalexam'
import AuxiliaryExam from '../edit/tabs/auxiliaryexam'
import Diagnosis from '../edit/tabs/diagnosis'
import InformedConsent from '../edit/tabs/informedconsent'
import Handover from '../edit/tabs/handover'
import baseinfo from '@/views/patient/edit/baseinfo'
import {
  mrmSaveOrUpdate,
  mrmDetails,
  updateByPatientId
} from '@/api/medicalRecord'
import { mapActions, mapMutations } from 'vuex'
import { pdfMedicalRecord } from '@/api/print'
import { getIDsByPatientId } from '@/api'

export default {
  name: 'Edit',
  components: {
    baseinfo,
    FirstaidInfo,
    History,
    PhysicalExam,
    AuxiliaryExam,
    Diagnosis,
    InformedConsent,
    Handover
  },
  data() {
    return {
      terminateDialogVisible: false,
      terminateForm: {},
      // registId: this.$route.query.id,
      moduleName: 'firstaidInfo',
      timeline: null,
      patientInfo: {
        regist: ''
      },
      detailData: {},
      pdfSrc: '',
      missionId: '',
      recordId: '',
      hospitalArea: ','
    }
  },
  computed: {
    // 病历单状态
    medicalRecorStatus() {
      return this.detailData?.medPhepMedicalRecordsEntity?.status
    },
    medicalRecordSubmited() {
      // 填写中 01
      // 已提交 02
      // 已归档 03
      return this.medicalRecorStatus === '02'
    },
    // missionId() {
    //   return this.$route.query.missionId
    // },
    missionStatus() {
      return this.detailData?.medPhepMissionsEntity?.status
    },
    isSubmit() {
      // 如果存在交接时间则return false
      return !this.detailData?.medPhepShiftRecordEntity?.shiftTime
    },
    patientId() {
      return this.$route.query.patientId
    },
    tabList() {
      return [
        // { label: '基本信息', name: 'basicInfo', comp: baseinfo },
        { label: '急救信息', name: 'firstaidInfo', comp: FirstaidInfo },
        { label: '患者病史', name: 'history', comp: History },
        { label: '体格检查', name: 'physicalExam', comp: PhysicalExam },
        { label: '辅助检查', name: 'auxiliaryExam', comp: AuxiliaryExam },
        { label: '诊断处理', name: 'diagnosis', comp: Diagnosis },
        { label: '知情同意', name: 'informedConsent', comp: InformedConsent },
        { label: '患者交接', name: 'handover', comp: Handover }
      ]
    }
  },
  async mounted() {
    if (this.patientId) {
      await this.initSource()
      this.getDetail()
    } else {
      this.$message.error('患者ID缺失,请联系管理员')
    }
  },
  methods: {
    ...mapMutations([
      'mission/SET_MISSION',
      'user/SET_HOSPITALID',
      'user/SET_HOSPITAL_AREA'
    ]),
    ...mapActions({
      getDictionary: 'common/getDictionary',
      getHospitals: 'common/getHospitals',
      getPersonnels: 'common/getPersonnels'
    }),
    async initSource() {
      await this.getIDsByPatientId()
      await this.getDictionary()
      await this.getPersonnels()
      await this.getHospitals()
    },
    async getIDsByPatientId() {
      const res = await getIDsByPatientId(this.patientId)
      const { hospitalId, hospitalArea, missionId, recordId } = res.body || {}
      this['user/SET_HOSPITALID'](hospitalId)
      this['user/SET_HOSPITAL_AREA'](hospitalArea)
      this.hospitalArea = hospitalArea
      this.missionId = missionId
      this.recordId = recordId
    },
    // 提交病历
    async submitMedicalRecord() {
      await this.$confirm('提交后将不可再修改,继续吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      const response = await updateByPatientId({
        patientId: this.patientId,
        submitTime: this.$moment().format('YYYY-MM-DD[T]HH:mm:ss'),
        status: '02'
      })
      if (response.code === '000000') {
        this.$message.success('病历提交成功!')
        this.getDetail()
      }
    },
    async getDetail() {
      const payload = {
        patientId: this.patientId,
        missionId: this.missionId,
        recordId: this.recordId
      }
      const res = await mrmDetails(payload)
      this.detailData = res.body
      // 任务信息写入store
      this['mission/SET_MISSION'](this.detailData?.medPhepMissionsEntity)
      this.$refs.timeline?.initTimeAxis()
    },
    // 触发当前页签的保存事件
    triggerSubmit() {
      const curTab = this.$refs[this.moduleName][0]
      if (curTab?.onSave) {
        curTab.onSave()
      }
    },
    async handleResumeTask() {
      // 恢复任务
      const payload = {
        medPhepMissionsEntity: {
          missionId: this.missionId,
          status: '06',
          suspendReason: ''
        }
      }
      const res = await mrmSaveOrUpdate(payload)
      if (res.message === 'SUCCESS') {
        this.$message.success('恢复成功!')
        this.getDetail()
      } else {
        this.$message.error('恢复失败!' + res.message)
      }
    },
    showTerminateModal() {
      this.terminateDialogVisible = true
    },
    handleTerminateCancel() {
      this.terminateDialogVisible = false
      this.terminateForm = {}
    },
    // 终止任务
    async handleTerminate() {
      if (!this.terminateForm.reason) {
        this.$message.warning('请填写终止原因!')
        return
      }
      const { reason } = this.terminateForm

      const payload = {
        medPhepMissionsEntity: {
          missionId: this.missionId,
          status: '07',
          suspendReason: reason
        }
      }
      const res = await mrmSaveOrUpdate(payload)
      if (res.message === 'SUCCESS') {
        this.$message.success('终止成功!')
        this.handleTerminateCancel()
        this.getDetail()
      } else {
        this.$message.error('终止失败!' + res.message)
      }
    },
    async handlePrint() {
      const res = await pdfMedicalRecord(this.patientId)
      if (res) {
        const blob = new Blob([res], { type: 'application/pdf;chartset=UTF-8' })
        this.pdfSrc = URL.createObjectURL(blob)
        setTimeout(() => {
          this.$refs.printIframe.contentWindow.print()
        }, 500)
      } else {
        this.$message('获取打印数据失败!')
      }
    },
    async handleSave(payload, callback) {
      const res = await mrmSaveOrUpdate(payload)
      if (res.code === '000000') {
        this.$message.success('保存成功')
        this.getDetail()
        if (callback) callback()
      } else {
        this.$message.error('保存失败!' + res.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$bg-color: #fff;
// .edit-panel {
// background-color: #f0f2f5;
// height: 100vh;
// .base-area {
//   height: auto !important;
//   background-color: $bg-color;
//   margin: 10px;
// }
// .timeline-area {
//   width: 300px;
//   height: calc(100vh - 118px);
//   background-color: $bg-color;
//   margin: 0 10px;
// }
.content-area {
  background-color: $bg-color;
  // margin: 0 10px 0 0;
  padding-bottom: 0;
}
// }
.tab-pane {
  height: calc(100vh - 205px);
  padding-bottom: 40px;
  overflow: auto;
  ::v-deep .el-form {
    padding: 0 12px;
  }
}
.foot-bar {
  box-sizing: border-box;
  border-top: 1px solid #eee;
  padding: 20px 10px;
  .left-part {
    color: #666;
    font-size: 14px;
  }
}
// .terminate-dialog {
//   ::v-deep .el-dialog__body {
//     padding: 20px;
//   }
// }
</style>
