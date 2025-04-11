<template>
  <div>
    <med-hint-field
      v-bind.sync="$attrs"
      v-on="$listeners"
      readonly
      link
      @click="!disabled && (showInpatients = true)"
      :disabled="disabled"
    />
    <van-popup v-model="showInpatients" position="right">
      <Inpatients
        v-if="showInpatients"
        :type="type"
        :patientName="patientName"
        @backClick="inpatientsBack"
        @selectItem="handleSelectInpatient"
      />
    </van-popup>
  </div>
</template>

<script>
// 患者列表选择
import Inpatients from './Inpatients'

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    patientName: {
      type: String,
      required: true,
      default: ''
    },
    // 患者类型  1:急救, 2:急诊(分诊)，3:门诊，4:住院
    type: {
      type: String,
      required: true,
      default: ''
    }
  },
  components: { Inpatients },
  data() {
    return {
      showInpatients: false
    }
  },
  methods: {
    inpatientsBack() {
      this.showInpatients = false
    },
    handleSelectInpatient(v) {
      const closePopCallBack = () => {
        console.log()
        this.showInpatients = false
      }
      this.$emit('selectItem', v, closePopCallBack)
    }
  }
}
</script>

<style></style>
