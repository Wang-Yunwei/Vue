<template>
  <van-empty :image="emptyImg" v-bind="$attrs"></van-empty>
</template>

<script>
import emptyImg from '@/assets/png/empty-image-default.png'
export default {
  name: 'MedEmpty',
  props: ['image'],
  computed: {
    emptyImg() {
      return emptyImg
    }
  }
}
</script>

<style></style>
