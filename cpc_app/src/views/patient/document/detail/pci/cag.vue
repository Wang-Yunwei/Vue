<template>
  <div class="mini">
    <med-radio-select-field
      v-model="data.treatmentPci.approach"
      :disabled="disabled"
      required
      :rules="[{ required: true, message: '请填写入路' }]"
      label="入路"
      :select-options="routeDic"
      @confirm="onChanged"
    >
    </med-radio-select-field>
    <med-part-select-field
      v-model="data.treatmentPci.cagPosition"
      @confirm="onCagPositionChanged"
      label="造影部位"
      :disabled="disabled"
      :select-options="partDic"
      required
      :rules="[{ required: true, message: '请填写造影部位' }]"
    ></med-part-select-field>
    <div v-for="item in data.treatmentPciPartList" :key="item.partId">
      <cagpart
        :data="item"
        v-if="showCagPostion(item.partId)"
        :disabled="disabled"
        @change="onPciPartChanged"
      />
    </div>
  </div>
</template>

<script>
import cagpart from './cagpart.vue'
import MedPartSelectField from './partSelectField.vue'
import { dicConstant } from '@/constant/commonConstant'

export default {
  name: 'Cag',
  components: {
    cagpart,
    MedPartSelectField
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
    dataAdmission: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      active: 0,
      registId: 0,
      routeDic: [],
      partDic: [],
      codeList: [dicConstant.routeCode, dicConstant.cagPositionCode]
    }
  },
  computed: {},
  created() {
    this.getDicList()
  },
  methods: {
    getDicList() {
      this.$api.service.getDictionary('').then(result => {
        this.routeDic = result[dicConstant.routeCode]
        this.partDic = result[dicConstant.cagPositionCode]
      })
    },
    showCagPostion(testKey) {
      if (!this.data.treatmentPci.cagPosition) return false
      return this.data.treatmentPci.cagPosition.indexOf(testKey) > -1
    },
    onChanged() {
      this.$emit('change', 'treatmentPci')
    },
    onCagPositionChanged() {
      if (!this.data.treatmentPciPartList) return
      // this.data.treatmentPciPartList.forEach(m => {
      //   if (this.showCagPostion(m.partId)) {
      //     if (!m.gwPassageTime && this.data.treatmentPci.gwPassageTime) {
      //       m.gwPassageTime = this.data.treatmentPci.gwPassageTime
      //     }
      //   }
      // })
      this.$emit('change', 'treatmentPci')
    },
    onPciPartChanged() {
      const tempData = [...this.data.treatmentPciPartList]

      const lst = tempData.sort((a, b) => {
        console.log(a.gwPassageTime, b.gwPassageTime)
        if (a.gwPassageTime === null && b.gwPassageTime !== null) {
          return -1
        }
        console.log(a.gwPassageTime, b.gwPassageTime)
        if (a.gwPassageTime !== null && b.gwPassageTime === null) {
          return 1
        }
        return this.$moment(a.gwPassageTime).isAfter(b.gwPassageTime) ? 1 : -1
      })

      for (const m in lst) {
        const item = lst[m]
        if (this.showCagPostion(item.partId) && item.isPci === '1') {
          if (item.gwPassageTime != null) {
            this.data.treatmentPci.gwPassageTime = item.gwPassageTime
            break
          } else {
            item.gwPassageTime = this.data.treatmentPci.gwPassageTime
            break
          }
        }
      }
      const minute = this.$moment(this.data.treatmentPci.gwPassageTime).diff(
        this.$moment(this.dataAdmission.arrivedHospitalTime),
        'minute'
      )
      if (minute <= 90) {
        this.data.treatmentPci.isDelay = '0'
      } else {
        this.data.treatmentPci.isDelay = '1'
      }
      this.$emit('change', 'treatmentPci', () => {
        this.$emit('change', 'treatmentPciPart')
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
