<template>
  <div class="emergency-history-wrapper">
    <div class="emergency-history-top" v-if="!show">
      <div class="emergency-history-temp">
        <h2 class="emergency-history-title flex-c-b">
          <van-icon name="arrow-left" @click="$router.push('/aid/ambulances')" />
          <div style="flex:auto">历史任务</div>
        </h2>
        <van-radio-group class="flex-c-b radio-btn-type">
          <van-radio name="01" @click="onSubmit(1)">3天</van-radio>
          <van-radio name="02" @click="onSubmit(2)">一周</van-radio>
          <van-radio name="03" @click="onSubmit(3)">一月</van-radio>
          <van-radio name="04" @click="onSubmit(4)">一年</van-radio>
        </van-radio-group>
      </div>
    </div>
    <div class="emergency-history-info" v-if="!show">
      <van-list class="missions-list">
        <van-cell v-for="item in missionsList" :key="item.missionId" :title="item.info" label="描述信息" @click="submit(item)">
          <template #title>
            <span class="custom-title">{{ item.name }}</span>
            /
            <i :class="{
      gender: true,
      iconfont: true,
      'iconicon1-54male': item.gender === '01',
      'iconicon1-55female': item.gender === '02',
      no: item.gender !== '02' && item.gender !== '01'
    }" />
            /
            <span>{{ item.age }}</span>
          </template>
          <template>
            <div class="types flex-c-e">
              <span>{{ item.missionType }}</span>
              <van-tag :color="item.status === '已提交' ? '' : 'black'" :plain="item.status === '已提交' ? false : true" type="primary" size="large">
                {{ item.status }}
              </van-tag>
            </div>
          </template>
          <template #label>
            <div class="label flex-c-c">
              <p class="flex-c-c">
                <van-icon name="clock-o" />
                <span>{{ item.callTime || "" }}</span>
              </p>
              <p class="flex-c-c">
                <van-icon name="guide-o" />
                <span>{{ item.address || "" }}</span>
              </p>
            </div>
          </template>
          <template #right-icon>
            <div class="icon flex-c-c">
              <van-icon name="arrow" />
            </div>
          </template>
        </van-cell>
      </van-list>
    </div>
    <van-popup class="history-detail" v-model="show" position="right" get-container="body">
      <med-header :title="`历史任务 - ${patientInfo.name}`" leftText="" @backClick="backFromHistroy" />
      <div class="task-wrapper" v-if="show">
        <task :medicalStatus="medicalStatus" />
      </div>
    </van-popup>
  </div>
</template>

<script>
import * as types from '@store/mutations/mutations-types'
import methodMixin from '@mixins/methodMixin'
import { mapMutations, mapGetters } from 'vuex'
import Task from '../task/index.vue'

export default {
  name: 'History',
  components: { Task },
  data() {
    return {
      show: false,
      missionsList: [],
      genderList: [],
      missionTypeList: [],
      htcListPo: {
        licensePlate: '',
        startTime: '',
        endTime: ''
      },
      phepMissionsHistoryListVo: {
        missionId: '', // 任务ID
        name: '', // 姓名
        gender: '', // 性别
        age: '', // 年龄
        ageExtend: '', // 年龄拓展
        acceptMissionTime: '', // 接收任务时间
        destinationAddress: '', // 现场地址
        status: '', // 状态
        missionType: '', // 任务类型
        licensePlate: '' // 车牌号
      },
      oldPatientData: {}
    }
  },
  computed: {
    ...mapGetters([
      'licensePlate',
      'patientInfo',
      'patientId',
      'recordId',
      'missionId',
      'missionStatus',
      'curpage',
      'medicalStatus',
      'hospitalArea'
    ])
  },
  created() {
    this.getCodeList()
    this.htcList()
  },
  methods: {
    ...mapMutations(types),
    onSubmit(va) {
      if (va === 1) {
        this.getTime(3, 'days')
      } else if (va === 2) {
        this.getTime(7, 'days')
      } else if (va === 3) {
        this.getTime(1, 'month')
      } else if (va === 4) {
        this.getTime(1, 'year')
      }
    },
    getTime(value, label) {
      const startTime = this.$moment()
        .subtract(value, label)
        .format('YYYY-MM-DD[T]HH:mm:ss')
      const endTime = this.$moment().format('YYYY-MM-DD[T]HH:mm:ss')
      this.htcList(startTime, endTime)
    },
    async htcList(startTime, endTime) {
      if (startTime !== null && endTime !== null) {
        this.htcListPo.startTime = startTime
        this.htcListPo.endTime = endTime
      }
      this.htcListPo.licensePlate = this.licensePlate
      const res = await this.$api.htcList(this.htcListPo)
      this.missionsList = res?.body
        ?.filter(el => el.status === '06')
        .map(item => {
          const name = item.name || '未知'
          const missionType = this.matching(
            item.missionType,
            this.missionTypeList
          )
          const status = item.submitTime ? '已提交' : '填写中'
          return {
            ...item,
            gender: item.gender,
            name: name,
            missionType: missionType,
            status: status
          }
        })
    },
    matching(key, arr) {
      if (key) {
        const result = arr.find(item => {
          return item.value === key
        })
        return result?.label
      }
      return ''
    },
    backFromHistroy() {
      this.show = false
      this.htcList()

      this[types.SET_MEDICALSTATUS](this.oldPatientData.medicalStatus)
      this[types.SET_PATIENTID](this.oldPatientData.patientId)
      this[types.SET_RECORDID](this.oldPatientData.recordId)
      this[types.SET_MISSIONID](this.oldPatientData.missionId)
      this[types.SET_MISSIONSTATUS](this.oldPatientData.missionStatus)
      this[types.SET_CURPAGE](this.oldPatientData.curpage)
      this[types.SET_PATIENTINFO](this.oldPatientData.patientInfo)
      this[types.SET_HOSPITAL_AREA](this.oldPatientData.hospitalArea)

      this.oldPatientData = {}
    },
    submit(item) {
      this.show = true
      // 记下当前的患者信息用于返回时恢复
      this.oldPatientData = {
        licensePlate: this.licensePlate,
        patientInfo: {
          name: this.patientInfo.name,
          gender: this.patientInfo.gender,
          age: this.patientInfo.age
        },
        patientId: this.patientId,
        recordId: this.recordId,
        missionId: this.missionId,
        missionStatus: this.missionStatus,
        curpage: this.curpage,
        medicalStatus: this.medicalStatus,
        hospitalArea: this.hospitalArea
      }
      this[types.SET_HOSPITAL_AREA](this.hospitalArea)
      this[types.SET_MEDICALSTATUS](item.medicalStatus)
      this[types.SET_PATIENTID](item.patientId)
      this[types.REMOVE_RECORDID]()
      this[types.SET_PATIENTINFO]({
        name: item.name,
        gender: item.gender,
        age: item.age
      })
      this[types.SET_MISSIONID](item.missionId)
      this[types.SET_MISSIONSTATUS](item.status)
      this[types.SET_CURPAGE]('task')
    },
    getCodeList() {
      const res = this.getCodeListByKey(['PHFA_0001', 'PHFA_0006'])
      this.genderList = res.PHFA_0001 // 性别
      this.missionTypeList = res.PHFA_0006 // 急救类型
    }
  },
  mixins: [methodMixin]
}
</script>

<style lang="less" scoped>
.emergency-history-wrapper {
  padding-bottom: 150px;

  .emergency-history-temp {
    height: 332px;
    background: linear-gradient(45deg, #3139cb, #5563e4);
    -moz-box-shadow: 0px 3px 30px #a6a6a6;
    -webkit-box-shadow: 0px 3px 30px #a6a6a6;
    box-shadow: 0px 3px 20px #a6a6a6;
    padding: 0 50px;

    .emergency-history-title {
      color: #fff;
      text-align: center;
      padding: 0.8rem 0;
      font-size: 0.5rem;
    }

    .radio-btn-type {
      padding-top: 100px;

      /deep/ .van-radio:nth-of-type(4) {
        margin-right: 0;
      }

      /deep/ .van-radio__label {
        color: #fff;
        padding: 5px 30px;
      }
    }
  }

  .emergency-history-info {
    .van-cell {
      height: 140px;
    }

    .van-cell__title {
      max-width: 250px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      span {
        font-size: @font-md-size;
        line-height: 2;
      }
    }

    .label {
      span:nth-of-type(1) {
        min-width: 230px;
      }

      .van-icon {
        font-size: @font-md-size;
        line-height: 1;
      }
    }

    .types {
      span {
        font-size: @font-md-size;
        margin-right: 20px;
      }

      /deep/ .van-button {
        padding: 10px 30px;
        height: auto;

        .van-button__text {
          font-size: @font-md-size;
          margin-right: 0;
        }
      }
    }

    .label {
      position: absolute;
      bottom: 20px;
      left: 30px;

      p {
        span {
          font-size: @font-sm-size;
        }
      }
    }

    .icon {
      font-size: @font-xl-size;
    }

    i.gender {
      font-size: @font-md-size;
      font-weight: 800;

      &.no:before {
        content: "未知";
      }

      &.iconicon1-54male {
        color: #2b65f8;
      }

      &.iconicon1-55female {
        color: #f86359;
      }
    }
  }
}

.history-detail {
  height: 100vh;
  width: 100vw;

  /deep/ .med-header-wrapper {
    .van-nav-bar__content {
      height: 2.4rem;
    }
  }

  /deep/ .emergency-map-wrapper {
    height: calc(100vh - 398px);

    .med-header-wrapper {
      display: none;
    }
  }

  .task-wrapper {
    max-height: calc(100vh - 150px);
    overflow: auto;

    /deep/.emergency-task-top {
      background: #444fdb;
      height: 60px;
      padding: 0;
      top: unset;
      box-shadow: none;
    }

    /deep/ .emergency-task-main {
      padding-top: 2rem;
    }

    /deep/ .emergency-task-temp {
      display: none;
    }
  }
}
</style>
