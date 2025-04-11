<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-radio-group
          v-model="options.type"
          size="mini"
          @change="sourceFromChange"
        >
          <el-radio-button label="1">急救</el-radio-button>
          <el-radio-button label="2">急诊</el-radio-button>
          <el-radio-button label="3">门诊</el-radio-button>
          <el-radio-button label="4">住院</el-radio-button>
        </el-radio-group>
      </el-col>
      <el-col :span="6">
        <el-button
          type="primary"
          size="mini"
          @click="createEmptyModal()"
        >空白病例</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="4">
        <el-select
          v-model="options.hospitalArea"
          disabled
          placeholder="请选择院区"
          size="mini"
        >
          <el-option
            v-for="item in hospitalArea"
            :key="item.areaId"
            :label="item.areaName"
            :value="item.areaId"
          />
        </el-select>
      </el-col>
      <el-col :span="7">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          style="width: 100%"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
        />
      </el-col>
      <el-col :span="4">
        <el-input
          v-model="options.name"
          clearable
          placeholder="请输入姓名"
          size="mini"
        />
      </el-col>
      <el-col :span="5">
        <el-button
          size="mini"
          icon="el-icon-search"
          @click="QueryIF"
        >查询</el-button>
        <el-button
          v-if="submitFlag"
          size="mini"
          type="success"
          icon="el-icon-check"
          @click="createShowModal"
        >
          确定
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-table
        ref="gridTable"
        :data="gridData"
        height="300"
        size="mini"
        border
        highlight-current-row
        @current-change="handleSelectionChange"
      >
        <el-table-column width="50" align="center">
          <template slot-scope="scope">
            {{ calcIndex(scope) }}
          </template>
        </el-table-column>
        <el-table-column
          :property="showData.property"
          :label="showData.noCol"
        />
        <el-table-column property="name" label="患者姓名" />
        <el-table-column label="性别" width="80">
          <template slot-scope="scope">
            {{ getGenderText(scope.row.gender) }}
          </template>
        </el-table-column>
        <el-table-column property="age" label="年龄" />
        <el-table-column
          property="time"
          :label="showData.timeCol"
          width="200"
        />
      </el-table>
      <el-pagination
        :current-page="curPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next, total, sizes"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </el-row>
  </div>
</template>
<script>
import moment from 'moment'
import patientApi from '@/api/patient'
import { mapGetters } from 'vuex'
import dateUtil from '@/utils/dateUtil'

const threeDaysRange = () => [
  moment().subtract(2, 'days').format('YYYY-MM-DD'),
  moment().format('YYYY-MM-DD')
]

export default {
  data() {
    return {
      pickerDate: {
        maxDate: undefined,
        minDate: undefined
      },
      options: {
        type: '2',
        hospitalArea: '',
        beginTime: moment().subtract(1, 'days').format('YYYY-MM-DD'),
        endTime: moment().format('YYYY-MM-DD'),
        no: '',
        name: ''
      },
      gridData: [],
      selectedPatient: {},
      submitFlag: false,
      curPage: 1,
      pageSize: 100,
      total: 0
    }
  },
  computed: {
    dateRange: {
      get() {
        return [this.options.beginTime, this.options.endTime]
      },
      set(val) {
        if (this.options.type === '1' && val?.length) {
          const diff = Math.abs(
            this.$moment(val[0]).diff(this.$moment(val[1]), 'days')
          )
          if (diff > 2) {
            // console.log(diff, '范围禁止超过三天!')
            return
          }
        }
        const value = val || []
        this.options.beginTime = value[0] || ''
        this.options.endTime = value[1] || ''
      }
    },
    showData() {
      var data = {
        noInput: '请输入急救号',
        noCol: '急救号',
        timeCol: '急救时间',
        property: ''
      }
      switch (this.options.type) {
        case '1':
          data.noInput = '请输入急救号'
          data.noCol = '救护车'
          data.timeCol = '急救时间'
          data.property = 'licensePlate'
          break
        case '2':
          data.noInput = '请输入急诊号'
          data.noCol = '急诊号'
          data.timeCol = '分诊时间'
          data.property = 'no'
          break
        case '3':
          data.noInput = '请输入门诊号'
          data.noCol = '门诊号'
          data.timeCol = '挂号时间'
          data.property = 'displayNo'
          break
        case '4':
          data.noInput = '请输入住院号'
          data.noCol = '住院号'
          data.timeCol = '入院时间'
          data.property = 'displayNo'
          break
      }
      return data
    },
    pickerOptions() {
      return {
        disabledDate: (time) => {
          const { maxDate, minDate } = this.pickerDate
          let disabled = false
          if (this.options.type === '1' && minDate && !maxDate) {
            // 最多允许选择前后三天
            const threeDaysBefore = this.$moment(minDate).subtract(2, 'days')
            const threeDaysAfter = this.$moment(minDate).add(2, 'days')
            disabled =
              this.$moment(time).isAfter(threeDaysAfter) ||
              this.$moment(time).isBefore(threeDaysBefore)
          }
          return disabled
        },
        onPick: (v) => (this.pickerDate = v)
      }
    },
    ...mapGetters(['hospitalId', 'hospitalArea', 'curHospitalArea'])
  },
  mounted() {
    this.options.hospitalArea = this.curHospitalArea
    this.QueryIF()
  },
  methods: {
    calcIndex({ $index }) {
      return this.pageSize * (this.curPage - 1) + $index + 1
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.QueryIF()
    },
    handleCurrentChange(current) {
      this.curPage = current
      this.QueryIF()
    },
    sourceFromChange() {
      this.options.no = ''
      this.gridData = []
      this.submitFlag = false
      if (this.options.type === '1') {
        // 急救
        this.dateRange = threeDaysRange()
      }
      this.curPage = 1
      this.QueryIF()
    },
    QueryIF() {
      var that = this
      that.submitFlag = false
      if (!this.options.hospitalArea) {
        this.$message.error('请选择所属院区！')
        return
      }
      if (!this.dateRange) {
        if (this.options.type === '4' && !this.options.no) {
          this.$message.error('请填写住院号！')
          return
        }
        if (this.options.type === '3' && !this.options.no) {
          this.$message.error('请填写门诊号！')
          return
        }
        if (this.options.type === '2' && !this.options.no) {
          this.$message.error('请填写急诊号！')
          return
        }
        if (this.options.type === '1' && !this.options.no) {
          this.$message.error('请填写急救号！')
          return
        }
      } else {
        if (that.dateRange.length < 2) {
          this.$message.error('请填写开始时间和结束时间！')
          return
        }
        if (!that.dateRange[0]) {
          this.$message.error('请填写开始时间！')
          return
        }
        if (!that.dateRange[1]) {
          this.$message.error('请填写结束时间！')
          return
        }
        // 解决结束事件查询范围的问题
        // that.options.endTime = moment(that.dateRange[1])
        //   .add(1, 'days')
        //   .format('YYYY-MM-DD')
        // 20230308 注释掉,改为由后端处理结束日期范围问题
      }

      var loading = that.$loading({ lock: true, text: '正在加载数据' })

      patientApi
        .getNoFillPatientList({
          ...that.options,
          hospitalId: this.hospitalAndArea(),
          current: this.curPage,
          pageSize: this.pageSize
        })
        .then((res) => {
          if (res.result) {
            that.gridData = res.result.records
            that.total = res.result.total
          }
          loading.close()
        })
        .catch((error) => {
          loading.close()
          console.log(error)
        })
    },
    handleSelectionChange(selection, old) {
      if (selection) {
        this.selectedPatient = selection
        this.submitFlag = true
      }
    },
    createEmptyModal() {
      this.$emit('createShowModal', {
        ...this.selectedPatient,
        type: this.options.type
      })
    },
    createShowModal() {
      patientApi
        .getEmIdPatient({
          hospitalId: this.hospitalAndArea(),
          relationId: this.selectedPatient.relationId,
          type: this.options.type
        })
        .then((res) => {
          if (res.status === 200) {
            if (res.result) {
              this.$message.error('该患者已建档')
            } else {
              this.$emit('createShowModal', {
                ...this.selectedPatient,
                type: this.options.type
              })
            }
          }
        })
    },
    getGenderText(gender) {
      var text = '未知'
      if (gender) {
        switch (gender) {
          case '1':
            text = '男'
            break
          case '2':
            text = '女'
            break
        }
      }
      return text
    },
    formatBirthday(time) {
      return dateUtil.timeFormatForDay(time)
    },
    hospitalAndArea() {
      return this.hospitalId + '_' + this.curHospitalArea
    }
  }
}
</script>
<style scoped>
.el-row {
  margin-bottom: 10px;
}
</style>
