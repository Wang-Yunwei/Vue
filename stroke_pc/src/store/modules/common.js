/* eslint-disable space-before-function-paren */
import { queryByCodeList, queryScoreList } from '@/api' // 接口
import { getEstimates } from '@/api/estimate' // 接口
import { dicConstant } from '@/constant/commonConstant'
import storage from 'store'

const common = {
  namespaced: true,
  state: {
    hospital: '',
    hospitalArea: [],
    curHospitalArea: '',
    dicData: storage.get('dicData') || {},
    gradingTemps: storage.get('gradingTemps') || {},
    // 评分模板
    gradingScales: storage.get('gradingScales') || {
      STROKE_GCS_RESULT: [
        { label: '轻度昏迷', name: '卒中-GCS_评估结果', value: '13-14' },
        { label: '中度昏迷', name: '卒中-GCS_评估结果', value: '9-12' },
        { label: '重度昏迷', name: '卒中-GCS_评估结果', value: '3-8' }
      ],
      STROKE_NIHSS_RESULT: [
        { label: '正常或区域正常', name: '卒中-NIHSS-测评结果', value: '0-1' },
        { label: '轻微中风', name: '卒中-NIHSS-测评结果', value: '2-4分' },
        { label: '中度中风', name: '卒中-NIHSS-测评结果', value: '5-15' },
        { label: '中重度中风', name: '卒中-NIHSS-测评结果', value: '16-20' },
        { label: '重度中风', name: '卒中-NIHSS-测评结果', value: '21-42' }
      ]
    }, // 评分标准
    gradingResults: storage.get('gradingResults') || [] // 评分结果集
  },
  mutations: {
    SET_HOSPITAL(state, hospital) {
      if (state.hospital && state.hospital !== hospital) {
        // 变更医院ID，清空院区和字典
        state.hospitalArea = []
        state.dicData = {}
        storage.set('dicData', null)
        state.curHospitalArea = []
      }
      state.hospital = hospital
    },
    SET_HOSPITAL_AREA(state, hospitalArea) {
      state.hospitalArea = hospitalArea
    },
    SET_CUR_HOSPITAL_AREA(state, curHospitalArea) {
      state.curHospitalArea = curHospitalArea
      sessionStorage.setItem('curHospitalArea', curHospitalArea)
    },
    SET_DICTIONARY(state, dicData) {
      storage.set('dicData', dicData)
      state.dicData = dicData
    },
    SET_GRADINGTEMPS(state, gradingTemps) {
      storage.set('gradingTemps', gradingTemps)
      state.gradingTemps = gradingTemps
    },
    SET_GRADINGSCALES(state, gradingScales) {
      storage.set('gradingScales', gradingScales)
      state.gradingScales = gradingScales
    },
    SET_GRADINGRESULTS(state, gradingResults) {
      storage.set('gradingResults', gradingResults)
      state.gradingResults = gradingResults
    }
  },
  actions: {
    // 初始化字典
    initDictionaries({ commit, state }) {
      if (Object.keys(state.dicData).length) {
        return
      }
      return new Promise((resolve, reject) => {
        // 字典接口
        queryByCodeList({
          codeList: Object.values(dicConstant),
          hospitalId: state.hospital
        })
          .then(({ result = {}}) => {
            const dicData = Object.keys(result).reduce((obj, key) => {
              // 将字典码转为可读性更强的字典名称(见dicConstant.js),便于使用
              const meaningfulKey =
                (Object.entries(dicConstant).find((arr) => arr[1] === key) ||
                  [])[0] || key
              obj[meaningfulKey] = result[key] || []
              return obj
            }, {})
            commit('SET_DICTIONARY', dicData)

            // 评分标准
            const gradingScales = {
              STROKE_GCS_RESULT: result.STROKE_GCS_RESULT,
              STROKE_NIHSS_RESULT: result.STROKE_NIHSS_RESULT,
              STROKE_ILLNESS_LEVEL: result.STROKE_ILLNESS_LEVEL,
              STROKE_MIND: result.STROKE_MIND
            }
            commit('SET_GRADINGSCALES', {
              ...state.gradingScales,
              ...gradingScales
            })

            resolve(dicData)
            // const dicData = {
            // idCardTypeOpts: result[dicConstant.idCardType],
            // nationOpts: result[dicConstant.strokeNation],
            // genderOpts: result[dicConstant.gender],
            // // 专家评估
            // evaluateOpts: result[dicConstant.evaluate],
            // // 初步印象
            // impressionOpts: result[dicConstant.impression],
            // illnessLevelOpts: result[dicConstant.illnessLevel],
            // mindOpts: result[dicConstant.mind],
            // comingTypeOpts: result[dicConstant.comingType],
            // declarantTypeOpts: result[dicConstant.declarantType],
            // pharmacyHistoryOpts: result[dicConstant.pharmacyHistory],
            // phAntiplateletOpts: result[dicConstant.phAntiplatelet],
            // phAnticoagulationOpts: result[dicConstant.phAnticoagulation],
            // lisItemTypeOpts: result[dicConstant.lisItemType],
            // imageItemTypeOpts: result[dicConstant.imageItemType],
            // diagOpts: result[dicConstant.diag],
            // disposeOpts: result[dicConstant.dispose],
            // symptomOpts: result[dicConstant.symptom],
            // pastHistoryOpts: result[dicConstant.pastHistory],
            // rsTabooList: result[dicConstant.rsTaboo],
            // rsRelativeTabooList: result[dicConstant.rsRelativeTaboo],
            // rsRefuseReasonList: result[dicConstant.rsRefuseReason],
            // rsAdaptation1List: result[dicConstant.rsAdaptation1],
            // rsAdaptation2List: result[dicConstant.rsAdaptation2],
            // rsDoseList: result[dicConstant.rsDose],
            // rsOtherDrugList: result[dicConstant.rsOtherDrug],
            // rsAdeTypeList: result[dicConstant.rsAdeType],
            // rsAdeIhTypeList: result[dicConstant.rsAdeIhType],
            // rsAdeIhSeverityList: result[dicConstant.rsAdeIhSeverity],
            // pciTabooList: result[dicConstant.pciTaboo],
            // pciRefuseReasonList: result[dicConstant.pciRefuseReason],
            // pciAdaptationList: result[dicConstant.pciAdaptation],
            // ticiLevelList: result[dicConstant.ticiLevel],
            // pciStrategyList: result[dicConstant.pciStrategy],
            // pciAdeTypeList: result[dicConstant.pciAdeType],
            // delayReasonList: result[dicConstant.delayReason],
            // whereaboutsOpts: result[dicConstant.whereabouts],
            // admissionDeptList: result[dicConstant.admissionDept],
            // comingTypeShortOpts: result[dicConstant.comingTypeShort],
            // rsAdeOtherOpts: result[dicConstant.rsAdeOther],
            // ecgExceptionOpts: result[dicConstant.electrocardiogram],
            // gcsResultOpts: result[dicConstant.gcsResult],
            // nihssResultOpts: result[dicConstant.nihssResult],
            // diseaseCategoryOpts: result[dicConstant.diseaseCategory],
            // medicalHisProTypeOpts: result[dicConstant.medicalHisProType],
            // allergicHistoryOpts: result[dicConstant.allergicHistory],
            // comeTypeOpts: result[dicConstant.comeType],
            // phepConsciousnessOpts: result[dicConstant.phepConsciousness],
            // triageMindOpts: result[dicConstant.triageMind],
            // departmentOpts: result[dicConstant.department],
            // doctorOpts: result[dicConstant.doctor],
            // greenChannelOpts: result[dicConstant.greenChannel],
            // urgentTypeOpts: result[dicConstant.urgentType],
            // qrCodeOpts: result[dicConstant.qrCode],
            // reportStatusOpts: result[dicConstant.reportStatus],
            // conditionGradeOpts: result[dicConstant.conditionGrade],
            // rescueChangeResultOpts: result[dicConstant.rescueChangeResult],
            // tntUnit: result[dicConstant.tntUnit]
            // }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 医院
    setHospital({ commit }, hospitalId) {
      commit('SET_HOSPITAL', hospitalId)
    },
    // 当前选中院区
    setCurHospitalArea({ commit }, curHospitalArea) {
      commit('SET_CUR_HOSPITAL_AREA', curHospitalArea)
    },
    // 评分模板
    getGradingTemps({ commit, state }) {
      return new Promise(async (resolve, reject) => {
        const res = await queryScoreList({
          hospitalId: state.hospital,
          code: ''
        })
        if (res?.result) {
          resolve(res.result)
          commit('SET_GRADINGTEMPS', res.result)
        } else {
          reject(new Error('请求评分模板失败'))
          commit('SET_GRADINGTEMPS', {})
        }
      })
    },
    // 评分结果集
    getGradingResults({ commit }, registId) {
      return new Promise(async (resolve, reject) => {
        const res = await getEstimates(registId)
        if (res?.result) {
          resolve(res.result)
          commit('SET_GRADINGRESULTS', res.result)
        } else {
          reject(new Error('请求评分结果失败'))
          commit('SET_GRADINGRESULTS', [])
        }
      })
    }
  }
}

export default common
