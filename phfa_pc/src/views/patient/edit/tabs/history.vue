<template>
  <el-form ref="form" :model="form" label-width="120px" label-position="top">
    <el-row :gutter="24">
      <el-col :span="5">
        <el-form-item label="病历编号" prop="code">
          <el-input
            v-model="form.code"
            :readonly="viewMode"
            size="mini"
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="病史提供者" prop="medicalHisProType">
          <el-radio-group
            v-model="form.medicalHisProType"
            size="mini"
            :readonly="viewMode"
          >
            <el-radio
              v-for="g in dictionary[dic.medicalHistoryProvider]"
              :key="g.value"
              :label="g.value"
            >{{ g.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="病史提供者姓名" prop="historyProvider">
          <el-input
            v-model="form.historyProvider"
            :readonly="viewMode"
            size="mini"
            placeholder="请输入"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="发病时间" prop="morbtimearea">
          <fuzzy-date-picker
            v-model="form.morbtimearea"
            :readonly="viewMode"
            size="mini"
            :is-morb.sync="form.isMorb"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="主诉" prop="chiefComplaint">
          <history-temp
            v-model="form.chiefComplaint"
            :readonly="viewMode"
            size="mini"
            placeholder="主诉"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="现病史" prop="presentIllness">
          <history-temp
            v-model="form.presentIllness"
            :readonly="viewMode"
            size="mini"
            type="presentIllness"
            placeholder="现病史"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="既往史" prop="pastHistory">
          <past-history
            v-model="form.pastHistory"
            :readonly="viewMode"
            size="mini"
            placeholder="输入或选择"
            :options="pastHistoryList"
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="过敏史" prop="allergicHistory">
          <past-history
            v-model="form.allergicHistory"
            :readonly="viewMode"
            size="mini"
            placeholder="输入或选择"
            :options="allergicHistoryList"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import HistoryTemp from '@/components/HistoryTemp'
import PastHistory from '@/components/PastHistory'
import FuzzyDatePicker from '@/components/FuzzyDatePicker'
import { dicConstant as dic } from '@/constant'
import { mapGetters } from 'vuex'

export default {
  name: 'History',
  components: {
    PastHistory,
    HistoryTemp,
    FuzzyDatePicker
  },
  props: {
    viewMode: {
      type: Boolean,
      default: false
    },
    detailData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dic,
      form: {
        recordId: '',
        morbtimearea: '',
        isMorb: '1'
      }
    }
  },
  computed: {
    ...mapGetters(['dictionary']),
    pastHistoryList() {
      return (this.dictionary[dic.pastHistory] || []).map((item) => ({
        ...item,
        value: item.label
      }))
    },
    allergicHistoryList() {
      return (this.dictionary[dic.allergicHistory] || []).map((item) => ({
        ...item,
        value: item.label
      }))
    },
    driverList() {
      return (this.dictionary[this.dic.driver] || []).map((d) => ({
        ...d,
        value: d.label
      }))
    }
  },
  watch: {
    detailData: {
      immediate: true,
      handler(val) {
        if (val) {
          this.form = { ...val.medPhepMedicalRecordsEntity }
        }
      }
    }
  },
  methods: {
    onSave() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          const payload = { medPhepMedicalRecordsEntity: this.form }
          this.$emit('save', payload)
        }
      })
    }
  }
}
</script>
