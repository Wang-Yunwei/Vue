<template>
  <div>
    <el-card class="med-setting-card">
      <div slot="header" class="clearfix">
        <span class="med-setting-card-title">双抗给药</span>
        <el-checkbox v-model="setting.isEnabled">启用</el-checkbox>
        <el-button style="float: right; padding: 3px 0" type="text" @click="save">保存设置</el-button>
      </div>
      <div v-for="(d, index) in dictionary.drugItemsDict" :key="'drugItemsDict' + index" class="med-setting-card-row">
        <span class="med-setting-card-name">
          <el-checkbox v-if="setting.itemConfig[index]" v-model="setting.itemConfig[index].isEnabled" :disabled="!setting.isEnabled" @change="change(index)">{{ d.label }}</el-checkbox>
        </span>
        <el-divider direction="vertical" />
        <span style="font-size:14px; margin-left:10px;">剂量：</span>
        <el-select v-if="setting.itemConfig[index]" v-model="setting.itemConfig[index].defaultDose" placeholder="请选择" size="mini" :disabled="!setting.isEnabled || !setting.itemConfig[index].isEnabled">
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
  name: 'AntiplateletSetting',
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
        case '1': // aspirin
          return [
            { label: '0 mg', value: '0' },
            { label: '100 mg', value: '100' },
            { label: '300 mg', value: '300' },
            { label: '其他剂量', value: '999' }
          ]
        case '2': // 氯吡格雷
          return [
            { label: '0 mg', value: '0' },
            { label: '300 mg', value: '300' },
            { label: '600 mg', value: '600' },
            { label: '其他剂量', value: '999' }
          ]
        case '3': // 替格瑞洛
          return [
            { label: '0 mg', value: '0' },
            { label: '90 mg', value: '90' },
            { label: '180 mg', value: '180' },
            { label: '其他剂量', value: '999' }
          ]
        default:
          break
      }
    },
    change(idx) {
      this.$nextTick(() => {
        this.$refs['antiplateletDose' + idx][0].focus()
      })
    },
    async query() {
      const { result } = await querySetting({ code: ruleConstant.ANTIPLATELET, hospitalId: this.hospitalId })
      if (result) {
        this.setting = JSON.parse(result.value)
      } else {
        this.dictionary.drugItemsDict.forEach((d) => {
          this.setting.itemConfig.push(
            {
              code: d.value,
              isEnabled: false,
              defaultDose: ''
            }
          )
        })
      }
    },
    async save() {
      const res = await saveDefaultSetting({
        code: ruleConstant.ANTIPLATELET,
        hospitalId: this.hospitalId,
        value: JSON.stringify(this.setting),
        name: '双抗给药'
      })
      if (res.status === 200) this.$message({ type: 'success', message: '设置保存成功' })
    }
  }
}
</script>

<style lang="scss">
@import "../setting.scss";
</style>
