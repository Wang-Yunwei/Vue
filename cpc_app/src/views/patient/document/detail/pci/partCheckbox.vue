<template>
  <van-checkbox v-bind="$props" :name="name" class="part-checkbox">
    <template #icon="props">
      <div
        :class="
          props.checked
            ? 'part-checkbox-icon part-checkbox-checked'
            : 'part-checkbox-icon part-checkbox-unchecked'
        "
      >
        {{ no }}
      </div>
      <!-- <van-icon name="passed" :class="checkedValue ? 'part-checkbox-checked' : ''" @click="onCheckChanged" /> -->
    </template>
  </van-checkbox>
</template>
<script>
import T from 'vant/es/checkbox/index'
export default {
  name: '',
  props: {
    ...T.props,
    name: {
      type: String,
      require: true
    },
    no: {
      type: String,
      require: true,
      default: ''
    }
  },
  data() {
    return {}
  },
  computed: {},
  methods: {},
  watch: {}
}
</script>
<style lang="less" scoped>
.part-checkbox-icon {
  font-size: 28px;
  padding: 8px;
  border-radius: 120px;
  border: 1px solid #c8c9cc;
  width: 36px;
  height: 36px;
  text-align: center;
}
.part-checkbox-checked {
  color: #fff;
  background: #1989fa;
}
.part-checkbox-unchecked {
  color: #323233;
  background: #fff;
}
</style>
