<template>
  <div>
    <med-subtitle title="住院期间用药" />
    <el-row :gutter="24">
      <el-col :span="6">
        <med-radio-field
          v-model="data.isIndrugs"
          form-prop="discharge.isIndrugs"
          :disabled="disabled"
          label="是否有住院期间用药"
          :select-options="dictionary.yesOrNoDict"
          :rules="[
            { required: true, message: '请填写是否有住院期间用药', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="6">
        <med-radio-field
          v-if="data.isIndrugs == 1"
          v-model="data.isJtyw"
          form-prop="discharge.isJtyw"
          :disabled="disabled"
          label="降糖药物"
          :select-options="dictionary.yesOrNoDict"
          :rules="[
            { required: true, message: '请填写降糖药物', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="18">
        <med-checkbox-field
          v-if="data.isIndrugs == 1 && data.isJtyw == 1"
          v-model="data.jtyw.arrayName"
          display-type="check"
          form-prop="discharge.jtyw.arrayName"
          label="降糖药物名称"
          :disabled="disabled"
          :select-options="dictionary.ohaDict"
          :rules="[
            { required: true, message: '请填写降糖药物名称', trigger: 'change' }
          ]"
          @change="jtywChanged"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="6">
        <med-radio-field
          v-if="data.isIndrugs == 1"
          v-model="data.isKnyw"
          form-prop="discharge.isKnyw"
          :disabled="disabled"
          label="口服抗凝药物"
          :select-options="dictionary.yesOrNoDict"
          :rules="[
            { required: true, message: '请填写口服抗凝药物', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="18">
        <med-radio-field
          v-if="data.isIndrugs == 1 && data.isKnyw == 1"
          v-model="data.knyw.name"
          display-type="check"
          form-prop="discharge.knyw.name"
          label="口服抗凝药物名称"
          :disabled="disabled"
          :select-options="dictionary.noacDict"
          :rules="[
            { required: true, message: '请填写口服抗凝药物名称', trigger: 'change' }
          ]"
          @change="knywChanged"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="6">
        <med-radio-field
          v-if="data.isIndrugs == 1"
          v-model="data.isPcsk9"
          form-prop="discharge.isPcsk9"
          :disabled="disabled"
          label="PCSK9"
          :select-options="dictionary.yesOrNoDict"
          :rules="[
            { required: true, message: '请填写PCSK9', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="6">
        <med-radio-field
          v-if="data.isIndrugs == 1 && data.isPcsk9 == 1"
          v-model="data.pcsk9.name"
          form-prop="discharge.pcsk9.name"
          :disabled="disabled"
          label="PCSK9名称"
          :select-options="dictionary.pck9Dict"
          :rules="[
            { required: true, message: '请填写PCSK9名称', trigger: 'change' }
          ]"
          @change="pcsk9Changed"
        />
      </el-col>
      <el-col :span="6">
        <med-number-field
          v-if="data.isIndrugs == 1 && data.isPcsk9 == 1"
          v-model="data.pcsk9.value"
          form-prop="discharge.pcsk9.value"
          :disabled="disabled"
          label="PCSK9剂量"
          append="mg"
          :rules="[
            { required: true, message: '请填写PCSK9剂量', trigger: 'change' }
          ]"
          @change="pcsk9Changed"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ruleConstant } from '@/constant/index'
import { querySetting } from '@/api/setting'
export default {
  name: 'DischargeMedicine',
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
      maxDate: new Date(2025, 10, 1)
    }
  },
  computed: {
    ...mapGetters(['dictionary', 'hospitalId'])
  },
  created() {
    this.sync()
    this.$eventBus.$on('syncDefaultValues',this.sync)
  },
  beforeDestroy() {
    this.$eventBus.$off('syncDefaultValues',this.sync)
  },
  methods: {
    async sync() {
      const { result } = await querySetting({ code: ruleConstant.MEDICINEINHOS, hospitalId: this.hospitalId })
      if (result) {
        this.rule = JSON.parse(result.value)

        if (this.rule.isEnabled === true) {
          // 降糖药物
          const jtyw = this.rule.itemConfig.find(c => c.code === '1' && c.isEnabled)
          if (jtyw && jtyw.isEnabled) {
            // this.data.isJtyw = this.data.isJtyw ? this.data.isJtyw : '1'

            const syncJtyw = this.data.jtyw.arrayName === null || this.data.jtyw.arrayName === undefined || this.data.jtyw.arrayName.length === 0
            if (syncJtyw) {
              this.data.jtyw.arrayName = [...jtyw.defaultDrug]
            }
          }

          // 口服抗凝药物
          const knyw = this.rule.itemConfig.find(c => c.code === '2' && c.isEnabled)
          if (knyw && knyw.isEnabled) {
            // this.data.isKnyw = this.data.isKnyw ? this.data.isKnyw : '1'
            this.data.knyw.name = this.data.knyw.name ? this.data.knyw.name : knyw.defaultDrug
          }

          // PCSK9
          const pcsk9 = this.rule.itemConfig.find(c => c.code === '3' && c.isEnabled)
          if (pcsk9 && pcsk9.isEnabled) {
            // this.data.isPcsk9 = this.data.isPcsk9 ? this.data.isPcsk9 : '1'
            this.data.pcsk9.name = this.data.pcsk9.name ? this.data.pcsk9.name : pcsk9.defaultDrug
            this.data.pcsk9.value = this.data.pcsk9.value ? this.data.pcsk9.value : pcsk9.defaultDose
          }
        }
      }
    },
    jtywChanged() {
      this.data.jtyw.registId = this.$route.query.id
    },
    knywChanged() {
      this.data.knyw.registId = this.$route.query.id
    },
    pcsk9Changed() {
      this.data.pcsk9.registId = this.$route.query.id
    }
  }
}
</script>

<style lang="scss" scoped></style>
