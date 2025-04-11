<template>
  <div class="med-ai-analysis-wrapper">
    <div class="condition">
      <van-dropdown-menu>
        <van-dropdown-item
          v-model="query.isUpToStandard"
          :options="indicatorsDic"
          @change="getIntelligentAnalysis"
          @open="open"
          @close="close"
          ref="dropMenu"
        />
        <van-dropdown-item
          title="关键指标"
          ref="item"
          @open="open"
          @close="close"
        >
          <van-cell center title="关键指标">
            <template #right-icon>
              <van-switch
                v-model="swichModel"
                size="24"
                active-color="#ee0a24"
                @input="getIntelligentAnalysis"
              />
            </template>
          </van-cell>
        </van-dropdown-item>
      </van-dropdown-menu>
      <van-row gutter="24" v-show="false" class="condition-date">
        <van-col span="11">
          <med-date-picker
            v-model="query.startTime"
            label=""
            placeholder="开始时间"
            formatter="YYYY-MM-DD"
            :clearable="false"
            :readonly="readonly"
          />
        </van-col>
        <van-col span="2">
          <div>到</div>
        </van-col>
        <van-col span="11">
          <med-date-picker
            v-model="query.endTime"
            label=""
            placeholder="结束时间"
            formatter="YYYY-MM-DD"
            :clearable="false"
            :readonly="readonly"
          />
        </van-col>
      </van-row>
    </div>
    <div class="scroll-view">
      <div v-for="item in list" :key="item.code" class="list-container">
        <aianalysis-card :model="item" @showDetail="showDetail" />
      </div>
    </div>
  </div>
</template>

<script>
import aianalysisCard from './aianalysisCard.vue'
export default {
  name: 'aianalysisList',
  components: { aianalysisCard },
  data() {
    return {
      readonly: true,
      swichModel: false,
      query: {
        startTime: this.$route.query.startTime,
        endTime: this.$route.query.endTime,
        isKeyIndex: '',
        isUpToStandard: ''
      },
      indicatorsDic: [
        { text: '所有指标', value: '' },
        { text: '达标指标', value: '1' },
        { text: '不达标指标', value: '0' }
      ],
      list: []
    }
  },
  mounted() {
    this.getIntelligentAnalysis()
  },
  // 钩子方法
  created() {},
  computed: {},
  methods: {
    getIntelligentAnalysis() {
      this.query.isKeyIndex = this.swichModel ? '1' : ''
      this.$api.service.getIndexAnalysisList(this.query).then(res => {
        if (res.status === 200) {
          this.list = res.result
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    },
    showDetail(item) {
      this.$router.push({
        path: '/qc/detail/aianalysisDetail',
        query: {
          startTime: this.query.startTime,
          endTime: this.query.endTime,
          code: item.code,
          title: '指标详情',
          type: '2',
          buttonType: this.$route.query.buttonType
        }
      })
    },
    open() {
      this.$backhelper.push(() => {
        this.$refs.dropMenu.toggle(false)
        this.$refs.item.toggle(false)
      })
    },
    close() {
      this.$backhelper.pop()
    }
  },
  watch: {}
}
</script>

<style lang="less" scoped>
@import "@/views/index.less";
.med-ai-analysis-wrapper {
  .condition {
    background: #fff;
  }
  .condition-date {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .scroll-view {
    height: calc(100vh - 260px);
    overflow-y: auto;

    .list-container {
      padding: 8px 20px;
    }
  }
  /deep/ .van-dropdown-item {
    .van-cell__value {
      flex: none;
    }
  }
}
</style>
