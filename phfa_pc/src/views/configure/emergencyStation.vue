<template>
  <el-container>
    <el-main>
      <el-table :data="tableData.records" height="calc(100vh - 190px)">
        <el-table-column prop="name" label="站点名称" />
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
        <el-table-column prop="regionId" label="归属行政区域" />
        <el-table-column prop="longitude" width="100" label="纬度" />
        <el-table-column prop="latitude" width="100" label="经度" />
        <el-table-column prop="createdDate" width="160" label="创建时间" />
        <el-table-column prop="updateDate" width="160" label="更新时间" />
        <el-table-column prop="deleteFlag" width="50" label="状态">
          <template scope="scope">
            <el-switch
              v-model="scope.row.deleteFlag"
              active-color="#13ce66"
              inactive-color="#ccc"
              :active-value="0"
              :inactive-value="1"
              @change="updateStatus(scope.row)"
            />
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
    <el-main style="border-left: 1px solid #ddd; width: 500px">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="站点名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item
          label="归属医院(院区)"
          prop="hospitalId"
          :rules="[
            { required: true, message: '选择归属医院', trigger: 'change' }
          ]"
        >
          <hospital-area-select
            :hospital-id.sync="form.hospitalId"
            :hospital-area.sync="form.hospitalArea"
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item label="行政区域ID" prop="regionId">
          <el-input v-model="form.regionId" />
        </el-form-item>
        <el-form-item
          label="经度"
          prop="longitude"
          :rules="[{ required: true, message: '请输入', trigger: 'change' }]"
        >
          <el-input v-model="form.longitude" placeholder="经度" />
        </el-form-item>
        <el-form-item
          label="纬度"
          prop="latitude"
          :rules="[{ required: true, message: '请输入', trigger: 'change' }]"
        >
          <el-input v-model="form.latitude" placeholder="纬度" />
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
import { escSaveOrUpdate, escDelete, escPageList } from '@/api/emergencyStation'
export default {
  data() {
    return {
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
    this.handleSelect()
  },
  methods: {
    handleSizeChange(val) {
      this.tableData.size = val
      this.handleSelect()
    },
    handleCurrentChange(val) {
      this.tableData.current = val
      this.handleSelect()
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
    handleSelect() {
      escPageList({ ...this.tableData }).then((response) => {
        this.tableData = response.body
      })
    },
    updateStatus(param) {
      escSaveOrUpdate({ id: param.id, deleteFlag: param.deleteFlag })
    },
    handleEdit(param) {
      this.form = { ...param }
    },
    handleDelete(param) {
      this.$confirm('确定删除 ' + param.name + ' 站点吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          escDelete([param.id]).then((response) => {
            if (response.body === true) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.handleSelect()
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
      this.$refs.form.resetFields()
    },
    onSubmit(param) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          escSaveOrUpdate({ ...param }).then((response) => {
            if (response.body === true) {
              this.cleanForm()
              this.handleSelect()
            }
          })
        }
      })
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
