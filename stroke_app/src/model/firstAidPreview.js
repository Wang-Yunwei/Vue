export default function FirstAidPreview() {
  return {
    // 基本信息
    patientBaseInfoDto: {
      name: '', // 名字
      gender: '', // 性别
      age: '', // 年龄
      nation: '' // 民族
    },
    // 任务信息
    taskInfoDto: {
      reasonType: '', // 呼救原因
      destinationAddress: '', // 现场地址
      doctorName: '', // 车载医生
      nurseName: '', // 车载护士
      contactPhone: '' // 联系电话
    },
    // 患者疾病
    medicalRecordInfoDto: {
      diseaseCategory: '', // 疾病类别
      medicalHisProType: '', // 病史提供类型
      historyProvider: '', // 病史提供者
      isMorb: '', // 发病时间
      chiefComplaint: '', // 患者主诉
      presentIllness: '', // 现病史
      pastHistory: '', //  既往史
      allergicHistory: '' // 过敏史
    },
    // 体格检查
    physicalExaminationDtoList: [
      {
        createTime: '', // 检查时间
        rr: '', // 呼吸频率(次/分)
        pulse: '', // 脉搏(次/分)
        spo2: '', // 血氧
        sbp: '', // 收缩压
        dbp: '', // 舒张压
        consciousness: '', // 意识
        leftPulil: '', // 瞳孔（左）
        rightPulil: '', // 瞳孔（右）
        lightReflection: '' // 对光反射
      }
    ],
    // 辅助检查
    supplementaryExaminationDto: {
      // 心电图
      electrocardiogramDto: {
        patientId: '',
        attachPath: '' // 附件路径
      },
      // POCT
      medPhepPoctEntity: {
        tnt: '', // TnT(ng/L)
        tntUnit: '', // TnT单位
        tnl: '', // Tnl(ng/L)
        tnlUnit: '', // Tnl单位
        bnp: '', // BNP(pg/L)
        bnpUnit: '', // BNP单位
        checkTime: '', // 检查时间
        ckmb: '', // CKMB
        ckmbUnit: '', // CKMB单位
        dDimer: '', // D-二聚体(ng/mL)
        dDimerUnit: '', // D-二聚体单位
        myo: '', // Myo(ng/L)
        myoUnit: '', // Myo单位
        ntProbnp: '', // NT-proBNP(pg/mL)
        ntProbnpUnit: '', // NT-proBNP单位
        patientId: '', // 患者ID
        reportFile: '', // 报告附件
        reportTime: '', // 报告时间
        serum: '', // 血清肌酐(umol/mL)
        serumUnit: '' // 血清肌酐单位
      },
      bloodglucose: '', // 血糖
      tiScore: '', // TI评分
      gcsScore: '', // GCS评分
      chestPainAssessment: '', // 胸痛评估
      killip: '', // Killip分级
      fastAssessment: '', // Fast评估
      otherCheck: '', // 其它检查 ,
      sitePhotos: [], // 现场照片
      liveVideo: [] // 现场视频
    },
    // 诊断处理
    diagnosticProcessingDto: {
      // 用药
      emergencyOrdersEntity: {
        patientId: '', // 所属患者
        stackId: '', // 药品组套ID
        drugId: '', // 药品ID
        dose: '', // 用量
        usageId: '', //  用法（数据字典表主键）
        createTime: '', // 用药时间
        createBy: '', // 创建人
        specifications: '', // 规格
        status: '', // 是否用于交接
        isHand: '' // 状态
      },
      diagnosis: '', // 初步诊断
      conditionGrade: '', // 病情判断
      treatment: '', // 急救措施
      rescueChangeResult: '', // 病情转归
      treatmentResult: '', // 出诊结果
      toHospial: '' // 送往医院
    },
    // 急救措施
    medPhepMeasuresEntityList: {
      // 用药
      emergencyOrdersEntity: {
        id: '', // 主键
        patientId: '', // 患者id
        measureKey: '', // 措施标识
        measureName: '', // 措施名称
        opTime: '' //  措施时间
      }
    },
    consents: '', // 知情同意书
    epidemiological: '' // 新冠流调表
  }
}
