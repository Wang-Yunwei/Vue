<template>
  <div class="med-ai-analysis-wrapper">
    <div class="header">
      <!-- 查询部分 searchbar -->
      <searchbar :show-key-item="true" @doSearch="doSearch" />
    </div>
    <el-divider />
    <div>
      <aianalysis-card :model="list" @showDetail="showDetail" />
    </div>
  </div>
</template>

<script>
import searchbar from './searchbar'
import aianalysisCard from './aianalysisCard'
import { mapGetters } from 'vuex'
import { getIndexAnalysisList } from '@/api/qc'
import moment from 'moment'
export default {
  name: 'ListIndex',
  components: {
    searchbar,
    aianalysisCard
  },
  data() {
    return {
      query: {
        startTime: moment(new Date())
          .add(-2, 'months')
          .format('YYYY-MM-01'),
        endTime: moment(new Date()).format('YYYY-MM-DD'),
        // hospitalArea: 'c2d2837c-7008-4f34-a3ef-787e401a6cdb',
        hospitalId: '',
        isKeyIndex: '0',
        isUpToStandard: ''
      },
      list: []
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
    this.doSearch(this.query)
  },
  methods: {
    doSearch(p) {
      if (p.daterange != null && p.daterange.length === 2) {
        this.query.startTime = p.daterange[0]
        this.query.endTime = p.daterange[1]
        this.query.isKeyIndex = p.isKeyIndex ? '1' : '0'
        p = this.query
      }
      this.getIndexAnalysisList(p)
    },
    async getIndexAnalysisList(p) {
      p.hospitalId = this.hospitalId
      const res = await getIndexAnalysisList(p) || {}
      if (res.status === 200) {
        this.list = res.result
      } else {
        this.$notify({ type: 'warning', message: res.message })
      }
    },
    showDetail(item) {
      const { href } = this.$router.resolve({ name: 'AianalysisDetail', query: { code: item.code, expOrg: item.expOrg, standardValueOrg: item.standardValueOrg, startTime: this.query.startTime,
        endTime: this.query.endTime }})
      window.open(href, '_blank')
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
      line-height: 24px;
      color: #5e74fe;

    }
  }
}
</style>
