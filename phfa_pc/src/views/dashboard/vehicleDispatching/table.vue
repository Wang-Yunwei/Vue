<template>
  <div>
    <el-table
      :data="tableData.records"
      style="width: 100%"
      stripe
      :header-cell-style="{ 'background-color': '#eef1f6' }"
    >
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column prop="name" label="区域" width="280" />
      <el-table-column prop="gender" label="数量" width="180" />
      <el-table-column prop="missionStatus" label="出车医院" />
    </el-table>
    <el-pagination
      class="pagination"
      background
      :current-page.sync="tableData.current"
      :page-size="tableData.size"
      :page-sizes="[10, 20, 30]"
      layout="prev, pager, next, jumper, sizes"
      :total="tableData.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { dicConstant as dic } from '@/constant'

export default {
  name: 'Table',
  props: {
    tableData: {
      type: Object,
      default: () => ({
        current: 1,
        size: 10,
        total: 0,
        records: []
      })
    }
  },
  data() {
    return {
      dic,
      curMissionId: ''
      // dictionary: {
      //   genderDic: [],
      //   diagDic: [],
      //   comingTypeDic: []
      // }
    }
  },
  computed: {
    ...mapGetters(['dictionary']),
    pagi() {
      return {
        current: this.tableData.current,
        size: this.tableData.size,
        total: this.tableData.total
      }
    }
  },
  async mounted() {
    // const { _get, getDictionary } = this
    // const dic = await getDictionary([
    //   d.genderCode,
    //   d.diagnosisCode,
    //   d.comingCode
    // ])
    // this.dictionary.genderDic = _get(dic, d.genderCode)
    // this.dictionary.diagDic = _get(dic, d.diagnosisCode)
    // this.dictionary.comingTypeDic = _get(dic, d.comingCode)
  },
  methods: {
    handleSizeChange(s) {
      this.$emit('doSearch', { ...this.pagi, size: s })
    },
    handleCurrentChange(c) {
      this.$emit('doSearch', { ...this.pagi, current: c })
    }
  }
}
</script>

<style lang="sass" scoped>
.pagination
  margin: 5px 10px 0 0
  float: right
</style>
