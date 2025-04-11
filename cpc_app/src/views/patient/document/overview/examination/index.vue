<template>
  <div class="task-preliminary-diagnosis-wrapper">
    <div v-for="(item, key) in examination" :key="key">
      <div class="center">
        <van-cell class="card-item">
          <div>
            <div style="text-align: center;">
              {{ item?.examClass }} {{ item?.examSubClass }}
              {{ item?.examPara }}
            </div>
          </div>
          <p>
            <span>报告时间:</span><span>{{ item?.reportTime }}</span>
          </p>
          <p>
            <span>结论:</span>
            <span>{{ item?.conclusion }}</span>
          </p>
          <p>
            <span>检查所见:</span><span>{{ item?.description }}</span>
          </p>
        </van-cell>
      </div>
    </div>
    <van-empty
      :image="require('@assets/image/empty.png')"
      description="未查询到检查信息"
      v-if="!hasExamination" />
  </div>
</template>
<script>
import hospitalMixin from '@mixins/hospitalMixin'
import { mapGetters } from 'vuex'

export default {
  name: 'Examination',
  mixins: [hospitalMixin],
  props: {},
  data() {
    return {
      infoComingType: this.$route.query.infoComingType,
      emId: this.$route.query.emId,
      examination: undefined
    }
  },
  async created() {
    // 查询检查信息
    this.getExamination()
  },
  computed: {
    ...mapGetters(['dictionary']),
    /**
     * 是否有检查项目
     * @returns {number}
     */
    hasExamination() {
      return this.examination && Object.keys(this.examination).length
    }
  },
  methods: {
    getExamination() {
      if (!this.emId || !this.infoComingType) {
        return
      }
      this.$api.preview
        .getInspectList(this.emId, this.infoComingType, this.hospitalAndArea())
        .then(({ result }) => {
          this.$preventWatch(() => {
            if (!result) {
              return
            }
            if (result.examination && Object.keys(result.examination).length) {
              this.examination = result.examination
              delete this.examination.examinationReportList
            }
          })
        })
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
