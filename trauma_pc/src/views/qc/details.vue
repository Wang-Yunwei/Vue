<template>
  <div style="overflow-y: scroll;overflow-x: hidden; height: calc(100vh - 3.5rem);">
    <div style="width: 50%;margin: 2.5rem auto">
      <div class="upper">
        <span style="color: white;">
          {{ titleName }}
        </span>
      </div>
      <div class="middle">
        <div class="middle-a">
          <div style="border-bottom: 0.1px solid #e6ebf5;padding: 0.8rem;">
            <span>月平均统计图</span>
            <span style="float: right;">{{ searchData.startDate + ' ~ ' + searchData.endDate }}</span>
          </div>
          <div style="width: 100%;height: 388px">
            <line-custom-chart element-id="lineChart1" :series-data="lineSeries.seriesData1" :y-axis-unit="yAxisUnit" />
          </div>
        </div>
        <div class="middle-b">
          <div style="border-bottom: 0.1px solid #e6ebf5;padding-bottom: 0.8rem;">
            月统计报表
          </div>
          <div style=" width: 98%;margin: 0 auto;">
            <el-table ref="qcTable" :data="detailList">
              <el-table-column v-for="(item, index) in tableLabel" :key="index" :label="item.label" :prop="item.prop"
                :width="item.width ? item.width : ''" />
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="doShow(scope.row)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div v-if="detailShowFlag" class="lower">
        <div style="border-bottom: 0.1px solid #e6ebf5;padding-bottom: 0.8rem;">
          {{ rowData.month }}
        </div>
        <div style=" width: 98%;margin: 0 auto;">
          <el-table ref="qcTable" :data="monthDetailList">
            <el-table-column v-for="(item, index) in monthTableLabel" :key="index" :label="item.label"
              :width="item.width ? item.width : ''">
              <template slot-scope="scope">
                <el-link v-if="item.prop === 'name'" type="primary" :underline="false"
                  @click="toEdit(scope.row.registId)">
                  {{ scope.row[item.prop] }}
                </el-link>
                <span v-else :style="scope.row[item.prop] < 0 ? 'color: red' : ''">
                  {{ scope.row[item.prop] }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LineCustomChart from '@/components/MedChart/LineCustomChart'
import { TableLabel } from '@/model/commonModel'
import { MonthTableLabel } from '@/model/commonModel'
import storage from 'store'

export default {
  name: 'Details',
  components: {
    LineCustomChart
  },
  data() {
    return {
      validRadioArr: ['9', '13', '15', '16'],
      deadRadioArr: ['10', '14'],
      meetingArr: ['19'],
      multilineIdArr: ['4', '17'],
      rowData: [],
      searchData: {},
      detailData: {},
      tableLabel: {},
      monthTableLabel: {},
      validRadio: '1',
      detailList: [],
      monthDetailList: [],
      dashboardFlag: true,
      validRadioFlag: true,
      deadRadioFlag: false,
      lineSeries: {
        seriesData1: {}
      },
      detailShowFlag: false,
      titleName: '',
      yAxisUnit: ''
    }
  },
  computed: {
    ...mapGetters(['hospitalId', 'hospitalArea'])

  },
  created() {
    const obj = this.$route.query.searchData ? JSON.parse(this.$route.query.searchData) : {}
    this.searchData = {
      ...obj,
      pointerType: this.$route.query.id
    }
    this.yAxisUnit = this.$route.query.yAxisUnit === '1' ? '%' : this.$route.query.yAxisUnit
    this.titleName = this.searchData.pointerType + ' ' + this.$route.query.name
    if (this.searchData.pointerType) {
      storage.set('qcSearchData', this.searchData)
      storage.set('rowDataName', this.$route.query.name)
    } else {
      this.searchData = storage.get('qcSearchData')
      this.titleName = storage.get('rowDataName')
    }
    this.queryTypeData(this.searchData)
  },
  methods: {
    toEdit(id) {
      const { href } = this.$router.resolve({
        name: 'Edit',
        query: {
          registId: id
        }
      })
      window.open(href, '_blank')
    },
    queryTypeData(params) {
      // 添加Detail列名
      this.tableLabel = {
        ...TableLabel['tableLabel' + params.pointerType]
      }
      params = { ...params, hospitalArea: this.hospitalArea }
      this.queryData(params)
    },
    queryData(params) {
      this.$api.statByPointerType(params).then((res) => {
        if (res.code === '000000') {
          this.detailData = res.body
          this.lineShow(res.body)
          this.detailList = res.body.detailList
        }
      })
    },
    lineShow(params) {
      if ('4' === this.searchData.pointerType) {
        this.$set(this.lineSeries.seriesData1, 'ctList', params.ctList)
        this.$set(this.lineSeries.seriesData1, 'chestXList', params.chestXList)
        this.$set(this.lineSeries.seriesData1, 'pelvisXList', params.pelvisXList)
        this.$set(this.lineSeries.seriesData1, 'fastList', params.fastList)
      } else if ('17' === this.searchData.pointerType) {
        this.$set(this.lineSeries.seriesData1, 'tiList', params.tiList)
        this.$set(this.lineSeries.seriesData1, 'gcsList', params.gcsList)
        this.$set(this.lineSeries.seriesData1, 'issList', params.issList)
      } else {
        this.$set(this.lineSeries.seriesData1, 'traumaList', params.lineList)
      }
    },
    doShow(ra) {
      this.rowData = ra
      this.monthTableLabel = {
        ...MonthTableLabel['monthTableLabel' + this.searchData.pointerType]
      }
      this.monthDetailList =
        this.detailData.monthPatientsMap[ra.month].patientList
      // 添加monthDetail列名
      if (this.validRadioArr.includes(this.searchData.pointerType)) {
        this.validRadioFlag = false
      } else if (this.deadRadioArr.includes(this.searchData.pointerType)) {
        this.validRadioFlag = false
        this.deadRadioFlag = true
      } else if (this.meetingArr.includes(this.searchData.pointerType)) {
        this.validRadioFlag = false
        this.monthDetailList =
          this.detailData.monthPatientsMap[ra.month].meetingList
      } else if (this.multilineIdArr.includes(this.searchData.pointerType)) {
        // 如果是类型4 重新赋值monthTableLabel覆盖之前的赋值信息
        this.monthTableLabel = {
          ...MonthTableLabel['monthTableLabel' + this.searchData.pointerType + ra.lineType]
        }
        this.monthDetailList =
          this.detailData.monthPatientsMap[ra.month][
            ra.lineType + 'Group'
          ].patientList

      }
      this.detailShowFlag = true
    }
  }
}
</script>
<style scoped>
.upper {
  background-color: rgb(75, 96, 253);
  margin-bottom: 1.5rem;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.middle {
  margin-bottom: 1.5rem;

  .middle-a {
    padding: 1rem 0.5rem;
    border-radius: 1rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  .middle-b {
    padding: 1rem;
    border-radius: 1rem;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

}

.lower {
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>