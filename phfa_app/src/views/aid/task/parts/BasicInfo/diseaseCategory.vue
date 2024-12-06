<template>
  <div class="task-disease-category-wrapper">
    <med-header title="疾病类别" @backClick="onClickLeft" />
    <div class="main">
      <van-radio-group class="radio-btn-type" v-model="form.diseaseCategory" @change="submit">
        <van-collapse accordion v-model="activeNames" v-for="item in diseaseCategoryList" :key="item.value">
          <van-collapse-item :name="item.value" :ref="'collapse' + item.value">
            <template #title>
              <van-radio :name="item.value" @tap.stop="doSelect('collapse' + item.value)">
                {{ item.name }}
                <template #icon="props">
                  <i class="iconfont iconicon1-431" v-show="props.checked" />
                </template>
              </van-radio>
            </template>
            <van-cell title="发病时间" v-if="checkType(item.name)">
              <fuzzy-datetime-picker v-model="form.morbtimearea" :ranges="ranges" :fuzzy.sync="form.isMorb" />
            </van-cell>
            <van-field v-if="item.name.startsWith('心血管')" label="胸痛评估" placeholder="未评估请前往评估" readonly is-link @click="popupPage = 'chestPain'" :value="results.chestPain">
            </van-field>
            <van-field v-if="item.name.startsWith('心血管')" label="killip 级" placeholder="未分级请前往分级" readonly is-link @click="popupPage = 'killip'" :value="results.killip">
            </van-field>
            <van-field v-if="item.name.startsWith('创伤')" label="TI评分" placeholder="未评分请前往评分" readonly is-link @click="popupPage = 'ti'" :value="results.ti">
            </van-field>
            <van-field v-if="item.name.startsWith('创伤')" label="GCS评分" placeholder="未评分请前往评分" readonly is-link @click="popupPage = 'gcs'" :value="results.gcs">
            </van-field>
            <van-field v-if="item.name.startsWith('神经系统')" label="FAST评估" placeholder="未评估请前往评估" readonly is-link @click="popupPage = 'fast'" :value="results.fast">
            </van-field>
            <van-field v-model="form.otherInfo" v-if="item.name === '其他'" label="请输入" placeholder="请输入">
            </van-field>
            <van-notice-bar v-if="item.name.startsWith('心血管')" left-icon="warning-o" text="请给患者做心电图!" />
          </van-collapse-item>
        </van-collapse>
      </van-radio-group>
    </div>
    <van-popup get-container="body" v-model="popupVisible" position="right" duration="0.2">
      <div v-if="popupVisible" :class="{ 'comp-wrapper': true, 'prohibit-editing': !canEdit }">
        <component :is="popupPage" :patientId="patientId" :value="values[popupPage]" :parseResult="parseItemResult" @back="popupPage = ''" />
      </div>
    </van-popup>
  </div>
</template>
<script>
import methodMixin from '@mixins/methodMixin'
import FuzzyDatetimePicker from '../../components/FuzzyDatetimePicker'
import tests from '../AuxiliaryExam/details'
import * as types from '@store/mutations/mutations-types'
import { mapGetters, mapMutations } from 'vuex'

export default {
  components: { FuzzyDatetimePicker, ...tests },
  data() {
    return {
      popupVisible: false,
      popupPage: '',
      ranges: [],
      form: {
        morbtimearea: '',
        isMorb: '0',
        otherInfo: '',
        diseaseCategory: ''
      },
      activeNames: ['1'],
      diseaseCategoryList: [],
      judgmentBasis: {}, // 检查结果的判断依据
      results: {} // 检查结果
    }
  },
  computed: {
    ...mapGetters(['recordId', 'medicalStatus', 'patientId']),
    values() {
      return {
        ti: {},
        gcs: '',
        chestPain: '',
        killip: '',
        fast: ''
      }
    },
    canEdit() {
      return this.medicalStatus === '01'
    }
  },
  methods: {
    ...mapMutations(types),
    hrefDiseaseCategory() {
      this.$router.push({ path: '/aid/task/diseaseCategory' })
    },
    doSelect(key) {
      this.activeNames = key.substring(8)
      if (this.canEdit) {
        this.$refs[key][0].toggle(false)
      }
    },
    onClickLeft() {
      this.$emit('backClick')
    },
    submit() {
      this[types.SET_DISEASE_CATEGORY](this.form.diseaseCategory)
      this.$emit('submit', this.form)
    },
    checkType(str) {
      return (
        str.startsWith('神经系统') ||
        str.startsWith('创伤') ||
        str.startsWith('心血管')
      )
    },
    handleSave() {
      const req = { ...this.form, recordId: this.recordId }
      this.$api.mpmrSaveOrUpdate(req).then(res => {
        if (res.code === '000000') {
          this.$bus.$emit('refreshHistory')
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    },
    init() {
      this.$api.mpmrDetail(this.patientId).then(res => {
        if (res.body) {
          this.$preventWatch(() => {
            this.form.morbtimearea = res.body?.morbtimearea
            this.form.isMorb = res.body.isMorb || '0'
            this.form.otherInfo = res.body.otherInfo
            this.form.diseaseCategory = res.body.diseaseCategory
          })
        }
      })
    },
    getSupDetails() {
      this.$api.supDetails(this.patientId).then(res => {
        if (res.body) {
          this.parseResults(res.body)
        }
      })
    },
    // 解析检查结果
    parseResults(results) {
      let { estimateDto, medPhepPoctEntity } = results

      if (!estimateDto) {
        estimateDto = []
      }
      if (!medPhepPoctEntity) {
        medPhepPoctEntity = {}
      }

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
        return result?.value + ' ' + result?.label
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
    refreshAuxiliaryExam() {
      // 刷新辅助检查
      this.$bus.$emit('refreshAuxiliaryExam')
    }
  },
  created() {
    const res = this.getCodeListByKey(['PHFA_0011', 'PHFA_0013'])
    this.diseaseCategoryList = res.PHFA_0011.map(item => ({
      // 疾病类别
      name: item.label,
      value: item.value
    }))
    this.ranges = res.PHFA_0013 // 发病时间

    this.getCodeList()
    this.init()
    if (this.patientId) this.getSupDetails()
  },
  watch: {
    popupPage(val) {
      this.popupVisible = !!val
      if (!val) {
        // 从明细回来
        this.getSupDetails()
        this.refreshAuxiliaryExam()
      }
    },
    patientId(v) {
      if (v) {
        this.getSupDetails()
      }
    },
    form: {
      handler() {
        this.handleSave()
      },
      deep: true
    }
  },
  mixins: [methodMixin]
}
</script>

<style lang="less" scoped>
.main {
  background-color: #f2f4f5;
  padding: 0.25rem;

  /deep/ .van-radio-group.radio-btn-type .van-radio {
    .van-radio__label {
      border: none;
      border-radius: unset;
    }

    .van-radio__icon {
      height: 0.6rem;
      width: 0.6rem;
      border: 2px solid #ddd;
      border-radius: 100%;

      i {
        font-size: 0.65rem;
        color: #5e74fe;
      }

      &.van-radio__icon--checked {
        border: none;

        &+.van-radio__label {
          background-color: unset;
          color: inherit;
        }
      }
    }
  }

  /deep/ .van-collapse {
    margin-bottom: 0.25rem;

    .van-collapse-item {
      >.van-cell {
        border-radius: 0.15rem;

        >.van-cell__title {
          max-width: 100vw;
        }

        &.van-collapse-item__title--expanded {
          border-radius: 0.15rem 0.15rem 0 0;

          +.van-collapse-item__wrapper {
            .van-collapse-item__content {
              border-radius: 0 0 0.15rem 0.15rem;
              overflow: hidden;
            }
          }

          &:after {
            border-color: #dadada;
          }
        }
      }

      >.van-collapse-item__wrapper {
        .van-collapse-item__content {
          padding: 0;

          .van-cell__title {
            max-width: 1.9rem;
          }
        }
      }
    }
  }
}

.comp-wrapper {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
}
</style>
