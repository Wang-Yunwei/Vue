<template>
  <div class="mini">
    <med-radio-button-field
      v-model="data.hasMedicalimages"
      :disabled="disabled"
      label="是否影像学检查"
      :select-options="yesOrNoDic"
      :required="data.diagnosis === '4' || data.diagnosis === '5'"
      :rules="[
        {
          required: data.diagnosis === '4' || data.diagnosis === '5',
          message: '请填写是否影像学检查'
        }
      ]"
      @confirm="onChanged"
    >
    </med-radio-button-field>
    <div v-if="data.hasMedicalimages == '1'">
      <med-check-select-field
        v-model="data.medicalimagesType"
        label="影像学检查类型"
        :disabled="disabled"
        :select-options="pacsTypeDicDesc"
        :required="data.diagnosis === '4' || data.diagnosis === '5'"
        :rules="[
          {
            required: data.diagnosis === '4' || data.diagnosis === '5',
            message: ''
          }
        ]"
        @confirm="onChanged"
      />
      <div v-if="isPacs('1')">
        <med-date-picker
          v-model="dataScreenage.ect.noticeTime"
          label="通知CT室时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          @confirm="onEctChanged"
          required
          :rules="[{ required: true, message: '请填写通知CT室时间' }]"
        />
        <med-date-picker
          v-model="dataScreenage.ect.enterTime"
          label="CT室完成准备"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          @confirm="onEctChanged"
          required
          :rules="[{ required: true, message: '请填写CT室完成准备' }]"
        />
        <med-date-picker
          v-model="dataScreenage.ect.checkTime"
          label="CT扫描开始时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          @confirm="onEctChanged"
        />
        <med-date-picker
          v-model="dataScreenage.ect.reportTime"
          label="CT报告时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          @confirm="onEctChanged"
        />
      </div>
      <div v-if="isPacs('2') && data.diagnosis === '4'">
        <med-date-picker
          v-model="dataScreenage.cdu.noticeTime"
          label="通知彩超室时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          @confirm="onCduChanged"
        />
        <med-date-picker
          v-model="dataScreenage.cdu.checkTime"
          label="彩超检查时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          @confirm="onCduChanged"
        />
        <med-date-picker
          v-model="dataScreenage.cdu.reportTime"
          label="彩超出结果时间"
          :min-date="minDate"
          :max-date="maxDate"
          :disabled="disabled"
          @confirm="onCduChanged"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { dicConstant } from '../../../../../constant/commonConstant'

export default {
  name: 'Task',
  components: {},
  props: {
    data: {
      required: true,
      type: Object
    },
    dataScreenage: {
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
      yesOrNoDic: [],
      pacsTypeDic: [],
      codeList: [dicConstant.yesOrNoCode, dicConstant.pacsTypeCode]
    }
  },
  computed: {
    pacsTypeDicDesc() {
      if (this.data.diagnosis != null && this.data.diagnosis === '5') {
        return this.pacsTypeDic.filter(function(x) {
          return x.value === '1'
        })
      }
      return this.pacsTypeDic
    }
  },
  created() {
    this.getDicList()
  },
  methods: {
    getDicList() {
      this.$api.service.getDictionary('').then(result => {
        this.yesOrNoDic = result[dicConstant.yesOrNoCode]
        this.pacsTypeDic = result[dicConstant.pacsTypeCode]
      })
    },
    isPacs(pacsKey) {
      if (!this.data.medicalimagesType) return false
      return this.data.medicalimagesType.indexOf(pacsKey) > -1
    },
    onChanged() {
      this.$emit('change', 'inspection')
    },
    onEctChanged() {
      this.$emit('change', 'ect')
    },
    onCduChanged() {
      this.$emit('change', 'cdu')
    }
  },
  watch: {
    'data.diagnosis': {
      immediate: false,
      handler(newval, oldVal) {
        if (newval === '5') {
          if (
            this.data.medicalimagesType != null &&
            this.data.medicalimagesType.indexOf('1') < 0
          ) {
            this.data.medicalimagesType.push('1')
          }
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped></style>
