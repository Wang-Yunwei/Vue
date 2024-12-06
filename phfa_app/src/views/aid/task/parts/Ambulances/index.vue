<template>
  <div class="emergency-ambulances-wrapper">
    <div class="emergency-ambulances-top">
      <div class="emergency-ambulances-title">
        <h2 class="emergency-history-title flex-c-b">
          <van-icon name="arrow-left" @click="jumpToDetails" />
          <div style="flex:auto">选择车辆</div>
        </h2>
      </div>
      <div class="emergency-ambulances-notice">
        <van-notice-bar :scrollable="false" text="未选择任务车辆，请先选择车辆！" color="#fff" background="rgba(255, 255, 255, 0.2)">
          <template #left-icon>
            <i class="iconfont iconicon1-481"></i>
          </template>
        </van-notice-bar>
      </div>
    </div>
    <div class="emergency-ambulances-main">
      <van-radio-group v-model="selectedId" checked-color="#5e74fe">
        <ul class="emergency-ambulances-list">
          <li class="emergency-ambulances-list-item" v-for="item in list" :key="item.id">
            <van-radio :name="item.id" icon-size="0.66rem">
              {{ item.licensePlate }}
            </van-radio>
          </li>
        </ul>
      </van-radio-group>
      <div class="emergency-ambulances-buttons flex-c-b">
        <van-button round color="#5e74fe" :disabled="!selectedId" @click="onConfirm(selectedId, selectedAmbulance)">
          确定
        </van-button>
        <van-button round plain color="#5e74fe" @click="selectedId = ''">
          取消
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
import * as types from '@store/mutations/mutations-types'
import { mapMutations, mapGetters } from 'vuex'
export default {
  name: 'Ambulances',
  props: {
    confirm: {
      type: Function,
      default: () => { }
    }
  },
  data() {
    return {
      licensePlate: '',
      selectedId: '',
      list: []
    }
  },
  computed: {
    ...mapGetters(['hospitalId', 'hospitalArea']),
    selectedAmbulance() {
      return this.selectedId
        ? this.list.find(item => item.id === this.selectedId)
        : undefined
    }
  },
  created() {
    const delay = this.hospitalId ? 0 : 500
    setTimeout(() => {
      this.getAmbulances()
    }, delay)
  },
  methods: {
    ...mapMutations(types),
    jumpToDetails() {
      this.$dialog
        .confirm({
          title: '提示',
          message: '确定要退出院前急救工作站?',
          confirmButtonColor: '#5e74fe'
        })
        .then(() => {
          // 确定
          this.$bridge.callhandler('finishPager')
        })
        .catch(() => {
          this.$backhelper.push(() => {
            this.jumpToDetails()
          })
        })
    },
    async getAmbulances() {
      const res = await this.$api.eccPageList({
        hospitalId: this.hospitalId,
        hospitalArea: this.hospitalArea
      })
      this.list = res.body.records
    },
    // 选择救护车(选车)
    async handleSelectAmbulance(id, ambulance) {
      this[types.REMOVE_PATIENTID]()
      this[types.SET_PATIENTINFO]('')
      this[types.REMOVE_RECORDID]()
      this[types.REMOVE_MISSIONID]()
      this[types.SET_TOHOSPITALID]('')
      this[types.SET_ENDPOINT](null)
      this.licensePlate = ambulance.licensePlate
      this[types.SET_LICENSEPLATE](ambulance.licensePlate)
      // 根据车牌查任务
      const res = await this.$api.pmQueryByLicensePlate({
        licensePlate: ambulance.licensePlate
      })
      if (res.code === '000000') {
        const task = res.body
        if (task) {
          this[types.SET_MISSIONID](task.missionId)
          this[types.SET_MISSIONSTATUS](task.status)
          this[types.SET_CURPAGE]('task')
        } else {
          this[types.SET_CURPAGE]('notask')
          this.maskShow = false
        }
        this.$router.push('/aid/task')
      } else {
        this.$notify({
          type: 'danger',
          message: '获取车辆任务失败! ' + res.message
        })
      }
    },
    onConfirm(...args) {
      this.handleSelectAmbulance(args[0], args[1])
    }
  }
}
</script>

<style lang="less" scoped>
.emergency-ambulances-top .emergency-ambulances-title {
  padding: 1rem 0 0.6rem 0;
}

.emergency-ambulances {
  &-wrapper {
    height: 100vh;
  }

  &-top,
  &-main {
    padding: 0 0.58rem;
  }

  &-top {
    height: 6rem;
    background: linear-gradient(45deg, #3139cb, #5563e4);
    color: #fff;
    text-align: center;
  }

  &-main {
    height: calc(100% - 6.5rem);
    position: relative;
  }

  &-title {
    font-size: 0.42rem;
    padding: 0.8rem;

    h2 {
      font-weight: 500;
    }
  }

  &-notice {
    /deep/ .van-notice-bar {
      height: 1.75rem;
      border-radius: 0.1rem;
      font-weight: 600;
      font-size: 0.48rem;
      padding: 0 0 0 0.4rem;
    }

    .iconicon1-481 {
      font-weight: normal;
      color: #f66b24;
      background-image: radial-gradient(#fff 40%, transparent 50%);
      border-radius: 0.66rem;
      font-size: 0.66rem;
      line-height: 0.66rem;
      margin-right: 0.3rem;
    }
  }

  &-list {
    background-color: #fff;
    border-radius: 0.1rem;
    text-align: center;
    padding: 0.8rem;
    margin-top: -1.5rem;
    box-shadow: 1px 10px 20px rgba(0, 0, 0, 0.1);
    max-height: calc(100vh - 8rem);
    overflow: auto;

    &-item {
      &:active {
        background-color: #f2f4f5;
      }

      /deep/ .van-radio {
        padding: 0.36rem 1.6rem;
      }

      /deep/ .van-radio__icon .van-icon {
        border-color: #5e74fe;
        margin-right: 0.16rem;
      }

      /deep/ .van-radio__label {
        font-size: 0.44rem;
        color: #696969;
        letter-spacing: 0.02rem;
      }
    }
  }

  &-buttons {
    position: absolute;
    bottom: 0;
    width: calc(100% - 1.18rem);

    button {
      width: 3.7rem;

      &:last-child {
        background-color: transparent;
      }
    }
  }
}
</style>
