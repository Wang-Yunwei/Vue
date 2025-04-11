<template>
  <div class="mini">
    <med-radio-button-field
      v-model="data.isOutdrugs"
      :disabled="disabled"
      label="是否有出院带药"
      :select-options="dictionary.yesOrNoDict"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写是否有出院带药' }]"
    >
    </med-radio-button-field>

    <med-radio-button-field
      v-model="data.outDrugIsDapt"
      :disabled="disabled"
      label="抗血小板药物"
      :select-options="dictionary.yesOrNoDict"
      v-if="data.isOutdrugs == 1"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写抗血小板药物' }]"
    >
    </med-radio-button-field>
    <med-check-select-field
      v-model="data.outDrugIsDaptNameList"
      :disabled="disabled"
      label="抗血小板药物"
      :select-options="dictionary.daptDict"
      v-if="data.isOutdrugs == 1 && data.outDrugIsDapt == 1"
      @close="onChangedOutDrugIsDapt"
      required
      :rules="[{ required: true, message: '请填写抗血小板药物' }]"
    >
    </med-check-select-field>
    <div v-for="item in queryDrugList('1')" :key="'1' + item.value.name">
      <div v-if="data.isOutdrugs == 1 && data.outDrugIsDapt == 1">
        <med-drug
          :label="getName('1', item.value.name)"
          v-model="item.value"
          :disabled="disabled"
          @confirm="saveDrug2(item)"
          required
          :rules="[{ required: true, message: '请填写抗血小板药物' }]"
        ></med-drug>
      </div>
    </div>
    <med-radio-button-field
      v-model="data.outDrugIsAceiorarb"
      :disabled="disabled"
      label="ACEI/ARB"
      :select-options="dictionary.yesOrNoDict"
      v-if="data.isOutdrugs == 1"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写ACEI/ARB' }]"
    >
    </med-radio-button-field>
    <med-radio-select-field
      v-model="outDrugIsAceiorarbName"
      :disabled="disabled"
      label="ACEI/ARB药物"
      :select-options="dictionary.aceiorarbDict"
      v-if="data.isOutdrugs == 1 && data.outDrugIsAceiorarb == 1"
      @close="onChangedOutDrugIsAceiorarb"
      required
      :rules="[{ required: true, message: '请填写ACEI/ARB药物' }]"
    />
    <div v-for="item in queryDrugList('2')" :key="'2' + item.value.name">
      <div v-if="data.isOutdrugs == 1 && data.outDrugIsAceiorarb == 1">
        <med-drug
          :label="getName('2', item.value.name)"
          :disabled="disabled"
          v-model="item.value"
          @confirm="saveDrug2(item)"
          required
          :rules="[{ required: true, message: '请填写ACEI/ARB药物' }]"
        ></med-drug>
      </div>
    </div>
    <med-radio-button-field
      v-model="data.outDrugIsStatins"
      :disabled="disabled"
      label="调脂药物"
      :select-options="dictionary.yesOrNoDict"
      v-if="data.isOutdrugs == 1"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写调脂药物' }]"
    >
    </med-radio-button-field>
    <med-check-select-field
      v-model="data.outDrugIsStatinsNameList"
      :disabled="disabled"
      label="调脂药物"
      :select-options="dictionary.statinsDict"
      v-if="data.isOutdrugs == 1 && data.outDrugIsStatins == 1"
      @confirm="onChangedOutDrugIsStatinsDic"
      required
      :rules="[{ required: true, message: '请填写调脂药物' }]"
    />
    <div v-for="item in queryDrugList('3')" :key="'3' + item.value.name">
      <div v-if="data.isOutdrugs == 1 && data.outDrugIsStatins == 1">
        <med-drug
          :label="getName('3', item.value.name)"
          :disabled="disabled"
          v-model="item.value"
          @confirm="saveDrug2(item)"
          required
          :rules="[{ required: true, message: '请填写调脂药物' }]"
        ></med-drug>
      </div>
    </div>
    <med-radio-button-field
      v-model="data.outDrugIsRetardant"
      :disabled="disabled"
      label="β受体阻滞剂"
      :select-options="dictionary.yesOrNoDict"
      v-if="data.isOutdrugs == 1"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写β受体阻滞剂' }]"
    >
    </med-radio-button-field>

    <med-radio-select-field
      v-model="outDrugIsRetardantName"
      :disabled="disabled"
      label="β受体阻滞剂"
      :select-options="dictionary.retardantDict"
      v-if="data.isOutdrugs == 1 && data.outDrugIsRetardant == 1"
      @close="onChangedOutDrugIsRetardantDic"
      required
      :rules="[{ required: true, message: '请填写β受体阻滞剂' }]"
    />

    <div v-for="item in queryDrugList('4')" :key="'4' + item.value.name">
      <div v-if="data.isOutdrugs == 1 && data.outDrugIsRetardant == 1">
        <med-drug
          :label="getName('4', item.value.name)"
          :disabled="disabled"
          v-model="item.value"
          @confirm="saveDrug2(item)"
          required
          :rules="[{ required: true, message: '请填写β受体阻滞剂' }]"
        ></med-drug>
      </div>
    </div>
  </div>
</template>

<script>
import { dicConstant } from '@/constant/commonConstant'
import { mapGetters } from 'vuex'
export default {
  name: 'Medicinetake',
  components: {},
  props: {
    data: {
      required: true,
      type: Object
    },
    dischargeDrugsList1: {},
    disabled: {
      required: false,
      type: Boolean
    }
  },
  data() {
    return {
      dischargeDrugsList: this.dischargeDrugsList1,
      active: 0,
      registId: 0,
      minDate: new Date(2020, 0, 10),
      maxDate: new Date(2025, 10, 1),
      outDrugIsAceiorarbName: '',
      outDrugIsRetardantName: ''
    }
  },
  computed: {
    ...mapGetters(['dictionary'])
  },
  watch: {
    data: {
      handler(val) {
        if (
          val &&
          val.outDrugIsAceiorarbNameList &&
          val.outDrugIsAceiorarbNameList.length > 0
        ) {
          this.outDrugIsAceiorarbName = val.outDrugIsAceiorarbNameList[0]
        }

        if (
          val &&
          val.outDrugIsRetardantNameList &&
          val.outDrugIsRetardantNameList.length > 0
        ) {
          this.outDrugIsRetardantName = val.outDrugIsRetardantNameList[0]
        }
      },
      immediate: true,
      deep: true
    },
    // 抗血小板药物
    dischargeDrugsList1: {
      immediate: false,
      handler(newVal, oldVal) {
        this.dischargeDrugsList = this.dischargeDrugsList1
      },
      deep: true
    }
    // // ACEI/ARB
    // 'data.outDrugIsAceiorarbNameList': {
    //   immediate: false,
    //   handler(newVal, oldVal) {
    //     this.saveDrug(newVal, oldVal, '2')
    //   },
    //   deep: true
    // },
    // // 调脂药物
    // 'data.outDrugIsStatinsNameList': {
    //   immediate: false,
    //   handler(newVal, oldVal) {
    //     this.saveDrug(newVal, oldVal, '3')
    //   },
    //   deep: true
    // },
    // // β受体阻滞剂
    // 'data.outDrugIsRetardantNameList': {
    //   immediate: false,
    //   handler(newVal, oldVal) {
    //     this.saveDrug(newVal, oldVal, '4')
    //   },
    //   deep: true
    // },
    // dischargeDrugsList: {
    //   immediate: false,
    //   handler(newVal, oldVal) {
    //     this.saveDischargeDrugs()
    //   },
    //   deep: true
    // }
  },
  created() {},
  methods: {
    getName(code, name) {
      let strName
      switch (code) {
        // 抗血小板药物
        case '1':
          const dapt = this.dictionary.daptDict.find(t => t.value === name)
          if (dapt) {
            strName = dapt.label
          }
          break
        // ACEI/ARB
        case '2':
          const aceiabr = this.dictionary.aceiorarbDict.find(
            t => t.value === name
          )
          if (aceiabr) {
            strName = aceiabr.label
          }
          break
        // 调脂药物
        case '3':
          const statin = this.dictionary.statinsDict.find(
            t => t.value === name
          )
          if (statin) {
            strName = statin.label
          }
          break
        // β受体阻滞剂
        case '4':
          const dant = this.dictionary.retardantDict.find(
            t => t.value === name
          )
          if (dant) {
            strName = dant.label
          }
          break
      }
      return strName
    },
    onChanged() {
      this.buildOutDrugIsDapt()
      this.buildOutDrugIsAceiorarb()
      this.buildOutDrugIsStatinsDic()
      this.buildOutDrugIsRetardantDic()

      this.saveDischargeDrugs(() => {
        this.$emit('change', 'discharge')
      })
    },
    buildOutDrugIsDapt() {
      this.saveDrug(this.data.outDrugIsDaptNameList, '1')
    },
    buildOutDrugIsAceiorarb() {
      if (this.outDrugIsAceiorarbName) {
        this.data.outDrugIsAceiorarbNameList = [this.outDrugIsAceiorarbName]
      } else {
        this.data.outDrugIsAceiorarbNameList = []
      }

      this.saveDrug(this.data.outDrugIsAceiorarbNameList, '2')
    },
    buildOutDrugIsStatinsDic() {
      this.saveDrug(this.data.outDrugIsStatinsNameList, '3')
    },
    buildOutDrugIsRetardantDic() {
      if (this.outDrugIsRetardantName) {
        this.data.outDrugIsRetardantNameList = [this.outDrugIsRetardantName]
      } else {
        this.data.outDrugIsRetardantNameList = []
      }
      this.saveDrug(this.data.outDrugIsRetardantNameList, '4')
    },
    onChangedOutDrugIsDapt() {
      // this.saveDrug(this.data.outDrugIsDaptNameList, '1')
      this.buildOutDrugIsDapt()
      this.saveDischargeDrugs()
      this.$emit('notifyReportChange')
    },
    onChangedOutDrugIsAceiorarb() {
      // if (this.outDrugIsAceiorarbName) {
      //   this.data.outDrugIsAceiorarbNameList = [this.outDrugIsAceiorarbName]
      // } else {
      //   this.data.outDrugIsAceiorarbNameList = []
      // }
      // this.saveDrug(this.data.outDrugIsAceiorarbNameList, '2')
      this.buildOutDrugIsAceiorarb()
      this.saveDischargeDrugs()
      this.$emit('notifyReportChange')
    },
    onChangedOutDrugIsStatinsDic() {
      // this.saveDrug(this.data.outDrugIsStatinsNameList, '3')
      this.buildOutDrugIsStatinsDic()
      this.saveDischargeDrugs()
      this.$emit('notifyReportChange')
    },
    onChangedOutDrugIsRetardantDic() {
      // if (this.outDrugIsRetardantName) {
      //   this.data.outDrugIsRetardantNameList = [this.outDrugIsRetardantName]
      // } else {
      //   this.data.outDrugIsRetardantNameList = []
      // }

      // this.saveDrug(this.data.outDrugIsRetardantNameList, '4')
      this.buildOutDrugIsRetardantDic()
      this.saveDischargeDrugs()
      this.$emit('notifyReportChange')
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
    saveDischargeDrugs(callback) {
      // 保存出院带药
      const registId = this.$route.query.registId

      this.$api.service
        .saveDischargeDrugs({
          registId: registId,
          drugList: this.dischargeDrugsList,
          timeStamp: this.data.timeStamp
        })
        .then(res => {
          if (res.status === 200) {
            this.data.timeStamp = res.result.timeStamp
          } else {
            this.$notify({ type: 'warning', message: res.message })
          }

          if (callback) {
            callback()
          }
        })
        .catch(res => {
          this.$emit('onSaveException', res)
        })
    },
    saveDrug(newVal, code) {
      const registId = this.$route.query.registId
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
              case '1':
                const dapt = this.dictionary.daptDict.find(
                  t => t.value === val
                )
                nameValue = dapt.value
                strName = dapt.label
                break
              case '2':
                const abc = this.dictionary.aceiorarbDict.find(
                  t => t.value === val
                )
                nameValue = abc.value
                strName = abc.label
                break
              case '3':
                const aceiorarb = this.dictionary.statinsDict.find(
                  t => t.value === val
                )
                nameValue = aceiorarb.value
                strName = aceiorarb.label
                break
              case '4':
                const dna = this.dictionary.retardantDict.find(
                  t => t.value === val
                )
                nameValue = dna.value
                strName = dna.label
                break
            }
            newdischargeDrugsList.push({
              registId: registId,
              code: code,
              name: nameValue,
              strName: strName,
              frequency: '',
              times: '',
              value: '',
              unit: 'mg',
              otherName: ''
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
    },
    saveDrug2(val) {
      const index = this.dischargeDrugsList.findIndex(
        t => t.code === val.code && t.name === val.name
      )
      const newVal = { ...this.dischargeDrugsList[index], ...val.value }
      this.$set(this.dischargeDrugsList, index, newVal)
      this.saveDischargeDrugs()
      this.$emit('notifyReportChange')
    },
    queryData() {
      return this.dischargeDrugsList
    }
  }
}
</script>

<style lang="less" scoped>
.oneline {
  display: flex;
  width: 100%;
}
.oneline-item {
  flex-flow: 1;
}
</style>
