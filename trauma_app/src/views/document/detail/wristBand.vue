<template>
  <med-popup-container :title="tagId ? '腕带信息' : '绑定腕带'" v-bind="$attrs" v-on="$listeners" @backClick="$emit('close', radio)">
    <div style="overflow: scroll;height: calc(100vh - 2.3rem);">
      <div v-if="tagId" style="margin: 0.3rem;">
        <div class="cellA" style="margin: 0.12rem 0 0.7rem 0;">
          <div v-for="(item, index) in listB" :key="index" class="cellB">
            <div style="flex:1;font-size: 0.4rem;">
              <div style="margin-bottom: 0.2rem;">
                <span>{{ item.label + '首次感应时间' }}</span>
                <span style="margin-left: 0.3rem;color: grey;"> {{ item.startTime ? item.startTime : '暂无数据' }}</span>
              </div>
              <div>
                <span>{{ item.label + '末次感应时间' }}</span>
                <span style="margin-left: 0.3rem;color: grey;"> {{ item.endTime ? item.endTime : '暂无数据' }}</span>
              </div>
            </div>
            <div style="line-height: 1.3rem;">
              <van-button plain hairline round size="small" color="rgb(94,116,254)" :disabled="item.disabled" @click="item.startTime || item.endTime ? importWristTime(item) : ''">
                导入
              </van-button>
            </div>
          </div>
        </div>
        <div style="display: flex;justify-content: center;">
          <van-button round color='rgb(94,116,254)' style="width: 9.3rem;height: 1rem;" @click="unBindWrist">
            解绑腕带
          </van-button>
        </div>
      </div>
      <div v-else>
        <van-radio-group v-model="radio">
          <van-cell v-for="(item, index) in list" :key="index" :title="item.tagName + ' (' + item.tagId + ')'" clickable @click="bindWrist(item)">
            <template #right-icon>
              <van-radio :name="item.tagName" />
            </template>
          </van-cell>
        </van-radio-group>
      </div>
    </div>
  </med-popup-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'wristBand',
  model: {
    prop: 'show',
    event: '_change'
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    tagId: {
      type: String,
      default: null
    },
    tagName: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      radio: '',
      list: [],
      form: {}
    }
  },
  computed: {
    ...mapGetters(['hospitalId', 'hospitalArea', 'patientName', 'registId']),
    listB() {
      return [
        { label: '抢救室', startTime: this.form.rescueEnterTime, endTime: this.form.rescueLeaveTime, timeType: '1', disabled: false },
        { label: '急救CT', startTime: this.form.ctEnterTime, endTime: this.form.ctLeaveTime, timeType: '2', disabled: true },
        { label: '手术室', startTime: this.form.orEnterTime, endTime: this.form.orLeaveTime, timeType: '3', disabled: false }
      ]
    }
  },
  methods: {
    importWristTime(val) {
      // 导入腕带时间
      this.$api.importWristTime({
        ...val,
        startTime: this.$moment(val.startTime).format('YYYY-MM-DD HH:mm'),
        endTime: this.$moment(val.endTime).format('YYYY-MM-DD HH:mm'),
        registId: this.registId
      }).then(res => {
        if (res.code === '000000') {
          this.$notify({
            type: 'success',
            message: `【到达${val.label}时间】导入成功\n【离开${val.label}时间】导入成功`
          })
        }
      })
    },
    unBindWrist() {
      // 解除绑定
      this.$dialog.confirm({
        title: '提示',
        message: `确定要给患者【${this.patientName}】解绑腕带【${this.tagName}】?`,
        confirmButtonColor: 'rgb(94,116,254)'
      }).then(() => {
        let num = 0
        this.$toast.loading({
          message: '解绑中...',
          forbidClick: true,
          duration: num
        })
        this.$api.unBindRfTagId({
          hospitalId: this.hospitalId + '_' + this.hospitalArea,
          registId: this.registId,
          rfTagId: this.tagId,
          type: '2'
        }).then(res => {
          num = -1
          if (res.code === '000000') {
            this.$toast.success('解绑成功')
            this.$emit('close')
          } else {
            this.$toast.fail('解绑失败')
          }
        }).catch(() => {
          num = -1
          this.$toast.fail('解绑失败')
        })
      }).catch(() => { })
    },
    initWrist() {
      if (this.tagId) {
        this.$api.getTagInfo(this.registId).then(res => {
          if (res.code === '000000' && res.body) {
            this.form = res.body
          }
        })
      } else {
        // 获取腕带列表
        this.$api
          .getRfTagList({ hospitalId: this.hospitalId })
          .then(res => {
            if (res.code === '000000') {
              this.list = res.body
            }
          })
      }
    },
    bindWrist(val) {
      // 校验腕带是否已经绑定
      this.$api.checkWrist(val.tagId).then(res => {
        if (res.code === '000000' && !res.body.hasBonded) {
          // 确认是否绑定腕带
          this.$dialog.confirm({
            title: '提示',
            message: `确定要给患者【${this.patientName}】绑定腕带【${val.tagName}】?`,
            confirmButtonColor: 'rgb(94,116,254)'
          }).then(() => {
            this.$api.bindRfTagId({
              hospitalId: this.hospitalId + '_' + this.hospitalArea,
              registId: this.registId,
              rfTagId: val.tagId,
              rfTagName: val.tagName
            }).then(res => {
              if (res.code === '000000') {
                this.$emit('close')
              } else {
                this.$notify({ type: 'danger', message: '腕带绑定失败' })
              }
            })
          }).catch(() => {
            this.radio = ''
          })
        } else {
          const message = res.body.tagUser.patientName ? `此腕带已绑定患者【${res.body.tagUser.patientName}】,确定要解绑并重新绑定患者【${this.patientName}】?` : `此腕带已绑定其他患者，确定要解绑并重新绑定患者【${this.patientName}】 ?`
          this.$dialog.confirm({
            title: '提示',
            message: message,
            confirmButtonColor: 'rgb(94,116,254)'
          }).then(() => {
            this.$api.bindRfTagId({
              hospitalId: this.hospitalId + '_' + this.hospitalArea,
              registId: this.registId,
              rfTagId: val.tagId,
              rfTagName: val.tagName
            }).then(res => {
              if (res.code === '000000') {
                this.$emit('close')
              } else {
                this.$notify({ type: 'danger', message: '腕带绑定失败' })
              }
            })
          }).catch(() => {
            this.radio = ''
          })
        }
      })
    }
  },
  watch: {
    isShow(val) {
      if (val) {
        this.initWrist()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cellB {
  display: flex;
  border-bottom: 1px solid #ebedf0;
  padding: 0.64rem 0;
}

.cellA div:last-child {
  border-bottom: none;
}
</style>
