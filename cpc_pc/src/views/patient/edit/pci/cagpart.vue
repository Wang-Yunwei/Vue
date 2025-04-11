<template>
  <div>
    <med-subtitle :title="data.partId + '.' + data.partName" />
    <el-row :gutter="24">
      <el-col :span="12">
        <med-radio-field
          v-model="data.narrowLevel"
          :form-prop="`treatmentPciPartList[${index}].narrowLevel`"
          :disabled="disabled"
          label="狭窄程度"
          :select-options="dictionary.narrowLevelDict"
          :rules="[
            { required: true, message: '请填写狭窄程度', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="12">
        <med-radio-field
          v-model="data.timiLevel"
          :form-prop="`treatmentPciPartList[${index}].timiLevel`"
          :disabled="disabled"
          label="造影时TIMI血流"
          :select-options="dictionary.timiLevelDict"
          :rules="[
            { required: true, message: '请填写造影时TIMI血流', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="4">
        <med-radio-field
          v-model="data.bracketThrombus"
          :form-prop="`treatmentPciPartList[${index}].bracketThrombus`"
          :disabled="disabled"
          label="支架内血栓"
          :select-options="dictionary.yesOrNoDict"
          :rules="[
            { required: true, message: '请填写支架内血栓', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="4">
        <med-radio-field
          v-model="data.branchingSick"
          :form-prop="`treatmentPciPartList[${index}].branchingSick`"
          :disabled="disabled"
          label="是否分叉病变"
          :select-options="dictionary.yesOrNoDict"
          :rules="[
            { required: true, message: '请填写是否分叉病变', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="4">
        <med-radio-field
          v-model="data.isCto"
          :form-prop="`treatmentPciPartList[${index}].isCto`"
          :disabled="disabled"
          label="是否CTO"
          :select-options="dictionary.yesOrNoDict"
          :rules="[
            { required: true, message: '请填写是否CTO', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="4">
        <med-radio-field
          v-model="data.isCalcifiedLesions"
          :form-prop="`treatmentPciPartList[${index}].isCalcifiedLesions`"
          :disabled="disabled"
          label="钙化病变"
          :select-options="dictionary.yesOrNoDict"
          :rules="[
            { required: true, message: '请填写钙化病变', trigger: 'change' }
          ]"
        />
      </el-col>
      <el-col :span="4">
        <med-radio-field
          v-model="data.isCulpritLesion"
          :form-prop="`treatmentPciPartList[${index}].isCulpritLesion`"
          :disabled="disabled"
          label="罪犯病变"
          :select-options="dictionary.yesOrNoDict"
          :rules="[
            { required: true, message: '请填写罪犯病变', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="4">
        <med-radio-field
          v-model="data.isPci"
          :form-prop="`treatmentPciPartList[${index}].isPci`"
          :disabled="disabled"
          label="PCI"
          :select-options="dictionary.yesOrNoDict"
          :rules="[
            { required: true, message: '请填写PCI', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
    <div v-if="data.isPci === '1'">
      <el-row :gutter="24">
        <el-col :span="12">
          <med-checkbox-field
            v-model="data.handleWay"
            display-type="check"
            :form-prop="`treatmentPciPartList[${index}].handleWay`"
            :disabled="disabled"
            label="术中处理"
            :select-options="dictionary.pciHandleWayDict"
            :rules="[
              { required: true, message: '请填写术中处理', trigger: 'change' }
            ]"
          />
        </el-col>
        <el-col :span="6">
          <med-datetime-field
            v-model="data.gwPassageTime"
            :form-prop="`treatmentPciPartList[${index}].gwPassageTime`"
            label="导丝通过时间"
          />
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="6">
          <med-radio-field
            v-model="data.timiLevelPost"
            :form-prop="`treatmentPciPartList[${index}].timiLevelPost`"
            :disabled="disabled"
            label="术后TIMI血流"
            :select-options="dictionary.timiLevelDict"
            :rules="[
              { required: true, message: '请填写术后TIMI血流', trigger: 'change' }
            ]"
          />
        </el-col>
        <el-col :span="6">
          <med-radio-field
            v-model="data.bracketCount"
            :form-prop="`treatmentPciPartList[${index}].bracketCount`"
            :disabled="disabled"
            label="植入支架个数"
            :select-options="dictionary.bracketNumDict"
            :rules="[
              { required: true, message: '请填写植入支架个数', trigger: 'change' }
            ]"
          />
        </el-col>
        <el-col :span="6">
          <med-radio-field
            v-if="data.bracketCount && data.bracketCount !== '1'"
            v-model="data.bracketType"
            :form-prop="`treatmentPciPartList[${index}].bracketType`"
            :disabled="disabled"
            label="支架种类"
            :select-options="dictionary.bracketTypeDict"
            :rules="[
              { required: true, message: '请填写支架种类', trigger: 'change' }
            ]"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'CagPart',
  components: {},
  props: {
    data: {
      required: true,
      type: Object
    },
    disabled: {
      required: false,
      type: Boolean
    },
    index: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      active: 0,
      registId: 0
    }
  },
  computed: {
    ...mapGetters([
      'dictionary'
    ])
  },
  created() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped></style>
