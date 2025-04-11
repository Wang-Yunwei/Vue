<template>
  <div class="content-wrapper">
    <el-form
      ref="phepform"
      :model="data"
      label-width="80px"
      label-position="top"
    >
      <div>
        <admission
          :data="data.prehospital"
          :data-admission="data.admission"
          :data-regist="data.regist"
          :data-main="data.main"
          :disabled="disabled"
          :is-bound="isBound"
          @showimport="showimport"
        />
        <vitalsigns :data="data.prehospital" :disabled="disabled" />
        <ecg
          :data="data.prehospital"
          :data-ecg="data.prehospitalEcgList"
          :disabled="disabled"
          @ecgchanged="ecgchanged"
        />
        <mdt :data="data.prehospital" :disabled="disabled" />
        <diagnosis :data="data.prehospital" :disabled="disabled" />
        <medicine
          v-if="data.prehospital"
          :data="data.prehospital"
          :disabled="disabled"
        />
        <thrombolysis
          :data="data.prehospital"
          :disabled="disabled"
        />
        <handover
          v-if="data.admission.comeType == 1 || data.admission.comeType == 2"
          :data="data.prehospital"
          :data-admission="data.admission"
          :disabled="disabled"
          @change="onAdmissionChanged"
        />
      </div>
    </el-form>
  </div>
</template>

<script>
import admission from './admission'
import vitalsigns from './vitalsigns'
import ecg from './ecg'
import medicine from './medicine'
import thrombolysis from './thrombolysis'
import mdt from './mdt'
import diagnosis from './diagnosis'
import handover from './handover'
import { debounce } from 'lodash'
export default {
  name: 'Prehospital',
  components: {
    admission,
    vitalsigns,
    ecg,
    medicine,
    thrombolysis,
    mdt,
    diagnosis,
    handover
  },
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
      registId: 0
    }
  },
  computed: {
    isBound() {
      return !!this.data?.regist.emId
    }
  },
  created() {},
  methods: {
    showimport(item) {
      this.$emit('showimport', item)
    },
    save: debounce(function() {
      this.data.prehospital.registId = this.$route.query.registId
      this.$api.service.savePhepInfo(this.data.prehospital).then((res) => {
        if (res.status === 200) {
          // this.$notify({ type: 'success', message: '保存成功' })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, 300),

    saveEcg() {
      var ordrNo = 0
      this.data.prehospitalEcgList.forEach((opt) => {
        opt.registId = this.$route.query.registId
        opt.flag = 1
        opt.orderNo = ordrNo++
      })
      this.$api.service.saveEcg(this.data.prehospitalEcgList).then((res) => {
        if (res.status === 200) {
          // this.$notify({ type: 'success', message: '保存成功' })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    },
    onAdmissionChanged() {
      this.save()
    },
    onEcgChanged() {
      this.saveEcg()
    },
    ecgchanged(ecgList) {
      this.data.prehospitalEcgList = ecgList
    },
    validate() {
      return new Promise((resolve, reject) => {
        const formRef = this.$refs['phepform']
        formRef.validate((valid, err) => {
          const errors = Object.keys(err).reduce((arr, key) => {
            const label = formRef.fields.find((f) => f.prop === key)?.label
            return arr.concat([
              {
                module: '院前急救',
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
      this.$refs['phepform'].clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped></style>
