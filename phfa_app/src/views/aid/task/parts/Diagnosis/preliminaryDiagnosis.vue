<template>
  <div class="task-preliminary-diagnosis-wrapper">
    <div>
      <med-header title="初步诊断" @backClick="onClickLeft" />
      <div class="scroll-box">
        <van-collapse accordion v-model="diagnosisOne">
          <van-collapse-item
            v-for="item in list"
            :key="item.value"
            :title="item.name"
            :name="item.label"
          >
            <van-radio-group
              class="flex-c-s radio-btn-type radioStyle"
              v-model="diagnosisTwo"
              @change="submit"
            >
              <van-radio
                v-for="item in item.list"
                :key="item.value"
                :name="item.describe + '-' + item.label"
              >
                {{ item.label }}
              </van-radio>
            </van-radio-group>
          </van-collapse-item>
        </van-collapse>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      require: true,
      default: () => []
    }
  },
  data() {
    return {
      show: false,
      extend: '1', // 初步诊断标识
      diagnosisOne: '',
      diagnosisTwo: '',
      form: {}
    }
  },
  methods: {
    onClickLeft() {
      this.$emit('backClick')
    },
    submit(val) {
      this.$set(this.form, 'diagnosis', val)
      this.$emit('submit', this.form)
    }
  }
}
</script>

<style lang="less" scoped>
.task-preliminary-diagnosis-wrapper {
  padding: 36px 0;
  .radioStyle {
    flex-wrap: wrap;
    .van-radio {
      margin-bottom: 20px;
    }
  }
  .scroll-box {
    max-height: calc(100vh - 3rem);
    overflow: auto;
  }
}
</style>
