import { dicConstant } from '@constant/commonConstant'
import { mapGetters, mapMutations } from 'vuex'
import * as types from '@/store/mutations/mutations-types'

export default {
  data() {
    return {
      codeList: [
        dicConstant.genderCode,
        dicConstant.impressionCode,
        dicConstant.evaluate,
        dicConstant.illnessLevelCode,
        dicConstant.mindCode,
        dicConstant.comingTypeCode,
        dicConstant.declarantTypeCode,
        dicConstant.pharmacyHistoryCode,
        dicConstant.phAntiplateletCode,
        dicConstant.phAnticoagulationCode,
        dicConstant.lisItemTypeCode,
        dicConstant.imageItemTypeCode,
        dicConstant.diagCode,
        dicConstant.disposeCode,
        dicConstant.symptomCode,
        dicConstant.pastHistoryCode,
        dicConstant.rsTaboo,
        dicConstant.rsRelativeTaboo,
        dicConstant.rsRefuseReason,
        dicConstant.rsAdaptation1,
        dicConstant.rsAdaptation2,
        dicConstant.rsDose,
        dicConstant.rsOtherDrug,
        dicConstant.rsAdeType,
        dicConstant.rsAdeIhType,
        dicConstant.rsAdeIhSeverity,
        dicConstant.pciTaboo,
        dicConstant.pciRefuseReason,
        dicConstant.pciAdaptation,
        dicConstant.ticiLevel,
        dicConstant.pciStrategy,
        dicConstant.pciAdeType,
        dicConstant.delayReason,
        dicConstant.whereabouts,
        dicConstant.admissionDept,
        dicConstant.comingTypeShortCode,
        dicConstant.rsAdeOther,
        dicConstant.electrocardiogramCode,
        dicConstant.gcsResult,
        dicConstant.nihssResult,
        dicConstant.diseaseCategoryCode,
        dicConstant.medicalHisProTypeCode,
        dicConstant.allergicHistoryCode,
        dicConstant.comeType,
        dicConstant.phepConsciousnessCode,
        dicConstant.strokeNationCode,
        dicConstant.triageMindCode,
        dicConstant.departmentCode,
        dicConstant.doctorCode,
        dicConstant.greenChannelCode,
        dicConstant.urgentTypeCode
      ],
      nationOpts: [],
      // 性别
      genderOpts: [],
      // 字典返回-专家评估
      evaluateOpts: [],
      // 字典返回-初步印象
      impressionOpts: [],
      // 病情等级下拉框
      illnessLevelOpts: [],
      // 意识下拉框
      mindOpts: [],
      // 来院方式下拉框
      comingTypeOpts: [],
      // 陈述者与患者关系
      declarantTypeOpts: [],
      // 用药史
      pharmacyHistoryOpts: [],
      // 抗血小板药物
      phAntiplateletOpts: [],
      // 抗凝药物
      phAnticoagulationOpts: [],
      // 实验室检查类型
      lisItemTypeOpts: [],
      // 影像检查类型
      imageItemTypeOpts: [],
      // 初步诊断
      diagOpts: [],
      // 初步处置
      disposeOpts: [],
      // 症状
      symptomOpts: [],
      // 既往病史
      pastHistoryOpts: [],
      // 溶栓禁忌症选项
      rsTabooList: [],
      // 溶栓相对禁忌症选项
      rsRelativeTabooList: [],
      // 溶栓拒绝原因选项
      rsRefuseReasonList: [],
      // 颅内出血类型选项
      rsAdeIhTypeList: [],
      // 使用其他药物 选项
      rsOtherDrugList: [],
      // 溶栓适应症选项
      rsAdaptation1List: [],
      // 溶栓适应症选项
      rsAdaptation2List: [],
      // 给药剂量标准选项
      rsDoseList: [],
      // 静脉溶栓不良事件类型选项
      rsAdeTypeList: [],
      // 出血严重程度选项
      rsAdeIhSeverityList: [],
      // 介入不良事件类型
      pciAdeTypeList: [],
      // 介入禁忌症选项
      pciTabooList: [],
      // 介入适应症选项
      pciAdaptationList: [],
      // 介入治疗拒绝原因选项
      pciRefuseReasonList: [],
      // TICI分级选项
      ticiLevelList: [],
      // 开通策略选项
      pciStrategyList: [],
      // 耗时原因
      delayReasonList: [],
      // 病人去向选项
      whereaboutsList: [],
      // 入院科室选项
      admissionDeptList: [],
      comingTypeShortOpts: [],
      rsAdeOtherOpts: [],
      ecgExceptionOpts: [],
      gcsResultOpts: [],
      nihssResultOpts: [],
      diseaseCategoryOpts: [],
      medicalHisProTypeOpts: [],
      allergicHistoryOpts: [],
      comeTypeOpts: [],
      senseDict: [],
      triageMindOpts: [],
      departmentOpts: [],
      doctorOpts: [],
      greenChannelOpts: [],
      urgentTypeOpts: []
    }
  },
  created() {
    // 获取字典表数据
    this.getDicData()
  },
  computed: {
    ...mapGetters(['hospitalId']),
    // 获取字典表数据
    dictionariesData() {
      return {
        nationOpts: this.nationOpts,
        genderOpts: this.genderOpts,
        impressionOpts: this.impressionOpts,
        evaluateOpts: this.evaluateOpts,
        // 病情等级下拉框
        illnessLevelOpts: this.illnessLevelOpts,
        // 意识下拉框
        mindOpts: this.mindOpts,
        // 来院方式下拉框
        comingTypeOpts: this.comingTypeOpts,
        // 陈述者与患者关系
        declarantTypeOpts: this.declarantTypeOpts,
        // 用药史
        pharmacyHistoryOpts: this.pharmacyHistoryOpts,
        // 抗血小板药物
        phAntiplateletOpts: this.phAntiplateletOpts,
        // 抗凝药物
        phAnticoagulationOpts: this.phAnticoagulationOpts,
        // 实验室检查类型
        lisItemTypeOpts: this.lisItemTypeOpts,
        // 影像检查类型
        imageItemTypeOpts: this.imageItemTypeOpts,
        // 初步诊断
        diagOpts: this.diagOpts,
        // 初步处置
        disposeOpts: this.disposeOpts,
        // 症状
        symptomOpts: this.symptomOpts,
        // 既往病史
        pastHistoryOpts: this.pastHistoryOpts,
        // 溶栓禁忌症选项
        rsTabooList: this.rsTabooList,
        // 溶栓相对禁忌症选项
        rsRelativeTabooList: this.rsTabooList,
        // 溶栓拒绝原因选项
        rsRefuseReasonList: this.rsRefuseReasonList,
        // 颅内出血类型选项
        rsAdeIhTypeList: this.rsAdeIhTypeList,
        // 使用其他药物 选项
        rsOtherDrugList: this.rsOtherDrugList,
        // 溶栓适应症选项
        rsAdaptation1List: this.rsAdaptation1List,
        // 溶栓适应症选项
        rsAdaptation2List: this.rsAdaptation2List,
        // 给药剂量标准选项
        rsDoseList: this.rsDoseList,
        // 静脉溶栓不良事件类型选项
        rsAdeTypeList: this.rsAdeTypeList,
        // 出血严重程度选项
        rsAdeIhSeverityList: this.rsAdeIhSeverityList,
        // 介入不良事件类型
        pciAdeTypeList: this.pciAdeTypeList,
        // 介入禁忌症选项
        pciTabooList: this.pciTabooList,
        // 介入适应症选项
        pciAdaptationList: this.pciAdaptationList,
        // 介入治疗拒绝原因选项
        pciRefuseReasonList: this.pciRefuseReasonList,
        // TICI分级选项
        ticiLevelList: this.ticiLevelList,
        // 开通策略选项
        pciStrategyList: this.pciStrategyList,
        whereaboutsList: this.whereaboutsList,
        admissionDeptList: this.admissionDeptList,
        delayReasonList: this.delayReasonList,
        comingTypeShortOpts: this.comingTypeShortOpts,
        rsAdeOtherOpts: this.rsAdeOtherOpts,
        ecgExceptionOpts: this.ecgExceptionOpts,
        gcsResultOpts: this.gcsResultOpts,
        nihssResultOpts: this.nihssResultOpts,
        diseaseCategoryOpts: this.diseaseCategoryOpts,
        medicalHisProTypeOpts: this.medicalHisProTypeOpts,
        allergicHistoryOpts: this.allergicHistoryOpts,
        comeTypeOpts: this.comeTypeOpts,
        senseDict: this.senseDict,
        triageMindOpts: this.triageMindOpts,
        departmentOpts: this.departmentOpts,
        doctorOpts: this.doctorOpts,
        greenChannelOpts: this.greenChannelOpts,
        urgentTypeOpts: this.urgentTypeOpts
      }
    }
  },
  methods: {
    ...mapMutations([types.SET_DICDATA]),
    /**
     * 下拉框
     */
    getDicData() {
      this.$api.dic
        .queryByCodeList({
          codeList: Object.values(dicConstant),
          hospitalId: this.hospitalId
        })
        .then(({ result }) => {
          this.nationOpts = result[dicConstant.strokeNationCode]
          this.genderOpts = result[dicConstant.genderCode]
          // 专家评估
          this.evaluateOpts = result[dicConstant.evaluate]
          // 初步印象
          this.impressionOpts = result[dicConstant.impressionCode]
          this.illnessLevelOpts = result[dicConstant.illnessLevelCode]
          this.mindOpts = result[dicConstant.mindCode]
          this.comingTypeOpts = result[dicConstant.comingTypeCode]
          this.declarantTypeOpts = result[dicConstant.declarantTypeCode]
          this.pharmacyHistoryOpts = result[dicConstant.pharmacyHistoryCode]
          this.phAntiplateletOpts = result[dicConstant.phAntiplateletCode]
          this.phAnticoagulationOpts = result[dicConstant.phAnticoagulationCode]
          this.lisItemTypeOpts = result[dicConstant.lisItemTypeCode]
          this.imageItemTypeOpts = result[dicConstant.imageItemTypeCode]
          this.diagOpts = result[dicConstant.diagCode]
          this.disposeOpts = result[dicConstant.disposeCode]
          this.symptomOpts = result[dicConstant.symptomCode]
          this.pastHistoryOpts = result[dicConstant.pastHistoryCode]
          this.rsTabooList = result[dicConstant.rsTaboo]
          this.rsRelativeTabooList = result[dicConstant.rsRelativeTaboo]
          this.rsRefuseReasonList = result[dicConstant.rsRefuseReason]
          this.rsAdaptation1List = result[dicConstant.rsAdaptation1]
          this.rsAdaptation2List = result[dicConstant.rsAdaptation2]
          this.rsDoseList = result[dicConstant.rsDose]
          this.rsOtherDrugList = result[dicConstant.rsOtherDrug]
          this.rsAdeTypeList = result[dicConstant.rsAdeType]
          this.rsAdeIhTypeList = result[dicConstant.rsAdeIhType]
          this.rsAdeIhSeverityList = result[dicConstant.rsAdeIhSeverity]
          this.pciTabooList = result[dicConstant.pciTaboo]
          this.pciRefuseReasonList = result[dicConstant.pciRefuseReason]
          this.pciAdaptationList = result[dicConstant.pciAdaptation]
          this.ticiLevelList = result[dicConstant.ticiLevel]
          this.pciStrategyList = result[dicConstant.pciStrategy]
          this.pciAdeTypeList = result[dicConstant.pciAdeType]
          this.delayReasonList = result[dicConstant.delayReason]
          this.whereaboutsList = result[dicConstant.whereabouts]
          this.admissionDeptList = result[dicConstant.admissionDept]
          this.comingTypeShortOpts = result[dicConstant.comingTypeShortCode]
          this.rsAdeOtherOpts = result[dicConstant.rsAdeOther]
          this.ecgExceptionOpts = result[dicConstant.electrocardiogramCode]
          this.gcsResultOpts = result[dicConstant.gcsResult]
          this.nihssResultOpts = result[dicConstant.nihssResult]
          this.diseaseCategoryOpts = result[dicConstant.diseaseCategoryCode]
          this.medicalHisProTypeOpts = result[dicConstant.medicalHisProTypeCode]
          this.allergicHistoryOpts = result[dicConstant.allergicHistoryCode]
          this.comeTypeOpts = result[dicConstant.comeType]
          this.senseDict = result[dicConstant.phepConsciousnessCode]
          this.triageMindOpts = result[dicConstant.triageMindCode]
          this.departmentOpts = result[dicConstant.departmentCode]
          this.doctorOpts = result[dicConstant.doctorCode]
          this.greenChannelOpts = result[dicConstant.greenChannelCode]
          this.urgentTypeOpts = result[dicConstant.urgentTypeCode]
          this[types.SET_DICDATA](this.dictionariesData)
        })
    }
  }
}
