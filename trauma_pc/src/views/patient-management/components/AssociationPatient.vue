<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="10">
                <el-input :value="value" :placeholder="placeholder" readonly :disabled="!emId" />
            </el-col>
            <el-col :span="6">
                <el-button type="primary" :disabled="!emId" @click="initSearchParam(); isShow = true">关联</el-button>
            </el-col>
        </el-row>
        <el-dialog title="关联患者" width="45%" :visible.sync="isShow" :close-on-click-modal="false">
            <el-row :gutter="10">
                <el-col :span="7">
                    <el-date-picker v-model="dateTimes" type="daterange" start-placeholder="开始日期" range-separator="至" end-placeholder="结束日期" :picker-options="pickerOptions" @blur="handleTimeInterval" unlink-panels size="mini" style="width: auto;" />
                </el-col>
                <el-col :span="5">
                    <el-input v-model="searchParam.name" placeholder="请输入姓名" size="mini" clearable />
                </el-col>
                <el-col :span="3">
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="queryThirdPatientsByPage">
                        查询
                    </el-button>
                </el-col>
            </el-row>
            <el-table :data="list" height="250" size="mini" border highlight-current-row @row-click="handleRow">
                <el-table-column type="index" width="50" />
                <el-table-column :prop="labelNo === '急诊号' ? 'no' : 'displayNo'" :label="labelNo" />
                <el-table-column prop="name" label="患者姓名" />
                <el-table-column label="性别" width="50">
                    <template slot-scope="scope">
                        {{ dicLabelByValue(scope.row.gender, 'GENDER_0001') }}
                    </template>
                </el-table-column>
                <el-table-column label="年龄" width="50">
                    <template slot-scope="scope">
                        {{ scope.row.ageDesc ? scope.row.ageDesc : '未知' }}
                    </template>
                </el-table-column>
                <el-table-column prop="diagnosis" :label="labelDiagnosis" width="300" />
                <el-table-column prop="time" :label="labelTime" width="150" />
            </el-table>
            <el-pagination background layout="prev, pager, next" :page-size="searchParam.pageSize" :current-page="searchParam.pageNo" :total="searchParam.total" @current-change="handleCurrentChange" />
        </el-dialog>
    </div>
</template>

<script>
import * as types from '@/store/mutation-types'
import { mapGetters, mapMutations } from 'vuex'
import { DictionariesMixin } from '@/mixins/index'
export default {
    name: 'TraumaPcAssociationPatient',
    inject: ['registId', 'nameFun', 'hospitalAreaFun', 'emIdFun'],
    mixins: [DictionariesMixin],
    props: {
        value: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isShow: false, // 是否显示dialog
            dateTimes: [],// 开始时间与结束时间
            pickerDate: {
                maxDate: undefined,
                minDate: undefined
            },
            searchParam: {},
            states: [
                { label: '急救', value: '1', time: '急救时间', no: '救护车', diagnosis: '初步诊断' },
                { label: '急诊', value: '2', time: '分诊时间', no: '急诊号', diagnosis: '主诉' },
                { label: '门诊', value: '3', time: '挂号时间', no: '门诊号', diagnosis: '初步诊断' },
                { label: '住院', value: '4', time: '入院时间', no: '住院号', diagnosis: '入院诊断' },
            ],
            list: []
        };
    },
    computed: {
        ...mapGetters(['synchronize', 'receiveDept']),
        emId() {
            return this.emIdFun()
        },
        labelDiagnosis() {
            return this.states.find(el => el.value === this.type).diagnosis
        },
        labelNo() {
            return this.states.find(el => el.value === this.type).no
        },
        labelTime() {
            return this.states.find(el => el.value === this.type).time
        },
        pickerOptions() {
            const getStart = (days = 0) => {
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * days)
                return start
            }
            return {
                shortcuts: [
                    {
                        text: '近三天',
                        onClick: (picker) => {
                            picker.$emit('pick', [getStart(2), new Date()])
                            this.handleSearch()
                        }
                    },
                    {
                        text: '最近一周',
                        hidden: this.type === '1',
                        onClick: (picker) => {
                            picker.$emit('pick', [getStart(6), new Date()])
                            this.handleSearch()
                        }
                    },
                    {
                        text: '最近一个月',
                        hidden: this.type === '1',
                        onClick: (picker) => {
                            picker.$emit('pick', [getStart(30), new Date()])
                            this.handleSearch()
                        }
                    }
                ].filter((el) => !el.hidden),
                disabledDate: (time) => {
                    const { maxDate, minDate } = this.pickerDate
                    let disabled = false
                    if (this.type === '1' && minDate && !maxDate) {
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
        }
    },
    methods: {
        ...mapMutations([types.SET_SYNCHRONIZE]),
        handleRow(row) {
            // Table行事件
            this.$confirm('确认关联患者【' + row.name + '】吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$api.bindDept({
                    registId: this.registId,
                    type: this.searchParam.type,
                    visitId: row.relationId
                }).then(res => {
                    if (res.code === '000000') {
                        this.isShow = false
                        this[types.SET_SYNCHRONIZE](!this.synchronize)
                    }
                })
            }).catch(() => { })
        },
        handleTimeInterval() {
            // 处理时间区间
            if (this.dateTimes.length > 0) {
                this.searchParam.fromDate = this.$moment(this.dateTimes[0]).format(this.DATE_TIME_FORMAT.DATE_MINUTE)
                this.searchParam.toDate = this.$moment(this.dateTimes[1]).endOf('day').format(this.DATE_TIME_FORMAT.DATE_MINUTE)
                this.searchParam.pageNo = 1
                this.searchParam.total = 0
            }
        },
        handleCurrentChange(val) {
            // 跳转页码
            this.searchParam.pageNo = val
            this.queryThirdPatientsByPage()
        },
        queryThirdPatientsByPage() {
            // 查询患者列表
            this.$api.queryThirdPatientsByPage(this.searchParam).then(res => {
                if (res.code === '000000') {
                    this.list = res.body.records
                    // 分页信息
                    this.searchParam.total = res.body.total
                    this.searchParam.pageNo = res.body.current
                    this.searchParam.pageSize = res.body.size
                }
            })

        },
        initSearchParam() {
            this.list = []
            const startTime = this.$moment().endOf('day').subtract(3, 'days').add(1, 'minutes').format('YYYY-MM-DD HH:mm')
            const endTime = this.$moment().endOf('day').format('YYYY-MM-DD HH:mm')
            this.dateTimes = [startTime, endTime]
            this.searchParam = {
                type: this.type,
                fromDate: startTime,
                toDate: endTime,
                hospitalAndArea: this.hospitalId + '_' + this.hospitalAreaFun(),
                pageNo: 1,
                pageSize: 10,
                total: 0,
                name: this.nameFun()
            }
        }
    },
};
</script>

<style lang="scss" scoped></style>