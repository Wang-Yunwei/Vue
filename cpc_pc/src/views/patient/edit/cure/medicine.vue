<template>
  <div>
    <med-subtitle title="用药治疗" />
    <el-row :gutter="24">
      <el-col :span="3">
        <med-radio-field
          v-model="data.isAntiplatelet"
          form-prop="treatment.isAntiplatelet"
          :disabled="disabled"
          label="是否双抗给药"
          :select-options="dictionary.yesOrNoDict"
          :rules="[
            { required: true, message: '请填写是否双抗给药', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col v-if="data.isAntiplatelet === '1'" :span="8">
        <med-checkbox-field
          v-model="data.antiplateletDrug"
          form-prop="treatment.antiplateletDrug"
          display-type="check"
          label="双抗药物"
          :disabled="disabled"
          :select-options="dictionary.drugItemsDict"
          :rules="[
            { required: true, message: '请填写双抗药物', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <div v-if="data.isAntiplatelet === '1'">
      <div v-if="isAnticoagulationDrug('1')">
        <el-row :gutter="24">
          <el-col :span="6">
            <med-datetime-field
              v-model="data.aspirinTime"
              form-prop="treatment.aspirinTime"
              label="阿司匹林给药时间"
              :min-date="minDate"
              :max-date="maxDate"
              :disabled="disabled"
              :rules="[
                {
                  required: true,
                  message: '请填写阿司匹林给药时间',
                  trigger: 'change'
                }
              ]"
              @confirm="onChanged"
            />
          </el-col>
          <el-col :span="6">
            <med-radio-field
              v-model="data.aspirinDose"
              form-prop="treatment.aspirinDose"
              radio-type="button"
              :disabled="disabled"
              label="阿司匹林剂量"
              :select-options="aspirinDoseDic"
              :rules="[
                {
                  required: true,
                  message: '请填写阿司匹林剂量',
                  trigger: 'change'
                }
              ]"
            />
          </el-col>
        </el-row>
      </div>
      <div v-if="isAnticoagulationDrug('2')">
        <el-row :gutter="24">
          <el-col :span="6">
            <med-datetime-field
              v-model="data.clopidogrelTime"
              form-prop="treatment.clopidogrelTime"
              label="氯吡格雷给药时间"
              :min-date="minDate"
              :max-date="maxDate"
              :disabled="disabled"
              :rules="[
                {
                  required: true,
                  message: '请填写氯吡格雷给药时间',
                  trigger: 'change'
                }
              ]"
              @confirm="onChanged"
            />
          </el-col>
          <el-col :span="6">
            <med-radio-field
              v-model="data.clopidogrelDose"
              form-prop="treatment.clopidogrelDose"
              radio-type="button"
              :disabled="disabled"
              label="氯吡格雷剂量"
              :select-options="clopidogrelDoseDic"
              :rules="[
                {
                  required: true,
                  message: '请填写氯吡格雷剂量',
                  trigger: 'change'
                }
              ]"
            />
          </el-col>
        </el-row>
      </div>
      <div v-if="isAnticoagulationDrug('3')">
        <el-row :gutter="24">
          <el-col :span="6">
            <med-datetime-field
              v-model="data.tigrilloTime"
              form-prop="treatment.tigrilloTime"
              label="替格瑞洛给药时间"
              :min-date="minDate"
              :max-date="maxDate"
              :disabled="disabled"
              :rules="[
                {
                  required: true,
                  message: '请填写替格瑞洛给药时间',
                  trigger: 'change'
                }
              ]"
              @confirm="onChanged"
            />
          </el-col>
          <el-col :span="6">
            <med-radio-field
              v-model="data.tigrilloDose"
              form-prop="treatment.tigrilloDose"
              radio-type="button"
              :disabled="disabled"
              label="替格瑞洛剂量"
              :select-options="ticagrelorDoseDic"
              :rules="[
                {
                  required: true,
                  message: '请填写替格瑞洛剂量',
                  trigger: 'change'
                }
              ]"
            />
          </el-col>
        </el-row>
      </div>
    </div>
    <el-row :gutter="24">
      <el-col :span="3">
        <med-radio-field
          v-model="data.isAnticoagulation"
          form-prop="treatment.isAnticoagulation"
          :disabled="disabled"
          label="术前抗凝"
          :select-options="dictionary.yesOrNoDict"
          :rules="[
            { required: true, message: '请填写术前抗凝', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <div v-if="data.isAnticoagulation == '1'">
      <el-row :gutter="24">
        <el-col :span="6">
          <med-radio-field
            v-model="data.anticoagulationDrug"
            :disabled="disabled"
            label="抗凝药物"
            :select-options="dictionary.anticoagulationDrugDict"
          />
        </el-col>
        <el-col :span="6">
          <med-datetime-field
            v-model="data.anticoagulationTime"
            label="抗凝时间"
            :min-date="minDate"
            :max-date="maxDate"
            :disabled="disabled"
          />
        </el-col>
        <el-col :span="6">
          <med-unit-field
            v-model="anticoagulation"
            form-prop="treatment.anticoagulationDose"
            :disabled="disabled"
            label="抗凝剂量"
            :max="999999"
            :scale="2"
            required
            :unit-options="dictionary.anticoagulationUnitDict"
            @change="onAnticoagulationConfirm"
          />
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="24">
      <el-col :span="3">
        <med-radio-field
          v-model="data.isStatin"
          :disabled="disabled"
          label="他汀治疗"
          :select-options="dictionary.yesOrNoDict"
        />
      </el-col>
      <el-col :span="3">
        <med-radio-field
          v-model="data.isBetaBlocker"
          form-prop="treatment.isBetaBlocker"
          :disabled="disabled"
          label="β受体阻滞剂"
          required
          :select-options="dictionary.yesOrNoDict"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ruleConstant } from '@/constant/index'
import { querySetting } from '@/api/setting'
export default {
  name: 'CureMedicine',
  props: {
    registId: {
      type: String,
      require: true,
      default: ''
    },
    data: {
      required: true,
      type: Object,
      default: () => {}
    },
    disabled: {
      required: false,
      type: Boolean
    }
  },
  data() {
    return {
      active: 0,
      minDate: new Date(2020, 0, 10),
      maxDate: new Date(2025, 10, 1),
      anticoagulation: {
        value: '',
        unit: ''
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
  watch: {},
  created() {
    this.syncAntiplatelet()
    this.sync()
    this.$eventBus.$on('syncDefaultValues', this.onSyncDefaultValues)
  },
  beforeDestroy() {
    this.$eventBus.$off('syncDefaultValues',this.onSyncDefaultValues)
  },
  mounted() {
    this.anticoagulation.value = this.data.anticoagulationDose
    this.anticoagulation.unit = this.data.anticoagulationUnit
  },
  methods: {
    onSyncDefaultValues() {
      this.syncAntiplatelet()
      this.sync()
    },
    async syncAntiplatelet() {
      const { result } = await querySetting({
        code: ruleConstant.ANTIPLATELET,
        hospitalId: this.hospitalId
      })
      if (result) {
        this.rule = JSON.parse(result.value)

        if (this.rule.isEnabled === true) {
          const syncAntiplatelet =
            this.data.antiplateletDrug === null ||
            this.data.antiplateletDrug === undefined ||
            this.data.antiplateletDrug.length === 0
          if (syncAntiplatelet) this.data.antiplateletDrug = []

          // aspirin
          const aspirin = this.rule.itemConfig.find(
            (c) => c.code === '1' && c.isEnabled
          )
          if (aspirin && aspirin.isEnabled) {
            if (syncAntiplatelet) this.data.antiplateletDrug.push(aspirin.code)
            this.data.aspirinDose = this.data.aspirinDose
              ? this.data.aspirinDose
              : aspirin.defaultDose
          }

          // clopidogrel
          const clopidogrel = this.rule.itemConfig.find(
            (c) => c.code === '2' && c.isEnabled
          )
          if (clopidogrel && clopidogrel.isEnabled) {
            if (syncAntiplatelet) { this.data.antiplateletDrug.push(clopidogrel.code) }
            this.data.clopidogrelDose = this.data.clopidogrelDose
              ? this.data.clopidogrelDose
              : clopidogrel.defaultDose
          }

          // ticagrelor
          const ticagrelor = this.rule.itemConfig.find(
            (c) => c.code === '3' && c.isEnabled
          )
          if (ticagrelor && ticagrelor.isEnabled) {
            if (syncAntiplatelet) { this.data.antiplateletDrug.push(ticagrelor.code) }
            this.data.tigrilloDose = this.data.tigrilloDose
              ? this.data.tigrilloDose
              : ticagrelor.defaultDose
          }
        }
      }
    },
    async sync() {
      const { result } = await querySetting({
        code: ruleConstant.ANTICOAGULATION,
        hospitalId: this.hospitalId
      })
      if (result) {
        this.rule = JSON.parse(result.value)

        if (this.rule.isEnabled === true) {
          // 抗凝药物
          const knyw = this.rule.itemConfig.find(
            (c) => c.code === '1' && c.isEnabled
          )
          if (knyw && knyw.isEnabled) {
            this.data.anticoagulationDrug = this.data.anticoagulationDrug
              ? this.data.anticoagulationDrug
              : knyw.defaultDrug
            this.anticoagulation.value = this.anticoagulation.value
              ? this.anticoagulation.value
              : knyw.defaultDose
            this.anticoagulation.unit = this.anticoagulation.unit
              ? this.anticoagulation.unit
              : knyw.defaultUnit
            this.onAnticoagulationConfirm()
          }
        } else {
          this.anticoagulation.unit = this.anticoagulation.unit
            ? this.anticoagulation.unit
            : '1'
        }
      }
    },
    isAnticoagulationDrug(testKey) {
      if (!this.data.antiplateletDrug) return false
      return this.data.antiplateletDrug.indexOf(testKey) > -1
    },
    onAnticoagulationConfirm() {
      this.data.anticoagulationUnit = this.anticoagulation.unit
      this.data.anticoagulationDose = this.anticoagulation.value
      this.data.registId = this.registId
    },
    onChanged() {}
  }
}
</script>

<style lang="scss" scoped></style>
