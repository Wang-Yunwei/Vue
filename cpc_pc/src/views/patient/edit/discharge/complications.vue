<template>
  <div class="mini">
    <med-subtitle title="合并疾病" />
    <el-row :gutter="24">
      <el-col :span="6">
        <med-radio-field
          v-model="data.isCombinedDisease"
          form-prop="discharge.isCombinedDisease"
          :disabled="disabled"
          label="是否有合并疾病"
          :select-options="dictionary.yesOrNoDict"
          :rules="[
            { required: true, message: '请填写是否有合并疾病', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="24">
        <med-checkbox-field
          v-if="data.isCombinedDisease == 1"
          v-model="data.combinedDiseaseType"
          display-type="check"
          form-prop="discharge.combinedDiseaseType"
          label="合并疾病类别"
          :disabled="disabled"
          :select-options="strCombinedDiseaseTypeDic"
          :forbidden="combinedDiseaseForbidden"
          :rules="[
            { required: true, message: '请填写合并疾病类别', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="6">
        <med-radio-field
          v-if="data.isCombinedDisease == 1 && showSubitem('冠心病')"
          v-model="data.isChdHor"
          form-prop="discharge.isChdHor"
          :disabled="disabled"
          label="血运重建史"
          :select-options="dictionary.yesOrNoDict"
          :rules="[
            { required: true, message: '请填写血运重建史', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-radio-field
          v-if="data.isCombinedDisease == 1 && showSubitem('心房颤动')"
          v-model="data.afType"
          form-prop="discharge.afType"
          :disabled="disabled"
          label="分型"
          :select-options="dictionary.afTypeDict"
          :rules="[
            { required: true, message: '请填写分型', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-radio-field
          v-if="data.isCombinedDisease == 1 && showSubitem('慢性心力衰竭') && data.isHeartFailure !== '1'"
          v-model="data.chfNyha"
          form-prop="discharge.chfNyha"
          :disabled="disabled"
          label="NYHA分级"
          :select-options="dictionary.chfNyhaDict"
          :rules="[
            { required: true, message: '请填写NYHA分级', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-radio-field
          v-if="data.isCombinedDisease == 1 && showSubitem('脑血管疾病')"
          v-model="data.remark"
          form-prop="discharge.remark"
          :disabled="disabled"
          label="描述"
          :select-options="dictionary.cvdTypeDict"
          :rules="[
            { required: true, message: '请填写描述', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Complications',
  components: {},
  props: {
    data: {
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
      maxDate: new Date(2025, 10, 1),
      strCombinedDiseaseTypeDic: [
        { label: '冠心病', value: '1' },
        { label: '心房颤动', value: '2' },
        { label: '慢性心力衰竭', value: '3' },
        { label: '心脏瓣膜病', value: '4' },
        { label: '脑血管疾病', value: '5' },
        { label: '外周动脉疾病', value: '6' },
        { label: '主动脉瘤', value: '7' },
        { label: 'COPD', value: '8' },
        { label: '慢性肾病', value: '9' },
        { label: '贫血', value: '10' },
        { label: '消化性溃疡', value: '11' },
        { label: '甲状腺功能异常', value: '12' },
        { label: '恶性肿瘤', value: '13' }
      ]
    }
  },
  computed: {
    ...mapGetters(['dictionary']),
    combinedDiseaseForbidden() {
      if (this.data.isHeartFailure === '1') return ['3']
      return []
    }
  },
  created() {},
  methods: {
    showSubitem(testKey) {
      if (!this.data.combinedDiseaseType) {
        return false
      }

      const dic = this.strCombinedDiseaseTypeDic.find(t => t.label === testKey)
      if (!dic) {
        return false
      }
      if (!dic.value) {
        return false
      }

      return this.data.combinedDiseaseType.indexOf(dic.value) > -1
    }
  }
}
</script>

<style lang="scss" scoped></style>
