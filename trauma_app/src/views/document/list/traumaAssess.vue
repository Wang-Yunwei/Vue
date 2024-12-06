<template>
  <med-popup-container title="创伤评估" v-bind="$attrs" v-on="$listeners">
    <div style="overflow: scroll;height: calc(100vh - 3rem)">
      <IssAis v-model="issGradeList" />
      <div class="split-lines" />
      <Score v-model="tiFrontForm" title="院前TI创伤评分" label="TI" />
      <div class="split-lines" />
      <Score v-model="tiInnerForm" title="院内TI创伤评分" label="TI" />
      <div class="split-lines" />
      <Score v-model="gcsForm" title="GCS评分" label="GCS" />
      <div class="split-lines" />
    </div>
  </med-popup-container>
</template>

<script>
import { mapGetters } from 'vuex'


export default {
  name: 'traumaAssess',
  components: {
    IssAis: () => import('@/views/document/detail/document/tabs/components/IssAis.vue'),
    Score: () => import('@/views/document/detail/document/tabs/components/Score.vue')
  },
  model: {
    prop: 'show',
    event: '_change'
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  provide() {
    return {
      readonly: this.readonly
    }
  },
  data() {
    return {
      tiFrontForm: {},
      tiInnerForm: {},
      gcsForm: {},
      issGradeList: []
    }
  },
  computed: {
    ...mapGetters(['registId'])
  },
  methods: {
    gradeList() {
      // 查询评分列表
      this.$api.groupGrades(this.registId).then(res => {
        if (res.code === '000000') {
          this.tiFrontForm = res.body[1] ? res.body[1][0] : {}
          this.tiInnerForm = res.body[2] ? res.body[2][0] : {}
          this.gcsForm = res.body[3] ? res.body[3][0] : {}
          this.issGradeList = res.body[4] || []
        }
      })
    }
  },
  watch: {
    isShow(val) {
      if (val) {
        this.gradeList()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.split-lines {
  background-color: rgb(239, 239, 239);
  height: 0.1rem;
}
</style>
