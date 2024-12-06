<script>
import { mapGetters } from 'vuex'
import dictionariesMixin from '@mixins/dictionariesMixin'
export default {
  name: 'inspectionPickRead',
  mixins: [dictionariesMixin],
  data() {
    return {
      activeNames: [],
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
      this.$api.getInspectList({
        emId: this.emId,
        hospitalId: this.hospitalId + '_' + this.hospitalArea
      }).then(res => {
        if (res.code === '000000') {
          if (res.body && Object.keys(res.body).length > 0) {
            this.emptData = false
            this.list = res.body
          } else {
            this.emptData = true
          }
        }
      })
    }
  }
}
</script>
<template>
  <div>
    <van-empty v-if="emptData" description="未查询到检验数据" :image="require('@assets/image/empty.png')" />
    <van-collapse v-else v-model="activeNames">
      <van-collapse-item v-for="(itemA, indexA) in list" :key="indexA" :title="itemA.testCause" :name="indexA">
        <div>
          <p style="color: black;margin-bottom: 0.1rem;">报告时间: {{ itemA.reportTime }}</p>
          <table class="data-table" style="width: 100%;">
            <thead>
              <tr>
                <th>项目名</th>
                <th>结果</th>
                <th>标识</th>
                <th>参考值</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(itemB, indexB) in itemA.labResultList" :key="indexB">
                <td>{{ itemB.reportItemName }}</td>
                <td>{{ itemB.result }}{{ itemB.units ? itemB.units : '' }}</td>
                <td>{{ itemB.abnormalIndicator }}</td>
                <td>{{ itemB.referenceResult }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>
<style lang="less" scoped>
.data-table {

  thead {
    border-bottom: 2px solid #ddd;
    color: black;
    text-align: left;
  }

  td,
  th {
    padding: 16px 8px;
    line-height: 32px;
  }

  th {
    font-weight: 600;
  }

  td {
    color: #999;
    font-size: 26px;
  }

}
</style>
