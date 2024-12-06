<template>
  <med-popup-container title="院前体格检查" v-bind="$attrs" v-on="$listeners" @backClick="goBack">
    <div class="physical-examination-body">
      <med-radio-select-field label="创伤出血" v-model="form.bleeding"
        :select-options="[{ label: '有', value: '1' }, { label: '无', value: '0' }]" />
      <van-field label="出血部位" placeholder="请选择出血部位" right-icon="arrow-down" v-if="form.bleeding === '1'">
        <template #input>
          <med-select v-model="form.bleedingPart" :multiple="{ stringValue: true }" :options="BLEEDING_PART" v-clear />
        </template>
      </van-field>
      <van-field label="具体交界部位" placeholder="请选择出血部位" right-icon="arrow-down"
        v-if="form.bleeding === '1' && (form.bleedingPart || '').includes('04')">
        <template #input>
          <med-select v-model="form.specificJunction" :multiple="{ stringValue: true }" :options="SPECIFIC_JUNCTION"
            v-clear />
        </template>
      </van-field>
      <med-radio-select-field label="瞳孔" v-model="form.pupilResponse" :select-options="PUPIL_0001" />
      <med-radio-select-field label="瞳孔对光反射" v-model="form.lightReflection" :select-options="LIGHT_0001" />
      <med-radio-select-field label="意识" v-model="form.consciousness" :select-options="CONS_0001" />
      <med-radio-select-field label="气道" v-model="form.airway" :select-options="AIRWAY_0001" />
      <med-radio-select-field label="循环" v-model="form.cycle" :select-options="CYCLE_0001" />
      <med-radio-select-field label="心律" v-model="form.heartRate" :select-options="HEARTRATE_0001" />
      <med-radio-select-field label="胸部" v-model="form.chest" :select-options="CHEST_0001" />
      <med-radio-select-field label="腹部" v-model="form.belly" :select-options="BELLY_0001" />
      <med-radio-select-field label="肠鸣" v-model="form.borborygmus" :select-options="BORY_0001" />
      <med-radio-select-field label="肌张力" v-model="form.muscular" :select-options="MUSCULAR_0001" />
      <med-radio-select-field label="骨折" v-model="form.fracture" :select-options="FRACTURE_0001" />
      <med-text-field label="其他" v-model="form.checkOther" maxlength="100" v-noSS />
    </div>
  </med-popup-container>
</template>
<script>
import dictionariesMixin from '@mixins/dictionariesMixin'
export default {
  name: 'PhysicalExamination',
  directives: {
    clear: {
      // 卸载组件时自动清除v-model值
      unbind: (...arg) => arg[2]?.data?.model?.callback(void 0)
    }
  },
  mixins: [dictionariesMixin],
  model: {
    prop: 'show',
    event: '_change'
  },
  props: {
    data: {
      type: Object,
      default: () => { }
    },
    isShowPe: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        prehospital: {}
      }
    }
  },
  methods: {
    goBack() {
      // 返回
      this.$emit('close', this.form)
    }
  },
  watch: {
    isShowPe(val) {
      if (val) {
        this.form = { ...this.data }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.physical-examination-body {
  position: fixed;
  top: 140px;
  left: 0;
  right: 0;
}
</style>
