<template>
  <div class="pre-exam-datas-wrapper">
    <med-s-card :tabList="tabList" :activeTabKey="activeTabKey" class="container-card" @tabChange="swicthTab">
      <template slot="extra" v-if="activeTabKey === '0'">
        <div class="source-device">
          <a-select :options="sourceDeviceList" v-model="vitalSigns.sourceDevice"></a-select>
          <med-button
            :active="vitalSigns.haslife === '1'"
            :disabled="vitalSigns.haslife !== '1'"
            :type="vitalSigns.haslife === '1' ? 'primary' : 'default'"
            shape="round"
            icon="icon_huoqu"
          >
            获取采集数据
          </med-button>
        </div>
        <systemlevel :level="maxLevel" />
      </template>
      <div class="card-ontent">
        <template v-if="activeTabKey === '0'">
          <div class="pre-exam-basic-card-btn flex-c-b">
            <div class="pre-exam-basic-card-btn-left flex-c-c">
              <med-s-radio
                :initialValue="vitalSigns.haslife"
                v-model="vitalSigns.haslife"
                :optionList="lifeList"
                buttonType
              />
            </div>
          </div>
          <a-row type="flex" :gutter="20">
            <a-col flex="1 1 570px" class="flex-c-b">
              <med-s-sticker
                :class="['sign-card', vitalSigns.haslife !== '1' ? 'sign-card-disabled' : '']"
                layout="top"
                title="体温"
                unit="℃"
                :num="vitalSigns.temperature + ''"
                bodyFontSize="36px"
                :bodyColor="levelColor[levels.temperature]"
                @change="handleVitalSignsChange($event, 'temperature')"
              />
              <med-s-sticker
                :class="['sign-card', vitalSigns.haslife !== '1' ? 'sign-card-disabled' : '']"
                layout="top"
                title="脉搏"
                unit="次/分"
                :num="vitalSigns.plus + ''"
                bodyFontSize="36px"
                :bodyColor="levelColor[levels.plus]"
                @change="handleVitalSignsChange($event, 'plus')"
              />
              <med-s-sticker
                :class="['sign-card', vitalSigns.haslife !== '1' ? 'sign-card-disabled' : '']"
                layout="top"
                title="呼吸"
                unit="次/分"
                :num="vitalSigns.breath + ''"
                bodyFontSize="36px"
                :bodyColor="levelColor[levels.breath]"
                @change="handleVitalSignsChange($event, 'breath')"
              />
              <med-s-sticker
                :class="['sign-card', vitalSigns.haslife !== '1' ? 'sign-card-disabled' : '']"
                layout="top"
                title="血压"
                unit="mmHg"
                :num="vitalSigns.sbp + ''"
                :snum="vitalSigns.dbp + ''"
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
                :num="vitalSigns.spo + ''"
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
        <template
          v-if="activeTabKey === '1'"
        ><med-s-form-model
          :form="arriveInfo"
          :responsive="{ xl: 8, lg: 8, md: 12, sm: 24, xs: 24 }"
          :dataSource="arriveFormConfig"
        /></template>
        <template
          v-if="activeTabKey === '2'"
        ><med-s-form-model
          class="infect-form"
          :form="infectHistory"
          :responsive="{ xl: 8, lg: 8, md: 12, sm: 24, xs: 24 }"
          :dataSource="infectFormConfig"
          :formLayout="{ labelCol: { xxl: 10, xl: 14 }, wrapperCol: { xxl: 14, xl: 10 } }"
        /></template>
      </div>
    </med-s-card>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import moment from 'moment'
import { queryByCodeList } from '@/api'
import { getClinicTriageHelp } from '@/api/preExam/basic'
import Systemlevel from './Systemlevel'
import sharedData from '../sharedData'
const levelColor = sharedData.levelColor.slice(0, 4).concat('#333333')
export default {
  name: 'PreExamDatas',
  components: {
    Systemlevel
  },
  props: {
    regId: { type: String, default: '' },
    detailInfo: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      sharedData,
      tabList: [
        {
          key: '0',
          tab: '生命体征'
        },
        {
          key: '1',
          tab: '到院信息'
        },
        {
          key: '2',
          tab: '流行病学史'
        }
      ],
      activeTabKey: '0',
      consciousnessList: [], // 意识状态列表
      signRangesMap: {}, // 体征分级参考标准
      levelColor,
      lifeList: [
        {
          label: '有生命迹象',
          value: '1'
        },
        {
          label: '无生命迹象',
          value: '0'
        },
        {
          label: '拒绝TPRBP',
          value: '2'
        }
      ],
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
        acqTime: moment().format('YYYY-MM-DDTHH:mm:[00][Z]'), // 采集时间
        area: '', // 采集区域
        haslife: '1',
        temperature: '', // 体温
        plus: '', // 脉搏(次/分钟)
        breath: '', // 呼吸(次/分钟)
        dbp: '', // 舒张压(mmhg)
        sbp: '', // 收缩压(mmhg)
        spo: '', // SPO₂ (%)
        mind: '' // 意识
      },
      // 到院信息
      // arriveRelation: '110', // 来院方式关联信息 (120 / 110 / other)
      arriveInfo: {
        acceptTime: '', // 急救呼叫时间/120接诊时间
        acceptAddress: '', // 120接诊地址
        diseaseTime: '', // 发病时间
        plateNumber: '', // 车牌号
        arriveTime: '', // 到院时间
        checkDoctorId: '', // 接诊医生Id
        checkDoctorName: '', // 接诊医生姓名
        checkDoctorTel: '', // 接诊医生电话
        address: '', // 发病地址/发现地址
        arrivewithName: '', // 陪送/110/120/相关人员姓名
        arrivewithTel: '', // 陪送/110/120/相关人员电话
        policeStation: '' // 派出所
      },
      // 流行病学史登记
      infectHistory: {
        infectMsg: '0', // 是否有流行病病史
        feverTime: '', // 发热时间
        epidemicAr: [], // 疫区旅游史
        isFever: '', // 24小时体温超过38度
        isHvaeFeverHistory: '', // 入院前三天有发热学史
        diseaseTouch: '' // 死亡或者动物接触史
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
    parseKeyName(key) {
      let start
      let end
      if (key.match(/-/g).length === 1) {
        start = key.split('-')[0]
        end = key.split('-')[1]
      } else {
        const keyArr = key.split('')
        const minusIdx = keyArr.findIndex((el, idx) => {
          return el === '-' && (/\d/.test(keyArr[idx - 1]) || keyArr[idx + 1 === '-'])
        })

        if (minusIdx < 0) {
          return false
        }

        start = keyArr.slice(0, minusIdx).join('')
        end = keyArr.slice(minusIdx + 1).join('')
      }
      return {
        start,
        end
      }
    },
    // 给范围性质的key(格式'start-end')排序
    sortRangeKeys(keys) {
      return [...keys].sort((a, b) => {
        const { start: AStart, end: AEnd } = this.parseKeyName(a)
        const { start: BStart, end: BEnd } = this.parseKeyName(b)
        return Number(AEnd || AStart) - Number(BEnd || BStart)
      })
    },
    // 查找区间
    findInterval(val, keys) {
      let matchedInterval = ''
      if (!val) {
        return ''
      }
      keys.some((key, idx) => {
        // eslint-disable-next-line prefer-const
        let { start, end } = this.parseKeyName(key)
        if (start) {
          start = Number(start)
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
        if (end && val <= Number(end)) {
          // 落入当前区间
          matchedInterval = key
          return true
        }
        return false
      })
      return matchedInterval
    },
    // 计算特定年龄的体征分级
    calcLevel(type, monthAge) {
      const num = this.vitalSigns[type]
      if (num === '') {
        return 0
      }
      let level = 4
      const curSignType = this.signRangesMap[type]
      if (curSignType) {
        const keys = this.sortRangeKeys(Object.keys(curSignType))
        // 判断当前年龄落在哪个区间
        const ageIntervalKey = this.findInterval(monthAge, keys)
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
    // 有无流行病史
    handleInfectMsgChange(e) {
      this.infectHistory = {
        infectMsg: e.target.value, // 是否有流行病病史
        feverTime: '', // 发热时间
        epidemicArea: [], // 疫区旅游史
        isFever: '', // 24小时体温超过38度
        isHvaeFeverHistory: '', // 入院前三天有发热学史
        diseaseTouch: '' // 死亡或者动物接触史
      }
    },
    formSubmit() {
      return {
        vitalSigns: this.vitalSigns,
        arriveInfo: {
          ...this.arriveInfo
        },
        infectHistory: {
          ...this.infectHistory,
          epidemicArea: (this.infectHistory.epidemicArea || []).join()
        }
      }
    },
    // 回显数据
    regDetails() {
      const { datas } = this.detailInfo
      if (datas) {
        this.vitalSigns = { ...this.vitalSigns, ...datas.vitalSigns, acqTime: this.vitalSigns.acqTime }
        this.arriveInfo = { ...datas.arriveInfo }
        this.infectHistory = {
          ...datas.infectHistory,
          epidemicArea: datas.infectHistory?.epidemicArea?.split(',') || []
        }
      }
    }
  },
  computed: {
    ...mapState({
      scoreMan: state => state.preExamScore.scoreMan
    }),
    ...mapGetters(['hospitalId']),
    infectFormConfig() {
      const { infectMsg } = this.infectHistory
      const disabled = infectMsg === '0'
      return [
        {
          labelText: '有无流行病学史',
          type: 'radio',
          placeholder: '请选择',
          fieldName: 'infectMsg',
          required: false,
          wrongMsg: '请选择',
          buttonType: true,
          buttonStyle: 'solid',
          optionList: [
            {
              label: '无',
              value: '0'
            },
            {
              label: '有',
              value: '1'
            }
          ],
          formLayout: {
            labelCol: { xxl: 3, xl: 4 },
            wrapperCol: { xxl: 21, xl: 20 }
          },
          responsive: {
            span: 24
          },
          change: this.handleInfectMsgChange
        },
        {
          labelText: '近14天疫区旅游史',
          type: 'checkbox',
          placeholder: '请选择',
          fieldName: 'epidemicArea',
          required: false,
          wrongMsg: '请选择',
          buttonType: true,
          buttonStyle: 'solid',
          disabled,
          optionList: [
            {
              label: '国内',
              value: '0'
            },
            {
              label: '港澳台',
              value: '1'
            },
            {
              label: '亚洲',
              value: '2'
            },
            {
              label: '非洲',
              value: '3'
            },
            {
              label: '欧洲',
              value: '4'
            },
            {
              label: '美洲',
              value: '5'
            },
            {
              label: '大洋洲',
              value: '6'
            }
          ],
          formLayout: {
            labelCol: { xxl: 5, xl: 5 },
            wrapperCol: { xxl: 19, xl: 19 }
          },
          responsive: {
            xxl: 15
          }
        },
        {
          labelText: '发热时间',
          type: 'datetime',
          placeholder: '请输入发热时间',
          disabled,
          fieldName: 'feverTime',
          required: false,
          wrongMsg: '请输入呼叫时间',
          showTime: true,
          responsive: {
            xxl: 8,
            xl: 9
          },
          formLayout: {
            labelCol: { xxl: 8, xl: 4 },
            wrapperCol: { xxl: 16, xl: 8 }
          }
        },
        {
          labelText: '24小时体温超过38度',
          type: 'radio',
          placeholder: '请选择',
          fieldName: 'isFever',
          disabled,
          required: false,
          wrongMsg: '请选择',
          buttonType: true,
          buttonStyle: 'solid',
          optionList: [
            {
              label: '否',
              value: '0'
            },
            {
              label: '是',
              value: '1'
            }
          ]
        },
        {
          labelText: '入院前三天有发热学史',
          type: 'radio',
          placeholder: '请选择',
          fieldName: 'isHvaeFeverHistory',
          disabled,
          required: false,
          wrongMsg: '请选择',
          buttonType: true,
          buttonStyle: 'solid',
          optionList: [
            {
              label: '否',
              value: '0'
            },
            {
              label: '是',
              value: '1'
            }
          ]
        },
        {
          labelText: '死亡或者动物接触史',
          type: 'radio',
          placeholder: '请选择',
          fieldName: 'diseaseTouch',
          disabled,
          required: false,
          wrongMsg: '请选择',
          buttonType: true,
          buttonStyle: 'solid',
          optionList: [
            {
              label: '否',
              value: '0'
            },
            {
              label: '是',
              value: '1'
            }
          ]
        }
      ]
    },
    arriveFormConfig() {
      switch (this.arriveType) {
        case '120':
          return [
            {
              labelText: '急救呼叫时间',
              type: 'datetime',
              placeholder: '请输入急救呼叫时间',
              fieldName: 'acceptTime',
              required: false,
              wrongMsg: '请输入呼叫时间',
              showTime: true
            },
            {
              labelText: '接诊地址',
              type: 'text',
              placeholder: '请输入接诊地址',
              fieldName: 'acceptAddress',
              required: false,
              wrongMsg: '请输入接诊地址',
              responsive: { span: 16 }
            },
            {
              labelText: '发病时间',
              type: 'datetime',
              placeholder: '请输入发病时间',
              fieldName: 'diseaseTime',
              required: false,
              wrongMsg: '请输入发病时间',
              showTime: true
            },
            {
              labelText: '车牌号',
              type: 'text',
              placeholder: '请输入车牌号',
              fieldName: 'plateNumber',
              required: false,
              wrongMsg: '请输入车牌号'
            },
            {
              labelText: '到院时间',
              type: 'datetime',
              placeholder: '请输入到院时间',
              fieldName: 'arriveTime',
              required: false,
              wrongMsg: '请输入到院时间',
              showTime: true
            },
            {
              labelText: '医生姓名',
              type: 'text',
              placeholder: '请输入医生姓名',
              fieldName: 'checkDoctorName',
              required: false,
              wrongMsg: '请输入医生姓名'
            },
            {
              labelText: '联系电话',
              type: 'text',
              placeholder: '请输入联系电话',
              fieldName: 'checkDoctorTel',
              required: false,
              wrongMsg: '请输入联系电话'
            }
          ]
        case '110':
          return [
            {
              labelText: '到院时间',
              type: 'datetime',
              placeholder: '请输入到院时间',
              fieldName: 'arriveTime',
              required: false,
              wrongMsg: '请输入到院时间',
              showTime: true
            },
            {
              labelText: '发现地点',
              type: 'text',
              placeholder: '请输入发现地点',
              fieldName: 'address',
              required: false,
              wrongMsg: '请输入发现地点',
              responsive: { span: 16 },
              formLayout: {
                labelCol: {
                  span: 3
                },
                wrapperCol: {
                  span: 21
                }
              }
            },
            {
              labelText: '发现时间',
              type: 'datetime',
              placeholder: '请输入发现时间',
              fieldName: 'diseaseTime',
              required: false,
              wrongMsg: '请输入发现时间',
              showTime: true
            },

            {
              labelText: '警员姓名',
              type: 'text',
              placeholder: '请输入警员姓名',
              fieldName: 'arrivewithName',
              required: false,
              wrongMsg: '请输入警员姓名'
            },
            {
              labelText: '警员电话',
              type: 'text',
              placeholder: '请输入警员电话',
              fieldName: 'arrivewithTel',
              required: false,
              wrongMsg: '请输入警员电话'
            },
            {
              labelText: '派出所',
              type: 'text',
              placeholder: '请输入派出所',
              fieldName: 'policeStation',
              required: false,
              wrongMsg: '请输入派出所'
            }
          ]
        case 'other':
        default:
          return [
            {
              labelText: '发病时间',
              type: 'datetime',
              placeholder: '请输入发病时间',
              fieldName: 'diseaseTime',
              required: false,
              wrongMsg: '请输入发病时间',
              showTime: true
            },
            {
              labelText: '发病地址',
              type: 'text',
              placeholder: '请输入发病地址',
              fieldName: 'address',
              required: false,
              wrongMsg: '请输入发病地址',
              responsive: { span: 16 },
              formLayout: {
                labelCol: {
                  span: 3
                },
                wrapperCol: {
                  span: 21
                }
              }
            },
            {
              labelText: '陪送人员',
              type: 'text',
              placeholder: '请输入陪送人员',
              fieldName: 'arrivewithName',
              required: false,
              wrongMsg: '请输入陪送人员'
            },
            {
              labelText: '联系电话',
              type: 'text',
              placeholder: '请输入联系电话',
              fieldName: 'arrivewithTel',
              required: false,
              wrongMsg: '请输入联系电话'
            }
          ]
      }
    },
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
      const filledSignNames = this.signNames.filter(name => this.vitalSigns[name] !== '')
      const level = filledSignNames.length ? Math.min(...filledSignNames.map(name => Number(this.levels[name]))) : 0
      return level
    },
    // 来源方式
    arriveType() {
      const type = this.sharedData.arriveType
      if (type && type.includes('120')) {
        return '120'
      }
      if (type && type.includes('110')) {
        return '110'
      }
      return 'else'
    }
  },
  watch: {
    vitalSigns: {
      deep: true,
      handler(val) {
        const mindLabel = (this.consciousnessList.find(item => item.value === val.mind) || {}).label
        const nVal = { ...val, mind: mindLabel }
        return this.$set(this.sharedData, 'vitalSigns', nVal)
      }
    },
    'vitalSigns.haslife': {
      handler(val) {
        if (val != '1') {
          this.resetSigns()
        }
      },
      immediate: true
    },
    // 角标显示最高等级
    maxLevel(val) {
      this.sharedData.sysLevel.datas = val
    },
    detailInfo() {
      if (this.detailInfo?.datas) {
        this.regDetails()
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~ant-design-vue/es/style/themes/default.less';

.pre-exam-basic-card-btn-left {
  margin-bottom: 10px;
}
.card-ontent {
  height: 145px;
}
.container-card {
  /deep/ .ant-card-body {
    padding: 20px;
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
.infect-form {
  /deep/ .ant-form .ant-form-item {
    margin-bottom: 8px;
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
</style>
