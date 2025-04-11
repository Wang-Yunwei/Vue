<template>
  <div>
    <med-subtitle title="转运PCI" />
    <el-row :gutter="24">
      <el-col :span="24">
        <med-radio-field
          v-model="data.pciTransferType"
          form-prop="treatment.pciTransferType"
          :disabled="disabled"
          label="转运类型"
          :select-options="dictionary.pciTransferTypeDict"
          :rules="[
            { required: true, message: '请填写转运类型', trigger: 'change' }
          ]"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

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
