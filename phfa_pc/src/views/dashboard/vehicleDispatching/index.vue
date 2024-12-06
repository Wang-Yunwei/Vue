<template>
  <div>
    <el-form
      label-position="left"
      label-width="70px"
      :model="searchparam"
      class="search-form"
    >
      <el-row :gutter="12">
        <el-col :span="21">
          <el-row :gutter="12">
            <el-col :span="6">
              <el-form-item label="时间范围">
                <month-range
                  :start.sync="searchparam.startTime"
                  :end.sync="searchparam.endTime"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出车医院">
                <med-select
                  v-model="searchparam.hospitalId"
                  placeholder="出车医院"
                  :options="hospitalAreaList"
                  style="width: 400px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="出车分站">
                <station-select
                  v-model="searchparam.stationId"
                  placeholder="出车分站"
                  :hospital-id="searchparam.hospitalId"
                  :hospital-area="searchparam.hospitalArea"
                />
              </el-form-item>
            </el-col>
            <!-- <el-col :span="5">
              <el-form-item label="统计维度">
                <med-select
                  v-model="searchparam.dimension"
                  placeholder="统计维度"
                  :options="dimensionList"
                />
              </el-form-item>
            </el-col> -->
          </el-row>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="onExport">导出</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-tabs v-model="curTab" type="card" class="tabs">
      <el-tab-pane label="图表" name="chart">
        <chart :data="chartData" />
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
import { qcOutCar } from '@/api/qc'
import DataTable from './table'
import Chart from './chart'

export default {
  components: { DataTable, Chart },
  data() {
    return {
      dic,
      curTab: 'chart',
      searchparam: {},
      startDate: null,
      chartData: []
    }
  },
  computed: {
    ...mapGetters(['dictionary', 'hospitalAreaList']),
    dimensionList() {
      return [
        {
          label: '月',
          value: '1'
        },
        {
          label: '天',
          value: '2'
        },
        {
          label: '季度',
          value: '3'
        },
        {
          label: '年',
          value: '4'
        }
      ]
    }
  },
  mounted() {
    this.onSubmit()
  },
  methods: {
    async onSubmit() {
      const payload = {
        ...this.searchparam
      }

      const res = await qcOutCar(payload)
      this.chartData = res.body
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
