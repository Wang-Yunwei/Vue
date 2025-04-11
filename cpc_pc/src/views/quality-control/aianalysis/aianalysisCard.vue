<template>
  <div class="med-ai-analysis-wrapper">
    <el-table
      :data="model"
      style="width: 100%"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <div class="index-memo">
            <el-row>
              <div>
                <span class="label">参考对象:</span>
                <span class="content">{{ props.row.assessmentObject }}</span>
                <span class="seperator" />
                <span class="label">符合条件病历:</span>
                <span class="content">{{ props.row.accordWithNum }}<span v-if="props.row.accordWithNum">例</span></span>
                <span class="label">总病历数:</span>
                <span class="content">{{ props.row.total }}<span v-if="props.row.total">例</span></span>
                <span class="label">占比:</span>
                <span class="content">{{ props.row.accordWithRate }}<span v-if="props.row.accordWithRate">%</span></span>
              </div>
            </el-row>
            <el-row>
              <el-col>
                <el-table
                  :data="props.row.analysisAbnormalList"
                  style="width: 100%"
                >
                  <el-table-column label="时间未达标分析标题">
                    <template slot-scope="scope">
                      {{ scope.row.desc }}<span><a href="#" :title="scope.row.opinion"><i class="el-icon-info" /></a></span>
                    </template>
                  </el-table-column>
                  <el-table-column label="数量" width="100">
                    <template slot-scope="scope">
                      {{ scope.row.num }}<span v-if="scope.row.num">例</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="百分比">
                    <template slot-scope="scope">
                      <el-progress :text-inside="true" :stroke-width="26" :percentage="scope.row.ratio" />
                    </template>
                  </el-table-column>

                </el-table>
              </el-col>
            </el-row>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="指标名称">
        <template slot-scope="scope">
          <a class="link" @click="showDetail(scope.row)">
            {{ scope.row.code +
              (scope.row.isKeyIndex === "1" ? "* " : " ") +
              scope.row.title
            }}
          </a>
        </template>
      </el-table-column>
      <el-table-column width="500">
        <template slot-scope="scope">
          <span>
            <span class="label">参考标准:</span>{{ scope.row.standardValue }}
          </span>
          <span v-if="scope.row.yAxisType === '1'">
            <span class="label">平均值:</span><span>{{ scope.row.avgValue }}</span><span v-if="scope.row.avgValue">min</span>
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import { Progress } from 'vant'
export default {
  name: 'AianalysisCard',
  components: { },
  props: {
    model: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isExpand: false
    }
  },
  computed: {},
  watch: {},
  mounted() {},
  // 钩子方法
  created() {
    //
  },
  methods: {
    onLoad() {},
    showDetail(item) {
      this.$emit('showDetail', item)
    },
    showExpand() {
      if (this.isExpand) {
        this.isExpand = false
      } else {
        this.isExpand = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.med-ai-analysis-wrapper {
  .index-memo {
    .el-row {
      padding-left: 60px;
      height: 32px;
      .seperator {
        padding: 0 20px;
      }
    }
    .el-icon-info {
      padding: 0 6px;
      font-size: 16px;
    }
  }
  .label {
    font-weight: bold;
    padding: 0 12px;
  }
  .content {
    padding-right: 12px;
  }
  .link {
    display: flex;
    align-items: center;
    padding: 0 12px;
    line-height: 24px;
    color: #5e74fe;
    cursor: pointer;
  }
}
</style>
