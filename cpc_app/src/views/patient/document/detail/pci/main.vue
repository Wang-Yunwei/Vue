<template>
  <div class="content-wrapper">
    <van-form ref="pci">
      <van-index-bar :index-list="indexList" :sticky="false">
        <van-index-anchor
v-if="bjPci"
index="1"
          ><med-title
title="补救PCI"
        /></van-index-anchor>
        <remedypci
          :data="data.treatmentPci"
          v-if="bjPci"
          :disabled="disabled"
          @change="onChanged"
        />
        <van-index-anchor
v-if="rshPci"
index="2"
          ><med-title
title="溶栓后介入"
        /></van-index-anchor>
        <rspci
          :data="data.treatmentPci"
          v-if="rshPci"
          :disabled="disabled"
          @change="onChanged"
        />
        <van-index-anchor
v-if="zjPci || jjPci"
index="3"
          ><med-title
title="介入手术"
        /></van-index-anchor>
        <operation
          :data="data.treatmentPci"
          :dataPciPart="data.treatmentPciPartList"
          :dataAdmission="data.admission"
          :disabled="disabled"
          v-if="zjPci || jjPci"
          :zj-pci="zjPci"
          @change="onChanged"
        />
        <van-index-anchor
index="4"
          ><med-title
title="冠脉造影"
        /></van-index-anchor>
        <cag
          :data="data"
          :disabled="disabled"
          :dataAdmission="data.admission"
          style="margin-top:4px;"
          @change="onChanged"
        />
        <van-index-anchor
index="5"
          ><med-title
title="手术器械"
        /></van-index-anchor>
        <instruments
          :data="data.treatmentPci"
          :disabled="disabled"
          style="margin-top:4px;"
          @change="onChanged"
        />
      </van-index-bar>
    </van-form>
  </div>
</template>

<script>
import operation from './operation'
import remedypci from './remedypci'
import rspci from './rspci'
import cag from './cag'
import instruments from './instruments'
import { debounce } from 'lodash'
export default {
  name: 'PCI',
  components: {
    operation,
    cag,
    instruments,
    remedypci,
    rspci
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
    bjPci: {
      required: false,
      type: Boolean
    },
    zjPci: {
      required: false,
      type: Boolean
    },
    rshPci: {
      required: false,
      type: Boolean
    },
    jjPci: {
      required: false,
      type: Boolean
    }
  },
  data() {
    return {
      indexList: [1, 2, 3, 4, 5],
      active: 0,
      registId: this.$route.query.registId
    }
  },
  computed: {
    showOper() {
      if (
        this.data.treatment.isReperfusion === '1' &&
        this.data.treatment.reperfusionMeasure === '5' &&
        this.data.treatment.pciTransferType === '2'
      ) {
        return false
      } else if (
        this.data.treatment.reperfusionMeasure === '2' &&
        (this.data.treatment.rsStrategy === '21' ||
          this.data.treatment.rsStrategy === '22')
      ) {
        return false
      } else {
        return true
      }
    }
  },
  created() {},
  methods: {
    save: debounce(function(callback) {
      this.data.treatmentPci.registId = this.registId
      this.$api.service
        .saveTreatmentPci(this.data.treatmentPci)
        .then(res => {
          if (res.status === 200) {
            this.data.treatmentPci.timeStamp = res.result.timeStamp
            this.data.regist.isReport = '0'
            this.$emit('notifyReportStatus', this.data)
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }

          if (callback) {
            callback()
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    savePciPart: debounce(function() {
      this.data.treatmentPciPartList.forEach(opt => {
        opt.registId = this.registId
      })
      this.$api.service
        .saveTreatmentPciPart(this.data.treatmentPciPartList)
        .then(res => {
          if (res.status === 200) {
            this.data.regist.isReport = '0'
            this.$emit('notifyReportStatus', this.data)
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
    }, 300),
    onChanged(type, callback) {
      if (type === 'treatmentPci') {
        this.save(callback)
      } else if (type === 'treatmentPciPart') {
        this.savePciPart()
      } else {
      }
    },
    validate() {
      return this.$refs['pci'].validate()
    }
  },
  watch: {}
}
</script>

<style lang="less" scoped>
@import "@/views/patient/document/detail/detail.less";
</style>
