<template>
  <div class="edit-panel">
    <el-container v-if="getInfoFlag">
      <el-container>
        <el-aside class="timeline-area">
          <timeline :id="$route.query.registId" />
        </el-aside>
        <el-main class="content-area">
          <base-info
            ref="baseInfo"
            :info="patientDetail.regist"
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
        </el-main>
      </el-container>
      <el-footer class="footer-area" />
    </el-container>
  </div>
</template>

<script>
import timeline from '../timeline/timeliney.vue'
import baseInfo from './baseinfo'
import firstAid from './firstaid'
import triage from './triage'
import examination from './examination'
import inspection from './inspection'
import medication from './medication'
import { getPatientInfo } from '@/api/patient/edit'

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
        (this.comingType.indexOf('1') > -1 || this.comingType.indexOf('2') > -1)
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
    this.getPatientInfo()
  },
  methods: {
    getPatientInfo() {
      getPatientInfo(
        { registid: this.$route.query.registId }
      )
        .then((res) => {
          if (res.status === 200 && res.result) {
            this.patientDetail = res.result
            this.rfButName = this.patientDetail.regist?.rfTagId
              ? '腕带号:' + this.patientDetail.regist?.rfTagId
              : '绑定腕带号'
            this.getInfoFlag = true
          }
        })
    },
    changeComingType(val) {
      this.comingType = val
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
    background: #edefff
    border-color: #b7bffe
</style>
