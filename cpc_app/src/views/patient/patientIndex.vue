<template>
  <div class="med-list-card">
    <van-pull-refresh
      v-model="loading"
      @refresh="handleSearch"
      :disabled="pullDisabled"
    >
      <div class="main-list" ref="scrollBox" @scroll.stop="handleScroll">
        <div
          class="card-item-wrapper"
          v-for="item in list"
          :key="item.value"
          :title="item.name"
          :name="item.value"
        >
          <van-swipe-cell
            :disabled="
              item.status === '41' ||
                item.status === '31' ||
                item.status === '21' ||
                item.isLock === '1'
            "
          >
            <div
              class="card-tem"
              @click="jump('/patient/document/detail', item)"
            >
              <div class="top flex-c-s">
                <span v-bind:class="getComeTypeClass(item)">
                  {{
                    item.comeType === '1'
                      ? '120'
                      : item.comeType === '2'
                      ? '转院'
                      : item.comeType === '3'
                      ? '自行'
                      : item.comeType === '4'
                      ? '院内'
                      : '未知'
                  }}
                </span>
                <span>建档时间：{{ item.createTime }}</span>
                <span
                  v-if="checkNeedShowIcon(item) > 0"
                  :class="getIconClassName(item)"
                  @click.stop="iclick(item)"
                ></span>
              </div>
              <div class="center">
                <div>
                  <p class="flex-c-s">
                    <span class="header-main">
                      <span class="name">{{ item.name }}</span>
                      <span>
                        {{
                          item.gender == '1'
                            ? '男'
                            : item.gender == '2'
                            ? '女'
                            : '未知'
                        }}
                      </span>
                      <span>{{ item.age }}岁</span>
                      <span v-show="item.diagnosis && item.diagnosis !== ''">
                        {{
                          item.diagnosis == '1'
                            ? 'STEMI'
                            : item.diagnosis == '2'
                            ? 'NSETMI'
                            : item.diagnosis == '3'
                            ? 'UA'
                            : item.diagnosis == '4'
                            ? '主动脉夹层'
                            : item.diagnosis == '5'
                            ? '肺动脉栓塞'
                            : item.diagnosis == '6'
                            ? '非ACS心源性胸痛'
                            : item.diagnosis == '7'
                            ? '其他非心源性胸痛'
                            : item.diagnosis == '9'
                            ? '待查'
                            : ''
                        }}
                      </span>
                    </span>
                    <span
                      class="header-report-desc"
                      :style="getReportClass(item)"
                      @click.stop="showLog(item)"
                    >
                      {{ getReportDesc(item) }}
                      <van-icon name="warning-o" v-if="item.isReport === '2'"/>
                    </span>
                  </p>
                  <p class="memo-row">
                    <span
                      class="memo-row-col"
                      v-if="configure.dockingWay === '2'"
                    >
                      <span>填报编号:</span>
                      <span>{{ item.reportNo }}</span>
                    </span>
                    <span
                      class="memo-row-col"
                      v-if="configure.dockingWay === '1'"
                    >
                      <span>{{ getDisplayNo(item).name }}:</span>
                      <span>{{ getDisplayNo(item).value }}</span>
                    </span>
                    <span
                      class="memo-row-col"
                      v-if="configure.dockingWay === '1'"
                    >
                      <span>腕带号:</span>
                      <span> {{ getWristbindNo(item) }}</span>
                    </span>
                  </p>
                </div>
              </div>
              <div class="bottom flex-c-e bottom-status">
                <span>{{ showStatus ? getStatusDesc(item) : '' }}</span>
                <div class="btns">
                  <van-button
                    round
                    @click.stop="showReviewedHistory(item)"
                    v-if="false"
                    >审核日志</van-button
                  >
                  <van-button
                    round
                    v-if="
                      false &&
                        _resources.mrSubmit() &&
                        (item.status === '10' ||
                          item.status === '12' ||
                          item.status === '13')
                    "
                    @click="jump('/patient/document/detail', item)"
                    >提交</van-button
                  >
                  <!-- @click.stop="submitAudit(item)"  -->
                  <van-button
                    round
                    v-if="
                      false && _resources.mrSubmit() && showWithdrawAudit(item)
                    "
                    @click="jump('/patient/document/detail', item)"
                    >撤回</van-button
                  >
                  <!-- @click.stop="withdrawAudit(item)" -->
                  <van-button
                    round
                    v-if="
                      false &&
                        ((_resources.mrAudit() && item.status === '21') ||
                          (_resources.mrArchive() && item.status === '31'))
                    "
                    @click="jump('/patient/document/detail', item)"
                    >{{ item.status === '21' ? '通过' : '存档' }}</van-button
                  >
                  <!-- @click.stop="approve(item)" -->
                  <van-button
                    round
                    v-if="
                      false &&
                        ((_resources.mrAudit() && item.status === '21') ||
                          (_resources.mrArchive() && item.status === '31'))
                    "
                    @click="jump('/patient/document/detail', item)"
                    >驳回</van-button
                  >
                  <!-- @click.stop="reject(item)" -->
                  <van-button round @click.stop="toPreview(item)">
                    调阅
                  </van-button>
                  <van-button
round
@click.stop="toEcg(item)"
                    >心电图</van-button
                  >
                  <van-button
                    round
                    @click.stop="toTimelineManagement(item)"
                    v-if="!item.status || item.status === '10'"
                    >时间管理</van-button
                  >
                </div>
              </div>
            </div>
            <template #right>
              <van-button
                class="swipe-button"
                square
                type="danger"
                text="删除"
                :disabled="!_resources.mrDelete()"
                @click="deletePatient(item)"
              />
            </template>
          </van-swipe-cell>
        </div>
        <van-empty
          :image="require('@assets/image/empty.png')"
          v-if="!list.length"
          description="暂无数据">
        </van-empty>
      </div>
    </van-pull-refresh>
    <reason
      ref="reason"
      :title="reasonTitle"
      :reasonType="reasonType"
      @refresh="refreshData"
    />
    <med-popup-container
      v-model="showHistory"
      title="审核日志"
      position="right"
    >
      <div class="flow-log-container">
        <div class="flow-log-main">
          <van-steps
            direction="vertical"
            :active="historyActivity"
            active-icon="checked"
            active-color="#38f"
          >
            <van-step v-for="(h, index) in historyList" :key="'rh' + index">
              <!-- <template v-if="h.actionName.indexOf('拒绝') > -1" #active-icon>
                <van-icon name="clear"/>
              </template> -->
              <!--  <template
  v-else-if="index > 0"
  #active-icon
                ><van-icon name="checked" color="#38f"/>
              </template> -->
              <!-- <template v-if="h.actionName.indexOf('拒绝') > -1" #inactive-icon>
                  <van-icon name="clear" color="#38f"/>
              </template> -->
              <!-- <template
  v-else-if="index > 0"
  #inactive-icon
                ><van-icon
  name="checked"
  color="#38f"
              /></template> -->
              <div>
                <h3>【{{ h.actionName }}】</h3>
                <div class="flow-log-row">
                  <div>审核人：</div>
                  {{ h.userName }}
                </div>
                <div class="flow-log-row">
                  <div>审核时间：</div>
                  {{ h.actionTime }}
                </div>
                <div class="flow-log-row" v-if="h.comments">
                  <div>审核意见：</div>
                  {{ h.comments }}
                </div>
              </div>
            </van-step>
          </van-steps>
        </div>
        <van-empty
          :image="require('@assets/image/empty.png')"
          description="无审批日志"
          v-if="!historyList.length"
        />
      </div>
    </med-popup-container>
  </div>
</template>

<script>
import { ruleConstant } from '@/constant/commonConstant'
import { mapGetters, mapMutations } from 'vuex'
import * as types from '@/store/mutations/mutations-types'
import state from '@store/state/state'
import { Dialog } from 'vant'
import reason from '../../views/patient/document/detail/main/reason'
import parseJson from 'parse-json'
import moment from 'moment'
export default {
  props: {
    query: {
      required: true,
      type: Object
    },
    showStatus: {
      required: false,
      type: Boolean
    }
  },
  name: 'Filing',
  components: {
    reason
  },
  data() {
    return {
      list: [],
      comingType: '',
      registId: '',
      quertList: {
        comeType: [],
        type: '1',
        preDiagnosis: [],
        name: '',
        admissionNo: '',
        status: ['10', '12', '13', '41', '21', '31'],
        startTime: '',
        endTime: '',
        ambulanceDepartment: [],
        isHaveRs: '',
        rsLocale: [],
        outcomeCode: [],
        isGiveUp: '',
        outPatientNo: '',
        leaveDiagnosis: [],
        isHelp: '',
        isRemoteEcgTran: '',
        isNetHospitalTrans: '',
        isBypassEm: '',
        hospitalArea: state.hospitalArea,
        hospitalId: state.hospitalId
      },
      pullDisabled: false,
      toast: null,
      loading: false,
      lastQuery: {},
      searchPageVisible: false,
      pagination: {
        current: 1,
        pageSize: 5,
        pages: 1
      },
      archiveData: {
        registId: ''
      },
      reasonTitle: '',
      reasonType: '',
      showHistory: false,
      historyList: [],
      historyActivity: 0
    }
  },
  computed: {
    ...mapGetters(['hospitalArea', 'curHospitalArea', 'configure'])
  },
  mounted() {
  },
  // 钩子方法
  created() {
    // 获取基本信息
    this.queryDoctors()
  },
  methods: {
    ...mapMutations([types.SET_DOCTORS]),
    queryDoctors() {
      this.$api.service
        .getSysSetting({
          code: ruleConstant.NURSES
        })
        .then(res => {
          if (res.status === 200) {
            if (res.hasOwnProperty('result')) {
              const doctors = parseJson(res.result.value)
              if (doctors && doctors.length > 0) {
                this[types.SET_DOCTORS](
                  doctors
                    .filter(m => {
                      if (m.isEnabled) return m
                    })
                    .map(m => {
                      return { label: m.name, value: m.name }
                    })
                )
              }
            }
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
    },
    refreshData() {
      this.handleSearch()
    },
    showLog(item) {
      if (item.isReport !== '2') return
      const message = item.reportErrorMessage.split(';').filter(item => (item))

      const messages = message.map((item, index) => {
        const idx = index + 1
        return `${idx}.${item}\n`
      })

      const errmessage = messages.join('')
      Dialog.alert({
        title: '上报失败原因',
        message: errmessage || '暂无上报失败原因',
        messageAlign: 'left'
      }).then(() => {
        // on close
      })
    },
    reject(item) {
      if (item.status === '21') {
        this.reasonTitle = '驳回提交'
        this.reasonType = '1'
      } else if (item.status === '31') {
        this.reasonTitle = '驳回审核'
        this.reasonType = '2'
      }
      this.$refs.reason.showModel(true, item.id)
    },
    approve(item) {
      if (item.status === '21') {
        this.passAudit(item)
      } else if (item.status === '31') {
        this.archive(item)
      }
    },
    // 通过审核
    passAudit(item) {
      this.$dialog
        .confirm({ title: '提示', message: '确定通过审核吗?' })
        .then(() => {
          this.archiveData.registId = item.id
          this.$api.service.passAudit(this.archiveData).then(res => {
            if (res.status === 200) {
              this.$notify({ type: 'success', message: '通过审核成功' })
              this.handleSearch()
            } else {
              this.$notify({ type: 'warning', message: res.message })
            }
          })
        })
        .catch(() => {})
    },
    // 存档
    archive(item) {
      this.$dialog
        .confirm({ title: '提示', message: '确定存档吗?' })
        .then(() => {
          this.archiveData.registId = item.id
          this.$api.service.archive(this.archiveData).then(res => {
            if (res.status === 200) {
              this.$notify({ type: 'success', message: '存档成功' })
              this.handleSearch()
            } else {
              this.$notify({ type: 'warning', message: res.message })
            }
          })
        })
        .catch(() => {})
    },
    // 提交审核
    submitAudit(item) {
      this.$dialog
        .confirm({ title: '提示', message: '确定提交审核吗?' })
        .then(() => {
          this.archiveData.registId = item.id
          this.$api.service.submitAudit(this.archiveData).then(res => {
            if (res.status === 200) {
              this.$notify({ type: 'success', message: '提交审核成功' })
              this.handleSearch()
            } else {
              this.$notify({ type: 'warning', message: res.message })
            }
          })
        })
        .catch(() => {})
    },
    showWithdrawAudit(item) {
      if (
        item.submitBy === this._permission().user.id &&
        item.status === '21'
      ) {
        return true
      }
      return false
    },
    getReportClass(item) {
      if (item.isReport === '2') {
        return 'color: red;'
      } else if (item.isReport === '1') {
        return 'color: #5e74fe;'
      } else {
        return ' color:#FF6803;'
      }
    },
    getReportDesc(item) {
      if (item.isReport === '2') {
        return '上报失败'
      } else if (item.isReport === '1') {
        return '上报成功'
      } else {
        return '待上报'
      }
    },
    getComeTypeClass(item) {
      if (item.comeType === '1') {
        return 'comType120'
      } else if (item.comeType === '2') {
        return 'comTypeTransfer'
      } else if (item.comeType === '3') {
        return 'comTypeSelf'
      } else if (item.comeType === '4') {
        return 'comTypeHospital'
      } else {
        return 'comTypeSelf'
      }
    },
    getStatusDesc(item) {
      if (item.status === '10') {
        return '填报中'
      } else if (item.status === '12') {
        return '审核拒绝'
      } else if (item.status === '13') {
        return '存档拒绝'
      } else if (item.status === '21') {
        return '待审核'
      } else if (item.status === '31') {
        return '待存档'
      } else if (item.status === '41') {
        return '已存档'
      } else {
        return ''
      }
    },
    jump(path, item) {
      this.$router.push({
        path,
        query: {
          registId: item.id,
          status: item.status,
          type: this.quertList.type,
          isLock: item.isLock
        }
      })
    },
    handleScroll(e) {
      const {
        target: { offsetHeight, scrollTop, scrollHeight }
      } = e
      const atBottom = scrollHeight - offsetHeight - scrollTop <= 5
      const atTop = scrollTop === 0
      if (atTop) {
        this.pullDisabled = false
      } else {
        this.pullDisabled = true
      }
      const loadedAll = this.pagination.current >= this.pagination.pages
      if (atBottom && !loadedAll && !this.loading) {
        this.handleSearch((this.pagination?.current || 0) + 1)
      }
    },
    async handleSearch(page) {
      try {
         // 依据有无page判断是否滚动加载
        const newQuery = {
          ...this.query,
          type: this.quertList.type,
          status: this.quertList.status,
          pageIndex: page || 1,
          pageSize: this.pagination.pageSize
        }
        this.lastQuery = { ...this.query }
        this.loading = true
        this.searchPageVisible = false
        const response = await this.$api.service.getRegistPage({
          ...this.quertList,
          ...newQuery
        })
        if (response.status === 200) {
          this.pagination = {
            current: response.result?.current,
            pageSize: response.result?.size,
            pages: response.result?.pages
          }
          // 滚动加载在尾部追加

          this.list = page ? this.list.concat(response.result.records) : response.result.records
          // 非滚动加载自动将列表滚回顶部
          if (!page && this.$refs.scrollBox) {
            this.$refs.scrollBox.scrollTop = 0
          }
        } else {
          throw new Error(response.message || '请求错误')
        }
      } catch (err) {
        this.$notify(err.message)
      }
       // 避免误触滚动事件
      setTimeout(() => {
        this.loading = false
      }, 200)
    },
    isLockClass(lock) {
      let className = 'locker'
      switch (lock) {
        case '1':
          className += ` iconlock-122 iconfont`
          break
        default:
          break
      }
      return className
    },
    deletePatient(item) {
      Dialog.confirm({
        title: '提示',
        message: `确定要删除患者【${item.name}】`
      })
        .then(() => {
          this.$api.service
            .deletePatient(item.id)
            .then(() => {
              this.$notify({
                type: 'success',
                message: `患者【${item.name}】已删除`
              })
              this.handleSearch()
            })
            .catch(() => {
              this.$notify({
                type: 'warning',
                message: `患者【${item.name}】删除失败`
              })
              this.handleSearch()
            })
        })
        .catch(() => {})
    },
    // 跳转时间管理页面
    TimeManagement(item) {
      this.$router.push({
        path: '/detail/TimeCollection',
        query: { registId: item.registId }
      })
    },
    onQuery(status) {
      this.quertList.type = status
      if (status === '1') {
        this.quertList.status = ['10', '12', '13']
      } else if (status === '2') {
        this.quertList.status = ['41']
      } else if (status === '3') {
        this.quertList.status = ['21']
      } else if (status === '4') {
        this.quertList.status = ['31']
      } else if (status === '0') {
        this.quertList.status = ['10', '12', '13', '41', '21', '31']
      }
      this.handleSearch()
    },
    getDisplayNo(item) {
      const displayNo = { name: '门诊号', value: '- -' }
      if (item.outPatientNo && item.outPatientNo !== '') {
        displayNo.value = item.outPatientNo
      } else if (item.admissionNo && item.admissionNo !== '') {
        displayNo.name = '住院号'
        displayNo.value = item.admissionNo
      }
      return displayNo
    },
    getWristbindNo(item) {
      if (item.rfTagId && item.rfTagId !== '') {
        return item.rfTagId
      }
      return '- -'
    },
    withdrawAudit(item) {
      this.$dialog
        .confirm({ title: '提示', message: '确定撤销提交吗?' })
        .then(() => {
          this.archiveData.registId = item.id
          this.$api.service.withdrawAudit(this.archiveData).then(res => {
            if (res.status === 200) {
              this.$notify({ type: 'success', message: '撤销成功' })
              this.handleSearch()
            } else {
              this.$notify({ type: 'warning', message: res.message })
            }
          })
        })
        .catch(() => {})
    },
    async showReviewedHistory(selectedItem) {
      const { result } =
        (await this.$api.service.getReviewHistory({
          registid: selectedItem.id
        })) || []
      // result.reverse()
      this.historyList = result
      if (this.historyList && this.historyList.length > 0) {
        this.historyActivity = this.historyList.length - 1
      }
      this.showHistory = true
    },
    toPreview(item) {
      this.$router.push({
        path: '/patient/document/overview',
        query: {
          registId: item.id,
          type: this.quertList.type,
          infoComingType: item.infoComingType,
          emId: item.emId
        }
      })
    },
    toEcg(item) {
      this.$router.push({
        path: '/patient/document/ecg/view',
        query: {
          registId: item.id,
          readonly: true,
          status: item.status,
          type: this.quertList.type,
          isLock: item.isLock
        }
      })
    },
    toTimelineManagement(item) {
      this.$router.push({
        path: '/patient/detail/timeManagement',
        query: {
          registId: item.id,
          type: this.quertList.type,
          infoComingType: item.infoComingType,
          emId: item.emId
        }
      })
    },
    checkNeedShowIcon(item) {
      const end = moment(new Date()).format('YYYY-MM-DD')
      const start = moment(item.fmcTime).format('YYYY-MM-DD')
      const days = moment(end).diff(start, 'days')
      // 1.即将超期建档：当前时间-首次医疗接触时间范围在【7，14】之间
      // 且首次成功上报时间为空的病历
      if (days >= 7 && days <= 14 && !item.firstReportTime) {
        return 1
      }

      // 2.超期未建档：(当前时间-首次医疗接触时间)大于14天且首次成功上报时间为空的病历
      if (days > 14 && !item.firstReportTime) {
        return 2
      }

      // 3.即将超期归档：当前时间-首次医疗接触时间【50，60)天范围内
      // 且首次成功上报时间不为空的病历
      if (days >= 50 && days < 60 && item.firstReportTime && item.status !== '41') {
        return 3
      }

      // 4.超期未归档：当前时间-首次医疗接触时间大于等于60天范围
      // 且首次成功上报时间不为空的病历
      if (days >= 60 && item.firstReportTime && item.status !== '41') {
        return 4
      }

      return 0
    },
    getIconClassName(item) {
      let className = 'locker iconfont '
      const flag = this.checkNeedShowIcon(item)
      const classArray = ['iconlvtong-106', 'iconlvtong-105', 'iconlvtong-107', 'iconlock-122']
      if (flag > 0) {
        className += classArray[flag - 1]
      }
      return className
    },
    iclick(item) {
      const flag = this.checkNeedShowIcon(item)
      const messageArray = [
        '首次医疗接触即将超过14天，请及时上报',
        '首次医疗接触超过14天，不可上报',
        '病历即将超过60天存档期限，请及时存档',
        '病历超过60天未存档已被锁定，不可修改'
      ]
      if (flag > 0) {
        Dialog.alert({
          title: '提示',
          message: messageArray[flag - 1],
          messageAlign: 'left'
        }).then(() => {
        })
      }
    }
  },
  watch: {}
}
</script>

<style lang="less" scoped>
@import '../index.less';
.van-swipe-cell {
  border-radius: 20px;
  -moz-box-shadow: 0px 3px 10px #a6a6a6;
  -webkit-box-shadow: 0px 3px 10px #a6a6a6;
  box-shadow: 0px 3px 10px #a6a6a6;
  .swipe-button {
    height: 100%;
    margin: 0 !important;
  }
  /deep/.van-swipe-cell__wrapper {
    padding: 1px 0px;
  }
  /deep/.van-swipe-cell__right {
    right: -1px;
  }
}
.top {
  .locker {
    font-size: 32px;
    font-weight: bold;
    flex-grow: 1;
    text-align: right;
  }
  .iconlvtong-105 {
    color: #F0752A !important;
  }
  .iconlvtong-106 {
    color: #D81E06 !important;
  }
  .iconlvtong-107 {
    color: #D81E06 !important;
  }
  .iconlock-122 {
    color: #F0752A !important;
  }
}
.header-main {
  flex-grow: 1;
  display: flex;
  align-items: center;
  .name {
    max-width: 120px;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
    overflow: hidden;
  }
}
.header-report-desc {
  display: flex;
  align-items: center;
  padding: 0 12px;
  justify-content: center;
  .van-icon {
    margin-left:10px;
    font-size: 36px;
  }
}

.memo-row {
  .memo-row-col {
    display: inline-block;
    min-width: 220px;
  }
}

.comType120 {
  background: #f86359;
}

.comTypeSelf {
  background: #52b029;
}

.comTypeHospital {
  background: #fa9723;
}

.comTypeTransfer {
  background: #5e74fd;
}

.bottom-status {
  justify-content: space-between;

  & > span {
    font-size: 0.4rem;
    font-weight: bold;
    margin-left: 10px;
  }
}

.review-title {
  font-size: 40px;
  margin: 20px 20px;
  font-weight: 600;
}

.review-comment {
  max-width: 500px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 20px 8px;
}

.flow-log-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  .flow-log-main {
    width: 100%;
    padding: 32px;
    height: calc(100vh - 210px);
    overflow-y: auto;
    align-self: flex-start;
  }
  // .van-steps {
  //   width: 100%;
  // }
  /deep/ .van-step {
    .van-step__circle {
      width: 20px;
      height: 20px;
    }
    .van-step__line {
      left: -32px;
    }
  }
  .van-empty {
    height: 100%;
  }
  h3 {
    font-size: 28px;
  }
  .flow-log-row {
    font-size: 28px;
    padding: 16px 8px 0 8px;
    div {
      display: inline-block;
      width: 150px;
    }
  }
}
</style>
