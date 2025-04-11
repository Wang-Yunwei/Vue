<template>
  <div>
    <med-subtitle title="双抗治疗" />
    <el-row :gutter="24">
      <el-col :span="3">
        <med-radio-field
          v-model="data.isAntiplatelet"
          :disabled="disabled"
          label="是否抗血小板"
          :select-options="dictionary.yesOrNoDict"
          form-prop="prehospital.isAntiplatelet"
          :rules="[
            { required: true, message: '请填写是否抗血小板', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col v-if="data.isAntiplatelet == 1" :span="6">
        <med-datetime-field
          v-model="data.drugTime"
          label="抗血小板给药时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          form-prop="prehospital.drugTime"
          :rules="[
            {
              required: true,
              message: '请填写抗血小板给药时间',
              trigger: 'change'
            }
          ]"
        />
      </el-col>
      <el-col v-if="data.isAntiplatelet == 1" :span="6">
        <med-checkbox-field
          v-model="data.antiplatelet"
          display-type="check"
          :disabled="disabled"
          label="抗血小板药物"
          :select-options="dictionary.drugItemsDict"
          form-prop="prehospital.antiplatelet"
          :rules="[
            { required: true, message: '请填写抗血小板药物', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row v-if="data.isAntiplatelet == 1" :gutter="24">
      <el-col :span="6">
        <med-radio-field
          v-if="isTest('1')"
          v-model="data.aspirin"
          radio-type="button"
          :disabled="disabled"
          label="阿司匹林"
          :select-options="aspirinDoseDic"
          form-prop="prehospital.aspirin"
          :rules="[
            { required: true, message: '请填写阿司匹林', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-radio-field
          v-if="isTest('2')"
          v-model="data.clopidogrel"
          radio-type="button"
          :disabled="disabled"
          label="氯吡格雷"
          :select-options="clopidogrelDoseDic"
          form-prop="prehospital.clopidogrel"
          :rules="[
            { required: true, message: '请填写氯吡格雷', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-radio-field
          v-if="isTest('3')"
          v-model="data.ticagrelor"
          radio-type="button"
          :disabled="disabled"
          label="替格瑞洛"
          :select-options="ticagrelorDoseDic"
          form-prop="prehospital.ticagrelor"
          :rules="[
            { required: true, message: '请填写替格瑞洛', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { querySetting } from '@/api/setting'
import { ruleConstant } from '@/constant'
export default {
  name: 'PrehMedicine',
  components: {},
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
      active: 0,
      registId: 0,
      minDate: new Date(2020, 0, 10),
      maxDate: new Date(2025, 10, 1),
      rule: {
        isEnabled: false,
        itemConfig: []
      },
      aspirinDoseDic: [
        { label: '0 mg', value: '0' },
        { label: '100 mg', value: '100' },
        { label: '300 mg', value: '300' },
        { label: '其他剂量', value: '999' }
      ],
      clopidogrelDoseDic: [
        { label: '0 mg', value: '0' },
        { label: '300 mg', value: '300' },
        { label: '600 mg', value: '600' },
        { label: '其他剂量', value: '999' }
      ],
      ticagrelorDoseDic: [
        { label: '0 mg', value: '0' },
        { label: '90 mg', value: '90' },
        { label: '180 mg', value: '180' },
        { label: '其他剂量', value: '999' }
      ]
    }
  },
  computed: {
    ...mapGetters(['dictionary', 'hospitalId'])
  },
  created() {
    this.sync()
    this.$eventBus.$on('syncDefaultValues', this.sync)
  },
  beforeDestroy() {
    this.$eventBus.$off('syncDefaultValues', this.sync)
  },
  methods: {
    async sync() {
      const { result } = await querySetting({
        code: ruleConstant.ANTIPLATELET,
        hospitalId: this.hospitalId
      })
      if (result) {
        this.rule = JSON.parse(result.value)

        if (this.rule.isEnabled === true) {
          const syncAntiplatelet =
            this.data.antiplatelet === null ||
            this.data.antiplatelet === undefined ||
            this.data.antiplatelet.length === 0
          if (syncAntiplatelet) this.data.antiplatelet = []

          // aspirin
          const aspirin = this.rule.itemConfig.find(
            (c) => c.code === '1' && c.isEnabled
          )
          if (aspirin && aspirin.isEnabled) {
            if (syncAntiplatelet) this.data.antiplatelet.push(aspirin.code)
            this.data.aspirin = this.data.aspirin
              ? this.data.aspirin
              : aspirin.defaultDose
          }

          // clopidogrel
          const clopidogrel = this.rule.itemConfig.find(
            (c) => c.code === '2' && c.isEnabled
          )
          if (clopidogrel && clopidogrel.isEnabled) {
            if (syncAntiplatelet) this.data.antiplatelet.push(clopidogrel.code)
            this.data.clopidogrel = this.data.clopidogrel
              ? this.data.clopidogrel
              : clopidogrel.defaultDose
          }

          // ticagrelor
          const ticagrelor = this.rule.itemConfig.find(
            (c) => c.code === '3' && c.isEnabled
          )
          if (ticagrelor && ticagrelor.isEnabled) {
            if (syncAntiplatelet) this.data.antiplatelet.push(ticagrelor.code)
            this.data.ticagrelor = this.data.ticagrelor
              ? this.data.ticagrelor
              : ticagrelor.defaultDose
          }
        }
      }
    },
    isTest(testKey) {
      if (!this.data.antiplatelet) return false
      return this.data.antiplatelet.indexOf(testKey) > -1
    }
  }
}
</script>

<style lang="scss" scoped></style>
