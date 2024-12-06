<template>
    <div>
        <el-empty v-if="isEmpty" description="未来查询到检验信息" />
        <div v-else>
            <div v-for="(item, indexA) in  list " :key="indexA" style="margin-bottom: 1.5rem;">
                <el-descriptions :column="1" :title="item.testCause" :label-style="{ width: '10%' }" border>
                    <el-descriptions-item label="报告时间">
                        {{ item.reportTime }}
                    </el-descriptions-item>
                </el-descriptions>
                <el-table :data="item.labResultList" stripe style="width: 100%" :header-cell-style="{ 'background-color': 'rgb(238, 241, 246)' }">
                    <el-table-column prop="reportItemName" label="项目名称" />
                    <el-table-column prop="result" label="结果">
                        <template slot-scope="scope">
                            {{ scope.row.result + ' ' + scope.row.units }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="abnormalIndicator" label="标识" />
                    <el-table-column prop="referenceResult" label="参考值" />

                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import { DictionariesMixin } from '@/mixins/index'
export default {
    name: 'InvestigateReadInspect',
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
                if (res.code === '000000' && res.body && res.body.inspection && res.body.inspection.masterList.length > 0) {
                    this.isEmpty = false
                    this.list = res.body.inspection.masterList
                }
            })
        }
    },
};
</script>

<style lang="scss" scoped></style>