<template>
  <div class="hdat-body" ref="hdat">
    <van-form ref="formData" :show-error-message="false">
      <div>
        <div class="task-part-title" style="line-height: 0.7rem;">
          <span class="solid" />
          <span>ISS-AIS评分</span>
        </div>
        <div>
          <van-field label="病人分类" placeholder="请选择病人分类" v-model="classification" required
            :rules="[{ required: true, message: '请选择病人分类' }]" readonly :disabled="readonly" />
          <issAis ref="issAis" v-model="form.issGradeList" required />
          <div style="height: 0.1rem;border-bottom: 0.04rem solid rgb(244,245,247);width: 91%;margin: 0 auto;"></div>
        </div>
      </div>
      <div>
        <div class="task-part-title">
          <span class="solid" />
          <span>抢救措施</span>
        </div>
        <med-radio-button-field label="是否抢救" v-model="form.isRescue" :select-options="WHETHER" required
          :rules="[{ required: true, message: '请选择是否抢救' }]" :disabled="readonly" />
        <div v-if="form.isRescue === '1'">
          <van-field label="抢救措施" right-icon="arrow-down" :disabled="readonly">
            <template #input>
              <med-select placeholder="请选择抢救措施" v-model="form.rescueMeasures" :multiple="{ stringValue: true }"
                :options="RESCUE_0001" :disabled="readonly" />
            </template>
          </van-field>
          <div v-if="(form.rescueMeasures || []).includes(RESCUE_0001[0].value)">
            <med-date-picker label="提出放置时间" v-model="form.applyPutTime" type="datetime" formatter="YYYY-MM-DD HH:mm"
              v-clear :disabled="readonly" @confirm="(val) => val ? $emit('validateTimeField') : ''" />
            <med-date-picker label="成功放置时间" v-model="form.putFinishTime" type="datetime" formatter="YYYY-MM-DD HH:mm"
              v-clear :disabled="readonly" @confirm="(val) => val ? $emit('validateTimeField') : ''" />
          </div>
          <div v-if="(form.rescueMeasures || []).includes(RESCUE_0001[1].value)" class="chlid-field">
            <med-date-picker label="申请输血时间" v-model="form.applyBloodTime" type="datetime" formatter="YYYY-MM-DD HH:mm"
              v-clear required :rules="[{ required: true, message: '请填写申请输血时间' }]" :disabled="readonly"
              @confirm="(val) => val ? $emit('validateTimeField') : ''" />
            <med-date-picker label="执行输血时间" v-model="form.executeBloodTime" type="datetime" formatter="YYYY-MM-DD HH:mm"
              v-clear required :rules="[{ required: true, message: '请填写执行输血时间' }]" :disabled="readonly"
              @confirm="(val) => val ? $emit('validateTimeField') : ''" />
            <med-number-field label="急诊输血等待时间" :value="transfusion" unit="分钟" placeholder="自动计算" readonly required
              :disabled="readonly" />
          </div>
          <div v-if="(form.rescueMeasures || []).includes(RESCUE_0001[2].value)" class="chlid-field">
            <med-date-picker label="提出建立时间" v-model="form.applyEstablishTime" type="datetime" formatter="YYYY-MM-DD HH:mm"
              v-clear required :rules="[{ required: true, message: '请填写提出建立时间' }]" :disabled="readonly"
              @confirm="(val) => val ? $emit('validateTimeField') : ''" />
            <med-date-picker label="成功建立时间" v-model="form.establishFinishTime" type="datetime"
              formatter="YYYY-MM-DD HH:mm" v-clear required :rules="[{ required: true, message: '请填写成功建立时间' }]"
              :disabled="readonly" @confirm="(val) => val ? $emit('validateTimeField') : ''" />
            <med-number-field label="人工气道建立时间" :value="airway" unit="分钟" placeholder="自动计算" readonly required
              :disabled="readonly" />
          </div>
          <div v-if="(form.rescueMeasures || []).includes(RESCUE_0001[3].value)" class="chlid-field">
            <med-date-picker label="提出手术医嘱时间" v-model="form.surgerAdviceTime" type="datetime" formatter="YYYY-MM-DD HH:mm"
              v-clear required :rules="[{ required: true, message: '请填写提出手术医嘱时间' }]" :disabled="readonly"
              @confirm="(val) => val ? $emit('validateTimeField') : ''" />
            <med-date-picker label="开始手术的时间" v-model="form.surgerStartTime" type="datetime" formatter="YYYY-MM-DD HH:mm"
              v-clear required :rules="[{ required: true, message: '请填写开始手术的时间' }]" :disabled="readonly"
              @confirm="(val) => val ? $emit('validateTimeField') : ''" />
            <med-number-field label="术前准备时间" :value="preparation" unit="分钟" placeholder="自动计算" readonly required
              :disabled="readonly" />
          </div>
          <div v-if="(form.rescueMeasures || []).includes(RESCUE_0001[4].value)" class="chlid-field">
            <med-date-picker label="开始使用时间" v-model="form.breathingStartTime" type="datetime" formatter="YYYY-MM-DD HH:mm"
              v-clear :disabled="readonly" />
            <med-date-picker label="结束使用时间" v-model="form.breathingEndTime" type="datetime" formatter="YYYY-MM-DD HH:mm"
              v-clear :disabled="readonly" />
            <med-number-field label="呼吸机使用时长" placeholder="自动计算" :value="useVentilatorDuration" unit="小时" v-clear
              :disabled="readonly" readonly />
            <med-radio-button-field label="是否发生了呼吸机相关肺炎" v-model="form.isPneumonia" :select-options="WHETHER" v-clear
              :disabled="readonly" />
          </div>
        </div>
        <med-text-field label="抢救说明" v-model="form.rescueInfo" :disabled="readonly" maxlength="100" />
      </div>
      <div>
        <div class="task-part-title">
          <span class="solid" />
          <span>手术记录</span>
        </div>
        <med-radio-button-field label="是否到达手术室" v-model="form.isArriveSurgerRoom" :select-options="WHETHER"
          :disabled="readonly" />
        <div v-if="form.isArriveSurgerRoom === '1'" class="chlid-field">
          <med-date-picker label="到达手术室时间" v-model="form.arriveSurgerRoomTime" type="datetime"
            formatter="YYYY-MM-DD HH:mm" v-clear :disabled="readonly"
            @confirm="(val) => val ? $emit('validateTimeField') : ''" />
          <med-date-picker label="离开手术室时间" v-model="form.leaveSurgerRoomTime" type="datetime" formatter="YYYY-MM-DD HH:mm"
            v-clear :disabled="readonly" @confirm="(val) => val ? $emit('validateTimeField') : ''" />
        </div>
      </div>
    </van-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import dictionariesMixin from '@mixins/dictionariesMixin'
export default {
  name: 'hdat',
  components: {
    IssAis: () => import('./components/IssAis.vue')
  },
  directives: {
    clear: {
      // 卸载组件时自动清除v-model值
      unbind: (...arg) => arg[2]?.data?.model?.callback(void 0)
    }
  },
  inject: ['readonly'],
  mixins: [dictionariesMixin],
  data() {
    return {
      isDetails: false, // 是否查看详情
      minDate: new Date(2020, 0, 10),
      maxDate: new Date(2025, 10, 1),
      isShowIssAis: false,
      form: {}
    }
  },
  activated() {
    this.detail()
  },
  mounted() {
    this.detail()
  },
  computed: {
    ...mapGetters(['registId', 'binding']),
    // 使用呼吸机时长
    useVentilatorDuration() {
      let result = this.computedTime(this.form.breathingEndTime, this.form.breathingStartTime, 'hh')
      return result > 0 ? result.toFixed(2) : result
    },
    classification() {
      let result = '未知'
      if (this.form.issGradeList && this.form.issGradeList.length > 0) {
        const arr = this.form.issGradeList.sort((a, b) => b.score - a.score)
        if (arr[0].score >= 16 || arr[0].max >= 3) {
          result = '严重创伤'
        } else {
          result = '创伤'
        }
      }
      return result
    },

    // 急诊输血等待时间(分钟)
    transfusion() {
      return this.form.applyBloodTime && this.form.executeBloodTime
        ? (this.$moment(this.form.executeBloodTime)
          .toDate()
          .getTime() -
          this.$moment(this.form.applyBloodTime)
            .toDate()
            .getTime()) /
        1000 /
        60
        : ''
    },
    // 人工气道建立时间(分钟)
    airway() {
      return this.form.applyEstablishTime && this.form.establishFinishTime
        ? (this.$moment(this.form.establishFinishTime)
          .toDate()
          .getTime() -
          this.$moment(this.form.applyEstablishTime)
            .toDate()
            .getTime()) /
        1000 /
        60
        : ''
    },
    // 术前准备时间(分钟)
    preparation() {
      return this.form.surgerAdviceTime && this.form.surgerStartTime
        ? (this.$moment(this.form.surgerStartTime)
          .toDate()
          .getTime() -
          this.$moment(this.form.surgerAdviceTime)
            .toDate()
            .getTime()) /
        1000 /
        60
        : ''
    }
  },
  methods: {
    validate() {
      // 提交校验
      return this.$refs.formData.validate()
    },
    saveTreatment() {
      // 保存院前急救
      this.$api.updatePatient({ treatment: this.form })
    },
    detail() {
      this.$api
        .detail({
          registId: this.registId,
          types: ['hdat']
        })
        .then(res => {
          if (res.code === '000000') {
            this.form = res.body.treatment
          }
        })
    }
  },
  watch: {
    binding() {
      // 监听绑定
      this.detail()
    },
    readonly: {
      immediate: true,
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.$refs.hdat.style.setProperty(
              '--requiredColor',
              'rgb(189,189,189)'
            )
          })
        } else {
          this.$nextTick(() => {
            this.$refs.hdat.style.setProperty('--requiredColor', 'red')
          })
        }
      }
    },
    form: {
      deep: true,
      handler(newVal, oldVal) {
        if (
          Object.getOwnPropertyNames(newVal).length ===
          Object.getOwnPropertyNames(oldVal).length
        ) {
          setTimeout(() => {
            this.saveTreatment()
          }, 1000)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.hdat-body {
  --requiredColor: red;
  width: 95%;
  margin: 0 auto;

  /deep/ .van-field--disabled .van-field__label {
    color: rgb(154, 154, 154);
  }

  /deep/ .van-field__control:disabled {
    -webkit-text-fill-color: rgb(154, 154, 154);
  }

  /deep/ .van-cell--required::before {
    color: var(--requiredColor);
  }

  /deep/ .van-cell-group {
    margin: 0.1rem auto;
    padding-bottom: 0.3rem;

    &>div {
      padding: 0rem 0.2rem 0rem 0.2rem;

      &>i {
        font-size: 0.45rem;
        margin-bottom: 0.3rem;
      }
    }
  }

  .score {
    margin: 0 auto;
    padding: 0.3rem 0.3rem 0.3rem 0.2rem;

    .score-head {
      height: 0.7rem;
      padding: 0.2rem 0 0 0;
      font-size: 0.4rem;
      display: flex;

      .score-title {
        flex: 3;
        height: 3rem;
        color: #646566;
      }

      .score-button {
        background-color: rgb(47, 89, 246);
        color: white;
        border: 2px solid #2f59f6;
        margin: 0.1rem 0 0 0.1rem;
        border-radius: 1rem;
        padding: 3px 0.2rem 0 0.2rem;
      }
    }

    .score-card {
      box-shadow: 0px 5px 10px #a6a6a6;
      margin: 0.3rem auto;
      border-radius: 0.15rem;

      .key-font {
        flex: 1;
        color: #aaa;
      }

      .card-head {
        padding: 0.2rem;
        font-size: 0.38rem;
        display: flex;

        .card-head-left {
          width: 0.1rem;
          height: 0.4rem;
          border-radius: 1rem;
          background-color: rgb(47, 89, 246);
          margin-right: 0.1rem;
        }
      }

      .card-body {
        font-size: 0.4rem;

        >div {
          margin-left: 0.4rem;
          line-height: 0.7rem;
        }

        .details-button {
          border: 1px solid rgb(47, 89, 246);
          color: rgb(47, 89, 246);
          border-radius: 0.5rem;
          padding: 0 0.2rem;
        }
      }
    }
  }

  .score::after {
    content: "";
    display: block;
    margin: 0 0.1rem 0 0.2rem;
    border-bottom: 2px solid rgb(239, 239, 239);
  }
}
</style>
