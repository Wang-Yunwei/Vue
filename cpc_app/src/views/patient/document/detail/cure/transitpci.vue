<template>
  <div class="mini">
    <med-radio-button-field
      v-model="data.pciTransferType"
      :disabled="disabled"
      label="转运类型"
      :select-options="pciTransferTypeDic"
      required
      :rules="[{ required: true, message: '请填写转运类型' }]"
      @confirm="onChanged"
    >
    </med-radio-button-field>
  </div>
</template>

<script>
import { dicConstant } from '../../../../../constant/commonConstant'

export default {
  name: 'TransitPci',
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
      pciTransferTypeDic: [],
      codeList: [dicConstant.pciTransferTypeCode]
    }
  },
  computed: {},
  created() {
    this.getDicList()
  },
  methods: {
    getDicList() {
      this.$api.service.getDictionary('').then(result => {
        this.pciTransferTypeDic = result[dicConstant.pciTransferTypeCode]
      })
    },
    onChanged() {
      this.$emit('change', 'treatment')
    }
  }
}
</script>

<style lang="less" scoped></style>
