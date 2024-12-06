<template>
    <div class="piat">
        <el-form ref="form" label-position="top" :model="form" label-width="50px" size="mini">
            <med-subtitle>接诊信息</med-subtitle>
            <el-row :gutter="20">
                <el-col :span="6" v-if="['03', '04', '05'].includes(visitType)">
                    <el-form-item label="发病时间" prop="attackTime" :rules="[{ required: true, message: '请选择发病时间', trigger: 'blur' }]">
                        <el-col :span="18">
                            <med-datetime v-model="form.attackTime" :disabled="isReadonly" v-clear />
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="发病地址" v-if="['03', '04', '05'].includes(visitType)">
                        <el-input v-model="form.address" type="textarea" autosize :readonly="isReadonly" :maxlength="100" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="自行来院方式" v-if="visitType === '03'">
                        <el-radio-group v-model="form.selfVisitType" :disabled="isReadonly">
                            <el-radio v-for="(item, index) in SELF_VISIT_0001" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'selfVisitType')">
                                {{ item.label }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6" v-if="!['01', '02'].includes(visitType)">
                    <el-form-item label="到达医院时间" prop="arriveHospitalTime" :rules="[{ required: true, message: '请选择到达医院时间', trigger: 'blur' }]">
                        <el-col :span="18">
                            <med-datetime v-model="form.arriveHospitalTime" :disabled="isReadonly" v-clear />
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="门诊号">
                        <AssociationPatient v-model="form.regNo" placeholder="门诊号" :type="['01', '02'].includes(visitType) ? '2' : '3'" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="病情判断" prop="diagnosis" :rules="[{ required: true, message: '请选择病情判断', trigger: 'blur' }]">
                        <el-radio-group v-model="form.diagnosis" :disabled="isReadonly">
                            <el-radio v-for="(item, index) in DIAGNOSIS_0001" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'diagnosis')">
                                {{ item.label }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="MPDS症状" prop="mpdsList" :rules="[{ required: true, message: '请选择MPDS症状', trigger: 'blur' }]">
                        <el-checkbox-group v-model="form.mpdsList" :validate-event="false" :disabled="isReadonly" @change="handleCheckBox(form.mpdsList, 'mpds')">
                            <el-checkbox v-for="(item, index) in MPDS_0001" :key="index" :label="item.value" :validate-event="false">
                                {{ item.label }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="50">
                <el-col :span="10" v-if="form.mpdsList.includes('08')">
                    <el-form-item label="创伤(其他创伤)明细">
                        <el-input v-model="form.traumaDetail" placeholder="请输入创伤(其他创伤)明细" type="textarea" autosize :readonly="isReadonly" :maxlength="100" />
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="其他非创伤症状明细" v-if="form.mpdsList.includes('11')">
                        <el-input v-model="form.traumaOther" placeholder="请输入其他非创伤症状明细" type="textarea" autosize :readonly="isReadonly" :maxlength="100" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
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
                    <el-form-item label="接诊医生">
                        <el-col :span="14">
                            <el-input v-model="form.receiveDoctor" :readonly="isReadonly" :maxlength="36" />
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="接诊护士">
                        <el-col :span="14">
                            <el-input v-model="form.receiveNurse" :readonly="isReadonly" :maxlength="36" />
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="6" v-if="form.receiveDept">
                    <el-form-item label="到达急诊时间" v-if="form.receiveDept === '01'" prop="arriveEdTime" :rules="[{ required: true, message: '请填到达急诊时间', trigger: 'blur' }]">
                        <el-col :span="18">
                            <med-datetime v-model="form.arriveEdTime" :disabled="isReadonly" v-clear />
                        </el-col>
                    </el-form-item>
                    <el-form-item label="到达门诊时间" v-if="form.receiveDept === '02'" prop="arriveOsTime" :rules="[{ required: true, message: '请填写到达门诊时间', trigger: 'blur' }]">
                        <el-col :span="18">
                            <med-datetime v-model="form.arriveOsTime" :disabled="isReadonly" v-clear />
                        </el-col>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6" v-if="form.receiveDept">
                    <el-form-item label="到达急诊时是否已经死亡" v-if="form.receiveDept === '01'" prop="arriveEdIsDead" :rules="[{ required: true, message: '请填写到达急诊时是否已经死亡', trigger: 'blur' }]">
                        <el-radio-group v-model="form.arriveEdIsDead" :disabled="isReadonly || phfaDeath">
                            <el-radio-button v-for="(item, index) in WHETHER" :key="index" :label="item.value" @click.native.prevent="phfaDeath ? '' : clickRadio(item.value, 'arriveEdIsDead')">
                                {{ item.label }}
                            </el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="到达门诊时是否已经死亡" v-if="form.receiveDept === '02'" prop="arriveOsIsDead" :rules="[{ required: true, message: '请填写到达门诊时是否已经死亡', trigger: 'blur' }]">
                        <el-radio-group v-model="form.arriveOsIsDead" :disabled="isReadonly || phfaDeath">
                            <el-radio-button v-for="(item, index) in WHETHER" :key="index" :label="item.value" @click.native.prevent="phfaDeath ? '' : clickRadio(item.value, 'arriveOsIsDead')">
                                {{ item.label }}
                            </el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="6" v-if="(form.receiveDept === '01' && form.arriveEdIsDead === '1') || (form.receiveDept === '02' && form.arriveOsIsDead === '1')">
                    <el-form-item label="死亡时间" prop="deadTime" :rules="[{ required: true, message: '请选择死亡时间', trigger: 'blur' }]">
                        <el-col :span="18">
                            <med-datetime v-model="form.deadTime" :disabled="isReadonly" v-clear />
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="6" v-if="['01', '02'].includes(visitType)">
                    <el-form-item label="院前急救转运时间 (分钟)">
                        <el-col :span="14">
                            <el-input v-model="transformMinutes" placeholder="自动计算" readonly />
                        </el-col>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="是否到达抢救室">
                        <el-radio-group v-model="form.isArriveEr" :disabled="isReadonly">
                            <el-radio-button v-for="(item, index) in WHETHER" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'isArriveEr')">
                                {{ item.label }}
                            </el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="6" v-if="form.isArriveEr === '1'">
                    <el-form-item label="到达抢救室时间">
                        <el-col :span="18">
                            <med-datetime v-model="form.arriveErTime" :disabled="isReadonly" v-clear />
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="6" v-if="form.isArriveEr === '1'">
                    <el-form-item label="离开抢救室时间">
                        <el-col :span="18">
                            <med-datetime v-model="form.leaveErTime" :disabled="isReadonly" v-clear />
                        </el-col>
                    </el-form-item>
                </el-col>
            </el-row>
            <div v-if="isDeath" style="color: red;">此选择表示创伤诊疗结束，不再继续跟踪患者的救治情况！</div>
            <div v-else>
                <med-subtitle>院内体征</med-subtitle>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="体温" prop="sign.temperature" :rules="[{ validator: validateVitalSigns, trigger: 'blur' }]">
                            <el-col :span="18">
                                <el-input v-model="form.sign.temperature" :readonly="isReadonly" oninput="if(value){value=value.replace(/^\D*(\d*(?:\.\d{0,1})?).*$/g, '$1')}">
                                    <template slot="append">℃</template>
                                </el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="心率" prop="sign.heartRate" :rules="[{ validator: validateVitalSigns, trigger: 'blur' }]">
                            <el-col :span="18">
                                <el-input v-model="form.sign.heartRate" :readonly="isReadonly" oninput="if(value){value=value.replace(/[^\d]/g,'')}">
                                    <template slot="append">次/分</template>
                                </el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="脉搏" prop="sign.plus" :rules="[{ validator: validateVitalSigns, trigger: 'blur' }]">
                            <el-col :span="18">
                                <el-input v-model="form.sign.plus" :readonly="isReadonly" oninput="if(value){value=value.replace(/[^\d]/g,'')}">
                                    <template slot="append">次/分</template>
                                </el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="呼吸" prop="sign.breath" :rules="[{ validator: validateVitalSigns, trigger: 'blur' }]" oninput="if(value){value=value.replace(/[^\d]/g,'')}">
                            <el-col :span="18">
                                <el-input v-model="form.sign.breath" :readonly="isReadonly">
                                    <template slot="append">次/分</template>
                                </el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="血压">
                            <el-col :span="18" style="display: flex;">
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
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="血氧" prop="sign.spo" :rules="[{ validator: validateVitalSigns, trigger: 'blur' }]">
                            <el-col :span="18">
                                <el-input v-model="form.sign.spo" :readonly="isReadonly" oninput="if(value){value=value.replace(/[^\d]/g,'')}">
                                    <template slot="append">%</template>
                                </el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="血糖" prop="sign.bloodglucose" :rules="[{ validator: validateVitalSigns, trigger: 'blur' }]">
                            <el-col :span="18">
                                <el-input v-model="form.sign.bloodglucose" :readonly="isReadonly" oninput="if(value){value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')}">
                                    <template slot="append">mmol/L</template>
                                </el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
                <med-subtitle>院内预警联动</med-subtitle>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="是否呼叫了创伤救治团队" prop="isCall" :rules="[{ required: true, message: '请选择是否呼叫了创伤救治团队', trigger: 'blur' }]">
                            <el-radio-group v-model="form.isCall" :disabled="isReadonly">
                                <el-radio-button v-for="(item, index) in WHETHER" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'isCall')">
                                    {{ item.label }}
                                </el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <div v-if="form.isCall === '1'">
                        <el-col :span="6">
                            <el-form-item label="创伤救治团队到达急诊科时间" prop="treatmentArriveTime" :rules="[{ required: true, message: '请选择创伤救治团队到达急诊科时间', trigger: 'blur' }]">
                                <el-col :span="18">
                                    <med-datetime v-model="form.treatmentArriveTime" :disabled="isReadonly" v-clear />
                                </el-col>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="急诊准备时间 (分钟)">
                                <el-col :span="14">
                                    <el-input v-model="prepareMinutes" placeholder="自动计算" readonly />
                                </el-col>
                            </el-form-item>
                        </el-col>
                    </div>
                </el-row>
            </div>
        </el-form>
    </div>
</template>

<script>
import * as types from '@/store/mutation-types'
import { mapGetters, mapMutations } from 'vuex'
import { DictionariesMixin, FormValidateMixin } from '@/mixins/index'
export default {
    name: 'TraumaPcPiat',
    components: {
        AssociationPatient: () => import('./AssociationPatient.vue') // 关联患者 
    },
    inject: ['registId', 'readonlyFun', 'visitTypeFun'],
    mixins: [DictionariesMixin, FormValidateMixin],
    data() {
        return {
            transformMinutes: '',// 院前急救转运时间(分钟)
            form: {
                mpdsList: [],
                sign: {}
            }
        }
    },
    mounted() {
        this.detail()
    },
    computed: {
        ...mapGetters(['synchronize', 'leaveLocationTime', 'phfaDeath', 'phfaDeathTime', 'rescueRoom']),
        isReadonly() {
            return this.readonlyFun()
        },
        visitType() {
            return this.visitTypeFun()
        },
        // 计算急诊准备时间(分钟)
        prepareMinutes() {
            return this.computedTime(this.form.treatmentArriveTime, this.form.arriveEdTime, 'mm')
        },
        // 是否死亡
        isDeath() {
            let result = false
            if (this.phfaDeath) {
                result = true
            } else {
                if (this.form.receiveDept && (this.form.arriveEdIsDead || this.form.arriveOsIsDead)) {
                    // 当接诊科室与到达急诊时是否已经死亡或到达门诊时是否已经死亡不为null时
                    result = this.form.receiveDept === '01' ? this.form.arriveEdIsDead === '1' : this.form.arriveOsIsDead === '1'
                }
            }
            return result
        },
    },
    methods: {
        ...mapMutations([types.SET_RECEIVE_DEPT, types.SET_ARRIVE_DEPT_TIME, types.SET_PIAT_DEATH]),
        clickRadio(valA, valB) {
            // radio反选
            this.$set(this.form, valB, this.form[valB] === valA ? '' : valA)
        },
        handleCheckBox(val, field) {
            // 处理CheckBox
            this.$set(this.form, field, val.toString())
        },
        detail() {
            // 获取详情
            this.$api.detail({
                registId: this.registId,
                types: ['piat']
            }).then(res => {
                if (res.code === '000000') {
                    this.form = {
                        ...this.form,
                        ...res.body.admission
                    }
                    // MPDS
                    if (this.form.mpds) this.form.mpdsList = this.form.mpds.split(',')
                    // 接诊科室
                    this[types.SET_RECEIVE_DEPT](this.form.receiveDept)
                }
            })
        }
    },
    watch: {
        rescueRoom(val) {
            // 腕带导入时间
            if (val.startTime || val.endTime) {
                this.$set(this.form, 'isArriveEr', '1')
            }
            if (val.startTime) {
                this.$set(this.form, 'arriveErTime', val.startTime)
            }
            if (val.endTime) {
                this.$set(this.form, 'leaveErTime', val.endTime)
            }
        },
        phfaDeath(val) {
            // 监听院前急救死否死亡
            if (val) {
                this.$set(this.form, 'arriveEdIsDead', '1')
                this.$set(this.form, 'arriveOsIsDead', '1')
            }
        },
        phfaDeathTime(val) {
            // 监听院前急救死亡时间
            this.$set(this.form, 'deadTime', val)
        },
        'form.receiveDept'(val) {
            // 监听接诊科室
            if (!this.phfaDeath) {
                if (val === '01') {
                    this.$set(this.form, 'arriveOsIsDead', '')
                    this.$set(this.form, 'arriveOsTime', '')
                } else {
                    this.$set(this.form, 'arriveEdIsDead', '')
                    this.$set(this.form, 'arriveEdTime', '')
                }
            }
            this[types.SET_RECEIVE_DEPT](val)
            this.transformMinutes = '' // 院前急救运转时间
            this[types.SET_ARRIVE_DEPT_TIME]('') // 到达接诊科室时间
        },
        synchronize() {
            // 同步数据
            this.detail()
        },
        isDeath(val) {
            // 监听是否死亡
            this[types.SET_PIAT_DEATH](val)
        },
        leaveLocationTime(val) {
            // 监听离开现场时间,计算院前急救转运时间 (分钟)
            if (this.form.arriveEdTime || this.form.arriveOsTime) {
                if (this.form.receiveDept === '01') {
                    // 到达急诊时间 - 离开现场时间
                    this.transformMinutes = this.computedTime(this.form.arriveEdTime, val, 'mm')
                } else {
                    // 到达门诊时间 - 离开现场时间
                    this.transformMinutes = this.computedTime(this.form.arriveOsTime, val, 'mm')
                }
            } else {
                this.transformMinutes = ''
            }
        },
        'form.arriveEdTime'(val) {
            // 监听到达急诊时间,计算院前急救转运时间 (分钟)
            if (this.form.receiveDept === '01') {
                this.transformMinutes = this.computedTime(val, this.leaveLocationTime, 'mm')
                // 接诊科室 = 01 时, 将到达急诊时间放入storage中
                this[types.SET_ARRIVE_DEPT_TIME](val)
            }
        },
        'form.arriveOsTime'(val) {
            // 监听到达门诊时间,计算院前急救转运时间 (分钟)
            if (this.form.receiveDept === '02') {
                this.transformMinutes = this.computedTime(val, this.leaveLocationTime, 'mm')
                // 接诊科室 = 02 时,将到达门诊时间放入storage中
                this[types.SET_ARRIVE_DEPT_TIME](val)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.sbp ::v-deep .el-input__inner {
    border-radius: 4px 0 0 4px;
    border-right: 0;
}

.dbp ::v-deep .el-input__inner {
    border-radius: initial;
    border-left: 0;
}
</style>