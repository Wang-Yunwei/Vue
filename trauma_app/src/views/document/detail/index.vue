<template>
  <div>
    <med-header :title="isPickRead ? '调阅' : $route.path.includes('time-collection') ? '时间采集' : $route.path.includes('time-line') ? '时间轴' : '病历编辑'" wide @backClick="back">
      <template #right>
        <div v-if="isEmId" @click="isShowBinding = true">
          <i class="iconfont iconlvtong-96" style="font-size: 0.6rem" />绑定
        </div>
        <div v-else>
          <template>
            <van-popover v-model="showMoreActions" trigger="click" placement="bottom-end" :actions="isPickRead
      ? [{ icon: 'notes-o', text: '病历' }]
      : [
        { icon: 'replay', text: '同步' },
        { icon: 'label-o', text: '日志' },
        { icon: 'description', text: '调阅' }
      ]
      " :offset="[18, 8]" @select="onSelect">
              <template #reference>
                <i class="iconfont iconicon1-151" style="font-size: 0.6rem" />
              </template>
            </van-popover>
          </template>
        </div>
      </template>
    </med-header>
    <div class="head-card">
      <div class="card-body" @click="isShowBasicInfo = true">
        <div class="flex-c-b">
          <div class="flex-c-b">
            <div class="name">
              {{ form.patientRegist.name }}
            </div>
            &nbsp;
            <div class="gender">
              <span v-if="!(form.patientRegist && form.patientRegist.gender)">未知</span>
              <i v-else :class="{ iconfont: true, 'iconicon1-55female': form.patientRegist.gender === '1', 'iconicon1-54male': form.patientRegist.gender === '2' }" />
            </div>
            &nbsp;
            <div v-if="form.patientRegist.age || form.patientRegist.ageMonth || form.patientRegist.ageDay">
              {{
      form.patientRegist.ageRange
        ? form.patientRegist.ageRange === "01"
          ? form.patientRegist.age + "岁"
          : form.patientRegist.ageRange === "02"
            ? form.patientRegist.age +
            "岁" +
            form.patientRegist.ageMonth +
            "月"
            : form.patientRegist.ageDay
              ? form.patientRegist.ageDay + "天"
              : ""
        : form.patientRegist.age
          ? form.patientRegist.age + "岁"
          : ""
    }}
            </div>
            &nbsp;
            <van-tag size="medium" round :color="DIAGNOSIS_COLOR.find(el => el.key === (form.patientMain.diagnosis ? form.patientMain.diagnosis : '00'))?.value" text-color="#fff">
              {{ form.patientMain.diagnosisName ? form.patientMain.diagnosisName : '未知' }}
            </van-tag>
            <van-tag size="medium" round color="rgb(239,241,255)" text-color="rgb(94,116,254)">
              {{ form.patientMain.visitType }}
            </van-tag>
            <van-icon v-if="isBasic" name="warning-o" color="red" size="0.5rem" />
          </div>
          <div>
            <van-tag v-if="['2', '3', '4'].includes(form.patientMain.status)" size="large" round color="rgb(239,241,255)" text-color="rgb(94,116,254)">
              {{ form.patientMain.statusName }}
            </van-tag>
            <van-button v-else class="wrist-band-btn" round color="rgb(94,116,254)" plain type="default" size="mini" @click.stop="isShowWristBand = true">
              <i class="iconfont iconicon1-56" />
              {{
      form.patientRegist.rfTagName ? form.patientRegist.rfTagName : "未绑"
    }}
            </van-button>
          </div>
        </div>
        <div style="display: flex;color: rgb(145,142,142);font-size: 0.32rem;margin-top: 0.1rem;">
          <div style="flex: 1;">门诊号：{{ form.patientRegist.regNo }}</div>
          <div style="flex: 1;">
            住院号：{{ form.patientRegist.admissionNo }}
          </div>
        </div>
        <div style="display: flex;color: rgb(145,142,142);font-size: 0.32rem;margin-top: 0.25rem;">
          <div style="flex: 1;">
            <van-icon name="clock-o" />
            <span style="color: rgb(94,116,254);"> 发病：{{ onsetTime }} </span>
          </div>
          <div style="flex: 1;">
            <van-icon name="clock-o" />
            <span style="color: rgb(94,116,254);">
              到院：{{ arriveAtHospitalTime }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="detail-container">
      <router-view @initSub="isSubmit = false" @verifyParam="verifyParam" @diagnosisChange="diagnosisChange" />
    </div>
    <div v-if="!isPickRead">
      <div v-if="!$route.path.includes('time-collection') &&
      !$route.path.includes('time-line') &&
      auth_tabs
      " style="position: fixed;bottom: 1.3rem;background-color: rgb(243,243,243);width: 100%;margin: 0 auto;">
        <div style="background-color: rgb(243,243,243); padding: 0.12rem 0.1rem;" class="flex-c-a">
          <div v-if="(form.patientMain.status === '1' && auth_submit) ||
      (form.patientMain.status === '4' && auth_report)
      ">
            <van-button round :color="form.patientMain.status === '4' && auth_report
      ? 'rgb(241,96,8)'
      : 'rgb(94,116,254)'
      " style="width: 9.3rem;height: 1rem;" @click="
      lowerRightButt(
        form.patientMain.status,
        statusList[form.patientMain.status]
      )
      ">
              {{ statusList[form.patientMain.status] }}
            </van-button>
          </div>
          <div v-if="(form.patientMain.status === '2' && auth_audit_overrule) ||
      (form.patientMain.status === '3' && auth_archive_overrule)
      ">
            <van-button style="width: 4.6rem;height: 1rem;" round plain color="rgb(94,116,154)" @click="isOverrule = true">
              驳回
            </van-button>
          </div>
          <div v-if="(form.patientMain.status === '2' && auth_audit) ||
      (form.patientMain.status === '3' && auth_archive)
      ">
            <div v-if="(form.patientMain.status === '2' && auth_audit_overrule) ||
      (form.patientMain.status === '3' && auth_archive_overrule)
      ">
              <van-button round color="rgb(94,116,254)" style="width: 4.6rem;height: 1rem;" @click="
      lowerRightButt(
        form.patientMain.status,
        statusList[form.patientMain.status]
      )
      ">
                {{
      form.patientMain.status === "2"
        ? "通过"
        : statusList[form.patientMain.status]
    }}
              </van-button>
            </div>
            <div v-else>
              <van-button round color="rgb(94,116,254)" style="width: 9.3rem;height: 1rem;" @click="
    lowerRightButt(
      form.patientMain.status,
      statusList[form.patientMain.status]
    )
      ">
                {{
      form.patientMain.status === "2"
        ? "通过"
        : statusList[form.patientMain.status]
    }}
              </van-button>
            </div>
          </div>
        </div>
      </div>
      <med-popup-container v-model="isOverrule" title="驳回原因">
        <van-field v-model="overruleRemark" autosize type="textarea" rows="4" placeholder="请输入原因" maxlength="50" show-word-limit />
        <div style="position: relative;top: calc(100vh - 6.8rem);width: 100%;">
          <van-button round block type="info" size="normal" color="rgb(51,59,210)" style="margin: 0 auto;width: 80%;" @click="lowerRightButt('0', '驳回')">确定</van-button>
        </div>
      </med-popup-container>
      <van-tabbar route active-color="rgb(94,116,254)" @change="onChange">
        <van-tabbar-item to="/document/detail/document">
          <template #icon>
            <med-svg :icon-class="$route.path.includes('time-collection') ||
      $route.path.includes('time-line')
      ? 'iconlvtong-651'
      : 'iconlvtong-641'
      " />
          </template>
          病历编辑
        </van-tabbar-item>
        <van-tabbar-item v-if="form.patientMain.status === '1'" to="/document/detail/time-collection">
          <template #icon>
            <med-svg :icon-class="$route.path.includes('time-collection')
      ? 'iconlvtong-541'
      : 'iconlvtong-551'
      " />
          </template>
          时间采集
        </van-tabbar-item>
        <van-tabbar-item to="/document/detail/time-line">
          <template #icon>
            <med-svg :icon-class="$route.path.includes('time-line')
      ? 'iconlvtong-521'
      : 'iconlvtong-531'
      " />
          </template>
          时间轴
        </van-tabbar-item>
      </van-tabbar>
    </div>
    <basic-info v-model="isShowBasicInfo" :data="basicInfoForm" :isShow="isShowBasicInfo" @close="isShowBasicInfo = false; getDetails();" />
    <binding-pop v-model="isShowBinding" :isShow="isShowBinding" @close="isShowBinding = false; getDetails();" />
    <logs v-model="isShowLogs" :isShow="isShowLogs" @close="isShowLogs = false" />
    <wrist-band v-model="isShowWristBand" :tagId="form.patientRegist.rfTagId" :tagName="form.patientRegist.rfTagName" :isShow="isShowWristBand" @close="closeWristBand" />
  </div>
</template>

<script>
import * as types from '@/store/mutations-types'
import { mapGetters, mapMutations } from 'vuex'
import dictionariesMixin from '@mixins/dictionariesMixin'
import { computed } from 'vue'
export default {
  components: {
    basicInfo: () => import('./basicInfo.vue'),
    detailsPage: () => import('./document/index.vue'),
    bindingPop: () => import('./binding.vue'),
    logs: () => import('./logs.vue'),
    wristBand: () => import('./wristBand.vue')
  },
  mixins: [dictionariesMixin],
  provide() {
    return {
      // 显式提供一个计算属性
      isEmId: computed(() => this.isEmId),
      isSubmit: computed(() => this.isSubmit),
      readonly: computed(() => this.readonly)
    }
  },
  data() {
    return {
      onsetTime: '--', // 发病时间
      arriveAtHospitalTime: '--', // 到院时间
      overruleRemark: '',
      isOverrule: false,
      isShowWristBand: false,
      isShowLogs: false,
      isShowBinding: false,
      isShowDetails: true,
      showMoreActions: false,
      isSubmit: false,
      statusList: {
        '1': '提交',
        '2': '审核',
        '3': '存档',
        '4': '上报'
      },
      visitType: {
        '01': '120',
        '02': '转诊',
        '03': '自行',
        '04': '院内',
        '05': '其他'
      },
      isShowBasicInfo: false,
      basicInfoForm: {},
      form: {
        patientMain: {},
        patientRegist: {}
      },
      authTabs: [
        'trauma-mr-firstaid',
        'trauma-mr-triage',
        'trauma-mr-inspection',
        'trauma-mr-treatment',
        'trauma-mr-outcome'
      ]
    }
  },
  computed: {
    ...mapGetters(['registId', 'isPickRead', 'attackTime', 'arriveHospitalTime', 'loginUserInfo', 'binding']),
    auth_tabs() {
      // 判断是否有tab页权限,没有权限则不显示按钮,即使拥有按钮权限
      return (
        this.loginUserInfo?.resources?.filter(el =>
          this.authTabs.includes(el.sign)
        ).length > 0
      )
    },
    auth_submit() {
      // 权限控制 - 病历编辑 - 提交 sign = trauma-mr-submit
      return (
        this.loginUserInfo?.resources?.filter(
          el => el.sign === 'trauma-mr-submit'
        ).length > 0
      )
    },
    auth_audit() {
      // 权限控制 - 病历编辑 - 审核 sign = trauma-mr-audit
      return (
        this.loginUserInfo?.resources?.filter(
          el => el.sign === 'trauma-mr-audit'
        ).length > 0
      )
    },
    auth_audit_overrule() {
      // 权限控制 - 病历编辑 - 审核驳回 sign = trauma-mr-auditreject
      return (
        this.loginUserInfo?.resources?.filter(
          el => el.sign === 'trauma-mr-auditreject'
        ).length > 0
      )
    },
    auth_archive() {
      // 权限控制 - 病历编辑 - 归档 sign = trauma-mr-archive
      return (
        this.loginUserInfo?.resources?.filter(
          el => el.sign === 'trauma-mr-archive'
        ).length > 0
      )
    },
    auth_archive_overrule() {
      // 权限控制 - 病历编辑 - 归档驳回 sign = trauma-mr-archivereject
      return (
        this.loginUserInfo?.resources?.filter(
          el => el.sign === 'trauma-mr-archivereject'
        ).length > 0
      )
    },
    auth_report() {
      // 权限控制 - 病历编辑 - 上报 sign = trauma-mr-report
      return (
        this.loginUserInfo?.resources?.filter(
          el => el.sign === 'trauma-mr-report'
        ).length > 0
      )
    },
    auth_revoke() {
      // 权限控制 - 病历编辑 - 撤回 sign = trauma-mr-revocation
      return (
        this.loginUserInfo?.resources?.filter(
          el => el.sign === 'trauma-mr-revocation'
        ).length > 0
      )
    },
    isBasic() {
      let result = true
      if (
        this.form.patientRegist.name &&
        this.form.patientRegist.gender &&
        this.form.patientMain.visitType &&
        this.form.patientRegist.ageRange
      ) {
        switch (this.form.patientRegist.ageRange) {
          case '01':
            if (this.form.patientRegist.age) {
              result = false
            }
            break
          case '03':
            if (this.form.patientRegist.ageDay) {
              result = false
            }
            break
          case '02':
            if (
              this.form.patientRegist.age ||
              this.form.patientRegist.ageMonth
            ) {
              result = false
            }
            break
          default:
            break
        }
      }
      return result
    },
    readonly() {
      // 是否只读
      return this.form.patientMain.status !== '1'
    },
    isEmId() {
      return !(this.form.patientMain.emId && this.form.patientMain.emId !== '')
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    ...mapMutations([types.SET_EM_ID, types.SET_VISIT_TYPE, types.SET_IS_PICK_READ, types.SET_BINDING]),
    closeWristBand() {
      // 关闭腕带绑定页面
      this.isShowWristBand = false
      this[types.SET_BINDING](!this.binding)
    },
    diagnosisChange(val) {
      // 病情判断
      this.$set(this.form.patientMain, 'diagnosisName', this.getDicLabelByValue(val, 'DIAGNOSIS_0001'))
      this.$set(this.form.patientMain, 'diagnosis', val)
    },
    onSelect(val) {
      switch (val.text) {
        case '同步':
          this.$api.synchrodata(this.registId).then(res => {
            if (res.code === '000000') {
              this[types.SET_BINDING](!this.binding)
              this.$notify({
                type: 'success',
                message: '已成功同步'
              })
            }
          })
          break
        case '日志':
          this.isShowLogs = true
          break
        case '调阅':
          this[types.SET_IS_PICK_READ](true)
          break
        case '病历':
          this[types.SET_IS_PICK_READ](false)
          break
      }
    },
    verifyParam() {
      this.isSubmit = false
      this.$api
        .submitApprove({
          registId: this.registId,
          opType: '1'
        })
        .then(res => {
          if (res.code === '000000') {
            this.$notify({ type: 'success', message: '提交成功' })
            this.getDetails()
          } else {
            this.$notify({ message: '提交失败' })
          }
        })
    },
    lowerRightButt(status, val) {
      // 页面右下方按钮
      switch (status) {
        case '1': // 保存
          if (val === '保存') {
            this.$notify({
              type: 'success',
              message: val + '成功'
            })
          } else {
            // 提交,先验证必填参数是否已经填写
            if (this.isBasic) {
              this.$notify({ type: 'warning', message: '请填写基本信息' })
            } else {
              this.isSubmit = true
            }
          }
          break
        case '2': // 审核
          this.$dialog
            .confirm({
              title: '提示',
              message: '确定通过' + val + '吗?',
              confirmButtonColor: 'rgb(94,116,254)'
            })
            .then(() => {
              this.$api
                .submitApprove({
                  registId: this.registId,
                  opType: '2'
                })
                .then(res => {
                  if (res.code === '000000') {
                    this.$notify({
                      type: 'success',
                      message: val + '成功'
                    })
                    this.getDetails()
                  } else {
                    this.$notify({
                      message: val + '失败'
                    })
                  }
                })
            })
            .catch(() => {
              this.$notify({ type: 'success', message: '已取消' + val })
            })
          break
        case '3': // 存档
          this.$dialog
            .confirm({
              title: '提示',
              message: '确定通过审核吗?',
              confirmButtonColor: 'rgb(94,116,254)'
            })
            .then(() => {
              this.$api
                .submitApprove({
                  registId: this.registId,
                  opType: '4'
                })
                .then(res => {
                  if (res.code === '000000') {
                    this.$notify({
                      type: 'success',
                      message: val + '成功'
                    })
                    this.getDetails()
                  } else {
                    this.$notify({
                      message: val + '失败'
                    })
                  }
                })
            })
            .catch(() => {
              this.$notify({ type: 'success', message: '已取消' + val })
            })
          break
        case '4': // 上报
          this.$dialog
            .confirm({
              title: '提示',
              message: '确定通过' + val + '吗?',
              confirmButtonColor: 'rgb(94,116,254)'
            })
            .then(() => {
              this.$api
                .submitApprove({
                  registId: this.registId,
                  opType: '6'
                })
                .then(res => {
                  if (res.code === '000000') {
                    this.$notify({
                      type: 'success',
                      message: val + '成功'
                    })
                    this.getDetails()
                  } else {
                    this.$notify({
                      message: val + '失败'
                    })
                  }
                })
            })
            .catch(() => {
              this.$notify({ type: 'success', message: '已取消' + val })
            })
          break
        default:
          this.$api
            .submitApprove({
              remark: this.overruleRemark,
              registId: this.registId,
              opType: this.form.patientMain.status === '2' ? '3' : '5'
            })
            .then(res => {
              if (res.code === '000000') {
                this.isSubmit = false
                this.$notify({
                  type: 'success',
                  message: val + '成功'
                })
                this.overruleRemark = ''
                this.getDetails()
              } else {
                this.$notify({
                  type: 'error',
                  message: val + '失败'
                })
              }
              this.isOverrule = false
            })
          break
      }
    },
    getDetails() {
      if (/\/document\/detail/.test(this.$route.path)) {
        this.$api
          .detail({
            registId: this.registId,
            types: ['card']
          })
          .then(res => {
            if (res.code === '000000') {
              this.basicInfoForm = JSON.parse(JSON.stringify(res.body))
              this.form = res.body
              if (res.body.patientMain && res.body.patientMain.emId) {
                this[types.SET_EM_ID](res.body.patientMain.emId)
              }
              // 来院方式
              this[types.SET_VISIT_TYPE](this.form.patientMain.visitType)
              this.$set(
                this.form.patientMain,
                'visitType',
                this.visitType[this.form.patientMain.visitType]
              )
              // MPDS
              this.$set(
                this.form.patientMain,
                'mpds',
                this.getLabelsByValue(this.form.patientMain.mpds, 'TRAUMA_0001')
              )
              // 表单状态
              this.$set(this.form.patientMain, 'statusName', this.FORM_STATE.find(el => el.value === this.form.patientMain.status)?.label
              )
              // 发病时间
              if (this.form.patientRegist.attackTime) {
                this.onsetTime = this.$moment(this.form.patientRegist.attackTime).format('MM-DD HH:mm')
              }
              // 到院时间
              if (this.form.patientRegist.arriveHospitalTime) {
                this.arriveAtHospitalTime = this.$moment(this.form.patientRegist.arriveHospitalTime).format('MM-DD HH:mm')
              }
            }
          })
      }
    },
    back() {
      this.$router.push({ name: 'documentList' })
    },
    onChange(index) {
      if (index === 0) {
        this.headerTitle = '病历编辑'
      } else if (index === 1) {
        this.headerTitle = '时间采集'
      } else if (index === 2) {
        this.headerTitle = '时间轴'
      }
    }
  },
  watch: {
    binding() {
      // 监听绑定
      this.getDetails()
    },
    arriveHospitalTime(val) {
      // 到院时间
      if (val) {
        this.arriveAtHospitalTime = this.$moment(val).format('MM-DD HH:mm')
      } else {
        this.arriveAtHospitalTime = '--'
      }
    },
    attackTime(val) {
      // 发病时间
      if (val) {
        this.onsetTime = this.$moment(val).format('MM-DD HH:mm')
      } else {
        this.onsetTime = '--'
      }
    },
    '$route.path'() {
      this.getDetails()
    }
  }
}
</script>

<style lang="less" scoped>
.head-card {
  box-sizing: border-box;
  padding: 0.3rem 0.3rem 0.2rem 0.3rem;
  width: calc(100% - 0.6rem);
  border-radius: 20px;
  overflow: hidden;
  position: fixed;
  top: 2.1rem;
  z-index: 2;
  background-color: white;
  left: 0.3rem;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

  .card-body {
    font-size: 0.36rem;

    .iconicon1-56 {
      font-size: 0.5rem;
    }

    >div+div {
      margin-top: 0.1rem;
    }

    >span {
      font-size: 0.32rem;
    }

    /deep/ .van-tag {
      margin-right: 0.2rem;
      padding: 0.05rem 0.15rem;
    }

    .mpds {
      color: rgb(145, 142, 142);
      max-width: 6rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .name {
      display: inline-block;
      font-size: 0.45rem;
      max-width: 2rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .gender {

      .iconicon1-55female {
        font-weight: bold;
        font-size: 0.36rem;
        color: rgb(43, 101, 248);
      }

      .iconicon1-54male {
        font-weight: bold;
        font-size: 0.36rem;
        color: rgb(255, 90, 64);
      }
    }

    .wrist-band-btn {
      /deep/ .van-button__text {
        font-size: 0.35rem;
        display: flex;
        align-items: center;

        i {
          margin-right: 0.1rem;
        }
      }
    }
  }
}

.van-cell::after {
  position: relative;
}

.detail-container {
  padding-top: 2.6rem;
}

.hover-button {
  position: absolute;
  bottom: 0.1rem;
}

.notify {
  // height: 120px !important
  background-color: orange !important;
}
</style>
