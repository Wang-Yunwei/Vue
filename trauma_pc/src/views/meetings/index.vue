<template>
  <el-container style="margin: 0 10px;">
    <el-header style="background-color: #f5f6fb;height:10%;padding-top: 22px;">
      <el-form ref="searchParam" :inline="true" :model="searchParam">
        <el-form-item label="院区">
          <el-select v-model="curArea" placeholder="院区" @change="onSearch">
            <el-option v-for="(item, index) in hospitalAreaList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startDate">
          <el-date-picker v-model="searchParam.startDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="startDatePicker" />
        </el-form-item>
        <el-form-item label="结束时间" prop="endDate">
          <el-date-picker v-model="searchParam.endDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="endDatePicker" />
        </el-form-item>
        <el-form-item label="" prop="range">
          <el-radio-group v-model="searchParam.range" size="medium" @change="changeTime">
            <el-radio-button label="1">本月</el-radio-button>
            <el-radio-button label="2">本季度</el-radio-button>
            <el-radio-button label="3">本年</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button block type="primary" @click="onSearch">查询</el-button>
          <el-button @click="resetForm('searchParam')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-divider />
    <el-main style="padding: initial;">
      <el-row style="display: flex;justify-content: right;">
        <el-button icon="el-icon-plus" type="primary" @click="addShowModal">新增</el-button>
      </el-row>
      <el-table ref="patientTable" :data="meetingData" :header-cell-style="{ 'background-color': '#eef1f6' }" stripe style="width: 100%">
        <el-table-column label="开会日期" prop="meetingTime" width="150" />
        <el-table-column label="会议主旨" prop="title" />
        <el-table-column label="内容简介" prop="content" />
        <el-table-column label="图片数" prop="photoSize" width="70" />
        <el-table-column label="附件数" prop="fileSize" width="70" />
        <el-table-column label="创建时间" prop="createTime" width="180" />
        <el-table-column label="创建人" prop="createBy" width="100" />
        <el-table-column align="left" fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <span>
              <el-button size="mini" @click="doUpdate(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="doDelete(scope.row)">删除</el-button>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page.sync="pagination.pageNo" :page-size="pagination.pageSize" :total="pagination.total" background layout="total, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" style="float: right;" />
      <!--新增-->
      <el-dialog v-if="addVisible" :visible.sync="addVisible" :title="subPageTitle" width="1200px" :close-on-click-modal="false">
        <add-file :file-info="fileInfo" @subVisibleFlag="subAddVisible()" />
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import AddFile from '@/views/meetings/add'
import storage from 'store'
import moment from 'moment'
import store from '@/store'
import { mapGetters } from 'vuex'
export default {
  name: 'MeetIndex',
  components: {
    AddFile
  },
  data() {
    return {
      startDatePicker: this.beginDate(),
      endDatePicker: this.processDate(),
      searchParam: {
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().endOf('day').format('YYYY-MM-DD')
      },
      rules: {
        beginTime: [{ required: true, message: '请选择时间', trigger: 'blur' }],
        endTime: [{ required: true, message: '请选择时间', trigger: 'blur' }]
      },

      subPageTitle: '',
      searchData: {},
      pagination: {
        total: 0,
        pageNo: 1,
        size: 10
      },
      meetingData: [],
      addVisible: false,
      fileInfo: {},
      registIds: [],
    }
  },
  mounted() {
    this.onSearch()
  },
  computed: {
    ...mapGetters(['hospitalAreaList', 'hospitalArea', 'hospitalId']),
    curArea: {
      get() {
        return this.hospitalArea
      },
      set(val) {
        store.dispatch('common/setHospitalArea', val)
      }
    }
  },
  methods: {
    onSearch() {
      this.searchBarHandle(this.searchParam)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 日期修改
    beginDate() {
      const self = this
      return {
        disabledDate(time) {
          if (self.searchParam.endDate) {
            return new Date(self.searchParam.endDate).getTime() < time.getTime()
          } else {
            return time.getTime() >= Date.now() // 结束时间不选时，开始时间最大值小于等于当天
          }
        }
      }
    },
    // 结束时间必须大于开始时间
    processDate() {
      const self = this
      return {
        disabledDate(time) {
          if (self.searchParam.startDate) {
            return (
              new Date(self.searchParam.startDate).getTime() > time.getTime()
            )
          } else {
            return time.getTime() >= Date.now() // 开始时间不选时，结束时间最大值小于等于当天
          }
        }
      }
    },
    changeTime(val) {
      // 本月
      if (val === '1') {
        this.searchParam.startDate = moment()
          .startOf('month')
          .format('YYYY-MM-DD')
        this.searchParam.endDate = moment().endOf('day').format('YYYY-MM-DD')
      }
      // 本季度
      if (val === '2') {
        this.searchParam.startDate = moment()
          .startOf('quarter')
          .format('YYYY-MM-DD')
        this.searchParam.endDate = moment().endOf('day').format('YYYY-MM-DD')
      }
      // 本年
      if (val === '3') {
        this.searchParam.startDate = moment()
          .startOf('year')
          .format('YYYY-MM-DD')
        this.searchParam.endDate = moment().endOf('day').format('YYYY-MM-DD')
      }
      this.onSearch()
    },

    subAddVisible() {
      this.addVisible = false
      const params = storage.get('meetinsSearchData')
      this.searchBarHandle(params)
    },
    doUpdate(va) {
      this.subPageTitle = '修改页面'
      this.fileInfo = va
      this.addVisible = true
    },
    doDelete(va) {
      this.$confirm('确认删除此份会议记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.meetingDeleteById(va.id).then((res) => {
          if (res.code === '000000') {
            // 进入遍历编辑页面
            this.$message.success('删除成功')
            const params = storage.get('meetinsSearchData')
            this.searchBarHandle(params)
          } else {
            this.$message.error('请求错误，请确认数据是否正常！')
          }
        })
      }).catch(() => { })
    },
    addShowModal() {
      this.subPageTitle = '新增会议'
      this.fileInfo = {}
      this.addVisible = true
    },
    handleSizeChange(val) {
      this.fetch({
        ...this.radioParam,
        pageSize: val
      })
    },
    handleCurrentChange(val) {
      this.fetch({
        ...this.radioParam,
        pageNo: val
      })
    },
    searchBarHandle(params) {
      storage.set('meetinsSearchData', params)
      this.searchData = { ...params, hospitalArea: this.hospitalArea }
      this.fetch({ ...this.searchData })
    },
    fetch(params = {}) {
      const queryParams = { pageNo: 1, pageSize: 10, ...params }
      this.$api.meetingQueryByPage(queryParams).then((res) => {
        if (res.code === '000000') {
          const pagination = { ...this.pagination }
          pagination.total = res.body.total
          pagination.pageNo = res.body.current
          pagination.pageSize = res.body.size
          this.meetingData = res.body.records
          this.pagination = pagination
        }
      })
    }
  }
}
</script>
