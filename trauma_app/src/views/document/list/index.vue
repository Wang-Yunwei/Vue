<template>
  <div>
    <div class="body-tab">
      <div class="scroll-view">
        <van-tabs v-model="active" sticky color="#5e74fe">
          <template #nav-right>
            <van-button type="default" icon="filter-o" size="mini" class="filter-btn" plain @click="buttonScreen" :color="Object.keys(screen).length > 0 ? 'orange' : ''">筛选
            </van-button>
          </template>
          <van-tab v-for="(item, index) in tabs" :key="index" :title="item.label" :name="item.value">
            <card-list :query="query" :status="active" :index="index" :isInitPage="isInitPage" :executeSelect="isShowScreen" />
          </van-tab>
        </van-tabs>
      </div>
    </div>
    <med-popup-container v-model="isShowScreen" title="病历检索">
      <div style="padding: 0.3rem;">
        <van-field v-model="screen.searchKey" placeholder="姓名/门诊号/住院号" left-icon="search" size="large" class="search-input" />
        <div class="screen-body">
          <div class="body-item">
            <span class="item-title">建档时间</span>
            <div class="screen-body-button">
              <div>
                <med-radio-button-group v-model="screen.screenCreateTimeVal" :dataSource="[
          { label: '一天', value: 1 },
          { label: '三天', value: 3 },
          { label: '一周', value: 7 },
          { label: '一个月', value: 30 },
          { label: '自定义', value: 0 }
        ]" @input="onCreateTimChange" />
              </div>
              <div v-if="screen.screenCreateTimeVal === 0" class="self-time">
                <med-date-picker placeholder="开始日期" v-model="screen.startDate" type="dateTime" formatter="YYYY-MM-DD" />
                <span style="padding: 0 0.4rem 0 0.2rem;">~</span>
                <med-date-picker placeholder="结束日期" v-model="screen.endDate" type="dateTime" formatter="YYYY-MM-DD" />
              </div>
            </div>
          </div>
          <div class="body-item">
            <span class="item-title">来院方式</span>
            <div class="screen-body-checkbox-group">
              <med-checkbox-button-group v-model="screen.visitTypeList" :options="modeOfArrivalList" />
            </div>
          </div>
          <div class="body-item">
            <span class="item-title">病情判断</span>
            <div class="screen-body-checkbox-group">
              <med-checkbox-button-group v-model="screen.diagnosisList" :options="preliminaryDiagnosisList" />
            </div>
          </div>
          <div v-if="['0', '1'].includes(active)" class="body-item">
            <span class="item-title">状态</span>
            <div class="screen-body-checkbox-group">
              <med-checkbox-button-group v-model="screen.statusList" :options="screenState" />
            </div>
          </div>
        </div>
        <div class="screen-foot flex-c-c" style="text-align: center;">
          <van-button @click="screen = {}" class="screen-foot-button">重置
          </van-button>
          <van-button @click="certainButton" class="screen-foot-button">
            确定
          </van-button>
        </div>
      </div>
    </med-popup-container>
    <med-draggable-button class="body-plusSign" @click="isShowAddPatient = true" v-if="auth_add">
      <i class="iconfont iconicon1-441" />
    </med-draggable-button>
    <patient-list v-model="isShowAddPatient" :isShow="isShowAddPatient" @close="isShowAddPatient = false" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { dictionariesMixin } from '@mixins/index.js'
export default {
  components: {
    cardList: () => import('./cardList.vue'),
    addPatient: () => import('./add/addPatient.vue'),
    PatientList: () => import('./add/patientList.vue')
  },
  mixins: [dictionariesMixin],
  data() {
    return {
      isLoading: false,
      isInitPage: false,
      active: '0',
      screen: {},
      query: {},
      modeOfArrivalList: [], // 来院方式枚举值
      preliminaryDiagnosisList: [], // 病情判断枚举值
      isShowScreen: false, // 是否显示筛选页面
      isShowAddPatient: false // 是否显示添加患者页面
    }
  },
  beforeRouteLeave(to, from, next) {
    // 离开当前路由后执行
    this.isInitPage = !this.isInitPage
    next()
  },
  computed: {
    ...mapGetters(['loginUserInfo']),
    screenState() {
      return this.active === '0' ? this.FORM_STATE.filter(el => el.isScreenAll) : this.FORM_STATE.filter(el => el.isFilling)
    },
    tabs() {
      return this.FORM_STATE.filter(el => el.isTabs)
    },
    auth_add() {
      // 权限控制 - 建档 sign = trauma-mr-add
      return (
        this.loginUserInfo?.resources?.filter(el => el.sign === 'trauma-mr-add')
          .length > 0
      )
    }
  },
  methods: {
    onRefresh() {
      setTimeout(() => {
        this.isLoading = false
      }, 3000)
    },
    onCreateTimChange(value) {
      if (value !== 0) {
        var now = this.$moment()
        // 开始时间
        this.$set(this.screen, 'endDate', now.format('YYYY-MM-DD'))
        // 结束时间
        this.$set(
          this.screen,
          'startDate',
          now.subtract(value, 'days').format('YYYY-MM-DD')
        )
      }
    },
    buttonScreen() {
      this.preliminaryDiagnosisList = this.getDicListByKey('DIAGNOSIS_0001') // 病情判断
      this.modeOfArrivalList = this.getDicListByKey('VISIT_0001') // 来院方式
      // 显示筛选页面
      this.isShowScreen = true
      this.tabsActive = -1
    },
    certainButton() {
      // 筛选页面确定按钮
      if (Object.keys(this.screen).length > 0) {
        if (this.screen.visitTypeList && this.screen.visitTypeList.length < 1) {
          delete this.screen.visitTypeList
        }
        if (this.screen.diagnosisList && this.screen.diagnosisList.length < 1) {
          delete this.screen.diagnosisList
        }
      }
      this.query = {
        ...this.screen
      }
      this.isShowScreen = false
    }
  },
  watch: {
    active(valNew, valOld) {
      // 监听激活的tab
      if (this.screen.statusList && this.screen.statusList.length > 0) {
        if (['1', '2', '3', '4'].includes(valNew) && ['0', '1'].includes(valOld)) {
          // 在全部或填报中tab下筛选状态的条件后，切换到待审核、待存档tab，筛选条件自动重置
          delete this.query.statusList
          delete this.screen.statusList
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";

.body-tab {
  position: fixed;
  top: 2.2rem;
  left: 0;
  right: 0;

  /deep/ .van-tabs__content .van-tab__pane {
    height: calc(100vh - 4.71rem);
    overflow: auto;
  }

  /deep/ .van-tabs__wrap {
    width: calc(100vw - 1.9rem);

    .filter-btn {
      color: #aaa;
      min-width: 1.9rem;
      height: 1.173333rem;
      position: fixed;
      right: 0;
      border: none;
      border-radius: 0;
    }
  }
}

.body-plusSign {
  bottom: 130px;
  right: 40px;
  top: auto;
  left: auto;
}

.search-input {
  line-height: 0.45rem;
  height: 1rem;
  background-color: rgb(247, 248, 250);
  margin: 0 auto;
  border-radius: 0.6rem;
  font-size: 0.4rem;
}

.screen-body {
  padding-top: 0.5rem;
  overflow: auto;
  height: calc(100vh - 5rem);

  .body-item {
    letter-spacing: 0px;
    margin-bottom: 0.5rem;
    min-width: 4em;

    .item-title {
      font-weight: 700;
      font-size: 0.48rem;
    }

    .screen-body-button {
      font-weight: 500;
      margin-top: 0.4rem;
      border-top: 1px solid rgba(95, 94, 94, 0.1);
      border-bottom: 1px solid rgba(95, 94, 94, 0.1);
      padding: 0.1rem 0;

      /deep/.med-hint-field--bottom::after {
        content: "";
        border-bottom: 0px;
      }

      .self-time {
        display: flex;
        align-items: center;
        font-weight: 400;

        /deep/ .van-cell.van-field {
          padding: 0.27rem 0.4rem 0.27rem 0;
        }
      }
    }

    .screen-body-checkbox-group {
      margin-top: 0.4rem;
      font-weight: 500;
      border-top: 1px solid rgba(95, 94, 94, 0.1);
      border-bottom: 1px solid rgba(95, 94, 94, 0.1);
      padding: 0.3rem 0;

      /deep/ .van-checkbox__label {
        padding: 0.3rem;
        border-radius: 0.2rem;
        background-color: #eff1ff;
      }

      /deep/ .van-checkbox__icon--checked+.van-checkbox__label {
        background-color: #5e74fe;
        color: white;
      }
    }
  }
}

.screen-foot-button {
  height: 0.86rem;
  border-radius: 1rem 0 0 1rem;
  border-color: rgb(43, 101, 248);
  color: rgb(43, 101, 248);
  border-right: none;
  width: 4.5rem;

  /deep/ .van-button__text {
    font-size: 0.32rem;
  }

  &+.screen-foot-button {
    border-radius: 0 1rem 1rem 0;
    background-color: rgb(43, 101, 248);
    color: white;
  }
}
</style>
