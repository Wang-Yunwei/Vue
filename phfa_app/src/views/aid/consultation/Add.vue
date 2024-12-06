<template>
  <div class="consultation-add-wrapper">
    <div class="consultation-add-top">
      <med-header :title="patientDetail.name ? patientDetail.name + '的会诊申请' : ''" @backClick="backClick" />
      <div class="consultation-add-name">
        <div class="flex-c-s">
          <p>
            <span class="one">{{ selectedRow.name }}</span>
            <span class="one">
              <i :class="{
        gender: true,
        iconfont: true,
        'iconicon1-54male': selectedRow.gender === '01',
        'iconicon1-55female': selectedRow.gender === '02',
        no: selectedRow.gender !== '02' && selectedRow.gender !== '01'
      }" />/{{ selectedRow.age }}
            </span>
          </p>
          <p class="spec">
            <span class="one">主诉：{{ selectedRow.chiefComplaint }}</span>
          </p>
        </div>
        <div class="flex-c-s">
          <p>
            <span class="oneC">初步诊断</span>
          </p>
          <p class="spec">
            <span class="one oneL">{{ selectedRow.diagnosis || "" }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="consultation-add-main">
      <h3>申请原因</h3>
      <van-field v-model="form.reason" rows="2" autosize type="textarea" placeholder="请输入申请原因" />
    </div>
    <div class="consultation-add-bottom">
      <ul>
        <li class="flex-c-s" @click="addPeople()">
          <i class="iconfont iconicon1-311"></i>
          <p class="flex-c-b">
            <span class="sp">添加参与人</span>
            <van-icon name="arrow" />
          </p>
        </li>
        <li v-for="(item, index) in list" :key="index" class="flex-c-s">
          <van-image round :src="item.headPortrait" />
          <p class="flex-c-b">
            <span>{{ item.name }}</span>
          </p>
        </li>
      </ul>
    </div>
    <van-button :hidden="isHidden" class="confirm-btn" type="primary" @click="submit" round>
      确定开始
    </van-button>
    <van-popup v-model="showPopup" position="right" get-container="body" duration="0.2">
      <div class="check-detail" v-if="showPopup">
        <contacts :list="doctorList" :selected="list" @backClick="showPopup = false" @confirm="onConfirm" />
      </div>
    </van-popup>
  </div>
</template>

<script>
import * as types from '@store/mutations/mutations-types'
import { mapGetters } from 'vuex'
import contacts from './contacts'
import storage from 'store'
const resetFormData = () => {
  return {
    reason: '', // 申请原因
    imUserids: '' // 群组成员
  }
}
const autoRetry = async (func, interval = 2000) => {
  let res
  try {
    res = await func()
  } catch (error) {
    // 获取失败等一段时间再次获取
    await new Promise(resolve => setTimeout(resolve, interval))
    res = await autoRetry(func, interval)
  }
  return res
}
export default {
  name: 'consultationAdd',
  components: { contacts },
  props: ['selectedRow'],
  data() {
    return {
      isHidden: false,
      form: resetFormData(),
      showPopup: false,
      recordList: [],
      patientDetail: {
        name: '', // 姓名
        gender: '', // 性别
        age: '', // 年龄
        chiefComplaint: '', // 主诉
        diagnosis: '' // 初步诊断
      },
      list: [], // 选中的医生列表
      doctorList: [] // 全部医生列表
    }
  },
  computed: {
    ...mapGetters(['missionId', 'patientId', 'licensePlate', 'userId'])
  },
  created() {
    this.form.reason = this.selectedRow.reason
    this.getAllUser('')
  },
  methods: {
    findDoctorItem(id) {
      const flatList = []
      this.doctorList.forEach(el => {
        flatList.push(...el.val)
      })
      return flatList.find(el => el.id === id)
    },
    async getAllUser(param) {
      const res = await this.$api.getAllUser({
        queryValue: param
      })
      if (res?.body) {
        this.doctorList = Object.keys(res.body).map(key => {
          return { key, val: res.body[key] }
        })
        if (this.selectedRow) {
          this.list = (this.selectedRow.imUserids || '')
            .split(',')
            .map(id => this.findDoctorItem(id))
            .filter(el => el)
        }
      }
    },
    onConfirm(val) {
      this.showPopup = false
      if (val) {
        this.list = val
      }
      const ids = (val || []).map(item => item.imId)
      this.form.imUserids = ids.join()
    },
    backClick() {
      this.$emit('backClick')
    },
    addPeople() {
      this.showPopup = true
    },
    submit() {
      // 进入IM，先获取channelId
      console.log('submit=', this.userId)
      console.log('submit=', storage.get('businessToken'))
      console.log('submit=', this.selectedRow.name)
      this.$api
        .mccSaveOrUpdate({
          ...this.form,
          patientId: this.patientId,
          patientName: this.selectedRow.name,
          licensePlate: this.licensePlate,
          userId: this.userId,
          jwtToken: storage.get('businessToken')
        })
        .then(response => {
          console.log('response=', response)
          if (response.code && response.code === '000000') {
            this.$bridge.callhandler('openLink', {
              url: response.body
            })
          } else {
            this.$notify({ type: 'warning', message: response.message })
          }
        })
        .catch(_err => {
          console.log(_err)
          this.$notify({ type: 'warning', message: '建群失败' })
        })
    }
  },
  watch: {
    selectedRow: {
      handler(v) {
        if (v) {
          this.list = (v.imUserids || '')
            .split(',')
            .map(id => this.findDoctorItem(id))
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.consultation-add-wrapper {
  // padding-bottom: 150px;
  background: #f2f4f5;

  /deep/ .van-sticky.van-sticky--fixed {
    top: 150px;

    .van-tabs__wrap {
      height: 100px;
    }
  }

  .consultation-add-top {
    position: sticky;
    top: -180px;
    z-index: 999;
    height: 322px;
    background: linear-gradient(45deg, #3139cb, #5563e4);
    -moz-box-shadow: 0px 3px 30px #a6a6a6;
    -webkit-box-shadow: 0px 3px 30px #a6a6a6;
    box-shadow: 0px 3px 20px #a6a6a6;

    /deep/ .med-header-wrapper .van-nav-bar {
      background: transparent;
    }

    .consultation-add-name {
      background: #fff;
      width: 90%;
      background: #ffffff;
      border-radius: 15px;
      margin: 0 auto;
      position: absolute;
      bottom: -20px;
      left: 0;
      right: 0;
      -moz-box-shadow: 0px 3px 10px #a6a6a6;
      -webkit-box-shadow: 0px 3px 10px #a6a6a6;
      box-shadow: 0px 3px 10px #a6a6a6;
      padding: 0 45px;
      box-sizing: border-box;

      p {
        &.spec {
          span {
            font-size: @font-md-size;

            &.oneL {
              font-size: @font-md-size;
              line-height: 1.6;
              margin-left: 20px;
            }
          }
        }

        span {
          font-size: @font-md-size;
          line-height: 2.2;
          color: #202020;

          &.one {
            margin-right: 16px;
          }

          &.oneC {
            color: #696969;
            display: inline-block;
            min-width: 150px;
          }
        }
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

    .consultation-add-temp {
      font-size: 0.48rem;
      color: #fff;
      padding: 1.2rem 0.52rem 0.52rem;

      /deep/ .med-select-wrapper {
        width: 2.8rem;
      }

      /deep/ .med-select-value {
        color: #fff;
      }

      /deep/ .iconicon1-141,
      .iconicon1-221 {
        font-size: 0.48rem;
        font-weight: 100;
      }

      .consultation-add-relation {
        padding: 0 0 0 0.5rem;
      }
    }
  }

  .consultation-add-main {
    margin-top: 50px;
    background: #fff;
    padding: 40px 28px;

    h3 {
      font-size: 30px;
      color: #696969;
    }

    .van-field {
      background: #fafafa;
      border-radius: 20px;
      margin-top: 20px;
    }
  }

  .consultation-add-bottom {
    padding: 20px;
    margin-top: 20px;
    background: #fff;
    max-height: 60vh;
    overflow: auto;

    .iconicon1-311 {
      font-size: 70px;
      color: #5e74fe;
      margin-right: 25px;
    }

    ul {
      li {
        padding-bottom: 30px;

        .van-image {
          width: 60px;
          height: 60px;
          border-radius: 10px;
          margin-right: 20px;
        }

        .van-icon {
          font-size: @font-lg-size;
          color: #464c5f;

          &:nth-of-type(1) {
            font-size: @font-xl-size;
          }
        }

        p {
          border-bottom: 1px solid #dadada;
          width: 100%;

          span {
            line-height: 2.5;
            font-size: @font-lg-size;

            &.sp {
              color: #ccc;
            }
          }
        }
      }
    }
  }

  .confirm-btn {
    position: fixed;
    bottom: 120px;
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
