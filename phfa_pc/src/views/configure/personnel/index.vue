<template>
  <el-container>
    <el-main>
      <el-form
        ref="form"
        :inline="true"
        label-width="80px"
        :model="searchparam"
        @submit.native="onQuery"
      >
        <el-row>
          <el-col :span="20">
            <el-form-item label="院区">
              <med-select
                v-model="searchparam.hospitalArea"
                show-option-all
                placeholder="请选择"
                :options="areaList"
                @change="onQuery"
              />
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="searchparam.rescuerName" placeholder="姓名" />
            </el-form-item>
            <el-form-item label="人员类型">
              <med-select
                v-model="searchparam.rescuerType"
                show-option-all
                placeholder="全部"
                :options="dictionary[dic.personnelType]"
                @change="onQuery"
              />
            </el-form-item>
            <el-button
              native-type="submit"
              icon="el-icon-search"
              type="primary"
              @click="onQuery"
            >查询</el-button>
          </el-col>
          <el-col :span="4" class="flex-c-e">
            <el-button icon="el-icon-plus" type="success" @click="onAdd">
              新增
            </el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        v-loading="loading"
        :data="tableData.records"
        height="calc(100vh - 260px)"
      >
        <el-table-column prop="rescuerName" label="人员名称" />
        <el-table-column prop="hospitalId" label="归属医院">
          <template scope="scope">
            {{ parseHospitalName(scope.row.hospitalId) }}
          </template>
        </el-table-column>
        <el-table-column prop="hospitalArea" label="归属院区">
          <template scope="scope">
            {{ parseHospitalAreaName(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column prop="rescuerType" label="人员类型">
          <template scope="scope">
            {{ parseRescuerType(scope.row.rescuerType) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" width="50" label="状态">
          <template scope="scope">
            <el-popconfirm
              placement="top"
              :title="`确定要更改${scope.row.rescuerName}的状态吗？`"
              @confirm="updateStatus(scope.row)"
            >
              <el-switch
                slot="reference"
                :value="scope.row.status"
                active-color="#13ce66"
                inactive-color="#ccc"
                active-value="0"
                inactive-value="1"
              />
            </el-popconfirm>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          fixed="right"
          label="操作"
          min-width="220"
          width="140"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              circle
              @click="handleEdit(scope.row)"
            />
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="handleDelete(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin: 5px 10px 0 0; float: right"
        :current-page="tableData.current"
        :page-sizes="[10, 20, 30]"
        :page-size="tableData.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-main>
    <detail ref="detail" @change="queryList" />
  </el-container>
</template>
<script>
import detail from './detail.vue'
import { mapGetters } from 'vuex'
import { dicConstant as dic } from '@/constant'
import {
  saveOrUpdateRescuers,
  deleRescuers,
  queryRescuersList
} from '@/api/personnel'
export default {
  components: { detail },
  data() {
    return {
      loading: true,
      searchparam: {},
      activeValue: 0,
      inActiveValue: 1,
      dic,
      form: {},
      tableData: {
        current: 0,
        size: 10,
        total: 0,
        records: []
      }
    }
  },
  computed: {
    ...mapGetters([
      'hospitalId',
      'dictionary',
      'hospitalList',
      'hospitalAreaList',
      'hospitalArea'
    ]),
    areaList() {
      const areras =
        this.hospitalList.find((h) => h.value === this.hospitalId)?.areaList ||
        []
      return areras.map((a) => ({ label: a.name, value: a.sign }))
    }
  },
  mounted() {
    this.$set(this.searchparam, 'hospitalArea', this.hospitalArea)
    this.queryList()
  },
  methods: {
    onAdd() {
      this.$refs.detail?.open()
    },
    onQuery() {
      this.queryList()
    },
    handleSizeChange(val) {
      this.queryList(1, val)
    },
    handleCurrentChange(val) {
      this.queryList(val)
    },
    parseRescuerType(id) {
      return this.dictionary[dic.personnelType].find((ele) => ele.value === id)
        ?.label
    },
    parseHospitalAreaName(row) {
      const { hospitalArea, hospitalId } = row
      const hospital = this.hospitalList.find((ele) => ele.value === hospitalId)
      if (hospital) {
        return hospital.areaList?.find((a) => a.sign === hospitalArea)?.name
      }
      return ''
    },
    parseHospitalName(id) {
      return this.hospitalList.find((ele) => ele.value === id)?.label
    },
    queryList(current = 1, size = 10) {
      const payload = {
        ...this.searchparam,
        current,
        size
      }
      this.loading = true
      queryRescuersList(payload).then((res) => {
        this.loading = false
        if (res.code === '000000') {
          this.tableData = res.body
        } else {
          this.$message.error('获取列表失败! ' + res.message)
        }
      })
    },
    async updateStatus(row) {
      const res = await saveOrUpdateRescuers({
        ...row,
        status: row.status === '1' ? '0' : '1'
      })
      if (res.code === '000000') {
        this.$message.success('修改成功!')
        this.queryList(this.tableData.current)
      } else {
        this.$message.error('修改失败! ' + res.message)
      }
    },
    handleEdit(param) {
      this.$refs.detail?.open(param.rescuerId)
    },
    handleDelete(param) {
      this.$confirm('确定删除 ' + param.rescuerName + ' 吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleRescuers([param.rescuerId]).then((response) => {
            if (response.body === true) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.queryList()
            } else {
              this.$message({
                type: 'warning',
                message: '删除失败!'
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
<style></style>
