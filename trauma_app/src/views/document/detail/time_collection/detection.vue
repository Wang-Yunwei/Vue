<template>
  <div>
    <div>
      <div class="task-part-title">
        <span class="solid" />
        <span>接诊</span>
      </div>
      <med-fast-date-field
        v-for="(item, index) in listA"
        :key="index"
        :label="item.name"
        v-model="item.value"
        :required="item.required"
        @confirm="updateTime(item)"
        class="red-label"
        :disabled="readOnly"
      />
    </div>
    <div>
      <div class="task-part-title">
        <span class="solid" />
        <span>辅助检查</span>
      </div>
      <med-fast-date-field
        v-for="(item, index) in listB"
        :key="index"
        :label="item.name"
        v-model="item.value"
        :required="item.required"
        @confirm="updateTime(item)"
        class="red-label"
        :disabled="readOnly"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'detection',
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
    ...mapGetters(['registId', 'readOnly', 'visitType'])
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
          sign: 2
        })
        .then(res => {
          if (res.code === '000000' && res.body.length > 0) {
            let split = 7
            if (['01', '02'].includes(this.visitType)) {
              res.body.shift()
              split = 5
            }
            this.listA = res.body.slice(0, split)
            this.listB = res.body.slice(split)
          }
        })
    }
  },
  watch: {
    visitType() {
      this.details()
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .van-cell-group {
  margin: 0.1rem auto;
  padding-bottom: 0.3rem;

  & > div {
    padding: 0rem 0.2rem 0rem 0.2rem;

    & > i {
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
