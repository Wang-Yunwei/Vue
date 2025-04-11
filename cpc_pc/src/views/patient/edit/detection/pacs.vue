<template>
  <div>
    <med-subtitle title="影像学检查" />
    <el-row :gutter="24">
      <el-col :span="6">
        <med-radio-field
          v-model="data.hasMedicalimages"
          form-prop="inspection.hasMedicalimages"
          :disabled="disabled"
          label="是否影像学检查"
          :select-options="yesOrNoDic"
          :rules="[
            { required: true, message: '请填写是否影像学检查', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <div v-if="data.hasMedicalimages == '1'">
      <el-row :gutter="24">
        <el-col :span="6">
          <med-checkbox-field
            v-model="data.medicalimagesType"
            display-type="check"
            form-prop="inspection.medicalimagesType"
            label="影像学检查类型"
            :disabled="disabled"
            :select-options="pacsTypeDic"
            :forbidden="pacsTypeForbidden"
            :rules="[
              { required: true, message: '请填写影像学检查类型', trigger: 'change' }
            ]"
          />
        </el-col>
      </el-row>
      <el-row v-if="isPacs('1')" :gutter="24">
        <el-col :span="6">
          <med-datetime-field
            v-model="dataScreenage.ect.noticeTime"
            form-prop="screenage.ect.noticeTime"
            label="通知CT室时间"
            :min-date="minDate"
            :max-date="maxDate"
            :disabled="disabled"
            :rules="[
              { required: true, message: '请填写通知CT室时间', trigger: 'change' }
            ]"
          />
        </el-col>
        <el-col :span="6">
          <med-datetime-field
            v-model="dataScreenage.ect.enterTime"
            form-prop="screenage.ect.enterTime"
            label="CT室完成准备"
            :min-date="minDate"
            :max-date="maxDate"
            :disabled="disabled"
            :rules="[
              { required: true, message: '请填写CT室完成准备', trigger: 'change' }
            ]"
          />
        </el-col>
        <el-col :span="6">
          <med-datetime-field
            v-model="dataScreenage.ect.checkTime"
            form-prop="screenage.ect.checkTime"
            label="CT扫描开始时间"
            :min-date="minDate"
            :max-date="maxDate"
            :disabled="disabled"
          />
        </el-col>
        <el-col :span="6">
          <med-datetime-field
            v-model="dataScreenage.ect.reportTime"
            form-prop="screenage.ect.reportTime"
            label="CT报告时间"
            :min-date="minDate"
            :max-date="maxDate"
            :disabled="disabled"
          />
        </el-col>
      </el-row>
      <el-row v-if="isPacs('2') && data.diagnosis !== '5'" :gutter="24">
        <el-col :span="6">
          <med-datetime-field
            v-model="dataScreenage.cdu.noticeTime"
            form-prop="screenage.cdu.noticeTime"
            label="通知彩超室时间"
            :min-date="minDate"
            :max-date="maxDate"
            :disabled="disabled"
          />
        </el-col>
        <el-col :span="6">
          <med-datetime-field
            v-model="dataScreenage.cdu.checkTime"
            form-prop="screenage.cdu.checkTime"
            label="彩超检查时间"
            :min-date="minDate"
            :max-date="maxDate"
            :disabled="disabled"
          />
        </el-col>
        <el-col :span="6">
          <med-datetime-field
            v-model="dataScreenage.cdu.reportTime"
            form-prop="screenage.cdu.reportTime"
            label="彩超出结果时间"
            :min-date="minDate"
            :max-date="maxDate"
            :disabled="disabled"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { dicConstant } from '@/constant/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Pacs',
  components: {},
  props: {
    data: {
      required: true,
      type: Object
    },
    dataScreenage: {
      required: true,
      type: Object
    },
    disabled: {
      required: false,
      type: Boolean
    }
  },
  data() {
    return {
      active: 0,
      registId: 0,
      minDate: new Date(2020, 0, 10),
      maxDate: new Date(2025, 10, 1)
    }
  },
  computed: {
    ...mapGetters(['dictionary']),
    yesOrNoDic() {
      return this.dictionary[dicConstant.yesOrNoCode]
    },
    pacsTypeDic() {
      return this.dictionary[dicConstant.pacsTypeCode]
    },
    pacsTypeForbidden() {
      if (this.data.diagnosis === '5') return ['2', '3']
      return []
    }
  },
  // async created() {
  //   const { getDictionary } = this
  //   this.dictionary = await getDictionary() || {}
  // },
  methods: {
    isPacs(pacsKey) {
      if (!this.data.medicalimagesType) return false
      return this.data.medicalimagesType.indexOf(pacsKey) > -1
    }
  }
}
</script>

<style lang="scss" scoped></style>
