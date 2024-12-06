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
    <el-dialog title="胸痛评估" :visible.sync="modalVisible" append-to-body>
      <el-form ref="form" :model="form" label-width="120px">
        <div class="flex-c-b">
          <el-form-item prop="diseaseAssessment" label="病情评估">
            <med-radio
              v-model="findItem('diseaseAssessment').value"
              :readonly="readonly"
              border
              :options="dictionary[dic.chestPainIllness]"
            />
          </el-form-item>
          <el-form-item prop="otherSymptom" label="其他症状">
            <med-checkbox
              v-model="findItem('otherSymptom').value"
              :readonly="readonly"
              border
              stringify-value
              :options="dictionary[dic.chestPainElse]"
            />
          </el-form-item>
        </div>
      </el-form>
      <div v-if="!readonly" slot="footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { dicConstant as dic } from '@/constant'
import { mapGetters } from 'vuex'

export default {
  name: 'ChestPain',
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
        code: '',
        createDate: this.now(),
        createName: '',
        description: '',
        details: [
          {
            type: 'diseaseAssessment',
            value: ''
          },
          {
            type: 'otherSymptom',
            value: ''
          }
        ],
        doctor: '',
        id: '',
        name: 'chestPain',
        patientId: this.$route.query?.patientId,
        relationId: '',
        time: this.now(),
        title: '胸痛评估',
        updateDate: this.now(),
        updateName: '',
        value: 0
      }
    }
  },
  computed: {
    ...mapGetters(['dictionary']),
    judgmentBasis() {
      return this.dictionary[dic.chestPainBasis]
    },
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
      console.log(val)
      this.form = {
        ...this.form,
        ...window.structuredClone(val)
      }
    }
  },
  methods: {
    // 在评分标准中查找当前分值所属的那一项
    findRangeResult(val, list = []) {
      const numVal = Number(val)
      const matched = (list || []).find((ele) => {
        if (ele.value.includes('≥')) {
          if (numVal >= Number(ele.value.replace('≥', ''))) {
            return true
          }
          return false
        }
        if (ele.value.includes('≤')) {
          if (numVal <= Number(ele.value.replace('≤', ''))) {
            return true
          }
          return false
        }
        const [start, end] = ele.value.split('-')
        return end
          ? numVal >= Number(start) && numVal <= Number(end)
          : start === val
      })
      return matched
    },
    // 评分结果描述
    parseDescription() {
      const result = this.findRangeResult(
        this.form.details[0]?.value,
        this.judgmentBasis
      )
      return result?.label
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
          const payload = { ...this.form }

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
.unit-select {
  padding: 10px 20px;
  margin: -10px -20px;
  ::v-deep {
    .el-input {
      width: 100px;
    }
  }
}
</style>
