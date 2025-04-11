// 字典code
export const dicConstant = {
  imgURL: window.GLOBAL_APP_API_BASE_URL + '/chestpain',
  genderCode: 'genderDict', // 性别, CPC.0001
  idCardCode: 'idCardDict', // 证件类型, CPC.0002
  nationalityCode: 'nationalityDict', // 民族, CPC.0003
  jobCode: 'jobDict', // 职业, CPC.0004
  cultureDegreeCode: 'cultureDegreeDict', // 文化程度, CPC.0005
  maritalCode: 'maritalDict', // 婚姻状况, CPC.0006
  attackZoneCode: 'attackZoneDict', // 发病区间, CPC.0010
  comingCode: 'comingDict', // 来院方式, CPC.0011
  comingCodeSHORTCode: 'comingCodeShortDict', // 来院方式, CPC.0011_SHORT
  distressCaseCode: 'distressCaseDict', // 病情评估, CPC.0012
  distressCaseDetailCode: 'distressCaseDetailDict', // 其他病情评估, CPC.0013
  departTransCode: 'departTransDict', // 转送科室, CPC.0014
  ambulanceDepartmentCode: 'ambulanceDepartmentDict', // 出车单位, CPC.0015
  transferTypeCode: 'transferTypeDict', // 转院类型, CPC.0016
  ecgTransferCode: 'ecgTransferDict', // 远程心电图传输, CPC.0017
  bypassEmergencyCode: 'bypassEmergencyDict', // 绕行急诊并直达科室, CPC.0018
  acsDrugCode: 'acsDrugDict', // 氯吡格雷/替格瑞洛, CPC.0019
  insuranceCode: 'insuranceDict', // 医保类型, CPC.0020
  senseCode: 'senseDict', // 意识, CPC.0021
  remoteEcgtranWayCode: 'remoteEcgtranWayDict', // 传输方式, CPC.0022
  pciPlaceCode: 'pciPlaceDict', // 手术场所, CPC.0023
  consultationTypeCode: 'consultationTypeDict', // 会诊类型, CPC.0024
  diagnosisCode: 'diagnosisDict', // 胸痛诊断, CPC.0050
  anticoagulationDrugCode: 'anticoagulationDrugDict', // 抗凝药物, CPC.0051
  killipLevelCode: 'killipLevelDict', // Killip分级, CPC.0052
  graceEstimateCode: 'graceEstimateDict', // Grace评估, CPC.0053
  graceHighriskConditionCode: 'graceHighriskConditionDict', // Grace极高危条件, CPC.0054
  graceHighriskLaminationCode: 'graceHighriskLaminationDict', // Grace危险分层, CPC.0055
  nyhaCode: 'nyhaDict', // 心脏纽约分级(NYHA), CPC.0056
  graceRehazardLevelCode: 'graceRehazardLevelDict', // 再次危险分层, CPC.0057
  strategyCode: 'strategyDict', // 治疗策略, CPC.0058
  reperfusionMeasureRsCode: 'reperfusionMeasureRsDict', // 溶栓后措施, CPC.0059
  reperfusionMeasureCode: 'reperfusionMeasureDict', // 再灌注策略, CPC.0060
  invasiveStrategyCode: 'invasiveStrategyDict', // 侵入性策略, CPC.0061
  perfusionMeasureCode: 'perfusionMeasureDict', // 无再灌注措施原因, CPC.0065
  pciTransferTypeCode: 'pciTransferTypeDict', // 转运PCI, CPC.0066
  handleWayCode: 'handleWayDict', // 处理措施, CPC.0067
  interlayerTypeCode: 'interlayerTypeDict', // 夹层类型, CPC.0070
  treatmentStrategyCode: 'treatmentStrategyDict', // 治疗策略, CPC.0071
  highriskLaminationCode: 'highriskLaminationDict', // 危险分层, CPC.0072
  nacsTypeCode: 'nacsTypeDict', // 非ACS心源性胸痛类型, CPC.0080
  nccpTypeCode: 'nccpTypeDict', // 其它非心源性胸痛类型, CPC.0081
  afTypeCode: 'afTypeDict', // 心房颤动-分型, CPC.0082
  chfNyhaCode: 'chfNyhaDict', // NYHA分级, CPC.0083
  cvdTypeCode: 'cvdTypeDict', // 脑血管疾病-描述, CPC.0084
  smokingSituationCode: 'smokingSituationDict', // 吸烟, CPC.0085
  delayReasonCode: 'delayReasonDict', // 延误原因, CPC.0100
  routeCode: 'routeDict', // 入路位置, CPC.0101
  blockCode: 'blockDict', // 阻塞性病变, CPC.0102
  narrowLevelCode: 'narrowLevelDict', // 狭窄程度, CPC.0103
  timiLevelCode: 'timiLevelDict', // 血流TIMI分级, CPC.0104
  intracavityImageCode: 'intracavityImageDict', // 腔内影像, CPC.0105
  functionTestCode: 'functionTestDict', // 功能检测, CPC.0106
  bracketNumCode: 'bracketNumDict', // 植入支架个数, CPC.0107
  pciComplicationCode: 'pciComplicationDict', // 术中并发症, CPC.0108
  cagPositionCode: 'cagPositionDict', // 冠脉造影, CPC.0109
  pciHandleWayCode: 'pciHandleWayDict', // 术中处理, CPC.0120
  bracketTypeCode: 'bracketTypeDict', // 支架种类, CPC.0121
  dischargeDiagnosisCode: 'dischargeDiagnosisDict', // 出院诊断, CPC.0150
  bnpTypeCode: 'bnpTypeDict', // BNP类型, CPC.0151
  outcomeComplicationCode: 'outcomeComplicationDict', // 合并症, CPC.0152
  cardiovRiskFactorsCode: 'cardiovRiskFactorsDict', // 心血管疾病危险因素, CPC.0153
  patientOutComeCode: 'patientOutComeDict', // 患者转归代码, CPC.0154
  treatmentResultCode: 'treatmentResultDict', // 治疗结果, CPC.0155
  deathCauseCode: 'deathCauseDict', // 死亡原因, CPC.0156
  dischargeEducationCode: 'dischargeEducationDict', // 离院宣教, CPC.0157
  daptCode: 'daptDict', // 出院带药-DAPT, CPC.0160
  aceiorarbCode: 'aceiorarbDict', // 出院带药-ACEI/ARB, CPC.0161
  statinsCode: 'statinsDict', // 出院带药-他汀类, CPC.0162
  retardantCode: 'retardantDict', // 出院带药-β受体阻滞剂, CPC.0163
  rateTimeCode: 'rateTimeDict', // 用药时间, CPC.0164
  rateCountCode: 'rateCountDict', // 用药频次, CPC.0165
  ohaCode: 'ohaDict', // 降糖药物, CPC.0166
  noacCode: 'noacDict', // 口服抗凝药物, CPC.0167
  pck9Code: 'pck9Dict', // PCSK9药物名称, CPC.0168
  heartFailureNyhaLevelCode: 'heartFailureNyhaLevelDict', // 心功能分级, CPC.0169
  thrombolyticScreeningCode: 'thrombolyticScreeningDict', // 溶栓筛查, CPC.0200
  faThrombolyticPlaceCode: 'faThrombolyticPlaceDict', // 院前溶栓场所, CPC.0201
  ihThrombolyticPlaceCode: 'ihThrombolyticPlaceDict', // 院内溶栓场所, CPC.0202
  thrombolyticDrugTypeCode: 'thrombolyticDrugTypeDict', // 溶栓药物, CPC.0203
  thrombolyticDrugCode: 'thrombolyticDrugDict', // 溶栓剂量, CPC.0204
  troponinCode: 'troponinDict', // 肌钙蛋白, CPC.0219
  ctnUnitCode: 'ctnUnitDict', // 肌钙蛋白单位, CPC.0220
  myoUnitCode: 'myoUnitDict', // Myo单位, CPC.0221
  ckmbUnitCode: 'ckmbUnitDict', // CKMB单位, CPC.0222
  anticoagulationUnitCode: 'anticoagulationUnitDict', // 抗凝单位, CPC.0223
  ddimerUnitCode: 'ddimerUnitDict', // Ddimer单位, CPC.0224
  drugItemsCode: 'drugItemsDict', // 抗血小板药物, CPC.0225
  diagnosisTestTypeCode: 'diagnosisTestTypeDict', // 实验室检查类型, CPC.0226
  pacsTypeCode: 'pacsTypeDict', // 影像学检查, CPC.0227
  hospitalNamesCode: 'hospitalNamesDict', // 医院名称, CPC.5002
  covid19Code: 'covid19Dict', // COVID-19, CPC.5003
  yesOrNoCode: 'yesOrNoDict', // 是否, CPC.9000
  haveOrNotCode: 'haveOrNotDict', // 有无, CPC.9001
  abnormalOrNotCode: 'abnormalOrNotDict', // 异常, CPC.9002
  testResultCode: 'testResultDict', // 检验结果, CPC.9003
  testItemsCode: 'testItemsDict' // 检验项目, CPC.9004
}

export const timeFormat = {
  birthday: 'yyyy-MM-dd',
  default: 'yyyy-MM-dd HH:mm'
}

export const ruleConstant = {
  ANTIPLATELET: 'DS.001', // 双抗给药
  INSPECTION: 'DS.002', // 检查检验
  MEDICINEINHOS: 'DS.003', // 住院期间用药
  ANTICOAGULATION: 'DS.004', // 抗凝药物
  DISCHARGEMEDICATION: 'DS.005' // 出院带药
}

export const basicConstant = {
  NETWORKHOSPITAL: 'BS.001',
  MEDICALWORKERS: 'BS.002'
}
