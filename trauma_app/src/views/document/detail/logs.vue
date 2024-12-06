<template>
  <med-popup-container title="操作日志" v-bind="$attrs" v-on="$listeners">
    <div class="time-axis" style="height: calc(100vh - 2rem); overflow: auto;">
      <ul class="time-axis__content van-tabs__content" v-if="list && list.length">
        <li class="time-axis__item" v-for="(item, index) in list" :key="index">
          <div class="flex-c-s">
            <van-icon :name="item.opTime ? 'clock' : 'clock-o'" />
            <div class="time-axis__title">
              <p>{{ item.opName }}</p>
            </div>
            <div class="time-axis__time">
              <template>
                <div>
                  {{ item.opTime ? $moment(item.opTime).format("YYYY-MM-DD HH:mm") : "" }}
                </div>
              </template>
            </div>
          </div>
          <div v-if="item.opBy" style="padding:0 0.78rem;font-size: 0.36rem;">
            <p style="margin-bottom: 0.1rem;">{{ item.opBy }}</p>
            <p v-if="item.remark" style="line-height: 0.5rem;">【原因】{{ item.remark }}</p>
          </div>
        </li>
      </ul>
      <van-empty :image="require('@assets/image/empty.png')" description="暂无数据" v-if="!list || !list.length" />
    </div>
  </med-popup-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'logs',
  model: {
    prop: 'show',
    event: '_change'
  },
  props: ['isShow'],
  data() {
    return {
      operationLog: {
        '0': '病历建档',
        '1': '提交审核',
        '2': '审核通过',
        '3': '审核驳回',
        '4': '存档',
        '5': '存档驳回',
        '6': '上报'
      },
      list: []
    }
  },
  computed: {
    ...mapGetters(['registId'])
  },
  methods: {
    operationLogs() {
      // 查询操作日志
      this.$api.operationLogs(this.registId).then(res => {
        if (res.code === '000000' && res.body.length > 0) {
          res.body.forEach(el => {
            el.opName = this.operationLog[el.opType]
          })
          this.list = res.body
        }
      })
    }
  },
  watch: {
    isShow(val) {
      if (val) {
        this.operationLogs()
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import "@/assets/styles/common/time/time-axis";
</style>
