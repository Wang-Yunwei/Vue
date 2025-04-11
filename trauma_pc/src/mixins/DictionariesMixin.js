import { mapGetters } from 'vuex'
export default {
  directives: {
    clear: {
      // 卸载组件时自动清除v-model值
      unbind: (...arg) => arg[2]?.data?.model?.callback(void 0)
    }
  },
  data() {
    return {
      WHETHER: [
        { label: '是', value: '1' },
        { label: '否', value: '0' }
      ],
      DATE_TIME_FORMAT: {
        // 年-月-日
        DATE_CHARACTER: 'YYYY年MM月DD日',
        // 年-月-日
        DATE: 'YYYY-MM-DD',
        // 年-月-日 时:分
        DATE_MINUTE: 'YYYY-MM-DD HH:mm',
        // 年-月-日 时:分:秒
        DATE_SECOND: 'YYYY-MM-DD HH:mm:ss'
      },
      issAisColor: {
        6: 'rgb(255,35,90)',
        5: 'rgb(252,104,70)',
        4: 'rgb(252,169,26)',
        3: 'rgb(169,202,43)',
        2: 'rgb(22,198,97)',
        1: 'rgb(63,206,188)'
      },
      issAisResultColor: {
        '严重创伤': 'rgb(245,102,0)',
        '创伤': 'rgb(245,179,0)'
      }
    };
  },

  computed: {
    ...mapGetters(['hospitalId', 'hospitalAreaList']),
    // 数据字典
    dictionary() {
      return JSON.parse(sessionStorage.getItem('dataDictionary'))
    },
    // 年龄区间
    AGE_0001() {
      return this.dictionary['AGE_0001']
    },
    // 气道
    AIRWAY_0001() {
      return this.dictionary['AIRWAY_0001']
    },
    // 腹部
    BELLY_0001() {
      return this.dictionary['BELLY_0001']
    },
    // 肠鸣
    BORY_0001() {
      return this.dictionary['BORY_0001']
    },
    // 出血部位
    BLEEDING_PART() {
      return this.dictionary['BLEEDING_PART']
    },
    // 卡类型
    CARD_0001() {
      return this.dictionary['CARD_0001']
    },
    // 胸部
    CHEST_0001() {
      return this.dictionary['CHEST_0001']
    },
    // 意识
    CONS_0001() {
      return this.dictionary['CONS_0001']
    },
    // 治疗结果
    CURERESULT_0001() {
      return this.dictionary['CURERESULT_0001']
    },
    // 循环
    CYCLE_0001() {
      return this.dictionary['CYCLE_0001']
    },
    // 接诊科室
    DEPT_0001() {
      return this.dictionary['DEPT_0001']
    },
    // 病情判断
    DIAGNOSIS_0001() {
      return this.dictionary['DIAGNOSIS_0001']
    },
    // 检验类型
    EXAMINE_0001() {
      return this.dictionary['EXAMINE_0001']
    },
    // 骨折
    FRACTURE_0001() {
      return this.dictionary['FRACTURE_0001']
    },
    // FAST出血部位
    FAST_BLEEDING_PART() {
      return this.dictionary['FAST_BLEEDING_PART']
    },
    // GCS评估结果
    GCSR_0004() {
      return this.dictionary['GCSR_0004']
    },
    // 性别
    GENDER_0001() {
      return this.dictionary['GENDER_0001']
    },
    // 心律
    HEARTRATE_0001() {
      return this.dictionary['HEARTRATE_0001']
    },
    // 住院科室
    INHOSPITAL_DEPT() {
      return this.dictionary['INHOSPITAL_DEPT']
    },
    // 检查类型
    INSPECT_0001() {
      return this.dictionary['INSPECT_0001']
    },
    // 入院诊断是否与出院诊断符合
    IS_CONFORM_0001() {
      return this.dictionary['IS_CONFORM_0001']
    },
    // 光反射
    LIGHT_0001() {
      return this.dictionary['LIGHT_0001']
    },
    // MPDS症状
    MPDS_0001() {
      return this.dictionary['TRAUMA_0001']
    },
    // 肌张力
    MUSCULAR_0001() {
      return this.dictionary['MUSCULAR_0001']
    },
    // 既往史
    PAST_0001() {
      return this.dictionary['PAST_0001']
    },
    // 院前抢救措施
    PRE_MEASURE_0001() {
      return this.dictionary['PRE_MEASURE_0001']
    },
    // 瞳孔
    PUPIL_0001() {
      return this.dictionary['PUPIL_0001']
    },
    // 患者类型
    PATIENT_TYPE() {
      return this.dictionary['PATIENT_TYPE']
    },
    // 二维码
    QRCODE_00001() {
      return this.dictionary['QRCODE_00001']
    },
    // 抢救措施
    RESCUE_0001() {
      return this.dictionary['RESCUE_0001']
    },
    // 抢救结果
    RESCUE_RESULT_0001() {
      return this.dictionary['RESCUE_RESULT_0001']
    },
    // 出车单位
    STATION_0001() {
      return this.dictionary['STATION_0001']
    },
    // 自行来院方式 
    SELF_VISIT_0001() {
      return this.dictionary['SELF_VISIT_0001']
    },
    // 具体交界部位
    SPECIFIC_JUNCTION() {
      return this.dictionary['SPECIFIC_JUNCTION']
    },
    // 扫描部位
    SCAN_SITE() {
      return this.dictionary['SCAN_SITE']
    },
    // TI评分结果
    TIR_0006() {
      return this.dictionary['TIR_0006']
    },
    // 病人去向
    TURN_0001() {
      return this.dictionary['TURN_0001']
    },
    // 治疗药物
    THERAPEUTIC_0001() {
      return this.dictionary['THERAPEUTIC_0001']
    },
    // 来院方式
    VISIT_0001() {
      return this.dictionary['VISIT_0001']
    },
  },
  methods: {
    // 根据字典的 key 和 value 获取 label
    dicLabelByValue(value, dicKey) {
      const matched = (this.dictionary[dicKey] || []).find(
        el => el.value === value
      )
      return matched?.label || value
    },
    // 根据 key 获取 字典 Object
    dicObjectByKey(key) {
      const arr = key instanceof Array ? key : [key]
      const result = {}
      arr.forEach(el => {
        result[el] = this.dictionary[el]
      })
      return result
    },
    // 根据 key 获取 List
    dicListByKey(key) {
      if (key) {
        return this.dictionary[key]
      }
    },
    //例如: TI_、GCS_
    dicCategory(val) {
      const result = []
      Object.keys(this.dictionary).forEach((key) => {
        if (key.includes(val)) {
          result.push({
            name: this.dictionary[key][0].name,
            code: this.dictionary[key][0].code,
            childList: this.dictionary[key],
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
            break;
          case 'mm':
            num = 1000 * 60
            break;
          case 'hh':
            num = 1000 * 60 * 60
            break;
          case 'dd':
            num = 1000 * 60 * 60 * 24
            break;
          default:
            break;
        }
        result = (this.$moment(minuend).toDate().getTime() - this.$moment(subtrahend).toDate().getTime()) / num
      }
      return result
    }
  }
}
