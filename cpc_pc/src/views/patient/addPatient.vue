<template>
  <el-dialog :top="top" title="新增病历" :visible.sync="showDialog" width="900px" @close="onClose">
    <div class="dlg-add-container">
      <el-row>
        <el-radio-group v-model="options.type" @change="sourceFromChange">
          <el-radio-button v-if="firstaid" label="1">急救</el-radio-button>
          <el-radio-button v-if="emergency" label="2">急诊</el-radio-button>
          <el-radio-button v-if="outpatient" label="3">门诊</el-radio-button>
          <el-radio-button v-if="inpatient" label="4">住院</el-radio-button>
        </el-radio-group>
        <el-button style="margin-left: 100px;" type="primary" size="mini" @click="createBlank()">空白病例</el-button>
      </el-row>
      <el-row :gutter="10" style="margin-top: 10px;">
        <el-col :span="24">
          <div class="search-panel">
            <div class="search-condition">
              <div class="search-block">
                <el-select v-model="selectedHospital" placeholder="请选择院区" size="mini" style="max-width: 150px;" disabled>
                  <el-option
                    v-for="item in hospitalArea"
                    :key="item.value + item.label"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <div class="search-block">
                <el-date-picker
                  v-model="DateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  size="mini"
                  style="max-width:250px;"
                  :picker-options="pickerOptions"
                />
              </div>
              <div class="search-block">
                <el-input v-model="options.name" placeholder="请输入姓名" size="mini" style="max-width: 100px;" />
              </div>
              <div class="search-block">
                <el-button size="mini" icon="el-icon-search" @click="QueryIF">查询</el-button>
              </div>
              <div v-if="selectedPatient.name" class="search-block">
                <el-button size="mini" type="success" icon="el-icon-check" @click="doAdd">确定</el-button>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <div style="margin-top:10px">
        <el-table
          :data="gridData"
          style="width: 100%"
          height="300"
          size="mini"
          border
          highlight-current-row
          @current-change="handleSelectionChange"
        >
          <el-table-column type="index" width="50" align="center">
            <template slot-scope="scope">
              {{ (pagi.current - 1) * pagi.pageSize + scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column :property="showData.property" :label="showData.noCol" />
          <el-table-column property="name" label="患者姓名" />
          <el-table-column label="性别" width="80">
            <template slot-scope="scope">
              {{ scope.row.gender | convert(dictionary.genderDict) }}
            </template>
          </el-table-column>
          <el-table-column property="age" label="年龄" width="180" />
          <el-table-column :label="showData.timeCol" width="200">
            <template slot-scope="scope">
              {{ scope.row.time | dateFormate('minute') }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="pagi.total"
          :page-size="pagi.pageSize"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </el-dialog>
</template>
<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import { getThirdPartyPatients, getEmIdPatient } from '@/api/patient/thirdpart'

const threeDaysRange = () => [
  moment().subtract(2, 'days').format('YYYY-MM-DD'),
  moment().format('YYYY-MM-DD')
]

export default {
  filters: {
    dateFormate(val, type) {
      if (!val) return ''
      if (type === 'date') { return moment(val).format('YYYY-MM-DD') } else if (type === 'minute') { return moment(val).format('YYYY-MM-DD HH:mm') }
    }
  },
  props: {
    top: {
      type: String,
      default: '15vh'
    },
    visible: {
      type: Boolean,
      default: false
    },
    inpatient: {
      type: Boolean,
      default: true
    },
    outpatient: {
      type: Boolean,
      default: true
    },
    emergency: {
      type: Boolean,
      default: true
    },
    firstaid: {
      type: Boolean,
      default: true
    },
    daukNo: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    var initdata = {
      pickerDate: {
        maxDate: undefined,
        minDate: undefined
      },
      DateRange: [moment().subtract(2, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
      options: {
        type: '2',
        hospitalId: null,
        hospitalArea: '',
        beginTime: '',
        endTime: '',
        no: '',
        name: '',
        sysId: 'cpc',
        isTagNo: '1'
      },
      gridData: [],
      selectedPatient: {},
      pagi: {
        total: 0,
        pageSize: 100,
        current: 1
      }
    }
    if (this.emergency) {
      initdata.options.type = '2'
    } else if (this.inpatient) {
      initdata.options.type = '4'
    } else if (this.outpatient) {
      initdata.options.type = '3'
    }
    return initdata
  },
  computed: {
    ...mapGetters([
      'hospitalId',
      'hospitalArea',
      'dictionary',
      'currentHospitalArea'
    ]),
    pickerOptions() {
      return {
        disabledDate: (time) => {
          const { maxDate, minDate } = this.pickerDate
          let disabled = false
          if (this.options.type === '1' && minDate && !maxDate) {
            // 最多允许选择前后三天
            const threeDaysBefore = moment(minDate).subtract(2, 'days')
            const threeDaysAfter = moment(minDate).add(2, 'days')
            disabled =
              moment(time).isAfter(threeDaysAfter) ||
              moment(time).isBefore(threeDaysBefore)
          }
          return disabled
        },
        onPick: (v) => (this.pickerDate = v)
      }
    },
    showData: function() {
      var data = {
        noInput: '请输入住院号',
        noCol: '住院号',
        timeCol: '入院时间'
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
    selectedHospital: {
      get() {
        return this.options.hospitalArea || this.currentHospitalArea
      },
      set(val) {
        this.options.hospitalArea = val
      }
    },
    showDialog: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  watch: {
    name(val) {
      this.options.name = val
    }
  },
  mounted() {
  },
  methods: {
    handleSelectionChange(selection) {
      this.selectedPatient = Object.assign({}, selection)
    },
    async getbaseparams() {
      this.options.hospitalArea =
        this.hospitalArea.length > 0
          ? this.hospitalArea[0].value
          : ''
    },
    sourceFromChange() {
      this.options.no = ''
      this.selectedPatient = {}
      this.gridData = []

      if (this.options.type === '1') {
        // 急救
        this.DateRange = threeDaysRange()
      }
      this.pagi.current = 1
    },
    async QueryIF() {
      this.options.beginTime = null
      this.options.endTime = null
      if (!this.selectedHospital) {
        this.$message.error('请选择所属院区！')
        return
      }
      if (!this.DateRange) {
        if (this.isInpatient() && !this.options.no) {
          this.$message.error('请填写住院号！')
          return
        }
        if (this.isOutpatient() && !this.options.no) {
          this.$message.error('请填写门诊号！')
          return
        }
        if (this.isEmergency() && !this.options.no) {
          this.$message.error('请填写急诊号！')
          return
        }
      } else {
        if (this.DateRange.length < 2) {
          this.$message.error('请填写开始时间和结束时间！')
          return
        }
        if (!this.DateRange[0]) {
          this.$message.error('请填写开始时间！')
          return
        }
        if (!this.DateRange[1]) {
          this.$message.error('请填写结束时间！')
          return
        }

        this.options.beginTime = moment(this.DateRange[0]).format('YYYY-MM-DD HH:mm')
        this.options.endTime = moment(this.DateRange[1]).endOf('day').format('YYYY-MM-DD HH:mm')
      }

      var loading = this.$loading({ lock: true, text: '正在查询' })
      // var p = Object.assign(this.options, { hospitalArea: this.selectedHospital, hospitalId: this.hospitalId })
      // const { result } = await getQueryPatients(p) || []
      var p = Object.assign(this.options, {
        hospitalArea: this.selectedHospital,
        hospitalAndArea: `${this.hospitalId}_${this.selectedHospital}`,
        fromDate: this.options.beginTime,
        toDate: this.options.endTime,
        patientName: this.options.name,
        regId: undefined,
        current: this.pagi.current,
        pageSize: this.pagi.pageSize
      })
      const { result } = await getThirdPartyPatients(p)

      this.gridData = result?.records || []
      this.pagi.total = result.total
      // this.pagi.current = result.pages
      this.selectedPatient = {}
      loading.close()
    },
    isInpatient() {
      return this.options.type === '0'
    },
    isOutpatient() {
      return this.options.type === '3'
    },
    isEmergency() {
      return this.options.type === '2'
    },
    async doAdd() {
      if (this.selectedPatient && this.selectedPatient.name) {
        if (!this.selectedHospital) {
          this.$message.error('请选择所属院区！')
          return
        }

        this.selectedPatient.type = this.options.type
        const p = {
          type: this.selectedPatient.type,
          visitId: this.selectedPatient.relationId,
          relationId: this.selectedPatient.relationId,
          hospitalId: `${this.hospitalId}_${this.selectedHospital}`
        }
        const { result } = await getEmIdPatient(p) || {}
        if (result.isRegister) {
          this.$message.error('该患者已建档')
        } else {
          this.selectedPatient.patientNo = result.emId
          this.showDialog = false
          this.$emit('extract', Object.assign(this.selectedPatient, { hospitalArea: this.selectedHospital }))
        }
      } else {
        this.$message.error('请选择患者')
      }
    },
    onClose() {
      this.DateRange = [moment().subtract(2, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
      this.options = {
        type: '2',
        hospitalId: null,
        hospitalArea: '',
        beginTime: '',
        endTime: '',
        no: '',
        name: '',
        sysId: 'cpc'
      }
      this.gridData = []
      this.selectedPatient = {}
    },
    createBlank() {
      this.$emit('extract', { hospitalId: this.hospitalId, hospitalArea: '' })
    },
    handleCurrentChange(val) {
      this.pagi.current = val
      this.QueryIF()
    }
  }
}
</script>
<style lang="sass" scoped>
// .form-inline
//   height: 30px
//   margin: 5px 0 0 0
//   display: flex
.dlg-add-container .search-panel
  display: flex
  padding: 5px 0
  justify-content: space-between
  align-items: center

  & .search-condition
    display: flex
    flex-grow: 1
    padding-right: 20px

  & .search-condition .search-block
    margin-right: 10px

// .search-operation
//   padding: 5px 0
//   float: right
</style>
