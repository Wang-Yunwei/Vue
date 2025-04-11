<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="10">
                <el-input :value="scoreResult" placeholder="未评分" readonly />
            </el-col>
            <el-col :span="6">
                <el-button style="background-color: rgb(75,96,253);color: white;" @click="isShowScore = true">
                    评分
                </el-button>
            </el-col>
        </el-row>
        <el-dialog :title="scoreType === '3' ? 'GCS评分' : 'TI评分'" width="64rem" :visible.sync="isShowScore"
            :close-on-click-modal="false">
            <el-form ref="form" label-position="top" :model="form" label-width="50px" size="mini">
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="得分">
                            <el-col :span="14">
                                <el-input v-model="form.score" readonly />
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="结果">
                            <el-col :span="14">
                                <el-input v-model="form.result" readonly />
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="9">
                        <el-form-item label="评估时间">
                            <el-col :span="18">
                                <med-datetime v-model="form.gradeTime" readonly />
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="评估医生">
                            <el-col :span="14">
                                <el-input v-model="form.opBy" readonly />
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div>
                <el-collapse v-model="colValue">
                    <el-collapse-item v-for="(itemA, indexA) in list" :key="indexA" :title="itemA.name" :name="indexA">
                        <el-radio-group v-model="itemA.value" :disabled="isReadonly">
                            <el-radio v-for="(itemB, indexB) in itemA.childList" :key="indexB" :label="itemB.value"
                                @click.native.prevent=" isReadonly ? '' : clickRadio(indexA, itemB.value)">
                                {{ itemB.label }}
                            </el-radio>
                        </el-radio-group>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <div class="flex-c-c" style="margin-top: 0.3rem;" v-if="!isReadonly">
                <el-button @click="reset">重置</el-button>
                <el-button style="background-color: rgb(75,96,253); color: white;" @click="certainButt">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { DictionariesMixin } from '@/mixins/index'
export default {
    name: 'TraumaPcScore',
    inject: ['registId', 'readonlyFun'],
    mixins: [DictionariesMixin],
    props: {
        value: {
            type: Object,
            default: () => { }
        },
        scoreType: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isShowScore: false, // 是否显示评分页面
            form: {},
            list: []
        }
    },
    computed: {
        ...mapGetters(['user']),
        isReadonly() {
            // 是否只读
            return this.readonlyFun()
        },
        scoreResult() {
            // 评分结果
            return this.form.score && this.form.result ? this.form.score + '分 ' + this.form.result : ''
        },
        type() {
            // 评分类别
            return this.scoreType === '3' ? 'GCS_' : 'TI_'
        },
        colValue() {
            const result = []
            let i = 0
            this.list.forEach(() => {
                result.push(i++)
            })
            return result
        }
    },
    methods: {
        reset() {
            // 重置
            this.form = { opBy: this.user.name }
            this.list = this.dicCategory(this.type)
        },
        certainButt() {
            // 确定按钮
            if (this.form.gradeTime) {
                const gradeDetail = this.list
                    .filter(el => el.value.length !== 0)
                    .map(el => {
                        return { code: el.code, value: el.value }
                    })
                this.form.gradeDetail = JSON.stringify(gradeDetail)
                this.form.gradeType = this.scoreType
                this.form.registId = this.registId
                this.$api.scoreUpdate(this.form).then(res => {
                    if (res.code === '000000') {
                        this.$emit('input', this.form)
                        this.isShowScore = false
                    }
                })
            } else {
                this.$api.scoreDelete(this.value.id).then(res => {
                    if (res.code === '000000') {
                        this.$emit('input', {})
                        this.isShowScore = false
                    }
                })
            }
        },
        clickRadio(valA, valB) {
            // 评分时间
            this.$set(this.form, 'gradeTime', this.$moment().format(this.DATE_TIME_FORMAT.DATE_MINUTE))
            // 判断是否反选
            this.list[valA].value = this.list[valA].value === valB ? '' : valB
            // 评分,分值总和
            const sum = this.list.filter(el => el.value !== '').map(item => item.value).reduce((pre, cur, index, arr) => {
                return pre + Number(cur)
            }, 0)
            this.$set(this.form, 'score', sum)
            // 先清除评分结果
            this.$set(this.form, 'result', '')
            // 评分结果
            if (this.type === 'TI_') {
                // TI评分
                this.dicListByKey('TIR_0006').forEach(el => {
                    if (el.value.includes('<')) {
                        if (this.form.score < el.value.split('<')[1]) {
                            this.$set(this.form, 'result', el.label)
                        }
                    } else if (el.value.includes('>')) {
                        if (this.form.score > el.value.split('>')[1]) {
                            this.$set(this.form, 'result', el.label)
                        }
                    } else {
                        this.$set(this.form, 'result', el.label)
                    }
                })
            } else {
                // GCS评分
                this.dicListByKey('GCSR_0004').forEach(el => {
                    if (el.value.includes('-')) {
                        const range = el.value.split('-')
                        if (
                            this.form.score >= range[0] &&
                            range[1] >= this.form.score
                        ) {
                            this.$set(this.form, 'result', el.label)
                        }
                    } else {
                        if (el.value == this.form.score) {
                            this.$set(this.form, 'result', el.label)
                        }
                    }
                })
            }
        }
    },
    watch: {
        value: {
            immediate: true,
            handler(val) {
                if (val && Object.keys(val).length > 0) {
                    this.form = val
                    this.list = this.dicCategory(this.type)
                    // JSON转Object
                    if (this.form.gradeDetail) {
                        const gradeDetail = JSON.parse(this.form.gradeDetail)
                        gradeDetail.forEach(elA => {
                            this.list.forEach(elB => {
                                if (elA.code === elB.code) {
                                    elB.value = elA.value
                                }
                            })
                        })
                    }
                } else {
                    this.$set(this.form, 'opBy', this.user.name)
                    this.list = this.dicCategory(this.type)
                }
            }
        }
    }
}

</script>

<style lang="scss" scoped></style>