<template>
  <div class="bind-patient">
    <div class="flex-c-b" @click="showModal">
      <slot>
        <el-input class="input" readonly v-bind="$attrs" />
        <el-button type="primary" :disabled="$attrs.disabled">关联</el-button>
      </slot>
    </div>
    <el-dialog
      append-to-body
      :title="title"
      width="880px"
      :visible.sync="modalVisible"
    >
      <div>
        <el-radio-group
          v-if="isBind"
          v-model="query.type"
          size="mini"
          class="comming-type"
          @change="onTypeChange"
        >
          <el-radio-button
            v-for="item in patientSource"
            :key="item.value"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
        <el-row :gutter="10">
          <el-col :span="9">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
              style="width: 100%"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="onDateChange"
            />
          </el-col>
          <el-col :span="6">
            <el-input
              v-model="query.patientName"
              clearable
              placeholder="请输入姓名"
              size="mini"
              @keyup.enter.native="handleSearch()"
            />
          </el-col>
          <el-col :span="5">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch()"
            >查询</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-table
            ref="gridTable"
            :data="gridData"
            height="390"
            size="mini"
            border
            highlight-current-row
            @row-click="handleSelect"
          >
            <el-table-column type="index" width="40" align="center">
              <template slot-scope="scope">
                {{ (pagi.current - 1) * pagi.pageSize + scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column
              v-for="col in columns"
              :key="col.property"
              :property="col.property"
              :width="col.width"
              :label="col.label"
            >
              <template slot-scope="scope">
                {{
                  col.render
                    ? col.render(scope.row[col.property], scope, col)
                    : scope.row[col.property]
                }}
              </template>
            </el-table-column>
          </el-table>
          <br>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="pagi.total"
            @current-change="onCurrentChange"
          />
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import patientApi from '@/api/patient'
import dateUtil from '@/utils/dateUtil'
// import storage from 'store'

const formatStr = 'YYYY-MM-DD HH:mm:ss'
const threeDaysRange = () => [
  moment().startOf('day').subtract(2, 'days').format(formatStr),
  moment().endOf('day').format(formatStr)
]
export default {
  props: {
    type: {
      type: String,
      default: '2'
    },
    isBind: {
      type: Boolean,
      default: false
    },
    patientName: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '绑定'
    },
    hospitalId: {
      type: String,
      default: ''
    },
    hospitalArea: {
      type: String,
      default: ''
    }
  },
  data() {
    const startOfDay = moment().startOf('day')
    const endOfDay = moment().endOf('day')
    return {
      pickerDate: {
        maxDate: undefined,
        minDate: undefined
      },
      modalVisible: false,
      pagi: {
        total: 0,
        pageSize: 10,
        current: 1
      },
      query: {
        hospitalAndArea: '',
        isTagNo: '0',
        hospitalArer: '',
        type: this.type,
        patientName: this.patientName,
        // hospitalId: this.hospitalId,
        fromDate: startOfDay.subtract(2, 'days').format(formatStr),
        toDate: endOfDay.format(formatStr)
      },
      gridData: [],
      patientSource: [
        { label: '急救', value: '1' },
        { label: '急诊', value: '2' },
        { label: '门诊', value: '3' },
        { label: '住院', value: '4' }
      ]
    }
  },
  computed: {
    pickerOptions() {
      const getStart = (days = 0) => {
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * days)
        return start
      }
      return {
        shortcuts: [
          {
            text: '近三天',
            onClick: (picker) => {
              picker.$emit('pick', [getStart(2), new Date()])
              this.handleSearch()
            }
          },
          {
            text: '最近一周',
            hidden: this.query.type === '1',
            onClick: (picker) => {
              picker.$emit('pick', [getStart(6), new Date()])
              this.handleSearch()
            }
          },
          {
            text: '最近一个月',
            hidden: this.query.type === '1',
            onClick: (picker) => {
              picker.$emit('pick', [getStart(30), new Date()])
              this.handleSearch()
            }
          }
        ].filter((el) => !el.hidden),
        disabledDate: (time) => {
          const { maxDate, minDate } = this.pickerDate
          let disabled = false
          if (this.query.type === '1' && minDate && !maxDate) {
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
    dateRange: {
      get() {
        if (this.query.fromDate && this.query.toDate) {
          return [this.query.fromDate, this.query.toDate]
        }
        return undefined
      },
      set(arr) {
        if (arr?.length) {
          this.query.fromDate = moment(arr[0]).startOf('day').format(formatStr)
          this.query.toDate = moment(arr[1]).endOf('day').format(formatStr)
        } else {
          this.query.fromDate = ''
          this.query.toDate = ''
        }
      }
    },
    columns() {
      const { type } = this.query
      const numberProp =
        ['licensePlate', 'no', 'displayNo', 'displayNo'][Number(type) - 1] ||
        'no'
      const numberLabel =
        ['救护车', '急诊号', '门诊号', '住院号'][Number(type) - 1] || '急诊号'
      const timeLabel =
        ['急救时间', '分诊时间', '挂号时间', '入院时间'][Number(type) - 1] ||
        '急救时间'
      const diagnosisLabel =
        ['初步诊断', '主诉', '初步诊断', '入院诊断'][Number(type) - 1] || '主诉'
      return [
        {
          property: numberProp,
          width: '120',
          label: numberLabel
        },
        {
          property: 'name',
          width: '100',
          label: '患者姓名'
        },
        {
          property: 'gender',
          width: '50',
          label: '性别',
          render: (val) => this.getGenderText(val)
        },
        // {
        //   property: 'birthDate',
        //   width: '100',
        //   label: '出生日期',
        //   render: (val) => this.formatBirthday(val)
        // },
        {
          property: 'age',
          width: '60',
          label: '年龄'
        },
        {
          property: 'diagnosis',
          width: '',
          label: diagnosisLabel
        },
        {
          property: 'time',
          width: '140',
          label: timeLabel
        }
      ]
    },
    hospitalAndArea() {
      return this.hospitalId + '_' + this.hospitalArea
    }
  },
  watch: {
    type() {
      this.query.type = this.type
    }
  },
  mounted() {
  },
  methods: {
    onDateChange() {
      this.handleSearch()
    },
    onTypeChange(type) {
      if (type === '1') {
        // 急救
        this.query.fromDate = threeDaysRange()[0]
        this.query.toDate = threeDaysRange()[1]
      }
      this.handleSearch()
    },
    showModal() {
      if (this.$attrs.disabled) return
      this.modalVisible = true
      this.handleSearch()
    },
    hideModal() {
      this.modalVisible = false
    },
    onCurrentChange(cur) {
      this.handleSearch(cur)
    },
    handleSearch(curPage = 1) {
      if (!this.dateRange) {
        this.$message.warning('请填写时间范围！')
        return
      }

      var loading = this.$loading({ lock: true, text: '正在搜索中' })
      this.query.hospitalAndArea = this.hospitalAndArea
      this.query.hospitalArer = this.hospitalArea
      patientApi
        .getThirdPartyPatients({
          ...this.query,
          ...this.pagi,
          current: curPage
        })
        .then((res) => {
          if (res.result) {
            this.gridData = res.result.records || []
            this.pagi.total = res.result.total
            this.pagi.current = res.result.current
          }
          loading.close()
        })
        .catch((error) => {
          loading.close()
          console.log(error)
        })
    },
    handleSelect(item) {
      this.$confirm(`确认${this.title}【${item.name}】吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          patientApi
            .getEmIdPatient({
              hospitalId: this.hospitalAndArea,
              relationId: item.relationId,
              type: this.query.type
            })
            .then((res) => {
              if (res.status === 200) {
                if (res.result) {
                  this.$message.error('该患者已建档')
                } else {
                  const query = { ...item, type: this.query.type }
                  this.$emit('bind', query, this.hideModal)
                }
              }
            })
        })
        .catch(() => {})
    },
    getGenderText(gender) {
      if (!gender) return ''
      var text = ''
      switch (gender.replace('0', '')) {
        case '1':
          text = '男'
          break
        case '2':
          text = '女'
          break
      }
      return text
    },
    formatBirthday(time) {
      return dateUtil.timeFormatForDay(time)
    }
  }
}
</script>

<style scoped>
.input {
  vertical-align: bottom;
  margin-right: 5px;
}
.comming-type {
  margin-top: -20px;
  margin-bottom: 10px;
}
</style>
