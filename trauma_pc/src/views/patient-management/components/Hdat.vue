<template>
    <div class="hdat">
        <el-form ref="form" label-position="top" :model="form" label-width="50px" size="mini">
            <med-subtitle>ISS-AIS评分</med-subtitle>
            <el-row>
                <el-col :span="6">
                    <el-form-item prop="classification" :rules="[{ required: true, message: '请选择ISS-AIS评分', trigger: 'blur' }]">
                        <template #label>
                            病人分类
                            <el-tooltip effect="light" placement="right" content="根据ISS-AIS评分结果自动判断，ISS≥16分或单部位损伤AIS≥3分为严重创伤。">
                                <i class="iconfont icon-icon_tishi" />
                            </el-tooltip>
                        </template>
                        <el-col :span="14">
                            <el-input v-model="form.classification" placeholder="未知" readonly />
                        </el-col>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="5" style="margin-bottom: 0.6rem;">
                    <div class="iss-score-button" @click=" isReadonly ? '' : isShowIssAis = true">
                        <img src="@/assets/images/icon-评分.png" style="margin: 3rem 0 1rem 0;" />
                        <div style="margin-bottom: 2.8rem;">点击开始评分</div>
                    </div>
                </el-col>
                <el-col :span="5" v-for="(item, index) in form.issGradeList" :key="index" style="margin-bottom: 0.7rem;">
                    <div class="iss-score-card">
                        <div style="display: flex;">
                            <div class="score">
                                ISS评分
                            </div>
                            <div class="score-result" :style="`background-color: ${issAisResultColor[item.result]} `">
                                {{ item.result }}
                            </div>
                        </div>
                        <div style="padding-right:0.8rem;">
                            <div style="margin: 0.5rem 0;">
                                <span style="color: rgb(176,177,180);">
                                    {{ item.gradeTime }}
                                </span>
                            </div>
                            <div class="flex-c-b">
                                <div>
                                    <span style="font-weight: 500; margin-right: 0.3rem;">
                                        ISS评分
                                    </span>
                                    <span style="font-weight: 500;font-size: 1.2rem;">
                                        {{ item.score }}
                                    </span>
                                </div>
                                <div>
                                    <span style="font-weight: 500; margin-right: 0.3rem;">
                                        AIS最大值
                                    </span>
                                    <span style="font-weight: 500;font-size: 1.2rem;">
                                        {{ item.max }}
                                    </span>
                                </div>
                            </div>
                            <div style="text-align: right;margin: 1rem 0;">
                                <el-button @click="issAisClick('删除', item, index)" :disabled="isReadonly">删除</el-button>
                                <el-button style="background-color: rgb(75,96,253);color: white;" @click="issAisClick('查看', item)">
                                    查看
                                </el-button>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <med-subtitle>抢救措施</med-subtitle>
            <el-row :gutter="20">
                <el-col :span="20">
                    <el-form-item label="是否抢救" prop="isRescue" :rules="[{ required: true, message: '请选择是否抢救', trigger: 'blur' }]">
                        <el-radio-group v-model="form.isRescue" :disabled="isReadonly">
                            <el-radio-button v-for="(item, index) in WHETHER" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'isRescue')">
                                {{ item.label }}
                            </el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <div v-if="form.isRescue === '1'">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="抢救措施">
                            <el-checkbox-group v-model="rescueMeasures" :disabled="isReadonly" @change="handleCheckBox(rescueMeasures, 'rescueMeasures')">
                                <el-checkbox v-for="(item, index) in RESCUE_0001" :key="index" :label="item.value">
                                    {{ item.label }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="(rescueMeasures || []).includes('01')">
                    <el-col :span="6">
                        <el-form-item label="提出放置时间">
                            <el-col :span="18">
                                <med-datetime v-model="form.applyPutTime" :disabled="isReadonly" v-clear />
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="成功放置时间">
                            <el-col :span="18">
                                <med-datetime v-model="form.putFinishTime" :disabled="isReadonly" v-clear />
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="(rescueMeasures || []).includes('02')">
                    <el-col :span="6">
                        <el-form-item label="申请输血时间" prop="applyBloodTime" :rules="[{ required: true, message: '请选择申请输血时间', trigger: 'blur' }]">
                            <el-col :span="18">
                                <med-datetime v-model="form.applyBloodTime" :disabled="isReadonly" v-clear />
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="执行输血时间" prop="executeBloodTime" :rules="[{ required: true, message: '请选择执行输血时间', trigger: 'blur' }]">
                            <el-col :span="18">
                                <med-datetime v-model="form.executeBloodTime" :disabled="isReadonly" v-clear />
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="急诊输血等待时间 (分钟)" required>
                            <el-col :span="14">
                                <el-input v-model="waitingTime" placeholder="自动计算" readonly />
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="(rescueMeasures || []).includes('03')">
                    <el-col :span="6">
                        <el-form-item label="提出建立时间" prop="applyEstablishTime" :rules="[{ required: true, message: '请选择提出建立时间', trigger: 'blur' }]">
                            <el-col :span="18">
                                <med-datetime v-model="form.applyEstablishTime" :disabled="isReadonly" v-clear />
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="成功建立时间" prop="establishFinishTime" :rules="[{ required: true, message: '请选择成功建立时间', trigger: 'blur' }]">
                            <el-col :span="18">
                                <med-datetime v-model="form.establishFinishTime" :disabled="isReadonly" v-clear />
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="人工气道建立时间 (分钟)" required>
                            <el-col :span="14">
                                <el-input v-model="buildTime" placeholder="自动计算" readonly />
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="(rescueMeasures || []).includes('04')">
                    <el-col :span="6">
                        <el-form-item label="提出手术医嘱时间" prop="surgerAdviceTime" :rules="[{ required: true, message: '请选择提出手术医嘱时间', trigger: 'blur' }]">
                            <el-col :span="18">
                                <med-datetime v-model="form.surgerAdviceTime" :disabled="isReadonly" v-clear />
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="开始手术时间" prop="surgerStartTime" :rules="[{ required: true, message: '请选择开始手术时间', trigger: 'blur' }]">
                            <el-col :span="18">
                                <med-datetime v-model="form.surgerStartTime" :disabled="isReadonly" v-clear />
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="术前准备时间 (分钟)" required>
                            <el-col :span="14">
                                <el-input v-model="readinessTime" placeholder="自动计算" readonly />
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="(rescueMeasures || []).includes('05')">
                    <el-col :span="6">
                        <el-col :span="18">
                            <el-form-item label="开始使用时间">
                                <med-datetime v-model="form.breathingStartTime" :disabled="isReadonly" v-clear />
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col :span="6">
                        <el-col :span="18">
                            <el-form-item label="结束使用时间">
                                <med-datetime v-model="form.breathingEndTime" :disabled="isReadonly" v-clear />
                            </el-form-item>
                        </el-col>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="呼吸机使用时长">
                            <el-col :span="14">
                                <el-input v-model="useVentilatorDuration" placeholder="自动计算" :readonly="isReadonly" v-clear />
                            </el-col>
                            <span style="padding-left: 1rem;">小时</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="是否发生了呼吸机相关肺炎">
                            <el-radio-group v-model="form.isPneumonia" :disabled="isReadonly">
                                <el-radio v-for="(item, index) in WHETHER" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'isPneumonia')">
                                    {{ item.label }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="抢救说明">
                        <el-input v-model="form.rescueInfo" placeholder="请输入抢救说明" type="textarea" autosize :maxlength="100" />
                    </el-form-item>
                </el-col>
            </el-row>
            <med-subtitle>手术记录</med-subtitle>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="是否到达手术室">
                        <el-radio-group v-model="form.isArriveSurgerRoom" :disabled="isReadonly">
                            <el-radio-button v-for="(item, index) in WHETHER" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'isArriveSurgerRoom')">
                                {{ item.label }}
                            </el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="form.isArriveSurgerRoom === '1'">
                <el-col :span="6">
                    <el-form-item label="到达手术室时间" v-if="form.isArriveSurgerRoom === '1'">
                        <el-col :span="18">
                            <med-datetime v-model="form.arriveSurgerRoomTime" :disabled="isReadonly" v-clear />
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="离开手术室时间" v-if="form.isArriveSurgerRoom === '1'">
                        <el-col :span="18">
                            <med-datetime v-model="form.leaveSurgerRoomTime" :disabled="isReadonly" v-clear />
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="提出手术医嘱时间" >
                        <el-col :span="18">
                            <med-datetime v-model="form.surgerAdviceTime" :disabled="isReadonly" v-clear />
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="开始手术时间">
                        <el-col :span="18">
                            <med-datetime v-model="form.surgerStartTime" :disabled="isReadonly" v-clear />
                        </el-col>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <IssAis v-model="isShowIssAis" :is-show="isShowIssAis" :dto="issAisDto" :readonly="issReadonly" @close="closeIssAis" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { DictionariesMixin } from '@/mixins/index'
export default {
    name: 'TraumaPcHdat',
    components: {
        IssAis: () => import('./IssAis.vue')
    },
    inject: ['registId', 'readonlyFun'],
    mixins: [DictionariesMixin],
    data() {
        return {
            isShowIssAis: false,
            issReadonly: false,
            issAisResult: '',
            issAisDto: {},
            rescueMeasures: [],
            form: {
                issGradeList: []
            }
        }
    },
    mounted() {
        this.detail()
    },
    computed: {
        ...mapGetters(['synchronize', 'operatingRoom']),
        // 使用呼吸机时长
        useVentilatorDuration() {
            let result = this.computedTime(this.form.breathingEndTime, this.form.breathingStartTime, 'hh')
            return result > 0 ? result.toFixed(2) : result
        },
        // 是否只读
        isReadonly() {
            return this.readonlyFun()
        },
        // 急诊输血等待时间 (分钟)
        waitingTime() {
            return this.computedTime(this.form.executeBloodTime, this.form.applyBloodTime, 'mm')
        },
        // 人工气道建立时间 (分钟)
        buildTime() {
            return this.computedTime(this.form.establishFinishTime, this.form.applyEstablishTime, 'mm')
        },
        // 术前准备时间 (分钟)
        readinessTime() {
            return this.computedTime(this.form.surgerStartTime, this.form.surgerAdviceTime, 'mm')
        }
    },
    methods: {
        clickRadio(valA, valB) {
            // radio反选
            this.$set(this.form, valB, this.form[valB] === valA ? '' : valA)
        },
        issAisClick(flag, val, index) {
            // 删除ISS-AIS评分
            switch (flag) {
                case '查看':
                    this.issAisDto = val
                    this.issReadonly = true
                    this.isShowIssAis = true
                    break
                case '删除':
                    this.$confirm('确认删除当前ISS评分结果吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        if (val.id) {
                            this.$api.scoreDelete(val.id).then(res => {
                                if (res.code === '000000') {
                                    this.form.issGradeList.splice(index, 1)
                                }
                            })
                        } else {
                            this.form.issGradeList.splice(index, 1)
                        }
                    }).catch(() => { })
                    break
            }
        },
        handleCheckBox(val, field) {
            this.$set(this.form, field, val.toString())
        },
        detail() {
            // 详情
            this.$api.detail({
                registId: this.registId,
                types: ['hdat']
            }).then(res => {
                if (res.code === '000000') {
                    this.form = {
                        ...this.form,
                        ...res.body.treatment
                    }
                    // 抢救措施
                    if (this.form.rescueMeasures) this.rescueMeasures = this.form.rescueMeasures.split(',')
                }
            })
        },
        closeIssAis(obj) {
            this.isShowIssAis = false
            if (!this.issReadonly && obj) {
                this.$set(obj, 'registId', this.form.registId)
                this.form.issGradeList.unshift(obj)
            }
            this.issReadonly = false
        }
    },
    watch: {
        operatingRoom(val) {
            // 腕带导入时间
            if (val.startTime || val.endTime) {
                this.$set(this.form, 'isArriveSurgerRoom', '1')
            }
            if (val.startTime) {
                this.$set(this.form, 'arriveSurgerRoomTime', val.startTime)
            }
            if (val.endTime) {
                this.$set(this.form, 'leaveSurgerRoomTime', val.endTime)
            }
        },
        'form.isRescue'(val) {
            // 监听是否抢救
            if (val === '0') {
                this.rescueMeasures = []
            }
        },
        synchronize() {
            // 同步数据
            this.detail()
        },
        'form.issGradeList': {
            handler() {
                this.$set(this.form, 'classification', this.form.issGradeList.filter(el => el.gradeTime !== null).sort((a, b) => {
                    return a.gradeTime < b.gradeTime ? 1 : -1
                })[0]?.result)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.hdat{
    margin-block-end: 2rem;
}
.iss-score-button {
    text-align: center;
    border: 2px dashed rgb(229, 229, 229);
    border-radius: 0.3rem;
}
.iss-score-card {
    box-shadow: 0 1px 4px 0 rgba(83, 99, 248, 0.15), 0 0 10px 0 rgba(83, 99, 248, 0.15);
    border-radius: 0.3rem;
    overflow: hidden;
    padding-left: 1rem;

    .score {
        margin-top: 1rem;
        flex: 2;
        font-weight: 500;
        font-size: 1.2rem;
    }

    .score-result {
        flex: 1;
        text-align: center;
        border-radius: 0 0.3rem;
        line-height: 2.4rem;
        color: white;
    }
}
</style>