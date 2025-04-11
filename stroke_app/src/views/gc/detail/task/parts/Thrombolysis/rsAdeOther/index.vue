<template>
  <med-view-container title="静脉溶栓其他不良事件" @return="backClick">
    <div class="scroll-view content-wrapper">
      <van-radio-group v-model="result">
        <van-cell-group>
          <van-cell
            v-for="item in list"
            clickable
            :key="item.label"
            :title="`${item.value}:${item.label}`"
          >
            <template #right-icon>
              <van-radio :name="item.label" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </div>
  </med-view-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'rsAdeOther',
  data() {
    return {
      result: []
    }
  },
  props: ['rsAdeOther'],
  created() {
    if (this.rsAdeOther) {
      this.result = this.rsAdeOther
    }
  },
  computed: {
    ...mapGetters(['dicData'])
  },
  methods: {
    backClick() {
      this.$emit('backClick', 'rsAdeOther', this.result)
    }
  }
}
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
