<template>
  <el-container>
    <el-header height="44px">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="模板ID">
          <el-select v-model="searchForm.ratingId" clearable placeholder="请选择">
            <el-option v-for="item in ratingScaleList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="searchForm.label" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="openDialog(1)">新增</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-table ref="ratingScaleTable" :data="tableData" style="width: 100%;" height="calc(100vh - 190px)">
        <el-table-column prop="ratingId" label="模板名称" width="260">
          <template slot-scope="scope">
            <span>{{ itemRender(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="label" label="明细标题" width="180" />
        <el-table-column prop="classify" label="分类" width="160" />
        <el-table-column prop="sort" label="排序" width="100" />
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
        <el-form-item label="所属模板" prop="ratingId">
          <el-select v-model="dialogForm.ratingId" clearable placeholder="请选择">
            <el-option v-for="item in ratingScaleList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="明细标题" prop="label">
          <el-input v-model="dialogForm.label" clearable />
        </el-form-item>
        <el-form-item label="分类" prop="classify">
          <el-input v-model="dialogForm.classify" clearable />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-row>
            <el-col :span="12">
              <el-input v-model="dialogForm.content" type="textarea" autosize clearable />
            </el-col>
            <el-col :span="12">
              <json-viewer :value="dialogForm.content" copyable boxed sort />
            </el-col>
          </el-row>

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
  name: 'RatingScaleItem',
  data() {
    return {
      ratingScaleList: [],
      searchForm: {
        ratingId: '',
        label: ''
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
        ratingId: '',
        label: '',
        content: '',
        classify: '',
        sort: '',
        status: ''
      },
      rules: {
        ratingId: [{ required: true, message: '请输入所属模板', trigger: 'blur' }],
        label: [{ required: true, message: '请输入明细标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序', trigger: 'blur', type: 'number' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['hospitalId'])
  },
  mounted: function() {
    this.loadRatingScaleList()
    this.getList()
  },
  methods: {
    loadRatingScaleList() {
      settingsApi.ratingscaleList({ hospitalId: this.hospitalId }).then(res => {
        this.ratingScaleList = res.result
      })
    },
    itemRender(row) {
      const item = this.ratingScaleList.find(t => t.id === row.ratingId)
      if (item) {
        return item.name
      } else {
        return row.ratingId
      }
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.pageInfo.current = val
      this.getList()
    },
    search() {
      this.pageInfo.current = 1
      this.getList()
    },
    getList() {
      settingsApi.ratingscaleItemPage({ ...this.searchForm, ...this.pageInfo })
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
      this.$set(this.dialogForm, 'ratingId', '')
      this.$set(this.dialogForm, 'label', '')
      this.$set(this.dialogForm, 'content', '')
      this.$set(this.dialogForm, 'classify', '')
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
      settingsApi.ratingscaleItemSave({ ...this.dialogForm })
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
      settingsApi.ratingscaleItemUpdate({ ...this.dialogForm })
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
      settingsApi.ratingscaleItemDelete({ id: id })
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
