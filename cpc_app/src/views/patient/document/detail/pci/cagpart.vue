<template>
  <van-cell-group :title="data.partId + '.' + data.partName">
    <med-radio-select-field
      v-model="data.narrowLevel"
      :disabled="disabled"
      required
      :rules="[{ required: true, message: '请填写狭窄程度' }]"
      label="狭窄程度"
      :select-options="dictionary.narrowLevelDict"
      @confirm="onChanged"
    >
    </med-radio-select-field>
    <med-radio-select-field
      v-model="data.timiLevel"
      :disabled="disabled"
      required
      :rules="[{ required: true, message: '请填写造影时TIMI血流' }]"
      label="造影时TIMI血流"
      :select-options="dictionary.timiLevelDict"
      @confirm="onChanged"
    >
    </med-radio-select-field>
    <med-radio-button-field
      v-model="data.bracketThrombus"
      :disabled="disabled"
      label="支架内血栓"
      :select-options="dictionary.yesOrNoDict"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写支架内血栓' }]"
    >
    </med-radio-button-field>
    <med-radio-button-field
      v-model="data.branchingSick"
      :disabled="disabled"
      label="是否分叉病变"
      :select-options="dictionary.yesOrNoDict"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写是否分叉病变' }]"
    >
    </med-radio-button-field>
    <med-radio-button-field
      v-model="data.isCto"
      :disabled="disabled"
      label="是否CTO"
      :select-options="dictionary.yesOrNoDict"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写是否CTO' }]"
    >
    </med-radio-button-field>
    <med-radio-button-field
      v-model="data.isCalcifiedLesions"
      :disabled="disabled"
      label="钙化病变"
      :select-options="dictionary.yesOrNoDict"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写钙化病变' }]"
    >
    </med-radio-button-field>
    <med-radio-button-field
      v-model="data.isCulpritLesion"
      :disabled="disabled"
      label="罪犯病变"
      :select-options="dictionary.yesOrNoDict"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写罪犯病变' }]"
    >
    </med-radio-button-field>
    <med-radio-button-field
      v-model="data.isPci"
      :disabled="disabled"
      label="PCI"
      :select-options="dictionary.yesOrNoDict"
      @confirm="onChanged"
      required
      :rules="[{ required: true, message: '请填写PCI' }]"
    >
    </med-radio-button-field>
    <div v-if="data.isPci === '1'">
      <med-list-select-field
        required
        :rules="[{ required: true, message: '请填写术中处理' }]"
        :disabled="disabled"
        v-model="data.handleWay"
        label="术中处理"
        :select-options="dictionary.pciHandleWayDict"
        @confirm="onChanged"
        :hasOther="false"
        non-code="00"
      >
      </med-list-select-field>
      <med-date-picker
        v-model="data.gwPassageTime"
        label="导丝通过时间"
        :disabled="disabled"
        @confirm="onChanged"
      />
      <med-radio-select-field
        v-model="data.timiLevelPost"
        :disabled="disabled"
        required
        :rules="[{ required: true, message: '请填写术后TIMI血流' }]"
        label="术后TIMI血流"
        :select-options="dictionary.timiLevelDict"
        @confirm="onChanged"
      >
      </med-radio-select-field>
      <med-radio-select-field
        v-model="data.bracketCount"
        :disabled="disabled"
        required
        :rules="[{ required: true, message: '请填写植入支架个数' }]"
        label="植入支架个数"
        :select-options="dictionary.bracketNumDict"
        @confirm="onChanged"
      >
      </med-radio-select-field>
      <med-radio-select-field
        v-model="data.bracketType"
        :disabled="disabled"
        v-if="data.bracketCount && data.bracketCount !== '1'"
        required
        :rules="[{ required: true, message: '请填写支架种类' }]"
        label="支架种类"
        :select-options="dictionary.bracketTypeDict"
        @confirm="onChanged"
      >
      </med-radio-select-field>
    </div>
  </van-cell-group>
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
    }
  },
  data() {
    return {
      active: 0,
      registId: 0
    }
  },
  computed: {
    ...mapGetters(['dictionary'])
  },
  created() {},
  methods: {
    onChanged() {
      this.$emit('change', 'treatmentPciPart')
    }
  }
}
</script>

<style lang="less" scoped></style>
