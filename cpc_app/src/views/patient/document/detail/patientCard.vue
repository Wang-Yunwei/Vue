<template>
  <div class="patient-card-wrapper">
    <div class="patient-card" @click="onEdit">
      <div>
        <div class="title">
          <div class="patient">
            <div class="name">{{ data.name }}</div>
            <div :class="genderClass(data.gender)"></div>
            <div class="age">{{ data.age }}岁</div>
            <div class="badge diag">{{ diagDesc }}</div>
            <div class="badge comingType">
              {{ comeTypeDesc }}
            </div>
            <van-icon name="warning-o" v-if="showWarning" />
            <div :class="isLockClass(data.isLock)"></div>
          </div>
          <div class="badge status" v-if="configure.dockingWay === '2'">
            {{ statusDesc }}
          </div>
          <span class="spanRfId" v-if="!showRfIdBtn">{{ rfIdName }}</span>
          <van-button
            v-if="configure.dockingWay === '1' && showRfIdBtn"
            class="button"
            :disabled="disabled"
            @click.stop="openRfTag"
          >
            <template #icon>
              <i class="iconfont iconicon1-56"></i>
            </template>
            <span>{{ rfIdName }}</span>
          </van-button>
        </div>
      </div>
      <div class="">
        <div class="bottomLeft" v-if="configure.dockingWay === '2'">
          <p v-if="data.outpatientNo || !data.inpatientNo">
            填报编号:{{ data.reportNo }}
          </p>
        </div>
        <div class="bottomLeft flex-c-s" v-else>
          <p>
            门诊号：{{ data.outpatientNo }}
          </p>
          <p>住院号：{{ data.inpatientNo }}</p>
        </div>
        <div class="bottomRight">
          <slot name="bottomRight">
            <div class="time">
              <i class="iconfont iconicon1-41"></i>
              首触：<span>{{ data.fmcTime ? fmcTime : '--' }}</span>
            </div>
            <div class="time">
              <i class="iconfont iconicon1-41"></i>
              到院：<span>{{ data.arriveTime ? arriveTime : '--' }}</span>
            </div>
          </slot>
        </div>
      </div>
    </div>
    <med-popup-container
      v-model="rfTagShow"
      title="绑定腕带"
      position="right"
      class="filelist-pop-right"
      scroll
      @return="rfTagShow = false"
      @opened="onWristbindShow"
    >
      <wristbind-binding
        ref="wristbind"
        :registId="registId"
        :name="data.name"
        @selected="onWristbindSelected"
      />
    </med-popup-container>
  </div>
</template>

<script>
import moment from 'moment'
import { dicConstant } from '@/constant/commonConstant'
import WristbindBinding from './wristbindBinding.vue'
import { mapGetters } from 'vuex'

export default {
  components: { WristbindBinding },
  props: ['disabled', 'dic', 'data', 'rfTagId', 'bindBtn'],
  data() {
    return {
      popShow: false,
      // 腕带号列表页面
      rfTagShow: false,
      tagId: '',
      codeList: [dicConstant.comingCodeSHORTCode, dicConstant.diagnosisCode],
      registId: this.$route.query.registId
    }
  },
  computed: {
    ...mapGetters(['configure']),
    comeTypeDesc() {
      return this.parseComingType(this.data.comingType)
    },
    statusDesc() {
      if (this.data.status === '12') {
        return '审核拒绝'
      } else if (this.data.status === '13') {
        return '存档拒绝'
      } else if (this.data.status === '21') {
        return '待审核'
      } else if (this.data.status === '31') {
        return '待存档'
      } else if (this.data.status === '41') {
        return '已存档'
      } else {
        return '填报中'
      }
    },
    showWarning() {
      return (
        !this.data.comingType ||
        !this.data.name ||
        !this.data.age ||
        !this.data.gender ||
        !this.data.idcardType ||
        (this.data.idcardType &&
          this.data.idcardType !== '0' &&
          !this.data.identificationNo) ||
        !this.data.fmcTime
      )
    },
    diagDesc() {
      return this.parseDiagnosis(this.data.diagnosis)
    },
    fmcTime() {
      if (!this.data.fmcTime) return ''
      return moment(this.data.fmcTime).format('MM-DD HH:mm')
    },
    diseaseTime() {
      if (!this.data.diseaseTime) return ''
      return moment(this.data.diseaseTime).format('MM-DD HH:mm')
    },
    arriveTime() {
      if (!this.data.arriveTime) return ''
      return moment(this.data.arriveTime).format('MM-DD HH:mm')
    },
    showRfIdBtn() {
      return (
        this.data.status !== '21' &&
        this.data.status !== '31' &&
        this.data.status !== '41'
      )
    },
    rfIdName() {
      if (this.data.status === '21') {
        return '待审核'
      } else if (this.data.status === '31') {
        return '待存档'
      } else if (this.data.status === '41') {
        return '已存档'
      }
      if (!this.tagId) return '未绑'
      return this.tagId
    },
    arriveTimeDesc() {
      if (this.data.isTimearea === '1') {
        return '凌晨'
      } else if (this.data.isTimearea === '2') {
        return '清晨'
      } else if (this.data.isTimearea === '3') {
        return '上午'
      } else if (this.data.isTimearea === '4') {
        return '中午'
      } else if (this.data.isTimearea === '5') {
        return '下午'
      } else if (this.data.isTimearea === '6') {
        return '傍晚'
      } else if (this.data.isTimearea === '7') {
        return '晚上'
      } else {
        return ''
      }
    }
  },
  created() {
    this.getDicData()
  },
  methods: {
    getUnboundTag() {
      this.$api.dataCollection
        .getwristbandList(this.hospitalAndArea())
        .then(({ result }) => {
          this.rfTagList = result
        })
    },
    onSaved() {
      this.$emit('changed')
    },
    onEdit() {
      this.$router.push({
        path: '/patient/document/addInformation',
        query: { from: 'edit', registId: this.registId }
      })
    },
    /**
     * 打开腕带号列表页面
     */
    openRfTag() {
      if (this.disabled) return
      this.rfTagShow = true
    },
    genderClass(sex) {
      let className = 'gender'
      switch (sex) {
        case '1':
          className += ` male iconfont`
          break
        case '2':
          className += ` female iconfont`
          break
        default:
          break
      }
      return className
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
    /**
     * 来院方式简称
     * @param type
     * @returns {string}
     */
    parseComingType(type) {
      if (!this.comingTypeDic || this.comingTypeDic.length === 0) {
        return '未知'
      }

      const comingType = this.comingTypeDic.find(e => e.value === type)
      return comingType ? comingType.label : '未知'
    },
    parseDiagnosis(diagnosisCode) {
      if (!this.distressCaseDic || this.distressCaseDic.length === 0) {
        return '未知'
      }
      const diagnosis = this.distressCaseDic.find(
        e => e.value === diagnosisCode
      )
      return diagnosis ? diagnosis.label : '未知'
    },
    onWristbindShow() {
      this.$refs.wristbind.init(this.tagId)
    },
    /**
     * 关闭腕带采集对话框
     * @param rfTagId
     */
    onWristbindSelected(item) {
      this.rfTagShow = false
      this.tagId = item.value
    },
    onRfIdScan() {
      this.$refs.wristbind.onRfIdScan()
    },
    getDicData() {
      this.$api.service.getDictionary('').then(result => {
        this.distressCaseDic = result[dicConstant.diagnosisCode]
        this.comingTypeDic = result[dicConstant.comingCodeSHORTCode]
      })
    }
  },
  watch: {
    'data.rfTagId': {
      immediate: false,
      handler(newVal) {
        this.tagId = newVal
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.patient-card-wrapper {
  position: relative;
  z-index: 2;
  background-color: #fff;
  height: 110px;
  .patient-card {
    width: 88%;
    min-height: 130px;
    margin: 0 auto;
    position: relative;
    top: -56px;
    background: #ffffff;
    border-radius: 15px;
    -moz-box-shadow: 0px 3px 30px #a6a6a6;
    -webkit-box-shadow: 0px 3px 30px #a6a6a6;
    box-shadow: 0px 3px 20px #a6a6a6;
    padding: 16px 18px;

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .patient {
        display: flex;
        justify-content: space-between;
        flex-flow: 1;
        > div,
        > .van-icon {
          line-height: 40px;
          vertical-align: middle;
          display: inline-block;
          word-break: break-all;
          white-space: nowrap;
          margin-right: 6px;
        }
        .van-icon {
          font-size: 36px;
          color: red;
        }
        .locker {
          font-size: 32px;
          font-weight: bold;
          padding: 0 3px;
          color: #5e74fe;
        }
      }
    }

    .name {
      font-size: 36px;
      color: #202020;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 156px;
    }

    .gender {
      &:before {
        content: '不详';
      }

      &.male:before {
        content: '\e63d';
        font-size: 26px;
        font-weight: 800;
        color: #2b65f8;
      }

      &.female:before {
        content: '\e63a';
        font-size: 26px;
        font-weight: 800;
        color: #f86359;
      }
    }

    .age {
      color: #202020;
      font-size: 28px;
    }

    .badge {
      font-size: 28px;
      line-height: 42px;
      padding: 0 10px;
      border-radius: 21px;
      background: rgba(94, 116, 253, 0.1);
      color: #5e74fe;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &.diag {
        max-width: 168px;
      }
      &.comingType {
        font-size: 20px;
        color: #f86359;
        background: rgba(255, 83, 62, 0.1);
      }
    }

    .rfTagId {
      color: #202020;
      font-size: 0.32rem;
    }

    .spanRfId {
      border-radius: 25px;
      background: #eff1ff;
      color: #5e74fe;
      padding: 0 10px;
      line-height: 2;
      font-size: 30px;
    }
    .button {
      white-space: nowrap;
      height: 50px;
      font-size: 28px;
      padding: 0 6px;
      border: 1px solid #5e74fe;
      border-radius: 25px;
      color: #5e74fe;
      line-height: 50px;

      i {
        font-size: 50px;
      }

      + .button {
        margin-left: 8px;
      }

      &:active {
        background-color: rgb(236, 236, 236);
      }
      .van-button__icon {
        padding: 7px 3px 0px 3px;
      }
      span {
        min-width: 80px;
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 24px !important;
      }
    }

    .bottomLeft {
      font-size: 24px;
      color: #b5b5b5;

      p {
        line-height: 52px;
        &:first-child:not(:only-child) {
          width: 280px;
        }
        & + p {
          margin-left: 12px;
        }
      }
    }

    .bottomRight {
      display: flex;
      font-size: 24px;
      line-height: 40px;

      .time {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #5e74fe;
        max-width: 300px;
        &:first-child:not(:only-child) {
          width: 280px;
        }
        i {
          font-size: 25px;
          color: #b5b5b5;
        }

        + .time {
          margin-left: 12px;
        }
      }
    }
  }
}

.pop {
  width: 100vw;
  height: 100vh;
  // overflow: hidden;
}
</style>
