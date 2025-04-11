<template>
  <div class="med-ai-analysis-wrapper">
    <div class="header">
      <!-- 查询部分 searchbar -->
      <searchbar @doSearch="doSearch" />
    </div>
    <el-divider />
    <div>
      <el-row class="title">
        <el-col :span="22">
          <span class="name">整体意见</span>
        </el-col>
        <el-col :span="2">
          <span class="link" @click="toAianalysisList">认证指标</span>
        </el-col>
      </el-row>
      <el-table :data="opinions" style="width: 100%" :header-cell-style="{ 'background-color': '#eef1f6' }">
        <el-table-column
          label="序号"
          type="index"
          width="50"
        />
        <el-table-column label="描述">
          <template slot-scope="scope">
            {{ scope.row }}
          </template>
        </el-table-column>
      </el-table>
      <el-row class="title">
        <el-col :span="24">
          <span class="name">填报异常</span>
        </el-col>
      </el-row>
      <el-table :data="abnormalReportings" style="width: 100%" :header-cell-style="{ 'background-color': '#eef1f6' }">
        <el-table-column
          label="序号"
          type="index"
          width="50"
        />
        <el-table-column label="异常信息">
          <template slot-scope="scope">
            {{ scope.row.desc }}
          </template>
        </el-table-column>
        <el-table-column label="数量" width="100">
          <template slot-scope="scope">
            <div :style="{ color: 'red'}">
              {{ scope.row.num }}例
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="title">
        <el-col :span="22">
          <span class="name">指标未达标项</span>
        </el-col>
        <el-col :span="2">
          <span class="link">{{ notUpToStandardsNum }}项</span>
        </el-col>
      </el-row>
      <el-table :data="notUpToStandards" style="width: 100%" :header-cell-style="{ 'background-color': '#eef1f6' }">
        <el-table-column
          label="序号"
          type="index"
          width="50"
        />
        <el-table-column label="名称">
          <template slot-scope="scope">
            {{ formatNotUpToStandards(scope.row) }}
          </template>
        </el-table-column>
      </el-table>
      <el-row class="title">
        <el-col :span="24">
          <span class="name">其他问题</span>
        </el-col>
      </el-row>
      <el-table :data="otherProblems" style="width: 100%" :header-cell-style="{ 'background-color': '#eef1f6' }">
        <el-table-column
          label="序号"
          type="index"
          width="50"
        />
        <el-table-column label="异常信息">
          <template slot-scope="scope">
            {{ scope.row.desc }}
          </template>
        </el-table-column>
        <el-table-column label="数量" width="100">
          <template slot-scope="scope">
            <div :style="{ color: 'red'}">
              {{ scope.row.num }}例
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import searchbar from './searchbar'
import { mapGetters } from 'vuex'
import { getIntelligentAnalysis } from '@/api/qc'
import moment from 'moment'
export default {
  name: 'ListIndex',
  components: {
    searchbar
  },
  data() {
    return {
      query: {
        daterange: [],
        startTime: moment(new Date())
          .add(-2, 'months')
          .format('YYYY-MM-01'),
        endTime: moment(new Date()).format('YYYY-MM-DD'),
        // hospitalArea: 'c2d2837c-7008-4f34-a3ef-787e401a6cdb',
        hospitalId: ''
      },
      abnormalReportings: [],
      notUpToStandards: [],
      opinions: [],
      otherProblems: [],
      notUpToStandardsNum: 0
    }
  },
  computed: {
    ...mapGetters([
      'hospitalId'
    ])
  },
  mounted() {
    this.doSearch(this.query)
  },
  methods: {
    toAianalysisList() {
      this.$emit('goAianalysis', 'aianalysisList')
    },
    doSearch(p) {
      if (p.daterange != null && p.daterange.length === 2) {
        this.query.startTime = p.daterange[0]
        this.query.endTime = p.daterange[1]
        p = this.query
      }
      this.getIntelligentAnalysis(p)
    },
    async getIntelligentAnalysis(p) {
      var loading = this.$loading({ lock: true, text: '正在查询' })
      p.hospitalId = this.hospitalId
      const res = await getIntelligentAnalysis(p) || {}
      if (res.status === 200) {
        this.abnormalReportings = res.result.abnormalReportings
        this.notUpToStandards = res.result.notUpToStandards
        this.opinions = res.result.opinions
        this.otherProblems = res.result.otherProblems
        if (this.notUpToStandards != null) {
          this.notUpToStandardsNum = this.notUpToStandards.length
        }
      } else {
        this.$notify({ type: 'warning', message: res.message })
      }
      loading.close()
    },
    formatNotUpToStandards(item) {
      if (item.isKeyIndex === '1') {
        return item.code + '* ' + item.shortTitle
      }
      return item.code + ' ' + item.shortTitle
    }
  }
}
</script>

<style lang="scss" scoped>
.med-ai-analysis-wrapper {
  .header {
    padding: 20px 5px 0 5px;
    background-color: #f0f2f5;
  }
  .el-divider--horizontal {
    margin: 0 0;
  }
  .title {
    margin-top: 12px;
    .name {
      line-height: 48px;
      font-size: 24px;
    }
    .link {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0 12px;
      line-height: 40px;
      color: #5e74fe;
      cursor: pointer;
    }
  }
}
</style>
