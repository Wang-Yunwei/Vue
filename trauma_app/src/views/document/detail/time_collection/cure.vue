<template>
  <div>
    <div>
      <div class="task-part-title">
        <span class="solid" />
        <span>抢救措施</span>
      </div>
      <med-fast-date-field v-for="(item, index) in listA" :key="index" :label="item.name" v-model="item.value"
        :required="item.required" @confirm="updateTime(item)" class="red-label" :disabled="readOnly" />
    </div>
    <div>
      <div class="task-part-title">
        <span class="solid" />
        <span>手术记录</span>
      </div>
      <med-fast-date-field v-for="(item, index) in listB" :key="index" :label="item.name" v-model="item.value"
        :required="item.required" @confirm="updateTime(item)" class="red-label" :disabled="readOnly" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'cure',
  data() {
    return {
      listA: [],
      listB: []
    }
  },
  activated() {
    this.details()
  },
  mounted() {
    this.details()
  },
  computed: {
    ...mapGetters(['registId', 'readOnly'])
  },
  methods: {
    updateTime(item) {
      this.$emit('update', item)
    },
    details() {
      // 查询数据
      this.$api
        .selectTimeAxis({
          registId: this.registId,
          sign: 3
        })
        .then(res => {
          if (res.code === '000000' && res.body.length > 0) {
            this.listA = res.body.slice(0, 8)
            this.listB = res.body.slice(8)
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .van-cell-group {
  margin: 0.1rem auto;
  padding-bottom: 0.3rem;

  &>div {
    padding: 0rem 0.2rem 0rem 0.2rem;

    &>i {
      font-size: 0.45rem;
      margin-bottom: 0.3rem;
    }
  }
}

/deep/ .van-button.van-button--warning {
  color: #333bd2;
  border-color: #333bd2;
}
</style>
