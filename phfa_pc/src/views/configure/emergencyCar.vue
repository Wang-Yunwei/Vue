<template>
  <el-container>
    <el-main>
      <el-table :data="tableData.records" height="calc(100vh - 190px)">
        <el-table-column prop="code" label="车辆代码" />
        <el-table-column prop="licensePlate" label="车牌号" />
        <el-table-column prop="carPhone" label="车载电话" />
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
        <el-table-column prop="regionId" label="行政区域ID" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column prop="status" label="状态" width="66" align="center">
          <template slot-scope="scope">
            <el-tag size="small" :type="scope.row.status === 1 ? 'danger' : 'success'">{{ scope.row.status === 1 ? '繁忙' :
              '空闲' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" min-width="220" width="140">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)" />
            <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin: 5px 10px 0 0; float: right" :current-page="tableData.current"
        :page-sizes="[10, 20, 30]" :page-size="tableData.size" layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-main>
    <el-main style="border-left: 1px solid #ddd; width: 500px">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="车辆代码" prop="code">
          <el-input v-model="form.code" />
        </el-form-item>
        <el-form-item label="车牌号" prop="licensePlate" :rules="[
          { required: true, message: '请输入车牌号', trigger: 'change' }
        ]">
          <el-input v-model="form.licensePlate" placeholder="车牌" />
        </el-form-item>
        <el-form-item label="车载电话" prop="carPhone">
          <el-input v-model="form.carPhone" placeholder="车载电话" />
        </el-form-item>
        <el-form-item label="归属医院(院区)" prop="hospitalId" :rules="[
          { required: true, message: '选择归属医院', trigger: 'change' }
        ]">
          <hospital-area-select :hospital-id.sync="form.hospitalId" :hospital-area.sync="form.hospitalArea"
            placeholder="请选择" />
        </el-form-item>
        <el-form-item label="行政区域ID" prop="regionId">
          <el-input v-model="form.regionId" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(form)">保存</el-button>
          <el-button @click="cleanForm">取消</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>
<script>
import { mapGetters } from 'vuex'
import { dicConstant as dic } from '@/constant'
import { eccSaveOrUpdate, eccDelete, eccPageList } from '@/api/emergencyCar'
export default {
  data() {
    return {
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
      'hospitalAreaList'
    ]),
    driverList() {
      return (this.dictionary[this.dic.driver] || []).map((d) => ({
        ...d,
        value: d.label
      }))
    }
  },
  mounted() {
    this.getEccPageList()
  },

  methods: {
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
    handleEdit(param) {
      this.form = { ...param }
    },
    handleDelete(param) {
      this.$confirm(
        '确认删除车辆【' + param.licensePlate + ' 】吗?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          eccDelete([param.id]).then((response) => {
            if (response.body === true) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.handleClick(this.dict)
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
    },
    cleanForm() {
      this.form.id = undefined
      this.form.status = undefined
      this.$refs.form.resetFields()
    },
    handleSizeChange(val) {
      this.tableData.size = val
      this.getEccPageList()
    },
    handleCurrentChange(val) {
      this.tableData.current = val
      this.getEccPageList()
    },
    async getEccPageList() {
      eccPageList({ ...this.tableData }).then((response) => {
        this.tableData = response.body
      })
    },
    onSubmit(param) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          eccSaveOrUpdate({ ...param }).then((response) => {
            if (response.body === true) {
              this.cleanForm()
              this.getEccPageList()
            }
          })
        }
      })
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.status === 1) {
        return 'warning-row'
      } else {
        return 'success-row'
      }
    }
  }
}
</script>
<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
