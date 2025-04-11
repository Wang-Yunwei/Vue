<template>
  <el-container>
    <el-header height="44px">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="项目ID">
          <el-input v-model="searchForm.appid" clearable />
        </el-form-item>
        <el-form-item label="模板名称">
          <el-input v-model="searchForm.name" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="openDialog(1)">新增</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table ref="ratingScaleTable" :data="tableData" style="width: 100%;" height="calc(100vh - 190px)">
        <el-table-column prop="name" label="模板名称" width="260" />
        <el-table-column prop="code" label="模板编码" width="260" />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="special" label="专科" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.status === '1' ? '可用' : '不可用' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="action" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click="handleUpdate(scope.row)">
              修改
            </el-button>
            <el-button size="mini" type="danger" plain @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pageInfo.current"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.total"
        style="float: right; margin-top: 10px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-main>
    <el-dialog v-loading="loading" :visible.sync="dialogVisible" :title="dialogTitle" center>
      <el-form ref="dialogForm" :model="dialogForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="项目ID" prop="appid">
          <el-input v-model="dialogForm.appid" clearable />
        </el-form-item>
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="dialogForm.name" clearable />
        </el-form-item>
        <el-form-item label="模板编码" prop="code">
          <el-input v-model="dialogForm.code" clearable />
        </el-form-item>
        <el-form-item label="专科" prop="special">
          <el-input v-model="dialogForm.special" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="dialogForm.sort" :min="1" :max="100" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="dialogForm.status" prop="status">
            <el-radio label="1">可用</el-radio>
            <el-radio label="0">不可用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import settingsApi from '@/api/settings'
import { mapGetters } from 'vuex'

export default {
  name: 'RatingScale',
  data() {
    return {
      hospitalList: [],
      searchForm: {
        hospitalId: this.hospitalId,
        appid: '',
        code: '',
        name: ''
      },
      pageInfo: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      loading: false,
      dialogVisible: false,
      dialogTitle: '新增',
      dialogForm: {
        id: '',
        hospitalId: this.hospitalId,
        appid: '',
        code: '',
        name: '',
        special: '',
        sort: '',
        status: ''
      },
      rules: {
        code: [{ required: true, message: '请输入标识', trigger: 'blur' }],
        name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
        special: [{ required: true, message: '请输入专科', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序', trigger: 'blur', type: 'number' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['hospitalId'])
  },
  mounted: function() {
    this.getList()
  },
  methods: {
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.pageInfo.current = val
      this.getList()
    },
    getList() {
      settingsApi.ratingscalePage({ ...this.searchForm, ...this.pageInfo })
        .then(res => {
          this.tableData = res.result.records
          this.pageInfo.total = res.result.total
        })
    },
    handleUpdate(val) {
      this.dialogForm = { ...val }
      this.openDialog(2)
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delete(val.id)
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    openDialog(val) {
      if (val === 1) {
        this.dialogTitle = '新增'
        this.resetDialogForm()
      } else {
        this.dialogTitle = '编辑'
      }
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
    },
    resetDialogForm() {
      this.$set(this.dialogForm, 'id', '')
      this.$set(this.dialogForm, 'hospitalId', this.hospitalId)
      this.$set(this.dialogForm, 'appid', '')
      this.$set(this.dialogForm, 'code', '')
      this.$set(this.dialogForm, 'name', '')
      this.$set(this.dialogForm, 'special', '')
      this.$set(this.dialogForm, 'sort', '')
      this.$set(this.dialogForm, 'status', '')
    },
    submit() {
      this.$refs['dialogForm'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.dialogTitle === '新增') {
            this.add()
          } else {
            this.update()
          }
        }
      })
    },
    add() {
      settingsApi.ratingscaleSave({ ...this.dialogForm })
        .then(res => {
          this.loading = false
          if (res.code === '0') {
            this.$message.success('保存成功!')
            this.dialogVisible = false
            this.getList()
          } else {
            this.$message.error('保存失败!')
          }
        })
    },
    update() {
      settingsApi.ratingscaleUpdate({ ...this.dialogForm })
        .then(res => {
          this.loading = false
          if (res.code === '0') {
            this.$message.success('修改成功!')
            this.dialogVisible = false
            this.getList()
          } else {
            this.$message.error('修改失败!')
          }
        })
    },
    delete(id) {
      settingsApi.ratingscaleDelete({ id: id })
        .then(res => {
          if (res.code === '0') {
            this.$message.success('删除成功!')
            this.getList()
          } else {
            this.$message.error('删除失败!')
          }
        })
    }
  }
}
</script>

<style></style>
