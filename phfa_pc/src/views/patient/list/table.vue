<template>
  <div>
    <el-table
      :data="tableData.records"
      style="width: 100%"
      stripe
      :header-cell-style="{ 'background-color': '#eef1f6' }"
    >
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="gender" label="性别" width="60" />
      <el-table-column prop="age" label="年龄" width="60" />
      <el-table-column prop="chiefComplaint" label="主诉" width="180" />
      <el-table-column prop="address" label="接诊地址" width="180" />
      <el-table-column prop="emergencyCar" label="急救车" width="180" />
      <el-table-column prop="doctorName" label="出车医生" width="100" />
      <el-table-column prop="callTime" label="呼叫时间" width="140">
        <template slot-scope="scope">
          {{ scope.row.callTime ? $moment(scope.row.callTime).format('YYYY-MM-DD HH:mm') : '' }}
        </template>
      </el-table-column>
      <el-table-column prop="reasonType" label="呼叫原因" width="180" />
      <el-table-column prop="diagnosis" label="初步诊断" />
      <el-table-column
        prop="medicalRecordStatus"
        label="病历状态"
        width="100"
      />
      <el-table-column prop="missionStatus" label="任务状态" width="100" />
      <el-table-column
        fixed="right"
        label="操作"
        min-width="220"
        width="240"
        align="center"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="left"
            >
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="handleEdit(scope.$index, scope.row)"
              />
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="任务回放"
              placement="right"
            >
              <el-button
                size="mini"
                style="margin-right: 10px"
                type="primary"
                icon="el-icon-video-camera"
                @click="handleReplay(scope.row)"
              />
            </el-tooltip>
          </el-button-group>
          <!-- <el-popconfirm
            title="确定删除吗？"
            @confirm="handleDelete(scope.$index, scope.row)"
          >
            <el-button
              slot="reference"
              size="mini"
              type="warning"
            >删除</el-button></el-popconfirm> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      background
      :current-page.sync="tableData.current"
      :page-size="tableData.size"
      :page-sizes="[10, 20, 30]"
      layout="prev, pager, next, jumper, sizes"
      :total="tableData.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <replay-modal v-model="replayVisible" :mission-id="curMissionId" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { dicConstant as dic } from '@/constant'
import ReplayModal from './replayModal'
import { mrmDelete } from '@/api/medicalRecord'

export default {
  name: 'Table',
  components: {
    ReplayModal
  },
  props: {
    tableData: {
      type: Object,
      default: () => ({
        current: 1,
        size: 10,
        total: 0,
        records: []
      })
    }
  },
  data() {
    return {
      dic,
      replayVisible: false,
      curMissionId: ''
      // dictionary: {
      //   genderDic: [],
      //   diagDic: [],
      //   comingTypeDic: []
      // }
    }
  },
  computed: {
    ...mapGetters(['dictionary']),
    pagi() {
      return {
        current: this.tableData.current,
        size: this.tableData.size,
        total: this.tableData.total
      }
    }
  },
  async mounted() {
    // const { _get, getDictionary } = this
    // const dic = await getDictionary([
    //   d.genderCode,
    //   d.diagnosisCode,
    //   d.comingCode
    // ])
    // this.dictionary.genderDic = _get(dic, d.genderCode)
    // this.dictionary.diagDic = _get(dic, d.diagnosisCode)
    // this.dictionary.comingTypeDic = _get(dic, d.comingCode)
  },
  methods: {
    handleSizeChange(s) {
      this.$emit('doSearch', { ...this.pagi, size: s })
    },
    handleCurrentChange(c) {
      this.$emit('doSearch', { ...this.pagi, current: c })
    },
    handleEdit(index, row) {
      const { missionId, patientId, recordId } = row
      const { href } = this.$router.resolve({
        name: 'Edit',
        query: { missionId, patientId, recordId }
      })
      window.open(href, '_blank')
    },
    async handleDelete(idx, row) {
      const res = await mrmDelete([row.recordId])
      if (res.code === '000000') {
        this.$message.success('删除成功!')
        this.$emit('doSearch')
      } else {
        this.$message.error('删除失败!')
      }
    },
    handleReplay(row) {
      this.replayVisible = true
      this.curMissionId = row.missionId
    }
  }
}
</script>

<style lang="sass" scoped>
.pagination
  margin: 5px 10px 0 0
  float: right
</style>
