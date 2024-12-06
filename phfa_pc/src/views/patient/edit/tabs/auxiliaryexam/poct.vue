<template>
  <div>
    <el-input
      readonly
      placeholder="未检查"
      :value="result"
      v-bind="$attrs"
      @focus="showModal"
    >
      <el-button
        slot="append"
        icon="el-icon-edit-outline"
        @click="showModal"
      /></el-input>
    <el-dialog title="POCT" :visible.sync="modalVisible" append-to-body>
      <el-form ref="form" :model="form" label-width="120px">
        <div class="flex-c-b">
          <el-form-item
            required
            label="检查时间"
            prop="checkTime"
            :rules="[
              { required: true, message: '请选择检查时间', trigger: 'change' }
            ]"
            style="flex: 1 1 50%"
          >
            <el-date-picker
              v-model="form.checkTime"
              :readonly="readonly"
              type="datetime"
              placeholder="选择时间"
              value-format="yyyy-MM-dd[T]HH:mm:ss"
              format="yyyy-MM-dd HH:mm"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item
            label="报告时间"
            prop="reportTime"
            style="flex: 1 1 50%"
          >
            <el-date-picker
              v-model="form.reportTime"
              :readonly="readonly"
              type="datetime"
              placeholder="选择时间"
              value-format="yyyy-MM-dd[T]HH:mm:ss"
              format="yyyy-MM-dd HH:mm"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item prop="tnt" label="TnT" style="flex: 1 1 50%">
            <el-input v-model="form.tnt" :readonly="readonly">
              <med-select
                slot="append"
                v-model="form.tntUnit"
                :readonly="readonly"
                :options="optionTnT"
                class="unit-select"
              /></el-input>
          </el-form-item>
          <el-form-item prop="tnl" label="Tnl" style="flex: 1 1 50%">
            <el-input v-model="form.tnl" :readonly="readonly">
              <med-select
                slot="append"
                v-model="form.tnlUnit"
                :readonly="readonly"
                :options="optionTnl"
                class="unit-select"
              /></el-input>
          </el-form-item>
          <el-form-item prop="dDimer" label="D-二聚体" style="flex: 1 1 50%">
            <el-input v-model="form.dDimer" :readonly="readonly">
              <med-select
                slot="append"
                v-model="form.dDimerUnit"
                :readonly="readonly"
                :options="optionDDimer"
                class="unit-select"
              /></el-input>
          </el-form-item>
          <el-form-item prop="serum" label="血清肌酐" style="flex: 1 1 50%">
            <el-input v-model="form.serum" :readonly="readonly">
              <med-select
                slot="append"
                v-model="form.serumUnit"
                :readonly="readonly"
                :options="optionSerum"
                class="unit-select"
              />
            </el-input>
          </el-form-item>
          <el-form-item prop="ckmb" label="CKMB" style="flex: 1 1 50%">
            <el-input v-model="form.ckmb" :readonly="readonly">
              <med-select
                slot="append"
                v-model="form.ckmbUnit"
                :readonly="readonly"
                :options="optionCkmb"
                class="unit-select"
              />
            </el-input>
          </el-form-item>
          <el-form-item prop="bnp" label="BNP" style="flex: 1 1 50%">
            <el-input v-model="form.bnp" :readonly="readonly">
              <med-select
                slot="append"
                v-model="form.bnpUnit"
                :readonly="readonly"
                :options="optionBnp"
                class="unit-select"
              />
            </el-input>
          </el-form-item>
          <el-form-item
            v-model="form.ntProbnp"
            label="NT-proBNP"
            style="flex: 1 1 50%"
          >
            <el-input v-model="form.ntProbnp" :readonly="readonly">
              <med-select
                slot="append"
                v-model="form.ntProbnpUnit"
                :readonly="readonly"
                :options="optionNtProbnp"
                class="unit-select"
              />
            </el-input>
          </el-form-item>
          <el-form-item style="flex: 1 1 50%" prop="myo" label="Myo">
            <el-input v-model="form.myo" :readonly="readonly">
              <med-select
                slot="append"
                v-model="form.myoUnit"
                :readonly="readonly"
                :options="optionMyo"
                class="unit-select"
              />
            </el-input>
          </el-form-item>
          <el-form-item
            label="报告附件"
            prop="poctUrlList"
            style="flex: 1 1 100%"
          >
            <picture-list
              v-model="form.poctUrlList"
              :disabled="readonly"
              :business-id="form.id"
              @refresh="$emit('refresh')"
            />
          </el-form-item>
        </div>
      </el-form>
      <div v-if="!readonly" slot="footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { dicConstant as dic } from '@/constant'
import { mapGetters } from 'vuex'
import PictureList from '@/components/PictureList'
import { getUUID } from '@/api'

export default {
  name: 'POCT',
  components: { PictureList },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    readonly: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '未检查'
    }
  },
  data() {
    return {
      dic,
      modalVisible: false,
      form: { patientId: this.$route.query?.patientId }
    }
  },
  computed: {
    ...mapGetters(['dictionary']),
    result() {
      return this.value?.checkTime ? '已采集' : undefined
    },
    patientId() {
      return this.$route.query.patientId
    },
    optionTnT() {
      return this.dictionary[this.dic.TnT]
    },
    optionTnl() {
      return this.dictionary[this.dic.TnI]
    },
    optionDDimer() {
      return this.dictionary[this.dic.dDimer]
    },
    optionSerum() {
      return this.dictionary[this.dic.serumCreatinine]
    },
    optionCkmb() {
      return this.dictionary[this.dic.CKMB]
    },
    optionBnp() {
      return this.dictionary[this.dic.BNP]
    },
    optionNtProbnp() {
      return this.dictionary[this.dic.NtProBNP]
    },
    optionMyo() {
      return this.dictionary[this.dic.Myo]
    }
  },
  methods: {
    async showModal() {
      this.modalVisible = true
      this.form = {
        ...this.form,
        checkTime: this.$moment().format('YYYY-MM-DD[T]HH:mm:ss'),
        tntUnit: this.optionTnT[0]?.value,
        tnlUnit: this.optionTnl[0]?.value,
        dDimerUnit: this.optionDDimer[0]?.value,
        serumUnit: this.optionSerum[0]?.value,
        ckmbUnit: this.optionCkmb[0]?.value,
        bnpUnit: this.optionBnp[0]?.value,
        ntProbnpUnit: this.optionNtProbnp[0]?.value,
        myoUnit: this.optionMyo[0]?.value,
        ...this.value
      }
      if (!this.form.id) {
        //  新增 请求一个uuid
        const { body: uuid } = await getUUID()
        this.form.id = uuid
      }
    },
    onClose() {
      this.modalVisible = false
    },
    onSave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // eslint-disable-next-line no-unused-vars
          const { poctUrlList, ...formVals } = this.form
          const numberFields = [
            'tnt',
            'tnl',
            'dDimer',
            'serum',
            'ckmb',
            'bnp',
            'ntProbnp',
            'ntProbnpUnit',
            'myo'
          ]
          // 格式化数字类型字段
          numberFields.forEach((key) => {
            if ([null, undefined, '', NaN].includes(formVals[key])) {
              formVals[key] = undefined
            } else {
              formVals[key] = parseFloat(formVals[key]) || 0
            }
          })
          this.$emit('input', formVals)
          this.$emit('save', formVals, () => {
            this.modalVisible = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.unit-select {
  padding: 10px 20px;
  margin: -10px -20px;
  ::v-deep {
    .el-input {
      width: 100px;
    }
  }
}
</style>
