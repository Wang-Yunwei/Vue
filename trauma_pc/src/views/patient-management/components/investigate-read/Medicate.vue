<template>
    <div>
        <el-empty v-if="isEmpty" description="未来查询到用药信息" />
        <div v-else>
            <el-descriptions v-for="(item, indexA) in list" :key="indexA" :column="1" :title="item.enterDateTime" style="margin-bottom: 1.5rem;" :label-style="{ width: '10%' }" border>
                <el-descriptions-item v-for="(itemB, indexB) in item.items" :key="indexB" label="药品信息">
                    {{ itemB.orderText + ' ' + itemB.dosage + ' ' + itemB.dosageUnits + ' ' + itemB.administration + ' ' +
            itemB.frequency }}
                </el-descriptions-item>
            </el-descriptions>
        </div>
    </div>
</template>

<script>
export default {
    name: 'InvestigateReadMedicate',
    data() {
        return {
            isEmpty: true,
            list: []
        };
    },
    mounted() {
        this.getDetails()
    },
    methods: {
        getDetails() {
            this.$api.getMedicate({
                emId: sessionStorage.getItem('emId')
            }).then(res => {
                if (res.code === '000000' && res.body.length > 0) {
                    this.isEmpty = false
                    this.list = res.body
                }
            })
        }
    },
};
</script>

<style lang="scss" scoped></style>