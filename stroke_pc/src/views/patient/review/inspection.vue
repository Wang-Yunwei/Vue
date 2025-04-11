<template>
  <div>
    <div v-for="(item,index) in inspection.masterList" :key="index">
      <el-descriptions class="desStyle" :title="item.testCause" :column="1" border>
        <el-descriptions-item label="报告时间" :label-style="widthValue">{{ item.reportTime }}</el-descriptions-item>
      </el-descriptions>
      <el-table
        ref="inspectionTable"
        :data="item.labResultList"
        :header-cell-style="{ 'background-color': '#eef1f6' }"
        stripe
        style="width: 100%"
      >
        <el-table-column
          v-for="(it, ind) in tableLabel"
          :key="ind"
          :label="it.label"
          :prop="it.prop"
          align="left"
        />
      </el-table>
    </div>
    <div v-if="!showEmpty">
      <el-empty description="未查询到检验信息" />
    </div>
  </div>
</template>

<script>
import accessApi from '@/api/access'
import storage from 'store'

export default {
  props: {},
  data() {
    return {
      widthValue: { width: '20%' },
      dic: storage.get('dicData'),
      showEmpty: false,
      inspection: {
        masterList: []
      },
      tableLabel: [
        {
          label: '项目名称',
          prop: 'reportItemName'
        },
        {
          label: '结果',
          prop: 'resultUnits'
        },
        {
          label: '标识',
          prop: 'abnormalIndicator'
        },
        {
          label: '参考值',
          prop: 'referenceResult'
        }
      ]
    }
  },
  computed: {},
  mounted() {
    // 获取检验信息
    if (this.$route.query.infoComingType) {
      this.getInspectList()
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
    getInspectList() {
      accessApi
        .getInspectList(
          this.$route.query.emId, this.$route.query.infoComingType, this.$route.query.hospitalAndArea
        )
        .then((res) => {
          if (res.status === 200) {
            if (res.result && Object.keys(res.result)?.length) {
              this.inspection = { ...res.result.inspection }
              this.inspection.masterList.forEach(item => {
                item.labResultList.forEach(va => {
                  const resultUnits = va.result + ' ' + va.units
                  this.$set(va, 'resultUnits', resultUnits)
                })
              })
              if (this.inspection.masterList.length > 0) {
                this.showEmpty = true
              }
            }
          }
        })
    }
  }
}
</script>

<style lang="less" scoped></style>
