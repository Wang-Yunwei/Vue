<template>
  <div style="margin: 0 10px; width: 100%">
    <div class="header">
      <!-- 查询部分 searchbar -->
      <searchbar @doSearch="doSearch" />
    </div>
    <el-divider />
    <div class="middle">
      <el-radio-group
        v-model="status"
        class="status-bar"
        @change="doSearch({})"
      >
        <el-radio-button label="">全部</el-radio-button>
        <el-radio-button label="10">填报中</el-radio-button>
        <el-radio-button label="21">待审核</el-radio-button>
        <el-radio-button label="12">审核拒绝</el-radio-button>
        <el-radio-button label="31">待存档</el-radio-button>
        <el-radio-button label="13">存档拒绝</el-radio-button>
        <el-radio-button label="41">已存档</el-radio-button>
        <el-radio-button label="0">已删除</el-radio-button>
      </el-radio-group>
      <div class="function-bar">
        <el-button
          v-permission="['mr-add']"
          type="primary"
          icon="el-icon-plus"
          @click="addPatient"
        >新增病历</el-button>
        <el-button
          v-show="searchParam.status === '10'"
          v-permission="['mr-delete']"
          type="danger"
          icon="el-icon-delete"
          @click="batchDelete(registIds, '1')"
        >批量删除</el-button>
        <download-excel
          v-if="!searchParam.isDeleted"
          :data="exportData"
          :fields="json_fields"
          header="病例列表"
          name="病例列表.xls"
        >
          <el-button
            icon="el-icon-download"
            style="margin-left: 10px"
            type="success"
          >导出</el-button>
        </download-excel>
      </div>
    </div>

    <div>
      <!-- 列表部分 table -->
      <patienttable
        ref="table"
        :table-data="tableData"
        :data-count="dataCount"
        :hide-report="searchParam.isDeleted"
        :show-reject-col="status === '12' || status === '13'"
        @doSearch="doSearch"
        @doDelete="doDelete"
        @doRecover="doRecover"
        @deleteCompletely="deleteCompletely"
        @showTimeline="showTimeline"
        @bindingRfid="bindingRfid"
        @handleSelectionChange="handleSelectionChange"
        @passAudit="pass"
        @archive="archive"
      />
    </div>

    <!-- 新增患者弹出层 -->
    <addpatient :visible.sync="addPatientListShow" @extract="doExtract" />

    <!-- 新增患者基本信息 -->
    <el-dialog title="基本信息" :visible.sync="addPatientInfoShow">
      <preadd
        ref="preadd"
        :key="addKey"
        :source="basicInfo"
        @cancel="extractCancel"
      />
    </el-dialog>

    <el-dialog
      title=""
      :visible.sync="timelineShowed"
      width="75%"
      top="unset"
      custom-class="centered-modal"
    >
      <timeline :key="selectedRegistId" :regist-id="selectedRegistId" />
    </el-dialog>

    <el-dialog title="腕带绑定" :visible.sync="bindingRfidShowed" width="400px">
      <rf-tag
        :patient="patientInfo"
        :rf-tags="rfTags"
        @cancelForm="hideBindingRfid"
      />
    </el-dialog>
  </div>
</template>

<script>
import searchbar from './searchbar'
import patienttable from './table'
import addpatient from '../addPatient'
import preadd from './preAdd'
import { mapGetters } from 'vuex'
import {
  queryPatientList,
  deletePatient,
  deletePatientInBatches,
  getRfTags,
  recoverPatient,
  completelyDeletePatient
} from '@/api/patient/list'
import timeline from './timeline.vue'
import rfTag from './rfTag'
import { passAudit, archive } from '@/api/patient/edit'
export default {
  name: 'ListIndex',
  components: {
    searchbar,
    patienttable,
    addpatient,
    preadd,
    timeline,
    rfTag
  },
  data() {
    return {
      searchParam: {
        name: '',
        hospitalId: '',
        hospitalArea: '',
        diagnosis: [],
        comeType: [],
        ambulanceDepartment: [],
        leaveDiagnosis: [],
        outcomeCode: [],
        isGiveUp: '',
        reportStatus: [],
        pageIndex: 1,
        pageSize: 10,
        status: '10',
        realStatus: ['10'],
        isDeleted: false
      },
      tableData: [],
      dataCount: 0,

      addKey: 0,
      addPatientListShow: false,
      addPatientInfoShow: false,
      basicInfo: {},

      selectedRegistId: '',
      timelineShowed: false,

      rfTags: [],

      exportData: [],
      json_fields: {
        建档时间: 'createTime',
        姓名: 'name',
        年龄: 'age',
        性别: {
          field: 'gender',
          callback: (value) => {
            return this.convert(value, this.dictionary.genderDict)
          }
        },
        腕带号: {
          field: 'rfTagId',
          callback: (value) => {
            return this.convert(value, this.rfTags)
          }
        },
        住院号: 'admissionNo',
        诊断: {
          field: 'diagnosis',
          callback: (value) => {
            return this.convert(value, this.dictionary.diagnosisDict)
          }
        },
        来院方式: {
          field: 'comeType',
          callback: (value) => {
            return this.convert(value, this.dictionary.comingDict)
          }
        },
        建档人员: 'createName'
      },

      registIds: [],
      bindingRfidShowed: false,
      patientInfo: {},
      deletedStatus: false
    }
  },
  computed: {
    ...mapGetters([
      'dictionary',
      'hospitalId',
      'configure',
      'currentHospitalArea',
      'user'
    ]),
    status: {
      get() {
        if (this.searchParam.isDeleted) return '0'
        if (this.searchParam.realStatus.length > 1) return ''
        return this.searchParam.status
      },
      set(val) {
        if (val === '0') {
          this.searchParam.status = ''
          this.searchParam.realStatus = ['10', '12', '13', '21', '31', '41']
          this.searchParam.isDeleted = true
        } else if (val === '') {
          this.searchParam.status = ''
          this.searchParam.realStatus = ['10', '12', '13', '21', '31', '41']
          this.searchParam.isDeleted = false
        } else {
          this.searchParam.status = val
          this.searchParam.realStatus = [val]
          this.searchParam.isDeleted = false
        }
      }
    }
  },
  mounted() {
    // this.doSearch()
    this.getRfTags()
  },
  methods: {
    convert(value, dic) {
      if (!value) return ''
      if (!dic || !Array.isArray(dic)) return value
      value = value.toString()
      return (dic.find((v) => v.value === value) || { label: '' }).label
    },
    async doSearch(p) {
      let tempP = Object.assign({}, p)
      if (p && !('pageIndex' in p)) {
        tempP = Object.assign(tempP, { pageIndex: 1 })
        this.$refs.table?.resetPage()
      }
      const sp = Object.assign(this.searchParam, tempP, {
        hospitalId: this.hospitalId
      })
      const { result } = (await queryPatientList({
        ...sp,
        ...{ status: this.searchParam.realStatus }
      })) || { records: [] }
      this.tableData = result.records
      this.dataCount = result.total

      // 获取全部数据 为了导出excel
      this.AllFetch(p)
    },
    async AllFetch(p) {
      const tempP = Object.assign({}, p, { pageIndex: 1, pageSize: 999 })
      const sp = Object.assign({}, this.searchParam, tempP, {
        hospitalId: this.hospitalId
      })
      const { result } = (await queryPatientList(sp)) || { records: [] }
      this.exportData = result.records
    },
    addPatient() {
      this.addPatientListShow = true
    },
    doExtract(patientInfo) {
      this.basicInfo = patientInfo
      this.addPatientListShow = false
      this.addKey = Math.random()
      this.addPatientInfoShow = true
    },
    extractCancel() {
      this.addPatientInfoShow = false
    },
    doDelete(selectedPatient) {
      this.$confirm(`确定要删除患者【${selectedPatient.name}】`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          try {
            await deletePatient({ registId: selectedPatient.id })
            this.$message({
              type: 'success',
              message: `患者【${selectedPatient.name}】已删除`
            })
            this.doSearch()
          } catch (err) {
            this.$message.error(`患者【${selectedPatient.name}】删除失败`)
          }
        })
        .catch(() => {})
    },
    showTimeline(id) {
      this.timelineShowed = true
      this.selectedRegistId = id
    },
    // 获取腕带信息
    getRfTags() {
      getRfTags({
        hospitalId: this.hospitalId + '_' + this.currentHospitalArea
      }).then((res) => {
        if (res.status === 200 && res.code === '0') {
          res.result.forEach((element) => {
            this.rfTags.push({
              label: `${element.tagName}(${element.tagId})`,
              value: element.tagName,
              code: element.tagId
            })
          })

          this.$store.commit('common/SET_RF_TAGS', this.rfTags)
        }
      })
    },
    handleSelectionChange(val) {
      this.registIds = val
    },
    batchDelete() {
      this.$confirm(`确认删除吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          try {
            await deletePatientInBatches({ registIds: this.registIds })
            this.$message({
              type: 'success',
              message: `删除成功`
            })
            this.doSearch()
          } catch (err) {
            this.$message.error(`删除失败`)
          }
        })
        .catch(() => {})
    },
    bindingRfid(patientInfo) {
      this.patientInfo = patientInfo
      this.bindingRfidShowed = true
    },
    hideBindingRfid() {
      this.bindingRfidShowed = false
      this.doSearch()
    },
    pass(selectPatient) {
      this.$confirm('确定通过审核吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await passAudit({
          registId: selectPatient.id,
          userId: this.user.username
        })

        if (res.status === 200) {
          this.$message({ type: 'success', message: '通过审核成功' })
          this.doSearch()
        } else {
          this.$message({ type: 'warning', message: res.message })
        }
      })
    },
    archive(selectPatient) {
      this.$confirm('确定归档吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await archive({
          registId: selectPatient.id,
          userId: this.user.username
        })

        if (res.status === 200) {
          this.$message({ type: 'success', message: '归档成功' })
          this.doSearch()
        } else {
          this.$message({ type: 'warning', message: res.message })
        }
      })
    },
    doRecover(selectedPatient) {
      this.$confirm(`确定要恢复患者【${selectedPatient.name}】吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          try {
            await recoverPatient({ registId: selectedPatient.id })
            this.$message({
              type: 'success',
              message: `患者【${selectedPatient.name}】已恢复`
            })
            this.doSearch()
          } catch (err) {
            this.$message.error(`患者【${selectedPatient.name}】恢复失败`)
          }
        })
        .catch(() => {})
    },
    deleteCompletely(selectedPatient) {
      this.$confirm(
        `确定要彻底删除患者【${selectedPatient.name}】吗?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async() => {
          try {
            await completelyDeletePatient({ registId: selectedPatient.id })
            this.$message({
              type: 'success',
              message: `患者【${selectedPatient.name}】已彻底删除`
            })
            this.doSearch()
          } catch (err) {
            this.$message.error(`患者【${selectedPatient.name}】彻底删除失败`)
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  padding: 20px 5px 0 5px;
  background-color: #f5f6fb;
}

.middle {
  .function-bar {
    float: right;
    margin-bottom: 3px;
    display: flex;
  }
}
::v-deep .centered-modal {
  top: 40%;
  transform: translateY(-40%);
}
</style>
