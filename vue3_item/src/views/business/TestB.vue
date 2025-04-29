<template>
    <div style="background-color: aquamarine;">
        <div class=" triangle"></div>

        <div>
            <h1>这是TestB页面</h1>
        </div>
        <el-row class="mb-4">
            <el-button>Default</el-button>
            <el-button type="primary">Primary</el-button>
            <el-button type="success">Success</el-button>
            <el-button type="info">Info</el-button>
            <el-button type="warning">Warning</el-button>
            <el-button type="danger">Danger</el-button>
        </el-row>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
const num = ref(123)
onMounted(() => {
    console.log('111', num);
})
watch('$route.path',
    (val) => {
        console.log(num, val);
    }
)
</script>

<style lang="scss" scoped>
.triangle {
    /* div三角样式 */
    display: inline-flex;
    border: solid 3rem transparent;
    border-top-color: #0097a7;
    border-bottom-color: #b2ebf2;
    border-right-color: #00bcd4;
    border-left-color: #009688;
}
</style>