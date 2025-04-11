<template>
  <div>
    <med-subtitle title="检查结果" />
    <el-row :gutter="24">
      <el-col :span="6">
        <med-radio-field
          v-model="data.isHospitalinspection"
          form-prop="discharge.isHospitalinspection"
          :disabled="disabled"
          label="是否有住院检查"
          :select-options="dictionary.yesOrNoDict"
          :rules="[
            { required: true, message: '请填写是否有住院检查', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <div v-if="data.isHospitalinspection === '1'">
      <el-row :gutter="24">
        <el-col :span="6">
          <med-radio-field
            v-model="data.isTroponinH72"
            form-prop="discharge.isTroponinH72"
            :disabled="disabled"
            label="72h内肌钙蛋白"
            :select-options="dictionary.yesOrNoDict"
            :rules="[
              { required: true, message: '请填写72h内肌钙蛋白', trigger: 'change' }
            ]"
            @change="onH72Changed"
          />
        </el-col>
        <el-col v-if="data.isTroponinH72 === '1'" :span="6">
          <med-radio-field
            v-model="data.troponinH72.type"
            form-prop="discharge.troponinH72.type"
            :disabled="disabled"
            label="72h内肌钙蛋白"
            :select-options="dictionary.troponinDict"
            :rules="[
              { required: true, message: '请填写72h内肌钙蛋白', trigger: 'change' }
            ]"
            @change="troponinH72Changed"
          />
        </el-col>
        <el-col v-if="data.isTroponinH72 === '1'" :span="6">
          <med-unit-field
            v-if="data.isHospitalinspection === '1' && data.isTroponinH72 === '1'"
            v-model="troponinH72"
            form-prop="discharge.troponinH72.result"
            :disabled="disabled"
            label="肌钙蛋白最高值"
            :unit-options="dictionary.ctnUnitDict"
            :max="999999"
            :scale="3"
            :rules="[
              { required: true, message: '请填写肌钙蛋白最高值', trigger: 'blur' }
            ]"
          />
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="6">
          <med-radio-field
            v-model="data.isBnp"
            form-prop="discharge.isBnp"
            :disabled="disabled"
            label="脑钠肽"
            :select-options="dictionary.yesOrNoDict"
            :rules="[
              { required: true, message: '请填写脑钠肽', trigger: 'change' }
            ]"
            @change="onBnpSelectChanged"
          />
        </el-col>
        <el-col v-if="data.isBnp === '1'" :span="6">
          <med-radio-field
            v-model="data.bnp.type"
            form-prop="discharge.bnp.type"
            :disabled="disabled"
            required
            label="脑钠肽"
            :select-options="dictionary.bnpTypeDict"
            :rules="[
              { required: true, message: '请填写脑钠肽', trigger: 'change' }
            ]"
            @change="bnpChanged"
          />
        </el-col>
        <el-col v-if="data.isHospitalinspection === '1' && data.isBnp === '1'" :span="6">
          <med-number-field
            v-model="data.bnp.result"
            form-prop="discharge.bnp.result"
            :disabled="disabled"
            label="脑钠肽最高值"
            append="pg/ml"
            @change="bnpChanged"
          />
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="6">
          <med-radio-field
            v-model="data.isTc"
            form-prop="discharge.isTc"
            :disabled="disabled"
            label="总胆固醇(TC)"
            :select-options="dictionary.yesOrNoDict"
            :rules="[
              { required: true, message: '请填写总胆固醇(TC)', trigger: 'change' }
            ]"
            @change="tcChanged"
          />
        </el-col>
        <el-col v-if="data.isTc === '1'" :span="6">
          <med-number-field
            v-model="data.tc.result"
            form-prop="discharge.tc.result"
            :disabled="disabled"
            label="总胆固醇(TC)"
            append="mmol/L"
            :rules="[
              { required: true, message: '请填写总胆固醇(TC)', trigger: 'blur' }
            ]"
            @change="tcChanged"
          />
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="6">
          <med-radio-field
            v-model="data.isTg"
            form-prop="discharge.isTg"
            :disabled="disabled"
            label="甘油三酯(TG)"
            :select-options="dictionary.yesOrNoDict"
            :rules="[
              { required: true, message: '请填写甘油三酯(TG)', trigger: 'change' }
            ]"
            @change="tgChanged"
          />
        </el-col>
        <el-col v-if="data.isTg === '1'" :span="6">
          <med-number-field
            v-model="data.tg.result"
            form-prop="discharge.tg.result"
            :disabled="disabled"
            label="甘油三酯(TG)"
            append="mmol/L"
            :rules="[
              { required: true, message: '请填写甘油三酯(TG)', trigger: 'blur' }
            ]"
            @change="tgChanged"
          />
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="6">
          <med-radio-field
            v-model="data.isHdlC"
            form-prop="discharge.isHdlC"
            :disabled="disabled"
            label="高密度脂蛋白(HDL-C)"
            :select-options="dictionary.yesOrNoDict"
            :rules="[
              { required: true, message: '请填写高密度脂蛋白(HDL-C)', trigger: 'change' }
            ]"
            @change="hdlCChanged"
          />
        </el-col>
        <el-col v-if="data.isHdlC === '1'" :span="6">
          <med-number-field
            v-model="data.hdlC.result"
            form-prop="discharge.hdlC.result"
            :disabled="disabled"
            label="高密度脂蛋白(HDL-C)"
            append="mmol/L"
            :rules="[
              { required: true, message: '请填写高密度脂蛋白(HDL-C)', trigger: 'blur' }
            ]"
            @change="hdlCChanged"
          />
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="6">
          <med-radio-field
            v-model="data.isLdlC"
            form-prop="discharge.isLdlC"
            :disabled="disabled"
            label="低密度脂蛋白(LDL-C)"
            :select-options="dictionary.yesOrNoDict"
            :rules="[
              { required: true, message: '请填写低密度脂蛋白(LDL-C)', trigger: 'change' }
            ]"
            @change="ldlCChanged"
          />
        </el-col>
        <el-col v-if="data.isLdlC === '1'" :span="6">
          <med-number-field
            v-model="data.ldlC.result"
            form-prop="discharge.ldlC.result"
            :disabled="disabled"
            label="低密度脂蛋白(LDL-C)"
            append="mmol/L"
            :rules="[
              { required: true, message: '请填写低密度脂蛋白(LDL-C)', trigger: 'blur' }
            ]"
            @change="ldlCChanged"
          />
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="6">
          <med-radio-field
            v-model="data.isUcg"
            form-prop="discharge.isUcg"
            :disabled="disabled"
            label="超声心动图"
            :select-options="dictionary.yesOrNoDict"
            :rules="[
              { required: true, message: '请填写超声心动图', trigger: 'change' }
            ]"
          />
        </el-col>
        <el-col v-if="data.isUcg === '1'" :span="6">
          <med-number-field
            v-model="data.lvef"
            v-int="{max:100, min:0}"
            form-prop="discharge.lvef"
            :disabled="disabled"
            label="LVEF"
            append="%"
          />
        </el-col>
      </el-row>
      <el-row v-if="data.isUcg === '1'" :gutter="24">
        <el-col :span="6">
          <med-radio-field
            v-model="data.isVntricularAneurysm"
            form-prop="discharge.isVntricularAneurysm"
            :disabled="disabled"
            label="室壁瘤"
            :select-options="dictionary.yesOrNoDict"
          />
        </el-col>
        <el-col :span="6">
          <med-radio-field
            v-model="data.isPartVntricular"
            form-prop="discharge.isPartVntricular"
            :disabled="disabled"
            label="局部室壁活动异常"
            :select-options="dictionary.yesOrNoDict"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Test',
  components: {},
  props: {
    data: {
      required: true,
      type: Object
    },
    disabled: {
      required: false,
      type: Boolean
    }
  },
  data() {
    return {
      active: 0,
      registId: 0,
      minDate: new Date(2020, 0, 10),
      maxDate: new Date(2025, 10, 1)
    }
  },
  computed: {
    ...mapGetters(['dictionary']),
    troponinH72: {
      get() {
        return { value: this.data.troponinH72.result, unit: this.data.troponinH72.unit }
      },
      set(val) {
        this.data.troponinH72.registId = this.$route.query.id
        this.data.troponinH72.result = val.value
        this.data.troponinH72.unit = val.unit
        if (this.data.troponinH72.type === 'TnT') {
          this.data.troponinH72.category = '1'
        } else {
          this.data.troponinH72.category = '2'
        }
      }
    }
  },
  created() {},
  methods: {
    onH72Changed() {
      if (this.data.isTroponinH72 === '1') {
        this.data.troponinH72.type = 'TnT'
      }
      this.troponinH72Changed()
    },
    troponinH72Changed() {
      this.data.troponinH72.registId = this.$route.query.id
      this.data.troponinH72.unit = 'ng/mL'
      if (this.data.troponinH72.type === 'TnT') {
        this.data.troponinH72.category = '1'
      } else {
        this.data.troponinH72.category = '2'
      }
    },
    onBnpSelectChanged() {
      if (this.data.isBnp === '1') {
        this.data.bnp.type = 'Bnp'
      }
      this.bnpChanged()
    },
    bnpChanged() {
      this.data.bnp.registId = this.$route.query.id
      if (this.data.bnp.type === 'Bnp') {
        this.data.bnp.category = '3'
      } else {
        this.data.bnp.category = '4'
      }
    },
    tcChanged() {
      this.data.tc.registId = this.$route.query.id
      this.data.tc.category = '5'
    },
    tgChanged() {
      this.data.tg.registId = this.$route.query.id
      this.data.tg.category = '6'
    },
    hdlCChanged() {
      this.data.hdlC.registId = this.$route.query.id
      this.data.hdlC.category = '7'
    },
    ldlCChanged() {
      this.data.ldlC.registId = this.$route.query.id
      this.data.ldlC.category = '8'
    }
  }
}
</script>
<style lang="scss" scoped></style>
