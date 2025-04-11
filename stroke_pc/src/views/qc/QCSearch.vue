<template>
  <div>
    <el-form
      ref="qcSearchParam"
      :rules="rules"
      :inline="true"
      label-width="100px"
      :model="qcSearchParam"
      class="search-form"
    >
      <el-form-item label="时间类型" prop="dateType">
        <el-select v-model="qcSearchParam.dateType" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间" prop="beginTime">
        <el-date-picker
          v-model="qcSearchParam.beginTime"
          type="date"
          placeholder="选择日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :picker-options="startDatePicker"
          @change="changedate"
        />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker
          v-model="qcSearchParam.endTime"
          type="date"
          placeholder="选择日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :picker-options="endDatePicker"
          @change="changedate"
        />
      </el-form-item>
      <el-form-item label="" prop="range" style="margin-top: -1px;">
        <el-radio-group
          v-model="qcSearchParam.range"
          @change="changeTime"
        >
          <el-radio-button
            v-for="(item,index) in radioGroup"
            :key="index"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item style="margin-top: -1px;">
        <el-button
          type="primary"
          @click="submitForm('qcSearchParam')"
        >查询</el-button>
        <el-button @click="resetForm('qcSearchParam')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'QCSearch',
  data() {
    return {
      moment,
      radioTime: '',
      qcSearchParam: {
        dateType: '1',
        beginTime: moment().startOf('month').format('YYYY-MM-DD'),
        endTime: moment().endOf('day').format('YYYY-MM-DD')
      },
      rules: {
        beginTime: [{ required: true, message: '请选择时间', trigger: 'blur' }],
        endTime: [{ required: true, message: '请选择时间', trigger: 'blur' }]
      },
      options: [
        {
          value: '1',
          label: '创建患者时间'
        },
        {
          value: '2',
          label: '患者到院时间'
        }
      ],
      radioGroup: [
        {
          value: '1',
          label: '本月'
        }, {
          value: '2',
          label: '本季度'
        }, {
          value: '3',
          label: '本年'
        }, {
          value: '4',
          label: '最近一个月'
        }, {
          value: '5',
          label: '最近三个月'
        }, {
          value: '6',
          label: '最近一年'
        }
      ],
      startDatePicker: this.beginDate(),
      endDatePicker: this.processDate()
    }
  },
  mounted() {
    this.submitForm('qcSearchParam')
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('onSearch', this.qcSearchParam)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    changedate(){
      this.qcSearchParam.range = ''
    },
    changeTime(val) {
      // 本月
      if (val === '1') {
        this.qcSearchParam.beginTime = moment()
          .startOf('month')
          .format('YYYY-MM-DD')
        this.qcSearchParam.endTime = moment().endOf('day').format('YYYY-MM-DD')
      }
      // 本季度
      if (val === '2') {
        this.qcSearchParam.beginTime = moment()
          .startOf('quarter')
          .format('YYYY-MM-DD')
        this.qcSearchParam.endTime = moment().endOf('day').format('YYYY-MM-DD')
      }
      // 本年
      if (val === '3') {
        this.qcSearchParam.beginTime = moment()
          .startOf('year')
          .format('YYYY-MM-DD')
        this.qcSearchParam.endTime = moment().endOf('day').format('YYYY-MM-DD')
      }
      // 最近一个月
      if (val === '4') {
        this.qcSearchParam.beginTime = moment()
          .subtract(1, 'month')
          .format('YYYY-MM-DD')
        this.qcSearchParam.endTime = moment().endOf('day').format('YYYY-MM-DD')
      }
      // 最近三个月
      if (val === '5') {
        this.qcSearchParam.beginTime = moment()
          .subtract(3, 'month')
          .format('YYYY-MM-DD')
        this.qcSearchParam.endTime = moment().endOf('day').format('YYYY-MM-DD')
      }
      // 最近一年
      if (val === '6') {
        this.qcSearchParam.beginTime = moment()
          .subtract(1, 'year')
          .format('YYYY-MM-DD')
        this.qcSearchParam.endTime = moment().endOf('day').format('YYYY-MM-DD')
      }
    },
    // 日期修改
    beginDate() {
      const self = this
      return {
        disabledDate(time) {
          if (self.qcSearchParam.endTime) {
            return (
              new Date(self.qcSearchParam.endTime).getTime() < time.getTime()
            )
          } else {
            return time.getTime() >= Date.now() // 结束时间不选时，开始时间最大值小于等于当天
          }
        }
      }
    },
    // 结束时间必须大于等于开始时间
    processDate() {
      const self = this
      return {
        disabledDate(time) {
          if (self.qcSearchParam.beginTime) {
            return (
              new Date(self.qcSearchParam.beginTime).getTime()-24*60*60*1000 >
                time.getTime() || time.getTime() > Date.now()
            )
          } else {
            return time.getTime() >= Date.now() // 开始时间不选时，结束时间最大值小于等于当天
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.search-form {
  padding: 30px 30px 10px;
  background-color: rgb(238, 241, 246);
  margin-bottom: 10px;
}
</style>
