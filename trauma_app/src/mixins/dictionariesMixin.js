export default {
  data() {
    return {
      BLUE_TEXT: 'rgb(94,116,254)',
      FORM_STATE: [
        { label: '全部', value: '0', isTabs: true, isScreenAll: false, isFilling: false },
        { label: '填报中', value: '1', isTabs: true, isScreenAll: true, isFilling: true },
        { label: '待审核', value: '2', isTabs: true, isScreenAll: true, isFilling: false },
        { label: '审核拒绝', value: '7', isTabs: false, isScreenAll: true, isFilling: true },
        { label: '待存档', value: '3', isTabs: true, isScreenAll: true, isFilling: false },
        { label: '存档拒绝', value: '8', isTabs: false, isScreenAll: true, isFilling: true },
        { label: '已存档', value: '4', isTabs: true, isScreenAll: true, isFilling: false },
        { label: '已上报', value: '5', isTabs: false, isScreenAll: false, isFilling: false },
        { label: '已删除', value: '6', isTabs: false, isScreenAll: false, isFilling: false }
      ],
      WHETHER: [
        { label: '是', value: '1' },
        { label: '否', value: '0' }
      ],
      DATE_TIME_FORMAT: {
        // 年-月-日 时:分
        DATE_MINUTE: 'YYYY-MM-DD HH:mm',
        // 年-月-日 时:分:秒
        DATE_SECOND: 'YYYY-MM-DD HH:mm:ss'
      },
      DIAGNOSIS_COLOR: [ // 病情色值
        { label: '未知', value: 'rgba(0,0,0,0.2)', key: '00' },
        { label: '濒危', value: '#e62023f2', key: '01' },
        { label: '危重', value: '#f19529', key: '02' },
        { label: '急症', value: '#fcca00', key: '03' },
        { label: '非急症', value: '#5ac32d', key: '04' },
        { label: '已死亡', value: '#6c6c6c', key: '05' }
      ]
    }
  },
  computed: {
    dictionaryObj() {
      return JSON.parse(localStorage.getItem('dictionary'))
    },
    // 性别
    GENDER_0001() {
      return this.dictionaryObj['GENDER_0001']
    },
    // 年龄区间
    AGE_0001() {
      return this.dictionaryObj['AGE_0001']
    },
    // 来院方式
    VISIT_0001() {
      return this.dictionaryObj['VISIT_0001']
    },
    // 院前抢救措施
    RESCUE_0001() {
      return this.dictionaryObj['RESCUE_0001']
    },
    // 检查类型
    INSPECT_0001() {
      return this.dictionaryObj['INSPECT_0001']
    },
    // 检验类型
    EXAMINE_0001() {
      return this.dictionaryObj['EXAMINE_0001']
    },
    // 入院诊断是否与出院诊断符合
    IS_CONFORM_0001() {
      return this.dictionaryObj['IS_CONFORM_0001']
    },
    // 治疗结果
    CURERESULT_0001() {
      return this.dictionaryObj['CURERESULT_0001']
    },
    // 住院科室
    INHOSPITAL_DEPT() {
      return this.dictionaryObj['INHOSPITAL_DEPT']
    },
    // 病情判断
    DIAGNOSIS_0001() {
      return this.dictionaryObj['DIAGNOSIS_0001']
    },
    // 抢救结果
    RESCUE_RESULT_0001() {
      return this.dictionaryObj['RESCUE_RESULT_0001']
    },
    // 病人信息完成情况
    IS_FINISH_0001() {
      return this.dictionaryObj['IS_FINISH_0001']
    },
    // 病人去向
    TURN_0001() {
      return this.dictionaryObj['TURN_0001']
    },
    // 出车单位
    STATION_0001() {
      return this.dictionaryObj['STATION_0001']
    },
    // 跟车医生
    DOCTOR_0001() {
      return this.dictionaryObj['DOCTOR_0001']
    },
    // 跟车护士
    NURSE() {
      return this.dictionaryObj['NURSE']
    },
    // 既往史
    PAST_0001() {
      return this.dictionaryObj['PAST_0001']
    },
    // 院前抢救措施
    PRE_MEASURE_0001() {
      return this.dictionaryObj['PRE_MEASURE_0001']
    },
    // 治疗药物
    THERAPEUTIC_0001() {
      return this.dictionaryObj['THERAPEUTIC_0001']
    },
    // 接诊科室
    DEPT_0001() {
      return this.dictionaryObj['DEPT_0001']
    },
    // 创伤
    TRAUMA_0001() {
      return this.dictionaryObj['TRAUMA_0001']
    },
    // 自行来院方式
    SELF_VISIT_0001() {
      return this.dictionaryObj['SELF_VISIT_0001']
    },
    // 卡类型
    CARD_0001() {
      return this.dictionaryObj['CARD_0001']
    },
    // 瞳孔
    PUPIL_0001() {
      return this.dictionaryObj['PUPIL_0001']
    },
    // 光反射
    LIGHT_0001() {
      return this.dictionaryObj['LIGHT_0001']
    },
    // 意识
    CONS_0001() {
      return this.dictionaryObj['CONS_0001']
    },
    // 气道
    AIRWAY_0001() {
      return this.dictionaryObj['AIRWAY_0001']
    },
    // 循环
    CYCLE_0001() {
      return this.dictionaryObj['CYCLE_0001']
    },
    // 心率
    HEARTRATE_0001() {
      return this.dictionaryObj['HEARTRATE_0001']
    },
    // 胸部
    CHEST_0001() {
      return this.dictionaryObj['CHEST_0001']
    },
    // 腹部
    BELLY_0001() {
      return this.dictionaryObj['BELLY_0001']
    },
    // 肠鸣
    BORY_0001() {
      return this.dictionaryObj['BORY_0001']
    },
    // 肌张力
    MUSCULAR_0001() {
      return this.dictionaryObj['MUSCULAR_0001']
    },
    // 骨折
    FRACTURE_0001() {
      return this.dictionaryObj['FRACTURE_0001']
    },
    // 出血部位
    BLEEDING_PART() {
      return this.dictionaryObj['BLEEDING_PART']
    },
    // 具体交界部位
    SPECIFIC_JUNCTION() {
      return this.dictionaryObj['SPECIFIC_JUNCTION']
    },
    // 扫描部位
    SCAN_SITE() {
      return this.dictionaryObj['SCAN_SITE']
    },
    // FAST出血部位
    FAST_BLEEDING_PART() {
      return this.dictionaryObj['FAST_BLEEDING_PART']
    }
  },
  methods: {
    getDicLabelByValue(value, dicKey) {
      const matched = (this.dictionaryObj[dicKey] || []).find(
        el => el.value === value
      )
      return matched?.label || value
    },
    getLabelsByValue(values, key) {
      const dicList = this.dictionaryObj[key]
      if (values) {
        const res = []
        const valList = values.split(',')
        valList.filter(v =>
          dicList.filter(d => {
            if (d.value === v) {
              res.push(d.label)
            }
          })
        )
        return res.join('、')
      }
    },
    getDicByKeys(key) {
      const arr = key instanceof Array ? key : [key]
      const result = {}
      arr.forEach(el => {
        result[el] = this.dictionaryObj[el]
      })
      return result
    },
    getDicListByKey(key) {
      if (key) {
        return this.dictionaryObj[key]
      }
    },
    getCategory(val) { // 例如: TI_、GCS_
      const result = []
      Object.keys(this.dictionaryObj).forEach((key) => {
        if (key.includes(val)) {
          result.push({
            name: this.dictionaryObj[key][0].name,
            code: this.dictionaryObj[key][0].code,
            list: this.dictionaryObj[key],
            value: ''
          })
        }
      })
      return result
    },
    // 计算时间
    computedTime(minuend, subtrahend, unit) {
      let result = ''
      if (minuend && subtrahend) {
        let num = 0
        switch (unit) {
          case 'ss':
            num = 1000
            break
          case 'mm':
            num = 1000 * 60
            break
          case 'hh':
            num = 1000 * 60 * 60
            break
          case 'dd':
            num = 1000 * 60 * 60 * 24
            break
          default:
            break
        }
        result = (this.$moment(minuend).toDate().getTime() - this.$moment(subtrahend).toDate().getTime()) / num
      }
      return result
    }
  }
}
