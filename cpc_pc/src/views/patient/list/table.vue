<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      stripe
      :header-cell-style="{ 'background-color': '#eef1f6' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column width="40">
        <template v-if="checkNeedShowIcon(scope.row) > 0" slot-scope="scope">
          <el-image
            style="width: 20px; height: 20px"
            :src="getIconPath(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="建档时间" width="160" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column label="性别" width="60">
        <template slot-scope="scope">
          {{ scope.row.gender | convert(dictionary.genderDict) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="age"
        label="年龄"
        width="80"
        :formatter="ageFormatter"
      />
      <el-table-column label="来院方式" width="200">
        <template slot-scope="scope">
          {{ scope.row.comeType | convert(dictionary.comingDict) }}
        </template>
      </el-table-column>
      <el-table-column prop="rfTagId" label="腕带号" width="100" />
      <el-table-column prop="admissionNo" label="住院号" width="120" />
      <el-table-column v-if="!hideReport" label="首次医疗接触时间" width="140">
        <template slot-scope="scope">
          {{ scope.row.fmcTime | timeFormate }}
        </template>
      </el-table-column>
      <el-table-column label="初步诊断" width="200">
        <template slot-scope="scope">
          {{ scope.row.diagnosis | convert(dictionary.diagnosisDict) }}
        </template>
      </el-table-column>
      <el-table-column v-if="!hideReport" label="上报状态" width="100">
        <template slot-scope="scope">
          {{ scope.row.isReport | reprotConvert(reportStatusDict) }}
          <el-popover
            v-if="scope.row.isReport === '2'"
            title="错误内容"
            style="max-height: 50vh; overflow-y: auto"
            placement="right"
            trigger="click"
          >
            <ul class="error-msg-list" style="overflow: auto">
              <li
                v-for="(i, index) in getErrorMsgList(
                  scope.row.reportErrorMessage
                )"
                :key="i + index"
                class="error-msg-item"
              >
                <span>{{ index + 1 }}、</span>{{ i }}
              </li>
            </ul>
            <i slot="reference" class="el-icon-warning" style="color: red" />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column v-if="!hideReport" label="上报时间" width="140">
        <template slot-scope="scope">
          {{ scope.row.reportTime | timeFormate }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="showRejectCol"
        prop="comments"
        label="驳回原因"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column fixed="right" label="操作" min-width="220">
        <template slot-scope="scope">
          <span
            v-show="
              (scope.row.status === '10' ||
                scope.row.status === '12' ||
                scope.row.status === '13') &&
                scope.row.isDeleted !== '1'
            "
          >
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              @click="timeline(scope.$index, scope.row)"
            >时间轴</el-button>
            <el-button
              v-permission="['mr-delete']"
              size="mini"
              plain
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
            <el-button
              v-if="scope.row.status === '10' && !scope.row.rfTagId"
              size="mini"
              @click="bindingRfid(scope.$index, scope.row)"
            >绑定腕带</el-button>
          </span>
          <span
            v-if="
              (scope.row.status === '21' ||
                scope.row.status === '31' ||
                scope.row.status === '41') &&
                scope.row.isDeleted !== '1'
            "
          >
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >查看</el-button>
            <el-button
              size="mini"
              @click="timeline(scope.$index, scope.row)"
            >时间轴</el-button>
            <span
              v-show="scope.row.status === '21' && scope.row.isLock!=='1'"
              v-permission="['mr-audit']"
              style="margin-left: 12px"
            >
              <el-button
                size="mini"
                @click="handlePassAudit(scope.$index, scope.row)"
              >审核</el-button>
            </span>
            <span
              v-show="scope.row.status === '31' && scope.row.isLock!=='1'"
              v-permission="['mr-archive']"
              style="margin-left: 12px"
            >
              <el-button
                size="mini"
                @click="handleArchive(scope.$index, scope.row)"
              >存档</el-button>
            </span>
          </span>
          <span v-if="scope.row.isDeleted === '1'">
            <el-button
              size="mini"
              @click="handleRecover(scope.$index, scope.row)"
            >恢复</el-button>
            <el-button
              v-permission="['mr-delete']"
              size="mini"
              plain
              type="danger"
              @click="deleteCompletely(scope.$index, scope.row)"
            >彻底删除</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      background
      :current-page.sync="page"
      :page-size="rows"
      layout="total, prev, pager, next, jumper"
      :total="dataCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <div v-for="(item, index) in iconDesc" :key="index" class="iconDiv">
      <el-image
        style="width: 20px; height: 20px; margin-right: 6px"
        :src="require('@/assets/images/' + item.name)"
      />
      {{ item.desc }}
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
  name: 'Table',
  filters: {
    reprotConvert: function(value, dic) {
      if (!value) return '待上报'
      if (!dic || !Array.isArray(dic)) return value
      value = value.toString()
      return (dic.find((v) => v.value === value) || { label: '' }).label
    },
    timeFormate(val) {
      if (!moment(val).isValid()) return ''
      else return moment(val).format('YYYY-MM-DD HH:mm')
    }
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    dataCount: {
      type: Number,
      default: 0
    },
    showRejectCol: {
      type: Boolean,
      default: false
    },
    hideReport: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      page: 1,
      rows: 10,
      multipleSelection: [],
      reportStatusDict: [
        { label: '待上报', value: '0' },
        { label: '上报成功', value: '1' },
        { label: '上报失败', value: '2' }
      ],
      iconDesc: [
        {
          name: '106.png',
          desc: '表示首次医疗接触时间即将超过14天，请及时上报'
        },
        {
          name: '105.png',
          desc: '表示首次医疗接触时间超过14天，不可上报'
        },
        {
          name: '108.png',
          desc: '表示病例即将超过60天存档期限，请及时存档'
        },
        {
          name: '122.png',
          desc: '表示病例超过60天存档期限，不可修改'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['dictionary'])
  },
  methods: {
    getErrorMsgList(msg) {
      if (!msg) return []
      return msg.split(';').filter((m) => m.trim().length > 0)
    },
    resetPage() {
      this.page = 1
      this.$forceUpdate()
    },
    handleSizeChange() {
      this.$emit('doSearch', { pageSize: this.rows })
    },
    handleCurrentChange() {
      this.$emit('doSearch', { pageIndex: this.page })
    },
    handleEdit(index, row) {
      const { href } = this.$router.resolve({
        name: 'Edit',
        query: {
          id: row.id,
          isLock: row.isLock,
          noticeTag: this.checkNeedShowIcon(row)
        }
      })
      window.open(href, '_blank')
    },
    handleDelete(index, row) {
      this.$emit('doDelete', row)
    },
    timeline(index, row) {
      this.$emit('showTimeline', row.id)
    },
    ageFormatter(row, column) {
      if (row.age) {
        return `${row.age} 岁`
      }
      return row.age
    },
    handleSelectionChange(val) {
      const ids = []
      this.multipleSelection = val
      this.multipleSelection.forEach((element) => {
        ids.push(element.id)
      })
      this.$emit('handleSelectionChange', ids)
    },
    bindingRfid(idx, selectedPatient) {
      this.$emit('bindingRfid', selectedPatient)
    },
    handlePassAudit(idx, selectedPatient) {
      this.$emit('passAudit', selectedPatient)
    },
    handleArchive(idx, selectedPatient) {
      this.$emit('archive', selectedPatient)
    },
    handleRecover(idx, selectedPatient) {
      this.$emit('doRecover', selectedPatient)
    },
    deleteCompletely(idx, selectedPatient) {
      this.$emit('deleteCompletely', selectedPatient)
    },
    checkNeedShowIcon(row) {
      const item = row
      const end = moment(new Date()).format('YYYY-MM-DD')
      const start = moment(item.fmcTime).format('YYYY-MM-DD')
      const days = moment(end).diff(start, 'days')
      // 1.即将超期建档：当前时间-首次医疗接触时间范围在【7，14】之间
      // 且首次成功上报时间为空的病历
      if (days >= 7 && days <= 14 && !item.firstReportTime) {
        return 1
      }

      // 2.超期未建档：(当前时间-首次医疗接触时间)大于14天且首次成功上报时间为空的病历
      if (days > 14 && !item.firstReportTime) {
        return 2
      }

      // 3.即将超期归档：当前时间-首次医疗接触时间【50，60)天范围内
      // 且首次成功上报时间不为空的病历
      if (
        days >= 50 &&
        days < 60 &&
        item.firstReportTime &&
        item.status !== '41'
      ) {
        return 3
      }

      // 4.超期未归档：当前时间-首次医疗接触时间大于等于60天范围
      // 且首次成功上报时间不为空的病历
      if (days >= 60 && item.firstReportTime && item.status !== '41') {
        return 4
      }

      return 0
    },
    getIconPath(row) {
      let iconName = ''
      var flag = this.checkNeedShowIcon(row)
      if (flag > 0) {
        iconName = this.iconDesc[flag - 1].name
      }

      return require('@/assets/images/' + iconName)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-tooltip__popper {
    width: 100px;
  }
}

.pagination {
  margin: 5px 10px 0 0;
  float: right;
}

.error-msg-list {
  margin: 10px;
  list-style-type: none;
  padding-inline-start: 0;
  max-height: 60vh !important;
  overflow-y: auto !important;

  .error-msg-item {
    background: #fef0f0;
    color: #f56c6c;
    font-size: 16px;
    height: 28px;
    line-height: 28px;
    margin: 5px 0;
    padding: 0 10px;
  }
}

.iconDiv {
  float: left;
  font-size: 14px;
  margin-right: 15px;
  display: flex;
  align-items: center;
  margin-top: 20px;
}
</style>
