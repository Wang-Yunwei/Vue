<template>
  <div class="task-basic-info-wrapper">
    <med-header title="FAST评估" @backClick="onClickLeft" />
    <van-cell-group>
      <med-fieldset legend="F(脸)">
        <med-radio-group :data-source="datasource.PHEP_face" v-model="form.PHEP_face"></med-radio-group>
      </med-fieldset>
      <med-fieldset legend="A(手臂)">
        <med-radio-group :data-source="datasource.PHEP_arm" v-model="form.PHEP_arm"></med-radio-group>
      </med-fieldset>
      <med-fieldset legend="S(语言)">
        <med-radio-group :data-source="datasource.PHEP_language" v-model="form.PHEP_language"></med-radio-group>
      </med-fieldset>
      <med-fieldset legend="T(时间)">
        <van-notice-bar left-icon="volume-o" text="如果存在三项中任何一项,请立刻呼救!" />
        <van-cell title="发病时间" class="onset-time">
          <fuzzy-datetime-picker v-model="form.PHEP_time" :ranges="ranges" :fuzzy.sync="form.isMorb" @change="onTimeChange" />
        </van-cell>
        <!-- <van-field
          v-model="form.morbtimearea"
          label="发病时间"
          placeholder="上午 (9:00-12:00)"
        >
          <template #right-icon>
            <ISwitch size="large" v-model="form.isMorb">
              <span slot="open">区间</span>
              <span slot="close">固定</span>
            </ISwitch>
          </template>
</van-field> -->
      </med-fieldset>
    </van-cell-group>
  </div>
</template>
<script>
import methodMixin from '@mixins/methodMixin'
import FuzzyDatetimePicker from '../../components/FuzzyDatetimePicker'
import { mapGetters } from 'vuex'
export default {
  components: { FuzzyDatetimePicker },
  props: ['patientId', 'value', 'parseResult'],
  data() {
    return {
      ranges: [],
      datasource: {
        face: [],
        arm: [],
        language: [],
        time: []
      },
      form: {
        PHEP_face: '',
        PHEP_arm: '',
        PHEP_language: '',
        PHEP_time: ''
      }
    }
  },
  computed: {
    ...mapGetters(['medicalHistory']),
    morbtimearea() {
      return this.medicalHistory?.morbtimearea
    },
    isMorb() {
      return this.medicalHistory.isMorb
    }
  },
  created() {
    const res = this.getCodeListByKey([
      'PHFA_0039', // FAST评估_F(脸)
      'PHFA_0040', // FAST评估_A(手臂)
      'PHFA_0041', // FAST评估_S(语言)
      'PHFA_0013' // 发病时间
    ])
    this.$set(this.datasource, 'PHEP_face', res.PHFA_0039)
    this.$set(this.datasource, 'PHEP_arm', res.PHFA_0040)
    this.$set(this.datasource, 'PHEP_language', res.PHFA_0041)
    this.ranges = res.PHFA_0013

    if (this.morbtimearea) {
      // 自动填充外面的已选择的发病时间
      this.form.PHEP_time = this.morbtimearea
      this.form.isMorb = this.isMorb
    }
  },
  methods: {
    onTimeChange() {
      this.$bus.$emit('morbtimeareaChanged', {
        morbtimearea: this.form.PHEP_time,
        isMorb: this.form.isMorb
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
          title: 'FAST评估', // 标题
          name: 'fast', // 评分名
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
              type: 'PHEP_face', // 脸
              value: this.form.PHEP_face
            },
            {
              type: 'PHEP_arm', // 手
              value: this.form.PHEP_arm
            },
            {
              type: 'PHEP_language', // 语言
              value: this.form.PHEP_language
            },
            {
              type: 'PHEP_time', // 时间,时间范围
              value: this.form.PHEP_time
            }
            // {
            //   type: 'morbtimearea', // 时间范围 20220602 与后端开发沟通后 此处字段多余拿掉
            //   value: this.form.PHEP_time
            // }
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
      handler(e) {
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
.van-notice-bar {
  color: #f8f8f9;
  background-color: #fd7d3b;
  border-radius: 0.2rem;
  height: 0.8rem;
}

.onset-time {
  padding-left: 0;
  padding-right: 0;

  /deep/.van-cell__title {
    flex: 0 0 auto;
  }
}
</style>
