<template>
  <div class="estimating-page-wrapper">
    <med-popup-container
      v-model="show"
      :title="title || label"
      @return="onCancel"
      scroll
    >
      <div @click.stop class="med-grace-wrapper">
        <div class="header">
          <med-date-picker
            v-model="form.scoreTime"
            label="评分时间"
            :min-date="minDate"
            :max-date="maxDate"
          />
          <div class="flex-c-b result">
            <van-field label="评分" readonly :value="totalScore"></van-field>
            <van-field label="结果" readonly :value="result"></van-field>
          </div>
        </div>
        <van-collapse v-model="activePanel" accordion ref="cards">
          <van-collapse-item
            v-for="(card, index) in cards"
            :key="card.id"
            :title="card.title"
            :name="index"
          >
            <van-radio-group
              v-model="card.value"
              class="item"
              v-if="card.controlType === 1"
              :disabled="disabled"
            >
              <van-cell-group>
                <van-cell
                  v-for="item in card.scoreDetails"
                  :key="item.Id"
                  :value="item.title"
                  :clickable="!disabled"
                  @click="handleCheck(card, item)"
                >
                  <template #icon>
                    <van-radio
                      ref="checkboxes"
                      :name="item.key"
                      :disabled="disabled"
                    />
                  </template>
                </van-cell>
              </van-cell-group>
            </van-radio-group>
            <van-checkbox-group
              v-model="card.value"
              class="item"
              v-else-if="card.controlType === 2"
              :disabled="disabled"
            >
              <van-cell-group>
                <van-cell
                  v-for="item in card.scoreDetails"
                  :key="item.Id"
                  :value="item.title"
                  :clickable="!disabled"
                  @click="handleCheck(card, item)"
                >
                  <template #icon>
                    <van-checkbox
                      :name="item.key"
                      shape="square"
                      :disabled="disabled"
                    ></van-checkbox>
                  </template>
                </van-cell>
              </van-cell-group>
            </van-checkbox-group>
            <template #value>
              <div class="flex-c-e">{{ findScore(card) }}分</div>
            </template>
          </van-collapse-item>
        </van-collapse>
      </div>
      <template #bottom-part>
        <div class="flex-c-c">
          <van-button
            class="save-btn"
            block
            round
            type="info"
            icon-position="left"
            size="normal"
            :disabled="disabled"
            @click="handleConfirm"
            >确定</van-button
          >
        </div>
      </template>
    </med-popup-container>
  </div>
</template>

<script>
import { GraceTemplate } from '@model/commonModel'

const formatStr = 'YYYY-MM-DD HH:mm:ss'

export default {
  name: 'Estimating',
  props: {
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    value: {
      type: String, // 评分主键id
      default: ''
    },
    input: {
      type: Function,
      default: () => {}
    },
    title: {
      type: String, // 二级页面标题
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array
    }
  },
  data() {
    return {
      hospitalId: this._permission().user.hospitalId,
      userId: this._permission().user.userId,
      show: false,
      showCalendar: false,
      activePanel: 0,
      manuallytime: '',
      form: {
        scoreTime: this.$moment().format(formatStr),
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
        scoreTime: this.$moment().format(formatStr),
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
      cards: GraceTemplate(),
      minDate: new Date(2020, 0, 10),
      maxDate: new Date(2025, 10, 1)
    }
  },
  mounted() {},
  computed: {
    registId() {
      return this.$route.query.registId
    },
    result() {
      const score = this.totalScore
      if (score > 140) {
        return '高危'
      } else if (score >= 109 && score <= 140) {
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
    showModel(val, initData) {
      this.show = val
      this.formTemp = initData
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
    onCancel() {
      this.show = false
    },
    async handleConfirm() {
      this.handleSave()
    },
    handleCheck(card, item) {
      if (this.disabled) return
      if (card.controlType === 1) {
        card.value = item.key
      } else if (card.controlType === 2) {
        if (card.value == null) card.value = []
        if (card.value.indexOf(item.key) > -1) {
          const index = card.value.indexOf(item.key)
          card.value.splice(index, 1)
        } else {
          card.value.push(item.key)
        }
      }
      this.$forceUpdate()
    },
    getDetail() {
      this.$api.service.getGrace(this.registId).then(res => {
        if (res.status === 200) {
          this.form = res.result
          if (this.form.itemAge == null) {
            this.form = this.formTemp
          }

          if (this.form != null) {
            const a = this.cards
            this.cards.forEach(opt => {
              if (opt.key === 'age') {
                opt.value = this.form.itemAge
              } else if (opt.key === 'age') {
                opt.value = this.form.itemAge
              } else if (opt.key === 'hr') {
                opt.value = this.form.itemHr
              } else if (opt.key === 'Sbp') {
                opt.value = this.form.itemSbp
              } else if (opt.key === 'Scr') {
                opt.value = this.form.itemScr
              } else if (opt.key === 'Killip') {
                opt.value = this.form.itemKillip
              } else if (opt.key === 'itemRisk') {
                opt.value = this.form.itemRisk
              }
            })
          }
        } else {
          this.$notify({ type: 'warning', message: res.message })
        }
      })
    },
    async handleSave() {
      this.cards.forEach(opt => {
        if (opt.key === 'age') {
          this.form.itemAge = opt.value
        } else if (opt.key === 'age') {
          this.form.itemAge = opt.value
        } else if (opt.key === 'hr') {
          this.form.itemHr = opt.value
        } else if (opt.key === 'Sbp') {
          this.form.itemSbp = opt.value
        } else if (opt.key === 'Scr') {
          this.form.itemScr = opt.value
        } else if (opt.key === 'Killip') {
          this.form.itemKillip = opt.value
        } else if (opt.key === 'itemRisk') {
          this.form.itemRisk = opt.value
        }
      })
      this.form.registId = this.registId
      this.form.scoreDoctor = this._permission().user.id
      this.form.scoreValue = this.totalScore
      if (this.form.scoreValue > 140) {
        this.form.scoreResult = '2'
      } else if (this.form.scoreValue >= 109 && this.form.scoreValue <= 140) {
        this.form.scoreResult = '3'
      } else if (this.form.scoreValue <= 108) {
        this.form.scoreResult = '4'
      }
      const res = await this.$api.service.saveGrace(this.form)
      if (res?.status === 200) {
        this.$emit('input', this.form)
        this.show = false
      }
    }
  },
  watch: {}
}
</script>

<style lang="less" scoped>
@import '@assets/styles/common/document/edit.less';
.med-grace-wrapper {
  .header > .result {
    /deep/ .van-field__label,
    .van-cell__title {
      min-width: 80px !important;
      width: 100px;
    }
  }
  .van-button {
    margin: 0;
  }
  /deep/ .van-collapse-item > .van-collapse-item__title {
    .van-cell__title {
      max-width: initial;
    }
    .van-cell__value {
      max-width: 100px;
    }
  }
  /deep/ .van-collapse-item .van-collapse-item__content {
    padding-bottom: 0 !important;
    padding-top: 0 !important;
  }

  .item {
    /deep/ .van-cell-group > .van-cell {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
    /deep/ .van-cell__value {
      padding-left: 10px;
    }
    /deep/ .van-cell::after {
      border-bottom: 0px;
    }
    /deep/ .van-cell-group::after {
      border-width: 0;
    }
  }
}
.med-view-container-wrapper {
  .flex-c-c {
    padding: 12px 0px;
  }
}
</style>
