<template>
  <div>
    <el-tabs
      v-model="tabsValue"
      size="small"
      type="card"
      :before-leave="(a) => a !== 'add'"
      @tab-remove="handleRemove"
      @tab-click="onClick"
    >
      <el-tab-pane
        v-for="(item, index) in tabs"
        :key="item.id"
        :label="index ? '新增体格检查' + index : '体格检查'"
        :name="item.id"
        :closable="!!index && !viewMode"
      >
        <el-form
          ref="form"
          :rules="rules"
          :model="item"
          label-width="120px"
          label-position="top"
        >
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item label="检查时间" required prop="createTime">
                <el-date-picker
                  v-model="item.createTime"
                  :readonly="viewMode"
                  size="mini"
                  type="datetime"
                  placeholder="选择时间"
                  value-format="yyyy-MM-dd[T]HH:mm:ss"
                  format="yyyy-MM-dd HH:mm"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item required label="检查状态" prop="isNormal">
                <el-radio-group
                  v-model="item.isNormal"
                  :readonly="viewMode"
                  size="mini"
                >
                  <el-radio label="0"> 拒绝采集 </el-radio>
                  <el-radio label="1"> 正常采集 </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="呼吸(次/分)" prop="rr">
                <el-input-number
                  v-model="item.rr"
                  v-readonly="viewMode"
                  size="mini"
                  :controls="false"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="脉搏(次/分)" prop="pulse">
                <el-input-number
                  v-model="item.pulse"
                  v-readonly="viewMode"
                  size="mini"
                  :controls="false"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="收缩压(mmHg)" prop="sbp">
                <el-input-number
                  v-model="item.sbp"
                  v-readonly="viewMode"
                  size="mini"
                  :controls="false"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="舒张压(mmHg)" prop="dbp">
                <el-input-number
                  v-model="item.dbp"
                  v-readonly="viewMode"
                  size="mini"
                  :controls="false"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="SPO2(%)" prop="spo2">
                <el-input
                  v-model="item.spo2"
                  size="mini"
                  :readonly="viewMode"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="意识" prop="consciousness">
                <med-select
                  v-model="item.consciousness"
                  :readonly="viewMode"
                  size="mini"
                  :options="dictionary[dic.consciousness]"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="皮肤" prop="skin">
                <med-select
                  v-model="item.skin"
                  :readonly="viewMode"
                  size="mini"
                  :options="dictionary[dic.skin]"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="瞳孔" prop="pupilResponse">
                <med-select
                  v-model="item.pupilResponse"
                  :readonly="viewMode"
                  size="mini"
                  :options="dictionary[dic.pupil]"
                /></el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="对光反射" prop="lightReflection">
                <med-select
                  v-model="item.lightReflection"
                  :readonly="viewMode"
                  size="mini"
                  :options="dictionary[dic.lightReaction]"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="体温(℃)" prop="t">
                <el-input-number
                  v-model="item.t"
                  v-readonly="viewMode"
                  size="mini"
                  :controls="false"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane v-if="!viewMode" name="add">
        <template #label>
          <i class="el-icon-plus" />
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { genRemove } from '@/api/inspections'
import { dicConstant as dic } from '@/constant'
import { mapGetters } from 'vuex'

export default {
  name: 'Physicalexam',
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
      form: {},
      tabsValue: '',
      tabs: [],
      rules: {
        createTime: [
          { required: true, message: '请填写检查时间', trigger: 'change' }
        ],
        isNormal: [
          { required: true, message: '请填写检查状态', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['dictionary'])
  },
  watch: {
    detailData: {
      immediate: true,
      handler(val) {
        if (val) {
          const tabList = val.medPhepGeneralInspectionsEntityList || []
          this.tabs = tabList.map((ele) => {
            return { ...ele }
          })
          if (!this.tabs.length) {
            // 没数据时默认显示出一个页签
            this.tabs.push({
              id: 'fake1',
              isNormal: '1',
              createTime: this.$moment().format('YYYY-MM-DD[T]HH:mm:ss')
            })
          }
          this.tabsValue = this.tabs[0].id
        }
      }
    }
  },
  methods: {
    onClick(e) {
      if (e.name === 'add') {
        // 添加页签
        this.addTab()
      }
    },
    addTab() {
      // 未保存的页签id统一使用fake做前缀
      const newTabName = 'fake' + Math.random()
      this.tabs.push({
        id: newTabName,
        isNormal: '1',
        createTime: this.$moment().format('YYYY-MM-DD[T]HH:mm:ss')
      })
      this.tabsValue = newTabName
    },
    handleRemove(targetName) {
      if (!targetName.startsWith('fake')) {
        // 已经保存的页签询问是否删除
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          genRemove([targetName]).then((res) => {
            if (res.code === '000000') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.$emit('refresh')
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!' + res?.message
              })
            }
          })
        })
      } else {
        // 未保存的页签直接删除
        this.removeTab(targetName)
      }
    },
    removeTab(targetName) {
      const tabs = this.tabs
      let activeName = this.tabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.id === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.id
            }
          }
        })
      }

      this.tabsValue = activeName
      this.tabs = tabs.filter((tab) => tab.id !== targetName)
    },
    async onSave() {
      let errIndex
      let errTabId
      this.tabs.some((t, i) => {
        const hasErr = !t.createTime || !t.isNormal
        if (hasErr) {
          errIndex = i
          errTabId = t.id
        }
        return hasErr
      })
      if (errIndex !== undefined) {
        this.tabsValue = errTabId
        this.$refs.form[errIndex].validate((valid) => {})
      } else {
        // const needUuidNumber = this.tabs.reduce((cur, ele) => {
        //   return cur + (ele.id.startsWith('fake') ? 1 : 0)
        // }, 0)
        // let uuids = []
        // if (needUuidNumber) {
        //   // 获取多个uuid
        //   const { body: uus = [] } = await getUUID(needUuidNumber)
        //   uuids = uus
        // }
        const { patientId } = this.$route.query
        const payload = {
          medPhepGeneralInspectionsEntityList: this.tabs.map((t) => {
            return {
              ...t,
              patientId,
              id: t.id.startsWith('fake') ? undefined : t.id
            }
          })
        }
        this.$emit('save', payload)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-tabs--card > .el-tabs__header .el-tabs__item {
    &.is-closable:hover {
      padding-left: 20px;
      padding-right: 20px;
    }
    .el-icon-close {
      width: 14px;
    }
  }
}
</style>
