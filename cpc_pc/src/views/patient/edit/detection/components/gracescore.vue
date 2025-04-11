<template>
  <div class="med-grace-wrapper" @click.stop>
    <el-row :gutter="24">
      <el-col :span="6">
        <med-text-field
          v-model="totalScore"
          label="Grace评估"
          readonly
          disabled
          append="分"
        />

      </el-col>
      <el-col :span="4">
        <med-text-field
          v-model="result"
          label="结果"
          readonly
          disabled
        />

      </el-col>
      <el-col :span="8">
        <med-datetime-field
          v-model="form.scoreTime"
          label="评分时间"
          :min-date="minDate"
          :max-date="maxDate"
        />
      </el-col>

      <el-col :span="4">
        <med-text-field
          v-model="form.doctor"
          label="评估医生"
          readonly
          disabled
        />
      </el-col>
    </el-row>

    <el-collapse ref="cards" v-model="activePanel">
      <el-collapse-item
        v-for="(card, index) in cards"
        :key="card.id"
        :title="card.title"
        :name="index"
      >
        <template slot="title">
          <div class="score-item-title">
            <div>{{ card.title }}</div>
            <med-text
              :value="findScore(card)"
              readonly
              disabled
              append="分"
            />
          </div>
        </template>
        <med-radio
          v-if="card.controlType === 1"
          v-model="card.value"
          class="item"
          :select-options="getScoreDetails(card.scoreDetails)"
          size="mini"
        />

        <med-checkbox
          v-if="card.controlType === 2"
          v-model="card.value"
          class="item"
          :select-options="getScoreDetails(card.scoreDetails)"
          size="mini"
        />

      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import moment from 'moment'
const formatStr = 'YYYY-MM-DD HH:mm:ss'
import graceTemplate from './graceTemplate'
import { mapGetters } from 'vuex'

export default {
  name: 'Estimating',
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    patientInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      hospitalId: '', // this._permission().user.hospitalId,
      userId: '', // this._permission().user.userId,
      show: false,
      showCalendar: false,
      activePanel: 0,
      manuallytime: '',
      form: {
        scoreTime: moment().format(formatStr),
        scoreValue: '',
        scoreDoctor: '',
        scoreReslut: '',
        itemAge: '',
        itemHr: '',
        itemSbp: '',
        itemScr: '',
        itemKillip: '',
        itemRisk: []
      },
      formTemp: {
        scoreTime: moment().format(formatStr),
        scoreValue: '',
        scoreDoctor: '',
        scoreReslut: '',
        itemAge: '',
        itemHr: '',
        itemSbp: '',
        itemScr: '',
        itemKillip: '',
        itemRisk: []
      },
      cards: graceTemplate(),
      minDate: new Date(2020, 0, 10),
      maxDate: new Date(2025, 10, 1),
      registId: this.$route.query.id,
      saved: false
    }
  },
  computed: {
    ...mapGetters(['user']),
    result() {
      const score = this.totalScore
      if (score > 140) {
        return '高危'
      } else if (score > 109 && score < 140) {
        return '中危'
      } else if (score <= 108) {
        return '低危'
      }
      return ''
    },
    totalScore() {
      let score = 0
      if (this.cards == null) return 0
      this.cards.forEach(opt => {
        if (opt.controlType === 1) {
          const matched = opt.scoreDetails.find(ele => ele.key === opt.value)
          if (matched) {
            score = score + matched.score
          }
        } else if (opt.controlType === 2) {
          if (opt.value != null) {
            opt.value.forEach(values => {
              const matched = opt.scoreDetails.find(ele => ele.key === values)
              if (matched) {
                score += matched.score
              }
            })
          }
        }
      })
      return Number(score)
    }
  },
  methods: {
    handleShow(initData, saved) {
      this.formTemp = initData
      this.saved = saved
      this.getDetail()
    },
    findScore(card) {
      let score = 0
      if (card == null) return 0
      if (card.controlType === 1) {
        const matched = card.scoreDetails.find(ele => ele.key === card.value)
        if (matched) {
          score = matched.score
        }
      } else if (card.controlType === 2) {
        if (card.value != null) {
          card.value.forEach(opt => {
            const matched = card.scoreDetails.find(ele => ele.key === opt)
            if (matched) {
              score += matched.score
            }
          })
        }
      }
      return Number(score)
    },
    getScoreDetails(items) {
      return items.map(t => {
        return {
          label: t.title,
          value: t.key
        }
      })
    },
    handleSave() {
      this.cards.forEach(opt => {
        if (opt.key === 'age') {
          this.data.itemAge = opt.value
        } else if (opt.key === 'age') {
          this.data.itemAge = opt.value
        } else if (opt.key === 'hr') {
          this.data.itemHr = opt.value
        } else if (opt.key === 'Sbp') {
          this.data.itemSbp = opt.value
        } else if (opt.key === 'Scr') {
          this.data.itemScr = opt.value
        } else if (opt.key === 'Killip') {
          this.data.itemKillip = opt.value
        } else if (opt.key === 'itemRisk') {
          this.data.itemRisk = opt.value
        }
      })
      this.data.registId = this.registId
      this.data.scoreDoctor = this.user.id
      this.data.scoreValue = this.totalScore
      if (this.data.scoreValue > 140) {
        this.data.scoreResult = '2'
      } else if (this.data.scoreValue >= 109 && this.data.scoreValue <= 140) {
        this.data.scoreResult = '3'
      } else if (this.data.scoreValue <= 108) {
        this.data.scoreResult = '4'
      }

      this.data.scoreTime = this.form.scoreTime
      this.data.doctor = this.form.doctor

      this.$emit('input', this.data)
    },
    handleCheck(card, value) {
      if (this.disabled) return
      if (card.controlType === 1) {
        card.value = value
      } else if (card.controlType === 2) {
        if (card.value == null) card.value = []
        if (card.value.indexOf(value) > -1) {
          const index = card.value.indexOf(value)
          card.value.splice(index, 1)
        } else {
          card.value.push(value)
        }
      }
      this.$forceUpdate()
    },
    getDetail() {
      // 优先从数据库或者上一次保存的数据中获取grace评分详情
      this.cards.forEach(opt => {
        if (opt.key === 'age') {
          opt.value = this.data.itemAge
        } else if (opt.key === 'hr') {
          opt.value = this.data.itemHr
        } else if (opt.key === 'Sbp') {
          opt.value = this.data.itemSbp
        } else if (opt.key === 'Scr') {
          opt.value = this.data.itemScr
        } else if (opt.key === 'Killip') {
          opt.value = this.data.itemKillip
        } else if (opt.key === 'itemRisk') {
          opt.value = this.data.itemRisk
        }
      })

      // 未点击确定的情况，使用当前已填写的内容覆盖原先数据
      if (this.formTemp !== null && !this.saved) {
        this.cards.forEach(opt => {
          if (opt.key === 'age') {
            opt.value = this.formTemp.itemAge
          } else if (opt.key === 'hr') {
            opt.value = this.formTemp.itemHr
          } else if (opt.key === 'Sbp') {
            opt.value = this.formTemp.itemSbp
          } else if (opt.key === 'Scr') {
            opt.value = this.formTemp.itemScr
          } else if (opt.key === 'Killip') {
            opt.value = this.formTemp.itemKillip
          } else if (opt.key === 'itemRisk') {
            opt.value = this.formTemp.itemRisk
          }
        })
      }
    }
  }
}
</script>

  <style lang="scss" scoped>
  .score-item-title {
    width:100%;
    display: flex;
    justify-content: space-between;

    .med-input-wrapper {
      width:120px;
      margin-right: 20px;
    }
  }
    // .med-grace-wrapper {
    // .header > .result {
    // .van-field__label,
    // .van-cell__title {
    // min-width: 80px !important;
    // width: 100px;
    // }
    // }
    // .van-button {
    // margin: 0;
    // }
    // .van-collapse-item > .van-collapse-item__title {
    // .van-cell__title {
    // max-width: initial;
    // }
    // .van-cell__value {
    // max-width: 100px;
    // }
    // }
    // .van-collapse-item .van-collapse-item__content {
    // padding-bottom: 0 !important;
    // padding-top: 0 !important;
    // }

    // .item {
    // .van-cell-group > .van-cell {
    // padding-left: 0 !important;
    // padding-right: 0 !important;
    // }
    // .van-cell__value {
    // padding-left: 10px;
    // }
    // .van-cell::after {
    // border-bottom: 0px;
    // }
    // .van-cell-group::after {
    // border-width: 0;
    // }
    // }
    // }
  </style>
