<template>
  <div class="content-wrapper">
    <el-form
      ref="dischargeform"
      :model="data"
      label-width="80px"
      label-position="top"
    >
      <div>
        <diagnosis
          :data="data.discharge"
          :data-main="data.main"
          :data-regist="data.regist"
          :disabled="disabled"
          :is-bound="isBound"
          @showimport="showimport"
          @change="onChanged"
        />
        <riskfactors
          v-if="
            data.discharge.diagnosis === '1' ||
              data.discharge.diagnosis === '2' ||
              data.discharge.diagnosis === '3'
          "
          :data="data.discharge"
          :disabled="disabled"
          @change="onChanged"
        />
        <complications
          v-if="
            data.discharge.diagnosis === '1' ||
              data.discharge.diagnosis === '2' ||
              data.discharge.diagnosis === '3'
          "
          :data="data.discharge"
          :disabled="disabled"
          @change="onChanged"
        />
        <test
          v-if="
            data.discharge.diagnosis === '1' ||
              data.discharge.diagnosis === '2' ||
              data.discharge.diagnosis === '3'
          "
          :data="data.discharge"
          :disabled="disabled"
          @change="onChanged"
        />
        <medicine
          v-if="data.discharge"
          :data="data.discharge"
          :disabled="disabled"
          @change="onChanged"
        />
        <outcome
          :data="data.discharge"
          :data-treatment="data.treatment"
          :disabled="disabled"
          @change="onChanged"
        />
        <medicinetake
          v-if="
            data.discharge.outcomeCode == '1' &&
              ['1', '2', '3'].includes(data.discharge.diagnosis)
          "
          :data="data.discharge"
          :discharge-drugs-list1="data.dischargeDrugsList"
          :disabled="disabled"
          @drugchange="onDrugChanged"
        />
      </div>
    </el-form>
  </div>
</template>

<script>
import diagnosis from './diagnosis'
import riskfactors from './riskfactors'
import complications from './complications'
import test from './test'
import medicine from './medicine'
import outcome from './outcome'
import medicinetake from './medicinetake'
import { debounce } from 'lodash'
export default {
  name: 'Discharge',
  components: {
    diagnosis,
    riskfactors,
    complications,
    test,
    medicine,
    outcome,
    medicinetake
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
      this.data.discharge.registId = this.$route.query.registId
      // console.log(this.data.discharge)
      this.$api.service.saveDischarge(this.data.discharge).then((res) => {
        if (res.status === 200) {
          // this.$notify({ type: 'success', message: '保存成功' })
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, 300),
    saveTroponinH72: debounce(function() {
      this.data.discharge.troponinH72.registId = this.$route.query.registId
      console.log(this.data.discharge.troponinH72)

      if (this.data.discharge.troponinH72.type === '1') {
        this.data.discharge.troponinH72.category = '1'
      } else {
        this.data.discharge.troponinH72.category = '2'
      }

      this.$api.service
        .saveDischargeTes(this.data.discharge.troponinH72)
        .then((res) => {
          if (res.status === 200) {
            // this.$notify({ type: 'success', message: '保存成功' })
          } else {
            // this.$notify({ type: 'warning', message: res.message })
          }
        })
    }, 300),
    saveBnp: debounce(function() {
      this.data.discharge.bnp.registId = this.$route.query.registId
      // console.log(this.data.discharge.bnp)

      if (this.data.discharge.bnp.type === '1') {
        this.data.discharge.bnp.category = '3'
      } else {
        this.data.discharge.bnp.category = '4'
      }

      this.$api.service
        .saveDischargeTes(this.data.discharge.bnp)
        .then((res) => {
          if (res.status === 200) {
            // this.$notify({ type: 'success', message: '保存成功' })
          } else {
            // this.$notify({ type: 'warning', message: res.message })
          }
        })
    }, 300),
    saveTc: debounce(function() {
      this.data.discharge.tc.registId = this.$route.query.registId
      this.data.discharge.tc.category = '5'
      console.log(this.data.discharge.tc)

      this.$api.service.saveDischargeTes(this.data.discharge.tc).then((res) => {
        if (res.status === 200) {
          // this.$notify({ type: 'success', message: '保存成功' })
        } else {
          // this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, 300),
    saveTg: debounce(function() {
      this.data.discharge.tg.registId = this.$route.query.registId
      this.data.discharge.tg.category = '6'
      console.log(this.data.discharge.tg)

      this.$api.service.saveDischargeTes(this.data.discharge.tg).then((res) => {
        if (res.status === 200) {
          // this.$notify({ type: 'success', message: '保存成功' })
        } else {
          // this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, 300),
    saveHdlC: debounce(function() {
      this.data.discharge.hdlC.registId = this.$route.query.registId
      this.data.discharge.hdlC.category = '7'
      console.log(this.data.discharge.hdlC)

      this.$api.service
        .saveDischargeTes(this.data.discharge.hdlC)
        .then((res) => {
          if (res.status === 200) {
            // this.$notify({ type: 'success', message: '保存成功' })
          } else {
            // this.$notify({ type: 'warning', message: res.message })
          }
        })
    }, 300),
    saveLdlC: debounce(function() {
      this.data.discharge.ldlC.registId = this.$route.query.registId
      this.data.discharge.ldlC.category = '8'
      console.log(this.data.discharge.ldlC)

      this.$api.service
        .saveDischargeTes(this.data.discharge.ldlC)
        .then((res) => {
          if (res.status === 200) {
            // this.$notify({ type: 'success', message: '保存成功' })
          } else {
            // this.$notify({ type: 'warning', message: res.message })
          }
        })
    }, 300),
    saveJtyw: debounce(function() {
      // 保存住院期间用药-降糖药物
      this.data.discharge.jtyw.registId = this.$route.query.registId
      console.log(this.data.discharge.jtyw)

      this.$api.service.saveInnaiDrugs(this.data.discharge.jtyw).then((res) => {
        if (res.status === 200) {
          // this.$notify({ type: 'success', message: '保存成功' })
        } else {
          // this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, 300),
    saveKnyw: debounce(function() {
      // 保存住院期间用药-口服抗凝药物
      this.data.discharge.knyw.registId = this.$route.query.registId
      console.log(this.data.discharge.knyw)

      this.$api.service.saveInnaiDrugs(this.data.discharge.knyw).then((res) => {
        if (res.status === 200) {
          // this.$notify({ type: 'success', message: '保存成功' })
        } else {
          // this.$notify({ type: 'warning', message: res.message })
        }
      })
    }, 300),
    savePcsk9: debounce(function() {
      // 保存住院期间用药-口服抗凝药物
      this.data.discharge.pcsk9.registId = this.$route.query.registId
      console.log(this.data.discharge.pcsk9)

      this.$api.service
        .saveInnaiDrugs(this.data.discharge.pcsk9)
        .then((res) => {
          if (res.status === 200) {
            // this.$notify({ type: 'success', message: '保存成功' })
          } else {
            //  this.$notify({ type: 'warning', message: res.message })
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
    onChanged(type) {
      if (type === 'discharge') {
        this.save()
      } else if (type === 'troponinH72') {
        this.saveTroponinH72()
      } else if (type === 'bnp') {
        this.saveBnp()
      } else if (type === 'tc') {
        this.saveTc()
      } else if (type === 'tg') {
        this.saveTg()
      } else if (type === 'hdlc') {
        this.saveHdlC()
      } else if (type === 'ldlc') {
        this.saveLdlC()
      } else if (type === 'jtyw') {
        this.saveJtyw()
      } else if (type === 'knyw') {
        this.saveKnyw()
      } else if (type === 'pcsk9') {
        this.savePcsk9()
      } else if (type === 'main') {
        this.saveMain()
      }
    },
    onDrugChanged(dl) {
      this.data.dischargeDrugsList = dl
    },
    validate() {
      return new Promise((resolve, reject) => {
        const formRef = this.$refs['dischargeform']
        formRef.validate((valid, err) => {
          const errors = Object.keys(err).reduce((arr, key) => {
            const label = formRef.fields.find((f) => f.prop === key)?.label
            return arr.concat([
              {
                module: '患者转归',
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
      this.$refs['dischargeform'].clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped></style>
