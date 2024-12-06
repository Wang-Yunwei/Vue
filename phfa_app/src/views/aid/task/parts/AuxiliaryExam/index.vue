<template>
  <div class="task-basic-info-wrapper">
    <div class="task-part-title">
      <span class="solid"></span><span>辅助检查</span>
    </div>
    <div class="main">
      <van-cell-group>
        <van-field class="currentPhoto" v-model="form.ecg" label="心电图">
          <template #right-icon>
            <med-uploader v-model="electrocardiogramUrlList" :fileType="0" remark="心电图" :getBusinessId="() => patientId" @change="getSupDetails" />
          </template>
        </van-field>
        <van-field :value="form.bloodglucose" @input="onBloodglucoseChange" type="number" label="血糖(mmol/L)" />
        <van-field label="POCT检查" placeholder="未检查" is-link readonly @click="detailComp = 'poct'" :value="results.poct" />
        <van-field label="TI评估" placeholder="未评估" is-link readonly @click="detailComp = 'ti'" :value="results.ti" />
        <van-field label="GCS评估" placeholder="未评估" is-link readonly @click="detailComp = 'gcs'" :value="results.gcs" />
        <van-field label="胸痛评估" placeholder="未评估" is-link readonly @click="detailComp = 'chestPain'" :value="results.chestPain" />
        <van-field label="Killip评估" placeholder="未分级" is-link readonly @click="detailComp = 'killip'" :value="results.killip" />
        <van-field label="FAST评估" placeholder="未评估" is-link readonly @click="detailComp = 'fast'" :value="results.fast" />
        <van-field v-model="form.otherCheck" label="其他检查" />
        <van-field class="currentPhoto" v-model="form.ecg" label="现场照片">
          <template #right-icon>
            <med-uploader v-model="scenePhotoUrlList" :fileType="1" remark="现场照片" :getBusinessId="() => patientId" @change="getSupDetails" />
          </template>
        </van-field>
        <van-field class="currentPhoto" v-model="form.ecg" label="现场视频">
          <template #right-icon>
            <med-uploader v-model="sceneVideoUrlList" :fileType="2" remark="现场视频" :getBusinessId="() => patientId" @change="getSupDetails" />
          </template>
        </van-field>
      </van-cell-group>
    </div>
    <van-action-sheet v-model="show" :actions="sheetList" @select="onSelect" />

    <van-popup v-model="detailVisible" position="right" duration="0.2">
      <div class="comp-wrapper" v-if="detailVisible">
        <component :is="detailComp" :patientId="patientId" :value="values[detailComp]" @back="detailComp = ''" :parseResult="parseItemResult" />
      </div>
    </van-popup>
  </div>
</template>
<script>
import methodMixin from '@mixins/methodMixin'
import { mapGetters } from 'vuex'
import details from './details'
let timer
export default {
  components: { ...details },
  data() {
    return {
      detailVisible: false,
      detailComp: '',
      electrocardiogramUrlList: [],
      scenePhotoUrlList: [],
      sceneVideoUrlList: [],
      form: {
        ecg: '',
        bloodglucose: undefined,
        otherCheck: ''
      },
      show: false,
      sheetList: [],
      sheetType: '',
      judgmentBasis: {}, // 检查结果的判断依据
      results: {
        poct: ''
      } // 检查结果
    }
  },
  computed: {
    ...mapGetters(['missionId', 'patientId']),
    values() {
      return {
        ti: {},
        gcs: '',
        chestPain: '',
        killip: '',
        fast: ''
      }
    }
  },
  created() {
    this.getCodeList()
    // this.getSupDetails()
    // 监听疾病类别数据变化时刷新
    this.$bus.$on('refreshAuxiliaryExam', this.refreshSelf)
  },
  beforeDestroy() {
    this.$bus.$off('refreshAuxiliaryExam', this.refreshSelf)
  },
  methods: {
    refreshSelf() {
      this.getSupDetails()
    },
    refreshHandover() {
      // 刷新交接单部分数据
      this.$bus.$emit('refreshHandover')
    },
    onBloodglucoseChange(v, ov) {
      this.$set(this.form, 'bloodglucose', Number(v) || undefined)
    },
    parseItemResult(item) {
      const type = item.name
      if (['gcs', 'ti'].includes(type)) {
        const result = this.findRangeResult(
          item.value,
          this.judgmentBasis[type]
        )
        return result?.label
      }
      if (['chestPain'].includes(type)) {
        const result = this.findRangeResult(
          item.details[0]?.value,
          this.judgmentBasis[type]
        )
        return result?.label
      }
      if (['killip'].includes(type)) {
        const result = this.findRangeResult(
          item.details[0]?.value,
          this.judgmentBasis[type]
        )
        return [result?.value, result?.label].filter(el => el).join(' ')
      }
      if (['fast'].includes(type)) {
        const suspected = (item.details || []).some(
          item => item.value === '02'
        )
        return suspected ? '疑似卒中' : '未见异常'
      }
    },
    getCodeList() {
      const {
        PHFA_0048: gcs,
        PHFA_0045: killip,
        PHFA_0046: ti,
        PHFA_0047: chestPain
      } = this.getCodeListByKey([
        'PHFA_0045', // Killip_评估结果
        'PHFA_0046', // TI_评估结果
        'PHFA_0047', // 胸痛评估_病情评估
        'PHFA_0048' // GCS_评估结果
      ])
      this.judgmentBasis = {
        ...this.judgmentBasis,
        gcs,
        killip,
        ti,
        chestPain
      }
    },
    findRangeResult(val, list = []) {
      const numVal = Number(val)
      const matched = (list || []).find(ele => {
        if (ele.value.includes('≥')) {
          if (numVal >= Number(ele.value.replace('≥', ''))) {
            return true
          }
          return false
        }
        if (ele.value.includes('≤')) {
          if (numVal <= Number(ele.value.replace('≤', ''))) {
            return true
          }
          return false
        }
        const [start, end] = ele.value.split('-')
        return end
          ? numVal >= Number(start) && numVal <= Number(end)
          : start === val
      })
      return matched
    },
    // 解析检查结果
    parseResults(results) {
      let { estimateDto = [], medPhepPoctEntity = {} } = results
      if (!estimateDto) {
        estimateDto = []
      }
      if (!medPhepPoctEntity) {
        medPhepPoctEntity = {}
      }
      const poct = medPhepPoctEntity?.checkTime ? '已采集' : ''
      this.$set(this.results, 'poct', poct)

      const gcsItem = estimateDto.find(el => el.name === 'gcs')
      if (gcsItem) {
        this.$set(this.results, 'gcs', gcsItem.description)
        this.$set(this.values, 'gcs', gcsItem)
      }

      const tiItem = estimateDto.find(el => el.name === 'ti')
      if (tiItem) {
        this.$set(this.results, 'ti', tiItem.description)
        this.$set(this.values, 'ti', tiItem)
      }

      const killipItem = estimateDto.find(el => el.name === 'killip')
      if (killipItem) {
        this.$set(this.results, 'killip', killipItem.description)
        this.$set(this.values, 'killip', killipItem)
      }

      const chestPainItem = estimateDto.find(el => el.name === 'chestPain')
      if (chestPainItem) {
        this.$set(this.results, 'chestPain', chestPainItem.description)
        this.$set(this.values, 'chestPain', chestPainItem)
      }

      const fastItem = estimateDto.find(el => el.name === 'fast')
      if (fastItem) {
        this.$set(this.results, 'fast', fastItem.description)
        this.$set(this.values, 'fast', fastItem)
      }
    },
    getSupDetails() {
      this.$api.supDetails(this.patientId).then(res => {
        if (res.body) {
          this.$preventWatch(() => {
            this.form.bloodglucose = res.body.bloodglucose || undefined
            this.form.otherCheck = res.body.otherCheck || undefined
          })
          this.electrocardiogramUrlList =
            res.body.electrocardiogramUrlList || []
          this.scenePhotoUrlList = res.body.scenePhotoUrlList || []
          this.sceneVideoUrlList = res.body.sceneVideoUrlList || []
          this.parseResults(res.body)
        }
      })
    },
    onSelect(item) {
      this.show = false
      this.form[this.sheetType] = item.name
    },
    async handleSave() {
      const payload = {
        otherCheck: this.form.otherCheck,
        bloodglucose: this.form.bloodglucose || 0,
        patientId: this.patientId
      }
      const res = await this.$api.supSaveOrUpdate(
        payload
      )
    }
  },
  watch: {
    detailComp(val) {
      this.detailVisible = !!val
      if (!val) {
        // 从明细回来
        this.getSupDetails()
        this.refreshHandover()
      }
    },
    patientId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.getSupDetails()
        }
      }
    },
    form: {
      handler() {
        clearTimeout(timer)
        timer = setTimeout(() => {
          this.handleSave()
        }, 2000)
      },
      deep: true
    }
  },
  mixins: [methodMixin]
}
</script>
<style lang="less" scoped>
.task-basic-info-wrapper {
  .main {
    .currentPhoto {
      /deep/ .van-field__control {
        display: none;
      }

      /deep/ .van-field__body {
        display: inline-block;
      }
    }
  }

  /deep/ .van-popup--center {
    background-color: transparent;
  }

  .comp-wrapper {
    width: 100vw;
    height: 100vh;
    background-color: #fff;
  }
}
</style>
