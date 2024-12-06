<template>
  <div class="emergency-mine-wrapper">
    <div class="popel-info-top flex-c-s">
      <van-image class="image-popel-cat" round :src="headPortrait" />
      <div class="info flex-c-b">
        <div>
          <p>{{ userName }}</p>
          <br />
          <p>{{ userPhone }}</p>
        </div>
      </div>
      <div class="tip flex-c-b">
        <span>急救车</span>
        <med-select :value="licensePlate" @change="licensePlateChange" :options="vehicleList" style="width: 5rem; margin-left: 21%;"></med-select>
      </div>
    </div>
    <div class="to-configure-middle">
      <!-- <van-cell title="打印机">
        <template #right-icon>
          <van-radio-group class="radio-btn-type spec" v-model="timeValue">
            <van-radio>配置</van-radio>
          </van-radio-group>
        </template>
</van-cell>
<van-cell title="自动采集视频">
  <template #right-icon>
          <van-switch
            v-model="checked1"
            active-color="#5E74FE"
            inactive-color="#E9E9E9"
          />
        </template>
</van-cell>
<van-cell title="交接时候自动获取病历体征数据">
  <template #right-icon>
          <van-switch
            v-model="checked2"
            active-color="#5E74FE"
            inactive-color="#E9E9E9"
          />
        </template>
</van-cell>
<van-cell title="自动采集GPS">
  <template #right-icon>
          <van-switch
            v-model="checked3"
            active-color="#5E74FE"
            inactive-color="#E9E9E9"
          />
        </template>
</van-cell>
<van-cell title="自动采集监护仪数据到病历">
  <template #right-icon>
          <van-switch
            v-model="checked4"
            active-color="#5E74FE"
            inactive-color="#E9E9E9"
          />
        </template>
</van-cell> -->
      <!-- <van-cell>
        <van-radio-group class="flex-c-s radio-btn-type" v-model="timeValue">
          <van-radio
            v-for="item in timeList"
            :key="item.value"
            :name="item.value"
          >
            {{ item.label }}
          </van-radio>
        </van-radio-group>
      </van-cell> -->
      <van-button class="logout" @click="pageJump()" block round>退出登录</van-button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Image as VanImage } from 'vant'
import { mapGetters, mapMutations } from 'vuex'
import * as types from '@store/mutations/mutations-types'

Vue.use(VanImage)
export default {
  name: 'Mine',
  data() {
    return {
      vehicleList: [],
      headPortrait: require('../../../assets/png/avatar.png')
      // checked: true,
      // checked1: false,
      // checked2: false,
      // checked3: false,
      // checked4: false,
      // timeList: [
      //   { label: '3分钟', value: 3 },
      //   { label: '5分钟', value: 5 },
      //   { label: '10分钟', value: 10 }
      // ],
      // timeValue: ''
    }
  },
  created() {
    this.getVehiclesList()
  },
  methods: {
    ...mapMutations(types),
    // 选择救护车(选车)
    async handleSelectAmbulance(licensePlate) {
      this[types.REMOVE_PATIENTID]()
      this[types.REMOVE_RECORDID]()
      this[types.REMOVE_MISSIONID]()
      this[types.SET_TOHOSPITALID]('')
      this[types.SET_ENDPOINT](null)
      this[types.SET_LICENSEPLATE](licensePlate)
      // 根据车牌查任务
      const res = await this.$api.pmQueryByLicensePlate({
        licensePlate: licensePlate
      })
      const task = res.body
      if (task) {
        this[types.SET_MISSIONID](task.missionId)
        this[types.SET_MISSIONSTATUS](task.status)
        this[types.SET_CURPAGE]('task')

        // 修复切换车辆后直接打开地图页面无法显示路线
        const { body } = await this.$api.pmDetail({
          missionId: task.missionId
        })
        const toHospital = body?.medicalRecordsEntity?.toHospital || ''
        const toHospitalName = body?.medicalRecordsEntity?.toHospitalName || ''
        this[types.SET_TOHOSPITALNAME](toHospitalName)
        this[types.SET_TOHOSPITALID](toHospital)
      } else {
        this[types.SET_CURPAGE]('notask')
        this.maskShow = false
      }
      this.$nextTick(() => {
        this.$emit('reload', ['Map', 'Task'])
      })
    },
    licensePlateChange(val) {
      // this[types.SET_LICENSEPLATE](val)
      this.handleSelectAmbulance(val)
    },
    getVehiclesList() {
      this.$api.eccPageList({
        hospitalId: this.hospitalId,
        hospitalArea: this.hospitalArea
      })
        .then(res => {
          this.vehicleList = res.body.records.map(ele => ({
            value: ele.licensePlate,
            label: ele.licensePlate
          }))
        })
    },
    pageJump() {
      this.$router.push('/aid/ambulances')
    }
  },
  computed: {
    ...mapGetters(['licensePlate', 'hospitalId', 'hospitalArea', 'userInfo']),
    userName() {
      return this.userInfo?.name
    },
    userPhone() {
      return this.userInfo?.phone
    }
  }
}
</script>

<style lang="less" scoped>
.emergency-mine-wrapper {
  padding-bottom: 150px;
  background: #f2f4f5;

  /deep/ .van-sticky.van-sticky--fixed {
    top: 150px;

    .van-tabs__wrap {
      height: 100px;
    }
  }

  .popel-info-top {
    position: sticky;
    top: -180px;
    z-index: 999;
    height: 332px;
    padding: 0 30px;
    background: linear-gradient(45deg, #3139cb, #5563e4);
    -moz-box-shadow: 0px 3px 30px #a6a6a6;
    -webkit-box-shadow: 0px 3px 30px #a6a6a6;
    box-shadow: 0px 3px 20px #a6a6a6;

    .image-popel-cat {
      min-width: 130px;
      width: 130px;
      height: 130px;
      margin-right: 20px;
    }

    .info {
      width: 90%;

      p {
        color: #fff;
        font-size: @font-md-size;
      }

      .van-icon {
        color: #fff;
        font-size: @font-lg-size;
      }
    }

    .tip {
      position: absolute;
      bottom: -40px;
      left: 0;
      right: 0;
      margin: 0 auto;
      background: #fff;
      width: 90%;
      padding: 0 30px;
      line-height: 3;
      border-radius: 20px;
      font-size: @font-md-size;
    }
  }

  .to-configure-middle {
    margin-top: 50px;
    background: #fff;
    padding: 40px 0;

    /deep/ .van-switch {
      font-size: 40px;
    }

    /deep/ .van-cell {
      .van-cell__title {
        max-width: fit-content;
      }
    }

    /deep/ .radio-btn-type.spec {
      .van-radio {
        margin-right: 0;
      }
    }

    /deep/ .van-radio__label {
      font-size: @font-md-size;
    }
  }

  /deep/ .logout {
    width: 90%;
    margin: 30px auto 0;
    background: transparent;
    border-color: #5e74fe;
    color: #5e74fe;
  }
}
</style>
