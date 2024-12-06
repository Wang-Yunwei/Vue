<script>
import { mapGetters } from 'vuex'
export default {
  name: 'medications',
  data() {
    return {
      activeNames: [0],
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
      this.$api
        .getMedicationList({
          emId: this.emId,
          hospitalId: this.hospitalId + '_' + this.hospitalArea
        })
        .then(res => {
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
    <van-empty v-if="emptData" description="未查询到用药数据" :image="require('@assets/image/empty.png')" />
    <van-collapse v-else v-model="activeNames">
      <van-collapse-item v-for="(itemA, indexA) in list" :key="indexA" :title="itemA.enterDateTime.substring(0, 10)" :name="indexA">
        <div class="card-shadow">
          <table class="data-table">
            <colgroup>
              <col style="width:35%" />
              <col style="width:22%" />
              <col style="width:22%" />
              <col style="width:21%" />
            </colgroup>
            <tbody>
              <tr v-for="(itemB, indexB) in itemA.items" :key="indexB">
                <td>{{ itemB.orderText }}</td>
                <td>
                  {{ itemB.dosage }}&nbsp;{{
      itemB.dosageUnits ? itemB.dosageUnits : ""
    }}
                </td>
                <td>{{ itemB.administration }}</td>
                <td>{{ itemB.frequency }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>
<style lang="less" scoped>
.card-shadow {
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.2), 0 8px 10px 0 rgba(0, 0, 0, 0.2);
  padding: 0.3rem 0.2rem;
}

.data-table {

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
