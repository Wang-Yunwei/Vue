<template>
  <el-dialog :visible.sync="show" title="专科对应类别">
    <el-container>
      <el-main>
        <el-table :data="tableData.records">
          <el-table-column prop="name" label="专科名称" />
          <el-table-column prop="value" label="对应类别" />
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
      </el-main>
      <el-main style="border-left: 1px solid #ddd; width: 350px">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="专科名称" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="对应类别" prop="value">
            <el-input v-model="form.value" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit(form)">保存</el-button>
            <el-button @click="cleanForm">取消</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </el-dialog>
</template>
<script>
import { specialistCategory } from '@/api/drug'
export default {
  name: 'SpecialistCategory',
  props: {
    id: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
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
    show: {
      get() {
        return this.visible
      },
      set(v) {
        this.$emit('update:visible', v)
      }
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        if (val) this.handleSelect()
      }
    }
  },
  methods: {
    handleSelect() {
      specialistCategory({
        id: this.id,
        operation: 2
      }).then((response) => {
        this.tableData.records = response.body
      })
    },
    handleEdit(param) {
      this.form = { ...param }
    },
    handleDelete(param) {
      this.$confirm('确定删除 ' + param.name + ' 对应类别吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          specialistCategory({
            id: this.id,
            operation: 1,
            name: param.name
          }).then((response) => {
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
    onSubmit(param) {
      specialistCategory({
        id: this.id,
        operation: 0,
        name: param.name,
        value: param.value
      }).then((response) => {
        if (response.body === true) {
          this.cleanForm()
          this.handleSelect()
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
