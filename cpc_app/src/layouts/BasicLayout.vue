<template>
  <div class="med-global-layout-wrapper">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view />
  </div>
</template>

<style lang="less" scoped>
@import '@/assets/styles/common/layouts/wrapper.less';
</style>
