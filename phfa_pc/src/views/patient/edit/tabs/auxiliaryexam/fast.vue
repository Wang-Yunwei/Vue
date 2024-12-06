<template>
  <div>
    <el-input
      readonly
      placeholder="未评估"
      :value="result"
      v-bind="$attrs"
      @focus="showModal"
    >
      <el-button
        slot="append"
        icon="el-icon-edit-outline"
        @click="showModal"
      /></el-input>
    <el-dialog
      width="700px"
      title="FAST评估"
      :visible.sync="modalVisible"
      append-to-body
    >
      <el-form ref="form" :model="form">
        <el-divider content-position="left">F(脸)</el-divider>
        <el-form-item
          prop="PHEP_face"
          label=""
          :rules="[{ validator: validator('PHEP_face'), trigger: 'change' }]"
        >
          <med-radio
            v-model="findItem('PHEP_face').value"
            :readonly="readonly"
            border
            :options="dictionary[dic.PHEP_face]"
          />
        </el-form-item>
        <el-divider content-position="left">A(手臂)</el-divider>
        <el-form-item
          prop="PHEP_arm"
          label=""
          :rules="[{ validator: validator('PHEP_arm'), trigger: 'change' }]"
        >
          <med-radio
            v-model="findItem('PHEP_arm').value"
            :readonly="readonly"
            border
            :options="dictionary[dic.PHEP_arm]"
          />
        </el-form-item>
        <el-divider content-position="left">S(语言)</el-divider>
        <el-form-item
          prop="PHEP_language"
          label=""
          :rules="[
            { validator: validator('PHEP_language'), trigger: 'change' }
          ]"
        >
          <med-radio
            v-model="findItem('PHEP_language').value"
            :readonly="readonly"
            border
            :options="dictionary[dic.PHEP_language]"
          />
        </el-form-item>
        <el-divider content-position="left">T(时间)</el-divider>
        <el-form-item
          prop="PHEP_time"
          label="发病时间"
          :rules="[{ validator: validator('PHEP_time'), trigger: 'change' }]"
        >
          <fuzzy-date-picker
            v-model="findItem('PHEP_time').value"
            :readonly="readonly"
            :is-morb.sync="form.isMorb"
            style="width: 320px"
          />
        </el-form-item>
      </el-form>
      <el-alert
        show-icon
        :closable="false"
        title="如果存在三项中任何一项,请立刻呼救!"
        type="warning"
      />
      <div v-if="!readonly" slot="footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </div>
      <br v-else>
    </el-dialog>
  </div>
</template>

<script>
import { dicConstant as dic } from '@/constant'
import { mapGetters } from 'vuex'

export default {
  name: 'Fast',
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    readonly: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '未评估'
    }
  },
  data() {
    return {
      dic,
      modalVisible: false,
      form: {
        isMorb: '1',
        code: '',
        createDate: this.now(),
        createName: '',
        description: '',
        details: [
          {
            type: 'PHEP_face',
            value: ''
          },
          {
            type: 'PHEP_arm',
            value: ''
          },
          {
            type: 'PHEP_language',
            value: ''
          },
          {
            type: 'PHEP_time',
            value: ''
          }
        ],
        doctor: '',
        id: '',
        name: 'fast',
        patientId: this.$route.query?.patientId,
        relationId: '',
        time: this.now(),
        title: 'FAST评估',
        updateDate: this.now(),
        updateName: '',
        value: 0
      }
    }
  },
  computed: {
    ...mapGetters(['dictionary']),
    result() {
      return this.form?.description
    },
    patientId() {
      return this.$route.query.patientId
    }
  },
  watch: {
    'form.details': {
      deep: true,
      handler() {
        this.form.description = this.parseDescription()
      }
    },
    value(val) {
      let isFuzzy = '1'
      const timeVal = this.findItem('PHEP_time').value
      if (timeVal && !timeVal.includes('~')) {
        isFuzzy = '0'
      }
      this.form = {
        ...this.form,
        ...window.structuredClone(val),
        isMorb: isFuzzy
      }
    }
  },
  methods: {
    validator(type) {
      const map = {
        PHEP_face: '脸的评估',
        PHEP_arm: '手的评估',
        PHEP_language: '语言的评估',
        PHEP_time: '时间'
      }
      return (rule, value, callback) => {
        if (!this.findItem(type).value) {
          callback(new Error('请选择' + map[type]))
        } else {
          callback()
        }
      }
    },

    // 评分结果描述
    parseDescription() {
      const suspected = (this.form.details || []).some(
        (item) => item.value === '02'
      )
      return suspected ? '疑似卒中' : '未见异常'
    },
    findItem(type) {
      return this.form?.details.find((el) => el.type === type) || {}
    },
    now() {
      return this.$moment().format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]')
    },
    async showModal() {
      this.modalVisible = true
    },
    onClose() {
      this.modalVisible = false
      this.form = {
        ...this.form,
        ...window.structuredClone(this.value)
      }
    },
    onSave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const payload = { ...this.form, isMorb: undefined }

          this.$emit('input', payload)
          this.$emit('save', payload, () => {
            this.modalVisible = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 0 20px;
}
</style>
