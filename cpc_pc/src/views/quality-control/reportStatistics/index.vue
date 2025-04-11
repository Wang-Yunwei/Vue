<template>
  <div class="med-ai-analysis-wrapper">
    <el-table
      :data="reportList"
      style="width: 100%"
    >
      <el-table-column type="index" />
      <el-table-column label="报表名称">
        <template slot-scope="scope">
          <a class="link" @click="showDetail(scope.row.value)">
            {{ scope.row.label }}
          </a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ReportIndex',
  components: {

  },
  data() {
    return {
      reportList: [
        { value: 'workload', label: '工作量统计分析' },
        { value: 'count', label: '高危胸痛患者填报趋势' },
        { value: 'timePeriod', label: '关键质控月平均统计分析' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'hospitalId'
    ])
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    showDetail(item) {
      const { href } = this.$router.resolve({ name: item })
      window.open(href, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.med-ai-analysis-wrapper {
  .index-memo {
    .el-row {
      padding-left: 60px;
      height: 32px;
      .seperator {
        padding: 0 20px;
      }
    }
    .el-icon-info {
      padding: 0 6px;
      font-size: 16px;
    }
  }
  .label {
    font-weight: bold;
    padding: 0 12px;
  }
  .content {
    padding-right: 12px;
  }
  .link {
    display: flex;
    align-items: center;
    padding: 0 12px;
    line-height: 24px;
    color: #5e74fe;
    cursor: pointer;
  }
}
</style>
