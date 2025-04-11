<template>
  <div class="content-wrapper">
    <van-form ref="cure">
      <van-index-bar :index-list="indexList" :sticky="false">
        <van-index-anchor index="1">
          <med-title title="用药治疗">
            <template #right>
              <a
                v-if="
                  (data.regist.comeType === '1' ||
                    data.regist.comeType === '2') &&
                    data.prehospital.isAntiplatelet === '1' &&
                    data.prehospital.antiplatelet != null &&
                    data.prehospital.antiplatelet.length > 0
                "
                href="javascript:void(0)"
                @click="showPhepAntiplatelet"
                >院前已双抗</a
              >
            </template>
          </med-title>
        </van-index-anchor>
        <medicine
          ref="cure_medicine"
          :data="data.treatment"
          :dataPrehospital="data.prehospital"
          :disabled="disabled"
          @change="onChanged"
        />
        <van-index-anchor
          v-if="
            data.inspection.diagnosis !== '1' &&
              data.inspection.graceRehazardLevel !== '0'
          "
          index="2"
          ><med-title
title="处理策略"
        /></van-index-anchor>
        <measures
          :data="data.treatment"
          :disabled="disabled"
          style="margin-top:4px;"
          @change="onChanged"
          v-if="
            this.data.inspection.diagnosis !== '1' &&
              this.data.inspection.graceRehazardLevel !== '0'
          "
        />
        <van-index-anchor
v-if="showReperfusion"
index="3"
          ><med-title
title="再灌注措施"
        /></van-index-anchor>
        <reperfusion
          :data="data.treatment"
          :disabled="disabled"
          style="margin-top:4px;"
          :stemi="stemi"
          @change="onChanged"
          @onReperfusionChanged="onReperfusionChanged"
          v-if="showReperfusion"
        />
        <van-index-anchor
v-if="showPPCI"
index="4"
          ><med-title
title="直接PCI"
        /></van-index-anchor>
        <ppci
          :data="data.treatment"
          v-if="showPPCI"
          :disabled="disabled"
          style="margin-top:4px;"
          @change="onChanged"
        />
        <!-- <remedypci
          :data="data.treatment"
          v-if="showRemedyPCI"
          :disabled="disabled"
          style="margin-top:4px;"
          @change="onChanged"
        /> -->
        <van-index-anchor
v-if="showThrombolysis"
index="5"
          ><med-title
title="溶栓治疗"
        /></van-index-anchor>
        <thrombolysis
          :data="data.treatment"
          v-if="showThrombolysis"
          :disabled="disabled"
          style="margin-top:4px;"
          @change="onChanged"
        />
        <van-index-anchor
v-if="showElectivePCI"
index="6"
          ><med-title
title="择期介入"
        /></van-index-anchor>
        <electivepci
          :data="data.treatment"
          v-if="showElectivePCI"
          :disabled="disabled"
          style="margin-top:4px;"
          @change="onChanged"
        />
        <van-index-anchor
v-if="showCABG"
index="7"
          ><med-title
title="CABG"
        /></van-index-anchor>
        <cabg
          :data="data.treatment"
          v-if="showCABG"
          :disabled="disabled"
          style="margin-top:4px;"
          @change="onChanged"
        />
        <van-index-anchor
v-if="showTransitPCI"
index="8"
          ><med-title
title="转运PCI"
        /></van-index-anchor>
        <transitpci
          :data="data.treatment"
          v-if="showTransitPCI"
          :disabled="disabled"
          style="margin-top:4px;"
          @change="onChanged"
        />
      </van-index-bar>
    </van-form>
    <med-loading v-model="showLoading" />
  </div>
</template>

<script>
import medicine from './medicine'
import reperfusion from './reperfusion'
import ppci from './ppci'
import thrombolysis from './thrombolysis'
import electivepci from './electivepci'
import cabg from './cabg'
import transitpci from './transitpci'
import measures from './measures'
import { debounce } from 'lodash'
import { Dialog } from 'vant'

export default {
  name: 'Cure',
  components: {
    medicine,
    reperfusion,
    ppci,
    thrombolysis,
    electivepci,
    cabg,
    transitpci,
    measures
  },
  props: {
    data: {
      required: true,
      type: Object
    },
    disabled: {
      required: false,
      type: Boolean
    },
    stemi: {
      required: false,
      type: Boolean
    }
  },
  data() {
    return {
      indexList: [1, 2, 3, 4, 5, 6, 7, 8],
      active: 0,
      registId: this.$route.query.registId,
      treatmentCheck: {
        modelName: 'treatment',
        registId: '',
        timeStamp: null,
        hadBeenModify: null
      },
      treatmentPciCheck: {
        modelName: 'treatmentpci',
        registId: '',
        timeStamp: null,
        hadBeenModify: null
      },
      showLoading: false
    }
  },
  computed: {
    cure() {
      return this.data.treatment
    },
    showPPCI() {
      if (
        this.stemi &&
        this.data.treatment.isReperfusion === '1' &&
        this.data.treatment.reperfusionMeasure === '1'
      ) {
        return true
      } else if (
        !this.stemi &&
        this.data.treatment.strategy === '2' &&
        this.data.treatment.invasiveStrategy === '1'
      ) {
        return true
      }
      return false
    },
    showRemedyPCI() {
      if (this.data.treatment.isReperfusion !== '1') return false
      if (!this.showThrombolysis) return false
      return this.data.treatment.strategy === '21'
    },
    showThrombolysis() {
      if (this.data.treatment.isReperfusion !== '1') return false
      if (!this.stemi) return false
      return this.data.treatment.reperfusionMeasure === '2'
    },
    showElectivePCI() {
      if (this.data.treatment.isReperfusion !== '1') return false
      return this.stemi && this.data.treatment.reperfusionMeasure === '3'
    },
    showCABG() {
      if (this.data.treatment.isReperfusion !== '1') return false
      return this.data.treatment.reperfusionMeasure === '4'
    },
    showTransitPCI() {
      if (this.data.treatment.isReperfusion !== '1') return false
      return this.stemi && this.data.treatment.reperfusionMeasure === '5'
    },
    showReperfusion() {
      if (
        this.data.inspection.diagnosis === '1' ||
        ((this.data.inspection.diagnosis === '2' ||
          this.data.inspection.diagnosis === '3') &&
          this.data.inspection.graceRehazardLevel === '0')
      ) {
        return true
      }
      return false
    }
  },
  created() {},
  methods: {
    showPhepAntiplatelet() {
      this.$refs['cure_medicine'].showPhepAntiplatelet()
    },
    async updateTimeStamp() {
      const res = await this.$api.service.updateTimeStamp(this.checkData)
      if (res.status === 200) {
        const treatmentCheck = res.result.find(
          m => m.modelName === 'treatment'
        )
        this.data.treatment.timeStamp = treatmentCheck?.timeStamp
        const treatmentPciCheck = res.result.find(
          m => m.modelName === 'treatmentpci'
        )
        this.data.treatmentPci.timeStamp = treatmentPciCheck?.timeStamp
      } else {
        this.$notify({ type: 'warning', message: res.message })
      }
    },
    async checkTimeStamp() {
      this.checkData = []
      this.treatmentCheck.registId = this.registId
      this.treatmentPciCheck.registId = this.registId
      this.treatmentCheck.timeStamp = this.data.treatment.timeStamp
      this.treatmentPciCheck.timeStamp = this.data.treatmentPci.timeStamp

      this.checkData.push(this.treatmentCheck)
      this.checkData.push(this.treatmentPciCheck)

      const res = await this.$api.service.checkTimeStamp(this.checkData)
      if (res.status === 200) {
        // this.checkReturnData = 'perhospital'
        const treatmentCheck = res.result.find(
          m => m.modelName === 'treatment'
        )
        if (treatmentCheck.hadBeenModify) {
          return treatmentCheck?.modelName
        }
        const treatmentPciCheck = res.result.find(
          m => m.modelName === 'treatmentpci'
        )
        if (treatmentPciCheck.hadBeenModify) {
          return treatmentPciCheck.modelName
        }
        return ''
      } else {
        this.$notify({ type: 'warning', message: res.message })
      }
    },
    save: debounce(function() {
      // console.log(this.data.inspection)
      this.data.treatment.registId = this.registId
      this.$api.service
        .saveTreatment(this.data.treatment)
        .then(res => {
          if (res.status === 200) {
            this.data.treatment.timeStamp = res.result.timeStamp
            this.data.regist.isReport = '0'
            this.$emit('notifyReportStatus', this.data)
            // this.$notify({ type: 'success', message: '保存成功' })
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    saveForceTreatment: debounce(function() {
      // console.log(this.data.inspection)
      this.data.treatment.registId = this.registId
      this.$api.service
        .saveForceTreatment(this.data.treatment)
        .then(res => {
          if (res.status === 200) {
            this.data.regist.isReport = '0'
            this.$emit('notifyReportStatus', this.data)
            // this.data.treatment.timeStamp = res.result.timeStamp
            // this.$notify({ type: 'success', message: '保存成功' })
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    onChanged(type) {
      if (type === 'treatment') {
        this.save()
      }
    },
    async onReperfusionChanged() {
      this.showLoading = true
      const value = await this.checkTimeStamp()
      if (value === 'treatment') {
        Dialog.alert({
          title: '提示',
          message: '院内信息已被编辑，系统将强制刷新',
          theme: 'round-button'
        }).then(() => {
          this.$emit('checkRefresh')
          this.showLoading = false
        })
      } else if (value === 'treatmentpci') {
        this.$dialog
          .confirm({
            title: '提示',
            message: '介入手术信息已被编辑过，是否覆盖?',
            confirmButtonText: '是',
            cancelButtonText: '否'
          })
          .then(() => {
            this.saveForceTreatment()
            this.updateTimeStamp()
            this.showLoading = false
          })
          .catch(() => {
            this.$emit('checkRefresh')
            this.showLoading = false
          })
      } else {
        this.save()
        this.updateTimeStamp()
        this.showLoading = false
      }
    },
    validate() {
      return this.$refs['cure'].validate()
    }
  },
  watch: {}
}
</script>

<style lang="less" scoped>
@import "@/views/patient/document/detail/detail.less";
</style>
