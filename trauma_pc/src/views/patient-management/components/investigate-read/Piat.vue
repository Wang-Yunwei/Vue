<template>
    <div>
        <el-empty v-if="isEmpty" description="未来查询到预检分诊信息" />
        <div v-else>
            <el-descriptions v-for="(itemA, indexA) in list" :key="indexA" :title="itemA.title" :column="4" border style="margin-bottom: 1.5rem;" :label-style="{ width: '10%' }">
                <el-descriptions-item v-for="(itemB, indexB) in itemA.fields" :key="indexB" :label="itemB.label">
                    {{ itemB.value }}
                </el-descriptions-item>
            </el-descriptions>
        </div>
    </div>
</template>

<script>
import { DictionariesMixin } from '@/mixins/index'
export default {
    name: 'InvestigateReadPiat',
    mixins: [DictionariesMixin],
    data() {
        return {
            isEmpty: true,
            form: {
                mdaVitalSigns: {
                    r: {},
                    p: {},
                    bp: {},
                    spo2: {},
                    t: {}
                }
            }
        }
    },
    mounted() {
        this.getDetails()
    },
    computed: {
        list() {
            return [
                {
                    title: '基本信息',
                    fields: [
                        { label: '分诊时间', value: this.form.triageTime },
                        { label: '急诊编号', value: this.form.emergencyId },
                        { label: '卡号', value: this.form.citizenCard },
                        { label: '姓名', value: this.form.citizenCard },
                        { label: '性别', value: this.dicLabelByValue(this.form.sex, 'GENDER_0001') },
                        { label: '年龄', value: this.form.age },
                        { label: '绿色通道', value: this.form.greenChannel },
                        { label: '主诉', value: this.form.triageComplaint },
                        { label: '分诊级别', value: this.form.resetLevel ? this.form.resetLevel + '级' : '' }]
                },
                {
                    title: '生命体征',
                    fields: [
                        { label: '意识', value: this.form.triageSenceDesc },
                        { label: '呼吸 (次/分)', value: this.form.mdaVitalSigns.r.value },
                        { label: '脉搏 (次/分)', value: this.form.mdaVitalSigns.p.value },
                        { label: '血压 (mmHg)', value: this.form.mdaVitalSigns.bp.sp && this.form.mdaVitalSigns.bp.dp ? this.form.mdaVitalSigns.bp.sp + '/' + this.form.mdaVitalSigns.bp.dp : '' },
                        { label: '血氧 (%)', value: this.form.mdaVitalSigns.spo2.value },
                        { label: '体温 (℃)', value: this.form.mdaVitalSigns.t.value }
                    ]
                },
                {
                    title: '患者去向',
                    fields: [
                        { label: '就诊科室', value: this.form.deptName },
                        { label: '患者分诊去向', value: this.form.outWay }]
                }
            ]
        }
    },
    methods: {
        getDetails() {
            this.$api.getTriagePreview({
                emId: sessionStorage.getItem('emId')
            }).then(res => {
                if (res.code === '000000') {

                    if (res.body && Object.keys(res.body).length > 0) {
                        this.isEmpty = false
                        this.form = {
                            ...this.form,
                            ...res.body
                        }
                    }


                }
            })
        }
    }
}
</script>