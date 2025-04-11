<template>
    <el-container style="background-color: rgb(245,246,251);padding: 0.6rem;height: calc(100vh - 3rem);">
        <el-aside style="background-color: white;margin:0 0.6rem 0 0;">
            <el-divider content-position="left">
                <b class="timeline-title">时间轴</b>
            </el-divider>
            <el-timeline style="padding-left: 0;">
                <el-timeline-item v-for="(item, index) in timeAxis" :key="index" type="info">
                    <div style="color: #435372">{{ item.name }}</div>
                    <div v-if="item.timeDifferenceVO" class="time-diff">
                        <el-row class="time-diff-item" :gutter="12"
                            :style="item.timeDifferenceVO.value < 1 ? 'color: #f86359; background-color: rgb(254,240,240)' : ''">
                            <el-col :span="17">
                                {{ item.timeDifferenceVO.name }}
                            </el-col>
                            <el-col :span="7">
                                {{ item.timeDifferenceVO.value }}
                            </el-col>
                        </el-row>
                    </div>
                    <template #dot>
                        <div :class="{ dot: true, 'is-date': !item.name }">
                            {{ item.value }}
                        </div>
                    </template>
                </el-timeline-item>
            </el-timeline>
        </el-aside>
        <el-container>
            <el-header style="background-color: white;height: auto;padding: 18px 18px 0 18px;">
                <el-form ref="form" :model="form" size="mini" label-width="auto" label-position="left"
                    v-if="!isShowRead">
                    <el-row :gutter="20">
                        <el-col :span="4">
                            <el-form-item label="姓名" prop="patientRegist.name"
                                :rules="[{ required: true, message: '请输入患者姓名', trigger: 'blur' }]">
                                <div class="flex-c-b">
                                    <el-input v-model="form.patientRegist.name" placeholder="姓名" :validate-event="false"
                                        :readonly="isReadonly" :maxlength="20" />
                                    <el-checkbox v-model="form.patientRegist.hasName" true-label="1" false-label="0"
                                        :disabled="isHasName" style="margin-left: 10px;"
                                        @change="genPatientName">无名氏</el-checkbox>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="性别" prop="patientRegist.gender"
                                :rules="[{ required: true, message: '请选择性别' }]">
                                <el-radio-group v-model="form.patientRegist.gender">
                                    <el-radio-button v-for="(item, index) in GENDER_0001" :key="index"
                                        :label="item.value" :disabled="isReadonly">
                                        {{ item.label }}
                                    </el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="身份证号" prop="patientRegist.idNumber"
                                :rules="[{ validator: validateVitalSigns, trigger: 'blur' }]">
                                <el-input v-model="form.patientRegist.idNumber" placeholder="身份证号"
                                    :readonly="isReadonly" :maxlength="18" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="年龄区间" prop="patientRegist.ageRange"
                                :rules="[{ required: true, message: '请选择年龄区间' }]">
                                <el-select v-model="form.patientRegist.ageRange" placeholder="年龄区间"
                                    :disabled="isReadonly">
                                    <el-option v-for="(item, index) in AGE_0001" :key="index" :label="item.label"
                                        :value="item.value" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="form.patientRegist.ageRange === '02' ? 6 : 4" v-if="form.patientRegist.ageRange">
                            <div style="display: flex;">
                                <el-form-item label="年龄" prop="patientRegist.age"
                                    :rules="[{ required: true, validator: valideateAge, trigger: 'blur' }]">
                                    <el-input v-model.number="form.patientRegist.age"
                                        :placeholder="form.patientRegist.ageRange === '02' ? '请填写' : '请填写年龄'"
                                        oninput="if(value){value=value.replace(/[^\d]/g,'')}" :readonly="isReadonly"
                                        :maxlength="3">
                                        <template slot="append">
                                            {{ form.patientRegist.ageRange === '03' ? '天' : '岁' }}
                                        </template>
                                    </el-input>
                                </el-form-item>
                                <el-form-item prop="patientRegist.ageMonth"
                                    :rules="[{ type: 'number', min: 0, max: 12, message: '请输入0-12之间的整数', trigger: 'blur' }]"
                                    v-if="form.patientRegist.ageRange === '02'">
                                    <el-input v-model.number="form.patientRegist.ageMonth" placeholder="请填写"
                                        oninput="if(value){value=value.replace(/[^\d]/g,'')}" :readonly="isReadonly"
                                        :maxlength="2">
                                        <template slot="append">月</template>
                                    </el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="4">
                            <el-form-item label="来院方式" prop="patientMain.visitType"
                                :rules="[{ required: true, message: '请选择来院方式', trigger: 'change' }]">
                                <el-select v-model="form.patientMain.visitType" placeholder="来院方式"
                                    :disabled="isReadonly" @change="activeTab = ''">
                                    <el-option v-for="(item, index) in VISIT_0001" :key="index" :label="item.label"
                                        :value="item.value" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4" v-if="form.patientMain.visitType === '05'">
                            <el-form-item label="其他来院方式">
                                <el-input v-model="form.patientMain.visitTypeOther" :maxlength="100" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="卡类型">
                                <el-select v-model="form.patientRegist.idcardType" placeholder="卡类型"
                                    :disabled="isReadonly" @change="$set(form.patientRegist, 'identificationNo', '')">
                                    <el-option v-for="(item, index) in CARD_0001" :key="index" :label="item.label"
                                        :value="item.value" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="卡号">
                                <el-input v-model="form.patientRegist.identificationNo" placeholder="卡号" :maxlength="20"
                                    :readonly="isReadonly || form.patientRegist.idcardType === '1'" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="紧急联系人">
                                <el-input v-model="form.patientRegist.emergencyContact" placeholder="紧急联系人"
                                    :readonly="isReadonly" :maxlength="20" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="联系电话" prop="patientRegist.phoneNumber"
                                :rules="[{ validator: validateVitalSigns, trigger: 'blur' }]">
                                <el-input v-model="form.patientRegist.phoneNumber" placeholder="联系电话"
                                    :readonly="isReadonly" :maxlength="11" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="4">
                            <el-form-item label="家庭住址">
                                <el-input v-model="form.patientRegist.homeAddress" placeholder="家庭住址"
                                    :readonly="isReadonly" :maxlength="100" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="详细住址">
                                <el-input v-model="form.patientRegist.detailAddress" placeholder="详细住址"
                                    :readonly="isReadonly" :maxlength="100" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="身高" prop="patientRegist.height"
                                :rules="[{ validator: validateVitalSigns, trigger: 'blur' }]">
                                <el-input v-model="form.patientRegist.height" placeholder="身高" :readonly="isReadonly"
                                    oninput="if(value){value=value.replace(/^\D*(\d*(?:\.\d{0,1})?).*$/g, '$1')}">
                                    <template slot="append">cm</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="体重" prop="patientRegist.weight"
                                :rules="[{ validator: validateVitalSigns, trigger: 'blur' }]">
                                <el-input v-model="form.patientRegist.weight" placeholder="体重" :readonly="isReadonly"
                                    oninput="if(value){value=value.replace(/^\D*(\d*(?:\.\d{0,1})?).*$/g, '$1')}">
                                    <template slot="append">kg</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="院区">
                                <el-select v-model="form.patientMain.hospitalArea" placeholder="院区" disabled>
                                    <el-option v-for="(item, index) in hospitalAreaList" :key="index"
                                        :label="item.label" :value="item.value" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div v-else style="font-size: 0.875rem;color: #303133;">
                    <el-row :gutter="20">
                        <el-col :span="4">
                            <span>姓名: {{ form.patientRegist.name }}</span>
                        </el-col>
                        <el-col :span="4">
                            <span>性别: {{
                                dicLabelByValue(form.patientRegist.gender,
                                'GENDER_0001') }}</span>
                        </el-col>
                        <el-col :span="4">
                            <span>身份证号: {{ form.patientRegist.idNumber
                            }}</span>
                        </el-col>
                        <el-col :span="4">
                            <span>年龄区间:
                                {{ dicLabelByValue(form.patientRegist.ageRange, 'AGE_0001') }}
                            </span>
                        </el-col>
                        <el-col :span="4">
                            <span>年龄:
                                {{ form.patientRegist.ageRange === '03' ? form.patientRegist.age + ' 天' :
                                    form.patientRegist.ageRange === '02' ? form.patientRegist.age + ' 岁' +
                                        form.patientRegist.ageMonth + ' 月' : form.patientRegist.age + ' 岁'
                                }}
                            </span>
                        </el-col>
                        <el-col :span="4">
                            <span>腕带号: {{ form.patientRegist.rfTagId
                            }}</span>
                        </el-col>
                    </el-row>
                    <br>
                    <el-row :gutter="20">
                        <el-col :span="4">
                            <span>来院方式: {{
                                dicLabelByValue(form.patientMain.visitType,
                                'VISIT_0001') }}</span>
                        </el-col>
                        <el-col :span="4">
                            <span>卡类型: {{
                                dicLabelByValue(form.patientRegist.idcardType,
                                'CARD_0001') }}</span>
                        </el-col>
                        <el-col :span="4">
                            <span>卡号: {{ form.patientRegist.identificationNo
                            }}</span>
                        </el-col>
                        <el-col :span="4">
                            <span>紧急联系人: {{
                                form.patientRegist.emergencyContact
                                }}</span>
                        </el-col>
                        <el-col :span="4">
                            <span>联系电话: {{ form.patientRegist.phoneNumber
                            }}</span>
                        </el-col>
                    </el-row>
                    <br>
                    <el-row :gutter="20">
                        <el-col :span="4">
                            <span>家庭住址: {{ form.patientRegist.homeAddress
                            }}</span>
                        </el-col>
                        <el-col :span="4">
                            <span>详细住址: {{ form.patientRegist.detailAddress
                            }}</span>
                        </el-col>
                        <el-col :span="4">
                            <span>身高: {{ form.patientRegist.height }} cm</span>
                        </el-col>
                        <el-col :span="4">
                            <span>体重: {{ form.patientRegist.weight }} kg</span>
                        </el-col>
                        <el-col :span="4">
                            <span>院区:
                                {{form.patientMain.hospitalArea ? hospitalAreaList.find(el => el.value ===
                                    form.patientMain.hospitalArea).label : '' }}
                            </span>
                        </el-col>
                    </el-row>
                </div>
            </el-header>
            <el-main style="position: relative;padding: initial;overflow: hidden;">
                <el-tabs v-model="activeName" style="height: 100%;">
                    <el-tab-pane :label="item.label" :name="item.value" v-for="item in tabs" :key="item.value">
                        <component :is="item.value" ref="tabs" />
                    </el-tab-pane>
                </el-tabs>
                <div class="empty" v-if="tabs.length < 1">
                    <el-empty description="未授权或暂无填写数据" />
                </div>
                <div style="position: absolute;top: 1rem;right: 1px;">
                    <div v-if="!isShowRead && !['2', '3', '4'].includes(form.patientMain.status)">
                        <el-button size="mini" type="success" style="background-color: rgb(19,206,102);"
                            @click="isShowBindWristStrap = true">{{
                                form.patientRegist.rfTagName ?
                                    '腕带:' + form.patientRegist.rfTagName : '绑定腕带'
                            }}</el-button>
                        <el-button size="mini" type="success" style="background-color: rgb(19,206,102);"
                            @click="synchrodata" v-if="this.form.patientMain.emId">
                            同步
                        </el-button>
                        <el-button size="mini" type="success" style="background-color: rgb(19,206,102);"
                            @click="clickRead" v-if="form.patientMain.emId">调阅</el-button>
                        <el-button v-else size="mini" type="success" style="background-color: rgb(19,206,102);"
                            @click="isShowBindPatient = true">绑定患者</el-button>
                    </div>
                </div>
                <div v-if="!isShowRead" style="position: absolute;bottom: 1rem;right: 2rem;">
                    <el-button v-if="AUTH_ADD && form.patientMain.status === '1'" @click="saveOrSubmit(0)">
                        保存
                    </el-button>
                    <el-button @click="disallowVisible = true"
                        v-if="(form.patientMain.status === '2' && AUTH_AUDIT_OVERRULE) || (form.patientMain.status === '3' && AUTH_ARCHIVE_OVERRULE)">
                        驳回
                    </el-button>
                    <el-button type="primary" @click="saveOrSubmit(form.patientMain.status)"
                        v-if="(form.patientMain.status === '1' && AUTH_SUBMIT) || (form.patientMain.status === '2' && AUTH_AUDIT) || (form.patientMain.status === '3' && AUTH_ARCHIVE) || (form.patientMain.status === '4' && AUTH_REPORT)">
                        {{states.find(el => el.value === form.patientMain.status).label}}
                    </el-button>
                    <el-dialog title="校验错误" :visible.sync="validateVisible" width="40%" :close-on-click-modal="false"
                        :before-close="() => { validateTable = []; validateVisible = false }">
                        <el-table :data="validateTable" height="500" border>
                            <el-table-column prop="model" label="模块" width="180">
                            </el-table-column>
                            <el-table-column prop="object" label="项目">
                            </el-table-column>
                            <el-table-column prop="message" label="提示信息" width="180">
                            </el-table-column>
                        </el-table>
                    </el-dialog>
                    <el-dialog title="审核驳回" :visible.sync="disallowVisible" width="30%" :close-on-click-modal="false"
                        :before-close="() => disallowVisible = false">
                        <el-input v-model="disallow" type="textarea" placeholder="请输入驳回原因"
                            :autosize="{ minRows: 2, maxRows: 4 }" />
                        <span slot="footer">
                            <el-button @click="disallow = ''; disallowVisible = false">取 消</el-button>
                            <el-button type="primary" @click="clickDisallow">确 定</el-button>
                        </span>
                    </el-dialog>
                </div>
                <BindWristStrap v-model="isShowBindWristStrap" @close="closeWrist" />
                <BindPatient v-model="isShowBindPatient" @close="isShowBindPatient = false; detail()" />
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import * as types from '@/store/mutation-types'
import { mapGetters, mapMutations } from 'vuex'
import { AuthorityMixin, DictionariesMixin, FormValidateMixin } from '@/mixins/index'
export default {
    name: 'TraumaPcEdit',
    components: {
        BindWristStrap: () => import('./components/BindWristStrap.vue'), // 绑定腕带
        BindPatient: () => import('./components/BindPatient.vue'), // 绑定患者
        Phfa: () => import('./components/Phfa.vue'), // 院前急救
        Piat: () => import('./components/Piat.vue'), // 预检分诊
        Inspection: () => import('./components/Inspection.vue'), // 检验检查
        Hdat: () => import('./components/Hdat.vue'), // 院内诊疗
        PatientOutcome: () => import('./components/PatientOutcome.vue'), // 患者转归
        InvestigateReadPhfa: () => import('./components/investigate-read/Phfa.vue'), // 调阅 - 院前急救
        InvestigateReadPiat: () => import('./components/investigate-read/Piat.vue'), // 调阅 - 预检分诊
        InvestigateReadCheck: () => import('./components/investigate-read/Check.vue'), // 调阅 - 检查
        InvestigateReadInspect: () => import('./components/investigate-read/Inspect.vue'), // 调阅 - 检验
        InvestigateReadMedicate: () => import('./components/investigate-read/Medicate.vue') // 调阅 - 用药
    },
    mixins: [AuthorityMixin, DictionariesMixin, FormValidateMixin],
    provide() {
        return {
            registId: this.registId, // 病历ID
            saveFun: () => this.saveButton, // 保存
            registIdFun: () => this.registId, // 病历ID
            readonlyFun: () => this.isReadonly, // 只读
            emIdFun: () => this.form.patientMain.emId,
            nameFun: () => this.form.patientRegist.name, // 患者姓名
            tagInfoFun: () => { return this.form.patientRegist.rfTagId && this.form.patientRegist.rfTagName ? { tagId: this.form.patientRegist.rfTagId, tagName: this.form.patientRegist.rfTagName } : {} }, // 腕带编号
            visitTypeFun: () => this.form.patientMain.visitType, // 来院方式
            hospitalAreaFun: () => this.form.patientMain.hospitalArea, // 院区
        }
    },
    data() {
        return {
            isShowBindPatient: false, // 是否显示绑定患者
            isShowBindWristStrap: false, // 是否显示绑定腕带
            validateVisible: false, // 校验弹窗
            validateTable: [], // 校验字段列表
            disallowVisible: false, // 驳回弹窗
            disallow: '', // 驳回原因
            states: [
                { label: '提交', value: '1', message: '确认提交审核吗？', opType: '1' },
                { label: '通过', value: '2', message: '确认通过审核吗？', opType: '2' },
                { label: '存档', value: '3', message: '确认通过存档吗？', opType: '4' },
                { label: '上报', value: '4', message: '确认上报吗？', opType: '6' },
            ],
            saveButton: false, // 保存
            submitButton: false,// 提交
            timeAxis: [], // 时间轴数据
            form: { // 患者基础信息
                patientMain: {},
                patientRegist: {},
                admission: {}
            },
            activeTab: '',// 激活的Tab
        }
    },
    mounted() {
        this.detail()
        this.selectTimeAxis()
    },
    computed: {
        ...mapGetters(['piatDeath', 'synchronize']),
        // 是否只读
        isReadonly() {
            return !(this.AUTH_ADD && this.form.patientMain.status === '1')
        },
        // 病历ID
        registId() {
            return this.$route.query.registId
        },
        // 是否调阅
        isShowRead() {
            return this.$route.query.isShowRead ? true : false
        },
        // 是否无名氏
        isHasName() {
            return this.form.patientMain.status !== '1' || !!this.form.patientRegist.name
        },
        // 默认激活Tab
        activeName: {
            get() {
                //初始阶段,如果activeTab=''则获取tabs[0],否则判断tabs中是否包含activeTab
                let result = ''
                if (this.activeTab !== '') {
                    let tabObj = this.tabs.find(el => el.value === this.activeTab)
                    result = tabObj ? this.activeTab : this.tabs.length > 0 ? this.tabs[0].value : ''
                } else {
                    result = this.tabs.length > 0 ? this.tabs[0].value : ''
                }
                return result
            },
            set(val) {
                this.activeTab = val
            }
        },
        // Tab页签
        tabs() {
            let tabA = []
            if (['01', '02'].includes(this.form.patientMain.visitType) && this.AUTH_PHFA) {
                tabA.push({ label: '院前急救', value: 'Phfa', name: 'phfa', formFields: 'prehospital' })
            }
            if (this.AUTH_PIAT) {
                tabA.push({ label: '预检分诊', value: 'Piat', name: 'piat', formFields: 'admission' })
            }
            if (!this.piatDeath && this.AUTH_INSPECTION) {
                tabA.push({ label: '检验检查', value: 'Inspection', name: 'inspection', formFields: 'inspection' })
            }
            if (!this.piatDeath && this.AUTH_HDAT) {
                tabA.push({ label: '院内诊疗', value: 'Hdat', name: 'hdat', formFields: 'treatment' })
            }
            if (!this.piatDeath && this.AUTH_PATIENT_OUTCOME) {
                tabA.push({ label: '患者转归', value: 'PatientOutcome', name: 'patient-outcome', formFields: 'outcome' })
            }
            // 调阅Tab
            let tabB = ['01', '02'].includes(this.form.patientMain.visitType) ? [
                { label: '急救病历', value: 'InvestigateReadPhfa' },
                { label: '预检分诊', value: 'InvestigateReadPiat' },
                { label: '检查', value: 'InvestigateReadCheck' },
                { label: '检验', value: 'InvestigateReadInspect' },
                { label: '用药', value: 'InvestigateReadMedicate' }
            ] : [
                { label: '预检分诊', value: 'InvestigateReadPiat' },
                { label: '检查', value: 'InvestigateReadCheck' },
                { label: '检验', value: 'InvestigateReadInspect' },
                { label: '用药', value: 'InvestigateReadMedicate' }
            ]

            return this.isShowRead ? tabB : tabA
        },
    },
    methods: {
        ...mapMutations([types.SET_SYNCHRONIZE, types.SET_PIAT_DEATH, types.SET_RESCUE_ROOM, types.SET_OPERATING_ROOM]),
        closeWrist(val) {
            this.isShowBindWristStrap = false;
            if (val.unBind) {
                delete this.form.patientRegist.rfTagId
                delete this.form.patientRegist.rfTagName
            }
            if (val.wristInfo) {
                // 绑定腕带
                this.$set(this.form.patientRegist, 'rfTagId', val.wristInfo.rfTagId)
                this.$set(this.form.patientRegist, 'rfTagName', val.wristInfo.rfTagName)
            }
            // 抢救室
            if (val.rescueRoom) {
                this[types.SET_RESCUE_ROOM](val.rescueRoom)
            }
            // 手术室
            if (val.operatingRoom) {
                this[types.SET_OPERATING_ROOM](val.operatingRoom)
            }
        },
        clickRead() {
            // 调阅打开行新页签
            const { href } = this.$router.resolve({
                name: 'Edit',
                query: {
                    infoComingType: this.form.patientMain.infoComingType,
                    registId: this.registId,
                    isShowRead: true
                }
            })
            window.open(href, '_blank')
        },
        valideateAge(rule, value, callback) {
            // 校验年龄
            let result = true
            let message = ''
            switch (this.form.patientRegist.ageRange) {
                case '01':
                    if (value < 7 || value > 140) {
                        result = false
                        message = '请输入7-140之间的整数'
                    }
                    break;
                case '02':
                    if (value < 0 || value > 6) {
                        result = false
                        message = '请输入0-6之间的整数'
                    }
                    break;
                case '03':
                    if (value < 1 || value > 30) {
                        result = false
                        message = '请输入1-30之间的整数'
                    }
                    break;
                default:
                    break;
            }
            if (result) {
                callback()
            } else {
                callback(new Error(message))
            }
        },
        async saveOrSubmit(val) {
            // 保存或提交
            if (this.tabs.length > 0) {
                // 初始化更新参数
                let updateParam = {
                    ...this.form
                }
                // 处理年龄区间
                if (this.form.patientRegist.ageRange === '03') {
                    updateParam.patientRegist.ageDay = updateParam.patientRegist.age
                }
                // 获取Tab中的form并添加到updateParam
                for (let i = 0; i < this.tabs.length; i++) {
                    updateParam[this.tabs[i].formFields] = this.$refs.tabs.find(el => el.$el._prevClass === this.tabs[i].name).form
                }
                // 更新数据
                const res = await this.$api.updatePatient(updateParam)
                if (res.code === '000000') {
                    // 更新成功后查询时间轴
                    this.selectTimeAxis()
                    if (val === 0) {
                        this.$message({ type: 'success', message: '操作成功' })
                    } else {
                        // 提交校验
                        let obj = this.states.find(el => el.value === val)
                        this.$confirm(obj.message, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            let sign = true
                            // 提交校验
                            if (val === '1') {
                                // 校验基础信息,校验部分字段
                                this.$refs.form.validate((valid, error) => {
                                    if (valid) {
                                        // 通过
                                    } else {
                                        // 未通过
                                        let keyList = Object.keys(error)
                                        if (keyList.length > 0) {
                                            for (let key of keyList) {
                                                let formFieldObj = this.formFields.find(el => el.label === key)
                                                this.validateTable.push({
                                                    model: '基本信息',
                                                    object: formFieldObj ? formFieldObj.value : error[key][0].message,
                                                    message: formFieldObj ? error[key][0].message : '必填'
                                                })
                                            }
                                        }
                                    }
                                })
                                // 循环校验Tab
                                let no = true;
                                for (let j = 0; j < this.tabs.length; j++) {
                                    if (this.$refs.tabs[j].form.regNo) {
                                        no = false
                                    }
                                    if (this.$refs.tabs[j].form.admissionNo) {
                                        no = false
                                    }
                                    this.$refs.tabs.find(el => el.$el._prevClass === this.tabs[j].name).$refs.form.validate((valid, error) => {
                                        if (valid) {
                                            // 通过
                                        } else {
                                            // 未通过
                                            let keyList = Object.keys(error)
                                            if (keyList.length > 0) {
                                                for (let key of keyList) {
                                                    let formFieldObj = this.formFields.find(el => el.label === key)
                                                    this.validateTable.push({
                                                        model: this.tabs[j].label,
                                                        object: formFieldObj ? formFieldObj.value : error[key][0].message,
                                                        message: formFieldObj ? error[key][0].message : '必填'
                                                    })
                                                }
                                            }
                                        }
                                    })
                                    // 校验到最后一个Tab时修改标记
                                    if (j + 1 === this.tabs.length && this.validateTable.length > 0) {
                                        sign = false
                                    }
                                }
                                // 校验门诊号和住院号二选一
                                if (no) {
                                    sign = false
                                    this.validateTable.push({
                                        model: '预检分诊、患者转归',
                                        object: '门诊号和住院号任一不为空',
                                        message: '必填'
                                    })
                                }
                            }
                            if (!sign) {
                                // 弹窗显示校验失败字段信息
                                this.validateVisible = true
                            }
                            if (sign) {
                                // 更新表单状态
                                this.$api.submitApprove({
                                    registId: this.registId,
                                    opType: obj.opType
                                }).then(res => {
                                    if (res.code === '000000') {
                                        if (typeof res.body === 'string') {
                                            const messageList = res.body.split(';')
                                            if (messageList && messageList.length > 0) {
                                                let content = ''
                                                for (let i = 0; i < messageList.length; i++) {
                                                    content = `<span style='color: red;'>` + content + (i + 1) + ':' + messageList[i] + `</span><br/>`
                                                }
                                                this.$alert(content, '病历提交失败原因', {
                                                    showConfirmButton: false,
                                                    dangerouslyUseHTMLString: true,
                                                    callback: () => { }
                                                });
                                            }
                                        } else {
                                            this.$message({
                                                type: 'success',
                                                message: '操作成功'
                                            })
                                            this.detail()
                                        }
                                    }
                                })
                            }
                        }).catch(error => {
                            console.log('Edit.vue =>', error);
                        })
                    }
                } else {
                    this.$message({ type: 'error', message: '操作失败' })
                }
            }
        },
        clickDisallow() {
            // 驳回
            this.$api.submitApprove({
                remark: this.disallow,
                registId: this.registId,
                opType: this.form.patientMain.status === '2' ? '3' : '5'
            }).then(res => {
                if (res.code === '000000') {
                    this.$message({
                        type: 'success',
                        message: '操作成功'
                    })
                    this.disallowVisible = false
                    this.disallow = ''
                    this.detail()
                }
            })
        },
        genPatientName(val) {
            // 获取无名氏
            if (val === '1') {
                this.$api.genPatientName().then(res => {
                    if (res.code === '000000') {
                        this.form.patientRegist.name = res.body
                    }
                })
            }
        },
        selectTimeAxis() {
            // 查询时间轴
            this.$api.selectTimeAxis({
                registId: this.registId,
                sign: 0
            }).then(res => {
                if (res.code === '000000' && res.body.length > 0) {

                    for (let i = res.body.length - 1; i >= 0; i--) {
                        const curItem = res.body[i]
                        const [date, time] = curItem.value ? this.$moment(curItem.value).format('YYYY-MM-DD HH:mm').split(' ') : []
                        const isInSameDay =
                            this.$moment(res.body[i - 1]?.value).format('YYYY-MM-DD') === date
                        if (!isInSameDay || i === 0) {
                            // 在日期变化间隙插入日期分隔节点
                            res.body.splice(i, 0, { value: date })
                        }
                        curItem.value = time
                    }
                    this.timeAxis = res.body
                }
            })
        },
        detail() {
            // 详情
            this.$api.detail({
                registId: this.registId,
                types: ['card', 'piat']
            }).then(res => {
                if (res.code === '000000') {
                    this.form = {
                        ...this.form,
                        ...res.body,
                    }
                    // 是否死亡
                    if (this.form.admission.arriveEdIsDead === '1' || this.form.admission.arriveOsIsDead === '1') {
                        this[types.SET_PIAT_DEATH](true)
                    }
                    // 处理年龄区间
                    if (res.body.patientRegist.ageRange === '03') {
                        this.$set(this.form.patientRegist, 'age', res.body.patientRegist.ageDay)
                    }
                    // 处理emId
                    if (res.body.patientMain.emId) {
                        sessionStorage.setItem('emId', res.body.patientMain.emId)
                    }

                }
            })
        },
        synchrodata() {
            // 同步患者信息
            this.$api.synchrodata(this.registId).then(res => {
                if (res.code === '000000') {
                    this[types.SET_SYNCHRONIZE](!this.synchronize)
                }
            })
        }
    },
    watch: {
        synchronize() {
            // 监听同步
            this.detail()
            this.$message({
                type: 'success',
                message: '操作成功'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__nav-wrap {
    margin-bottom: -16px;
}

::v-deep .el-tabs__nav-wrap::after {
    position: static !important;
}

::v-deep .el-tabs__header {

    .el-tabs__active-bar {
        bottom: 12px;
    }

    .el-tabs__nav-next,
    .el-tabs__nav-prev {
        line-height: 70px;
    }

    .el-tabs__item {
        font-weight: 550;
        font-size: 18px;
        padding-top: 6px;
        height: 70px;
        line-height: 66px;
        color: #435372;

        &.is-active {
            color: #4b60fd;
        }
    }

    .el-tabs__item:last-child {
        margin-right: 0.8rem;
    }
}

::v-deep .el-tabs__content {
    height: 100%;
    overflow-y: scroll;
    overflow-x: visible;
    background-color: white;
    padding: 1px 1rem 5rem 1rem;
}

::v-deep .el-timeline-item {
    display: flex;
    min-height: 42px;
    padding-bottom: 0;

    &__tail {
        left: 43px;
    }

    &__dot {
        width: 88px;
        color: #435372;
        text-align: center;
        background: #fff;
    }

    &__wrapper {
        line-height: 32px;
        padding-left: 84px;
        width: 100%;
    }
}

.time-diff {
    font-size: 14px;
    width: 90%;

    .time-diff-item {
        border-radius: 5px;
        line-height: 1.6;
        background-color: #ECF5FF;
        color: #4b60fd;

        &+.time-diff-item {
            margin-top: 5px;
        }

        &.abnormal {
            color: rgb(255, 78, 78);
            background-color: #FEF0F0;
        }
    }
}

.dot {
    line-height: 1.8;

    &.is-date {
        font-size: 15px;
        font-weight: 550;
    }
}
</style>