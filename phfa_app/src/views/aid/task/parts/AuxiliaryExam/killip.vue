<template>
  <div class="task-killip-wrapper">
    <med-header title="Killip" @backClick="onClickLeft" />
    <div class="scroll-box">
      <van-radio-group class="radio-btn-type" v-model="form.PHEP_killip" checked-color="#5E74FE">
        <div class="killip-card" v-for="item in datasource" :key="item.value">
          <van-radio :name="item.value">
            <div class="killip-card-right">
              <h2>{{ item.value }}</h2>
              <p>
                {{ item.label }}
              </p>
            </div>
          </van-radio>
        </div>
      </van-radio-group>
    </div>
  </div>
</template>
<script>
import methodMixin from '@mixins/methodMixin'
export default {
  props: ['patientId', 'value', 'parseResult'],
  data() {
    return {
      datasource: [],
      form: {
        PHEP_killip: ''
      }
    }
  },
  created() {
    const res = this.getCodeListByKey(['PHFA_0049'])
    this.datasource = res.PHFA_0049 // killip
  },
  methods: {
    onClickLeft() {
      this.$emit('back')
    },
    async handleSave() {
      const now = this.$moment().format('YYYY-MM-DD[T]HH:mm:ss')
      const payload = {
        patientId: this.patientId,
        estimateDto: {
          id: '', // 评分主表_主键ID 新增: 后端自处理
          title: 'Killip', // 标题
          name: 'killip', // 评分名
          value: 0, // 分值
          patientId: this.patientId, // 患者ID
          doctor: '', // 评分医生
          relationId: '', // 急救人员ID
          time: now, // 评分时间
          createName: '', // 创建人
          createDate: now, // 创建时间
          updateName: '', // 修改人
          updateDate: now, // 修改时间
          description: '', // 描述
          // 评分细项
          details: [
            {
              type: 'PHEP_killip', // killip
              value: this.form.PHEP_killip
            }
          ]
        }
      }
      payload.estimateDto.description = this.parseResult(payload.estimateDto)
      this.$api
        .supSaveOrUpdate(payload)
        .then(res => { })
    }
  },
  watch: {
    form: {
      handler() {
        this.handleSave()
      },
      deep: true
    },
    value: {
      handler(nVal) {
        const { details = [] } = nVal || {}
        const newForm = {}
        details.forEach(item => {
          newForm[item.type] = item.value
        })
        this.$preventWatch(() => {
          this.form = { ...this.form, ...newForm }
        })
      },
      immediate: true
    }
  },
  mixins: [methodMixin]
}
</script>

<style lang="less" scoped>
.scroll-box {
  overflow: auto;
  max-height: calc(100vh - 2rem);
}

.task-killip-wrapper {
  background: #f2f4f5;
  padding: 20px 0 0;

  .killip-card {
    background: #fff;
    padding: 30px 54px 42px 30px;
    margin-bottom: 0.22rem;

    /deep/ .van-radio {
      margin-right: 0;
      align-items: baseline;

      .van-radio__icon {
        width: 50px;
        height: 50px;

        .van-icon {
          width: 50px;
          height: 50px;
          display: block;

          &:before {
            display: block;
            line-height: 46px;
          }
        }

        &.van-radio__icon--checked {
          width: 50px;
          height: 50px;
        }

        &.van-radio__icon--checked+.van-radio__label {
          background: unset;
          color: inherit;
        }
      }

      .van-radio__label {
        border: none;
        padding: 0 20px;
        border-radius: none;
        margin: 0;
      }
    }

    .killip-card-right {
      h2 {
        font-size: 30px;
        color: #5e74fe;
      }

      p {
        font-size: @font-md-size;
        color: #696969;
        line-height: 40px;
        padding-top: 20px;
      }
    }
  }
}
</style>
