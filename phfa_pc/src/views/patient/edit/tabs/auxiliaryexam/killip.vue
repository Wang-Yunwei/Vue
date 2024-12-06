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
    <el-dialog title="killip评估" :visible.sync="modalVisible" append-to-body>
      <el-form ref="form" :model="form" label-width="0">
        <el-form-item prop="PHEP_killip" label="">
          <el-radio-group
            v-model="findItem('PHEP_killip').value"
            :readonly="readonly"
          >
            <el-radio
              v-for="item in dictionary[dic.killip]"
              :key="item.value"
              border
              :label="item.value"
              class="killip-radio"
            ><b>{{ item.value }}</b><br>
              <div class="description">{{ item.label }}</div></el-radio>
          </el-radio-group>
        </el-form-item>
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
  name: 'Killip',
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
            type: 'PHEP_killip',
            value: ''
          }
        ],
        doctor: '',
        id: '',
        name: 'killip',
        patientId: this.$route.query?.patientId,
        relationId: '',
        time: this.now(),
        title: 'Killip',
        updateDate: this.now(),
        updateName: '',
        value: 0
      }
    }
  },
  computed: {
    ...mapGetters(['dictionary']),
    judgmentBasis() {
      return this.dictionary[dic.KillipBasis]
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
      return [result?.value, result?.label].filter((el) => el).join(' ')
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
.killip-radio {
  height: auto;
  margin-left: 0 !important;
  margin-bottom: 20px;
  line-height: 1.8;
  width: 100%;
  &:last-child {
    margin-bottom: 0;
  }
  b {
    font-size: 15px;
  }
  .description {
    padding-left: 24px;
    padding-bottom: 10px;
    white-space: normal;
  }
}
</style>
