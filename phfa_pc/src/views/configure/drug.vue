<template>
  <div>
    <el-container>
      <el-main>
        <el-table :data="tableData.records" height="calc(100vh - 190px)">
          <el-table-column prop="code" label="药品代码" />
          <el-table-column prop="name" label="药品名称" />
          <el-table-column prop="category" label="药品类别" />
          <el-table-column prop="drugUnit" label="药品单位" />
          <el-table-column prop="specifications" label="药品规格" />
          <el-table-column prop="production" label="生产企业" />
          <el-table-column prop="defaultDose" label="默认用量" />
          <el-table-column prop="defaultUsage" label="默认用法" />
          <el-table-column prop="createdDate" label="创建时间" />
          <el-table-column prop="updateDate" label="更新时间" />
          <el-table-column prop="deleteFlag" label="状态">
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
          <el-table-column prop="xx" label="专科对应类别">
            <template scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="specialistCategory(scope.row.id)"
              >查看</el-button>
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
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item
            label="药品代码"
            prop="code"
            :rules="[{ required: true, message: '请填写' }]"
          >
            <el-input v-model="form.code" />
          </el-form-item>
          <el-form-item
            label="药品名称"
            prop="name"
            :rules="[{ required: true, message: '请填写' }]"
          >
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item
            label="药品类别"
            prop="category"
            :rules="[{ required: true, message: '请填写' }]"
          >
            <el-input v-model="form.category" />
          </el-form-item>
          <el-form-item
            label="药品单位"
            prop="drugUnit"
            :rules="[{ required: true, message: '请填写' }]"
          >
            <el-input v-model="form.drugUnit" />
          </el-form-item>
          <el-form-item
            label="药品规格"
            prop="specifications"
            :rules="[{ required: true, message: '请填写' }]"
          >
            <el-input v-model="form.specifications" />
          </el-form-item>
          <el-form-item
            label="生产企业"
            prop="production"
            :rules="[{ required: true, message: '请填写' }]"
          >
            <el-input v-model="form.production" />
          </el-form-item>
          <el-form-item
            label="默认用量"
            prop="defaultDose"
            :rules="[{ required: true, message: '请填写' }]"
          >
            <el-input v-model="form.defaultDose" />
          </el-form-item>
          <el-form-item
            label="默认用法"
            prop="defaultUsage"
            :rules="[{ required: true, message: '请填写' }]"
          >
            <el-input v-model="form.defaultUsage" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit(form)">保存</el-button>
            <el-button @click="cleanForm">取消</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
    <specialist-category
      :id="selectedId"
      :visible.sync="specialistCategoryShow"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { dicConstant as dic } from '@/constant'
import { drugSaveOrUpdate, drugDelete, drugPageList } from '@/api/drug'
import SpecialistCategory from './specialistCategory'
export default {
  components: {
    SpecialistCategory
  },
  data() {
    return {
      specialistCategoryShow: false,
      dic,
      form: {},
      selectedId: '',
      tableData: {
        current: 0,
        size: 10,
        total: 0,
        records: []
      }
    }
  },
  mounted() {
    this.handleSelect()
  },
  computed: {
    ...mapGetters(['dictionary']),
    driverList() {
      return (this.dictionary[this.dic.driver] || []).map((d) => ({
        ...d,
        value: d.label
      }))
    }
  },
  methods: {
    specialistCategory(id) {
      this.selectedId = id
      this.specialistCategoryShow = true
    },
    handleSizeChange(val) {
      this.tableData.size = val
      this.handleSelect()
    },
    handleCurrentChange(val) {
      this.tableData.current = val
      this.handleSelect()
    },
    handleSelect() {
      drugPageList({ ...this.tableData }).then((response) => {
        this.tableData = response.body
      })
    },
    handleEdit(param) {
      this.form = { ...param }
    },
    handleDelete(param) {
      this.$confirm('确定删除 药品: ' + param.name + ' 吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          drugDelete([param.id]).then((response) => {
            if (response.body === true) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.cleanForm()
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
    updateStatus(param) {
      drugSaveOrUpdate({ id: param.id, deleteFlag: param.deleteFlag })
    },
    onSubmit(param) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          drugSaveOrUpdate({ ...param }).then((response) => {
            if (response.body === true) {
              this.cleanForm()
              this.handleSelect()
            }
          })
        }
      })
    },
    cleanForm() {
      this.form.id = undefined
      this.$refs.form.resetFields()
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
