<template>
  <div style="margin: 0 10px">
    <div class="header">
      <!-- 查询部分 searchbar -->
      <searchbar @doSearch="doSearch" />
    </div>
    <!-- <el-divider /> -->
    <div class="middle">
      <!-- <el-radio-group
        v-model="searchParam.status"
        class="status-bar"
        @change="doSearch"
      >
        <el-radio-button label="">全部</el-radio-button>
        <el-radio-button label="1">填报中</el-radio-button>
        <el-radio-button label="2">已提交</el-radio-button>
        <el-radio-button label="3">已归档</el-radio-button>
        <el-radio-button label="4">已上报</el-radio-button>
        <el-radio-button label="9">已删除</el-radio-button>
      </el-radio-group> -->
      <div class="function-bar">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addPatient"
        >新增病历</el-button>
        <!-- <el-button type="warning" icon="el-icon-delete">删除</el-button> -->
      </div>
    </div>

    <div>
      <!-- 列表部分 table -->
      <patienttable :table-data="tableData" @doSearch="doSearch" />
    </div>

    <!-- 新增患者弹出层 -->
    <addpatient
      v-if="addPatientListShow"
      :visible.sync="addPatientListShow"
      @refresh="doSearch"
    />

    <!-- 新增患者基本信息 -->
    <!-- <el-dialog
      :key="dialogKey"
      title="患者基本信息"
      :visible.sync="addPatientInfoShow"
    >
      <preadd ref="preadd" :source="basicInfo" @cancel="extractCancel" />
    </el-dialog> -->
  </div>
</template>

<script>
import searchbar from './searchbar'
import patienttable from './table'
import addpatient from '../addPatient'
// import preadd from './preAdd'
import { mapGetters } from 'vuex'
import { mrmPageList } from '@/api/medicalRecord'
export default {
  name: 'ListIndex',
  components: {
    searchbar,
    patienttable,
    addpatient
    // preadd
  },
  data() {
    return {
      searchParam: {},
      tableData: {
        current: 1,
        size: 10,
        total: 0,
        records: []
      },
      // dialogKey: 0,
      addPatientListShow: false,
      // addPatientInfoShow: false,
      basicInfo: {}
    }
  },
  mounted() {
    this.doSearch()
  },
  methods: {
    async doSearch(p) {
      const pagi = {
        current: this.tableData.current,
        size: this.tableData.size,
        total: this.tableData.total
      }
      const sp = { ...pagi, ...this.searchParam, ...p }
      const { body } = (await mrmPageList(sp)) || {}
      this.tableData = body
    },
    addPatient() {
      this.addPatientListShow = true
    }
    // doExtract(patientInfo) {
    //   this.basicInfo = patientInfo
    //   this.addPatientListShow = false
    //   this.dialogKey = Math.random()
    //   this.addPatientInfoShow = true
    // },
    // extractCancel() {
    //   this.addPatientInfoShow = false
    // }
  }
}
</script>

<style lang="sass" scoped>
.header
  padding: 20px 5px 0 5px
  background-color: #f0f2f5

.middle
  padding-top: 20px
  .function-bar
    float: right
    margin-bottom: 3px
</style>
