<template>
  <div>
    <el-input
      :value="value"
      :disabled="disabled"
      :readonly="readonly"
      v-bind="$attrs"
      @input="onInputChange"
    >
      <el-button
        slot="append"
        :disabled="disabled || readonly"
        icon="el-icon-notebook-2"
        @click="showModal"
      />
    </el-input>
    <el-dialog title="病史模板" :visible.sync="dialogVisible">
      <el-form :model="form" label-position="top">
        <el-form-item label="病史模板" :label-width="formLabelWidth">
          <med-select
            v-model="form.temp"
            :options="tempList"
            placeholder="请选择病史模板"
            @select="onSelectTemp"
          />
        </el-form-item>
        <br>
        <el-form-item label="模板内容" :label-width="formLabelWidth">
          <el-input
            v-model="form.content"
            :rows="8"
            type="textarea"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryTempList } from '@/api/template'
// 病史模板
export default {
  name: 'HistoryTemp',
  props: {
    value: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'chiefComplaint' // chiefComplaint 主诉 | presentIllness 现病史
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formLabelWidth: '80px',
      dialogVisible: false,
      form: {},
      tempList: []
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(v) {
        this.$set(this.form, 'content', v)
      }
    }
  },
  created() {},
  methods: {
    onInputChange(e) {
      console.log(e)
      this.$emit('input', e)
    },
    async getTempList() {
      const res = await queryTempList(this.type)
      this.tempList = res.body.map((opt) => {
        return {
          label: opt.tempName,
          value: opt.id,
          content: opt.tempContent
        }
      })
    },
    showModal() {
      if (!this.tempList.length) {
        this.getTempList()
      }
      this.form = {
        content: this.value
      }
      this.dialogVisible = true
    },
    onSelectTemp(opt) {
      this.form.content = opt.content
    },
    onConfirm() {
      this.dialogVisible = false
      this.$emit('input', this.form.content)
    }
  }
}
</script>

<style></style>
