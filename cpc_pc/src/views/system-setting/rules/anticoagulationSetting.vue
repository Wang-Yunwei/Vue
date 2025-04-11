<template>
  <div>
    <el-card class="med-setting-card">
      <div slot="header" class="clearfix">
        <span class="med-setting-card-title">抗凝药物</span>
        <el-checkbox v-model="setting.isEnabled">启用</el-checkbox>
        <el-button style="float: right; padding: 3px 0" type="text" @click="save">保存设置</el-button>
      </div>
      <div class="med-setting-card-row">
        <span class="med-setting-card-name">
          <el-checkbox v-if="setting.itemConfig[0]" v-model="setting.itemConfig[0].isEnabled" :disabled="!setting.isEnabled">抗凝药物</el-checkbox>
        </span>
        <el-divider direction="vertical" />
        <el-radio-group v-if="setting.itemConfig[0]" v-model="setting.itemConfig[0].defaultDrug" :disabled="!setting.isEnabled || !setting.itemConfig[0].isEnabled" style="display:inline-block" @change="change">
          <el-radio v-for="item in dictionary.anticoagulationDrugDict" :key="'anticoagulation'+item.value" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
        <span style="font-size:14px; margin-left:50px;">剂量：</span>
        <el-input v-if="setting.itemConfig[0]" ref="anticoagulationDose" v-model="setting.itemConfig[0].defaultDose" size="mini" :disabled="!setting.isEnabled || !setting.itemConfig[0].isEnabled" style="width: 200px;" />
        <span style="font-size:14px; margin-left:5px;" />
        <el-select v-if="setting.itemConfig[0]" v-model="setting.itemConfig[0].defaultUnit" placeholder="请选择" size="mini" :disabled="!setting.isEnabled || !setting.itemConfig[0].isEnabled">
          <el-option
            v-for="item in dictionary.anticoagulationUnitDict"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ruleConstant } from '@/constant'
import { querySetting, saveDefaultSetting } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  name: 'AnticoagulationSetting',
  data() {
    return {
      setting: {
        isEnabled: false,
        itemConfig: []
      }
    }
  },
  computed: {
    ...mapGetters(['dictionary', 'hospitalId'])
  },
  mounted() {
    this.query()
  },
  methods: {
    change() {
      this.$nextTick(() => {
        this.$refs.anticoagulationDose.focus()
      })
    },
    async query() {
      const { result } = await querySetting({ code: ruleConstant.ANTICOAGULATION, hospitalId: this.hospitalId })
      if (result) {
        this.setting = JSON.parse(result.value)
      } else {
        this.setting.itemConfig.push(
          {
            code: '1',
            isEnabled: false,
            defaultDrug: '',
            defaultDose: '',
            defaultUnit: ''
          }
        )
      }
    },
    async save() {
      const res = await saveDefaultSetting({
        code: ruleConstant.ANTICOAGULATION,
        hospitalId: this.hospitalId,
        value: JSON.stringify(this.setting),
        name: '抗凝药物'
      })
      if (res.status === 200) this.$message({ type: 'success', message: '设置保存成功' })
    }
  }
}
</script>

<style lang="scss">
@import "../setting.scss";
</style>
