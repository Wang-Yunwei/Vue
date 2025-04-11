<template>
  <div class="mini">
    <med-subtitle title="实验室检查" />
    <el-row :gutter="24">
      <el-col :span="6">
        <med-radio-field
          v-model="data.hasCreatinineprotein"
          :disabled="disabled"
          label="是否肌钙蛋白"
          form-prop="inspection.hasCreatinineprotein"
          :select-options="yesOrNoDic"
          :rules="[
            { required: true, message: '请填写是否肌钙蛋白', trigger: 'change' }
          ]"
          @change="onTnChanged"
        />
      </el-col>
    </el-row>
    <el-row v-if="data.hasCreatinineprotein === '1' && tnTest" :gutter="24">
      <el-col :span="24">
        <med-tn-field
          ref="tnRef"
          :data="tnTest"
          :disabled="disabled"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="3">
        <med-radio-field
          v-model="data.hasExamine"
          :disabled="disabled"
          label="是否检查"
          form-prop="inspection.hasExamine"
          :select-options="yesOrNoDic"
          :rules="[
            { required: true, message: '请填写是否检查', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col v-if="data.hasExamine == '1'" :span="18">
        <med-checkbox-field
          v-model="data.examineType"
          display-type="check"
          required
          :disabled="disabled"
          class="font-color"
          check-type="button"
          label="检查类型"
          :select-options="testTypeDic"
          form-prop="inspection.examineType"
          :rules="[
            { required: true, message: '请填写检查类型', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row v-if="data.hasExamine == '1'" :gutter="24">
      <el-col :span="4">
        <med-unit-field
          v-if="isTest('1')"
          v-model="diagnosisTest.cr"
          label="血清肌酐"
          :disabled="disabled"
          :unit-options="crDic"
          form-prop="diagnosisTest.cr.value"
          :rules="[
            { required: true, message: '请填写血清肌酐', trigger: 'blur' }
          ]"
          @change="crChanged"
        />
      </el-col>

      <el-col :span="4">
        <med-unit-field
          v-if="isTest('2')"
          v-model="diagnosisTest.ddimer"
          label="D-二聚体"
          :disabled="disabled"
          :unit-options="ddimerUnitDic"
          form-prop="diagnosisTest.ddimer.value"
          :rules="[
            { required: true, message: '请填写D-二聚体', trigger: 'blur' }
          ]"
          @change="ddimerChanged"
        />
      </el-col>

      <el-col :span="4">
        <med-unit-field
          v-if="isTest('3')"
          v-model="diagnosisTest.bnp"
          label="BNP"
          :disabled="disabled"
          :unit-options="bnpDic"
          form-prop="diagnosisTest.bnp.value"
          :rules="[
            { required: true, message: '请填写BNP', trigger: 'blur' }
          ]"
          @change="bnpChanged"
        />
      </el-col>
      <el-col :span="4">
        <med-unit-field
          v-if="isTest('4')"
          v-model="diagnosisTest.nTproBNP"
          label="NT-proBNP"
          :disabled="disabled"
          :unit-options="bnpDic"
          form-prop="diagnosisTest.nTproBNP.value"
          :rules="[
            { required: true, message: '请填写NT-proBNP', trigger: 'blur' }
          ]"
          @change="nTproBNPChanged"
        />
      </el-col>

      <el-col :span="4">
        <med-unit-field
          v-if="isTest('5')"
          v-model="diagnosisTest.myo"
          label="Myo"
          :disabled="disabled"
          :unit-options="myoUnitDic"
          form-prop="diagnosisTest.myo.value"
          :rules="[
            { required: true, message: '请填写Myo', trigger: 'blur' }
          ]"
          @change="myoChanged"
        />
      </el-col>

      <el-col :span="4">
        <med-unit-field
          v-if="isTest('6')"
          v-model="diagnosisTest.ckmb"
          label="CKMB"
          :disabled="disabled"
          :unit-options="ckmbUnitDic"
          form-prop="diagnosisTest.ckmb.value"
          :rules="[
            { required: true, message: '请填写CKMB', trigger: 'blur' }
          ]"
          @change="ckmbChanged"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { dicConstant as d, ruleConstant } from '@/constant/index'
import moment from 'moment'
import MedTnField from './components/MedTnField'
import { querySetting } from '@/api/setting'
export default {
  name: 'Lis',
  components: {
    MedTnField
  },
  props: {
    data: {
      required: true,
      type: Object
    },
    registId: {
      required: true,
      type: String,
      default: ''
    },
    diagnosisTest: {
      required: true,
      type: Object
    },
    tnTest: {
      required: true,
      type: Array
    },
    disabled: {
      required: false,
      type: Boolean
    }
  },
  data() {
    return {
      active: 0,
      tnValue: '',
      tnUnitDic: [
        { name: 'ng/mL', value: '1' },
        { name: 'ug/L', value: '2' },
        { name: 'ng/L', value: '3' },
        { name: 'pg/mL', value: '4' },
        { name: 'mg/L', value: '5' }
      ],
      tnResultDic: [
        { label: '阴性', value: '1' },
        { label: '阳性', value: '2' }
      ],
      crDic: [{ label: 'umol/L', value: '1' }],
      bnpDic: [{ label: 'pg/mL', value: '1' }]
      // dictionary: {}
    }
  },
  computed: {
    ...mapGetters(['dictionary', 'hospitalId']),
    yesOrNoDic() {
      return this.dictionary[d.yesOrNoCode]
    },
    testTypeDic() {
      return this.dictionary[d.diagnosisTestTypeCode]
    },
    myoUnitDic() {
      return this.dictionary[d.myoUnitCode]
    },
    ckmbUnitDic() {
      return this.dictionary[d.ckmbUnitCode]
    },
    ddimerUnitDic() {
      return this.dictionary[d.ddimerUnitCode]
    }
  },
  created() {
    this.sync()
    this.$eventBus.$on('syncDefaultValues',this.sync)
  },
  beforeDestroy() {
    this.$eventBus.$off('syncDefaultValues',this.sync)
  },
  methods: {
    async sync() {
      const { result } = await querySetting({ code: ruleConstant.INSPECTION, hospitalId: this.hospitalId })
      if (result) {
        this.rule = JSON.parse(result.value)
        if (this.rule.isEnabled === true) {
          const syncExamineType = this.data.examineType === null || this.data.examineType === undefined || this.data.examineType.length === 0
          if (syncExamineType) this.data.examineType = []

          // 血清肌酐
          const cr = this.rule.itemConfig.find(c => c.code === '1' && c.isEnabled)
          if (cr && cr.isEnabled) {
            if (syncExamineType) this.data.examineType.push(cr.code)
            this.diagnosisTest.cr.unit = this.diagnosisTest.cr ? this.diagnosisTest.cr.unit : cr.defaultUnit
          }

          // D-二聚体
          const ddimer = this.rule.itemConfig.find(c => c.code === '2' && c.isEnabled)
          if (ddimer && ddimer.isEnabled) {
            if (syncExamineType) this.data.examineType.push(ddimer.code)
            this.diagnosisTest.ddimer.unit = this.diagnosisTest.ddimer ? this.diagnosisTest.ddimer.unit : ddimer.defaultUnit
          }

          // BNP
          const bnp = this.rule.itemConfig.find(c => c.code === '3' && c.isEnabled)
          if (bnp && bnp.isEnabled) {
            if (syncExamineType) this.data.examineType.push(bnp.code)
            this.diagnosisTest.bnp.unit = this.diagnosisTest.bnp ? this.diagnosisTest.bnp.unit : bnp.defaultUnit
          }

          // NT-proBNP
          const nTproBNP = this.rule.itemConfig.find(c => c.code === '4' && c.isEnabled)
          if (nTproBNP && nTproBNP.isEnabled) {
            if (syncExamineType) this.data.examineType.push(nTproBNP.code)
            this.diagnosisTest.nTproBNP.unit = this.diagnosisTest.nTproBNP ? this.diagnosisTest.nTproBNP.unit : nTproBNP.defaultUnit
          }

          // Myo
          const myo = this.rule.itemConfig.find(c => c.code === '5' && c.isEnabled)
          if (myo && myo.isEnabled) {
            if (syncExamineType) this.data.examineType.push(myo.code)
            this.diagnosisTest.myo.unit = this.diagnosisTest.myo ? this.diagnosisTest.myo.unit : myo.defaultUnit
          }

          // CKMB
          const ckmb = this.rule.itemConfig.find(c => c.code === '6' && c.isEnabled)
          if (ckmb && ckmb.isEnabled) {
            if (syncExamineType) this.data.examineType.push(ckmb.code)
            this.diagnosisTest.ckmb.unit = this.diagnosisTest.ckmb ? this.diagnosisTest.ckmb.unit : ckmb.defaultUnit
          }
        }
      }
    },
    isTest(testKey) {
      if (!this.data.examineType) return false
      return this.data.examineType.indexOf(testKey) > -1
    },
    async createRecord() {
      const item = {
        creatinineprotein: '1',
        registId: this.registId,
        drawBloodTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        reportTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      }
      const res = await this.$api.service.updateTn(item)
      if (!res || !res.result) throw new Error('肌钙蛋白添加失败')
      item.id = res.result
      return item
    },
    async deleteRecord(item) {
      const res = await this.$api.service.deleteTnById(item.id)
      if (res && res.status === 200) return true
      return false
    },
    async updateRecord(item) {
      const res = await this.$api.service.updateTn(item)
      if (res && res.status === 200 && res.result) return true
      return false
    },
    crChanged() {
      this.diagnosisTest.cr.registId = this.registId
      this.diagnosisTest.cr.checkType = '1'
      this.diagnosisTest.cr.orderNo = 1
    },
    ddimerChanged() {
      this.diagnosisTest.ddimer.registId = this.registId
      this.diagnosisTest.ddimer.checkType = '2'
      this.diagnosisTest.ddimer.orderNo = 2
    },
    bnpChanged() {
      this.diagnosisTest.bnp.registId = this.registId
      this.diagnosisTest.bnp.checkType = '3'
      this.diagnosisTest.bnp.orderNo = 3
    },
    nTproBNPChanged() {
      this.diagnosisTest.nTproBNP.registId = this.registId
      this.diagnosisTest.nTproBNP.checkType = '4'
      this.diagnosisTest.nTproBNP.orderNo = 4
    },
    myoChanged() {
      this.diagnosisTest.myo.registId = this.registId
      this.diagnosisTest.myo.checkType = '5'
      this.diagnosisTest.myo.orderNo = 5
    },
    ckmbChanged() {
      this.diagnosisTest.ckmb.registId = this.registId
      this.diagnosisTest.ckmb.checkType = '6'
      this.diagnosisTest.ckmb.orderNo = 6
    },
    onTnChanged() {
      this.$nextTick(() => {
        if (this.data.hasCreatinineprotein === '1') {
          if (this.tnTest.length === 0) {
            this.$refs.tnRef.add()
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
