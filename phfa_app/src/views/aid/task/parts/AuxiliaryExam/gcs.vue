<template>
  <div class="task-aux-gcs-wrapper">
    <med-header title="GCS评分" @backClick="onClickLeft" />
    <div class="scroll-box">
      <med-fieldset legend="睁眼反应(E)">
        <med-radio-group :data-source="datasource.eye" v-model="form.PHEP_eyeReaction"></med-radio-group>
      </med-fieldset>
      <med-fieldset legend="语音反应(V)">
        <med-radio-group :data-source="datasource.sound" v-model="form.PHEP_voiceReaction"></med-radio-group>
      </med-fieldset>
      <med-fieldset legend="肢体运动(M)">
        <med-radio-group :data-source="datasource.body" v-model="form.PHEP_limbsMotion"></med-radio-group>
      </med-fieldset>
    </div>
    <div class="footbar flex-c-b">
      <div class="left-part flex-c-b">
        <div class="title">GCS总评分</div>
        <div class="score">{{ score }}分</div>
      </div>
      <div class="result">{{ description }}</div>
    </div>
  </div>
</template>
<script>
import methodMixin from '@mixins/methodMixin'
export default {
  props: ['patientId', 'value', 'parseResult'],
  data() {
    return {
      description: '',
      datasource: {
        eye: [],
        sound: [],
        body: []
      },
      form: {
        checkTime: ''
      }
    }
  },
  computed: {
    score() {
      const fieldMap = {
        eye: 'PHEP_eyeReaction',
        sound: 'PHEP_voiceReaction',
        body: 'PHEP_limbsMotion'
      }
      return Object.keys(this.datasource).reduce((result, key) => {
        const matched = this.datasource[key].find(
          item => item.value === this.form[fieldMap[key]]
        )
        return result + (matched ? matched.score : 0)
      }, 0)
    }
  },
  created() {
    const res = this.getCodeListByKey([
      'PHFA_0042', // GCS评分_睁眼反应
      'PHFA_0043', // GCS评分_语音反应
      'PHFA_0044' // GCS评分_肢体运动
    ])
    this.setDataSource({
      eye: res.PHFA_0042,
      sound: res.PHFA_0043,
      body: res.PHFA_0044
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
          title: 'GCS评分', // 标题
          name: 'gcs', // 评分名
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
              type: 'PHEP_eyeReaction', // 睁眼反应
              value: this.form.PHEP_eyeReaction
            },
            {
              type: 'PHEP_voiceReaction', // 语音反应
              value: this.form.PHEP_voiceReaction
            },
            {
              type: 'PHEP_limbsMotion', // 肢体运动
              value: this.form.PHEP_limbsMotion
            }
          ]
        }
      }
      payload.estimateDto.description = this.parseResult(payload.estimateDto)
      this.description = payload.estimateDto.description
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
  max-height: calc(100vh - 3.4rem);
}

.task-aux-gcs-wrapper {
  padding: 0.2rem 0 0rem 0;
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
