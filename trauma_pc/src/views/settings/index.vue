<template>
  <el-container style="padding: 2rem 0;height: calc(100vh - 50px)">
    <el-main style="border-right: 1px solid rgb(221, 221, 221);">
      <q-r-code v-if="activeName === '2'" :dialogTableVisible="dialogTableVisible" @close="dialogTableVisible = false" />
      <div v-else>
        <el-row style="display: flex;justify-content: right;">
          <el-button type="primary" size="small" icon="el-icon-plus" :disabled="tableData.length < 1" @click="addDicVal">新增字典值</el-button>
          <!-- <el-upload action="https://jsonplaceholder.typicode.com/posts/" style="margin-left: 10px;">
            <el-button type="primary" size="small" icon="el-icon-upload2" style="color: #444fdb;background: #ecedfb;border-color: #b4b9f1">点击上传</el-button>
          </el-upload>
          <el-button type="primary" size="small" icon="el-icon-download" style="color: #444fdb;background: #ecedfb;border-color: #b4b9f1">下载模板</el-button> -->
        </el-row>
        <el-table :data="tableData" size="mini">
          <el-table-column label="名称">
            <template slot-scope="scope">
              <el-input v-model="scope.row.label" placeholder="请输入名称" size="mini" class="my-input" :readonly="scope.row.readonly" />
            </template>
          </el-table-column>
          <el-table-column label="编码">
            <template slot-scope="scope">
              <el-input v-model="scope.row.value" placeholder="请输入编码" size="mini" class="my-input" :readonly="scope.row.readonly" />
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" active-color="#13ce66" active-value="1" inactive-value="0" :disabled="scope.row.readonly" />
            </template>
          </el-table-column>
          <el-table-column label="扩展">
            <template slot-scope="scope">
              <el-input v-model="scope.row.extend" placeholder="请输入" size="mini" class="my-input" :readonly="scope.row.readonly" />
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template slot-scope="scope">
              <el-input v-model="scope.row.describe" placeholder="请输入" size="mini" class="my-input" :readonly="scope.row.readonly" />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button :type="scope.row.readonly ? 'primary' : 'success'" :icon="scope.row.readonly ? 'el-icon-edit' : 'el-icon-check'" circle size="mini" @click="editOrSave(scope.row)" />
              <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="deleteClick(scope.row, scope.$index)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-main>
    <el-main style="width: 300px;">
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item title="数据字典" name="1">
          <div>
            <el-form ref="form" :model="form" label-width="80px" size="mini">
              <el-form-item label="医院">
                <el-select v-model="form.hospitalId" placeholder="请选择" clearable @change="getDicCodes">
                  <el-option v-for="(item, index) in hospitalList" :key="index" :label="item.name" :value="item.sign" />
                </el-select>
              </el-form-item>
              <el-form-item label="字典编码">
                <el-input v-model="form.dictCode" />
              </el-form-item>
              <el-form-item label="字典名称">
                <el-input v-model="form.dictName" />
              </el-form-item>
            </el-form>
            <table v-if="list.length > 0" style="border: 1px solid #ddd;">
              <tr v-for="(item, index) in list" :key="index">
                <td style="padding: 5px 10px;">
                  <el-link type="info" style="font-size: 14px;" @click="getDicByCodes(item.dictCode)">{{ item.title }}</el-link>
                </td>
              </tr>
            </table>
            <p v-else style="text-align: center;">暂无数据</p>
          </div>
        </el-collapse-item>
        <el-collapse-item title="场景二维码" name="2">
          <el-button @click="dialogTableVisible = true">配置</el-button>
        </el-collapse-item>
      </el-collapse>
    </el-main>
  </el-container>
</template>

<script>
import QRCode from './qRCode/index'
export default {
  name: 'Index',
  components: { QRCode },
  data() {
    return {
      tableData: [],
      list: [],
      form: {},
      hospitalList: [],
      activeName: '1',
      dialogTableVisible: false
    }
  },
  watch: {
    activeName(newVal, oldVal) {
      if (oldVal === '1') {
        this.tableData = []
      }
    }
  },
  mounted() {
    this.getHospitalList()
  },
  methods: {
    editOrSave(val) {
      if (val.readonly) {
        // 编辑
        val.readonly = false
      } else {
        // 保存
        this.$api.dicSaveOrUpdate({
          ...val,
          itemcode: val.value,
          itemname: val.label
        }).then(res => {
          if (res.code === '000000') {
            this.$message({
              message: '更新成功',
              type: 'success'
            })
          }
        })
        val.readonly = true
      }
    },
    deleteClick(val, index) {
      if (val.id) {
        this.$api.dicDelete(val.id).then(res => {
          if (res.code === '000000') {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getDicByCodes(val.code)
          }
        })
      } else {
        this.tableData.splice(index, 1)
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      }
    },
    addDicVal() {
      this.tableData.push({ readonly: false, name: this.tableData[0].name, code: this.tableData[0].code })
    },
    getDicByCodes(code) {
      this.$api.queryByCodeList({
        code: [code],
        hospitalId: this.form.hospitalId
      }).then(res => {
        if (res.code === '000000') {
          this.tableData = res.body[code].map(item => {
            return { ...item, readonly: true }
          })
        }
      })
    },
    getDicCodes(val) {
      if (val) {
        this.$api.getDicCode({ ...this.form }).then(res => {
          if (res.code === '000000' && res.body.length > 0) {
            this.list = res.body
          }
        })
      } else {
        this.list = []
      }
    },
    getHospitalList() {
      this.$api.getHospitals().then(res => {
        if (res.code === '000000') {
          this.hospitalList = res.body
        }
      })
    }
  }
}
</script>

<style scoped>
.my-input ::v-deep .el-input__inner {
  border: none;
  padding: 0;
}
</style>
