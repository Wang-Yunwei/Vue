<template>
  <med-view-container @return="toFileList" :title="title" wide>
    <template #right v-if="!this.isArchived">
      <div v-if="!isBound" @click="handleBind">
        <i class="iconfont iconlvtong-96" style="font-size: 0.6rem" />绑定
      </div>
      <template v-else>
        <!-- <i
          class="iconfont iconicon1-13"
          style="font-size: 0.6rem"
          @click="scan"
        /> -->
        <van-popover
          v-model="showMoreActions"
          trigger="click"
          placement="bottom-end"
          :actions="actions"
          :offset="[18, 8]"
          @select="onSelectMoreActions"
        >
          <template #reference>
            <i class="iconfont iconicon1-151" style="font-size: 0.6rem" />
          </template>
        </van-popover>
      </template>
    </template>
    <patient-info
      v-bind="patientInformation"
      :scrolling="scrolling"
      :dic="dicData"
      :bindBtn="true"
      :viewMode="isViewMode"
      @changed="handlePatientInfoChange"
      @rfTagIdChange="rfTagIdChange"
    />
    <van-tabs
      v-if="tabList.length"
      v-model="active"
      sticky
      color="#5e74fe"
      :lazy-render="false"
    >
      <van-tab
        v-for="item in tabList"
        :title="item.name"
        :key="item.name"
        :name="item.name"
        ref="tabs"
      >
        <div
          :class="{
            'scroll-view': true,
            'no-foot':
              (details.status === emrStatus.archived &&
                details.reportStatus === reportStatus.reported) ||
              details.reportStatus === reportStatus.success
          }"
        >
          <component
            :is="item.part"
            :ref="item.name"
            :dic="dicData"
            @changed="handleChange"
            :class="modeClass"
            :viewMode="isViewMode"
            :is-bound="isBound"
          />
        </div>
      </van-tab>
    </van-tabs>
    <van-empty
      v-else
      :image="require('@assets/image/empty.png')"
      description="未授权或暂无填写数据"
    />
    <div class="op-container">
      <van-button
        color="#5e74fe"
        plain
        v-if="
          (details.status === emrStatus.waitingForApproval &&
            $entitled('mr-auditreject')) ||
            (details.status === emrStatus.waitingForArchive &&
              $entitled('mr-archivereject'))
        "
        @click="showReason()"
      >
        驳回
      </van-button>
      <!-- 缺少新增权限(strok-mr-add)时,不可操作提交按钮 -->
      <van-button
        v-if="
          details.status === '0' &&
            $entitled('mr-add') &&
            $entitled('mr-submit')
        "
        round
        type="info"
        color="#5e74fe"
        @click="validateAndSubmit"
      >
        提交
      </van-button>
      <van-button
        type="info"
        color="#5e74fe"
        v-if="
          details.status === emrStatus.waitingForApproval &&
            $entitled('mr-audit')
        "
        @click="approve()"
      >
        通过
      </van-button>
      <van-button
        type="info"
        color="#5e74fe"
        v-if="
          details.status === emrStatus.waitingForArchive &&
            $entitled('mr-archive')
        "
        @click="archive()"
      >
        存档
      </van-button>
      <van-button
        type="danger"
        plain
        v-if="
          $entitled('mr-revocation') &&
            details.reportStatus === reportStatus.failed &&
            details.status === emrStatus.archived
        "
        @click="withdraw()"
      >
        撤回
      </van-button>
      <van-button
        type="info"
        color="#FF6803"
        v-if="
          $entitled('mr-report') &&
            details.status === emrStatus.archived &&
            details.reportStatus === reportStatus.notReported
        "
        @click="handleReport"
      >
        上报
      </van-button>
      <reason
        ref="reason"
        :title="reasonTitle"
        :reasonType="reasonType"
        @refresh="getBasicInfo($route.query.registId, true)"
      />
    </div>
    <med-popup-container v-model="opHisShow" :duration="0.12" hideHeader>
      <OperationHistory
        v-if="opHisShow"
        :registId="$route.query.registId"
        @backClick="closeOpHis"
      />
    </med-popup-container>
    <med-popup-container v-model="showBind" :duration="0.12" hideHeader>
      <BindPatient
        v-if="showBind"
        :registId="$route.query.registId"
        :patientName="details.name"
        @backClick="closeBind"
        @success="onBindSuccess"
      />
    </med-popup-container>
  </med-view-container>
</template>

<script>
import * as parts from './parts'
import reason from './reason'
import { mapGetters, mapMutations } from 'vuex'
import * as types from '@/store/mutations/mutations-types'
import PatientInfo from './components/PatientInfo/index.vue'
import BindPatient from './components/BindPatient/index.vue'
import OperationHistory from '@views/gc/detail/task/components/OperationHistory/index'
import {
  emrStatus,
  rejectType,
  reportStatus,
  comingTypeConst
} from '@constant/commonConstant'
import scannerMixin from '@mixins/scannerMixin'
import loadingMixin from '@mixins/loadingMixin'
import basicInfoMixin from '@mixins/basicInfoMixin'
import { BasicStatus, QrTime } from '@model/commonModel'

const formatStr = 'YYYY-MM-DD HH:mm:ss'

export default {
  name: 'Task',
  components: { OperationHistory, PatientInfo, BindPatient, ...parts, reason },
  mixins: [scannerMixin, loadingMixin, basicInfoMixin],
  data() {
    return {
      showMoreActions: false,
      registId: this.$route.query.registId,
      active: '院前急救',
      reasonTitle: '',
      reasonType: '',
      emrStatus,
      reportStatus,
      rejectType,
      comingTypeConst,
      details: {},
      scrollTop: 0,
      scrolling: false,
      // 是否显示操作日志
      opHisShow: false,
      showBind: false // 显示绑定页面
    }
  },
  computed: {
    ...mapGetters(['comingType', 'dispose', 'dicData', 'userInfo']),
    actions() {
      const actionArr = []
      if (this.details.status === this.emrStatus.filling) {
        actionArr.push({
          icon: 'replay',
          text: '同步'
        })
      }
      actionArr.push({
        icon: 'label-o',
        text: '日志'
      })
      actionArr.push({
        icon: 'description',
        text: '调阅'
      })
      return actionArr
    },
    isBound() {
      // 是否已绑定
      return !!(this.details.emId || this.$route.query.emId)
    },
    tabList() {
      const dispose = this.dispose ? this.dispose.split(',') : []
      return [
        {
          name: '院前急救',
          part: parts.FirstAid,
          auth: 'mr-firstaid',
          hidden: ![
            this.comingTypeConst.local120,
            this.comingTypeConst.otherHospitalTransfer,
            ''
          ].includes(this.comingType)
        },
        { name: '预检分诊', part: parts.Triage, auth: 'mr-triage' },
        { name: '检验检测', part: parts.Detection, auth: 'mr-inspection' },
        {
          name: '静脉溶栓',
          part: parts.Thrombolysis,
          auth: 'mr-rs',
          hidden: !dispose.includes('1')
        },
        {
          name: '介入手术',
          part: parts.Pci,
          auth: 'mr-pci',
          hidden: !dispose.includes('2')
        },
        { name: '患者转归', part: parts.Outcome, auth: 'mr-outcome' }
      ].filter(el => !el.hidden && this.$entitled(el.auth))
    },
    isViewMode() {
      return (
        this.$route.query?.viewMode ||
        this.details.status !== emrStatus.filling ||
        !this.$entitled('mr-add') // 没有新增权限,"填报中"的病历只读
      )
    },
    modeClass() {
      return this.isViewMode ? 'view-mode' : ''
    },
    title() {
      return this.isViewMode ? '病历查看' : '病历编辑'
    },
    // 是否存档
    isArchived() {
      return this.details.status === this.emrStatus.archived
    }
  },
  async created() {
    // this.clearCache()
    // 获取基本信息
    this.getBasicInfo(this.$route.query.registId, true)
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, true)
  },
  methods: {
    ...mapMutations(types),
    onBindSuccess() {
      this.showBind = false
      this.getBasicInfo(this.$route.query.registId, true)
      // 绑定后触发刷新
      if (this.$refs?.[this.active]?.[0]?.init) {
        this.$refs[this.active][0].init()
      }
    },
    handleReport() {
      this.updateReportStatus(this.reportStatus.reported)
    },
    /**
     * 打开驳回原因对话框
     * @description 1.审核驳回, 2.归档驳回
     */
    showReason() {
      if (this.details.status === emrStatus.waitingForApproval) {
        // 审核驳回
        this.reasonType = this.rejectType.approvalReject
      } else if (this.details.status === emrStatus.waitingForArchive) {
        // 归档驳回
        this.reasonType = this.rejectType.archiveReject
      } else {
        return
      }
      this.reasonTitle = '驳回原因'
      this.$nextTick(() => {
        this.$refs.reason.showModel(true)
      })
    },
    /**
     * 删除患者缓存信息
     */
    clearCache() {
      this[types.SET_BASIC_INFO]({})
    },
    handleScroll() {
      const contentElement = document.querySelector('.van-tabs__content')
      if (contentElement) {
        this.scrollTop = contentElement.scrollTop
        if (this.scrollTop > 0) {
          contentElement.style.paddingBottom = '0.75rem'
          this.scrolling = true
        } else {
          contentElement.style.paddingTop = '0'
          this.scrolling = false
        }
      }
    },
    handleChange() {
      this.getBasicInfo(this.$route.query.registId, true)
    },
    closeBind() {
      this.showBind = false
    },
    closeOpHis() {
      this.opHisShow = false
    },
    rfTagIdChange(id) {
      // 腕带号变化
      this.$set(this.details, 'rfTagId', id)
      this[types.SET_PATIENT_INFO]({ ...this.details })
    },
    handlePatientInfoChange() {
      this.active = this.tabList[0]?.name
      this.getBasicInfo(this.$route.query.registId, true)
      this.tabList.forEach(tab => {
        if (this.$refs[tab.name][0]?.init) {
          this.$refs[tab.name][0].init()
        }
      })
    },
    async validateAndSubmit() {
      if (!this.validateBasicInfo()) {
        return
      }

      const promises = this.tabList
        .filter(t => this.$refs[t.name][0]?.validate)
        .map(tab => {
          return this.$refs[tab.name][0].validate(tab.name)
        })
      Promise.all(promises)
        .then(async () => {
          if ((await this.validateTime()) === 202) {
            return
          }
          this.$dialog
            .confirm({
              title: '提示',
              message: '确定提交审核吗？',
              confirmButtonColor: '#5e74fe'
            })
            .then(() => {
              // 确定
              this.updateEMRStatus(emrStatus.waitingForApproval)
            })
            .catch(() => {})
        })
        .catch(({ tabName, errors }) => {
          this.$nextTick(() => {
            this.$notify({
              type: 'warning',
              message: `请填写${errors[0].name}`
            })
          })
          this.active = tabName
        })
    },
    /**
     * 验证基本信息字段
     * @returns {boolean}
     */
    validateBasicInfo() {
      if (
        this.basicInfo.name === '' ||
        this.basicInfo.gender === '' ||
        !this.basicInfo.age ||
        this.basicInfo.idcardType === '' ||
        this.basicInfo.comingType === ''
      ) {
        this.$notify({
          type: 'warning',
          message: `请填写基本信息`
        })
        return false
      }
      return true
    },
    async validateTime() {
      // 校验时间字段的先后顺序
      const res = await this.$api.validation.timeRestriction(this.registId)
      if (res.message) {
        this.$notify({ type: 'warning', duration: 3000, message: res.message })
      }
      return res.status
    },
    /**
     * 更新上报状态
     */
    updateReportStatus(reportStatus) {
      this.$api.basicInfo
        .updateReportStatus(this.registId, reportStatus)
        .then(({ result }) => {
          // 再次调用查询接口刷新页面
          if (result) {
            this.getBasicInfo(this.$route.query.registId, true)
          }
        })
    },
    /**
     * 通过
     */
    approve() {
      this.$dialog
        .confirm({
          title: '提示',
          message: '确定通过审核吗？',
          confirmButtonColor: '#5e74fe'
        })
        .then(() => {
          // 确定
          this.updateEMRStatus(this.emrStatus.waitingForArchive)
        })
        .catch(() => {})
    },
    /**
     * 存档
     */
    archive() {
      this.$dialog
        .confirm({
          title: '提示',
          message: '确定通过审核吗？',
          confirmButtonColor: '#5e74fe'
        })
        .then(() => {
          // 确定
          this.updateEMRStatus(this.emrStatus.archived)
        })
        .catch(() => {})
    },
    /**
     * 撤回
     */
    withdraw() {
      this.$dialog
        .confirm({
          title: '提示',
          message: '确定撤回吗？',
          confirmButtonColor: '#5e74fe'
        })
        .then(() => {
          // 确定
          this.updateEMRStatus(this.emrStatus.filling)
        })
        .catch(() => {})
    },
    /**
     * 更新病历填报状态
     */
    updateEMRStatus(emrStatus, reject = undefined, remark) {
      const basicStatus = {
        ...BasicStatus(),
        registId: this.registId,
        status: emrStatus,
        reject: reject,
        remark: remark,
        opBy: this.userInfo.name
      }
      this.$api.basicInfo.updateEMRStatus(basicStatus).then(({ result }) => {
        // 再次调用查询接口刷新页面
        if (result) {
          if (this.emrStatus.archived === emrStatus) {
            // 存档就返回到列表
            this.toFileList()
          } else {
            this.getBasicInfo(this.$route.query.registId, true)
          }
          this.$notify({ type: 'success', message: '操作成功' })
        }
      })
    },
    // 跳转页面
    toFileList(item) {
      this.$router.push({
        path: '/gc'
      })
    },
    // 绑定
    handleBind() {
      this.showBind = true
    },
    /**
     * 扫码
     */
    scan() {
      if (!this.registId) {
        this.$toast('缺少登记号')
        return
      }
      this.$bridge.callhandler('scanner', { type: ['1'] }, data => {
        const code = this.parseScanQrOrBar(data)
        // 是否匹配到场景码
        let match = true
        const qrTime = { ...QrTime(), registId: this.registId }
        // 当前时间
        const now = this.$moment().format(formatStr)
        switch (code) {
          // 患者到院时间
          case 'Door':
            qrTime.arriveHospitalTime = now
            break
          // 入抢时间
          case 'RescueIn':
            qrTime.rrEnterTime = now
            break
          // 出抢时间
          case 'RescueOut':
            qrTime.rrLeaveTime = now
            break
          // 进入CT室时间
          case 'CTIn':
            qrTime.ctEnterTime = now
            break
          // 离开CT室时间
          case 'CTOut':
            qrTime.ctLeaveTime = now
            break
          // 进入导管室时间
          case 'CathIn':
            qrTime.crEnterTime = now
            break
          // 离开导管室时间
          case 'CathOut':
            qrTime.crLeaveTime = now
            break
          default:
            match = false
        }
        // 没有匹配则返回
        if (!match) {
          this.$toast('未找到匹配的场景码')
          return
        }
        this.loading()
        // 保存场景码的时间
        this.$api.qr
          .saveQrTime(qrTime)
          .then(({ result }) => {
            if (this.$refs[this.active][0].init) {
              this.$refs[this.active][0].init()
            }
          })
          .finally(() => this.hideLoading())
      })
    },
    // 更多操作
    onSelectMoreActions(e) {
      if (e.text === '同步') {
        this.loading()
        this.$api.thirdParty
          .syncPatientDetailManually(this.registId)
          .then(({ result }) => {
            this.$notify({ type: 'success', message: '同步成功' })
            if (this.$refs?.[this.active]?.[0]?.init) {
              this.$refs[this.active][0].init()
            }
          })
          .finally(() => this.hideLoading())
      } else if (e.text === '日志') {
        this.opHisShow = true
      } else if (e.text === '调阅') {
        const { registId, infoComingType, regNo } = this.$route.query
        const emId = this.details.emId || this.$route.query.emId
        this.$router.push({
          path: '/gc/preview',
          query: {
            registId,
            regNo,
            infoComingType,
            emId
          }
        })
      }
    }
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  watch: {
    active: {
      immediate: true,
      handler(name) {
        if (this.$refs?.[name]?.[0]?.init) {
          this.$refs[name][0].init()
        }
      }
    },
    '$route.path': {
      immediate: false,
      handler(path) {
        if (this.tabList.length) {
          this.active = this.tabList[0].name
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';

/deep/ .van-tabs__wrap * {
  touch-action: auto;
}

/deep/ .van-tabs .van-tabs__content {
  height: auto !important;
  padding-bottom: 0 !important;
}

.scroll-view {
  height: calc(100vh - 8.35rem);
  overflow: auto;

  &.no-foot {
    height: calc(100vh - 7rem);
  }

  /deep/ .van-tabs {
    height: auto;
  }
}

.op-container {
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f3f3f3;

  button {
    border-radius: 44px;
    flex-grow: 1;
    height: 76px;
    margin: 10px 10px;
  }
}
</style>
