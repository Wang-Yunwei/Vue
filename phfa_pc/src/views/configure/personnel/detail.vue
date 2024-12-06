<template>
  <el-drawer :title="title" :visible.sync="visible">
    <el-form
      v-if="visible"
      ref="form"
      class="form"
      :model="form"
      label-width="140px"
    >
      <el-form-item
        label="名称"
        prop="rescuerName"
        :rules="[{ required: true, message: '请填写名称', trigger: 'change' }]"
      >
        <el-input v-model="form.rescuerName" />
      </el-form-item>
      <el-form-item
        label="归属医院(院区)"
        prop="hospitalId"
        :rules="[
          { required: true, message: '请选择归属医院', trigger: 'change' }
        ]"
      >
        <hospital-area-select
          :hospital-id.sync="form.hospitalId"
          :hospital-area.sync="form.hospitalArea"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item
        label="人员类型"
        prop="rescuerType"
        :rules="[
          { required: true, message: '请选择人员类型', trigger: 'change' }
        ]"
      >
        <med-select
          v-model="form.rescuerType"
          :options="dictionary[dic.personnelType]"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch
          v-model="form.status"
          style="margin-top: 8px"
          size="large"
          active-value="0"
          inactive-value="1"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
import {
  saveOrUpdateRescuers,
  queryRescuersDetail
} from '@/api/personnel'
import { dicConstant as dic } from '@/constant'
import { mapGetters } from 'vuex'

const defaultForm = () => ({ status: '0' })
export default {
  data() {
    return {
      dic,
      visible: false,
      form: defaultForm()
    }
  },
  computed: {
    ...mapGetters(['dictionary']),
    title() {
      return this.form.rescuerId ? '编辑' : '新增' + '人员'
    }
  },
  methods: {
    close() {
      this.visible = false
      this.form = defaultForm()
    },
    open(id) {
      this.visible = true
      if (id) {
        this.getDetail(id)
      } else {
        this.form = defaultForm()
      }
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          saveOrUpdateRescuers({ ...this.form }).then((res) => {
            if (res.code === '000000') {
              this.$message.success('保存成功!')
              this.close()
              this.$emit('change')
            } else {
              this.$message.error('保存失败! ' + res.message)
            }
          })
        }
      })
    },
    async getDetail(id) {
      const res = await queryRescuersDetail(id)
      if (res.code === '000000') {
        this.form = { ...this.form, ...res.body }
      } else {
        this.$message.error('获取人员详情出错! ' + res.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  padding-right: 30px;
}
</style>
