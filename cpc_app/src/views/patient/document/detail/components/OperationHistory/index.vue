<template>
  <med-view-container
    class="op-his-wrapper"
    @return="backClick"
    title="操作日志"
  >
    <div class="time-axis">
      <ul
        class="time-axis__content van-tabs__content"
        v-if="logs && logs.length"
      >
        <li class="time-axis__item" v-for="item in logs" :key="item.id">
          <div class="flex-c-s">
            <van-icon :name="item.actionTime ? 'clock' : 'clock-o'" />
            <div class="time-axis__title">
              <p>{{ item.actionName }}</p>
            </div>
            <div class="time-axis__time">
              <template>
                <div>
                  {{
                    item.actionTime
                      ? $moment(item.actionTime).format('YYYY-MM-DD HH:mm')
                      : ''
                  }}
                </div>
              </template>
            </div>
          </div>
          <div class="time-details" v-if="item.name">
            <p>
              <span>
                {{ item.name }}
              </span>
            </p>
          </div>
          <div class="time-details" v-if="item.comments">
            <p>
              <span> 【原因】{{ item.comments }} </span>
            </p>
          </div>
        </li>
      </ul>
      <van-empty
        :image="require('@assets/image/empty.png')"
        description="暂无数据"
        v-if="!logs || !logs.length"
      />
    </div>
  </med-view-container>
</template>

<script>
export default {
  // 操作日志
  name: 'OpHistory',
  props: {
    registId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      logs: []
    }
  },
  created() {
    this.getOperationHistory(this.registId)
  },
  computed: {},
  methods: {
    /**
     * 获取操作日志
     */
    getOperationHistory(registId) {
      this.$api.log.getOperationHistory(registId).then(({ result }) => {
        this.logs = [...result]
      })
    },
    backClick() {
      this.$emit('backClick')
    }
  }
}
</script>

<style lang="less" scoped>
@import 'index.less';
</style>
