<script setup>
import { ref, reactive } from "vue";

const form = reactive({})

const loginClick = (username, password) => {
    if (username && password) {
        if (username === 'wyw' && password === '123') {

        }
    }
}
</script>

<template>
    <div class="login">
        <el-card class="box-card">
            <div style="text-align: center;margin-bottom: 1rem;">
                <span style="font-size: 2rem;">登录</span>
            </div>
            <el-form :model="form">
                <el-form-item>
                    <el-input v-model="form.username" placeholder="username" prefix-icon="User" />
                </el-form-item>
                <el-form-item>
                    <el-input v-model="form.password" type="password" placeholder="password" show-password
                        prefix-icon="Lock" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" color="rgb(98,106,239)" style="width: 100%;"
                        @click="loginClick(form.username, form.password)">登录</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>


<style lang="scss" scoped>
.login {
    // background: bg-color bg-image position/bg-size bg-repeat bg-origin bg-clip bg-attachment initial|inherit;
    background-image: url(../../assets/img/login.jpg);
    background-position: center center; // 背景图垂直水平居中
    background-size: cover; // 设置图像大小, cover 基于容器大小伸缩
    background-repeat: no-repeat; //背景不平铺 
    background-attachment: fixed; // 图像不会随着剩余的页面滚动
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center; // 为弹性容器内的项目指定默认对齐方式
    justify-content: center; // 在容器中间对齐元素
}

.text {
    font-size: 14px;
}

.item {
    padding: 18px 0;
}

.box-card {
    width: 20rem;
    // margin: auto;
}
</style>