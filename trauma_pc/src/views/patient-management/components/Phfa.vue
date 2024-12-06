<template>
    <div class="phfa">
        <el-form ref="form" label-position="top" :model="form" label-width="50px" size="mini">
            <med-subtitle>院前接诊</med-subtitle>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-col :span="24">
                        <el-form-item label="车牌号">
                            <AssociationPatient v-model="form.licensePlate" placeholder="车牌号" type="1" />
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="6">
                    <el-col :span="18">
                        <el-form-item label="发病时间" prop="attackTime" :rules="[{ required: true, message: '请选择发病时间', trigger: 'blur' }]">
                            <med-datetime v-model="form.attackTime" :disabled="isReadonly" format="yyyy-MM-dd HH:mm" />
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="12">
                    <el-col :span="20">
                        <el-form-item label="发病地址">
                            <el-input v-model="form.address" placeholder="请输入发病地址" type="textarea" autosize :readonly="isReadonly" :maxlength="100" />
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-col :span="18">
                        <el-form-item label="呼救时间" prop="helpTime" :rules="[{ required: true, message: '请选择呼救时间', trigger: 'blur' }]">
                            <med-datetime v-model="form.helpTime" :disabled="isReadonly" />
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="6">
                    <el-col :span="18">
                        <el-form-item label="救护车出发时间" prop="ambulanceLeaveTime" :rules="[{ required: true, message: '请选择救护车出发时间', trigger: 'blur' }]">
                            <med-datetime v-model="form.ambulanceLeaveTime" :disabled="isReadonly" />
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="6">
                    <el-col :span="18">
                        <el-form-item label="到达现场时间" prop="arriveLocationTime" :rules="[{ required: true, message: '请选择到达现场时间', trigger: 'blur' }]">
                            <med-datetime v-model="form.arriveLocationTime" :disabled="isReadonly" />
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="出车单位" v-if="visitType === '01'">
                        <el-select v-model="form.ambulanceStation" placeholder="出车单位" :disabled="isReadonly">
                            <el-option v-for="(item, index) in STATION_0001" :key="index" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-col :span="14" v-if="visitType === '02'">
                        <el-form-item label="转入医院名称">
                            <el-input v-model="form.zcyyHospitalName" :readonly="isReadonly" :maxlength="36" />
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6" v-if="visitType === '01'">
                    <el-col :span="14">
                        <el-form-item label="跟车医生" prop="admissionDoctor" :rules="[{ required: true, message: '请填写跟车医生', trigger: 'blur' }]">
                            <el-input v-model="form.admissionDoctor" :validate-event="false" :readonly="isReadonly" :maxlength="50" />
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="6" v-if="visitType === '01'">
                    <el-col :span="14">
                        <el-form-item label="跟车护士" prop="admissionNurse" :rules="[{ required: true, message: '请填写跟车护士', trigger: 'blur' }]">
                            <el-input v-model="form.admissionNurse" :validate-event="false" :readonly="isReadonly" :maxlength="50" />
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="6">
                    <el-col :span="18">
                        <el-form-item label="离开现场时间" prop="leaveLocationTime" :rules="[{ required: true, message: '请选择离开现场时间', trigger: 'blur' }]">
                            <med-datetime v-model="form.leaveLocationTime" :disabled="isReadonly" />
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <med-subtitle>患者病史</med-subtitle>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-col :span="20">
                        <el-form-item label="主诉">
                            <el-input v-model="form.chiefComplaint" placeholder="请输入主诉" type="textarea" autosize :readonly="isReadonly" :maxlength="60" />
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="12">
                    <el-col :span="20">
                        <el-form-item label="现病史">
                            <el-input v-model="form.presentHistory" placeholder="请输入现病史" type="textarea" autosize :readonly="isReadonly" :maxlength="60" />
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-col :span="24">
                        <el-form-item label="既往史">
                            <el-checkbox-group v-model="pastHistory" :disabled="isReadonly" @change="handleCheckBox(pastHistory, 'pastHistory')">
                                <el-checkbox v-for="(item, index) in PAST_0001" :key="index" :label="item.value">
                                    {{ item.label }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="20" v-if="pastHistory.includes('09')">
                <el-col :span="12">
                    <el-col :span="20">
                        <el-input v-model="form.otherPastHistory" type="textarea" autosize :readonly="isReadonly" />
                    </el-col>
                </el-col>
            </el-row>
            <med-subtitle>院前体征</med-subtitle>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-col :span="18">
                        <el-form-item label="体温" prop="sign.temperature" :rules="[{ validator: validateVitalSigns, trigger: 'blur' }]">
                            <el-input v-model="form.sign.temperature" :readonly="isReadonly" oninput="if(value){value=value.replace(/^\D*(\d*(?:\.\d{0,1})?).*$/g, '$1')}">
                                <template slot="append">℃</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="6">
                    <el-col :span="18">
                        <el-form-item label="心率" prop="sign.heartRate" :rules="[{ validator: validateVitalSigns, trigger: 'blur' }]">
                            <el-input v-model="form.sign.heartRate" :readonly="isReadonly" oninput="if(value){value=value.replace(/[^\d]/g,'')}">
                                <template slot="append">次/分</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="6">
                    <el-col :span="18">
                        <el-form-item label="脉搏" prop="sign.plus" :rules="[{ validator: validateVitalSigns, trigger: 'blur' }]">
                            <el-input v-model="form.sign.plus" :readonly="isReadonly" oninput="if(value){value=value.replace(/[^\d]/g,'')}">
                                <template slot="append">次/分</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="6">
                    <el-col :span="18">
                        <el-form-item label="呼吸" prop="sign.breath" :rules="[{ validator: validateVitalSigns, trigger: 'blur' }]" oninput="if(value){value=value.replace(/[^\d]/g,'')}">
                            <el-input v-model="form.sign.breath" :readonly="isReadonly">
                                <template slot="append">次/分</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-col :span="18">
                        <el-form-item label="血压">
                            <div style="display: flex;">
                                <el-form-item prop="sign.sbp" :rules="[{ validator: validateVitalSigns, trigger: 'blur' }]">
                                    <el-input v-model="form.sign.sbp" :readonly="isReadonly" oninput="if(value){value=value.replace(/[^\d]/g,'')} if(value<0){value=''} " class="sbp">
                                        <i slot="suffix">/</i>
                                    </el-input>
                                </el-form-item>
                                <el-form-item prop="sign.dbp" :rules="[{ validator: validateVitalSigns, trigger: 'blur' }]">
                                    <el-input v-model="form.sign.dbp" :readonly="isReadonly" oninput="if(value){value=value.replace(/[^\d]/g,'')} if(value<0){value=''} " class="dbp">
                                        <i slot="append">mmHg</i>
                                    </el-input>
                                </el-form-item>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="6">
                    <el-col :span="18">
                        <el-form-item label="血氧" prop="sign.spo" :rules="[{ validator: validateVitalSigns, trigger: 'blur' }]">
                            <el-input v-model="form.sign.spo" :readonly="isReadonly" oninput="if(value){value=value.replace(/[^\d]/g,'')}">
                                <template slot="append">%</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="6">
                    <el-col :span="18">
                        <el-form-item label="血糖" prop="sign.bloodglucose" :rules="[{ validator: validateVitalSigns, trigger: 'blur' }]">
                            <el-input v-model="form.sign.bloodglucose" :readonly="isReadonly" oninput="if(value){value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')}">
                                <template slot="append">mmol/L</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <med-subtitle>院前体格检查</med-subtitle>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-col :span="24">
                        <el-form-item label="创伤出血">
                            <el-radio-group v-model="form.bleeding" :disabled="isReadonly">
                                <el-radio-button v-for="(item, index) in [{ label: '有', value: '1' }, { label: '无', value: '0' }]" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'bleeding')">
                                    {{ item.label }}
                                </el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="6" v-if="form.bleeding === '1'">
                    <el-col :span="24">
                        <el-form-item label="出血部位">
                            <el-checkbox-group v-model="bleedingPart" :disabled="isReadonly" @change="handleCheckBox(bleedingPart, 'bleedingPart')">
                                <el-checkbox v-for="(item, index) in BLEEDING_PART" :key="index" :label="item.value">
                                    {{ item.label }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="6" v-if="form.bleeding === '1' && bleedingPart.includes('04')">
                    <el-col :span="24">
                        <el-form-item label="具体交界部位">
                            <el-checkbox-group v-model="specificJunction" :disabled="isReadonly" @change="handleCheckBox(specificJunction, 'specificJunction')">
                                <el-checkbox v-for="(item, index) in SPECIFIC_JUNCTION" :key="index" :label="item.value">
                                    {{ item.label }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-col :span="24">
                        <el-form-item label="瞳孔:">
                            <el-radio-group v-model="form.pupilResponse" :disabled="isReadonly">
                                <el-radio v-for="(item, index) in PUPIL_0001" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'pupilResponse')">
                                    {{ item.label }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-col :span="24">
                        <el-form-item label="瞳孔对光反射:">
                            <el-radio-group v-model="form.lightReflection" :disabled="isReadonly">
                                <el-radio v-for="(item, index) in LIGHT_0001" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'lightReflection')">
                                    {{ item.label }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-col :span="24">
                        <el-form-item label="意识:">
                            <el-radio-group v-model="form.consciousness" :disabled="isReadonly">
                                <el-radio v-for="(item, index) in CONS_0001" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'consciousness')">
                                    {{ item.label }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-col :span="24">
                        <el-form-item label="气道:">
                            <el-radio-group v-model="form.airway" :disabled="isReadonly">
                                <el-radio v-for="(item, index) in AIRWAY_0001" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'airway')">
                                    {{ item.label }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-col :span="24">
                        <el-form-item label="循环:">
                            <el-radio-group v-model="form.cycle" :disabled="isReadonly">
                                <el-radio v-for="(item, index) in CYCLE_0001" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'cycle')">
                                    {{ item.label }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-col :span="24">
                        <el-form-item label="心律:">
                            <el-radio-group v-model="form.heartRate" :disabled="isReadonly">
                                <el-radio v-for="(item, index) in HEARTRATE_0001" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'heartRate')">
                                    {{ item.label }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-col :span="24">
                        <el-form-item label="胸部:">
                            <el-radio-group v-model="form.chest" :disabled="isReadonly">
                                <el-radio v-for="(item, index) in CHEST_0001" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'chest')">
                                    {{ item.label }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-col :span="24">
                        <el-form-item label="腹部:">
                            <el-radio-group v-model="form.belly" :disabled="isReadonly">
                                <el-radio v-for="(item, index) in BELLY_0001" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'belly')">
                                    {{ item.label }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-col :span="24">
                        <el-form-item label="肠鸣:">
                            <el-radio-group v-model="form.borborygmus" :disabled="isReadonly">
                                <el-radio v-for="(item, index) in BORY_0001" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'borborygmus')">
                                    {{ item.label }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-col :span="24">
                        <el-form-item label="肌张力:">
                            <el-radio-group v-model="form.muscular" :disabled="isReadonly">
                                <el-radio v-for="(item, index) in MUSCULAR_0001" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'muscular')">
                                    {{ item.label }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-col :span="24">
                        <el-form-item label="骨折:">
                            <el-radio-group v-model="form.fracture" :disabled="isReadonly">
                                <el-radio v-for="(item, index) in FRACTURE_0001" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'fracture')">
                                    {{ item.label }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-col :span="20">
                        <el-form-item label="其他:">
                            <el-input v-model="form.checkOther" placeholder="请输入其他" type="textarea" autosize :readonly="isReadonly" :maxlength="100" />
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <med-subtitle>院前TI创伤评分</med-subtitle>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-col :span="24">
                        <el-form-item label="院前TI创伤评分">
                            <Score v-model="form.tiGrade" score-type="1" />
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <med-subtitle>院前诊断</med-subtitle>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-col :span="20">
                        <el-form-item label="院前诊断">
                            <el-input v-model="form.diagnosis" placeholder="请输入院前诊断" type="textarea" autosize :readonly="isReadonly" :maxlength="100" />
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <med-subtitle>院前处置</med-subtitle>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-col :span="24">
                        <el-form-item label="院前抢救措施">
                            <el-checkbox-group v-model="emeregncyMeasures" :disabled="isReadonly" @change="handleCheckBox(emeregncyMeasures, 'emeregncyMeasures')">
                                <el-checkbox v-for="(item, index) in PRE_MEASURE_0001" :key="index" :label="item.value">
                                    {{ item.label }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-col :span="20">
                        <el-form-item label="抢救措施说明">
                            <el-input v-model="form.measuresInfo" placeholder="请输入抢救措施说明" type="textarea" autosize :readonly="isReadonly" :maxlength="100" />
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-col :span="20">
                        <el-form-item label="治疗药物">
                            <el-select v-model="therapeutic" multiple placeholder="请选择治疗药物" style="width: 100%;" @change="changeTherapeutic">
                                <el-option v-for="(item, index) in THERAPEUTIC_0001" :key="index" :label="item.label" :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="12" v-if="therapeutic.includes('9000')">
                    <el-col :span="20">
                        <el-form-item label="其它治疗药物">
                            <el-input v-model="form.otherTherapeutic" placeholder="请输入其它治疗药物" type="textarea" autosize :maxlength="200" />
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="20" v-if="emeregncyMeasures.includes('16')">
                <el-col :span="12">
                    <el-col :span="20">
                        <el-form-item label="其他抢救措施">
                            <el-input v-model="form.otherMeasures" placeholder="请输入其他抢救措施" type="textarea" autosize :maxlength="100" />
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-col :span="24">
                        <el-form-item label="是否心电图">
                            <el-radio-group v-model="form.isEcg" :disabled="isReadonly">
                                <el-radio-button v-for="(item, index) in WHETHER" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'isEcg')">
                                    {{ item.label }}
                                </el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <div v-if="form.isEcg === '1'">
                <div v-for="(item, index) in  form.ecgList" :key="index" style="margin-bottom: 1rem;">
                    <el-row :gutter="20">
                        <el-col :span="23">
                            <el-card shadow="never">
                                <el-row :gutter="20">
                                    <el-col :span="3">
                                        <el-upload :action="upLoadUrl" list-type="picture-card" :file-list="item.ecgFile.attachPath ? [item.ecgFile] : []" :on-success="(response) => { handleSuccess(response, index) }" :class="item.ecgFile.attachPath ? 'hide_box' : ''">
                                            <i slot="default" class="el-icon-plus" />
                                            <div slot="file" slot-scope="{ file }">
                                                <img class="el-upload-list__item-thumbnail" :src="file.attachPath" alt="">
                                                <span class="el-upload-list__item-actions">
                                                    <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                                        <i class="el-icon-zoom-in"></i>
                                                    </span>
                                                    <span class="el-upload-list__item-delete" @click="deletePicture(index)">
                                                        <i class="el-icon-delete"></i>
                                                    </span>
                                                </span>
                                            </div>
                                        </el-upload>
                                        <el-dialog title="查看图片" width="fit-content" :visible.sync="dialogVisible" :close-on-click-modal="false">
                                            <div class="view-box">
                                                <template v-if="dialogVisible">
                                                    <img :src="dialogImageUrl" alt="">
                                                </template>
                                            </div>
                                        </el-dialog>
                                    </el-col>
                                    <el-col :span="19" style="margin-top: 1.7rem;">
                                        <el-col :span="12">
                                            <el-form :inline="true" :model="item" size="mini">
                                                <el-form-item label="完成时间" label-width="80px">
                                                    <med-datetime v-model="item.checkTime" />
                                                </el-form-item>
                                            </el-form>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form :inline="true" :model="item" size="mini">
                                                <el-form-item label="诊断时间" label-width="80px">
                                                    <med-datetime v-model="item.diagnosisTime" />
                                                </el-form-item>
                                            </el-form>
                                        </el-col>
                                    </el-col>
                                    <el-col :span="2" style="line-height: 88px;">
                                        <el-button type="danger" plain icon="el-icon-delete" @click="deleteEcg(item.id, index)">
                                            删除
                                        </el-button>
                                    </el-col>
                                </el-row>
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
                <el-row :gutter="20">
                    <el-col :span="23">
                        <el-button class="add-btn" icon="el-icon-plus" @click="form.ecgList.push({ registId: registId, ecgFile: {} })">添加</el-button>
                    </el-col>
                </el-row>
            </div>
            <med-subtitle>院前救治结果</med-subtitle>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-col :span="24">
                        <el-form-item label="是否死亡" prop="isDeath" :rules="[{ required: true, message: '请选择是否死亡', trigger: 'blur' }]">
                            <el-radio-group v-model="form.isDeath" :disabled="isReadonly">
                                <el-radio-button v-for="(item, index) in WHETHER" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'isDeath')">{{
                                    item.label
                                    }}
                                </el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="6" v-if="form.isDeath === '1'">
                    <el-col :span="18">
                        <el-form-item label="病人死亡时间">
                            <med-datetime v-model="form.deathTime" :disabled="isReadonly" v-clear />
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <med-subtitle>院前预警联动</med-subtitle>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-col :span="24">
                        <el-form-item label="是否预警医院" prop="isWarning" :rules="[{ required: true, message: '请选择是否预警医院', trigger: 'blur' }]">
                            <el-radio-group v-model="form.isWarning" :disabled="isReadonly">
                                <el-radio-button v-for="(item, index) in WHETHER" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'isWarning')">
                                    {{ item.label }}
                                </el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="6" v-if="form.isWarning === '1'">
                    <el-col :span="18">
                        <el-form-item label="预警时间" prop="warningTime" :rules="[{ required: true, message: '请选择预警时间', trigger: 'blur' }]">
                            <med-datetime v-model="form.warningTime" :disabled="isReadonly" v-clear />
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <med-subtitle>到院交接</med-subtitle>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-col :span="18">
                        <el-form-item label="到达医院时间" prop="arriveHospitalTime" :rules="[{ required: true, message: '请选择到达医院时间', trigger: 'blur' }]">
                            <med-datetime v-model="form.arriveHospitalTime" :disabled="isReadonly" />
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="接诊科室" prop="receiveDept" :rules="[{ required: true, message: '请选择接诊科室', trigger: 'blur' }]">
                        <el-radio-group v-model="form.receiveDept" :disabled="isReadonly">
                            <el-radio v-for="(item, index) in DEPT_0001" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'receiveDept')">
                                {{ item.label }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-col :span="14">
                        <el-form-item label="接诊医生">
                            <el-input v-model="form.receiveDoctor" :readonly="isReadonly" :maxlength="36" />
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="6">
                    <el-col :span="14">
                        <el-form-item label="接诊护士">
                            <el-input v-model="form.receiveNurse" :readonly="isReadonly" :maxlength="36" />
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
import * as types from '@/store/mutation-types'
import { mapGetters, mapMutations } from 'vuex'
import { DictionariesMixin, FormValidateMixin } from '@/mixins/index'
export default {
    name: 'TraumaPcPhfa',
    components: {
        Score: () => import('./Score.vue'),// 评分
        AssociationPatient: () => import('./AssociationPatient.vue') // 关联患者 
    },
    inject: ['registId', 'readonlyFun', 'visitTypeFun'],
    mixins: [DictionariesMixin, FormValidateMixin],
    data() {
        return {
            bleedingPart: [],// 出血部位
            specificJunction: [],// 具体交界部位
            isShowEcg: false,// 是否显示心电图
            isShowScore: false, // 是否显示评分
            upLoadUrl: window.GLOBAL_APP_API_BASE_URL + '/file/upload',
            dialogImageUrl: '', // 图片预览
            dialogVisible: false,
            pastHistory: [],// 既往史
            emeregncyMeasures: [],// 院前抢救措施
            therapeutic: [],// 治疗药物
            form: {
                sign: {},
            }
        }
    },
    mounted() {
        this.detail()
    },
    computed: {
        ...mapGetters(['synchronize']),
        visitType() {
            // 来院方式
            return this.visitTypeFun()
        },
        isReadonly() {
            return this.readonlyFun()
        },
    },
    methods: {
        ...mapMutations([types.SET_LEAVE_LOCATION_TIME, types.SET_PHFA_DEATH, types.SET_PHFA_DEATH_TIME]),
        changeTherapeutic(val) {
            // 修改治疗药物
            if (val.length > 0) {
                this.form.therapeutic = val.join(',')
            }
        },
        handleSuccess(response, index) {
            // 心电图上传成功后的回调
            const pictureUrl = window.GLOBAL_APP_API_BASE_URL + response.body.filePath
            if (!this.form.ecgList[index].ecgFile) {
                this.form.ecgList[index].ecgFile = {
                    attachPath: pictureUrl
                }
            } else {
                this.form.ecgList[index].ecgFile.attachPath = pictureUrl
            }
            this.$set(this.form.ecgList, index, this.form.ecgList[index])
        },
        deletePicture(index) {
            // 删除图片
            delete this.form.ecgList[index].ecgFile.attachPath
            this.$set(this.form.ecgList, index, this.form.ecgList[index])
        },
        deleteEcg(id, index) {
            // 删除心电图记录
            this.$confirm('确认要删除吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (id) {
                    this.$api.deleteEcgById(id).then((res) => {
                        if (res.code === '000000') {
                            this.form.ecgList.splice(index, 1)
                        }
                    })
                } else {
                    this.form.ecgList.splice(index, 1)
                }
            }).catch(() => { })
        },
        handlePictureCardPreview(file) {
            // 预览心电图
            this.dialogImageUrl = file.attachPath;
            this.dialogVisible = true;
        },
        clickRadio(valA, valB) {
            // radio反选
            this.$set(this.form, valB, this.form[valB] === valA ? '' : valA)
        },
        handleCheckBox(val, field) {
            // checkBox字段处理
            this.$set(this.form, field, val.toString())
        },
        detail() {
            // 详情
            this.$api.detail({
                registId: this.registId,
                types: ['phfa']
            }).then(res => {
                if (res.code === '000000') {
                    this.form = {
                        ...this.form,
                        ...res.body.prehospital
                    }
                    // 既往史
                    if (this.form.pastHistory) this.pastHistory = this.form.pastHistory.split(',')
                    // 院前抢救措施
                    if (this.form.emeregncyMeasures) this.emeregncyMeasures = this.form.emeregncyMeasures.split(',')
                    // 心电图
                    this.isShowEcg = this.form.isEcg === '1'
                    // 治疗药物
                    if (this.form.therapeutic) this.therapeutic = this.form.therapeutic.split(',')
                    // 出血部位
                    if (this.form.bleeding === '1' && this.form.bleedingPart) this.bleedingPart = this.form.bleedingPart.split(',')
                    // 具体交界部位
                    if (this.form.bleeding === '1' && this.form.specificJunction) this.specificJunction = this.form.specificJunction.split(',')
                }
            })
        },
    },
    watch: {
        'form.isDeath'(val) {
            // 监听是否死亡
            this[types.SET_PHFA_DEATH](val === '1' ? true : false)
        },
        'form.deathTime'(val) {
            // 监听死亡时间
            if (this.form.isDeath === '1') {
                this[types.SET_PHFA_DEATH_TIME](val)
            }
        },
        'form.leaveLocationTime'(val) {
            // 监听离开现场时间
            this[types.SET_LEAVE_LOCATION_TIME](val)
        },
        synchronize() {
            // 同步数据
            this.detail()
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep .el-upload--picture-card {
    width: 88px;
    height: 88px;
    line-height: 100px;
}

::v-deep .el-upload-list--picture-card .el-upload-list__item {
    width: 88px;
    height: 88px;
}

.hide_box ::v-deep .el-upload--picture-card {
    display: none;
}

.view-box {
    overflow: hidden;
    text-align: center;
    min-width: 400px;
    min-height: 200px;

    img {
        max-height: 70vh;
        max-width: 90vw;
    }
}

.sbp ::v-deep .el-input__inner {
    border-radius: 4px 0 0 4px;
    border-right: 0;
}

.dbp ::v-deep .el-input__inner {
    border-radius: initial;
    border-left: 0;
}

.add-btn {
    width: 100%;
    padding: 15px;
    border: 1px dashed #ddd;
    margin-bottom: 20px;
}
</style>