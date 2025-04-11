<template>
  <div>
    <el-form
      :inline="true"
      :model="searchparam"
      class="demo-form-inline"
      label-width="80px"
      style="display: flex; flex-wrap: wrap; justify-content: flex-start"
    >
      <el-form-item label="院区">
        <el-select
          v-model="searchparam.hospitalArea"
          placeholder="院区"
          style="width: 169px"
          @change="setHospitalArea"
        >
          <el-option
            v-for="a in hospitalArea"
            :key="a.value + a.label"
            :label="a.label"
            :value="a.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="患者姓名">
        <el-input
          v-model="searchparam.name"
          placeholder="患者姓名"
          style="width: 169px"
        />
      </el-form-item>
      <el-form-item label="来院方式">
        <el-select
          v-model="searchparam.comeType"
          placeholder="来院方式"
          multiple
          collapse-tags
          style="width: 169px"
        >
          <el-option
            v-for="d in commingTypes"
            :key="d.name + d.value"
            :label="d.label"
            :value="d.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="初步诊断">
        <el-select
          v-model="searchparam.preDiagnosis"
          placeholder="初步诊断"
          multiple
          collapse-tags
          style="width: 169px"
        >
          <el-option
            v-for="d in dictionary.diagnosisDict"
            :key="d.name + d.value"
            :label="d.label"
            :value="d.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="上报状态">
        <el-select
          v-model="searchparam.reportStatus"
          placeholder="上报状态"
          multiple
          collapse-tags
          style="width: 169px"
        >
          <el-option
            v-for="d in reportStatusDict"
            :key="d.name + d.value"
            :label="d.label"
            :value="d.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <template #label>
          <el-select v-model="searchparam.timeType" class="time-type">
            <el-option label="建档时间" value="1" />
            <el-option label="首触时间" value="2" />
          </el-select>
        </template>
        <el-date-picker
          v-model="searchparam.daterange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          style="width: 288px"
        />
      </el-form-item>
      <el-form-item v-if="advanced" label="出车单位">
        <el-select
          v-model="searchparam.ambulanceDepartment"
          placeholder="出车单位"
          multiple
          collapse-tags
          style="width: 169px"
        >
          <el-option
            v-for="d in dictionary.ambulanceDepartmentDict"
            :key="d.name + d.value"
            :label="d.label"
            :value="d.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="advanced" label="出院诊断">
        <el-select
          v-model="searchparam.leaveDiagnosis"
          placeholder="出院诊断"
          multiple
          collapse-tags
          style="width: 169px"
        >
          <el-option
            v-for="d in dictionary.dischargeDiagnosisDict"
            :key="d.name + d.value"
            :label="d.label"
            :value="d.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="advanced" label="患者转归">
        <el-select
          v-model="searchparam.outcomeCode"
          placeholder="患者转归"
          multiple
          collapse-tags
          style="width: 169px"
        >
          <el-option
            v-for="d in strOutcomeCodeDic"
            :key="d.name + d.value"
            :label="d.label"
            :value="d.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="advanced" label="放弃治疗">
        <el-radio-group :key="radioKey" v-model="searchparam.isGiveUp">
          <el-radio-button
            v-for="d in dictionary.yesOrNoDict"
            :key="d.name + d.value"
            :label="d.value"
            @click.native.prevent="changeIsGiveUp(d.value)"
          >{{ d.label }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item style="text-align: right; flex: 1">
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="primary" @click="advancedSearch">高级查询</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import checkPermission from '@/utils/permission'
export default {
  name: 'SearchBar',
  data() {
    return {
      searchparam: {
        name: '',
        hospitalArea: this.currentHospitalArea,
        preDiagnosis: [],
        comeType: [],
        ambulanceDepartment: [],
        leaveDiagnosis: [],
        outcomeCode: [],
        isGiveUp: '',
        reportStatus: [],
        daterange: '',
        startTime: '',
        endTime: '',
        timeType: '1'
      },
      advanced: false,
      strOutcomeCodeDic: [
        { label: '出院', value: '1' },
        { label: '转送其它医院', value: '2' },
        { label: '院内继续救治', value: '3' },
        { label: '死亡', value: '4' }
      ],
      radioKey: false,
      reportStatusDict: [
        { label: '待上报', value: '0' },
        { label: '上报成功', value: '1' },
        { label: '上报失败', value: '2' }
      ]
    }
  },
  computed: {
    ...mapGetters(['hospitalArea', 'dictionary', 'currentHospitalArea']),
    commingTypes() {
      const exclude = [
        !checkPermission(['mr-list-120']) && '1',
        !checkPermission(['mr-list-transfer']) && '2',
        !checkPermission(['mr-list-self']) && '3',
        !checkPermission(['mr-list-inhospital']) && '4'
      ]
      return (this.dictionary.comingDict || []).filter(
        (el) => !exclude.includes(el.value)
      )
    }
  },
  watch: {
    searchparam: {
      handler() {
        if (this.searchparam.daterange) {
          this.searchparam.startTime = this.searchparam.daterange[0]
          this.searchparam.endTime = this.searchparam.daterange[1]
        } else {
          this.searchparam.startTime = ''
          this.searchparam.endTime = ''
        }
      },
      deep: true
    }
  },
  created() {
    this.searchparam.hospitalArea = this.currentHospitalArea
    this.setHospitalArea()
  },
  methods: {
    onSubmit() {
      this.$emit('doSearch', this.searchparam)
    },
    advancedSearch() {
      this.advanced = !this.advanced
    },
    changeIsGiveUp(val) {
      this.searchparam.isGiveUp = this.searchparam.isGiveUp === val ? '' : val
      this.radioKey = !this.radioKey
    },
    setHospitalArea(ha) {
      this.$store.commit(
        'common/SET_CURRENT_HOSPITAL_AREA',
        ha || this.searchparam.hospitalArea
      )
      this.onSubmit()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-select__tags-text {
  max-width: 50px;
}
.time-type {
  margin-right: -10px;

  ::v-deep input.el-input__inner {
    border: none;
    font-weight: bold;
    background-color: transparent;
    padding: 0;
  }

  ::v-deep .el-select__caret {
    width: 16px;
  }
}
</style>
