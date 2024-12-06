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
    <el-dialog title="TI评估" :visible.sync="modalVisible" append-to-body>
      <el-form ref="form" :model="form" label-width="120px">
        <div class="flex-c-b">
          <el-form-item
            label="受伤部位"
            prop="checkTime"
            style="flex: 1 1 100%"
          >
            <med-radio
              v-model="findItem('TI_injuredPosition').value"
              :readonly="readonly"
              border
              :options="dictionary[dic.TI_injuredPosition]"
            />
          </el-form-item>
          <el-form-item
            label="受伤类型"
            prop="TI_injuredType"
            style="flex: 1 1 100%"
          >
            <med-radio
              v-model="findItem('TI_injuredType').value"
              :readonly="readonly"
              border
              :options="dictionary[dic.TI_injuredType]"
            />
          </el-form-item>
          <el-form-item label="脉搏" prop="TI_pulse" style="flex: 1 1 100%">
            <med-radio
              v-model="findItem('TI_pulse').value"
              :readonly="readonly"
              border
              :options="dictionary[dic.TI_pulse]"
            />
          </el-form-item>
          <el-form-item
            label="意识状态"
            prop="TI_consciousnessState"
            style="flex: 1 1 100%"
          >
            <med-radio
              v-model="findItem('TI_consciousnessState').value"
              :readonly="readonly"
              border
              :options="dictionary[dic.TI_consciousnessState]"
            />
          </el-form-item>
          <el-form-item
            label="呼吸状态"
            prop="TI_breathingState"
            style="flex: 1 1 100%"
          >
            <med-radio
              v-model="findItem('TI_breathingState').value"
              :readonly="readonly"
              border
              :options="dictionary[dic.TI_breathingState]"
            />
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="flex-c-b">
        <div class="result">
          <span>TI总评分: </span>
          <span class="score">{{ score }}分 </span>
          <span class="description">{{ result }} </span>
        </div>
        <div v-if="!readonly">
          <el-button @click="onClose">取消</el-button>
          <el-button type="primary" @click="onSave">保存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { dicConstant as dic } from '@/constant'
import { mapGetters } from 'vuex'

export default {
  name: 'TI',
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
            type: 'TI_injuredPosition',
            value: ''
          },
          {
            type: 'TI_injuredType',
            value: ''
          },
          {
            type: 'TI_pulse',
            value: ''
          },
          {
            type: 'TI_consciousnessState',
            value: ''
          },
          {
            type: 'TI_breathingState',
            value: ''
          }
        ],
        doctor: '',
        id: '',
        name: 'ti',
        patientId: this.$route?.query?.patientId,
        relationId: '',
        time: this.now(),
        title: 'TI评估',
        updateDate: this.now(),
        updateName: '',
        value: 0
      }
    }
  },
  computed: {
    ...mapGetters(['dictionary']),
    judgmentBasis() {
      return this.dictionary[dic.TIBasis]
    },
    score() {
      return this.form?.details?.reduce((res, cur) => {
        const realDicCode = dic[cur.type]
        const matchedList = this.dictionary[realDicCode] || []
        const metachedItem =
          matchedList.find((el) => el.value === cur.value) || {}
        const score =
          parseInt((metachedItem.label || '').replace(/.*?\s(\d*?)分/, '$1')) ||
          0
        return score + res
      }, 0)
    },
    result() {
      return this.form?.description
    },
    patientId() {
      return this.$route.query.patientId
    }
  },
  watch: {
    score(val) {
      this.form.value = val
      this.form.description = this.parseDescription()
    },
    value(val) {
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
      const result = this.findRangeResult(this.score, this.judgmentBasis)
      return result?.label
      // if (['chestPain'].includes(type)) {
      //   const result = this.findRangeResult(
      //     this.form.details[0]?.value,
      //     this.judgmentBasis
      //   )
      //   return result?.label
      // }
      // if (['killip'].includes(type)) {
      //   const result = this.findRangeResult(
      //     this.form.details[0]?.value,
      //     this.judgmentBasis
      //   )
      //   return [result?.value, result?.label].filter((el) => el).join(' ')
      // }
      // if (['fast'].includes(type)) {
      //   const suspected = (this.form.details || []).some(
      //     (item) => item.value === '02'
      //   )
      //   return suspected ? '疑似卒中' : '未见异常'
      // }
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
.result {
  font-size: 15px;
  color: #646de8;
  border: 1px solid #646de8;
  padding: 8px 0 8px 8px;
  border-radius: 4px;

  .score {
    color: rgb(255, 128, 0);
    padding-right: 4px;
  }
  .description {
    background: #646de8;
    color: #fff;
    padding: 8px 10px;
  }
}
</style>
