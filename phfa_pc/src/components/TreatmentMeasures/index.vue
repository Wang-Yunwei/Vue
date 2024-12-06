<template>
  <div class="treatment-measures-wrapper">
    <med-checkbox
      :value="value"
      :readonly="readonly"
      border
      :options="options"
      @change="onChange"
    >
      <template #label="item">
        {{ item.label }}
        <br>
        {{ parseTime(item) }}
      </template>
    </med-checkbox>
    <el-button
      v-if="!readonly"
      class="add-btn"
      icon="el-icon-plus"
      @click="handleAddDiagnosis"
    >添加急救措施</el-button>
    <el-dialog
      title="治疗措施"
      :visible.sync="modalVisisble"
      append-to-body
      width="460px"
    >
      <el-form v-if="modalVisisble" ref="form" inline :model="form">
        <el-form-item
          label="名称"
          required
          prop="measureName"
          :rules="[
            {
              required: true,
              message: '请填写名称'
            }
          ]"
        >
          <el-input
            v-model="form.measureName"
            placeholder="请填写"
            style="width: 360px"
          />
        </el-form-item>
        <el-form-item
          label="时间"
          required
          prop="opTime"
          :rules="[
            {
              required: true,
              message: '请选择时间'
            }
          ]"
        >
          <el-date-picker
            v-model="form.opTime"
            type="datetime"
            placeholder="选择时间"
            value-format="yyyy-MM-dd[T]HH:mm:ss"
            format="yyyy-MM-dd HH:mm"
            style="width: 360px"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { dicConstant as dic } from '@/constant'
import { mapGetters } from 'vuex'
import { saveMeasures, queryMeasures, deleteMeasures } from '@/api/measures'

export default {
  name: 'TreatmentMeasures',
  props: {
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [],
      value: [],
      modalVisisble: false,
      dic,
      form: {}
    }
  },
  computed: {
    ...mapGetters(['dictionary']),
    options() {
      const dicOpts = this.dictionary[this.dic.firstAidMeasures] || []
      const additionalOpts = this.list
        .filter((ele) => !ele.measureKey)
        .map((item) => ({ ...item, value: item.id, label: item.measureName }))
      return dicOpts.concat(additionalOpts)
    },
    patientId() {
      return this.$route.query.patientId
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      const res = await queryMeasures(this.patientId)
      this.list = res.body || []
      this.value = this.list.map((ele) => ele.measureKey || ele.id)
    },
    onChange(val) {
      const isAdd = val.length > this.value?.length
      if (isAdd) {
        //   增选
        const selectedVal = val.find((v) => !this.value.includes(v))
        const newItem = this.options.find((o) => o.value === selectedVal)
        console.log(selectedVal, newItem, this.list)
        this.form = {
          measureKey: selectedVal,
          measureName: newItem?.label,
          patientId: this.patientId
        }
        this.modalVisisble = true
      } else {
        //   减选
        const removedVal = this.value.find((v) => !val.includes(v))
        const newItem = this.options.find((o) => o.value === removedVal)
        if (newItem) {
          const matchedListItem = this.list.find(
            (el) => el.measureKey === newItem.value || el.id === newItem.value
          )
          console.log(newItem, this.list)
          if (matchedListItem) {
            this.removeMesure(matchedListItem.id)
          }
        }
      }
    },
    async removeMesure(id) {
      const res = await deleteMeasures(id)
      if (res.code === '000000') {
        //   删除成功
        this.getList()
      }
    },
    onCancel() {
      this.modalVisisble = false
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          saveMeasures(this.form).then((res) => {
            if (res.code === '000000') {
              this.modalVisisble = false
              this.getList()
            }
          })
        }
      })
    },
    handleAddDiagnosis() {
      // 添加其他急救措施
      this.modalVisisble = true
      this.form = {
        patientId: this.patientId
      }
    },
    parseTime(item) {
      const matchedListItem = this.list.find(
        (ele) => ele.measureKey === item.value || ele.id === item.value
      )
      const time = item.opTime || matchedListItem?.opTime
      return time ? this.$moment(time).format('YYYY-MM-DD HH:mm') : ''
    }
  }
}
</script>

<style lang="scss" scoped>
.treatment-measures-wrapper {
  display: flex;
  .add-btn {
    margin-left: 30px;
    height: 50px;
  }
  ::v-deep .el-checkbox-group {
    line-height: 70px;
    .el-checkbox {
      height: auto;
      min-width: 172px;
      min-height: 50px;
      text-align: center;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: top;
      .el-checkbox__input {
        position: absolute;
        left: 0;
        top: 0;
        .el-checkbox__inner {
          padding-right: 16px;
          padding-bottom: 14px;
          border-bottom-right-radius: 200px;
          border: none;
        }
      }
    }
  }
}
</style>
