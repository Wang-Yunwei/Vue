<template>
  <div class="inspection-body" ref="inspection">
    <van-form ref="formData" :show-error-message="false">
      <div>
        <div class="task-part-title" style="margin-bottom: 0.3rem;">
          <span class="solid" />
          <span>专科评估</span>
        </div>
        <Score ref="ti" v-model="form.tiGrade" title="院内TI创伤评分" label="TI" required />
        <div style="border-bottom: 0.04rem solid rgb(244,245,247);width: 91%;margin: 0 auto;"></div>
        <Score ref="gcs" v-model="form.gcsGrade" title="GCS评分" label="GCS" required />
        <div style="border-bottom: 0.04rem solid rgb(244,245,247);width: 91%;margin: 0 auto;"></div>
      </div>
      <div>
        <div class="task-part-title">
          <span class="solid" />
          <span>检验检查</span>
        </div>
        <med-radio-button-field label="是否检查" v-model="form.isInspect" :select-options="WHETHER" required :rules="[{ required: true, message: '请选择是否检查' }]" :disabled="readonly" />
        <van-field v-if="form.isInspect === '1'" label="检查类型" placeholder="请选择检查类型" right-icon="arrow-down" :disabled="readonly">
          <template #input>
            <med-select v-model="form.inspectType" :multiple="{ stringValue: true }" :options="INSPECT_0001" :disabled="readonly" v-clear />
          </template>
        </van-field>
        <div v-if="(form.inspectType || []).includes(INSPECT_0001[0].value)">
          <med-date-picker label="全身快速CT完成时间" v-model="form.bodyCtFinishTime" type="datetime" formatter="YYYY-MM-DD HH:mm" v-clear required :rules="[{ required: true, message: '请填写全身快速CT完成时间' }]" :disabled="readonly" @confirm="(val) => val ? $emit('validateTimeField') : ''" />
          <van-field label="扫描部位" placeholder="请选择扫描部位" right-icon="arrow-down" :disabled="readonly">
            <template #input>
              <med-select v-model="form.scanSite" :multiple="{ stringValue: true }" :options="SCAN_SITE" :disabled="readonly" v-clear />
            </template>
          </van-field>
        </div>
        <div v-if="(form.inspectType || []).includes(INSPECT_0001[1].value)">
          <med-date-picker label="胸片X片完成时间" v-model="form.chestXFinishTime" type="datetime" formatter="YYYY-MM-DD HH:mm" v-clear required :rules="[{ required: true, message: '请填写胸片X片完成时间' }]" :disabled="readonly" @confirm="(val) => val ? $emit('validateTimeField') : ''" />
          <med-radio-select-field label="胸腔出血" v-model="form.chestBleeding" :select-options="[{ label: '有', value: '1' }, { label: '无', value: '0' }]" required :rules="[{ required: true, message: '请选择胸腔出血' }]" />
        </div>
        <div v-if="(form.inspectType || []).includes(INSPECT_0001[2].value)">
          <med-date-picker label="骨盆X片完成时间" v-model="form.pelvisXFinishTime" type="datetime" formatter="YYYY-MM-DD HH:mm" v-clear required :rules="[{ required: true, message: '请填写骨盆X片完成时间' }]" :disabled="readonly" @confirm="(val) => val ? $emit('validateTimeField') : ''" />
          <med-radio-select-field label="盆腔出血" v-model="form.pelvisBleeding" :select-options="[{ label: '有', value: '1' }, { label: '无', value: '0' }]" required :rules="[{ required: true, message: '请选择盆腔出血' }]" />
          <med-radio-select-field label="骨盆骨折" v-model="form.pelvisFracture" :select-options="[{ label: '有', value: '1' }, { label: '无', value: '0' }]" required :rules="[{ required: true, message: '请选择骨盆骨折' }]" />
        </div>
        <div v-if="(form.inspectType || []).includes(INSPECT_0001[3].value)">
          <med-date-picker label="FAST完成时间" v-model="form.fastFinishTime" type="datetime" formatter="YYYY-MM-DD HH:mm" v-clear required :rules="[{ required: true, message: '请填写FAST完成时间' }]" :disabled="readonly" @confirm="(val) => val ? $emit('validateTimeField') : ''" />
          <med-radio-select-field label="FAST胸腹盆腔出血" v-model="form.fastChestBleeding" :select-options="[{ label: '有', value: '1' }, { label: '无', value: '0' }]" required :rules="[{ required: true, message: '请选择FAST胸腹盆腔出血' }]" />
          <van-field label="FAST出血部位" placeholder="FAST出血部位" right-icon="arrow-down" :disabled="readonly" required :rules="[{ required: true, message: '请选择FAST出血部位' }]" v-if="form.fastChestBleeding === '1'">
            <template #input>
              <med-select v-model="form.fastBleedingPart" :multiple="{ stringValue: true }" :options="FAST_BLEEDING_PART" :disabled="readonly" v-clear />
            </template>
          </van-field>
        </div>
        <van-field v-if="(form.inspectType || []).includes(INSPECT_0001[4].value)" label="其他X片类型" placeholder="请填写其它X片类型" v-model="form.otherXType" v-clear :disabled="readonly" />
        <med-date-picker v-if="(form.inspectType || []).includes(INSPECT_0001[4].value)" label="其他X片类型完成时间" v-model="form.otherXFinishTime" type="datetime" formatter="YYYY-MM-DD HH:mm" v-clear :disabled="readonly" @confirm="(val) => val ? $emit('validateTimeField') : ''" />
        <med-radio-button-field label="是否检验" v-model="form.isOtherInspect" :select-options="WHETHER" required :rules="[{ required: true, message: '请选择是否检验' }]" :disabled="readonly" />
        <van-field v-if="form.isOtherInspect === '1'" label="检验类型" placeholder="请选择检验类型" right-icon="arrow-down" :disabled="readonly">
          <template #input>
            <med-select v-model="form.otherInspectType" :multiple="{ stringValue: true }" :options="EXAMINE_0001" :disabled="readonly" v-clear />
          </template>
        </van-field>
        <med-number-field label="血红蛋白" v-model="form.hemoglobin" unit="g/L" :disabled="readonly" v-float="{ scale: 1, min: 30, max: 47 }" required :rules="[{ required: true, message: '请选择血红蛋白' }]" v-if="(form.otherInspectType || []).includes(EXAMINE_0001[0].value)" />
        <med-radio-select-field label="凝血功能是否正常" v-model="form.clottingNormal" :select-options="[{ label: '正常', value: '1' }, { label: '异常', value: '0' }]" required :rules="[{ required: true, message: '请选择凝血功能是否正常' }]" v-if="(form.otherInspectType || []).includes(EXAMINE_0001[1].value)" />
        <med-text-field label="检查检验说明" v-model="form.inspectInfo" maxlength="100" :disabled="readonly" />
      </div>
      <div>
        <div class="task-part-title">
          <span class="solid" />
          <span>入院诊断</span>
        </div>
        <med-text-field label="入院诊断" v-model="form.diagnosis" :disabled="readonly" @change="changeDiagnosis" maxlength="100" />
      </div>
    </van-form>
  </div>
</template>
<script>
import * as types from '@/store/mutations-types'
import { mapGetters, mapMutations } from 'vuex'
import dictionariesMixin from '@mixins/dictionariesMixin'
export default {
  name: 'inspection',
  components: {
    Score: () => import('./components/Score.vue')
  },
  inject: ['readonly'],
  directives: {
    clear: {
      // 卸载组件时自动清除v-model值
      unbind: (...arg) => arg[2]?.data?.model?.callback(void 0)
    }
  },
  mixins: [dictionariesMixin],
  data() {
    return {
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
    ...mapGetters(['registId', 'binding'])
  },
  methods: {
    ...mapMutations([types.SET_ADMITTING_DIAGNOSIS]),
    changeDiagnosis(val) {
      this[types.SET_ADMITTING_DIAGNOSIS](val)
    },
    validate() {
      return this.$refs.formData.validate()
    },
    saveInspection() {
      // 保存检验检查
      this.$api.updatePatient({
        inspection: this.form
      })
    },
    detail() {
      this.$api
        .detail({
          registId: this.registId,
          types: ['inspection']
        })
        .then(res => {
          if (res.code === '000000') {
            this.form = res.body.inspection
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
            this.$refs.inspection.style.setProperty(
              '--requiredColor',
              'rgb(189,189,189)'
            )
          })
        } else {
          this.$nextTick(() => {
            this.$refs.inspection.style.setProperty('--requiredColor', 'red')
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
            this.saveInspection()
          }, 1000)
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.inspection-body {
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
}
</style>
