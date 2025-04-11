<template>
  <div class="estimating-wrapper">
    <van-field
      :name="name"
      :label="label"
      @click="onFieldClick"
      :placeholder="placeholder"
      readonly
      :value="valueText"
      :required="required"
      :rules="rules"
    >
      <template #right-icon>
        <van-icon name="arrow" class="select-icon" />
      </template>
    </van-field>
    <med-popup-container v-model="show" hideHeader>
      <div
        :class="{ 'estimating-page-wrapper': true, 'view-mode': readonly }"
        @click.stop
      >
        <med-header :title="title || label" @backClick="onCancel" />
        <div style="padding-top: 2.1rem;">
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
            <van-field label="评分" :value="score"></van-field>
            <van-field label="结果" :value="result"></van-field>
          </div>
        </div>
        <van-collapse v-model="activePanel" accordion class="cards" ref="cards">
          <van-collapse-item
            v-for="(card, index) in cards"
            :key="card.id"
            :title="card.title"
            :name="index"
          >
            <van-radio-group
              :value="
                findValueItem(card.id) && findValueItem(card.id).content.value
              "
            >
              <van-cell-group>
                <van-cell
                  v-for="item in card.contentList"
                  :key="item.Id"
                  :value="item.SubName"
                  clickable
                  @click="handleCheck(card, item)"
                >
                  <template #icon>
                    <van-radio ref="checkboxes" :name="item.Id" />
                  </template>
                </van-cell>
              </van-cell-group>
            </van-radio-group>
            <template
              #value
              v-if="
                findValueItem(card.id) && findValueItem(card.id).content.value
              "
            >
              <div class="flex-c-e">{{ findScore(card) }}分</div>
            </template>
          </van-collapse-item>
        </van-collapse>
      </div>
      <template #bottom-part>
        <div class="bottom-bar flex-c-c">
          <van-button
            color="#333bd2"
            round
            class="confirm-btn"
            @click="handleConfirm"
            >确定
          </van-button>
        </div>
      </template>
    </med-popup-container>
    <van-popup v-model="showCalendar" position="bottom" get-container="body">
      <van-datetime-picker
        title="选择时间"
        type="datetime"
        item-height="1.2rem"
        :formatter="formatters"
        @confirm="handleSelectTime"
        @cancel="showCalendar = false"
        :value="form.time ? new Date(form.time) : undefined"
      />
    </van-popup>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import * as types from '@store/mutations/mutations-types'
import dateMixin from '@mixins/dateMixin'

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
    value: {
      type: String, // 评分主键id
      default: ''
    },
    // ↓用作参考的评分主键id,当value空时,自动带入参考评分细项,免重复填写
    referenceId: {
      type: String,
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
    required: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array
    },
    name: {
      type: String
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
      if (
        this.type === 'STROKE_MRS' &&
        this.form.estimateItemList[0]?.content?.value === 'MRS_0'
      ) {
        return '未评'
      }
      return this.score === undefined || !this.value
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
      // 是否带入参考评分作为预设
      const isReference = !this.value && this.referenceId
      const matched = this.gradingResults.find(
        r => r.id === (this.value || this.referenceId)
      )
      if (matched) {
        result = {
          ...(isReference ? {} : matched),
          estimateItemList: matched.estimateItemList?.map(item => {
            return {
              ...(isReference ? {} : item),
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
          id: item.id,
          title: item.label,
          classify: item.classify,
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
        return this.score >= parseFloat(start) && this.score <= parseFloat(end)
      })
      return matched?.label
    },
    score() {
      let score
      if (this.form.estimateItemList?.length) {
        this.form.estimateItemList.forEach(item => {
          const { type, value } = item.content || {}
          const matchedCard = this.cards.find(card => card.id === type)
          if (matchedCard) {
            const matchedItem = matchedCard.contentList.find(
              ele => ele.Id === value
            )
            if (matchedItem) {
              const numVal = parseInt(matchedItem.Value) || 0
              // 9分的项为特殊项, 累计分值时需排除
              score = (score || 0) + (numVal === 9 ? 0 : numVal)
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
    onFieldClick() {
      this.show = true
      if (!this.value && this.referenceId) {
        setTimeout(() => {
          this.$dialog({
            title: '自动填入提示',
            message: '已为您自动填入首次评分数据供参考'
          })
        }, 300)
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
    },
    findScore(cardItem) {
      let score = 0
      const valueItem = this.findValueItem(cardItem.id)
      if (valueItem) {
        const { value } = valueItem.content
        if (value) {
          const { contentList = [] } = cardItem
          const matched = contentList.find(ele => ele.Id === value)
          if (matched) {
            score = matched.Value
          }
        }
      }
      return Number(score)
    },
    onCancel() {
      this.show = false
      this.getDetail()
    },
    async handleConfirm() {
      if (this.form?.estimateItemList?.length < this.cards?.length) {
        const checkedIds = this.form?.estimateItemList.map(
          item => item?.content?.type
        )
        const index = this.cards.findIndex(
          card => !checkedIds.includes(card.id)
        )
        if (index > -1) {
          const firstEmptyItem = this.cards[index]
          this.$toast(`请填写${firstEmptyItem.title}`)
          if (this.$refs?.cards?.$el?.children) {
            setTimeout(
              () => {
                this.$refs.cards.$el.children[index].scrollIntoView({
                  behavior: 'smooth'
                })
              },
              this.activePanel === index ? 0 : 300
            )
          }
          this.activePanel = index
        }
        return
      }
      await this.handleSave()
      this.show = false
    },
    clearForm(oVal) {
      const matchedIndex = this.gradingResults.findIndex(r => r.id === oVal)
      if (matchedIndex >= 0) {
        const newResult = [...this.gradingResults]
        newResult.splice(matchedIndex, 1)
        this[types.SET_GRADINGRESULTS](newResult)
      }
    },
    handleSelectTime(val) {
      this.form.time = this.$moment(val).format(formatStr)
      this.manuallytime = this.form.time
      this.showCalendar = false
    },
    handleCheck(card, item) {
      const matched = this.findValueItem(card.id)
      if (matched) {
        matched.content = {
          ...matched.content,
          value: item.Id,
          classify: card.classify || ''
        }
      } else {
        const newItem = {
          content: {
            classify: card.classify || '',
            type: card.id,
            value: item.Id
          }
        }
        if (this.form.estimateItemList) {
          this.form.estimateItemList.push(newItem)
        } else {
          this.form.estimateItemList = [newItem]
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
          // 保存后触发事件送出对象
          this.$emit('change', { ...payload, id: newValue })
        }
        this.getDetail()
      }
    }
  },
  watch: {
    // form: {
    //   handler(nVal, oVal) {
    //     if (!nVal.preventWatch) {
    //       this.handleSave()
    //     }
    //     delete this.form.preventWatch
    //   },
    //   deep: true
    // },
    value: {
      immediate: true,
      handler(nVal, oVal) {
        if (nVal) {
          this.getDetail()
        } else {
          this.clearForm(oVal)
        }
      }
    },
    curGradingResult: {
      handler(nVal) {
        const obj = JSON.parse(JSON.stringify(nVal))
        const isApplyReferValue =
          Object.keys(obj).length === 1 && obj.estimateItemList?.length
        const isEmpty = !Object.keys(obj).length
        this.form = { ...obj, preventWatch: true }
        if (isEmpty || isApplyReferValue) {
          // 初始化时间
          this.form.time = this.$moment().format(formatStr)
          this.form.estimateItemList = obj.estimateItemList || []
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
