<template>
  <div class="task-basic-info-wrapper">
    <med-header title="POCT" @backClick="onClickLeft" />
    <div class="scroll-box">
      <med-date-picker label="检查时间" v-model="form.checkTime">
        <template #right-icon>
          <i class="iconfont iconicon1svg-52"></i>
        </template>
      </med-date-picker>
      <!-- <van-cell
        required
        title="检查时间"
        :value="form.checkTime"
        @click="showCalendar('checkTime')"
      >
        <template #right-icon>
          <i class="iconfont iconicon1svg-52"></i>
        </template>
      </van-cell> -->
      <med-date-picker label="报告时间" v-model="form.reportTime">
        <template #right-icon>
          <i class="iconfont iconicon1svg-52"></i>
        </template>
      </med-date-picker>
      <!-- <van-cell
        required
        title="报告时间"
        :value="form.reportTime"
        @click="showCalendar('reportTime')"
      >
        <template #right-icon>
          <i class="iconfont iconicon1svg-52"></i>
        </template>
      </van-cell> -->
      <van-field v-model="form.reportFile" label="报告附件">
        <template #right-icon>
          <med-uploader :getBusinessId="getBusinessId" remark="报告附件" v-model="poctAttachmentUrlList" :maxCount="1" @change="onAttachmentChange" />
        </template>
      </van-field>
      <van-field type="digit" v-model.number="form.tnt" label="TnT" placeholder="请填写">
        <template #right-icon>
          <med-select v-model="form.tntUnit" :options="optionTnT" class="unit-select"></med-select>
        </template>
      </van-field>
      <van-field type="digit" v-model.number="form.tnl" label="Tnl" placeholder="请填写">
        <template #right-icon>
          <med-select v-model="form.tnlUnit" :options="optionTnl" class="unit-select"></med-select>
        </template>
      </van-field>
      <van-field type="digit" v-model.number="form.ddimer" label="D-二聚体" placeholder="请填写">
        <template #right-icon>
          <med-select v-model="form.ddimerUnit" :options="optionDDimer" class="unit-select"></med-select>
        </template>
      </van-field>
      <van-field type="digit" v-model.number="form.serum" label="血清肌酐" placeholder="请填写">
        <template #right-icon>
          <med-select v-model="form.serumUnit" :options="optionSerum" class="unit-select"></med-select>
        </template>
      </van-field>
      <van-field type="digit" v-model.number="form.ckmb" label="CKMB" placeholder="请填写">
        <template #right-icon>
          <med-select v-model="form.ckmbUnit" :options="optionCkmb" class="unit-select"></med-select>
        </template>
      </van-field>
      <van-field type="digit" v-model.number="form.bnp" label="BNP" placeholder="请填写">
        <template #right-icon>
          <med-select v-model="form.bnpUnit" :options="optionBnp" class="unit-select"></med-select>
        </template>
      </van-field>
      <van-field type="digit" v-model.number="form.ntProbnp" label="NT-proBNP" placeholder="请填写">
        <template #right-icon>
          <med-select v-model="form.ntProbnpUnit" :options="optionNtProbnp" class="unit-select"></med-select>
        </template>
      </van-field>
      <van-field type="digit" v-model.number="form.myo" label="Myo" placeholder="请填写">
        <template #right-icon>
          <med-select v-model="form.myoUnit" :options="optionMyo" class="unit-select"></med-select>
        </template>
      </van-field>
    </div>
    <van-action-sheet v-model="dateTimeShow">
      <van-datetime-picker type="datetime" title="选择年月" @confirm="onConfirm" @cancel="onCancel" :formatter="dateUtil.formatter" item-height="1rem" />
    </van-action-sheet>
  </div>
</template>
<script>
import methodMixin from '@mixins/methodMixin'
import dateMixin from '@mixins/dateMixin'
import dateUtil from '@utils/dateUtil'
let timer
export default {
  props: ['patientId'],
  mixins: [dateMixin, methodMixin],
  data() {
    return {
      dateUtil,
      dateShow: false,
      dateTimeShow: false,
      dateField: '',
      poctAttachmentUrlList: [],
      value: 0,
      optionTnT: [],
      optionTnl: [],
      optionDDimer: [],
      optionSerum: [],
      optionCkmb: [],
      optionBnp: [],
      optionNtProbnp: [],
      optionMyo: [],
      form: {
        checkTime: '',
        reportTime: '',
        // reportFile: '',
        tnt: undefined,
        tntUnit: undefined,
        tnl: undefined,
        tnlUnit: undefined,
        ddimer: undefined,
        ddimerUnit: undefined,
        serum: undefined,
        serumUnit: undefined,
        ckmb: undefined,
        ckmbUnit: undefined,
        bnp: undefined,
        bnpUnit: undefined,
        ntProbnp: undefined,
        ntProbnpUnit: undefined,
        myo: undefined,
        myoUnit: undefined
      }
    }
  },
  created() {
    const res = this.getCodeListByKey([
      'PHFA_0020', // TnT
      'PHFA_0021', // TnI
      'PHFA_0022', // D-二聚体
      'PHFA_0023', // 血清肌酐
      'PHFA_0024', // CKMB
      'PHFA_0025', // BNP
      'PHFA_0026', // NT-proBNP
      'PHFA_0027' // Myo
    ])
    this.optionTnT = res.PHFA_0020
    this.optionTnl = res.PHFA_0021
    this.optionDDimer = res.PHFA_0022
    this.optionSerum = res.PHFA_0023
    this.optionCkmb = res.PHFA_0024
    this.optionBnp = res.PHFA_0025
    this.optionNtProbnp = res.PHFA_0026
    this.optionMyo = res.PHFA_0027
    this.getSupDetails()
  },
  methods: {
    onConfirm(date) {
      this.dateShow = false
      if (this.dateField.indexOf('.') !== -1) {
        const fields = this.dateField.split('.')
        this.form[fields[0]][fields[1]] = this.formatDate(date)
      } else {
        this.form[this.dateField] = this.formatDate(date)
      }
      this.form = { ...this.form }
      this.onCancel()
    },
    onCancel() {
      this.dateTimeShow = false
    },
    showCalendar(field) {
      this.dateField = field
      this.dateTimeShow = true
    },
    getSupDetails() {
      this.$api.supDetails(this.patientId).then(res => {
        if (res.body) {
          this.poctAttachmentUrlList = res.body.poctAttachmentUrlList || []
          this.$preventWatch(() => {
            this.form = {
              tntUnit: this.optionTnT[0]?.value,
              tnlUnit: this.optionTnl[0]?.value,
              ddimerUnit: this.optionDDimer[0]?.value,
              serumUnit: this.optionSerum[0]?.value,
              ckmbUnit: this.optionCkmb[0]?.value,
              bnpUnit: this.optionBnp[0]?.value,
              ntProbnpUnit: this.optionNtProbnp[0]?.value,
              myoUnit: this.optionMyo[0]?.value,
              ...res.body.medPhepPoctEntity
            }
          })
        }
      })
    },
    async getBusinessId() {
      let id = this.form?.id
      if (!id) {
        // 获取uuid
        const { body } = await this.$api.getUUID()
        id = body
      }
      return id
    },
    async onAttachmentChange(list, businessId) {
      if (list.length) {
        const [item] = list
        const attachPath = item.url
        const payload = {
          medPhepAttachmentEntity: {
            attachPath,
            type: '00'
          },
          medPhepPoctEntity: {
            ...this.form,
            id: businessId,
            patientId: this.patientId
          }
        }
        this.$api
          .supSaveOrUpdate(payload)
          .then(res => { })
      }
    },
    onClickLeft() {
      this.$emit('back')
    },
    async handleSave() {
      const payload = {
        medPhepPoctEntity: {
          ...this.form,
          patientId: this.patientId
        }
      }
      const res = await this.$api.supSaveOrUpdate(
        payload
      )
      if (res.body) {
        this.getSupDetails()
      }
    }
  },
  watch: {
    form: {
      handler() {
        clearTimeout(timer)
        timer = setTimeout(() => {
          this.handleSave()
        }, 2000)
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.scroll-box {
  overflow: auto;
  max-height: calc(100vh - 2rem);
}

.iconicon1svg-52 {
  font-size: 0.5rem;
  color: #5e74fe;
  border-left: 1px solid #ddd;
  padding: 0 0.15rem;
  margin-left: 0.3rem;
}

.van-dropdown-menu__item {
  display: -webkit-box;
  display: flex;
  -webkit-box-flex: 1;
  flex: 1;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  /* justify-content: center; */
  min-width: 2.5rem;
}

.unit-select {
  border: 1px solid #bbb;
  border-radius: 0.3rem;
  padding: 0 0.3rem;
}
</style>
