<template>
  <div class="content-wrapper">
    <el-form
      ref="treatmentform"
      :model="data"
      label-width="80px"
      label-position="top"
    >
      <div>
        <medicine
          v-if="data.treatment"
          :regist-id="data.regist.id"
          :data="data.treatment"
          :disabled="disabled"
        />
        <measures v-if="!isStemi" :data="data.treatment" :disabled="disabled" />
        <reperfusion
          v-if="isStemi"
          :data="data.treatment"
          :disabled="disabled"
        />
        <ppci v-if="showPPCI" :data="data.treatment" :disabled="disabled" />
        <thrombolysis
          v-if="showThrombolysis"
          :data="data.treatment"
          :disabled="disabled"
        />
        <electivepci
          v-if="showElectivePCI"
          :data="data.treatment"
          :disabled="disabled"
        />
        <cabg v-if="showCABG" :data="data.treatment" :disabled="disabled" />
        <transitpci
          v-if="showTransitPCI"
          :data="data.treatment"
          :disabled="disabled"
        />
      </div>
    </el-form>
  </div>
</template>

<script>
import measures from './measures'
import medicine from './medicine'
import reperfusion from './reperfusion'
import ppci from './ppci'
import thrombolysis from './thrombolysis'
import electivepci from './electivepci'
import cabg from './cabg'
import transitpci from './transitpci'
import { debounce } from 'lodash'

export default {
  name: 'Cure',
  components: {
    measures,
    medicine,
    reperfusion,
    ppci,
    thrombolysis,
    electivepci,
    cabg,
    transitpci
  },
  props: {
    data: {
      required: true,
      type: Object,
      default: () => {}
    },
    disabled: {
      required: false,
      type: Boolean
    },
    isStemi: {
      required: false,
      type: Boolean
    }
  },
  data() {
    return {
      active: 0,
      registId: 0
    }
  },
  computed: {
    cure() {
      return this.data.treatment
    },
    showPPCI() {
      if (
        this.isStemi &&
        this.data.treatment.isReperfusion === '1' &&
        this.data.treatment.reperfusionMeasure === '1'
      ) {
        return true
      } else if (
        !this.isStemi &&
        this.data.treatment.strategy === '2' &&
        this.data.treatment.invasiveStrategy === '1'
      ) {
        return true
      }
      return false
    },
    showThrombolysis() {
      if (this.data.treatment.isReperfusion !== '1') return false
      if (!this.isStemi) return false
      return this.data.treatment.reperfusionMeasure === '2'
    },
    showElectivePCI() {
      if (this.data.treatment.isReperfusion !== '1') return false
      return this.isStemi && this.data.treatment.reperfusionMeasure === '3'
    },
    showCABG() {
      if (this.data.treatment.isReperfusion !== '1') return false
      return this.isStemi && this.data.treatment.reperfusionMeasure === '4'
    },
    showTransitPCI() {
      if (this.data.treatment.isReperfusion !== '1') return false
      return this.isStemi && this.data.treatment.reperfusionMeasure === '5'
    }
  },
  created() {},
  methods: {
    save: debounce(function() {
      this.data.treatment.registId = this.$route.query.registId
      this.$api.service.saveTreatment(this.data.treatment).then((res) => {
        if (res.status === 200) {
          // this.$notify({ type: 'success', message: '保存成功' })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, 300),
    validate() {
      return new Promise((resolve, reject) => {
        const formRef = this.$refs['treatmentform']
        formRef.validate((valid, err) => {
          const errors = Object.keys(err).reduce((arr, key) => {
            const label = formRef.fields.find((f) => f.prop === key)?.label
            return arr.concat([
              {
                module: '院内诊疗',
                fieldName: label,
                message: '必填'
              }
            ])
          }, [])
          if (valid) {
            resolve(true)
          } else {
            reject({ errors })
          }
        })
      })
    },
    clearValidate() {
      this.$refs['treatmentform'].clearValidate()
    }
  }
}
</script>

<style lang="less" scoped></style>
