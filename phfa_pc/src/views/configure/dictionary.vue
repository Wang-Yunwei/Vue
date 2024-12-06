<template>
  <div>
    <el-container>
      <el-main>
        <div class="flex-c-e">
          <el-button type="primary" icon="el-icon-plus" @click="addDicValue">新增字典值</el-button>
          <el-upload
            class="upload-btn"
            :action="GLOBAL_APP_API_BASE_URL+'/DataDictionaryController/v1/ddcAddBatch'"
            multiple
            :on-success="onSuccess"
            :show-file-list="false"
            :headers="{
              'jwt-token':businessToken
            }"
          >
            <el-button type="primary" plain icon="el-icon-upload">点击上传</el-button>
          </el-upload>
        </div>
        <el-table ref="table" :data="tableData" height="calc(100vh - 182px)">
          <el-table-column prop="label" label="NAME">
            <template scope="scope">
              <el-input v-show="scope.row.show" v-model="scope.row.label" size="small" placeholder="请输入内容" />
              <span v-show="!scope.row.show">{{ scope.row.label }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="value" label="VALUE">
            <template scope="scope">
              <el-input v-show="scope.row.show" v-model="scope.row.value" size="small" placeholder="请输入内容" />
              <span v-show="!scope.row.show">{{ scope.row.value }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-color="#13ce66"
                inactive-color="#ccc"
                active-value="1"
                inactive-value="0"
                @change="ddcSaveOrUpdate(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="extend" label="扩展">
            <template scope="scope">
              <el-input
                v-show="scope.row.show"
                v-model="scope.row.extend"
                type="textarea"
                :rows="2"
                size="small"
                placeholder="请输入内容"
              />
              <span v-show="!scope.row.show">{{ scope.row.extend }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="describe" label="备注">
            <template scope="scope">
              <el-input
                v-show="scope.row.show"
                v-model="scope.row.describe"
                type="textarea"
                :rows="2"
                size="small"
                placeholder="请输入内容"
              />
              <span v-show="!scope.row.show">{{ scope.row.describe }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" fixed="right" label="操作" min-width="220" width="240">
            <template slot-scope="scope">
              <el-button
                size="mini"
                :type="!scope.row.show ? 'primary' : 'success'"
                :icon="!scope.row.show ? 'el-icon-edit' : 'el-icon-check'"
                circle
                @click="toggleEdit(scope.row)"
              />
              <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-main style="border-left: 1px solid #ddd; width: 300px">
        <el-form label-width="80px" :model="searchparam">
          <el-form-item label="医院">
            <med-select v-model="searchparam.hospitalId" placeholder="医院" :options="hospitalList" @_change="onSubmit" />
          </el-form-item>
          <el-form-item label="字典编码">
            <el-input v-model="searchparam.dictCode" placeholder="字典编码" @change="onSubmit" />
          </el-form-item>
          <el-form-item label="字典名称">
            <el-input v-model="searchparam.dictName" placeholder="字典名称" @change="onSubmit" />
          </el-form-item>
        </el-form>
        <ul class="list">
          <li
            v-for="item in list"
            :key="item.title"
            :class="{ 'list-item': true, active: activeItem === item.dictCode }"
            @click="handleClick(item)"
          >
            {{ item.title }}
          </li>
          <center v-if="!list.length">暂无数据</center>
        </ul>
      </el-main>
    </el-container>
    <add-dic-value :visible.sync="addDicValueShow" @refresh="doSearch" />
  </div>
</template>

<script>
import {
  ddcSaveOrUpdate,
  ddcDelete,
  ddcListOrDetails,
  getDictCode
} from '@/api/dictionary'
import AddDicValue from './addDicValue.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    AddDicValue
  },
  data() {
    return {
      textarea: '',
      addDicValueShow: false,
      dict: {},
      activeItem: '',
      list: [], // 右侧列表
      searchparam: {},
      tableData: [],
      page: 1,
      rows: 10,
      dataCount: 0,
      GLOBAL_APP_API_BASE_URL: window.GLOBAL_APP_API_BASE_URL
    }
  },
  computed: {
    ...mapGetters(['hospitalList', 'businessToken'])
  },
  async mounted() {
  },
  methods: {
    onSuccess() {
      this.$message.success('上传成功!')
      if (this.searchparam.hospitalId) this.onSubmit()
    },
    toggleEdit(row) {
      row.show = !row.show
      if (!row.show) {
        // eslint-disable-next-line no-unused-vars
        const { show, ...payload } = row
        ddcSaveOrUpdate(payload).then(() => {
          this.handleClick(this.dict)
        })
      }
    },
    doSearch() {
      this.handleClick(this.dict)
    },
    addDicValue() {
      this.addDicValueShow = true
    },
    ddcSaveOrUpdate(param) {
      ddcSaveOrUpdate({
        id: param.id,
        status: param.status
      }).then(() => {
        this.handleClick(this.dict)
      })
    },
    handleClick(param) {
      this.dict = param
      this.activeItem = param.dictCode
      ddcListOrDetails({ code: param.dictCode }).then(res => {
        res?.body?.forEach((element) => {
          element['show'] = false
        })
        this.tableData = res.body
      })
    },
    async onSubmit() {
      // 查询字典编码
      await getDictCode(this.searchparam).then((res) => {
        this.list = res.body
      })
    },
    handleSizeChange() {
      console.log(this.rows) // pageSize
    },
    handleCurrentChange() {
      console.log(this.page) // pageIndex
    },

    handleDelete(param) {
      this.$confirm(
        '确定删除 {KEY=' +
        param.label +
        ', VALUE=' +
        param.value +
        '} 的字典值吗?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          ddcDelete([param.id]).then((response) => {
            if (response.body === true) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              if (this.searchparam.hospitalId) this.onSubmit()
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
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  border: 1px solid #ddd;
  padding: 10px 0;
  list-style: none;
  max-height: calc(100vh - 320px);
  overflow: auto;
}

aside {
  margin-bottom: 0;
}

.list-item {
  line-height: 36px;
  font-size: 14px;
  cursor: pointer;
  padding: 0 15px;
}

.list-item:hover,
.list-item.active {
  background-color: #444fdb;
  color: #fff;
}

.list-item+.list-item {
  border-top: 1px solid #ddd;
}

.main-area {
  overflow: auto;
  max-height: 100vh;
}

.pagination {
  margin: 5px 10px 0 0;
  float: right;
}

.upload-btn {
  margin-left: 10px;
}
</style>
