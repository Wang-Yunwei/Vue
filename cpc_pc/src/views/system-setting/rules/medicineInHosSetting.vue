<template>
  <div>
    <el-card class="med-setting-card">
      <div slot="header" class="clearfix">
        <span class="med-setting-card-title">住院期间用药</span>
        <el-checkbox v-model="setting.isEnabled">启用</el-checkbox>
        <el-button style="float: right; padding: 3px 0" type="text" @click="save">保存设置</el-button>
      </div>
      <div class="med-setting-card-row">
        <span class="med-setting-card-name">
          <el-checkbox v-if="setting.itemConfig[0]" v-model="setting.itemConfig[0].isEnabled" :disabled="!setting.isEnabled">降糖药物</el-checkbox>
        </span>
        <el-divider direction="vertical" />
        <med-checkbox v-if="setting.itemConfig[0]" v-model="setting.itemConfig[0].defaultDrug" :select-options="dictionary.ohaDict" :disabled="!setting.isEnabled || !setting.itemConfig[0].isEnabled" display-type="check" style="display:inline-block" />
      </div>
      <div class="med-setting-card-row">
        <span class="med-setting-card-name">
          <el-checkbox v-if="setting.itemConfig[1]" v-model="setting.itemConfig[1].isEnabled" :disabled="!setting.isEnabled">口服抗凝药物</el-checkbox>
        </span>
        <el-divider direction="vertical" />
        <el-radio-group v-if="setting.itemConfig[1]" v-model="setting.itemConfig[1].defaultDrug" :disabled="!setting.isEnabled || !setting.itemConfig[1].isEnabled" style="display:inline-block">
          <el-radio v-for="item in dictionary.noacDict" :key="'kfknyw'+item.value" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </div>
      <div class="med-setting-card-row">
        <span class="med-setting-card-name">
          <el-checkbox v-if="setting.itemConfig[2]" v-model="setting.itemConfig[2].isEnabled" :disabled="!setting.isEnabled">PCSK9</el-checkbox>
        </span>
        <el-divider direction="vertical" />
        <el-radio-group v-if="setting.itemConfig[2]" v-model="setting.itemConfig[2].defaultDrug" :disabled="!setting.isEnabled || !setting.itemConfig[2].isEnabled" style="display:inline-block" @change="change">
          <el-radio v-for="item in dictionary.pck9Dict" :key="'pcsk9'+item.value" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
        <span style="font-size:14px; margin-left:50px;">剂量：</span>
        <el-input v-if="setting.itemConfig[2]" ref="medicineInhosDose" v-model="setting.itemConfig[2].defaultDose" size="mini" :disabled="!setting.isEnabled || !setting.itemConfig[2].isEnabled" style="width: 200px;">
          <template slot="append">mg</template>
        </el-input>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ruleConstant } from '@/constant'
import { querySetting, saveDefaultSetting } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  name: 'MedicineInhosSetting',
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
        this.$refs.medicineInhosDose.focus()
      })
    },
    async query() {
      const { result } = await querySetting({ code: ruleConstant.MEDICINEINHOS, hospitalId: this.hospitalId })
      if (result) {
        this.setting = JSON.parse(result.value)
      } else {
        this.setting.itemConfig.push(
          {
            code: '1',
            isEnabled: false,
            defaultDrug: ''
          }
        )
        this.setting.itemConfig.push(
          {
            code: '2',
            isEnabled: false,
            defaultDrug: ''
          }
        )
        this.setting.itemConfig.push(
          {
            code: '3',
            isEnabled: false,
            defaultDrug: '',
            defaultDose: ''
          }
        )
      }
    },
    async save() {
      const res = await saveDefaultSetting({
        code: ruleConstant.MEDICINEINHOS,
        hospitalId: this.hospitalId,
        value: JSON.stringify(this.setting),
        name: '住院期间用药'
      })
      if (res.status === 200) this.$message({ type: 'success', message: '设置保存成功' })
    }
  }
}
</script>

<style lang="scss">
@import "../setting.scss";
</style>
