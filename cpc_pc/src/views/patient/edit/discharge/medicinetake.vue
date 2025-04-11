<template>
  <div>
    <med-subtitle title="出院带药" />
    <el-row :gutter="24">
      <el-col :span="6">
        <med-radio-field
          v-model="data.isOutdrugs"
          form-prop="discharge.isOutdrugs"
          :disabled="disabled"
          label="是否有出院带药"
          :select-options="dictionary.yesOrNoDict"
          :rules="[
            { required: true, message: '请填写是否有出院带药', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col v-if="data.isOutdrugs == 1" :span="6">
        <med-radio-field
          v-model="data.outDrugIsDapt"
          form-prop="discharge.outDrugIsDapt"
          :disabled="disabled"
          label="抗血小板治疗"
          :select-options="dictionary.yesOrNoDict"
          :rules="[
            { required: true, message: '请填写抗血小板治疗', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col v-if="data.isOutdrugs == 1 && data.outDrugIsDapt == 1" :span="18">
        <med-checkbox-field
          v-model="data.outDrugIsDaptNameList"
          display-type="check"
          form-prop="discharge.outDrugIsDaptNameList"
          :disabled="disabled"
          label="抗血小板药物"
          :select-options="dictionary.daptDict"
          :rules="[
            { required: true, message: '请填写抗血小板药物', trigger: 'change' }
          ]"
          @change="onChangedOutDrugIsDapt"
        />
      </el-col>
    </el-row>
    <div v-for="item in queryDrugList('1')" :key="item.code + item.value.name">
      <div v-if="data.isOutdrugs == 1 && data.outDrugIsDapt == 1">
        <med-drug
          v-model="item.value"
          :label="getName('1', item.value.name)"
          :disabled="disabled"
          @confirm="saveDrug2(item)"
        />
      </div>
    </div>
    <med-radio-field
      v-if="data.isOutdrugs == 1"
      v-model="data.outDrugIsAceiorarb"
      form-prop="discharge.outDrugIsAceiorarb"
      :disabled="disabled"
      label="ACEI/ARB"
      :select-options="dictionary.yesOrNoDict"
      :rules="[
        { required: true, message: '请填写ACEI/ARB', trigger: 'change' }
      ]"
    />
    <med-radio-field
      v-if="data.isOutdrugs == 1 && data.outDrugIsAceiorarb == 1"
      v-model="aceiOrArbName"
      form-prop="discharge.outDrugIsAceiorarbNameList"
      :disabled="disabled"
      label="ACEI/ARB药物"
      :select-options="dictionary.aceiorarbDict"
      :rules="[
        { required: true, message: '请填写ACEI/ARB药物', trigger: 'change' }
      ]"
      @change="onChangedOutDrugIsAceiorarb"
    />
    <div v-for="item in queryDrugList('2')" :key="item.code + item.value.name">
      <div v-if="data.isOutdrugs == 1 && data.outDrugIsAceiorarb == 1">
        <med-drug
          v-model="item.value"
          :label="getName('2', item.value.name)"
          :disabled="disabled"
          @confirm="saveDrug2(item)"
        />
      </div>
    </div>
    <med-radio-field
      v-if="data.isOutdrugs == 1"
      v-model="data.outDrugIsStatins"
      form-prop="discharge.outDrugIsStatins"
      :disabled="disabled"
      label="调脂药物"
      :select-options="dictionary.yesOrNoDict"
      :rules="[
        { required: true, message: '请填写调脂药物', trigger: 'change' }
      ]"
    />
    <med-checkbox-field
      v-if="data.isOutdrugs == 1 && data.outDrugIsStatins == 1"
      v-model="data.outDrugIsStatinsNameList"
      display-type="check"
      form-prop="discharge.outDrugIsStatinsNameList"
      :disabled="disabled"
      label="调脂药物"
      :select-options="dictionary.statinsDict"
      :rules="[
        { required: true, message: '请填写调脂药物', trigger: 'change' }
      ]"
      @change="onChangedOutDrugIsStatinsDic"
    />
    <div v-for="item in queryDrugList('3')" :key="item.code + item.value.name">
      <div v-if="data.isOutdrugs == 1 && data.outDrugIsStatins == 1">
        <med-drug
          v-model="item.value"
          :label="getName('3', item.value.name)"
          :disabled="disabled"
          @confirm="saveDrug2(item)"
        />
      </div>
    </div>
    <med-radio-field
      v-if="data.isOutdrugs == 1"
      v-model="data.outDrugIsRetardant"
      form-prop="discharge.outDrugIsRetardant"
      :disabled="disabled"
      label="β受体阻滞剂"
      :select-options="dictionary.yesOrNoDict"
      :rules="[
        { required: true, message: '请填写β受体阻滞剂', trigger: 'change' }
      ]"
    />

    <med-radio-field
      v-if="data.isOutdrugs == 1 && data.outDrugIsRetardant == 1"
      v-model="retardantName"
      form-prop="discharge.outDrugIsRetardantNameList"
      :disabled="disabled"
      label="β受体阻滞剂"
      :select-options="dictionary.retardantDict"
      :rules="[
        { required: true, message: '请填写β受体阻滞剂', trigger: 'change' }
      ]"
      @change="onChangedOutDrugIsRetardantDic"
    />

    <div v-for="item in queryDrugList('4')" :key="item.code + item.value.name">
      <div v-if="data.isOutdrugs == 1 && data.outDrugIsRetardant == 1">
        <med-drug
          v-model="item.value"
          :label="getName('4', item.value.name)"
          :disabled="disabled"
          @confirm="saveDrug2(item)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MedDrug from './components/MedDrug'
import { ruleConstant } from '@/constant/index'
import { querySetting } from '@/api/setting'
export default {
  name: 'Medicinetake',
  components: {
    MedDrug
  },
  props: {
    data: {
      required: true,
      type: Object
    },
    disabled: {
      required: false,
      type: Boolean
    },
    dischargeDrugsList1: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dischargeDrugsList: this.dischargeDrugsList1,
      active: 0,
      registId: 0,
      aceiOrArbName: '',
      retardantName: '',
      minDate: new Date(2020, 0, 10),
      maxDate: new Date(2025, 10, 1)
    }
  },
  computed: {
    ...mapGetters(['dictionary', 'hospitalId'])
  },
  watch: {
    data: {
      handler(val) {
        if (
          val &&
          val.outDrugIsAceiorarbNameList &&
          val.outDrugIsAceiorarbNameList.length > 0
        ) {
          this.aceiOrArbName = val.outDrugIsAceiorarbNameList[0]
        }

        if (
          val &&
          val.outDrugIsRetardantNameList &&
          val.outDrugIsRetardantNameList.length > 0
        ) {
          this.retardantName = val.outDrugIsRetardantNameList[0]
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.sync()
  },
  methods: {
    async sync() {
      const { result } = await querySetting({ code: ruleConstant.DISCHARGEMEDICATION, hospitalId: this.hospitalId })
      if (result) {
        this.rule = JSON.parse(result.value)

        if (this.rule.isEnabled === true) {
          // 抗血小板
          const kxxb = this.rule.itemConfig.find(c => c.code === '1' && c.isEnabled)
          if (kxxb && kxxb.isEnabled) {
            // this.data.outDrugIsDapt = this.data.outDrugIsDapt ? this.data.outDrugIsDapt : '1'

            const syncKxxb = this.data.outDrugIsDaptNameList === null || this.data.outDrugIsDaptNameList === undefined || this.data.outDrugIsDaptNameList.length === 0
            if (syncKxxb) {
              this.data.outDrugIsDaptNameList = [...kxxb.defaultDrug]

              // 使用默认用量
              kxxb.defaultUsage.forEach(u => {
                this.dischargeDrugsList.push({
                  registId: this.$route.query.id,
                  code: '1',
                  name: u.code,
                  frequency: u.frequency,
                  times: u.times,
                  value: u.dose,
                  unit: 'mg',
                  strName: this.getName('1', u.code)
                })
              })
            }
          }

          // ACEI/ARB
          const acei = this.rule.itemConfig.find(c => c.code === '2' && c.isEnabled)
          if (acei && acei.isEnabled) {
            // this.data.outDrugIsAceiorarb = this.data.outDrugIsAceiorarb ? this.data.outDrugIsAceiorarb : '1'

            const syncAcei = this.data.outDrugIsAceiorarbNameList === null || this.data.outDrugIsAceiorarbNameList === undefined || this.data.outDrugIsAceiorarbNameList.length === 0
            if (syncAcei) {
              this.data.outDrugIsAceiorarbNameList = [...acei.defaultDrug.code]

              // 使用默认用量
              // acei.defaultUsage.forEach(u => {
              //   this.dischargeDrugsList.push({
              //     registId: this.$route.query.id,
              //     code: '2',
              //     name: u.code,
              //     frequency: u.frequency,
              //     times: u.times,
              //     value: u.dose,
              //     unit: 'mg',
              //     strName: this.getName('2', u.code)
              //   })
              // })
              this.dischargeDrugsList.push({
                registId: this.$route.query.id,
                code: '2',
                name: acei.defaultDrug.code,
                frequency: acei.defaultDrug.frequency,
                times: acei.defaultDrug.times,
                value: acei.defaultDrug.dose,
                unit: 'mg',
                strName: this.getName('2', acei.defaultDrug.code)
              })
            }
          }

          // 调脂药物
          const tzyw = this.rule.itemConfig.find(c => c.code === '3' && c.isEnabled)
          if (tzyw && tzyw.isEnabled) {
            // this.data.outDrugIsStatins = this.data.outDrugIsStatins ? this.data.outDrugIsStatins : '1'

            const syncTzyw = this.data.outDrugIsStatinsNameList === null || this.data.outDrugIsStatinsNameList === undefined || this.data.outDrugIsStatinsNameList.length === 0
            if (syncTzyw) {
              this.data.outDrugIsStatinsNameList = [...tzyw.defaultDrug]

              // 使用默认用量
              tzyw.defaultUsage.forEach(u => {
                this.dischargeDrugsList.push({
                  registId: this.$route.query.id,
                  code: '3',
                  name: u.code,
                  frequency: u.frequency,
                  times: u.times,
                  value: u.dose,
                  unit: 'mg',
                  strName: this.getName('3', u.code)
                })
              })
            }
          }

          // β受体阻滞剂
          const stzzj = this.rule.itemConfig.find(c => c.code === '4' && c.isEnabled)
          if (stzzj && stzzj.isEnabled) {
            // this.data.outDrugIsRetardant = this.data.outDrugIsRetardant ? this.data.outDrugIsRetardant : '1'

            const syncStzzj = this.data.outDrugIsRetardantNameList === null || this.data.outDrugIsRetardantNameList === undefined || this.data.outDrugIsRetardantNameList.length === 0
            if (syncStzzj) {
              this.data.outDrugIsRetardantNameList = [...stzzj.defaultDrug.code]

              // 使用默认用量
              // stzzj.defaultUsage.forEach(u => {
              //   this.dischargeDrugsList.push({
              //     registId: this.$route.query.id,
              //     code: '4',
              //     name: u.code,
              //     frequency: u.frequency,
              //     times: u.times,
              //     value: u.dose,
              //     unit: 'mg',
              //     strName: this.getName('4', u.code)
              //   })
              // })
              this.dischargeDrugsList.push({
                registId: this.$route.query.id,
                code: '4',
                name: stzzj.defaultDrug.code,
                frequency: stzzj.defaultDrug.frequency,
                times: stzzj.defaultDrug.times,
                value: stzzj.defaultDrug.dose,
                unit: 'mg',
                strName: this.getName('4', stzzj.defaultDrug.code)
              })
            }
          }
        }
      }
    },
    getName(code, name) {
      let strName
      switch (code) {
        // 抗血小板药物
        case '1': {
          const dapt = this.dictionary.daptDict.find(t => t.value === name)
          strName = dapt.label
          break
        }
        // ACEI/ARB
        case '2': {
          const aceiabr = this.dictionary.aceiorarbDict.find(
            t => t.value === name
          )
          strName = aceiabr.label
          break
        }
        // 调脂药物
        case '3': {
          const statin = this.dictionary.statinsDict.find(
            t => t.value === name
          )
          strName = statin.label
          break
        }
        // β受体阻滞剂
        case '4': {
          const dant = this.dictionary.retardantDict.find(
            t => t.value === name
          )
          strName = dant.label
          break
        }
      }
      return strName
    },
    onChangedOutDrugIsDapt() {
      this.saveDrug(this.data.outDrugIsDaptNameList, '1')
      // this.saveDischargeDrugs()
    },
    onChangedOutDrugIsAceiorarb() {
      if (this.aceiOrArbName) {
        this.data.outDrugIsAceiorarbNameList = [this.aceiOrArbName]
      } else {
        this.data.outDrugIsAceiorarbNameList = []
      }

      this.saveDrug(this.data.outDrugIsAceiorarbNameList, '2')
      // this.saveDischargeDrugs()
    },
    onChangedOutDrugIsStatinsDic() {
      this.saveDrug(this.data.outDrugIsStatinsNameList, '3')
      // this.saveDischargeDrugs()
    },
    onChangedOutDrugIsRetardantDic() {
      if (this.retardantName) {
        this.data.outDrugIsRetardantNameList = [this.retardantName]
      } else {
        this.data.outDrugIsRetardantNameList = []
      }
      this.saveDrug(this.data.outDrugIsRetardantNameList, '4')
      // this.saveDischargeDrugs()
    },
    queryDrugList(code) {
      if (
        this.dischargeDrugsList != null &&
        this.dischargeDrugsList.length > 0
      ) {
        return this.dischargeDrugsList
          .filter(function(data) {
            return data.code === code
          })
          .map(t => {
            if (code === '1') {
              t.codeDesc = '抗血小板药物'
            } else if (code === '2') {
              t.codeDesc = 'ACEI/ARB药物'
            } else if (code === '3') {
              t.codeDesc = '调脂药物'
            } else if (code === '4') {
              t.codeDesc = 'β受体阻滞剂'
            }
            t.nameDesc = this.getName(code, t.name)
            return {
              code: t.code,
              name: t.name,
              value: t
            }
          })
      }
      return []
    },
    saveDischargeDrugs() {
      // 保存出院带药
      const registId = this.$route.query.id

      this.$api.service
        .saveDischargeDrugs({
          registId: registId,
          drugList: this.dischargeDrugsList
        })
        .then(res => {
          if (res.status === 200) {
            // this.$notify({ type: 'success', message: '保存成功' })
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }
        })
    },
    saveDrug(newVal, code) {
      const registId = this.$route.query.id
      const newdischargeDrugsList = []

      if (newVal) {
        for (const val of newVal) {
          const tmp = this.dischargeDrugsList.find(
            t => t.name === val && t.code === code
          )
          if (tmp) {
            newdischargeDrugsList.push(tmp)
          } else {
            let nameValue = ''
            let strName = ''
            switch (code) {
              case '1': {
                const dapt = this.dictionary.daptDict.find(
                  t => t.value === val
                )
                nameValue = dapt.value
                strName = dapt.label
                break
              }
              case '2': {
                const abc = this.dictionary.aceiorarbDict.find(
                  t => t.value === val
                )
                nameValue = abc.value
                strName = abc.label
                break
              }
              case '3': {
                const aceiorarb = this.dictionary.statinsDict.find(
                  t => t.value === val
                )
                nameValue = aceiorarb.value
                strName = aceiorarb.label
                break
              }
              case '4': {
                const dna = this.dictionary.retardantDict.find(
                  t => t.value === val
                )
                nameValue = dna.value
                strName = dna.label
                break
              }
            }
            newdischargeDrugsList.push({
              registId: registId,
              code: code,
              name: nameValue,
              strName: strName,
              frequency: '',
              times: '',
              value: '',
              unit: 'mg'
            })
          }
        }
      }

      const llist = this.dischargeDrugsList.filter(function(data) {
        return data.code !== code
      })

      if (llist && llist.length > 0) {
        for (const li of llist) {
          newdischargeDrugsList.push(li)
        }
      }

      this.dischargeDrugsList = newdischargeDrugsList

      this.$emit('drugchange', this.dischargeDrugsList)
    },
    saveDrug2(val) {
      const index = this.dischargeDrugsList.findIndex(
        t => t.code === val.code && t.name === val.name
      )
      const newVal = { ...this.dischargeDrugsList[index], ...val.value }
      this.$set(this.dischargeDrugsList, index, newVal)
      // this.saveDischargeDrugs()

      this.$emit('drugchange', this.dischargeDrugsList)
    }
  }
}
</script>

<style lang="scss" scoped>
.oneline {
  display: flex;
  width: 100%;
}
.oneline-item {
  flex-flow: 1;
}
</style>
