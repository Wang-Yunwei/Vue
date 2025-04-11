<template>
  <div class="task-basic-info-wrapper">
    <div class="task-part-title">
      <span class="solid" />
      <span>分检诊</span>
    </div>
    <van-cell-group>
      <med-fast-date-field
        required
        v-model="triDet.triage.arriveHospitalTime"
        label="到院时间"
      />
      <med-fast-date-field
        required
        v-model="triDet.triage.triageTime"
        label="急诊分诊时间"
        clearable
      />
      <med-fast-date-field
        required
        v-model="triDet.triage.triageVisitTime"
        label="急诊医生接诊时间"
        clearable
      />
      <med-fast-date-field
        v-model="triDet.triage.strokeNotifyTime"
        label="通知卒中医生时间"
        clearable
      />
      <med-fast-date-field
        v-model="triDet.triage.strokeVisitTime"
        label="卒中医生接诊时间"
        clearable
      />
      <med-radio-button-field
        name="isAfterWakeup"
        v-model="triDet.triage.isAfterWakeup"
        label="是否为醒后卒中"
        required
        :select-options="yesNoOption"
      />
      <!-- <van-cell required title="是否为醒后卒中">
        <van-radio-group
          class="flex-c-s radio-btn-type"
          v-model="triDet.triage.isAfterWakeup"
        >
          <van-radio
            v-for="item in yesNoOption"
            :key="item.value"
            :name="item.value"
          >
            {{ item.label }}
          </van-radio>
        </van-radio-group>
      </van-cell> -->
      <med-fast-date-field
        v-if="triDet.triage.isAfterWakeup === '0'"
        required
        v-model="triDet.triage.onsetTime"
        label="发病时间"
        clearable
      />
      <med-fast-date-field
        v-if="triDet.triage.isAfterWakeup === '1'"
        required
        v-model="triDet.triage.lastHealthyTime"
        label="最后看起来正常时间"
        clearable
      />
      <med-fast-date-field
        v-if="triDet.triage.isAfterWakeup === '1'"
        required
        v-model="triDet.triage.awareTime"
        label="发现时间"
        clearable
      />
      <med-fast-date-field
        required
        v-model="triDet.detection.bloodCollectionTime"
        label="采血时间"
        clearable
      />
      <med-fast-date-field
        v-model="triDet.triage.bloodGlucoseTime"
        label="快速血糖时间"
        clearable
      />
      <med-fast-date-field
        v-model="triDet.triage.openveinTime"
        label="开通静脉通道时间"
        clearable
      />
      <med-fast-date-field
        v-model="triDet.triage.rrEnterTime"
        label="入抢时间"
        clearable
      />
      <med-fast-date-field
        v-model="triDet.triage.rrLeaveTime"
        label="出抢时间"
        clearable
      />
      <div class="task-part-title">
        <span class="solid" />
        <span>心电图</span>
      </div>
      <med-fast-date-field
        required
        v-model="triDet.withinEcg.ecgTime"
        label="心电图完成时间"
        clearable
      />
      <div class="task-part-title">
        <span class="solid" />
        <span>检验</span>
      </div>
      <med-fast-date-field
        required
        v-model="triDet.bloodRoutine.reportTime"
        label="血常规报告时间"
        clearable
      />
      <med-fast-date-field
        required
        v-model="triDet.coagulationRoutine.reportTime"
        label="凝血常规报告时间"
        clearable
      />
      <med-fast-date-field
        required
        v-model="triDet.liverElectrolyte.reportTime"
        label="肝肾功及电解质报告时间"
        clearable
      />
      <div class="task-part-title">
        <span class="solid" />
        <span>检查</span>
      </div>
      <med-fast-date-field
        required
        v-model="triDet.detection.skullCtTime"
        label="开具头颅CT单时间"
        clearable
      />
      <med-fast-date-field
        v-model="triDet.detection.ctEnterTime"
        label="进入CT室时间"
        clearable
      />
      <med-fast-date-field
        v-model="triDet.detection.ctLeaveTime"
        label="离开CT室时间"
        clearable
      />
      <med-fast-date-field
        required
        v-model="triDet.ctImage.finishTime"
        label="CT平扫检查完成时间"
        clearable
      />
      <med-fast-date-field
        v-model="triDet.ctaImage.finishTime"
        label="CTA检查完成时间"
        clearable
      />
      <med-fast-date-field
        v-model="triDet.ctpImage.finishTime"
        label="CTP检查完成时间"
        clearable
      />
      <med-fast-date-field
        v-model="triDet.mriImage.applyTime"
        label="MRI开单时间"
        clearable
      />
      <med-fast-date-field
        v-model="triDet.mriImage.finishTime"
        label="MRI检查完成时间"
        clearable
      />
      <med-fast-date-field
        v-model="triDet.mraImage.finishTime"
        label="MRA检查完成时间"
        clearable
      />
      <med-fast-date-field
        v-model="triDet.dwiImage.finishTime"
        label="DWI检查完成时间"
        clearable
      />
      <med-fast-date-field
        v-model="triDet.pwiImage.finishTime"
        label="PWI检查完成时间"
        clearable
      />
    </van-cell-group>
  </div>
</template>
<script>
import dateMixin from '@mixins/dateMixin'
import { yesNoOption } from '@constant/commonConstant'
import { GcDetection, GcImage, GcTriage, GcLis, Ecg } from '@model/commonModel'
import { throttle } from 'lodash'
import { validateTimeSequence } from '@/utils/validate'

const timeout = 2000

export default {
  mixins: [dateMixin],
  data() {
    return {
      registId: this.$route.query.registId,
      // 页面数据
      triDet: {
        triage: { ...GcTriage(), registId: this.$route.query.registId },
        detection: { ...GcDetection(), registId: this.$route.query.registId },
        // 心电图
        withinEcg: {
          ...Ecg(),
          registId: this.$route.query.registId,
          ecgType: '1'
        },
        // 血常规
        bloodRoutine: {
          ...GcLis(),
          itemType: '1',
          registId: this.$route.query.registId
        },
        // 凝血常规
        coagulationRoutine: {
          ...GcLis(),
          itemType: '2',
          registId: this.$route.query.registId
        },
        // 肝肾功及电解质
        liverElectrolyte: {
          ...GcLis(),
          itemType: '3',
          registId: this.$route.query.registId
        },
        ctImage: {
          ...GcImage(),
          registId: this.$route.query.registId,
          itemType: '1'
        },
        ctaImage: {
          ...GcImage(),
          registId: this.$route.query.registId,
          itemType: '2'
        },
        ctpImage: {
          ...GcImage(),
          registId: this.$route.query.registId,
          itemType: '3'
        },
        mriImage: {
          ...GcImage(),
          registId: this.$route.query.registId,
          itemType: '4'
        },
        mraImage: {
          ...GcImage(),
          registId: this.$route.query.registId,
          itemType: '5'
        },
        dwiImage: {
          ...GcImage(),
          registId: this.$route.query.registId,
          itemType: '6'
        },
        pwiImage: {
          ...GcImage(),
          registId: this.$route.query.registId,
          itemType: '7'
        }
      },
      yesNoOption
    }
  },
  // 钩子方法
  created() {
    this.getDiagnosisTime()
  },
  methods: {
    // 更新影像时间
    updateImage: throttle(function(data) {
      const req = { ...data }
      this.$api.image.timeCollection(req).then(res => {
        if (res.status === 200) {
          this.$notify({ type: 'success', message: '保存成功' })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, timeout),
    // 更新分诊时间
    updateTriage: throttle(function(data) {
      const req = { ...data }
      this.$api.triage.timeCollection(req).then(res => {
        if (res.status === 200) {
          this.$notify({ type: 'success', message: '保存成功' })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, timeout),
    // 更新检诊时间
    updateDetection: throttle(function(data) {
      const req = { ...data }
      this.$api.detection.timeCollection(req).then(res => {
        if (res.status === 200) {
          this.$notify({ type: 'success', message: '保存成功' })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, timeout),
    // 更新心电图完成时间
    updateEcg: throttle(function(data) {
      const req = { ...data }
      this.$api.ecg.timeCollection(req).then(res => {
        if (res.status === 200) {
          this.triDet.withinEcg = { ...this.triDet.withinEcg, id: res.result }
          this.$notify({ type: 'success', message: '保存成功' })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, timeout),
    // 更新实验室时间
    updateLis: throttle(function(data) {
      const req = { ...data }
      this.$api.lis.timeCollection(req).then(res => {
        if (res.status === 200) {
          this.$notify({ type: 'success', message: '保存成功' })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, timeout),
    // 获取分检诊
    getDiagnosisTime() {
      this.$api.timeManagement
        .getTimeManagement(this.registId, '2')
        .then(({ result }) => {
          this.$preventWatch(() => {
            this.triDet = { ...this.triDet, ...result }
          })
          validateTimeSequence(this.triDet.triage, 'triage')
          validateTimeSequence(
            {
              ...this.triDet.detection,
              gcLisList: [
                this.triDet.bloodRoutine,
                this.triDet.coagulationRoutine,
                this.triDet.liverElectrolyte
              ],
              gcImageList: [this.triDet.ctImage]
            },
            'detection'
          )
        })
    }
  },
  watch: {
    // 是否为醒后卒中
    'triDet.triage.isAfterWakeup': {
      immediate: false,
      handler() {
        if (this.triDet.triage.isAfterWakeup === '1') {
          this.$set(this.triDet.triage, 'onsetTime', '')
        } else if (this.triDet.triage.isAfterWakeup === '0') {
          this.$set(this.triDet.triage, 'lastHealthyTime', '')
          this.$set(this.triDet.triage, 'awareTime', '')
        }
      }
    },
    // 分诊
    'triDet.triage': {
      immediate: false,
      handler(newVal, oldVal) {
        const isTimeValid = validateTimeSequence(newVal, 'triage')
        this.updateTriage(newVal)
      },
      deep: true
    },
    // 检诊
    'triDet.detection': {
      immediate: false,
      handler(newVal, oldVal) {
        const isTimeValid = validateTimeSequence(
          {
            ...this.triDet.detection,
            gcLisList: [
              this.triDet.bloodRoutine,
              this.triDet.coagulationRoutine,
              this.triDet.liverElectrolyte
            ],
            gcImageList: [this.triDet.ctImage]
          },
          'detection'
        )
        this.updateDetection(newVal)
      },
      deep: true
    },
    'triDet.withinEcg': {
      immediate: false,
      handler(newVal, oldVal) {
        this.updateEcg(newVal)
      },
      deep: true
    },
    // 实验室血常规
    'triDet.bloodRoutine': {
      immediate: false,
      handler(newVal, oldVal) {
        const isTimeValid = validateTimeSequence(
          {
            ...this.triDet.detection,
            gcLisList: [
              this.triDet.bloodRoutine,
              this.triDet.coagulationRoutine,
              this.triDet.liverElectrolyte
            ],
            gcImageList: [this.triDet.ctImage]
          },
          'detection'
        )
        this.updateLis(newVal)
      },
      deep: true
    },
    // 实验室凝血常规
    'triDet.coagulationRoutine': {
      immediate: false,
      handler(newVal, oldVal) {
        const isTimeValid = validateTimeSequence(
          {
            ...this.triDet.detection,
            gcLisList: [
              this.triDet.bloodRoutine,
              this.triDet.coagulationRoutine,
              this.triDet.liverElectrolyte
            ],
            gcImageList: [this.triDet.ctImage]
          },
          'detection'
        )
        this.updateLis(newVal)
      },
      deep: true
    },
    // 实验室肝肾功及电解质
    'triDet.liverElectrolyte': {
      immediate: false,
      handler(newVal, oldVal) {
        const isTimeValid = validateTimeSequence(
          {
            ...this.triDet.detection,
            gcLisList: [
              this.triDet.bloodRoutine,
              this.triDet.coagulationRoutine,
              this.triDet.liverElectrolyte
            ],
            gcImageList: [this.triDet.ctImage]
          },
          'detection'
        )
        this.updateLis(newVal)
      },
      deep: true
    },
    // 影像学CT
    'triDet.ctImage': {
      immediate: false,
      handler(newVal, oldVal) {
        const isTimeValid = validateTimeSequence(
          {
            ...this.triDet.detection,
            gcLisList: [
              this.triDet.bloodRoutine,
              this.triDet.coagulationRoutine,
              this.triDet.liverElectrolyte
            ],
            gcImageList: [this.triDet.ctImage]
          },
          'detection'
        )
        this.updateImage(newVal)
      },
      deep: true
    },
    // 影像学CTA
    'triDet.ctaImage': {
      immediate: false,
      handler(newVal, oldVal) {
        this.updateImage(newVal)
      },
      deep: true
    },
    // 影像学CTP
    'triDet.ctpImage': {
      immediate: false,
      handler(newVal, oldVal) {
        this.updateImage(newVal)
      },
      deep: true
    },
    // 影像学MRI
    'triDet.mriImage': {
      immediate: false,
      handler(newVal, oldVal) {
        this.updateImage(newVal)
      },
      deep: true
    },
    // 影像学MRA
    'triDet.mraImage': {
      immediate: false,
      handler(newVal, oldVal) {
        this.updateImage(newVal)
      },
      deep: true
    },
    // 影像学DWI
    'triDet.dwiImage': {
      immediate: false,
      handler(newVal, oldVal) {
        this.updateImage(newVal)
      },
      deep: true
    },
    // 影像学PWI
    'triDet.pwiImage': {
      immediate: false,
      handler(newVal, oldVal) {
        this.updateImage(newVal)
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
