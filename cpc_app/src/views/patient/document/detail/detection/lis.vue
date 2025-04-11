<template>
  <div class="mini">
    <med-radio-button-field
      v-model="data.hasCreatinineprotein"
      :disabled="disabled"
      label="是否有肌钙蛋白"
      :select-options="dictionary.yesOrNoDict"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写是否有肌钙蛋白' }]"
    >
    </med-radio-button-field>
    <med-tn-field
      v-if="data.hasCreatinineprotein === '1'"
      label="肌钙蛋白"
      v-model="tnTest"
      :create-record="createRecord"
      :delete-record="deleteRecord"
      :update-record="updateRecord"
      :unit-options="dictionary.ctnUnitDict"
      :disabled="disabled"
      :result-options="dictionary.testResultDict"
      required
      :rules="[{ required: true, message: '请填写肌钙蛋白' }]"
    >
    </med-tn-field>
    <med-radio-button-field
      v-model="data.hasExamine"
      :disabled="disabled"
      label="是否实验室检查"
      :select-options="dictionary.yesOrNoDict"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写是否实验室检查' }]"
    >
    </med-radio-button-field>
    <div v-if="data.hasExamine == '1'">
      <med-check-select-field
        required
        :rules="[{ required: true, message: '请填写实验室检查类型' }]"
        :disabled="disabled"
        class="font-color"
        v-model="data.examineType"
        label="实验室检查类型"
        :select-options="dictionary.diagnosisTestTypeDict"
        @confirm="onChanged"
      >
      </med-check-select-field>
      <med-lab-result-field
        label="血清肌酐"
        v-model="diagnosisTest.cr"
        :disabled="disabled"
        :unit-options="crDic"
        v-if="isTest('1')"
        @confirm="onCrChanged"
        v-float="{ scale: 2, min: 0, max: 999999 }"
        required
        :rules="[{ required: true, message: '请填写血清肌酐' }]"
      />
      <med-lab-result-field
        label="D-二聚体"
        v-model="diagnosisTest.ddimer"
        :disabled="disabled"
        :unit-options="dictionary.ddimerUnitDict"
        v-if="isTest('2')"
        @confirm="onDdimerChanged"
        v-labResult="{ scale: 2, min: 0, max: 999999 }"
        required
        :rules="[{ required: true, message: '请填写D-二聚体' }]"
      />
      <med-lab-result-field
        label="BNP"
        v-model="diagnosisTest.bnp"
        :disabled="disabled"
        :unit-options="bnpDic"
        v-if="isTest('3')"
        @confirm="onBnpChanged"
        v-labResult="{ scale: 2, min: 0, max: 999999 }"
        required
        :rules="[{ required: true, message: '请填写BNP' }]"
      />
      <med-lab-result-field
        label="NT-proBNP"
        v-model="diagnosisTest.nTproBNP"
        :disabled="disabled"
        :unit-options="bnpDic"
        v-if="isTest('4')"
        @confirm="onProBnpChanged"
        v-labResult="{ scale: 2, min: 0, max: 999999 }"
        required
        :rules="[{ required: true, message: '请填写NT-proBNP' }]"
      />
      <med-lab-result-field
        label="Myo"
        v-model="diagnosisTest.myo"
        :disabled="disabled"
        :unit-options="dictionary.myoUnitDict"
        v-if="isTest('5')"
        @confirm="onMyoChanged"
        v-labResult="{ scale: 2, min: 0, max: 999999 }"
        required
        :rules="[{ required: true, message: '请填写Myo' }]"
      />
      <med-lab-result-field
        label="CKMB"
        v-model="diagnosisTest.ckmb"
        :disabled="disabled"
        :unit-options="dictionary.ckmbUnitDict"
        v-if="isTest('6')"
        @confirm="onCkmbChanged"
        v-labResult="{ scale: 2, min: 0, max: 999999 }"
        required
        :rules="[{ required: true, message: '请填写CKMB' }]"
      />
    </div>
  </div>
</template>

<script>
import Enumerable from 'linq'
import { dicConstant } from '../../../../../constant/commonConstant'
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
  name: 'Lis',
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
      crDic: [{ label: 'umol/L', value: '1' }],
      bnpDic: [{ label: 'pg/mL', value: '1' }]
    }
  },
  computed: {
    ...mapGetters(['dictionary'])
  },
  created() {},
  mounted() {},
  methods: {
    isTest(testKey) {
      if (!this.data.examineType) return false
      return this.data.examineType.indexOf(testKey) > -1
    },
    onChanged() {
      this.$emit('change', 'inspection')
    },
    onCrChanged() {
      this.$emit('change', 'cr')
    },
    onDdimerChanged() {
      this.$emit('change', 'ddimer')
    },
    onBnpChanged() {
      this.$emit('change', 'bnp')
    },
    onProBnpChanged() {
      this.$emit('change', 'proBnp')
    },
    onMyoChanged() {
      this.$emit('change', 'myo')
    },
    onCkmbChanged() {
      this.$emit('change', 'ckmb')
    },
    async createRecord() {
      const item = {
        creatinineprotein: '1',
        registId: this.registId,
        drawBloodTime: moment(new Date()).format('YYYY-MM-DD HH:mm'),
        reportTime: null
      }
      const res = await this.$api.service.updateTn(item)
      if (!res || !res.result) throw new Error('肌钙蛋白添加失败')
      item.id = res.result.id
      this.$emit('updateReportStatus', true)
      return item
    },
    async deleteRecord(item) {
      const res = await this.$api.service.deleteTnById(item.id)
      if (res && res.status === 200) {
        this.$emit('updateReportStatus', true)
        return true
      }
      return false
    },
    async updateRecord(item) {
      try {
        item.timeStamp = this.data.timeStamp
        const res = await this.$api.service.updateTn(item)
        if (res && res.status === 200 && res.result) {
          this.data.timeStamp = res.result.timeStamp
          this.$emit('updateReportStatus', true)
          return true
        }
      } catch (ex) {
        this.$emit('onSaveException', ex)
        return true
      }
      return false
    }
    // getTestItem(checkType) {
    //   return Enumerable.from(this.diagnosisTest).firstOrDefault(
    //     c => c.checkType === checkType
    //   )
    // },
    // onCrUnitChanged(val) {
    //   if (!val) return
    //   this.diagnosisTest.cr.value = val.value
    //   if (val.unit != null) {
    //     this.diagnosisTest.cr.unit = val.unit.value
    //   }
    // },
    // onDdimerUnitChanged(val) {
    //   if (!val) return
    //   this.diagnosisTest.ddimer.value = val.value
    //   if (val.unit != null) {
    //     this.diagnosisTest.ddimer.unit = val.unit.value
    //   }
    // },
    // onBnpUnitChanged(val) {
    //   if (!val) return
    //   this.diagnosisTest.bnp.value = val.value
    //   if (val.unit != null) {
    //     this.diagnosisTest.bnp.unit = val.unit.value
    //   }
    // },
    // onNTproBNPUnitChanged(val) {
    //   if (!val) return
    //   this.diagnosisTest.nTproBNP.value = val.value
    //   if (val.unit != null) {
    //     this.diagnosisTest.nTproBNP.unit = val.unit.value
    //   }
    // },
    // onMyoUnitChanged(val) {
    //   if (!val) return
    //   this.diagnosisTest.myo.value = val.value
    //   if (val.unit != null) {
    //     this.diagnosisTest.myo.unit = val.unit.value
    //   }
    // },
    // onCkmbUnitChanged(val) {
    //   if (!val) return
    //   this.diagnosisTest.ckmb.value = val.value
    //   if (val.unit != null) {
    //     this.diagnosisTest.ckmb.unit = val.unit.value
    //   }
    // }
  }
}
</script>

<style lang="less" scoped></style>
