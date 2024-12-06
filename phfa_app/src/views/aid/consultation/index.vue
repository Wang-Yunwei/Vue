<template>
  <div class="emergency-history-wrapper">
    <div class="emergency-history-top">
      <div class="emergency-history-temp">
        <h2 class="emergency-history-title flex-c-b">
          <van-icon name="arrow-left" @click="$router.push('/aid/ambulances')" />
          <div style="flex:auto">移动会诊</div>
        </h2>
        <van-radio-group class="flex-c-b radio-btn-type">
          <van-radio name="01" @click="onSubmit(1)">3天</van-radio>
          <van-radio name="02" @click="onSubmit(2)">一周</van-radio>
          <van-radio name="03" @click="onSubmit(3)">一月</van-radio>
          <van-radio name="04" @click="onSubmit(4)">一年</van-radio>
        </van-radio-group>
      </div>
    </div>
    <div class="emergency-history-info">
      <van-list class="missions-list">
        <van-cell v-for="item in patients" :key="item.patientId" @click="onClick(item)">
          <template #title>
            <span class="custom-title">{{ item.name }}</span>
            <i :class="{
            gender: true,
            iconfont: true,
            'iconicon1-54male': item.gender === '01',
            'iconicon1-55female': item.gender === '02',
            no: item.gender !== '02' && item.gender !== '01'
          }" />
            <span>{{ item.age }}</span>
          </template>

          <template>
            <div class="types flex-c-s">
              <span>{{ item.diseaseCategoryStr }}</span>
            </div>
          </template>
          <template #label>
            <div class="label flex-c-c">
              <p class="flex-c-c">
                <van-icon name="clock-o" />
                <span>{{ item.createTime }}</span>
              </p>
              <p class="flex-c-c">
                <i class="iconfont iconicon1-29"></i>
                <span>{{ item.destinationAddress }}</span>
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
    <van-button :hidden="isHidden" class="arrive-btn" type="primary" round @click="showPopup = true">
      <van-icon name="plus" size="35" />
    </van-button>
    <van-popup v-model="showPopup" position="right" get-container="body" duration="0.2">
      <div class="check-detail">
        <add v-if="showPopup" @backClick="hidePop" :selectedRow="selectedRow" />
      </div>
    </van-popup>
  </div>
</template>

<script>
import * as types from '@store/mutations/mutations-types'
import methodMixin from '@mixins/methodMixin'
import { mapMutations, mapGetters } from 'vuex'
import Add from './Add'
export default {
  components: { Add },
  mixins: [methodMixin],
  data() {
    return {
      selectedRow: {}, // 当前点击的行
      diseaseCategory: '',
      isHidden: false,
      showPopup: false,
      patients: [],
      genderList: [],
      patientListParDto: {
        licensePlate: '',
        startTime: '',
        endTime: ''
      },
      PatientListResDto: {
        patientId: '', // 患者ID
        name: '', // 姓名
        gender: '', // 性别
        age: '', // 年龄
        createTime: '', // 创建时间
        diseaseCategory: '', // 疾病类别
        destinationAddress: '', // 现场地址
        imUserids: '' // 群组成员
      }
    }
  },
  async created() {
    this.getCodeList()
    await this.mccList()
  },
  computed: {
    ...mapGetters(['missionId', 'patientId', 'licensePlate', 'userId'])
  },
  methods: {
    ...mapMutations(types),
    hidePop() {
      this.showPopup = false
      this.selectedRow = {}
    },
    onClick(val) {
      // 点击的时候判断是否已经创建会诊
      if (val.groupId) {
        this.$bridge.callhandler('openLink', {
          url: val.imUrl
        })
      } else {
        this.selectedRow = val
        this.showPopup = true
      }
    },
    async mccList(startTime, endTime) {
      if (startTime !== null && endTime !== null) {
        this.patientListParDto.startTime = startTime
        this.patientListParDto.endTime = endTime
      }
      this.patientListParDto.licensePlate = this.licensePlate
      const res = await this.$api.mccList(
        this.patientListParDto
      )
      this.patients = res?.body?.map(item => {
        if (item.patientId === this.patientId) {
          this.isHidden = true
        }
        return {
          ...item
        }
      })
    },
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
    matching(key, arr) {
      if (key) {
        const result = arr.find(item => {
          return item.value === key
        })
        return result?.label
      }
      return ''
    },
    getTime(value, label) {
      const startTime = this.$moment().subtract(value, label)
      // .format(YYYY-MM-DD[T]HH:mm:ss)
      const endTime = this.$moment()
      // .format(YYYY-MM-DD[T]HH:mm:ss)
      this.mccList(startTime, endTime)
    },
    getCodeList() {
      const res = this.getCodeListByKey(['PHFA_0001'])
      this.genderList = res.PHFA_0001 // 性别
    }
  }
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
      font-size: 36px;
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

  .arrive-btn {
    position: fixed;
    bottom: 150px;
    right: 20px;
    z-index: 22;
    width: 130px;
    height: 130px;
    padding: 30px;
    border-radius: 50%;
    word-break: break-all;
    background: #444fdb;
    border-color: #444fdb;
    font-size: @font-md-size;
    line-height: 1.3;
    color: #fff;
  }
}

.check-detail {
  width: 100vw;
  height: 100vh;
}
</style>
