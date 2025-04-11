<template>
  <div>
    <med-radio-button-field
      v-model="data.isAntiplatelet"
      :disabled="disabled"
      label="是否抗血小板"
      :select-options="dictionary.yesOrNoDict"
      required
      :rules="[{ required: true, message: '请填写是否抗血小板' }]"
      @confirm="onChanged"
    >
    </med-radio-button-field>
    <div v-if="data.isAntiplatelet == 1">
      <med-date-picker
        v-model="data.drugTime"
        label="抗血小板给药时间"
        :min-date="minDate"
        :max-date="maxDate"
        :disabled="disabled"
        required
        :rules="[{ required: true, message: '请填写抗血小板给药时间' }]"
        @confirm="onChanged"
      />
      <med-check-select-field
        v-model="data.antiplatelet"
        :disabled="disabled"
        label="抗血小板药物"
        required
        :rules="[{ required: true, message: '请填写抗血小板药物' }]"
        :select-options="dictionary.drugItemsDict"
        @confirm="onChanged"
      >
      </med-check-select-field>
      <med-radio-select-field
        v-model="data.aspirin"
        v-if="isTest('1')"
        :disabled="disabled"
        label="阿司匹林"
        required
        :rules="[{ required: true, message: '请填写阿司匹林' }]"
        :select-options="aspirinDoseDic"
        @confirm="onChanged"
      >
      </med-radio-select-field>
      <med-radio-select-field
        v-model="data.clopidogrel"
        v-if="isTest('2')"
        :disabled="disabled"
        label="氯吡格雷"
        required
        :rules="[{ required: true, message: '请填写氯吡格雷' }]"
        :select-options="clopidogrelDoseDic"
        @confirm="onChanged"
      >
      </med-radio-select-field>
      <med-radio-select-field
        v-model="data.ticagrelor"
        v-if="isTest('3')"
        :disabled="disabled"
        label="替格瑞洛"
        required
        :rules="[{ required: true, message: '请填写替格瑞洛' }]"
        :select-options="ticagrelorDoseDic"
        @confirm="onChanged"
      >
      </med-radio-select-field>
    </div>
  </div>
</template>

<script>
import { dicConstant, ruleConstant } from '@/constant/commonConstant'
import parseJson from 'parse-json'
import { mapGetters } from 'vuex'
export default {
  name: 'Medicine',
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
      aspirinDoseDic: dicConstant.aspirinDoseDic,
      clopidogrelDoseDic: dicConstant.clopidogrelDoseDic,
      ticagrelorDoseDic: dicConstant.ticagrelorDoseDic,
      query: {
        code: ruleConstant.ANTIPLATELET
      }
    }
  },
  computed: {
    ...mapGetters(['dictionary'])
  },
  created() {
    this.getRuleConstant()
  },
  methods: {
    isTest(testKey) {
      if (!this.data.antiplatelet) return false
      return this.data.antiplatelet.indexOf(testKey) > -1
    },
    onChanged() {
      this.$emit('change')
    },
    getRuleConstant() {
      this.$api.service.getSysSetting(this.query).then(res => {
        if (res.status === 200) {
          if (res.hasOwnProperty('result')) {
            this.setDefalutValue(parseJson(res.result.value))
          }
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    },
    setDefalutValue(settingValue) {
      if (
        settingValue != null &&
        settingValue.isEnabled &&
        settingValue.itemConfig != null
      ) {
        if (
          this.data.antiplatelet != null &&
          this.data.antiplatelet.length > 0
        ) {
          return
        }
        const antiplateletList = settingValue.itemConfig.filter(function(x) {
          return x.code === '1'
        })
        if (antiplateletList != null && antiplateletList.length > 0) {
          const antiplatelet = antiplateletList[0]
          if (antiplatelet.isEnabled) {
            if (this.data.antiplatelet.indexOf('1') < 0) {
              this.data.antiplatelet.push(antiplatelet.code)
            }
            if (this.data.aspirin == null) {
              this.data.aspirin = antiplatelet.defaultDose
            }
          }
        }

        const clopidogrelList = settingValue.itemConfig.filter(function(x) {
          return x.code === '2'
        })
        if (clopidogrelList != null && clopidogrelList.length > 0) {
          const clopidogrel = clopidogrelList[0]
          if (clopidogrel.isEnabled) {
            if (this.data.antiplatelet.indexOf('2') < 0) {
              this.data.antiplatelet.push(clopidogrel.code)
            }
            if (this.data.clopidogrel == null) {
              this.data.clopidogrel = clopidogrel.defaultDose
            }
          }
        }

        const ticagrelorList = settingValue.itemConfig.filter(function(x) {
          return x.code === '3'
        })
        if (ticagrelorList != null && ticagrelorList.length > 0) {
          const ticagrelor = ticagrelorList[0]
          if (ticagrelor.isEnabled) {
            if (this.data.antiplatelet.indexOf('3') < 0) {
              this.data.antiplatelet.push(ticagrelor.code)
            }
            if (this.data.ticagrelor == null) {
              this.data.ticagrelor = ticagrelor.defaultDose
            }
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
