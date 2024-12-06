<template>
    <el-dialog :title="isShowAdd ? '基本信息' : '新增病历'" width="45%" :visible.sync="value" :before-close="handleClose" :close-on-click-modal="false">
        <div v-if="!isShowAdd">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-radio-group v-model="searchParam.type" fill="rgb(75, 96, 253)" size="mini" @input="changeType">
                        <el-radio-button v-for="(item, index) in types" :key="index" :label="item.value">
                            {{ item.label }}
                        </el-radio-button>
                    </el-radio-group>
                </el-col>
                <el-col :span="4">
                    <el-button size="mini" style="background-color: rgb(75,96,253);color: white;margin-left: 1rem;" @click="isShowAdd = true">
                        空白病历
                    </el-button>
                </el-col>
            </el-row>
            <div style="margin: 0.6rem 0;">
                <el-row :gutter="10">
                    <el-col :span="5">
                        <el-select v-model="searchParam.hospitalArea" placeholder="请选择院区" disabled size="mini" @change="searchParam.hospitalAndArea = hospitalId + '_' + searchParam.hospitalArea">
                            <el-option v-for="(item, index) in hospitalAreaList" :key="index" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-col>
                    <el-col :span="7">
                        <el-date-picker v-model="dateTimes" type="daterange" start-placeholder="开始日期" range-separator="至" end-placeholder="结束日期" :picker-options="pickerOptions" @blur="handleTimeInterval" unlink-panels size="mini" style="width: auto;" />
                    </el-col>
                    <el-col :span="5">
                        <el-input v-model="searchParam.name" placeholder="请输入姓名" size="mini" :maxlength="20" />
                    </el-col>
                    <el-col :span="3">
                        <el-button icon="el-icon-search" size="mini" style="color: #4b60fd;border-color: #c9cffe;background-color: #edefff" @click="changeType">
                            查询
                        </el-button>
                    </el-col>
                    <el-col :span="3">
                        <el-button icon="el-icon-check" size="mini" style="color: white;border-color: rgb(19,206,102);background-color: rgb(19,206,102)" @click="handleRow" v-if="isShowButton">
                            确定
                        </el-button>
                    </el-col>
                </el-row>
            </div>
            <el-table :data="list" height="250" size="mini" border highlight-current-row @row-click="selectRow">
                <el-table-column type="index" width="50" />
                <el-table-column :prop="searchParam.type === '2' ? 'no' : 'displayNo'" :label="labelNo" />
                <el-table-column prop="name" label="患者姓名" />
                <el-table-column label="性别" width="80">
                    <template slot-scope="scope">
                        {{ dicLabelByValue(scope.row.gender, 'GENDER_0001') }}
                    </template>
                </el-table-column>
                <el-table-column label="年龄">
                    <template slot-scope="scope">
                        {{ scope.row.ageDesc ? scope.row.ageDesc : '未知' }}
                    </template>
                </el-table-column>
                <el-table-column prop="time" :label="labelTime" />
            </el-table>
            <el-pagination layout="prev, pager, next, total, sizes" :page-size="searchParam.pageSize" :current-page="searchParam.pageNo" :total="searchParam.total" :page-sizes="[10, 20, 30, 100]" @current-change="handleCurrentChange" @size-change="handleSizeChange" />
        </div>
        <div v-else style="margin-left: 4rem;">
            <el-form ref="form" :model="form" label-width="auto">
                <el-form-item label="姓名" prop="name" :rules="[
        { required: true, message: '请输入患者姓名', trigger: 'input' }
    ]">
                    <el-input v-model="form.name" :maxlength="20" style="width: 12.6rem;" />
                    &nbsp;
                    <el-checkbox v-model="form.hasName" true-label="1" false-label="0" :disabled="isHasName" @change="genPatientName">无名氏</el-checkbox>
                </el-form-item>
                <el-form-item label="性别" prop="gender" :rules="[{ required: true, message: '请选择性别', trigger: 'blur' }]">
                    <el-radio-group v-model="form.gender" fill="rgb(75,96,253)">
                        <el-radio-button v-for="(item, index) in GENDER_0001" :key="index" :label="item.value">{{ item.label
                            }}</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="身份证号" prop="idNumber" :rules="[{ validator: validateIdNumber, trigger: 'blur' }]">
                    <el-input v-model="form.idNumber" placeholder="请输入身份证号" style="width: 12.6rem;" @input="inputIdNumber" :maxlength="18" />
                </el-form-item>
                <el-form-item label="年龄区间" prop="ageRange" :rules="[{ required: true, message: '请选择年龄区间', trigger: 'blur' }]">
                    <el-radio-group v-model="form.ageRange" fill="rgb(75,96,253)" @input="changeAgeRange">
                        <el-radio-button v-for="(item, index) in AGE_0001" :key="index" :label="item.value">{{ item.label
                            }}</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="form.ageRange" label="年龄" required>
                    <el-col :span="11">
                        <el-form-item prop="age" :rules="[form.ageRange === '01' ? { type: 'number', min: 7, max: 140, message: '请输入7-140之间的整数' } : form.ageRange === '02' ? { type: 'number', min: 0, max: 6, message: '请输入0-6之间的整数' } : { type: 'number', min: 1, max: 30, message: '请输入1-30之间的整数' }]">
                            <el-input v-model.number="form.age" :placeholder="form.ageRange === '02' ? '请填写' : '请填写年龄'" :validate-event="false" style="width: 10rem;" :maxlength="3">
                                <template slot="append">{{ form.ageRange === '03' ? '天' : '岁' }} </template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="ageMonth" :rules="[{ type: 'number', min: 0, max: 12, message: '请输入0-12之间的整数' }]">
                            <el-input v-if="form.ageRange === '02'" v-model.number="form.ageMonth" placeholder="请填写" :validate-event="false" style="width: 10rem;" :maxlength="3">
                                <template slot="append">月</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="来院方式" prop="visitType" :rules="[{ required: true, message: '请选择来院方式' }]">
                    <el-radio-group v-model="form.visitType" fill="rgb(75,96,253)">
                        <el-radio-button v-for="(item, index) in VISIT_0001" :key="index" :label="item.value">
                            {{ item.label }}
                        </el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label='其他来院方式' v-if="form.visitType === '05'">
                    <el-col :span="10">
                        <el-input v-model="form.visitTypeOther" :maxlength="100" />
                    </el-col>
                </el-form-item>
                <el-form-item label="院区" :rules="[{ required: true }]">
                    <el-input :placeholder="elInputPlaceholder" style="width: 7rem;" disabled />
                </el-form-item>
                <el-form-item>
                    <el-button style="background-color: rgb(75,96,253); color: white;" @click="buildDocument">建档
                    </el-button>
                    <el-button @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-dialog>
</template>

<script>
import { DictionariesMixin } from '@/mixins/index'
export default {
    name: 'TraumaPcAdd',
    inject: ['hospitalAreaFun'],
    mixins: [DictionariesMixin],
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    directives: {
        clear: {
            // 卸载组件时自动清除v-model值
            unbind: (...arg) => arg[2]?.data?.model?.callback(void 0)
        }
    },
    data() {
        return {
            isShowAdd: false, // 是否显示新增
            isShowButton: false, // 显示确认按钮
            currentRow: {}, // 当前行
            types: [
                { label: '急救', value: '1', time: '急救时间', no: '救护车' },
                { label: '急诊', value: '2', time: '分诊时间', no: '急诊号' },
                { label: '门诊', value: '3', time: '挂号时间', no: '门诊号' },
                { label: '住院', value: '4', time: '入院时间', no: '住院号' },
            ],
            dateTimes: [],// 开始时间与结束时间
            pickerDate: {
                maxDate: undefined,
                minDate: undefined
            },
            searchParam: {// 查询参数
                type: '2'
            },
            list: [], // 列表数据
            form: {}, // 新增表单数据
        }
    },
    computed: {
        elInputPlaceholder() {
            return this.hospitalAreaList.find(el => el.value === this.hospitalAreaFun()).label
        },
        pickerOptions() {
            return {
                disabledDate: (time) => {
                    const { maxDate, minDate } = this.pickerDate
                    let disabled = false
                    if (this.searchParam.type === '1' && minDate && !maxDate) {
                        // 最多允许选择前后三天
                        const threeDaysBefore = this.$moment(minDate).subtract(2, 'days')
                        const threeDaysAfter = this.$moment(minDate).add(2, 'days')
                        disabled =
                            this.$moment(time).isAfter(threeDaysAfter) ||
                            this.$moment(time).isBefore(threeDaysBefore)
                    }
                    return disabled
                },
                onPick: (v) => (this.pickerDate = v)
            }
        },
        labelNo() {
            return this.types.find(el => el.value === this.searchParam.type).no
        },
        labelTime() {
            return this.types.find(el => el.value === this.searchParam.type).time
        },
        isHasName() {
            return !!this.form.name
        },
    },
    methods: {
        reset() {
            // 重置
            this.$refs.form.resetFields()
            this.form = {
                hospitalArea: this.hospitalAreaFun()
            }
        },
        selectRow(val) {
            // 选中行
            this.currentRow = val;
            this.isShowButton = true
        },
        validateIdNumber(rule, value, callback) {
            // 身份证正确性校验(非必填校验)
            if (/^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value)) {
                callback();
            } else {
                if (value) {
                    callback(new Error('请输入正确的身份证号码'));
                } else {
                    callback();
                }
            }
        },
        inputIdNumber(val) {
            // 身份证输入计算年龄和性别
            if (/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/.test(val)) {
                // 计算年龄,身份证号码第七位到第十四位,为出生日期
                const birth = this.$moment(val.substr(6, 8), "YYYYMMDD") // 出生日期
                const nowTime = this.$moment() // 当前日期
                let year = nowTime.format('YYYY') - birth.format('YYYY') // 年数
                let months = nowTime.format('MM') - birth.format('MM') // 月数
                let days = birth.format('days') // 天数
                if (birth.format('MM') > nowTime.format('MM')) {
                    // 出生月大于当前月则年份减一,则月份计算方式为 12 - 生日月 + 当前月
                    year -= 1
                    months = (12 - birth.format('MM')) + parseInt(nowTime.format('MM'))
                }
                if (year > 6) {
                    // 六岁以上
                    this.$set(this.form, 'ageRange', '01')
                    this.$set(this.form, 'age', year)
                } else if (year < 1 && months < 1) {
                    // 新生儿
                    this.$set(this.form, 'ageRange', '03')
                    this.$set(this.form, 'age', days)
                } else {
                    // 六岁及以下
                    this.$set(this.form, 'ageRange', '02')
                    this.$set(this.form, 'age', year)
                    this.$set(this.form, 'ageMonth', months)
                }
                // 获取性别
                const idCardLast = parseInt(val.charAt(16)) // 获取身份证号码的第 17 位数字
                if (idCardLast % 2 == 1) {
                    // 判断奇偶性
                    this.$set(this.form, 'gender', '1') // 男性
                } else {
                    this.$set(this.form, 'gender', '2') // 女性
                }
            }
        },
        changeAgeRange() {
            // 修改年龄区间
            delete this.form.age
            delete this.form.ageMonth
            this.$refs.form.clearValidate(['age', 'ageMonth'])
        },
        genPatientName(val) {
            // 获取无名氏
            if (val === '1') {
                this.$api.genPatientName().then(res => {
                    if (res.code === '000000') {
                        this.$set(this.form, 'name', res.body)
                    }
                })
            }
        },
        buildDocument() {
            // 建档按钮
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if (this.form.ageRange === '03') {
                        this.form.ageDay = this.form.age
                    }
                    this.$api.addBasePatient({
                        ...this.form,
                        infoComingType: this.searchParam.type
                    }).then(res => {
                        if (res.code === '000000') {
                            // 建档成功跳转到编辑页面
                            this.handleClose()
                            // 跳转编辑页面
                            const { href } = this.$router.resolve({
                                name: 'Edit',
                                query: {
                                    registId: res.body,
                                }
                            })
                            window.open(href, '_blank')
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        handleRow() {
            // Table行事件,获取患者详情
            this.$api.getPatientBaseInfo({
                relationId: this.currentRow.relationId,
                type: this.searchParam.type
            }).then(res => {
                if (res.code === '000000') {
                    this.form = {
                        ...res.body,
                        visitType: res.body.comingType, // 来院方式
                        idNumber: res.body.idCard, // 身份证号
                        age: res.body.ageRange === '03' ? res.body.ageDay : res.body.age, // 年龄
                        hospitalArea: this.searchParam.hospitalArea
                    }
                    this.isShowAdd = true
                }
            })
        },
        handleTimeInterval() {
            // 处理时间区间
            if (this.dateTimes.length > 0) {
                this.searchParam.fromDate = this.$moment(this.dateTimes[0]).format(this.DATE_TIME_FORMAT.DATE_MINUTE)
                this.searchParam.toDate = this.$moment(this.dateTimes[1]).endOf('day').format(this.DATE_TIME_FORMAT.DATE_MINUTE)
                this.searchParam.pageNo = 0
                this.searchParam.total = 0
            }
        },
        handleSizeChange(val) {
            // 调整每页大小
            this.searchParam.pageSize = val
            this.queryThirdPatientsByPage()
        },
        handleCurrentChange(val) {
            // 跳转页码
            this.searchParam.pageNo = val
            this.queryThirdPatientsByPage()
        },
        changeType(val) {
            // 清空列表
            this.list = []
            // 修改类别
            this.searchParam.pageNo = 0
            this.searchParam.total = 0
            // 当类型=急救时,如果时间区间大于3天,则根据结束时间,设置开始时间
            if (val === '1' && this.dateTimes.length > 0 && this.searchParam.fromDate && this.searchParam.toDate) {
                const startTime = this.$moment(this.searchParam.fromDate).toDate().getTime()
                const endTime = this.$moment(this.searchParam.toDate).toDate().getTime()
                const timeDiff = Math.abs(endTime - startTime)
                const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
                if (dayDiff > 3) {
                    let newStartTime = this.$moment(this.searchParam.toDate).subtract(3, 'days').add(1, 'minutes').format('YYYY-MM-DD HH:mm')
                    this.searchParam.fromDate = newStartTime
                    this.dateTimes = [newStartTime, this.dateTimes[1]]
                }
            }
            this.queryThirdPatientsByPage()
        },
        queryThirdPatientsByPage() {
            // 查询患者列表
            this.searchParam.pageNo = ++this.searchParam.pageNo
            this.$api.queryThirdPatientsByPage(this.searchParam).then(res => {
                if (res.code === '000000') {
                    this.list = res.body.records
                    // 分页信息
                    this.searchParam.total = res.body.total
                    this.searchParam.pageNo = res.body.current
                    this.searchParam.pageSize = res.body.size

                    this.isShowButton = false
                }
            })
        },
        initSearchParam() {
            // 初始化查询参数
            const startTime = this.$moment().endOf('day').subtract(3, 'days').add(1, 'minutes').format('YYYY-MM-DD HH:mm')
            const endTime = this.$moment().endOf('day').format('YYYY-MM-DD HH:mm')
            this.dateTimes = [startTime, endTime]
            this.searchParam = {
                type: '2',
                hospitalArea: this.hospitalAreaFun(),
                hospitalAndArea: this.hospitalId + '_' + this.hospitalAreaFun(),
                fromDate: startTime,
                toDate: endTime,
                pageNo: 0,
                pageSize: 10,
                total: 0,
            }
            this.isShowAdd = false
            this.queryThirdPatientsByPage()
        },
        handleClose() {
            // 关闭组件
            this.$emit('close');
            this.reset()
        }
    },
    watch: {
        'form.name'(val) {
            if (!val) {
                this.$set(this.form, 'hasName', '0')
            }
        },
        value(val) {
            if (val) {
                this.initSearchParam()
            }
        }
    }
}
</script>

<style lang="scss" scoped></style>