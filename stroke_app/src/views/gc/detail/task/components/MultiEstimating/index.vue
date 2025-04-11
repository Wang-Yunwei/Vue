<template>
  <div class="estimating-wrapper">
    <van-field
      :label="label"
      @click="show = true"
      :placeholder="placeholder"
      readonly
      :value="valueText"
    >
      <template #right-icon>
        <van-icon name="arrow" class="select-icon" />
      </template>
    </van-field>
    <med-popup-container
      v-model="show"
      :title="title || label"
      @return="show = false"
    >
      <div
        :class="{ 'estimating-page-wrapper': true, 'view-mode': readonly }"
        @click.stop
      >
        <van-field
          label="评分时间"
          @click="showCalendar = true"
          placeholder="请选择时间"
          readonly
          :value="formatDate(form.time)"
        >
          <template #right-icon>
            <i class="iconfont iconicon1svg-52"></i>
          </template>
        </van-field>
        <div class="flex-c-b">
          <van-field
            label="评分"
            :value="score"
            :placeholder="placeholderScore"
          >
            <template #right-icon>
              分
            </template>
          </van-field>
          <van-field label="结果" :value="result"></van-field>
        </div>
        <van-collapse v-model="activePanel" accordion class="cards">
          <van-collapse-item
            v-for="(card, index) in cards"
            :key="card.id"
            :title="card.title"
            :name="index"
          >
            <van-checkbox-group :value="checkboxValue(card.id)">
              <van-cell-group>
                <van-cell
                  v-for="item in card.contentList"
                  :key="item.Id"
                  :value="item.SubName"
                  clickable
                  @click="handleCheck(card, item.Id)"
                >
                  <template #right-icon>
                    <van-checkbox ref="checkboxes" :name="item.Id" />
                  </template>
                </van-cell>
              </van-cell-group>
            </van-checkbox-group>
          </van-collapse-item>
        </van-collapse>
      </div>
    </med-popup-container>
    <van-popup v-model="showCalendar" position="bottom" get-container="body">
      <van-datetime-picker
        type="datetime"
        item-height="1.2rem"
        title="选择时间"
        @confirm="handleSelectTime"
        @cancel="showCalendar = false"
        :formatter="formatters"
        :value="form.time ? new Date(form.time) : undefined"
      />
    </van-popup>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import * as types from '@store/mutations/mutations-types'
import dateMixin from '@mixins/dateMixin'

const formatStr = 'YYYY-MM-DD HH:mm:ss'

export default {
  name: 'MultiEstimating',
  props: {
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
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
    type: {
      required: true,
      type: String, // 评分类型编码
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  mixins: [dateMixin],
  data() {
    return {
      show: false,
      showCalendar: false,
      activePanel: 0,
      manuallytime: '',
      form: {
        time: this.$moment().format(formatStr),
        value: 0,
        estimateItemList: []
      }
    }
  },
  computed: {
    ...mapGetters([
      'hospitalId',
      'gradingTemps',
      'gradingScales',
      'gradingResults'
    ]),
    valueText() {
      return this.score === undefined
        ? ''
        : `${this.score}分 ${this.result || ''}`
    },
    registId() {
      return this.$route.query.registId
    },
    curTemp() {
      return this.gradingTemps[this.type] || []
    },
    curGradingResult() {
      let result = {}
      const matched = this.gradingResults.find(r => r.id === this.value)
      if (matched) {
        result = {
          ...matched,
          estimateItemList: matched.estimateItemList?.map(item => {
            return {
              ...item,
              content: JSON.parse(item.content)
            }
          })
        }
      }
      return result
    },
    cards() {
      return this.curTemp.map(item => {
        // eslint-disable-next-line no-eval
        const contentList = eval(item.content) || []
        return {
          classify: item.classify,
          id: item.id,
          title: item.label,
          contentList
        }
      })
    },
    curScale() {
      const key = Object.keys(this.gradingScales).find(key => {
        const [prefix, type] = key.split('_')
        return this.type.includes(type)
      })
      return this.gradingScales[key] || []
    },
    result() {
      if (!this.score) {
        return ''
      }
      const matched = this.curScale.find(item => {
        const [start, end] = item.value.split('-')
        const inRange = end
          ? this.score >= parseFloat(start) && this.score <= parseFloat(end)
          : `${this.score}` === `${start}`
        return inRange
      })
      return matched?.label
    },
    placeholderScore() {
      const contentList = this.cards[0]?.contentList || []
      const score = contentList[contentList.length - 1]?.Value ?? ''
      return score + ''
    },
    score() {
      let score
      if (this.form.estimateItemList?.length) {
        this.form.estimateItemList.forEach(item => {
          const { type, value } = item.content || {}
          const matchedCard = this.cards.find(card => card.id === type)
          if (matchedCard) {
            const matchedItems = matchedCard.contentList.filter(ele =>
              value.includes(ele.Id)
            )
            if (matchedItems?.length) {
              const sum = matchedItems.reduce((result, cur) => {
                return result + cur.Value
              }, 0)
              const lastItem =
                matchedCard.contentList[matchedCard.contentList.length - 1]
              const lastItemChecked = matchedItems.includes(lastItem)
              score = lastItemChecked ? lastItem.Value : lastItem.Value + sum
            }
          }
        })
      }

      return score
    }
  },
  methods: {
    ...mapMutations(types),
    ...mapActions(['getGradingResults']),
    checkboxValue(id) {
      const matchedItem = this.findValueItem(id)
      const valueStr = matchedItem?.content?.value
      return valueStr ? valueStr.split(',') : []
    },
    clearForm() {
      const matchedIndex = this.gradingResults.findIndex(
        r => r.id === this.value
      )
      const newResult = [...this.gradingResults]
      newResult.splice(matchedIndex, 1)
      this[types.SET_GRADINGRESULTS](newResult)
    },
    handleSelectTime(val) {
      this.form.time = this.$moment(val).format(formatStr)
      this.manuallytime = this.form.time
      this.showCalendar = false
    },
    backClick() {
      this.$emit('backClick')
    },
    handleCheck(card, id) {
      const matched = this.findValueItem(card.id)

      const { contentList, classify = '' } = card
      if (matched) {
        const lastItem = contentList[contentList.length - 1]
        const isCheckingLastItem = lastItem?.Id === id
        const valueStr = matched?.content?.value
        const valueArr = valueStr ? valueStr.split(',') : []
        let newValueArr = valueArr.includes(id)
          ? valueArr.filter(val => val !== id)
          : valueArr.concat([id])

        if (isCheckingLastItem && !valueArr.includes(id)) {
          newValueArr = [id]
        } else if (!isCheckingLastItem && valueArr.includes(lastItem?.Id)) {
          newValueArr = newValueArr.filter(val => val !== lastItem?.Id)
        }

        matched.content = {
          ...matched.content,
          value: newValueArr.join(),
          classify
        }
      } else {
        const newItem = {
          content: {
            type: card.id,
            value: id,
            classify
          }
        }
        if (this.form.estimateItemList) {
          this.form.estimateItemList.push(newItem)
        } else {
          this.$set(this.form, 'estimateItemList', [newItem])
        }
      }
      this.$forceUpdate()
    },
    findValueItem(id) {
      return this.form.estimateItemList?.find(ele => ele.content?.type === id)
    },
    async getDetail() {
      await this.getGradingResults(this.registId)
    },
    async handleSave() {
      const now = this.manuallytime || this.$moment().format(formatStr)

      const payload = {
        ...this.form,
        time: now,
        value: this.score,
        registId: this.registId,
        code: this.type,
        description: this.label,
        title: this.label,
        name: this.label,
        id: this.value,
        estimateItemList:
          this.form?.estimateItemList?.map(item => {
            return {
              ...item,
              content: JSON.stringify(item.content)
            }
          }) || []
      }
      const res = await this.$api.estimate.saveEstimate(payload)
      if (res?.status === 200) {
        const newValue = res.result
        if (this.value !== newValue) {
          this.$emit('input', newValue)
        }
        this.getDetail()
      }
    },
    formatters(type, val) {
      if (type === 'year') {
        return `${val}年`
      } else if (type === 'month') {
        return `${val}月`
      } else if (type === 'day') {
        return `${val}日`
      } else if (type === 'hour') {
        return `${val}时`
      } else if (type === 'minute') {
        return `${val}分`
      }
      return val
    }
  },
  watch: {
    form: {
      handler(nVal, oVal) {
        if (!nVal.preventWatch) {
          this.handleSave()
        }
        delete this.form.preventWatch
      },
      deep: true
    },
    value: {
      immediate: true,
      handler(nVal) {
        if (nVal) {
          this.getDetail()
        } else {
          this.clearForm()
        }
      }
    },
    curGradingResult: {
      handler(nVal) {
        const strObj = JSON.stringify(nVal)
        this.form = {
          ...JSON.parse(strObj),
          ...(strObj === '{}'
            ? { time: this.$moment().format(formatStr), estimateItemList: [] }
            : {}),
          preventWatch: true
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
