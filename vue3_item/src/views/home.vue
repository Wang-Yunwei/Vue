<script setup>
import { RouterView } from 'vue-router'
import { ref } from 'vue'

const activeIndex = ref('1')
</script>

<template>
    <el-container>
        <el-header class="head">
            <div style="flex: 4;display: flex;padding: 0.3rem;">
                <div style="flex: 1;border-right: 1px solid rgb(220, 223, 230);color: rgb(65,184,131);">
                    广告位
                </div>
                <div style="flex: 1;line-height: 3rem;text-align: center;color: rgb(65,184,131);">
                    <span style="font-size: 1.5rem;">
                        xxx管理系统
                    </span>
                    <span>v1.0</span>
                </div>
            </div>
            <div style="flex: 10;background-color: bisque;">
                <el-menu :default-active="$route.path" router class="el-menu-demo" mode="horizontal">
                    <el-menu-item index="/business">TestA</el-menu-item>
                    <el-menu-item index="/business/TestB">TestB</el-menu-item>
                    <el-menu-item index="/business/TestC">TestC</el-menu-item>
                    <el-sub-menu index="1">
                        <template #title>TestD</template>
                        <el-menu-item index="/business">Go A Page</el-menu-item>
                        <el-menu-item index="/business/TestB">Go B Page</el-menu-item>
                        <el-menu-item index="/business/TestC">Go C Page</el-menu-item>
                        <el-sub-menu index="2">
                            <template #title>系统管理</template>
                            <el-menu-item index="/business">Go A Page</el-menu-item>
                            <el-menu-item index="/business/TestB">Go B Page</el-menu-item>
                            <el-menu-item index="/business/TestC">Go C Page</el-menu-item>
                        </el-sub-menu>
                    </el-sub-menu>
                </el-menu>
            </div>
            <el-popover trigger="hover">
                <template #reference>
                    <div style="flex: 1;position: relative;cursor:pointer">
                        <span style="line-height: 3.9rem;margin: 0 0.6rem;font-weight: 600;color: rgb(65,184,131);">
                            管理员
                        </span>
                        <img src="@/assets/img/w3c.png" width="40" height="40" style="clip-path: circle(50%);position: absolute;top: 50%;transform: translateY(-50%);">
                    </div>
                </template>
                <template #default>
                    <div style="text-align: center;">
                        <p>
                            <el-button key="plain" text>编辑资料</el-button>
                        </p>
                        <p>
                            <el-button key="plain" text>修改密码</el-button>
                        </p>
                        <p>
                            <RouterLink :to="{ name: 'login' }">
                                退出登录
                            </RouterLink>
                        </p>
                    </div>
                </template>
            </el-popover>
        </el-header>
        <el-main>
            <div style="padding: 5rem;">
                <RouterView />
            </div>
        </el-main>
    </el-container>
</template>

<style lang="scss" scoped>
.head {
    box-shadow: 0 1px 5px #888888;
    display: flex;
}
</style>
