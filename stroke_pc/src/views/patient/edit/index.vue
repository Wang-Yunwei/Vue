<template>
  <div class="edit-panel">
    <el-container v-if="getInfoFlag">
      <el-container>
        <el-aside class="timeline-area">
          <timeline :timelines="timelines" :regist-id="$route.query.registId" />
        </el-aside>
        <el-main class="content-area">
          <base-info
            ref="baseInfo"
            :info="patientDetail.basicInfo"
            :disabled="disabled"
            @comingTypeChange="changeComingType"
          />
          <div class="tabs">
            <div class="function-bar flex-c-b">
              <el-button
                v-if="!disabled"
                size="mini"
                type="success"
                @click="rfTagShowModal(patientDetail.basicInfo)"
              >{{ rfButName }}</el-button>
              <bind-patient
                v-if="!isBound && !disabled"
                title="绑定患者"
                is-bind
                type="2"
                :patient-name="patientDetail.basicInfo.name"
                :hospital-id="patientDetail.basicInfo.hospitalId"
                :hospital-area="patientDetail.basicInfo.hospitalArea"
                style="margin-left: 10px"
                @bind="onBind"
              >
                <el-button size="mini" type="success">绑定患者</el-button>
              </bind-patient>
              <template v-if="isBound && !disabled">
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
            <el-tabs v-model="activeName">
              <el-tab-pane v-if="showAid" label="院前急救" name="firstAid">
                <first-aid
                  ref="firstAid"
                  :info="patientDetail.firstAid"
                  :triage-info="patientDetail.triage"
                  :coming-type="comingType"
                  :disabled="disabled"
                  :is-bound="isBound"
                  @bind="saveAndRefresh"
                />
              </el-tab-pane>
              <el-tab-pane label="预检分诊" name="triage">
                <triage
                  ref="triage"
                  :info="patientDetail.triage"
                  :detection-info="patientDetail.detection"
                  :patient-info="patientDetail.basicInfo"
                  :coming-type="comingType"
                  :disabled="disabled"
                  :is-bound="isBound"
                  @bind="saveAndRefresh"
                />
              </el-tab-pane>
              <el-tab-pane label="检验检测" name="detection">
                <detection
                  ref="detection"
                  :info="patientDetail.detection"
                  :disabled="disabled"
                  @disposeChange="changeDispose"
                />
              </el-tab-pane>
              <el-tab-pane v-if="showRs" label="静脉溶栓" name="rs">
                <rs ref="rs" :info="patientDetail.cure" :disabled="disabled" />
              </el-tab-pane>
              <el-tab-pane v-if="showPci" label="介入手术" name="pci">
                <pci
                  ref="pci"
                  :info="patientDetail.cure"
                  :disabled="disabled"
                />
              </el-tab-pane>
              <el-tab-pane label="患者转归" name="outcome">
                <outcome
                  ref="outcome"
                  :info="patientDetail.outcome"
                  :disabled="disabled"
                  :is-bound="isBound"
                  :patient-info="patientDetail.basicInfo"
                  @bind="saveAndRefresh"
                />
              </el-tab-pane>
            </el-tabs>
          </div>
          <div
            style="position: absolute; right: 50px; bottom: 30px; z-index: 999"
          >
            <div v-if="patientDetail.basicInfo.status === '0'">
              <el-button
                class="static-btn"
                type="primary"
                plain
                size="medium"
                @click="handleSave(0)"
              >保存</el-button>
              <el-button
                type="primary"
                size="medium"
                @click="handleFinish"
              >提交</el-button>
            </div>
            <div v-if="patientDetail.basicInfo.status === '1'">
              <!-- <el-button
                size="medium"
                @click="
                  updateStatus([patientDetail.basicInfo.registId], '0', '')
                "
              >撤回</el-button> -->
              <el-button
                class="static-btn"
                type="primary"
                plain
                size="medium"
                @click="
                  rejectClick([patientDetail.basicInfo.registId], '0', '1')
                "
              >驳回</el-button>
              <el-button
                type="primary"
                size="medium"
                @click="
                  updateStatus([patientDetail.basicInfo.registId], '2', '')
                "
              >通过</el-button>
            </div>
            <div v-if="patientDetail.basicInfo.status === '2'">
              <el-button
                type="primary"
                class="static-btn"
                plain
                size="medium"
                @click="
                  rejectClick([patientDetail.basicInfo.registId], '0', '2')
                "
              >驳回</el-button>
              <el-button
                type="primary"
                size="medium"
                @click="
                  updateStatus([patientDetail.basicInfo.registId], '3', '')
                "
              >存档</el-button>
            </div>
            <div v-if="patientDetail.basicInfo.status === '3'">
              <div v-if="patientDetail.basicInfo.reportStatus === '0'">
                <el-button
                  type="primary"
                  size="medium"
                  @click="
                    updateReportStatus([patientDetail.basicInfo.registId], '1')
                  "
                >上报</el-button>
              </div>
              <div v-if="patientDetail.basicInfo.reportStatus === '3'">
                <!-- <el-button
                  size="medium"
                  @click="
                    updateStatus([patientDetail.basicInfo.registId], '0', '')
                  "
                >撤回</el-button> -->
                <el-button
                  type="primary"
                  size="medium"
                  @click="
                    updateReportStatus([patientDetail.basicInfo.registId], '1')
                  "
                >上报</el-button>
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
      <el-footer class="footer-area" />
    </el-container>
    <!--绑定腕带-->
    <el-dialog
      v-if="rfTagVisible"
      :visible.sync="rfTagVisible"
      title="腕带绑定"
      width="400px"
    >
      <rf-tag
        :patient="patientDetail.basicInfo"
        :rf-tags="rfTags"
        @cancelForm="rfTagHideModal"
      />
    </el-dialog>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%">
      <el-input
        v-model="remark"
        type="textarea"
        :rows="2"
        placeholder="请输入驳回原因"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :disabled="submitFlag"
          @click="submitClick()"
        >确 定</el-button>
      </span>
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
    <el-dialog
      title="病历提交失败原因"
      :visible.sync="showValidateDialog"
      width="30%"
    >
      <div
        v-for="(item, index) in validateTimeErrors"
        :key="index"
        style="margin-bottom: 15px; color: red; font-size: 16px;"
      >
        {{ index + 1 + ': ' + item }}
      </div>
    </el-dialog>
  </div>
</template>

<script>
import timeline from '@/views/patient/edit/timeline'
import baseInfo from '@/views/patient/edit/baseinfo'
import firstAid from '@/views/patient/edit/firstaid'
import triage from '@/views/patient/edit/triage'
import detection from '@/views/patient/edit/detection'
import rs from '@/views/patient/edit/rs'
import pci from '@/views/patient/edit/pci'
import outcome from '@/views/patient/edit/outcome'
import patientApi from '@/api/patient'
import validateApi from '@/api/validation'
import ecgType from '@/constant/ecgType'
import RfTag from '@/views/patient/list/rfTag'
import bindPatient from './bindPatient.vue'

export default {
  name: 'EditIndex',
  components: {
    timeline,
    baseInfo,
    firstAid,
    triage,
    detection,
    rs,
    pci,
    outcome,
    RfTag,
    bindPatient
  },
  data() {
    return {
      validErrVisible: false,
      validErrData: [],
      submitFlag: false,
      dialogTitle: '',
      remark: '',
      dialogVisible: false,
      getInfoFlag: false,
      patientDetail: {},
      activeName: 'firstAid',
      comingType: '',
      dispose: '',
      rfButName: '',
      rfTagVisible: false,
      rfTags: [],
      dataForm: {
        registIds: []
      },
      timelines: [],
      showValidateDialog: false,
      validateTimeErrors: []
    }
  },
  computed: {
    hospitalId() {
      return this.patientDetail.basicInfo.hospitalId
    },
    curHospitalArea() {
      return (
        this.patientDetail.basicInfo.hospitalArea ||
        this.$route.query.hospitalArea
      )
    },
    isBound() {
      // 是否已绑定
      return !!this.patientDetail?.basicInfo.emId
    },
    disabled() {
      // 除填报中、审核拒绝、存档拒绝以外,其他所有的病历状态都只读不可编辑
      return this.patientDetail.basicInfo.status !== '0'
    },
    showPci() {
      return this.dispose && this.dispose.indexOf('2') > -1
    },
    showRs() {
      return this.dispose && this.dispose.indexOf('1') > -1
    },
    showAid() {
      return (
        this.comingType &&
        (this.comingType.indexOf('1') > -1 || this.comingType.indexOf('3') > -1)
      )
    },
    visibleTabNames() {
      return [
        this.showAid && 'firstAid',
        'triage',
        'detection',
        this.showRs && 'rs',
        this.showPci && 'pci',
        'outcome'
      ].filter((t) => t)
    }
  },
  watch: {
    visibleTabNames: {
      immediate: true,
      handler(v) {
        const arr = v || []
        if (!arr.includes(this.activeName)) {
          // 页签发生变动后,如高亮的页签不可见,自动选中首个可见页签
          this.activeName = v[0]
        }
      }
    },
    remark: {
      immediate: true,
      handler(v) {
        if (v) {
          this.remark = v
          this.submitFlag = false
        } else {
          this.submitFlag = true
        }
      }
    }
  },
  mounted() {
    if (this.$route.query.rfTags) {
      this.rfTags = JSON.parse(this.$route.query.rfTags)
    }
    // 获取当前regist-id所有卒中信息
    this.getGcPatientDetail()
    this.getTimeline(this.$route.query.registId)
  },
  methods: {
    saveAndRefresh() {
      this.handleSave(0, true)
    },
    // 绑定成功
    onBind(item, closePop) {
      const loading = this.$loading({
        lock: true,
        text: '正在绑定...'
      })
      patientApi
        .initWithDepartment({
          registId: this.$route.query.registId,
          visitId: item.relationId,
          department: item.type
        })
        .then((bindRes) => {
          if (bindRes.code === '0') {
            this.$message.success('绑定成功')
            this.getGcPatientDetail()
            this.closePop()
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
    rejectClick(registIds, status, reject) {
      if (reject === '1') {
        this.dialogTitle = '审核驳回'
      } else if (reject === '2') {
        this.dialogTitle = '存档驳回'
      }
      this.dataForm.registIds = registIds
      this.dataForm.status = status
      this.dataForm.reject = reject
      this.dialogVisible = true
    },
    submitClick() {
      if (this.remark === '') {
        this.submitFlag = true
      }
      this.updateRejectStatus(
        this.dataForm.registIds,
        this.dataForm.status,
        this.dataForm.reject
      )
      this.dialogVisible = false
    },
    hospitalAndArea() {
      const curHospitalArea =
        this.$route.query.hospitalArea || this.curHospitalArea
      return `${this.hospitalId}_` + curHospitalArea
    },
    getGcPatientDetail() {
      patientApi
        .getGcPatientDetail({
          registId: this.$route.query.registId
        })
        .then((res) => {
          if (res.status === 200 && res.result) {
            this.patientDetail = res.result
            this.rfButName = this.patientDetail.triage?.gcTriage?.rfTagId
              ? '腕带:' + this.patientDetail.triage?.gcTriage?.rfTagId
              : '绑定腕带'
            this.getInfoFlag = true
          }
        })
    },
    changeComingType(val) {
      this.comingType = val
    },
    changeDispose(val) {
      this.dispose = val
    },
    removeNull(arr) {
      return arr.filter((item) => item)
    },
    // 拼装分诊部分数据
    genTriagePart() {
      const { registId } = this.$refs['baseInfo'].gc.patientInfo
      const triage = { ...this.$refs['triage'].gc.triage, registId }
      const firstAidTriage = this.$refs['firstAid']?.gc?.triage || {}
      const isFromOutSide = ['1', '3'].includes(this.comingType)
      // 120 或者 转院 使用急救模块中的部分数据
      if (isFromOutSide) {
        triage.isAfterWakeup = firstAidTriage.isAfterWakeup
        triage.lastHealthyTime = firstAidTriage.lastHealthyTime
        triage.awareTime = firstAidTriage.awareTime
        triage.onsetTime = firstAidTriage.onsetTime
      }
      return triage
    },
    assembleObject(status) {
      const { registId } = this.$refs['baseInfo'].gc.patientInfo

      let preEcgList = this.$refs['firstAid']?.gc?.ecg?.a || []
      let withinEcgList = this.$refs['triage']?.gc?.ecg?.b || []
      preEcgList = preEcgList.map((ele) => {
        return {
          ...ele,
          registId: registId,
          ecgType: ecgType.preHospital
        }
      })
      withinEcgList = withinEcgList.map((ele) => {
        return {
          ...ele,
          registId: registId,
          ecgType: ecgType.withinHospital
        }
      })
      const patientDetailDTO = {
        basicInfo: {
          ...this.$refs['baseInfo'].gc.patientInfo,
          outPatientNo: this.$refs['triage'].gc?.baseInfo?.outPatientNo,
          status: status
        },
        firstAid: {
          gcFirstAidDTO: this.$refs['firstAid']
            ? {
              ...this.$refs['firstAid'].gc.firstAid,
              registId
            }
            : null,
          ecgList: preEcgList,
          outReferalDTO: this.$refs['firstAid']
            ? {
              ...this.$refs['firstAid'].gc.outReferal,
              registId
            }
            : null
        },
        triage: {
          gcTriage: this.genTriagePart(),
          gcSign: {
            ...this.$refs['triage'].gc.sign,
            registId
          },
          ecgList: withinEcgList
        },
        detection: {
          gcDetection: {
            ...this.$refs['detection'].gc.detection,
            registId,
            bloodCollectionTime:
              this.$refs['triage'].gc?.detection?.bloodCollectionTime
          },
          gcMh: { ...this.$refs['detection'].gc.mh, registId },
          gcLisList: [
            this.$refs['detection'].gc.rbtLis.reportTime
              ? {
                ...this.$refs['detection'].gc.rbtLis,
                registId: this.$refs['detection'].gc.detection.registId,
                itemType: '1'
              }
              : null,
            this.$refs['detection'].gc.crLis.reportTime
              ? {
                ...this.$refs['detection'].gc.crLis,
                registId: this.$refs['detection'].gc.detection.registId,
                itemType: '2'
              }
              : null,
            this.$refs['detection'].gc.lkfLis.reportTime
              ? {
                ...this.$refs['detection'].gc.lkfLis,
                registId: this.$refs['detection'].gc.detection.registId,
                itemType: '3'
              }
              : null
          ],
          gcImageList: [
            this.$refs['detection'].gc.ctImage.finishTime
              ? {
                ...this.$refs['detection'].gc.ctImage,
                registId: this.$refs['detection'].gc.detection.registId,
                itemType: '1'
              }
              : null,
            this.$refs['detection'].gc.ctaImage.finishTime
              ? {
                ...this.$refs['detection'].gc.ctaImage,
                registId: this.$refs['detection'].gc.detection.registId,
                itemType: '2'
              }
              : null,
            this.$refs['detection'].gc.ctpImage.finishTime
              ? {
                ...this.$refs['detection'].gc.ctpImage,
                registId: this.$refs['detection'].gc.detection.registId,
                itemType: '3'
              }
              : null,
            this.$refs['detection'].gc.mriImage.finishTime
              ? {
                ...this.$refs['detection'].gc.mriImage,
                registId: this.$refs['detection'].gc.detection.registId,
                itemType: '4'
              }
              : null,
            this.$refs['detection'].gc.mraImage.finishTime
              ? {
                ...this.$refs['detection'].gc.mraImage,
                registId: this.$refs['detection'].gc.detection.registId,
                itemType: '5'
              }
              : null,
            this.$refs['detection'].gc.dwiImage.finishTime
              ? {
                ...this.$refs['detection'].gc.dwiImage,
                registId: this.$refs['detection'].gc.detection.registId,
                itemType: '6'
              }
              : null,
            this.$refs['detection'].gc.pwiImage.finishTime
              ? {
                ...this.$refs['detection'].gc.pwiImage,
                registId: this.$refs['detection'].gc.detection.registId,
                itemType: '7'
              }
              : null
          ]
        },
        cure: {
          ...(this.$refs['rs']
            ? {
              ...this.$refs['rs'].gc.cure,
              registId
            }
            : null),
          ...(this.$refs['pci']
            ? {
              ...this.$refs['pci'].gc.cure,
              registId
            }
            : null)
        },
        outcome: this.$refs['outcome'].gc.outcome
      }
      if (status === 1) {
        patientDetailDTO.basicInfo.reject = ''
      }
      // 去除数组中为null的空值
      patientDetailDTO.detection.gcLisList = this.removeNull(
        patientDetailDTO.detection.gcLisList
      )
      patientDetailDTO.detection.gcImageList = this.removeNull(
        patientDetailDTO.detection.gcImageList
      )

      return patientDetailDTO
    },
    handleSave(status, isScince) {
      var msg = status === 0 ? '保存' : '提交'
      patientApi.setGcPatientDetail(this.assembleObject(status)).then((res) => {
        if (res.status === 200 && res.code === '0') {
          if (!isScince) this.$message.success(msg + '成功')
          this.getGcPatientDetail()
          this.getTimeline(this.$route.query.registId)
        } else {
          this.$message.error(msg + '失败！')
        }
      })
    },
    async validate() {
      this.validErrData = []
      let newActiveName = ''
      await Promise.allSettled(
        ['baseInfo'].concat(this.visibleTabNames).map((name) =>
          this.$refs[name].validate().catch((errs) => {
            if (!newActiveName && name !== 'baseInfo') {
              newActiveName = name
              setTimeout(() => {
                document
                  .querySelector('.el-form-item.is-error')
                  .scrollIntoView()
              }, 300)
            }
            this.validErrData.push(...errs)
            return Promise.reject(errs)
          })
        )
      )
      if (newActiveName) {
        // 高亮第一个校验失败的页签
        this.activeName = newActiveName
      }
      if (this.validErrData.length) {
        this.validErrVisible = true
        return Promise.reject('校验不通过:' + this.activeName)
      }
      return true
    },
    validateTime() {
      if (this.$route.query.registId) {
        validateApi.timeRestriction(this.$route.query.registId)
          .then(res => {
            console.log(res)
            if (res.status === 202 && res.detailMessages) {
              this.validateTimeErrors = res.detailMessages
              this.showValidateDialog = true
            } else {
              this.handleSave(1)
            }
          })
      }
    },
    async handleFinish() {
      await this.$confirm('确定提交审核吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await this.validate()
      this.validateTime()
    },
    getConfirmTitle(statusFlag) {
      var msg = ''
      switch (statusFlag) {
        case '2':
          msg = '确定通过审核吗？'
          break
        case '3':
          msg = '确定通过存档吗？'
          break
        default:
          msg = '确定当前操作吗？'
      }
      return msg
    },
    getConfirmReject(reject) {
      var msg = ''
      switch (reject) {
        case '1':
          msg = '确定驳回审核吗？'
          break
        case '2':
          msg = '确定驳回存档吗？'
          break
      }
      return msg
    },
    updateRejectStatus(registIds, statusFlag, reject) {
      patientApi
        .updateIsDeleteStatusReportStatusBatch({
          registIdList: registIds,
          status: statusFlag,
          reject: reject,
          remark: this.remark
        })
        .then((res) => {
          if (res.status === 200 && res.code === '0') {
            this.$message.success('操作成功')
            this.getGcPatientDetail()
          } else {
            this.$message.error('操作失败！')
          }
        })
    },
    updateStatus(registIds, statusFlag, reject) {
      this.$confirm(this.getConfirmTitle(statusFlag), '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          patientApi
            .updateIsDeleteStatusReportStatusBatch({
              registIdList: registIds,
              status: statusFlag,
              reject: reject
            })
            .then((res) => {
              if (res.status === 200 && res.code === '0') {
                this.$message.success('操作成功')
                this.getGcPatientDetail()
              } else {
                this.$message.error('操作失败！')
              }
            })
        })
        .catch(() => {})
    },
    updateReportStatus(registIds, reportFlag) {
      var msg = reportFlag === '1' ? '确定上报吗？' : '确定取消上报吗？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          patientApi
            .updateIsDeleteStatusReportStatusBatch({
              registIdList: registIds,
              reportStatus: reportFlag
            })
            .then((res) => {
              if (res.status === 200 && res.code === '0') {
                this.$message.success('操作成功')
                this.getGcPatientDetail()
              } else {
                this.$message.error('操作失败！')
              }
            })
        })
        .catch(() => {})
    },
    rfTagShowModal(code) {
      this.rfTagVisible = true
    },
    rfTagHideModal() {
      this.rfTagVisible = false
      this.getGcPatientDetail()
    },
    convertRF(value, dic) {
      if (!value) return ''
      if (!dic || !Array.isArray(dic)) return value
      value = value.toString()
      return (dic.find((v) => v.value === value) || { label: '' }).label
    },
    onReview() {
      const { href } = this.$router.resolve({
        name: 'Review',
        query: {
          registId: this.$route.query.registId,
          emId: this.patientDetail.basicInfo.emId,
          infoComingType: this.patientDetail.basicInfo.infoComingType,
          hospitalAndArea: this.hospitalAndArea()
        }
      })
      window.open(href, '_blank')
    },
    // 同步操作
    onSelectMoreActions() {
      const loading = this.$loading({
        lock: true,
        text: '加载中...'
      })
      patientApi
        .syncPatientDetailManually(this.$route.query.registId)
        .then((res) => {
          if (res.status === 200 && res.code === '0') {
            this.$message.success('同步成功')
            this.getGcPatientDetail()
          } else {
            this.$message.error('同步失败')
          }
        })
        .finally(() => {
          loading.close()
        })
    },
    // 获取患者时间轴
    async getTimeline(registId) {
      const res = await patientApi.getTimeline(registId)
      // 按时间排序
      const sortedArr = (res.result || []).sort(
        (a, b) => this.$moment(a.timeValue) - this.$moment(b.timeValue)
      )
      for (let i = sortedArr.length - 1; i >= 0; i--) {
        const curItem = sortedArr[i]
        const prevItem = sortedArr[i - 1]
        const [date, time] = curItem.timeValue
          ? this.$moment(curItem.timeValue)
            .format('YYYY-MM-DD HH:mm')
            .split(' ')
          : []
        const isInSameDay =
          this.$moment(prevItem?.timeValue).format('YYYY-MM-DD') === date
        if (!isInSameDay) {
          // 在日期变化间隙插入日期分隔节点
          sortedArr.splice(i, 0, { timeValue: date })
        }
        curItem.timeValue = time
      }
      this.timelines = sortedArr
    }
  }
}
</script>

<style lang="sass" scoped>
$bkg-color: #fff
.edit-panel
  background-color: #f5f6fb
  height: calc(100vh - 66px)
  .timeline-area
    width: 300px
    height: calc(100vh - 100px)
    background-color: $bkg-color
    margin: 10px 10px
  .content-area
    height: calc(100vh - 100px)
    background-color: $bkg-color
    margin: 10px 10px 10px 0
    ::v-deep .el-tabs__header
      background-color: #f5f6fb
      margin: 0 -20px
      padding: 0 20px 0 10px
      .el-tabs__nav-wrap:after
          content: none
    ::v-deep .el-tabs__content
      padding-top: 20px
    ::v-deep .el-tabs__active-bar
      bottom: 12px

    ::v-deep .el-tabs__item
      font-weight: 550
      font-size: 18px
      padding-top: 6px
      height: 70px
      line-height: 66px
      color: rgb(67,83,114)
      &.is-active
        color: #4b60fd

  .footer-area
    background-color: $bkg-color
    margin: 0 10px

.tabs
  position: relative
.function-bar
  position: absolute
  right: 0
  top: 23px
  z-index: 9
.static-btn
  &:hover,
  &:focus,
  &:active
    background-color: #4b60fd
    border-color: #4b60fd
  &.is-plain:hover,
  &.is-plain:focus,
  &.is-plain:active
    color: #4b60fd
    background: #e6efff
    border-color: #b7bffe
</style>
