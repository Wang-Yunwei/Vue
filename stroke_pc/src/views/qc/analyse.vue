<template>
  <div>
    <el-tabs v-model="rateType" tab-position="left" @tab-click="handleClick">
      <el-tab-pane label="DNT达标率" name="dnt">
        <el-row v-if="rateType === 'dnt'" :gutter="30">
          <el-col :span="8">
            <div style="width: 100%; height: 100%;">
              <pie-chart
                element-id="dnt"
                title="DNT达标率"
                :series-data="analyseData.dntReachRate"
              />
            </div>
          </el-col>
          <el-col :span="16">
            <div style="width: 100%; height: 100%;">
              <el-table :data="tableData.dnt" border style="width: 100%">
                <el-table-column label="姓名">
                  <template slot-scope="scope">
                    <el-button type="text" @click="goUpdateView(scope.row)">{{ scope.row.name }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="arriveHospitalTime" label="到院时间" />
                <el-table-column prop="firstPharmacyTime" label="首剂给药时间" />
                <el-table-column label="DNT时长">
                  <template slot-scope="scope">
                    <span>{{ scope.row.timeSpend }}分钟</span>
                  </template>
                </el-table-column>
                <el-table-column label="是否达标">
                  <template slot-scope="scope">
                    <el-tag v-if="!scope.row.reach" type="danger">未达标</el-tag>
                    <el-tag v-if="scope.row.reach">达标</el-tag>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                background
                layout="prev, pager, next"
                :page-size="pageSize"
                :total="total"
                @current-change="handleCurrentChange"
              />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="DPT达标率" name="dpt">
        <el-row v-if="rateType === 'dpt'" :gutter="30">
          <el-col :span="8">
            <div style="width: 100%; height: 100%">
              <pie-chart
                element-id="dpt"
                title="DPT达标率"
                :series-data="analyseData.dptReachRate"
              />
            </div>
          </el-col>
          <el-col :span="16">
            <div style="width: 100%; height: 100%;">
              <el-table :data="tableData.dpt" border style="width: 100%">
                <el-table-column label="姓名">
                  <template slot-scope="scope">
                    <el-button type="text" @click="goUpdateView(scope.row)">{{ scope.row.name }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="arriveHospitalTime" label="到院时间" />
                <el-table-column prop="femoralArteryFinishTime" label="完成动脉穿刺时间" />
                <el-table-column label="DPT时长">
                  <template slot-scope="scope">
                    <span>{{ scope.row.timeSpend }}分钟</span>
                  </template>
                </el-table-column>
                <el-table-column label="是否达标">
                  <template slot-scope="scope">
                    <el-tag v-if="!scope.row.reach" type="danger">未达标</el-tag>
                    <el-tag v-if="scope.row.reach">达标</el-tag>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                background
                layout="prev, pager, next"
                :page-size="pageSize"
                :total="total"
                @current-change="handleCurrentChange"
              />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="DRT达标率" name="drt">
        <el-row v-if="rateType === 'drt'" :gutter="30">
          <el-col :span="8">
            <div style="width: 100%; height: 100%">
              <pie-chart
                element-id="drt"
                title="DRT达标率"
                :series-data="analyseData.drtReachRate"
              />
            </div>
          </el-col>
          <el-col :span="16">
            <div style="width: 100%; height: 100%;">
              <el-table :data="tableData.drt" border style="width: 100%">
                <el-table-column label="姓名">
                  <template slot-scope="scope">
                    <el-button type="text" @click="goUpdateView(scope.row)">{{ scope.row.name }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="arriveHospitalTime" label="到院时间" />
                <el-table-column prop="pciFroTime" label="首次血管再通时间" />
                <el-table-column label="DRT时长">
                  <template slot-scope="scope">
                    <span>{{ scope.row.timeSpend }}分钟</span>
                  </template>
                </el-table-column>
                <el-table-column label="是否达标">
                  <template slot-scope="scope">
                    <el-tag v-if="!scope.row.reach" type="danger">未达标</el-tag>
                    <el-tag v-if="scope.row.reach">达标</el-tag>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                background
                layout="prev, pager, next"
                :page-size="pageSize"
                :total="total"
                @current-change="handleCurrentChange"
              />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <!-- <el-tab-pane label="OTT达标率" name="ott">
        <el-row v-if="rateType === 'ott'" :gutter="30">
          <el-col :span="8">
            <div style="width: 100%; height: 100%">
              <pie-chart
                element-id="ott"
                title="OTT达标率"
                :series-data="analyseData.ottReachRate"
              />
            </div>
          </el-col>
          <el-col :span="16">
            <div style="width: 100%; height: 100%;">
              <el-table :data="tableData.ott" border style="width: 100%">
                <el-table-column label="姓名">
                  <template slot-scope="scope">
                    <el-button type="text" @click="goUpdateView(scope.row)">{{ scope.row.name }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="arriveHospitalTime" label="到院时间" />
                <el-table-column prop="pciFroTime" label="血管再通时间" />
                <el-table-column label="OTT时长">
                  <template slot-scope="scope">
                    <span>{{ scope.row.timeSpend }}分钟</span>
                  </template>
                </el-table-column>
                <el-table-column label="是否达标">
                  <template slot-scope="scope">
                    <el-tag v-if="!scope.row.reach" type="danger">未达标</el-tag>
                    <el-tag v-if="scope.row.reach">达标</el-tag>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                background
                layout="prev, pager, next"
                :page-size="pageSize"
                :total="total"
                @current-change="handleCurrentChange"
              />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane> -->
      <el-tab-pane label="头颅CT报告时间达标率" name="skullCt">
        <el-row v-if="rateType === 'skullCt'" :gutter="30">
          <el-col :span="8">
            <div style="width: 100%; height: 100%">
              <pie-chart
                element-id="skullCt"
                title="头颅CT报告时间达标率"
                :series-data="analyseData.skullCtRate"
              />
            </div>
          </el-col>
          <el-col :span="16">
            <div style="width: 100%; height: 100%;">
              <el-table :data="tableData.skullCt" border style="width: 100%">
                <el-table-column label="姓名">
                  <template slot-scope="scope">
                    <el-button type="text" @click="goUpdateView(scope.row)">{{ scope.row.name }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="arriveHospitalTime" label="到院时间" />
                <el-table-column prop="finishTime" label="CT平扫检查完成时间" />
                <el-table-column label="CT时长">
                  <template slot-scope="scope">
                    <span>{{ scope.row.timeSpend }}分钟</span>
                  </template>
                </el-table-column>
                <el-table-column label="是否达标">
                  <template slot-scope="scope">
                    <el-tag v-if="!scope.row.reach" type="danger">未达标</el-tag>
                    <el-tag v-if="scope.row.reach">达标</el-tag>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                background
                layout="prev, pager, next"
                :page-size="pageSize"
                :total="total"
                @current-change="handleCurrentChange"
              />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="实验室检查时间达标率" name="lisReportTime">
        <el-row v-if="rateType === 'lisReportTime'" :gutter="30">
          <el-col :span="8">
            <div style="width: 100%; height: 100%">
              <pie-chart
                element-id="lisReportTime"
                title="实验室检查时间达标率"
                :series-data="analyseData.lisReportTimeRate"
              />
            </div>
          </el-col>
          <el-col :span="16">
            <div style="width: 100%; height: 100%;">
              <el-table :data="tableData.lisReportTime" border style="width: 100%">
                <el-table-column label="姓名">
                  <template slot-scope="scope">
                    <el-button type="text" @click="goUpdateView(scope.row)">{{ scope.row.name }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="bloodCollectionTime" label="采血时间" />
                <el-table-column prop="reportTime" label="实验室检验报告时间" />
                <el-table-column label="检验时长">
                  <template slot-scope="scope">
                    <span>{{ scope.row.timeSpend }}分钟</span>
                  </template>
                </el-table-column>
                <el-table-column label="是否达标">
                  <template slot-scope="scope">
                    <el-tag v-if="!scope.row.reach" type="danger">未达标</el-tag>
                    <el-tag v-if="scope.row.reach">达标</el-tag>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                background
                layout="prev, pager, next"
                :page-size="pageSize"
                :total="total"
                @current-change="handleCurrentChange"
              />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="绿通救治死亡率" name="death">
        <el-row v-if="rateType === 'death'" :gutter="30">
          <el-col :span="8">
            <div style="width: 100%; height: 100%">
              <pie-chart
                element-id="death"
                title="绿通救治死亡率"
                :series-data="analyseData.deathRate"
              />
            </div>
          </el-col>
          <el-col :span="16">
            <div style="width: 100%; height: 100%;">
              <el-table :data="tableData.death" border style="width: 100%">
                <el-table-column label="姓名">
                  <template slot-scope="scope">
                    <el-button type="text" @click="goUpdateView(scope.row)">{{ scope.row.name }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="triageTime" label="分诊时间" />
                <el-table-column label="是否死亡">
                  <template slot-scope="scope">
                    <el-tag v-if="!scope.row.reach">否</el-tag>
                    <el-tag v-if="scope.row.reach" type="danger">是</el-tag>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                background
                layout="prev, pager, next"
                :page-size="pageSize"
                :total="total"
                @current-change="handleCurrentChange"
              />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import PieChart from '@/components/MedChart/PieChart'
import qualityApi from '@/api/quality'
import patientApi from '@/api/patient'
import { mapGetters } from 'vuex'

export default {
  name: 'Analyse',
  components: { PieChart },
  props: {
    analyseData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      rateType: 'dnt',
      tableData: {
        dnt: [],
        dpt: [],
        drt: [],
        ott: [],
        skullCt: [],
        lisReportTime: [],
        death: []
      },
      pageSize: 5,
      current: 1,
      total: 0,
      tableFlag: false,
      rfTags: []
    }
  },
  computed: {
    ...mapGetters(['hospitalId', 'curHospitalArea'])
  },
  watch: {},
  created() {},
  mounted() {
    this.current = 1
    this.getRatePage()
    this.getRfTags()
  },
  methods: {
    handleClick(tab, event) {
      this.rateType = tab.name
      this.current = 1
      this.getRatePage()
    },
    handleCurrentChange(val) {
      this.current = val
      this.getRatePage()
    },
    getRatePage() {
      qualityApi.getRatePage({
        dateType: this.analyseData.dateType,
        beginTime: this.analyseData.beginTime,
        endTime: this.analyseData.endTime,
        hospitalIds: [this.hospitalId],
        hospitalAreas: [this.curHospitalArea],
        rateType: this.rateType,
        current: this.current,
        pageSize: this.pageSize
      })
        .then(res => {
          if (res.status === 200 && res.code === '0') {
            this.tableData[this.rateType] = res.result.records
            this.total = res.result.total
          } else {
            this.$message.error(res.message)
          }
        })
    },
    // 获取腕带信息
    getRfTags() {
      patientApi
        .getRfTags({
          hospitalId: this.hospitalId + '_' + this.curHospitalArea
        })
        .then((res) => {
          if (res.status === 200 && res.code === '0') {
            res.result.forEach((element) => {
              this.rfTags.push({
                label: `${element.tagName}(${element.tagId})`,
                value: element.tagName })
            })
          }
        })
    },
    // 编辑页面跳转
    goUpdateView(code) {
      const { href } = this.$router.resolve({
        name: 'Edit',
        query: { hospitalArea: this.curHospitalArea, registId: code.registId, rfTags: JSON.stringify(this.rfTags) }
      })
      window.open(href, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
.el-tabs__header {
  width: 222px;
}
}

.el-col {
  height: 400px;
}
</style>
