<template>
  <div class="content-wrapper">
    <van-form ref="discharge">
      <van-index-bar :index-list="indexList" :sticky="false">
        <van-index-anchor index="1">
          <med-title title="出院诊断"/>
      </van-index-anchor>
        <diagnosis
          v-show="indexBar1"
          :data="data.discharge"
          :dataMain="data.main"
          :dataRegist="data.regist"
          @showimport="showimport"
          :disabled="disabled"
          @change="onChanged"
        />
        <van-index-anchor
          v-if="
            data.discharge.diagnosis === '1' ||
              data.discharge.diagnosis === '2' ||
              data.discharge.diagnosis === '3'
          "
          index="2"
          ><med-title
title="危险因素"
        /></van-index-anchor>
        <riskfactors
          :data="data.discharge"
          :disabled="disabled"
          style="margin-top:4px;"
          @change="onChanged"
          v-show="indexBar2"
          v-if="
            data.discharge.diagnosis === '1' ||
              data.discharge.diagnosis === '2' ||
              data.discharge.diagnosis === '3'
          "
        />
        <van-index-anchor
          v-if="
            data.discharge.diagnosis === '1' ||
              data.discharge.diagnosis === '2' ||
              data.discharge.diagnosis === '3'
          "
          index="3"
          ><med-title
title="合并疾病"
        /></van-index-anchor>
        <complications
          :data="data.discharge"
          :disabled="disabled"
          style="margin-top:4px;"
          @change="onChanged"
          v-show="indexBar3"
          v-if="
            data.discharge.diagnosis === '1' ||
              data.discharge.diagnosis === '2' ||
              data.discharge.diagnosis === '3'
          "
        />
        <van-index-anchor
          v-if="
            data.discharge.diagnosis === '1' ||
              data.discharge.diagnosis === '2' ||
              data.discharge.diagnosis === '3'
          "
          index="4"
          ><med-title
title="检查结果"
        /></van-index-anchor>
        <test
          :data="data.discharge"
          :disabled="disabled"
          style="margin-top:4px;"
          @change="onChanged"
          @troponinH72Change="onTroponinH72Change"
          v-show="indexBar4"
          v-if="
            data.discharge.diagnosis === '1' ||
              data.discharge.diagnosis === '2' ||
              data.discharge.diagnosis === '3'
          "
        />
        <van-index-anchor
index="5"
          ><med-title
title="住院期间用药"
        /></van-index-anchor>
        <medicine
          v-show="indexBar5"
          :data="data.discharge"
          :disabled="disabled"
          style="margin-top:4px;"
          @change="onChanged"
        />
        <van-index-anchor
index="6"
          ><med-title
title="出院信息"
        /></van-index-anchor>
        <outcome
          v-show="indexBar6"
          :data="data.discharge"
          :dataTreatment="data.treatment"
          :disabled="disabled"
          style="margin-top:4px;"
          @change="onChanged"
        />
        <van-index-anchor
          v-if="
            data.discharge.outcomeCode == '1' &&
              (data.discharge.diagnosis === '1' ||
                data.discharge.diagnosis === '2' ||
                data.discharge.diagnosis === '3')
          "
          index="7"
          ><med-title
title="出院带药"
        /></van-index-anchor>
        <medicinetake
          v-show="indexBar7"
          v-if="
            data.discharge.outcomeCode == '1' &&
              (data.discharge.diagnosis === '1' ||
                data.discharge.diagnosis === '2' ||
                data.discharge.diagnosis === '3')
          "
          :data="data.discharge"
          :dischargeDrugsList1="data.dischargeDrugsList"
          :disabled="disabled"
          style="margin-top:4px;"
          @change="onChanged"
          ref="medicinetake"
          @onSaveException="onSaveException"
          @notifyReportChange="notifyReportChange"
        />
      </van-index-bar>
    </van-form>
  </div>
</template>

<script>
import diagnosis from './diagnosis'
import riskfactors from './riskfactors'
import complications from './complications'
import test from './test'
import medicine from './medicine'
import outcome from './outcome'
import medicinetake from './medicinetake'
import { debounce } from 'lodash'
export default {
  name: 'Discharge',
  components: {
    diagnosis,
    riskfactors,
    complications,
    test,
    medicine,
    outcome,
    medicinetake
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
      indexList: [1, 2, 3, 4, 5, 6, 7],
      active: 0,
      registId: this.$route.query.registId,
      ...{
        indexBar1: true,
        indexBar2: true,
        indexBar3: true,
        indexBar4: true,
        indexBar5: true,
        indexBar6: true,
        indexBar7: true
      }
    }
  },
  methods: {
    showimport(item) {
      this.$emit('showimport', item)
    },
    save: debounce(function() {
      this.data.discharge.registId = this.registId
      this.$api.service
        .saveDischarge(this.data.discharge)
        .then(res => {
          if (res.status === 200) {
            this.data.discharge.timeStamp = res.result.timeStamp
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
    saveTroponinH72: debounce(function(item) {
      this.data.discharge.troponinH72.registId = this.registId
      this.data.discharge.troponinH72.result = item.value
      this.data.discharge.troponinH72.unit = item.unit
      this.data.discharge.troponinH72.timeStamp = this.data.discharge.timeStamp

      if (this.data.discharge.troponinH72.type === 'Tnt') {
        this.data.discharge.troponinH72.category = '1'
      } else {
        this.data.discharge.troponinH72.category = '2'
      }

      this.$api.service
        .saveDischargeTes(this.data.discharge.troponinH72)
        .then(res => {
          if (res.status === 200) {
            this.data.discharge.timeStamp = res.result.timeStamp
            this.data.regist.isReport = '0'
            this.$emit('notifyReportStatus', this.data)
          } else {
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    saveBnp: debounce(function() {
      this.data.discharge.bnp.registId = this.registId
      this.data.discharge.bnp.timeStamp = this.data.discharge.timeStamp

      if (this.data.discharge.bnp.type === 'Bnp') {
        this.data.discharge.bnp.category = '3'
      } else {
        this.data.discharge.bnp.category = '4'
      }

      this.$api.service
        .saveDischargeTes(this.data.discharge.bnp)
        .then(res => {
          if (res.status === 200) {
            this.data.discharge.timeStamp = res.result.timeStamp
            this.data.regist.isReport = '0'
            this.$emit('notifyReportStatus', this.data)
          } else {
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    saveTc: debounce(function() {
      this.data.discharge.tc.registId = this.registId
      this.data.discharge.tc.category = '5'
      this.data.discharge.tc.timeStamp = this.data.discharge.timeStamp

      this.$api.service
        .saveDischargeTes(this.data.discharge.tc)
        .then(res => {
          if (res.status === 200) {
            this.data.discharge.timeStamp = res.result.timeStamp
            this.data.regist.isReport = '0'
            this.$emit('notifyReportStatus', this.data)
          } else {
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    saveTg: debounce(function() {
      this.data.discharge.tg.registId = this.registId
      this.data.discharge.tg.category = '6'
      this.data.discharge.tg.timeStamp = this.data.discharge.timeStamp

      this.$api.service
        .saveDischargeTes(this.data.discharge.tg)
        .then(res => {
          if (res.status === 200) {
            this.data.discharge.timeStamp = res.result.timeStamp
            this.data.regist.isReport = '0'
            this.$emit('notifyReportStatus', this.data)
          } else {
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    saveHdlC: debounce(function() {
      this.data.discharge.hdlC.registId = this.registId
      this.data.discharge.hdlC.category = '7'
      this.data.discharge.hdlC.timeStamp = this.data.discharge.timeStamp

      this.$api.service
        .saveDischargeTes(this.data.discharge.hdlC)
        .then(res => {
          if (res.status === 200) {
            this.data.discharge.timeStamp = res.result.timeStamp
            this.data.regist.isReport = '0'
            this.$emit('notifyReportStatus', this.data)
          } else {
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    saveLdlC: debounce(function() {
      this.data.discharge.ldlC.registId = this.registId
      this.data.discharge.ldlC.category = '8'
      this.data.discharge.ldlC.timeStamp = this.data.discharge.timeStamp

      this.$api.service
        .saveDischargeTes(this.data.discharge.ldlC)
        .then(res => {
          if (res.status === 200) {
            this.data.discharge.timeStamp = res.result.timeStamp
            this.data.regist.isReport = '0'
            this.$emit('notifyReportStatus', this.data)
          } else {
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    notifyReportChange() {
      this.data.regist.isReport = '0'
      this.$emit('notifyReportStatus', this.data)
    },
    saveJtyw: debounce(function() {
      // 保存住院期间用药-降糖药物
      this.data.discharge.jtyw.registId = this.registId
      this.data.discharge.jtyw.code = '1'
      this.data.discharge.jtyw.timeStamp = this.data.discharge.timeStamp

      this.$api.service
        .saveInnaiDrugs(this.data.discharge.jtyw)
        .then(res => {
          if (res.status === 200) {
            this.data.regist.isReport = '0'
            this.data.discharge.timeStamp = res.result.timeStamp
            this.$emit('notifyReportStatus', this.data)
          } else {
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    saveKnyw: debounce(function() {
      // 保存住院期间用药-口服抗凝药物
      this.data.discharge.knyw.registId = this.registId
      this.data.discharge.knyw.code = '2'
      this.data.discharge.knyw.timeStamp = this.data.discharge.timeStamp

      this.$api.service
        .saveInnaiDrugs(this.data.discharge.knyw)
        .then(res => {
          if (res.status === 200) {
            this.data.regist.isReport = '0'
            this.data.discharge.timeStamp = res.result.timeStamp
            this.$emit('notifyReportStatus', this.data)
          } else {
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    }, 300),
    savePcsk9: debounce(function() {
      // 保存住院期间用药-口服抗凝药物
      this.data.discharge.pcsk9.registId = this.registId
      this.data.discharge.pcsk9.code = '3'
      this.data.discharge.pcsk9.timeStamp = this.data.discharge.timeStamp

      this.$api.service
        .saveInnaiDrugs(this.data.discharge.pcsk9)
        .then(res => {
          if (res.status === 200) {
            this.data.regist.isReport = '0'
            this.data.discharge.timeStamp = res.result.timeStamp
            this.$emit('notifyReportStatus', this.data)
          } else {
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
    onTroponinH72Change(item) {
      this.saveTroponinH72(item)
    },
    onChanged(type) {
      if (type === 'discharge') {
        this.save()
      } else if (type === 'troponinH72') {
      } else if (type === 'bnp') {
        this.saveBnp()
      } else if (type === 'tc') {
        this.saveTc()
      } else if (type === 'tg') {
        this.saveTg()
      } else if (type === 'hdlc') {
        this.saveHdlC()
      } else if (type === 'ldlc') {
        this.saveLdlC()
      } else if (type === 'jtyw') {
        this.saveJtyw()
      } else if (type === 'knyw') {
        this.saveKnyw()
      } else if (type === 'pcsk9') {
        this.savePcsk9()
      } else if (type === 'main') {
        this.saveMain()
      } else {
      }
    },
    validate() {
      return this.$refs['discharge'].validate()
    },
    queryData() {
      if (this.$refs.medicinetake !== undefined) {
        return this.$refs.medicinetake.queryData()
      }
    },
    onSaveException(res) {
      this.$emit('onSaveException', res)
    }
    // indexChange(index) {
    //   const lastIdx = this.indexList.slice(-1)[0]
    //   for (let i = index; i < index + 4; i++) {
    //     this[`indexBar${i}`] = true
    //   }
    //   for (let j = index + 4; j <= lastIdx; j++) {
    //     this[`indexBar${j}`] = false
    //   }
    // }
  },
  watch: {}
}
</script>

<style lang="less" scoped>
@import '@/views/patient/document/detail/detail.less';
</style>
