<template>
  <div>
    <div>
      <el-descriptions
        v-for="(item,index) in examination"
        :key="index"
        class="desStyle"
        :title="item.examPara"
        :column="1"
        border>
        <el-descriptions-item label="报告时间" :label-style="widthValue">
          {{ item.reportTime }}
        </el-descriptions-item>
        <el-descriptions-item label="结论" :label-style="widthValue">
          {{ item.conclusion }}
        </el-descriptions-item>
        <el-descriptions-item label="检查所见" :label-style="widthValue">
          {{ item.description }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div v-if="!showEmpty">
      <el-empty description="未查询到检查信息" />
    </div>
  </div>
</template>

<script>
import { getInspectList } from '@/api/patient/access'
import storage from 'store'

export default {
  props: {},
  data() {
    return {
      widthValue: { width: '10%' },
      examination: [],
      dic: storage.get('DICTIONARY'),
      showEmpty: false
    }
  },
  computed: {},
  mounted() {
    // 查询检查信息
    if (this.$route.query.infoComingType) {
      this.getExamination()
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
    getExamination() {
      getInspectList(
        this.$route.query.emId,
        this.$route.query.infoComingType,
        this.$route.query.hospitalAndArea
      )
        .then((res) => {
          if (res.status === 200) {
            if (res.result && Object.keys(res.result)?.length) {
              if (res.result.examination.examinationReportList.length) {
                this.examination = res.result.examination.examinationReportList
              }
              console.log('examination', this.examination)
              if (this.examination.length > 0) {
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
