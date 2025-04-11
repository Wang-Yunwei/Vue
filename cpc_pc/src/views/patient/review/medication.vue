<template>
  <div>
    <div>
      <el-descriptions v-for="(item,index) in medication" :key="index" class="desStyle" :title="item.enterDateTime" :column="1" border>
        <el-descriptions-item v-for="(ite,ind) in item.items" :key="ind" label="药品信息" :label-style="widthValue">{{ ite.orderText }} {{ ite.dosage }} {{ ite.dosageUnits }} {{ ite.administration }} {{ ite.frequency }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <div v-if="!showEmpty">
      <el-empty description="未查询到用药信息" />
    </div>
  </div>
</template>

<script>
import { getMedicationList } from '@/api/patient/access'
import storage from 'store'

export default {
  props: {},
  data() {
    return {
      widthValue: { width: '10%' },
      medication: [],
      dic: storage.get('DICTIONARY'),
      showEmpty: false
    }
  },
  computed: {
  },
  mounted() {
    // 查询用药数据
    if (this.$route.query.infoComingType) {
      this.getMedicationList()
    }
  },
  methods: {
    // value 转换成汉字
    conversionOne(str, list) {
      if (str && list) {
        const matched = list.find(valx => valx.value === str)
        return matched?.label
      }
    },
    getMedicationList() {
      getMedicationList(
        this.$route.query.emId, this.$route.query.infoComingType, this.$route.query.hospitalAndArea
      )
        .then((res) => {
          if (res.status === 200) {
            if (res.result && Object.keys(res.result)?.length) {
              this.medication = [...res.result]
              if (this.medication.length > 0) {
                this.showEmpty = true
              }
            }
          }
        })
    }
  }
}
</script>

<style scoped>
  .desStyle {
    padding-bottom: 30px;
  }
</style>
