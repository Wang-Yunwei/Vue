<template>
  <div>
    <el-card v-if="setting.itemConfig.length > 0" class="med-setting-card">
      <div slot="header" class="clearfix">
        <span class="med-setting-card-title">出院带药</span>
        <el-checkbox v-model="setting.isEnabled">启用</el-checkbox>
        <el-button style="float: right; padding: 3px 0" type="text" @click="save">保存设置</el-button>
      </div>
      <div>
        <div class="med-setting-card-row">
          <div class="med-setting-card-name">
            <el-checkbox v-if="setting.itemConfig[0]" v-model="setting.itemConfig[0].isEnabled" :disabled="!setting.isEnabled">抗血小板治疗</el-checkbox>
          </div>
          <el-divider direction="vertical" />
          <med-checkbox v-if="setting.itemConfig[0]" v-model="setting.itemConfig[0].defaultDrug" :select-options="dictionary.daptDict" :disabled="!setting.isEnabled || !setting.itemConfig[0].isEnabled" display-type="check" style="display:inline-block" @click="drugChanged(0)" />
        </div>
        <div v-for="(u, index) in setting.itemConfig[0].defaultUsage" :key="'kxxbusage' + index">
          <div class="drug-usage">
            <span>{{ u.code | convert(dictionary.daptDict) }}</span>
            <med-select
              v-model="u.frequency"
              :select-options="strFrequencyDic"
              placeholder="服用频次"
              :disabled="!setting.isEnabled || !setting.itemConfig[0].isEnabled"
            />
            <med-select
              v-model="u.times"
              :select-options="strTimesDic"
              placeholder="服用频次"
              :disabled="!setting.isEnabled || !setting.itemConfig[0].isEnabled"
            />
            <med-text
              v-model="u.dose"
              label="单次剂量"
              :disabled="!setting.isEnabled || !setting.itemConfig[0].isEnabled"
              type="number"
              input-align="left"
              placeholder="单次剂量"
              append="mg"
            />
          </div>
        </div>
      </div>
      <div class="med-setting-card-row">
        <div class="med-setting-card-name">
          <el-checkbox v-if="setting.itemConfig[1]" v-model="setting.itemConfig[1].isEnabled" :disabled="!setting.isEnabled">ACEI/ARB</el-checkbox>
        </div>
        <el-divider direction="vertical" />
        <med-select v-if="setting.itemConfig[1]" v-model="setting.itemConfig[1].defaultDrug.code" :select-options="dictionary.aceiorarbDict" :disabled="!setting.isEnabled || !setting.itemConfig[1].isEnabled" />
        <med-select
          v-model="setting.itemConfig[1].defaultDrug.frequency"
          :select-options="strFrequencyDic"
          placeholder="服用频次"
          :disabled="!setting.isEnabled || !setting.itemConfig[1].isEnabled"
        />
        <med-select
          v-model="setting.itemConfig[1].defaultDrug.times"
          :select-options="strTimesDic"
          placeholder="服用频次"
          :disabled="!setting.isEnabled || !setting.itemConfig[1].isEnabled"
        />
        <med-text
          v-model="setting.itemConfig[1].defaultDrug.dose"
          label="单次剂量"
          :disabled="!setting.isEnabled || !setting.itemConfig[1].isEnabled"
          type="number"
          input-align="left"
          placeholder="单次剂量"
          append="mg"
        />
      </div>
      <div>
        <div class="med-setting-card-row">
          <div class="med-setting-card-name">
            <el-checkbox v-if="setting.itemConfig[2]" v-model="setting.itemConfig[2].isEnabled" :disabled="!setting.isEnabled">调脂药物</el-checkbox>
          </div>
          <el-divider direction="vertical" />
          <med-checkbox v-if="setting.itemConfig[2]" v-model="setting.itemConfig[2].defaultDrug" :select-options="dictionary.statinsDict" :disabled="!setting.isEnabled || !setting.itemConfig[2].isEnabled" display-type="check" style="display:inline-block" @click="drugChanged(2)" />
        </div>
        <div v-for="(u, index) in setting.itemConfig[2].defaultUsage" :key="'tzywusage' + index">
          <div class="drug-usage">
            <span>{{ u.code | convert(dictionary.statinsDict) }}</span>
            <med-select
              v-model="u.frequency"
              :select-options="strFrequencyDic"
              placeholder="服用频次"
              :disabled="!setting.isEnabled || !setting.itemConfig[2].isEnabled"
            />
            <med-select
              v-model="u.times"
              :select-options="strTimesDic"
              placeholder="服用频次"
              :disabled="!setting.isEnabled || !setting.itemConfig[2].isEnabled"
            />
            <med-text
              v-model="u.dose"
              label="单次剂量"
              :disabled="!setting.isEnabled || !setting.itemConfig[2].isEnabled"
              type="number"
              input-align="left"
              placeholder="单次剂量"
              append="mg"
            />
          </div>
        </div>
      </div>
      <div class="med-setting-card-row">
        <div class="med-setting-card-name">
          <el-checkbox v-if="setting.itemConfig[3]" v-model="setting.itemConfig[3].isEnabled" :disabled="!setting.isEnabled">β受体阻滞剂</el-checkbox>
        </div>
        <el-divider direction="vertical" />
        <med-select v-if="setting.itemConfig[3]" v-model="setting.itemConfig[3].defaultDrug.code" :select-options="dictionary.retardantDict" :disabled="!setting.isEnabled || !setting.itemConfig[3].isEnabled" />
        <med-select
          v-model="setting.itemConfig[3].defaultDrug.frequency"
          :select-options="strFrequencyDic"
          placeholder="服用频次"
          :disabled="!setting.isEnabled || !setting.itemConfig[3].isEnabled"
        />
        <med-select
          v-model="setting.itemConfig[3].defaultDrug.times"
          :select-options="strTimesDic"
          placeholder="服用频次"
          :disabled="!setting.isEnabled || !setting.itemConfig[3].isEnabled"
        />
        <med-text
          v-model="setting.itemConfig[3].defaultDrug.dose"
          label="单次剂量"
          :disabled="!setting.isEnabled || !setting.itemConfig[3].isEnabled"
          type="number"
          input-align="left"
          placeholder="单次剂量"
          append="mg"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { ruleConstant } from '@/constant'
import { querySetting, saveDefaultSetting } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  name: 'DischargeMedicationSetting',
  data() {
    return {
      setting: {
        isEnabled: false,
        itemConfig: []
      },
      strTimesDic: [
        { label: '1次', value: '1' },
        { label: '2次', value: '2' },
        { label: '3次', value: '3' },
        { label: '4次', value: '4' }
      ],
      strFrequencyDic: [
        { label: '每日', value: '1' },
        { label: '每周', value: '2' },
        { label: '每月', value: '3' }
      ]
    }
  },
  computed: {
    ...mapGetters(['dictionary', 'hospitalId'])
  },
  mounted() {
    this.query()
  },
  methods: {
    drugChanged(idx) {
      const config = this.setting.itemConfig[idx]
      const finalUsage = []
      config.defaultDrug.forEach(d => {
        const itemIndex = config.defaultUsage.findIndex(u => u.code === d)
        if (itemIndex > -1) finalUsage.push(config.defaultUsage[itemIndex])
        else {
          finalUsage.push({
            code: d,
            frequency: '',
            times: '',
            dose: ''
          })
        }
      })
      config.defaultUsage = finalUsage.sort((a, b) => a.code - b.code)
    },
    async query() {
      const { result } = await querySetting({ code: ruleConstant.DISCHARGEMEDICATION, hospitalId: this.hospitalId })
      if (result) {
        this.setting = JSON.parse(result.value)
      } else {
        this.setting.itemConfig.push(...[
          {
            code: '1',
            isEnabled: false,
            defaultDrug: [],
            defaultUsage: []
          }, {
            code: '2',
            isEnabled: false,
            defaultDrug: {}
          }, {
            code: '3',
            isEnabled: false,
            defaultDrug: [],
            defaultUsage: []
          }, {
            code: '4',
            isEnabled: false,
            defaultDrug: {}
          }
        ]
        )
      }
    },
    async save() {
      const res = await saveDefaultSetting({
        code: ruleConstant.DISCHARGEMEDICATION,
        hospitalId: this.hospitalId,
        value: JSON.stringify(this.setting),
        name: '出院带药'
      })
      if (res.status === 200) this.$message({ type: 'success', message: '设置保存成功' })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../setting.scss";
.med-select-wrapper {
  display: inline-block;
  margin: 0 2px;
  width: 120px;
}
.med-input-wrapper {
  display: inline-block;
   width: 180px;
}
.drug-name {
  display: inline-block;
  width: 110px;
}
.drug-usage {
  margin-left: 116px;
  padding: 1px 0px 1px 20px;
  display: flex;
  &>*{
    height: 30px;
    line-height: 30px;
  }
  .med-checkbox-wrapper {
    padding-bottom: 8px;
  }
  &>span{
    min-width: 70px;
    font-family: 微软雅黑;
    font-size: 14px;
    color: #666
  }
}
</style>
