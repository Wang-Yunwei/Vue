<template>
  <div>
    <el-row class="metrics" :gutter="32">
      <el-col :span="8" class="metrics-col">
        <div class="metrics-box">
          <div class="col-bell">
            <div class="col-bel-number">
              {{ metricsData.gcPatients ? metricsData.gcPatients : '--' }}
              <span style="font-size: 16px">例</span>
            </div>
            <div class="col-bel-word">卒中绿道患者</div>
          </div>
          <div class="col-bell">
            <div class="col-bel-number">
              {{
                metricsData.strokePatients ? metricsData.strokePatients : '--'
              }}
              <span style="font-size: 16px">例</span>
            </div>
            <div class="col-bel-word">脑卒中患者</div>
          </div>
          <div class="col-bell">
            <div class="col-bel-number">
              {{
                metricsData.ischemicStrokePatients
                  ? metricsData.ischemicStrokePatients
                  : '--'
              }}
              <span style="font-size: 16px">例</span>
            </div>
            <div class="col-bel-word">缺血性卒中患者</div>
          </div>
        </div>
      </el-col>
      <el-col :span="8" class="metrics-col">
        <div class="metrics-box">
          <div class="col-bell">
            <div class="col-bel-number">
              {{ metricsData.rsPatients ? metricsData.rsPatients : '--' }}
              <span style="font-size: 16px">例</span>
            </div>
            <div class="col-bel-word">静脉溶栓</div>
          </div>
          <div class="col-bell">
            <div class="col-bel-number">
              {{ metricsData.pciPatients ? metricsData.pciPatients : '--' }}
              <span style="font-size: 16px">例</span>
            </div>
            <div class="col-bel-word">血管内治疗</div>
          </div>
          <div class="col-bell">
            <div class="col-bel-number">
              {{
                metricsData.bridgingPatients
                  ? metricsData.bridgingPatients
                  : '--'
              }}
              <span style="font-size: 16px">例</span>
            </div>
            <div class="col-bel-word">桥接治疗</div>
          </div>
        </div>
      </el-col>
      <el-col :span="8" class="metrics-col">
        <div class="metrics-box">
          <div class="col-bell">
            <div class="col-bel-number">
              {{ metricsData.dntMedian ? metricsData.dntMedian : '--' }}
              <span style="font-size: 16px">分钟</span>
            </div>
            <div class="col-bel-word">DNT中位值</div>
          </div>
          <div class="col-bell">
            <div class="col-bel-number">
              {{ metricsData.dptMedian ? metricsData.dptMedian : '--' }}
              <span style="font-size: 16px">分钟</span>
            </div>
            <div class="col-bel-word">DPT中位值</div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Metrics',
  components: {},
  props: {
    metricsData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.el-col {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.col-bell {
  width: 100%;
  text-align: center;
}

.col-bel-number {
  font-size: 32px;
  color: #4b60fd;
  padding-bottom: 6px;
}

.col-bel-word {
  font-size: 15px;
  color: #444;
}

.el-divider--horizontal {
  margin: 13px 0;
}

.metrics {
  padding: 20px;
  margin-bottom: 10px;
  .metrics-col {
    .metrics-box {
      width: 100%;
      display: flex;
      border: 1px solid rgb(225, 228, 234);
      padding: 20px;
      border-radius: 6px;
      .col-bell:not(:last-child) {
        border-right: 1px solid rgb(225, 228, 234);
      }
    }
  }
}
</style>
