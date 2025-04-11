<template>
  <div>
    <div v-if="showEmpty">
      <el-descriptions class="desStyle" title="基本信息" :column="4" border :label-style="widthValue">
        <el-descriptions-item label="分诊时间">{{ triage.triageTime }}</el-descriptions-item>
        <el-descriptions-item label="急诊编号">{{ triage.emergencyId }}</el-descriptions-item>
        <el-descriptions-item label="卡号">{{ triage.citizenCard }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ triage.name }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ conversionOne(triage.sex, dic.gender) }}</el-descriptions-item>
        <el-descriptions-item label="年龄">{{ triage.age }}</el-descriptions-item>
        <el-descriptions-item label="绿色通道">{{ triage.greenChannel }}</el-descriptions-item>
        <el-descriptions-item label="主诉">{{ triage.triageComplaint }}</el-descriptions-item>
        <el-descriptions-item v-if="triage.resetLevel" label="分诊级别">{{ triage.resetLevel }}级</el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="desStyle" title="生命体征" :column="4" border :label-style="widthValue">
        <el-descriptions-item label="意识">{{ triage.triageSenceDesc }}</el-descriptions-item>
        <el-descriptions-item label="呼吸（次/分）">{{ triage.mdaVitalSigns.r.value }}</el-descriptions-item>
        <el-descriptions-item label="脉搏（次/分）">{{ triage.mdaVitalSigns.p.value }}</el-descriptions-item>
        <el-descriptions-item v-if="triage.mdaVitalSigns.bp.sp" label="血压（mmHg）">
          {{ triage.mdaVitalSigns.bp.sp }} /
          {{ triage.mdaVitalSigns.bp.dp }}
        </el-descriptions-item>
        <el-descriptions-item label="血氧（%）">{{ triage.mdaVitalSigns.spo2.value }}</el-descriptions-item>
        <el-descriptions-item label="体温（°C）">{{ triage.mdaVitalSigns.t.value }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="desStyle" title="患者去向" :column="4" border :label-style="widthValue">
        <el-descriptions-item label="就诊科室">{{ triage.deptName }}</el-descriptions-item>
        <el-descriptions-item label="患者分诊去向">{{ triage.outWay }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <div v-if="!showEmpty">
      <el-empty description="未查询到分诊信息" />
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
      widthValue: { width: '10%' },
      triage: {
        mdaVitalSigns: {
          bp: {},
          hr: {},
          p: {},
          r: {},
          spo2: {},
          t: {}
        }
      },
      dic: storage.get('dicData'),
      showEmpty: false
    }
  },
  computed: {
  },
  mounted() {
    // 查询分诊信息
    this.getTriagePreview()
  },
  methods: {
    // value 转换成汉字
    conversionOne(str, list) {
      if (str && list) {
        const matched = list.find(valx => valx.value === str)
        return matched?.label
      }
    },
    getTriagePreview() {
      accessApi
        .getTriagePreview(
          this.$route.query.emId, this.$route.query.hospitalAndArea
        )
        .then((res) => {
          if (res.status === 200) {
            if (res.result && Object.keys(res.result)?.length) {
              this.triage = { ...res.result }
              if (this.triage) {
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
