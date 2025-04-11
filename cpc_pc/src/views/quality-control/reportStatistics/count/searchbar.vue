<template>
  <div>
    <el-form :inline="true" :model="searchparam" size="mini">
      <el-form-item>
        <el-radio-group v-model="timeLabel" @change="timeChange(timeLabel)">
          <el-radio-button label="0">近3月</el-radio-button>
          <el-radio-button label="1">近6月</el-radio-button>
          <el-radio-button label="2">近1年</el-radio-button>
          <el-radio-button label="3">自定义</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="时间范围">
        <el-date-picker
          v-model="searchparam.daterange"
          type="monthrange"
          range-separator="至"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
          :picker-options="pickerOptions"
          :disabled="!timeVisible"
          @change="onSubmit()"
        />
      </el-form-item>
      <el-form-item label="患者类型">
        <el-checkbox-group v-model="searchparam.patientType" @change="onSubmit()">
          <el-checkbox label="STEMI" />
          <el-checkbox label="NSTEMI" />
          <el-checkbox label="UA" />
          <el-checkbox label="主动脉夹层" />
          <el-checkbox label="肺动脉栓塞" />
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'SearchBar',
  props: {
    showKeyItem: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      timeLabel: '1',
      searchparam: {
        daterange: [],
        patientType: ['STEMI', 'NSTEMI', 'UA', '主动脉夹层', '肺动脉栓塞']
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      timeVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'hospitalId',
      'hospitalArea'
    ])
  },
  mounted() {
    this.timeChange(this.timeLabel)
  },
  methods: {
    timeChange(type) {
      if (type === '0') {
        this.timeVisible = false
        this.$set(this.searchparam, 'daterange', [moment().subtract(2, 'months'), moment()])
        this.onSubmit()
      } else if (type === '1') {
        this.timeVisible = false
        this.$set(this.searchparam, 'daterange', [moment().subtract(5, 'months'), moment()])
        this.onSubmit()
      } else if (type === '2') {
        this.timeVisible = false
        this.$set(this.searchparam, 'daterange', [moment().subtract(11, 'months'), moment()])
        this.onSubmit()
      } else if (type === '3') {
        this.timeVisible = true
      }
    },
    onSubmit() {
      const typeCopy = []
      if (this.searchparam.patientType.includes('STEMI')) {
        typeCopy.push('STEMI')
      }
      if (this.searchparam.patientType.includes('NSTEMI')) {
        typeCopy.push('NSTEMI')
      }
      if (this.searchparam.patientType.includes('UA')) {
        typeCopy.push('UA')
      }
      if (this.searchparam.patientType.includes('主动脉夹层')) {
        typeCopy.push('主动脉夹层')
      }
      if (this.searchparam.patientType.includes('肺动脉栓塞')) {
        typeCopy.push('肺动脉栓塞')
      }
      this.searchparam.patientType = typeCopy
      this.$emit('doSearch', this.searchparam)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-range-editor {
  width: 250px;
}
</style>
