<template>
  <div>
    <el-row :gutter="gutter">
      <el-col :span="space_three_quater">
        <el-form-item label="出院诊断" prop="Discharge.Diagnosis" class="input_required">
          <el-radio-group v-model="patient.Discharge.Diagnosis" size="mini">
            <el-radio-button
              v-for="item in DischargeDiagnosisDict"
              :key="'Diagnosis-'+item.Key"
              :label="item.Key"
            >
              {{ item.Value }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="space_quarter">
        <el-form-item label="确诊时间" prop="Discharge.DiagnosisTime" class="input_required">
          <el-date-picker
            v-model="patient.Discharge.DiagnosisTime"
            v-dtpformat
            type="datetime"
            :format="timeFormat"
            :value-format="timeFormat"
            placeholder="请选择确诊时间"
            size="mini"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="space_three_quater">
        <el-form-item label="COVID-19" prop="Discharge.COVID19" class="input_required">
          <el-radio-group v-model="patient.Discharge.COVID19" size="mini">
            <el-radio-button
              v-for="item in COVID19Dict"
              :key="'COVID19-'+item.Key"
              :label="item.Key"
            >
              {{ item.Value }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- 非心源性胸痛 -->
    <el-row v-if="IsNacs()" :gutter="gutter">
      <el-col :span="space_full">
        <el-form-item label="非ACS心源性胸痛类型" prop="Discharge.NacsType" class="input_required">
          <el-checkbox-group v-model="patient.Discharge.NacsType" size="mini">
            <el-checkbox
              v-for="item in NacsTypeDict"
              :key="'NacsType-'+item.Key"
              :label="item.Key"
            >
              {{ item.Value }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="IsNccp()" :gutter="gutter">
      <el-col :span="space_full">
        <el-form-item label="其它非心源性胸痛类型" prop="Discharge.NccpType" class="input_required">
          <el-checkbox-group v-model="patient.Discharge.NccpType" size="mini">
            <el-checkbox
              v-for="item in NccpTypeDict"
              :key="'NccpType-'+item.Key"
              :label="item.Key"
            >
              {{ item.Value }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
    </el-row>
    <div v-if="IsCpc()">
      <el-row :gutter="gutter">
        <el-col :span="space_quarter">
          <el-form-item label="院内新发心力衰竭" prop="Discharge.IsHeartFailure" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsHeartFailure" size="mini">
              <el-radio-button
                v-for="item in YesOrNoDict"
                :key="'IsHeartFailure-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-show="IsHeartFailure()" :span="space_quarter">
          <el-form-item v-show="patient.Discharge.IsHeartFailure == '1'" label="心功能分级" prop="Discharge.HeartFailureNyhaLevel" class="input_required">
            <el-radio-group v-model="patient.Discharge.HeartFailureNyhaLevel" size="mini">
              <el-radio-button
                v-for="item in HeartFailureNyhaLevelDict"
                :key="'HeartNyha-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="gutter">
        <el-col :span="space_quarter">
          <el-form-item label="ARNI" prop="Discharge.IsARNI" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsARNI" size="mini">
              <el-radio-button
                v-for="item in YesOrNoDict"
                :key="'IsHeartFailure-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-show="patient.Discharge.IsARNI == '1'" :span="space_quarter">
          <el-form-item label="服用频次" prop="Discharge.ARNIFrequency" class="input_required">
            <el-select v-model="patient.Discharge.ARNIFrequency" placeholder="请选择时间" size="mini" style="width:48%;">
              <el-option
                v-for="(item,index) in RateTimeDict"
                :key="'RateTime-' + index"
                :label="item.Value"
                :value="item.Key"
              />
            </el-select>
            <el-select v-model="patient.Discharge.ARNIFrequencyRange" placeholder="请选择频次" size="mini" style="width:48%;">
              <el-option
                v-for="(item,index) in RateCountDict"
                :key="'RateCount-' + index"
                :label="item.Value"
                :value="item.Key"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-show="patient.Discharge.IsARNI == '1'" :span="space_quarter">
          <el-form-item label="单次剂量" prop="Discharge.ARNIDose" class="input_required">
            <el-input v-model="patient.Discharge.ARNIDose" size="mini">
              <template slot="append">
                mg
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="gutter">
        <el-col :span="space_full">
          <el-form-item label="住院期间并发症" prop="Discharge.Complication" class="input_required">
            <el-checkbox-group v-model="patient.Discharge.Complication" size="mini" @change="ComplicationChange">
              <el-checkbox
                v-for="item in DischargeComplicationDict"
                :key="'DischargeComplication-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>

    </div>
    <el-tag style="width:100%;">住院期间用药</el-tag>
    <el-row>
      <el-col :span="space_quarter">
        <el-form-item label="降糖药物" prop="Discharge.IsJTYW" class="input_required">
          <el-radio-group v-model="patient.Discharge.IsJTYW" size="mini">
            <el-radio-button
              v-for="item in YesOrNoDict"
              :key="'IsJTYW-'+item.Key"
              :label="item.Key"
            >
              {{ item.Value }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>

    </el-row>
    <el-row>

      <el-col v-if="patient.Discharge.IsJTYW == '1'">
        <el-form-item label="药物名称" prop="Discharge.JTYWName" class="input_required">
          <el-checkbox-group v-model="patient.Discharge.JTYWName" size="mini" style="width:100%">
            <el-checkbox
              v-for="item in OHANameDict"
              :key="'JTYWName-'+item.Key"
              :label="item.Key"
            >
              {{ item.Value }}
            </el-checkbox>
          </el-checkbox-group>

        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="space_quarter">
        <el-form-item label="口服抗凝药物" prop="Discharge.IsKNYW" class="input_required">
          <el-radio-group v-model="patient.Discharge.IsKNYW" size="mini">
            <el-radio-button
              v-for="item in YesOrNoDict"
              :key="'IsKNYW-'+item.Key"
              :label="item.Key"
            >
              {{ item.Value }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col v-if="patient.Discharge.IsKNYW == '1'" :span="space_quarter">
        <el-form-item label="药物名称" prop="Discharge.KNYWName" class="input_required">
          <el-select v-model="patient.Discharge.KNYWName" placeholder="请选择" size="mini" style="width:33%">
            <el-option
              v-for="(item,index) in NOACNameDict"
              :key="'JTYWName-'+ index"
              :label="item.Value"
              :value="item.Key"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="space_quarter">
        <el-form-item label="PCSK9" prop="Discharge.IsPCSK9" class="input_required">
          <el-radio-group v-model="patient.Discharge.IsPCSK9" size="mini">
            <el-radio-button
              v-for="item in YesOrNoDict"
              :key="'IsPCSK9-'+item.Key"
              :label="item.Key"
            >
              {{ item.Value }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col v-if="patient.Discharge.IsPCSK9 == '1'" :span="space_quarter">
        <el-form-item label="药物名称" prop="Discharge.PCSK9Name" class="input_required">
          <el-select v-model="patient.Discharge.PCSK9Name" placeholder="请选择" size="mini" style="width:33%">
            <el-option
              v-for="(item,index) in PCSK9NameDict"
              :key="'JTYWName-'+ index"
              :label="item.Value"
              :value="item.Key"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="patient.Discharge.IsPCSK9 == '1'" :span="space_quarter">
        <el-form-item label="单次剂量" prop="Discharge.PCSK9Dose" class="input_required">
          <el-input v-model="patient.Discharge.PCSK9Dose" size="mini">
            <template slot="append">
              mg
            </template>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <div v-if="IsCpc()">
      <el-tag style="width:100%;">危险因素</el-tag>
      <el-row :gutter="gutter">
        <el-col :span="space_quarter">
          <el-form-item label="高血压" prop="Discharge.IsHypertension" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsHypertension" size="mini">
              <el-radio-button
                v-for="item in YesOrNoDict"
                :key="'Hypertension-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="space_quarter">
          <el-form-item label="高脂血症" prop="Discharge.IsHyperlipidemia" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsHyperlipidemia" size="mini">
              <el-radio-button
                v-for="item in YesOrNoDict"
                :key="'Hyperlipidemia-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="space_quarter">
          <el-form-item label="糖尿病" prop="Discharge.IsDiabetes" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsDiabetes" size="mini">
              <el-radio-button
                v-for="item in YesOrNoDict"
                :key="'Diabetes-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="space_quarter">
          <el-form-item label="肥胖" prop="Discharge.IsObesity" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsObesity" size="mini">
              <el-radio-button
                v-for="item in YesOrNoDict"
                :key="'Obesity-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="gutter">
        <el-col :span="space_quarter">
          <el-form-item label="早发CVD家族史(男<55岁，女<60岁)" prop="Discharge.IsCvdHr" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsCvdHr" size="mini">
              <el-radio-button
                v-for="item in YesOrNoDict"
                :key="'CvdHr-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="space_quarter">
          <el-form-item label="吸烟" prop="Discharge.IsSmoking" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsSmoking" size="mini">
              <el-radio-button
                v-for="item in YesOrNoDict"
                :key="'Smoking-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-show="patient.Discharge.IsSmoking == '1'" :span="space_quarter">
          <el-form-item label="吸烟" prop="Discharge.SmokingSituation" class="input_required">
            <el-radio-group v-model="patient.Discharge.SmokingSituation" size="mini">
              <el-radio-button
                v-for="item in SmokingSituationDict"
                :key="'SmokingSituation-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-tag style="width:100%;">合并疾病</el-tag>
      <el-row :gutter="gutter">
        <el-col :span="space_quarter">
          <el-form-item label="冠心病" prop="Discharge.IsChd" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsChd" size="mini">
              <el-radio-button
                v-for="item in YesOrNoDict"
                :key="'Chd-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-show="patient.Discharge.IsChd == '1'" :span="space_quarter">
          <el-form-item label="血运重建史" prop="Discharge.IsChdHor" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsChdHor" size="mini">
              <el-radio-button
                v-for="item in YesOrNoDict"
                :key="'ChdHor-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="gutter">
        <el-col :span="space_quarter">
          <el-form-item label="心房颤动" prop="Discharge.IsAf" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsAf" size="mini">
              <el-radio-button
                v-for="item in YesOrNoDict"
                :key="'Af-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-show="patient.Discharge.IsAf == '1'" :span="space_quarter">
          <el-form-item label="分型" prop="Discharge.AfType" class="input_required">
            <el-radio-group v-model="patient.Discharge.AfType" size="mini">
              <el-radio-button
                v-for="item in AfTypeDict"
                :key="'AfType-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="gutter">
        <el-col :span="space_quarter">
          <el-form-item label="慢性心力衰竭" prop="Discharge.IsChf" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsChf" size="mini" :disabled="patient.Discharge.IsHeartFailure==1">
              <el-radio-button
                v-for="item in YesOrNoDict"
                :key="'Chf-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-show="patient.Discharge.IsChf == '1'" :span="space_quarter">
          <el-form-item label="NYHA分级" prop="Discharge.ChfNyha" class="input_required">
            <el-radio-group v-model="patient.Discharge.ChfNyha" size="mini">
              <el-radio-button
                v-for="item in ChfNyhaDict"
                :key="'ChfNyha-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="gutter">
        <el-col :span="space_quarter">
          <el-form-item label="脑血管疾病" prop="Discharge.IsCvd" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsCvd" size="mini">
              <el-radio-button
                v-for="item in YesOrNoDict"
                :key="'Cvd-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-show="patient.Discharge.IsCvd == '1'" :span="space_quarter">
          <el-form-item label="脑血管疾病类型" prop="Discharge.CvdType" class="input_required">
            <el-radio-group v-model="patient.Discharge.CvdType" size="mini">
              <el-radio-button
                v-for="item in CvdTypeDict"
                :key="'CvdType-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="gutter">
        <el-col :span="space_quarter">
          <el-form-item label="心脏瓣膜病" prop="Discharge.IsVhd" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsVhd" size="mini">
              <el-radio-button
                v-for="item in YesOrNoDict"
                :key="'Vhd-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="space_quarter">
          <el-form-item label="外周动脉疾病" prop="Discharge.IsPad" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsPad" size="mini">
              <el-radio-button
                v-for="item in YesOrNoDict"
                :key="'Pad-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="space_quarter">
          <el-form-item label="主动脉瘤" prop="Discharge.IsAneurysm" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsAneurysm" size="mini">
              <el-radio-button
                v-for="item in YesOrNoDict"
                :key="'Aneurysm-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="space_quarter">
          <el-form-item label="COPD" prop="Discharge.IsCopd" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsCopd" size="mini">
              <el-radio-button
                v-for="item in YesOrNoDict"
                :key="'Copd-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="gutter">
        <el-col :span="space_quarter">
          <el-form-item label="慢性肾病" prop="Discharge.IsCkd" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsCkd" size="mini">
              <el-radio-button
                v-for="item in YesOrNoDict"
                :key="'Ckd-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="space_quarter">
          <el-form-item label="贫血" prop="Discharge.IsAnemia" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsAnemia" size="mini">
              <el-radio-button
                v-for="item in YesOrNoDict"
                :key="'Anemia-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="space_quarter">
          <el-form-item label="消化性溃疡" prop="Discharge.IsPepticUlcer" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsPepticUlcer" size="mini">
              <el-radio-button
                v-for="item in YesOrNoDict"
                :key="'PepticUlcer-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="space_quarter">
          <el-form-item label="甲状腺功能异常" prop="Discharge.IsThyroidDysfunction" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsThyroidDysfunction" size="mini">
              <el-radio-button
                v-for="item in YesOrNoDict"
                :key="'ThyroidDysfunction-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="gutter">
        <el-col :span="space_quarter">
          <el-form-item label="恶性肿瘤" prop="Discharge.IsMalignantTumor" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsMalignantTumor" size="mini">
              <el-radio-button
                v-for="item in YesOrNoDict"
                :key="'IsMalignantTumor-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-tag style="width:100%;">检查结果</el-tag>
      <el-row :gutter="gutter">
        <el-col :span="space_quarter">
          <el-form-item label="72h内肌钙蛋白" prop="Discharge.IsTroponin" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsTroponin" size="mini">
              <el-radio-button
                v-for="item in YesOrNoDict"
                :key="'Troponin-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="patient.Discharge.IsTroponin == '1'" :span="space_quarter">
          <el-form-item label="类别" prop="DischargeTest.Troponin.Result" class="input_required">
            <el-radio-group v-model="patient.DischargeTest.Troponin.Category" size="mini" style="width:48%">
              <el-radio-button
                v-for="item in TroponinDict"
                :key="'TroponinCategory-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="patient.Discharge.IsTroponin == '1'" :span="space_quarter">
          <el-form-item label="72h内肌钙蛋白最高值" prop="DischargeTest.Troponin.Result" class="input_required">
            <el-input v-model="patient.DischargeTest.Troponin.Result" v-labtest style="width:50%" size="mini" maxlength="20" />
            <el-select v-model="patient.DischargeTest.Troponin.Unit" placeholder="请选择" size="mini" style="width:33%">
              <el-option
                v-for="(item,index) in CtnUnitDict"
                :key="'troponin-'+ index"
                :label="item.Value"
                :value="item.Value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="gutter">
        <el-col :span="space_quarter">
          <el-form-item label="脑钠肽" prop="Discharge.IsBnp" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsBnp" size="mini">
              <el-radio-button
                v-for="item in YesOrNoDict"
                :key="'Bnp-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="patient.Discharge.IsBnp == '1'" :span="space_quarter">
          <el-form-item label="类别" prop="DischargeTest.Bnp.Result">
            <el-radio-group v-model="patient.DischargeTest.Bnp.Category" size="mini">
              <el-radio-button
                v-for="item in BnpTypeDict"
                :key="'BnpCategory-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="patient.Discharge.IsBnp == '1'" :span="space_quarter">
          <el-form-item label="最高值" prop="DischargeTest.Bnp.Result">
            <el-input v-model="patient.DischargeTest.Bnp.Result" size="mini">
              <template slot="append">
                pg/mL
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="gutter">
        <el-col :span="space_quarter">
          <el-form-item label="总胆固醇(TC)" prop="Discharge.IsTc" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsTc" size="mini">
              <el-radio-button
                v-for="item in YesOrNoDict"
                :key="'Tc-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="patient.Discharge.IsTc == '1'" :span="space_quarter">
          <el-form-item label="数值" prop="DischargeTest.Tc.Result" class="input_required">
            <el-input v-model="patient.DischargeTest.Tc.Result" size="mini">
              <template slot="append">
                mmol/L
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="gutter">
        <el-col :span="space_quarter">
          <el-form-item label="甘油三酯(TG)" prop="Discharge.IsTg" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsTg" size="mini">
              <el-radio-button
                v-for="item in YesOrNoDict"
                :key="'Tg-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="patient.Discharge.IsTg == '1'" :span="space_quarter">
          <el-form-item label="数值" prop="DischargeTest.Tg.Result" class="input_required">
            <el-input v-model="patient.DischargeTest.Tg.Result" size="mini">
              <template slot="append">
                mmol/L
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="gutter">
        <el-col :span="space_quarter">
          <el-form-item label="高密度脂蛋白(HDL-C)" prop="Discharge.IsHdlC" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsHdlC" size="mini">
              <el-radio-button
                v-for="item in YesOrNoDict"
                :key="'HdlC-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="patient.Discharge.IsHdlC == '1'" :span="space_quarter">
          <el-form-item label="数值" prop="DischargeTest.HdlC.Result" class="input_required">
            <el-input v-model="patient.DischargeTest.HdlC.Result" size="mini">
              <template slot="append">
                mmol/L
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="gutter">
        <el-col :span="space_quarter">
          <el-form-item label="低密度脂蛋白(LDL-C)" prop="Discharge.IsLdlC" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsLdlC" size="mini">
              <el-radio-button
                v-for="item in YesOrNoDict"
                :key="'LdlC-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="patient.Discharge.IsLdlC == '1'" :span="space_quarter">
          <el-form-item label="数值" prop="DischargeTest.LdlC.Result" class="input_required">
            <el-input v-model="patient.DischargeTest.LdlC.Result" size="mini">
              <template slot="append">
                mmol/L
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="gutter">
        <el-col :span="space_quarter">
          <el-form-item label="超声心动图" prop="Discharge.IsUcc" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsUcc" size="mini">
              <el-radio-button
                v-for="item in YesOrNoDict"
                :key="'Ucc-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="patient.Discharge.IsUcc == '1'" :span="space_quarter">
          <el-form-item label="LVEF(诊疗过程中最低值)" prop="Discharge.Lvef">
            <el-input v-model="patient.Discharge.Lvef" v-int="{ max:100 }" size="mini" maxlength="8">
              <template slot="append">
                %
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="patient.Discharge.IsUcc == '1'" :span="space_quarter">
          <el-form-item label="室壁瘤" prop="Discharge.IsVentricularAneurysm">
            <el-radio-group v-model="patient.Discharge.IsVentricularAneurysm" size="mini">
              <el-radio-button
                v-for="item in YesOrNoDict"
                :key="'VentricularAneurysm-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="patient.Discharge.IsUcc == '1'" :span="space_quarter">
          <el-form-item label="局部室壁活动异常" prop="Discharge.IsRwma">
            <el-radio-group v-model="patient.Discharge.IsRwma" size="mini">
              <el-radio-button
                v-for="item in YesOrNoDict"
                :key="'Rwma-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </div>

    <!--出院信息-->
    <el-tag style="width:100%;">出院信息</el-tag>
    <el-row :gutter="gutter">
      <el-col :span="space_quarter">
        <el-form-item label="住院天数" prop="Discharge.Hod" class="input_required">
          <el-input v-model="patient.Discharge.Hod" v-int="{ max:3650 }" size="mini" maxlength="6">
            <template slot="append">
              天
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="space_quarter">
        <el-form-item label="总费用" prop="Discharge.TotalCost" class="input_required">
          <el-input v-model="patient.Discharge.TotalCost" v-float="{ max:10000000 }" size="mini" maxlength="12">
            <template slot="append">
              元
            </template>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="space_full">
        <el-form-item label="患者转归" prop="Discharge.OutcomeCode" size="mini" class="input_required">
          <el-radio-group v-model="patient.Discharge.OutcomeCode">
            <el-radio-button
              v-for="item in PatientOutcomeDict"
              :key="'OutcomeCode-'+item.Key"
              :label="item.Key"
            >
              {{ item.Value }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 出院 -->
    <div v-if="IsLeave()">
      <el-row :gutter="gutter">
        <el-col :span="space_quarter">
          <el-form-item label="出院时间" prop="Discharge.LeaveTime" class="input_required">
            <el-date-picker
              v-model="patient.Discharge.LeaveTime"
              v-dtpformat
              type="datetime"
              :format="timeFormat"
              :value-format="timeFormat"
              placeholder="请选择出院时间"
              size="mini"
            />
          </el-form-item>
        </el-col>
        <el-col :span="space_half">
          <el-form-item label="治疗结果" prop="Discharge.TreatmentResult" class="input_required">
            <el-radio-group v-model="patient.Discharge.TreatmentResult" size="mini">
              <el-radio-button
                v-for="item in TreatmentResultDict"
                :key="'TreatmentResult-'+item.Key"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-tag v-if="IsCpc() && IsLeave()" style="width:100%;">出院药物方案</el-tag>
      <el-row v-if="IsCpc() && IsLeave()" :gutter="20">
        <el-col :span="6">
          <el-form-item label="抗血小板药物" prop="Discharge.IsAntiplatelet" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsAntiplatelet" size="mini">
              <el-radio-button
                v-for="(item,index) in YesOrNoDict"
                :key="'Dapt-' + index"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-if="IsCpc() && IsLeave() && patient.Discharge.IsAntiplatelet == '1'">
        <el-row v-for="(dapt,index) in patient.DischargeDrugs.Dapt" :key="'DaptItem-' + index" :gutter="20">
          <el-col :span="6">
            <el-form-item label="药物名称" prop="Name" class="input_required">
              <el-select v-model="dapt.Code" placeholder="请选择" size="mini">
                <el-option
                  v-for="(item, idx) in DaptDict"
                  :key="'DaptDrug-' + idx"
                  :label="item.Value"
                  :value="item.Key"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="dapt.Code==99" :span="6">
            <el-form-item label="其他药物名称" prop="OtherDrugName" class="input_required">
              <el-input v-model="dapt.OtherDrugName" size="mini" maxlength="25" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="服用频次" prop="Dose" class="input_required">
              <el-select v-model="dapt.RateTime" placeholder="请选择时间" size="mini" style="width:48%;">
                <el-option
                  v-for="(item, idx) in RateTimeDict"
                  :key="'RateTime-' + idx"
                  :label="item.Value"
                  :value="item.Key"
                />
              </el-select>
              <el-select v-model="dapt.RateCount" placeholder="请选择频次" size="mini" style="width:48%;">
                <el-option
                  v-for="(item, idx) in RateCountDict"
                  :key="'RateCount-' + idx"
                  :label="item.Value"
                  :value="item.Key"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="剂量" prop="Dose" class="input_required">
              <el-input v-model="dapt.Dose" v-float size="mini" maxlength="12" style="width:calc(100% - 48px);">
                <template slot="append">
                  mg
                </template>
              </el-input>
              <el-button v-if="index==0" type="primary" icon="el-icon-plus" size="mini" @click="addDrug('Dapt')" />
              <el-button v-if="index>0" type="primary" icon="el-icon-delete" size="mini" @click="removeDrug(index, 'Dapt')" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-row v-if="IsCpc() && IsLeave()" :gutter="20">
        <el-col :span="6">
          <el-form-item label="ACEI/ARB" prop="Discharge.IsAceiOrArb" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsAceiOrArb" size="mini">
              <el-radio-button
                v-for="(item,index) in YesOrNoDict"
                :key="'Aceiorarb-' + index"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-if="IsCpc() && IsLeave() && patient.Discharge.IsAceiOrArb === '1'">
        <el-row
          v-for="(aceiorarb,index) in patient.DischargeDrugs.Aceiorarb"
          :key="'AceiorarbItem-' + index"
          :gutter="20"
        >
          <el-col :span="6">
            <el-form-item label="药物名称" prop="Name" class="input_required">
              <el-select v-model="aceiorarb.Code" placeholder="请选择" size="mini">
                <el-option
                  v-for="(item, idx) in AceiorarbDict"
                  :key="'AceiorarbDrug-' + idx"
                  :label="item.Value"
                  :value="item.Key"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="aceiorarb.Code==99" :span="6">
            <el-form-item label="其他药物名称" prop="OtherDrugName" class="input_required">
              <el-input v-model="aceiorarb.OtherDrugName" size="mini" maxlength="25" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="服用频次" prop="Dose" class="input_required">
              <el-select v-model="aceiorarb.RateTime" placeholder="请选择时间" size="mini" style="width:48%;">
                <el-option
                  v-for="(item, idx) in RateTimeDict"
                  :key="'aceiorarb-RateTime-' + idx"
                  :label="item.Value"
                  :value="item.Key"
                />
              </el-select>
              <el-select v-model="aceiorarb.RateCount" placeholder="请选择频次" size="mini" style="width:48%;">
                <el-option
                  v-for="(item, idx) in RateCountDict"
                  :key="'aceiorarb-RateCount-' + idx"
                  :label="item.Value"
                  :value="item.Key"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="剂量" prop="Dose" class="input_required">
              <el-input v-model="aceiorarb.Dose" v-float size="mini" maxlength="12" style="width:calc(100% - 48px);">
                <template slot="append">
                  mg
                </template>
              </el-input>
              <el-button v-if="index==0" type="primary" icon="el-icon-plus" size="mini" @click="addDrug('Aceiorarb')" />
              <el-button v-if="index>0" type="primary" icon="el-icon-delete" size="mini" @click="removeDrug(index, 'Aceiorarb')" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-row v-if="IsCpc() && IsLeave()" :gutter="20">
        <el-col :span="6">
          <el-form-item label="调脂药物" prop="Discharge.IsLipidRegulation" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsLipidRegulation" size="mini">
              <el-radio-button
                v-for="(item,index) in YesOrNoDict"
                :key="'Statins-' + index"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-if="IsCpc() && IsLeave() && patient.Discharge.IsLipidRegulation === '1'">
        <el-row v-for="(statins,index) in patient.DischargeDrugs.Statins" :key="'StatinsItem-' + index" :gutter="20">
          <el-col :span="6">
            <el-form-item label="药物名称" prop="Name" class="input_required">
              <el-select v-model="statins.Code" placeholder="请选择" size="mini">
                <el-option
                  v-for="(item, idx) in StatinsDict"
                  :key="'StatinsDrug-' + idx"
                  :label="item.Value"
                  :value="item.Key"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="statins.Code==99" :span="6">
            <el-form-item label="其他药物名称" prop="OtherDrugName" class="input_required">
              <el-input v-model="statins.OtherDrugName" size="mini" maxlength="25" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="服用频次" prop="Dose" class="input_required">
              <el-select v-model="statins.RateTime" placeholder="请选择时间" size="mini" style="width:48%;">
                <el-option
                  v-for="(item, idx) in RateTimeDict"
                  :key="'statins-RateTime-' + idx"
                  :label="item.Value"
                  :value="item.Key"
                />
              </el-select>
              <el-select v-model="statins.RateCount" placeholder="请选择频次" size="mini" style="width:48%;">
                <el-option
                  v-for="(item, idx) in RateCountDict"
                  :key="'statins-RateCount-' + idx"
                  :label="item.Value"
                  :value="item.Key"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="剂量" prop="Dose" class="input_required">
              <el-input v-model="statins.Dose" v-float size="mini" maxlength="12" style="width:calc(100% - 48px);">
                <template slot="append">
                  mg
                </template>
              </el-input>
              <el-button v-if="index==0" type="primary" icon="el-icon-plus" size="mini" @click="addDrug('Statins')" />
              <el-button v-if="index>0" type="primary" icon="el-icon-delete" size="mini" @click="removeDrug(index, 'Statins')" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-row v-if="IsCpc() && IsLeave()" :gutter="20">
        <el-col :span="6">
          <el-form-item label="β受体阻滞剂" prop="Discharge.IsBetaBlocker" class="input_required">
            <el-radio-group v-model="patient.Discharge.IsBetaBlocker" size="mini">
              <el-radio-button
                v-for="(item,index) in YesOrNoDict"
                :key="'Retardant-' + index"
                :label="item.Key"
              >
                {{ item.Value }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-if="IsCpc() && IsLeave() && patient.Discharge.IsBetaBlocker === '1'">
        <el-row v-for="(retardant,index) in patient.DischargeDrugs.Retardant" :key="'RetardantItem-' + index" :gutter="20">
          <el-col :span="6">
            <el-form-item label="药物名称" prop="Name" class="input_required">
              <el-select v-model="retardant.Code" placeholder="请选择" size="mini">
                <el-option
                  v-for="(item, idx) in RetardantDict"
                  :key="'RetardantDrug-' + idx"
                  :label="item.Value"
                  :value="item.Key"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="retardant.Code==99" :span="6">
            <el-form-item label="其他药物名称" prop="OtherDrugName" class="input_required">
              <el-input v-model="retardant.OtherDrugName" size="mini" maxlength="25" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="服用频次" prop="Dose" class="input_required">
              <el-select v-model="retardant.RateTime" placeholder="请选择时间" size="mini" style="width:48%;">
                <el-option
                  v-for="(item, idx) in RateTimeDict"
                  :key="'retardant-RateTime-' + idx"
                  :label="item.Value"
                  :value="item.Key"
                />
              </el-select>
              <el-select v-model="retardant.RateCount" placeholder="请选择频次" size="mini" style="width:48%;">
                <el-option
                  v-for="(item, idx) in RateCountDict"
                  :key="'retardant-RateCount-' + idx"
                  :label="item.Value"
                  :value="item.Key"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="剂量" prop="Dose" class="input_required">
              <el-input v-model="retardant.Dose" v-float size="mini" maxlength="12" style="width:calc(100% - 48px);">
                <template slot="append">
                  mg
                </template>
              </el-input>
              <el-button v-if="index==0" type="primary" icon="el-icon-plus" size="mini" @click="addDrug('Retardant')" />
              <el-button v-if="index>0" type="primary" icon="el-icon-delete" size="mini" @click="removeDrug(index, 'Retardant')" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 转院 -->
    <el-row v-if="IsTransferHospital()" :gutter="gutter">
      <el-col :span="space_quarter">
        <el-form-item label="离开本院大门时间" prop="Discharge.LeaveTime" class="input_required">
          <el-date-picker
            v-model="patient.Discharge.LeaveTime"
            v-dtpformat
            type="datetime"
            :format="timeFormat"
            :value-format="timeFormat"
            placeholder="请选择离开本院大门时间"
            size="mini"
          />
        </el-form-item>
      </el-col>
      <el-col :span="space_quarter">
        <el-form-item label="医院名称" prop="Discharge.HospitalName">
          @*<el-input v-model="patient.Discharge.HospitalName" size="mini" maxlength="50" />*@
          <el-autocomplete
            v-model="patient.Discharge.HospitalName"
            :fetch-suggestions="queryHospitalNames"
            placeholder="请输入医院名称"
            size="mini"
            :maxlength="30"
          />
        </el-form-item>
      </el-col>
      <el-col :span="space_quarter">
        <el-form-item label="是否是网络医院">
          <el-radio-group v-model="patient.Discharge.IsNetHospital" size="mini">
            <el-radio-button
              v-for="item in YesOrNoDict"
              :key="'IsNetHospital-'+item.Key"
              :label="item.Key"
            >
              {{ item.Value }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
    @*<el-row v-if="IsTransferHospital()" :gutter="gutter">
      <el-col :span="space_quarter">
        <el-form-item label="转运PCI">
          <el-radio-group v-model="patient.Discharge.IsTransPci" size="mini">
            <el-radio-button
              v-for="item in YesOrNoDict"
              :key="'IsTransPci-'+item.Key"
              :label="item.Key"
            >
              {{ item.Value }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col v-if="IsTransPci()" :span="space_quarter">
        <el-form-item label="直达导管室">
          <el-radio-group v-model="patient.Discharge.IsDirectToCr" size="mini">
            <el-radio-button
              v-for="item in YesOrNoDict"
              :key="'IsDirectToCr-'+item.Key"
              :label="item.Key"
            >
              {{ item.Value }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col v-if="IsTransPci()" :span="space_quarter">
        <el-form-item label="实际介入手术开始时间" prop="Discharge.PciActualTime">
          <el-date-picker
            v-model="patient.Discharge.PciActualTime"
            type="datetime"
            :format="timeFormat"
            :value-format="timeFormat"
            placeholder="请选择实际介入手术开始时间"
            size="mini"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="IsTransPci()" :gutter="20">
      <el-col :span="6">
        <el-form-item label="传输心电图至协作单位" prop="Diagnosis.EcgTransmission" class="input_required">
          <el-radio-group v-model="patient.Discharge.EcgTransmission" size="mini">
            <el-radio-button
              v-for="(item,index) in YesOrNoDict"
              :key="index"
              :label="item.Key"
            >
              {{ item.Value }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col v-if="patient.Discharge.EcgTransmission == '1'" :span="6">
        <el-form-item label="接收时间" prop="Discharge.EcgTransmissionTime">
          <el-date-picker
            v-model="patient.Discharge.EcgTransmissionTime"
            type="datetime"
            :format="timeFormat"
            :value-format="timeFormat"
            placeholder="选择日期"
            size="mini"
          />
        </el-form-item>
      </el-col>
      <el-col v-if="patient.Discharge.EcgTransmission == '1'" :span="6">
        <el-form-item label="传输方式" prop="Discharge.EcgTransmissionType">
          <el-select v-model="patient.Discharge.EcgTransmissionType" placeholder="请选择" size="mini">
            <el-option
              v-for="(item,index) in RemoteEcgtranWayDict"
              :key="index"
              :label="item.Value"
              :value="item.Key"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>*@
    <!-- 转科 -->
    <el-row v-if="IsTransferDept()" :gutter="gutter">
      <el-col :span="space_quarter">
        <el-form-item label="转科时间" prop="Discharge.DeptTransferTime">
          <el-date-picker
            v-model="patient.Discharge.DeptTransferTime"
            v-dtpformat
            type="datetime"
            :format="timeFormat"
            :value-format="timeFormat"
            placeholder="请选择转科时间"
            size="mini"
          />
        </el-form-item>
      </el-col>
      <el-col id="jzks" :span="space_quarter">
        <el-form-item label="接诊科室" prop="Discharge.AdmissionDept">
          <el-autocomplete
            v-model="patient.Discharge.AdmissionDept"
            :fetch-suggestions="queryAdmissionDepts"
            placeholder="请输入接诊科室"
            size="mini"
            :maxlength="36"
          />
        </el-form-item>
      </el-col>
      <el-col :span="space_half">
        <el-form-item label="转科原因描述" prop="Discharge.DeptTransferReason">
          <el-input v-model="patient.Discharge.DeptTransferReason" size="mini" maxlength="500" />
        </el-form-item>
      </el-col>
    </el-row>
    <!-- 离院宣教 -->
    <el-row v-if="IsEducation()" :gutter="gutter">
      <el-col :span="space_full">
        <el-form-item label="离院宣教" prop="Discharge.Education">
          <el-checkbox-group v-model="patient.Discharge.Education" size="mini" @change="EducationChange">
            <el-checkbox
              v-for="item in DischargeEducationDict"
              :key="'Education-'+item.Key"
              :label="item.Key"
            >
              {{ item.Value }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- 死亡 -->
    <el-row v-if="IsDeath()" :gutter="gutter">
      <el-col :span="space_quarter">
        <el-form-item label="死亡时间" prop="Discharge.DeathTime" class="input_required">
          <el-date-picker
            v-model="patient.Discharge.DeathTime"
            v-dtpformat
            type="datetime"
            :format="timeFormat"
            :value-format="timeFormat"
            placeholder="请选择死亡时间"
            size="mini"
          />
        </el-form-item>
      </el-col>
      <el-col :span="space_quarter">
        <el-form-item label="死亡原因" class="input_required">
          <el-radio-group v-model="patient.Discharge.DeathCause" size="mini">
            <el-radio-button
              v-for="item in DeathCauseDict"
              :key="'DeathCause-'+item.Key"
              :label="item.Key"
            >
              {{ item.Value }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="space_half">
        <el-form-item label="死亡原因描述" prop="Discharge.DeathCauseDesc">
          <el-input v-model="patient.Discharge.DeathCauseDesc" size="mini" maxlength="500" />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 患者情况备注 -->
    <el-row :gutter="gutter">
      <el-col :span="space_full">
        <el-form-item label="患者情况备注" prop="Discharge.PatientRemarks">
          <el-input v-model="patient.Discharge.PatientRemarks" size="mini" maxlength="500" />
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import timeFormat from '@constant/index'
export default {
  props: {
    data: {
      type: String,
      default: () => { }
    }
  },
  data: function() {
    return {
      defaultTimeFormat: timeFormat.default,
      space_quarter: 6,
      space_half: 12,
      space_three_quater: 18,
      space_full: 24,
      gutter: 20,
      span: 6,
      YesOrNoDict: [],
      HaveOrNotDict: [],
      DischargeDiagnosisDict: [],
      BnpTypeDict: [],
      DischargeComplicationDict: [],
      CardiovRiskFactorsDict: [],
      PatientOutcomeDict: [],
      TreatmentResultDict: [],
      DaptDict: [],
      AceiorarbDict: [],
      StatinsDict: [],
      RetardantDict: [],
      DeathCauseDict: [],
      NacsTypeDict: [],
      NccpTypeDict: [],
      TroponinDict: [],
      AfTypeDict: [],
      ChfNyhaDict: [],
      CvdTypeDict: [],
      SmokingSituationDict: [],
      DeptNamesDict: [],
      HospitalNamesDict: [],
      RemoteEcgtranWayDict: [],
      DischargeEducationDict: [],
      RateCountDict: [],
      RateTimeDict: [],
      COVID19Dict: [],
      OHANameDict: [],
      NOACNameDict: [],
      PCSK9NameDict: [],
      CtnUnitDict: [],
      HeartFailureNyhaLevelDict: [],
      rules: {
        // 'Discharge.Hod': [
        //    { pattern: /^[1-9]\d*$/, message: '请输入正确的住院天数' }
        // ],
        // 'Discharge.TotalCost': [
        //    { pattern: /^([1-9]\d*|0)(\.\d{1,2})?$/, message: '请输入正确的费用' }
        // ],
        // 'Discharge.CtniMaxValue': [
        //    { pattern: /^([1-9]\d*|0)(\.\d{1,2})?$/, message: '请输入正确的72h内肌钙蛋白最高值' }
        // ],
        // 'Discharge.BnpValue': [
        //    { pattern: /^([1-9]\d*|0)(\.\d{1,2})?$/, message: '请输入正确的心肌标志物最高值' }
        // ],
        // 'Discharge.Lvef': [
        //    { pattern: /^([1-9]\d*|0)(\.\d{1,2})?$/, message: '请输入正确的超声心动图(最低值) LVEF' }
        // ],
      }
    }
  },
  computed: {
    AdmissionDepts: function() {
      var admissionDepts = []
      if (this.DeptNamesDict == null) return admissionDepts
      this.DeptNamesDict.forEach(function(n) {
        admissionDepts.push({ 'value': n.Name })
      })
      return admissionDepts
    },
    HospitalNames: function() {
      var hospitalNames = []
      if (this.HospitalNamesDict == null) return hospitalNames
      this.HospitalNamesDict.forEach(function(n) {
        hospitalNames.push({ 'value': n.Name })
      })
      return hospitalNames
    }
  },
  methods: {
    // --------------------转归模块-------------------
    IsNacs: function() {
      if (this.patient.Discharge == null ||
                    !this.patient.Discharge.Diagnosis) return false
      return this.patient.Discharge.Diagnosis === '6'
    },
    IsNccp: function() {
      if (this.patient.Discharge == null ||
                    !this.patient.Discharge.Diagnosis) return false
      return this.patient.Discharge.Diagnosis === '7'
    },
    IsCpc: function() {
      if (this.patient.Discharge == null ||
                    !this.patient.Discharge.Diagnosis) return false
      return this.patient.Discharge.Diagnosis === '1' ||
                    this.patient.Discharge.Diagnosis === '2' ||
                    this.patient.Discharge.Diagnosis === '3'
    },
    IsAcs: function() {
      if (this.patient.Discharge == null ||
                    !this.patient.Discharge.Diagnosis) return false
      return this.patient.Discharge.Diagnosis === '1' ||
                    this.patient.Discharge.Diagnosis === '2' ||
                    this.patient.Discharge.Diagnosis === '3' ||
                    this.patient.Discharge.Diagnosis === '4' ||
                    this.patient.Discharge.Diagnosis === '5'
    },
    IsLeave: function() {
      if (this.patient.Discharge == null ||
                    !this.patient.Discharge.OutcomeCode) return false
      return this.patient.Discharge.OutcomeCode === '1'
    },
    IsTransferHospital: function() {
      if (this.patient.Discharge == null ||
                    !this.patient.Discharge.OutcomeCode) return false
      return this.patient.Discharge.OutcomeCode === '2'
    },
    IsTransPci: function() {
      if (!this.IsTransferHospital()) return false
      return this.patient.Discharge.IsTransPci === '1'
    },
    IsTransferDept: function() {
      if (this.patient.Discharge == null ||
                    !this.patient.Discharge.OutcomeCode) return false
      return this.patient.Discharge.OutcomeCode === '3'
    },
    IsDeath: function() {
      if (this.patient.Discharge == null ||
                    !this.patient.Discharge.OutcomeCode) return false
      return this.patient.Discharge.OutcomeCode === '4'
    },
    IsEducation: function() {
      if (this.patient.Discharge == null || !this.patient.Discharge.OutcomeCode) return false
      return (this.patient.Discharge.OutcomeCode === '1' || this.patient.Discharge.OutcomeCode === '2' || this.patient.Discharge.OutcomeCode === '3')
    },
    IsHeartFailure: function() {
      if (this.patient.Discharge == null ||
                    this.patient.Discharge.IsHeartFailure === 0) {
        return false
      } else {
        this.patient.Discharge.IsChf = null
        this.patient.Discharge.ChfNyha = null
        return true
      }
    },
    addDrug: function(type) {
      var drugs = null
      switch (type) {
        case 'Dapt':
          drugs = this.patient.DischargeDrugs.Dapt
          break
        case 'Aceiorarb':
          drugs = this.patient.DischargeDrugs.Aceiorarb
          break
        case 'Statins':
          drugs = this.patient.DischargeDrugs.Statins
          break
        case 'Retardant':
          drugs = this.patient.DischargeDrugs.Retardant
          break
      }
      drugs.push({})
    },
    removeDrug: function(index, type) {
      var drugs = null
      switch (type) {
        case 'Dapt':
          drugs = this.patient.DischargeDrugs.Dapt
          break
        case 'Aceiorarb':
          drugs = this.patient.DischargeDrugs.Aceiorarb
          break
        case 'Statins':
          drugs = this.patient.DischargeDrugs.Statins
          break
        case 'Retardant':
          drugs = this.patient.DischargeDrugs.Retardant
          break
      }

      var _this = this
      this.$confirm('确定删除（保存后生效）?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(function() {
        drugs.splice(index, 1)
        _this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(function() {
        _this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    queryAdmissionDepts: function(queryString, cb) {
      var admissionDepts = this.AdmissionDepts
      var results = queryString ? admissionDepts.filter(function(admissionDept) {
        return (admissionDept.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }) : admissionDepts
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    queryHospitalNames: function(queryString, cb) {
      var hospitalNames = this.HospitalNames
      var results = queryString ? hospitalNames.filter(function(hospitalName) {
        return (hospitalName.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }) : hospitalNames
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    ComplicationChange: function(val) {
      var _this = this
      var noneCode = '00'
      var index = _this.NoneIndex(val, noneCode)
      if (index >= 0 && _this.patient.Discharge.Complication[_this.patient.Discharge.Complication.length - 1] === noneCode) {
        _this.patient.Discharge.Complication = [noneCode]
      } else if (index >= 0) {
        _this.patient.Discharge.Complication.splice(index, 1)
      }
    },
    EducationChange: function(val) {
      var _this = this
      var noneCode = '0'
      var index = _this.NoneIndex(val, noneCode)
      if (index >= 0 && _this.patient.Discharge.Education[_this.patient.Discharge.Education.length - 1] === noneCode) {
        _this.patient.Discharge.Education = [noneCode]
      } else if (index >= 0) {
        _this.patient.Discharge.Education.splice(index, 1)
      }
    },
    NoneIndex: function(val, noneCode) {
      for (var i = 0; i < val.length; i++) {
        if (val[i] === noneCode) return i
      }
      return -1
    }
  }
}
</script>
