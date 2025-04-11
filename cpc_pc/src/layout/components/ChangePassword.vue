<template>
  <el-dialog
    title="修改密码"
    width="500px"
    :close-on-click-modal="false"
    v-bind.sync="$attrs"
    v-on="$listeners"
  >
    <!-- <h2>设置新密码</h2> -->
    <el-form
      ref="ruleForm"
      class="form"
      :model="pwdEntity"
      :rules="rules"
      label-position="top"
      hide-required-asterisk
    >
      <el-form-item label="旧密码" prop="old">
        <el-input
          v-model="pwdEntity.old"
          type="password"
          show-password
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <template #label>
          <div>
            新密码
            <span
              class="tip"
            ><i class="el-icon-warning-outline" />
              密码由大写字母、小写字母和数字组成，长度为8~16位</span>
          </div>
        </template>
        <el-input
          v-model="pwdEntity.password"
          type="password"
          show-password
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPwd">
        <el-input
          v-model="pwdEntity.checkPwd"
          type="password"
          show-password
          autocomplete="off"
        />
      </el-form-item>
      <!-- <p style="margin-top: 15px">
        <i class="el-icon-warning-outline" />
        密码由大写字母、小写字母和数字组成，长度为8~16位
      </p> -->
      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-top: 15px"
        @click="onSubmit"
      >确认</el-button>
    </el-form>
  </el-dialog>
</template>

<script>
import { modifyPwd } from '@/api/user'
import { mapGetters } from 'vuex'
export default {
  props: ['userId'],
  data() {
    const validatePass = (rule, value, callback) => {
      const regex = new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{8,16}')
      if (!regex.test(value)) {
        callback(new Error('请输入符合规则的密码'))
      } else {
        if (this.pwdEntity.checkPwd !== '') {
          this.$refs.ruleForm.validateField('checkPwd')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.pwdEntity.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      pwdEntity: {},
      rules: {
        old: [{ required: true, message: '请输入旧密码' }],
        password: [{ validator: validatePass, trigger: 'input' }],
        checkPwd: [{ validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  watch: {
    '$attrs.visible': {
      handler() {
        if (this.$refs.ruleForm) {
          this.$refs.ruleForm.clearValidate()
        }
        this.pwdEntity = {}
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$confirm(`确定要修改密码吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
          }).then(() => {
            const payload = {
              ...this.pwdEntity,
              id: this.user.id
            }
            this.doChangePassword(payload)
          })
        } else {
          return false
        }
      })
    },
    async doChangePassword(payload) {
      this.loading = true
      modifyPwd(payload)
        .then((res) => {
          if (res.code === '0') {
            this.$emit('success')
          } else {
            this.$message.error('修改密码失败')
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style>
.form {
  margin-top: -20px;
}
.tip {
  padding-left: 4px;
  font-weight: normal;
  font-size: 12px;
  color: rgb(255, 137, 94);
}
</style>
