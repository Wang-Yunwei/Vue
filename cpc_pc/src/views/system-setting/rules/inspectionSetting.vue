<template>
  <div>
    <el-card class="med-setting-card">
      <div slot="header" class="clearfix">
        <span class="med-setting-card-title">检查类型</span>
        <el-checkbox v-model="setting.isEnabled">启用</el-checkbox>
        <el-button style="float: right; padding: 3px 0" type="text" @click="save">保存设置</el-button>
      </div>
      <div v-for="(d, index) in dictionary.diagnosisTestTypeDict" :key="'diagnosisTestTypeDict' + index" class="med-setting-card-row">
        <span class="med-setting-card-name">
          <el-checkbox v-if="setting.itemConfig[index]" v-model="setting.itemConfig[index].isEnabled" :disabled="!setting.isEnabled">{{ d.label }}</el-checkbox>
        </span>
        <el-divider direction="vertical" />
        <span style="font-size:14px; margin-left:10px;">剂量单位：</span>
        <el-select v-if="setting.itemConfig[index]" v-model="setting.itemConfig[index].defaultUnit" placeholder="请选择" size="mini" :disabled="!setting.isEnabled || !setting.itemConfig[index].isEnabled">
          <el-option
            v-for="item in unitDict(d.value)"
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
  name: 'InspectionSetting',
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
    unitDict(key) {
      switch (key) {
        case '1': // 血清肌酐
          return [{ label: 'umol/L', value: '1' }]
        case '3': // BNP
        case '4': // NT-proBNP
          return [{ label: 'pg/mL', value: '1' }]
        case '2': // D-二聚体
          return this.dictionary.ddimerUnitDict
        case '5': // Myo
          return this.dictionary.myoUnitDict
        case '6': // CKMB
          return this.dictionary.ckmbUnitDict
        default:
          break
      }
    },
    async query() {
      const { result } = await querySetting({ code: ruleConstant.INSPECTION, hospitalId: this.hospitalId })
      if (result) {
        this.setting = JSON.parse(result.value)
      } else {
        this.dictionary.diagnosisTestTypeDict.forEach((d) => {
          this.setting.itemConfig.push(
            {
              code: d.value,
              isEnabled: false,
              defaultUnit: ''
            }
          )
        })
      }
    },
    async save() {
      const res = await saveDefaultSetting({
        code: ruleConstant.INSPECTION,
        hospitalId: this.hospitalId,
        value: JSON.stringify(this.setting),
        name: '检查类型'
      })
      if (res.status === 200) this.$message({ type: 'success', message: '设置保存成功' })
    }
  }
}
</script>

<style lang="scss">
@import "../setting.scss";
</style>
