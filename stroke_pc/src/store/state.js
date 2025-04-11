export default {
  patientInfo: {},
  accessToken: '',
  permission: null,
  hospitalId: '', // 医院id
  hospitalArea: [], // 医院院区列表
  curHospitalArea: '', // 当前医院院区
  registId: '', // 登记号
  gradingTemps: {
    CZNIHSS: [
      {
        id: '122',
        label: '睁眼翻译',
        content: [
          {
            Value: 1,
            SubName: '反应',
            Id: '大师傅'
          },
          {
            Value: 3,
            SubName: '无反应',
            Id: '大师傅大师傅'
          }
        ]
      },
      {
        id: '333',
        label: '帆帆帆帆',
        content: [
          {
            Value: 1,
            SubName: '顶顶顶顶',
            Id: '大师傅的'
          },
          {
            Value: 4,
            SubName: '广告费',
            Id: '师傅'
          }
        ]
      }
    ]
  }, // 评分模板
  gradingScales: {
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
  gradingResults: [], // 评分结果集
  comingType: '', // 来院方式
  dispose: '', // 初步处置
  // 字典表数据
  dicData: {},
  // 病历编辑，跨页签共享数据
  sharedData: {
    // 院前急救：到达医院时间
    arrivedHospitalTime: '',
    // 院前急救：开通静脉通道时间
    openveinTime: '',
    // 预检分诊：体重
    bodyWeight: undefined
  }
}
