<script>
import { mapGetters } from 'vuex'
import dictionariesMixin from '@mixins/dictionariesMixin'
export default {
  name: 'checkPickRead',
  mixins: [dictionariesMixin],
  data() {
    return {
      list: [],
      emptData: true
    }
  },
  activated() {
    this.getDetails()
  },
  mounted() {
    this.getDetails()
  },
  computed: {
    ...mapGetters(['emId', 'hospitalId', 'hospitalArea'])
  },
  methods: {
    getDetails() {
      this.$api.getExamineList({
        emId: this.emId,
        hospitalId: this.hospitalId + '_' + this.hospitalArea
      }).then(res => {
        if (res.code === '000000') {
          if (Object.keys(res.body).length !== 0) {
            this.emptData = false
          }
          this.list = res.body
        }
      })
    }
  }
}
</script>
<template>
  <div>
    <van-empty v-if="emptData" description="未查询到检查数据" :image="require('@assets/image/empty.png')" />
    <div v-else>
      <div v-for="(item, index) in list" :key="index" style="background-color: white;margin-top: 0.1rem;">
        <div class="cell">
          <span style="display: flex;justify-content: center;margin-bottom: 0.3rem;">{{ item.examClass + ' ' +
      item.examSubClass + ' ' + item.examPara }}</span>
          <p>
            <span style="margin-right: 3rem;">报告时间:</span>
            <span>{{ item.reportTime }}</span>
          </p>
          <p>
            <span style="margin-bottom: 0.3rem;">结论:</span>
          <p style="width: 95%;margin-left: 0.3rem;">
            {{ item.conclusion }}
          </p>
          </p>
          <p>
            <span>检查所见:</span>
          <p style="width: 95%;margin-left: 0.3rem;">
            {{ item.description }}
          </p>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.cell {

  color: #969799;
  font-size: 0.373333rem;
  padding: 0.2rem;

  >p {
    line-height: 0.5rem;
    margin-top: 0.2rem;
  }

}
</style>
