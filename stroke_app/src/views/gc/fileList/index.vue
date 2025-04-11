<template>
  <div>
    <div class="med-list-card">
      <med-view-container @return="back" return-label="">
        <template #title>
          <div class="med-header-title-slot">
            <div>
              卒中档案
            </div>
            <med-select
              :options="hospitalArea"
              :value="curHospitalArea"
              @change="handleHospitalAreaChange"
              :readonly="hospitalArea.length <= 1"
              :showArrow="hospitalArea.length > 1"
            />
          </div>
        </template>
        <!-- <template #right>
          <i class="iconfont iconicon1-13" @click="handleScan" />
        </template> -->
        <template #bottom-part>
          <van-tabbar :value="tabActive">
            <van-tabbar-item
              name="strokeGcList"
              icon="home-o"
              @click="jump('/gc/fileList')"
            >
              <template #icon="props">
                <med-svg icon-class="iconlvtong-bingli" />
              </template>
              档案
            </van-tabbar-item>
            <van-tabbar-item
              name="preHospitalPush"
              icon="search"
              v-if="$entitled('list-transfer')"
              @click="jump('/gc/preHospitalPush')"
            >
              <template #icon="props">
                <med-svg icon-class="iconlvtong-tuisong" />
              </template>
              推送
            </van-tabbar-item>
          </van-tabbar>
        </template>
        <div class="scroll-view">
          <van-tabs
            v-model="active"
            sticky
            color="#5e74fe"
            @change="handleSwitch"
          >
            <template #nav-right>
              <div class="flex-c-c">
                <!-- <van-button size="mini" style="border:none" @click="showPopup">
                  <van-icon name="search" />
                </van-button> -->
                <van-button
                  icon="filter-o"
                  size="mini"
                  style="border:none"
                  :color="filterColor"
                  plain
                  @click="showPopup"
                >
                  筛选
                </van-button>
              </div>
            </template>
            <van-tab
              v-for="(item, index) in tabList"
              :title="item.name"
              :key="item.key"
            >
              <list
                v-if="active === index"
                :query="medswmgc"
                :status="item.status"
              />
              <!-- <component
                :ref="item.key"
                v-show="active === index"
                :is="item.part"
                :query="medswmgc"
              /> -->
            </van-tab>
          </van-tabs>
        </div>
      </med-view-container>
      <med-popup-container
        v-model="show"
        class="filelist-pop-right"
        title="病历检索"
        returnLabel=""
        @return="onSearchReturn"
      >
        <van-search
          class="firstaid-list-wrapper-search flex-c-c"
          v-model="query.text"
          shape="round"
          background="transparent"
          placeholder="姓名/门诊号/住院号"
          left-icon="search"
        />
        <med-collapsible-cell title="建档时间">
          <div class="condition-item">
            <med-radio-group
              v-model="quickTimeValue"
              :dataSource="quickTimeOptions"
              @input="onQuickTimeChange"
            />
            <van-row
              gutter="24"
              style="display:flex; align-items: center;"
              v-if="quickTimeValue === '~'"
            >
              <van-col span="11">
                <med-date-picker
                  v-model="startTime"
                  label
                  displayFormatter="YYYY-MM-DD"
                  formatter="YYYY-MM-DD"
                  placeholder="开始时间"
                />
              </van-col>
              <van-col span="2">
                <span> ~ </span>
              </van-col>
              <van-col span="11">
                <med-date-picker
                  v-model="endTime"
                  label
                  displayFormatter="YYYY-MM-DD"
                  formatter="YYYY-MM-DD"
                  placeholder="结束时间"
                />
              </van-col>
            </van-row>
          </div>
        </med-collapsible-cell>
        <med-collapsible-cell title="来院方式">
          <div class="condition-item">
            <van-checkbox-group
              v-model="query.visitList"
              direction="horizontal"
            >
              <van-checkbox
                v-for="item in dicData.comingTypeOpts"
                :key="item.value"
                :name="item.value"
                >{{ item.label }}</van-checkbox
              >
            </van-checkbox-group>
          </div>
          <!-- <div class="condition-item">
            <med-checkbox
              v-model="query.visitList"
              :options="dicData.comingTypeOpts"
            />
          </div> -->
        </med-collapsible-cell>
        <med-collapsible-cell title="诊断">
          <div class="condition-item">
            <!-- <med-checkbox
              v-model="query.diagnosisList"
              :options="dicData.diagOpts"
            /> -->
            <van-checkbox-group
              v-model="query.diagnosisList"
              direction="horizontal"
            >
              <van-checkbox
                v-for="item in dicData.diagOpts"
                :key="item.value"
                :name="item.value"
              >
                {{ item.label }}
              </van-checkbox>
            </van-checkbox-group>
          </div>
        </med-collapsible-cell>
        <med-collapsible-cell title="上报状态">
          <div class="condition-item">
            <med-radio-group
              v-model="query.reportStatus"
              :dataSource="reportStatusList"
            />
          </div>
        </med-collapsible-cell>
        <med-collapsible-cell title="拒绝状态">
          <div class="condition-item">
            <med-radio-group v-model="query.reject" :dataSource="rejectList" />
          </div>
        </med-collapsible-cell>
        <template #bottom-part>
          <div class="bottom-button">
            <van-button plain color="#2b65f8" @click="onReset" size="small">
              重置
            </van-button>
            <van-button color="#2b65f8" @click="ConfirmOrCancel" size="small">
              确定
            </van-button>
          </div>
        </template>
      </med-popup-container>
      <van-button
        class="filelist-add-btn"
        v-if="active === 0 && $entitled('mr-add')"
        type="primary"
        round
        @click="goPatientList"
      >
        <i class="iconfont iconicon1-441" />
      </van-button>
    </div>
  </div>
</template>

<script>
import { GoodsAction, GoodsActionButton } from 'vant'
import { mapGetters, mapMutations } from 'vuex'
import * as types from '@/store/mutations/mutations-types'
import dictionariesMixin from '@mixins/dictionariesMixin'
import scannerMixin from '@mixins/scannerMixin'
import moment from 'moment'
import list from './list'

export default {
  name: 'gcList',
  components: { list, GoodsAction, GoodsActionButton },
  mixins: [dictionariesMixin, scannerMixin],
  data() {
    return {
      quickTimeValue: '',
      tabActive: 'strokeGcList',
      active: 0,
      show: false,
      diagnosisOne: '',
      reportStatusList: [
        {
          label: '未上报',
          value: '0'
        },
        {
          label: '待上报',
          value: '1'
        },
        {
          label: '上报成功',
          value: '2'
        },
        {
          label: '上报失败',
          value: '3'
        }
      ],
      rejectList: [
        {
          label: '审核拒绝',
          value: '1'
        },
        {
          label: '存档拒绝',
          value: '2'
        }
      ],
      query: this.defaultFormValues(),
      medswmgc: this.defaultFormValues(),
      tabList: [
        { name: '全部', key: 'All' },
        { name: '填报中', key: 'Filling', status: '0' },
        { name: '待审核', key: 'NoReviewed', status: '1' },
        { name: '待存档', key: 'NoArchived', status: '2' },
        { name: '已存档', key: 'Archived', status: '3' }
      ],
      campus: [] // 院区
    }
  },
  // 钩子方法
  created() {
    this.init()
  },
  mounted() {
    this.$backhelper.push(() => {
      this.back()
    })
  },
  computed: {
    ...mapGetters(['hospitalId', 'hospitalArea', 'curHospitalArea', 'dicData']),
    quickTimeOptions() {
      const formatStr = 'YYYY-MM-DD HH:mm:[00]'
      const genRange = (num = 0, unit = 'd') => {
        return `${moment()
          .endOf('day')
          .subtract(num, unit)
          .format(formatStr)}~${moment()
          .endOf('day')
          .format(formatStr)}`
      }
      return [
        {
          label: '一天',
          value: genRange(1)
        },
        {
          label: '三天',
          value: genRange(3)
        },
        {
          label: '一周',
          value: genRange(7)
        },
        {
          label: '一个月',
          value: genRange(1, 'M')
        },
        {
          label: '自定义',
          value: '~'
        }
      ]
    },
    filterColor() {
      let color = '#aaa'
      if (
        this.medswmgc.text ||
        this.medswmgc.visitList?.lengt ||
        this.medswmgc.createTimeFrom ||
        this.medswmgc.createTimeTo ||
        this.medswmgc.diagnosisList?.length ||
        this.medswmgc.reportStatus ||
        this.medswmgc.reject
      ) {
        color = 'orange'
      }
      return color
    },

    curHospitalAreaName() {
      const matched = this.hospitalArea.find(
        el => el.value === this.curHospitalArea
      )
      return matched?.label
    },
    startTime: {
      get() {
        return this.query.createTimeFrom
          ? moment(this.query.createTimeFrom).format('YYYY-MM-DD')
          : ''
      },
      set(v) {
        this.query.createTimeFrom = v
          ? moment(v)
              .startOf('day')
              .format('YYYY-MM-DD HH:mm:[00]')
          : ''
      }
    },
    endTime: {
      get() {
        return this.query.createTimeTo
          ? moment(this.query.createTimeTo).format('YYYY-MM-DD')
          : ''
      },
      set(v) {
        this.query.createTimeTo = v
          ? moment(v)
              .endOf('day')
              .format('YYYY-MM-DD HH:mm:[00]')
          : ''
      }
    }
  },

  methods: {
    ...mapMutations([
      types.SET_CURHOSPITALAREA,
      types.SET_PATIENT_INFO,
      types.SET_SHARED_DATA
    ]),
    defaultFormValues() {
      return {
        // 腕带号
        rfTagId: '',
        text: '',
        // 建档时间From
        createTimeFrom: '',
        // 建档时间To
        createTimeTo: '',
        diagnosisList: [], // 诊断列表
        // 医院ID
        hospitalId: this.hospitalId,
        // 院区
        hospitalArea: this.curHospitalArea,
        // 来院列表
        visitList: []
      }
    },
    init() {
      this.medswmgc.visitList = []
      this.medswmgc.diagnosisList = []
      this.medswmgc.hospitalAreaList = []
      this.medswmgc.hospitalId = this.hospitalId
    },
    onReset() {
      this.quickTimeValue = ''
      // this.medswmgc = { ...this.defaultFormValues() }
      this.query = { ...this.defaultFormValues() }
    },
    onQuickTimeChange(v) {
      const [from, to] = (v || '~').split('~')
      this.$set(this.query, 'createTimeFrom', from)
      this.$set(this.query, 'createTimeTo', to)
    },
    goPatientList() {
      this.$router.push({
        path: '/gc/patientList'
      })
    },
    showPopup() {
      this.show = true
    },
    handleHospitalAreaChange(val) {
      this[types.SET_CURHOSPITALAREA](val)
    },
    handleSwitch(key) {
      // 切换tab 清除是否上报成功
      this.medswmgc.reportStatus = ''
    },
    // 查询返回按钮点击, 恢复修改前的值
    onSearchReturn() {
      if (this.medswmgc.createTimeFrom && this.medswmgc.createTimeTo) {
        this.quickTimeValue =
          this.medswmgc.createTimeFrom + '~' + this.medswmgc.createTimeTo
        if (
          !this.quickTimeOptions.some(el => el.value === this.quickTimeValue)
        ) {
          this.quickTimeValue = '~'
        }
      } else {
        this.quickTimeValue = ''
      }

      this.query = { ...this.medswmgc }
      this.show = false
    },
    ConfirmOrCancel() {
      this.medswmgc = { ...this.query }
      this.medswmgc.rfTagId = ''
      this.show = false
    },
    handleScan() {
      this.$bridge.callhandler('scanner', { type: ['1'] }, data => {
        const code = this.parseScanQrOrBar(data)
        // this.$toast(`返回数据:${data}`)
        if (code === '') {
          return
        }
        this.queryByRfTagId(code)
      })
    },
    queryByRfTagId(rfTagId) {
      this.medswmgc = {
        rfTagId,
        text: '',
        diagnosisList: [], // 诊断列表
        hospitalAreaList: [], // 院区
        visitList: [] // 来院列表
      }
    },
    // 返回上级页面
    back() {
      this.$dialog
        .confirm({
          title: '提示',
          message: '确定要退出卒中工作站?',
          confirmButtonColor: '#5e74fe'
        })
        .then(() => {
          // 确定
          this.$bridge.callhandler('finishPager', {}, async data => {})
        })
        .catch(() => {
          this.$backhelper.push(() => {
            this.back()
          })
        })
    },
    jump(path) {
      if (path === this.$route.path) return
      this.$router.push({
        path
      })
    }
  },
  watch: {
    curHospitalArea: {
      immediate: true,
      handler(val) {
        this.$set(this.medswmgc, 'hospitalArea', val)
        this.$set(this.query, 'hospitalArea', val)
      }
    },
    hospitalArea: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val?.length && !this.curHospitalArea) {
          this[types.SET_CURHOSPITALAREA](val[0]?.sign)
        }
      }
    },
    'medswmgc.hospitalArea': {
      immediate: true,
      handler(val) {
        if (val) {
          this.medswmgc = { ...this.medswmgc }
          this.query = { ...this.medswmgc }
        }
      }
    },
    '$route.path'(v) {
      // 每次回到此页面就触发刷新
      if (v === '/gc/fileList') {
        this.medswmgc = { ...this.medswmgc }
        // 回到列表清空患者信息
        this[types.SET_PATIENT_INFO]({})
        // 清空共享数据
        this[types.SET_SHARED_DATA]({})
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
