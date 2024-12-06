<template>
  <el-container style="margin: 0 10px;">
    <el-header style="background-color: #f5f6fb;height:10%;padding-top: 22px;">
      <el-form :inline="true" :model="searchParam">
        <el-form-item label="院区">
          <el-select v-model="searchParam.hospitalArea" placeholder="院区" class="form-field"
            @change="changeHospitalArea">
            <el-option v-for="(item, index) in hospitalAreaList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="患者姓名">
          <el-input v-model="searchParam.name" placeholder="患者姓名" :maxlength="20" class="form-field" />
        </el-form-item>
        <el-form-item label="建档时间">
          <el-date-picker v-model="putOnRecodTime" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" @change="handlePutOnRecodTime" />
        </el-form-item>
        <el-form-item label="来院方式">
          <el-select v-model="searchParam.visitType" placeholder="来院方式" class="form-field">
            <el-option label="全部" value="" />
            <el-option v-for="(item, index) in VISIT_0001" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="病情判断">
          <el-select v-model="searchParam.diagnosis" placeholder="病情判断" class="form-field">
            <el-option label="全部" value="" />
            <el-option v-for="(item, index) in DIAGNOSIS_0001" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="病人分类">
          <el-select v-model="searchParam.patientType" placeholder="病人分类" class="form-field">
            <el-option label="全部" value="" />
            <el-option v-for="(item, index) in patientClassification" :key="index" :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="initPage(); queryByPage()">查询</el-button>
          <el-button @click="initSearchParam(); putOnRecodTime = []">重置</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-divider />
    <el-main style="padding: initial;">
      <div class="flex-c-b">
        <div>
          <el-radio-group v-model="searchParam.status" fill="rgb(75,96,253)" @input="initPage(); queryByPage()">
            <el-radio-button v-for="(item, index) in tableState" :key="index" :label="item.value">
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </div>
        <div>
          <el-button icon="el-icon-plus" type="primary" @click="isShowAdd = true" v-if="AUTH_ADD">
            新增病历
          </el-button>
          <el-button icon="el-icon-delete" type="danger" @click="clickDelete(multipleSelection)"
            v-if="searchParam.status === 1 && AUTH_DELETE">
            批量删除
          </el-button>
          <el-button icon="el-icon-download" type="success"
            @click="$api.download('/pc/patient/exportPatients', 'post', searchParam, '病历列表.xlsx')">导出
          </el-button>
        </div>
      </div>
      <el-table :data="list" stripe style="width: 100%" @selection-change="handleSelectionChange"
        :header-cell-style="{ 'background-color': 'rgb(238, 241, 246)' }">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="createTimestamp" label="建档时间" width="160" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="gender" label="性别">
          <template slot-scope="scope">
            {{ dicLabelByValue(scope.row.gender, 'GENDER_0001') }}
          </template>
        </el-table-column>
        <el-table-column prop="ageStr" label="年龄" />
        <el-table-column prop="visitType" label="来院方式">
          <template slot-scope="scope">
            {{ dicLabelByValue(scope.row.visitType, 'VISIT_0001') }}
          </template>
        </el-table-column>
        <el-table-column prop="rfTagName" label="腕带号" />
        <el-table-column prop="arriveHospitalTime" label="到院时间" width="160" />
        <el-table-column label="病情判断">
          <template slot-scope="scope">
            {{ scope.row.diagnosisName ? scope.row.diagnosisName : '未知' }}
          </template>
        </el-table-column>
        <el-table-column prop="issGrade" label="ISS-AIS评分" />
        <el-table-column prop="patientType" label="病人分类" />
        <el-table-column v-if="[7, 8].includes(searchParam.status)" prop="rejectReason" label="驳回原因"
          show-overflow-tooltip width="160" />
        <el-table-column v-if="searchParam.status === 0" prop="statusName" label="病历状态" />
        <el-table-column fixed="right" label="操作" width="320">
          <template slot-scope="scope">
            <el-button v-if="['1', '2', '3', '4', '5'].includes(scope.row.status)" size="mini"
              @click="toEdit(scope.row.registId)">
              {{ scope.row.status === '1' ? '编辑' : '查看' }}
            </el-button>
            <el-button v-if="['1', '2', '3', '4', '5'].includes(scope.row.status)" size="mini"
              @click="selectedRow = scope.row; isShowTimeAxis = true">
              时间轴
            </el-button>
            <el-button size="mini" type="danger" plain @click="clickDelete([scope.row])"
              v-if="['1'].includes(scope.row.status) && AUTH_DELETE">
              删除
            </el-button>
            <span v-if="['1'].includes(scope.row.status)" style="margin-left: 10px;">
              <el-button plain size="mini" type="danger" v-if="scope.row.rfTagId" @click="unbindWrist(scope.row)">
                解绑腕带
              </el-button>
              <el-button size="mini" @click="selectedRow = scope.row; isShowBindWristStrap = true" v-else>
                绑定腕带
              </el-button>
            </span>
            <el-button size="mini" v-if="['2'].includes(scope.row.status) && AUTH_AUDIT"
              @click="clickOperation('审核', scope.row, 2)">
              审核
            </el-button>
            <el-button size="mini" v-if="['3'].includes(scope.row.status) && AUTH_ARCHIVE"
              @click="clickOperation('存档', scope.row, 4)">
              存档
            </el-button>
            <el-button size="mini" v-if="['4'].includes(scope.row.status) && AUTH_REPORT"
              @click="clickOperation('上报', scope.row, 6)">
              上报
            </el-button>
            <el-button size="mini" v-if="['6'].includes(scope.row.status)" @click="clickRestore(scope.row)">
              恢复
            </el-button>
            <el-button size="mini" v-if="['6'].includes(scope.row.status) && AUTH_DELETE"
              @click="clickCompletelyDelete(scope.row)">
              彻底删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total,  prev, pager, next, jumper" background :page-size="searchParam.pageSize"
        :current-page="searchParam.pageNo" :total="searchParam.total" style="float: right;"
        @current-change="handleCurrentChange" />
    </el-main>
    <Add v-model="isShowAdd" @close="isShowAdd = false; queryByPage()" />
    <TimeAxis v-model="isShowTimeAxis" :dto="selectedRow" @close="isShowTimeAxis = false" />
    <BindWristStrap v-model="isShowBindWristStrap" @close="isShowBindWristStrap = false; queryByPage()" />
  </el-container>

</template>
<script>
import { AuthorityMixin, DictionariesMixin } from '@/mixins/index'
export default {
  components: {
    Add: () => import('./components/Add.vue'),
    TimeAxis: () => import('./components/TimeAxis.vue'),
    BindWristStrap: () => import('./components/BindWristStrap.vue')
  },
  mixins: [AuthorityMixin, DictionariesMixin],
  provide() {
    return {
      registIdFun: () => this.selectedRow.registId,
      hospitalAreaFun: () => this.searchParam.hospitalArea,
      nameFun: () => this.selectedRow.name,
      tagInfoFun: () => { return {} }
    }
  },
  data() {
    return {
      isShowAdd: false, // 是否显示新增
      isShowTimeAxis: false, // 是否显示时间轴
      isShowBindWristStrap: false, // 是否显示绑定腕带
      selectedRow: {}, // 选中行
      tableState: [
        { label: '全部', value: 0 },
        { label: '填报中', value: 1 },
        { label: '待审核', value: 2 },
        { label: '审核拒绝', value: 7 },
        { label: '待存档', value: 3 },
        { label: '存档拒绝', value: 8 },
        { label: '已存档', value: 4 },
        // { label: '已上报', value: 5 },
        { label: '已删除', value: 6 }
      ],
      patientClassification: [ // 病人分类
        { label: '创伤', value: '1' },
        { label: '严重创伤', value: '2' },
        { label: '未知', value: '3' }
      ],
      multipleSelection: [], // checkBox选中的数据
      putOnRecodTime: [], // 建档时间
      searchParam: {}, // 查询参数
      list: [] // 列表数据
    }
  },
  mounted() {
    this.initSearchParam()
    this.queryByPage()
  },
  methods: {
    unbindWrist(val) {
      // 解绑腕带
      this.$confirm(`确定要给患者【${val.name}】解绑腕带【${val.rfTagName}】?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.unBindRfTagId({
          registId: val.registId,
          rfTagId: val.rfTagId,
          type: '2'
        }).then(res => {
          if (res.code === '000000') {
            this.$message({
              type: 'success',
              message: '解绑腕带成功'
            })
            this.initPage()
            this.queryByPage()
          }
        })
      })
    },
    changeHospitalArea(val) {
      // 修改院区
      sessionStorage.setItem('hospitalArea', val)
      this.initPage()
      this.queryByPage()
    },
    clickOperation(mes, row, type) {
      const message = '确认' + mes + '患者【' + row.name + '】吗 ?'
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.submitApprove({
          registId: row.registId,
          opType: type
        }).then(res => {
          if (res.code === '000000') {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.queryByPage()
          }
        })
      }).catch(() => { })
    },
    // 彻底删除
    clickCompletelyDelete(val) {
      const message = '确认彻底删除患者【' + val.name + '】吗 ?'
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.batchForeverDelete([val.registId]).then(res => {
          if (res.code === '000000') {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.queryByPage()
          }
        })
      }).catch(() => { })
    },
    // 恢复
    clickRestore(val) {
      const message = '确认恢复患者【' + val.name + '】吗 ?'
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.batchRecoverDelete([val.registId]).then(res => {
          if (res.code === '000000') {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.queryByPage()
          }
        })
      }).catch(() => { })
    },
    // 删除
    clickDelete(val) {
      if (val.length < 1) {
        return
      }
      let param = val
      let message = '确认删除吗?'
      if (val.length === 1) {
        const obj = val[0]
        message = '确认删除患者【' + obj.name + '】吗 ?'
        param = [obj.registId]
      }
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.deleteByBatch(param).then(res => {
          if (res.code === '000000') {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.queryByPage()
          }
        })
      }).catch(() => { })
    },
    // 跳转编辑页面
    toEdit(id) {
      const { href } = this.$router.resolve({
        name: 'Edit',
        query: { registId: id }
      })
      window.open(href, '_blank')
    },
    // 处理多选复选框
    handleSelectionChange(val) {
      this.multipleSelection = val.map(dto => dto.registId)
    },
    // 处理建档时间
    handlePutOnRecodTime() {
      if (this.putOnRecodTime && this.putOnRecodTime.length > 0) {
        this.searchParam.startDate = this.$moment(this.putOnRecodTime[0]).format(this.DATE_TIME_FORMAT.DATE_MINUTE)
        this.searchParam.endDate = this.$moment(this.putOnRecodTime[1]).endOf('day').format(this.DATE_TIME_FORMAT.DATE_MINUTE)
      } else {
        delete this.searchParam.startDate
        delete this.searchParam.endDate
      }
    },
    // 处理当前页
    handleCurrentChange(val) {
      this.searchParam.pageNo = val
      this.queryByPage()
    },
    // 分页查询
    queryByPage() {
      this.$api.queryByPage(this.searchParam).then(res => {
        if (res.code === '000000') {
          this.list = res.body.records
          // 分页数据
          this.searchParam.total = res.body.total
          this.searchParam.pageNo = res.body.current
          this.searchParam.pageSize = res.body.size
        }
      })
    },
    // 初始化分页信息
    initPage() {
      this.searchParam.total = 0
      this.searchParam.pageNo = 1
      this.searchParam.pageSize = 10
    },
    // 初始化查询参数
    initSearchParam() {
      this.searchParam = {
        visitType: '', // 来院方式
        diagnosis: '', // 病情判断
        patientType: '', // 病人分类
        status: 1,
        hospitalId: this.hospitalId,
        hospitalArea: this.hospitalAreaList[0].value, // 院区
        total: 0, // 总数
        pageNo: 1, // 页码
        pageSize: 10 // 页数
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.form-field {
  width: 11rem;
}
</style>
