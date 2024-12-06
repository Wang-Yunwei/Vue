<template>
    <div class="inspection">
        <el-form ref="form" label-position="top" :model="form" label-width="50px" size="mini">
            <med-subtitle>专科评估</med-subtitle>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-form-item label="院内TI创伤评分" prop="tiGrade" :rules="[{ required: true, message: '请选择院内TI创伤评分', trigger: 'blur' }]">
                        <Score v-model="form.tiGrade" score-type="2" @input="(val) => $set(form, 'tiGrade', val)" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="GCS评分" prop="gcsGrade" :rules="[{ required: true, message: '请选择GCS评分', trigger: 'blur' }]">
                        <Score v-model="form.gcsGrade" score-type="3" @input="(val) => $set(form, 'gcsGrade', val)" />
                    </el-form-item>
                </el-col>
            </el-row>
            <med-subtitle>检验检查</med-subtitle>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-form-item label="是否检查" prop="isInspect" :rules="[{ required: true, message: '请选择是否检查', trigger: 'blur' }]">
                        <el-radio-group v-model="form.isInspect" :disabled="isReadonly">
                            <el-radio-button v-for="(item, index) in WHETHER" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'isInspect')">
                                {{ item.label }}
                            </el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="18">
                    <el-form-item label="检查类型" v-if="form.isInspect === '1'">
                        <el-checkbox-group v-model="inspectType" :disabled="isReadonly" @change="handleCheckBox(inspectType, 'inspectType')">
                            <el-checkbox v-for="(item, index) in INSPECT_0001" :key="index" :label="item.value" v-clear>
                                {{ item.label }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <div v-if="(inspectType || []).includes('01')">
                    <el-col :span="6">
                        <el-form-item label="全身快速CT完成时间" prop="bodyCtFinishTime" :rules="[{ required: true, message: '请选择全身快速CT完成时间', trigger: 'blur' }]">
                            <el-col :span="18">
                                <med-datetime v-model="form.bodyCtFinishTime" :disabled="isReadonly" v-clear />
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <el-form-item label="扫描部位">
                            <el-checkbox-group v-model="scanSite" :disabled="isReadonly" @change="handleCheckBox(scanSite, 'scanSite')">
                                <el-checkbox v-for="(item, index) in SCAN_SITE" :key="index" :label="item.value">
                                    {{ item.label }}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                </div>
                <div v-if="(inspectType || []).includes('02')">
                    <el-col :span="6">
                        <el-form-item label="胸片X片完成时间" prop="chestXFinishTime" :rules="[{ required: true, message: '请选择胸片X片完成时间', trigger: 'blur' }]">
                            <el-col :span="18">
                                <med-datetime v-model="form.chestXFinishTime" :disabled="isReadonly" v-clear />
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="3">
                        <el-form-item label="胸腔出血" prop="chestBleeding" :rules="[{ required: true, message: '请选择胸腔出血', trigger: 'blur' }]">
                            <el-radio-group v-model="form.chestBleeding" :disabled="isReadonly">
                                <el-radio-button v-for="(item, index) in [{ label: '有', value: '1' }, { label: '无', value: '0' }]" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'chestBleeding')">
                                    {{ item.label }}
                                </el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </div>
            </el-row>
            <el-row :gutter="20" v-if="(inspectType || []).includes('03')">
                <el-col :span="6">
                    <el-form-item label="骨盆X片完成时间" prop="pelvisXFinishTime" :rules="[{ required: true, message: '请选择骨盆X片完成时间', trigger: 'blur' }]">
                        <el-col :span="18">
                            <med-datetime v-model="form.pelvisXFinishTime" :disabled="isReadonly" v-clear />
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="盆腔出血" prop="pelvisBleeding" :rules="[{ required: true, message: '请选择盆腔出血', trigger: 'blur' }]">
                        <el-radio-group v-model="form.pelvisBleeding" :disabled="isReadonly">
                            <el-radio-button v-for="(item, index) in [{ label: '有', value: '1' }, { label: '无', value: '0' }]" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'pelvisBleeding')">
                                {{ item.label }}
                            </el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="盆骨骨折" prop="pelvisFracture" :rules="[{ required: true, message: '请选择盆骨骨折', trigger: 'blur' }]">
                        <el-radio-group v-model="form.pelvisFracture" :disabled="isReadonly">
                            <el-radio-button v-for="(item, index) in [{ label: '有', value: '1' }, { label: '无', value: '0' }]" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'pelvisFracture')">
                                {{ item.label }}
                            </el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20" v-if="(inspectType || []).includes('04')">
                <el-col :span="6">
                    <el-form-item label="FAST完成时间" prop="fastFinishTime" :rules="[{ required: true, message: '请选择FAST完成时间', trigger: 'blur' }]">
                        <el-col :span="18">
                            <med-datetime v-model="form.fastFinishTime" :disabled="isReadonly" v-clear />
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="FAST胸腹盆腔出血" prop="fastChestBleeding" :rules="[{ required: true, message: '请选择FAST胸腹盆腔出血', trigger: 'blur' }]">
                        <el-radio-group v-model="form.fastChestBleeding" :disabled="isReadonly">
                            <el-radio-button v-for="(item, index) in [{ label: '有', value: '1' }, { label: '无', value: '0' }]" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'fastChestBleeding')">
                                {{ item.label }}
                            </el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="6" v-if="form.fastChestBleeding === '1'">
                    <el-form-item label="FAST出血部位" prop="fastBleedingPart" :rules="[{ required: true, message: '请选择FAST出血部位', trigger: 'blur' }]">
                        <el-checkbox-group v-model="fastBleedingPart" :disabled="isReadonly" @change="handleCheckBox(fastBleedingPart, 'fastBleedingPart')">
                            <el-checkbox v-for="(item, index) in FAST_BLEEDING_PART" :key="index" :label="item.value">
                                {{ item.label }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="(inspectType || []).includes('05')" :gutter="20">
                <el-col :span="6">
                    <el-form-item label="其他X片类型">
                        <el-col :span="14">
                            <el-input v-model="form.otherXType" :readonly="isReadonly" v-clear :maxlength="20" />
                        </el-col>
                    </el-form-item>
                </el-col>
                <el-col v-if="(inspectType || []).includes('05')" :span="6">
                    <el-form-item label="其他X片类型完成时间">
                        <el-col :span="18">
                            <med-datetime v-model="form.otherXFinishTime" :disabled="isReadonly" v-clear />
                        </el-col>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-form-item label="是否检验" prop="isOtherInspect" :rules="[{ required: true, message: '请选择是否检验', trigger: 'blur' }]">
                        <el-radio-group v-model="form.isOtherInspect" :disabled="isReadonly">
                            <el-radio-button v-for="(item, index) in WHETHER" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'isOtherInspect')">
                                {{ item.label }}
                            </el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="9">
                    <el-form-item label="检验类型" v-if="form.isOtherInspect === '1'">
                        <el-checkbox-group v-model="otherInspectType" :disabled="isReadonly" @change="handleCheckBox(otherInspectType, 'otherInspectType')">
                            <el-checkbox v-for="(item, index) in EXAMINE_0001" :key="index" :label="item.value">{{
            item.label }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
                <el-col :span="6" v-if="otherInspectType.includes('01')">
                    <el-col :span="14">
                        <el-form-item label="血红蛋白" prop="hemoglobin" :rules="[{ required: true, message: '请输入血红蛋白', trigger: 'blur' }]">
                            <el-input v-model="form.hemoglobin" :readonly="isReadonly" oninput="if(value){value=value.replace(/^\D*(\d*(?:\.\d{0,1})?).*$/g, '$1')}">
                                <template slot="append">g/L</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="3" v-if="otherInspectType.includes('02')">
                    <el-form-item label="凝血功能是否正常" prop="clottingNormal" :rules="[{ required: true, message: '请选择凝血功能是否正常', trigger: 'blur' }]">
                        <el-radio-group v-model="form.clottingNormal" :disabled="isReadonly">
                            <el-radio-button v-for="(item, index) in [{ label: '正常', value: '1' }, { label: '异常', value: '0' }]" :key="index" :label="item.value" @click.native.prevent="clickRadio(item.value, 'clottingNormal')">
                                {{ item.label }}
                            </el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="检查检验说明">
                        <el-input v-model="form.inspectInfo" placeholder="请输入检查检验说明" type="textarea" autosize :readonly="isReadonly" :maxlength="100" />
                    </el-form-item>
                </el-col>
            </el-row>
            <med-subtitle>入院诊断</med-subtitle>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="入院诊断">
                        <el-input v-model="form.diagnosis" placeholder="请输入入院诊断" type="textarea" autosize :readonly="isReadonly" @blur="blurDiagnosis" :maxlength="100" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
import * as types from '@/store/mutation-types'
import { mapGetters, mapMutations } from 'vuex'
import { DictionariesMixin } from '@/mixins/index'
export default {
    name: 'TraumaPcInspection',
    components: {
        Score: () => import('./Score.vue')
    },
    inject: ['registId', 'readonlyFun'],
    mixins: [DictionariesMixin],
    data() {
        return {
            fastBleedingPart: [],// FAST出血部位
            scanSite: [],// 扫描部位
            scoreTitle: '', // 评分标题
            inspectType: [], // 检查类型
            otherInspectType: [],// 检验类型
            form: {}
        }
    },
    mounted() {
        this.detail()
    },
    computed: {
        ...mapGetters(['synchronize']),
        isReadonly() {
            return this.readonlyFun()
        },
    },
    methods: {
        ...mapMutations([types.SET_ADMITTING_DIAGNOSIS]),
        blurDiagnosis() {
            // 失焦触发入院诊断
            this[types.SET_ADMITTING_DIAGNOSIS](this.form.diagnosis)
        },
        clickRadio(valA, valB) {
            // radio反选
            this.$set(this.form, valB, this.form[valB] === valA ? '' : valA)
        },
        handleCheckBox(val, field) {
            this.$set(this.form, field, val.toString())
        },
        detail() {
            // 详情
            this.$api.detail({
                registId: this.registId,
                types: ['inspection']
            }).then(res => {
                if (res.code === '000000') {
                    this.form = {
                        ...res.body.inspection
                    }
                    // 检查类型
                    if (this.form.inspectType) this.inspectType = this.form.inspectType.split(',')
                    // 检验类型
                    if (this.form.otherInspectType) this.otherInspectType = this.form.otherInspectType.split(',')
                    // ti评分
                    if (this.form.tiGrade && typeof (this.form.tiGrade.score) !== 'undefined') this.$set(this.form, 'tiId', this.form.tiGrade.score + '分 ' + this.form.tiGrade.result)
                    // gcs评分
                    if (this.form.gcsGrade && typeof (this.form.gcsGrade.score) !== 'undefined') this.$set(this.form, 'gcsId', this.form.gcsGrade.score + '分 ' + this.form.gcsGrade.result)
                    // 扫描部位
                    if (this.form.scanSite) this.scanSite = this.form.scanSite.split(',')
                    // FAST出血部位
                    if (this.form.fastBleedingPart) this.fastBleedingPart = this.form.fastBleedingPart.split(',')
                }
            })
        },
    },
    watch: {
        'form.diagnosis'() {
            // 监听入院诊断

        },
        'form.isOtherInspect'(val) {
            // 监听是否检验
            if (val !== '1') {
                this.otherInspectType = []
            }
        },
        'form.isInspect'(val) {
            // 监听是否检查
            if (val !== '1') {
                this.inspectType = []
            }
        },
        synchronize() {
            // 同步数据
            this.detail()
        }
    }
}

</script>

<style lang="scss" scoped></style>