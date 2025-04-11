<template>
  <div class="details">
    <el-tabs v-model="activeName" tab-position="left" @tab-click="handleClick">
      <el-tab-pane label="患者分布" name="distribution">
        <el-row v-if="activeName === 'distribution'" style="height: 400px">
          <bar-chart
            element-id="barChart1"
            title="脑卒中患者性别、年龄分布"
            :data-zoom="true"
            :series-data="detailData.distribution"
          />
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="诊疗决策" name="decisions">
        <el-row v-if="activeName === 'decisions'">
          <el-col :span="11" style="height: 400px">
            <pie-chart
              element-id="pieChart2"
              title="初步诊断"
              :series-data="detailData.decisions.diagStat"
            />
          </el-col>
        </el-row>
        <el-row v-if="activeName === 'decisions'" style="margin-top: 80px">
          <el-col :span="11" style="height: 400px">
            <pie-chart
              element-id="pieChart3"
              title="脑卒中患者绿道转归"
              :series-data="detailData.decisions.whereaboutsStat"
            />
          </el-col>
          <el-col :span="11" :offset="1" style="height: 400px">
            <pie-chart
              element-id="pieChart4"
              title="脑卒中患者的治疗决策"
              :series-data="detailData.decisions.disposeStat"
            />
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="静脉溶栓" name="rs">
        <el-row v-if="activeName === 'rs'">
          <el-col :span="11" style="height: 400px">
            <bar-chart
              element-id="barChart5"
              title="静脉溶栓例数"
              :data-zoom="true"
              :series-data="{
                ischemicMonthly: detailData.rs.ischemicMonthly,
                rsPatientMonthly: detailData.rs.rsPatientMonthly
              }"
            />
          </el-col>
          <el-col :span="11" :offset="1" style="height: 400px">
            <line-chart
              element-id="lineChart1"
              title="ONT"
              :data-zoom="true"
              :series-data="{
                ontMedianList: detailData.rs.ontMedianList
                  ? detailData.rs.ontMedianList
                  : [],
                ontAverageList: detailData.rs.ontAverageList
                  ? detailData.rs.ontAverageList
                  : []
              }"
            />
          </el-col>
        </el-row>l
        <el-row v-if="activeName === 'rs'" style="margin-top: 80px">
          <el-col :span="11" style="height: 400px">
            <pie-chart
              element-id="barChart6"
              title="患者DNT分布"
              :series-data="detailData.rs.dntByTimeList"
            />
          </el-col>
          <el-col :span="11" :offset="1" style="height: 400px">
            <line-chart
              element-id="lineChart2"
              title="DNT"
              :data-zoom="true"
              :series-data="{
                dntMedianList: detailData.rs.dntMedianList
                  ? detailData.rs.dntMedianList
                  : [],
                dntAverageList: detailData.rs.dntAverageList
                  ? detailData.rs.dntAverageList
                  : []
              }"
            />
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="血管内治疗" name="therapy">
        <el-row v-if="activeName === 'therapy'">
          <el-col :span="11" style="height: 400px">
            <bar-chart
              element-id="barChart9"
              title="血管内治疗例数"
              :data-zoom="true"
              :series-data="{
                pciMonthly: detailData.therapy.pciMonthly,
                ischemicMonthly: detailData.therapy.ischemicMonthly
              }"
            />
          </el-col>
          <el-col :span="11" :offset="1" style="height: 400px">
            <bar-chart
              element-id="barChart10"
              title="桥接治疗例数"
              :data-zoom="true"
              :series-data="{
                bridgingMonthly: detailData.therapy.bridgingMonthly,
                ischemicMonthly: detailData.therapy.ischemicMonthly
              }"
            />
          </el-col>
        </el-row>
        <el-row v-if="activeName === 'therapy'" style="margin-top: 80px">
          <el-col :span="11" style="height: 400px">
            <line-chart
              element-id="lineChart3"
              title="DPT"
              :data-zoom="true"
              :series-data="{
                dptMedianList: detailData.therapy.dptMedianList
                  ? detailData.therapy.dptMedianList
                  : [],
                dptAverageList: detailData.therapy.dptAverageList
                  ? detailData.therapy.dptAverageList
                  : []
              }"
            />
          </el-col>
          <el-col :span="11" :offset="1" style="height: 400px">
            <line-chart
              element-id="lineChart5"
              title="DRT"
              :data-zoom="true"
              :series-data="{
                drtAverageList: detailData.therapy.drtAverageList
                  ? detailData.therapy.drtAverageList
                  : []
              }"
            />
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BarChart from '@/components/MedChart/BarChart'
import LineChart from '@/components/MedChart/LineChart'
import PieChart from '@/components/MedChart/PieChart'

export default {
  name: 'Detail',
  components: { PieChart, LineChart, BarChart },
  props: {
    detailData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      activeName: 'distribution'
    }
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    handleClick(tab, event) {
        console.log(this.detailData)
      console.log(tab, event)
    }
  }
}
</script>

<style lang="scss" scoped>
.details {
  //padding: 0 20px;
  ::v-deep .el-tab-pane {
    padding-top: 10px;
  }
}

.el-tab-pane {
  padding: 20px;
}
::v-deep {
  .el-tabs__header {
    width: 222px;
  }
}

</style>
