<template>
  <div>
    <el-form ref="searchParam" :inline="true" :model="searchParam">
      <el-form-item label="院区">
        <el-select v-model="curArea" placeholder="院区">
          <el-option
            v-for="item in hospitalArea"
            :key="item.areaId"
            :label="item.areaName"
            :value="item.areaId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="患者姓名" prop="inputParam">
        <el-input v-model="searchParam.inputParam" placeholder="患者姓名" clearable style="width: 130px" />
      </el-form-item>
      <el-form-item>
        <template #label>
          <el-select v-model="searchParam.timeType" class="time-type" style="width: 80px">
            <el-option label="建档时间" value="1" />
            <el-option label="到院时间" value="2" />
          </el-select>
        </template>
        <el-date-picker
          v-model="searchParam.times"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="来院方式" prop="comingType">
        <el-select v-model="searchParam.comingType" placeholder="来院方式" clearable style="width: 150px">
          <el-option label="全部" value="" />
          <el-option
            v-for="item in dic.comingType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="初步诊断" prop="diag">
        <el-select v-model="searchParam.diag" placeholder="诊断类型" clearable style="width: 150px">
          <el-option label="全部" value="" />
          <el-option
            v-for="item in dic.diag"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="初步处置" prop="dispose">
        <el-select v-model="searchParam.dispose" placeholder="处置类型" clearable style="width: 150px">
          <el-option label="全部" value="" />
          <el-option
            v-for="item in dic.dispose"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="上报状态" prop="reportStatus">
        <el-select v-model="searchParam.reportStatus" placeholder="上报状态" clearable style="width: 150px">
          <el-option label="全部" value="" />
          <el-option
            v-for="item in dic.reportStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button block type="primary" @click="onSearch">查询</el-button>
        <el-button @click="resetForm('searchParam')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import storage from 'store'
import store from '@/store'
import { mapGetters } from 'vuex'

export default {
  name: 'IndexSearch',
  data() {
    return {
      searchParam: {
        inputParam: '', //
        timeType: '1',
        times: [], //
        comingType: '', //
        diag: '', //
        dispose: '', //
        whereabouts: '', //
        reportStatus: ''
      },
      hospitalOpts: [],
      dic: storage.get('dicData') || {}
    }
  },
  computed: {
    ...mapGetters(['hospitalArea', 'curHospitalArea']),
    curArea: {
      get() {
        return this.curHospitalArea
      },
      set(val) {
        store.dispatch('common/setCurHospitalArea', val)
      }
    }
  },
  methods: {
    onSearch() {
      this.$emit('onSearch', this.searchParam)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-select__tags {
  max-width: 100% !important;
}
.time-type{
  margin-right: -10px;
  ::v-deep input.el-input__inner{
    border:none;
    font-weight: bold;
    background-color: transparent;
    padding:0;
  }
  ::v-deep .el-select__caret{
    width: 16px;
  }
}
</style>
