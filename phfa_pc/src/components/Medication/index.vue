<template>
  <div>
    <el-table size="mini" :data="patientDrugList" stripe>
      <el-table-column prop="createTime" label="时间" width="260">
        <template slot-scope="scope">
          {{ formatTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="drugName" label="药品" />
      <el-table-column prop="usageDesc" label="用法" width="300">
        <template slot-scope="scope">
          {{ findUsageDesc(scope.row.usageDesc) }}
        </template>
      </el-table-column>
      <el-table-column prop="dose" label="用量" width="220" />
      <el-table-column prop="unit" label="单位" width="220">
        <template slot-scope="scope">
          {{ findDrugUnit(scope.row.drugId) }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="canEdit && !readonly"
        prop="dose"
        label="操作"
        width="220"
      >
        <template slot-scope="scope">
          <el-popconfirm
            title="确定删除吗？"
            @confirm="handleRemove(scope.row)"
          >
            <el-button
              slot="reference"
              type="danger"
              size="mini"
              plain
            >删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-button
      v-if="canEdit && !readonly"
      type="primary"
      plain
      icon="el-icon-plus"
      style="width: 100%; margin-top: 10px"
      @click="showModal"
    >添加用药</el-button>
    <!-- 弹窗 -->
    <el-dialog
      :visible.sync="modalVisible"
      title="用药添加"
      append-to-body
      width="600px"
    >
      <el-form
        v-if="modalVisible"
        ref="form"
        v-loading="loading"
        :model="form"
        label-width="80px"
      >
        <el-form-item
          label="药品"
          prop="drugId"
          :rules="[
            {
              required: true,
              message: '请选择药品'
            }
          ]"
        >
          <med-select
            v-model="form.drugId"
            placeholder="药品"
            :options="drugList"
            filterable
            @select="onDrugSelect"
          />
        </el-form-item>
        <el-form-item
          prop="createTime"
          label="时间"
          :rules="[
            {
              required: true,
              message: '请选择时间'
            }
          ]"
        >
          <el-date-picker
            v-model="form.createTime"
            type="datetime"
            placeholder="选择时间"
            value-format="yyyy-MM-dd[T]HH:mm:ss"
            format="yyyy-MM-dd HH:mm"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item
          label="用法"
          prop="usageDesc"
          :rules="[
            {
              required: true,
              message: '请输入用法'
            }
          ]"
        >
          <med-select
            v-model="form.usageDesc"
            placeholder="用法"
            :options="usageList"
          />
        </el-form-item>
        <el-form-item
          label="用量"
          prop="dose"
          :rules="[
            {
              required: true,
              message: '请输入用量'
            }
          ]"
        >
          <el-row>
            <el-col :span="18">
              <el-input-number
                v-model="form.dose"
                :controls="false"
                placeholder="用量"
              /></el-col>
            <el-col
              :span="6"
            ><el-input
              v-model="form.drugUnit"
              readonly
              placeholder="单位"
            /></el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="onCancel">取消</el-button>
        <el-button
          type="primary"
          :disabled="loading"
          @click="onConfirm"
        >确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDrugGroupedList,
  saveOrUpdatePatientDrug,
  queryDrugByPatientId,
  deletePatientDrug
} from '@/api/drug'
import { dicConstant as dic } from '@/constant'
import { mapGetters } from 'vuex'

export default {
  name: 'Medication',
  props: {
    patientId: {
      type: String,
      default: ''
    },
    canEdit: {
      type: Boolean,
      default: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dic,
      form: {},
      loading: false,
      modalVisible: false,
      patientDrugList: [],
      drugList: [] // 药品大全
    }
  },
  computed: {
    ...mapGetters(['dictionary']),
    usageList() {
      return this.dictionary[this.dic.drugUsage] || []
    },
    flatDrugList() {
      const flatArr = []
      this.drugList.forEach((item) => {
        flatArr.push(...(item.options || []))
      })
      return flatArr
    }
  },
  async created() {
    await this.initDrugList()
    this.queryDrugByPatientId()
  },
  methods: {
    formatTime(time) {
      return time ? this.$moment(time).format('YYYY-MM-DD HH:mm') : ''
    },
    findUsageDesc(id) {
      return (this.usageList.find((ele) => ele.value === id) || {})?.label
    },
    findDrugUnit(drguId) {
      return (this.flatDrugList.find((ele) => ele.value === drguId) || {})
        ?.drugUnit
    },
    // 删除行
    async handleRemove(row) {
      const res = await deletePatientDrug(row.orderId)
      if (res.body === 1) {
        this.$message.success('删除成功!')
        this.queryDrugByPatientId()
      } else {
        this.$message.error('删除失败!')
      }
    },
    async queryDrugByPatientId() {
      const res = await queryDrugByPatientId(this.patientId)
      this.patientDrugList = res.body.map((item) => {
        const drug = this.flatDrugList.find((el) => el.value === item.drugId)
        return {
          ...item,
          drugName: drug.label
        }
      })
    },
    onDrugSelect(opt) {
      this.form.specifications = opt.specifications
      // this.form.stackId = '' // 药品组套ID
      this.form.drugUnit = opt.drugUnit
      this.form.usageDesc = opt.defaultUsage // 用法
      this.form.dose = opt.defaultDose // 用量
      this.form.createTime = this.$moment().format('YYYY-MM-DD[T]HH:mm:ss')
    },
    async initDrugList() {
      const res = await getDrugGroupedList()
      if (typeof res.body === 'object') {
        this.drugList = Object.keys(res.body).map((key) => {
          return {
            label: key,
            options: (res.body[key] || []).map((ele) => ({
              ...ele,
              label: `${ele.name} [ ${ele.specifications} ] ${ele.production}`,
              value: ele.id
            }))
          }
        })
      }
    },
    showModal() {
      this.modalVisible = true
    },
    onCancel() {
      this.modalVisible = false
    },
    onConfirm() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          this.loading = true
          const res = await saveOrUpdatePatientDrug({
            ...this.form,
            patientId: this.patientId
          })
          this.loading = false
          if (res.body) {
            this.patientDrugList.push({ ...this.form })
            this.queryDrugByPatientId()
            // this.$emit('input', this.patientDrugList)
            this.modalVisible = false
            this.form = {}
          }
        }
      })
    }
  }
}
</script>

<style></style>
