<template>
  <div>
    <med-view-container @back-click="jumpToDetails" class="med-view-wrapper">
      <div
        v-for="item in details"
        :key="item.value"
        :title="item.name"
        :name="item.value"
      >
        <div class="card-tem">
          <div class="top flex-c-s">
            <div class="side">
              <p>来院方式</p>
            </div>
            <span>2021-10-10 10:10:10</span>
            <span>车牌号</span>
          </div>
          <div class="center">
            <p>
              <span>{{ item.name }}</span>
              <span>{{ item.gender }}</span>
              <span>{{ item.age }}岁</span>
              <span>症状</span>
            </p>
            <p>呼救时间:2021-10-10 10:10:10</p>
          </div>
          <div class="bottom flex-c-b">
            <van-icon />
            <div class="btns">
              <van-button round>绑定</van-button>
            </div>
          </div>
        </div>
      </div>
    </med-view-container>
  </div>
</template>

<script>
export default {
  // 卒中档案:已归档
  name: 'Filing',
  data() {
    return {
      details: [],
      medswmgcentity: {
        type: '0',
        name: ''
      },
      medswmgcl: {
        id: '',
        isCompleted: '1'
      }
    }
  },
  // 钩子方法
  async created() {
    // 获取基本信息
    this.getBasicInformation()
  },
  methods: {
    jumpToDetails(item) {
      this.$router.push({
        path: '/gc'
      })
    },
    // 查询基本信息
    getBasicInformation() {
      this.$api.filing
        .getBasicInformation(this.medswmgcentity.type, this.medswmgcentity.name)
        .then(res => {
          this.details = res.result
        })
    },
    // 撤回患者信息
    withdraw(item) {
      this.medswmgcl.id = item.id
      this.$api.filing.insertBasicInformation(this.medswmgcl).then(res => {})
      // 撤回之后再次查询
      this.getBasicInformation()
    }
  }
}
</script>

<style lang="less" scoped>
@import "@/assets/styles/common/document/view.less";
</style>
