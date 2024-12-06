<template>
  <div class="pre-exam-score-wrapper">
    <med-s-card title="患者评分" class="container-card no-divider">
      <template #extra>
        <systemlevel :level="minLevel" />
      </template>
      <div class="cards-box">
        <med-s-card
          :bordered="false"
          class="score-card"
          v-for="card in cards"
          :key="card.vulnusType"
          width="20%"
          @click="showModal(card.vulnusType)"
        >
          <b class="score-num">
            <span v-if="card.details && card.details.length">{{ card.degreeResult }}</span>
            <span style="color:#ccc" v-if="!card.details || !card.details.length">--</span>
          </b>
          <span v-if="card.details && card.details.length">分</span>
          <div class="score-type">{{ card.vulnusType | vulnusTypeFilter }}评分</div>
          <template #extra>
            <div v-if="levelMap[card.vulnusType]" :class="['score-level', 'score-level' + levelMap[card.vulnusType]]">
              {{ numberToChinese(levelMap[card.vulnusType]) }}级
            </div>
          </template>
        </med-s-card>
      </div>
    </med-s-card>
    <modal-com v-show="modalFlag" :modalFlag="modalFlag" :modalType="modalType" :info="info" @cancel="closeModal" />
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import ModalCom from './ModalCom'
import { numberToChinese } from '@/utils/util'
import Systemlevel from './Systemlevel'
import sharedData from '../sharedData'

export default {
  name: 'PreExamScore',
  components: {
    Systemlevel,
    ModalCom
  },
  data() {
    return {
      sharedData,
      modalFlag: false,
      modalType: '1',
      info: {},
      cards: [
        {
          doctorId: '', // 评分医师
          operatorTime: '', // 评分日期
          degreeResult: undefined, // 评分结果 分值
          vulnusType: 'PAIN', // 评分类别
          vulnusTypeName: '疼痛' // 评分类别名称
        },
        {
          doctorId: '', // 评分医师
          operatorTime: '', // 评分日期
          degreeResult: 0, // 评分结果 分值
          vulnusType: 'MEWS', // 评分类别
          vulnusTypeName: 'MEWS' // 评分类别名称
        },
        {
          doctorId: '', // 评分医师
          operatorTime: '', // 评分日期
          degreeResult: 0, // 评分结果 分值
          vulnusType: 'GCS', // 评分类别
          vulnusTypeName: 'GCS' // 评分类别名称
        },
        {
          doctorId: '', // 评分医师
          operatorTime: '', // 评分日期
          degreeResult: 0, // 评分结果 分值
          vulnusType: 'RTS', // 评分类别
          vulnusTypeName: 'RTS' // 评分类别名称
        },
        {
          doctorId: '', // 评分医师
          operatorTime: '', // 评分日期
          degreeResult: 0, // 评分结果 分值
          vulnusType: 'REMS', // 评分类别
          vulnusTypeName: 'REMS' // 评分类别名称
        }
      ]
    }
  },
  computed: {
    ...mapState({
      scoreMan: state => state.preExamScore.scoreMan,
      scoreInfo: state => state.preExamScore.scoreInfo
    }),
    levelMap() {
      // 各卡片等级
      const parseContent = cardItem => {
        let details = []
        if (cardItem.details) {
          details = cardItem.details.map(item => {
            return item.content ? JSON.parse(item.content) : item
          })
        }
        const newItem = { ...cardItem, details }
        return newItem
      }
      const calcLevel = {
        PAIN: card => {
          if (7 <= card.degreeResult && card.degreeResult <= 10) {
            return 2
          }
          if (4 <= card.degreeResult && card.degreeResult <= 6) {
            return 3
          }
          if (0 <= card.degreeResult && card.degreeResult <= 3) {
            return 4
          }
        },
        MEWS: card => {
          const newCard = parseContent(card)
          if (newCard.details.some(item => item.value[0]?.score === 3)) {
            // 有一项为3分就评一级
            return 1
          }
          if (3 <= card.degreeResult && card.degreeResult <= 10) {
            return 2
          }
          if (0 <= card.degreeResult && card.degreeResult <= 2) {
            return 4
          }
        },
        GCS: card => {
          if (0 <= card.degreeResult && card.degreeResult <= 8) {
            return 1
          }
          if (9 <= card.degreeResult && card.degreeResult <= 11) {
            return 2
          }
          if (12 <= card.degreeResult && card.degreeResult <= 14) {
            return 3
          }
          if (card.degreeResult === 15) {
            return 4
          }
        },
        RTS: card => {
          if (0 <= card.degreeResult && card.degreeResult <= 6) {
            return 1
          }
          if (7 <= card.degreeResult && card.degreeResult <= 11) {
            return 3
          }
          if (12 <= card.degreeResult) {
            return 4
          }
        },
        REMS: card => {
          if (24 <= card.degreeResult) {
            return 1
          }
          if (16 <= card.degreeResult && card.degreeResult <= 23) {
            return 2
          }
          if (12 <= card.degreeResult && card.degreeResult <= 15) {
            return 3
          }
          if (0 <= card.degreeResult && card.degreeResult <= 11) {
            return 4
          }
        }
      }

      const map = { PAIN: 0, MEWS: 0, GCS: 0, RTS: 0, REMS: 0 }
      this.cards.forEach(card => {
        const { details = [], vulnusType } = card
        if (details?.length) {
          map[vulnusType] = calcLevel[vulnusType](card) || 0
        }
      })
      return map
    },
    minLevel() {
      const validLvls = Object.values(this.levelMap).filter(el => el)
      return Math.min(...validLvls)
    }
  },
  props: {
    regId: {
      type: String,
      default: ''
    },
    detailInfo: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    'sharedData.vitalSigns': {
      handler(val) {
        this.handleVitalSignsChange(val)
      },
      deep: true
    },
    scoreInfo(nVal) {
      this.handleScore(this.cards, nVal)
    },
    detailInfo(nVal) {
      const scores = nVal.scores
      this.handleScore(this.cards, scores)
    },
    minLevel(nVal) {
      this.sharedData.sysLevel.score = nVal
    }
  },
  methods: {
    ...mapMutations(['SET_SCORE_INFO']),
    handleScore(arr1 = [], arr2 = []) {
      const newArr = Object.values(
        [...arr1, ...arr2].reduce((result, { vulnusType, ...rest }) => {
          result[vulnusType] = {
            ...(result[vulnusType] || {}),
            vulnusType,
            ...rest
          }
          return result
        }, {})
      )
      this.cards = [...newArr]
    },
    numberToChinese,
    formSubmit() {
      return this.cards.filter(c => c.details?.length && c.changed)
    },
    showModal(val) {
      this.info = {
        name: this.scoreMan.patientName,
        age: this.scoreMan.patientAge,
        gender: this.scoreMan.patientGender,
        regId: this.regId
      }
      const obj = {
        PAIN: '1',
        MEWS: '2',
        GCS: '3',
        RTS: '4',
        REMS: '5'
      }

      this.modalType = obj[val]
      this.modalFlag = true
    },
    closeModal() {
      this.info = {}
      this.modalFlag = false
    },
    findRangeResult(val, list) {
      // 判断当前数值落在哪个区间
      if (['', undefined, null, NaN].includes(val)) {
        return false
      }
      const numVal = Number(val)
      const matched = (list || []).find(ele => {
        if (ele.label.includes('>')) {
          if (numVal > Number(ele.label.replace('>', ''))) {
            return true
          }
          return false
        }
        if (ele.label.includes('≥')) {
          if (numVal >= Number(ele.label.replace('≥', ''))) {
            return true
          }
          return false
        }

        if (ele.label.includes('<')) {
          if (numVal < Number(ele.label.replace('<', ''))) {
            return true
          }
          return false
        }
        if (ele.label.includes('≤')) {
          if (numVal <= Number(ele.label.replace('≤', ''))) {
            return true
          }
          return false
        }

        const [start, end] = ele.label.split('-')
        return end ? numVal >= Number(start) && numVal <= Number(end) : start === val
      })
      return matched
    },
    handleVitalSignsChange(signs) {
      // 处理生命体征变化,自动MEWS评分
      const mews = this.cards.find(card => card.vulnusType === 'MEWS')
      if (mews) {
        const newDetails = mews.details || []
        const mewsData = (JSON.parse(sessionStorage.getItem('PRE_EXAM_SLEF_REG_SCORE_MODAL')) || {}).MEWS
        if (mewsData) {
          mewsData.forEach(item => {
            const fieldMap = {
              心率: signs.plus,
              '收缩压(mmHg)': signs.sbp,
              '呼吸(次/分)': signs.breath,
              '体温(℃)': signs.temperature,
              意识: signs.mind
            }
            const matchedOpt = this.findRangeResult(fieldMap[item.label], item.content)
            if (matchedOpt) {
              const newDetailItem = {
                type: item.label,
                value: [
                  {
                    id: matchedOpt.Id,
                    score: matchedOpt.Value,
                    value: matchedOpt.value
                  }
                ]
              }

              const heartRateItemIdx = newDetails.findIndex(d => d.type === item.label)
              if (heartRateItemIdx > -1) {
                newDetails[heartRateItemIdx] = newDetailItem
              } else {
                newDetails.push(newDetailItem)
              }
            }
          })
          mews.details = newDetails
          mews.degreeResult = newDetails.reduce((result, cur) => result + cur.value[0].score, 0)
          this.SET_SCORE_INFO(this.cards)
          this.$forceUpdate()
        }
      }
    }
  },
  filters: {
    vulnusTypeFilter(val) {
      switch (val) {
        case 'PAIN':
          return '疼痛'
        default:
          return val
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~ant-design-vue/es/style/themes/default.less';

.container-card {
  /deep/.ant-card-body {
    padding-top: 0;
    padding-bottom: 0;
  }
  .cards-box {
    display: flex;
    overflow-y: hidden;
    margin-left: -10px;
    padding-left: 10px;
    .score-card {
      cursor: pointer;
      width: 20%;
      font-size: 16px;
      color: #000;
      box-shadow: -10px 18px 10px -8px rgb(218, 218, 218);
      &:hover {
        background-color: #f1f3f5;
      }
      .score-num {
        font-size: 30px;
        line-height: 24px;
        font-family: 'Microsoft YaHei';
      }
      .score-type {
        font-size: 16px;
        color: @primary-color;
        padding-top: 4px;
      }
      .score-level {
        background-color: #009900;
        width: 50px;
        line-height: 20px;
        height: 20px;
        text-align: center;
        margin-right: 10px;
        color: #fff;
        &1 {
          background-color: rgb(180, 18, 38);
        }
        &2 {
          background-color: #ff6600;
        }
        &3 {
          background-color: #ff9900;
        }
        &4 {
          background-color: #009900;
        }
      }
      /deep/.ant-card-body {
        padding: 16px 10px 19px 10px;
      }
    }
  }
}
</style>
