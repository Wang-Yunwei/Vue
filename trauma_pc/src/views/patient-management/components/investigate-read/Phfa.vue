<template>
    <div>
        <el-empty v-if="isEmpty" description="未来查询到急救病历信息"></el-empty>
        <div v-else>
            <el-descriptions v-for="(item, indexA) in list" :key="indexA" :title="item.title"
                :column="indexA === 4 ? 1 : 4" style="margin-bottom: 1.5rem;" :label-style="{ width: '10%' }" border>
                <el-descriptions-item v-for="(itemB, indexB) in item.fields" :key="indexB" :label="itemB.label"
                    :span="itemSpan(indexA, indexB)">
                    <div v-if="indexA === 4 && indexB === 0">
                        <el-image v-for="(ecgUrl, indexC) in itemB.value" :key="indexC" :src="ecgUrl"
                            :preview-src-list="itemB.value" style="width: 100px; height: 100px" />
                    </div>
                    <div v-else>
                        {{ itemB.value }}
                    </div>
                </el-descriptions-item>
            </el-descriptions>
        </div>
    </div>
</template>

<script>
import { DictionariesMixin } from '@/mixins/index'
export default {
    name: 'InvestigateReadPhfa',
    mixins: [DictionariesMixin],
    data() {
        return {
            isEmpty: true,
            form: {
                diagnosticProcessingDto: {},
                medPhepMeasuresEntityList: [],
                medicalRecordInfoDto: {},
                patientBaseInfoDto: {},
                physicalExaminationDtoList: [],
                supplementaryExaminationDto: {
                    medPhepPoctEntity: {}
                },
                taskInfoDto: {},
                physicalExaminationDto: {},
                orders: ''
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
                        { label: '姓名', value: this.form.patientBaseInfoDto.name },
                        { label: '性别', value: this.dicLabelByValue(this.form.patientBaseInfoDto.gender, 'GENDER_0001') },
                        { label: '年龄', value: this.form.patientBaseInfoDto.age },
                        { label: '民族', value: this.dicLabelByValue(this.form.patientBaseInfoDto.nation, 'NATION_0001') },
                        { label: '联系电话', value: this.form.medicalRecordInfoDto.contactNumber }]
                },
                {
                    title: '任务信息',
                    fields: [
                        { label: '车牌号', value: this.form.taskInfoDto.licensePlate },
                        { label: '呼叫原因', value: this.form.medicalRecordInfoDto.reasonType },
                        { label: '疾病类别', value: this.form.medicalRecordInfoDto.diseaseCategory },
                        { label: '接诊地址', value: this.form.medicalRecordInfoDto.address },
                        { label: '出车分站', value: this.form.taskInfoDto.dispatchVehicleSiteName },
                        { label: '出诊医生', value: this.form.taskInfoDto.doctorName },
                        { label: '出诊护士', value: this.form.taskInfoDto.nurseName }]
                },
                {
                    title: '患者病史',
                    fields: [
                        { label: '发病时间', value: this.form.medicalRecordInfoDto.morbtimearea },
                        { label: '主诉', value: this.form.medicalRecordInfoDto.chiefComplaint },
                        { label: '现病史', value: this.form.medicalRecordInfoDto.presentIllness },
                        { label: '过敏史', value: this.form.medicalRecordInfoDto.allergicHistory },
                        { label: '既往史', value: this.form.medicalRecordInfoDto.pastHistory }]
                },
                {
                    title: '体格检查',
                    fields: [
                        { label: '检查时间', value: this.form.physicalExaminationDto.createTime },
                        { label: '体温 (℃)', value: this.form.physicalExaminationDto.t },
                        { label: '呼吸 (次/分)', value: this.form.physicalExaminationDto.rr },
                        { label: '脉搏 (次/分)', value: this.form.physicalExaminationDto.pulse },
                        { label: '血压 (mmHg)', value: this.form.physicalExaminationDto.sbp + '/' + this.form.physicalExaminationDto.dbp },
                        { label: '血氧 (%)', value: this.form.physicalExaminationDto.spo2 },
                        { label: '意识', value: this.form.physicalExaminationDto.consciousness }]
                },
                {
                    title: '辅助检查',
                    fields: [
                        { label: '心电图', value: this.form.supplementaryExaminationDto.ecg },
                        { label: '血糖', value: this.form.supplementaryExaminationDto.bloodglucose }]
                },
                {
                    title: 'POCT',
                    fields: [
                        { label: '检查时间', value: this.form.supplementaryExaminationDto.medPhepPoctEntity.checkTime },
                        { label: '报告时间', value: this.form.supplementaryExaminationDto.medPhepPoctEntity.reportTime },
                        { label: `TnT (${this.form.supplementaryExaminationDto.medPhepPoctEntity.tntUnit}) `, value: this.form.supplementaryExaminationDto.medPhepPoctEntity.tnt },
                        { label: `Tnl (${this.form.supplementaryExaminationDto.medPhepPoctEntity.tnlUnit})`, value: this.form.supplementaryExaminationDto.medPhepPoctEntity.tnl }]
                },
                {
                    title: '专科评估',
                    fields: [
                        { label: 'TI评估', value: this.form.supplementaryExaminationDto.tiScore },
                        { label: 'GCS评估', value: this.form.supplementaryExaminationDto.gcsScore },
                        { label: '胸痛评估', value: this.form.supplementaryExaminationDto.chestPainAssessment },
                        { label: 'Killip分级', value: this.form.supplementaryExaminationDto.killip },
                        { label: 'FAST评估', value: this.form.supplementaryExaminationDto.fastAssessment },
                        { label: '其它检查', value: this.form.supplementaryExaminationDto.otherCheck }]
                },
                {
                    title: '诊断处理',
                    fields: [
                        { label: '初步诊断', value: this.form.diagnosticProcessingDto.diagnosis },
                        { label: '病情判断', value: this.dicLabelByValue(this.form.diagnosticProcessingDto.conditionGrade, 'DIAGNOSIS_0001') },
                        { label: '急救措施', value: this.form.medPhepMeasuresEntityList },
                        { label: '用药', value: this.form.orders },
                        { label: '病情转归', value: this.form.medicalRecordInfoDto.rescueChangeResultName },
                        { label: '出诊结果', value: this.form.medicalRecordInfoDto.treatmentResultName },
                        { label: '送往医院', value: this.form.medicalRecordInfoDto.toHospitalName }]
                }
            ]
        },
        itemSpan() {
            return (a, b) => {
                let result = 1
                if (a === 7) {
                    switch (b) {
                        case 2:
                            result = 2
                            break
                        case 3:
                            result = 4
                            break
                    }
                }
                return result
            }
        }
    },
    methods: {
        getDetails() {
            this.$api.getfirstAidList({
                emId: sessionStorage.getItem('emId')
            }).then(res => {
                if (res.code === '000000') {
                    if (Object.keys(res.body).length > 0) {
                        this.isEmpty = false
                        this.form = {
                            ...this.form,
                            ...res.body
                        }
                        // 获取最新的体格检查
                        if (this.form.physicalExaminationDtoList && this.form.physicalExaminationDtoList.length > 0) {
                            this.form.physicalExaminationDtoList.sort((a, b) => a.createTime < b.createTime ? 1 : -1)
                            this.form.physicalExaminationDto = this.form.physicalExaminationDtoList[0]
                        }
                        // 急救措施
                        if (this.form.medPhepMeasuresEntityList && this.form.medPhepMeasuresEntityList.length > 0) {
                            const lis = this.form.medPhepMeasuresEntityList.map(el => el.measureName + '-' + el.opTime)
                            this.form.medPhepMeasuresEntityList = lis.join('\\')
                        }
                        // 用药
                        if (this.form.diagnosticProcessingDto.emergencyOrders && this.form.diagnosticProcessingDto.emergencyOrders.length > 0) {
                            const orders = this.form.diagnosticProcessingDto.emergencyOrders.map(el => {
                                if (el.medPhepEmergencyOrdersEntity && el.medPhepDrugEntity) {
                                    return el.medPhepEmergencyOrdersEntity.createTime + ' ' + el.medPhepDrugEntity.name + '(' + el.medPhepEmergencyOrdersEntity.dose + ' ' + el.medPhepDrugEntity.drugUnit + ')'
                                }
                            })
                            this.form.orders = orders.join('\\')
                        }
                    }

                }
            })
        }
    }
}
</script>