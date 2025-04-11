<template>
  <div class="edit-panel">
    <el-container v-if="getInfoFlag">
      <el-container>
        <el-aside class="timeline-area">
          <timeline :regist-id="$route.query.registId" />
        </el-aside>
        <el-main class="content-area">
          <base-info
            ref="baseInfo"
            :info="patientDetail.basicInfo"
            @comingTypeChange="changeComingType"
          />
          <div class="tabs">
            <el-tabs v-model="activeName">
              <el-tab-pane
                v-for="tab in tabList"
                :key="tab.name"
                :label="tab.label"
                :name="tab.name"
              >
                <component :is="tab.component" />
              </el-tab-pane>
            </el-tabs>
          </div>
          <!-- <div
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
                class="static-btn"
                size="medium"
                @click="handleFinish"
              >提交</el-button>
            </div>
            <div v-if="patientDetail.basicInfo.status === '1'">
              <el-button
                size="medium"
                @click="updateStatus([patientDetail.basicInfo.registId], '0')"
              >撤回</el-button>
              <el-button
                class="static-btn"
                type="primary"
                plain
                size="medium"
                @click="updateStatus([patientDetail.basicInfo.registId], '0')"
              >驳回</el-button>
              <el-button
                type="primary"
                size="medium"
                @click="updateStatus([patientDetail.basicInfo.registId], '2')"
              >通过</el-button>
            </div>
            <div v-if="patientDetail.basicInfo.status === '2'">
              <el-button
                type="primary"
                class="static-btn"
                plain
                size="medium"
                @click="updateStatus([patientDetail.basicInfo.registId], '0')"
              >驳回</el-button>
              <el-button
                type="primary"
                size="medium"
                @click="updateStatus([patientDetail.basicInfo.registId], '3')"
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
                <el-button
                  size="medium"
                  @click="updateStatus([patientDetail.basicInfo.registId], '0')"
                >撤回</el-button>
                <el-button
                  type="primary"
                  size="medium"
                  @click="
                    updateReportStatus([patientDetail.basicInfo.registId], '1')
                  "
                >上报</el-button>
              </div>
            </div>
          </div> -->
        </el-main>
      </el-container>
      <el-footer class="footer-area" />
    </el-container>
  </div>
</template>

<script>
import timeline from '@/views/patient/edit/timeline'
import baseInfo from './baseinfo'
import firstAid from './firstaid'
import triage from './triage'
import examination from './examination'
import inspection from './inspection'
import medication from './medication'
import patientApi from '@/api/patient'

export default {
  name: 'ReviewIndex',
  components: {
    timeline,
    baseInfo,
    firstAid,
    triage,
    examination,
    inspection,
    medication
  },
  data() {
    return {
      getInfoFlag: false,
      patientDetail: {},
      activeName: 'firstAid',
      comingType: '',
      dispose: '',
      rfButName: ''
    }
  },
  computed: {
    tabList() {
      const all = [
        {
          label: '急救病历',
          name: 'firstAid',
          component: firstAid,
          hidden: !this.showAid
        },
        { label: '预检分诊', name: 'triage', component: triage },
        { label: '检查', name: 'examination', component: examination },
        { label: '检验', name: 'inspection', component: inspection },
        { label: '用药', name: 'medication', component: medication }
      ]

      return all.filter((el) => !el.hidden)
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
      return this.tabList.map((tab) => tab.name)
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
    }
  },
  mounted() {
    if (this.$route.query.rfTags) {
      this.rfTags = JSON.parse(this.$route.query.rfTags)
    }
    // 获取当前regist-id所有卒中信息
    this.getGcPatientDetail()
  },
  methods: {
    getGcPatientDetail() {
      patientApi
        .getGcPatientDetail({
          registId: this.$route.query.registId
        })
        .then((res) => {
          if (res.status === 200 && res.result) {
            this.patientDetail = res.result
            this.rfButName = this.patientDetail.triage?.gcTriage?.rfTagId
              ? '腕带号:' + this.patientDetail.triage?.gcTriage?.rfTagId
              : '绑定腕带号'
            this.getInfoFlag = true
          }
        })
    },
    changeComingType(val) {
      this.comingType = val
    }
    // removeNull(arr) {
    //   return arr.filter((item) => item)
    // },
    // 拼装分诊部分数据
    // genTriagePart() {
    //   const { registId } = this.$refs['baseInfo'].gc.patientInfo
    //   const triage = { ...this.$refs['triage'].gc.triage, registId }
    //   const firstAidTriage = this.$refs['firstAid']?.gc?.triage || {}
    //   const isFromOutSide = ['1', '3'].includes(this.comingType)
    //   // 120 或者 转院 使用急救模块中的部分数据
    //   if (isFromOutSide) {
    //     triage.isAfterWakeup = firstAidTriage.isAfterWakeup
    //     triage.lastHealthyTime = firstAidTriage.lastHealthyTime
    //     triage.awareTime = firstAidTriage.awareTime
    //     triage.onsetTime = firstAidTriage.onsetTime
    //   }
    //   return triage
    // },
    // assembleObject(status) {
    //   const { registId } = this.$refs['baseInfo'].gc.patientInfo

    //   let preEcgList = this.$refs['firstAid']?.gc?.ecg?.a || []
    //   let withinEcgList = this.$refs['triage']?.gc?.ecg?.b || []
    //   preEcgList = preEcgList.map((ele) => {
    //     return {
    //       ...ele,
    //       registId: registId,
    //       ecgType: ecgType.preHospital
    //     }
    //   })
    //   withinEcgList = withinEcgList.map((ele) => {
    //     return {
    //       ...ele,
    //       registId: registId,
    //       ecgType: ecgType.withinHospital
    //     }
    //   })

    //   const patientDetailDTO = {
    //     basicInfo: {
    //       ...this.$refs['baseInfo'].gc.patientInfo,
    //       outPatientNo: this.$refs['triage'].gc?.baseInfo?.outPatientNo,
    //       status: status
    //     },
    //     firstAid: {
    //       gcFirstAidDTO: this.$refs['firstAid']
    //         ? {
    //           ...this.$refs['firstAid'].gc.firstAid,
    //           registId
    //         }
    //         : null,
    //       ecgList: preEcgList,
    //       outReferalDTO: this.$refs['firstAid']
    //         ? {
    //           ...this.$refs['firstAid'].gc.outReferal,
    //           registId
    //         }
    //         : null
    //     },
    //     triage: {
    //       gcTriage: this.genTriagePart(),
    //       gcSign: {
    //         ...this.$refs['triage'].gc.sign,
    //         registId
    //       },
    //       ecgList: withinEcgList
    //     },
    //     detection: {
    //       gcDetection: {
    //         ...this.$refs['detection'].gc.detection,
    //         registId,
    //         bloodCollectionTime:
    //           this.$refs['triage'].gc?.detection?.bloodCollectionTime
    //       },
    //       gcMh: { ...this.$refs['detection'].gc.mh, registId },
    //       gcLisList: [
    //         this.$refs['detection'].gc.rbtLis.reportTime
    //           ? {
    //             ...this.$refs['detection'].gc.rbtLis,
    //             registId: this.$refs['detection'].gc.detection.registId,
    //             itemType: '1'
    //           }
    //           : null,
    //         this.$refs['detection'].gc.crLis.reportTime
    //           ? {
    //             ...this.$refs['detection'].gc.crLis,
    //             registId: this.$refs['detection'].gc.detection.registId,
    //             itemType: '2'
    //           }
    //           : null,
    //         this.$refs['detection'].gc.lkfLis.reportTime
    //           ? {
    //             ...this.$refs['detection'].gc.lkfLis,
    //             registId: this.$refs['detection'].gc.detection.registId,
    //             itemType: '3'
    //           }
    //           : null
    //       ],
    //       gcImageList: [
    //         this.$refs['detection'].gc.ctImage.finishTime
    //           ? {
    //             ...this.$refs['detection'].gc.ctImage,
    //             registId: this.$refs['detection'].gc.detection.registId,
    //             itemType: '1'
    //           }
    //           : null,
    //         this.$refs['detection'].gc.ctaImage.finishTime
    //           ? {
    //             ...this.$refs['detection'].gc.ctaImage,
    //             registId: this.$refs['detection'].gc.detection.registId,
    //             itemType: '2'
    //           }
    //           : null,
    //         this.$refs['detection'].gc.ctpImage.finishTime
    //           ? {
    //             ...this.$refs['detection'].gc.ctpImage,
    //             registId: this.$refs['detection'].gc.detection.registId,
    //             itemType: '3'
    //           }
    //           : null,
    //         this.$refs['detection'].gc.mriImage.finishTime
    //           ? {
    //             ...this.$refs['detection'].gc.mriImage,
    //             registId: this.$refs['detection'].gc.detection.registId,
    //             itemType: '4'
    //           }
    //           : null,
    //         this.$refs['detection'].gc.mraImage.finishTime
    //           ? {
    //             ...this.$refs['detection'].gc.mraImage,
    //             registId: this.$refs['detection'].gc.detection.registId,
    //             itemType: '5'
    //           }
    //           : null,
    //         this.$refs['detection'].gc.dwiImage.finishTime
    //           ? {
    //             ...this.$refs['detection'].gc.dwiImage,
    //             registId: this.$refs['detection'].gc.detection.registId,
    //             itemType: '6'
    //           }
    //           : null,
    //         this.$refs['detection'].gc.pwiImage.finishTime
    //           ? {
    //             ...this.$refs['detection'].gc.pwiImage,
    //             registId: this.$refs['detection'].gc.detection.registId,
    //             itemType: '7'
    //           }
    //           : null
    //       ]
    //     },
    //     cure: {
    //       ...(this.$refs['rs']
    //         ? {
    //           ...this.$refs['rs'].gc.cure,
    //           registId
    //         }
    //         : null),
    //       ...(this.$refs['pci']
    //         ? {
    //           ...this.$refs['pci'].gc.cure,
    //           registId
    //         }
    //         : null)
    //     },
    //     outcome: this.$refs['outcome'].gc.outcome
    //   }
    //   // 去除数组中为null的空值
    //   patientDetailDTO.detection.gcLisList = this.removeNull(
    //     patientDetailDTO.detection.gcLisList
    //   )
    //   patientDetailDTO.detection.gcImageList = this.removeNull(
    //     patientDetailDTO.detection.gcImageList
    //   )

    //   return patientDetailDTO
    // },
    // handleSave(status) {
    //   var msg = status === 0 ? '保存' : '提交'
    //   patientApi.setGcPatientDetail(this.assembleObject(status)).then((res) => {
    //     if (res.status === 200 && res.code === '0') {
    //       this.$message.success(msg + '成功')
    //       this.getGcPatientDetail()
    //     } else {
    //       this.$message.error(msg + '失败！')
    //     }
    //   })
    // },
    // validate() {
    //   return Promise.all(
    //     ['baseInfo'].concat(this.visibleTabNames).map((name) =>
    //       this.$refs[name].validate().catch(
    //         () =>
    //           // 高亮第一个校验失败的页签
    //           (name !== 'baseInfo' && (this.activeName = name) && false) ||
    //           Promise.reject('校验不通过:' + name)
    //       )
    //     )
    //   )
    // },
    // async handleFinish() {
    //   await this.$confirm('确定提交审核吗？', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   })
    //   await this.validate()
    //   this.handleSave(1)
    // },
    // getConfirmTitle(statusFlag) {
    //   var msg = ''
    //   switch (statusFlag) {
    //     case '2':
    //       msg = '确定通过审核吗？'
    //       break
    //     case '3':
    //       msg = '确定通过存档吗？'
    //       break
    //     default:
    //       msg = '确定当前操作吗？'
    //   }
    //   return msg
    // },
    // updateStatus(registIds, statusFlag) {
    //   this.$confirm(this.getConfirmTitle(statusFlag), '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   })
    //     .then(() => {
    //       patientApi
    //         .updateIsDeleteStatusReportStatusBatch({
    //           registIdList: registIds,
    //           status: statusFlag
    //         })
    //         .then((res) => {
    //           if (res.status === 200 && res.code === '0') {
    //             this.$message.success('操作成功')
    //             this.getGcPatientDetail()
    //           } else {
    //             this.$message.error('操作失败！')
    //           }
    //         })
    //     })
    //     .catch(() => {})
    // },
    // updateReportStatus(registIds, reportFlag) {
    //   var msg = reportFlag === '1' ? '确定上报吗？' : '确定取消上报吗？'
    //   this.$confirm(msg, '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   })
    //     .then(() => {
    //       patientApi
    //         .updateIsDeleteStatusReportStatusBatch({
    //           registIdList: registIds,
    //           reportStatus: reportFlag
    //         })
    //         .then((res) => {
    //           if (res.status === 200 && res.code === '0') {
    //             this.$message.success('操作成功')
    //             this.getGcPatientDetail()
    //           } else {
    //             this.$message.error('操作失败！')
    //           }
    //         })
    //     })
    //     .catch(() => {})
    // },
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
    background: #edefff
    border-color: #b7bffe
</style>
