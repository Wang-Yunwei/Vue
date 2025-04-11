<template>
  <div class="estimating-wrapper">
    <el-row type="flex" :gutter="8" style="flex-wrap: nowrap">
      <el-col><el-input v-bind="$attrs" readonly :value="valueText" /></el-col>
      <el-col><el-button
        type="primary"
        icon="form"
        @click="show = true"
      >{{ disabled ? '查看' : '评分' }}</el-button></el-col>
    </el-row>
    <el-dialog
      :visible.sync="show"
      :title="modalTitle"
      width="1200px"
      @click.stop
    >
      <el-form inline :model="form" label-width="80px">
        <el-row>
          <el-col
            :span="4"
          ><el-form-item label="得分">
            <el-input
              readonly
              :value="score"
              suffix="分"
              style="width: 100px"
            /></el-form-item></el-col>
          <el-col :span="7">
            <el-form-item label="结果">
              <el-input readonly :value="result" style="width: 240px" />
            </el-form-item>
          </el-col>
          <el-col
            :span="7"
          ><el-form-item label="评估时间">
            <med-datetime
              v-model="form.time"
              :disabled="disabled"
              placeholder="评估时间"
              style="width: 100%"
              @change="handleSelectTime"
            /> </el-form-item></el-col>
          <el-col
            :span="6"
          ><el-form-item label="评估医生">
            <el-input
              v-model="form.doctor"
              :disabled="disabled"
            /> </el-form-item></el-col>
        </el-row>
        <el-button
          v-if="activePanels.length < cards.length"
          type="text"
          icon="el-icon-arrow-down"
          @click="expandAll"
        >全部展开</el-button>
        <el-button
          v-else
          type="text"
          icon="el-icon-arrow-up"
          @click="activePanels = []"
        >全部收起</el-button>
        <div style="max-height: 500px; overflow: auto">
          <el-collapse v-model="activePanels">
            <el-collapse-item
              v-for="card in cards"
              :key="card.id"
              :name="card.id"
              :title="card.title"
            >
              <el-radio-group :value="findValue(card.id)" :disabled="disabled">
                <el-radio
                  v-for="item in card.contentList"
                  :key="item.Id"
                  :label="item.Id"
                  @change="handleCheck(card.id, item.Id)"
                >{{ item.SubName }}</el-radio>
              </el-radio-group>
              <div slot="extra" type="setting">{{ findScore(card) }} 分</div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onCancel">取 消</el-button>
        <el-button
          :disabled="disabled"
          type="primary"
          @click="onConfirm"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { saveEstimate } from '@/api/estimate'

const formatStr = 'YYYY-MM-DD HH:mm:ss'
export default {
  name: 'EstimatingInput',
  props: {
    value: {
      type: String, // (v-model)评分主键id
      default: ''
    },
    title: {
      type: String, // 评分弹窗标题
      default: ''
    },
    type: {
      required: true,
      type: String, // 评分类型编码 必填
      default: ''
    },
    registId: {
      required: true,
      type: String, // 登记号 必填
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: false,
      showCalendar: false,
      activePanels: [],
      manuallytime: '',
      form: {
        time: this.$moment().format(formatStr),
        value: 0,
        estimateItemList: [],
        name: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'hospitalId',
      'gradingTemps',
      'gradingScales',
      'gradingResults',
      'user'
    ]),
    modalTitle() {
      return this.title || '评分'
    },
    valueText() {
      return this.score === undefined
        ? ''
        : `${this.score}分 ${this.result || ''}`
    },
    curTemp() {
      return this.gradingTemps[this.type] || []
    },
    cards() {
      return this.curTemp.map((item) => {
        // eslint-disable-next-line no-eval
        const contentList = eval(item.content) || []
        return {
          id: item.id,
          title: item.label,
          contentList
        }
      })
    },
    curScale() {
      // 当前类型的评分标准
      const key = Object.keys(this.gradingScales).find((key) => {
        // eslint-disable-next-line no-unused-vars
        const [prefix, type] = key.split('_')[1]
        return this.type.includes(type)
      })
      return this.gradingScales[key] || []
    },
    result() {
      if (!this.score) {
        return ''
      }
      const matched = this.curScale.find((item) => {
        const [start, end] = item.value.split('-')
        return this.score >= parseFloat(start) && this.score <= parseFloat(end)
      })
      return matched?.label
    },
    score() {
      let score
      if (this.form.estimateItemList?.length) {
        this.form.estimateItemList.forEach((item) => {
          const { type, value } = item.content || {}
          const matchedCard = this.cards.find((card) => card.id === type)
          if (matchedCard) {
            const matchedItem = matchedCard.contentList.find(
              (ele) => ele.Id === value
            )
            if (matchedItem) {
              score = (score || 0) + parseInt(matchedItem.Value)
            }
          }
        })
      }
      return score
    },
    curGradingResult() {
      // 当前类型的评分结果
      let result = {}
      const matched = this.gradingResults.find((r) => r.id === this.value)
      if (matched) {
        result = {
          ...matched,
          estimateItemList: matched.estimateItemList?.map((item) => {
            return {
              ...item,
              content: JSON.parse(item.content)
            }
          })
        }
      }
      return result
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (val && !Object.keys(this.curGradingResult).length) {
          this.getDetail()
        }
      }
    },
    // show: {
    //   immediate: false,
    //   handler(nVal) {
    //     if (nVal) {
    //       this.getDetail()
    //     }
    //   },
    // },
    curGradingResult: {
      handler(nVal) {
        // 拿到评分结果详情后 赋值form，选中对应评分细项
        this.setForm(JSON.parse(JSON.stringify(nVal)))
      },
      immediate: true,
      deep: true
    },
    cards: {
      immediate: true,
      handler(val) {
        if (val.length) {
          this.expandAll()
        }
      }
    }
  },
  methods: {
    ...mapMutations({
      SET_GRADINGRESULTS: 'common/SET_GRADINGRESULTS'
    }),
    ...mapActions({
      getGradingResults: 'common/getGradingResults'
    }),
    expandAll() {
      // 展开全部面板
      this.activePanels = this.cards.map((c) => c.id)
    },
    findValueItem(id) {
      return this.form.estimateItemList?.find((ele) => ele.content?.type === id)
    },
    findValue(id) {
      // 面板一项的当前评分的值（id）
      return this.findValueItem(id)?.content?.value
    },
    findScore(card) {
      // 面板一项的当前分数
      const { contentList } = card
      const curVal = this.findValue(card.id)
      const matchedItem = contentList.find((ele) => ele.Id === curVal)
      return parseInt(matchedItem?.Value || 0)
    },
    handleCheck(cardId, id) {
      const matched = this.findValueItem(cardId)
      if (matched) {
        matched.content = {
          ...matched.content,
          value: id
        }
      } else {
        const newItem = {
          content: {
            type: cardId,
            value: id
          }
        }
        if (this.form.estimateItemList) {
          this.form.estimateItemList.push(newItem)
        } else {
          this.form.estimateItemList = [newItem]
        }
      }
      // this.$forceUpdate()
    },
    async getDetail() {
      // 获取患者的评分详情
      await this.getGradingResults(this.registId)
    },
    async handleSave() {
      // 保存评分结果
      // 保存时若没手动改过时间,会记录保存时的时间,改过则使用用户填写的时间
      const now = this.manuallytime || this.$moment().format(formatStr) // 以最后一次修改时间为准
      const payload = {
        ...this.form,
        time: now,
        value: this.score,
        registId: this.registId,
        code: this.type,
        description: this.result,
        title: this.title,
        // name: this.title,
        id: this.value,
        estimateItemList:
          this.form?.estimateItemList?.map((item) => {
            return {
              ...item,
              content: JSON.stringify(item.content)
            }
          }) || []
      }
      const res = await saveEstimate(payload)
      if (res?.status === 200) {
        const newValue = res.result
        if (this.value !== newValue) {
          // 保存成功，回写此次评分的id
          this.$emit('input', newValue)
          // this.getDetail()
        }
        // 保存后触发事件送出对象
        this.$emit('change', payload)
      }
    },
    // 重置表单
    resetForm() {
      this.setForm(JSON.parse(JSON.stringify(this.curGradingResult)))
    },
    onCancel() {
      this.show = false
      this.resetForm()
    },
    async onConfirm() {
      if (this.form?.estimateItemList?.length < this.cards?.length) {
        const checkedIds = this.form?.estimateItemList.map(
          (item) => item?.content?.type
        )
        const index = this.cards.findIndex(
          (card) => !checkedIds.includes(card.id)
        )
        if (index > -1) {
          const firstEmptyItem = this.cards[index]
          this.$message.error(`请填写${firstEmptyItem.title}`)
        }
      } else {
        await this.handleSave()
        this.show = false
      }
    },
    handleSelectTime(val) {
      this.manuallytime = val
    },
    setForm(obj) {
      this.form = {
        time: this.$moment().format(formatStr),
        estimateItemList: [],
        ...this.form,
        ...obj
      }
      if (!this.form.doctor) {
        this.form.doctor = this.user.username
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .ant-form-item {
  margin-bottom: 10px;
}
::v-deep .el-radio {
  line-height: 2.5;
  display: block;
}
</style>
