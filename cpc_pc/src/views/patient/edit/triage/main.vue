<template>
  <div class="content-wrapper">
    <el-form
      ref="triageform"
      :model="data"
      label-width="80px"
      label-position="top"
    >
      <div>
        <admission
          :data="data.admission"
          :data-main="data.main"
          :data-regist="data.regist"
          :data-pre="data.prehospital"
          :disabled="disabled"
          :is-bound="isBound"
          @showimport="showimport"
          @change="onEntityChanged"
        />
        <vitalsigns
          :data="data.admission"
          :disabled="disabled"
          @change="onEntityChanged"
        />
        <!-- <ecg
          :data="data.admission"
          :data-ecg="data.admissionEcgList"
          :disabled="disabled"
          @change="onEntityChanged"
          @ecgchanged="ecgchanged"
        /> -->
        <outcome
          :data="data.admission"
          :disabled="disabled"
          @change="onEntityChanged"
        />
      </div>
    </el-form>
  </div>
</template>

<script>
import admission from './admission'
// import ecg from './ecg'
import vitalsigns from './vitalsigns'
import outcome from './outcome'
import { debounce } from 'lodash'
export default {
  name: 'Triage',
  components: {
    admission,
    vitalsigns,
    // ecg,
    outcome
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
      // 是否已绑定
      return !!this.data?.regist.emId
    }
  },
  created() {},
  methods: {
    showimport(item) {
      this.$emit('showimport', item)
    },
    save: debounce(function() {
      this.data.admission.registId = this.$route.query.registId
      // console.log(this.data.admission)
      this.$api.service.saveAdmission(this.data.admission).then((res) => {
        if (res.status === 200) {
          // this.$notify({ type: 'success', message: '保存成功' })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, 300),
    saveRegist: debounce(function() {
      this.data.regist.id = this.$route.query.registId
      // console.log(this.data.admission)
      this.$api.service.saveRegist(this.data.regist).then((res) => {
        if (res.status === 200) {
          this.$notify({ type: 'success', message: '保存成功' })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, 300),
    saveMain: debounce(function() {
      this.data.main.registId = this.$route.query.registId
      this.$api.service.saveMain(this.data.main).then((res) => {
        if (res.status === 200) {
          // this.$notify({ type: 'success', message: '保存成功' })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, 300),
    saveEcg() {
      var ordrNo = 0
      this.data.admissionEcgList.forEach((opt) => {
        opt.registId = this.$route.query.registId
        opt.flag = 2
        opt.orderNo = ordrNo++
      })
      this.$api.service.saveEcg(this.data.admissionEcgList).then((res) => {
        if (res.status === 200) {
          // this.$notify({ type: 'success', message: '保存成功' })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    },
    onEntityChanged(type) {
      if (type === '1') {
        this.save()
      } else if (type === '2') {
        this.saveMain()
      }
    },
    ecgchanged(ecgList) {
      this.data.admissionEcgList = ecgList
    },
    validate() {
      return new Promise((resolve, reject) => {
        const formRef = this.$refs['triageform']
        formRef.validate((valid, err) => {
          const errors = Object.keys(err).reduce((arr, key) => {
            const label = formRef.fields.find((f) => f.prop === key)?.label
            return arr.concat([
              {
                module: '急诊分诊',
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
      this.$refs['triageform'].clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped></style>
