<template>
  <el-form ref="form" :model="rfTagForm" label-width="80px">
    <el-form-item label="腕带编号">
      <el-select v-model="rfTagForm.rfTagId" placeholder="腕带号" clearable>
        <el-option
          v-for="item in rfTags"
          :key="item.label"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm()">绑定</el-button>
      <el-button @click="cancelForm()">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { setRfTagId } from '@/api/patient/list'
import { mapGetters } from 'vuex'

export default {
  name: 'RfTag',
  props: {
    rfTags: {
      type: Array,
      required: true
    },
    patient: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      rfTagForm: {
        rfTagId: ''
      }
    }
  },
  computed: {
    ...mapGetters(['hospitalId', 'currentHospitalArea'])
  },
  methods: {
    submitForm() {
      if (!this.rfTagForm.rfTagId) {
        console.log('rfTagId不存在！')
        return
      }
      var tagCode = this.rfTags.find(item => item.value === this.rfTagForm.rfTagId).code || ''
      setRfTagId({
        registId: this.patient.id,
        tagId: this.rfTagForm.rfTagId,
        tagCode: tagCode,
        type: '5',
        hospitalArea: this.currentHospitalArea,
        hospitalId: this.hospitalId
      }).then((res) => {
        console.log('绑定腕带返回数据', res)
        if (res.status === 200 && res.code === '0') {
          this.$message.success('绑定腕带成功')
          this.cancelForm()
        } else {
          this.$message.error('绑定腕带失败')
          this.cancelForm()
        }
      })
    },
    cancelForm() {
      this.$emit('cancelForm')
    }
  }
}
</script>

<style scoped>

</style>
