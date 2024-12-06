<template>
  <div class="task-basic-info-wrapper">
    <med-header title="胸痛评估" @backClick="onClickLeft" />
    <van-cell-group>
      <med-fieldset legend="病情评估">
        <med-radio-group :data-source="datasource.diseaseAssessment" v-model="form.diseaseAssessment"></med-radio-group>
      </med-fieldset>
      <med-fieldset legend="其他症状">
        <med-checkbox-group stringValue :data-source="datasource.otherSymptom" v-model="form.otherSymptom"></med-checkbox-group>
      </med-fieldset>
    </van-cell-group>
  </div>
</template>
<script>
import methodMixin from '@mixins/methodMixin'
export default {
  props: ['patientId', 'value', 'parseResult'],
  data() {
    return {
      datasource: {
        diseaseAssessment: [],
        otherSymptom: []
      },
      form: {
        diseaseAssessment: '',
        otherSymptom: ''
      }
    }
  },
  created() {
    const res = this.getCodeListByKey([
      'PHFA_0037', // 胸痛评估_病情评估
      'PHFA_0038' // 胸痛评估_其它症状
    ])
    this.$set(this.datasource, 'diseaseAssessment', res.PHFA_0037)
    this.$set(this.datasource, 'otherSymptom', res.PHFA_0038)
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
          title: '胸痛评估', // 标题
          name: 'chestPain', // 评分名
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
              type: 'diseaseAssessment', // 病情评估
              value: this.form.diseaseAssessment
            },
            {
              type: 'otherSymptom', // 其他症状
              value: this.form.otherSymptom
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
