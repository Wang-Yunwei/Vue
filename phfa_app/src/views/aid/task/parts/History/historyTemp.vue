<template>
  <div class="task-disease-category-wrapper">
    <med-header title="病史模板" @backClick="onClickLeft" />
    <van-cell-group inset class="select-history">
      <van-cell><med-select v-model="historyTemp" :options="historyList" @select="handleSelect" placeholder="选择病史" />
      </van-cell>
    </van-cell-group>
    <div class="fast-links">
      <van-button round type="default" size="mini" color="#e6eaf5" v-for="link in links" :key="link.value" @click="handleClickLink(link)">{{ link.label }}
      </van-button>
    </div>
    <div class="temp-content">
      <div class="temp-content__title">
        模板内容显示
      </div>
      <van-field v-model="form.content" rows="10" autosize type="textarea" readonly />
    </div>
    <van-button class="submit-button" color="#5e74fe" block round @click="handleSubmit">确认
    </van-button>
  </div>
</template>
<script>
import methodMixin from '@mixins/methodMixin'
export default {
  data() {
    return {
      form: {
        type: '',
        content: ''
      },
      historyTemp: '',
      historyList: [],
      originHistoryList: [],
      links: []
    }
  },
  methods: {
    init(type) {
      this.historyTemp = ''
      this.form.type = type
      this.form.content = ''
      this.getDropdownList(type)
    },
    getDropdownList(type) {
      const that = this
      this.$api.mptQueryList(type).then(res => {
        that.originHistoryList = res.body.map(item => ({
          value: item.id,
          label: item.tempName,
          diseaseType: item.diseaseType,
          content: item.tempContent
        }))
        that.historyList = [...this.originHistoryList]
      })
    },
    async getLinks() {
      const res = this.getCodeListByKey([
        'PHFA_0036' // 任务模板
      ])
      this.links = res.PHFA_0036
    },
    handleSelect(item) {
      this.form.content = item.content
    },
    handleSubmit() {
      this.$emit('submit', this.form)
    },
    handleClickLink(link) {
      this.historyTemp = ''
      this.form.content = ''
      this.historyList = this.originHistoryList.filter(
        ele => ele.diseaseType === link.value
      )
    },
    onClickLeft() {
      this.$emit('backClick')
    }
  },
  created() {
    this.getLinks()
  },
  watch: {
    '$route.path': {
      handler() {
        this.historyTemp = ''
        this.content = ''
      }
    }
  },
  mixins: [methodMixin]
}
</script>

<style lang="less" scoped>
.task-disease-category-wrapper {
  padding: 0.3rem 0.4rem;
  background-color: #f2f4f5;

  .select-history {
    margin: 0;

    /deep/ .van-cell {
      padding: 0.2rem 0.35rem;
    }
  }

  .fast-links {
    margin-top: 0.22rem;

    /deep/ .van-button {
      padding: 0 0.3rem;

      span {
        color: rgba(0, 0, 0, 0.5);
      }
    }

    /deep/ .van-button--mini+.van-button--mini {
      margin-left: 0.2rem;
    }
  }

  .temp-content {
    margin: 1rem 0;

    // margin-top: 1rem;
    // margin-bottom: 1.3rem;
    &__title {
      font-size: 0.36rem;
      margin: 0.2rem 0;
      color: #777;
    }

    /deep/ .van-cell {
      border-radius: 0.2rem;
    }
  }

  .submit-button {
    margin-bottom: 1.5rem;
  }
}
</style>
