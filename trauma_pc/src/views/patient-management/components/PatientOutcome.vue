<template>
    <div class="patient-outcome">
        <el-form ref="form" label-position="top" :model="form" label-width="50px" size="mini">
            <med-subtitle>病人去向</med-subtitle>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="病人去向" prop="turnResult" :rules="[{ required: true, message: '请选择病人去向', trigger: 'blur' }]">
                        <el-radio-group v-model="form.turnResult" :disabled="isReadonly">
                            <el-radio v-for="(item, index) in patientDestinations" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'turnResult')">
                                {{ item.label }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="form.turnResult === '02'">
                    <el-form-item label="住院科室">
                        <el-radio-group v-model="form.admissionDept" :disabled="isReadonly">
                            <el-radio v-for="(item, index) in INHOSPITAL_DEPT" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'admissionDept')">
                                {{ item.label }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <div v-if="form.turnResult === '01'">
                <el-row>
                    <el-col v-if="receiveDept === '01'" :span="6">
                        <el-form-item label="急诊离院时间" prop="leaveEmTime" :rules="[{ required: true, message: '请选择急诊离院时间', trigger: 'blur' }]">
                            <el-col :span="18">
                                <med-datetime v-model="form.leaveEmTime" :disabled="isReadonly" v-clear />
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="receiveDept === '01'" :span="6">
                        <el-form-item label="急诊停留时间 (分钟)">
                            <el-col :span="14">
                                <el-input v-model="form.emStayMinutes" placeholder="自动计算" readonly />
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="receiveDept === '02'" :span="6">
                        <el-form-item label="离院时间" prop="outphospitalTime" :rules="[{ required: true, message: '请选择离院时间', trigger: 'blur' }]">
                            <el-col :span="18">
                                <med-datetime v-model="form.outphospitalTime" :disabled="isReadonly" v-clear />
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="receiveDept === '02'" :span="6">
                        <el-form-item label="门诊停留时间 (分钟)">
                            <el-col :span="14">
                                <el-input v-model="form.outpatientStayMinutes" placeholder="自动计算" readonly />
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="治疗结果">
                            <el-radio-group v-model="form.treatmentResult" :disabled="isReadonly">
                                <el-radio v-for="(item, index) in CURERESULT_0001" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'treatmentResult')">
                                    {{ item.label }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10" v-if="form.treatmentResult === '04'">
                        <el-form-item label="其他原因离院">
                            <el-input v-model="form.otherOuthospitalReason" placeholder="请输其他原因离院" type="textarea" autosize :readonly="isReadonly" :maxlength="100" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            <div v-if="form.turnResult === '02'">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="住院号">
                            <AssociationPatient v-model="form.admissionNo" placeholder="住院号" type="4" v-clear />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="办理住院时间" prop="inphospitalTime" :rules="[{ required: true, message: '请选择办理住院时间', trigger: 'blur' }]">
                            <el-col :span="18">
                                <med-datetime v-model="form.inphospitalTime" :disabled="isReadonly" v-clear />
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="结束住院时间" prop="endphospitalTime" :rules="[{ required: true, message: '请选择结束住院时间', trigger: 'blur' }]">
                            <el-col :span="18">
                                <med-datetime v-model="form.endphospitalTime" :disabled="isReadonly" v-clear />
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="住院天数">
                            <el-col :span="14">
                                <el-input v-model="outphospitalDays" placeholder="自动计算" readonly />
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="住院后是否死亡" prop="isInpatientDead" :rules="[{ required: true, message: '请选择住院后是否死亡', trigger: 'blur' }]">
                            <el-radio-group v-model="form.isInpatientDead" :disabled="isReadonly">
                                <el-radio-button v-for="(item, index) in WHETHER" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'isInpatientDead')">
                                    {{ item.label }}
                                </el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" v-if="form.isInpatientDead === '1'">
                        <el-form-item label="死亡时间" prop="deadTime" :rules="[{ required: true, message: '请选择死亡时间', trigger: 'blur' }]">
                            <el-col :span="18">
                                <med-datetime v-model="form.deadTime" :disabled="isReadonly" v-clear />
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="是否到达ICU" prop="isIcu" :rules="[{ required: true, message: '请选择是否到达ICU', trigger: 'blur' }]">
                            <el-radio-group v-model="form.isIcu" :disabled="isReadonly">
                                <el-radio-button v-for="(item, index) in WHETHER" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'isIcu')">
                                    {{ item.label }}
                                </el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="form.isIcu === '1'" :span="6">
                        <el-form-item label="ICU住院天数">
                            <el-col :span="14">
                                <el-input v-model="stayIcuDays" placeholder="自动计算" readonly />
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div v-if="form.isIcu === '1'">
                    <el-row v-for="(item, index) in form.icuRecordList " :key="index">
                        <el-col :span="6">
                            <el-form-item label="到达ICU时间">
                                <el-col :span="18">
                                    <med-datetime v-model="item.arriveIcuTime" :disabled="isReadonly" />
                                </el-col>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="离开ICU时间">
                                <el-col :span="18">
                                    <med-datetime v-model="item.leaveIcuTime" :disabled="isReadonly" />
                                </el-col>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" v-if="!isReadonly">
                            <div style="margin-top: 1.92rem;">
                                <el-button icon="el-icon-delete" style="margin-left: 0.5rem;color: red;border-color: red;" @click="icuButt('删除', index)">删除
                                </el-button>
                                <el-button icon="el-icon-circle-plus" style="color: rgb(75,96,253); border-color: rgb(75,96,253);" @click="icuButt('新增')">新增
                                </el-button>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <el-row v-if="form.turnResult === '03'">
                <el-col :span="6">
                    <el-form-item label="交接时间" prop="shiftTime" :rules="[{ required: true, message: '请选择交接时间', trigger: 'blur' }]">
                        <el-col :span="18">
                            <med-datetime v-model="form.shiftTime" :disabled="isReadonly" v-clear />
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="接收医院">
                        <el-col :span="14">
                            <el-input v-model="form.receiveHospital" :readonly="isReadonly" v-clear :maxlength="50" />
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="转院时病情判断" prop="transferDiagnosis" :rules="[{ required: true, message: '请选择转院时病情判断', trigger: 'blur' }]">
                        <el-radio-group v-model="form.transferDiagnosis" :disabled="isReadonly">
                            <el-radio v-for="(item, index) in DIAGNOSIS_0001" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'transferDiagnosis')">
                                {{ item.label }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="form.turnResult === '04'">
                <el-col :span="6">
                    <el-form-item label="死亡时间" prop="deadTime" :rules="[{ required: true, message: '请选择日期', trigger: 'blur' }]">
                        <el-col :span="18">
                            <med-datetime v-model="form.deadTime" :disabled="isReadonly" v-clear />
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="死亡原因描述">
                        <el-input v-model="form.deadReason" :readonly="isReadonly" v-clear :maxlength="100" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="form.turnResult === '05'">
                <el-col :span="6">
                    <el-form-item label="留观时间" prop="observingTime" :rules="[{ required: true, message: '请选择留观时间', trigger: 'blur' }]">
                        <el-col :span="18">
                            <med-datetime v-model="form.observingTime" :disabled="isReadonly" v-clear />
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="急诊留观后是否死亡" prop="isEmDead" :rules="[{ required: true, message: '请选择急诊留观后是否死亡', trigger: 'blur' }]" v-if="receiveDept === '01'">
                        <el-radio-group v-model="form.isEmDead" :disabled="isReadonly">
                            <el-radio-button v-for="(item, index) in WHETHER" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'isEmDead')">
                                {{ item.label }}
                            </el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="留观后是否死亡" prop="isObservingDead" :rules="[{ required: true, message: '请选择留观后是否死亡', trigger: 'blur' }]" v-else>
                        <el-radio-group v-model="form.isObservingDead" :disabled="isReadonly">
                            <el-radio-button v-for="(item, index) in WHETHER" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'isObservingDead')">
                                {{ item.label }}
                            </el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="6" v-if="(receiveDept === '01' && form.isEmDead === '1') || (receiveDept === '02' && form.isObservingDead === '1')">
                    <el-form-item label="死亡时间" prop="deadTime" :rules="[{ required: true, message: '请选择日期', trigger: 'blur' }]">
                        <el-col :span="18">
                            <med-datetime v-model="form.deadTime" :disabled="isReadonly" v-clear />
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="留观原因描述">
                        <el-input v-model="form.observingReason" type="textarea" autosize :readonly="isReadonly" v-clear :maxlength="100" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="form.turnResult === '06'">
                <el-col :span="6">
                    <el-form-item label="转归时间" prop="outcomeTime" :rules="[{ required: true, message: '请选择转归时间', trigger: 'blur' }]">
                        <el-col :span="18">
                            <med-datetime v-model="form.outcomeTime" :disabled="isReadonly" v-clear />
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="具体去向">
                        <el-input v-model="form.specialTo" placeholder="请输入具体去向" type="textarea" autosize :readonly="isReadonly" v-clear :maxlength="100" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="病人去向情况备注">
                        <el-input v-model="form.turnResultRemark" placeholder="请输病人去向情况备注" type="textarea" autosize :readonly="isReadonly" :maxlength="100" />
                    </el-form-item>
                </el-col>
            </el-row>
            <div v-if="form.turnResult === '02'">
                <med-subtitle>诊断符合情况</med-subtitle>
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-form-item label="入院诊断">
                            <el-input v-model="form.diagnosis" placeholder="自动同步" readonly v-clear :maxlength="100" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-form-item label="出院诊断">
                            <el-input v-model="form.outhospitalDiagnosis" :readonly="isReadonly" v-clear :maxlength="100" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="20">
                        <el-form-item label="入院诊断是否与出院诊断符合">
                            <el-radio-group v-model="form.isDiagnosisConform" :disabled="isReadonly">
                                <el-radio-button v-for="(item, index) in WHETHER" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'isDiagnosisConform')">
                                    {{ item.label }}
                                </el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <med-subtitle>抢救情况</med-subtitle>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="抢救结果">
                            <el-radio-group v-model="form.rescueResult" :disabled="isReadonly">
                                <el-radio v-for="(item, index) in RESCUE_RESULT_0001" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'rescueResult')">
                                    {{ item.label }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="手术次数" prop="surgers" :rules="[{ validator: validateVitalSigns, trigger: 'blur' }]">
                            <el-col :span="14">
                                <el-input v-model="form.surgers" :readonly="isReadonly" v-clear oninput="if(value){value=value.replace(/[^\d]/g,'')} if(value<0){value=''} " />
                            </el-col>
                            <span style="padding-left: 1rem;">次</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="住院费用">
                            <el-col :span="14">
                                <el-input v-model="form.allCost" :readonly="isReadonly" v-clear />
                            </el-col>
                            <span style="padding-left: 1rem;">元</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
        </el-form>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { DictionariesMixin, FormValidateMixin } from '@/mixins/index'
export default {
    name: 'TraumaPcPatientOutcome',
    components: {
        AssociationPatient: () => import('./AssociationPatient.vue') // 关联患者 
    },
    inject: ['registId', 'readonlyFun'],
    mixins: [DictionariesMixin, FormValidateMixin],
    data() {
        return {
            isShowBind: false,
            outcomeBindDto: {},
            patientDestinations: [],
            form: {
                icuRecordList: [{}]
            }
        }
    },
    mounted() {
        this.detail()
    },
    computed: {
        ...mapGetters(['synchronize', 'receiveDept', 'arriveDeptTime', 'admittingDiagnosis']),
        isReadonly() {
            return this.readonlyFun()
        },
        // 住院天数
        outphospitalDays() {
            let result = this.computedTime(this.form.endphospitalTime, this.form.inphospitalTime, 'dd')
            if (result != '') {
                return parseFloat(result).toFixed(2)
            }
            return result
        },
        // ICU住院天数
        stayIcuDays() {
            let result = ''
            if (this.form.icuRecordList.length > 0) {
                let num = 0
                this.form.icuRecordList.forEach(el => {
                    num = num + this.computedTime(el.leaveIcuTime, el.arriveIcuTime, 'dd')
                })
                let dayNum = parseFloat(num)
                if (dayNum !== 0) {
                    result = dayNum.toFixed(2)
                }
            }
            return result
        }
    },
    methods: {
        clickRadio(valA, valB) {
            // radio反选
            this.$set(this.form, valB, this.form[valB] === valA ? '' : valA)
        },
        icuButt(val, index) {
            switch (val) {
                case '删除':
                    this.$confirm('是否确认删除ICU记录', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(async () => {
                        this.form.icuRecordList.splice(index, 1)
                    }).catch(() => { })
                    break
                case '新增':
                    this.form.icuRecordList.push({
                        registId: this.form.registId
                    })
                    break
            }
        },
        detail() {
            // 详情
            this.$api.detail({
                registId: this.registId,
                types: ['patientOutCome']
            }).then(res => {
                if (res.code === '000000') {
                    this.form = {
                        ...this.form,
                        ...res.body.outcome
                    }
                }
            })
        }
    },
    watch: {
        'form.isIcu'(val) {
            // 监听是否到达ICU
            if (val === '1' && this.form.icuRecordList.length < 1) {
                this.form.icuRecordList.push({
                    registId: this.form.registId
                })
            }
        },
        admittingDiagnosis(val) {
            // 监听入院诊断
            this.$set(this.form, 'diagnosis', val)
        },
        synchronize() {
            // 同步数据
            this.detail()
        },
        arriveDeptTime(val) {
            // 监听到达就诊科室时间
            if (this.receiveDept === '01') {
                // 计算急诊停留时间
                this.form.emStayMinutes = this.computedTime(this.form.leaveEmTime, val, 'mm')
            } else {
                // 计算门诊停留时间
                this.form.outpatientStayMinutes = this.computedTime(this.form.outphospitalTime, val, 'mm')
            }
        },
        'form.leaveEmTime'(val) {
            // 监听急诊离院时间,计算急诊停留时间(分钟)
            this.$set(this.form, 'emStayMinutes', this.computedTime(val, this.arriveDeptTime, 'mm'))
        },
        'form.outphospitalTime'(val) {
            // 监听离院时间,计算门诊停留时间(分钟)
            this.$set(this.form, 'outpatientStayMinutes', this.computedTime(val, this.arriveDeptTime, 'mm'))
        },
        receiveDept: {
            // 监听就诊科室,处理病人去向
            immediate: true,
            handler(val) {
                const result = this.TURN_0001
                if (val === '01') {
                    result[0].label = '急诊离院'
                    result[4].label = '急诊留观'
                } else {
                    result[0].label = '离院'
                    result[4].label = '留观'
                }
                this.patientDestinations = result
            }
        },
    }
}

</script>

<style lang="scss" scoped></style>