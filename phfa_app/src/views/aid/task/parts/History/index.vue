<template>
  <div class="task-basic-info-wrapper">
    <div class="task-part-title">
      <span class="solid"></span><span>患者病史</span>
    </div>
    <div class="main">
      <van-cell-group>
        <van-cell title="病史提供者">
          <med-select v-model="form.medicalHisProType" :options="medicalHisProTypeList"></med-select>
        </van-cell>
        <van-field v-model="form.historyProvider" label="病史提供姓名" placeholder="病史提供姓名" />
        <van-cell title="发病时间">
          <fuzzy-datetime-picker v-model="form.morbtimearea" :ranges="ranges" :fuzzy.sync="form.isMorb" />
        </van-cell>
        <van-field v-model="form.chiefComplaint" label="主诉" placeholder="主诉" type="textarea" class="temped-textarea">
          <template #right-icon>
            <i class="iconfont iconicon1-191" @click="goToTemp('chiefComplaint')"></i>
          </template>
        </van-field>
        <van-field v-model="form.presentIllness" label="现病史" placeholder="现病史" type="textarea" class="temped-textarea">
          <template #right-icon>
            <i class="iconfont iconicon1-191" @click="goToTemp('presentIllness')"></i>
          </template>
        </van-field>
        <past-history :options="pastHistoryList" v-model="form.pastHistory"></past-history>

        <allergic-history :options="allergicHistoryList" v-model="form.allergicHistory"></allergic-history>

        <!-- <van-cell title="过敏史">
          <med-select
            :multiple="{ stringValue: true }"
            v-model="form.allergicHistory"
            :options="allergicHistoryList"
          ></med-select>
        </van-cell> -->
      </van-cell-group>
    </div>
    <van-action-sheet v-model="show" :actions="sheetList" @select="onSelect" />
    <!-- <van-calendar v-model="touchPatientTimeShow" @confirm="onConfirm" /> -->

    <van-popup v-model="historyTempShow" :lazy-render="false" position="right" :style="{ width: '100%', height: '100%' }">
      <HistoryTemp ref="historyTemp" @backClick="historyTempShow = false" @submit="submit" />
    </van-popup>
  </div>
</template>
<script>
import methodMixin from '@mixins/methodMixin'
import * as types from '@store/mutations/mutations-types'
import { mapGetters, mapMutations } from 'vuex'
import HistoryTemp from './historyTemp.vue'
import FuzzyDatetimePicker from '../../components/FuzzyDatetimePicker.vue'
import PastHistory from './PastHistory.vue'
import AllergicHistory from './AllergicHistory.vue'

export default {
  components: {
    HistoryTemp,
    FuzzyDatetimePicker,
    PastHistory,
    AllergicHistory
  },
  data() {
    return {
      form: {
        recordId: '',
        medicalHisProType: '',
        historyProvider: '',
        morbtimearea: '',
        isMorb: '0',
        chiefComplaint: '',
        presentIllness: '',
        pastHistory: '',
        allergicHistory: ''
      },
      // touchPatientTime: '',
      touchPatientTimeShow: false,
      historyTempShow: false,
      show: false,
      sheetList: [],
      sheetType: '',
      medicalHisProTypeList: [],
      pastHistoryList: [],
      allergicHistoryList: [],
      ranges: []
    }
  },
  computed: {
    ...mapGetters(['patientId', 'recordId', 'chiefComplaint'])
  },
  methods: {
    ...mapMutations(types),
    showSheet(type) {
      const obj = {
        medicalHisProType: this.medicalHisProTypeList,
        pastHistory: this.pastHistoryList,
        allergicHistory: this.allergicHistoryList
      }
      this.sheetList = obj[type]
      this.sheetType = type
      this.show = true
    },
    onSelect(item) {
      this.show = false
      this.form[this.sheetType] = item.name
    },
    // onConfirm(date) {
    //   this.touchPatientTimeShow = false
    //   this.touchPatientTime = this.formatDate(date)
    // },
    // 时间格式化
    formatDate(date) {
      return this.$moment(date).format('YYYY-MM-DD[T]HH:mm:ss')
    },
    goToTemp(type) {
      // this.$router.push({ path: '/aid/task/historyTemp', query: { type } })
      this.historyTempShow = true
      this.$refs.historyTemp.init(type)
    },
    handleSave() {
      // this.form.recordId = this.recordId
      const req = { ...this.form, recordId: this.recordId }
      this.$api.mpmrSaveOrUpdate(req).then(res => {
        if (res.code === '000000') {
          this[types.SET_MEDICAL_HISTORY](req)
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    },
    submit(val) {
      if (val.type === 'chiefComplaint') {
        // this.form.chiefComplaint = val.content
        this.$set(this.form, 'chiefComplaint', val.content)
      } else if (val.type === 'presentIllness') {
        // this.form.presentIllness = val.content
        this.$set(this.form, 'presentIllness', val.content)
      }
      this.historyTempShow = false
    },
    init() {
      if (this.patientId) {
        this.$api.mpmrDetail(this.patientId).then(res => {
          if (res?.body) {
            this.$preventWatch(() => {
              this.form = { ...this.form, ...this.clearNull(res.body) }
              this[types.SET_MEDICAL_HISTORY](this.form)
              this[types.SET_CHIEFCOMPLAINT](this.form.chiefComplaint)
            })
          }
        })
      }
    },
    tabChange() {
      this.init()
    },
    refreshSelf() {
      this.init()
    },
    onMorbtimeareaChange(val) {
      this.form.morbtimearea = val?.morbtimearea
      this.form.isMorb = val?.isMorb
    }
  },
  created() {
    const res = this.getCodeListByKey([
      'PHFA_0012', // 病史提供者
      'PHFA_0014', // 既往史
      'PHFA_0015', // 过敏史
      'PHFA_0013' // 发病时间
    ])
    this.medicalHisProTypeList = res.PHFA_0012
    this.pastHistoryList = res.PHFA_0014
    this.allergicHistoryList = res.PHFA_0015
    this.ranges = res.PHFA_0013

    if (this.patientId) this.init()

    this.$bus.$on('refreshHistory', this.refreshSelf)
    // 别处更改发病时间时 这里联动变化
    this.$bus.$on('morbtimeareaChanged', this.onMorbtimeareaChange)
  },
  beforeDestroy() {
    this.$bus.$off('morbtimeareaChanged', this.onMorbtimeareaChange)
    this.$bus.$off('refreshHistory', this.refreshSelf)
  },
  watch: {
    form: {
      handler(e) {
        this.handleSave()
      },
      deep: true
    },
    'form.chiefComplaint': {
      handler(v) {
        this[types.SET_CHIEFCOMPLAINT](v)
      }
    },
    chiefComplaint(v) {
      this.$set(this.form, 'chiefComplaint', v)
    }
  },
  mixins: [methodMixin]
}
</script>

<style lang="less" scoped>
.task-basic-info-wrapper {
  .main {
    /deep/ .van-cell {
      font-size: 24px;

      .van-cell__title {
        //max-width: 130px;
      }
    }
  }

  .temped-textarea {
    /deep/ .van-field__body {
      align-items: flex-start;

      .van-field__right-icon {
        border-left: 1px solid rgb(202, 202, 202);
        line-height: 0.5rem;
        padding: 0;

        i {
          font-size: 0.4rem;
          padding: 0 0.22rem 1rem;
        }
      }
    }
  }
}
</style>
