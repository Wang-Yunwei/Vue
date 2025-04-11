<template>
  <div class="med-list-card">
    <van-pull-refresh
      :disabled="pullDisabled"
      v-model="loading"
      @refresh="handleSearch"
    >
      <div class="main-list" ref="scrollBox" @scroll.stop="handleScroll">
        <van-empty
          :image="require('@assets/image/empty.png')"
          description="暂无数据"
          v-if="!list || !list.length"
        />
        <div
          class="card-item-wrapper"
          v-for="item in list"
          :key="item.value"
          :title="item.name"
          :name="item.value"
        >
          <van-swipe-cell>
            <div class="card-tem" @click="toDetailEdit(item)">
              <div class="top flex-c-s">
                <span :style="{ background: parseColor(item.comingType) }">
                  {{ eqArrayCode("comingTypeShortOpts", item.comingType) }}
                </span>
                <span>建档时间：{{ item.createTime }}</span>
              </div>
              <div class="center">
                <div>
                  <div class="flex-c-b">
                    <div class="flex-c-b">
                      <span class="name" v-show="item.name">{{
                        item.name
                      }}</span>
                      <span v-show="item.gender">
                        {{ eqArrayCode("genderOpts", item.gender) }}
                      </span>
                      <span v-show="item.age">{{ item.age }}岁</span>
                      <span v-show="item.diag">
                        {{ eqArrayCode("diagOpts", item.diag) }}
                      </span>
                    </div>
                    <div
                      v-if="item.status === emrStatus.archived"
                      class="report-status"
                      :style="{ color: reportStatusColor(item.reportStatus) }"
                    >
                      {{ parseReportStatus(item.reportStatus) }}
                    </div>
                  </div>
                  <van-row class="second-row">
                    <van-col span="10">门诊号：{{ item.outPatientNo }}</van-col>
                    <van-col>腕带号：{{ item.rfTagId }} </van-col>
                  </van-row>
                </div>
              </div>
              <div class="bottom flex-c-b">
                <div :style="status ? 'opacity: 0' : ''">
                  <div class="fill-status" v-if="item.reject">
                    {{ parseReject(item.reject) }}
                  </div>
                  <div class="fill-status" v-else>
                    {{ parseStatus(item.status) }}
                  </div>
                </div>
                <div class="btns">
                  <van-button
                    v-if="item.emId"
                    round
                    @click.stop="toPreview(item)"
                  >
                    调阅
                  </van-button>
                  <van-button round @click.stop="toEcg(item)">
                    心电图
                  </van-button>
                  <van-button
                    v-if="item.status === emrStatus.filling"
                    round
                    @click.stop="toTimeManagement(item)"
                  >
                    时间管理
                  </van-button>
                </div>
              </div>
            </div>
            <template #right v-if="item.status === emrStatus.filling">
              <van-button
                class="swipe-button"
                type="danger"
                text="删除"
                :disabled="!$entitled('mr-delete')"
                @click="deletePatient(item)"
              />
            </template>
          </van-swipe-cell>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { emrStatus, reportStatus, rejectType } from '@constant/commonConstant'

export default {
  name: 'List',
  props: ['query', 'status'],
  data() {
    return {
      id: '',
      comingType: '',
      list: [],
      emrStatus,
      rejectType,
      medswmgc: {
        diagnosisList: [], // 诊断列表 this.$route.query.medswmgc.diagnosisList
        visitList: [] // 来院列表 this.$route.query.medswmgc.visitList
      },
      toast: null,
      loading: false,
      searchPageVisible: false,
      pullDisabled: false,
      pagination: {
        current: 1,
        pageSize: 5,
        pages: 1
      }
    }
  },
  async created() {
    if (this.query.hospitalArea) {
      await this.handleSearch()
    }
  },
  computed: {
    ...mapGetters(['hospitalArea', 'dicData'])
  },
  watch: {
    query: {
      deep: true,
      handler() {
        if (this.query.hospitalArea) {
          this.handleSearch()
        }
      }
    },
    '$route.path': {
      handler(v) {
        // 修复从详情页返回时不能再次下拉刷新
        if (v === '/gc/fileList') {
          this.pullDisabled = false
        }
      }
    }
  },
  methods: {
    // 上报状态颜色
    reportStatusColor(status) {
      switch (status) {
        case reportStatus.notReported:
          return '#FF6803' // 橙
        case reportStatus.reported:
          return '#5e74fe' // 蓝
        case reportStatus.success:
          return '#52b029' // 绿
        case reportStatus.failed:
          return '##52b029' // 红
      }
    },
    // 上报状态文字
    parseReportStatus(status) {
      switch (status) {
        case reportStatus.notReported:
          return '未上报'
        case reportStatus.reported:
          return '待上报'
        case reportStatus.success:
          return '上报成功'
        case reportStatus.failed:
          return '上报失败'
      }
    },
    // 病历填报状态
    parseStatus(status) {
      switch (status) {
        case emrStatus.filling:
          return '填报中'
        case emrStatus.waitingForApproval:
          return '待审核'
        case emrStatus.waitingForArchive:
          return '待存档'
        case emrStatus.archived:
          return '已存档'
      }
    },
    // 驳回状态
    parseReject(status) {
      switch (status) {
        case rejectType.approvalReject:
          return '审核拒绝'
        case rejectType.archiveReject:
          return '存档拒绝'
      }
    },

    async handleSearch(page) {
      const newQuery = {
        ...this.query,
        status: this.status,
        current: page || 1,
        pageSize: this.pagination.pageSize
      }
      this.loading = true
      this.searchPageVisible = false
      let newList = []

      // 避免后台报错导致一直转
      try {
        newList = await this.getBasicInformationPage(newQuery)
      } catch (err) {}

      // 滚动加载在尾部追加
      this.list = page ? this.list.concat(newList) : newList

      // 非滚动加载自动将列表滚回顶部
      if (!page && this.$refs.scrollBox) {
        this.$refs.scrollBox.scrollTop = 0
      }
      // 避免误触滚动事件
      setTimeout(() => {
        this.loading = false
      }, 200)

      return this.list
    },
    async onQuery(isScan) {
      const list = await this.handleSearch()
      if (isScan && list?.length === 1) {
        await this.$router.push({
          path: '/gc/detail',
          query: { registId: this.list[0].registId }
        })
      }
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
    // 病历编辑
    toDetailEdit(item) {
      this.$router.push({
        path: '/gc/detail',
        query: {
          registId: item.registId,
          regNo: item.regNo,
          infoComingType: item.infoComingType,
          emId: item.emId
        }
      })
    },
    // 预览
    toPreview(item) {
      this.$router.push({
        path: '/gc/preview',
        query: {
          registId: item.registId,
          regNo: item.regNo,
          infoComingType: item.infoComingType,
          emId: item.emId,
          viewMode: true
        }
      })
    },
    // 时间管理
    toTimeManagement(item) {
      const path = `/gc/timeManagement/${this.$entitled('mr-add') ? '' : 'timeline'}`
      this.$router.push({
        path,
        query: {
          registId: item.registId,
          regNo: item.regNo,
          infoComingType: item.infoComingType,
          emId: item.emId
        }
      })
    },
    toEcg(item) {
      this.$router.push({
        path: '/gc/electrocardiogram',
        query: {
          registId: item.registId,
          readonly: true
        }
      })
    },
    async getBasicInformationPage(params) {
      const response = await this.$api.filing.getBasicInformationPage({
        ...this.medswmgc,
        ...params
      })
      if (response.status === 200) {
        this.pagination = {
          current: response.result?.current,
          pageSize: response.result?.size,
          pages: response.result?.pages
        }
        return response.result?.records || []
      } else {
        return undefined
      }
    },
    eqArrayCode(arrayName, val) {
      const codename = this.dicData[arrayName]?.find(item => {
        return item.value === val
      })
      if (codename) {
        return codename.label
      } else {
        return ''
      }
    },
    /**
     * 来院方式的颜色
     * @param type
     * @returns {string}
     */
    parseColor(type) {
      switch (type) {
        case '1':
          return '#F86359'
        case '2':
          return '#52b029'
        case '3':
          return '#5E74FD'
        case '4':
          return '#FA9723'
        case '5':
          return '#7210b2'
        default:
          return '#0d6a86'
      }
    },
    /**
     * 删除患者病历
     * @param item 选中的病历
     */
    deletePatient(item) {
      this.$dialog
        .confirm({
          title: '提示',
          message: `确定要删除患者【${item.name || ''}】?`,
          confirmButtonColor: '#5e74fe'
        })
        .then(() => {
          this.$api.basicInfo
            .deletePatient(item.id)
            .then(({ result }) => {
              this.$toast(`患者【${item.name}】已删除`)
              this.handleSearch()
            })
            .catch(() => {
              this.$toast(`患者【${item.name}】删除失败`)
            })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.fill-status {
  font-size: 0.4rem;
  font-weight: bold;
}
/deep/ .van-swipe-cell {
  border-radius: 20px;
  box-shadow: 0px 3px 10px #a6a6a6;
  button.swipe-button {
    height: 100%;
    margin: 0 0.1rem;
    border-radius: 0.2rem;
  }
  /deep/.van-swipe-cell__wrapper {
    padding: 1px 0px;
  }
}
.report-status {
  font-size: 0.4rem;
  white-space: nowrap;
}
</style>
