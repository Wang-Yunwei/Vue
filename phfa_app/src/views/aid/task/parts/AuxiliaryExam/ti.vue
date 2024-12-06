<template>
  <div class="task-basic-info-wrapper">
    <med-header title="TI评估" @backClick="onClickLeft" />
    <div class="scroll-box">
      <med-fieldset legend="受伤部位">
        <med-radio-group :data-source="datasource.injuredPosition" v-model="form.TI_injuredPosition"></med-radio-group>
      </med-fieldset>
      <med-fieldset legend="受伤类型">
        <med-radio-group :data-source="datasource.injuredType" v-model="form.TI_injuredType"></med-radio-group>
      </med-fieldset>
      <med-fieldset legend="脉搏">
        <med-radio-group :data-source="datasource.pulse" v-model="form.TI_pulse"></med-radio-group>
      </med-fieldset>
      <med-fieldset legend="意识状态">
        <med-radio-group :data-source="datasource.consciousnessState" v-model="form.TI_consciousnessState"></med-radio-group>
      </med-fieldset>
      <med-fieldset legend="呼吸状态">
        <med-radio-group :data-source="datasource.breathingState" v-model="form.TI_breathingState"></med-radio-group>
      </med-fieldset>
    </div>
    <div class="footbar flex-c-b">
      <div class="left-part flex-c-b">
        <div class="title">TI总评分</div>
        <div class="score">{{ score }}分</div>
      </div>
      <div class="result">{{ description }}</div>
    </div>
  </div>
</template>
<script>
import methodMixin from '@mixins/methodMixin'
export default {
  props: ['patientId', 'value', 'parse-result'],
  data() {
    return {
      description: '',
      datasource: {
        injuredPosition: [],
        injuredType: [],
        pulse: [],
        consciousnessState: [],
        breathingState: []
      },
      form: {
        checkTime: '',
        TI_injuredPosition: '',
        TI_injuredType: '',
        TI_pulse: '',
        TI_consciousnessState: '',
        TI_breathingState: ''
      }
    }
  },
  computed: {
    score() {
      return Object.keys(this.datasource).reduce((result, key) => {
        const matched = this.datasource[key].find(
          item => item.value === this.form[`TI_${key}`]
        )
        return result + (matched ? matched.score : 0)
      }, 0)
    }
  },
  created() {
    const res = this.getCodeListByKey([
      'PHFA_0050', // TI评估_受伤部位
      'PHFA_0051', // TI评估_受伤类型
      'PHFA_0052', // TI评估_脉搏
      'PHFA_0053', // TI评估_意识状态
      'PHFA_0054' // TI评估_呼吸状态
    ])
    this.setDataSource({
      injuredPosition: res.PHFA_0050,
      injuredType: res.PHFA_0051,
      pulse: res.PHFA_0052,
      consciousnessState: res.PHFA_0053,
      breathingState: res.PHFA_0054
    })
  },
  methods: {
    setDataSource(obj) {
      Object.keys(obj || {}).forEach(key => {
        const scoredArr = (obj[key] || []).map(item => ({
          ...item,
          score: parseInt(item.extend) || 0
          // score: parseInt(item.label.replace(/.*?\s(\d*?)分/, '$1')) || 0
        }))
        this.$set(this.datasource, key, scoredArr)
      })
    },
    onClickLeft() {
      this.$emit('back')
    },
    async handleSave() {
      const now = this.$moment().format('YYYY-MM-DD[T]HH:mm:ss')
      const payload = {
        patientId: this.patientId,
        estimateDto: {
          id: '', // 评分主表_主键ID 新增: 后端自处理
          title: 'TI评估', // 标题
          name: 'ti', // 评分名
          value: this.score, // 分值
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
              type: 'TI_injuredPosition', // 受伤部位
              value: this.form.TI_injuredPosition
            },
            {
              type: 'TI_injuredType', // 受伤类型
              value: this.form.TI_injuredType
            },
            {
              type: 'TI_pulse', // 脉搏
              value: this.form.TI_pulse
            },
            {
              type: 'TI_consciousnessState', // 意识
              value: this.form.TI_consciousnessState
            },
            {
              type: 'TI_breathingState', // 呼吸
              value: this.form.TI_breathingState
            }
          ]
        }
      }
      payload.estimateDto.description = this.parseResult(payload.estimateDto)
      this.description = payload.estimateDto.description
      this.$api.supSaveOrUpdate(payload)
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
          this.description = nVal?.description
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
  max-height: calc(100vh - 3.2rem);
}

.footbar {
  font-size: 0.36rem;
  box-shadow: 0 -1px 20px rgb(231, 231, 231);

  .left-part {
    flex: auto;
    padding: 0 0.4rem;

    .score {
      font-size: 0.4rem;
      color: rgb(255, 123, 0);
    }
  }

  .result {
    height: 1.2rem;
    line-height: 1.2rem;
    color: #fff;
    flex: 0 1 3rem;
    background-color: #5e74fe;
    text-align: center;
  }
}
</style>
