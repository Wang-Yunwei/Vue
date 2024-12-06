<template>
    <div>
        <el-empty v-if="isEmpty" description="未来查询到检查信息" />
        <div v-else>
            <el-descriptions v-for="(item, indexA) in list" :key="indexA" :column="1" :title="item.examClass + item.examSubClass" style="margin-bottom: 1.5rem;" :label-style="{ width: '10%' }" border>
                <el-descriptions-item label="报告时间">
                    {{ item.reportTime }}
                </el-descriptions-item>
                <el-descriptions-item label="结论">
                    {{ item.conclusion }}
                </el-descriptions-item>
                <el-descriptions-item label="检查所见">
                    {{ item.description }}
                </el-descriptions-item>
            </el-descriptions>
        </div>
    </div>
</template>

<script>
import { DictionariesMixin } from '@/mixins/index'
export default {
    name: 'InvestigateReadCheck',
    mixins: [DictionariesMixin],
    data() {
        return {
            isEmpty: true,
            list: []
        };
    },

    mounted() {
        this.getDetails()
    },
    computed: {
        infoComingType() {
            return this.$route.query.infoComingType;
        },
    },
    methods: {
        getDetails() {
            this.$api.getInspect({
                emId: sessionStorage.getItem('emId'),
                infoComingType: this.infoComingType
            }).then(res => {
                if (res.code === '000000' && res.body && res.body.examination && res.body.examination.examinationReportList.length > 0) {
                    this.isEmpty = false
                    this.list = res.body.examination.examinationReportList
                }
            })
        }
    },
};
</script>

<style lang="scss" scoped></style>