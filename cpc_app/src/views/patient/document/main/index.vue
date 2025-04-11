<template>
  <div>
    <div>
      <div class="scroll-view">
        <van-tabs
          v-model="active"
          sticky
          color="#5e74fe"
          @change="ConfirmOrCancel"
        >
          <template #nav-right>
            <div class="flex-c-c">
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
          <van-tab title="全部" name="0"></van-tab>
          <van-tab title="填报中" name="1"></van-tab>
          <van-tab title="待审核" name="3"></van-tab>
          <van-tab title="待存档" name="4"></van-tab>
          <van-tab title="已存档" name="2"></van-tab>
          <patientIndex
            ref="NoFiling"
            :query="queryCpcList"
            :show-status="active == '0'"
          />
        </van-tabs>
      </div>
      <med-draggable-button
        @click="goPatientList"
        class="button-add"
        v-if="_resources.mrAdd() && (active === '1' || active === '0')"
      >
        <i class="iconfont iconicon1-441" />
      </med-draggable-button>
    </div>
    <med-popup-container
      v-model="show"
      title="病历检索"
      position="right"
      class="filelist-pop-right search-container"
      @return="onSearchReturn"
      scroll
    >
      <div class="name-search-item">
        <van-search
          show-action
          v-model="queryCpcList.name"
          placeholder="姓名/门诊号/住院号"
          shape="round"
        >
          <template #action>
            <div class="advance-action" @click="adanceClick">
              <span>高级查询</span>
              <van-icon
                name="arrow-up"
                class="van-cell__right-icon"
                v-if="queryCpcList.showAdvcanse"
              />
              <van-icon name="arrow-down" class="van-cell__right-icon" v-else />
            </div>
          </template>
        </van-search>
      </div>

      <med-collapsible-cell title="建档时间">
        <div class="condition-item">
          <med-radio-button-field
            v-model="queryCpcList.dateRangeValue"
            label
            :select-options="dateRange"
            @change="onDateRangeChange"
          ></med-radio-button-field>
          <van-row
            gutter="24"
            style="display:flex; align-items: center;"
            v-if="queryCpcList.dateRangeValue == '5'"
          >
            <van-col span="11" style="padding-right: 0;">
              <med-date-picker
                v-model="queryCpcList.startTime"
                label
                placeholder="开始时间"
                formatter="YYYY-MM-DD"
              />
            </van-col>
            <van-col span="2">~</van-col>
            <van-col span="11" style="padding-left: 0;">
              <med-date-picker
                v-model="queryCpcList.endTime"
                label
                placeholder="结束时间"
                formatter="YYYY-MM-DD"
              />
            </van-col>
          </van-row>
        </div>
      </med-collapsible-cell>
      <med-collapsible-cell title="来院方式">
        <div class="condition-item">
          <van-checkbox-group
            v-model="queryCpcList.comeType"
            direction="horizontal"
          >
            <van-checkbox
              v-for="item in comingTypeDesc()"
              :key="item.value"
              :name="item.value"
              >{{ item.label }}</van-checkbox
            >
          </van-checkbox-group>
        </div>
      </med-collapsible-cell>
      <med-collapsible-cell title="初步诊断">
        <div class="condition-item">
          <van-checkbox-group
            v-model="queryCpcList.preDiagnosis"
            direction="horizontal"
          >
            <van-checkbox
              v-for="item in diagnosisList"
              :key="item.value"
              :name="item.value"
              >{{ item.label }}</van-checkbox
            >
          </van-checkbox-group>
        </div>
      </med-collapsible-cell>
      <med-collapsible-cell title="上报状态">
      <div class="condition-item">
          <van-checkbox-group
            v-model="queryCpcList.reportStatus"
            direction="horizontal"
          >
            <van-checkbox
              v-for="item in reportStatusList"
              :key="item.value"
              :name="item.value"
              >{{ item.label }}</van-checkbox
            >
          </van-checkbox-group>
      </div>
      </med-collapsible-cell>
      <med-collapsible-cell title="拒绝状态">
      <div class="condition-item">
        <med-radio-group v-model="queryCpcList.reject" :dataSource="rejectList" />
      </div>
      </med-collapsible-cell>
      <div v-if="queryCpcList.showAdvcanse === 1">
        <med-collapsible-cell title="出车单位">
          <div class="condition-item">
            <van-checkbox-group
              v-model="queryCpcList.ambulanceDepartment"
              direction="horizontal"
            >
              <van-checkbox
                v-for="item in ambulanceDepartmentDic"
                :key="item.value"
                :name="item.value"
                >{{ item.label }}</van-checkbox
              >
            </van-checkbox-group>
          </div>
        </med-collapsible-cell>

        <med-collapsible-cell title="出院诊断">
          <div class="condition-item">
            <van-checkbox-group
              v-model="queryCpcList.leaveDiagnosis"
              direction="horizontal"
            >
              <van-checkbox
                v-for="item in diagnosisList"
                :key="item.value"
                :name="item.value"
                >{{ item.label }}</van-checkbox
              >
            </van-checkbox-group>
          </div>
        </med-collapsible-cell>

        <med-collapsible-cell title="患者转归">
          <div class="condition-item">
            <van-checkbox-group
              v-model="queryCpcList.outcomeCode"
              direction="horizontal"
            >
              <van-checkbox
                v-for="item in strOutcomeCodeDic"
                :key="item.value"
                :name="item.value"
                >{{ item.label }}</van-checkbox
              >
            </van-checkbox-group>
          </div>
        </med-collapsible-cell>

        <med-collapsible-cell title="是否溶栓" v-if="false">
          <div class="condition-item">
            <med-radio-button-field
              v-model="queryCpcList.isHaveRs"
              label
              :select-options="yesOrNoDic"
            ></med-radio-button-field>
          </div>
        </med-collapsible-cell>
        <med-collapsible-cell
          title="溶栓地点"
          v-if="queryCpcList.isHaveRs === '1'"
        >
          <div class="condition-item">
            <van-checkbox-group
              v-model="queryCpcList.rsLocale"
              direction="horizontal"
            >
              <van-checkbox
                v-for="item in rsPlaces"
                :key="item.value"
                :name="item.value"
                >{{ item.label }}</van-checkbox
              >
            </van-checkbox-group>
          </div>
        </med-collapsible-cell>
        <med-collapsible-cell title="是否放弃冶疗">
          <div class="condition-item">
            <med-radio-button-field
              v-model="queryCpcList.isGiveUp"
              label
              :select-options="yesOrNoDic"
            ></med-radio-button-field>
          </div>
        </med-collapsible-cell>
        <med-collapsible-cell title="呼救120或当地医疗机构" v-if="false">
          <div class="condition-item">
            <med-radio-button-field
              v-model="queryCpcList.isHelp"
              label
              :select-options="yesOrNoDic"
            ></med-radio-button-field>
          </div>
        </med-collapsible-cell>
        <med-collapsible-cell title="有远程心电传输" v-if="false">
          <div class="condition-item">
            <med-radio-button-field
              v-model="queryCpcList.isRemoteEcgTran"
              label
              :select-options="yesOrNoDic"
            ></med-radio-button-field>
          </div>
        </med-collapsible-cell>
        <med-collapsible-cell title="是网络医院转院" v-if="false">
          <div class="condition-item">
            <med-radio-button-field
              v-model="queryCpcList.isNetHospitalTrans"
              label
              :select-options="yesOrNoDic"
            ></med-radio-button-field>
          </div>
        </med-collapsible-cell>
        <med-collapsible-cell title="是否绕行急诊" v-if="false">
          <div class="condition-item">
            <med-radio-button-field
              v-model="queryCpcList.isBypassEm"
              label
              :select-options="yesOrNoDic"
            ></med-radio-button-field>
          </div>
        </med-collapsible-cell>
      </div>
      <template #bottom-part>
        <div class="bottom-button">
          <van-button
plain
color="#2b65f8"
@click="reset"
size="small"
            >重置</van-button
          >
          <van-button
color="#2b65f8"
@click="ConfirmOrCancel"
size="small"
            >确定</van-button
          >
        </div>
      </template>
    </med-popup-container>
  </div>
</template>

<script>
import patientIndex from '../../patientIndex.vue'
import { dicConstant } from '@/constant/commonConstant'
import { mapGetters, mapMutations } from 'vuex'
import * as types from '@/store/mutations/mutations-types'
import moment from 'moment'
export default {
  // 胸痛档案
  name: 'patientList',
  components: { patientIndex },
  data() {
    return {
      checked: false,
      active: this.$route.query.type,
      show: false,
      show2: false,
      diagnosisOne: '',
      queryCpcList: {},
      queryCpcList2: {
        comeType: [],
        type: '1',
        preDiagnosis: [],
        name: '',
        admissionNo: '',
        status: [],
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
        hospitalArea: '',
        showAdvcanse: 0,
        dateRangeValue: '',
        reportStatus: [],
        reject: ''
      },
      strOutcomeCodeDic: [
        { label: '出院', value: '1' },
        { label: '转送其它医院', value: '2' },
        { label: '院内继续救治', value: '3' },
        { label: '死亡', value: '4' }
      ],
      reportStatusList: [
        {
          label: '待上报',
          value: '0'
        },
        {
          label: '上报成功',
          value: '1'
        },
        {
          label: '上报失败',
          value: '2'
        }
      ],
      rejectList: [
        {
          label: '审核拒绝',
          value: '12'
        },
        {
          label: '存档拒绝',
          value: '13'
        }
      ],
      statusDic: [
        { label: '填报中', value: '10' },
        { label: '待审核', value: '21' },
        { label: '待存档', value: '31' },
        { label: '存档拒绝', value: '13' },
        { label: '审核拒绝', value: '12' },
        { label: '已存档', value: '41' }
      ],
      comeTypeList: [] /* 来院方式 */,
      comeTypeListNew: [],
      diagnosisList: [] /* 诊断 */,
      ambulanceDepartmentDic: [],
      yesOrNoDic: [],
      ihThrombolyticPlaceDict: [],
      rsPlaceList: [],
      rsPlaces: [],
      codeList: [
        dicConstant.comingCode,
        dicConstant.diagnosisCode,
        dicConstant.genderCode
      ],
      dateRange: [
        { label: '一天', value: '1' },
        { label: '三天', value: '2' },
        { label: '一周', value: '3' },
        { label: '一个月', value: '4' },
        { label: '自定义', value: '5' }
      ],
      searchCollapseName: []
    }
  },
  beforeRouteLeave(to, from, next) {
    const keepPath = [
      '/patient/document/detail/main',
      '/patient/document/overview/main',
      '/patient/document/ecg/view',
      '/patient/detail/timeManagement/timeCollection',
      '/patient/document/importInfo'
    ]
    if (keepPath.includes(to.path)) {
      from.meta.keepAlive = true
    } else {
      const vnode = this.$vnode
      const parentVnode = vnode && vnode.parent
      if (
        parentVnode &&
        parentVnode.componentInstance &&
        parentVnode.componentInstance.cache
      ) {
        var key =
          vnode.key == null
            ? vnode.componentOptions.Ctor.cid +
              (vnode.componentOptions.tag
                ? `::${vnode.componentOptions.tag}`
                : '')
            : vnode.key
        var cache = parentVnode.componentInstance.cache
        var keys = parentVnode.componentInstance.keys
        if (cache[key]) {
          this.$destroy()
          // remove key
          if (keys.length) {
            var index = keys.indexOf(key)
            if (index > -1) {
              keys.splice(index, 1)
            }
          }
          cache[key] = null
        }
      }
    }
    next()
  },
  activated() {
    if (this.$refs.NoFiling) {
      this.$refs.NoFiling.onQuery(this.active)
    }
  },
  created() {
    this.getDicList()
  },
  mounted() {
    this.queryCpcList = { ...this.searchQueryCpcList }
    if (this.queryCpcList.showAdvcanse === 1) {
      this.searchCollapseName = ['2']
    }
  },
  computed: {
    ...mapGetters([
      'hospitalArea',
      'curHospitalArea',
      'appName',
      'configure',
      'searchQueryCpcList'
    ]),
    curHospitalAreaName() {
      const matched = this.hospitalArea.find(
        el => el.value === this.curHospitalArea
      )
      return matched?.label
    },
    filterColor() {
      let color = '#aaa'
      if (
        this.queryCpcList.name ||
        this.queryCpcList.dateRangeValue ||
        this.queryCpcList.starTime ||
        this.queryCpcList.endTime ||
        this.queryCpcList.reportStatus ||
        this.queryCpcList.reject ||
        this.queryCpcList.comeType?.length ||
        this.queryCpcList.preDiagnosis?.length ||
        this.queryCpcList.ambulanceDepartment?.length ||
        this.queryCpcList.leaveDiagnosis?.length ||
        this.queryCpcList.outcomeCode?.length ||
        this.queryCpcList.rsLocale?.length ||
        this.queryCpcList.isHaveRs ||
        this.queryCpcList.isGiveUp ||
        this.queryCpcList.isHelp ||
        this.queryCpcList.isRemoteEcgTran ||
        this.queryCpcList.isNetHospitalTrans ||
        this.queryCpcList.isBypassEm
      ) {
        color = 'orange'
      }
      return color
    }
  },
  methods: {
    ...mapMutations([types.SET_CURHOSPITALAREA, types.SET_SEARCHQUERYCPCLIST]),
    onDateRangeChange(val) {
      if (val === '1') {
        this.queryCpcList.startTime = moment(new Date())
          .add(-1, 'day')
          .format('YYYY-MM-DD')
        this.queryCpcList.endTime = moment(new Date()).format('YYYY-MM-DD')
      } else if (val === '2') {
        this.queryCpcList.startTime = moment(new Date())
          .add(-3, 'day')
          .format('YYYY-MM-DD')
        this.queryCpcList.endTime = moment(new Date()).format('YYYY-MM-DD')
      } else if (val === '3') {
        this.queryCpcList.startTime = moment(new Date())
          .add(-7, 'day')
          .format('YYYY-MM-DD')
        this.queryCpcList.endTime = moment(new Date()).format('YYYY-MM-DD')
      } else if (val === '4') {
        this.queryCpcList.startTime = moment(new Date())
          .add(-1, 'months')
          .format('YYYY-MM-DD')
        this.queryCpcList.endTime = moment(new Date()).format('YYYY-MM-DD')
      } else if (val === '5') {
      } else {
        this.queryCpcList.startTime = ''
        this.queryCpcList.endTime = ''
      }
    },
    comingTypeDesc() {
      const tempArr = [...this.comeTypeList]
      if (tempArr && tempArr.length > 0) {
        if (!this._resources.mrList120) {
          var index = tempArr.findIndex(m => m.value === '1')
          if (index > -1) {
            tempArr.splice(index, 1)
          }
        }
        if (!this._resources.mrListTransfer) {
          var index1 = tempArr.findIndex(m => m.value === '2')
          if (index1 > -1) {
            tempArr.splice(index1, 1)
          }
        }
        if (!this._resources.mrListSelf) {
          var index2 = tempArr.findIndex(m => m.value === '3')
          if (index2 > -1) {
            tempArr.splice(index2, 1)
          }
        }
        if (!this._resources.mrListInhospital) {
          var index3 = tempArr.findIndex(m => m.value === '4')
          if (index3 > -1) {
            tempArr.splice(index3, 1)
          }
        }
      }
      return tempArr
    },
    reset() {
      this.queryCpcList.name = ''
      this.queryCpcList.leaveDiagnosis = []
      this.queryCpcList.preDiagnosis = []
      this.queryCpcList.status = []
      this.queryCpcList.ambulanceDepartment = []
      this.queryCpcList.outcomeCode = []
      this.queryCpcList.comeType = []
      this.queryCpcList.rsLocale = []
      this.queryCpcList.admissionNo = ''
      this.queryCpcList.startTime = ''
      this.queryCpcList.endTime = ''
      this.queryCpcList.isHaveRs = ''
      this.queryCpcList.isGiveUp = ''
      this.queryCpcList.outPatientNo = ''
      this.queryCpcList.isHelp = ''
      this.queryCpcList.isRemoteEcgTran = ''
      this.queryCpcList.isNetHospitalTrans = ''
      this.queryCpcList.isBypassEm = ''
      this.queryCpcList.showAdvcanse = 0
      this.queryCpcList.dateRangeValue = ''
      this.queryCpcList.reject = ''
      this.queryCpcList.reportStatus = ''
    },
    goPatientList() {
      this.$router.push({
        path: '/patient/document/importInfo',
        query: { importType: 'add' }
      })
    },
    showPopup() {
      this.queryCpcList = { ...this.queryCpcList2 }
      this.show = true
    },
     // 查询返回按钮点击, 恢复修改前的值
    onSearchReturn() {
      this.queryCpcList = { ...this.queryCpcList2 }
      this.show = false
    },
    ConfirmOrCancel() {
      const isshowAdvcanse = this.queryCpcList.showAdvcanse
      this.queryCpcList.showAdvcanse = 0

      if (!this._.isEqual(this.queryCpcList, this.queryCpcList2)) {
        this.queryCpcList.showAdvcanse = isshowAdvcanse
      }

      this.show = false

      this.queryCpcList2 = { ...this.queryCpcList }
      this[types.SET_SEARCHQUERYCPCLIST]({ ...this.queryCpcList })

      if (this.$refs.NoFiling) {
        this.$refs.NoFiling.onQuery(this.active)
      }
    },
    //  获取来院方式-诊断方式
    async getDicList() {
      const result = await this.$api.service.getDictionary('')
      // 来院方式
      this.comeTypeList = result[dicConstant.comingCode]
      // 诊断
      this.diagnosisList = result[dicConstant.diagnosisCode]
      this.ambulanceDepartmentDic =
        result[dicConstant.ambulanceDepartmentCode]
      this.yesOrNoDic = result[dicConstant.yesOrNoCode]

      this.ihThrombolyticPlaceDict =
        result[dicConstant.ihThrombolyticPlaceCode]

      this.rsPlaceList = result[dicConstant.faThrombolyticPlaceCode]

      this.rsPlaces = []
      for (const item of this.rsPlaceList) {
        this.rsPlaces.push({
          label: item.label,
          name: item.name,
          value: '1' + item.value
        })
      }

      for (const item of this.ihThrombolyticPlaceDict) {
        this.rsPlaces.push({
          label: item.label,
          name: item.name,
          value: '2' + item.value
        })
      }
    },
    adanceClick() {
      if (this.queryCpcList.showAdvcanse === 0) {
        this.$set(this.queryCpcList, 'showAdvcanse', 1)
      } else {
        this.$set(this.queryCpcList, 'showAdvcanse', 0)
      }
    }
  },
  watch: {
    curHospitalArea: {
      immediate: true,
      handler(val) {
        this.$set(this.queryCpcList, 'hospitalArea', val)
      }
    },
    hospitalArea: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val?.length && !this.curHospitalArea) {
          this[types.SET_CURHOSPITALAREA](val[0]?.value)
        }
      }
    },
    active: {
      immediate: true,
      handler(val, nVal) {
        if (nVal && this.$refs.NoFiling) this.$refs.NoFiling.onQuery(val)
      }
    },
    'queryCpcList.hospitalArea': {
      immediate: true,
      handler(val, nVal) {
        if (val) {
          this[types.SET_SEARCHQUERYCPCLIST]({ ...this.queryCpcList })
          if (nVal && this.$refs.NoFiling) this.$refs.NoFiling.onQuery(this.active)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/views/index.less';
/deep/ .van-tabs {
  // 搜索图标
  .van-button {
    margin: 5px 12px 0 12px;
    // border: none;
    // .van-icon {
    //   color:#aaa;
    //   font-size: 38px;
    // }
  }

  .filter-button-none {
    border: none;
    color: #aaa;
  }
  .filter-button {
    border: none;
    color: #fa9723;
  }
}
.button-add {
  bottom: 130px;
  right: 40px;
  top: auto;
  left: auto;
}
.condition-item {
  .van-field-border {
    border: 1px solid #dddddd;
    border-radius: 10px;
  }
  /deep/.med-hint-field--bottom::after {
    content: '';
    border-bottom: 0px;
  }
  .select {
    border: 1px solid #ddd;
    padding: 0.18rem 0.5rem;
    font-size: 0.35rem;
    border-radius: 0.1rem;
  }
  .van-checkbox-group > .van-checkbox--horizontal {
    margin-right: 0;
  }
  /deep/ .van-cell {
    padding-left: 6px;
    padding-right: 6px;
  }

  /deep/ .van-checkbox {
    .van-checkbox__icon {
      display: none;
    }

    .van-checkbox__label {
      margin: 6px;
      font-size: 26px;
      line-height: 80px;
      border-radius: 15px;
      padding: 0 16px;
      background-color: rgb(239, 241, 255);
    }
    .van-checkbox__icon--checked + .van-checkbox__label {
      background-color: #2b65f8;
      border-color: #2b65f8;
      color: #fff;
    }
  }
}

.search-container {
  .van-nav-bar__title {
    max-width: 70%;
    width: 70%;
    .van-search {
      background: transparent;
      padding: 0;
    }
  }
  .name-search-item {
    padding: 32px 32px 0 32px;
    // .van-search__content {
    //   padding-left: 0;
    // }
  }
  /deep/ .med-radio {
    line-height:2;
    border-radius: 0.2rem;
    &.med-radio-checked {
      background: #2b65f8;
      border-color: #2b65f8;
    }
  }

  .condition-item {
    .van-button {
      width: 100%;
    }
  }

  /deep/ .van-collapse-item__content {
    padding: 0;
  }

  /deep/
    .condition-item
    .van-checkbox
    .van-checkbox__icon--checked
    + .van-checkbox__label {
    background: #2b65f8;
  }

  /deep/ .condition-item .van-radio-group {
    .van-radio .van-radio__icon.van-radio__icon--checked + .van-radio__label {
      background-color: #2b65f8;
    }
  }

  .bottom-button {
    padding: 16px 40px;
    display: flex;

    button {
      flex-grow: 1;
    }

    button:nth-child(1) {
      border-radius: 1rem 0 0 1rem;
    }

    button:nth-child(2) {
      border-radius: 0 1rem 1rem 0;
    }
  }

  .med-switch {
    .van-cell__title {
      display: flex;
      align-items: center;
    }

    .van-cell__value {
      display: flex;
      justify-content: right;
      align-items: center;
    }
  }

  .advance-action {
    color: #969799;
  }
}
</style>
