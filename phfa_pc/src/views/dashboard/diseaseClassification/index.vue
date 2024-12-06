<template>
  <div>
    <el-form :inline="true" :model="searchparam" class="search-form">
      <el-row>
        <el-col :span="20">
          <el-row :gutter="12">
            <el-col :span="8">
              <el-form-item label="时间">
                <el-date-picker
                  v-model="searchparam.time"
                  type="datetimerange"
                  format="yyyy-MM-dd HH:mm"
                  range-separator="~"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出车医院">
                <med-select
                  v-model="searchparam.hospital"
                  placeholder="出车医院"
                  :options="hospitalAreaList"
                  style="width: 400px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出车分站">
                <station-select
                  v-model="searchparam.dispatchVehicleSite"
                  placeholder="出车分站"
                  :hospital-id="searchparam.hospital"
                  :hospital-area="searchparam.hospitalArea"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="onExport">导出</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-tabs v-model="curTab" type="card" class="tabs">
      <el-tab-pane label="图表" name="chart">
        <chart ref="chart" />
      </el-tab-pane>
      <el-tab-pane label="表格" name="table">
        <data-table />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { dicConstant as dic } from '@/constant'
import DataTable from './table'
import Chart from './chart'

export default {
  components: { DataTable, Chart },
  data() {
    return {
      dic,
      curTab: 'chart',
      searchparam: {}
    }
  },
  computed: {
    ...mapGetters(['dictionary', 'hospitalAreaList'])
  },
  mounted() {
    this.onSubmit()
  },
  methods: {
    onSubmit() {
      this.$refs.chart?.getData(this.searchparam)
    },
    onExport() {}
  }
}
</script>

<style lang="scss" scoped>
.search-form {
  background-color: #f0f2f5;
  padding: 20px 20px 0;
  margin-bottom: 10px;
}
.tabs {
  ::v-deep .el-tabs__content {
    padding: 0 20px;
  }
}
</style>
