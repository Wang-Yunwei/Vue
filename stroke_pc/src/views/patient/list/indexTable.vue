<template>
  <div>
    <el-radio-group v-model="radioStatus" @change="changeRadio">
      <el-radio-button label="1">全部</el-radio-button>
      <el-radio-button label="2">填报中</el-radio-button>
      <el-radio-button label="3">待审核</el-radio-button>
      <el-radio-button label="4">审核拒绝</el-radio-button>
      <el-radio-button label="5">待存档</el-radio-button>
      <el-radio-button label="6">存档拒绝</el-radio-button>
      <el-radio-button label="7">已存档</el-radio-button>
      <el-radio-button label="8">已上报</el-radio-button>
      <el-radio-button label="9">已删除</el-radio-button>
    </el-radio-group>
    <div class="function-bar">
      <el-button icon="el-icon-plus" type="primary"
        @click="addShowModal">新增病历</el-button>
      <el-button v-if="radioStatus === '2'" icon="el-icon-delete" type="danger"
        @click="updateIsDelete(registIds, '1', '')">批量删除</el-button>
      <download-excel :data="exportData" :fields="json_fields" :header="title"
        name="病例列表.xls">
        <el-button icon="el-icon-download" style="margin-left: 10px"
          type="success">导出</el-button>
      </download-excel>
      <!-- <el-button v-if="radioStatus ==='9' && multipleSelection.length > 0" icon="el-icon-back" type="warning" @click="updateIsDelete(registIds, '0')">批量恢复</el-button>
      <el-button v-if="radioStatus ==='9' && multipleSelection.length > 0" icon="el-icon-delete" type="danger" @click="deletePatient(registIds)">彻底删除</el-button> -->
    </div>
    <el-table ref="patientTable" :data="patientData"
      :header-cell-style="{ 'background-color': '#eef1f6' }" stripe
      style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column fixed="left" label="建档时间" prop="createTime" width="160" />
      <el-table-column fixed="left" label="姓名" prop="name" width="120" />
      <el-table-column label="性别" prop="gender" width="75">
        <template slot-scope="scope">
          {{ convert(scope.row.gender, dic.gender) }}
        </template>
      </el-table-column>
      <el-table-column label="年龄" prop="age" width="75" />
      <el-table-column label="来院方式" prop="comingType" width="100">
        <template slot-scope="scope">
          {{ convert(scope.row.comingType, dic.comingType) }}
        </template>
      </el-table-column>
      <el-table-column label="腕带号" prop="rfTagId" width="95" />
      <!-- <el-table-column label="主诉" prop="cc" /> -->
      <el-table-column label="到院时间" prop="arriveHospitalTime" width="160" />
      <el-table-column label="初步诊断" prop="diag">
        <template slot-scope="scope">
          {{ convert(scope.row.diag, dic.diag) }}
        </template>
      </el-table-column>
      <el-table-column label="初步处置" prop="dispose">
        <template slot-scope="scope">
          {{ arrConvert(scope.row.dispose, dic.dispose) }}
        </template>
      </el-table-column>
      <!--只有’全部‘和’填报中‘，该列才显示出来-->
      <el-table-column v-if="patientStatusAllFlag" :key="Math.random()"
        label="病例状态" width="100">
        <template slot-scope="scope">
          {{ showPatientStatus(scope.row) }}
        </template>
      </el-table-column>
      <!--只有’已存档‘，该列才显示出来-->
      <el-table-column v-if="reportFlag" :key="Math.random()" label="上报状态"
        prop="reportStatus" width="100">
        <template slot-scope="scope">
          {{ getReportStatusText(scope.row.reportStatus) }}
        </template>
      </el-table-column>
      <el-table-column v-if="remarkFlag" label="驳回原因" prop="remark" width="150"
        show-overflow-tooltip />
      <el-table-column align="left" fixed="right" label="操作" min-width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.isDelete === '0'">
            <span class="bth">
              <el-button size="mini" @click="goUpdateView(scope.row)">{{
                viewNameChange(scope.row)
              }}</el-button>
              <el-button size="mini"
                @click="timelineShowModal(scope.row)">时间轴</el-button>
            </span>
            <span v-if="scope.row.status === '0'">
              <el-button size="mini" type="danger" plain @click="
                updateIsDelete([scope.row.registId], '1', scope.row.name)
                ">删除</el-button>
              <el-button v-if="!scope.row.rfTagId" size="mini"
                @click="rfTagShowModal(scope.row)">绑定腕带</el-button>
              <!-- <el-button size="mini" @click="updateStatus([scope.row.registId], '1')">提交</el-button> -->
            </span>
            <span v-if="scope.row.status === '1'">
              <el-button size="mini"
                @click="updateStatus([scope.row.registId], '2')">审核</el-button>
            </span>
            <span v-if="scope.row.status === '2'">
              <el-button size="mini"
                @click="updateStatus([scope.row.registId], '3')">存档</el-button>
            </span>
            <span v-if="scope.row.status === '3'">.
              <span v-if="scope.row.reportStatus === '0'">
                <el-button size="mini"
                  @click="updateReportStatus([scope.row.registId], '1')">上报</el-button>
              </span>
              <span v-if="scope.row.reportStatus === '3'">
                <el-button size="mini"
                  @click="updateReportStatus([scope.row.registId], '1')">上报</el-button>
                <el-button size="mini"
                  @click="updateStatus([scope.row.registId], '0')">撤回</el-button>
              </span>
            </span>
          </span>
          <span v-if="scope.row.isDelete === '1'">
            <el-button size="mini"
              @click="updateIsDelete([scope.row.registId], '0', scope.row.name)">恢复</el-button>
            <el-button size="mini" type="danger" plain
              @click="deletePatient(scope.row)">彻底删除</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page.sync="pagination.current"
      :page-size="pagination.pageSize" :total="pagination.total" background
      class="pagination" layout="total, prev, pager, next, jumper"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    <!--绑定腕带-->
    <el-dialog v-if="rfTagVisible" :visible.sync="rfTagVisible" title="腕带绑定"
      width="400px">
      <rf-tag :patient="patientInfo" :rf-tags="rfTags"
        @cancelForm="rfTagHideModal" />
    </el-dialog>
    <!--时间轴-->
    <el-dialog v-if="timelineVisible" :visible.sync="timelineVisible" title=""
      width="75%" top="unset" custom-class="centered-modal">
      <timeline :dic="dic" :patient="patientInfo" />
    </el-dialog>
    <!--新增病例-->
    <el-dialog v-if="addVisible" :visible.sync="addVisible" title="新增病历"
      width="900px">
      <add-file @createShowModal="createShowModal" />
    </el-dialog>
    <!--新增病例-->
    <el-dialog v-if="createVisible" :visible.sync="createVisible" title="基本信息"
      width="750px">
      <create-file :file-info="fileInfo" @createHideModal="createHideModal" />
    </el-dialog>
  </div>
</template>

<script>
import patientApi from '@/api/patient'
import { mapGetters } from 'vuex'
import RfTag from '@/views/patient/list/rfTag'
import Timeline from '@/views/patient/list/timeline'
import AddFile from '@/views/patient/add/index'
import createFile from '@/views/patient/add/createFile'
import storage from 'store'
import statusType from '@/constant/statusType'
import reportType from '@/constant/reportType'

export default {
  name: 'IndexTable',
  components: {
    RfTag,
    Timeline,
    AddFile,
    createFile
  },
  data() {
    return {
      reportType,
      remarkFlag: false,
      radioStatus: '1',
      patientData: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10
      },
      searchParam: {},
      radioParam: {},
      rfTagVisible: false,
      timelineVisible: false,
      addVisible: false,
      createVisible: false,
      patientInfo: {},
      rfTags: [],
      fileInfo: {},
      multipleSelection: [],
      registIds: [],
      dic: storage.get('dicData') || {},
      patientStatusAllFlag: false,
      reportFlag: false,
      exportData: [],
      title: '病例列表',
      json_fields: {
        建档时间: 'createTime',
        姓名: 'name',
        性别: {
          field: 'gender',
          callback: (value) => {
            return this.convert(value, this.dic.gender)
          }
        },
        年龄: 'age',
        来院方式: {
          field: 'comingType',
          callback: (value) => {
            return this.convert(value, this.dic.comingType)
          }
        },
        腕带号: {
          field: 'rfTagId',
          callback: (value) => {
            return this.convert(value, this.rfTags)
          }
        },
        主诉: 'cc',
        主要诊断: {
          field: 'diag',
          callback: (value) => {
            return this.convert(value, this.dic.diag)
          }
        },
        到院时间: 'arriveHospitalTime',
        治疗方式: {
          field: 'dispose',
          callback: (value) => {
            return this.arrConvert(value, this.dic.dispose)
          }
        },
        建档人员: 'createName',
        建档方式: {
          field: 'comeType',
          callback: (value) => {
            return this.convert(value, this.dic.comeType)
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters(['hospitalId', 'dicData', 'curHospitalArea'])
  },
  watch: {
    curHospitalArea() {
      // 查询列表数据
      this.searchBarHandle()
    }
  },
  mounted() {
    // 查询列表数据
    this.getRfTags()
    this.searchBarHandle()
  },
  methods: {
    viewNameChange(va) {
      if (va.reject !== undefined || va.status === '0') {
        return '编辑'
      } else {
        return '查看'
      }
    },
    convert(value, dic) {
      if (!value) return ''
      if (!dic || !Array.isArray(dic)) return value
      value = value.toString()
      return (dic.find((v) => v.value === value) || { label: '' }).label
    },
    arrConvert(value, dic) {
      if (!value) return ''
      if (!dic || !Array.isArray(dic)) return value
      const vas = value.split(',')
      let strs = ''
      vas.forEach((item) => {
        strs = this.convert(item, dic) + ',' + strs
      })
      return strs
    },
    searchBarHandle(params) {
      if (params !== undefined) {
        if (params.reportStatus) {
          params.reportStatus = [params.reportStatus]
        } else {
          params.reportStatus = []
        }
      }
      this.searchParam = params
      const radioVa = storage.get('radioStatus')
      if (radioVa) {
        this.radioStatus = radioVa
      } else {
        this.radioStatus = statusType.all
      }
      this.changeRadio(this.radioStatus)
    },
    changeRadio(key) {
      storage.set('radioStatus', key)
      if (key === statusType.all) {
        this.patientStatusAllFlag = true
      } else {
        this.patientStatusAllFlag = false
      }
      if (key === statusType.filed) {
        this.reportFlag = true
      } else {
        this.reportFlag = false
      }
      if (key === statusType.examineReject || key === statusType.fileReject) {
        this.remarkFlag = true
      } else {
        this.remarkFlag = false
      }
      const param = {}
      if (key === statusType.all) {
        param.isDelete = '0'
      }
      if (key === statusType.filling) {
        param.isDelete = '0'
        param.status = '0'
      }
      if (key === statusType.examine) {
        param.isDelete = '0'
        param.status = '1'
      }
      if (key === statusType.examineReject) {
        param.isDelete = '0'
        param.reject = '1'
      }
      if (key === statusType.file) {
        param.isDelete = '0'
        param.status = '2'
      }
      if (key === statusType.fileReject) {
        param.isDelete = '0'
        param.reject = '2'
      }
      if (key === statusType.filed) {
        param.isDelete = '0'
        param.status = '3'
      }
      if (key === statusType.reported) {
        param.isDelete = '0'
        param.status = '3'
        param.reportStatus = ['2']
      }
      if (key === statusType.deleted) {
        param.isDelete = '1'
      }
      this.radioParam = { ...this.searchParam, ...param }
      this.clearFilter()
      this.fetch({ ...this.searchParam, ...param })
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
        current: val
      })
    },
    fetch(params = {}) {
      patientApi
        .queryPatientPage({
          current: 1,
          pageSize: 10,
          hospitalId: this.hospitalId,
          hospitalArea: this.curHospitalArea,
          ...params
        })
        .then((res) => {
          if (res.status === 200) {
            const pagination = { ...this.pagination }
            // Read total count from server
            pagination.total = res.result.total
            pagination.current = res.result.current
            pagination.pageSize = res.result.size
            this.patientData = res.result.records
            this.pagination = pagination
          }
        })
      // 获取全部数据 为了导出excel
      this.AllFetch()
    },
    AllFetch() {
      patientApi
        .queryPatientPage({
          current: 1,
          pageSize: 999,
          hospitalId: this.hospitalId,
          hospitalArea: this.curHospitalArea,
          ...this.radioParam
        })
        .then((res) => {
          if (res.status === 200) {
            this.exportData = res.result.records
          }
        })
    },
    rfTagShowModal(code) {
      this.$nextTick(() => {
        this.getRfTags()
      })
      this.patientInfo = code
      this.rfTagVisible = true
    },
    rfTagHideModal() {
      this.rfTagVisible = false
      // 绑定腕带完成，刷新列表数据
      this.searchBarHandle()
    },
    timelineShowModal(code) {
      this.patientInfo = code
      this.timelineVisible = true
    },
    addShowModal() {
      this.addVisible = true
    },
    addHideModal() {
      this.addVisible = false
    },
    createShowModal(val) {
      this.fileInfo = val
      this.addHideModal()
      this.createVisible = true
    },
    createHideModal() {
      this.createVisible = false
    },
    // 获取腕带信息
    getRfTags() {
      patientApi
        .getRfTags({
          hospitalId: this.hospitalId + '_' + this.curHospitalArea
        })
        .then((res) => {
          if (res.status === 200 && res.code === '0') {
            res.result.forEach((element) => {
              this.rfTags.push({
                label: `${element.tagName}(${element.tagId})`,
                value: element.tagName,
                code: element.tagId
              })
            })
          }
        })
    },
    updateIsDelete(registIds, deleteFlag, name) {
      var msg = ''
      if (!registIds.length) {
        msg = "请选择需要删除的数据"
      }
      if (name === '') {
        if (deleteFlag === '0') {
          msg = '确认恢复吗?'
        } else if (!registIds.length) {
          msg = "请选择需要删除的数据!"
        } else {
          msg = '确认删除吗?'
        }
      } else {
        msg =
          deleteFlag === '0'
            ? '确认恢复患者【' + name + '】吗?'
            : '确认删除患者【' + name + '】吗?'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (registIds.length){
            patientApi
            .updateIsDeleteStatusReportStatusBatch({
              registIdList: registIds,
              isDelete: deleteFlag
            })
            .then((res) => {
              if (res.status === 200 && res.code === '0') {
                this.$message.success('操作成功')
                this.handleCurrentChange(this.pagination.current)
              }
            })
          }
        })
        .catch(() => { })
    },
    updateStatus(registIds, statusFlag) {
      var msg =
        statusFlag === '0'
          ? '确定撤回吗？'
          : statusFlag === '1'
            ? '确定提交吗？'
            : statusFlag === '2'
              ? '确定通过审核吗？'
              : '确定归档吗？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          patientApi
            .updateIsDeleteStatusReportStatusBatch({
              registIdList: registIds,
              status: statusFlag
            })
            .then((res) => {
              if (res.status === 200 && res.code === '0') {
                this.$message.success('操作成功')
                this.changeRadio(this.radioStatus)
              } else {
                this.$message.error('操作失败！')
              }
            })
        })
        .catch(() => { })
    },
    updateReportStatus(registIds, reportFlag) {
      var msg = reportFlag === '1' ? '确定上报吗？' : '确定取消上报吗？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          patientApi
            .updateIsDeleteStatusReportStatusBatch({
              registIdList: registIds,
              reportStatus: reportFlag
            })
            .then((res) => {
              if (res.status === 200 && res.code === '0') {
                this.$message.success('操作成功')
                this.changeRadio(this.radioStatus)
              } else {
                this.$message.error('操作失败！')
              }
            })
        })
        .catch(() => { })
    },
    deletePatient(obj) {
      var msg = '确定彻底删除患者【' + obj.name + '】吗？'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          patientApi
            .deletePatient([obj.registId])
            .then((res) => {
              if (res.status === 200 && res.code === '0') {
                this.$message.success('操作成功')
                this.handleCurrentChange(this.pagination.current)
              } else {
                this.$message.error(res.message)
              }
            })
            .catch((error) => {
              if (error.response) {
                this.$message.error(error.response.data.message)
              }
            })
        })
        .catch(() => { })
    },
    handleSelectionChange(val) {
      this.registIds = []
      this.multipleSelection = val
      this.multipleSelection.forEach((element) => {
        this.registIds.push(element.registId)
      })
    },
    // 编辑页面跳转
    goUpdateView(code) {
      const { href } = this.$router.resolve({
        name: 'Edit',
        query: {
          hospitalArea: this.curHospitalArea,
          registId: code.registId,
          rfTags: JSON.stringify(this.rfTags)
        }
      })
      window.open(href, '_blank')
    },
    patientStatusAllFilter(value, row) {
      return this.showPatientStatus(row) === value
    },
    filterReport(value, row) {
      return row.reportStatus === value
    },
    clearFilter() {
      this.$refs.patientTable.clearFilter()
    },
    showPatientStatus(row) {
      if (row.isDelete === '0') {
        if (row.status === '0') {
          if (row.reject === '1') {
            return '审核拒绝'
          } else if (row.reject === '2') {
            return '存档拒绝'
          } else {
            return '填报中'
          }
        } else if (row.status === '1') {
          return '待审核'
        } else if (row.status === '2') {
          return '待存档'
        } else if (row.status === '3') {
          return '已存档'
        }
      }
    },
    getReportStatusText(status) {
      var text = ''
      switch (status) {
        case reportType.noReport:
          text = '未上报'
          break
        case reportType.report:
          text = '待上报'
          break
        case reportType.reportSuccess:
          text = '上报成功'
          break
        case reportType.reportFail:
          text = '上报失败'
          break
        default:
          break
      }
      return text
    }
  }
}
</script>

<style lang="sass" scoped>
::v-deep
 .centered-modal
    top: 40%
    transform: translateY(-40%)

::v-deep
  .el-tooltip__popper
    width: 100px

.bth
  margin-right: 10px

.pagination
  margin: 5px 10px 0 0
  float: right

.function-bar
  float: right
  margin-bottom: 0
  display: flex
</style>
