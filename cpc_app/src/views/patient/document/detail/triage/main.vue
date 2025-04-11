<template>
  <div class="content-wrapper">
    <van-form ref="triage">
      <van-index-bar :index-list="indexList" :sticky="false">
        <van-index-anchor index="1"><med-title title="接诊"/></van-index-anchor>
        <admission
          :data="data.admission"
          :dataMain="data.main"
          :dataRegist="data.regist"
          @showimport="showimport"
          :disabled="disabled"
          @change="onEntityChanged"
        />
        <van-index-anchor
v-if="showEmrgencyVitalsigns"
index="2"
          ><med-title
title="院内生命体征"
        /></van-index-anchor>
        <vitalsigns
          v-if="showEmrgencyVitalsigns"
          :data="data.admission"
          :disabled="disabled"
          style="margin-top:4px;"
          @change="onEntityChanged"
        />
        <van-index-anchor
v-if="showEmrgencyVitalsigns"
index="3"
          ><med-title
title="分诊结果"
        /></van-index-anchor>
        <outcome
          v-if="showEmrgencyVitalsigns"
          :data="data.admission"
          :disabled="disabled"
          style="margin-top:4px;"
          @change="onEntityChanged"
        />
      </van-index-bar>
    </van-form>
  </div>
</template>

<script>
import admission from './admission'
import vitalsigns from './vitalsigns'
import outcome from './outcome'
import { debounce } from 'lodash'
export default {
  name: 'Triage',
  components: {
    admission,
    vitalsigns,
    outcome
  },
  props: {
    data: {
      required: true,
      type: Object
    },
    disabled: {
      required: false,
      type: Boolean
    }
  },
  data() {
    return {
      indexList: [1, 2, 3],
      active: 0,
      registId: this.$route.query.registId
    }
  },
  computed: {
    showEmrgencyVitalsigns() {
      if (
        this.data.prehospital.isBypassEm === '1' &&
        this.data.prehospital.isBypassCcu === '1'
      ) {
        return false
      } else {
        return true
      }
    }
  },
  created() {},
  methods: {
    showimport(item) {
      this.$emit('showimport', item)
    },
    save: debounce(function() {
      this.data.admission.registId = this.registId
      this.$api.service
        .saveAdmission(this.data.admission)
        .then(res => {
          if (res.status === 200) {
            this.data.admission.timeStamp = res.result.timeStamp
            this.data.regist.isReport = '0'
            this.$emit('notifyReportStatus', this.data)
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    saveRegist: debounce(function() {
      this.data.regist.id = this.registId
      this.$api.service
        .saveRegist(this.data.regist)
        .then(res => {
          if (res.status === 200) {
            this.data.regist.timeStamp = res.result.timeStamp
            this.data.regist.isReport = '0'
            this.$emit('notifyReportStatus', this.data)
            this.$notify({ type: 'success', message: '保存成功' })
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    saveMain: debounce(function() {
      this.data.main.registId = this.registId
      this.$api.service
        .saveMain(this.data.main)
        .then(res => {
          if (res.status === 200) {
            this.data.main.timeStamp = res.result.timeStamp
            this.data.regist.isReport = '0'
            this.$emit('notifyReportStatus', this.data)
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    saveEcg: debounce(function() {
      var ordrNo = 0
      this.data.admissionEcgList.forEach(opt => {
        opt.registId = this.registId
        opt.flag = 2
        opt.orderNo = ordrNo++
      })
      this.$api.service.saveEcg(this.data.admissionEcgList).then(res => {
        if (res.status === 200) {
          this.data.regist.isReport = '0'
          this.$emit('notifyReportStatus', this.data)
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, 300),
    onEntityChanged(type) {
      if (type === '1') {
        this.save()
      } else if (type === '2') {
        this.saveMain()
      }
    },
    validate() {
      return this.$refs['triage'].validate()
    }
  },
  watch: {
    // 'data.admissionEcgList': {
    //   immediate: false,
    //   handler(e) {
    //     this.saveEcg()
    //     clearTimeout(detectionSaveTimer)
    //     detectionSaveTimer = setTimeout(() => {
    //       this.saveDetection()
    //       this.detectionDirty = true
    //     }, 2000)
    //   },
    //   deep: true
    // }
  }
}
</script>

<style lang="less" scoped>
@import '@/views/patient/document/detail/detail.less';
</style>
