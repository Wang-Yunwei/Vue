<template>
  <div class="task-preliminary-diagnosis-wrapper">
    <van-collapse v-model="exhibit" @change="collapseChange">
      <van-collapse-item title="基本信息" name="exhibit1">
        <div class="center" v-if="gcBasic">
          <div class="task-part-title">
            <span class="solid" />
            <span>基本信息</span>
          </div>
          <p v-if="gcBasic.name">
            <span>姓名</span>
            <span>{{ gcBasic.name }}</span>
          </p>
          <p v-if="gcBasic.gender">
            <span>性别</span>
            <span>{{ conversionOne(gcBasic.gender, dicData.genderOpts) }}</span>
          </p>
          <p v-if="gcBasic.age">
            <span>年龄</span>
            <span>{{ gcBasic.age }} 岁</span>
          </p>
          <p v-if="gcBasic.idcardType">
            <span>证件类型</span>
            <span>{{
              conversionOne(gcBasic.idcardType, dicData.idCardTypeOpts)
            }}</span>
          </p>
          <p v-if="gcBasic.identificationCard">
            <span>证件号</span>
            <span>{{ gcBasic.identificationCard }}</span>
          </p>
          <p v-if="gcBasic.birthday">
            <span>出生日期</span
            ><span>{{ dateOfBirth(gcBasic.birthday) }}</span>
          </p>
          <p v-if="gcBasic.nation">
            <span>民族</span>
            <span>{{ conversionOne(gcBasic.nation, dicData.nationOpts) }}</span>
          </p>
          <p v-if="gcBasic.ecName">
            <span>紧急联系人</span><span>{{ gcBasic.ecName }}</span>
          </p>
          <p v-if="gcBasic.ecType">
            <span>紧急联系人与患者关系</span>
            <span>{{
              conversionOne(gcBasic.ecType, dicData.urgentTypeOpts)
            }}</span>
          </p>
          <p v-if="gcBasic.ecPhone">
            <span>紧急联系电话</span>
            <span>{{ gcBasic.ecPhone }}</span>
          </p>
          <p v-if="gcBasic.outPatientNo">
            <span>门诊号</span>
            <span>{{ gcBasic.outPatientNo }}</span>
          </p>
          <p v-if="gcBasic.admissionNo">
            <span>住院号</span>
            <span>{{ gcBasic.admissionNo }}</span>
          </p>
        </div>
      </van-collapse-item>
      <van-collapse-item title="院前急救" name="exhibit2">
        <div class="center">
          <div class="task-part-title">
            <span class="solid" />
            <span>院前急救</span>
          </div>
          <p v-if="firstAid.licensePlate">
            <span> 车牌号</span><span>{{ firstAid.licensePlate }}</span>
          </p>
          <p v-if="firstAid.callTime">
            <span> 呼救时间</span><span>{{ firstAid.callTime }}</span>
          </p>
          <p v-if="firstAid.acceptMissionTime">
            <span> 接警时间</span><span>{{ firstAid.acceptMissionTime }}</span>
          </p>
          <p v-if="firstAid.planVehicleTime">
            <span> 派车时间</span><span>{{ firstAid.planVehicleTime }}</span>
          </p>
          <p v-if="firstAid.dispatchVehicleTime">
            <span> 出车时间</span
            ><span>{{ firstAid.dispatchVehicleTime }}</span>
          </p>
          <p v-if="firstAid.arrivePatientSideTime">
            <span> 医生到达现场时间</span
            ><span>{{ firstAid.arrivePatientSideTime }}</span>
          </p>
          <p v-if="firstAid.fmcTime">
            <span> 首次医疗接触时间</span><span>{{ firstAid.fmcTime }}</span>
          </p>
          <p v-if="firstAid.fmcDoctor">
            <span> 120首诊医生</span><span>{{ firstAid.fmcDoctor }}</span>
          </p>
          <p v-if="firstAid.leftSceneTime">
            <span> 离开现场时间</span><span>{{ firstAid.leftSceneTime }}</span>
          </p>
          <p v-if="firstAid.arrivedHospitalTime">
            <span> 到达医院时间</span
            ><span>{{ firstAid.arrivedHospitalTime }}</span>
          </p>
        </div>
        <div class="center">
          <div class="task-part-title">
            <span class="solid" />
            <span>患者病史</span>
          </div>
          <p v-if="firstAid.isMedicalHistory">
            <span>病史记录</span
            ><span>{{ parseYesNo(firstAid.isMedicalHistory) }}</span>
          </p>
          <p v-if="firstAid.cc">
            <span>主诉</span><span>{{ firstAid.cc }}</span>
          </p>
          <p v-if="firstAid.declarantName">
            <span>病史陈述者</span><span>{{ firstAid.declarantName }}</span>
          </p>
          <p v-if="firstAid.pastHistory">
            <span>既往病史</span>
            <span>{{
              conversion(firstAid.pastHistory, dicData.pastHistoryOpts)
            }}</span>
          </p>
        </div>
        <div class="center">
          <div class="task-part-title">
            <span class="solid" />
            <span>院前体征</span>
          </div>
          <p v-if="firstAid.isSign">
            <span>是否检测生命体征</span
            ><span>{{ parseYesNo(firstAid.isSign) }}</span>
          </p>
          <p v-if="firstAid.dbp || firstAid.sbp">
            <span>血压</span
            ><span>{{ firstAid.dbp }} / {{ firstAid.sbp }}</span>
          </p>
          <p v-if="firstAid.temperature">
            <span>体温</span><span>{{ firstAid.temperature }} ℃</span>
          </p>
          <p v-if="firstAid.breath">
            <span>呼吸</span><span>{{ firstAid.breath }} 次/分</span>
          </p>
          <p v-if="firstAid.heartRate">
            <span>心率/脉搏</span>
            <span>{{ firstAid.heartRate }} 次/分</span>
          </p>
          <p v-if="firstAid.spo">
            <span>血氧</span><span>{{ firstAid.spo }} %</span>
          </p>
          <p v-if="firstAid.mind">
            <span>意识</span>
            <span>{{ conversion(firstAid.mind, dicData.mindOpts) }}</span>
          </p>
          <p v-if="firstAid.acqTime">
            <span>体征采集时间</span><span>{{ firstAid.acqTime }}</span>
          </p>
        </div>
        <div class="task-part-title">
          <span class="solid" />
          <span>心电图</span>
        </div>
        <med-ecg-field
          v-if="preHosEcgList.length > 0"
          label="点击查看心电图"
          :prefixUrl="attachPrefix"
          :upload-url="$api.ecg.upload"
          :delete-url="$api.ecg.deleteEcg"
          :record-list="preHosEcgList"
          listonly
          auto-close
          @submit="() => {}"
          @delete-success="() => {}"
        />
        <div class="center">
          <div class="task-part-title">
            <span class="solid" />
            <span>专科评估</span>
          </div>
          <p v-if="firstAid.fast">
            <span> FAST评估</span>
            <span>{{ conversion(firstAid.fast, dicData.evaluateOpts) }}</span>
          </p>
        </div>
        <div class="center">
          <div class="task-part-title">
            <span class="solid" />
            <span>院前处置</span>
          </div>
          <p v-if="firstAid.isPreTreatment">
            <span>是否院前处置</span
            ><span>{{ parseYesNo(firstAid.isPreTreatment) }}</span>
          </p>
          <p v-if="firstAid.openveinTime">
            <span>开通静脉时间</span><span>{{ firstAid.openveinTime }}</span>
          </p>
          <p v-if="firstAid.phepDrugs">
            <span>院前用药史</span>
            <span>
              {{ conversion(firstAid.phepDrugs, dicData.pharmacyHistoryOpts) }}
            </span>
          </p>
          <p v-if="firstAid.phepDrugsOthers">
            <span>院前用药史(其它)</span
            ><span>{{ firstAid.phepDrugsOthers }}</span>
          </p>
          <p v-if="firstAid.isOxygen">
            <span>是否吸氧</span
            ><span>{{ parseYesNo(firstAid.isOxygen) }}</span>
          </p>
          <p v-if="firstAid.isFastBloodSurger">
            <span>是否检测快速血糖</span
            ><span>{{ parseYesNo(firstAid.isFastBloodSurger) }}</span>
          </p>
          <p v-if="firstAid.fastBloodSurger">
            <span>快速血糖</span><span>{{ firstAid.fastBloodSurger }}</span>
          </p>
          <p v-if="firstAid.fastBloodSurgerTime">
            <span>快速血糖时间</span
            ><span>{{ firstAid.fastBloodSurgerTime }}</span>
          </p>
        </div>
        <div class="center">
          <div class="task-part-title">
            <span class="solid" />
            <span>初步印象</span>
          </div>
          <p v-if="firstAid.firstImpression">
            <span> 初步印象</span
            ><span>{{
              yesno.yes === firstAid.firstImpression ? "卒中" : "非卒中"
            }}</span>
          </p>
        </div>
        <div class="center">
          <div class="task-part-title">
            <span class="solid" />
            <span>外院转诊</span>
          </div>
          <p v-if="outReferral.isCtExam">
            <span> 是否外院CT检查</span
            ><span>{{ parseYesNo(outReferral.isCtExam) }}</span>
          </p>
          <p v-if="outReferral.ctExamTime">
            <span> CT检查完成时间</span
            ><span>{{ outReferral.ctExamTime }}</span>
          </p>
          <p v-if="outReferral.hospitalId">
            <span> 检查医院</span><span>{{ outReferral.hospitalId }}</span>
          </p>
          <p v-if="outReferral.isCtExam">
            <span> 是否外院行静脉溶栓</span
            ><span>{{ parseYesNo(outReferral.isOpenvein) }}</span>
          </p>
          <p v-if="outReferral.veinHospital">
            <span> 溶栓医院</span><span>{{ outReferral.veinHospital }}</span>
          </p>
          <p v-if="outReferral.isAssitHospital">
            <span> 是否是协作医院</span
            ><span>{{ parseYesNo(outReferral.isAssitHospital) }}</span>
          </p>
          <p v-if="outReferral.veinDrugs">
            <span> 溶栓药物</span>
            <span>{{
              "0" === outReferral.veinDrugs ? "尿激酶" : "rt-PA"
            }}</span>
          </p>
          <p v-if="outReferral.firstDosage">
            <span> 首剂药量</span>
            <span>{{
              1 === outReferral.firstDosage ? "0.6mg/kg" : "0.9mg/kg"
            }}</span>
          </p>
          <p v-if="outReferral.realDosage">
            <span> 实际给药剂量</span><span>{{ realDosageText }}</span>
          </p>
          <p v-if="outReferral.isOtherDrug">
            <span> 有无其他药物</span>
            <span>{{ "0" === outReferral.isOtherDrug ? "无" : "有" }}</span>
          </p>
          <p v-if="outReferral.otherDrugs">
            <span> 其他药物</span>
            <span>{{
              conversion(outReferral.otherDrugs, dicData.rsOtherDrugList)
            }}</span>
          </p>
        </div>
      </van-collapse-item>
      <van-collapse-item title="预检分诊" name="exhibit3">
        <div class="center">
          <div class="task-part-title">
            <span class="solid" />
            <span>接诊信息</span>
          </div>
          <p v-if="triage.gcTriage.arriveHospitalTime">
            <span>患者到院时间</span
            ><span>{{ triage.gcTriage.arriveHospitalTime }}</span>
          </p>
          <p v-if="triage.gcTriage.triageTime">
            <span>急诊分诊时间</span
            ><span>{{ triage.gcTriage.triageTime }}</span>
          </p>
          <p v-if="triage.gcTriage.triageVisitTime">
            <span>急诊医生接诊时间</span
            ><span>{{ triage.gcTriage.triageVisitTime }}</span>
          </p>
          <p v-if="triage.gcTriage.strokeNotifyTime">
            <span>通知卒中医生时间</span>
            <span>{{ triage.gcTriage.strokeNotifyTime }}</span>
          </p>
          <p v-if="triage.gcTriage.strokeVisitTime">
            <span>卒中医生接诊时间</span>
            <span>{{ triage.gcTriage.strokeVisitTime }}</span>
          </p>
          <p v-if="triage.gcTriage.strokeDoctor">
            <span>接诊医生</span>
            <span>{{ triage.gcTriage.strokeDoctor }}</span>
          </p>
          <p v-if="triage.gcTriage.rrEnterTime">
            <span>进入抢时间</span>
            <span>{{ triage.gcTriage.rrEnterTime }}</span>
          </p>
          <p v-if="triage.gcTriage.rrLeaveTime">
            <span>出抢时间</span>
            <span>{{ triage.gcTriage.rrLeaveTime }}</span>
          </p>
          <p v-if="otherInfo.fastEdScore">
            <span>FAST-ED评分</span>
            <span>{{ otherInfo.fastEdScore }} 分</span>
          </p>
          <p v-if="triage.gcTriage.illnessLevel">
            <span>病情分级</span>
            <span>{{
              conversionOne(
                triage.gcTriage.illnessLevel,
                dicData.illnessLevelOpts
              )
            }}</span>
          </p>
          <p v-if="otherInfo.mrsScore">
            <span>发病前mRS评分</span>
            <span>{{ otherInfo.mrsScore }} 分</span>
          </p>
          <p v-if="sign.dbp || sign.sbp">
            <span>血压</span><span>{{ sign.dbp }} / {{ sign.sbp }}</span>
          </p>
          <p v-if="sign.temperature">
            <span>体温</span><span>{{ sign.temperature }} ℃</span>
          </p>
          <p v-if="sign.breath">
            <span>呼吸</span><span>{{ sign.breath }} 次/分</span>
          </p>
          <p v-if="sign.heartRate">
            <span>心率/脉搏</span>
            <span>{{ sign.heartRate }} 次/分</span>
          </p>
          <p v-if="sign.spo">
            <span>血氧</span><span>{{ sign.spo }} %</span>
          </p>
          <p v-if="sign.mind">
            <span>意识</span>
            <span>{{ conversion(sign.mind, dicData.mindOpts) }}</span>
          </p>
          <p v-if="sign.acqTime">
            <span>体征采集时间</span><span>{{ sign.acqTime }}</span>
          </p>
          <div class="task-part-title">
            <span class="solid" />
            <span>心电图</span>
          </div>
          <med-ecg-field
            v-if="withinHosEcgList.length > 0"
            label="点击查看心电图"
            :prefixUrl="attachPrefix"
            :upload-url="$api.ecg.upload"
            :delete-url="$api.ecg.deleteEcg"
            :record-list="withinHosEcgList"
            listonly
            auto-close
            @submit="() => {}"
            @delete-success="() => {}"
          />
          <div class="task-part-title">
            <span class="solid" />
            <span>其它</span>
          </div>
          <p v-if="triage.gcTriage.bloodGlucose">
            <span>快速血糖</span
            ><span>{{ triage.gcTriage.bloodGlucose }} mmol/L</span>
          </p>
          <p v-if="triage.gcTriage.bloodGlucoseTime">
            <span>快速血糖时间</span
            ><span>{{ triage.gcTriage.bloodGlucoseTime }}</span>
          </p>
          <p v-if="triage.gcTriage.bodyWeight">
            <span>体重</span><span>{{ triage.gcTriage.bodyWeight }} kg</span>
          </p>
          <p v-if="triage.gcTriage.isOpenvein">
            <span>是否开通静脉</span
            ><span>{{ parseYesNo(triage.gcTriage.isOpenvein) }}</span>
          </p>
          <p v-if="triage.gcTriage.openveinTime">
            <span>开通静脉时间</span
            ><span>{{ triage.gcTriage.openveinTime }}</span>
          </p>
          <p>
            <span>是否为醒后卒中</span>
            <span v-if="triage.gcTriage.isAfterWakeup == '1'">是</span>
            <span v-if="triage.gcTriage.isAfterWakeup == '0'">否</span>
            <span v-else></span>
          </p>
          <p v-if="triage.gcTriage.onsetTime">
            <span>发病时间</span><span>{{ triage.gcTriage.onsetTime }}</span>
          </p>
          <p v-if="triage.gcTriage.lastHealthyTime">
            <span>最后看起来正常时间</span
            ><span>{{ triage.gcTriage.lastHealthyTime }}</span>
          </p>
          <p v-if="triage.gcTriage.awareTime">
            <span>发现时间</span><span>{{ triage.gcTriage.awareTime }}</span>
          </p>
        </div>
      </van-collapse-item>
      <van-collapse-item title="检验检测" name="exhibit4">
        <div class="center">
          <div class="task-part-title">
            <span class="solid" />
            <span>病史记录</span>
          </div>
          <p v-if="detection.gcMh.declarantName">
            <span> 病史陈述者姓名</span
            ><span>{{ detection.gcMh.declarantName }}</span>
          </p>
          <p v-if="detection.gcMh.declarantType">
            <span> 与患者关系</span>
            <span>{{
              conversion(
                detection.gcMh.declarantType,
                dicData.declarantTypeOpts
              )
            }}</span>
          </p>
          <p v-if="detection.gcMh.cc">
            <span>主诉</span>
            <span>{{ detection.gcMh.cc }}</span>
          </p>
          <p v-if="detection.gcMh.symptom">
            <span>症状</span>
            <span>{{
              conversion(detection.gcMh.symptom, dicData.symptomOpts)
            }}</span>
          </p>
          <p v-if="detection.gcMh.symptomOther">
            <span>症状(其它)</span>
            <span>{{ detection.gcMh.symptomOther }}</span>
          </p>
          <p v-if="detection.gcMh.pastHistory">
            <span>既往病史</span>
            <span>{{
              conversion(detection.gcMh.pastHistory, dicData.pastHistoryOpts)
            }}</span>
          </p>
          <p v-if="detection.gcMh.pastHistoryOther">
            <span>既往病史(其它)</span
            ><span>{{ detection.gcMh.pastHistoryOther }}</span>
          </p>
          <p v-if="detection.gcMh.isAllergicHistory">
            <span>过敏史</span
            ><span>{{ parseYesNo(detection.gcMh.isAllergicHistory) }}</span>
          </p>
          <p v-if="detection.gcMh.allergicHistory">
            <span>过敏史</span><span>{{ detection.gcMh.allergicHistory }}</span>
          </p>
          <p v-if="detection.gcMh.pharmacyHistory">
            <span>用药史</span>
            <span>{{
              conversion(
                detection.gcMh.pharmacyHistory,
                dicData.pharmacyHistoryOpts
              )
            }}</span>
          </p>
          <p v-if="detection.gcMh.phAntiplatelet">
            <span>抗血小板药物</span>
            <span>{{
              conversion(
                detection.gcMh.phAntiplatelet,
                dicData.phAntiplateletOpts
              )
            }}</span>
          </p>
          <p v-if="detection.gcMh.phAntiplateletOther">
            <span>抗血小板药物(其它)</span
            ><span>{{ detection.gcMh.phAntiplateletOther }}</span>
          </p>
          <p v-if="detection.gcMh.phAnticoagulation">
            <span>抗凝药物</span>
            <span>{{
              conversion(
                detection.gcMh.phAnticoagulation,
                dicData.phAnticoagulationOpts
              )
            }}</span>
          </p>
          <p v-if="detection.gcMh.phAnticoagulationOther">
            <span>抗凝药物(其它)</span>
            <span>{{ detection.gcMh.phAnticoagulationOther }}</span>
          </p>
          <div class="task-part-title">
            <span class="solid" />
            <span>心电图</span>
          </div>
          <div class="task-electrocardiogram-uploaded">
            <van-swipe-cell v-for="item in detection.ecgList" :key="item.id">
              <van-cell class="card-item">
                <span class="pin" :class="{ spec: item.ecgDiagnosis == '0' }">
                  {{
                    item.ecgDiagnosis == "0"
                      ? "异常"
                      : item.ecgDiagnosis == "1"
                      ? "正常"
                      : "未知"
                  }}
                </span>
                <van-image
                  v-for="url in item.ecgFile ? item.ecgFile.split(';') : []"
                  :key="url"
                  :src="url"
                  @click="echo(item.ecgFile ? item.ecgFile.split(';') : [])"
                  fit="contain"
                />
                <div class="info flex-c-b">
                  <div class="infoTime">
                    <van-icon name="clock-o" />
                    <span> {{ item.ecgTime }} </span>
                  </div>
                  <span class="infoE">{{
                    conversion(item.ecgException, dicData.ecgExceptionOpts)
                  }}</span>
                  <!-- <span>{{ item.ecgExceptionOther }}</span> -->
                </div>
              </van-cell>
            </van-swipe-cell>
          </div>
          <div class="task-part-title">
            <span class="solid" />
            <span>评分</span>
          </div>
          <p v-if="otherInfo.firstNihssScore">
            <span>首次NIHSS评分</span>
            <span>{{ otherInfo.firstNihssScore }} 分</span>
          </p>
          <p v-if="otherInfo.firstGcsScore">
            <span>首次GCS评分</span>
            <span>{{ otherInfo.firstGcsScore }} 分</span>
          </p>
          <div class="task-part-title">
            <span class="solid" />
            <span>实验室检查</span>
          </div>
          <p v-if="detection.gcDetection.bloodCollectionTime">
            <span>采血时间</span
            ><span>{{ detection.gcDetection.bloodCollectionTime }}</span>
          </p>
          <p v-if="detection.gcLisList">
            <span>血常规报告时间</span
            ><span>{{ gcLisListConversion("1", detection.gcLisList) }}</span>
          </p>
          <p v-if="detection.gcLisList">
            <span>凝血常规报告时间</span
            ><span>{{ gcLisListConversion("2", detection.gcLisList) }}</span>
          </p>
          <p v-if="detection.gcLisList">
            <span>肝肾功及电解质</span>
            <span>{{ gcLisListConversion("3", detection.gcLisList) }}</span>
          </p>
          <div class="task-part-title">
            <span class="solid" />
            <span>影像检查</span>
          </div>
          <p v-if="detection.gcDetection.isSkullCt">
            <span>是否开具头颅CT单</span>
            <span>{{ parseYesNo(detection.gcDetection.isSkullCt) }}</span>
          </p>
          <p v-if="detection.gcDetection.skullCtTime">
            <span>开具头颅CT单时间</span>
            <span>{{ detection.gcDetection.skullCtTime }}</span>
          </p>
          <p v-if="detection.gcImageList">
            <span>检查类型</span>
            <span>{{ imageConversion(detection.gcImageList) }}</span>
          </p>
          <div v-for="item in detection.gcImageList" :key="item.id">
            <p>
              <span
                >{{
                  conversionOne(item.itemType, dicData.imageItemTypeOpts)
                }}完成时间</span
              >
              <span>{{ item.finishTime }}</span>
            </p>
          </div>
          <p v-if="detection.gcDetection.ctEnterTime">
            <span>进入CT室时间</span>
            <span>{{ detection.gcDetection.ctEnterTime }}</span>
          </p>
          <p v-if="detection.gcDetection.ctLeaveTime">
            <span>离开CT室时间</span>
            <span>{{ detection.gcDetection.ctLeaveTime }}</span>
          </p>
          <p v-if="detection.gcDetection.isCtAspects">
            <span>是否CT-Aspects评分</span>
            <span>{{ parseYesNo(detection.gcDetection.isCtAspects) }}</span>
          </p>
          <p v-if="otherInfo.ctAspectBeforeScore">
            <span>CT-Aspects评分前循环</span>
            <span>{{ otherInfo.ctAspectBeforeScore }} 分</span>
          </p>
          <p v-if="otherInfo.ctAspectAfterScore">
            <span>CT-Aspects评分后循环</span>
            <span>{{ otherInfo.ctAspectAfterScore }} 分</span>
          </p>
          <p v-if="otherInfo.mriAspectBeforeScore">
            <span>MRI-Aspects评分前循环</span>
            <span>{{ otherInfo.mriAspectBeforeScore }} 分</span>
          </p>
          <p v-if="otherInfo.mriAspectAfterScore">
            <span>MRI-Aspects评分后循环</span>
            <span>{{ otherInfo.mriAspectAfterScore }} 分</span>
          </p>
          <div class="task-part-title">
            <span class="solid" />
            <span>分检诊结果</span>
          </div>
          <p>
            <span>初步诊断</span>
            <span>{{
              conversionOne(detection.gcDetection.diag, dicData.diagOpts)
            }}</span>
          </p>
          <p>
            <span>是否大血管闭塞</span>
            <span v-if="detection.gcDetection.isLvo == '1'">是</span>
            <span v-else-if="detection.gcDetection.isLvo == '0'">否</span>
            <span v-else>未知</span>
          </p>
          <p>
            <span>初步处置</span>
            <span>{{
              conversion(detection.gcDetection.dispose, dicData.disposeOpts)
            }}</span>
          </p>
        </div>
      </van-collapse-item>
      <van-collapse-item title="静脉溶栓" name="exhibit5">
        <div class="center">
          <div class="task-part-title">
            <span class="solid" />
            <span>静脉溶栓</span>
          </div>
          <p v-if="cure.rsAdmissionTime">
            <span>溶栓医生接诊时间 </span
            ><span>{{ cure.rsAdmissionTime }}</span>
          </p>
          <p v-if="cure.rsAdmissionDoctor">
            <span>急诊医生</span>
            <span>{{ cure.rsAdmissionDoctor }}</span>
          </p>
          <p v-if="cure.rsTaboo">
            <span>溶栓禁忌症</span>
            <span>{{ conversion(cure.rsTaboo, dicData.rsTabooList) }}</span>
          </p>
          <p v-if="cure.rsRelativeTaboo">
            <span>溶栓相对禁忌症</span>
            <span>{{
              conversion(cure.rsRelativeTaboo, dicData.rsRelativeTabooList)
            }}</span>
          </p>
          <p v-if="cure.rsTalkStartTime">
            <span>溶栓开始谈话时间</span>
            <span>{{ cure.rsTalkStartTime }}</span>
          </p>
          <p v-if="cure.isRsInformed">
            <span>溶栓是否知情</span>
            <span>{{ parseYesNo(cure.isRsInformed) }}</span>
          </p>
          <p v-if="cure.isRsInformedArgee">
            <span>溶栓知情同意</span>
            <span>{{ cure.isRsInformedArgee === "1" ? "同意" : "拒绝" }}</span>
          </p>
          <p v-if="cure.rsInformedSignTime">
            <span>溶栓家属签字时间</span>
            <span>{{ cure.rsInformedSignTime }}</span>
          </p>
          <p v-if="cure.rsTalkEndTime">
            <span>溶栓谈话结束时间</span>
            <span>{{ cure.rsTalkEndTime }}</span>
          </p>
          <p v-if="cure.sRsVein">
            <span>是否静脉溶栓</span>
            <span>{{ parseYesNo(cure.sRsVein) }}</span>
          </p>
          <p v-if="cure.rsRefuseReason">
            <span>溶栓拒绝原因</span>
            <span>{{
              conversion(cure.rsRefuseReason, dicData.rsRefuseReasonList)
            }}</span>
          </p>
          <p v-if="otherInfo.rsNihssBeforeScore">
            <span>溶栓前NIHSS</span>
            <span>{{ otherInfo.rsNihssBeforeScore }} 分</span>
          </p>
          <p v-if="cure.firstPharmacyTime">
            <span>首剂给药时间</span>
            <span>{{ cure.firstPharmacyTime }}</span>
          </p>
          <p v-if="cure.bodyWeight">
            <span>患者体重</span>
            <span>{{ cure.bodyWeight }}</span>
          </p>
          <p v-if="cure.rsDrugs">
            <span>溶栓药物</span>
            <span>{{ cure.rsDrugs === "1" ? "rt-PA" : "尿激酶" }}</span>
          </p>
          <p v-if="cure.rsAdaptation && cure.rsDrugs && cure.rsDrugs === '1'">
            <span>溶栓适应症</span>
            <span>{{
              conversion(cure.rsAdaptation, dicData.rsAdaptation1List)
            }}</span>
          </p>
          <p v-if="cure.rsAdaptation && cure.rsDrugs && cure.rsDrugs === '0'">
            <span>溶栓适应症</span>
            <span>{{
              conversion(cure.rsAdaptation, dicData.rsAdaptation2List)
            }}</span>
          </p>
          <p v-if="cure.rsDose && cure.rsDrugs && cure.rsDrugs === '1'">
            <span>给药剂量标准</span>
            <span>{{ conversion(cure.rsDose, dicData.rsDoseList) }}</span>
          </p>
          <p v-if="cure.rsDoseActual">
            <span>给药剂量</span>
            <span>{{ cure.rsDoseActual }} mg</span>
          </p>
          <p v-if="cure.rsUrokinaseDose">
            <span>尿激酶给药剂量</span>
            <span>{{ cure.rsUrokinaseDose }} 万IU</span>
          </p>
          <p v-if="cure.rsOtherDrug">
            <span>使用其他药物</span>
            <span>{{
              conversion(cure.rsOtherDrug, dicData.rsOtherDrugList)
            }}</span>
          </p>
          <p v-if="cure.rsOthers">
            <span>使用其他药物其他</span>
            <span>{{ cure.rsOthers }}</span>
          </p>
          <p v-if="otherInfo.rsNihssAfterScore">
            <span>溶栓后即刻NIHSS</span>
            <span>{{ otherInfo.rsNihssAfterScore }} 分</span>
          </p>
          <p v-if="cure.isRsAde">
            <span>静脉溶栓是否发生不良事件</span>
            <span>{{ parseYesNo(cure.isRsAde) }}</span>
          </p>
          <p v-if="cure.rsAdeTime">
            <span>静脉溶栓不良事件时间</span>
            <span>{{ cure.rsAdeTime }}</span>
          </p>
          <p v-if="cure.rsAdeType">
            <span>静脉溶栓不良事件类型</span>
            <span>{{ conversion(cure.rsAdeType, dicData.rsAdeTypeList) }}</span>
          </p>
          <p v-if="cure.rsAdeIhType">
            <span>颅内出血类型</span>
            <span>{{
              conversion(cure.rsAdeIhType, dicData.rsAdeIhTypeList)
            }}</span>
          </p>
          <p v-if="cure.rsAdeIhSeverity">
            <span>出血严重程度</span>
            <span>{{
              conversion(cure.rsAdeIhSeverity, dicData.rsAdeIhSeverityList)
            }}</span>
          </p>
          <p v-if="cure.isRsAdeIahr">
            <span>是否合并梗死灶外出血转化</span>
            <span>{{ parseYesNo(cure.isRsAdeIahr) }}</span>
          </p>
          <p v-if="cure.rsAdeOther">
            <span>静脉溶栓其他不良事件</span>
            <span>{{
              conversion(cure.rsAdeOther, dicData.rsAdeOtherOpts)
            }}</span>
          </p>
        </div>
      </van-collapse-item>
      <van-collapse-item title="介入手术" name="exhibit6">
        <div class="center">
          <div class="task-part-title">
            <span class="solid" />
            <span>介入手术</span>
          </div>
          <p v-if="cure.crActiveTime">
            <span>激活导管室时间</span><span>{{ cure.crActiveTime }}</span>
          </p>
          <p v-if="cure.crEnterTime">
            <span>进入导管室时间</span><span>{{ cure.crEnterTime }}</span>
          </p>
          <p v-if="cure.crLeaveTime">
            <span>离开导管室时间</span><span>{{ cure.crLeaveTime }}</span>
          </p>
          <p v-if="cure.pciAdmissionTime">
            <span>介入医生接诊时间</span
            ><span>{{ cure.pciAdmissionTime }}</span>
          </p>
          <p v-if="cure.pciAdmissionDoctor">
            <span>介入接诊医生</span><span>{{ cure.pciAdmissionDoctor }}</span>
          </p>
          <p v-if="cure.pciTaboo">
            <span>介入禁忌症</span>
            <span>{{ conversion(cure.pciTaboo, dicData.pciTabooList) }}</span>
          </p>
          <p v-if="cure.pciTalkStartTime">
            <span>介入开始谈话时间</span
            ><span>{{ cure.pciTalkStartTime }}</span>
          </p>
          <p v-if="cure.isPciInformedArgee">
            <span>介入是否知情</span
            ><span>{{ parseYesNo(cure.isPciInformedArgee) }}</span>
          </p>
          <p v-if="cure.pciInformedSignTime">
            <span>介入家属签字时间</span
            ><span>{{ cure.pciInformedSignTime }}</span>
          </p>
          <p v-if="cure.pciTalkEndTime">
            <span>介入谈话结束时间</span><span>{{ cure.pciTalkEndTime }}</span>
          </p>
          <p v-if="cure.pciAdaptation">
            <span>介入适应症</span>
            <span>{{
              conversion(cure.pciAdaptation, dicData.pciAdaptationList)
            }}</span>
          </p>
          <p v-if="cure.isPci">
            <span>是否介入治疗</span><span>{{ parseYesNo(cure.isPci) }}</span>
          </p>
          <p v-if="cure.pciRefuseReason">
            <span>介入治疗拒绝原因</span>
            <span>{{
              conversion(cure.pciRefuseReason, dicData.pciRefuseReasonList)
            }}</span>
          </p>
          <p v-if="otherInfo.pciNihssBeforeScore">
            <span>介入前NIHSS</span
            ><span>{{ otherInfo.pciNihssBeforeScore }} 分</span>
          </p>
          <p v-if="cure.femoralArteryStartTime">
            <span>股动脉穿刺开始时间</span
            ><span>{{ cure.femoralArteryStartTime }}</span>
          </p>
          <p v-if="cure.femoralArteryFinishTime">
            <span>完成动脉穿刺时间</span
            ><span>{{ cure.femoralArteryFinishTime }}</span>
          </p>
          <p v-if="cure.bloodVesselsTime">
            <span>首次血管造影开始时间</span
            ><span>{{ cure.bloodVesselsTime }}</span>
          </p>
          <p v-if="cure.bloodVesselsTiciLevel">
            <span>首次血管造影TICI分级</span>
            <span>{{
              conversion(cure.bloodVesselsTiciLevel, dicData.ticiLevelList)
            }}</span>
          </p>
          <p v-if="cure.pciReFinishTime">
            <span>完成造影评估时间</span><span>{{ cure.pciReFinishTime }}</span>
          </p>
          <p v-if="cure.pciStrategy">
            <span>开通策略</span>
            <span>{{
              conversion(cure.pciStrategy, dicData.pciStrategyList)
            }}</span>
          </p>
          <p v-if="cure.thrombectomyStartTime">
            <span>开始取栓时间</span
            ><span>{{ cure.thrombectomyStartTime }}</span>
          </p>
          <p v-if="cure.pciFroTiciLevel">
            <span>首次再通TICI分级</span>
            <span>{{
              conversion(cure.pciFroTiciLevel, dicData.ticiLevelList)
            }}</span>
          </p>
          <p v-if="cure.pciFroTime">
            <span>首次血管再通时间</span><span>{{ cure.pciFroTime }}</span>
          </p>
          <p v-if="cure.pciLroTiciLevel">
            <span>首次再通TICI分级</span>
            <span>{{
              conversion(cure.pciLroTiciLevel, dicData.ticiLevelList)
            }}</span>
          </p>
          <p v-if="cure.pciLroTime">
            <span>末次血管再通时间</span><span>{{ cure.pciLroTime }}</span>
          </p>
          <p v-if="otherInfo.pciNihssAfterScore">
            <span>介入后即刻NIHSS</span
            ><span>{{ otherInfo.pciNihssAfterScore }} 分</span>
          </p>
          <p v-if="cure.isPciAde">
            <span>介入是否发生不良事件</span
            ><span>{{ parseYesNo(cure.isPciAde) }}</span>
          </p>
          <p v-if="cure.pciAdeTime">
            <span>介入不良事件时间</span><span>{{ cure.pciAdeTime }}</span>
          </p>
          <p v-if="cure.pciAdeType">
            <span>介入不良事件类型</span>
            <span>{{
              conversion(cure.pciAdeType, dicData.pciAdeTypeList)
            }}</span>
          </p>
          <p v-if="cure.pciAdeOther">
            <span>介入不良事件类型(其它)</span
            ><span>{{ cure.pciAdeOther }}</span>
          </p>
        </div>
      </van-collapse-item>
      <van-collapse-item title="患者转归" name="exhibit7">
        <div class="center">
          <div class="task-part-title">
            <span class="solid" />
            <span>患者转归</span>
          </div>
          <p v-if="outcome.isDelay">
            <span>是否有延误原因</span>
            <span>{{ parseYesNo(outcome.isDelay) }}</span>
          </p>
          <p v-if="outcome.delayReason">
            <span>耗时原因</span>
            <span>{{
              conversion(outcome.delayReason, dicData.delayReasonList)
            }}</span>
          </p>
          <p v-if="outcome.delayReasonOther">
            <span>耗时原因(其它)</span>
            <span>{{ outcome.delayReasonOther }}</span>
          </p>
          <p v-if="outcome.whereabouts">
            <span>病人去向</span>
            <span>{{
              conversion(outcome.whereabouts, dicData.whereaboutsList, false)
            }}</span>
          </p>
          <p v-if="outcome.whereaboutsOther">
            <span>病人去向其他</span>
            <span>{{ outcome.whereaboutsOther }}</span>
          </p>
        </div>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>
<script>
import Vue from 'vue'
import { Divider, ImagePreview } from 'vant'
import {
  Gc,
  GcFirstAid,
  GcOutReferral,
  GcDetection,
  GcTriage,
  GcSign,
  GcOutcome,
  GcCure
} from '@model/commonModel'
import { yesno } from '@constant/commonConstant'
import { mapGetters } from 'vuex'

Vue.use(Divider)
export default {
  props: {},
  data() {
    return {
      attachPrefix: window.GLOBAL_ATTACH_PREFIX,
      show: false,
      yesno,
      extend: '1', // 初步诊断标识
      exhibit: [
        'exhibit1',
        'exhibit2',
        'exhibit3',
        'exhibit4',
        'exhibit5',
        'exhibit6',
        'exhibit7'
      ],
      diagnosisTwo: '',
      registId: this.$route.query.registId,
      ecgExceptionOpts: [],
      // 基本信息
      gcBasic: Gc(),
      BasicInformation: {
        identificationCard: '',
        birthday: '',
        nation: '',
        ecName: '',
        ecType: '',
        ecPhone: ''
      },
      // 院前心电图
      preHosEcgList: [],
      // 院内心电图
      withinHosEcgList: [],
      // 院前急救
      firstAid: GcFirstAid(),
      // 外院转诊
      outReferral: GcOutReferral(),
      // 分诊
      triage: {
        gcTriage: { ...GcTriage(), registId: this.$route.query.registId }
      },
      sign: GcSign(),
      // 检诊
      detection: {
        gcDetection: { ...GcDetection(), registId: this.$route.query.registId },
        gcMh: {},
        // 实验室检查
        gcLisList: [],
        // 影像学检查
        gcImageList: [{ finishTime: '' }]
      },
      // 溶栓-介入
      cure: GcCure(),
      outcome: GcOutcome(),
      // 其他信息
      otherInfo: {
        fastEdScore: undefined,
        mrsScore: undefined,
        firstNihssScore: undefined,
        firstGcsScore: undefined,
        ctAspectBeforeScore: undefined,
        ctAspectAfterScore: undefined,
        mriAspectBeforeScore: undefined,
        mriAspectAfterScore: undefined,
        rsNihssBeforeScore: undefined,
        rsNihssAfterScore: undefined,
        pciNihssBeforeScore: undefined,
        pciNihssAfterScore: undefined,
        admissionDept: ''
      }
    }
  },
  created() {
    this.getPreviewList()
  },
  computed: {
    ...mapGetters(['dicData']),
    realDosageText() {
      if (!this.outReferral.realDosage || !this.outReferral.veinDrugs) {
        return ''
      }
      const value = this.outReferral.realDosage
      const suffix = this.outReferral.veinDrugs === '1' ? 'mg' : 'IU'
      return `${value} ${suffix}`
    }
  },
  methods: {
    exceptionReason(str) {
      const arrValues = str ? str.split(',') : []
      const labels = arrValues.map(val => {
        const matched = this.ecgExceptionOpts.find(item => item.value === val)
        return matched?.label
      })
      return labels.join(' ; ')
    },
    echo(item) {
      ImagePreview(item)
    },
    collapseChange(val) {
      if (val) {
        this.diagnosisTwo = ''
      }
    },
    dateOfBirth(str) {
      if (!str) {
        return ''
      } else {
        return str.substring(0, 10)
      }
    },
    // 多个value转换汉字
    conversion(str, list, skipOther = true) {
      if (str && list) {
        const arrValues = str ? str.split(',') : []
        const labels = arrValues.map(val => {
          const matched = list
            .filter(item => (skipOther ? item.value !== '99' : true))
            .find(item => item.value === val)
          return matched?.label
        })
        return labels.filter(item => item).join(' ; ')
      }
    },
    // value转换汉字
    conversionOne(str, list) {
      if (str && list) {
        const matched = list.find(valx => valx.value === str)
        return matched?.label
      }
    },
    parseYesNo(val) {
      return this.yesno.yes === val ? '是' : '否'
    },
    // 实验检查value转换汉字
    gcLisListConversion(str, list) {
      if (str && list) {
        const matched = list.find(item => item.itemType === str)
        return matched?.reportTime
      }
    },
    // 影像检查类型
    imageConversion(list) {
      if (list) {
        let labels = ''
        list.map(val => {
          labels +=
            this.conversionOne(val.itemType, this.dicData.imageItemTypeOpts) +
            ' '
        })
        return labels
      }
    },
    //  查询所有信息
    getPreviewList() {
      this.$api.preview
        .getPreviewList(this.$route.query.registId)
        .then(({ result }) => {
          // 基本信息
          if (result.medswmgcvo) {
            this.gcBasic = { ...this.gcBasic, ...result.medswmgcvo }
          }
          // 院前急救
          if (result.medswmgcfirstaidvo) {
            this.firstAid = { ...this.firstAid, ...result.medswmgcfirstaidvo }
          }
          // 院外转诊
          if (result.outReferral) {
            this.outReferral = { ...this.outReferral, ...result.outReferral }
          }
          // 分诊
          if (result.medswmgctriagevo) {
            this.triage.gcTriage = {
              ...this.triage.gcTriage,
              ...result.medswmgctriagevo
            }
          }
          if (result.sign) {
            this.sign = { ...this.sign, ...result.sign }
          }
          // 检诊
          if (result.medSwmGcDetectionInfoVO) {
            this.detection = {
              ...this.detection,
              ...result.medSwmGcDetectionInfoVO
            }
          }
          // 溶栓-介入
          if (result.cure) {
            this.cure = {
              ...this.cure,
              ...result.cure
            }
          }
          // 实验检查
          this.detection.gcLisList = result.medSwmGcDetectionInfoVO.gcLisList
          // 影像检查
          this.detection.gcImageList =
            result.medSwmGcDetectionInfoVO.gcImageList
          if (result.outcome) {
            this.outcome = { ...this.outcome, ...result.outcome }
          }
          // 其他信息
          if (result.otherInfo) {
            this.otherInfo = {
              ...this.otherInfo,
              ...result.otherInfo
            }
          }
          // 院前心电图
          if (result.preHosEcgList) {
            this.preHosEcgList = result.preHosEcgList
          }
          // 院内心电图
          if (result.withinHosEcgList) {
            this.withinHosEcgList = result.withinHosEcgList
          }
        })
    },
    // 外院转诊
    getOutReferral() {
      this.$api.outReferral.getOutReferral(this.registId).then(({ result }) => {
        this.$preventWatch(() => {
          if (result) {
            this.outReferral = {
              ...this.outReferral,
              ...result
            }
          }
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
