<template>
  <el-container style="margin: 0 10px;">
    <el-header style="background-color: #f5f6fb;height:10%;padding-top: 22px;">
      <el-form ref="qcSearchParam" :inline="true" :model="qcSearchParam">
        <el-form-item label="时间类型">
          <el-select v-model="qcSearchParam.dateType">
            <el-option v-for="(item, index) in dateTypeList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startDate">
          <el-date-picker v-model="qcSearchParam.startDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="startDatePicker" @change="$set(qcSearchParam, 'range', '')" />
        </el-form-item>
        <el-form-item label="结束时间" prop="endDate">
          <el-date-picker v-model="qcSearchParam.endDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="endDatePicker" @change="$set(qcSearchParam, 'range', '')" />
        </el-form-item>
        <el-form-item label="" prop="range">
          <el-radio-group v-model="qcSearchParam.range" size="medium" @change="changeTime">
            <el-radio-button label="1">本月</el-radio-button>
            <el-radio-button label="2">本季度</el-radio-button>
            <el-radio-button label="3">本年</el-radio-button>
            <el-radio-button label="4">最近一个月</el-radio-button>
            <el-radio-button label="5">最近三个月</el-radio-button>
            <el-radio-button label="6">最近一年</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button block type="primary" @click="onSearch">查询</el-button>
          <el-button @click="resetForm('qcSearchParam')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-divider />
    <el-main style="padding: initial;">
      <div>
        <el-table ref="qcTable" :data="qcData" max-height="840" :header-cell-style="() => 'font-size:1rem'" :cell-style="() => 'cursor:pointer;'" @row-click="doClick">
          <el-table-column width="30" />
          <el-table-column label="序号" prop="id" width="70" />
          <el-table-column label="指标名称" width="400">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="定义" prop="definition">
            <template slot-scope="scope">
              <div v-html="scope.row.definition" />
            </template>
          </el-table-column>
          <el-table-column label="质控对象" prop="controlObject" width="400">
            <template slot-scope="scope">
              <div v-html="scope.row.controlObject" />
            </template>
          </el-table-column>
          <el-table-column label="指标结果" prop="result" width="150">
            <template slot-scope="scope">
              <div v-html="scope.row.result" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import moment from 'moment'
import store from '@/store'
import { mapGetters } from 'vuex'
import qcConstant from '@/constant/qcConstant'
export default {
  name: 'QcIndex',
  data() {
    return {
      dateTypeList: [
        { label: '到院时间', value: '1' },
        { label: '建档时间', value: '2' }
      ],
      qcSearchParam: {
        dateType: '2',
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().endOf('day').format('YYYY-MM-DD')
      },
      rules: {
        startDate: [{ required: true, message: '请选择时间', trigger: 'blur' }],
        endDate: [{ required: true, message: '请选择时间', trigger: 'blur' }]
      },
      startDatePicker: this.beginDate(),
      endDatePicker: this.processDate(),

      searchData: {},
      qcData: [],
      multilineIdArr: qcConstant.multilineIdArr
    }
  },
  computed: {
    ...mapGetters(['hospitalArea']),
    curArea: {
      get() {
        return this.hospitalArea
      },
      set(val) {
        store.dispatch('common/setHospitalArea', val)
      }
    }
  },
  mounted() {
    this.onSearch()
  },
  methods: {
    onSearch() {
      this.searchBarHandle(this.qcSearchParam)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    changeTime(val) {
      // 本月
      if (val === '1') {
        this.qcSearchParam.startDate = moment()
          .startOf('month')
          .format('YYYY-MM-DD')
        this.qcSearchParam.endDate = moment().endOf('day').format('YYYY-MM-DD')
      }
      // 本季度
      if (val === '2') {
        this.qcSearchParam.startDate = moment()
          .startOf('quarter')
          .format('YYYY-MM-DD')
        this.qcSearchParam.endDate = moment().endOf('day').format('YYYY-MM-DD')
      }
      // 本年
      if (val === '3') {
        this.qcSearchParam.startDate = moment()
          .startOf('year')
          .format('YYYY-MM-DD')
        this.qcSearchParam.endDate = moment().endOf('day').format('YYYY-MM-DD')
      }
      // 最近一个月
      if (val === '4') {
        this.qcSearchParam.startDate = moment()
          .subtract(1, 'month')
          .format('YYYY-MM-DD')
        this.qcSearchParam.endDate = moment().endOf('day').format('YYYY-MM-DD')
      }
      // 最近三个月
      if (val === '5') {
        this.qcSearchParam.startDate = moment()
          .subtract(3, 'month')
          .format('YYYY-MM-DD')
        this.qcSearchParam.endDate = moment().endOf('day').format('YYYY-MM-DD')
      }
      // 最近一年
      if (val === '6') {
        this.qcSearchParam.startDate = moment()
          .subtract(1, 'year')
          .format('YYYY-MM-DD')
        this.qcSearchParam.endDate = moment().endOf('day').format('YYYY-MM-DD')
      }
      this.onSearch()
    },
    // 获取几年前，默认一年前的今天
    getLastYear(endDate) {
      const date = new Date(endDate)
      date.setFullYear(date.getFullYear() - 1)
      return date
    },
    // 日期修改
    beginDate() {
      const self = this
      return {
        disabledDate(time) {
          if (self.qcSearchParam.endDate) {
            return (
              self.getLastYear(self.qcSearchParam.endDate).getTime() >
              time.getTime() ||
              new Date(self.qcSearchParam.endDate).getTime() < time.getTime()
            )
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
          if (self.qcSearchParam.startDate) {
            return (
              new Date(self.qcSearchParam.startDate).getTime() >
              time.getTime() || time.getTime() > Date.now()
            )
          } else {
            return time.getTime() >= Date.now() // 开始时间不选时，结束时间最大值小于等于当天
          }
        }
      }
    },
    doClick(row) {
      const { href } = this.$router.resolve({
        name: 'Detailed',
        query: {
          id: row.id,
          name: row.name,
          yAxisUnit: row.yAxisType.replace(/\%/g, '1'),
          searchData: JSON.stringify(this.searchData)
        }
      })
      window.open(href, '_blank')
    },
    searchBarHandle(params) {
      this.searchData = { ...params }
      params = { ...params, hospitalArea: this.hospitalArea }
      this.fetch(params)
    },
    fetch(params = {}) {
      this.$api.queryList(params).then((res) => {
        if (res.code === '000000') {
          this.handleData(res.body)
        }
      })
    },
    handleData(data) {
      data.forEach((item) => {
        if (this.multilineIdArr.includes(item.id)) {
          var definition = ''
          var controlObject = ''
          var result = ''
          item.subPointerList.forEach((va) => {
            if (definition === '') {
              definition += va.definition
            } else {
              definition += '<br/>' + va.definition
            }
            if (controlObject === '') {
              controlObject += va.controlObject
            } else {
              controlObject += '<br/>' + va.controlObject
            }
            if (result === '') {
              result += va.result
            } else {
              result += '<br/>' + va.result
            }
          })
          item.definition = definition
          item.controlObject = controlObject
          item.result = result
        }
      })
      this.qcData = data
    }
  }
}
</script>
