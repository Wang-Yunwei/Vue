<template>
  <div>
    <el-form :inline="true" :model="searchparam" class="demo-form-inline">
      <el-row>
        <el-col style="width: calc(100% - 160px)">
          <div class="flex-c-b">
            <el-form-item label="呼叫时间">
              <el-date-picker
                v-model="callTime"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm"
                range-separator="~"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item label="患者姓名">
              <el-input
                v-model="searchparam.patientName"
                placeholder="患者姓名"
              />
            </el-form-item>
            <el-form-item label="患者性别">
              <med-select
                v-model="searchparam.patientSex"
                show-option-all
                placeholder="全部"
                :options="dictionary[dic.gender]"
              />
            </el-form-item>
            <el-form-item label="急救车">
              <med-select
                v-model="searchparam.emergencyCar"
                show-option-all
                placeholder="全部"
                :options="vehicleList"
              />
            </el-form-item>
            <el-form-item label="出车分站">
              <station-select
                v-model="searchparam.dispatchVehicleSite"
                show-option-all
                placeholder="出车分站"
                :hospital-id="hospitalId"
                :hospital-area="drawOutHospitalArea"
              />
            </el-form-item>
          </div>
        </el-col>
        <el-col
          style="width: 160px"
        ><el-button
           :icon="`el-icon-arrow-${showMore ? 'up' : 'down'}`"
           @click="showMore = !showMore"
         />
          <el-button type="primary" @click="onSubmit">查询</el-button></el-col>
      </el-row>
      <div v-if="showMore" class="flex-c-s">
        <el-form-item label="病历状态">
          <med-select
            v-model="searchparam.medicalRecordStatus"
            show-option-all
            placeholder="全部"
            :options="dictionary[dic.medicalRecordStatus]"
          />
        </el-form-item>
        <el-form-item label="出车医院">
          <med-select
            v-model="searchparam.drawOutHospital"
            show-option-all
            placeholder="全部"
            :options="hospitalAreaList"
          />
        </el-form-item>
        <el-form-item label="送达医院">
          <med-select
            v-model="searchparam.escortToHospital"
            show-option-all
            placeholder="全部"
            :options="hospitalAreaList"
          />
        </el-form-item>
        <el-form-item label="疾病类别">
          <med-select
            v-model="searchparam.diseaseCategory"
            show-option-all
            placeholder="全部"
            :options="dictionary[dic.diseaseCategory]"
          />
        </el-form-item>
        <el-form-item label="初步诊断">
          <el-input v-model="searchparam.diagnosis" placeholder="初步诊断" />
        </el-form-item>
        <el-form-item label="病情判断">
          <med-select
            v-model="searchparam.conditionGrade"
            show-option-all
            placeholder="全部"
            :options="dictionary[dic.conditionJudgment]"
          />
        </el-form-item>
        <el-form-item label="出诊结果">
          <med-select
            v-model="searchparam.treatmentResult"
            show-option-all
            placeholder="全部"
            :options="dictionary[dic.visitResult]"
          />
        </el-form-item>
        <el-form-item label="任务状态">
          <med-select
            v-model="searchparam.missionStatus"
            show-option-all
            placeholder="全部"
            :options="dictionary[dic.missionStatus]"
          />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import MedSelect from '@/components/MedSelect/Select'
import { mapGetters } from 'vuex'
import { eccPageList } from '@/api/emergencyCar'
import { dicConstant as dic } from '@/constant'
import moment from 'moment'

export default {
  name: 'SearchBar',
  components: {
    MedSelect
  },
  data() {
    return {
      dic,
      showMore: false,
      searchparam: { current: 0, total: 0 },
      vehicleList: [] // 急救车
      // dictionary: {
      //   departureHospital: [], // 医院
      //   station: [], // 出车分站
      //   vehicle: [], // 急救车
      //   missionStatus: [], // 任务状态
      //   gender: [], // 性别
      //   illness: [], // 病情判断
      //   diseaseCategory: [], // 疾病类别
      //   result: [], // 出诊结果
      //   medicalRecordStatus: [] // 病历状态
      // },
      // hospitalArea: []
    }
  },
  computed: {
    ...mapGetters(['hospitalId', 'dictionary', 'hospitalAreaList']),
    drawOutHospitalArea() {
      const { drawOutHospital } = this.searchparam
      if (drawOutHospital) {
        return drawOutHospital.split('_')[1]
      }
      return ''
    },
    callTime: {
      get() {
        const { callTimeStart, callTimeEnd } = this.searchparam
        return [callTimeStart, callTimeEnd]
      },
      set(v) {
        const [callTimeStart, callTimeEnd] = v || []
        const formatStr = 'YYYY-MM-DDTHH:mm:ss[.]SSS[Z]'
        this.$set(
          this.searchparam,
          'callTimeStart',
          callTimeStart ? moment(callTimeStart).format(formatStr) : undefined
        )
        this.$set(
          this.searchparam,
          'callTimeEnd',
          callTimeEnd ? moment(callTimeEnd).format(formatStr) : undefined
        )
      }
    }
  },
  async mounted() {
    // this.initDictionary()
    this.initVehicleList()
  },
  methods: {
    // 字典
    // async initDictionary() {
    //   const { _get, getDictionary } = this
    //   const codeList = [d.gender, d.dispatchVehicleSite]
    //   const dic = await getDictionary(codeList)
    //   this.dictionary.gender = _get(dic, d.gender)
    //   this.dictionary.comingTypeDic = _get(dic, d.comingCode)
    // },
    // 急救下拉
    async initVehicleList() {
      await eccPageList({ hospitalId: this.hospitalId }).then((resp) => {
        this.vehicleList = resp.body.records.map((item) => {
          return {
            label: item.licensePlate,
            value: item.licensePlate
          }
        })
      })
    },
    onSubmit() {
      this.$emit('doSearch', this.searchparam)
    }
  }
}
</script>
<style lang="scss" scoped>
.demo-form-inline {
  .el-form-item {
    white-space: nowrap;
  }
}
</style>
