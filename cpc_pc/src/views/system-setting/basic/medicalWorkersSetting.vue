<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button @click="setHospital">新增</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
      <draggable
        v-model="medicalworkers"
        v-bind="dragOptions"
        @start="drag = true"
        @end="drag = false"
      >
        <transition-group type="transition">
          <div
            v-for="(element,index) in medicalworkers"
            :key="'network'+index"
            class="drag-item"
          >
            <el-input v-model="element.name" size="mini" placeholder="医护人员姓名" style="width: 200px" />
            <el-checkbox v-model="element.isEnabled" style="margin-left: 100px;">启用</el-checkbox>
            <i class="el-icon-delete" style="color:red; float: right; font-size:20px;" @click="remove(index)" />
          </div>
        </transition-group>
      </draggable>
    </el-card>
  </div>
</template>

<script>
const checkDuplicated = (arr = [], prop) => {
  try {
    const hash = {}
    arr.forEach(a => {
      if (hash[a[prop]]) { throw new Error() }
      hash[a[prop]] = true
    })
  } catch (err) {
    console.log(err.message)
    return true
  }
  return false
}

import draggable from 'vuedraggable'
import { basicConstant } from '@/constant'
import { querySetting, saveDefaultSetting } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  name: 'MedicalWorkersSetting',
  components: {
    draggable
  },
  data() {
    return {
      drag: false,
      medicalworkers: []
    }
  },
  computed: {
    ...mapGetters(['dictionary', 'hospitalId']),
    dragOptions() {
      return {
        animation: 200,
        group: 'hospital',
        disabled: false
      }
    }
  },
  mounted() {
    this.query()
  },
  methods: {
    setHospital() {
      this.medicalworkers.push({ name: '', isEnabled: true })
    },
    remove(idx) {
      this.medicalworkers.splice(idx, 1)
    },
    async query() {
      const { result } = await querySetting({ code: basicConstant.MEDICALWORKERS, hospitalId: this.hospitalId })
      if (result) {
        this.medicalworkers = JSON.parse(result.value)
      }
    },
    async save() {
      // 验证是否所有网络医院名称都已填写
      if (!this.medicalworkers.every(h => h.name !== null && h.name !== undefined && h.name.trim() !== '')) {
        this.$message({ type: 'error', message: '请完成所有医护人员的填写' })
        return
      }
      if (checkDuplicated(this.medicalworkers, 'name')) {
        this.$message({ type: 'error', message: '医护人员不能重名，请确认' })
        return
      }

      const res = await saveDefaultSetting({
        code: basicConstant.MEDICALWORKERS,
        hospitalId: this.hospitalId,
        value: JSON.stringify(this.medicalworkers),
        name: '医护人员'
      })
      if (res.status === 200) this.$message({ type: 'success', message: '设置保存成功' })
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card .drag-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 40px;
  border: 1px solid #e6ebf5;
  padding: 10px 20px;
  border-bottom: none;
}
.box-card .drag-item:last-of-type{
  border-bottom: 1px solid #e6ebf5;
}
</style>
