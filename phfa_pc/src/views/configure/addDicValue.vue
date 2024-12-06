<template>
  <el-dialog :visible.sync="show" title="新增字典值">
    <div class="dlg-add-container">
      <el-form ref="form" :model="form" label-width="90px">
        <div class="flex-c-b">
          <el-form-item label="医院" prop="hospitalId" style="flex: 1 1 33%">
            <med-select
              v-model="form.hospitalId"
              placeholder="请选择"
              :options="hospitalList"
            />
          </el-form-item>
          <el-form-item label="APPID" prop="appId" style="flex: 1 1 33%">
            <med-select
              v-model="form.appid"
              placeholder="请选择"
              :options="dictionary[dic.itemId]"
            />
          </el-form-item>
          <el-form-item label="字典编码" prop="dicCode" style="flex: 1 1 33%">
            <med-select
              v-model="form.code"
              placeholder="请选择"
              :options="dicCodeList"
            />
          </el-form-item>
          <el-form-item label="字典名称" prop="dicName" style="flex: 1 1 33%">
            <el-input v-model="form.name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="标签" prop="label" style="flex: 1 1 33%">
            <el-input v-model="form.label" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="值" prop="value" style="flex: 1 1 33%">
            <el-input v-model="form.value" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="状态" prop="status" style="flex: 1 1 33%">
            <template>
              <el-switch
                v-model="form.status"
                active-color="#13ce66"
                inactive-color="#ccc"
                active-value="1"
                inactive-value="0"
              />
            </template>
          </el-form-item>
          <el-form-item label="备注" prop="describe" style="flex: 80 1 33%">
            <el-input
              v-model="form.describe"
              type="textarea"
              :rows="2"
              placeholder="请输入"
            />
          </el-form-item>
        </div>
        <div class="flex-c-c">
          <el-button @click="onClose">取消</el-button>
          <el-button type="primary" @click="save">创建</el-button>
        </div>
      </el-form>
    </div>
  </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import { dicConstant as dic } from '@/constant'
import { ddcSaveOrUpdate, getDictCode } from '@/api/dictionary'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dic,
      dicCodeList: [], // 编码
      form: {}
    }
  },
  computed: {
    show: {
      get() {
        return this.visible
      },
      set(v) {
        this.$emit('update:visible', v)
      }
    },
    ...mapGetters(['hospitalId', 'dictionary', 'hospitalList']),
    driverList() {
      return (this.dictionary[this.dic.driver] || []).map((d) => ({
        ...d,
        value: d.label
      }))
    }
  },
  async mounted() {
    this.getDictCode()
  },
  methods: {
    save() {
      ddcSaveOrUpdate(this.form).then((response) => {
        if (response.body === true) {
          this.onClose()
          this.$emit('refresh')
        }
      })
    },
    async getDictCode() {
      // 查询字典编码
      await getDictCode({}).then((res) => {
        this.dicCodeList = res.body.map((item) => {
          return {
            label: item.title,
            value: item.dictCode
          }
        })
      })
    },
    onClose() {
      this.showDialog = false
      this.$emit('update:visible', this.showDialog)
    }
  }
}
</script>
<style lang="sass" scoped>

.dlg-add-container .search-panel
  display: flex
  padding: 5px 0
  justify-content: space-between
  align-items: center

  & .search-condition
    display: flex
    flex-grow: 1
    padding-right: 20px

  & .search-condition .search-block
    margin-right: 10px
</style>
