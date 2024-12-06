<template>
  <div>
    <div class="score">
      <span v-if="required"
        :style="{ color: readonly ? 'rgb(154, 154, 154)' : 'red', 'padding-right': '0.05rem' }">*</span>
      <span :style="required ? 'color: #646566;' : 'color: #646566;padding-left: 0.25rem;'">{{ title }}</span>
      <span v-if="!readonly" class="score-button" @click="isShowScorePage = true">
        {{ formCard.gradeTime ? "修改评分" : "开始评分" }}</span>
      <div v-if="formCard.gradeTime" class="score-card">
        <div class="card-head">
          <div class="card-head-left"
            :style="readonly ? 'background-color: rgb(154, 154, 154);' : 'background-color: rgb(47, 89, 246);'" />
          <span :style="readonly ? 'color:rgb(154,154,154)' : ''">{{ formCard.gradeTime }}</span>
          <van-icon name="delete-o" color="red" style="right: -4.5rem;" @click="scoreDel(formCard.id)" v-if="!readonly" />
        </div>
        <div class="card-body">
          <div style="display: flex;">
            <span class="key-font">{{ label + "评分:" }}</span>
            <span :style="readonly ? 'color: rgb(154,154,154);flex: 2' : 'flex: 2'">{{ formCard.score }}</span>
          </div>
          <div style="display: flex;">
            <span class="key-font">评分结果:</span>
            <span :style="readonly ? 'color: rgb(154,154,154);flex: 2' : 'flex: 2'">{{ formCard.result }}</span>
          </div>
        </div>
      </div>
    </div>
    <med-popup-container v-model="isShowScorePage" :title="label + '评分'" @backClick="goBack">
      <template #right>
        <span style="font-size: 0.47rem;" @click="save">保存</span>
      </template>
      <div style="overflow: scroll;height: calc(100vh - 2.5rem);">
        <div class="score-page-head">
          <span>评分时间: {{ formScore.gradeTime }}</span>
          <br />
          <span>评分: {{ formScore.score }}</span>
          <span>结果: {{ formScore.result }}</span>
        </div>
        <med-fieldset v-for="( item, index ) in  list " :key="index" :legend="item.name">
          <med-radio-group v-model="item.value" :data-source="item.list" @input="selected(item)" :disabled="readonly" />
        </med-fieldset>
      </div>
    </med-popup-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dictionariesMixin from '@mixins/dictionariesMixin'
export default {
  name: 'TraumaAppScore',
  inject: ['readonly'],
  mixins: [dictionariesMixin],
  props: {
    value: {
      type: Object,
      default: () => { }
    },
    title: {
      type: String,
      default: '',
      required: true
    },
    label: {
      type: String,
      default: '',
      required: true
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShowScorePage: false,
      formCard: {},
      formScore: {},
      list: []
    }
  },
  computed: {
    ...mapGetters(['registId']),
    gradeType() {
      return this.label === 'GCS' ? '3' : this.title === '院内TI创伤评分' ? '2' : '1'
    }
  },
  methods: {
    goBack() {
      // 返回
      let result = false
      if (
        Object.keys(this.formCard).length > 0 &&
        Object.keys(this.formScore).length > 0
      ) {
        if (
          this.$moment(this.formCard.gradeTime)
            .toDate()
            .getTime() !==
          this.$moment(this.formScore.gradeTime)
            .toDate()
            .getTime()
        ) {
          result = true
        }
      } else if (
        Object.keys(this.formCard).length < 1 &&
        Object.keys(this.formScore).length > 0
      ) {
        result = true
      }
      if (result) {
        this.$dialog
          .confirm({
            title: '提示',
            message: '当前患者 ' + this.label + ' 评分未保存，请确认是否离开？',
            confirmButtonColor: 'rgb(94,116,254)'
          })
          .then(() => {
            // 关闭评分页面
            this.isShowScorePage = false
          })
          .catch(() => { })
      } else {
        // 关闭评分页面
        this.isShowScorePage = false
      }
    },
    selected(val) {
      // 选中事件
      // 评分时间
      this.$set(
        this.formScore,
        'gradeTime',
        this.$moment().format('YYYY-MM-DD HH:mm')
      )
      // 计算评分
      const sum = this.list
        .filter(el => el.value !== '')
        .map(item => item.value)
        .reduce((pre, cur, index, arr) => {
          return pre + Number(cur)
        }, 0)
      this.$set(this.formScore, 'score', sum)
      // 计算结果
      if (this.label === 'TI') {
        this.getDicListByKey('TIR_0006').forEach(el => {
          if (el.value.includes('<')) {
            if (this.formScore.score < el.value.split('<')[1]) {
              this.$set(this.formScore, 'result', el.label)
            }
          } else if (el.value.includes('>')) {
            if (this.formScore.score > el.value.split('>')[1]) {
              this.$set(this.formScore, 'result', el.label)
            }
          } else {
            this.$set(this.formScore, 'result', el.label)
          }
        })
      } else {
        this.getDicListByKey('GCSR_0004').forEach(el => {
          if (el.value.includes('-')) {
            const range = el.value.split('-')
            if (
              this.formScore.score >= range[0] &&
              range[1] >= this.formScore.score
            ) {
              this.$set(this.formScore, 'result', el.label)
            }
          } else {
            if (el.value == this.formScore.score) {
              this.$set(this.formScore, 'result', el.label)
            }
          }
        })
      }
    },
    save() {
      // 保存
      this.$dialog
        .confirm({
          title: '提示',
          message: '确定保存当前 ' + this.label + ' 评分吗?',
          confirmButtonColor: 'rgb(94,116,254)'
        })
        .then(() => {
          // 保存到数据库
          if (this.formScore.gradeTime) {
            const gradeDetail = this.list
              .filter(el => el.value.length !== 0)
              .map(el => {
                return { code: el.code, value: el.value }
              })
            this.formScore.gradeDetail = JSON.stringify(gradeDetail)
            this.formScore.gradeType = this.gradeType
            this.formScore.registId = this.registId
            this.$api.gradeUpdate(this.formScore).then(res => {
              if (res.code === '000000') {
                // 保存成功后将 formScore 赋值给 formCard
                this.formCard = {
                  ...this.formScore,
                  id: res.body
                }
                // 关闭评分页面
                this.isShowScorePage = false
              }
            })
          }
        })
        .catch(() => { })
    },
    scoreDel(id) {
      // 删除评分
      if (id) {
        this.$api.gradeDelete(id).then(res => {
          if (res.code === '000000') {
            this.formCard = {}
          }
        })
      }
    }
  },
  watch: {
    isShowScorePage(val) {
      if (val) {
        const initData = this.getCategory(this.label === 'TI' ? 'TI_' : 'GCS_')
        // 重新评分
        if (this.formCard.gradeDetail && this.formCard.gradeDetail.length > 0) {
          // 将 formCard 赋值给 formScore
          this.formScore = {
            ...this.formCard
          }
          // JSON转Object
          const gradeDetail = JSON.parse(this.formCard.gradeDetail)
          gradeDetail.forEach(elA => {
            initData.forEach(elB => {
              if (elA.code === elB.code) {
                elB.value = elA.value
              }
            })
          })
        }
        this.list = initData
      }
    },
    value: {
      immediate: true,
      handler(val) {
        if (val && Object.keys(val).length > 0) {
          this.formCard = val
        } else {
          this.formCard = {}
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.score {
  width: 96%;
  margin: 0.3rem auto;
  font-size: 0.4rem;
  padding-top: 0.1rem;

  .score-button {
    float: right;
    background-color: rgb(94, 116, 254);
    color: white;
    margin-right: 0.1rem;
    border-radius: 1rem;
    padding: 5px 0.2rem;
  }

  .score-card {
    width: 95%;
    box-shadow: 0px 5px 10px #a6a6a6;
    margin: 0.3rem auto;
    border-radius: 0.15rem;

    .key-font {
      flex: 1;
      color: #aaa;
    }

    .card-head {
      padding: 0.2rem;
      font-size: 0.38rem;
      display: flex;

      .card-head-left {
        width: 0.1rem;
        height: 0.4rem;
        border-radius: 1rem;
        margin-right: 0.1rem;
      }
    }

    .card-body {
      font-size: 0.4rem;

      >div {
        margin-left: 0.4rem;
        line-height: 0.7rem;
      }
    }
  }
}

.score-page-head {
  font-size: 0.36rem;
  line-height: 1.6;
  padding: 0.2rem 0.4rem;

  span:last-child {
    margin-left: 3rem;
  }
}
</style>
