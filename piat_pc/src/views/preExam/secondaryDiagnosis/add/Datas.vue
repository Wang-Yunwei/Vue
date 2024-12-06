<template>
  <div class="pre-exam-datas-wrapper">
    <med-s-card :activeTabKey="activeTabKey" class="container-card" @tabChange="swicthTab">
      <div class="card-ontent">
        <template v-if="activeTabKey === '0'">
          <div class="patrol-time">
            巡视时间 :
            <a-date-picker
              :show-time="{ format: 'HH:mm:ss' }"
              valueFormat="YYYY-MM-DD HH:mm:ss"
              :placeholder="'巡视时间'"
              v-model="visitTime"
            />
          </div>
          <a-row type="flex" :gutter="20">
            <a-col flex="1 1 570px" class="flex-c-b">
              <med-s-sticker
                :class="['sign-card', vitalSigns.haslife !== '1' ? 'sign-card-disabled' : '']"
                layout="top"
                title="体温"
                unit="℃"
                :num="vitalSigns.temperature"
                bodyFontSize="36px"
                :bodyColor="levelColor[levels.temperature]"
                @change="handleVitalSignsChange($event, 'temperature')"
              />
              <med-s-sticker
                :class="['sign-card', vitalSigns.haslife !== '1' ? 'sign-card-disabled' : '']"
                layout="top"
                title="脉搏"
                unit="次/分"
                :num="vitalSigns.plus"
                bodyFontSize="36px"
                :bodyColor="levelColor[levels.plus]"
                @change="handleVitalSignsChange($event, 'plus')"
              />
              <med-s-sticker
                :class="['sign-card', vitalSigns.haslife !== '1' ? 'sign-card-disabled' : '']"
                layout="top"
                title="呼吸"
                unit="次/分"
                :num="vitalSigns.breath"
                bodyFontSize="36px"
                :bodyColor="levelColor[levels.breath]"
                @change="handleVitalSignsChange($event, 'breath')"
              />
              <med-s-sticker
                :class="['sign-card', vitalSigns.haslife !== '1' ? 'sign-card-disabled' : '']"
                layout="top"
                title="血压"
                unit="mmHg"
                :num="vitalSigns.sbp"
                :snum="vitalSigns.dbp"
                twoNumFlag
                bodyFontSize="36px"
                :bodyColor="levelColor[Math.min(levels.sbp, levels.dbp)]"
                @change="handleBloodPressureChange"
              />
              <med-s-sticker
                :class="['sign-card', vitalSigns.haslife !== '1' ? 'sign-card-disabled' : '']"
                layout="top"
                title="血氧"
                unit="%"
                :num="vitalSigns.spo"
                bodyFontSize="36px"
                :bodyColor="levelColor[levels.spo]"
                @change="handleVitalSignsChange($event, 'spo')"
              />
            </a-col>
            <a-col flex="0 1 230px" class="consciousness">
              <span>意识：</span>
              <med-s-radio
                buttonType
                :optionList="consciousnessList"
                v-model="vitalSigns.mind"
                :initialValue="vitalSigns.mind"
              />
            </a-col>
          </a-row>
        </template>
      </div>
    </med-s-card>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import { queryByCodeList } from '@/api'
import { getClinicTriageHelp } from '@/api/preExam/basic'
import Systemlevel from './../../selfReg/components/Systemlevel'
import sharedData from './../../selfReg/sharedData'

const levelColor = sharedData.levelColor.slice(0, 4).concat('#333333')
export default {
  name: 'PreExamDatas',
  components: {
    Systemlevel
  },
  props: {
    detailInfo: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      sharedData,
      activeTabKey: '0',
      consciousnessList: [], // 意识状态列表
      signRangesMap: {}, // 体征分级参考标准
      levelColor,
      visitTime: '',
      sourceDeviceList: [
        {
          label: '分诊台监护仪',
          value: '0'
        }
      ],
      // 主要体征字段名
      signNames: ['temperature', 'plus', 'breath', 'sbp', 'dbp', 'spo'],
      // 生命体征
      vitalSigns: {
        sourceDevice: '0', // 采集设备
        acqTime: '', // 采集时间
        area: '', // 采集区域
        haslife: '1',
        temperature: '', // 体温
        plus: '', // 脉搏(次/分钟)
        breath: '', // 呼吸(次/分钟)
        dbp: '', // 舒张压(mmhg)
        sbp: '', // 收缩压(mmhg)
        spo: '', // SPO₂ (%)
        mind: '' // 意识
      }
    }
  },
  async created() {
    const requests = [this.getDictionaryByCodeList(), this.initClinicTriageHelpList()]
    const [{ consciousness }, signRangesMap] = await Promise.all(requests)
    this.consciousnessList = consciousness
    this.signRangesMap = signRangesMap
  },
  methods: {
    // 获取字典数据
    async getDictionaryByCodeList() {
      const param = {
        hospitalId: this.hospitalId,
        codeList: [
          'consciousness' //意识
        ]
      }
      const res = await queryByCodeList(param)
      return res?.result || {}
    },
    // 获取体征分级标准
    async initClinicTriageHelpList() {
      const res = await getClinicTriageHelp()
      return res?.body || {}
    },
    // 重置体征数据
    resetSigns() {
      this.vitalSigns = {
        ...this.vitalSigns,
        temperature: '', // 体温
        plus: '', // 脉搏(次/分钟)
        breath: '', // 呼吸(次/分钟)
        dbp: '', // 舒张压(mmhg)
        sbp: '', // 收缩压(mmhg)
        spo: '', // SPO₂ (%)
        mind: '' // 意识
      }
    },
    // 给范围性质的key(格式'start-end')排序
    sortRangeKeys(keys) {
      return [...keys].sort((a, b) => {
        const [AStart, AEnd] = a.split('-')
        const [BStart, BEnd] = b.split('-')
        return (AEnd || AStart) - (BEnd || BStart)
      })
    },
    // 查找区间
    findInterval(val, keys) {
      let matchedInterval = ''
      if (!val) {
        return ''
      }
      keys.some((key, idx) => {
        let [start, end] = key.split('-')
        start = Number(start)
        end = Number(end)
        if (start) {
          if (val < start) {
            // 小于最小起始值,终止循环
            return true
          }
          if (val == start || (end && val <= end) || (!end && idx === keys.length - 1)) {
            // 落入当前区间
            matchedInterval = key
            return true
          }
          //继续循环查找
          return false
        }
        if (end && val <= end) {
          // 落入当前区间
          matchedInterval = key
          return true
        }
        return false
      })
      return matchedInterval
    },
    // 计算特定年龄的体征分级
    calcLevel(type, patientAge) {
      const num = this.vitalSigns[type]
      if (num === '') {
        return 0
      }
      let level = 4
      const curSignType = this.signRangesMap[type]
      if (curSignType) {
        const keys = this.sortRangeKeys(Object.keys(curSignType))
        // 判断当前年龄落在哪个区间
        const ageIntervalKey = this.findInterval(patientAge, keys)
        // 有区间使用区间配置的级别
        if (ageIntervalKey) {
          const signIntervals = curSignType[ageIntervalKey]
          const signIntervalKeys = this.sortRangeKeys(Object.keys(signIntervals))
          // 判断当前体征值落在哪个区间
          const signIntervalKey = this.findInterval(num, signIntervalKeys)
          if (signIntervalKey) {
            level = Number(signIntervals[signIntervalKey]) || 4
          }
        }
      }
      return level
    },
    swicthTab(tab) {
      this.activeTabKey = tab
    },
    handleVitalSignsChange(val, field) {
      this.vitalSigns[field] = val + ''
    },
    handleBloodPressureChange(sbp, dbp) {
      this.vitalSigns.sbp = sbp + ''
      this.vitalSigns.dbp = dbp + ''
    },
    formSubmit() {
      return {
        vitalSigns: this.vitalSigns,
        visitTime: this.visitTime,
        arriveInfo: {
          ...this.arriveInfo
        }
      }
    },
    //数据回显
    regDetails() {
      this.vitalSigns.temperature = this.detailInfo.temperature + ''
      this.vitalSigns.plus = this.detailInfo.plus + ''
      this.vitalSigns.breath = this.detailInfo.breath + ''
      this.vitalSigns.dbp = this.detailInfo.dbp + ''
      this.vitalSigns.sbp = this.detailInfo.sbp + ''
      this.vitalSigns.spo = this.detailInfo.spo + ''
      this.vitalSigns.mind = this.detailInfo.mind + ''
    }
  },

  computed: {
    ...mapState({
      scoreMan: state => state.preExamScore.scoreMan
    }),
    ...mapGetters(['hospitalId']),
    monthAge() {
      return Math.ceil((Number(this.scoreMan.patientAge) || 0) * 12)
    },
    levels() {
      const levelObj = {}
      this.signNames.forEach(name => {
        levelObj[name] = this.calcLevel(name, this.monthAge)
      })
      return levelObj
    },
    maxLevel() {
      return Math.min(...this.signNames.map(name => Number(this.levels[name])))
    }
  },
  watch: {
    detailInfo() {
      if (this.detailInfo?.id) {
        this.regDetails()
      }
    },
    // 角标显示最高等级
    maxLevel(val) {
      this.sharedData.sysLevel.datas = val
    }
  }
}
</script>

<style lang="less" scoped>
@import '~ant-design-vue/es/style/themes/default.less';

.pre-exam-basic-card-btn-left {
  margin-bottom: 10px;
}

.container-card {
  background-color: transparent;
  box-shadow: none !important;
  margin-bottom: 0 !important;

  /deep/ .ant-card-body {
    padding: 20px 20px 0 20px;
  }
}

.sign-card {
  &-disabled {
    cursor: not-allowed;

    /deep/ .ant-card-body {
      .med-s-sticker-input-box__input {
        pointer-events: none;
      }
    }
  }

  height: 100px;
  max-width: 190px;
  width: calc(20% - 10px);
  border-radius: 0 0 6px 6px;

  /deep/ .ant-card-head > .ant-card-head-wrapper {
    color: @primary-color;
  }

  /deep/ .ant-card-body {
    padding: 20px 0;
    line-height: 30px;

    > div {
      display: block;

      .med-s-sticker-input-box {
        // font-size: 36px;
        font-weight: bold;
        line-height: 30px;
        vertical-align: top;
        // color: #333333;
        font-family: 'Microsoft YaHei';

        .med-s-sticker-input-box__input {
          width: 100%;
          padding: 0;
        }

        &__label {
          margin: 0;
        }

        + span {
          z-index: 2;
          top: -4px;
          font-size: 33px;
          color: #333333;
        }
      }
    }
  }
}

.source-device {
  display: flex;
  width: 520px;
  padding-right: 50px;
  justify-content: space-between;
  position: relative;
  z-index: 1;
  padding-top: 9px;

  .ant-select {
    width: 310px;
  }

  /deep/ button {
    height: 30px;

    i {
      font-size: 30px;
      line-height: 30px;
    }
  }
}

.consciousness {
  /deep/ .ant-radio-button-wrapper {
    margin-top: 8px;
    min-width: 74px;
  }
}

.patrol-time {
  margin-bottom: 20px;

  /deep/ .ant-calendar-picker {
    margin-left: 4px;
  }
}
</style>
